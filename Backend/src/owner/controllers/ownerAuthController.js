const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Owner = require("../models/Owner");

// ======================================================
// REGISTER OWNER
// ======================================================

const registerOwner = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
    } = req.body;

    // ===============================
    // VALIDATION
    // ===============================

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, phone and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // ===============================
    // CHECK EXISTING OWNER
    // ===============================

    const existingOwner = await Owner.findOne({
      email: normalizedEmail,
    });

    if (existingOwner) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists",
      });
    }

    // ===============================
    // HASH PASSWORD
    // ===============================

    const hashedPassword = await bcrypt.hash(
      password,
      12
    );

    // ===============================
    // CREATE OWNER
    // ===============================

    const owner = await Owner.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      password: hashedPassword,

      role: "owner",

      // Automatically approve owner
      status: "approved",

      isActive: true,
    });

    // ===============================
    // CREATE JWT
    // ===============================

    const token = jwt.sign(
      {
        id: owner._id,
        role: owner.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // ===============================
    // RESPONSE
    // ===============================

    return res.status(201).json({
      success: true,
      message: "Owner registered successfully",

      token,

      owner: {
        id: owner._id,
        name: owner.name,
        email: owner.email,
        phone: owner.phone,
        role: owner.role,
        status: owner.status,
        isActive: owner.isActive,
      },
    });
  } catch (error) {
    console.error(
      "Owner registration error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Owner registration failed",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

// ======================================================
// LOGIN OWNER
// ======================================================

const loginOwner = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // ===============================
    // VALIDATION
    // ===============================

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    // ===============================
    // FIND OWNER
    // ===============================

    const owner = await Owner.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!owner) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ===============================
    // CHECK PASSWORD
    // ===============================

    if (!owner.password) {
      console.error(
        "PASSWORD HASH MISSING:",
        owner.email,
        owner._id
      );

      return res.status(500).json({
        success: false,
        message:
          "Owner password is missing. Please register again or reset your password.",
      });
    }

    const isPasswordValid =
      await bcrypt.compare(
        password,
        owner.password
      );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ===============================
    // CHECK ACTIVE
    // ===============================

    if (!owner.isActive) {
      return res.status(403).json({
        success: false,
        message:
          "Your owner account is inactive",
      });
    }

    // ===============================
    // CHECK APPROVAL
    // ===============================

    if (owner.status === "rejected") {
      return res.status(403).json({
        success: false,
        message:
          "Your owner account has been rejected",
      });
    }

    // ===============================
    // AUTO-APPROVE OLD OWNERS
    // ===============================
    //
    // Your existing MongoDB owner may not
    // have a status field because the old
    // schema didn't contain status.
    //
    // Treat missing status as approved.

    if (!owner.status) {
      owner.status = "approved";
      await owner.save();
    }

    // ===============================
    // CREATE JWT
    // ===============================

    const token = jwt.sign(
      {
        id: owner._id,
        role: owner.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // ===============================
    // RESPONSE
    // ===============================

    return res.status(200).json({
      success: true,
      message: "Owner login successful",

      token,

      owner: {
        id: owner._id,
        name: owner.name,
        email: owner.email,
        phone: owner.phone,
        role: owner.role,
        status: owner.status,
        isActive: owner.isActive,
      },
    });
  } catch (error) {
    console.error(
      "Owner login error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Owner login failed",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

module.exports = {
  registerOwner,
  loginOwner,
};