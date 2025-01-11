import React from 'react';
import {Card} from 'react-bootstrap';
import {Form} from 'react-bootstrap';

export default function Results({outputPerplexity, outputOpenai, outputAnthropic, outputGemini, outputX}) {
    return (
      <>
        <Form className="p-2"></Form>
        <Card className="width p-1 mb-3">
          <Card.Body>
            <Card.Title className="title">Perplexity</Card.Title>
            <Card.Subtitle className="text-secondary subheading">Llama-3.1-Sonar</Card.Subtitle>
            <Card.Subtitle className="text-secondary subheading mb-3">($0.20/1M tokens)</Card.Subtitle>
            <Card.Text className="text">{outputPerplexity}</Card.Text>
          </Card.Body>
        </Card>
        <Card className="width p-1 mb-3">
          <Card.Body>
            <Card.Title className="title">OpenAI</Card.Title>
            <Card.Subtitle className="text-secondary subheading">Gpt-4o</Card.Subtitle>
            <Card.Subtitle className="text-secondary subheading mb-3">($0.15/1M tokens)</Card.Subtitle>
            <Card.Text className="text">{outputOpenai}</Card.Text>
          </Card.Body>
        </Card>
        <Card className="width p-1 mb-3">
          <Card.Body>
            <Card.Title className="title">Anthropic</Card.Title>
            <Card.Subtitle className="text-secondary subheading">Claude-3-Haiku</Card.Subtitle>
            <Card.Subtitle className="text-secondary subheading mb-3">($0.80/MTok)</Card.Subtitle>
            <Card.Text className="text">{outputAnthropic}</Card.Text>
          </Card.Body>
        </Card>
        <Card className="width p-1 mb-3">
          <Card.Body>
            <Card.Title className="title">Google</Card.Title>
            <Card.Subtitle className="text-secondary subheading">Gemini-1.5-Pro</Card.Subtitle>
            <Card.Subtitle className="text-secondary subheading mb-3">(free)</Card.Subtitle>
            <Card.Text className="text">{outputGemini}</Card.Text>
          </Card.Body>
        </Card>
        <Card className="width p-1 mb-3">
          <Card.Body>
            <Card.Title className="title">X</Card.Title>
            <Card.Subtitle className="text-secondary subheading">Grok-2-1212</Card.Subtitle>
            <Card.Subtitle className="text-secondary subheading mb-3">($2/1M tokens)</Card.Subtitle>
            <Card.Text className="text">{outputX}</Card.Text>
          </Card.Body>
        </Card>
      </>
    );
}