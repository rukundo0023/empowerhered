import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface InstructorRouteProps {
  children: React.ReactNode;
}

const InstructorRoute: React.FC<InstructorRouteProps> = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== 'instructor') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default InstructorRoute; 