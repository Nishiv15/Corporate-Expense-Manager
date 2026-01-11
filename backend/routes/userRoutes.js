import express from "express";
import { userLogin, registerUser, updateUser, deleteUser, getUsers, getUserById } from "../controllers/userController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Public route to create a new company and initial manager account.
 * POST /api/companies
 */
router.post("/login", userLogin);
router.post("/register", protect, restrictTo("manager","admin"), registerUser);
router.put("/:id", protect, updateUser)
router.delete("/:id", protect, deleteUser)
router.get("/", protect, restrictTo("manager","admin"), getUsers);
router.get("/:id", protect, getUserById);


export default router;