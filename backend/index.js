// index.js (Cleaned and Working Version)

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
import path from "path";
import connectDB from "./config/db.js";

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
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import { getProgressByInstructor } from "./controllers/courseController.js";
import { protect } from "./middlewares/authMiddlewares.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, ".env") });

// Validate required environment variables
const requiredEnvVars = ["JWT_SECRET", "MONGO_URI", "GOOGLE_CLIENT_ID"];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  console.error("Missing required environment variables:", missingEnvVars);
  process.exit(1);
}

const app = express();

// Middlewares
const corsOrigins = process.env.NODE_ENV === "production" 
  ? ["https://empowerhered.vercel.app", "https://empowerhered.onrender.com"] 
  : ["http://localhost:3000", "http://localhost:4173", "http://127.0.0.1:5173"];

console.log('CORS Origins configured:', corsOrigins);
console.log('NODE_ENV:', process.env.NODE_ENV);

app.use(cors({
  origin: [
    "https://empowerhered.vercel.app",
    "https://empowerhered-1ixh.vercel.app",
    "https://empowerhered.onrender.com"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// File upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|zip|rar/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb(new Error("Only common file types are allowed!"));
  },
});

// Ensure uploads directory exists
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

// Upload endpoint
app.post("/upload", protect, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.json({
    message: "File uploaded successfully",
    fileUrl,
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size,
  });
});

// Static uploads
app.use("/uploads", express.static("uploads"));

// Test route
console.log('About to register test route...');
app.get('/', (req, res) => {
  console.log('Root endpoint accessed');
  res.json({
    message: 'API is running...',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});
console.log('Successfully registered test route');

// Add a more informative root route for production
app.get('/api', (req, res) => {
  res.json({
    message: 'EmpowerHerEd API is running',
    version: '1.0.0',
    endpoints: {
      courses: '/api/courses',
      mentors: '/api/mentors',
      users: '/api/users',
      resources: '/api/resources',
      stories: '/api/stories',
      contact: '/api/contact'
    },
    status: 'active'
  });
});

// API routes
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
app.get("/api/progress", protect, getProgressByInstructor);

// Production frontend serving
if (process.env.NODE_ENV === "production") {
  console.log('Setting up production static file serving...');
  const frontendPath = join(__dirname, "frontend-dist");
  console.log('Frontend path:', frontendPath);
  
  // Check if frontend-dist exists
  if (fs.existsSync(frontendPath)) {
    // Serve static files
    app.use(express.static(frontendPath));
    console.log('Static file serving configured');

    // Serve index.html for all non-API routes
    app.get('*', (req, res) => {
      // Skip API routes
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ message: 'API endpoint not found' });
      }
      console.log('Serving index.html for path:', req.path);
      res.sendFile(join(frontendPath, "index.html"));
    });
    console.log('Catch-all route configured with regex pattern');
  } else {
    console.log('Frontend-dist directory not found, serving API info for root path');
    // Fallback: serve API info for root path
    app.get('*', (req, res) => {
      // Skip API routes
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ message: 'API endpoint not found' });
      }
      res.json({
        message: 'EmpowerHerEd API is running',
        version: '1.0.0',
        note: 'Frontend not deployed yet. This is the API server.',
        endpoints: {
          courses: '/api/courses',
          mentors: '/api/mentors',
          users: '/api/users',
          resources: '/api/resources',
          stories: '/api/stories',
          contact: '/api/contact'
        },
        status: 'active'
      });
    });
  }
}

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start the server
const startServer = async () => {
  try {
    await connectDB();
    let port = process.env.PORT || 5000;
    const tryStart = () => new Promise((resolve, reject) => {
      const server = app.listen(port)
        .on("error", err => {
          if (err.code === "EADDRINUSE") {
            port++;
            resolve(tryStart());
          } else reject(err);
        })
        .on("listening", () => {
          console.log(`Server running in ${process.env.NODE_ENV} mode on http://localhost:${port}`);
          resolve(server);
        });
    });
    await tryStart();
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();