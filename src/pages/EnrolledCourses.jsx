import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, BarChart } from 'lucide-react';
import { capitalizeName } from '../utils/stringUtils';
import LoadingSpinner from '../components/LoadingSpinner';
import DashboardLayout from '../components/DashboardLayout';

const EnrolledCourses = () => {
  const { enrolledCourses, courseProgress, loading, error } = useSelector((state) => state.user);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-4">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Enrolled Courses</h1>

      {enrolledCourses?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course) => {
            const progress = courseProgress[course._id];
            return (
              <Link
                key={course._id}
                to={`/enrolled-course/${course._id}`}
                className="block bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200 hover:border-blue-300"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100">
                    {course.thumbnail ? (
                      <img
                        src={`https://learnify-server-s6fg.onrender.com/${course.thumbnail.replace(/\\/g, '/')}`}
                        alt={course.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gray-100">
                        <BookOpen className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 line-clamp-1 mb-1">{course.title}</h5>
                    <span className="text-xs px-2 py-1 bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 font-medium rounded-full border border-amber-300 shadow-sm">
                      {capitalizeName(course.courseType)}
                    </span>
                  </div>
                </div>

                {progress && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-blue-600">{progress.courseCompletionPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress.courseCompletionPercentage}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{progress.completedVideosCount}/{progress.totalVideosCount} videos</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BarChart className="h-4 w-4" />
                        <span>{progress.completedLessonsCount}/{progress.totalLessonsCount} lessons</span>
                      </div>
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No courses enrolled</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by enrolling in a course.</p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default EnrolledCourses; 