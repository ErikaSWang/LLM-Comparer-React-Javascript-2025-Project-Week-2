import React, { useState, useEffect } from "react";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container} from 'react-bootstrap';
import Nav from './components/Nav.tsx';
import Input from './components/Input.tsx';
import Results from './components/Results.tsx';

function App() {
  const [currentInput, setCurrentInput] = useState('');
  const [input, setInput] = useState(null);
  const [outputPerplexity, setOutputPerplexity] = useState(null);
  const [outputOpenai, setOutputOpenai] = useState(null);
  const [outputAnthropic, setOutputAnthropic] = useState(null);
  const [outputX, setOutputX] = useState(null);
  const [outputGemini, setOutputGemini] = useState(null);

  function handleChange(event) {
    setCurrentInput(event.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setInput(currentInput);
  }

  // PERPLEXITY
  useEffect(() => {
    async function getOutput() {

      const perplexityKey = import.meta.env.VITE_PERPLEXITY_KEY
      // const perplexityKey = process.env.PERPLEXITY_KEY;

      try {
        const options = {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${perplexityKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: "llama-3.1-sonar-small-128k-online",
            messages: [
              {
                role: "system",
                content: `You are a kind, approachable, socially-savvy, highly intelligent, highly-educated, and wise AI assistant who provides encouraging/supportive, thoughtful/insightful, and helpful responses. Please be concise and limit your responses to no more than 2 sentences!`
              },
              {
                role: "user",
                content: `Input: ${input}`
              }
            ],
            temperature: 0.2,
            top_p: 0.9,
            search_domain_filter: ["perplexity.ai"],
            top_k: 0,
            stream: false,
            presence_penalty: 0,
            frequency_penalty: 1
          })
        };

        const response = await fetch('https://api.perplexity.ai/chat/completions', options);
        const data = await response.json();
        setOutputPerplexity(data.choices[0].message.content || "Unable to generate results at this time.");
      } catch (error) {
        console.error("Perplexity API error:", error);
        throw error;
      }
    }
    
    if (input) {
      getOutput();
    }

  }, [input])

  // OPENAI
  useEffect(() => {
    async function getOutput() {
      
      const openaiKey = import.meta.env.VITE_OPENAI_KEY
      // const openaiKey = process.env.OPENAI_KEY;

      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiKey}`
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: "You are a kind, approachable, socially-savvy, highly intelligent, highly-educated, and wise AI assistant who provides encouraging/supportive, thoughtful/insightful, and helpful responses. Please be concise and limit your responses to no more than 2 sentences!"
              },
              {
                role: "user",
                content: input,
              }
            ]
          })
        });

        const data = await response.json();
        setOutputOpenai(data.choices[0].message.content);
      } catch (error) {
        console.error("OpenAI API error:", error);
        setOutputOpenai("Error: Unable to generate response at this time.");
      }

    }
    
    if (input) {
      getOutput();
    }

  }, [input])

  
  // ANTHROPIC
  useEffect(() => {
    if (!input) {
      return
    }

    const anthropicKey = import.meta.env.VITE_ANTHROPIC_KEY
    // const anthropicKey = process.env.ANTHROPIC_KEY;
    
    async function getOutput() {
      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': anthropicKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 1024,
            messages: [{
              role: "user",
              content: input
            }],
            system: "You are a kind, approachable, socially-savvy, highly intelligent, highly-educated, and wise AI assistant who provides encouraging/supportive, thoughtful/insightful, and helpful responses. Please be concise and limit your responses to no more than 2 sentences!"
          })
        });

        const data = await response.json();
        setOutputAnthropic(data.content[0].text);
        
      } catch (error) {
        console.error("Error fetching from Anthropic:", error);
      }
    }

    if (input) {
      getOutput();
    }
  }, [input]);


  // GEMINI
  useEffect(() => {
    async function getOutput() {

      const geminiKey = import.meta.env.VITE_GEMINI_KEY
      // const geminiKey = process.env.GEMINI_KEY;

      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{
              parts:[{
                text: "You are a kind, approachable, socially-savvy, highly intelligent, highly-educated, and wise AI assistant who provides encouraging/supportive, thoughtful/insightful, and helpful responses. Please be concise and limit your responses to no more than 2 sentences!" + input
              }]
            }]
          })
        });

        const data = await response.json();

        setOutputGemini(data.candidates[0].content.parts[0].text || "Unable to generate results at this time.");
        
      } catch (error) {
        console.error("Gemini API error:", error);
        setOutputGemini("Error: Unable to generate response at this time.");
      }

    }
    
    if (input) {
      getOutput();
    }

  }, [input])

  
  return (
    <div className="App">
      <Container className="container d-flex flex-column align-items-start bg-opacity-10 text-secondary w-80 shadow-lg col-lg-6 col-md-8 col-sm-10 my-3 px-0">

        <Nav />

        <Input
          currentInput={currentInput}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
        { (outputPerplexity || outputOpenai) ? 
          <Results
            outputPerplexity={outputPerplexity}
            outputOpenai={outputOpenai}
            outputAnthropic={outputAnthropic}
            outputGemini={outputGemini}
          />
          : null
        }

      </Container>
    </div>
  );
}

export default App;