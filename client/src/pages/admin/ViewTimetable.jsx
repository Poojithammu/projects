import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal } from "react-bootstrap";  // Import Modal here
import "./ViewTimetable.css";

const ViewTimetable = () => {
    const [viewBy, setViewBy] = useState("class");
    const [classes, setClasses] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedFaculty, setSelectedFaculty] = useState("");
    const [timetableEntries, setTimetableEntries] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const fetchData = async () => {
            try {
                const [classesRes, facultiesRes] = await Promise.all([
                    axios.get("https://fms-backend-a1b0.onrender.com/api/admin/classes", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get("https://fms-backend-a1b0.onrender.com/api/admin/faculties", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);
                setClasses(classesRes.data);
                setFaculties(facultiesRes.data);
            } catch {
                toast.error("⚠️ Failed to load classes or faculties");
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (
            (viewBy === "class" && selectedClass) ||
            (viewBy === "faculty" && selectedFaculty)
        ) {
            const token = localStorage.getItem("token");
            const fetchTimetable = async () => {
                try {
                    const url =
                        viewBy === "class"
                            ? `https://fms-backend-a1b0.onrender.com/api/admin/timetable/class/${selectedClass}`
                            : `https://fms-backend-a1b0.onrender.com/api/admin/timetable/faculty/${selectedFaculty}`;

                    const res = await axios.get(url, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setTimetableEntries(res.data);
                } catch {
                    toast.error("⚠️ Failed to load timetable");
                    setTimetableEntries([]);
                }
            };
            fetchTimetable();
        } else {
            setTimetableEntries([]);
        }
    }, [viewBy, selectedClass, selectedFaculty]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this entry?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`https://fms-backend-a1b0.onrender.com/api/admin/timetable/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("🗑️ Timetable entry deleted");
            setTimetableEntries((prev) => prev.filter((entry) => entry._id !== id));
        } catch {
            toast.error("❌ Failed to delete entry");
        }
    };
    const handleEditSubmit = async () => {
        const token = localStorage.getItem("token");
        try {
            await axios.put(
                `https://fms-backend-a1b0.onrender.com/api/admin/timetable/${editData._id}`,
                editData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            toast.success("✅ Timetable updated");

            // refetch timetable entries based on current viewBy filter
            let url = "";
            if (viewBy === "class" && selectedClass) {
                url = `https://fms-backend-a1b0.onrender.com/api/admin/timetable/class/${selectedClass}`;
            } else if (viewBy === "faculty" && selectedFaculty) {
                url = `https://fms-backend-a1b0.onrender.com/api/admin/timetable/faculty/${selectedFaculty}`;
            } else {
                setShowEditModal(false);
                return; // nothing to refetch
            }

            const res = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTimetableEntries(res.data);
            setShowEditModal(false);
        } catch (err) {
            if (err.response?.status === 409) {
                toast.error("⚠️ Conflict: overlapping timetable");
            } else {
                toast.error("❌ Update failed");
            }
        }
    };


    return (
        <div className="view-timetable-container glassy-form shadow p-4 rounded">
            <h3 className="text-center mb-4 neon-title">📋 View Timetable</h3>

            <div className="mb-3 d-flex justify-content-center gap-3">
                <label className="neon-label">
                    <input
                        type="radio"
                        name="viewBy"
                        value="class"
                        checked={viewBy === "class"}
                        onChange={() => setViewBy("class")}
                    />{" "}
                    By Class
                </label>
                <label className="neon-label">
                    <input
                        type="radio"
                        name="viewBy"
                        value="faculty"
                        checked={viewBy === "faculty"}
                        onChange={() => setViewBy("faculty")}
                    />{" "}
                    By Faculty
                </label>
            </div>

            {viewBy === "class" ? (
                <select
                    className="form-select neon-input mb-4"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                >
                    <option value="">-- Select Class --</option>
                    {classes.map((cls) => (
                        <option key={cls._id} value={cls._id}>
                            {cls.name} ({cls.department}, Year {cls.year})
                        </option>
                    ))}
                </select>
            ) : (
                <select
                    className="form-select neon-input mb-4"
                    value={selectedFaculty}
                    onChange={(e) => setSelectedFaculty(e.target.value)}
                >
                    <option value="">-- Select Faculty --</option>
                    {faculties
                        .sort((a, b) => a.user.name.localeCompare(b.user.name))
                        .map((f) => (
                            <option key={f._id} value={f._id}>
                                {f.user?.name} ({f.department})
                            </option>
                        ))}
                </select>
            )}

            <div className="timetable-entries">
                {timetableEntries.length === 0 ? (
                    <p className="text-center neon-text-muted">
                        No timetable entries to display.
                    </p>
                ) : (
                    <table className="table table-dark table-hover neon-table">
                        <thead>
                            <tr>
                                <th>Day</th>
                                <th>Time</th>
                                <th>Subject</th>
                                <th>Class</th>
                                <th>Faculty</th>
                                <th>Actions</th>
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
                                    <td>{entry.classRef?.name}</td>
                                    <td>{entry.faculty?.user?.name}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-warning me-2"
                                            onClick={() => {
                                                setEditData(entry);
                                                setShowEditModal(true);
                                            }}
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDelete(entry._id)}
                                        >
                                            🗑️ Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* 📝 Edit Modal with React-Bootstrap */}
            <Modal
                show={showEditModal}
                onHide={() => setShowEditModal(false)}
                centered
                size="xl"
                dialogClassName="edit-timetable-modal"
                className="modal-dark"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Edit Timetable Entry</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editData && (
                        <>
                            <label className="form-label neon-label">Faculty</label>
                            <select
                                className="form-select neon-input"
                                value={editData.faculty}
                                onChange={(e) =>
                                    setEditData({ ...editData, faculty: e.target.value })
                                }
                            >
                                <option value="">-- Select Faculty --</option>
                                {faculties.map((f) => (
                                    <option key={f._id} value={f._id}>
                                        {f.user?.name} ({f.department})
                                    </option>
                                ))}
                            </select>

                            <label className="form-label neon-label mt-3">Class</label>
                            <select
                                className="form-select neon-input"
                                value={editData.classRef}
                                onChange={(e) =>
                                    setEditData({ ...editData, classRef: e.target.value })
                                }
                            >
                                <option value="">-- Select Class --</option>
                                {classes.map((cls) => (
                                    <option key={cls._id} value={cls._id}>
                                        {cls.name} ({cls.department}, Year {cls.year})
                                    </option>
                                ))}
                            </select>

                            <label className="form-label neon-label mt-3">Day</label>
                            <select
                                className="form-select neon-input"
                                value={editData.day}
                                onChange={(e) =>
                                    setEditData({ ...editData, day: e.target.value })
                                }
                            >
                                {[
                                    "Monday",
                                    "Tuesday",
                                    "Wednesday",
                                    "Thursday",
                                    "Friday",
                                    "Saturday",
                                ].map((day) => (
                                    <option key={day} value={day}>
                                        {day}
                                    </option>
                                ))}
                            </select>

                            <label className="form-label neon-label mt-3">Start Time</label>
                            <input
                                type="time"
                                className="form-control neon-input"
                                value={editData.startTime}
                                onChange={(e) =>
                                    setEditData({ ...editData, startTime: e.target.value })
                                }
                            />

                            <label className="form-label neon-label mt-3">End Time</label>
                            <input
                                type="time"
                                className="form-control neon-input"
                                value={editData.endTime}
                                onChange={(e) =>
                                    setEditData({ ...editData, endTime: e.target.value })
                                }
                            />

                            <label className="form-label neon-label mt-3">Subject</label>
                            <input
                                type="text"
                                className="form-control neon-input"
                                value={editData.subject}
                                onChange={(e) =>
                                    setEditData({ ...editData, subject: e.target.value })
                                }
                            />
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-success" onClick={handleEditSubmit}>
                        💾 Save
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={() => setShowEditModal(false)}
                    >
                        Cancel
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ViewTimetable;
