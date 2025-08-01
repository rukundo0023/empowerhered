import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    console.log('AdminRoute - Loading authentication state...');
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    console.log('AdminRoute - Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== 'admin') {
    console.log('AdminRoute - Not admin, redirecting to home');
    return <Navigate to="/" replace />;
  }

  console.log('AdminRoute - Admin access granted, rendering admin panel');
  return <>{children}</>;
};

export default AdminRoute; 