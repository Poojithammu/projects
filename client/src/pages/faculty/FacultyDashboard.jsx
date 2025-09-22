import React from "react";
import { Link } from "react-router-dom";
import "../admin/AdminDashboard.css"; // Reuse global premium black theme

function DashboardCard({ title, description, to, icon }) {
  return (
    <div className="dashboard-card p-4 rounded-4 shadow-sm h-100">
      <div className="d-flex flex-column justify-content-between h-100">
        <div className="mb-3">
          <div className="icon-circle mb-3">{icon}</div>
          <h5 className="fw-semibold card-title">{title}</h5>
          <p className="small card-description">{description}</p>
        </div>
        <Link
          to={to}
          className="neon-button btn btn-sm mt-auto align-self-start"
          aria-label={`Go to ${title}`}
        >
          View
        </Link>
      </div>
    </div>
  );
}

export default function FacultyDashboard() {
  const sections = [
    {
      title: "My Classes",
      description: "View your assigned classes and schedules.",
      to: "/faculty/classes",
      icon: "📚",
    },
    {
      title: "Leave Requests",
      description: "Submit and track leave requests.",
      to: "/faculty/my-leaves",
      icon: "📝",
    },
    {
      title: "Performance Dashboard",
      description: "View your teaching performance and feedback.",
      to: "/faculty/performance",
      icon: "📈",
    },
    {
      title: "My Feedbacks",
      description: "View your given feedbacks.",
      to: "/faculty/feedback",
      icon: "💬",
    },
    {
      title: "Apply Leave",
      description: "Apply for a leave.",
      to: "/faculty/apply-leave",
      icon: "✍️",
    },
  ];

  return (
    <div className="dashboard-container container mt-5">
      <div className="text-center mb-5">
        <h2 className="dashboard-title">Faculty Dashboard</h2>
        <p className="dashboard-subtitle">
          Manage your classes, leaves, feedback, and performance
        </p>
      </div>

      <div className="row g-4 justify-content-center">
        {sections.map((section, idx) => (
          <div key={idx} className="col-sm-6 col-lg-4">
            <DashboardCard {...section} />
          </div>
        ))}
      </div>
    </div>
  );
}
