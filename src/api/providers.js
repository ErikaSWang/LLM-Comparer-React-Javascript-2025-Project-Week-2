import Anthropic from "@anthropic-ai/sdk";
import Perplexity from "@perplexity-ai/perplexity_ai";
import { GoogleGenAI } from "@google/genai";

const DEFAULT_PERSONALITY =
  "You are a kind, approachable, socially-savvy, highly intelligent, highly-educated, and wise AI assistant who provides encouraging/supportive, thoughtful/insightful, and helpful responses.";

export const PROVIDERS = [
  {
    id: "perplexity",
    name: "Perplexity",
    model: "Agent API · fast",
    keyName: "VITE_PERPLEXITY_KEY",
  },
  {
    id: "openai",
    name: "OpenAI",
    model: "gpt-6-luna",
    keyName: "VITE_OPENAI_KEY",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    model: "Claude Haiku 5.5",
    keyName: "VITE_ANTHROPIC_KEY",
  },
  {
    id: "gemini",
    name: "Google",
    model: "Gemini 3.8 Flash",
    keyName: "VITE_GEMINI_KEY",
  },
  {
    id: "x",
    name: "X",
    model: "Grok 4.7",
    keyName: "VITE_X_KEY",
  },
];

export function getResponseText(data) {
  if (typeof data?.output_text === "string") return data.output_text.trim();

  const output = Array.isArray(data?.output) ? data.output : [];
  const steps = Array.isArray(data?.steps)
    ? data.steps.filter((step) => step.type === "model_output")
    : [];
  const responseParts = [...output, ...steps].flatMap((item) =>
    Array.isArray(item?.content) ? item.content : [],
  );
  const responseText = responseParts
    .filter((part) => ["output_text", "text", "refusal"].includes(part?.type))
    .map((part) => part.text ?? part.refusal)
    .filter((part) => typeof part === "string")
    .join("\n")
    .trim();
  if (responseText) return responseText;

  const choiceContent = data?.choices?.[0]?.message?.content;
  if (typeof choiceContent === "string") return choiceContent.trim();
  if (Array.isArray(choiceContent)) {
    return choiceContent
      .filter((part) => typeof part?.text === "string")
      .map((part) => part.text)
      .join("\n")
      .trim();
  }

  return "";
}

function getApiError(data, fallback) {
  const message =
    data?.error?.message ??
    data?.error?.type ??
    data?.message ??
    fallback;
  return String(message);
}

export function readProviderResult(data, text = getResponseText(data)) {
  if (data?.error || ["failed", "cancelled"].includes(data?.status)) {
    throw new Error(getApiError(data, `The provider reported ${data.status}.`));
  }
  const stoppedEarly =
    data?.status === "incomplete" ||
    data?.stop_reason === "max_tokens" ||
    data?.choices?.[0]?.finish_reason === "length";
  return {
    text,
    warning: stoppedEarly
      ? `The provider stopped before completing its answer (${data?.incomplete_details?.reason ?? "output limit reached"}).`
      : undefined,
  };
}

export async function readJsonResponse(response) {
  const body = await response.text();
  try {
    return body ? JSON.parse(body) : {};
  } catch {
    const error = new Error(
      `The provider returned a non-JSON response (HTTP ${response.status}).`,
    );
    error.status = response.status;
    throw error;
  }
}

async function callProvider(provider, apiKey, prompt, personality) {
  const timeoutSignal = AbortSignal.timeout(90_000);

  if (provider.id === "perplexity") {
    const client = new Perplexity({
      apiKey,
      maxRetries: 0,
      timeout: 90_000,
      fetchOptions: { signal: timeoutSignal },
    });
    const response = await client.responses.create({
      effort: "fast",
      input: [
        { type: "message", role: "system", content: personality },
        { type: "message", role: "user", content: prompt },
      ],
    });
    return readProviderResult(response);
  }

  if (provider.id === "anthropic") {
    const client = new Anthropic({
      apiKey,
      dangerouslyAllowBrowser: true,
      timeout: 90_000,
      maxRetries: 0,
    });
    const response = await client.messages.create({
      model: "claude-haiku-5-5",
      max_tokens: 1024,
      system: personality,
      messages: [{ role: "user", content: prompt }],
    });
    const text = (response.content ?? [])
        .filter((part) => part.type === "text")
        .map((part) => part.text)
        .join("\n")
        .trim();
    return readProviderResult(response, text);
  }

  if (provider.id === "gemini") {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.interactions.create(
      {
        model: "gemini-3.8-flash",
        input: prompt,
        system_instruction: personality,
        store: false,
      },
      { timeout_ms: 90_000, signal: timeoutSignal },
    );
    return readProviderResult(response);
  }

  const request =
    provider.id === "openai"
      ? {
          url: "https://api.openai.com/v1/responses",
          body: { model: "gpt-6-luna", instructions: personality, input: prompt },
        }
      : {
          url: "https://api.x.ai/v1/chat/completions",
          body: {
            model: "grok-4.7",
            messages: [
              { role: "system", content: personality },
              { role: "user", content: prompt },
            ],
            stream: false,
            temperature: 0,
          },
        };

  const response = await fetch(request.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(request.body),
    signal: timeoutSignal,
  });
  const data = await readJsonResponse(response);

  if (!response.ok) {
    const error = new Error(getApiError(data, `Request failed (HTTP ${response.status}).`));
    error.status = response.status;
    throw error;
  }

  return readProviderResult(data);
}

export function classifyError(error) {
  const status = error?.status;
  if (status === 401 || status === 403) return "Authentication or access was rejected.";
  if (status === 400 || status === 404 || status === 422) {
    return "The provider rejected the model or request.";
  }
  if (status === 429) return "The provider rate limit or quota was reached.";
  if (status >= 500) return "The provider returned a server error.";
  if (error?.name === "TimeoutError" || error?.name === "AbortError") {
    return "The request timed out after 90 seconds.";
  }
  if (/failed to fetch|networkerror|network request failed|connection error/i.test(error?.message)) {
    return "Network or browser CORS error; the request did not return a readable response.";
  }
  return error?.message || "The request failed before a response could be read.";
}

export async function testProvider(provider, prompt, personality) {
  const apiKey = import.meta.env[provider.keyName];
  if (!apiKey?.trim()) {
    return { status: "missing", message: `Missing ${provider.keyName}.` };
  }

  const startedAt = performance.now();
  let timeout;
  try {
    const result = await Promise.race([
      callProvider(
        provider,
        apiKey,
        prompt,
        personality.trim() || DEFAULT_PERSONALITY,
      ),
      new Promise((_, reject) => {
        timeout = window.setTimeout(() => {
          const error = new Error("The request timed out after 90 seconds.");
          error.name = "TimeoutError";
          reject(error);
        }, 90_000);
      }),
    ]);
    const durationMs = Math.round(performance.now() - startedAt);
    if (!result.text) {
      return {
        status: "empty",
        durationMs,
        message: result.warning || "The request succeeded, but the response contained no text.",
      };
    }
    return { status: "success", durationMs, text: result.text, message: result.warning };
  } catch (error) {
    const durationMs = Math.round(performance.now() - startedAt);
    return {
      status: "error",
      durationMs,
      httpStatus: error?.status,
      message: classifyError(error).replaceAll(apiKey, "[redacted]").slice(0, 400),
      detail: error?.message
        ? String(error.message).replaceAll(apiKey, "[redacted]").slice(0, 400)
        : undefined,
    };
  } finally {
    window.clearTimeout(timeout);
  }
}
