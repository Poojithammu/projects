import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyLeaveStatusPage.css';
import { FaCheckCircle, FaTimesCircle, FaClock, FaCalendarAlt } from 'react-icons/fa';

const MyLeaveStatusPage = () => {
  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://fms-backend-a1b0.onrender.com/api/faculty/my-leaves', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLeaves(res.data.leaves);
      } catch (err) {
        console.error('Error fetching leave status:', err);
        setError('Failed to load leave status');
      }
    };

    fetchLeaves();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <FaCheckCircle className="text-neon-success me-2" />;
      case 'rejected':
        return <FaTimesCircle className="text-neon-danger me-2" />;
      default:
        return <FaClock className="text-neon-warning me-2" />;
    }
  };

  return (
    <div className="container mt-5 my-leave-status-container py-4">
      <h2 className="text-center mb-5 neon-title">📅 My Leave Status</h2>

      {error && <div className="alert alert-danger text-neon-danger text-center">{error}</div>}

      {leaves.length === 0 ? (
        <div className="alert alert-dark text-center text-neon">You haven't applied for any leaves yet.</div>
      ) : (
        <div className="row g-4">
          {leaves.map((leave) => (
            <div key={leave._id} className="col-md-6">
              <div className="glass-card leave-card p-4">
                <h5 className="neon-subtitle mb-3">
                  <FaCalendarAlt className="me-2 text-neon-icon" />
                  {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                </h5>
                <p className="text-light">
                  <strong>Type:</strong> {leave.type} <br />
                  <strong>Reason:</strong> {leave.reason}
                </p>
                <div className="card-status mt-2">
                  <strong>Status:</strong> {getStatusIcon(leave.status)}
                  <span className="text-neon">
                    {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                  </span>
                </div>

                {leave.status === 'rejected' && leave.rejectedReason && (
                  <p className="text-neon-danger mt-2">
                    <strong>Rejection Reason:</strong> <em>{leave.rejectedReason}</em>
                  </p>
                )}

                <p className="feedback-date text-muted mt-3">
                  Applied on {new Date(leave.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyLeaveStatusPage;
