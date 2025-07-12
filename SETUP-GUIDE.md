# 🚀 How to Add the Personal Development Course

## Option 1: Using the Script (Recommended)

### Step 1: Get Your Admin Token
1. **Login to your admin account** in the frontend
2. **Open browser developer tools** (F12)
3. **Go to Application/Storage tab**
4. **Find your JWT token** in localStorage or sessionStorage
5. **Copy the token** (it starts with "eyJ...")

### Step 2: Update the Script
1. **Open** `add-personal-development-course.js`
2. **Replace** `YOUR_ADMIN_TOKEN_HERE` with your actual token
3. **Update** the API_BASE_URL if your backend runs on a different port

### Step 3: Run the Script
```bash
# Make sure you're in the project root directory
cd C:\Users\Hp\Downloads\empowerhered

# Install axios if not already installed
npm install axios

# Run the script
node add-personal-development-course.js
```

### Step 4: Verify Success
The script will show you:
- ✅ Course created
- ✅ Module created  
- ✅ Lessons created
- ✅ Quiz created
- ✅ Assignment created
- 🔗 All the IDs for future reference

## Option 2: Manual Addition via Admin Panel

### Step 1: Create Course
1. **Go to Admin Panel** → **Courses tab**
2. **Click "Add Course"**
3. **Fill in the details:**
   - Title: "Personal Development & Leadership"
   - Description: "A comprehensive course designed to build self-confidence..."
   - Duration: "8 weeks"
   - Level: "beginner"
   - Category: "personal-development"

### Step 2: Add Module
1. **Click on the course** you just created
2. **Click "Add Module"**
3. **Fill in:**
   - Title: "Building Self-Confidence"
   - Description: "Learn the fundamentals of self-confidence..."

### Step 3: Add Lessons
1. **Click on the module**
2. **Click "Add Lesson"**
3. **Add Lesson 1:**
   - Title: "Understanding Self-Confidence"
   - Content: (Copy from the script or JSON file)
4. **Add Lesson 2:**
   - Title: "Developing a Growth Mindset"
   - Content: (Copy from the script or JSON file)

### Step 4: Create Quiz (Using API)
```bash
# Use curl or Postman to create the quiz
curl -X POST http://localhost:5000/api/quizzes \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d @quiz-data.json
```

### Step 5: Create Assignment (Using API)
```bash
# Use curl or Postman to create the assignment
curl -X POST http://localhost:5000/api/assignments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d @assignment-data.json
```

## Option 3: Direct Database Insertion

If you prefer to add directly to MongoDB:

1. **Connect to your MongoDB database**
2. **Insert the course data** from `personal-development-course-structure.json`
3. **Update the IDs** to link quizzes and assignments properly

## 🔧 Troubleshooting

### Common Issues:

**1. "401 Unauthorized"**
- Check your admin token is correct
- Make sure you're logged in as admin
- Token might have expired - get a new one

**2. "Course not found"**
- Make sure your backend is running
- Check the API_BASE_URL is correct
- Verify the course creation succeeded

**3. "Module not found"**
- Check the course ID is correct
- Make sure the module was created successfully

**4. "Lesson not found"**
- Verify the module ID is correct
- Check the lesson was added to the right module

### Getting Help:

1. **Check the console output** for detailed error messages
2. **Verify your backend is running** on the correct port
3. **Check your database connection** is working
4. **Look at the network tab** in browser dev tools for API errors

## ✅ Verification

After adding the course, you should see:

1. **In Admin Panel:**
   - New course "Personal Development & Leadership"
   - Module "Building Self-Confidence"
   - Two lessons with content

2. **In Learning Resources:**
   - Course appears in the course list
   - Students can enroll and access content

3. **Quiz and Assignment:**
   - Available in the lesson pages
   - Students can take quizzes and submit assignments

## 🎯 Next Steps

Once the course is added:

1. **Test the student experience** by enrolling as a student
2. **Take the quiz** to verify it works
3. **Submit the assignment** to test the submission system
4. **Create more courses** using the same structure
5. **Customize the content** for your specific needs

The professional structure is now ready to use! 🎉 