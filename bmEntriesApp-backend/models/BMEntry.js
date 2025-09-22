// models/BMEntry.js
import mongoose from "mongoose";

const bmEntrySchema = new mongoose.Schema({
  // Branch Information
  branch: {
    type: String,
    required: [true, "Branch name is required"],
    trim: true,
    uppercase: true
  },

  branchCode: {
    type: String,
    required: [true, "Branch code is required"],
    trim: true,
  },

  foName: {
    type: String,
    required: [true, "FO name is required"],
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

  // Group Information
  groupName: {
    type: String,
    required: [true, "Group name is required"],
    trim: true
  },

  groupCode: {
    type: String,
    required: [true, "Group code is required"],
    trim: true,
  },

  // Member Information
  memberName: {
    type: String,
    required: [true, "Member name is required"],
    trim: true
  },

  // Fixed Financial Values
  loanAmount: {
    type: Number,
    required: true,
    default: 50000,
    set: () => 50000, // Always returns 50000 regardless of input
    immutable: true // Cannot be modified after creation
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

  // Product Information
  products: [{
    name: {
      type: String,
      required: [true, "Product name is required"],
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
      required: [true, "Product amount is required"],
      min: [100, "Minimum product amount is ₹100"]
    }
  }],

  // Disbursement Information
  disbursementDate: {
    type: Date,
    required: [true, "Disbursement date is required"],
  },

  // BM Remarks
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
  },

}, {
  timestamps: true
});


const BMEntry = mongoose.model("BMEntry", bmEntrySchema);

export default BMEntry;