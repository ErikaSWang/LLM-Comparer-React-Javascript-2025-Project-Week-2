import React from 'react';
import {Card} from 'react-bootstrap';
import {Form} from 'react-bootstrap';

const formatResponse = (text: string) => {
  if (!text) return '';
  
  // Handle dash lists or numbered lists
  if (text.match(/(?:\d+\.|-\s*\*\*)/)) {
    const segments = text.match(/\d+\./) 
      ? text.split(/(?=\d+\.)/)
      : text.split(/(?=-\s*)/);
    const intro = segments[0].trim();
    const items = segments.slice(1, 4); // Limit to 3 items
    
    return (
      <>
        {intro && <>{intro}<br /><br /></>}
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {item.trim().replace(/\*\*/g, '')}
            {index < items.length - 1 && <><br /><br /></>}
          </React.Fragment>
        ))}
      </>
    );
  }
  
  // Handle regular paragraphs and Anthropic's dot lists
  const segments = text.split(/(?:(?<=\.)\s+(?=[A-Z])|\.\s+(?=-))/);
  return segments.map((segment, index) => (
    <React.Fragment key={index}>
      {segment.trim() + (segment.trim().endsWith('.') ? '' : '.')}
      {index < segments.length - 1 && <><br /><br /></>}
    </React.Fragment>
  ));
};

export default function Results({outputPerplexity, outputOpenai, outputAnthropic, outputGemini, outputX, responsive}) {
  
    return (
      <div className={`d-flex ${responsive === true ? 'flex-column align-items-start' : ''}`}>
        <Form className="p-2"></Form>
        <Card className="width p-1 mb-3 shadow">
          <Card.Body>
            <Card.Title className="title">Perplexity</Card.Title>
            <Card.Subtitle className="text-secondary subheading">Sonar</Card.Subtitle>
            <Card.Subtitle className="text-secondary subheading mb-3">($1/1M tokens)</Card.Subtitle>
            <Card.Text className="text">{formatResponse(outputPerplexity)}</Card.Text>
          </Card.Body>
        </Card>
        <Card className="width p-1 mb-3 shadow">
          <Card.Body>
            <Card.Title className="title">OpenAI</Card.Title>
            <Card.Subtitle className="text-secondary subheading">gpt-5.4-nano</Card.Subtitle>
            <Card.Subtitle className="text-secondary subheading mb-3">($0.20/1M tokens)</Card.Subtitle>
            <Card.Text className="text">{formatResponse(outputOpenai)}</Card.Text>
          </Card.Body>
        </Card>
        <Card className="width p-1 mb-3 shadow">
          <Card.Body>
            <Card.Title className="title">Anthropic</Card.Title>
            <Card.Subtitle className="text-secondary subheading">Claude-4.5-Haiku</Card.Subtitle>
            <Card.Subtitle className="text-secondary subheading mb-3">($1/MTok)</Card.Subtitle>
            <Card.Text className="text">{formatResponse(outputAnthropic)}</Card.Text>
          </Card.Body>
        </Card>
        <Card className="width p-1 mb-3 shadow">
          <Card.Body>
            <Card.Title className="title">Google</Card.Title>
            <Card.Subtitle className="text-secondary subheading">gemini-3.5-flash</Card.Subtitle>
            <Card.Subtitle className="text-secondary subheading mb-3">(free)</Card.Subtitle>
            <Card.Text className="text">{formatResponse(outputGemini)}</Card.Text>
          </Card.Body>
        </Card>
        <Card className="width p-1 mb-3 shadow">
          <Card.Body>
            <Card.Title className="title">X</Card.Title>
            <Card.Subtitle className="text-secondary subheading">grok-4.3</Card.Subtitle>
            <Card.Subtitle className="text-secondary subheading mb-3">($1.25/1M tokens)</Card.Subtitle>
            <Card.Text className="text">{formatResponse(outputX)}</Card.Text>
          </Card.Body>
        </Card>
      </div>
    );
}
