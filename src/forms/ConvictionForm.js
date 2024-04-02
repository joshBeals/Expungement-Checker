import React from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';

function ConvictionForm() {
  return (
    <Form>
      <Row className="align-items-center">
        <Col xs={10}>
          <Form.Control
            className="mb-3"
            id="inlineFormInput"
            placeholder="Enter Conviction Category"
          />
        </Col>
        <Col xs={2}>
          <Button variant="outline-primary" className="mb-3 w-100">
            Add
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default ConvictionForm;
