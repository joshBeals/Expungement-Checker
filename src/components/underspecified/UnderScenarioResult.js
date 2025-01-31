/**
 * Joshua Alele-Beals
 * joshbeals22@gmail.com
 * github.com/joshBeals
 */

import React, { useState, useEffect } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { useAppState } from '../../store/AppStateContext';
import { Box, Box2 } from "react-bootstrap-icons";
import { Col, Container, Row, Button, Alert, Badge } from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';
import generateAlloyPredicate from '../../helpers/generateAlloy';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
  } from '@dnd-kit/core';
  import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
  } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import capitalizeFirst from '../../helpers/capitalizeFirst';
  

function SortableItem({ id, content, draggable }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...(draggable ? listeners : {})}>
            {content}
        </div>
    );
}

const UnderScenarioResult = () => {
    const [show, setShow] = useState(false);
    const [modalData, setModalData] = useState([]);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const { u_scenarios, interpretation } = useAppState();
    const [result, setResult] = useState(null);

    console.log(u_scenarios);

    const alloyPredicate = generateAlloyPredicate(u_scenarios);
    console.log(alloyPredicate);

    useEffect(() => {
        if (u_scenarios.length === 0) {
            window.location.href = "/underspecified-scenario";
        } else {
            // Define the payload
            const payload = {
                predicate: alloyPredicate,
                run: `run userDefinedPredicate for ${
                    u_scenarios.length + 1
                    } Event, ${u_scenarios.length + 1} Date`,
                type: interpretation
            };

            // Make the API call
            fetch("http://localhost:8080/api/alloy/evaluate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })
            .then((response) => response.json())
            .then((data) => {
                // Extract and sort the keys of the 'data' object
                const sortedArray = Object.keys(data.data)
                    .sort((a, b) => {
                        // Extract the numeric part of the keys for sorting
                        const keyA = parseInt(a.replace('Date$', ''), 10);
                        const keyB = parseInt(b.replace('Date$', ''), 10);
                        return keyA - keyB;
                    })
                    .map((key) => {
                        // Transform each key-value pair into an object with the key as 'date'
                        return { date: key, ...data.data[key] };
                    });
            
                // Set the sorted array to state
                setResult(sortedArray);
            
                console.log("Success:", sortedArray);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
        }
    }, [u_scenarios]);

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
            return "A new conviction or expungement event occurred within the required waiting period. For misdemeanors, the mandatory waiting period is 3 years, while for felonies, it is 5 years. This timing violation indicates that the time elapsed between the convictions was insufficient to meet the legal expungement criteria.";
        }
        

        if (violation === "backwardWaitingViolations") {
            return "This expungement attempt violates the backward waiting period rule. A prior conviction occurred within the mandatory waiting period of this conviction, making it ineligible for expungement at this time. The required time gap between the conviction and any previous convictions must be observed to proceed with expungement. (3 years for Misdemeanors and 5 years for Felonies).";
        }
        
        if (violation === "forwardWaitingViolations") {
            return "This conviction violates the forward waiting period rule. A subsequent conviction occurred within the mandatory waiting period following this conviction. To qualify for expungement, no new convictions should occur within the specified waiting period after this conviction. (3 years for Misdemeanors and 5 years for Felonies).";
        }
        
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const getScenarioObj = (id) => {
        return u_scenarios?.find((scenario, idx) => idx == id?.split('c')[1] - 1);
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
                            <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            >
                                <SortableContext
                                    items={result?.map((item, idx) => idx)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <div style={{ listStyleType: 'none', padding: 0 }}>
                                    {result?.map((item, idx) => (
                                        <SortableItem
                                            key={idx}
                                            id={idx}
                                            draggable={false}
                                            content={(
                                                <>
                                                    <Alert
                                                        variant={item?.expunged ? "success" : "light"}
                                                        className="mb-4 p-3"
                                                    >
                                                        <Alert.Heading>
                                                            <Row>
                                                                <Col>{capitalizeFirst(item?.event.split("$")[0])}</Col>
                                                                <Col className="text-end">{getScenarioObj(item?.id) ? getScenarioObj(item?.id)?.year || `${getScenarioObj(item?.id).startYear} - ${getScenarioObj(item?.id).endYear}` : 'Date'}</Col>
                                                            </Row>
                                                        </Alert.Heading>
                                                        <p>Diff: {item?.timeDifference}</p>
                                                        <hr/>
                                                        <div className="mb-0">
                                                            {(() => {
                                                                const labels = [
                                                                    item?.tenYearFelony && "TenYearFelony",
                                                                    item?.assaultive && "Assaultive",
                                                                    item?.owi && "OWI"
                                                                ].filter(Boolean);
                    
                                                                return (
                                                                    <Row>
                                                                        <Col>
                                                                            {labels?.map((label, index) => (
                                                                            <Badge bg="secondary" style={{marginRight: '5px'}} key={index}>{label}</Badge>
                                                                            ))}
                                                                        </Col>
                                                                        {/* <Col className="text-end">
                                                                            <Box2
                                                                                className="text-primary"
                                                                                style={{ cursor: "pointer" }}
                                                                            />
                                                                        </Col> */}
                                                                    </Row>
                                                                );
                                                            })()}
                                                        </div>
                                                    </Alert>
                                                </>
                                            )}
                                        />
                                    ))}
                                    </div>
                                </SortableContext>
                            </DndContext>
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
};

export default UnderScenarioResult;