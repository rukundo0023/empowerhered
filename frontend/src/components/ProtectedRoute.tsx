import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    // Redirect to login if user is not authenticated
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute 