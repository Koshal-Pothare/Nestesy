const asyncHandler = require('express-async-handler');
const Owner = require('../models/Owner');
const OwnerProfile = require('../models/OwnerProfile');

// @desc    Get owner profile (Auth + Extended Profile)
// @route   GET /api/owners/profile
// @access  Private
const getOwnerProfile = asyncHandler(async (req, res) => {
  const owner = await Owner.findById(req.user._id).select('-password');
  
  if (!owner) {
    res.status(404);
    throw new Error('Owner not found');
  }

  // Find or create extended profile (upsert avoids duplicate key errors)
  let profile = await OwnerProfile.findOneAndUpdate(
    { owner: req.user._id },
    { $setOnInsert: { owner: req.user._id } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.json({
    // From Owner Model
    _id: owner._id,
    name: owner.name,
    email: owner.email,
    phone: owner.phone,
    role: owner.role,
    status: owner.status,
    
    // From OwnerProfile Model
    profilePicture: profile.profilePicture,
    alternatePhone: profile.alternatePhone,
    bio: profile.bio,
    companyName: profile.companyName,
    address: profile.address,
    city: profile.city,
    state: profile.state,
    pincode: profile.pincode,
    socialLinks: profile.socialLinks,
    isProfileComplete: profile.isProfileComplete
  });
});

// @desc    Update owner profile
// @route   PUT /api/owners/profile
// @access  Private
const updateOwnerProfile = asyncHandler(async (req, res) => {
  const owner = await Owner.findById(req.user._id);

  if (!owner) {
    res.status(404);
    throw new Error('Owner not found');
  }

  // 1. Update Basic Owner fields (Name, Email, Phone)
  owner.name = req.body.name || owner.name;
  owner.phone = req.body.phone || owner.phone;
  
  if (req.body.email && req.body.email !== owner.email) {
    const emailExists = await Owner.findOne({ email: req.body.email });
    if (emailExists) {
      res.status(400);
      throw new Error('Email is already in use');
    }
    owner.email = req.body.email;
  }

  const updatedOwner = await owner.save();

  // 2. Update or Create Extended Profile fields
  let profile = await OwnerProfile.findOne({ owner: req.user._id });
  
  if (!profile) {
    profile = await OwnerProfile.create({ owner: req.user._id });
  }

  profile.profilePicture = req.body.profilePicture || profile.profilePicture;
  profile.alternatePhone = req.body.alternatePhone || profile.alternatePhone;
  profile.bio = req.body.bio || profile.bio;
  profile.companyName = req.body.companyName || profile.companyName;
  profile.address = req.body.address || profile.address;
  profile.city = req.body.city || profile.city;
  profile.state = req.body.state || profile.state;
  profile.pincode = req.body.pincode || profile.pincode;
  
  if (req.body.socialLinks) {
    profile.socialLinks = {
      website: req.body.socialLinks.website || profile.socialLinks.website,
      facebook: req.body.socialLinks.facebook || profile.socialLinks.facebook,
      instagram: req.body.socialLinks.instagram || profile.socialLinks.instagram,
      linkedin: req.body.socialLinks.linkedin || profile.socialLinks.linkedin
    };
  }

  // Check if profile is complete (basic logic)
  if (profile.address && profile.city && profile.state && profile.pincode && profile.bio) {
    profile.isProfileComplete = true;
  }

  const updatedProfile = await profile.save();

  res.json({
    _id: updatedOwner._id,
    name: updatedOwner.name,
    email: updatedOwner.email,
    phone: updatedOwner.phone,
    role: updatedOwner.role,
    status: updatedOwner.status,
    
    profilePicture: updatedProfile.profilePicture,
    bio: updatedProfile.bio,
    companyName: updatedProfile.companyName,
    address: updatedProfile.address,
    city: updatedProfile.city,
    state: updatedProfile.state,
    pincode: updatedProfile.pincode,
    socialLinks: updatedProfile.socialLinks,
    isProfileComplete: updatedProfile.isProfileComplete,
    message: 'Profile updated successfully'
  });
});

// @desc    Change owner password
// @route   PUT /api/owners/change-password
// @access  Private
const changeOwnerPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error('Please provide current and new password');
  }

  const owner = await Owner.findById(req.user._id).select('+password');

  if (!owner) {
    res.status(404);
    throw new Error('Owner not found');
  }

  const isMatch = await owner.matchPassword(currentPassword);
  if (!isMatch) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }

  if (newPassword.length < 6) {
    res.status(400);
    throw new Error('New password must be at least 6 characters long');
  }

  owner.password = newPassword;
  await owner.save();

  res.json({ message: 'Password changed successfully' });
});

module.exports = {
  getOwnerProfile,
  updateOwnerProfile,
  changeOwnerPassword
};