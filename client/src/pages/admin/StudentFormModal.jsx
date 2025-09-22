import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import './FacultyFormModal.css';

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const salaryLimit = 10000000;

const StudentFormModal = ({ show, onHide, onRefresh, editingStudent }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        department: '',
        department_id: '',
        year: '',
        rollNumber: '',
        address: '',
        date_of_birth: '',
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (show) {
            if (editingStudent) {
                setFormData({
                    name: editingStudent.user?.name || '',
                    email: editingStudent.user?.email || '',
                    password: '',
                    phone: editingStudent.phone || '',
                    department: editingStudent.department || '',
                    department_id: editingStudent.department_id || '',
                    year: editingStudent.year || '',
                    rollNumber: editingStudent.rollNumber || '',
                    address: editingStudent.address || '',
                    date_of_birth: editingStudent.date_of_birth?.substring(0, 10) || '',
                });
            } else {
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    phone: '',
                    department: '',
                    department_id: '',
                    year: '',
                    rollNumber: '',
                    address: '',
                    date_of_birth: '',
                });
            }
            setErrors({});
        }
    }, [editingStudent, show]);

    const validate = () => {
        const errs = {};
        const today = new Date();
        const dob = new Date(formData.date_of_birth);

        if (!formData.name.trim()) errs.name = 'Name is required';

        if (!formData.email.trim()) errs.email = 'Email is required';
        else if (!emailRegex.test(formData.email)) errs.email = 'Invalid email address';

        if (!editingStudent) {
            if (!formData.password) errs.password = 'Password is required';
            else if (formData.password.length < 6) errs.password = 'Password must be at least 6 characters';
        }

        if (formData.phone && !/^\d{7,15}$/.test(formData.phone)) errs.phone = 'Phone must be 7 to 15 digits';

        if (formData.department_id && !/^[a-zA-Z0-9-]+$/.test(formData.department_id)) {
            errs.department_id = 'Department ID can only contain letters, numbers, and hyphens (-)';
        }

        if (formData.year) {
            const yearNum = Number(formData.year);
            if (!Number.isInteger(yearNum) || yearNum <= 0 || yearNum >= 10) {
                errs.year = 'Year must be a positive integer less than 10';
            }
        }


        if (formData.date_of_birth) {
            const minDOB = new Date('1900-01-01');
            const maxDOB = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
            if (isNaN(dob.getTime()) || dob < minDOB || dob >= maxDOB) {
                errs.date_of_birth = 'DOB must be before 18 years ago and after 1900';
            }
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            const updateError = (condition, field, message) => {
                if (condition) newErrors[field] = message;
                else delete newErrors[field];
            };

            switch (name) {
                case 'name':
                    updateError(!value.trim(), 'name', 'Name is required');
                    break;
                case 'email':
                    updateError(!value.trim(), 'email', 'Email is required');
                    if (value && !emailRegex.test(value)) newErrors.email = 'Invalid email address';
                    else if (emailRegex.test(value)) delete newErrors.email;
                    break;
                case 'password':
                    if (!editingStudent) {
                        updateError(!value, 'password', 'Password is required');
                        updateError(value && value.length < 6, 'password', 'Password must be at least 6 characters');
                    }
                    break;
                case 'phone':
                    updateError(value && !/^\d{7,15}$/.test(value), 'phone', 'Phone must be 7 to 15 digits');
                    break;
                case 'department_id':
                    updateError(
                        value && !/^[a-zA-Z0-9-]+$/.test(value),
                        'department_id',
                        'Department ID can only contain letters, numbers, and hyphens (-)'
                    );
                    break;
                case 'year':
                    const yearNum = Number(value);
                    updateError(
                        value && (!Number.isInteger(yearNum) || yearNum <= 0 || yearNum >= 10),
                        'year',
                        'Year must be a positive integer and less than 10'
                    );
                    break;

                case 'date_of_birth': {
                    const dobVal = new Date(value);
                    const minDOB = new Date('1900-01-01');
                    const maxDOB = new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate());
                    updateError(value && (isNaN(dobVal.getTime()) || dobVal < minDOB || dobVal >= maxDOB), 'date_of_birth', 'DOB must be before 18 years ago and after 1900');
                    break;
                }
                default:
                    break;
            }
            return newErrors;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            toast.error('Please fix validation errors before submitting.');
            return;
        }

        const token = localStorage.getItem('token');

        try {
            if (editingStudent) {
                await axios.put(
                    `https://fms-backend-a1b0.onrender.com/api/admin/students/${editingStudent._id}`,
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success('Student updated successfully!');
            } else {
                await axios.post(
                    'https://fms-backend-a1b0.onrender.com/api/admin/students',
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success('Student added successfully!');
            }
            onRefresh();
            onHide();
        } catch (error) {
            console.error('Error response:', error.response?.data);
            const backendMsg = error.response?.data?.error
                || error.response?.data?.message
                || 'Failed to save student.';
            toast.error(backendMsg);
        }
    };

    return (
        <Modal show={show} onHide={onHide} backdrop="static" centered>
            <Modal.Header closeButton className="modal-header">
                <Modal.Title className="modal-title">
                    {editingStudent ? 'Edit Student' : 'Add New Student'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit} noValidate>
                    <Row>
                        <Col md={6} className="form-group-custom">
                            <Form.Label>
                                Name <span className="required">*</span>
                            </Form.Label>
                            <Form.Control
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                isInvalid={!!errors.name}
                                className="input-custom"
                            />
                            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                        </Col>

                        <Col md={6} className="form-group-custom">
                            <Form.Label>
                                Email <span className="required">*</span>
                            </Form.Label>
                            <Form.Control
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                isInvalid={!!errors.email}
                                className="input-custom"
                            />
                            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                        </Col>
                    </Row>

                    {!editingStudent && (
                        <Row>
                            <Col md={6} className="form-group-custom">
                                <Form.Label>
                                    Password <span className="required">*</span>
                                </Form.Label>
                                <Form.Control
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    isInvalid={!!errors.password}
                                    className="input-custom"
                                />
                                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                            </Col>
                            <Col md={6}></Col>
                        </Row>
                    )}

                    <Row>
                        <Col md={6} className="form-group-custom">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                isInvalid={!!errors.phone}
                                className="input-custom"
                            />
                            <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                        </Col>

                        <Col md={6} className="form-group-custom">
                            <Form.Label>Department</Form.Label>
                            <Form.Select
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                className="input-custom"
                            >
                                <option value="">-- Select Department --</option>
                                <option value="CSE">CSE</option>
                                <option value="CSE-C">CSE-C</option>
                                <option value="CSE-AIML">CSE-AIML</option>
                                <option value="CSE-DS">CSE-DS</option>
                            </Form.Select>
                        </Col>

                    </Row>

                    <Row>
                        <Col md={6} className="form-group-custom">
                            <Form.Label>Department ID</Form.Label>
                            <Form.Control
                                name="department_id"
                                value={formData.department_id}
                                onChange={handleChange}
                                isInvalid={!!errors.department_id}
                                className="input-custom"
                            />
                            <Form.Control.Feedback type="invalid">{errors.department_id}</Form.Control.Feedback>
                        </Col>

                        <Col md={6} className="form-group-custom">
                            <Form.Label>Year</Form.Label>
                            <Form.Control
                                name="year"
                                type="number"
                                value={formData.year}
                                onChange={handleChange}
                                isInvalid={!!errors.year}
                                className="input-custom"
                            />
                            <Form.Control.Feedback type="invalid">{errors.year}</Form.Control.Feedback>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6} className="form-group-custom">
                            <Form.Label>Roll Number</Form.Label>
                            <Form.Control
                                name="rollNumber"
                                value={formData.rollNumber}
                                onChange={handleChange}
                                className="input-custom"
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col md={12} className="form-group-custom">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="input-custom"
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6} className="form-group-custom">
                            <Form.Label>Date of Birth</Form.Label>
                            <Form.Control
                                type="date"
                                name="date_of_birth"
                                value={formData.date_of_birth}
                                onChange={handleChange}
                                isInvalid={!!errors.date_of_birth}
                                className="input-custom"
                            />
                            <Form.Control.Feedback type="invalid">{errors.date_of_birth}</Form.Control.Feedback>
                        </Col>
                        <Col md={6}></Col>
                    </Row>

                    <Button type="submit" className="submit-btn mt-3">
                        {editingStudent ? 'Update Student' : 'Add Student'}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default StudentFormModal;
