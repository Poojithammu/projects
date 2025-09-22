// models/FormSubmission.js
import mongoose from "mongoose";

const formSchema = new mongoose.Schema({

    branch: {
        type: String,
        required: true,
        trim: true
    },

    branchCode: {
        type: String,
        required: true,
        trim: true
    },

    foName: {
        type: String,
        enum: [
            "Anurag Kumar",
            "Suraj Kumar",
            "Pandav Kumar",
            "Anish Kumar",
            "Rohit Kumar",
            "Deepak Kumar",
            "Rakesh Kumar",
        ],
        required: true
    },

    date: {
        type: Date,
        required: true
    },

    village: {
        type: String,
        required: true,
        trim: true
    },

    groupName: {
        type: String,
        required: true,
        trim: true
    },

    groupCode: {
        type: String,
        required: true,
        trim: true
    },

    memberName: {
        type: String,
        required: true,
        trim: true
    },

    coApplicantName: {
        type: String,
        trim: true
    },

    mobileNumber: {
        type: String,
        required: true,
        match: /^[6-9]\d{9}$/ // basic 10-digit mobile validation
    },

    loanAmount: {
        type: Number,
        required: true,
        min: 1000
    },

    kycCollected: {
        type: [String],
        enum: ["Aadhar Card", "Voter Card", "Ration Card", "Pan Card"],
        required: true
    },

    product: {
        name: {
            type: String,
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
            ],
            required: true
        },
        amount: {
            type: Number,
            required: true,
            validate: {
                validator: function (val) {
                    return val >= 1000;
                },
                message: "Amount must be at least ₹1000"
            }
        }
    },

    remarks: {
        type: String,
        default: ""
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    }
});


export default mongoose.model("FormSubmission", formSchema);
