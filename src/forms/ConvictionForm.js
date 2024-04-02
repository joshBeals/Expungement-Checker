/**
 * Joshua Alele-Beals
 * joshbeals22@gmail.com
 * github.com/joshBeals
 */

import React, { useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { useAppState } from '../store/AppStateContext';

function ConvictionForm() {

    const { addConviction } = useAppState();
    const [newConviction, setNewConviction] = useState('');

    const handleAdd = () => {
        addConviction(newConviction);
        setNewConviction(''); // Reset input after adding
    };

    return (
        <Form>
            <Row className="align-items-center">
            <Col xs={10}>
                <Form.Control
                    className="mb-3"
                    id="inlineFormInput"
                    placeholder="Enter Conviction Category"
                    type="text" 
                    value={newConviction} 
                    onChange={(e) => setNewConviction(e.target.value)}
                />
            </Col>
            <Col xs={2}>
                <Button onClick={handleAdd} variant="outline-primary" className="mb-3 w-100"> Add </Button>
            </Col>
            </Row>
        </Form>
    );
}

export default ConvictionForm;
