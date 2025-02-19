import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>Welcome to Message Generation Portal</h1>
      <button onClick={() => navigate("/select-class")}>Mark Attendance</button>
    </div>
  );
}

export default Home;
