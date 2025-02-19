import React from "react";
import { Link } from "react-router-dom";

const ClassSelection = () => {
  const classes = [
    "I-CSE-A",
    "I-CSE-B",
    "I-CSE-C",
    "II-CSE-A",
    "II-CSE-B",
    "II-CSE-C",
    "III-CSE-A",
    "III-CSE-B",
    "III-CSE-C",
  ];

  return (
    <div className="class-selection-container">
      <h2>Select a Class</h2>
      <ul className="class-list">
        {classes.map((className) => (
          <li key={className}>
            <Link to={`/attendance/${className}`} className="class-link">
              {className}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClassSelection;
