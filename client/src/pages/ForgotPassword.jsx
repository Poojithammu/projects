import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import './Login.css'; // Reuse your premium theme

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error("Email is required");
            return;
        }

        if (!validateEmail(email)) {
            toast.error("Invalid email format");
            return;
        }

        try {
            const res = await axios.post("https://fms-backend-a1b0.onrender.com/api/auth/forgot-password", { email });
            const token = res.data; 
            toast.success("Redirecting to reset password...");
            navigate(`/reset-password/${token}`);
        } catch (err) {
            console.error("Error:", err);
            toast.error(err.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="login-bg d-flex justify-content-center align-items-center vh-100">
            <div className="login-card-glass p-5">
                <h2 className="text-center login-title mb-4">Forgot Password</h2>
                <p className="text-center text-light mb-4">
                    Enter your email address
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group-custom mb-4">
                        <label className="form-label-custom">Email Address</label>
                        <input
                            type="email"
                            className="form-control-custom"
                            placeholder="Enter your registered email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn-neon w-100">
                        Send Reset Link
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
