import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../admin/ViewTimetable.css"; 

const FacultyMyClasses = () => {
  const [timetable, setTimetable] = useState([]);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://fms-backend-a1b0.onrender.com/api/faculty/my-classes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTimetable(res.data);
      } catch {
        toast.error("⚠️ Failed to load your timetable");
      }
    };
    fetchTimetable();
  }, []);

  return (
    <div className="view-timetable-container glassy-form shadow p-4 rounded">
      <h3 className="text-center mb-4 neon-title">📚 My Classes</h3>
      {timetable.length === 0 ? (
        <p className="text-center neon-text-muted">No classes assigned yet.</p>
      ) : (
        <table className="table table-dark table-hover neon-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Time</th>
              <th>Subject</th>
              <th>Class</th>
              <th>Department</th>
            </tr>
          </thead>
          <tbody>
            {timetable.map((entry) => (
              <tr key={entry._id}>
                <td>{entry.day}</td>
                <td>
                  {entry.startTime} - {entry.endTime}
                </td>
                <td>{entry.subject}</td>
                <td>{entry.classRef?.name}</td>
                <td>{entry.classRef?.department}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FacultyMyClasses;
