// backend/models/Role.js
import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  title: { type: String, required: true },
  approvalLimit: { type: Number, default: 0 },
}, { timestamps: true });

const Role = mongoose.model("Role", RoleSchema);
export default Role;
