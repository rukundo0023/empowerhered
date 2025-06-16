import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  try {
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables');
      throw new Error('JWT configuration error');
    }

    console.log('Generating token for user:', { userId: id });
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });
    console.log('Token generated successfully');
    return token;
  } catch (error) {
    console.error('Token generation error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    throw error;
  }
};

export default generateToken; 