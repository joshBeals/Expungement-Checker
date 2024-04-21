/**
 * Joshua Alele-Beals
 * joshbeals22@gmail.com
 * github.com/joshBeals
 */

import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useAppState } from '../store/AppStateContext';
import capitalizeFirst from '../helpers/capitalizeFirst';

function ScenarioForm() {

    const [wait, setWait] = useState('');
    const [types, setTypes] = useState([]);
    const [state, setState] = useState('');
    const [states, setStates] = useState([]); 

    useEffect(() => {
        fetch('./law.json')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            setStates(Object.keys(data));
            if (data && state && data[state]) {
                setTypes(data[state]);
            }
        })
        .catch(error => console.error('Error loading the data', error));
    }, [state]); 

    const handleStateChange = (e) => {
        setState(e.target.value)
    }

    return (
        <Card>
            <Card.Header>Create Scenario</Card.Header>
            <Card.Body>
                <Form className='mb-3'>
                    <Row className="align-items-center">
                        <Col className='mb-3' xs={12}>
                            <Form.Label>Choose State</Form.Label>
                            <Form.Select value={state} onChange={handleStateChange}>
                                <option>Select State</option>
                                {states?.map(state => (
                                    <option key={state} value={state}>{capitalizeFirst(state)}</option>
                                ))}
                            </Form.Select>
                        </Col>
                        <Col xs={12}>
                            <Row>
                                <Col>
                                    <Form.Select>
                                        <option>Select Conviction Type</option>
                                    </Form.Select>
                                </Col>
                                <Col>
                                    <Form.Select>
                                        <option>Select Year</option>
                                    </Form.Select>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={2}>
                            <Button variant="outline-primary" className="w-100"> Add </Button>
                        </Col>
                    </Row>
                </Form>
            </Card.Body>
        </Card>
    );
}

export default ScenarioForm;
