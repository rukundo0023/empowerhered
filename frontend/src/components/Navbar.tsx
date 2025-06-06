import { useState, useEffect } from "react"
import { NavLink, Link, useNavigate } from "react-router-dom"
import assets from "../assets/assets"
import { useAuth } from "../context/AuthContext"
import Search from "./Search"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen)
  }

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
  }

  const handleLogout = () => {
    logout()
    setIsProfileOpen(false)
    navigate('/')
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.profile-dropdown') && !target.closest('.profile-button')) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/">
              <img
                className="h-8 w-auto"
                src={assets.empoweherlogo3}
                alt="EmpowerHerEd"
              />
            </Link>
          </div>

          {/* Center Navigation */}
          <div className="hidden sm:flex sm:flex-1 sm:justify-center">
            <div className="flex space-x-8">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `inline-flex items-center px-3 py-2 text-base font-medium transition-colors duration-200 ${
                    isActive ? "text-purple-600" : "text-gray-700 hover:text-purple-600"
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `inline-flex items-center px-3 py-2 text-base font-medium transition-colors duration-200 ${
                    isActive ? "text-purple-600" : "text-gray-700 hover:text-purple-600"
                  }`
                }
              >
                About
              </NavLink>
              <NavLink
                to="/programs"
                className={({ isActive }) =>
                  `inline-flex items-center px-3 py-2 text-base font-medium transition-colors duration-200 ${
                    isActive ? "text-purple-600" : "text-gray-700 hover:text-purple-600"
                  }`
                }
              >
                Programs
              </NavLink>
              <NavLink
                to="/success-stories"
                className={({ isActive }) =>
                  `inline-flex items-center px-3 py-2 text-base font-medium transition-colors duration-200 ${
                    isActive ? "text-purple-600" : "text-gray-700 hover:text-purple-600"
                  }`
                }
              >
                Stories
              </NavLink>
              <NavLink
                to="/resources"
                className={({ isActive }) =>
                  `inline-flex items-center px-3 py-2 text-base font-medium transition-colors duration-200 ${
                    isActive ? "text-purple-600" : "text-gray-700 hover:text-purple-600"
                  }`
                }
              >
                Resources
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `inline-flex items-center px-3 py-2 text-base font-medium transition-colors duration-200 ${
                    isActive ? "text-purple-600" : "text-gray-700 hover:text-purple-600"
                  }`
                }
              >
                Contact
              </NavLink>
            </div>
          </div>

          {/* Right side items */}
          <div className="flex items-center">
            <button
              onClick={toggleSearch}
              className="p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {isAuthenticated ? (
              <div className="relative ml-3">
                <button
                  onClick={toggleProfile}
                  className="flex items-center space-x-2 text-base font-medium text-gray-700 hover:text-purple-600 transition-colors duration-200"
                >
                  <img
                    src={assets.profilelogo}
                    alt="Profile"
                    className="h-8 w-8 rounded-full hover:opacity-80 transition-opacity duration-200"
                  />
                </button>

                {isProfileOpen && (
                  <div className="profile-dropdown absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4 ml-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden ml-2">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive
                    ? "bg-purple-50 border-purple-500 text-purple-700"
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive
                    ? "bg-purple-50 border-purple-500 text-purple-700"
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </NavLink>
            <NavLink
              to="/programs"
              className={({ isActive }) =>
                `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive
                    ? "bg-purple-50 border-purple-500 text-purple-700"
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Programs
            </NavLink>
            <NavLink
              to="/success-stories"
              className={({ isActive }) =>
                `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive
                    ? "bg-purple-50 border-purple-500 text-purple-700"
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Stories
            </NavLink>
            <NavLink
              to="/resources"
              className={({ isActive }) =>
                `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive
                    ? "bg-purple-50 border-purple-500 text-purple-700"
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Resources
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive
                    ? "bg-purple-50 border-purple-500 text-purple-700"
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </NavLink>
          </div>

          <div className="pt-4 pb-3 border-t border-gray-200">
            {!isAuthenticated && (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
            {isAuthenticated && (
              <>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setIsMenuOpen(false)
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Search Modal */}
      <Search isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </nav>
  )
}

export default Navbar
