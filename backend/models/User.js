import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  passwordHash: { type: String },
  role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
  userType: { type: String, enum: ["manager","employee","admin"], required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// unique email per company
UserSchema.index({ company: 1, email: 1 }, { unique: true });

const User = mongoose.model("User", UserSchema);
export default User;
