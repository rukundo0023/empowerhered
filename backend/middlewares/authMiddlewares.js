// authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

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

// ✅ Only allow the super admin with specific email and username
export const admin = (req, res, next) => {
  const { role, email, username } = req.user;

  if (
    role === 'admin' &&
    email === 'clevisrukundo@gmail.com' &&
    username === 'rukukundo Nshimiyimana'
  ) {
    return next();
  }

  return res.status(401).json({ message: 'Not authorized as super admin' });
};

// ✅ Allow only mentors from a specific whitelist
const allowedMentors = ['mentor1@example.com', 'mentor2@example.com']; // replace with real emails

export const mentor = (req, res, next) => {
  const { role, email } = req.user;

  if (role === 'mentor' && allowedMentors.includes(email)) {
    return next();
  }

  return res.status(401).json({ message: 'Not authorized as a valid mentor' });
};
