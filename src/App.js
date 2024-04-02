/**
 * Joshua Alele-Beals
 * joshbeals22@gmail.com
 * github.com/joshBeals
 */
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Generator from "./pages/Generator";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="alloy-generator" element={<Generator />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
