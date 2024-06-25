/**
 * Joshua Alele-Beals
 * joshbeals22@gmail.com
 * github.com/joshBeals
 */

import { Database, Trash } from "react-bootstrap-icons";
import { useAppState } from "../store/AppStateContext";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import ScenarioVisual from "./ScenarioVisual";

function ScenarioResult() {
    const { scenarios, deleteScenario } = useAppState();
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
                    temp += ` and (c${index + 1} in OWI)`;
                } else {
                    temp += ` and (not c${index + 1} in OWI)`;
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
        if (yearDifference <= 3) {
            return "withinThree";
        } else if (yearDifference <= 5) {
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
            };

            // Make the API call
            fetch("http://localhost:8080/api/alloy/run", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })
                .then((response) => response.json())
                .then((data) => {
                    setResult(data); // Save the result to the state
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

    return (
        <Container fluid>
            <Row style={{ height: "100vh" }}>
                <Col
                    className="p-3"
                    style={{
                        height: "100%",
                        overflowY: "auto",
                        background: "#474c57",
                    }}
                >
                    <div className="p-5">
                        <ScenarioVisual />
                    </div>
                </Col>
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
                                                (scenario, index) => (
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
                                                                        : "white",
                                                            }}
                                                        >
                                                            <h3 className="title">
                                                                {scenario?.year}
                                                            </h3>
                                                            <p className="description">
                                                                {scenario?.type}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )
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
                                Loading...
                            </div>
                        )}
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default ScenarioResult;
