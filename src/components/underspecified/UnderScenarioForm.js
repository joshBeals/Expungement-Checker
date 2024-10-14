/**
 * Joshua Alele-Beals
 * joshbeals22@gmail.com
 * github.com/joshBeals
 */

import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import generateYearRange from '../../helpers/generateYearRange';
import capitalizeFirst from '../../helpers/capitalizeFirst';
import { useAppState } from '../../store/AppStateContext';

const UnderScenarioForm = () => {

    const [types, setTypes] = useState([]);
    const [convictionType, setConvictionType] = useState('');
    const [state, setState] = useState('');
    const [states, setStates] = useState([]); 
    const currentYear = new Date().getFullYear();
    const years = generateYearRange(1960, currentYear);
    years.sort((a, b) => b - a);
    const [selectedYear, setSelectedYear] = useState('');
    const [startYear, setStartYear] = useState('');
    const [endYear, setEndYear] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [isChecked1, setIsChecked1] = useState(false);
    const [isChecked2, setIsChecked2] = useState(false);
    const [yearType, setYearType] = useState('');
    const [question, setQuestion] = useState('');
    
    const { addUScenario, u_scenarios } = useAppState();

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

    const handleStartYearChange = (event) => {
        setStartYear(event.target.value); 
    };

    const handleEndYearChange = (event) => {
        setEndYear(event.target.value); 
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

    const handleYearTypeChange = (event) => {
        setYearType(event.target.value);
    };

    const handleQuestion = (event) => {
        setQuestion(event.target.value);
    };

    const handleAdd = () => {
        let error = false;
        let errorMessage = "";

        if (yearType == 'range') {
            if (startYear == '' || endYear == '') {
                error = true;
                errorMessage = "Please pick date range!";
            }
            if ((parseInt(endYear, 10) < parseInt(startYear, 10))) {
                error = true;
                errorMessage = "End year has to be greater than Start year";
            }
        }
        
        if (yearType == 'single' && selectedYear == '') {
            error = true;
            errorMessage = "Please pick a year!";
        }

        if (!error) {
            const count = u_scenarios.length;
            const result = { id: count, type: convictionType, yearType: yearType, year: selectedYear, startYear: startYear, endYear, endYear, assaultive: isChecked, tenner: isChecked1, owi: isChecked2, question: question };
            addUScenario(result);
            setConvictionType('');
            setSelectedYear('');
            setEndYear('');
            setStartYear('');
            setYearType('');
            setQuestion('');
            setIsChecked(false);
            setIsChecked1(false);
            setIsChecked2(false);
        } else {
            alert(errorMessage);
        }
    };

    return (
        <>
        <Card className="mb-3">
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
                        <Card>
                            <Card.Header>New Conviction</Card.Header>
                            <Card.Body>
                                <Alert variant="primary">
                                    You can leave certain things unpecified by picking the "Leave Unspecified" option.
                                </Alert>
                                <Row className="">
                                    <Col xs={12}>
                                        <Row>
                                            <Col xs={12}>
                                                <Form.Label className='fw-bolder'>Select Conviction Type</Form.Label>
                                                <Form.Select value={convictionType} onChange={handleConvictionTypeChange}>
                                                    <option value="">Leave Unspecified</option>
                                                    {types?.map((type, index) => (
                                                        <option key={index} value={type}>{type}</option>
                                                    ))}
                                                </Form.Select>
                                            </Col>
                                            {convictionType.toLowerCase() !== '' && (
                                                <Col xs={3} className="mt-2">
                                                    <Form.Check
                                                        type="checkbox"
                                                        label="Assaultive"
                                                        checked={isChecked}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                </Col>
                                            )}
                                            {convictionType.toLowerCase() === 'felony' && (
                                                <Col xs={3} className="mt-2">
                                                    <Form.Check
                                                        type="checkbox"
                                                        label="TenYearFelony"
                                                        checked={isChecked1}
                                                        onChange={handleCheckboxChange1}
                                                    />
                                                </Col>
                                            )}
                                            {convictionType.toLowerCase() === 'misdemeanor' && (
                                                <Col xs={3} className="mt-2">
                                                    <Form.Check
                                                        type="checkbox"
                                                        label="OWI"
                                                        checked={isChecked2}
                                                        onChange={handleCheckboxChange2}
                                                    />
                                                </Col>
                                            )}
                                        </Row>
                                    </Col>
                                    
                                    <Col xs={12} className='mt-3'>
                                        <Form.Label className='fw-bolder'>When did this conviction occur?</Form.Label>
                                        <div className="mb-3">
                                            <Form.Check
                                                inline
                                                label="Single Year"
                                                name="group1"
                                                type="radio"
                                                id="radio1"
                                                value="single"
                                                checked={yearType === 'single'}
                                                onChange={handleYearTypeChange}
                                            />
                                            <Form.Check
                                                inline
                                                label="Date Range"
                                                name="group1"
                                                type="radio"
                                                id="radio2"
                                                value="range"
                                                checked={yearType === 'range'}
                                                onChange={handleYearTypeChange}
                                            />
                                            <Form.Check
                                                inline
                                                label="Leave Unspecified"
                                                name="group1"
                                                type="radio"
                                                id="radio3"
                                                value=""
                                                checked={yearType === ''}
                                                onChange={handleYearTypeChange}
                                            />
                                        </div>
                                        {yearType == 'single' && <Form.Select xs={6} value={selectedYear} onChange={handleYearChange}>
                                            <option value="">Select Year</option>
                                            {years.map(year => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </Form.Select>}
                                            
                                        {yearType == 'range' && <Row>
                                            <Col xs={6}>
                                                <Form.Select value={startYear} onChange={handleStartYearChange}>
                                                    <option value="">Between</option>
                                                    {years.map(year => (
                                                        <option key={year} value={year}>{year}</option>
                                                    ))}
                                                </Form.Select>
                                            </Col>
                                            <Col xs={6}>
                                                <Form.Select value={endYear} onChange={handleEndYearChange}>
                                                    <option value="">And</option>
                                                    {years.map(year => (
                                                        <option key={year} value={year}>{year}</option>
                                                    ))}
                                                </Form.Select>
                                            </Col>
                                        </Row>}
                                        
                                    </Col>

                                    <Col xs={12} className='mt-3'>
                                        <Form.Label className='fw-bolder'>What do you want to know about this conviction?</Form.Label>
                                        <div className="mb-3">
                                            <Form.Check
                                                inline
                                                label="Expungeable?"
                                                name="group2"
                                                type="radio"
                                                id="question1"
                                                value="expungeable"
                                                checked={question === 'expungeable'}
                                                onChange={handleQuestion}
                                            />
                                            <Form.Check
                                                inline
                                                label="Unexpungeable?"
                                                name="group2"
                                                type="radio"
                                                id="question1"
                                                value="unexpungeable"
                                                checked={question === 'unexpungeable'}
                                                onChange={handleQuestion}
                                            />
                                            <Form.Check
                                                inline
                                                label="I'm not sure!"
                                                name="group2"
                                                type="radio"
                                                id="question1"
                                                value=""
                                                checked={question === ''}
                                                onChange={handleQuestion}
                                            />
                                        </div>
                                        
                                    </Col>
                                        
                                    <Col xs={12} className='mt-3'>
                                        <Button onClick={handleAdd} variant="primary" className="w-100"> Add </Button>
                                    </Col>
                                </Row>
                            </Card.Body>    
                        </Card>
                    )}
                </Form>
            </Card.Body>
        </Card>
        </>
    );
};

export default UnderScenarioForm;