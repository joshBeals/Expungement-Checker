/**
 * Joshua Alele-Beals
 * joshbeals22@gmail.com
 * github.com/joshBeals
 */

import React, { useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { useAppState } from '../store/AppStateContext';

function WaitingPeriodForm() {

    const { addWaitingPeriod, waitingPeriods, dateRanges, convictions } = useAppState();
    const [wait, setWait] = useState('');
    const [conviction, setConviction] = useState('');

    const handleAdd = () => {
        const isPresent = waitingPeriods.some(waitingPeriod => (waitingPeriod.conviction === conviction));
        if(wait != '' && conviction != '' && !isPresent){
            let name = '';
            dateRanges?.map(range => {
                if(range.range == wait){
                    name = `expunged${range.within.charAt(0).toUpperCase() + range.within.slice(1)}`;
                }
            });
            const result = {name: name, wait: wait, conviction: conviction}
            addWaitingPeriod(result);
            setWait('');
            setConviction('');
        }
    };

    const handleWaitChange = (e) => {
        setWait(e.target.value)
    }

    const handleConvictionChange = (e) => {
        setConviction(e.target.value)
    }

    return (
        <Form className='mb-3'>
            <Row className="align-items-center">
                <Col xs={10}>
                    <Row>
                        <Col>
                            <Form.Select value={wait} onChange={handleWaitChange}>
                                <option>Select Waiting Period</option>
                                {dateRanges?.map(range => (
                                    <option key={range.range} value={range.range}>{range.range}</option>
                                ))}
                            </Form.Select>
                        </Col>
                        <Col>
                            <Form.Select value={conviction} onChange={handleConvictionChange}>
                                <option>Select Conviction Type</option>
                                {convictions?.map(conviction => (
                                    <option key={conviction} value={conviction}>{conviction}</option>
                                ))}
                            </Form.Select>
                        </Col>
                    </Row>
                </Col>
                <Col xs={2}>
                    <Button onClick={handleAdd} variant="outline-primary" className="w-100"> Add </Button>
                </Col>
            </Row>
        </Form>
    );
}

export default WaitingPeriodForm;
