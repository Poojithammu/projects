import FormSubmission from "../models/FormSubmission.js";

export const submitForm = async (req, res) => {
    try {
        const {
            branch,
            branchCode,
            foName,
            date,
            village,
            groupName,
            groupCode,
            memberName,
            coApplicantName,
            mobileNumber,
            loanAmount,
            kycCollected,
            product,
            remarks
        } = req.body;

        if (
            !branch ||
            !branchCode ||
            !foName ||
            !date ||
            !village ||
            !groupName ||
            !groupCode ||
            !memberName ||
            !mobileNumber ||
            !loanAmount ||
            !kycCollected?.length ||
            !product?.name ||
            !product?.amount
        ) {
            return res.status(400).json({ error: "Please fill all required fields" });
        }

        const submission = new FormSubmission({
            branch,
            branchCode,
            foName,
            date,
            village,
            groupName,
            groupCode,
            memberName,
            coApplicantName,
            mobileNumber,
            loanAmount,
            kycCollected,
            product,
            remarks,
            customer: req.user?.userId || null
        });

        await submission.save();

        res.status(201).json({ message: "Form submitted successfully" });
    } catch (err) {
        console.error("Form submission error:", err);
        res.status(500).json({ error: "Server error while submitting form" });
    }
};



export const getAllSubmissions = async (req, res) => {
    try {
        const submissions = await FormSubmission.find()
            .sort({ createdAt: -1 })
            .populate("customer", "name email"); 

        res.status(200).json(submissions);
    } catch (err) {
        console.error("Failed to get submissions:", err);
        res.status(500).json({ error: "Failed to fetch submissions" });
    }
};

