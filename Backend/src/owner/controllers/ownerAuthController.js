const asyncHandler = require("express-async-handler");

const Owner = require("../models/Owner");
const generateToken = require("../../common/utils/generateToken");

// ======================================================
// REGISTER OWNER / HOST
// ======================================================

const registerOwner = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  // Required fields
  if (!name || !email || !phone || !password) {
    res.status(400);
    throw new Error("Please fill all fields");
  }

  const cleanName = String(name).trim();
  const cleanEmail = String(email).trim().toLowerCase();
  const cleanPhone = String(phone).trim();

  // Name validation
  if (cleanName.length < 2) {
    res.status(400);
    throw new Error("Name must contain at least 2 characters");
  }

  // Phone validation
  if (cleanPhone.length < 10) {
    res.status(400);
    throw new Error("Please enter a valid phone number");
  }

  // Password validation
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }

  // Check existing owner
  const ownerExists = await Owner.findOne({
    email: cleanEmail,
  });

  if (ownerExists) {
    res.status(409);
    throw new Error("Owner already exists with this email");
  }

  // Create owner
  const owner = await Owner.create({
    name: cleanName,
    email: cleanEmail,
    phone: cleanPhone,
    password,
    role: "owner",

    // Admin approval disabled for now
    // Owner can login immediately
    status: "approved",
  });

  res.status(201).json({
    success: true,
    message: "Registration successful! You can login now.",

    owner: {
      _id: owner._id,
      name: owner.name,
      email: owner.email,
      phone: owner.phone,
      role: owner.role,
      status: owner.status,
    },
  });
});

// ======================================================
// LOGIN OWNER / HOST
// ======================================================

const loginOwner = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Required fields
  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const cleanEmail = String(email).trim().toLowerCase();

  // Find owner
  const owner = await Owner.findOne({
    email: cleanEmail,
  });

  if (!owner) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Check password
  const passwordMatch = await owner.matchPassword(password);

  if (!passwordMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // ======================================================
  // ADMIN APPROVAL DISABLED
  // ======================================================
  //
  // Pending/rejected checks are intentionally disabled.
  // All registered owners can login.
  //
  // ======================================================

  // Generate JWT
  const token = generateToken(
    owner._id.toString(),
    "owner"
  );

  // Send response
  res.status(200).json({
    success: true,
    message: "Login successful",

    token,

    owner: {
      _id: owner._id,
      name: owner.name,
      email: owner.email,
      phone: owner.phone,
      role: owner.role,
      status: owner.status,
    },
  });
});

// ======================================================
// LOGOUT OWNER
// ======================================================

const logoutOwner = asyncHandler(async (req, res) => {
  res.cookie("owner_jwt", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: "lax",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// ======================================================
// EXPORT
// ======================================================

module.exports = {
  registerOwner,
  loginOwner,
  logoutOwner,
};