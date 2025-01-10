import React from 'react';
import {Card} from 'react-bootstrap';
import {Form} from 'react-bootstrap';

export default function Results({outputPerplexity, outputOpenai, outputAnthropic, outputGemini, outputX}) {
    return (
      <>
        <Form>
          <h6><Form.Label className="px-3">Output from AI</Form.Label></h6>
        </Form>
        <Card className="p-1 mb-3">
          <Card.Body>
            <Card.Title className="title">Perplexity Llama-3.1-Sonar</Card.Title>
            <Card.Text className="text">{outputPerplexity}</Card.Text>
          </Card.Body>
        </Card>
        <Card className="p-1 mb-3">
          <Card.Body>
            <Card.Title className="title">OpenAi Gpt-4o</Card.Title>
            <Card.Text className="text">{outputOpenai}</Card.Text>
          </Card.Body>
        </Card>
        <Card className="p-1 mb-3">
          <Card.Body>
            <Card.Title className="title">Anthropic Claude-3-Haiku</Card.Title>
            <Card.Text className="text">{outputAnthropic}</Card.Text>
          </Card.Body>
        </Card>
        <Card className="p-1 mb-3">
          <Card.Body>
            <Card.Title className="title">Google Gemini-1.5-Flash</Card.Title>
            <Card.Text className="text">{outputGemini}</Card.Text>
          </Card.Body>
        </Card>
        <Card className="p-1 mb-3">
          <Card.Body>
            <Card.Title className="title">X Grok-2-1212</Card.Title>
            <Card.Text className="text">{outputX}</Card.Text>
          </Card.Body>
        </Card>
      </>
    );
}