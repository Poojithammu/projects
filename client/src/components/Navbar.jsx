import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, NavLink, Link } from "react-router-dom";
import './Navbar.css';

const Navbar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getHomePath = () => {
    if (user?.role === "admin") return "/admin";
    if (user?.role === "faculty") return "/faculty";
    if (user?.role === "student") return "/student";
    return "/login";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-glass sticky-top">
      <div className="container">
        <Link className="navbar-brand neon-brand" to={getHomePath()}>
          FMS <span className="brand-highlight">Portal</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-3">
            <li className="nav-item">
              <Link to={getHomePath()} className="nav-link nav-glow">
                Home
              </Link>
            </li>

            <li className="nav-item">
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  "nav-link nav-glow" + (isActive ? " active-link" : "")
                }
              >
                Profile
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  "nav-link nav-glow" + (isActive ? " active-link" : "")
                }
              >
                Contact Us
              </NavLink>
            </li>

            <li className="nav-item">
              <button className="btn btn-outline-neon px-4" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
