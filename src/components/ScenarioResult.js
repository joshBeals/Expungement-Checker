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
        let expungementConditions = [];
        let forced = [];

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
                if(conviction?.owi) {
                    temp += ` and (c${index + 1} in OWI)`;
                } else {
                    temp += ` and (not c${index + 1} in OWI)`;
                }
            }
            conditions.push(`${temp})`);
            temporalConditions.push(`(c${index + 1}.date = d${conviction?.year})`);

            // Determine temporal relations (excluding unspecified)
            if (index > 0 && data?.length > index) {
                const prevConviction = data[index - 1];
                const currentConviction = data[index];
            
                if (prevConviction && currentConviction) {
                    let forcedTemp = [];
            
                    // Ensure uniqueness without redundant conditions (c2 != c1 is implied by c1 != c2)
                    for (let i = 0; i < index; i++) { // Loop only over previous convictions
                        forcedTemp.push(`(c${index + 1} != c${i + 1})`);
                    }
            
                    if (forcedTemp.length > 0) {
                        forced.push(`(${forcedTemp.join(' and ')})`);
                    }
                }
            }
        });
    
        temporalConditions.push(`exp.date = d2025`);
        // expungementConditions.push(
        //     data
        //         .map(
        //             (_, i) =>
        //                 `(expungeable[c${i + 1}, exp] implies c${i + 1} in exp.con)`
        //         )
        //         .join(" and ")
        // );

        alloyStringWithExpungement += conditions.join(" and \n") + " and \n";
        if (forced.length > 0) alloyStringWithExpungement += forced.join(" and \n") + " and \n";
        alloyStringWithExpungement +=
            temporalConditions.join(" and \n");
        // alloyStringWithExpungement += expungementConditions.join(" and \n");

        return alloyStringWithExpungement + "\n";
    }

    // Sort scenarios by year
    const sortedScenarios = scenarios.slice().sort((a, b) => a.year - b.year);

    const alloyPredicate = generateAlloyPredicate(sortedScenarios);
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
            fetch("http://localhost:8080/api/alloy/evaluate", {
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
      if (violation === "sec1_1aViolations") {
        return "No convictions are eligible for expungement if you have three or more felony convictions. This violation indicates that you have exceeded the allowable number of expungements under the law.";
      }

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

    return (
        <Container fluid>
          <Row style={{ height: "100vh" }}>
            <Col
              className="p-3"
              style={{ height: "100%", overflowY: "auto", background: "#f1f4fb" }}
            >
              <div>
                {result ? (
                  <div className="container">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="Yearly-timeline">
                          {(() => {
                            // ---- LOOKUPS FROM result.data ----
                            const dataRows = Array.isArray(result?.data) ? result.data : [];
      
                            const expungedMap = Object.fromEntries(
                              dataRows.map(d => [d.date, Boolean(d.expunged)])
                            );
      
                            const violationsMap = dataRows.reduce((acc, d) => {
                              acc[d.date] = Array.isArray(d.violations) ? d.violations : [];
                              return acc;
                            }, {});
      
                            // ---- TIMELINE ----
                            return sortedScenarios?.map((scenario, index) => {
                              const yearKey = `d${scenario?.year}$0`;
      
                              const expunged = Object.prototype.hasOwnProperty.call(expungedMap, yearKey)
                                ? expungedMap[yearKey]
                                : Boolean(isExpunged?.(yearKey));
      
                              const scenarioViolations = violationsMap[yearKey] || [];
      
                              return (
                                <div key={index} className="timeline">
                                  <div
                                    className="timeline-content"
                                    style={{ backgroundColor: expunged ? "green" : "grey" }}
                                  >
                                    <h3 className="title">{scenario?.year}</h3>
                                    <p className="description">{scenario?.type}</p>
      
                                    <p className="mt-2">
                                      {(() => {
                                        const labels = [
                                          scenario?.tenner && "TenYearFelony",
                                          scenario?.assaultive && "Assaultive",
                                          scenario?.owi && "OWI",
                                        ].filter(Boolean);
                                        return labels.length > 0 ? `(${labels.join(", ")})` : "";
                                      })()}
                                    </p>
      
                                    {/* Button or note depending on violations/expunged */}
                                    {!expunged &&
                                      (scenarioViolations.length > 0 ? (
                                        <Button
                                          onClick={() => updateModal(scenarioViolations)}
                                          variant="secondary"
                                        >
                                          View Reason
                                        </Button>
                                      ) : (
                                        <p className="text-muted mt-2">No violations recorded</p>
                                      ))}
                                  </div>
                                </div>
                              );
                            });
                          })()}
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
                    <li key={idx}>
                      <span className="fw-bold">
                        {String(violation).replace(/\d+$/, "")}:
                      </span>{" "}
                      {getReason(violation)}
                    </li>
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
