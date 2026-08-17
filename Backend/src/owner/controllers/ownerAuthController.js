const asyncHandler = require('express-async-handler');
const Owner = require('../models/Owner');
const Property = require('../models/Property');
const generateToken = require('../../common/utils/generateToken');

// @desc    Register a new Owner
// @route   POST /api/owners/register
// @access  Public
const registerOwner = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    res.status(400);
    throw new Error('Please fill all fields');
  }

  const ownerExists = await Owner.findOne({ email });
  if (ownerExists) {
    res.status(400);
    throw new Error('Owner already exists with this email');
  }

  const owner = await Owner.create({ name, email, phone, password });

  res.status(201).json({
    _id: owner._id,
    name: owner.name,
    email: owner.email,
    role: owner.role,
    status: owner.status,
    message: 'Registration successful! Please wait for Admin approval.',
  });
});

// @desc    Auth owner & get token
// @route   POST /api/owners/login
// @access  Public
const loginOwner = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const owner = await Owner.findOne({ email });

  if (owner && (await owner.matchPassword(password))) {
    // Check if approved by admin
    if (owner.status === 'pending') {
      res.status(403);
      throw new Error('Your account is waiting for admin approval.');
    }
    if (owner.status === 'rejected') {
      res.status(403);
      throw new Error('Your application has been rejected.');
    }

    generateToken(res, owner._id, 'owner');

    res.json({
      _id: owner._id,
      name: owner.name,
      email: owner.email,
      role: owner.role,
      status: owner.status,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Logout owner / clear cookie
// @route   POST /api/owners/logout
// @access  Private
const logoutOwner = (req, res) => {
  res.cookie('owner_jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = { registerOwner, loginOwner, logoutOwner };