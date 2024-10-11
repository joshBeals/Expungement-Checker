/**
 * Joshua Alele-Beals
 * joshbeals22@gmail.com
 * github.com/joshBeals
 */
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Generator from "./pages/Generator";
import Scenario from "./pages/Scenario";
import ScenarioResult from "./components/ScenarioResult";
import UnderspecifiedScenario from "./pages/UnderspecifiedScenario";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="alloy-generator" element={<Generator />} />
        <Route path="scenario" element={<Scenario />} />
        <Route path="underspecified-scenario" element={<UnderspecifiedScenario />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
