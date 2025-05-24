import { Link, useLocation } from "react-router-dom";
import { GraduationCap, BookOpen, Home, Menu, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import {
  fetchEnrolledCourses,
  fetchCourseProgress,
} from "../features/user/userSlice";
import { fetchCourses } from "../features/courses/courseSlice";

const DashboardLayout = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { enrolledCourses } = useSelector((state) => state.user);
  const { courses } = useSelector((state) => state.courses);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const hasFetchedData = useRef(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    if (user?._id && !hasFetchedData.current) {
      hasFetchedData.current = true;
      dispatch(fetchEnrolledCourses(user._id));
    }
  }, [dispatch, user?._id]);

  useEffect(() => {
    if (enrolledCourses?.length > 0) {
      enrolledCourses.forEach((course) => {
        dispatch(
          fetchCourseProgress({ userId: user._id, courseId: course._id })
        );
      });
    }
  }, [dispatch, enrolledCourses, user?._id]);

  // check if courses are loaded else fetch courses
  useEffect(() => {
    if (!courses || courses.length === 0) {
      dispatch(fetchCourses());
    }
  }, [dispatch, courses]);

  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `flex items-center space-x-3 px-4 py-2.5 rounded-lg font-medium ${
      isActive ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:bg-gray-50"
    }`;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 w-64 z-40 bg-white shadow-lg transform transition-transform duration-300 lg:relative lg:transform-none
        ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }
      `}
      >
        <div className="flex flex-col h-full">
          <div className="p-4">
            <div className="flex items-center space-x-3 mb-6">
              <img
                src={user?.profilePicture}
                alt="User"
                className="w-10 h-10 rounded-full"
              />
              <h2 className="text-lg font-semibold text-gray-800">
                {user?.first_name} {user?.last_name}
              </h2>
            </div>

            <nav className="space-y-2">
              <Link
                to="/dashboard"
                className={getLinkClass("/dashboard")}
                onClick={() => setIsSidebarOpen(false)}
              >
                <Home className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/enrolled-courses"
                className={getLinkClass("/enrolled-courses")}
                onClick={() => setIsSidebarOpen(false)}
              >
                <BookOpen className="w-5 h-5" />
                <span>Enrolled Courses</span>
              </Link>
              <Link
                to="/my-quiz-attempts"
                className={getLinkClass("/my-quiz-attempts")}
                onClick={() => setIsSidebarOpen(false)}
              >
                <GraduationCap className="w-5 h-5" />
                <span>My Quiz Attempts</span>
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative flex-1 p-4 lg:p-8">
        {/* Mobile Menu Button */}
        <div className="block lg:hidden absolute top-4 right-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg bg-blue-600 shadow-lg text-white hover:bg-blue-700 transition-colors"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
