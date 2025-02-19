import React from "react";
import { Link } from "react-router-dom";

const ClassSelection = () => {
  const classes = [
    "I-CSE-A",
    "I-CSE-B",
    "I-CSE-C",
    "II-CSE-A",
    "II-CSE-C",
    "III-CSE-A",
    "III-CSE-B",
    "III-CSE-C",
  ];

  return (
    <div>
      <h2>Select a Class</h2>
      <ul>
        {classes.map((className) => (
          <li key={className}>
            <Link to={`/attendance/${className}`}>{className}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClassSelection;
