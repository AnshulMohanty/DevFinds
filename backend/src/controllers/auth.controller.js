const User = require('../models/User.model');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d'
  });
};

exports.register = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });
  const token = signToken(user._id);
  res.status(201).json({ success: true, token, data: user });
});

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Please provide email and password' });

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = signToken(user._id);
  res.status(200).json({ success: true, token, data: user });
});

exports.getMe = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, data: user });
});

exports.updateProfile = catchAsync(async (req, res) => {
  try {
    const { name, bio, githubUrl } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, bio, githubUrl },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("🔥 PROFILE UPDATE ERROR:", error);
    // THIS IS THE FIX: We are sending the EXACT database error to your frontend UI
    res.status(500).json({ 
      success: false, 
      error: `DB ERROR: ${error.message}` 
    });
  }
});