const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'No token provided, authorization denied' 
      });
    }

    // Extract token from "Bearer TOKEN"
    const token = authHeader.substring(7);

    if (!token) {
      return res.status(401).json({ 
        message: 'No token provided, authorization denied' 
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'c63df28ab7d44c0b197d4a79e7088cb03259968b67a9f112e70b520630ed63d126711d1da62e778c2dcba5ec0af20c6291d2bd36f49b049a85bda1227423c8a0');
      
      // Get user from database
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        return res.status(401).json({ 
          message: 'Token is not valid, user not found' 
        });
      }

      // Add user to request object
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ 
        message: 'Token is not valid' 
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      message: 'Server error in authentication' 
    });
  }
};

// Optional auth middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'c63df28ab7d44c0b197d4a79e7088cb03259968b67a9f112e70b520630ed63d126711d1da62e778c2dcba5ec0af20c6291d2bd36f49b049a85bda1227423c8a0');
          const user = await User.findById(decoded.userId).select('-password');
          
          if (user) {
            req.user = user;
          }
        } catch (error) {
          // Token invalid, but continue without user
          console.log('Optional auth: Invalid token');
        }
      }
    }
    
    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next();
  }
};

module.exports = { authMiddleware, optionalAuth };