import mongoose from "mongoose";

const ApprovalSchema = new mongoose.Schema({
  expense: { type: mongoose.Schema.Types.ObjectId, ref: "ExpenseRequest", required: true },
  approver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  decision: { type: String, enum: ["approved","rejected"], required: true },
  comment: String
}, { timestamps: true });

const Approval = mongoose.model("Approval", ApprovalSchema);
export default Approval;
