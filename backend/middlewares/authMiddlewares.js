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
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      return next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  return res.status(401).json({ message: 'Not authorized, no token' });
};

// Only allow the super admin with specific email
export const admin = (req, res, next) => {
  const { role, email } = req.user;

  if (role === 'admin' && email === AUTHORIZED_USERS.superAdmin.email) {
    return next();
  }

  return res.status(401).json({ message: 'Not authorized as super admin' });
};

// Allow only authorized mentors
export const mentor = (req, res, next) => {
  const { role, email } = req.user;

  if (role === 'mentor' && AUTHORIZED_USERS.mentors.includes(email)) {
    return next();
  }

  return res.status(401).json({ message: 'Not authorized as a valid mentor' });
};
