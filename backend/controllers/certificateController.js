import asyncHandler from 'express-async-handler';
import Certificate from '../models/certificateModel.js';
import User from '../models/userModel.js';
import Course from '../models/courseModel.js';
import Quiz from '../models/quizModel.js';
import Assignment from '../models/assignmentModel.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

// @desc    Generate certificate for course completion
// @route   POST /api/certificates/generate
// @access  Private
const generateCertificate = asyncHandler(async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user._id;

  try {
    // Check if user has already received a certificate for this course
    const existingCertificate = await Certificate.findOne({
      student: userId,
      course: courseId,
    });

    if (existingCertificate) {
      return res.status(400).json({
        message: 'Certificate already exists for this course',
        certificate: existingCertificate,
      });
    }

    // Get user and course details
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user || !course) {
      return res.status(404).json({ message: 'User or course not found' });
    }

    // Check if course is completed (100% progress)
    const courseProgress = user.courseProgress.find(
      (p) => p.courseId.toString() === courseId
    );

    if (!courseProgress || courseProgress.progress < 100) {
      return res.status(400).json({
        message: 'Course must be 100% completed to generate certificate',
        currentProgress: courseProgress?.progress || 0,
      });
    }

    // Calculate final score and grade
    const { finalScore, grade } = await calculateFinalScore(userId, courseId);

    // Generate PDF certificate
    const certificateUrl = await generatePDFCertificate(user, course, finalScore, grade);

    // Create certificate record
    const certificate = new Certificate({
      student: userId,
      course: courseId,
      completionDate: new Date(),
      finalScore,
      grade,
      certificateUrl,
      issuedBy: course.createdBy || userId, // Course creator or system
      metadata: {
        totalLessons: course.modules.reduce((sum, mod) => sum + mod.lessons.length, 0),
        completedLessons: courseProgress.progress,
        quizScores: await getQuizScores(userId, courseId),
        assignmentScores: await getAssignmentScores(userId, courseId),
      },
    });

    await certificate.save();

    res.status(201).json({
      message: 'Certificate generated successfully',
      certificate,
    });
  } catch (error) {
    console.error('Error generating certificate:', error);
    res.status(500).json({ message: 'Error generating certificate' });
  }
});

// @desc    Get user's certificates
// @route   GET /api/certificates/my-certificates
// @access  Private
const getMyCertificates = asyncHandler(async (req, res) => {
  const certificates = await Certificate.find({ student: req.user._id })
    .populate('course', 'title description level category')
    .populate('issuedBy', 'name')
    .sort({ issueDate: -1 });

  res.json(certificates);
});

// @desc    Get certificate by ID
// @route   GET /api/certificates/:id
// @access  Private
const getCertificateById = asyncHandler(async (req, res) => {
  const certificate = await Certificate.findById(req.params.id)
    .populate('student', 'name email')
    .populate('course', 'title description level category')
    .populate('issuedBy', 'name');

  if (!certificate) {
    return res.status(404).json({ message: 'Certificate not found' });
  }

  // Check if user has permission to view this certificate
  if (certificate.student._id.toString() !== req.user._id.toString() &&
      !['admin', 'instructor'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Not authorized to view this certificate' });
  }

  res.json(certificate);
});

// @desc    Download certificate PDF
// @route   GET /api/certificates/:id/download
// @access  Private
const downloadCertificate = asyncHandler(async (req, res) => {
  const certificate = await Certificate.findById(req.params.id);

  if (!certificate) {
    return res.status(404).json({ message: 'Certificate not found' });
  }

  // Check if user has permission to download this certificate
  if (certificate.student.toString() !== req.user._id.toString() &&
      !['admin', 'instructor'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Not authorized to download this certificate' });
  }

  if (!certificate.certificateUrl) {
    return res.status(404).json({ message: 'Certificate PDF not found' });
  }

  const filePath = path.join(process.cwd(), 'uploads', 'certificates', certificate.certificateUrl);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'Certificate file not found' });
  }

  res.download(filePath, `certificate-${certificate.certificateNumber}.pdf`);
});

// @desc    Verify certificate
// @route   GET /api/certificates/verify/:certificateNumber
// @access  Public
const verifyCertificate = asyncHandler(async (req, res) => {
  const { certificateNumber } = req.params;

  const certificate = await Certificate.findOne({ certificateNumber })
    .populate('student', 'name')
    .populate('course', 'title')
    .populate('issuedBy', 'name');

  if (!certificate) {
    return res.status(404).json({ 
      valid: false, 
      message: 'Certificate not found' 
    });
  }

  // Check if certificate is still valid
  const isValid = certificate.status === 'active' && 
                  certificate.validUntil > new Date();

  res.json({
    valid: isValid,
    certificate: {
      certificateNumber: certificate.certificateNumber,
      studentName: certificate.student.name,
      courseTitle: certificate.course.title,
      issueDate: certificate.issueDate,
      completionDate: certificate.completionDate,
      grade: certificate.grade,
      finalScore: certificate.finalScore,
      issuedBy: certificate.issuedBy.name,
      status: certificate.status,
      validUntil: certificate.validUntil,
    },
  });
});

// Helper function to calculate final score and grade
const calculateFinalScore = async (userId, courseId) => {
  const user = await User.findById(userId);
  const course = await Course.findById(courseId);

  let totalScore = 0;
  let totalPossible = 0;

  // Calculate quiz scores
  const quizScores = await getQuizScores(userId, courseId);
  quizScores.forEach(quiz => {
    totalScore += quiz.score;
    totalPossible += quiz.total;
  });

  // Calculate assignment scores
  const assignmentScores = await getAssignmentScores(userId, courseId);
  assignmentScores.forEach(assignment => {
    totalScore += assignment.score;
    totalPossible += assignment.total;
  });

  const finalScore = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;

  // Determine grade
  let grade = 'Pass';
  if (finalScore >= 90) grade = 'Honors';
  else if (finalScore >= 80) grade = 'Distinction';
  else if (finalScore >= 70) grade = 'Merit';

  return { finalScore, grade };
};

// Helper function to get quiz scores
const getQuizScores = async (userId, courseId) => {
  const user = await User.findById(userId);
  const course = await Course.findById(courseId);

  const quizScores = [];
  
  // Get all quizzes for this course
  const quizzes = await Quiz.find({ course: courseId });
  
  for (const quiz of quizzes) {
    const quizResult = user.quizResults.find(qr => 
      qr.quizId.toString() === quiz._id.toString()
    );
    
    if (quizResult) {
      quizScores.push({
        quizId: quiz._id,
        score: quizResult.score,
        total: quizResult.total,
      });
    }
  }

  return quizScores;
};

// Helper function to get assignment scores
const getAssignmentScores = async (userId, courseId) => {
  const user = await User.findById(userId);
  const course = await Course.findById(courseId);

  const assignmentScores = [];
  
  // Get all assignments for this course
  const assignments = await Assignment.find({ course: courseId });
  
  for (const assignment of assignments) {
    const submission = assignment.submissions.find(sub => 
      sub.student.toString() === userId.toString()
    );
    
    if (submission && submission.grade !== undefined) {
      assignmentScores.push({
        assignmentId: assignment._id,
        score: submission.grade,
        total: assignment.totalPoints || 100,
      });
    }
  }

  return assignmentScores;
};

// Helper function to generate PDF certificate
const generatePDFCertificate = async (user, course, finalScore, grade) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
      });

      const fileName = `certificate-${user._id}-${course._id}-${Date.now()}.pdf`;
      const filePath = path.join(process.cwd(), 'uploads', 'certificates', fileName);
      
      // Ensure directory exists
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Certificate design
      doc
        .fontSize(40)
        .font('Helvetica-Bold')
        .fill('#2C3E50')
        .text('Certificate of Completion', 0, 100, { align: 'center' });

      doc
        .fontSize(16)
        .font('Helvetica')
        .fill('#34495E')
        .text('This is to certify that', 0, 180, { align: 'center' });

      doc
        .fontSize(24)
        .font('Helvetica-Bold')
        .fill('#2C3E50')
        .text(user.name, 0, 220, { align: 'center' });

      doc
        .fontSize(16)
        .font('Helvetica')
        .fill('#34495E')
        .text('has successfully completed the course', 0, 260, { align: 'center' });

      doc
        .fontSize(20)
        .font('Helvetica-Bold')
        .fill('#2C3E50')
        .text(course.title, 0, 300, { align: 'center' });

      doc
        .fontSize(14)
        .font('Helvetica')
        .fill('#7F8C8D')
        .text(`Grade: ${grade} (${finalScore}%)`, 0, 350, { align: 'center' });

      doc
        .fontSize(12)
        .font('Helvetica')
        .fill('#95A5A6')
        .text(`Issued on ${new Date().toLocaleDateString()}`, 0, 400, { align: 'center' });

      // Add decorative border
      doc
        .lineWidth(3)
        .strokeColor('#3498DB')
        .rect(50, 50, doc.page.width - 100, doc.page.height - 100)
        .stroke();

      doc.end();

      stream.on('finish', () => {
        resolve(fileName);
      });

      stream.on('error', (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
};

export {
  generateCertificate,
  getMyCertificates,
  getCertificateById,
  downloadCertificate,
  verifyCertificate,
}; 