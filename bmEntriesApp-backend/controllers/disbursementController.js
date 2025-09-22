import DisbursementEntry from "../models/DisbursementEntry.js";

export const createDisbursementEntry = async (req, res) => {
  try {
    const {
      branch,
      branchCode,
      groupId,
      accountHolderName,
      accountNumber,
      ifscCode,
      bankBranch,
      mobileNumber,
      products,
      foName,
      bmRemarks
    } = req.body;

    // Validate required fields
    if (
      !branch ||
      !branchCode ||
      !groupId ||
      !accountHolderName ||
      !accountNumber ||
      !ifscCode ||
      !bankBranch ||
      !mobileNumber ||
      !products?.length ||
      !foName
    ) {
      return res.status(400).json({ error: "Please fill all required fields" });
    }

    const newDisbursement = new DisbursementEntry({
      branch,
      branchCode,
      groupId,
      accountHolderName,
      accountNumber,
      ifscCode,
      bankBranch,
      mobileNumber,
      products,
      foName,
      bmRemarks,
      createdBy: req.user?.userId || null
    });

    await newDisbursement.save();

    res.status(201).json({ message: "Disbursement entry created successfully" });
  } catch (err) {
    console.error("Disbursement entry creation error:", err);
    res.status(500).json({ error: "Server error while creating disbursement entry" });
  }
};

export const getAllDisbursementEntries = async (req, res) => {
  try {
    const entries = await DisbursementEntry.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email");

    res.status(200).json(entries);
  } catch (err) {
    console.error("Failed to get disbursement entries:", err);
    res.status(500).json({ error: "Failed to fetch disbursement entries" });
  }
};
