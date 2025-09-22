import React from 'react';
import "./StudentTable.css"; // Create this file

const StudentTable = ({ students, onEdit, onDelete }) => {
    return (
        <div className="student-table-wrapper">
            <div className="table-responsive">
                <table className="table table-striped table-hover mb-0 text-white align-middle">
                    <thead className="table-dark sticky-header">
                        <tr>
                            <th style={{ minWidth: '160px' }}>Name</th>
                            <th style={{ minWidth: '220px' }}>Email</th>
                            <th style={{ minWidth: '120px' }}>Roll No</th>
                            <th style={{ minWidth: '160px' }}>Department</th>
                            <th style={{ minWidth: '100px' }}>Year</th>
                            <th style={{ minWidth: '140px' }}>Phone</th>
                            <th style={{ minWidth: '160px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student._id} className="table-row-hover">
                                <td>{student.user?.name}</td>
                                <td>{student.user?.email}</td>
                                <td>{student.rollNumber}</td>
                                <td>{student.department}</td>
                                <td>{student.year}</td>
                                <td>{student.phone}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-outline-info me-2"
                                        onClick={() => onEdit(student)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => onDelete(student._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {students.length === 0 && (
                            <tr>
                                <td colSpan="7" className="text-center text-muted py-3">
                                    No student records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentTable;
