import React from 'react';
import { Alert, Col, Container, Row } from "react-bootstrap";
import UnderScenarioMain from '../components/underspecified/UnderScenarioMain';

const UnderspecifiedScenario = () => {
    return (
        <>
            <Container fluid>
            <Row style={{ height: "100vh" }}>
                <Col className="bg-dark p-3" style={{ height: "100%", overflowY: "auto" }}>
                    <Alert variant="success">
                        <Alert.Heading>Play Around with Scenarios</Alert.Heading>
                        <p>
                            Hey dear, you can setup your scenario or conviction history and identify eligible convictions for expungement!
                        </p>
                        <hr />
                        <p className="mb-0">
                            Goodluck!
                        </p>
                    </Alert>
                    <UnderScenarioMain />
                </Col>
                <Col className="p-3" style={{ height: "100%", overflowY: "auto", background: "#f1f4fb" }}>
                    <div className="p-5">
                        
                    </div>
                </Col>
            </Row>
            </Container>
        </>
    );
};

export default UnderspecifiedScenario;