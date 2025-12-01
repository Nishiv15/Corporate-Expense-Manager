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

export {userLogin, registerUser};