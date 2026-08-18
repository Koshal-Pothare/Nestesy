const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema(
  {
    // ===============================
    // OWNER BASIC DETAILS
    // ===============================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    // ===============================
    // PASSWORD
    // ===============================

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    // ===============================
    // ROLE
    // ===============================

    role: {
      type: String,
      enum: ["owner"],
      default: "owner",
    },

    // ===============================
    // OWNER APPROVAL STATUS
    // ===============================

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },

    // ===============================
    // ACCOUNT ACTIVE STATUS
    // ===============================

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Owner ||
  mongoose.model("Owner", ownerSchema);