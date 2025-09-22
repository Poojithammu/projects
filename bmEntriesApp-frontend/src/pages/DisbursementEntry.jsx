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

const DisbursementEntry = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        branch: "",
        branchCode: "",
        groupId: "",
        accountHolderName: "",
        accountNumber: "",
        ifscCode: "",
        bankBranch: "",
        mobileNumber: "",
        product: "",
        productAmount: "",
        foName: "",
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
        const requiredFields = [
            "branch", "branchCode", "groupId", "accountHolderName",
            "accountNumber", "ifscCode", "bankBranch", "mobileNumber",
            "product", "foName"
        ];

        const newErrors = {};
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
                groupId: formData.groupId,
                accountHolderName: formData.accountHolderName,
                accountNumber: formData.accountNumber,
                ifscCode: formData.ifscCode,
                bankBranch: formData.bankBranch,
                mobileNumber: formData.mobileNumber,
                foName: formData.foName,
                bmRemarks: formData.bmRemarks,
                products: [
                    {
                        name: formData.product,
                        amount: formData.productAmount
                    }
                ]
            };

            const token = localStorage.getItem("token");
            await axios.post("https://vercel-backend-vnvy.onrender.com/api/disbursement-entry", payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            toast.success("Disbursement entry submitted successfully!");
            navigate("/success");
        } catch (err) {
            toast.error(err.response?.data?.error || "Submission failed");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Disbursement Entry Form</h2>

            <label>Branch *</label>
            <input type="text" name="branch" value={formData.branch} onChange={handleChange} />
            {errors.branch && <p>{errors.branch}</p>}

            <label>Branch Code *</label>
            <input type="text" name="branchCode" value={formData.branchCode} onChange={handleChange} />
            {errors.branchCode && <p>{errors.branchCode}</p>}

            <label>Group ID *</label>
            <input type="text" name="groupId" value={formData.groupId} onChange={handleChange} />
            {errors.groupId && <p>{errors.groupId}</p>}

            <label>Account Holder Name *</label>
            <input type="text" name="accountHolderName" value={formData.accountHolderName} onChange={handleChange} />
            {errors.accountHolderName && <p>{errors.accountHolderName}</p>}

            <label>Account Number *</label>
            <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} />
            {errors.accountNumber && <p>{errors.accountNumber}</p>}

            <label>IFSC Code *</label>
            <input type="text" name="ifscCode" value={formData.ifscCode} onChange={handleChange} />
            {errors.ifscCode && <p>{errors.ifscCode}</p>}

            <label>Bank Branch *</label>
            <input type="text" name="bankBranch" value={formData.bankBranch} onChange={handleChange} />
            {errors.bankBranch && <p>{errors.bankBranch}</p>}

            <label>Mobile Number *</label>
            <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} />
            {errors.mobileNumber && <p>{errors.mobileNumber}</p>}

            <label>Field Officer *</label>
            <select name="foName" value={formData.foName} onChange={handleChange}>
                <option value="">-- Select FO Name --</option>
                {FO_NAMES.map(name => (
                    <option key={name} value={name}>{name}</option>
                ))}
            </select>
            {errors.foName && <p>{errors.foName}</p>}

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

            <fieldset>
                <legend>Product *</legend>
                <select name="product" value={formData.product} onChange={handleChange}>
                    <option value="">-- Select Product --</option>
                    {Object.keys(PRODUCT_PRICES).map((prod) => (
                        <option key={prod} value={prod}>{prod}</option>
                    ))}
                </select>
                {errors.product && <p>{errors.product}</p>}

                <input type="number" placeholder="Amount" value={formData.productAmount} readOnly />
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

export default DisbursementEntry;
