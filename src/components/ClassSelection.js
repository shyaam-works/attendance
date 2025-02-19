import React from "react";
import { useNavigate } from "react-router-dom";

function ClassSelection() {
  const navigate = useNavigate();

  return (
    <div className="class-bg">
      <div className="class-container">
        <h1 className="h1">Select Your Class</h1>
        <button
          className="classbtn"
          onClick={() => navigate("/attendance/CSE-A")}
        >
          CSE A
        </button>
        <button
          className="classbtn"
          onClick={() => navigate("/attendance/CSE-B")}
        >
          CSE B
        </button>
        <button
          className="classbtn"
          onClick={() => navigate("/attendance/CSE-C")}
        >
          CSE C
        </button>
      </div>
    </div>
  );
}

export default ClassSelection;
