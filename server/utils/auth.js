const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    console.log('Auth middleware - URL:', req.url);
    console.log('Auth middleware - Token present:', !!token);

    if (!token) {
      console.log('Auth middleware - No token provided');
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = verifyToken(token);
    console.log('Auth middleware - Token decoded:', !!decoded);
    console.log('Auth middleware - Decoded userId:', decoded?.userId);

    if (!decoded) {
      console.log('Auth middleware - Invalid or expired token');
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    const user = await User.findById(decoded.userId).select('-password');
    console.log('Auth middleware - User found:', !!user);
    console.log('Auth middleware - User isActive:', user?.isActive);

    if (!user || !user.isActive) {
      console.log('Auth middleware - User not found or inactive');
      return res.status(403).json({ error: 'User not found or inactive' });
    }

    console.log('Auth middleware - Authentication successful for user:', user._id);
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        const user = await User.findById(decoded.userId).select('-password');
        if (user && user.isActive) {
          req.user = user;
        }
      }
    }
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

module.exports = {
  generateToken,
  verifyToken,
  authenticateToken,
  optionalAuth,
  JWT_SECRET
}; 