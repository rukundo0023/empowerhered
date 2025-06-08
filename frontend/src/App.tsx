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
import Mentorship from "./pages/programs/Mentorship";
import Leadership from "./pages/programs/Leadership";
import TechSkills from "./pages/programs/TechSkills";
import Workshops from "./pages/programs/Workshops";
import ForgotPassword from "./pages/ForgotPassword";
import TermsAndConditions from "./pages/TermsAndConditions";
import Adminpanel from "./pages/Adminpanel";
import Blog from "./pages/Blog";
import Community from "./pages/Community";
import LearningResources from "./pages/LearningResources";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex min-h-screen flex-col overflow-x-hidden">
          <Navbar />
          <main className="flex-1 w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/programs/mentorship" element={<Mentorship />} />
              <Route path="/programs/leadership" element={<Leadership />} />
              <Route path="/programs/tech-skills" element={<TechSkills />} />
              <Route path="/programs/workshops" element={<Workshops />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/success-stories" element={<SuccessStories />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
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
                path="/admin"
                element={
                  <AdminRoute>
                    <Adminpanel />
                  </AdminRoute>
                }
              />
              <Route path="/blog" element={<Blog />} />
              <Route path="/resources/community" element={<Community />} />
              <Route path="/resources/learning" element={<LearningResources />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer />
      </Router>
    </AuthProvider>
  );
}

export default App;
