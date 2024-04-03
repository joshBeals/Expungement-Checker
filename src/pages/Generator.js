/**
 * Joshua Alele-Beals
 * joshbeals22@gmail.com
 * github.com/joshBeals
 */
import { Alert, Col, Container, Row } from "react-bootstrap";
import Setup from "../components/Setup";
import Code from "../components/Code";

export default function Generator() {
  return (
    <Container fluid>
      <Row style={{ height: "100vh" }}>
        <Col className="bg-dark p-3" style={{ height: "100%", overflowY: "auto" }}>
            <Alert variant="primary">
                <Alert.Heading>Expungement as Code</Alert.Heading>
                <p>
                    Aww yeah, you successfully read this important alert message. Why do programmers prefer dark mode? 
                </p>
                <hr />
                <p className="mb-0">
                    Because light attracts bugs!
                </p>
            </Alert>
            <Setup />
        </Col>
        <Col className="p-3" style={{ height: "100%", overflowY: "auto" }}>
            <Code />
        </Col>
      </Row>
    </Container>
  );
}
