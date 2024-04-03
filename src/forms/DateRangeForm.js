/**
 * Joshua Alele-Beals
 * joshbeals22@gmail.com
 * github.com/joshBeals
 */

import React, { useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { useAppState } from '../store/AppStateContext';
import createObjectFromNumber from '../helpers/createObjectFromNumber';

function DateRangeForm() {

    const { addDateRange, dateRanges } = useAppState();
    const [range, setRange] = useState('');

    const handleAdd = () => {
        const isPresent = dateRanges.some(dateRange => dateRange.range === range.toString());
        if(range > 0 && !isPresent){
            const newRange = createObjectFromNumber(range);
            addDateRange(newRange);
            setRange('');
        }
    };

    return (
        <Form>
            <Row className="align-items-center">
            <Col xs={10}>
                <Form.Control
                    className="mb-3"
                    id="inlineFormInput"
                    placeholder="Pick Date Range"
                    type="number" 
                    min="1"
                    max="10"
                    value={range} 
                    onChange={(e) => setRange(e.target.value)}
                />
            </Col>
            <Col xs={2}>
                <Button onClick={handleAdd} variant="outline-primary" className="mb-3 w-100"> Add </Button>
            </Col>
            </Row>
        </Form>
    );
}

export default DateRangeForm;
