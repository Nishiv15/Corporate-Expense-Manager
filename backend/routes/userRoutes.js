import express from "express";
import { userLogin, registerUser } from "../controllers/userController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Public route to create a new company and initial manager account.
 * POST /api/companies
 */
router.post("/login", userLogin);
router.post("/register", protect, restrictTo("manager","admin"), registerUser);

export default router;