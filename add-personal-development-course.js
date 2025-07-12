const axios = require('axios');

// Configuration - Update these values
const API_BASE_URL = 'http://localhost:5000/api'; // Update if your backend runs on different port
const ADMIN_TOKEN = 'YOUR_ADMIN_TOKEN_HERE'; // Get this from your admin login

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${ADMIN_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// Course data from the JSON structure
const courseData = {
  title: "Personal Development & Leadership",
  description: "A comprehensive course designed to build self-confidence, develop leadership skills, and foster personal growth for women in technology and business.",
  duration: "8 weeks",
  level: "beginner",
  category: "personal-development",
  imageUrl: "https://via.placeholder.com/400x300/8B5CF6/FFFFFF?text=Personal+Development"
};

const module1Data = {
  title: "Building Self-Confidence",
  description: "Learn the fundamentals of self-confidence and how to develop a strong sense of self-worth.",
  order: 1
};

const lesson1Data = {
  title: "Understanding Self-Confidence",
  content: `Self-confidence is the foundation of personal and professional success. It's the belief in your abilities, qualities, and judgment. When you're confident, you're more likely to take risks, pursue opportunities, and handle challenges effectively.

**The Confidence Cycle**
Confidence works in a cycle:
1. **Self-awareness** - Understanding your strengths and areas for growth
2. **Self-acceptance** - Embracing who you are, including imperfections
3. **Self-efficacy** - Believing in your ability to achieve goals
4. **Action** - Taking steps toward your objectives
5. **Success** - Achieving results, which builds more confidence

**Building Blocks of Confidence**
- **Knowledge and Skills**: The more you know and can do, the more confident you become
- **Experience**: Past successes (and learning from failures) build confidence
- **Positive Self-Talk**: How you speak to yourself matters
- **Body Language**: How you carry yourself affects how you feel
- **Support System**: Surrounding yourself with positive, encouraging people

**Common Confidence Killers**
- Comparing yourself to others
- Perfectionism
- Fear of failure
- Negative self-talk
- Lack of preparation

Remember: Confidence is not about being perfect or never feeling afraid. It's about believing in your ability to handle whatever comes your way.`,
  learningObjectives: [
    "Understand what self-confidence is and why it matters",
    "Identify the confidence cycle and how it works",
    "Recognize common confidence killers and how to avoid them",
    "Learn the building blocks of confidence"
  ],
  estimatedDuration: 45,
  order: 1
};

const lesson2Data = {
  title: "Developing a Growth Mindset",
  content: `A growth mindset is the belief that your abilities and intelligence can be developed through effort, learning, and persistence. This mindset is crucial for building confidence and achieving long-term success.

**Fixed vs. Growth Mindset**

**Fixed Mindset**:
- Believes intelligence and abilities are static
- Avoids challenges for fear of failure
- Gives up easily when faced with obstacles
- Sees effort as fruitless
- Ignores useful feedback
- Feels threatened by others' success

**Growth Mindset**:
- Believes intelligence and abilities can be developed
- Embraces challenges as opportunities to grow
- Persists through setbacks and obstacles
- Sees effort as the path to mastery
- Learns from criticism and feedback
- Finds inspiration in others' success

**How to Develop a Growth Mindset**
1. **Embrace Challenges**: View difficulties as opportunities to learn
2. **Learn from Criticism**: See feedback as valuable information
3. **Celebrate Effort**: Focus on the process, not just the outcome
4. **Learn from Others**: Use others' success as motivation, not intimidation
5. **Use 'Yet'**: Add 'yet' to statements like 'I can't do this' → 'I can't do this yet'

**Practical Strategies**
- **Reframe Failures**: Instead of 'I failed,' think 'I learned'
- **Set Learning Goals**: Focus on what you want to learn, not just achieve
- **Practice Self-Compassion**: Be kind to yourself when you make mistakes
- **Seek Feedback**: Actively ask for and use constructive feedback
- **Celebrate Small Wins**: Acknowledge progress, no matter how small

**The Power of 'Yet'**
When you add 'yet' to your thoughts, you open up possibilities:
- 'I'm not good at public speaking' → 'I'm not good at public speaking yet'
- 'I don't understand this concept' → 'I don't understand this concept yet'
- 'I can't lead a team' → 'I can't lead a team yet'

This simple word shift can transform your mindset and boost your confidence.`,
  learningObjectives: [
    "Understand the difference between fixed and growth mindsets",
    "Learn practical strategies to develop a growth mindset",
    "Recognize how mindset affects confidence and success",
    "Practice reframing challenges and failures"
  ],
  estimatedDuration: 50,
  order: 2
};

const quizData = {
  title: "Self-Confidence Assessment",
  description: "Test your understanding of self-confidence concepts and growth mindset principles.",
  passingScore: 70,
  timeLimit: 30,
  attemptsAllowed: 2,
  questions: [
    {
      type: "MCQ",
      text: "What is the first step in the confidence cycle?",
      options: ["Self-efficacy", "Self-awareness", "Action", "Success"],
      correctAnswer: "Self-awareness",
      points: 2,
      explanation: "Self-awareness is the foundation of the confidence cycle. You need to understand your strengths and areas for growth before you can build confidence."
    },
    {
      type: "MCQ",
      text: "Which of the following is NOT a building block of confidence?",
      options: ["Knowledge and Skills", "Experience", "Perfectionism", "Positive Self-Talk"],
      correctAnswer: "Perfectionism",
      points: 2,
      explanation: "Perfectionism is actually a confidence killer, not a building block. It can prevent you from taking action and learning from mistakes."
    },
    {
      type: "MCQ",
      text: "What is a key characteristic of a growth mindset?",
      options: ["Avoiding challenges to prevent failure", "Believing abilities can be developed through effort", "Seeing effort as fruitless", "Feeling threatened by others' success"],
      correctAnswer: "Believing abilities can be developed through effort",
      points: 2,
      explanation: "A growth mindset believes that intelligence and abilities can be developed through effort, learning, and persistence."
    },
    {
      type: "MCQ",
      text: "What does the 'M' in SMART goals stand for?",
      options: ["Measurable", "Meaningful", "Manageable", "Motivational"],
      correctAnswer: "Measurable",
      points: 2,
      explanation: "Measurable goals can be tracked and quantified, making it easier to assess progress and stay motivated."
    },
    {
      type: "MCQ",
      text: "How should you view failures when developing a growth mindset?",
      options: ["As proof of your limitations", "As learning opportunities", "As reasons to give up", "As personal flaws"],
      correctAnswer: "As learning opportunities",
      points: 2,
      explanation: "In a growth mindset, failures are seen as valuable learning opportunities that help you improve and grow."
    },
    {
      type: "ShortAnswer",
      text: "Explain the difference between self-confidence and arrogance. Provide an example of each.",
      correctAnswer: "Self-confidence is a healthy belief in your abilities based on realistic self-assessment, while arrogance is an inflated sense of self-importance that often involves putting others down. Example: A confident person might say 'I'm good at this and I can help others improve too,' while an arrogant person might say 'I'm the best and everyone else is inferior.'",
      points: 5,
      explanation: "Self-confidence is grounded in reality and includes humility, while arrogance is often based on insecurity and involves belittling others."
    },
    {
      type: "ShortAnswer",
      text: "Describe three practical strategies for developing a growth mindset in your daily life.",
      correctAnswer: "Three strategies: 1) Add 'yet' to negative statements (e.g., 'I can't do this yet'), 2) Embrace challenges as opportunities to learn, 3) Focus on effort and process rather than just outcomes, 4) Learn from criticism and feedback, 5) Celebrate others' success as inspiration.",
      points: 5,
      explanation: "These strategies help shift your mindset from fixed to growth-oriented, making you more resilient and open to learning."
    },
    {
      type: "ShortAnswer",
      text: "What are the five components of the SMART goal framework? Explain why each is important.",
      correctAnswer: "Specific (clear and detailed), Measurable (trackable progress), Achievable (realistic and attainable), Relevant (aligned with values and objectives), Time-bound (has a deadline). Each component ensures goals are well-defined and more likely to be achieved.",
      points: 5,
      explanation: "The SMART framework provides a systematic approach to goal setting that increases the likelihood of success."
    },
    {
      type: "ShortAnswer",
      text: "How can you overcome the common confidence killer of comparing yourself to others?",
      correctAnswer: "Focus on your own progress and journey, recognize that everyone has different starting points and circumstances, use others' success as inspiration rather than competition, practice gratitude for your own achievements, and remember that social media often shows only the highlights of others' lives.",
      points: 5,
      explanation: "Comparison is often based on incomplete information and can be overcome by focusing on personal growth and realistic self-assessment."
    },
    {
      type: "ShortAnswer",
      text: "Explain how body language can affect your confidence levels and provide two examples of confident body language.",
      correctAnswer: "Body language can create a feedback loop where confident posture actually increases confidence hormones. Examples: 1) Standing tall with shoulders back and head held high, 2) Making eye contact during conversations, 3) Using open gestures rather than crossing arms, 4) Taking up space rather than making yourself small.",
      points: 5,
      explanation: "Research shows that 'power posing' and confident body language can actually increase testosterone and decrease cortisol, making you feel more confident."
    }
  ]
};

const assignmentData = {
  title: "Personal Development Action Plan",
  description: "Create a comprehensive personal development plan that applies the concepts learned in this module to your own life and career goals.",
  instructions: `This assignment will help you apply the concepts of self-confidence, growth mindset, and goal setting to create a personalized development plan. You will complete four parts that build upon each other.

**Part 1: Self-Assessment (20 points)**
Conduct a thorough self-assessment of your current confidence levels and mindset:
- Rate your confidence in different areas (work, relationships, public speaking, etc.) on a scale of 1-10
- Identify your top 3 strengths and 3 areas for improvement
- Reflect on your current mindset (fixed vs. growth) in different situations
- List 3 recent challenges and how you responded to them

**Part 2: Goal Setting (30 points)**
Using the SMART framework, create 3 goals:
- One short-term goal (1-3 months)
- One medium-term goal (3-12 months)
- One long-term goal (1-5 years)
For each goal, explain:
- Why it's important to you
- How it aligns with your values
- What skills or resources you'll need
- How you'll measure success

**Part 3: Action Plan (30 points)**
Create detailed action plans for each goal:
- Break down each goal into 5-7 specific, actionable steps
- Set deadlines for each step
- Identify potential obstacles and how you'll overcome them
- List the support you'll need from others
- Create a weekly schedule for working on your goals

**Part 4: Reflection and Commitment (20 points)**
Write a reflection on:
- What you learned about yourself through this process
- How you plan to maintain a growth mindset when facing challenges
- Your commitment to your goals and how you'll stay accountable
- How you'll celebrate progress and handle setbacks

**Submission Requirements:**
- 3-5 pages, double-spaced
- Professional formatting with clear sections
- Specific, actionable content (avoid vague statements)
- Honest self-reflection
- Submit as PDF or Word document

**Grading Criteria:**
- Completeness and depth of self-assessment (20 points)
- Quality and specificity of goals using SMART framework (30 points)
- Detailed and realistic action plans (30 points)
- Thoughtful reflection and commitment (20 points)

**Due Date:** 2 weeks from lesson completion

**Tips for Success:**
- Be honest and specific in your self-assessment
- Make your goals challenging but achievable
- Include specific dates and measurable outcomes
- Consider how your goals align with your values and long-term vision
- Plan for obstacles and have backup strategies
- Share your goals with someone who will support and hold you accountable`,
  dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
  totalPoints: 100,
  fileType: "pdf",
  maxFileSize: 10,
  allowTextSubmission: false,
  allowFileSubmission: true,
  gradingCriteria: [
    {
      criterion: "Self-Assessment Completeness",
      points: 20,
      description: "Thorough analysis of current confidence levels, strengths, weaknesses, and mindset patterns"
    },
    {
      criterion: "SMART Goal Quality",
      points: 30,
      description: "Goals are specific, measurable, achievable, relevant, and time-bound with clear rationale"
    },
    {
      criterion: "Action Plan Detail",
      points: 30,
      description: "Detailed, realistic action steps with timelines, obstacle planning, and support identification"
    },
    {
      criterion: "Reflection and Commitment",
      points: 20,
      description: "Thoughtful reflection on learning and clear commitment to follow-through"
    }
  ]
};

async function addPersonalDevelopmentCourse() {
  try {
    console.log('🚀 Starting to add Personal Development course...');

    // Step 1: Create the course
    console.log('📚 Creating course...');
    const courseResponse = await api.post('/courses', courseData);
    const course = courseResponse.data;
    console.log('✅ Course created:', course.title);

    // Step 2: Add the first module
    console.log('📖 Adding module...');
    const moduleResponse = await api.post(`/courses/${course._id}/modules`, module1Data);
    const module = moduleResponse.data;
    console.log('✅ Module created:', module.title);

    // Step 3: Add lessons to the module
    console.log('📝 Adding lessons...');
    const lesson1Response = await api.post(`/courses/${course._id}/modules/${module._id}/lessons`, lesson1Data);
    const lesson1 = lesson1Response.data;
    console.log('✅ Lesson 1 created:', lesson1.title);

    const lesson2Response = await api.post(`/courses/${course._id}/modules/${module._id}/lessons`, lesson2Data);
    const lesson2 = lesson2Response.data;
    console.log('✅ Lesson 2 created:', lesson2.title);

    // Step 4: Create quiz linked to first lesson
    console.log('❓ Creating quiz...');
    const quizResponse = await api.post('/quizzes', {
      ...quizData,
      course: course._id,
      moduleId: module._id,
      lessonId: lesson1._id
    });
    console.log('✅ Quiz created:', quizResponse.data.title);

    // Step 5: Create assignment linked to first lesson
    console.log('📋 Creating assignment...');
    const assignmentResponse = await api.post('/assignments', {
      ...assignmentData,
      course: course._id,
      moduleId: module._id,
      lessonId: lesson1._id
    });
    console.log('✅ Assignment created:', assignmentResponse.data.title);

    console.log('\n🎉 Personal Development course successfully created!');
    console.log('\n📊 Summary:');
    console.log(`- Course: ${course.title}`);
    console.log(`- Module: ${module.title}`);
    console.log(`- Lessons: ${lesson1.title}, ${lesson2.title}`);
    console.log(`- Quiz: ${quizResponse.data.title}`);
    console.log(`- Assignment: ${assignmentResponse.data.title}`);
    console.log('\n🔗 Course ID:', course._id);
    console.log('🔗 Module ID:', module._id);
    console.log('🔗 Lesson 1 ID:', lesson1._id);
    console.log('🔗 Lesson 2 ID:', lesson2._id);
    console.log('🔗 Quiz ID:', quizResponse.data._id);
    console.log('🔗 Assignment ID:', assignmentResponse.data._id);

  } catch (error) {
    console.error('❌ Error creating course:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      console.error('🔐 Authentication error: Please check your admin token');
    }
  }
}

// Run the script
addPersonalDevelopmentCourse(); 