import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  // Generate token with 7 days expiration
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

export default generateToken; 