import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  BookOpen, Menu,
  X, PlusCircle, User
} from "lucide-react";
import { useState } from "react";

const InstructorLayout = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `flex items-center space-x-3 px-4 py-2.5 rounded-lg font-medium ${
      isActive ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:bg-gray-50"
    }`;
  };

  const menuItems = [
    {
      path: "/instructor/profile",
      icon: User,
      label: "Profile",
    },
    {
      path: "/instructor/courses",
      icon: BookOpen,
      label: "My Courses",
    },
    {
      path: "/instructor/create-course",
      icon: PlusCircle,
      label: "Create Course",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 w-64 z-40 bg-white shadow-lg transform transition-transform duration-300 lg:relative lg:transform-none
          ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <div className="flex flex-col h-full">
          <div className="p-4">
            <div className="flex items-center space-x-3 mb-6">
              <img
                src={user?.profilePicture}
                alt="Instructor"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {user?.first_name} {user?.last_name}
                </h2>
                <span className="text-sm text-gray-500">Instructor</span>
              </div>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={getLinkClass(item.path)}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-full relative flex-1 p-4 pt-6 lg:p-8 lg:pt-10">
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

export default InstructorLayout;
