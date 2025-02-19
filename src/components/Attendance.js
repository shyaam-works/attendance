import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Attendance() {
  const { className } = useParams();
  console.log(className);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [attendanceMessage, setAttendanceMessage] = "";
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
        const formattedData = data.map((student) => ({
          ...student,
          NAME: student.NAME.toUpperCase(),
        }));
        setStudents(formattedData);
        console.log(formattedData);
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
        od: type === "od",
        absent: type === "absent",
        informedLeave: type === "informedLeave",
      },
    }));
  };

  const generateAttendanceMessage = () => {
    if (!students.length) return;

    const date = new Date().toLocaleDateString("en-GB");
    let absentCount = 0;
    let odCount = 0;
    let informedLeaveCount = 0;
    let absentList = [];
    let odList = [];
    let informedLeaveList = [];

    students.forEach((student) => {
      const rollNo = student["ROLL NO"];
      if (attendance[rollNo]) {
        if (attendance[rollNo].absent) {
          absentCount++;
          absentList.push(`${rollNo} ${student.NAME}`);
        }
        if (attendance[rollNo].od) {
          odCount++;
          odList.push(`${rollNo} ${student.NAME}`);
        }
        if (attendance[rollNo].informedLeave) {
          informedLeaveCount++;
          informedLeaveList.push(`${rollNo} ${student.NAME}`);
        }
      }
    });

    let message = `${date}\nAttendance Summary: ${
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
  };

  const sendToWhatsApp = () => {
    const message = encodeURIComponent(attendanceMessage);
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  const filteredStudents = students.filter((student) => {
    const lowercasedTerm = searchTerm ? searchTerm.toLowerCase() : "";

    return (
      (student.NAME && student.NAME.toLowerCase().includes(lowercasedTerm)) ||
      (student["ROLL NO"] &&
        student["ROLL NO"].toString().includes(lowercasedTerm))
    );
  });

  return (
    <div className="container">
      <h1 className="cn"> Attendance</h1>
      <input
        className="inputbx"
        type="text"
        placeholder="Search by Name or Roll No"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <p className="sec"> CLASS: {className}</p>

      <table className="table-container">
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

      <button className="gbutton" onClick={generateAttendanceMessage}>
        Generate Message
      </button>
      <button
        className="gbutton"
        onClick={sendToWhatsApp}
        disabled={!attendanceMessage}
      >
        Send to WhatsApp
      </button>

      <textarea
        className="gmsg"
        readOnly
        value={attendanceMessage}
        rows={10}
        placeholder="Message will appear here"
      />
    </div>
  );
}

export default Attendance;
