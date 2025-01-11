import React, { useState, useEffect } from "react";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container} from 'react-bootstrap';
import Nav from './components/Nav.tsx';
import Input from './components/Input.tsx';
import Results from './components/Results.tsx';
import Anthropic from '@anthropic-ai/sdk';

function App() {
  const [currentIdentity, setCurrentIdentity] = useState('');
  const [identity, setIdentity] = useState('');
  const [currentInput, setCurrentInput] = useState('');
  const [input, setInput] = useState(null);
  const [outputPerplexity, setOutputPerplexity] = useState(null);
  const [outputOpenai, setOutputOpenai] = useState(null);
  const [outputAnthropic, setOutputAnthropic] = useState(null);
  const [outputX, setOutputX] = useState(null);
  const [outputGemini, setOutputGemini] = useState(null);
  const [responsive, setResponsive] = useState(false);

  const checkResponsive = () => {
    const width = window.innerWidth;
    setResponsive(width <= 991); // iPad and smaller devices
  };

  useEffect(() => {
    checkResponsive(); // Check on initial load
    window.addEventListener('resize', checkResponsive);
    
    return () => {
      window.removeEventListener('resize', checkResponsive);
    };
  }, []);

  function handleChange(event) {
    setCurrentIdentity(event.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (currentIdentity) {
      setIdentity(currentIdentity);
    }
    setInput(currentInput);
  }

  function handleChange2(event) {
    setCurrentInput(event.target.value);
  }

  // PERPLEXITY
  useEffect(() => {
    async function getOutput() {

      const perplexityKey = import.meta.env.VITE_PERPLEXITY_KEY
      // const perplexityKey = process.env.PERPLEXITY_KEY;

      let personality = '';
      if (identity) {
        personality = identity;
      } else {
        personality = "You are a kind, approachable, socially-savvy, highly intelligent, highly-educated, and wise AI assistant who provides encouraging/supportive, thoughtful/insightful, and helpful responses, and never take more than 3 sentences to respond. Do not respond with more than 3 sentences."
      }

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
                content: personality
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
            frequency_penalty: 1,
            max_tokens: 1024
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

      let personality = '';
      if (identity) {
        personality = identity;
      } else {
        personality = "You are a kind, approachable, socially-savvy, highly intelligent, highly-educated, and wise AI assistant who provides encouraging/supportive, thoughtful/insightful, and helpful responses, and never take more than 3 sentences to respond. Do not respond with more than 3 sentences."
      }

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
                content: personality
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
    
    async function getOutput() {
      const anthropicKey = import.meta.env.VITE_ANTHROPIC_KEY
      // const anthropicKey = process.env.ANTHROPIC_KEY;

      const anthropic = new Anthropic({
        apiKey: anthropicKey,
        dangerouslyAllowBrowser: true
      });

      let personality = '';
      if (identity) {
        personality = identity;
      } else {
        personality = "You are a kind, approachable, socially-savvy, highly intelligent, highly-educated, and wise AI assistant who provides encouraging/supportive, thoughtful/insightful, and helpful responses, and never take more than 3 sentences to respond. Do not respond with more than 3 sentences."
      }
      
      try {
        const msg = await anthropic.messages.create({
          model: "claude-3-5-haiku-latest",
          max_tokens: 1024,
          system: personality,
          messages: [{ role: "user", content: input }],
        });
        
        setOutputAnthropic(msg.content[0].text);
        
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

      let personality = '';
      if (identity) {
        personality = identity;
      } else {
        personality = "You are a kind, approachable, socially-savvy, highly intelligent, highly-educated, and wise AI assistant who provides encouraging/supportive, thoughtful/insightful, and helpful responses, and never take more than 3 sentences to respond. Do not respond with more than 3 sentences."
      }

      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{
              parts:[{
                text: `${personality} ${input}`
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

  // GROK
  useEffect(() => {
    async function getOutput() {

      const xKey = import.meta.env.VITE_X_KEY
      // const xKey = process.env.X_KEY;

      let personality = '';
      if (identity) {
        personality = identity;
      } else {
        personality = "You are a kind, approachable, socially-savvy, highly intelligent, highly-educated, and wise AI assistant who provides encouraging/supportive, thoughtful/insightful, and helpful responses, and never take more than 3 sentences to respond. Do not respond with more than 3 sentences."
      }

      try {
        const response = await fetch('https://api.x.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${xKey}`
          },
          body: JSON.stringify({
            model: "grok-2-1212",
            messages: [
              {
                role: "system",
                content: personality
              },
              {
                role: "user",
                content: input,
              }
            ],
            stream: false,
            temperature: 0
          })
        });

        const data = await response.json();
        setOutputX(data.choices[0].message.content);
      } catch (error) {
        console.error("OpenAI API error:", error);
        setOutputX("Error: Unable to generate response at this time.");
      }

    }

    if (input) {
      getOutput();
    }

  }, [input])


  useEffect(() => {
    if (responsive === true && input) {
      document.querySelector('.App').classList.add('scrolled');
    } else {
      document.querySelector('.App').classList.remove('scrolled');
    }
  }, [input, responsive]);


  
  return (
    <div className="App scroll">
      <Container className={`d-flex w-100 outer my-3 ${responsive === true ? 'd-flex flex-column align-items-start' : 'justify-content-start'}`}>
        <div className={`container d-flex flex-column align-items-start bg-opacity-10 shadow-lg col-md-8 col-sm-10 my-3 px-0 ${input && responsive === false ? 'special-width' : 'col-lg-6'}`}>
            <Nav />
    
            <Input
              currentIdentity={currentIdentity}
              handleChange={handleChange}
              currentInput={currentInput}
              handleChange2={handleChange2}
              handleSubmit={handleSubmit}
              input={input}
            />
  
        </div>
        { (outputPerplexity || outputOpenai || outputAnthropic || outputGemini || outputX) ? 
          <Results
            outputPerplexity={outputPerplexity}
            outputOpenai={outputOpenai}
            outputAnthropic={outputAnthropic}
            outputGemini={outputGemini}
            outputX={outputX}
            responsive={responsive}
          />
          : null
        }
      </Container>
      
    </div>
  );
}

export default App;