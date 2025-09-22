import mongoose from "mongoose";

const disbursementEntrySchema = new mongoose.Schema({
    // Branch Information
    branch: {
        type: String,
        required: [true, "Branch is required"],
        trim: true,
        uppercase: true
    },
    branchCode: {
        type: String,
        required: [true, "Branch Code is required"],
        trim: true
    },

    // Group & Member Info
    groupId: {
        type: String,
        required: [true, "Group ID is required"],
        trim: true
    },
    accountHolderName: {
        type: String,
        required: [true, "Account Holder Name is required"],
        trim: true
    },
    accountNumber: {
        type: String,
        required: [true, "Account Number is required"],
        trim: true
    },
    ifscCode: {
        type: String,
        required: [true, "IFSC Code is required"],
        trim: true,
        uppercase: true
    },
    bankBranch: {
        type: String,
        required: [true, "Bank Branch is required"],
        trim: true
    },
    mobileNumber: {
        type: String,
        required: [true, "Mobile Number is required"],
        match: [/^[6-9]\d{9}$/, "Invalid mobile number"]
    },

    // Fixed Financial Fields
    loanAmount: {
        type: Number,
        required: true,
        default: 50000,
        set: () => 50000,
        immutable: true
    },
    insuranceAmount: {
        type: Number,
        required: true,
        default: 2000,
        set: () => 2000,
        immutable: true
    },
    disbursementAmount: {
        type: Number,
        required: true,
        default: 48000,
        set: () => 48000,
        immutable: true
    },
    emi: {
        type: Number,
        required: true,
        default: 2520,
        set: () => 2520,
        immutable: true
    },

    // Product Information (Multiple allowed)
    products: [
        {
            name: {
                type: String,
                required: true,
                enum: [
                    "Mixer Grinder",
                    "Induction Stove",
                    "Iron",
                    "Sewing Machine",
                    "Hot Pot",
                    "Fan",
                    "Cooker",
                    "Cooler",
                    "Android TV 32 Inch"
                ]
            },
            amount: {
                type: Number,
                required: true,
                min: [100, "Product amount must be at least ₹100"]
            }
        }
    ],

    // FO and BM Remarks
    foName: {
        type: String,
        required: [true, "FO Name is required"],
        enum: [
            "Anurag Kumar",
            "Suraj Kumar",
            "Pandav Kumar",
            "Anish Kumar",
            "Rohit Kumar",
            "Deepak Kumar",
            "Rakesh Kumar",
        ]
    },
    bmRemarks: {
        type: String,
        maxlength: [500, "Remarks cannot exceed 500 characters"],
        trim: true
    },

    // System Fields
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const DisbursementEntry = mongoose.model("DisbursementEntry", disbursementEntrySchema);
export default DisbursementEntry;
