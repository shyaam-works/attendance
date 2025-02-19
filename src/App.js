import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import ClassSelection from "./components/ClassSelection";
import Attendance from "./components/Attendance";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/select-class" element={<ClassSelection />} />
        <Route path="/attendance/:className" element={<Attendance />} />
      </Routes>
    </Router>
  );
}

export default App;
