/**
 * Joshua Alele-Beals
 * joshbeals22@gmail.com
 * github.com/joshBeals
 */

import React, { useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { useAppState } from '../store/AppStateContext';

function ExpungementLimitForm() {

    const [formEntries, setFormEntries] = useState([]);
    const { convictions } = useAppState();

    const handleCheckboxChange = (conviction) => {
        setFormEntries((prevEntries) => {
            const existingEntry = prevEntries.find(entry => entry.conviction === conviction);
            if (existingEntry) {
            return prevEntries.filter(entry => entry.conviction !== conviction);
            } else {
            return [...prevEntries, { conviction, count: 0 }];
            }
        });
    };

    const handleCountChange = (conviction, newCount) => {
        setFormEntries((prevEntries) => prevEntries.map(entry => {
            if (entry.conviction === conviction) {
            return { ...entry, count: newCount };
            }
            return entry;
        }));
    };

    const handleSubmit = () => {
        console.log(formEntries);
    };

    return (
        <Form className='mb-3'>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Expungement Limit</Form.Label>
                <Form.Control type="number" placeholder="" />
            </Form.Group>
            {convictions?.map((conviction, index) => (
                <Row key={index} className='mb-3'>
                    <Col>
                        <Form.Check
                            type="checkbox"
                            label={conviction}
                            onChange={() => handleCheckboxChange(conviction)}
                            checked={formEntries.some(entry => entry.conviction === conviction)}
                        />
                    </Col>
                    <Col>
                        <Form.Control 
                            type="number"
                            min="0"
                            max="8"
                            value={(formEntries.find(entry => entry.conviction === conviction) || {}).count}
                            onChange={(e) => handleCountChange(conviction, e.target.value)}
                            disabled={!formEntries.some(entry => entry.conviction === conviction)}
                        />
                    </Col>
                </Row>
            ))}
            <Button onClick={handleSubmit} variant="outline-primary" className="mt-3 w-100"> Add </Button>
        </Form>
    );
}

export default ExpungementLimitForm;
