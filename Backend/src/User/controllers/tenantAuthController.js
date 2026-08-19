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

    if (city !== undefined) {
      tenant.city = city.trim();
    }

    if (profileImage !== undefined) {
      tenant.profileImage = profileImage;
    }

    await tenant.save();

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

module.exports = {
  registerTenant,
  loginTenant,
  getMe,
  updateProfile,
};