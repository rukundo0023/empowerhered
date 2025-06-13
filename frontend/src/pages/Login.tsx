import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { toast } from "react-toastify"
import api from "../api/axios"
import { GoogleLogin } from "@react-oauth/google"
import {jwtDecode} from "jwt-decode"

interface DecodedToken {
  role?: string
  // add other fields if needed
}

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login, user, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  // Redirect if already logged in based on role
  useEffect(() => {
    console.log("Login component - User state:", user)
    if (user) {
      console.log("Login component - User role:", user.role)
      // Add a small delay to ensure the user state is fully set
      const timer = setTimeout(() => {
        if (user.role === "admin") {
          console.log("Login component - Redirecting to admin panel")
          navigate("/admin", { replace: true })
        } else if (user.role === "mentor") {
          console.log("Login component - Redirecting to mentor dashboard")
          navigate("/mentorDashboard", { replace: true })
        } else {
          console.log("Login component - Redirecting to user dashboard")
          navigate("/dashboard", { replace: true })
        }
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return

    setIsLoading(true)
    try {
      console.log("Login component - Attempting login with:", { email })
      const response = await api.post("/users/login", { email, password })
      console.log("Login component - Login response:", { 
        success: !!response.data.token,
        role: response.data.role
      })

      if (response.data.token) {
        // Call context login to update user state
        login(response.data)
        toast.success("Login successful!")
        // Let useEffect handle navigation
      }
    } catch (error: any) {
      console.error("Login component - Login error:", error)
      toast.error(error.response?.data?.message || "Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    try {
      const token = credentialResponse.credential
      if (!token) throw new Error("No token found")

      const decoded = jwtDecode<DecodedToken>(token)
      console.log("Decoded Google token:", decoded)

      await loginWithGoogle(token)

      toast.success("Login successful!")

      // Navigate based on user role saved in localStorage
      const userData = JSON.parse(localStorage.getItem("user") || "{}")
      const role = userData.role
      if (role === "admin") {
        navigate("/admin", { replace: true })
      } else if (role === "mentor") {
        navigate("/mentorDashboard", { replace: true })
      } else {
        navigate("/dashboard", { replace: true })
      }
    } catch (error) {
      console.error("Google login error:", error)
      toast.error("Google login failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 mt-1 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 mt-1 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={isLoading}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link to="/ForgotPassword" className="font-medium text-blue-600 hover:text-blue-500">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>

        <div>
          <h2 className="mt-6 text-center text-xl font-sm text-gray-900 mb-3">
            <span className="font-bold">OR</span> Login with Google
          </h2>

          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={() => {
              toast.error("Google login failed")
            }}
          />
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
