import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminFeedbackPage.css'; // Optional: custom styles

const AdminFeedbackPage = () => {
    const [summary, setSummary] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await axios.get('https://fms-backend-a1b0.onrender.com/api/admin/feedbacks', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setSummary(res.data.summary);
            } catch (error) {
                console.error('Error fetching feedback summary:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, [token]);

    return (
        <div className="container mt-5 admin-feedback-container">
            <h2 className="text-center mb-4">📊 Faculty Feedback Summary</h2>

            {loading ? (
                <div className="text-center">Loading...</div>
            ) : summary.length === 0 ? (
                <div className="alert alert-info text-center">No feedback data available.</div>
            ) : (
                <div className="row">
                    {summary.map((fb) => (
                        <div key={fb.facultyId} className="col-md-6 mb-4">
                            <div className="card shadow-sm feedback-card">
                                <div className="card-body">
                                    <h5 className="card-title">
                                        👨‍🏫 {fb.facultyName}
                                    </h5>
                                    <p className="card-text">
                                        ⭐ <strong>Average Rating:</strong> {fb.averageRating}/5 <br />
                                        📝 <strong>Total Feedbacks:</strong> {fb.totalFeedbacks}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminFeedbackPage;
