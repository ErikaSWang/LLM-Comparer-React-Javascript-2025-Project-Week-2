import React, { useState, useEffect } from "react";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import OpenAI from "openai";
import {Container} from 'react-bootstrap';
import Nav from './components/Nav.tsx';
import Input from './components/Input.tsx';
import Results from './components/Results.tsx';

function App() {
  const [currentInput, setCurrentInput] = useState('');
  const [input, setInput] = useState(null);
  const [outputPerplexity, setOutputPerplexity] = useState(null);
  const [outputOpenai, setOutputOpenai] = useState(null);

  function handleChange(event) {
    setCurrentInput(event.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setInput(currentInput);
  }

  useEffect(() => {
    async function getOutput() {
      if (!input) {
        return
      }

      const perplexityKey = import.meta.env.VITE_PERPLEXITY_KEY

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
                content: `You are a kind, approachable, socially-savvy, highly-educated, and gifted AI assistant who prides themselves on providing wise, thoughtful/insightful, and helpful responses in a maximum of 2 sentences. Please be concise and limit your responses to no more than 2 sentences!`
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
    getOutput();
    
  }, [input])

  useEffect(() => {
    async function getOutput() {
      if (!input) {
        return
      }

      try {
        const openai = new OpenAI({
          apiKey: import.meta.env.VITE_OPENAI_KEY,
          dangerouslyAllowBrowser: true
        });
        
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a kind, approachable, socially-savvy, highly-educated, and gifted AI assistant who prides themselves on providing wise, thoughtful/insightful, and helpful responses in a maximum of 2 sentences. Please be concise and limit your responses to no more than 2 sentences!"
            },
            {
              role: "user",
              content: input,
            }
          ]
        });
        
        setOutputOpenai(completion.choices[0].message.content);
      } catch (error) {
        console.error("OpenAI API error:", error);
        setOutputOpenai("Error: Unable to generate response at this time.");
      }
      
    }
    getOutput();

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
          />
          : null
        }
        
      </Container>
    </div>
  );
}

export default App;
