import test from "node:test";
import assert from "node:assert/strict";
import {
  classifyError,
  getResponseText,
  readJsonResponse,
  readProviderResult,
} from "../src/api/providers.js";

test("OpenAI text is found after reasoning items, not just at output[0]", () => {
  assert.equal(
    getResponseText({
      output: [
        { type: "reasoning", summary: [] },
        {
          type: "message",
          content: [
            { type: "output_text", text: "First part" },
            { type: "output_text", text: "Second part" },
          ],
        },
      ],
    }),
    "First part\nSecond part",
  );
});

test("SDK output_text is read without calling response.json()", () => {
  assert.equal(getResponseText({ output_text: "SDK answer" }), "SDK answer");
});

test("chat completion text is extracted", () => {
  assert.equal(
    getResponseText({ choices: [{ message: { content: "Grok answer" } }] }),
    "Grok answer",
  );
});

test("Gemini model output steps are supported", () => {
  assert.equal(
    getResponseText({
      steps: [
        { type: "thought", content: [{ type: "text", text: "Not the answer" }] },
        { type: "model_output", content: [{ type: "text", text: "Gemini answer" }] },
      ],
    }),
    "Gemini answer",
  );
});

test("refusal content is displayed rather than silently discarded", () => {
  assert.equal(
    getResponseText({
      output: [{ type: "message", content: [{ type: "refusal", refusal: "I cannot do that." }] }],
    }),
    "I cannot do that.",
  );
});

test("malformed or empty response data does not crash the page", () => {
  for (const data of [null, {}, { output: {} }, { choices: [] }]) {
    assert.equal(getResponseText(data), "");
  }
});

test("full lists and line breaks are preserved", () => {
  const text = "1. One\n2. Two\n3. Three\n4. Four\n5. Five";
  assert.equal(getResponseText({ output_text: text }), text);
});

test("HTTP rejection types are distinguished", () => {
  assert.match(classifyError({ status: 401 }), /Authentication/);
  assert.match(classifyError({ status: 404 }), /model or request/);
  assert.match(classifyError({ status: 429 }), /quota/);
  assert.match(classifyError({ status: 503 }), /server error/);
});

test("network and timeout errors are distinguished", () => {
  assert.match(classifyError(new TypeError("Failed to fetch")), /CORS/);
  assert.match(classifyError({ name: "TimeoutError" }), /timed out/);
});

test("unexpected client errors are not mislabeled as CORS", () => {
  assert.equal(classifyError(new TypeError("Invalid response structure")), "Invalid response structure");
});

test("non-JSON errors retain the HTTP status for diagnosis", async () => {
  const response = new Response("<html>Gateway error</html>", { status: 502 });
  await assert.rejects(readJsonResponse(response), { status: 502 });
});

test("a failed response body is not mistaken for a successful empty answer", () => {
  assert.throws(
    () => readProviderResult({ status: "failed", error: { message: "Generation failed" } }),
    /Generation failed/,
  );
});

test("partial responses keep their text and show the output limit warning", () => {
  const result = readProviderResult({
    output_text: "Partial answer",
    status: "incomplete",
    incomplete_details: { reason: "max_output_tokens" },
  });
  assert.equal(result.text, "Partial answer");
  assert.match(result.warning, /max_output_tokens/);
});
