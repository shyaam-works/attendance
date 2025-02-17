import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [attendanceMessage, setAttendanceMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("https://students-be8j.onrender.com/Sheet1")
      .then((response) => response.json())
      .then((data) => {
        setStudents(data);
        console.log("Fetched Data:", data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleRadioChange = (rollNo, type) => {
    setAttendance((prev) => ({
      ...prev,
      [rollNo]: {
        absent: type === "absent",
        od: type === "od",
        informedLeave: type === "informedLeave",
      },
    }));
  };

  const generateAttendanceMessage = () => {
    if (!students || students.length === 0) return;

    const date = new Date().toLocaleDateString("en-GB");
    let absentCount = 0;
    let odCount = 0;
    let informedLeaveCount = 0;
    let absentList = [];
    let odList = [];
    let informedLeaveList = [];

    const rollNoWidth = 10;
    const nameWidth = 20;

    students.forEach((student) => {
      const rollNo = student["ROLL NO"];
      if (attendance[rollNo]) {
        if (attendance[rollNo].absent) {
          absentCount++;
          absentList.push(
            `${String(rollNo).padEnd(rollNoWidth)} ${student.NAME.padEnd(
              nameWidth
            )}`
          );
        }
        if (attendance[rollNo].od) {
          odCount++;
          odList.push(
            `${String(rollNo).padEnd(rollNoWidth)} ${student.NAME.padEnd(
              nameWidth
            )}`
          );
        }
        if (attendance[rollNo].informedLeave) {
          informedLeaveCount++;
          informedLeaveList.push(
            `${String(rollNo).padEnd(rollNoWidth)} ${student.NAME.padEnd(
              nameWidth
            )}`
          );
        }
      }
    });

    let message = `${date}\nAttendance detail ${
      students.length - (absentCount + odCount + informedLeaveCount)
    }/${students.length}`;

    if (absentCount > 0) message += `\n\nAbsent:\n${absentList.join("\n")}`;
    if (odCount > 0) message += `\n\nOD:\n${odList.join("\n")}`;
    if (informedLeaveCount > 0)
      message += `\n\nInformed Leave:\n${informedLeaveList.join("\n")}`;
    if (absentCount === 0 && odCount === 0 && informedLeaveCount === 0)
      message += "\n\nNil";

    message += `\n\nThank you all`;

    setAttendanceMessage(message);
    document.getElementById("attendanceMessage").readOnly = false;
  };

  const sendToWhatsApp = () => {
    const message = encodeURIComponent(attendanceMessage);
    const whatsappURL = `https://wa.me/?text=${message}`;
    window.open(whatsappURL, "_blank");
  };

  const filteredStudents = students.filter((student) => {
    const lowercasedTerm = searchTerm.toLowerCase();
    return (
      student.NAME.toLowerCase().includes(lowercasedTerm) ||
      student["ROLL NO"].toString().includes(lowercasedTerm)
    );
  });

  if (!students || students.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Attendance System</h1>

      <input
        type="text"
        placeholder="Search by Name or Roll No"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Name</th>
              <th>Absent</th>
              <th>OD</th>
              <th>Informed Leave</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student["ROLL NO"]}>
                <td>{student["ROLL NO"]}</td>
                <td>{student.NAME}</td>
                <td>
                  <input
                    type="radio"
                    name={`attendance-${student["ROLL NO"]}`}
                    checked={attendance[student["ROLL NO"]]?.absent || false}
                    onChange={() =>
                      handleRadioChange(student["ROLL NO"], "absent")
                    }
                  />
                </td>
                <td>
                  <input
                    type="radio"
                    name={`attendance-${student["ROLL NO"]}`}
                    checked={attendance[student["ROLL NO"]]?.od || false}
                    onChange={() => handleRadioChange(student["ROLL NO"], "od")}
                  />
                </td>
                <td>
                  <input
                    type="radio"
                    name={`attendance-${student["ROLL NO"]}`}
                    checked={
                      attendance[student["ROLL NO"]]?.informedLeave || false
                    }
                    onChange={() =>
                      handleRadioChange(student["ROLL NO"], "informedLeave")
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={generateAttendanceMessage} disabled={!students.length}>
        Generate Attendance Message
      </button>
      <button onClick={sendToWhatsApp} disabled={!attendanceMessage}>
        Send to WhatsApp
      </button>

      <textarea
        id="attendanceMessage"
        readOnly
        value={attendanceMessage}
        rows={10}
        cols={50}
        placeholder="Attendance message will appear here"
      />
    </div>
  );
}

export default App;
