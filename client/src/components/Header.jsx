import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if the user is logged in
  const isLoggedIn = localStorage.getItem("token");

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  // Utility function to check if a link is active
  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-gray-800 text-white shadow-lg left-0 w-full z-50 sticky top-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
        {/* Logo */}
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-white"
        >
          <Link to="/" className="hover:text-gray-300">
            Blog App
          </Link>
        </motion.h1>

        {/* Navigation */}
        <nav className="hidden md:flex items-stretch">
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-16"
          >
            <li>
              <Link
                to="/"
                className={` hover:text-white transition duration-300 ${
                  isActiveLink("/") ? "text-blue-500" : "text-gray-300"
                }`}
              >
                Home
              </Link>
            </li>
            {isLoggedIn ? (
              <>
                <li>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/register"
                    className={` hover:text-white transition duration-300 ${
                      isActiveLink("/register") ? "text-blue-500" : "text-gray-300"
                    }`}
                  >
                    Register
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className={` hover:text-white transition duration-300 ${
                      isActiveLink("/login") ? "text-blue-500" : "text-gray-300"
                    }`}
                  >
                    Login
                  </Link>
                </li>
              </>
            )}
          </motion.ul>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            className="text-gray-300 hover:text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden absolute top-16 left-0 w-full bg-gray-800 shadow-lg"
          >
            <ul className="flex flex-col items-center space-y-4 py-4">
              <li>
                <Link
                  to="/"
                  className={`text-gray-300 hover:text-white transition duration-300 ${
                    isActiveLink("/") ? "text-blue-500" : ""
                  }`}
                >
                  Home
                </Link>
              </li>
              {isLoggedIn ? (
                <li>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300"
                  >
                    Logout
                  </button>
                </li>
              ) : (
                <>
                  <li>
                    <Link
                      to="/register"
                      className={` hover:text-white transition duration-300 ${
                        isActiveLink("/register") ? "text-blue-500" : "text-gray-300"
                      }`}
                    >
                      Register
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/login"
                      className={` hover:text-white transition duration-300 ${
                        isActiveLink("/login") ? "text-blue-500" : "text-gray-300"
                      }`}
                    >
                      Login
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;