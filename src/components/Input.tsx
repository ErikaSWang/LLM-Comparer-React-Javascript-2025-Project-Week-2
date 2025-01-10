import React from "react";
import {Form} from 'react-bootstrap';
import {Button} from 'react-bootstrap';

export default function Input({currentIdentity, handleChange, currentInput, handleChange2,  handleSubmit}: any) {
    return (
        <Form className="w-100 p-3" onSubmit={handleSubmit}>
          <Form.Group className="mb-4" controlId="Form.Textarea2">
            <h6><Form.Label>Give Your AI a Personality (optional)</Form.Label></h6>
              <Form.Control className="textBox text-secondary" as="textarea" rows={8} placeholder="Start typing here ..." value={currentIdentity} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-4" controlId="Form.Textarea2">
            <h6><Form.Label>Ask AI a Question</Form.Label></h6>
              <Form.Control className="textBox text-secondary" as="textarea" rows={8} placeholder="Start typing here ..." value={currentInput} onChange={handleChange2} required />
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="light" type="submit">
              Submit 
            </Button>
          </div>
        </Form>
    );
}