import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // Show loading or spinner while auth status is being checked
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    if (!navigator.onLine) {
      // Offline and not authenticated: show message instead of redirect
      return (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#b91c1c', fontWeight: 'bold' }}>
          You are offline. Please connect to the internet to log in.
        </div>
      );
    }
    // Online: redirect to login
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute
