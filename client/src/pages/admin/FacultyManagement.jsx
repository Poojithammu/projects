import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FacultyTable from './FacultyTable';
import FacultyFormModal from './FacultyFormModal';

const FacultyManagement = () => {
  const [faculties, setFaculties] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);

  const fetchFaculties = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('https://fms-backend-a1b0.onrender.com/api/admin/faculties', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setFaculties(res.data);
  };

  useEffect(() => {
    fetchFaculties();
  }, []);

  const handleAddClick = () => {
    setEditingFaculty(null); // blank form
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this faculty?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://fms-backend-a1b0.onrender.com/api/admin/faculties/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        toast.success('Faculty deleted successfully');

        fetchFaculties(); // Await the fetch to complete
      } catch (error) {
        console.error('Error deleting faculty:', error);
        toast.error('Failed to delete faculty');
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Faculty Management</h2>
      <button className="btn btn-primary mb-3" onClick={handleAddClick}>
        Add New Faculty
      </button>

      <FacultyTable
        faculties={faculties}
        onEdit={(faculty) => {
          setEditingFaculty(faculty);
          setShowModal(true);
        }}
        onDelete={handleDelete}
      />

      <FacultyFormModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onRefresh={fetchFaculties}
        editingFaculty={editingFaculty}
      />
    </div>
  );
};

export default FacultyManagement;
