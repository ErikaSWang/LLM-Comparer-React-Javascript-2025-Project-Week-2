import React from "react";
import { Badge, Button, Card, Spinner } from "react-bootstrap";

type ResultStatus = "loading" | "success" | "empty" | "missing" | "error";

interface ProviderResult {
  status: ResultStatus;
  durationMs?: number;
  httpStatus?: number;
  text?: string;
  message?: string;
  detail?: string;
}

interface Provider {
  id: string;
  name: string;
  model: string;
}

interface ResultsProps {
  results: Record<string, ProviderResult>;
  providers: Provider[];
  responsive: boolean;
  prompt: string;
  onRetry: (provider: Provider) => void;
}

const statuses: Record<ResultStatus, { label: string; color: string }> = {
  loading: { label: "Waiting for response", color: "primary" },
  success: { label: "Response received", color: "success" },
  empty: { label: "Responded without text", color: "warning" },
  missing: { label: "Key missing", color: "secondary" },
  error: { label: "Request failed", color: "danger" },
};

export default function Results({
  results,
  providers,
  responsive,
  prompt,
  onRetry,
}: ResultsProps) {
  const counts = Object.values(results).reduce(
    (totals, result) => {
      totals[result.status] += 1;
      return totals;
    },
    { loading: 0, success: 0, empty: 0, missing: 0, error: 0 },
  );

  return (
    <section
      aria-label="Provider results"
      className={`results-panel ${responsive ? "results-panel-mobile" : ""}`}
    >
      <div className="results-summary mb-3" aria-live="polite">
        <h5 className="mb-2">API response status</h5>
        <p className="mb-1">
          {counts.success} responding · {counts.empty} without text ·{" "}
          {counts.error} failed · {counts.missing} missing keys ·{" "}
          {counts.loading} waiting
        </p>
        <p className="small text-secondary mb-0">
          The same question is sent to each of the five active providers.
          Meta, Mistral, and DeepSeek were disabled in the original program and
          are not being called.
        </p>
        <details className="mt-2">
          <summary>Question sent</summary>
          <p className="response-text mt-2 mb-0">{prompt}</p>
        </details>
      </div>

      <div className="provider-results">
        {providers.map((provider) => {
          const result = results[provider.id];
          const status = statuses[result.status];
          return (
            <Card key={provider.id} data-provider-id={provider.id} className="provider-card p-1 shadow">
              <Card.Body>
                <Card.Title className="title">{provider.name}</Card.Title>
                <Card.Subtitle className="text-secondary subheading mb-3">
                  {provider.model}
                </Card.Subtitle>
                <div className="mb-3" role="status">
                  <Badge bg={status.color} className="status-badge">
                    {result.status === "loading" && (
                      <Spinner size="sm" className="me-1" aria-hidden="true" />
                    )}
                    {status.label}
                  </Badge>
                  {result.durationMs !== undefined && (
                    <div className="small text-secondary mt-1">
                      {(result.durationMs / 1000).toFixed(1)} seconds
                      {result.httpStatus ? ` · HTTP ${result.httpStatus}` : ""}
                    </div>
                  )}
                </div>
                {result.text && (
                  <Card.Text as="div" className="text response-text">
                    {result.text}
                  </Card.Text>
                )}
                {result.message && (
                  <div className="small">
                    <p className="mb-2">{result.message}</p>
                    {result.detail && result.detail !== result.message && (
                      <details>
                        <summary>Error details</summary>
                        <p className="response-text mt-2 mb-0">{result.detail}</p>
                      </details>
                    )}
                  </div>
                )}
                <Button
                  variant="light"
                  size="sm"
                  className="retry-provider mt-3"
                  disabled={result.status === "loading"}
                  onClick={() => onRetry(provider)}
                  aria-label={`Retry ${provider.name} only`}
                >
                  Retry this provider
                </Button>
              </Card.Body>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
