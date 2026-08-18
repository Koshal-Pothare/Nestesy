import Tenant from '../models/Tenant.js';
import bcrypt from 'bcryptjs';

// Get profile
export const getProfile = async (req, res) => {
  try {
    const tenantId = req.user._id;

    const tenant = await Tenant.findById(tenantId);

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found',
      });
    }

    res.status(200).json({
      success: true,
      tenant: tenant.toJSON(),
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while fetching profile',
    });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const tenantId = req.user._id;
    const { name, phone, location, profilePicture } = req.body;

    const tenant = await Tenant.findById(tenantId);

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found',
      });
    }

    if (name) tenant.name = name;
    if (phone) tenant.phone = phone;
    if (location) tenant.location = location;
    if (profilePicture) tenant.profilePicture = profilePicture;

    tenant.updatedAt = Date.now();
    await tenant.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      tenant: tenant.toJSON(),
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while updating profile',
    });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const tenantId = req.user._id;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    const tenant = await Tenant.findById(tenantId).select('+password');

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found',
      });
    }

    // Verify current password
    const isPasswordCorrect = await tenant.comparePassword(currentPassword);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Update password
    tenant.password = newPassword;
    await tenant.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while changing password',
    });
  }
};

// Get profile completion percentage
export const getProfileCompletion = async (req, res) => {
  try {
    const tenantId = req.user._id;

    const tenant = await Tenant.findById(tenantId);

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found',
      });
    }

    const fields = [tenant.name, tenant.email, tenant.phone, tenant.location];
    const completedFields = fields.filter((field) => field && field.trim() !== '').length;
    const completionPercentage = Math.round((completedFields / fields.length) * 100);

    res.status(200).json({
      success: true,
      completionPercentage,
      completedFields,
      totalFields: fields.length,
    });
  } catch (error) {
    console.error('Error fetching profile completion:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while fetching profile completion',
    });
  }
};

// Delete account
export const deleteAccount = async (req, res) => {
  try {
    const tenantId = req.user._id;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your password',
      });
    }

    const tenant = await Tenant.findById(tenantId).select('+password');

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found',
      });
    }

    // Verify password
    const isPasswordCorrect = await tenant.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Password is incorrect',
      });
    }

    // Delete tenant and associated data
    await Tenant.findByIdAndDelete(tenantId);
    // Also delete bookings, favorites, reviews (if cascading is set up)

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while deleting account',
    });
  }
};
