import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import "./FacultyTable.css";

const FacultyTable = ({ faculties, onEdit, onDelete }) => {
    return (
        <div className="table-wrapper">
            <div className="table-responsive">
                <table className="table table-striped table-hover mb-0 text-white align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th style={{ minWidth: '160px' }}>Name</th>
                            <th style={{ minWidth: '220px' }}>Email</th>
                            <th style={{ minWidth: '140px' }}>Department</th>
                            <th style={{ minWidth: '140px' }}>Phone</th>
                            <th style={{ minWidth: '140px' }}>Position</th>
                            <th style={{ minWidth: '120px', textAlign: 'right' }}>Salary</th>
                            <th style={{ minWidth: '160px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {faculties.map((f) => (
                            <tr key={f._id} className="table-row-hover">
                                <td title={f.user?.name}>{f.user?.name}</td>
                                <td title={f.user?.email}>{f.user?.email}</td>
                                <td>{f.department}</td>
                                <td>{f.phone}</td>
                                <td>{f.position}</td>
                                <td style={{ textAlign: 'right', fontFamily: 'monospace' }}>
                                    ₹{f.salary?.toLocaleString()}
                                </td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => onEdit(f)}
                                        aria-label={`Edit faculty ${f.user?.name}`}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => onDelete(f._id)}
                                        aria-label={`Delete faculty ${f.user?.name}`}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {faculties.length === 0 && (
                            <tr>
                                <td colSpan="7" className="text-center text-muted py-3">
                                    No faculty records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FacultyTable;
