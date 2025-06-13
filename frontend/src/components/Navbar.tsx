import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import VoiceSearchButton from "./voiceSearchButton";
const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{ title: string; path: string }>>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const programsMenu = [
    { name: "Mentorship", path: "/programs/mentorship" },
    { name: "Communication", path: "/programs/Communication" },
    { name: "Tech Skills", path: "/programs/tech-skills" },
    { name: "Workshops", path: "/programs/workshops" },
  ];

  const resourcesMenu = [
    { name: "Blog", path: "/blog" },
    { name: "Community", path: "/resources/community" },
    { name: "Learning Resources", path: "/resources/learning" },
  ];

  const searchableContent = [
    { title: "Home", path: "/" },
    { title: "About Us", path: "/about" },
    { title: "Success Stories", path: "/success-stories" },
    { title: "Contact", path: "/contact" },
    { title: "Mentorship Program", path: "/programs/mentorship" },
    { title: "Leadership Training", path: "/programs/Communication" },
    { title: "Tech Skills", path: "/programs/tech-skills" },
    { title: "Workshops", path: "/programs/workshops" },
    { title: "Blog", path: "/blog" },
    { title: "Community", path: "/resources/community" },
    { title: "Learning Resources", path: "/resources/learning" },
    { title: "Login", path: "/login" },
    { title: "Sign Up", path: "/signup" }
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      const results = searchableContent.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      window.location.href = searchResults[0].path;
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchFocused(false);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const searchContainer = document.getElementById("search-container");
      if (searchContainer && !searchContainer.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Function to get initials from user's name
  const getUserInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={assets.empoweherlogo3} alt="Logo" className="h-8 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-6 items-center">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"
              }
            >
              About
            </NavLink>

            {/* Programs with Hover Menu */}
            <div className="relative group">
              <NavLink
                to="/programs"
                className={({ isActive }) =>
                  isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"
                }
              >
                Programs
              </NavLink>
              <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md z-40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {programsMenu.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) =>
                      `block px-4 py-2 text-sm ${
                        isActive ? "text-blue-600 bg-gray-50" : "text-gray-700 hover:bg-gray-50"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Resources with Hover Menu */}
            <div className="relative group">
              <NavLink
                to="/resources"
                className={({ isActive }) =>
                  isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"
                }
              >
                Resources
              </NavLink>
              <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md z-40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {resourcesMenu.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) =>
                      `block px-4 py-2 text-sm ${
                        isActive ? "text-blue-600 bg-gray-50" : "text-gray-700 hover:bg-gray-50"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Add Mentor Dashboard link for mentor users */}
            {isAuthenticated && user?.role === 'mentor' && (
              <NavLink
                to="/mentor/dashboard"
                className={({ isActive }) =>
                  isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"
                }
              >
                Mentor Dashboard
              </NavLink>
            )}

            <NavLink
              to="/success-stories"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"
              }
            >
              Stories
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"
              }
            >
              Contact
            </NavLink>
          </div>

          {/* Search & Auth Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <form id="search-container" onSubmit={handleSearchSubmit} className="relative">
              <div
                className={`relative transition-all duration-200 ${
                  isSearchFocused ? "w-64" : "w-40"
                }`}
              >
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setIsSearchFocused(true)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-20"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-3">
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      aria-label="Clear search"
                    >
                      <img src={assets.crossicon} className="w-4 h-4" alt="Clear search" />
                    </button>
                  )}
                  {/* Voice Search Button */}
                 <VoiceSearchButton onResult={(text) => setSearchQuery(text)} />
                  <button
                    type="submit"
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    aria-label="Search"
                  >
                    <img src={assets.searchIcon} className="w-4 h-4" alt="Search" />
                  </button>
                </div>
              </div>
              {/* Search Results Dropdown */}
              {isSearchFocused && searchResults.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white rounded-md shadow-lg z-50">
                  {searchResults.map((result, index) => (
                    <Link
                      key={index}
                      to={result.path}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                      onClick={() => {
                        setSearchQuery("");
                        setSearchResults([]);
                        setIsSearchFocused(false);
                      }}
                    >
                      {result.title}
                    </Link>
                  ))}
                </div>
              )}
            </form>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                    {getUserInitials(user?.name || '')}
                  </div>
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    {user?.role === 'mentor' && (
                      <Link
                        to="/mentorDashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Mentor Dashboard
                      </Link>
                    )}
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Nav Icon */}
          <div className="md:hidden">
            <div className="flex items-center space-x-2">
              <form id="search-container-mobile" onSubmit={handleSearchSubmit} className="relative">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => setIsSearchFocused(true)}
                    className="w-32 px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-16"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={handleClearSearch}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <img src={assets.crossicon} className="w-3 h-3" alt="Clear search" />
                      </button>
                    )}
                    <VoiceSearchButton onResult={(text) => setSearchQuery(text)} />
                    <button
                      type="submit"
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      <img src={assets.searchIcon} className="w-3 h-3" alt="Search" />
                    </button>
                  </div>
                </div>
                {/* Search Results Dropdown for Mobile */}
                {isSearchFocused && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 w-full mt-1 bg-white rounded-md shadow-lg z-50">
                    {searchResults.map((result, index) => (
                      <Link
                        key={index}
                        to={result.path}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                        onClick={() => {
                          setSearchQuery("");
                          setSearchResults([]);
                          setIsSearchFocused(false);
                        }}
                      >
                        {result.title}
                      </Link>
                    ))}
                  </div>
                )}
              </form>
              <img
                src={assets.menuicon}
                onClick={() => setIsMenuOpen(true)}
                className="h-6 w-6 cursor-pointer"
                alt="Menu"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink className ="block w-full " to="/" onClick={() => setIsMenuOpen(false)}>Home</NavLink>
            <NavLink className= "block w-full" to="/about" onClick={() => setIsMenuOpen(false)}>About</NavLink>
            <div>
              <p className="font-semibold">Programs</p>
              {programsMenu.map((item) => (
                <NavLink key={item.path} to={item.path} onClick={() => setIsMenuOpen(false)} className="pl-4 block">
                  {item.name}
                </NavLink>
              ))}
            </div>
            <div>
              <p className="font-semibold">Resources</p>
              {resourcesMenu.map((item) => (
                <NavLink key={item.path} to={item.path} onClick={() => setIsMenuOpen(false)} className="pl-4 block">
                  {item.name}
                </NavLink>
              ))}
            </div>
            <NavLink className= "block w-full" to="/success-stories" onClick={() => setIsMenuOpen(false)}>Stories</NavLink>
            <NavLink className= "block w-full" to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</NavLink>
            
            {/* Add Mentor Dashboard link for mentor users in mobile menu */}
            {isAuthenticated && user?.role === 'mentor' && (
              <NavLink
                to="/mentor/dashboard"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive ? "text-blue-600 bg-gray-50" : "text-gray-600 hover:text-blue-600"
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Mentor Dashboard
              </NavLink>
            )}

            {isAuthenticated ? (
              <div className="px-4 py-2">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                    {getUserInitials(user?.name || '')}
                  </div>
                  <span className="text-gray-700">{user?.name}</span>
                </div>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                {user?.role === 'mentor' && (
                  <Link
                    to="/mentorDashboard"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mentor Dashboard
                  </Link>

                )}
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="px-4 py-2 space-y-2">
                <Link
                  to="/login"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
