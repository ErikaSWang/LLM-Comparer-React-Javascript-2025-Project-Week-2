import React from "react";
import {Form} from 'react-bootstrap';
import {Button} from 'react-bootstrap';

export default function Input({currentIdentity, handleChange, currentInput, handleChange2, handleSubmit, submitting}: any) {
    return (
        <Form className="w-100 p-3" onSubmit={handleSubmit}>
          <Form.Group className="mb-4" controlId="personality-input">
            <h6><Form.Label className={`secondary-title ${submitting ? 'text-after' : ''}`}>Give Your AI a Personality (optional)</Form.Label></h6>
              <Form.Control className={`textBox ${submitting ? 'after text-secondary' : 'before'}`} as="textarea" rows={5} placeholder={`Examples:
    • You are a great listener
    • You pride yourself on being honest
    • You are an expert in social trends
              `} value={currentIdentity} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-4" controlId="question-input">
            <h6><Form.Label className={`secondary-title ${submitting ? 'text-after' : ''}`}>Ask AI a Question</Form.Label></h6>
              <Form.Control className={`textBox ${submitting ? 'after text-secondary' : 'before'}`} as="textarea" rows={9} placeholder={`Examples:
    • What books will change my view the world?
    • Why has AI only been game-changing for coding?
    • What's the best AI API?
    • Is there less empathy in the world today?
    • Why can't I focus? What does that say about me?
                        `} value={currentInput} onChange={handleChange2} required />
          </Form.Group>
          <div className="d-flex justify-content-between">
            <p className="fs-6 footer">Last edited: November 4, 2026</p>
            <Button variant="light" type="submit" disabled={submitting}>
              {submitting ? 'Waiting for responses…' : 'Ask Models'}
            </Button>
          </div>
        </Form>
    );
}