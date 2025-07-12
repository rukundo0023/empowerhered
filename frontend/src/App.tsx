import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { GoogleProvider } from "./providers/GoogleOAuthProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './i18n/i18n'; // Import i18n configuration
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
import MentorDashboard from "./pages/Mentordashboard";
import MentorMeetingDetails from './pages/MentorMeetingDetails';
import InstructorRoute from "./components/InstructorRoute";
import InstructorDashboard from './pages/InstructorDashboard';
import Certificates from './pages/Certificates';
import OfflineIndicator from './components/OfflineIndicator';
import OfflineStatus from './components/OfflineStatus';

function App() {
  return (
    <>
      <OfflineIndicator />
      <GoogleProvider>
        <Router>
          <AuthProvider>
            <div className="flex min-h-screen flex-col overflow-x-hidden">
              <Navbar />
              <main className="flex-1 w-full">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/ForgotPassword" element={<ForgotPassword />} />
                  <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                  <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
                  <Route path="/programs" element={<ProtectedRoute><Programs /></ProtectedRoute>} />
                  <Route path="/programs/mentorship" element={<ProtectedRoute><Mentorship /></ProtectedRoute>} />
                  <Route path="/programs/communication" element={<ProtectedRoute><Communication /></ProtectedRoute>} />
                  <Route path="/programs/tech-skills" element={<ProtectedRoute><TechSkills /></ProtectedRoute>} />
                  <Route path="/programs/workshops" element={<ProtectedRoute><Workshops /></ProtectedRoute>} />
                  <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
                  <Route path="/blog" element={<ProtectedRoute><Blog /></ProtectedRoute>} />
                  <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
                  <Route path="/resources/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
                  <Route path="/resources/learning" element={<ProtectedRoute><LearningResources /></ProtectedRoute>} />
                  <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
                  <Route path="/success-stories" element={<ProtectedRoute><SuccessStories /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/admin" element={<AdminRoute><Adminpanel /></AdminRoute>} />
                  <Route path="/mentorDashboard" element={<MentorRoute><MentorDashboard /></MentorRoute>} />
                  <Route path="/mentor/meeting/:meetingId" element={<MentorRoute><MentorMeetingDetails /></MentorRoute>} />
                  <Route path="/instructor-dashboard" element={<InstructorRoute><InstructorDashboard /></InstructorRoute>} />
                  <Route path="/certificates" element={<ProtectedRoute><Certificates /></ProtectedRoute>} />
                  <Route path="/terms" element={<TermsAndConditions />} />
                  <Route path="/test-connection" element={<TestConnection />} />
                </Routes>
              </main>
              <Footer />
            </div>
            {/* Offline Status Component */}
            <OfflineStatus />
          </AuthProvider>
        </Router>
      </GoogleProvider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
