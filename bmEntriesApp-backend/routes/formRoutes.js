import express from "express";
import {
    submitForm,
    getAllSubmissions
} from "../controllers/formController.js";
import { authenticate, isAdmin } from "../middleware/authMiddleware.js";
import { createBMEntry, getAllBMEntries } from "../controllers/bmEntryController.js";
import { createDisbursementEntry, getAllDisbursementEntries } from "../controllers/disbursementController.js";

const router = express.Router();

router.post("/submit-form",authenticate, submitForm);
router.post("/bm-entry-form", authenticate, createBMEntry);
router.post("/disbursement-entry", authenticate, createDisbursementEntry);
router.get("/admin/disbursement-entries", authenticate, isAdmin, getAllDisbursementEntries);
router.get("/admin/bm-entries", authenticate, isAdmin, getAllBMEntries);
router.get("/admin/submissions", authenticate, isAdmin, getAllSubmissions);

export default router;
