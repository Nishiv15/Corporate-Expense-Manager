// backend/models/Budget.js
import mongoose from "mongoose";

const BudgetSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  startDate: Date,
  endDate: Date
}, { timestamps: true });

const Budget = mongoose.model("Budget", BudgetSchema);
export default Budget;
