import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "./Register.css"; // 👈 CSS import

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    terms: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    document.getElementById("name")?.focus();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirm_password, terms } = formData;

    if (!name.trim()) return toast.error("⚠️ Name is required");
    if (!validateEmail(email)) return toast.error("⚠️ Enter a valid email address");
    if (password.length < 6) return toast.error("⚠️ Password must be at least 6 characters");
    if (password !== confirm_password) return toast.error("⚠️ Passwords do not match");
    if (!terms) return toast.error("⚠️ You must agree to the Terms & Privacy");

    try {
      const response = await fetch("https://vercel-backend-vnvy.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");
      toast.success("✅ Registration successful!");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

      setFormData({
        name: "",
        email: "",
        password: "",
        confirm_password: "",
        terms: false,
      });
    } catch (error) {
      toast.error(`⚠️ ${error.message}`);
    }
  };

  return (
    <div className="register-body">
      <div className="register-container">
        <h1 className="register-heading">Utsab Micro Finance Pvt. Ltd.</h1>
        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="name" className="register-label">Name</label>
          <input
            className="register-input"
            type="text"
            id="name"
            name="name"
            placeholder="Your full name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="email" className="register-label">Email Address</label>
          <input
            className="register-input"
            type="email"
            id="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password" className="register-label">Password (min 6 characters)</label>
          <input
            className="register-input"
            type="password"
            id="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label htmlFor="confirm_password" className="register-label">Confirm Password</label>
          <input
            className="register-input"
            type="password"
            id="confirm_password"
            name="confirm_password"
            placeholder="Confirm password"
            value={formData.confirm_password}
            onChange={handleChange}
            required
          />

          <div className="register-terms">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
              required
              className="register-checkbox"
            />
            <label htmlFor="terms">
              I agree to the{" "}
              <button
                type="button"
                onClick={() => alert("Terms & Privacy page coming soon")}
                className="register-link-button"
              >
                Terms & Privacy
              </button>
            </label>
          </div>

          <button type="submit" className="register-button">Register</button>
        </form>
      </div>
      <ToastContainer position="bottom-center" />
    </div>
  );
};

export default Register;
