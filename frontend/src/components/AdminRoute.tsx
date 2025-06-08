import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    // Redirect to home if not an admin
    return <Navigate to="/" replace />;
  }

  // If authenticated and is admin, render the children
  return <>{children}</>;
};

export default AdminRoute; 