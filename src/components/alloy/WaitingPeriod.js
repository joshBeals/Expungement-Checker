/**
 * Joshua Alele-Beals
 * joshbeals22@gmail.com
 * github.com/joshBeals
 */

import { Trash } from "react-bootstrap-icons";
import { useAppState } from "../../store/AppStateContext";
import WaitingPeriodForm from "../../forms/WaitingPeriodForm";
import { Alert, Table } from "react-bootstrap";

function WaitingPeriod() {

    const { waitingPeriods, deleteWaitingPeriod } = useAppState();

    return(
        <div>
            <Alert variant="warning">
            Assign waiting periods to convictions. (E.g if 5 years needs to pass before a felony is considered valid for expungement, then pick 5 as the waiting period and pick Felony as the conviction). 
            <hr />
            Pick "Never" if the conviction is an unexpungeable conviction.
            </Alert>
            <WaitingPeriodForm />
            <Table striped bordered>
                <thead>
                    <tr>
                        <th>Conviction</th>
                        <th>Waiting Period</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {waitingPeriods.map((waitPeriod, index) => (
                        <tr key={index}>
                            <td>{waitPeriod.conviction}</td>
                            <td>{waitPeriod.wait} {waitPeriod.wait == "Never" ? '' : 'Years'}</td>
                            <td><Trash onClick={() => deleteWaitingPeriod(index)} className="text-danger" style={{ cursor: 'pointer' }}/></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default WaitingPeriod;