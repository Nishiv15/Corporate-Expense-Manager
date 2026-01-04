import express from "express";
import { createExpense, getExpense, listExpenses, updateExpense } from "../controllers/expenseController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = express.Router();

// create expense (employee or manager)
router.post("/create-expense", protect, createExpense);
router.get("/:id", protect, getExpense);
router.get("/", protect, listExpenses);
router.put("/:id", protect, updateExpense);
// router.post("/:id/submit", protect, submitExpense);
// router.post("/:id/approvals", protect, restrictTo("manager","admin"), approveExpense);
// router.delete("/:id", protect, restrictTo("manager","admin"), deleteExpense);

export default router;