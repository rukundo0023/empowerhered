import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import assets from "../assets/assets";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{ title: string; path: string }>>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLoggedIn] = useState(false);
  const [visible, setVisible] = useState(false);

  const programsMenu = [
    { name: "Mentorship", path: "/programs/mentorship" },
    { name: "Leadership", path: "/programs/leadership" },
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
    { title: "Leadership Training", path: "/programs/leadership" },
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
              HOME
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"
              }
            >
              ABOUT
            </NavLink>

            {/* Programs with Hover Menu */}
            <div className="relative group">
              <NavLink
                to="/programs"
                className={({ isActive }) =>
                  isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"
                }
              >
                PROGRAMS
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
                RESOURCES
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

            <NavLink
              to="/success-stories"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"
              }
            >
              STORIES
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"
              }
            >
              CONTACT
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
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-16"
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
                  <button
                    type="submit"
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
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

            {!isLoggedIn ? (
              <Link to="/login" className="text-sm text-gray-600 hover:text-blue-600">
                Login
              </Link>
            ) : (
              <Link to="/signup" className="text-sm text-gray-600 hover:text-blue-600">
                SignUp
              </Link>
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
                onClick={() => setVisible(true)}
                className="h-6 w-6 cursor-pointer"
                alt="Menu"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {visible && (
        <div className="md:hidden fixed top-0 left-0 w-full h-screen bg-white z-50 p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <Link to="/" onClick={() => setVisible(false)}>
              <img src={assets.empoweherlogo3} className="h-8" alt="Logo" />
            </Link>
            <button onClick={() => setVisible(false)}>
              <span className="text-xl">&times;</span>
            </button>
          </div>

          <nav className="flex flex-col space-y-4">
            <NavLink to="/" onClick={() => setVisible(false)}>Home</NavLink>
            <NavLink to="/about" onClick={() => setVisible(false)}>About</NavLink>
            <div>
              <p className="font-semibold">Programs</p>
              {programsMenu.map((item) => (
                <NavLink key={item.path} to={item.path} onClick={() => setVisible(false)} className="pl-4 block">
                  {item.name}
                </NavLink>
              ))}
            </div>
            <div>
              <p className="font-semibold">Resources</p>
              {resourcesMenu.map((item) => (
                <NavLink key={item.path} to={item.path} onClick={() => setVisible(false)} className="pl-4 block">
                  {item.name}
                </NavLink>
              ))}
            </div>
            <NavLink to="/success-stories" onClick={() => setVisible(false)}>Stories</NavLink>
            <NavLink to="/contact" onClick={() => setVisible(false)}>Contact</NavLink>
            <NavLink to="/login" onClick={() => setVisible(false)}>Login</NavLink>
            <NavLink to="/signup" onClick={() => setVisible(false)}>SignUp</NavLink>
          </nav>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
