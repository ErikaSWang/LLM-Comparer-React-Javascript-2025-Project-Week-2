import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import Nav from "./components/Nav.tsx";
import Input from "./components/Input.tsx";
import Results from "./components/Results.tsx";
import { PROVIDERS, testProvider } from "./api/providers.js";

function App() {
  const [currentIdentity, setCurrentIdentity] = useState("");
  const [currentInput, setCurrentInput] = useState("");
  const [submittedPrompt, setSubmittedPrompt] = useState("");
  const [results, setResults] = useState(null);
  const [responsive, setResponsive] = useState(false);
  const latestRequest = useRef(0);

  useEffect(() => {
    const checkResponsive = () => setResponsive(window.innerWidth <= 991);
    checkResponsive();
    window.addEventListener("resize", checkResponsive);
    return () => window.removeEventListener("resize", checkResponsive);
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const prompt = currentInput.trim();
    if (!prompt) return;

    const requestId = ++latestRequest.current;
    setSubmittedPrompt(prompt);
    setResults(
      Object.fromEntries(
        PROVIDERS.map((provider) => [provider.id, { status: "loading" }]),
      ),
    );

    await Promise.all(
      PROVIDERS.map(async (provider) => {
        const result = await testProvider(provider, prompt, currentIdentity);
        if (latestRequest.current === requestId) {
          setResults((current) => ({ ...current, [provider.id]: result }));
        }
      }),
    );

    if (responsive) {
      window.setTimeout(() => {
        window.scrollTo({ top: window.innerHeight * 0.9, behavior: "smooth" });
      }, 200);
    }
  }

  return (
    <div className="App scroll">
      <Container
        className={`d-flex w-100 outer my-3 ${
          responsive
            ? "flex-column align-items-start"
            : "justify-content-start"
        }`}
      >
        <div
          className={`container d-flex flex-column align-items-start bg-opacity-10 shadow-lg col-md-8 col-sm-10 my-3 px-0 ${
            submittedPrompt && !responsive ? "special-width" : "col-lg-6"
          }`}
        >
          <Nav />
          <Input
            currentIdentity={currentIdentity}
            handleChange={(event) => setCurrentIdentity(event.target.value)}
            currentInput={currentInput}
            handleChange2={(event) => setCurrentInput(event.target.value)}
            handleSubmit={handleSubmit}
            submitting={Object.values(results ?? {}).some(
              (result) => result.status === "loading",
            )}
          />
        </div>
        {results && (
          <Results
            results={results}
            providers={PROVIDERS}
            responsive={responsive}
            prompt={submittedPrompt}
          />
        )}
      </Container>
    </div>
  );
}

export default App;
