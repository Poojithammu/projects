import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './Form.css'
import { useNavigate } from "react-router-dom";

const FO_NAMES = [
    "Anurag Kumar",
    "Suraj Kumar",
    "Pandav Kumar",
    "Anish Kumar",
    "Rohit Kumar",
    "Deepak Kumar",
    "Rakesh Kumar",
];


const KYC_OPTIONS = ["Aadhar Card", "Voter Card", "Ration Card", "Pan Card"];

const PRODUCT_PRICES = {
    "Mixer Grinder": 3299,
    "Induction Stove": 2999,
    "Iron": 1899,
    "Sewing Machine": 3499,
    "Hot Pot": 1899,
    "Fan": 2499,
    "Cooker": 2399,
    "Cooler": 4499,
    "Android TV 32 Inch": 5499,
};

const PRODUCT_NAMES = Object.keys(PRODUCT_PRICES);

const ProposalEntry = ({ onSubmit }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        branch: "",
        branchCode: "",
        foName: "",
        date: "",
        village: "",
        groupName: "",
        groupCode: "",
        memberName: "",
        coApplicantName: "",
        mobileNumber: "",
        loanAmount: "",
        kycCollected: [],
        productName: "",
        productAmount: "",
        remarks: "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === "productName") {
            const price = PRODUCT_PRICES[value] || "";
            setFormData((prev) => ({
                ...prev,
                productName: value,
                productAmount: price,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
                loanAmount: 50000, // Always fixed
            }));
        }
        if (type === "checkbox") {
            // kycCollected multiple select
            let newKyc = [...formData.kycCollected];
            if (checked) {
                newKyc.push(value);
            } else {
                newKyc = newKyc.filter((k) => k !== value);
            }
            setFormData((prev) => ({ ...prev, kycCollected: newKyc }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.branch.trim()) newErrors.branch = "Branch is required";
        if (!formData.branchCode.trim()) newErrors.branchCode = "Branch code is required";
        if (!formData.foName) newErrors.foName = "Field Officer Name is required";
        if (!formData.date) newErrors.date = "Date is required";
        if (!formData.village.trim()) newErrors.village = "Village is required";
        if (!formData.groupName.trim()) newErrors.groupName = "Group name is required";
        if (!formData.groupCode.trim()) newErrors.groupCode = "Group code is required";
        if (!formData.memberName.trim()) newErrors.memberName = "Member name is required";

        if (!formData.mobileNumber.match(/^[6-9]\d{9}$/))
            newErrors.mobileNumber = "Mobile number must be a valid 10-digit number starting with 6-9";

        if (!formData.loanAmount || Number(formData.loanAmount) < 1000)
            newErrors.loanAmount = "Loan amount must be at least ₹1000";

        if (formData.kycCollected.length === 0) newErrors.kycCollected = "Select at least one KYC document";

        if (!formData.productName) newErrors.productName = "Select a product";
        if (!formData.productAmount || Number(formData.productAmount) < 1000)
            newErrors.productAmount = "Product amount must be at least ₹1000";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const submitData = {
            branch: formData.branch.trim(),
            branchCode: formData.branchCode.trim(),
            foName: formData.foName,
            date: formData.date,
            village: formData.village.trim(),
            groupName: formData.groupName.trim(),
            groupCode: formData.groupCode.trim(),
            memberName: formData.memberName.trim(),
            coApplicantName: formData.coApplicantName.trim() || undefined,
            mobileNumber: formData.mobileNumber,
            loanAmount: Number(formData.loanAmount),
            kycCollected: formData.kycCollected,
            product: {
                name: formData.productName,
                amount: Number(formData.productAmount),
            },
            remarks: formData.remarks.trim(),
        };

        try {
            const token = localStorage.getItem("token");

            const response = await axios.post(
                "https://vercel-backend-vnvy.onrender.com/api/submit-form",
                submitData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success("✅ Form submitted successfully!");

            navigate('/success');
            // You can optionally clear form here if needed
            // setFormData({ ...initial values ... });
        } catch (error) {
            toast.error(
                "Failed to submit form: " +
                (error.response?.data?.message || error.message)
            );
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} noValidate style={{ maxWidth: 600, margin: "auto" }}>
                {/* Branch */}
                <label>
                    Branch *
                    <input
                        type="text"
                        name="branch"
                        value={formData.branch}
                        onChange={handleChange}
                        required
                    />
                    {errors.branch && <p style={{ color: "red" }}>{errors.branch}</p>}
                </label>

                {/* Branch Code */}
                <label>
                    Branch Code *
                    <input
                        type="text"
                        name="branchCode"
                        value={formData.branchCode}
                        onChange={handleChange}
                        required
                    />
                    {errors.branchCode && <p style={{ color: "red" }}>{errors.branchCode}</p>}
                </label>

                {/* FO Name */}
                <label>
                    Field Officer Name *
                    <select name="foName" value={formData.foName} onChange={handleChange} required>
                        <option value="">-- Select FO Name --</option>
                        {FO_NAMES.map((name) => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                    </select>
                    {errors.foName && <p style={{ color: "red" }}>{errors.foName}</p>}
                </label>

                {/* Date */}
                <label>
                    Date *
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                    {errors.date && <p style={{ color: "red" }}>{errors.date}</p>}
                </label>

                {/* Village */}
                <label>
                    Village *
                    <input
                        type="text"
                        name="village"
                        value={formData.village}
                        onChange={handleChange}
                        required
                    />
                    {errors.village && <p style={{ color: "red" }}>{errors.village}</p>}
                </label>

                {/* Group Name */}
                <label>
                    Group Name *
                    <input
                        type="text"
                        name="groupName"
                        value={formData.groupName}
                        onChange={handleChange}
                        required
                    />
                    {errors.groupName && <p style={{ color: "red" }}>{errors.groupName}</p>}
                </label>

                {/* Group Code */}
                <label>
                    Group Code *
                    <input
                        type="text"
                        name="groupCode"
                        value={formData.groupCode}
                        onChange={handleChange}
                        required
                    />
                    {errors.groupCode && <p style={{ color: "red" }}>{errors.groupCode}</p>}
                </label>

                {/* Member Name */}
                <label>
                    Member Name *
                    <input
                        type="text"
                        name="memberName"
                        value={formData.memberName}
                        onChange={handleChange}
                        required
                    />
                    {errors.memberName && <p style={{ color: "red" }}>{errors.memberName}</p>}
                </label>

                {/* Co-Applicant Name */}
                <label>
                    Co-Applicant Name
                    <input
                        type="text"
                        name="coApplicantName"
                        value={formData.coApplicantName}
                        onChange={handleChange}
                    />
                </label>

                {/* Mobile Number */}
                <label>
                    Mobile Number *
                    <input
                        type="tel"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        required
                        placeholder="10-digit mobile number"
                    />
                    {errors.mobileNumber && <p style={{ color: "red" }}>{errors.mobileNumber}</p>}
                </label>

                {/* Loan Amount */}
                <label>
                    Loan Amount (₹) *
                    <input
                        type="number"
                        name="loanAmount"
                        value={formData.loanAmount || 50000}
                        readOnly
                    />
                </label>

                {/* KYC Collected (checkbox group) */}
                <fieldset>
                    <legend>KYC Collected *</legend>
                    {KYC_OPTIONS.map((doc) => (
                        <label key={doc} style={{ marginRight: 10 }}>
                            <input
                                type="checkbox"
                                name="kycCollected"
                                value={doc}
                                checked={formData.kycCollected.includes(doc)}
                                onChange={handleChange}
                            />
                            {doc}
                        </label>
                    ))}
                    {errors.kycCollected && <p style={{ color: "red" }}>{errors.kycCollected}</p>}
                </fieldset>

                {/* Product Name */}
                <label>
                    Product Name *
                    <select
                        name="productName"
                        value={formData.productName}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Select Product --</option>
                        {PRODUCT_NAMES.map((prod) => (
                            <option key={prod} value={prod}>
                                {prod}
                            </option>
                        ))}
                    </select>
                    {errors.productName && <p style={{ color: "red" }}>{errors.productName}</p>}
                </label>

                {/* Product Amount */}
                {/* Product Amount */}
                <label>
                    Product Amount (₹) *
                    <input
                        type="number"
                        name="productAmount"
                        value={formData.productAmount}
                        readOnly
                    />
                </label>

                {/* Remarks */}
                <label>
                    Remarks
                    <textarea
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Additional notes"
                    />
                </label>

                <button type="submit" style={{ marginTop: 15 }}>
                    Submit
                </button>
            </form>
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    );
};

export default ProposalEntry;
