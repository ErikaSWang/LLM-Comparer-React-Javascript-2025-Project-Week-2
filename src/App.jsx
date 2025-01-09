// ANTHROPIC
  useEffect(() => {
    async function getOutput() {
      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 1024,
            messages: [{
              role: 'user',
              content: "You are a kind, approachable, highly-educated AI assistant who provides wise and helpful responses in maximum 2 sentences. " + input
            }]
          })
        });

        const data = await response.json();
        setOutputAnthropic(data.content[0].text);
      } catch (error) {
        console.error("Error fetching from Anthropic:", error);
        // Handle errors appropriately, e.g., set an error state
      }
    }

    if (input) {
      getOutput();
    }
  }, [input]);