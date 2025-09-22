import React from "react";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css"; // Uses same premium black theme

function DashboardCard({ title, description, icon, buttonText, onClick }) {
  return (
    <div className="dashboard-card p-4 rounded-4 shadow-sm text-white h-100">
      <div className="d-flex flex-column justify-content-between h-100">
        <div className="mb-3">
          <div className="icon-circle mb-3">{icon}</div>
          <h5 className="fw-semibold card-title">{title}</h5>
          <p className="small card-description">{description}</p>
        </div>
        <button
          className="neon-button btn btn-sm mt-auto align-self-start"
          onClick={onClick}
          aria-label={`${buttonText} ${title}`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const navigate = useNavigate();

  const sections = [
    {
      title: "My Timetable",
      description: "Check your class schedule with ease.",
      to: "/student/classes",
      icon: "📚",
      buttonText: "View",
    },
    {
      title: "Submit Feedback",
      description: "Share your feedback for faculty and courses.",
      to: "/student/feedback",
      icon: "✍️",
      buttonText: "Submit",
    },
  ];

  return (
    <main className="dashboard-container container mt-5">
      <header className="text-center mb-5">
        <h2 className="dashboard-title fw-bold mb-1">Student Dashboard</h2>
        <p className="dashboard-subtitle">Manage your academic activities easily</p>
      </header>

      <section className="row g-4 justify-content-center">
        {sections.map(({ title, description, to, icon, buttonText }, idx) => (
          <div key={idx} className="col-sm-6 col-lg-4">
            <DashboardCard
              title={title}
              description={description}
              icon={icon}
              buttonText={buttonText}
              onClick={() => navigate(to)}
            />
          </div>
        ))}
      </section>
    </main>
  );
}
