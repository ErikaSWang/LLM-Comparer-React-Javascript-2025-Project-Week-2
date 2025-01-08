import React from 'react';
import {Card} from 'react-bootstrap';
import {Form} from 'react-bootstrap';

export default function Feedback({output}) {
    return (
      <>
        <Form>
          <h6><Form.Label className="px-3">Output from AI</Form.Label></h6>
        </Form>
        <Card className="p-3 mx-3 mb-3">
          <Card.Body>
            <Card.Text>{output}
            </Card.Text>
          </Card.Body>
        </Card>
      </>
    );
}