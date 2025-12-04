import mongoose from "mongoose";
import ExpenseRequest from "../models/ExpenseRequest.js";
import Approval from "../models/Approval.js";
import User from "../models/User.js";
import Role from "../models/Role.js";
import Company from "../models/Company.js";

const createExpense = async (req, res) => {
  try {
    const requester = req.user;
    const companyId = requester.company;
    if (!companyId) return res.status(400).json({ message: "Requester not associated with a company" });

    const { title, items = [], totalAmount, department, attachments = [] } = req.body;

    if (!title || totalAmount === undefined) {
      return res.status(400).json({ message: "title and totalAmount are required" });
    }

    // Create expense in 'draft' or 'submitted' depending on client; default draft
    const expense = await ExpenseRequest.create({
      company: companyId,
      createdBy: requester._id,
      title,
      items,
      totalAmount,
      department,
      attachments,
      status: "draft"
    });

    return res.status(201).json({ message: "Expense created", expense });
  } catch (error) {
    console.error("createExpense error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export {createExpense};