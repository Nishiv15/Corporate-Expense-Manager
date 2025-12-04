import express from "express";
import { createExpense } from "../controllers/expenseController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = express.Router();

// create expense (employee or manager)
router.post("/create-expense", protect, createExpense);

export default router;