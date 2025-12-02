import express from "express";
import { userLogin, registerUser, updateUser } from "../controllers/userController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Public route to create a new company and initial manager account.
 * POST /api/companies
 */
router.post("/login", userLogin);
router.post("/register", protect, restrictTo("manager","admin"), registerUser);
router.put("/:id", protect, updateUser)

export default router;