/**
 * Joshua Alele-Beals
 * joshbeals22@gmail.com
 * github.com/joshBeals
 */

import { Database, Trash } from "react-bootstrap-icons";
import { useAppState } from "../store/AppStateContext";
import React, { useEffect, useState } from "react";
import { Col, Container, Row, Button } from "react-bootstrap";
import Spinner from 'react-bootstrap/Spinner';
import ScenarioVisual from "./ScenarioVisual";
import ScenarioMain from "./ScenarioMain";
import Modal from 'react-bootstrap/Modal';

function ScenarioResult() {
    const [show, setShow] = useState(false);
    const [modalData, setModalData] = useState([]);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const { scenarios, deleteScenario, interpretation } = useAppState();
    const [result, setResult] = useState(null);

    console.log(scenarios);

    function generateAlloyPredicate(data) {
        if (data.length < 1) {
            throw new Error("The input data must contain at least one item.");
        }

        const currentYear = new Date().getFullYear();
        const mostRecentYear = Math.max(
            ...data.map((conviction) => parseInt(conviction.year, 10))
        );

        let alloyStringWithExpungement = "one ";
        let conditions = [];
        let temporalConditions = [];
        let hbConditions = [];
        let expungementConditions = [];

        data.forEach((conviction, index) => {
            alloyStringWithExpungement += `c${index + 1}: Conviction`;
            if (index < data.length - 1) {
                alloyStringWithExpungement += ", ";
            } else {
                alloyStringWithExpungement += ", exp: Expungement | \n";
            }
            let temp = `((c${index + 1} in ${conviction.type})`;
            if (conviction?.assaultive) {
                temp += ` and (c${index + 1} in Assaultive)`;
            } else {
                temp += ` and (not c${index + 1} in Assaultive)`;
            }
            if (conviction?.type == "Felony") {
                if(conviction?.tenner) {
                    temp += ` and (c${index + 1} in TenYearFelony)`;
                } else {
                    temp += ` and (not c${index + 1} in TenYearFelony)`;
                }
            }
            if (conviction?.type == "Misdemeanor") {
                if(conviction?.tenner) {
                    temp += ` and (not c${index + 1} in OWI)`;
                } else {
                    temp += ` and (c${index + 1} in OWI)`;
                }
            }
            conditions.push(`${temp})`);
            if (index > 0) {
                const yearDifference =
                    parseInt(data[index].year, 10) -
                    parseInt(data[index - 1].year, 10);
                const temporalRelation =
                    determineTemporalRelation(yearDifference);
                temporalConditions.push(
                    `c${index + 1}.date in c${index}.date.${temporalRelation}`
                );
                hbConditions.push(`happensBefore[c${index}, c${index + 1}]`);
            }
        });

        hbConditions.push(`happensBefore[c${data.length}, exp]`);
        expungementConditions.push(
            data.map(
                (dat, i) =>
                    `exp.date in c${i + 1}.date.${determineTemporalRelation(
                        currentYear - dat.year
                    )}`
            )
            .join(" and \n")
        );
        expungementConditions.push(
            data
                .map(
                    (_, i) =>
                        `(expungeable[c${i + 1}, exp] implies c${i + 1} in exp.con)`
                )
                .join(" and ")
        );

        alloyStringWithExpungement += conditions.join(" and \n") + " and \n";
        alloyStringWithExpungement += hbConditions.join(" and \n") + " and \n";
        alloyStringWithExpungement +=
            temporalConditions.join(" and \n") + " and \n";
        alloyStringWithExpungement += expungementConditions.join(" and \n");

        return alloyStringWithExpungement + "\n";
    }

    function determineTemporalRelation(yearDifference) {
        if (yearDifference < 3) {
            return "withinThree";
        } else if (yearDifference < 5) {
            return "withinFive";
        } else {
            return "beyondFive";
        }
    }

    const alloyPredicate = generateAlloyPredicate(scenarios);
    console.log(alloyPredicate);

    useEffect(() => {
        if (scenarios.length === 0) {
            window.location.href = "/scenario";
        } else {
            // Define the payload
            const payload = {
                predicate: alloyPredicate,
                run: `run userDefinedPredicate for ${
                    scenarios.length + 1
                    } Event, ${scenarios.length + 1} Date`,
                type: interpretation
            };

            // Make the API call
            fetch("http://ec2-3-131-162-195.us-east-2.compute.amazonaws.com:8080/api/alloy/run", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })
                .then((response) => response.json())
                .then((data) => {
                    setResult(data);
                    console.log("Success:", data);
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        }
    }, [scenarios]);

    // Sort scenarios by year
    const sortedScenarios = scenarios.slice().sort((a, b) => a.year - b.year);

    // Function to check if a scenario is expunged
    const isExpunged = (scenarioDate) => {
        if (!result || !result.expungements) {
            return false;
        }
        return Object.values(result.expungements).includes(scenarioDate);
    };

    const updateModal = (data) => {
        setModalData(data);
        handleShow();
    }
    
    const getReason = (violation) => {
        if (violation === "sec1_1bViolations") {
            return "No more than two assaultive felony convictions are eligible for expungement. This violation indicates that you have exceeded the allowable number of assaultive felony convictions for expungement under the law.";
        }
        
        if (violation === "sec1_1cViolations") {
            return "Only one felony with a 10-year waiting period is eligible for expungement. This violation suggests that you have attempted to expunge more than one such felony, which exceeds the permissible limit.";
        }
        
        if (violation === "sec1d_2Violations") {
            return "Only one Operating While Intoxicated (OWI) conviction is eligible for expungement. This violation indicates that you have more than one OWI conviction, surpassing the limit set by the law for expungement.";
        }
        

        if (violation === "sec1dTimingViolations") {
            return "A new conviction occurred within the required waiting period. For misdemeanors, the mandatory waiting period is 3 years, while for felonies, it is 5 years. This timing violation indicates that the time elapsed between the convictions was insufficient to meet the legal expungement criteria.";
        }
        

        if (violation === "backwardWaitingViolations") {
            return "This expungement attempt violates the backward waiting period rule. A prior conviction occurred within the mandatory waiting period of this conviction, making it ineligible for expungement at this time. The required time gap between the conviction and any previous convictions must be observed to proceed with expungement. (3 years for Misdemeanors and 5 years for Felonies).";
        }
        
        if (violation === "forwardWaitingViolations") {
            return "This conviction violates the forward waiting period rule. A subsequent conviction occurred within the mandatory waiting period following this conviction. To qualify for expungement, no new convictions should occur within the specified waiting period after this conviction. (3 years for Misdemeanors and 5 years for Felonies).";
        }
        
    }

    return (
        <Container fluid>
            <Row style={{ height: "100vh" }}>
                <Col
                    className="p-3"
                    style={{
                        height: "100%",
                        overflowY: "auto",
                        background: "#f1f4fb",
                    }}
                >
                    <div>
                        {result ? (
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="Yearly-timeline">
                                            {sortedScenarios?.map(
                                                (scenario, index) => {
                                                    // Collect violations related to this scenario
                                                    const scenarioViolations = Object.entries(result.violations)
                                                    .flatMap(([violationType, violations]) =>
                                                        violations
                                                            .filter(violation => 
                                                                Object.values(violation).includes(scenario.id)
                                                            )
                                                            .map(() => violationType)
                                                    );

                                                    return(
                                                        <div
                                                            key={index}
                                                            className="timeline"
                                                        >
                                                            <div
                                                                className="timeline-content"
                                                                style={{
                                                                    backgroundColor:
                                                                        isExpunged(
                                                                            scenario.id
                                                                        )
                                                                            ? "green"
                                                                            : "grey",
                                                                }}
                                                            >
                                                                <h3 className="title">
                                                                    {scenario?.year}
                                                                </h3>
                                                                <p className="description">
                                                                    {scenario?.type}
                                                                </p>
                                                                <p className="mt-2">
                                                                    {(() => {
                                                                        const labels = [
                                                                            scenario?.tenner && "TenYearFelony",
                                                                            scenario?.assaultive && "Assaultive",
                                                                            scenario?.owi && "OWI"
                                                                        ].filter(Boolean);

                                                                        return labels.length > 0 ? `(${labels.join(", ")})` : '';
                                                                    })()}
                                                                </p>
                                                                {/* Display Violations */}
                                                                {scenarioViolations.length > 0 && (
                                                                    <Button onClick={() => updateModal(scenarioViolations)} variant="secondary"> View Reason </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div
                                style={{
                                    height: "100%",
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Spinner animation="border" variant="primary" />
                            </div>
                        )}
                    </div>
                </Col>
            </Row>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Violation Reasons</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalData.length > 0 ? (
                        <ul>
                            {modalData.map((violation, idx) => (
                                <li key={idx}><span className="fw-bold">{violation.slice(0, -1)}:</span> {getReason(violation)}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No violations found.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default ScenarioResult;
