/**
 * Joshua Alele-Beals
 * joshbeals22@gmail.com
 * github.com/joshBeals
 */

import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useAppState } from '../store/AppStateContext';
import capitalizeFirst from '../helpers/capitalizeFirst';
import generateYearRange from '../helpers/generateYearRange';

function ScenarioForm() {

    const { addScenario, scenarios } = useAppState();

    const [types, setTypes] = useState([]);
    const [convictionType, setConvictionType] = useState('');
    const [state, setState] = useState('');
    const [states, setStates] = useState([]); 
    const currentYear = new Date().getFullYear();
    const years = generateYearRange(1960, currentYear);
    const [selectedYear, setSelectedYear] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [isChecked1, setIsChecked1] = useState(false);
    const [isChecked2, setIsChecked2] = useState(false);

    useEffect(() => {
        fetch('./law.json')
        .then(response => response.json())
        .then(data => {
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

    const handleConvictionTypeChange = (event) => {
        setConvictionType(event.target.value);  
    };

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value); 
    };

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    const handleCheckboxChange1 = (event) => {
        setIsChecked1(event.target.checked);
    };

    const handleCheckboxChange2 = (event) => {
        setIsChecked2(event.target.checked);
    };

    const handleAdd = () => {
        if (convictionType != '' && selectedYear != '') {
            const count = scenarios.length;
            const id = `Date$${count}`;
            const result = { id: id, type: convictionType, year: selectedYear, assaultive: isChecked, tenner: isChecked1, owi: isChecked2 };
            addScenario(result);
            setConvictionType('');
            setSelectedYear('');
            setIsChecked(false);
            setIsChecked1(false);
            setIsChecked2(false);
        }
    };

    return (
        <Card>
            <Card.Header>Create Scenario</Card.Header>
            <Card.Body>
                <Form className='mb-3'>
                    <Row className='mb-3'>
                        <Col xs={12}>
                            <Form.Label>Choose State</Form.Label>
                            <Form.Select value={state} onChange={handleStateChange} disabled={state !== ""}>
                                <option>Select State</option>
                                {states?.map(state => (
                                    <option key={state} value={state}>{capitalizeFirst(state)}</option>
                                ))}
                            </Form.Select>
                        </Col>
                    </Row>
                    {state != '' && (
                        <Row className="align-items-center">
                            <Col xs={10}>
                                <Row>
                                    <Col xs={3}>
                                        <Form.Select value={convictionType} onChange={handleConvictionTypeChange}>
                                            <option value="">Select Conviction Type</option>
                                            {types?.map((type, index) => (
                                                <option key={index} value={type}>{type}</option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                    <Col xs={3}>
                                        <Form.Select value={selectedYear} onChange={handleYearChange}>
                                            <option value="">Select Year</option>
                                            {years.map(year => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                    <Col xs={2}>
                                        <Form.Check
                                            type="checkbox"
                                            label="Assaultive"
                                            onChange={handleCheckboxChange}
                                        />
                                    </Col>
                                    <Col xs={2}>
                                        <Form.Check
                                            type="checkbox"
                                            label="TenYearFelony"
                                            onChange={handleCheckboxChange1}
                                        />
                                    </Col>
                                    <Col xs={2}>
                                        <Form.Check
                                            type="checkbox"
                                            label="OWI"
                                            onChange={handleCheckboxChange2}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={2}>
                                <Button onClick={handleAdd} variant="outline-primary" className="w-100"> Add </Button>
                            </Col>
                        </Row>
                    )}
                </Form>
            </Card.Body>
        </Card>
    );
}

export default ScenarioForm;
