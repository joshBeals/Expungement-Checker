/**
 * Joshua Alele-Beals
 * joshbeals22@gmail.com
 * github.com/joshBeals
 */
import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";

export default function Home() {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Row>
          <Col>
            <Button className="bg-primary" href="/alloy-generator">Start</Button>
          </Col>
        </Row>
      </Container>
    );
  }
