import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import './FacultyFormModal.css';

const initialFormData = {
  name: '', email: '', password: '',
  phone: '', department: '', department_id: '',
  position: '', salary: '', address: '',
  date_of_birth: '', hire_date: ''
};

const emailRegex = /^\S+@\S+\.\S+$/;
const salaryLimit = 10000000;

const FacultyFormModal = ({ show, onHide, onRefresh, editingFaculty }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingFaculty) {
      setFormData({
        name: editingFaculty.user?.name || '',
        email: editingFaculty.user?.email || '',
        password: '',
        phone: editingFaculty.phone || '',
        department: editingFaculty.department || '',
        department_id: editingFaculty.department_id || '',
        position: editingFaculty.position || '',
        salary: editingFaculty.salary || '',
        address: editingFaculty.address || '',
        date_of_birth: editingFaculty.date_of_birth?.substring(0, 10) || '',
        hire_date: editingFaculty.hire_date?.substring(0, 10) || '',
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [editingFaculty]);

  const validate = () => {
    const errs = {};
    const today = new Date();
    const dob = new Date(formData.date_of_birth);
    const hire = new Date(formData.hire_date);

    if (!formData.name.trim()) errs.name = 'Name is required';

    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) errs.email = 'Invalid email address';

    if (!editingFaculty) {
      if (!formData.password) errs.password = 'Password is required';
      else if (formData.password.length < 6) errs.password = 'Password must be at least 6 characters';
    }

    if (formData.phone && !/^\d{7,10}$/.test(formData.phone)) errs.phone = 'Phone must be 7 to 10 digits';

    if (formData.department_id && !/^[a-zA-Z0-9-]+$/.test(formData.department_id)) {
      errs.department_id = 'Department ID can only contain letters, numbers, and hyphens (-)';
    }


    if (formData.salary !== '') {
      const salaryVal = Number(formData.salary);
      if (isNaN(salaryVal) || salaryVal <= 0) errs.salary = 'Salary must be positive';
      else if (salaryVal > salaryLimit) errs.salary = 'Salary must not exceed 10 million';
    }

    if (formData.date_of_birth) {
      const minDOB = new Date('1900-01-01');
      const maxDOB = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
      if (isNaN(dob.getTime()) || dob < minDOB || dob >= maxDOB) {
        errs.date_of_birth = 'DOB must be before 18 years ago and after 1900';
      }
    }

    if (formData.hire_date) {
      const minHireDate = new Date('1950-01-01');
      if (isNaN(hire.getTime()) || hire < minHireDate || hire > today) {
        errs.hire_date = 'Hire date must be between 1950 and today';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Live validation logic...
    setErrors(prevErrors => {
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
          if (!editingFaculty) {
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

        case 'salary': {
          const val = Number(value);
          updateError(value && (isNaN(val) || val <= 0 || val > salaryLimit), 'salary', 'Salary must be between 1 and 10 million');
          break;
        }
        case 'date_of_birth': {
          const dob = new Date(value);
          const minDOB = new Date('1900-01-01');
          const maxDOB = new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate());
          updateError(value && (isNaN(dob.getTime()) || dob < minDOB || dob >= maxDOB), 'date_of_birth', 'DOB must be before 18 years ago and after 1900');
          break;
        }
        case 'hire_date': {
          const hire = new Date(value);
          const minHire = new Date('1950-01-01');
          const today = new Date();
          updateError(value && (isNaN(hire.getTime()) || hire < minHire || hire > today), 'hire_date', 'Hire date must be between 1950 and today');
          break;
        }
        default: break;
      }

      return newErrors;
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const isValid = validate();
    if (!isValid) {
      toast.error('Please fix validation errors before submitting.');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (editingFaculty) {
        await axios.put(
          `https://fms-backend-a1b0.onrender.com/api/admin/faculties/${editingFaculty._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Faculty updated successfully!');
      } else {
        await axios.post(
          'https://fms-backend-a1b0.onrender.com/api/admin/faculties',
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Faculty added successfully!');
      }
      onRefresh();
      onHide();
    } catch (error) {
      console.error('Error response:', error.response?.data);
      const backendMsg = error.response?.data?.error
        || error.response?.data?.message
        || 'Failed to save faculty.';
      toast.error(backendMsg);
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled = () => {
    if (Object.keys(errors).length > 0) return true;
    if (!formData.name.trim() || !formData.email.trim()) return true;
    if (!editingFaculty && (!formData.password || formData.password.length < 6)) return true;
    return false;
  };

  return (
    <Modal show={show} onHide={onHide} backdrop="static" size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{editingFaculty ? 'Edit Faculty' : 'Add New Faculty'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} md={6} controlId="formName" className="form-group-custom">
              <Form.Label>Name <span className="required">*</span></Form.Label>
              <Form.Control
                name="name"
                value={formData.name}
                onChange={handleChange}
                isInvalid={!!errors.name}
                placeholder="Enter full name"
                autoFocus
                required
                className="input-custom"
              />
              <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md={6} controlId="formEmail" className="form-group-custom">
              <Form.Label>Email <span className="required">*</span></Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                isInvalid={!!errors.email}
                placeholder="example@domain.com"
                required
                className="input-custom"
              />
              <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
            </Form.Group>
          </Row>

          {!editingFaculty && (
            <Form.Group className="mb-3 form-group-custom" controlId="formPassword">
              <Form.Label>Password <span className="required">*</span></Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                isInvalid={!!errors.password}
                placeholder="At least 6 characters"
                required
                minLength={6}
                className="input-custom"
              />
              <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
            </Form.Group>
          )}

          <Row className="mb-3">
            <Form.Group as={Col} md={4} controlId="formPhone" className="form-group-custom">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                isInvalid={!!errors.phone}
                placeholder="Digits only"
                className="input-custom"
              />
              <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md={4} controlId="formDepartment" className="form-group-custom">
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
            </Form.Group>
            <Form.Group as={Col} md={4} controlId="formDepartmentId" className="form-group-custom">
              <Form.Label>Department ID</Form.Label>
              <Form.Control
                name="department_id"
                value={formData.department_id}
                onChange={handleChange}
                isInvalid={!!errors.department_id}
                placeholder="Alphanumeric only"
                className="input-custom"
              />
              <Form.Control.Feedback type="invalid">{errors.department_id}</Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md={6} controlId="formPosition" className="form-group-custom">
              <Form.Label>Position</Form.Label>
              <Form.Control
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="E.g. Professor"
                className="input-custom"
              />
            </Form.Group>

            <Form.Group as={Col} md={6} controlId="formSalary" className="form-group-custom">
              <Form.Label>Salary</Form.Label>
              <Form.Control
                name="salary"
                type="number"
                value={formData.salary}
                onChange={handleChange}
                isInvalid={!!errors.salary}
                min="0"
                placeholder="In USD"
                className="input-custom"
              />
              <Form.Control.Feedback type="invalid">{errors.salary}</Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Form.Group className="mb-3 form-group-custom" controlId="formAddress">
            <Form.Label>Address</Form.Label>
            <Form.Control
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Full address"
              as="textarea"
              rows={2}
              className="input-custom"
            />
          </Form.Group>

          <Row className="mb-4">
            <Form.Group as={Col} md={6} controlId="formDob" className="form-group-custom">
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
            </Form.Group>

            <Form.Group as={Col} md={6} controlId="formHireDate" className="form-group-custom">
              <Form.Label>Hire Date</Form.Label>
              <Form.Control
                type="date"
                name="hire_date"
                value={formData.hire_date}
                onChange={handleChange}
                isInvalid={!!errors.hire_date}
                className="input-custom"
              />
              <Form.Control.Feedback type="invalid">{errors.hire_date}</Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="submit-btn"
            disabled={isSubmitDisabled() || loading}
          >
            {loading
              ? (editingFaculty ? 'Updating...' : 'Submitting...')
              : (editingFaculty ? 'Update Faculty' : 'Add Faculty')}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FacultyFormModal;
