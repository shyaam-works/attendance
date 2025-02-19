import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Attendance() {
  const { className } = useParams();
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [attendanceMessage, setAttendanceMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetch(`https://students-be8j.onrender.com/${className}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load data");
        }
        return response.json();
      })
      .then((data) => {
        setStudents(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [className]);

  if (loading) {
    return (
      <h1 style={{ textAlign: "center", marginTop: "20%" }}>Loading...</h1>
    );
  }

  if (error) {
    return (
      <h1 style={{ textAlign: "center", marginTop: "20%", color: "red" }}>
        Failed to load data
      </h1>
    );
  }

  const handleRadioChange = (rollNo, type) => {
    setAttendance((prev) => ({
      ...prev,
      [rollNo]: {
        externalOd: type === "externalOd",
        internalOd: type === "internalOd",
        absent: type === "absent",
        informedLeave: type === "informedLeave",
      },
    }));
  };

  const generateAttendanceMessage = () => {
    if (!students.length) return;

    const date = new Date().toLocaleDateString("en-GB");
    let absentCount = 0;
    let externalOdCount = 0;
    let informedLeaveCount = 0;
    let internalOdCount = 0;
    let absentList = [];
    let externalOdList = [];
    let informedLeaveList = [];
    let internalOdList = [];

    students.forEach((student) => {
      const rollNo = student["ROLL NO"];
      if (attendance[rollNo]) {
        if (attendance[rollNo].absent) {
          absentCount++;
          absentList.push(`${rollNo} ${student.NAME}`);
        }
        if (attendance[rollNo].externalOd) {
          externalOdCount++;
          externalOdList.push(`${rollNo} ${student.NAME}`);
        }
        if (attendance[rollNo].informedLeave) {
          informedLeaveCount++;
          informedLeaveList.push(`${rollNo} ${student.NAME}`);
        }
        if (attendance[rollNo].internalOd) {
          internalOdCount++;
          internalOdList.push(`${rollNo} ${student.NAME}`);
        }
      }
    });

    let message = `${date}\nAttendance Summary: ${
      students.length - (absentCount + externalOdCount + informedLeaveCount)
    }/${students.length}`;

    if (absentCount > 0) message += `\n\nAbsent:\n${absentList.join("\n")}`;
    if (externalOdCount > 0)
      message += `\n\nExternal OD:\n${externalOdList.join("\n")}`;
    if (informedLeaveCount > 0)
      message += `\n\nInformed Leave:\n${informedLeaveList.join("\n")}`;
    if (internalOdCount > 0)
      message += `\n\nInternal OD:\n${internalOdList.join("\n")}`;

    if (absentCount === 0 && externalOdCount === 0 && informedLeaveCount === 0)
      message += "\n\nNil";

    message += `\n\nThank you all`;

    setAttendanceMessage(message);
  };

  const sendToWhatsApp = () => {
    const message = encodeURIComponent(attendanceMessage);
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  const filteredStudents = students.filter((student) => {
    const lowercasedTerm = searchTerm.toLowerCase();
    return (
      student.NAME.toLowerCase().includes(lowercasedTerm) ||
      student["ROLL NO"].toString().includes(lowercasedTerm)
    );
  });

  return (
    <div className="container">
      <h1>{className} Attendance</h1>
      <input
        type="text"
        placeholder="Search by Name or Roll No"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <table>
        <thead>
          <tr>
            <th>Roll No</th>
            <th>Name</th>
            <th>Absent</th>
            <th>External OD</th>
            <th>Internal OD</th>
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
                  onChange={() =>
                    handleRadioChange(student["ROLL NO"], "absent")
                  }
                />
              </td>
              <td>
                <input
                  type="radio"
                  name={`attendance-${student["ROLL NO"]}`}
                  onChange={() =>
                    handleRadioChange(student["ROLL NO"], "externalOd")
                  }
                />
              </td>
              <td>
                <input
                  type="radio"
                  name={`attendance-${student["ROLL NO"]}`}
                  onChange={() =>
                    handleRadioChange(student["ROLL NO"], "internalOd")
                  }
                />
              </td>
              <td>
                <input
                  type="radio"
                  name={`attendance-${student["ROLL NO"]}`}
                  onChange={() =>
                    handleRadioChange(student["ROLL NO"], "informedLeave")
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={generateAttendanceMessage}>Generate Message</button>
      <button onClick={sendToWhatsApp} disabled={!attendanceMessage}>
        Send to WhatsApp
      </button>

      <textarea
        readOnly
        value={attendanceMessage}
        rows={10}
        placeholder="Message will appear here"
      />
    </div>
  );
}

export default Attendance;
