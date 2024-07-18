/**
 * Joshua Alele-Beals
 * joshbeals22@gmail.com
 * github.com/joshBeals
 */

import { Trash } from "react-bootstrap-icons";
import { Alert, Button, Table, Row, Col, Form, Card } from "react-bootstrap";
import ScenarioForm from "../forms/ScenarioForm";
import { useAppState } from "../store/AppStateContext";
import ScenarioResult from "./ScenarioResult";
import { useState } from "react";

function ScenarioMain() {
    const { scenarios, deleteScenario, showResult, setShowResult, interpretation, setInterpretation } = useAppState();

    const handleInterpretationChange = (e) => {
        setInterpretation(e.target.value);
    }

    const checkResult = () => {
        if (scenarios.length === 0) {
            alert("You haven't setup any scenario yet!");
        } else {
            if (interpretation == '') {
                alert("Please Select Interpretation!");
            } else {
                setShowResult(true);
            }
        }
    }

    const goBack = () => {
        setInterpretation('');
        setShowResult(false);
    }

    return (
        <div>
            <ScenarioForm />
            <Table
                striped
                bordered
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
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {scenarios?.map((scenario, index) => (
                        <tr key={index}>
                            <td>{scenario?.type}</td>
                            <td>{scenario?.year}</td>
                            <td>{scenario?.assaultive ? 'Yes' : 'No'}</td>
                            <td>{scenario?.tenner ? 'Yes' : 'No'}</td>
                            <td>{scenario?.owi ? 'Yes' : 'No'}</td>
                            <td>
                                <Trash
                                    onClick={() => deleteScenario(index)}
                                    className="text-danger"
                                    style={{ cursor: "pointer" }}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            
            <Card>
                <Card.Body>
                    <Row className="mb-2">
                        <Col xs={12}>
                            <Form.Label>Choose Interpretation</Form.Label>
                            <Form.Select value={interpretation} onChange={handleInterpretationChange} disabled={interpretation !== ""}>
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

export default ScenarioMain;