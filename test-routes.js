// Test script to verify quiz and assignment routes
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

// Test quiz routes
async function testQuizRoutes() {
  try {
    console.log('Testing quiz routes...');
    
    // Test 1: Get quizzes by course
    console.log('\n1. Testing GET /quizzes/course/:courseId');
    const courseResponse = await axios.get(`${BASE_URL}/quizzes/course/6871fb178c4beede7cfad04b`);
    console.log('✅ Course quizzes response:', courseResponse.status);
    
    // Test 2: Get quizzes by lesson
    console.log('\n2. Testing GET /quizzes/lesson/:courseId/:moduleId/:lessonId');
    const lessonResponse = await axios.get(`${BASE_URL}/quizzes/lesson/6871fb178c4beede7cfad04b/6871fb848c4beede7cfad05a/687201798c4beede7cfad063`);
    console.log('✅ Lesson quizzes response:', lessonResponse.status);
    console.log('Data:', lessonResponse.data);
    
  } catch (error) {
    console.error('❌ Quiz route test failed:', error.response?.status, error.response?.data);
  }
}

// Test assignment routes
async function testAssignmentRoutes() {
  try {
    console.log('\nTesting assignment routes...');
    
    // Test 1: Get assignments by course
    console.log('\n1. Testing GET /assignments/course/:courseId');
    const courseResponse = await axios.get(`${BASE_URL}/assignments/course/6871fb178c4beede7cfad04b`);
    console.log('✅ Course assignments response:', courseResponse.status);
    
    // Test 2: Get assignments by lesson
    console.log('\n2. Testing GET /assignments/lesson/:courseId/:moduleId/:lessonId');
    const lessonResponse = await axios.get(`${BASE_URL}/assignments/lesson/6871fb178c4beede7cfad04b/6871fb848c4beede7cfad05a/687201798c4beede7cfad063`);
    console.log('✅ Lesson assignments response:', lessonResponse.status);
    console.log('Data:', lessonResponse.data);
    
  } catch (error) {
    console.error('❌ Assignment route test failed:', error.response?.status, error.response?.data);
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting route tests...\n');
  
  await testQuizRoutes();
  await testAssignmentRoutes();
  
  console.log('\n✅ Route tests completed!');
}

runTests().catch(console.error); 