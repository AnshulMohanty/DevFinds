const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user.model');

const protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    const error = new Error('Not authorized to access this route. No token provided.');
    error.statusCode = 401;
    throw error;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      const error = new Error('The user belonging to this token no longer exists.');
      error.statusCode = 401;
      throw error;
    }

    next();
  } catch (err) {
    const error = new Error('Not authorized. Token failed verification.');
    error.statusCode = 401;
    throw error;
  }
});

module.exports = { protect };