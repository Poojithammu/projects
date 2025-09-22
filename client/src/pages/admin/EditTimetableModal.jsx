import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import "./EditTimetableModal.css";

const EditTimetableModal = ({ show, onHide, entry, onUpdated }) => {
    const [formData, setFormData] = useState(entry || {});
    const [classes, setClasses] = useState([]);
    const [faculties, setFaculties] = useState([]);

    useEffect(() => {
        if (entry) setFormData(entry);
    }, [entry]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const fetchData = async () => {
            try {
                const [clsRes, facRes] = await Promise.all([
                    axios.get("https://fms-backend-a1b0.onrender.com/api/admin/classes", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get("https://fms-backend-a1b0.onrender.com/api/admin/faculties", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);
                setClasses(clsRes.data);
                setFaculties(facRes.data);
            } catch {
                toast.error("Failed to load dropdown data");
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem("token");

        if (!formData.startTime || !formData.endTime || formData.startTime >= formData.endTime) {
            return toast.error("Invalid time range.");
        }

        try {
            await axios.put(
                `https://fms-backend-a1b0.onrender.com/api/admin/timetable/${formData._id}`,
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            toast.success("✅ Timetable entry updated");
            onUpdated();
            onHide();
        } catch (err) {
            const errorMessage = err.response?.data?.message;

            if (errorMessage) {
                toast.error(`❌ ${errorMessage}`);
            } else {
                toast.error("❌ Error updating timetable.");
            }
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered size="lg" className="custom-edit-modal">
            <Modal.Header closeButton className="modal-dark">
                <Modal.Title className="neon-title">✏️ Edit Timetable</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-dark">
                <Form>
                    <Row className="g-4">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="neon-label">Faculty</Form.Label>
                                <Form.Select
                                    name="faculty"
                                    value={formData.faculty?._id || formData.faculty}
                                    onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                                    className="neon-input"
                                >
                                    <option value="">-- Select Faculty --</option>
                                    {faculties.map((f) => (
                                        <option key={f._id} value={f._id}>
                                            {f.user?.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="neon-label">Class</Form.Label>
                                <Form.Select
                                    name="classRef"
                                    value={formData.classRef?._id || formData.classRef}
                                    onChange={(e) => setFormData({ ...formData, classRef: e.target.value })}
                                    className="neon-input"
                                >
                                    <option value="">-- Select Class --</option>
                                    {classes.map((c) => (
                                        <option key={c._id} value={c._id}>
                                            {c.name} ({c.department}, Year {c.year})
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="neon-label">Subject</Form.Label>
                                <Form.Control
                                    name="subject"
                                    value={formData.subject || ""}
                                    onChange={handleChange}
                                    placeholder="Enter Subject"
                                    className="neon-input"
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="neon-label">Day</Form.Label>
                                <Form.Select
                                    name="day"
                                    value={formData.day || ""}
                                    onChange={handleChange}
                                    className="neon-input"
                                >
                                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((d) => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="neon-label">Start Time</Form.Label>
                                <Form.Control
                                    type="time"
                                    name="startTime"
                                    value={formData.startTime || ""}
                                    onChange={handleChange}
                                    className="neon-input"
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="neon-label">End Time</Form.Label>
                                <Form.Control
                                    type="time"
                                    name="endTime"
                                    value={formData.endTime || ""}
                                    onChange={handleChange}
                                    className="neon-input"
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer className="modal-dark">
                <Button variant="secondary" onClick={onHide}>❌ Cancel</Button>
                <Button variant="primary" onClick={handleSubmit}>✅ Save Changes</Button>
            </Modal.Footer>
        </Modal>

    );

};

export default EditTimetableModal;
