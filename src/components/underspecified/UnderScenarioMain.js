import React, { useState } from 'react';
import { Alert, Button, Table, Row, Col, Form, Card } from "react-bootstrap";
import { useAppState } from "../../store/AppStateContext";
import UnderScenarioForm from './UnderScenarioForm';

const UnderScenarioMain = () => {
    const { interpretation, setInterpretation } = useState("");
    const showResult = false;

    const handleInterpretationChange = (e) => {
        setInterpretation(e.target.value);
    }

    const checkResult = () => {
        if (interpretation == '') {
            alert("Please Select Interpretation!");
        }
    }

    const goBack = () => {
        setInterpretation('');
    }
    
    return (
        <div>
            <UnderScenarioForm />
            <Card>
                <Card.Body>
                    <Row className="mb-2">
                        <Col xs={12}>
                            <Form.Label>Choose Interpretation</Form.Label>
                            <Form.Select value={interpretation} onChange={handleInterpretationChange}>
                                <option>Select Interpretation</option>
                                <option key="forward" value="forward">Forward Waiting</option>
                                <option key="backward" value="backward">Backward Waiting</option>
                            </Form.Select>
                        </Col>
                    </Row>
                    {showResult ? (
                        <Button variant="primary" onClick={goBack}>
                        Go Back
                        </Button>
                    ):(
                        <Button variant="primary" onClick={checkResult}>
                        Check Result
                        </Button>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
};

export default UnderScenarioMain;