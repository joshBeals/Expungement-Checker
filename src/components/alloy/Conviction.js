/**
 * Joshua Alele-Beals
 * joshbeals22@gmail.com
 * github.com/joshBeals
 */

import { ListGroup, Tooltip } from "react-bootstrap";
import ConvictionForm from "../../forms/ConvictionForm";
import { Trash } from "react-bootstrap-icons";
import { useAppState } from "../../store/AppStateContext";

function Conviction() {

    const { convictions, deleteConviction } = useAppState();

    return(
        <div>
            <ConvictionForm />
            <ListGroup>
                {convictions.map((conviction, index) => (
                    <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                        {conviction}
                        <div>
                            <Trash onClick={() => deleteConviction(index)} className="text-danger" style={{ cursor: 'pointer' }}/>
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
};

export default Conviction;