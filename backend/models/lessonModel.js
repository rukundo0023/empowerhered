const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  type: String, // e.g., 'quiz'
  config: Object, // e.g., { questions: [...] }
});

const lessonSchema = new mongoose.Schema({
  title: String,
  content: String,
  games: [gameSchema], // Array of games for this lesson
  // ...other fields
});

module.exports = mongoose.model('Lesson', lessonSchema); 