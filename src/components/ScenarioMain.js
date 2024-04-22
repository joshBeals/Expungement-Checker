/**
 * Joshua Alele-Beals
 * joshbeals22@gmail.com
 * github.com/joshBeals
 */

import { Trash } from "react-bootstrap-icons";
import { Alert, Table } from "react-bootstrap";
import ScenarioForm from "../forms/ScenarioForm";
import { useAppState } from "../store/AppStateContext";

function ScenarioMain() {

    const { scenarios, deleteScenario } = useAppState();

    return(
        <div>
            <ScenarioForm />
            <Table striped bordered className="mt-3">
                <thead>
                    <tr>
                        <th>Conviction Type</th>
                        <th>Year</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {scenarios?.map((scenario, index) => (
                        <tr key={index}>
                            <td>{scenario.type}</td>
                            <td>{scenario.year}</td>
                            <td><Trash onClick={() => deleteScenario(index)} className="text-danger" style={{ cursor: 'pointer' }}/></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default ScenarioMain;