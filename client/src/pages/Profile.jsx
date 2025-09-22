import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./Profile.css";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    studentDetails: {
      phone: "",
      address: "",
      date_of_birth: "",
      department: "",
      department_id: "",
      year: "",
      rollNumber: "",
    },
    facultyDetails: {
      phone: "",
      address: "",
      date_of_birth: "",
      department: "",
      department_id: "",
      position: "",
      salary: "",
      hire_date: "",
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});


  useEffect(() => {
    if (!user) return;

    async function fetchUserProfile() {
      try {
        const res = await fetch("https://fms-backend-a1b0.onrender.com/api/users/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        console.log(res);

        if (!res.ok) throw new Error("Failed to fetch user data");

        const data = await res.json();

        setFormData((prev) => ({
          ...prev,
          name: data.name,
          email: data.email,
          role: data.role,
          studentDetails: data.studentDetails || prev.studentDetails,
          facultyDetails: data.facultyDetails || prev.facultyDetails,
        }));

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["phone", "address", "date_of_birth"].includes(name)) {
      if (formData.role === "student") {
        setFormData((prev) => ({
          ...prev,
          studentDetails: {
            ...prev.studentDetails,
            [name]: value,
          },
        }));
      } else if (formData.role === "faculty") {
        setFormData((prev) => ({
          ...prev,
          facultyDetails: {
            ...prev.facultyDetails,
            [name]: value,
          },
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.trim().length < 3) {
      errors.name = "Name must be at least 3 characters";
    }

    // Phone validation (required and 10 digits)
    const phone = formData.role === "student" ? formData.studentDetails.phone : formData.facultyDetails.phone;
    if (!phone) {
      errors.phone = "Phone number is required";
    } else {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(phone)) {
        errors.phone = "Phone number must be exactly 10 digits";
      }
    }

    // Address required
    const address = formData.role === "student" ? formData.studentDetails.address : formData.facultyDetails.address;
    if (!address.trim()) {
      errors.address = "Address is required";
    }

    // Date of birth required and valid
    const dob = formData.role === "student" ? formData.studentDetails.date_of_birth : formData.facultyDetails.date_of_birth;

    if (!dob) {
      errors.date_of_birth = "Date of birth is required";
    } else {
      const dobDate = new Date(dob);
      if (isNaN(dobDate.getTime())) {
        errors.date_of_birth = "Date of birth is invalid";
      } else {
        const year = dobDate.getFullYear();
        const currentYear = new Date().getFullYear();

        if (year < 1900) {
          errors.date_of_birth = "Year must be 1900 or later";
        } else if (year > currentYear) {
          errors.date_of_birth = `Year cannot be in the future (max ${currentYear})`;
        }
      }
    }
    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      const body =
        formData.role === "student"
          ? {
            name: formData.name,
            studentDetails: {
              phone: formData.studentDetails.phone,
              address: formData.studentDetails.address,
              date_of_birth: formData.studentDetails.date_of_birth,
            },
          }
          : {
            name: formData.name,
            facultyDetails: {
              phone: formData.facultyDetails.phone,
              address: formData.facultyDetails.address,
              date_of_birth: formData.facultyDetails.date_of_birth,
            },
          };

      const res = await fetch("http://localhost:5000/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      alert("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading profile...</div>;
  if (error) return <div className="alert alert-danger text-center mt-5">{error}</div>;

  return (
    <div className="profile-bg d-flex justify-content-center align-items-center">
      <div className="profile-card shadow-lg p-4 rounded-4 border-0 glass-effect">
        <h2 className="mb-4 text-center text-neon">My Profile</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group-custom">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={formErrors.name ? "input-error" : ""}
            />
            {formErrors.name && <small className="text-danger">{formErrors.name}</small>}
          </div>

          <div className="form-group-custom">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" name="email" value={formData.email} disabled />
            <small className="text-muted">Email cannot be changed</small>
          </div>

          <div className="form-group-custom">
            <label htmlFor="role">Role</label>
            <input type="text" id="role" name="role" value={formData.role} disabled />
          </div>

          {/* Student Fields */}
          {formData.role === "student" && formData.studentDetails && (
            <>
              <div className="form-group-custom">
                <label htmlFor="phone">Phone</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.studentDetails.phone}
                  onChange={handleChange}
                  className={formErrors.phone ? "input-error" : ""}
                />
                {formErrors.phone && <small className="text-danger">{formErrors.phone}</small>}
              </div>
              <div className="form-group-custom">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.studentDetails.address}
                  onChange={handleChange}
                  className={formErrors.address ? "input-error" : ""}
                />
                {formErrors.address && <small className="text-danger">{formErrors.address}</small>}
              </div>
              <div className="form-group-custom">
                <label htmlFor="date_of_birth">Date of Birth</label>
                <input
                  type="date"
                  id="date_of_birth"
                  name="date_of_birth"
                  value={formData.studentDetails.date_of_birth?.slice(0, 10) || ""}
                  onChange={handleChange}
                  className={formErrors.date_of_birth ? "input-error" : ""}
                />
                {formErrors.date_of_birth && (
                  <small className="text-danger">{formErrors.date_of_birth}</small>
                )}
              </div>
            </>
          )}

          {/* Faculty Fields */}
          {formData.role === "faculty" && formData.facultyDetails && (
            <>
              <div className="form-group-custom">
                <label htmlFor="phone">Phone</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.facultyDetails.phone}
                  onChange={handleChange}
                  className={formErrors.phone ? "input-error" : ""}
                />
                {formErrors.phone && <small className="text-danger">{formErrors.phone}</small>}
              </div>
              <div className="form-group-custom">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.facultyDetails.address}
                  onChange={handleChange}
                  className={formErrors.address ? "input-error" : ""}
                />
                {formErrors.address && <small className="text-danger">{formErrors.address}</small>}
              </div>
              <div className="form-group-custom">
                <label htmlFor="date_of_birth">Date of Birth</label>
                <input
                  type="date"
                  id="date_of_birth"
                  name="date_of_birth"
                  value={formData.facultyDetails.date_of_birth?.slice(0, 10) || ""}
                  onChange={handleChange}
                  className={formErrors.date_of_birth ? "input-error" : ""}
                />
                {formErrors.date_of_birth && (
                  <small className="text-danger">{formErrors.date_of_birth}</small>
                )}
              </div>
            </>
          )}

          <button type="submit" className="btn-neon w-100 mt-3">
            Update Profile
          </button>
        </form>
      </div>
    </div>

  );
}
