import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  description: String,
  qty: { type: Number, default: 1 },
  unitPrice: { type: Number, default: 0 }
}, { _id: false });

const ExpenseSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  items: [ItemSchema],
  totalAmount: { type: Number, required: true },
  category: { type: String },
  status: { type: String, enum: ["draft","submitted","approved","rejected"], default: "draft" },
  attachments: [String]
}, { timestamps: true });

const ExpenseRequest = mongoose.model("ExpenseRequest", ExpenseSchema);
export default ExpenseRequest;
