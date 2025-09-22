import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FacultyTable from './FacultyTable';
import FacultyFormModal from './FacultyFormModal';
import { Button, Container } from 'react-bootstrap';

const AdminFacultyPage = () => {
    const [faculties, setFaculties] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingFaculty, setEditingFaculty] = useState(null);

    const token = localStorage.getItem('token');

    // Fetch all faculties
    const fetchFaculties = async () => {
        try {
            const res = await axios.get('https://fms-backend-a1b0.onrender.com/api/admin/faculties', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setFaculties(res.data);
        } catch (error) {
            console.error('Error fetching faculty data:', error);
        }
    };

    // Delete a faculty by id
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this faculty?')) return;
        try {
            await axios.delete(`https://fms-backend-a1b0.onrender.com/api/admin/faculties/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchFaculties();
        } catch (error) {
            console.error('Failed to delete faculty', error);
        }
    };

    useEffect(() => {
        fetchFaculties();
    }, []);

    const handleAddClick = () => {
        setEditingFaculty(null);
        setShowModal(true);
    };

    const handleEditClick = (faculty) => {
        setEditingFaculty(faculty);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingFaculty(null);
    };

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Faculty Management</h3>
                <Button variant="primary" onClick={handleAddClick}>
                    Add New Faculty
                </Button>
            </div>

            <FacultyTable
                faculties={faculties}
                onEdit={handleEditClick}
                onDelete={handleDelete}
            />

            <FacultyFormModal
                show={showModal}
                onHide={handleCloseModal}
                onRefresh={fetchFaculties}
                editingFaculty={editingFaculty}
            />
        </Container>
    );
};

export default AdminFacultyPage;
