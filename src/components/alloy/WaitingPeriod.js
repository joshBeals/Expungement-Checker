/**
 * Joshua Alele-Beals
 * joshbeals22@gmail.com
 * github.com/joshBeals
 */

import { Trash } from "react-bootstrap-icons";
import { useAppState } from "../../store/AppStateContext";
import WaitingPeriodForm from "../../forms/WaitingPeriodForm";
import { Table } from "react-bootstrap";

function WaitingPeriod() {

    const { waitingPeriods, deleteWaitingPeriod } = useAppState();

    console.log(waitingPeriods);

    return(
        <div>
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
                            <td>{waitPeriod.wait} Years</td>
                            <td><Trash onClick={() => deleteWaitingPeriod(index)} className="text-danger" style={{ cursor: 'pointer' }}/></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default WaitingPeriod;