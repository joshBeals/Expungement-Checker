/**
 * Joshua Alele-Beals
 * joshbeals22@gmail.com
 * github.com/joshBeals
 */

import { Trash } from "react-bootstrap-icons";
import { useAppState } from "../../store/AppStateContext";
import { Alert, Card, Col, ListGroup, Row } from "react-bootstrap";
import ExpungementLimitForm from "../../forms/ExpungementLimitForm";

function ExpungementLimit() {

    const { limits, deleteLimit } = useAppState();

    console.log(limits);

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
                    <Card>
                        <Card.Header as="h5">Expungement Rules</Card.Header>
                        <Card.Body>
                            <ListGroup>
                                {limits?.map((data, index) => (
                                    <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                                        {data?.total ? `No expungement after ${data?.total} expunged convictions including: ` : 'No expungement after '}
                                        {data?.breakdown?.map((dat, index) => (
                                            `${dat?.count} ${dat?.conviction}${index < data?.breakdown.length -1 ? ', ' : ''}`
                                        ))}
                                        <div>
                                            <Trash onClick={() => deleteLimit(index)} className="text-danger" style={{ cursor: 'pointer' }}/>
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ExpungementLimit;