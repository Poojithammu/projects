import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FiLogIn } from "react-icons/fi";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import "./Login.css";

const Login = () => {
  const [selected, setSelected] = useState("Admin"); // UI-only role selection
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      toast.error("Email is required");
      return false;
    } else if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      return false;
    }

    if (!password) {
      toast.error("Password is required");
      return false;
    } else if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const res = await axios.post("https://fms-backend-a1b0.onrender.com/api/auth/login", {
        email,
        password,
      });

      const token = res.data.token;
      login(token);

      const decoded = JSON.parse(atob(token.split('.')[1]));
      const role = decoded.role;

      if (role === "admin") navigate("/admin");
      else if (role === "faculty") navigate("/faculty");
      else if (role === "student") navigate("/student");
      else navigate("/dashboard");

    } catch (err) {
      console.error("Login failed", err);
      toast.error("Login failed. Check your credentials.");
    }
  };

  return (
    <div className="login-bg d-flex justify-content-center align-items-center vh-100">
      <div className="login-card-glass p-5">
        <h2 className="text-center login-title mb-3">Faculty Management System</h2>

        {/* Role Selection Tabs (view-only) */}
        <div className="d-flex justify-content-center gap-3 mb-4">
          {["Admin", "Faculty", "Student"].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setSelected(role)}
              className={`role-tab ${selected === role ? "active-role-tab" : "inactive-role-tab"}`}
            >
              {role}
            </button>
          ))}
        </div>

        <h5 className="text-center login-subtitle mb-4">{selected} Login</h5>

        <form onSubmit={handleLogin}>
          <div className="form-group-custom mb-4">
            <label className="form-label-custom">Email address</label>
            <input
              type="email"
              className="form-control-custom"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group-custom mb-4">
            <label className="form-label-custom">Password</label>
            <div className="position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control-custom pe-5"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span onClick={togglePasswordVisibility} className="password-toggle-icon">
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>
          </div>

          <button type="submit" className="btn-neon w-100 d-flex justify-content-center align-items-center gap-2">
            Login <FiLogIn />
          </button>

          <br></br>

        </form>
        <div className="text-end">
          <a href="/forgot-password" className="text-light text-decoration-none small">
            Forgot password?
          </a>
        </div>


        <p className="mt-4 text-center text-light small">Developed by FMS-TEAM</p>
      </div>
    </div>
  );
};

export default Login;
