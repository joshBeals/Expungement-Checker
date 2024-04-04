/**
 * Joshua Alele-Beals
 * joshbeals22@gmail.com
 * github.com/joshBeals
 */

import { Trash } from "react-bootstrap-icons";
import { useAppState } from "../../store/AppStateContext";
import { Alert, Col, Row, Table } from "react-bootstrap";
import ExpungementLimitForm from "../../forms/ExpungementLimitForm";

function ExpungementLimit() {

    return(
        <div>
            <Alert variant="warning">
            You can setup various expungement limits. (E.g no more than 5 expungements allowed). You can also make it more dynamic (E.g no more than 2 Felonies or no more than 3 Convictions involving 2 Misdemeanors).
            <hr />
            This part is still under development.
            </Alert>
            <Row>
                <Col xs={5}>
                    <ExpungementLimitForm />
                </Col>
                <Col xs={7}>
                
                </Col>
            </Row>
        </div>
    );
};

export default ExpungementLimit;