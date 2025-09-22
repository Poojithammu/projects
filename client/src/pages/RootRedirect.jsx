// src/components/RootRedirect.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RootRedirect = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Redirect based on role
  switch (user.role) {
    case "admin":
      return <Navigate to="/admin" />;
    case "faculty":
      return <Navigate to="/faculty" />;
    case "student":
      return <Navigate to="/student" />;
    default:
      return <Navigate to="/login" />;
  }
};

export default RootRedirect;
