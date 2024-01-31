import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import HL7Analysics from "./pages/HL7Analysics";

import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HL7Analysics />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
