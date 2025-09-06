const express = require('express');
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

const router = express.Router();

// Static OTP for all users
const STATIC_OTP = '123456';

// POST /auth/register - Register user
router.post('/register', async (req, res) => {
  try {
    const { mobile, name } = req.body;

    // Basic validation
    if (!mobile || !name) {
      return res.status(400).json({
        success: false,
        message: 'Mobile and name are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create new user
    const user = new User({
      mobile,
      name
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        userId: user._id,
        mobile: user.mobile,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
});

// POST /auth/login - Login with OTP
router.post('/login', async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    // Basic validation
    if (!mobile || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Mobile and OTP are required'
      });
    }

    // Find user by mobile
    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check OTP (static OTP)
    if (otp !== STATIC_OTP) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          mobile: user.mobile,
          name: user.name,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

module.exports = router;
