import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import './Login.css'; // reuse your premium theme

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleReset = async (e) => {
        e.preventDefault();

        if (!newPassword || !confirmPassword) {
            return toast.error("All fields are required");
        }

        if (newPassword.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }

        if (newPassword !== confirmPassword) {
            return toast.error("Passwords do not match");
        }

        try {
            await axios.post(`https://fms-backend-a1b0.onrender.com/api/auth/reset-password/${token}`, {
                newPassword,
            });

            toast.success("Password reset successful");
            navigate("/login");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Reset failed");
        }
    };

    return (
        <div className="login-bg d-flex justify-content-center align-items-center vh-100">
            <div className="login-card-glass p-5 rounded">
                <h2 className="text-center login-title mb-4">Reset Password</h2>

                <form onSubmit={handleReset}>
                    <div className="form-group-custom mb-4">
                        <label className="form-label-custom">New Password</label>
                        <input
                            type="password"
                            className="form-control-custom"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>

                    <div className="form-group-custom mb-4">
                        <label className="form-label-custom">Confirm Password</label>
                        <input
                            type="password"
                            className="form-control-custom"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn-neon w-100 mt-2">
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
