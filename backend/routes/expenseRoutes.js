import express from "express";
import { createExpense, getExpense, listExpenses, updateExpense, deleteExpense, submitExpense, approveExpense } from "../controllers/expenseController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = express.Router();

// create expense (employee or manager)
router.post("/create-expense", protect, createExpense);
router.get("/:id", protect, getExpense);
router.get("/", protect, listExpenses);
router.put("/:id", protect, updateExpense);
router.delete("/:id", protect, deleteExpense);
router.put("/:id/submit", protect, submitExpense);
router.put("/:id/approvals", protect, restrictTo("manager","admin"), approveExpense);

export default router;