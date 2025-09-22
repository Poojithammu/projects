import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StudentTable from './StudentTable';
import StudentFormModal from './StudentFormModal';

const AdminStudentPage = () => {
    const [students, setStudents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editStudent, setEditStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const res = await axios.get('https://fms-backend-a1b0.onrender.com/api/admin/students', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStudents(res.data);
        } catch (err) {
            console.error('Failed to fetch students', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleAdd = () => {
        setEditStudent(null);
        setShowModal(true);
    };

    const handleEdit = (student) => {
        setEditStudent(student);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await axios.delete(`https://fms-backend-a1b0.onrender.com/api/admin/students/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                fetchStudents();
            } catch (err) {
                console.error('Failed to delete student', err);
            }
        }
    };

    const updateStudent = async (id, formData) => {
        try {
            await axios.put(`https://fms-backend-a1b0.onrender.com/api/admin/students/${id}`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (err) {
            console.error('Failed to update student', err);
        }
    };

    const addStudent = async (formData) => {
        try {
            await axios.post('https://fms-backend-a1b0.onrender.com/api/admin/students', formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (err) {
            console.error('Failed to add student', err);
        }
    };

    const handleSave = async (formData) => {
        try {
            if (editStudent) {
                await updateStudent(editStudent._id, formData);
            } else {
                await addStudent(formData);
            }
            setShowModal(false);
            fetchStudents();
        } catch (err) {
            console.error('Failed to save student', err);
        }
    };

    return (
        <div className="container mt-4">
            <h3 className="mb-3">Student Management</h3>
            <button className="btn btn-success mb-2" onClick={handleAdd}>
                Add Student
            </button>

            {loading ? (
                <div>Loading students...</div>
            ) : (
                <>
                    <StudentTable students={students} onEdit={handleEdit} onDelete={handleDelete} />
                    <StudentFormModal
                        show={showModal}
                        onHide={() => setShowModal(false)}
                        onRefresh={fetchStudents}  
                        handleSave={handleSave}
                        editingStudent={editStudent}  // <-- name matches modal prop
                    />
                </>
            )}
        </div>
    );
};

export default AdminStudentPage;
