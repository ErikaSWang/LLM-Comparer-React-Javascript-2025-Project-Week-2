import React from 'react';
import {Card} from 'react-bootstrap';
import {Form} from 'react-bootstrap';

export default function Results({outputPerplexity, outputOpenai, outputAnthropic, outputGemini}) {
    return (
      <>
        <Form>
          <h6><Form.Label className="px-3">Output from AI</Form.Label></h6>
        </Form>
        <Card className="p-3 mx-3 mb-3">
          <Card.Body>
            <Card.Title>Perplexity Llama-3.1-Sonar</Card.Title>
            <Card.Text>{outputPerplexity}</Card.Text>
          </Card.Body>
        </Card>
        <Card className="p-3 mx-3 mb-3">
          <Card.Body>
            <Card.Title>OpenAi Gpt-4o</Card.Title>
            <Card.Text>{outputOpenai}</Card.Text>
          </Card.Body>
        </Card>
        <Card className="p-3 mx-3 mb-3">
          <Card.Body>
            <Card.Title>Anthropic Claude-3-Haiku</Card.Title>
            <Card.Text>{outputAnthropic}</Card.Text>
          </Card.Body>
        </Card>
        <Card className="p-3 mx-3 mb-3">
          <Card.Body>
            <Card.Title>Google Gemini-1.5-Flash</Card.Title>
            <Card.Text>{outputGemini}</Card.Text>
          </Card.Body>
        </Card>
      </>
    );
}