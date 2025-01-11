
import React from 'react';
import {Card} from 'react-bootstrap';
import {Form} from 'react-bootstrap';

const formatResponse = (text: string) => {
  if (!text) return '';
  
  // Check if it's a numbered list (contains number followed by period)
  if (text.match(/\d+\./)) {
    const items = text.split(/\d+\./).filter(item => item.trim());
    // Take only numbered items (skip introductory paragraphs)
    const numberedItems = items.slice(-3);
    
    return numberedItems.map((item, index) => (
      <React.Fragment key={index}>
        {`${index + 1}. ${item.trim().replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}`}
        {index < numberedItems.length - 1 && <><br /><br /></>}
      </React.Fragment>
    ));
  }
  
  // Regular response formatting with bold text support
  const sentences = text.match(/[^.!?]+[.!?]+\s*/g) || [text];
  const limitedSentences = sentences.slice(0, 3);
  return limitedSentences.map((sentence, index) => (
    <React.Fragment key={index}>
      {sentence.trim().replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}
      {index < limitedSentences.length - 1 && <><br /><br /></>}
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
            <Card.Text className="text scroll">{formatResponse(outputPerplexity)}</Card.Text>
          </Card.Body>
        </Card>
        <Card className="width p-1 mb-3 shadow">
          <Card.Body>
            <Card.Title className="title">OpenAI</Card.Title>
            <Card.Subtitle className="text-secondary subheading">Gpt-4o</Card.Subtitle>
            <Card.Subtitle className="text-secondary subheading mb-3">($0.15/1M tokens)</Card.Subtitle>
            <Card.Text className="text scroll">{formatResponse(outputOpenai)}</Card.Text>
          </Card.Body>
        </Card>
        <Card className="width p-1 mb-3 shadow">
          <Card.Body>
            <Card.Title className="title">Anthropic</Card.Title>
            <Card.Subtitle className="text-secondary subheading">Claude-3-Haiku</Card.Subtitle>
            <Card.Subtitle className="text-secondary subheading mb-3">($0.80/MTok)</Card.Subtitle>
            <Card.Text className="text scroll">{formatResponse(outputAnthropic)}</Card.Text>
          </Card.Body>
        </Card>
        <Card className="width p-1 mb-3 shadow">
          <Card.Body>
            <Card.Title className="title">Google</Card.Title>
            <Card.Subtitle className="text-secondary subheading">Gemini-1.5-Pro</Card.Subtitle>
            <Card.Subtitle className="text-secondary subheading mb-3">(free)</Card.Subtitle>
            <Card.Text className="text scroll">{formatResponse(outputGemini)}</Card.Text>
          </Card.Body>
        </Card>
        <Card className="width p-1 mb-3 shadow">
          <Card.Body>
            <Card.Title className="title">X</Card.Title>
            <Card.Subtitle className="text-secondary subheading">Grok-2-1212</Card.Subtitle>
            <Card.Subtitle className="text-secondary subheading mb-3">($2/1M tokens)</Card.Subtitle>
            <Card.Text className="text scroll">{formatResponse(outputX)}</Card.Text>
          </Card.Body>
        </Card>
      </div>
    );
}
