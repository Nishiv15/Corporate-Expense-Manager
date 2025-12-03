import bcrypt from "bcrypt";
import Company from "../models/Company.js";
import Role from "../models/Role.js";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const registerUser = async (req, res) => {
  try {
    const companyId = req.user.company;

    const { name, email, password, role, amountLimit, userType = "employee" } = req.body;

    // 1. Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "name, email, password and role are required"
      });
    }

    // 2. Company existence check
    const company = await Company.findById(companyId).lean();
    if (!company) {
      return res.status(400).json({ message: "Invalid company" });
    }

    // 3. Check email uniqueness within same company
    const existingUser = await User.findOne({ company: companyId, email });
    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists for this company"
      });
    }

    // 4. Find or Create the Role
    let roleDoc = await Role.findOne({
      company: companyId,
      title: role
    });

    if (!roleDoc) {
      roleDoc = await Role.create({
        company: companyId,
        title: role,
        approvalLimit: amountLimit
      });
    }

    // 5. Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 6. Create User
    const user = await User.create({
      company: companyId,
      name,
      email,
      passwordHash,
      role: roleDoc._id,
      userType,
      isActive: true
    });

    // 7. Return user without password
    const sanitizedUser = await User.findById(user._id)
      .select("-passwordHash")
      .populate("role")
      .lean();

    return res.status(201).json({
      message: "User registered successfully",
      user: sanitizedUser
    });

  } catch (error) {
    console.error("registerEmployee error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email, isActive: true })
      .populate("role")
      .lean();

    if (!user || !user.passwordHash) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Get company directly from user's company ID
    const company = await Company.findById(user.company).lean();
    if (!company) {
      return res.status(500).json({ message: "Company not found for this user" });
    }

    // Generate JWT token
    const token = generateToken({
      _id: user._id,
      userType: user.userType,
      company: user.company,
    });

    // Remove passwordHash before sending
    delete user.passwordHash;

    return res.json({
      message: "Login successful",
      token,
      user,
      company
    });

  } catch (error) {
    console.error("companyLogin error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const requester = req.user; // set by protect middleware
    const companyId = requester.company;
    const targetUserId = req.params.id;
    const { password, role, roleTitleNew, approvalLimit, userType } = req.body;

    // Basic checks
    if (!companyId) return res.status(400).json({ message: "Requester not associated with a company" });

    // Find target user
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) return res.status(404).json({ message: "User not found" });

    // Ensure target user belongs to the same company
    if (!targetUser.company || targetUser.company.toString() !== companyId.toString()) {
      return res.status(403).json({ message: "Cannot modify users outside your company" });
    }

    const isSelf = requester.id === targetUserId || requester._id?.toString() === targetUserId;
    const isManagerOrAdmin = ["manager", "admin"].includes(requester.userType);

    // If requester is not manager/admin and not self -> forbidden
    if (!isSelf && !isManagerOrAdmin) {
      return res.status(403).json({ message: "Forbidden: insufficient privileges" });
    }

    // If requester is self only, they can only change password
    if (isSelf && !isManagerOrAdmin) {
      if (!password) {
        return res.status(400).json({ message: "Only password can be updated by the user themself" });
      }
      // Hash the password and update
      const salt = await bcrypt.genSalt(10);
      targetUser.passwordHash = await bcrypt.hash(password, salt);
      await targetUser.save();

      const sanitized = await User.findById(targetUser._id).select("-passwordHash").populate("role").lean();
      return res.json({ message: "Password updated", user: sanitized });
    }

    // From here: requester is manager/admin OR self+manager/admin (managers can update everything)
    // Managers/admins can update password, role, approvalLimit, userType

    // 1) Update password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      targetUser.passwordHash = await bcrypt.hash(password, salt);
    }

    // 2) Update role if provided
    if (role) {
      let roleDoc = null;

      // 1a. Find role by id (if role looks like ObjectId)
      if (typeof role === "string" && role.match(/^[0-9a-fA-F]{24}$/)) {
        roleDoc = await Role.findOne({ _id: role, company: companyId });
        if (!roleDoc) {
          return res.status(400).json({ message: "Role ID not found in this company" });
        }
      } else if (typeof role === "string") {
        // 1b. Find by existing title (case-insensitive)
        const normalizedTitle = role.trim();
        roleDoc = await Role.findOne({
          company: companyId,
          title: { $regex: `^${normalizedTitle}$`, $options: "i" }  //regesx is used. It can be avoided by keeping the role name same to that as in DB
        });
        if (!roleDoc) {
          return res.status(400).json({
            message: `Role "${normalizedTitle}" does not exist in this company. Please create the role first.`
          });
        }
      } else {
        return res.status(400).json({ message: "Invalid role format" });
      }

      // 2. Optionally update the role document's title (roleTitleNew)
      if (roleTitleNew && typeof roleTitleNew === "string") {
        const newTitle = roleTitleNew.trim();
        if (!newTitle) {
          return res.status(400).json({ message: "roleTitleNew cannot be empty" });
        }
        roleDoc.title = newTitle;
      }

      // 3. Optionally update approvalLimit on the role
      if (approvalLimit !== undefined && approvalLimit !== null) {
        const parsed = Number(approvalLimit);
        if (Number.isNaN(parsed) || parsed < 0) {
          return res.status(400).json({ message: "approvalLimit must be a non-negative number" });
        }
        roleDoc.approvalLimit = parsed;
      }

      // Save changes to the role document (if any)
      // This will persist title and/or approvalLimit updates if provided.
      await roleDoc.save();

      // 4. Assign role to the user
      targetUser.role = roleDoc._id;
    } else if (approvalLimit !== undefined && approvalLimit !== null) {
      // If role param not supplied but approvalLimit provided,
      // update the user's current role's approvalLimit (if exists)
      const roleToUpdateId = targetUser.role;
      if (!roleToUpdateId) {
        return res.status(400).json({ message: "Cannot update approvalLimit: user has no role assigned" });
      }
      const roleToUpdate = await Role.findOne({ _id: roleToUpdateId, company: companyId });
      if (!roleToUpdate) {
        return res.status(400).json({ message: "Role to update not found in this company" });
      }
      const parsed = Number(approvalLimit);
      if (Number.isNaN(parsed) || parsed < 0) {
        return res.status(400).json({ message: "approvalLimit must be a non-negative number" });
      }
      roleToUpdate.approvalLimit = parsed;
      await roleToUpdate.save();
    }
    
    // 4) Update userType if provided
    if (userType) {
      if (!["employee", "manager", "admin"].includes(userType)) {
        return res.status(400).json({ message: "Invalid userType. Allowed: employee, manager, admin" });
      }
      targetUser.userType = userType;
    }

    // Save the user
    await targetUser.save();

    // Return sanitized updated user
    const sanitizedUser = await User.findById(targetUser._id)
      .select("-passwordHash")
      .populate("role")
      .lean();

    return res.json({ message: "User updated successfully", user: sanitizedUser });
  } catch (error) {
    console.error("updateEmployee error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const requester = req.user; // from protect middleware
    const companyId = requester.company;
    const targetUserId = req.params.id;
    const { confirm } = req.body;

    if (!companyId) {
      return res.status(400).json({ message: "Requester not associated with a company" });
    }

    // ===== UPDATED CODE START =====
    // Only manager can delete users
    if (requester.userType !== "manager") {
      return res.status(403).json({ message: "Forbidden: only managers can delete users" });
    }

    // Require explicit confirm text
    if (!confirm || confirm !== "Confirm") {
      return res.status(400).json({
        message: 'Deletion requires confirmation. Set body { "confirm": "Confirm" } to proceed.'
      });
    }
    // ===== UPDATED CODE END =====

    // Find target user
    const targetUser = await User.findById(targetUserId).populate("role").exec();
    if (!targetUser) return res.status(404).json({ message: "User not found" });

    // Ensure target user belongs to same company
    if (!targetUser.company || targetUser.company.toString() !== companyId.toString()) {
      return res.status(403).json({ message: "Cannot delete users outside your company" });
    }

    // ===== SAFETY CHECK: prevent deleting last manager =====
    if (targetUser.userType === "manager") {
      const otherManagersCount = await User.countDocuments({
        company: companyId,
        userType: "manager",
        _id: { $ne: targetUser._id },
        isActive: true
      });

      if (otherManagersCount === 0) {
        return res.status(400).json({
          message: "Cannot delete this manager because they are the last active manager for the company."
        });
      }
    }
    // ===== END SAFETY CHECK =====

    // Capture role id before deleting user
    const roleId = targetUser.role ? targetUser.role._id : null;

    // Hard-delete user document
    const deleteResult = await User.deleteOne({ _id: targetUser._id });
    if (deleteResult.deletedCount !== 1) {
      return res.status(500).json({ message: "Failed to delete user" });
    }

    // Decide whether to delete the role document
    let roleDeleted = false;
    if (roleId) {
      // Count other users in same company referencing this role
      const refs = await User.countDocuments({
        company: companyId,
        role: roleId
      });

      // refs does NOT include the deleted user (we already removed them),
      // so if refs === 0, no remaining users reference the role.
      if (refs === 0) {
        const roleDeleteResult = await Role.deleteOne({ _id: roleId, company: companyId });
        if (roleDeleteResult.deletedCount === 1) {
          roleDeleted = true;
        }
      }
    }

    return res.json({
      message: "User deleted successfully",
      userId: targetUserId,
      roleDeleted
    });
  } catch (error) {
    console.error("deleteUser error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export { userLogin, registerUser, updateUser, deleteUser };