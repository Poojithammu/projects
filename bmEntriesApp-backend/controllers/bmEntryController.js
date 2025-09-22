import BMEntry from "../models/BMEntry.js";

export const createBMEntry = async (req, res) => {
  try {
    const {
      branch,
      branchCode,
      foName,
      groupName,
      groupCode,
      memberName,
      products,
      disbursementDate,
      bmRemarks
    } = req.body;

    if (
      !branch ||
      !branchCode ||
      !foName ||
      !groupName ||
      !groupCode ||
      !memberName ||
      !products?.length ||
      !disbursementDate
    ) {
      return res.status(400).json({ error: "Please fill all required fields" });
    }

    const bmEntry = new BMEntry({
      branch,
      branchCode,
      foName,
      groupName,
      groupCode,
      memberName,
      products,
      disbursementDate,
      bmRemarks,
      createdBy: req.user?.userId || null
    });

    await bmEntry.save();

    res.status(201).json({ message: "BM Entry created successfully" });
  } catch (err) {
    console.error("BM Entry creation error:", err);
    res.status(500).json({ error: "Server error while creating BM Entry" });
  }
};

export const getAllBMEntries = async (req, res) => {
  try {
    const entries = await BMEntry.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email");

    res.status(200).json(entries);
  } catch (err) {
    console.error("Failed to get BM entries:", err);
    res.status(500).json({ error: "Failed to fetch BM entries" });
  }
};
