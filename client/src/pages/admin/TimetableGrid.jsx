import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TimetableGrid.css";
import { toast } from "react-toastify";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const TimetableGrid = ({ viewBy = "faculty", id }) => {
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        const fetchTimetable = async () => {
            try {
                const queryParam = viewBy === "faculty" ? `faculty=${id}` : `className=${id}`;
                const res = await axios.get(`/api/timetable?${queryParam}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                setEntries(res.data.entries || []);
            } catch (error) {
                toast.error("Failed to fetch timetable");
            }
        };

        if (id) fetchTimetable();
    }, [viewBy, id]);

    return (
        <div className="container mt-4">
            <h4 className="mb-3">
                {viewBy === "faculty" ? "Faculty" : "Class"} Timetable
            </h4>

            <div className="timetable-grid">
                {days.map((day) => (
                    <div key={day} className="timetable-day">
                        <h6>{day}</h6>
                        <div className="timetable-slots">
                            {entries
                                .filter((entry) => entry.day === day)
                                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                                .map((entry, index) => (
                                    <div key={index} className="slot-card">
                                        <div><strong>{entry.subject}</strong></div>
                                        <div>{entry.className}</div>
                                        <div>{entry.startTime} - {entry.endTime}</div>
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TimetableGrid;
