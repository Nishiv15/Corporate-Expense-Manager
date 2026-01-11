import express from "express";
import { createCompanyWithManager, deleteCompany } from "../controllers/companyController.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Public route to create a new company and initial manager account.
 * POST /api/companies
 */
router.post("/register", createCompanyWithManager);
router.delete("/:id", protect, deleteCompany);

export default router;