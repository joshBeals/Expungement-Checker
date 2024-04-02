/**
 * Joshua Alele-Beals
 * joshbeals22@gmail.com
 * github.com/joshBeals
 */
import { Accordion } from "react-bootstrap";
import Conviction from "./alloy/Conviction";

function Setup() {
    return(
        <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
                <Accordion.Header>Offense Categories</Accordion.Header>
                <Accordion.Body>
                    <Conviction />
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
                <Accordion.Header>Waiting Periods</Accordion.Header>
                <Accordion.Body>
                    
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
};

export default Setup;