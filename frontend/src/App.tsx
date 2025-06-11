import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Programs from "./pages/Programs";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Contact from "./pages/Contact";
import SuccessStories from "./pages/SuccessStories";
import Resources from "./pages/Resources";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import MentorRoute from "./components/MentorRoute";
import Mentorship from "./pages/programs/Mentorship";
import TechSkills from "./pages/programs/TechSkills";
import Workshops from "./pages/programs/Workshops";
import ForgotPassword from "./pages/ForgotPassword";
import TermsAndConditions from "./pages/TermsAndConditions";
import Adminpanel from "./pages/Adminpanel";
import Blog from "./pages/Blog";
import Community from "./pages/Community";
import LearningResources from "./pages/LearningResources";
import Communication from "./pages/programs/Communication";
import TestConnection from "./components/TestConnection.tsx";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import MentorDashboard from "./components/MentorDashboard";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex min-h-screen flex-col overflow-x-hidden">
          <Navbar />
          <main className="flex-1 w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/programs/mentorship" element={<Mentorship />} />
              <Route path="/programs/communication" element={<Communication />} />
              <Route path="/programs/tech-skills" element={<TechSkills />} />
              <Route path="/programs/workshops" element={<Workshops />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/resources/community" element={<Community />} />
              <Route path="/resources/learning" element={<LearningResources />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/success-stories" element={<SuccessStories />} />
              <Route path="/TermsAndConditions" element={<TermsAndConditions />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/ForgotPassword" element={<ForgotPassword />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              {/* Mentor Routes */}
              <Route
                path="/mentorDashboard"
                element={
                  <MentorRoute>
                    <MentorDashboard />
                  </MentorRoute>
                }
              />
              <Route
                path="/mentor/mentee/:id"
                element={
                  <MentorRoute>
                    <MentorDashboard />
                  </MentorRoute>
                }
              />
              <Route
                path="/mentor/meeting/:id"
                element={
                  <MentorRoute>
                    <MentorDashboard />
                  </MentorRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <Adminpanel />
                  </AdminRoute>
                }
              />
              <Route path="/test-connection" element={<TestConnection />} />
            </Routes>
          </main>
          <Footer />
          <ToastContainer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
