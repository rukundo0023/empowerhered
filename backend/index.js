// Top of your index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connectDB from './config/db.js';
import http from 'http';
import multer from 'multer';
import path from 'path';
import userRoutes from "./routes/userRoutes.js";
import programRoutes from "./routes/programRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import storyRoutes from "./routes/storyRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import mentorRoutes from "./routes/mentorRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';
import { getProgressByInstructor } from './controllers/courseController.js';
import { protect } from './middlewares/authMiddlewares.js';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables with absolute path
dotenv.config({ path: join(__dirname, '.env') });

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET', 'MONGO_URI', 'GOOGLE_CLIENT_ID'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

console.log('Environment check:', {
  NODE_ENV: process.env.NODE_ENV,
  hasJWTSecret: !!process.env.JWT_SECRET,
  hasMongoURI: !!process.env.MONGO_URI,
  hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
  PORT: process.env.PORT || 5000,
  envPath: join(__dirname, '.env')
});

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:4173', 'http://localhost:5174', 'http://localhost:5175', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'http://127.0.0.1:5175'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Allow common file types
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|zip|rar/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only common file types are allowed!'));
    }
  }
});

// Create uploads directory if it doesn't exist
import fs from 'fs';
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// File upload endpoint
app.post('/upload', protect, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ 
      message: 'File uploaded successfully',
      fileUrl: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ message: 'File upload failed' });
  }
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/certificates", certificateRoutes);
app.get('/api/progress', protect, getProgressByInstructor);

// Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    
    let port = process.env.PORT || 5000;
    let server;

    const tryStartServer = () => {
      return new Promise((resolve, reject) => {
        server = app.listen(port)
          .on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
              port++;
              resolve(tryStartServer());
            } else {
              reject(err);
            }
          })
          .on('listening', () => {
            console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
            console.log(`Server URL: http://localhost:${port}`);
            resolve(server);
          });
      });
    };

    await tryStartServer();
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
