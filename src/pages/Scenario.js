/**
 * Joshua Alele-Beals
 * joshbeals22@gmail.com
 * github.com/joshBeals
 */
import { useState } from "react";
import { Alert, Col, Container, Row } from "react-bootstrap";
import ScenarioForm from "../forms/ScenarioForm";

export default function Scenario() {

    const [show, setShow] = useState(false); 

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
                <ScenarioForm />
            </Col>
            <Col className="p-3" style={{ height: "100%", overflowY: "auto", background: "#f2f7f4" }}>
                
            </Col>
            {show && (
            <Col className="bg-white p-3" style={{ height: "100%", overflowY: "auto" }}>
                
            </Col>
            )}
        </Row>
        </Container>
    );
}
