import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import './ApplyLeavePage.css'; // We'll add custom styles here

const ApplyLeavePage = () => {
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        reason: '',
        type: 'Casual',
    });

    const [errors, setErrors] = useState({});

    const validateYearRange = (dateStr) => {
        if (!dateStr) return true;
        const year = new Date(dateStr).getFullYear();
        const currentYear = new Date().getFullYear();
        return year >= 2000 && year <= currentYear; // Adjust 2000 if needed
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

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const start = new Date(name === 'startDate' ? value : formData.startDate);
            const end = new Date(name === 'endDate' ? value : formData.endDate);

            switch (name) {
                case 'startDate':
                    updateError(!value, 'startDate', 'Start date is required');
                    updateError(value && start < today, 'startDate', 'Start date cannot be in the past');
                    updateError(value && !validateYearRange(value), 'startDate', `Year must be between 2000 and ${today.getFullYear()}`);
                    break;

                case 'endDate':
                    updateError(!value, 'endDate', 'End date is required');
                    updateError(value && end < start, 'endDate', 'End date cannot be before start date');
                    updateError(value && !validateYearRange(value), 'endDate', `Year must be between 2000 and ${today.getFullYear()}`);
                    break;

                case 'reason':
                    updateError(!value.trim(), 'reason', 'Reason is required');
                    updateError(value && value.trim().length < 10, 'reason', 'Reason must be at least 10 characters');
                    break;

                default:
                    break;
            }

            return newErrors;
        });
    };

    const validate = () => {
        const errs = {};
        const { startDate, endDate, reason } = formData;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const start = new Date(startDate);
        const end = new Date(endDate);
        const currentYear = today.getFullYear();

        if (!startDate) errs.startDate = 'Start date is required';
        else if (start < today) errs.startDate = 'Start date cannot be in the past';
        else if (!validateYearRange(startDate)) errs.startDate = `Year must be between 2000 and ${currentYear}`;

        if (!endDate) errs.endDate = 'End date is required';
        else if (end < start) errs.endDate = 'End date cannot be before start date';
        else if (!validateYearRange(endDate)) errs.endDate = `Year must be between 2000 and ${currentYear}`;

        if (!reason.trim()) errs.reason = 'Reason is required';
        else if (reason.trim().length < 10) errs.reason = 'Reason must be at least 10 characters';

        const dayDiff = (end - start) / (1000 * 60 * 60 * 24);
        if (!errs.startDate && !errs.endDate && dayDiff > 10) {
            errs.endDate = 'Leave duration cannot exceed 10 days';
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            toast.error('Please fix validation errors.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('https://fms-backend-a1b0.onrender.com/api/faculty/apply-leave', formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success(res.data.message || 'Leave applied successfully!');
            setFormData({ startDate: '', endDate: '', reason: '', type: 'Casual' });
            setErrors({});
        } catch (err) {
            console.error('Error applying leave:', err);
            const msg = err.response?.data?.error || err.response?.data?.message || 'Leave request failed';
            toast.error(msg);
        }
    };

    return (
        <Container
            className="apply-leave-container p-4 rounded shadow"
            style={{ maxWidth: '600px' }}
        >
            <h2 className="mb-4 neon-title">Apply for Leave</h2>
            <Form onSubmit={handleSubmit} noValidate>
                <Row className="mb-3">
                    <Col>
                        <Form.Label className="neon-label">Start Date</Form.Label>
                        <Form.Control
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            isInvalid={!!errors.startDate}
                            className={`input-custom ${errors.startDate ? 'input-error' : ''}`}
                        />
                        <Form.Control.Feedback type="invalid" className="neon-error">
                            {errors.startDate}
                        </Form.Control.Feedback>
                    </Col>

                    <Col>
                        <Form.Label className="neon-label">End Date</Form.Label>
                        <Form.Control
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            isInvalid={!!errors.endDate}
                            className={`input-custom ${errors.endDate ? 'input-error' : ''}`}
                        />
                        <Form.Control.Feedback type="invalid" className="neon-error">
                            {errors.endDate}
                        </Form.Control.Feedback>
                    </Col>
                </Row>

                <Form.Group className="mb-3">
                    <Form.Label className="neon-label">Reason</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        isInvalid={!!errors.reason}
                        rows={3}
                        className={`input-custom ${errors.reason ? 'input-error' : ''}`}
                    />
                    <Form.Control.Feedback type="invalid" className="neon-error">
                        {errors.reason}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="neon-label">Type of Leave</Form.Label>
                    <Form.Select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="input-custom"
                    >
                        <option value="Casual">Casual</option>
                        <option value="Sick">Sick</option>
                        <option value="Other">Other</option>
                    </Form.Select>
                </Form.Group>

                <Button type="submit" className="btn-neon px-4">
                    Submit
                </Button>
            </Form>
        </Container>
    );
};

export default ApplyLeavePage;
