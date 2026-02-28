const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');

// --- jWT generate krne ka Fn : 'Generate JWT' ---
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// --- Controller: Register a New User ---
const registerUser = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    const error = new Error('User already exists with this email');
    error.statusCode = 400; 
    throw error; 
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const token = signToken(user._id);

  res.status(201).json({
    success: true,
    token,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

// --- Controller: Login an Existing User ---
const loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401; 
    throw error;
  }

  const token = signToken(user._id);

  res.status(200).json({
    success: true,
    token,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

// --- Controller: Get Current Logged In User ---
const getMe = catchAsync(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});

// sb yahan export kr rahe hain taaki hum apne routes me use kar sakein
module.exports = {
  registerUser,
  loginUser,
  getMe,
};