/**
 * Joshua Alele-Beals
 * joshbeals22@gmail.com
 * github.com/joshBeals
 */

import { Trash } from "react-bootstrap-icons";
import { useAppState } from "../store/AppStateContext";
import "../css/scenario.css";
import React, { useEffect, useState } from "react";

function ScenarioVisual() {

    const { scenarios } = useAppState();
    const sortedScenarios = scenarios.slice().sort((a, b) => {
        return a.year - b.year;
    });

    console.log(scenarios);

    return(
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="Yearly-timeline">
                        {sortedScenarios?.map((scenario, index) => (
                            <div key={index} className="timeline">
                                <div className="timeline-content">
                                    <h3 className="title">{scenario?.year}</h3>
                                    <p className="description">{scenario?.type}</p>
                                    <p className="mt-2">
                                        {(() => {
                                            const labels = [
                                            scenario?.tenner && "TenYearFelony",
                                            scenario?.assaultive && "Assaultive",
                                            scenario?.owi && "OWI"
                                            ].filter(Boolean);

                                            return labels.length > 0 ? `(${labels.join(", ")})` : '';
                                        })()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScenarioVisual;