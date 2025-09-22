import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./FacultyList.css"; 

export default function FacultyList() {
  const [faculties, setFaculties] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("https://fms-backend-a1b0.onrender.com/api/student/faculties", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFaculties(res.data.faculties);
      } catch (err) {
        setError("Failed to load faculties.");
        console.error("Error fetching faculties:", err);
      }
    };

    fetchFaculties();
  }, []);

  return (
    <div className="container faculty-list-container mt-5">
      <h2 className="text-center neon-text mb-4">🎓 Select Faculty to Submit Feedback</h2>

      {error && <div className="alert alert-danger text-center">{error}</div>}

      <div className="row">
        {faculties.map((faculty) => (
          <div key={faculty._id} className="col-md-4 mb-4">
            <div className="card faculty-card shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-white">{faculty.user.name}</h5>
                <p className="card-text text-muted">{faculty.user.email}</p>
                <button
                  className="btn neon-button w-100"
                  onClick={() => navigate(`/student/feedback/form/${faculty._id}`)}
                >
                  ✍️ Give Feedback
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
