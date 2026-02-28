const express = require('express');
const router = express.Router();

// 1. Import Middlewares
const validateRequest = require('../middlewares/validateRequest');
const { protect } = require('../middlewares/auth.middleware'); 

// 2. Import Validations
const { registerUserSchema, loginUserSchema } = require('../validations/user.validation');

// 3. Import Controllers
const { registerUser, loginUser, getMe } = require('../controllers/auth.controller');


// --- Define Routes ---

// POST /api/v1/auth/register
router.post('/register', validateRequest(registerUserSchema), registerUser);

// POST /api/v1/auth/login
router.post('/login', validateRequest(loginUserSchema), loginUser);

// GET /api/v1/auth/me
// pehle protect middleware se user ko authenticate karenge, agar token valid hai toh getMe controller execute hoga
router.get('/me', protect, getMe);

module.exports = router;