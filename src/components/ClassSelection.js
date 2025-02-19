import React from "react";
import { useNavigate } from "react-router-dom";

function ClassSelection() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>Select Your Class</h1>
      <button onClick={() => navigate("/attendance/CSE-A")}>CSE A</button>
      <button onClick={() => navigate("/attendance/Sheet1")}>CSE B</button>
      <button onClick={() => navigate("/attendance/CSE-C")}>CSE C</button>
    </div>
  );
}

export default ClassSelection;
