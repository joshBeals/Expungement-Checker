/**
 * Joshua Alele-Beals
 * joshbeals22@gmail.com
 * github.com/joshBeals
 */

import { Trash } from "react-bootstrap-icons";
import { useAppState } from "../../store/AppStateContext";
import DateRangeForm from "../../forms/DateRangeForm";
import { Alert, ListGroup } from "react-bootstrap";

function DateRange() {

    const { dateRanges, deleteDateRange } = useAppState();

    return(
        <div>
            <Alert variant="warning">
            The dates ranges specified here are going to be used in date ordering and also for building logic for waiting periods
            </Alert>
            <DateRangeForm />
            <ListGroup>
                {dateRanges.map((range, index) => (
                    <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                        {range?.range} Years, {range?.within}, {range?.beyond}
                        <div>
                            <Trash onClick={() => deleteDateRange(index)} className="text-danger" style={{ cursor: 'pointer' }}/>
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
};

export default DateRange;