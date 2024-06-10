/**
 * Joshua Alele-Beals
 * joshbeals22@gmail.com
 * github.com/joshBeals
 */

import { Trash } from "react-bootstrap-icons";
import { useAppState } from "../store/AppStateContext";
import React, { useEffect, useState } from "react";

function ScenarioResult() {
    const { scenarios, deleteScenario } = useAppState();
    const [result, setResult] = useState(null);

    console.log(scenarios);

    function generateAlloyPredicate(data) {
        if (data.length < 2) {
            throw new Error('The input data must contain at least two items.');
        }

        const currentYear = new Date().getFullYear();
        const mostRecentYear = Math.max(...data.map(conviction => parseInt(conviction.year, 10)));
    
        let alloyStringWithExpungement = "some disj ";
        let alloyStringWithoutExpungement = "some disj ";
        let conditions = [];
        let temporalConditions = [];
        let hbConditions = [];
        let expungementConditions = [];
        let hbConditionsWithoutExpungement = [];
    
        data.forEach((conviction, index) => {
            alloyStringWithExpungement += `c${index + 1}: Conviction`;
            alloyStringWithoutExpungement += `c${index + 1}: Conviction`;
            if (index < data.length - 1) {
                alloyStringWithExpungement += ", ";
                alloyStringWithoutExpungement += ", ";
            } else {
                alloyStringWithExpungement += ", exp: Expungement | \n";
                alloyStringWithoutExpungement += " | \n";
            }
            conditions.push(`c${index + 1} in ${conviction.type}`);
            if (index > 0) {
                const yearDifference = parseInt(data[index].year, 10) - parseInt(data[index - 1].year, 10);
                const temporalRelation = determineTemporalRelation(yearDifference);
                temporalConditions.push(`c${index + 1}.date in c${index}.date.${temporalRelation}`);
                hbConditions.push(`hb[c${index}, c${index + 1}]`);
                hbConditionsWithoutExpungement.push(`hb[c${index}, c${index + 1}]`);
            }
        });
    
        hbConditions.push(`hb[c${data.length}, exp]`);
        expungementConditions.push(`exp.date in c${data.length}.date.${determineTemporalRelation(currentYear - mostRecentYear)}`);
        expungementConditions.push(`(c${data.map((_, i) => i + 1).join('.expunged or c')}.expunged)`);
        expungementConditions.push(`exp.con in ${data.map((_, i) => `c${i + 1}`).join(' + ')}`);
    
        alloyStringWithExpungement += conditions.join(" and \n") + " and \n";
        alloyStringWithExpungement += hbConditions.join(" and \n") + " and \n";
        alloyStringWithExpungement += temporalConditions.join(" and \n") + " and \n";
        alloyStringWithExpungement += expungementConditions.join(" and \n");
    
        alloyStringWithoutExpungement += conditions.join(" and \n") + " and \n";
        alloyStringWithoutExpungement += hbConditionsWithoutExpungement.join(" and \n") + " and \n";
        alloyStringWithoutExpungement += temporalConditions.join(" and \n");
    
        return alloyStringWithExpungement + "\n    or\n    " + alloyStringWithoutExpungement;
    }
    
    function determineTemporalRelation(yearDifference) {
        if (yearDifference <= 5) {
            return 'withinFive';
        } else if (yearDifference <= 6) {
            return 'withinSix';
        } else if (yearDifference <= 7) {
            return 'withinSeven';
        } else {
            return 'beyondSeven';
        }
    }
    
    const alloyPredicate = generateAlloyPredicate(scenarios);
    console.log(alloyPredicate);

    useEffect(() => {
        if (scenarios.length === 0) {
            window.location.href = "/scenario";
        } else {
            // Define the payload
            const payload = {
                predicate: alloyPredicate,
                run: `run userDefinedPredicate for exactly ${scenarios.length + 1} Date, exactly ${scenarios.length} Conviction, exactly 1 Expungement`,
            };

            // Make the API call
            fetch("http://localhost:8080/api/alloy/run", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })
                .then((response) => response.json())
                .then((data) => {
                    setResult(data); // Save the result to the state
                    console.log("Success:", data?.data.at(-1));
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        }
    }, [scenarios]);

    return (
        <div>
            {result ? (
                <pre>{JSON.stringify(result, null, 2)}</pre>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
}

export default ScenarioResult;
