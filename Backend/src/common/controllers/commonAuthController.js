const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Admin = require("../../admin/models/Admin");
const Owner = require("../../owner/models/Owner");
const Tenant = require("../../User/models/Tenant");
const generateToken = require("../utils/generateToken");
const { success, error } = require("../utils/response");
const { sendEmail } = require("../services/brevoService");

/**
 * @route   POST /api/auth/login
 * @desc    Unified login endpoint that auto-detects or checks user role across Tenant, Host/Owner, Admin
 * @access  Public
 */
const unifiedLogin = async (req, res) => {
  try {
    const { email, username, login, password, role } = req.body;
    const identifier = (email || username || login || "").toLowerCase().trim();

    if (!identifier || !password) {
      return error(res, 400, "Email/Username and password are required");
    }

    let user = null;
    let foundRole = null;

    // Search by explicit role if provided
    if (role === "admin") {
      user = await Admin.findOne({ $or: [{ email: identifier }, { username: identifier }] }).select("+password");
      if (user) foundRole = "admin";
    } else if (role === "owner" || role === "host") {
      user = await Owner.findOne({ $or: [{ email: identifier }, { username: identifier }] }).select("+password");
      if (user) foundRole = "owner";
    } else if (role === "tenant") {
      user = await Tenant.findOne({ $or: [{ email: identifier }, { username: identifier }] }).select("+password");
      if (user) foundRole = "tenant";
    } else {
      // Auto-detect role order: Tenant -> Owner -> Admin
      user = await Tenant.findOne({ $or: [{ email: identifier }, { username: identifier }] }).select("+password");
      if (user) {
        foundRole = "tenant";
      } else {
        user = await Owner.findOne({ $or: [{ email: identifier }, { username: identifier }] }).select("+password");
        if (user) {
          foundRole = "owner";
        } else {
          user = await Admin.findOne({ $or: [{ email: identifier }, { username: identifier }] }).select("+password");
          if (user) {
            foundRole = "admin";
          }
        }
      }
    }

    if (!user) {
      return error(res, 401, "Invalid email/username or password");
    }

    if (user.isActive === false) {
      return error(res, 403, "Account is deactivated");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return error(res, 401, "Invalid email/username or password");
    }

    if (foundRole === "admin") {
      user.lastLogin = new Date();
      await user.save();
    }

    const token = generateToken(user._id, foundRole);

    const userPayload = {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone || "",
      city: user.city || "",
      profileImage: user.profileImage || "",
      role: foundRole,
      isVerified: user.isVerified || false,
      isActive: user.isActive,
    };

    return success(res, 200, "Login successful", {
      token,
      user: userPayload,
      [foundRole]: userPayload,
    });
  } catch (err) {
    return error(res, 500, err.message || "Unified login failed");
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile regardless of role
 * @access  Private
 */
const getUnifiedMe = async (req, res) => {
  return success(res, 200, "Profile fetched", {
    user: req.user,
    role: req.role,
  });
};

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Generate password reset token and send via email
 * @access  Public
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return error(res, 400, "Email is required");
    }

    const cleanEmail = email.toLowerCase().trim();

    let user = await Tenant.findOne({ email: cleanEmail });
    let role = "tenant";

    if (!user) {
      user = await Owner.findOne({ email: cleanEmail });
      role = "owner";
    }

    if (!user) {
      user = await Admin.findOne({ email: cleanEmail });
      role = "admin";
    }

    if (!user) {
      return success(res, 200, "If an account with that email exists, password reset instructions have been sent.");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpires = Date.now() + 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;
    await user.save();

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const resetUrl = `${clientUrl}/reset-password?token=${resetToken}&role=${role}`;

    try {
      await sendEmail({
        to: cleanEmail,
        subject: "Nestesy - Password Reset Request",
        htmlContent: `
          <h3>Password Reset Request</h3>
          <p>Hello ${user.name || "User"},</p>
          <p>You requested a password reset for your Nestesy account.</p>
          <p>Click the link below to reset your password (valid for 1 hour):</p>
          <a href="${resetUrl}" style="padding:10px 18px; background:#1e3a5f; color:#fff; border-radius:8px; text-decoration:none;">Reset Password</a>
          <br/><br/>
          <p>Or copy this URL: ${resetUrl}</p>
        `,
      });
    } catch (emailErr) {
      console.warn("Forgot password email warning:", emailErr.message);
    }

    return success(res, 200, "If an account with that email exists, password reset instructions have been sent.", {
      resetToken,
    });
  } catch (err) {
    return error(res, 500, err.message || "Forgot password process failed");
  }
};

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password using reset token
 * @access  Public
 */
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword, role } = req.body;
    if (!token || !newPassword) {
      return error(res, 400, "Token and new password are required");
    }

    let user = null;

    if (role === "admin") {
      user = await Admin.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    } else if (role === "owner" || role === "host") {
      user = await Owner.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    } else {
      user = await Tenant.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
      if (!user) {
        user = await Owner.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
      }
      if (!user) {
        user = await Admin.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
      }
    }

    if (!user) {
      return error(res, 400, "Invalid or expired password reset token");
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return success(res, 200, "Password reset successfully! You can now log in.");
  } catch (err) {
    return error(res, 500, err.message || "Password reset failed");
  }
};

module.exports = {
  unifiedLogin,
  getUnifiedMe,
  forgotPassword,
  resetPassword,
};
