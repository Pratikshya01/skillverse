import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";
import {
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  ShoppingCart,
  LayoutDashboard,
  BookOpen,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCartItemsCount } from "../features/cart/cartSlice";

const Navbar = () => {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const cartItemsCount = useSelector(selectCartItemsCount);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getUserInitials = () => {
    if (!user) return "";
    const { first_name, last_name } = user;
    return `${first_name?.[0] || ""}${last_name?.[0] || ""}`.toUpperCase();
  };

  if (loading) {
    return (
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  SkillVerse
                </span>
              </Link>
            </div>
            <div className="flex items-center">
              <LoadingSpinner />
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                SkillVerse
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {user?.role === "student" && (
                  <>
                    <Link
                      to="/"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        isActive("/")
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Home
                    </Link>
                    <Link
                      to="/courses"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        isActive("/courses")
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Courses
                    </Link>
                    <Link
                      to="/cart"
                      className="relative text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <ShoppingCart className="w-6 h-6" />
                      {cartItemsCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                          {cartItemsCount}
                        </span>
                      )}
                    </Link>
                  </>
                )}
                {/* User Avatar with Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                      {getUserInitials()}
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                        isDropdownOpen ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        {user?.role === "instructor" ? (
                          <>
                            <Link
                              to="/instructor/profile"
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              <User className="h-4 w-4 mr-2" />
                              Profile
                            </Link>
                            <Link
                              to="/instructor/courses"
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              <BookOpen className="h-4 w-4 mr-2" />
                              My Courses
                            </Link>
                          </>
                        ) : (
                          <>
                            <Link
                              to="/dashboard"
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              <LayoutDashboard className="h-4 w-4 mr-2" />
                              Dashboard
                            </Link>
                            <Link
                              to="/profile"
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              <User className="h-4 w-4 mr-2" />
                              Profile
                            </Link>
                          </>
                        )}
                        <button
                          onClick={() => {
                            logout();
                            setIsDropdownOpen(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/login")
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {isAuthenticated ? (
                <>
                  {user?.role !== "instructor" && (
                    <>
                      <Link
                        to="/"
                        className={`block px-3 py-2 rounded-md text-base font-medium ${
                          isActive("/")
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Home
                      </Link>
                      <Link
                        to="/courses"
                        className={`block px-3 py-2 rounded-md text-base font-medium ${
                          isActive("/courses")
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Courses
                      </Link>
                      <Link
                        to="/cart"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="flex items-center">
                          <ShoppingCart className="w-5 h-5 mr-2" />
                          <span>Cart</span>
                          {cartItemsCount > 0 && (
                            <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                              {cartItemsCount}
                            </span>
                          )}
                        </div>
                      </Link>
                    </>
                  )}
                  {/* Mobile User Menu */}
                  <div className="border-t border-gray-200 mt-4 pt-4">
                    <div className="flex items-center px-3 py-2">
                      <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                        {getUserInitials()}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {user?.first_name} {user?.last_name}
                        </p>
                      </div>
                    </div>
                    {user?.role === "instructor" ? (
                      <>
                        <Link
                          to="/instructor/profile"
                          className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <User className="h-5 w-5 mr-3 text-gray-400" />
                          Profile
                        </Link>
                        <Link
                          to="/instructor/courses"
                          className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <BookOpen className="h-5 w-5 mr-3 text-gray-400" />
                          My Courses
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/dashboard"
                          className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <LayoutDashboard className="h-5 w-5 mr-3 text-gray-400" />
                          Dashboard
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <User className="h-5 w-5 mr-3 text-gray-400" />
                          Profile
                        </Link>
                      </>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-5 w-5 mr-3 text-red-400" />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive("/login")
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
