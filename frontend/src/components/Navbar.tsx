import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import assets from "../assets/assets";
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import VoiceSearchButton from "./voiceSearchButton";
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{ title: string; path: string }>>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const programsMenu = [
    { name: t('nav.programsDropdown.mentorship'), path: "/programs/mentorship" },
    { name: t('nav.programsDropdown.communication'), path: "/programs/communication" },
    { name: t('nav.programsDropdown.techSkills'), path: "/programs/tech-skills" },
    { name: t('nav.programsDropdown.workshops'), path: "/programs/workshops" },
  ];

  const resourcesMenu = [
    { name: t('nav.blog'), path: "/blog" },
    { name: t('nav.community'), path: "/resources/community" },
    { name: t('nav.learning'), path: "/resources/learning" },
  ];

  const searchableContent = [
    { title: t('nav.home'), path: "/" },
    { title: t('nav.about'), path: "/about" },
    { title: t('nav.stories'), path: "/SuccessStories" },
    { title: t('nav.contact'), path: "/contact" },
    { title: t('nav.programsDropdown.mentorship'), path: "/programs/mentorship" },
    { title: t('nav.programsDropdown.communication'), path: "/programs/Communication" },
    { title: t('nav.programsDropdown.techSkills'), path: "/programs/tech-skills" },
    { title: t('nav.programsDropdown.workshops'), path: "/programs/workshops" },
    { title: t('nav.blog'), path: "/blog" },
    { title: t('nav.community'), path: "/resources/community" },
    { title: t('nav.learning'), path: "/resources/learning" },
    { title: t('nav.login'), path: "/login" },
    { title: t('nav.signup'), path: "/signup" }
  ];

  // Function to handle search results timeout
  const handleSearchResultsTimeout = () => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      setSearchResults([]);
      setIsSearchFocused(false);
    }, 2000); // 2 seconds
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      const results = searchableContent.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setIsSearchFocused(true);
      handleSearchResultsTimeout();
    } else {
      setSearchResults([]);
      setIsSearchFocused(false);
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

  // Clear timeout on component unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Add effect to handle search focus timeout
  useEffect(() => {
    if (isSearchFocused && searchResults.length > 0) {
      handleSearchResultsTimeout();
    }
  }, [isSearchFocused, searchResults]);

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo - Now shared between mobile and desktop */}
          <Link to="/" className="flex-shrink-0">
            <img src={assets.empoweherlogo3} alt="Logo" className="h-8 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-6 items-center">
            <NavLink
              to="/"
              className={`${
                location.pathname === '/'
                  ? 'border-primary text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } inline-flex items-center px-1 pt-1 border-b-2 text-lg font-medium`}
            >
              {t('nav.home')}
            </NavLink>
            <NavLink
              to="/about"
              className={`${
                location.pathname === '/about'
                  ? 'border-primary text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } inline-flex items-center px-1 pt-1 border-b-2 text-lg font-medium`}
            >
              {t('nav.about')}
            </NavLink>

            {/* Programs with Hover Menu */}
            <div className="relative group">
              <NavLink
                to="/programs"
                className={`${
                  location.pathname === '/programs'
                    ? 'border-primary text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-lg font-medium`}
              >
                {t('nav.programs')}
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
                className={`${
                  location.pathname === '/resources'
                    ? 'border-primary text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-lg font-medium`}
              >
                {t('nav.resources')}
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
                {t('nav.mentorDashboard')}
              </NavLink>
            )}

            <NavLink
              to="/success-stories"
              className={`${
                location.pathname === '/success-stories'
                  ? 'border-primary text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } inline-flex items-center px-1 pt-1 border-b-2 text-lg font-medium`}
            >
              {t('nav.stories')}
            </NavLink>

            <NavLink
              to="/contact"
              className={`${
                location.pathname === '/contact'
                  ? 'border-primary text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } inline-flex items-center px-1 pt-1 border-b-2 text-lg font-medium`}
            >
              {t('nav.contact')}
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
                  placeholder={t('search.placeholder')}
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

            <LanguageSwitcher />

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                    {getUserInitials(user?.name || '')}
                  </div>
                </button>

                {/* Profile Dropdown - Desktop */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden md:block">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      {t('nav.profile')}
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        {t('nav.adminDashboard')}
                      </Link>
                    )}
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      {t('nav.settings')}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {t('nav.logout')}
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
            <div className="flex items-center space-x-3">
              <div className="relative">
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  aria-label="Toggle search"
                >
                  <img src={assets.searchIcon} className="w-5 h-5" alt="Search" />
                </button>
                
                {/* Collapsible Search Bar */}
                {isSearchOpen && (
                  <div className="fixed inset-x-0 top-16 bg-white shadow-lg p-2 z-50">
                    <div className="max-w-7xl mx-auto px-4">
                      <form onSubmit={handleSearchSubmit} className="relative">
                        <input
                          type="text"
                          placeholder="Search..."
                          value={searchQuery}
                          onChange={handleSearchChange}
                          onFocus={() => setIsSearchFocused(true)}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-20"
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                          {searchQuery && (
                            <button
                              type="button"
                              onClick={handleClearSearch}
                              className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                              <img src={assets.crossicon} className="w-4 h-4" alt="Clear search" />
                            </button>
                          )}
                          <VoiceSearchButton onResult={(text) => setSearchQuery(text)} />
                        </div>
                      </form>
                      {/* Search Results Dropdown */}
                      {isSearchFocused && searchResults.length > 0 && (
                        <div className="absolute left-0 right-0 mt-1 bg-white rounded-md shadow-lg z-50">
                          {searchResults.map((result, index) => (
                            <Link
                              key={index}
                              to={result.path}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                              onClick={() => {
                                setSearchQuery("");
                                setSearchResults([]);
                                setIsSearchFocused(false);
                                setIsSearchOpen(false);
                              }}
                            >
                              {result.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <LanguageSwitcher />
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-200"
                aria-label="Open menu"
              >
                <img src={assets.menuicon} className="h-6 w-6" alt="Menu" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMenuOpen(false)}
          />
          {/* Menu Content */}
          <div className="fixed inset-y-0 right-0 w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">{t('nav.menu')}</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
                aria-label={t('nav.closeMenu')}
              >
                <img src={assets.crossicon} className="w-5 h-5" alt={t('nav.closeMenu')} />
              </button>
            </div>
            <div className="px-4 py-2 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
              <NavLink 
                className="block w-full py-2 px-3 rounded-md hover:bg-gray-50" 
                to="/" 
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.home')}
              </NavLink>
              <NavLink 
                className="block w-full py-2 px-3 rounded-md hover:bg-gray-50" 
                to="/about" 
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.about')}
              </NavLink>
              <div>
                <p className="font-semibold py-2 px-3">{t('nav.programs')}</p>
                {programsMenu.map((item) => (
                  <NavLink 
                    key={item.path} 
                    to={item.path} 
                    onClick={() => setIsMenuOpen(false)} 
                    className="block py-2 px-6 rounded-md hover:bg-gray-50"
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
              <div>
                <p className="font-semibold py-2 px-3">{t('nav.resources')}</p>
                {resourcesMenu.map((item) => (
                  <NavLink 
                    key={item.path} 
                    to={item.path} 
                    onClick={() => setIsMenuOpen(false)} 
                    className="block py-2 px-6 rounded-md hover:bg-gray-50"
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
              <NavLink 
                className="block w-full py-2 px-3 rounded-md hover:bg-gray-50" 
                to="/success-stories" 
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.stories')}
              </NavLink>
              <NavLink 
                className="block w-full py-2 px-3 rounded-md hover:bg-gray-50" 
                to="/contact" 
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.contact')}
              </NavLink>
              
              {/* Add Mentor Dashboard link for mentor users in mobile menu */}
              {isAuthenticated && user?.role === 'mentor' && (
                <NavLink
                  to="/mentor/dashboard"
                  className="block w-full py-2 px-3 rounded-md hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.mentorDashboard')}
                </NavLink>
              )}

              {isAuthenticated ? (
                <div className="border-t mt-4 pt-4">
                  <div className="flex items-center space-x-2 mb-4 px-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                      {getUserInitials(user?.name || '')}
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    className="block py-2 px-3 rounded-md hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.profile')}
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="block py-2 px-3 rounded-md hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t('nav.adminDashboard')}
                    </Link>
                  )}
                  {user?.role === 'mentor' && (
                    <Link
                      to="/mentorDashboard"
                      className="block py-2 px-3 rounded-md hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t('nav.mentorDashboard')}
                    </Link>
                  )}
                  <Link
                    to="/settings"
                    className="block py-2 px-3 rounded-md hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.settings')}
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 px-3 rounded-md hover:bg-gray-50"
                  >
                    {t('nav.logout')}
                  </button>
                </div>
              ) : (
                <div className="border-t mt-4 pt-4">
                  <Link
                    to="/login"
                    className="block py-2 px-3 rounded-md hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/signup"
                    className="block py-2 px-3 rounded-md hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.signup')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
