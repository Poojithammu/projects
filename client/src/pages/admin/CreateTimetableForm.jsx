import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./CreateTimetableForm.css";

const CreateTimetableForm = () => {
    const [faculties, setFaculties] = useState([]);
    const [classes, setClasses] = useState([]);
    const [formData, setFormData] = useState({
        faculty: "",
        subject: "",
        classRef: "",
        day: "Monday",
        startTime: "",
        endTime: "",
    });

    useEffect(() => {
        const token = localStorage.getItem("token");

        const fetchData = async () => {
            try {
                const [facultyRes, classRes] = await Promise.all([
                    axios.get("https://fms-backend-a1b0.onrender.com/api/admin/faculties", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get("https://fms-backend-a1b0.onrender.com/api/admin/classes", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                setFaculties(facultyRes.data);
                setClasses(classRes.data);
            } catch (err) {
                toast.error("⚠️ Failed to load faculties or classes");
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const validateTimes = () => {
        const { startTime, endTime } = formData;
        if (startTime >= endTime) {
            toast.error("⏰ Start time must be before end time");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { faculty, subject, classRef, startTime, endTime } = formData;

        if (!faculty || !subject || !classRef || !startTime || !endTime) {
            toast.error("❗ Please fill in all required fields");
            return;
        }

        if (!validateTimes()) return;

        try {
            await axios.post("https://fms-backend-a1b0.onrender.com/api/admin/timetable", formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            toast.success("✅ Timetable entry created successfully!");
            setFormData({
                faculty: "",
                subject: "",
                classRef: "",
                day: "Monday",
                startTime: "",
                endTime: "",
            });
        } catch (err) {
            const errorMessage = err.response?.data?.message;

            if (errorMessage) {
                toast.error(`❌ ${errorMessage}`);
            } else {
                toast.error("❌ Error creating timetable entry.");
            }

        }
    };

    return (
        <div className="timetable-form-container shadow p-4 rounded glassy-form">
            <h3 className="text-center mb-4 form-title-neon">📅 Create Timetable Entry</h3>
            <form onSubmit={handleSubmit} className="row g-3">

                {/* Faculty Dropdown */}
                <div className="col-md-6 form-group-custom">
                    <label>Faculty</label>
                    <select
                        className="form-select neon-input"
                        name="faculty"
                        value={formData.faculty}
                        onChange={handleChange}
                        required
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
                </div>

                {/* Subject */}
                <div className="col-md-6 form-group-custom">
                    <label>Subject</label>
                    <input
                        type="text"
                        className="form-control neon-input"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="Enter Subject Name"
                    />
                </div>

                {/* Class Dropdown (from backend) */}
                <div className="col-md-4 form-group-custom">
                    <label>Class</label>
                    <select
                        className="form-select neon-input"
                        name="classRef"
                        value={formData.classRef}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Select Class --</option>
                        {classes
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((cls) => (
                                <option key={cls._id} value={cls._id}>
                                    {cls.name} ({cls.department}, Year {cls.year})
                                </option>
                            ))}
                    </select>
                </div>

                {/* Day */}
                <div className="col-md-4 form-group-custom">
                    <label>Day</label>
                    <select
                        className="form-select neon-input"
                        name="day"
                        value={formData.day}
                        onChange={handleChange}
                    >
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(
                            (d) => (
                                <option key={d} value={d}>
                                    {d}
                                </option>
                            )
                        )}
                    </select>
                </div>

                {/* Time Pickers */}
                <div className="col-md-3 form-group-custom">  {/* Increase from col-md-2 to col-md-3 */}
                    <label>Start Time</label>
                    <input
                        type="time"
                        className="form-control neon-input"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="col-md-3 form-group-custom">
                    <label>End Time</label>
                    <input
                        type="time"
                        className="form-control neon-input"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        required
                    />
                </div>


                <div className="col-12 text-center">
                    <button className="btn neon-button mt-3 px-4" type="submit">
                        ✅ Create Entry
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateTimetableForm;
