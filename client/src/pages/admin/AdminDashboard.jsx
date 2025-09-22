import React from "react";
import { Link } from "react-router-dom";
import "./AdminDashboard.css";

function DashboardCard({ title, description, to, icon }) {
  return (
    <div className="dashboard-card p-4 rounded-4 shadow-sm text-white h-100">
      <div className="d-flex flex-column justify-content-between h-100">
        <div className="mb-3">
          <div className="icon-circle mb-3">{icon}</div>
          <h5 className="fw-semibold">{title}</h5>
          <p className="small">{description}</p>
        </div>
        <Link
          to={to}
          className="btn btn-outline-light btn-sm mt-auto align-self-start"
          aria-label={`Go to ${title}`}
        >
          View
        </Link>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const sections = [
    {
      title: "Faculty Management",
      description: "View, add, or manage faculty records.",
      to: "/admin/faculties",
      icon: "👨‍🏫",
    },
    {
      title: "Student Management",
      description: "Manage student accounts and data.",
      to: "/admin/students",
      icon: "🎓",
    },
    {
      title: "Leave Approvals",
      description: "Approve or reject faculty leave requests.",
      to: "/admin/leave-requests",
      icon: "📝",
    },
    {
      title: "Feedback Overview",
      description: "Analyze faculty feedback submitted by students.",
      to: "/admin/feedbacks",
      icon: "💬",
    },
    {
      title: "Create Timetable",
      description: "Create Timetable Entry",
      to: "/admin/timetable/create",
      icon: "📅",
    },
    {
      title: "View Timetable",
      description: "View Timetable Entries",
      to: "/admin/timetable",
      icon: "📅",
    },
  ];

  return (
    <div className="dashboard-container container mt-5">
      <div className="text-center mb-5">
        <h2 className="dashboard-title">Admin Dashboard</h2>
        <p className="dashboard-subtitle">
          Manage system settings and academic operations
        </p>
      </div>

      <div className="row g-4">
        {sections.map((section, idx) => (
          <div key={idx} className="col-sm-6 col-lg-4">
            <DashboardCard {...section} />
          </div>
        ))}
      </div>
    </div>
  );
}
