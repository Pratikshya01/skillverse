import { BookOpen, GraduationCap } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const { courses } = useSelector((state) => state.courses || {});
  const { enrolledCourses } = useSelector((state) => state.user || {});
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Summary</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-sm md:max-w-full">
        {/* Enrolled Courses Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-2">
                <BookOpen className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-sm text-gray-600">Enrolled Courses</h3>
            </div>
            <span className="text-3xl font-semibold text-gray-800">{enrolledCourses.length}</span>
          </div>
        </div>

        {/* Active Courses Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mb-2">
                <GraduationCap className="w-5 h-5 text-pink-500" />
              </div>
              <h3 className="text-sm text-gray-600">Active Courses</h3>
            </div>
            <span className="text-3xl font-semibold text-gray-800">{courses.length}</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard; 