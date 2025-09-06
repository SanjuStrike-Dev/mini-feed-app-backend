const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    // Verify the token
    const secret = process.env.JWT_SECRET || 'mini-feed-app-super-secret-jwt-key-2024';
    const decoded = jwt.verify(token, secret);
    
    // Find the user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token - user not found'
      });
    }

    // For static OTP system, we don't need to check isVerified
    // The user is considered verified if they have a valid JWT token

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

// Middleware to generate JWT token
const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'mini-feed-app-super-secret-jwt-key-2024';
  return jwt.sign(
    { userId },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Middleware to verify user ownership (for posts)
const verifyOwnership = (Model) => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params.id;
      const userId = req.user._id;

      const resource = await Model.findById(resourceId);
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
      }

      // Check if the user owns the resource
      if (!resource.userId.equals(userId)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only access your own resources.'
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      console.error('Ownership verification error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error verifying ownership'
      });
    }
  };
};

module.exports = {
  authenticateToken,
  generateToken,
  verifyOwnership
};
