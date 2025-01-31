/**
 * Joshua Alele-Beals
 * joshbeals22@gmail.com
 * github.com/joshBeals
 */

import React, { useState } from 'react';
import { Trash } from "react-bootstrap-icons";
import { Alert, Button, Table, Row, Col, Form, Card } from "react-bootstrap";
import { useAppState } from "../../store/AppStateContext";
import UnderScenarioForm from './UnderScenarioForm';
import capitalizeFirst from '../../helpers/capitalizeFirst';

const UnderScenarioMain = () => {

    const { u_scenarios, deleteUScenario, showUResult, setShowUResult, interpretation, setInterpretation } = useAppState();

    const handleInterpretationChange = (e) => {
        setInterpretation(e.target.value);
    }

    const checkResult = () => {
        if (u_scenarios.length === 0) {
            alert("You haven't setup any scenario yet!");
        } else {
            if (interpretation == '') {
                alert("Please Select Interpretation!");
            } else {
                setShowUResult(true);
            }
        }
    }

    const goBack = () => {
        setInterpretation('');
        setShowUResult(false);
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
                    {showUResult ? (
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
            <Table
                striped
                bordered
                responsive
                className="mt-3"
                style={{ borderRadius: "20px" }}
            >
                <thead>
                    <tr>
                        <th>Conviction Type</th>
                        <th>Year</th>
                        <th>Assaultive</th>
                        <th>TenYearFelony</th>
                        <th>OWI</th>
                        <th>Question</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {u_scenarios?.map((scenario, index) => (
                        <tr key={index}>
                            <td>{scenario?.type ? scenario?.type : 'Not Specified'}</td>
                            <td>{scenario?.yearType == 'single' ? scenario?.year : scenario?.yearType == 'range' ? `${scenario?.startYear} - ${scenario?.endYear}` : 'Not Specified'}</td>
                            <td>{scenario?.assaultive ? 'Yes' : 'No'}</td>
                            <td>{scenario?.tenner ? 'Yes' : 'No'}</td>
                            <td>{scenario?.owi ? 'Yes' : 'No'}</td>
                            <td>{scenario?.question ? `${capitalizeFirst(scenario?.question)}?` : '-'}</td>
                            <td>
                                <Trash
                                    onClick={() => deleteUScenario(index)}
                                    className="text-danger"
                                    style={{ cursor: "pointer" }}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default UnderScenarioMain;