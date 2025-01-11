
import React from 'react';
import {Card} from 'react-bootstrap';
import {Form} from 'react-bootstrap';

const formatResponse = (text: string) => {
  if (!text) return '';
  
  // Handle numbered lists
  if (text.match(/\d+\./)) {
    const segments = text.split(/(?=\d+\.)/);
    const intro = segments[0].trim();
    const items = segments.slice(1, 4); // Limit to 3 items
    
    return (
      <>
        {intro && <>{intro}<br /><br /></>}
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {item.trim().replace(/\*/g, '')}
            {index < items.length - 1 && <><br /><br /></>}
          </React.Fragment>
        ))}
      </>
    );
  }
  
  // Handle regular paragraphs
  const paragraphs = text.split(/\n\n|\.\s+(?=[A-Z])/);
  return paragraphs.map((para, index) => (
    <React.Fragment key={index}>
      {para.trim() + (para.trim().endsWith('.') ? '' : '.')}
      {index < paragraphs.length - 1 && <><br /><br /></>}
    </React.Fragment>
  ));
};

export default function Results({outputPerplexity, outputOpenai, outputAnthropic, outputGemini, outputX, responsive}) {
    console.log(responsive)
  
    return (
      <div className={`d-flex ${responsive === true ? 'flex-column align-items-start' : ''}`}>
        <Form className="p-2"></Form>
        <Card className="width p-1 mb-3 shadow">
          <Card.Body>
            <Card.Title className="title">Perplexity</Card.Title>
            <Card.Subtitle className="text-secondary subheading">Llama-3.1-Sonar</Card.Subtitle>
            <Card.Subtitle className="text-secondary subheading mb-3">($0.20/1M tokens)</Card.Subtitle>
            <Card.Text className="text">{formatResponse(outputPerplexity)}</Card.Text>
          </Card.Body>
        </Card>
        <Card className="width p-1 mb-3 shadow">
          <Card.Body>
            <Card.Title className="title">OpenAI</Card.Title>
            <Card.Subtitle className="text-secondary subheading">Gpt-4o</Card.Subtitle>
            <Card.Subtitle className="text-secondary subheading mb-3">($0.15/1M tokens)</Card.Subtitle>
            <Card.Text className="text">{formatResponse(outputOpenai)}</Card.Text>
          </Card.Body>
        </Card>
        <Card className="width p-1 mb-3 shadow">
          <Card.Body>
            <Card.Title className="title">Anthropic</Card.Title>
            <Card.Subtitle className="text-secondary subheading">Claude-3-Haiku</Card.Subtitle>
            <Card.Subtitle className="text-secondary subheading mb-3">($0.80/MTok)</Card.Subtitle>
            <Card.Text className="text">{formatResponse(outputAnthropic)}</Card.Text>
          </Card.Body>
        </Card>
        <Card className="width p-1 mb-3 shadow">
          <Card.Body>
            <Card.Title className="title">Google</Card.Title>
            <Card.Subtitle className="text-secondary subheading">Gemini-1.5-Pro</Card.Subtitle>
            <Card.Subtitle className="text-secondary subheading mb-3">(free)</Card.Subtitle>
            <Card.Text className="text">{formatResponse(outputGemini)}</Card.Text>
          </Card.Body>
        </Card>
        <Card className="width p-1 mb-3 shadow">
          <Card.Body>
            <Card.Title className="title">X</Card.Title>
            <Card.Subtitle className="text-secondary subheading">Grok-2-1212</Card.Subtitle>
            <Card.Subtitle className="text-secondary subheading mb-3">($2/1M tokens)</Card.Subtitle>
            <Card.Text className="text">{formatResponse(outputX)}</Card.Text>
          </Card.Body>
        </Card>
      </div>
    );
}
