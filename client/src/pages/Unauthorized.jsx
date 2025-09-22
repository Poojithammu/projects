import React from "react";
import { Link } from "react-router-dom";
import "./Unauthorized.css";

export default function Unauthorized() {
  return (
    <div className="unauthorized-container d-flex flex-column justify-content-center align-items-center vh-100 text-center px-3">
      <h1 className="display-1 text-danger mb-4">403</h1>
      <h2 className="mb-3">Unauthorized Access</h2>
      <p className="mb-4 text-secondary">
        You do not have permission to view this page.
      </p>
      <Link to="/login" className="btn btn-primary btn-lg">
        Go to Login
      </Link>
    </div>
  );
}
