import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./FeedbackForm.css"; // External CSS here

export default function FeedbackForm() {
  const { facultyId } = useParams();
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (rating < 1 || rating > 5) errs.rating = "Rating must be between 1 and 5.";
    if (!comments || comments.trim().length < 5)
      errs.comments = "Comments must be at least 5 characters.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error("Please fix the errors before submitting.");
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "https://fms-backend-a1b0.onrender.com/api/student/feedback",
        { facultyId, rating, comments },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.message || "Feedback submitted!");
      setRating(5);
      setComments("");
      setTimeout(() => navigate("/student"), 3000);
    } catch (error) {
      toast.error("Error submitting feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="feedback-form-container container mt-5 p-4">
      <h2 className="form-title text-center mb-4">Submit Feedback</h2>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group-custom">
          <label className="form-label">Faculty ID</label>
          <input
            type="text"
            className="form-control"
            value={facultyId}
            readOnly
          />
        </div>

        <div className="form-group-custom">
          <label className="form-label">Rating (1 to 5)</label>
          <input
            type="number"
            className={`form-control ${errors.rating ? "is-invalid" : ""}`}
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            disabled={submitting}
          />
          {errors.rating && <div className="invalid-feedback">{errors.rating}</div>}
        </div>

        <div className="form-group-custom">
          <label className="form-label">Comments</label>
          <textarea
            className={`form-control ${errors.comments ? "is-invalid" : ""}`}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows="4"
            disabled={submitting}
          />
          {errors.comments && <div className="invalid-feedback">{errors.comments}</div>}
        </div>

        <button
          type="submit"
          className="btn btn-outline-neon w-100 mt-3"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
}
