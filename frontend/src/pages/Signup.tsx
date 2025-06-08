import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import assets from "../assets/assets"
import { motion } from "framer-motion"

const Signup = () => {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    role: "user",
    terms: false,
  })

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    role: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const validateForm = () => {
    const newErrors = {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      gender: "",
      role: "",
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.gender) {
      newErrors.gender = "Please select your gender"
    }

    if (!formData.role) {
      newErrors.role = "Please select your role"
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some(error => error !== "")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError("")

    try {
      await signup({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        gender: formData.gender,
        role: formData.role,
      })
      navigate("/profile")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
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
              Create Your Account
            </h2>
            <p className="text-gray-600 text-sm sm:text-base break-words">
              Join EmpowerHer and start your journey to success
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg break-words">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-700 focus:border-gray-700 text-sm sm:text-base"
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600 break-words">{errors.fullName}</p>
              )}
            </div>

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
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-700 focus:border-gray-700 text-sm sm:text-base"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 break-words">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <div className="mt-1">
                <select
                  id="gender"
                  name="gender"
                  required
                  value={formData.gender}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-700 focus:border-gray-700 text-sm sm:text-base"
                >
                  <option value="">Select gender</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
              {errors.gender && (
                <p className="mt-1 text-sm text-red-600 break-words">{errors.gender}</p>
              )}
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <div className="mt-1">
                <select
                  id="role"
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-700 focus:border-gray-700 text-sm sm:text-base"
                >
                  <option value="user">Student</option>
                  <option value="mentor">Mentor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600 break-words">{errors.role}</p>
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
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-700 focus:border-gray-700 text-sm sm:text-base"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 break-words">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-700 focus:border-gray-700 text-sm sm:text-base"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 break-words">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                checked={formData.terms}
                onChange={handleChange}
                className="h-4 w-4 text-gray-700 focus:ring-gray-700 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the{" "}
                <Link to="/terms-and-conditions" className="text-gray-700 hover:text-gray-800">
                  Terms and Conditions
                </Link>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 ${
                  loading ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Creating account..." : "Sign up"}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-gray-700 hover:text-gray-800">
                <span className="text-blue-600 hover:text-black">Log in</span>
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Signup
