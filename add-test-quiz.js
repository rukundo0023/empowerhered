// Script to add a test quiz for testing routes
import mongoose from 'mongoose';
import Quiz from './models/quizModel.js';
import User from './models/userModel.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env') });

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

// Create a test quiz
const createTestQuiz = async () => {
  try {
    // Find an admin user to create the quiz
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('No admin user found. Creating one...');
      // Create a test admin user
      const testAdmin = await User.create({
        name: 'Test Admin',
        email: 'admin@test.com',
        password: 'password123',
        role: 'admin',
        gender: 'other'
      });
      console.log('Test admin user created:', testAdmin._id);
    }

    const creator = adminUser || await User.findOne({ role: 'admin' });
    
    // Create test quiz
    const testQuiz = await Quiz.create({
      title: 'Test Quiz for Computer Basics',
      description: 'A test quiz to verify the routes are working',
      questions: [
        {
          type: 'MCQ',
          text: 'What is the main screen of your computer called?',
          options: ['Monitor', 'Desktop', 'Taskbar', 'Start Button'],
          correctAnswer: 'Desktop',
          points: 10,
          explanation: 'The desktop is the main screen where you see icons and can access programs.'
        },
        {
          type: 'MCQ',
          text: 'Which of these is NOT a hardware component?',
          options: ['Monitor', 'Keyboard', 'Microsoft Word', 'Mouse'],
          correctAnswer: 'Microsoft Word',
          points: 10,
          explanation: 'Microsoft Word is software (a program), while monitor, keyboard, and mouse are hardware.'
        }
      ],
      course: '6871fb178c4beede7cfad04b', // Use the course ID from the error
      moduleId: '6871fb848c4beede7cfad05a', // Use the module ID from the error
      lessonId: '687201798c4beede7cfad063', // Use the lesson ID from the error
      passingScore: 70,
      timeLimit: 30,
      attemptsAllowed: 2,
      createdBy: creator._id,
      isActive: true
    });

    console.log('✅ Test quiz created successfully!');
    console.log('Quiz ID:', testQuiz._id);
    console.log('Course ID:', testQuiz.course);
    console.log('Module ID:', testQuiz.moduleId);
    console.log('Lesson ID:', testQuiz.lessonId);
    
    return testQuiz;
  } catch (error) {
    console.error('❌ Error creating test quiz:', error);
    throw error;
  }
};

// Main function
const main = async () => {
  try {
    console.log('🚀 Starting test quiz creation...');
    await connectDB();
    await createTestQuiz();
    console.log('✅ Test quiz creation completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
};

main(); 