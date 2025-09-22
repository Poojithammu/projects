import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyFeedbackPage.css';

const MyFeedbackPage = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('https://fms-backend-a1b0.onrender.com/api/faculty/my-feedback', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFeedbacks(res.data.feedbacks);
            } catch (error) {
                console.error('Error fetching feedback:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeedback();
    }, []);

    return (
        <div className="container my-feedback-container py-5">
            <h2 className="text-center mb-5 feedback-title">📝 My Feedback</h2>

            {loading ? (
                <div className="text-center text-neon">Loading...</div>
            ) : feedbacks.length === 0 ? (
                <div className="alert alert-dark text-center text-neon">
                    No feedback available yet.
                </div>
            ) : (
                <div className="row g-4">
                    {feedbacks.map((fb) => (
                        <div key={fb._id} className="col-md-6">
                            <div className="feedback-card shadow glass-card p-4">
                                <h5 className="neon-text mb-3">⭐ Rating: {fb.rating}/5</h5>
                                <p className="text-white mb-2">{fb.comments || "No comments provided."}</p>
                                <p className="text-muted small mt-3">
                                    Submitted by: <strong>Unknown</strong>
                                </p>
                                <p className="feedback-date">{new Date(fb.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyFeedbackPage;
