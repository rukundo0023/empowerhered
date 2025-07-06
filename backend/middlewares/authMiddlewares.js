// authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { AUTHORIZED_USERS } from '../config/authorizedUsers.js';

// Middleware to protect routes with JWT
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('Protect middleware - Verifying token');
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Protect middleware - Token decoded:', { id: decoded.id });

      // Only select necessary fields
      const user = await User.findById(decoded.id).select('_id name email role');
      console.log('Protect middleware - User found:', { 
        id: user?._id, 
        email: user?.email, 
        role: user?.role 
      });

      if (!user) {
        console.log('Protect middleware - User not found');
        return res.status(401).json({ message: 'User not found' });
      }

      req.user = user;
      console.log('Protect middleware - User authenticated successfully');
      return next();
    } catch (error) {
      console.error('Protect middleware - Token verification error:', error);
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      }
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  console.log('Protect middleware - No token provided');
  return res.status(401).json({ message: 'Not authorized, no token' });
};

// Only allow the super admin with specific email
export const admin = (req, res, next) => {
  const { role, email } = req.user;
  console.log('Admin middleware - Checking admin access:', { role, email });

  if (role === 'admin') {
    console.log('Admin middleware - Access granted');
    return next();
  }

  console.log('Admin middleware - Access denied');
  return res.status(401).json({ message: 'Not authorized as admin' });
};

// Allow only authorized mentors
export const mentor = (req, res, next) => {
  const { role, email } = req.user;
  console.log('Mentor middleware - Checking mentor access:', { role, email });

  if (role === 'mentor' && AUTHORIZED_USERS.mentors.includes(email)) {
    console.log('Mentor middleware - Access granted');
    return next();
  }

  console.log('Mentor middleware - Access denied');
  return res.status(401).json({ message: 'Not authorized as a valid mentor' });
};

// Allow only authorized instructors
export const instructor = (req, res, next) => {
  const { role, email } = req.user;
  console.log('Instructor middleware - Checking instructor access:', { role, email });

  if (role === 'instructor' && AUTHORIZED_USERS.instructors.includes(email)) {
    console.log('Instructor middleware - Access granted');
    return next();
  }

  console.log('Instructor middleware - Access denied');
  return res.status(401).json({ message: 'Not authorized as a valid instructor' });
};

export const adminOrInstructor = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'instructor')) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as admin or instructor' });
  }
};
