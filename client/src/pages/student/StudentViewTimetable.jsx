import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../admin/ViewTimetable.css"; // Reuse neon + glass theme

const StudentViewTimetable = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [timetableEntries, setTimetableEntries] = useState([]);

    useEffect(() => {
        const fetchClasses = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await axios.get("https://fms-backend-a1b0.onrender.com/api/admin/classes", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setClasses(res.data);
            } catch {
                toast.error("⚠️ Failed to load class list");
            }
        };
        fetchClasses();
    }, []);

    useEffect(() => {
        const fetchTimetable = async () => {
            if (!selectedClass) {
                setTimetableEntries([]);
                return;
            }

            const token = localStorage.getItem("token");
            try {
                const res = await axios.get(
                    `https://fms-backend-a1b0.onrender.com/api/admin/timetable/class/${selectedClass}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setTimetableEntries(res.data);
            } catch {
                toast.error("⚠️ Failed to load timetable");
            }
        };
        fetchTimetable();
    }, [selectedClass]);

    return (
        <div className="view-timetable-container glassy-form shadow p-4 rounded">
            <h3 className="text-center mb-4 neon-title">📅 My Class Timetable</h3>

            <select
                className="form-select neon-input mb-4"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
            >
                <option value="">-- Select Your Section --</option>
                {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                        {cls.name} ({cls.department}, Year {cls.year})
                    </option>
                ))}
            </select>

            {timetableEntries.length === 0 ? (
                <p className="text-center neon-text-muted">
                    No timetable found for selected class.
                </p>
            ) : (
                <table className="table table-dark table-hover neon-table">
                    <thead>
                        <tr>
                            <th>Day</th>
                            <th>Time</th>
                            <th>Subject</th>
                            <th>Faculty</th>
                        </tr>
                    </thead>
                    <tbody>
                        {timetableEntries.map((entry) => (
                            <tr key={entry._id}>
                                <td>{entry.day}</td>
                                <td>
                                    {entry.startTime} - {entry.endTime}
                                </td>
                                <td>{entry.subject}</td>
                                <td>{entry.faculty?.user?.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default StudentViewTimetable;
