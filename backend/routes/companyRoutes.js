import express from "express";
import { createCompanyWithManager } from "../controllers/companyController.js";

const router = express.Router();

/**
 * Public route to create a new company and initial manager account.
 * POST /api/companies
 */
router.post("/register", createCompanyWithManager);

export default router;