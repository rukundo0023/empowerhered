const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import Course model
const Course = require('./backend/models/courseModel.js');

async function checkLessonLength() {
  try {
    console.log('🔍 Searching for lessons in database...\\n');
    
    // Find all courses
    const courses = await Course.find({});
    
    if (courses.length === 0) {
      console.log('❌ No courses found in database');
      return;
    }
    
    console.log(`📚 Found ${courses.length} courses:\\n`);
    
    let totalLessons = 0;
    let lessonsWithContent = 0;
    
    // Search through all courses, modules, and lessons
    for (const course of courses) {
      console.log(`📖 Course: ${course.title}`);
      console.log(`   📊 Modules: ${course.modules?.length || 0}`);
      
      if (course.modules && course.modules.length > 0) {
        for (const module of course.modules) {
          console.log(`   📁 Module: ${module.title}`);
          console.log(`      📝 Lessons: ${module.lessons?.length || 0}`);
          
          if (module.lessons && module.lessons.length > 0) {
            for (const lesson of module.lessons) {
              totalLessons++;
              const contentLength = lesson.content ? lesson.content.length : 0;
              const wordCount = lesson.content ? lesson.content.split('\\s+').length : 0;
              
              console.log(`      📄 Lesson: ${lesson.title}`);
              console.log(`         📏 Content Length: ${contentLength} characters`);
              console.log(`         📝 Word Count: ~${wordCount} words`);
              
              if (contentLength > 0) {
                lessonsWithContent++;
                // Estimate reading time (average 200 words per minute)
                const estimatedMinutes = Math.ceil(wordCount / 200);
                console.log(`         ⏱️  Estimated Reading Time: ~${estimatedMinutes} minutes`);
              } else {
                console.log(`         ⚠️  No content`);
              }
              console.log('');
            }
          }
        }
      }
      console.log('');
    }
    
    console.log(`📊 Summary:`);
    console.log(`   Total Lessons: ${totalLessons}`);
    console.log(`   Lessons with Content: ${lessonsWithContent}`);
    console.log(`   Lessons without Content: ${totalLessons - lessonsWithContent}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkLessonLength(); 