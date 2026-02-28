const { z } = require('zod');

// Schema for User Registration
const registerUserSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' })
      .min(2, 'Name must be at least 2 characters long')
      .max(50, 'Name cannot exceed 50 characters'),
      
    email: z.string({ required_error: 'Email is required' })
      .email('Invalid email format'),
      
    password: z.string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters long')
      // regex -> to enforce uppercase, numbers, etc.
      .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
  }),
});

// Schema for User Login (no name needed, just email and pw)
const loginUserSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).email('Invalid email format'),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

module.exports = {
  registerUserSchema,
  loginUserSchema,
};