import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Success.css';
import { useAuth } from '../context/AuthContext'; // adjust path if needed

export default function Success() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get logged-in user with role

  useEffect(() => {
    toast.success("✅ Form submitted successfully!");
  }, []);

  const handleGoHome = () => {
    if (user?.role === 'admin') {
      navigate('/admin');
    } else if (user?.role === 'customer') {
      navigate('/home');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="success-container">
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
        theme="colored" 
      />

      <h1>🎉 Submission Successful!</h1>
      <p>Thank you. Your form has been submitted successfully.</p>
      <button className="btn-back" onClick={handleGoHome}>
        Go to Home
      </button>
    </div>
  );
}

