import express from "express";
import { createCompanyWithManager, deleteCompany, getCompanyById, getCompanies } from "../controllers/companyController.js";
import {protect, restrictTo} from "../middleware/authMiddleware.js";
import { get } from "mongoose";

const router = express.Router();

/**
 * Public route to create a new company and initial manager account.
 * POST /api/companies
 */
router.post("/register", createCompanyWithManager);
router.delete("/:id", protect, deleteCompany);
router.get("/:id", protect, getCompanyById);
router.get("/", protect, restrictTo("admin"), getCompanies);

export default router;