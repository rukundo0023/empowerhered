import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import assets from "../assets/assets"

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  })
  const [errors, setErrors] = useState({
    email: "",
    password: ""
  })
  const [, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: ""
    }
    let isValid = true

    if (!formData.email) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
      isValid = false
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Here you would typically make an API call to your backend
      // For now, we'll simulate a successful login
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Create user data (in a real app, this would come from your API)
      
      // Use the login function from AuthContext
      // login(userData, 'mock-jwt-token')

      // Redirect to home page instead of dashboard
      navigate("/")
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        email: "Invalid email or password"
      }))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-gray-50 flex items-start justify-center pt-2 pb-0 sm:pt-4">
      <div className="w-full max-w-md px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-0"
        >
          <div className="text-center mb-4 sm:mb-6 mt-2 sm:mt-4">
            <img
              src={assets.empoweherlogo3}
              alt="EmpowerHer Logo"
              className="h-10 sm:h-12 mx-auto mb-3 sm:mb-4"
            />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600 text-sm sm:text-base break-words">
              Sign in to continue your journey with EmpowerHer
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-gray-700 focus:ring-gray-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-gray-700 hover:text-gray-600 whitespace-nowrap">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="font-medium text-gray-700 hover:text-gray-600">
                <span className="text-blue-500">Sign up</span>
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login
