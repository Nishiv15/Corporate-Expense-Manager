import bcrypt from "bcrypt";
import Company from "../models/Company.js";
import Role from "../models/Role.js";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

/**
 * createCompanyWithManager
 * POST /api/companies
 * body: {
 *   companyName,
 *   managerName,
 *   managerEmail,
 *   managerPassword,
 *   managerRoleTitle (optional)
 * }
 *
 * Response: { token, user, company }
 */
const createCompanyWithManager = async (req, res) => {
    try {
        const {
            companyName,
            managerName,
            managerEmail,
            managerPassword,
            managerRoleTitle = "Manager"
        } = req.body;

        // basic validation
        if (!companyName || !managerName || !managerEmail || !managerPassword) {
            return res.status(400).json({ message: "companyName, managerName, managerEmail and managerPassword are required" });
        }

        // check if company with same name exists
        const existingCompany = await Company.findOne({ name: companyName });
        if (existingCompany) {
            return res.status(409).json({ message: "Company with this name already exists" });
        }

        // optionally ensure manager email is not used globally (or you may want per-company)
        const existingUser = await User.findOne({ email: managerEmail });
        if (existingUser) {
            return res.status(409).json({ message: "User with this email already exists" });
        }

        // create company
        const company = await Company.create({ name: companyName });

        // create default role for manager under this company
        const role = await Role.create({
            company: company._id,
            title: managerRoleTitle,
            approvalLimit: 10000000000000000000000000000000000000000000000000000000000 // large default limit
        });

        // hash manager password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(managerPassword, salt);

        // create manager user
        const manager = await User.create({
            company: company._id,
            name: managerName,
            email: managerEmail,
            passwordHash,
            role: role._id,
            userType: "manager",
            isActive: true
        });

        // link company.createdBy
        company.createdBy = manager._id;
        await company.save();

        // generate token for manager
        const token = generateToken(manager);

        // return sanitized manager (no password hash)
        const returnedUser = await User.findById(manager._id).select("-passwordHash").lean();

        return res.status(201).json({
            message: "Company and manager created",
            token,
            user: returnedUser,
            company: { _id: company._id, name: company.name, createdAt: company.createdAt }
        });
    } catch (err) {
        console.error("createCompanyWithManager error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

const deleteCompany = async (req, res) => {
  try {
    const requester = req.user;
    const companyId = req.params.id;
    const { confirm } = req.body;

    // Manager-only access
    if (requester.userType !== "manager") {
      return res.status(403).json({
        message: "Only managers can delete the company"
      });
    }

    // Confirmation check
    if (!confirm || confirm !== "Confirm") {
      return res.status(400).json({
        message: 'Deletion requires confirmation. Set body { "confirm": "Confirm" } to proceed.'
      });
    }

    // Ensure manager belongs to the company
    if (requester.company.toString() !== companyId.toString()) {
      return res.status(403).json({
        message: "You can delete only your own company"
      });
    }

    const company = await Company.findById(companyId);
    if (!company || !company.isActive) {
      return res.status(404).json({
        message: "Company not found or already deleted"
      });
    }

    // ===== SOFT DELETE COMPANY =====
    company.isActive = false;
    await company.save();

    // ===== SOFT DELETE ALL USERS UNDER COMPANY =====
    await User.updateMany(
      { company: companyId, isActive: true },
      { $set: { isActive: false } }
    );

    return res.json({
      message: "Company deleted successfully",
      companyId
    });

  } catch (error) {
    console.error("deleteCompany error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export { createCompanyWithManager, deleteCompany };