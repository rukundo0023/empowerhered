// Top of your index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from './config/db.js';
import http from 'http';
import userRoutes from "./routes/userRoutes.js";
import programRoutes from "./routes/programRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import storyRoutes from "./routes/storyRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import mentorRoutes from "./routes/mentorRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';

dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: ['http://localhost:5175', 'http://localhost:5175', 'http://127.0.0.1:5175'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/contact", contactRoutes);

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
