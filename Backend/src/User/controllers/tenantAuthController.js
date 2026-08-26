const bcrypt = require("bcryptjs");
const Tenant = require("../models/Tenant");
const TenantProfile = require("../models/TenantProfile");
const generateToken = require("../../common/utils/generateToken");
const { success, error } = require("../../common/utils/response");

/**
 * POST /api/tenant/auth/register
 * Register a new tenant
 */
const registerTenant = async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      password,
      phone,
      city,
    } = req.body;

    console.log("REGISTER REQUEST:", {
      name,
      username,
      email,
      phone,
      city,
      hasPassword: Boolean(password),
    });

    if (!name || !email || !password) {
      return error(
        res,
        400,
        "Name, email, and password are required"
      );
    }

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    const finalUsername = (
      username ||
      normalizedEmail.split("@")[0]
    )
      .trim()
      .toLowerCase();

    if (!finalUsername) {
      return error(
        res,
        400,
        "Username is required"
      );
    }

    const existingEmail = await Tenant.findOne({
      email: normalizedEmail,
    });

    if (existingEmail) {
      return error(
        res,
        409,
        "An account with this email already exists"
      );
    }

    const existingUsername = await Tenant.findOne({
      username: finalUsername,
    });

    if (existingUsername) {
      return error(
        res,
        409,
        "Username is already taken"
      );
    }

    /*
     * IMPORTANT:
     * Do NOT hash the password here if Tenant.js
     * contains a pre("save") password hashing hook.
     */
    const tenant = await Tenant.create({
      name: normalizedName,
      username: finalUsername,
      email: normalizedEmail,
      password,
      phone: phone ? phone.trim() : "",
      city: city ? city.trim() : "",
    });

    console.log(
      "TENANT CREATED:",
      tenant._id.toString()
    );

    /*
     * Create tenant profile.
     * Registration should not fail if profile creation fails.
     */
    try {
      if (TenantProfile) {
        await TenantProfile.create({
          tenantId: tenant._id,
        });
      }
    } catch (profileError) {
      console.warn(
        "TENANT PROFILE CREATION ERROR:",
        profileError.message
      );
    }

    /*
     * Generate JWT
     */
    const token = generateToken(
      tenant._id,
      "tenant"
    );

    return success(
      res,
      201,
      "Tenant registered successfully",
      {
        token,
        tenant: {
          id: tenant._id,
          name: tenant.name,
          username: tenant.username,
          email: tenant.email,
          phone: tenant.phone || "",
          city: tenant.city || "",
          profileImage:
            tenant.profileImage || null,
          role: tenant.role,
          isActive: tenant.isActive,
          createdAt: tenant.createdAt,
        },
      }
    );
  } catch (err) {
    console.error(
      "===================================="
    );
    console.error("REGISTER TENANT ERROR");
    console.error(err);
    console.error(
      "===================================="
    );

    return error(
      res,
      500,
      err.message || "Failed to register tenant"
    );
  }
};

/**
 * POST /api/tenant/auth/login
 * Login using email or username
 */
const loginTenant = async (req, res) => {
  try {
    const {
      email,
      username,
      login,
      password,
    } = req.body;

    const loginIdentifier =
      email || username || login;

    if (!loginIdentifier || !password) {
      return error(
        res,
        400,
        "Email/Username and password are required"
      );
    }

    const queryTerm = loginIdentifier
      .trim()
      .toLowerCase();

    const tenant = await Tenant.findOne({
      $or: [
        { email: queryTerm },
        { username: queryTerm },
      ],
    }).select("+password");

    if (!tenant) {
      return error(
        res,
        401,
        "Invalid credentials"
      );
    }

    if (tenant.isActive === false) {
      return error(
        res,
        403,
        "This account has been deactivated"
      );
    }

    if (!tenant.password) {
      return error(
        res,
        500,
        "Password is not configured for this account"
      );
    }

    const isPasswordCorrect =
      await bcrypt.compare(
        password,
        tenant.password
      );

    if (!isPasswordCorrect) {
      return error(
        res,
        401,
        "Invalid credentials"
      );
    }

    const token = generateToken(
      tenant._id,
      "tenant"
    );

    return success(
      res,
      200,
      "Login successful",
      {
        token,
        tenant: {
          id: tenant._id,
          name: tenant.name,
          username: tenant.username,
          email: tenant.email,
          phone: tenant.phone || "",
          city: tenant.city || "",
          profileImage:
            tenant.profileImage || null,
          role: tenant.role,
          isActive: tenant.isActive,
          createdAt: tenant.createdAt,
        },
      }
    );
  } catch (err) {
    console.error(
      "LOGIN TENANT ERROR:",
      err
    );

    return error(
      res,
      500,
      err.message || "Failed to log in"
    );
  }
};

/**
 * GET /api/tenant/auth/me
 * Get logged-in tenant
 */
const getMe = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return error(
        res,
        401,
        "Authentication required"
      );
    }

    const tenant = await Tenant.findById(
      req.user._id
    ).select("-password");

    if (!tenant) {
      return error(
        res,
        404,
        "Tenant not found"
      );
    }

    return success(
      res,
      200,
      "Tenant profile fetched",
      {
        tenant: {
          id: tenant._id,
          name: tenant.name,
          username: tenant.username,
          email: tenant.email,
          phone: tenant.phone || "",
          city: tenant.city || tenant.location || "",
          location: tenant.location || tenant.city || "",
          profileImage:
            tenant.profilePicture || tenant.profileImage || tenant.avatar || null,
          role: tenant.role || "tenant",
          isActive: tenant.isActive !== false,
          createdAt: tenant.createdAt,
        },
      }
    );
  } catch (err) {
    console.error(
      "GET TENANT PROFILE ERROR:",
      err
    );

    return error(
      res,
      500,
      err.message || "Failed to fetch profile"
    );
  }
};

/**
 * PUT /api/tenant/auth/me
 * Update tenant profile
 */
const updateProfile = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return error(
        res,
        401,
        "Authentication required"
      );
    }

    const {
      name,
      phone,
      city,
      location,
      profileImage,
    } = req.body;

    const tenant = await Tenant.findById(
      req.user._id
    );

    if (!tenant) {
      return error(
        res,
        404,
        "Tenant not found"
      );
    }

    if (name !== undefined) {
      tenant.name = name.trim();
    }

    if (phone !== undefined) {
      tenant.phone = phone.trim();
    }

    const locVal = city !== undefined ? city : location;
    if (locVal !== undefined) {
      tenant.city = String(locVal).trim();
      tenant.location = String(locVal).trim();
    }

    if (profileImage !== undefined) {
      tenant.profileImage = profileImage;
      tenant.profilePicture = profileImage;
    }

    await tenant.save();

    // Also sync with TenantProfile model if it exists
    try {
      await TenantProfile.findOneAndUpdate(
        { tenantId: tenant._id },
        { preferredCity: tenant.city || tenant.location || "" },
        { upsert: false }
      );
    } catch {}

    return success(
      res,
      200,
      "Profile updated successfully",
      {
        tenant: {
          id: tenant._id,
          name: tenant.name,
          username: tenant.username,
          email: tenant.email,
          phone: tenant.phone || "",
          city: tenant.city || tenant.location || "",
          location: tenant.location || tenant.city || "",
          profileImage:
            tenant.profilePicture || tenant.profileImage || null,
          role: tenant.role || "tenant",
          isActive: tenant.isActive !== false,
          createdAt: tenant.createdAt,
        },
      }
    );
  } catch (err) {
    console.error(
      "UPDATE TENANT PROFILE ERROR:",
      err
    );

    return error(
      res,
      500,
      err.message || "Failed to update profile"
    );
  }
};

/**
 * Handle successful Google OAuth authentication
 */
const googleAuthCallback = async (req, res) => {
  try {
    const frontendUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const tenant = req.user;

    if (!tenant) {
      return res.redirect(`${frontendUrl}/login?error=auth_failed`);
    }

    const token = generateToken(tenant._id, "tenant");
    const userPayload = {
      id: tenant._id,
      _id: tenant._id,
      name: tenant.name,
      username: tenant.username,
      email: tenant.email,
      phone: tenant.phone || "",
      profilePicture: tenant.profilePicture || tenant.avatar || "",
      avatar: tenant.avatar || tenant.profilePicture || "",
      role: "tenant",
    };

    const encodedUser = encodeURIComponent(JSON.stringify(userPayload));
    return res.redirect(
      `${frontendUrl}/auth/google/success?token=${token}&user=${encodedUser}`
    );
  } catch (err) {
    console.error("Google Auth Callback Error:", err);
    const frontendUrl = process.env.CLIENT_URL || "http://localhost:5173";
    return res.redirect(`${frontendUrl}/login?error=server_error`);
  }
};

/**
 * Handle Google OAuth failure
 */
const googleAuthFailure = (req, res) => {
  const frontendUrl = process.env.CLIENT_URL || "http://localhost:5173";
  return res.redirect(`${frontendUrl}/login?error=google_cancelled`);
};

module.exports = {
  registerTenant,
  loginTenant,
  getMe,
  updateProfile,
  googleAuthCallback,
  googleAuthFailure,
};