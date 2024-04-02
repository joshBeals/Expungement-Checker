/**
 * Joshua Alele-Beals
 * joshbeals22@gmail.com
 * github.com/joshBeals
 */
import { Col, Container, Row } from "react-bootstrap";
import Setup from "../components/Setup";

export default function Generator() {
  return (
    <Container fluid>
      <Row style={{ height: "100vh" }}>
        <Col className="bg-dark p-5">
          <Setup />
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
}
