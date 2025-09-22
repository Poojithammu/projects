import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const FO_NAMES = [
    "Anurag Kumar", "Suraj Kumar", "Pandav Kumar", "Anish Kumar",
    "Rohit Kumar", "Deepak Kumar", "Rakesh Kumar"
];

const PRODUCT_PRICES = {
    "Mixer Grinder": 3299,
    "Induction Stove": 2999,
    "Iron": 1899,
    "Sewing Machine": 3499,
    "Hot Pot": 1899,
    "Fan": 2499,
    "Cooker": 2399,
    "Cooler": 4499,
    "Android TV 32 Inch": 5499
};

const BMEntryForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        branch: "",
        branchCode: "",
        foName: "",
        groupName: "",
        groupCode: "",
        memberName: "",
        disbursementDate: "",
        product: "",
        productAmount: "",
        bmRemarks: "",

        // Fixed read-only fields
        loanAmount: 50000,
        insuranceAmount: 2000,
        disbursementAmount: 48000,
        emi: 2520
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "product") {
            const amount = PRODUCT_PRICES[value] || "";
            setFormData({ ...formData, product: value, productAmount: amount });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const validate = () => {
        const newErrors = {};
        const requiredFields = [
            "branch", "branchCode", "foName",
            "groupName", "groupCode", "memberName",
            "disbursementDate", "product"
        ];

        requiredFields.forEach((field) => {
            if (!formData[field]) {
                newErrors[field] = "This field is required";
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {

            const payload = {
                branch: formData.branch,
                branchCode: formData.branchCode,
                foName: formData.foName,
                groupName: formData.groupName,
                groupCode: formData.groupCode,
                memberName: formData.memberName,
                disbursementDate: formData.disbursementDate,
                bmRemarks: formData.bmRemarks,
                products: [
                    {
                        name: formData.product,
                        amount: formData.productAmount
                    }
                ]
            };

            const token = localStorage.getItem("token");
            console.log(formData);
            await axios.post("https://vercel-backend-vnvy.onrender.com/api/bm-entry-form", payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success("BM Entry submitted successfully!");
            navigate("/success");
            
        } catch (error) {
            toast.error(error.response?.data?.message || "Submission failed");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>BM Entry Form</h2>

            <label>Branch *</label>
            <input type="text" name="branch" value={formData.branch} onChange={handleChange} />
            {errors.branch && <p>{errors.branch}</p>}

            <label>Branch Code *</label>
            <input type="text" name="branchCode" value={formData.branchCode} onChange={handleChange} />
            {errors.branchCode && <p>{errors.branchCode}</p>}

            <label>Field Officer *</label>
            <select name="foName" value={formData.foName} onChange={handleChange}>
                <option value="">-- Select FO Name --</option>
                {FO_NAMES.map((name) => (
                    <option key={name} value={name}>{name}</option>
                ))}
            </select>
            {errors.foName && <p>{errors.foName}</p>}

            <label>Group Name *</label>
            <input type="text" name="groupName" value={formData.groupName} onChange={handleChange} />
            {errors.groupName && <p>{errors.groupName}</p>}

            <label>Group Code *</label>
            <input type="text" name="groupCode" value={formData.groupCode} onChange={handleChange} />
            {errors.groupCode && <p>{errors.groupCode}</p>}

            <label>Member Name *</label>
            <input type="text" name="memberName" value={formData.memberName} onChange={handleChange} />
            {errors.memberName && <p>{errors.memberName}</p>}

            <label>Disbursement Date *</label>
            <input type="date" name="disbursementDate" value={formData.disbursementDate} onChange={handleChange} />
            {errors.disbursementDate && <p>{errors.disbursementDate}</p>}

            {/* Fixed Financial Values */}
            <fieldset>
                <legend>Financial Details</legend>

                <label>Loan Amount (₹)</label>
                <input type="number" value={formData.loanAmount} readOnly />

                <label>Insurance Amount (₹)</label>
                <input type="number" value={formData.insuranceAmount} readOnly />

                <label>Disbursement Amount (₹)</label>
                <input type="number" value={formData.disbursementAmount} readOnly />

                <label>EMI (₹)</label>
                <input type="number" value={formData.emi} readOnly />
            </fieldset>

            {/* Product Section */}
            <fieldset>
                <legend>Product *</legend>
                <select name="product" value={formData.product} onChange={handleChange}>
                    <option value="">-- Select Product --</option>
                    {Object.keys(PRODUCT_PRICES).map((prod) => (
                        <option key={prod} value={prod}>{prod}</option>
                    ))}
                </select>
                {errors.product && <p>{errors.product}</p>}

                <input
                    type="number"
                    placeholder="Amount"
                    value={formData.productAmount}
                    readOnly
                />
            </fieldset>

            <label>BM Remarks</label>
            <textarea
                name="bmRemarks"
                rows={3}
                value={formData.bmRemarks}
                onChange={handleChange}
            />

            <button type="submit">Submit</button>
        </form>
    );
};

export default BMEntryForm;
