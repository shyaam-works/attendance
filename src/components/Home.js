import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-bg">
      <div className="home-container">
        <h1>Welcome to Attendance Message Generation Portal</h1>
        <button className="homebtn" onClick={() => navigate("/select-class")}>
          Get Started
        </button>
      </div>
    </div>
  );
}

export default Home;
