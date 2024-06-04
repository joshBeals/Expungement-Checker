/**
 * Joshua Alele-Beals
 * joshbeals22@gmail.com
 * github.com/joshBeals
 */
import { useState } from "react";
import { Alert, Col, Container, Row } from "react-bootstrap";
import ScenarioMain from "../components/ScenarioMain";
import ScenarioVisual from "../components/ScenarioVisual";

export default function Scenario() {

    return (
        <Container fluid>
        <Row style={{ height: "100vh" }}>
            <Col className="bg-dark p-3" style={{ height: "100%", overflowY: "auto" }}>
                <Alert variant="success">
                    <Alert.Heading>Check Expungement Eligibility</Alert.Heading>
                    <p>
                        Hey dear, you can setup your scenario or conviction history and identify eligible convictions for expungement!
                    </p>
                    <hr />
                    <p className="mb-0">
                        Goodluck!
                    </p>
                </Alert>
                <ScenarioMain />
            </Col>
            <Col className="p-3" style={{ height: "100%", overflowY: "auto", background: "#f1f4fb" }}>
                <div className="p-5">
                    <ScenarioVisual />
                </div>
            </Col>
        </Row>
        </Container>
    );
}
// background: "#f2f7f4"