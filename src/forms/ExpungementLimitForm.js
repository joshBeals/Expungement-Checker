/**
 * Joshua Alele-Beals
 * joshbeals22@gmail.com
 * github.com/joshBeals
 */

import React, { useState } from 'react';
import { Row, Col, Form, Button, Tab, Tabs } from 'react-bootstrap';
import { useAppState } from '../store/AppStateContext';

function ExpungementLimitForm() {

    const { convictions, totalLimit, setTotalLimit, limits, addLimit } = useAppState();
    const [total, setTotal] = useState(totalLimit);
    const [count, setCount] = useState('');
    const [formEntries, setFormEntries] = useState([]);

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

    const handleIndividual = () => {
        if(formEntries.length > 0){
            let temp = 0;
            formEntries.forEach(entry => {
                temp += parseInt(entry.count);
            });
            // if(count <= 0 && formEntries.length == 1){
            //     addLimit({total: count, breakdown: formEntries});
            // }else{
            //     alert("Select just one conviction type");
            //     return;
            // }
            if((parseInt(count) >= temp)){
                addLimit({total: count, breakdown: formEntries});
            }else{
                alert("Your individual counts can't be more than total");
            }
            setCount('');
            setFormEntries([]);
        }
    };

    const handleTotal = () => {
        if(total > 0){
            setTotalLimit(total);
        }
    }

    return (
        <div>
            <Tabs justify defaultActiveKey="total" variant="tabs" className="mb-3">
                <Tab eventKey="total" title="General">
                    <Form className='mb-3'>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Expungement Limit</Form.Label>
                            <Form.Control value={total} onChange={(e) => setTotal(e.target.value)} type="number" />
                        </Form.Group>
                        <Button onClick={handleTotal} variant="outline-primary" className="w-100"> Save </Button>
                    </Form>
                </Tab>
                <Tab eventKey="individual" title="Specific">
                    <Form className='mb-3'>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Total</Form.Label>
                            <Form.Control min="0" value={count} onChange={(e) => setCount(e.target.value)} type="number" />
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
                                        value={(formEntries.find(entry => entry.conviction === conviction) || {}).count || ''}
                                        onChange={(e) => handleCountChange(conviction, e.target.value)}
                                        disabled={!formEntries.some(entry => entry.conviction === conviction)}
                                    />
                                </Col>
                            </Row>
                        ))}
                        <Button onClick={handleIndividual} variant="outline-primary" className="mt-3 w-100"> Add </Button>
                    </Form>
                </Tab>
            </Tabs>
        </div>
    );
}

export default ExpungementLimitForm;
