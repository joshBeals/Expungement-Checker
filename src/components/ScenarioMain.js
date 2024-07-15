/**
 * Joshua Alele-Beals
 * joshbeals22@gmail.com
 * github.com/joshBeals
 */

import { Trash } from "react-bootstrap-icons";
import { Alert, Button, Table } from "react-bootstrap";
import ScenarioForm from "../forms/ScenarioForm";
import { useAppState } from "../store/AppStateContext";
import ScenarioResult from "./ScenarioResult";
import { useState } from "react";

function ScenarioMain() {
    const { scenarios, deleteScenario, showResult, setShowResult } = useAppState();

    const checkResult = () => {
        if (scenarios.length === 0) {
            alert("You haven't setup any scenario yet!");
        } else {
            setShowResult(true);
        }
    }

    const goBack = () => {
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
            {showResult ? (
                <Button variant="primary" onClick={goBack}>
                Go Back
                </Button>
            ):(
                <Button variant="primary" onClick={checkResult}>
                Check Result
                </Button>
            )}
        </div>
    );
};

export default ScenarioMain;