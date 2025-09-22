import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './LeaveApprovalDashboard.css';

const LeaveApprovalDashboard = () => {
    const [leaves, setLeaves] = useState([]);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedLeaveId, setSelectedLeaveId] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');

    const fetchLeaves = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://fms-backend-a1b0.onrender.com/api/admin/leave-requests', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setLeaves(response.data.leaves);
        } catch (error) {
            console.error('Error fetching leaves:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const handleStatusUpdate = async (id, newStatus) => {
        if (newStatus === 'rejected') {
            setSelectedLeaveId(id);
            setShowModal(true);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `https://fms-backend-a1b0.onrender.com/api/admin/leave-requests/${id}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchLeaves();
        } catch (error) {
            console.error('Error updating leave status:', error);
        }
    };

    const submitRejection = async () => {
        if (!rejectionReason.trim()) {
            alert('Please enter a rejection reason.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `https://fms-backend-a1b0.onrender.com/api/admin/leave-requests/${selectedLeaveId}/status`,
                { status: 'rejected', rejectedReason: rejectionReason },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setShowModal(false);
            setRejectionReason('');
            fetchLeaves();
        } catch (error) {
            console.error('Error submitting rejection:', error);
        }
    };

    const filteredLeaves =
        filter === 'All' ? leaves : leaves.filter((leave) => leave.status === filter.toLowerCase());

    return (
        <div className="leave-dashboard-container container mt-5">
            <h2 className="dashboard-title text-center mb-4">🗂️ Leave Approval Dashboard</h2>

            <div className="d-flex justify-content-end mb-3">
                <select
                    className="custom-select"
                    onChange={(e) => setFilter(e.target.value)}
                    value={filter}
                >
                    <option value="All">All</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            {loading ? (
                <div className="text-center text-light">Loading leave requests...</div>
            ) : filteredLeaves.length === 0 ? (
                <div className="alert text-center">No leave requests found.</div>
            ) : (
                <table className="table table-dark table-hover glass-table">
                    <thead>
                        <tr>
                            <th>Faculty</th>
                            <th>Type</th>
                            <th>Reason</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Status</th>
                            <th>Rejection Reason</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLeaves.map((leave) => (
                            <tr key={leave._id}>
                                <td>{leave.faculty?.user?.name || 'Unknown'}</td>
                                <td>{leave.type}</td>
                                <td>{leave.reason}</td>
                                <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                                <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                                <td>
                                    <span className={`status-badge ${leave.status}`}>
                                        {leave.status.toUpperCase()}
                                    </span>
                                </td>
                                <td>
                                    {leave.status === 'rejected' ? (
                                        <span className="text-danger">{leave.rejectedReason || '—'}</span>
                                    ) : (
                                        '—'
                                    )}
                                </td>
                                <td>
                                    {leave.status === 'pending' && (
                                        <>
                                            <button
                                                className="neon-btn green me-2"
                                                onClick={() => handleStatusUpdate(leave._id, 'approved')}
                                            >
                                                ✅ Approve
                                            </button>
                                            <button
                                                className="neon-btn red"
                                                onClick={() => handleStatusUpdate(leave._id, 'rejected')}
                                            >
                                                ❌ Reject
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {showModal && (
                <div className="rejection-modal">
                    <div className="modal-card">
                        <h5 className="text-white">Enter Rejection Reason</h5>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Reason for rejecting the leave..."
                        />
                        <div className="modal-buttons">
                            <button className="neon-btn red" onClick={submitRejection}>Submit</button>
                            <button className="neon-btn grey" onClick={() => setShowModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeaveApprovalDashboard;
