import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  PlusCircle,
  Star,
  Clock,
  Edit,
  Trash2,
  Eye,
  AlertCircle,
  IndianRupee,
  BookOpen,
} from "lucide-react";
import { filterCoursesByInstructor } from "../../features/courses/courseSlice";
import InstructorLayout from "../../components/InstructorLayout";
import LoadingSpinner from "../../components/LoadingSpinner";

const CourseCard = ({ course }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Construct the full image URL
  const imageUrl = course.thumbnail
    ? `https://learnify-server-s6fg.onrender.com/${course.thumbnail.replace(
        /\\/g,
        "/"
      )}`
    : "https://via.placeholder.com/400x225?text=No+Image";

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-4">
            <img
              src={imageUrl}
              alt={course.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {course.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {course.description}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <IndianRupee className="w-4 h-4 mr-2" />
              {course.price}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Star className="w-4 h-4 mr-2" />
              {course.rating || "N/A"} Rating
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              Updated {formatDate(course.updatedAt)}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <AlertCircle className="w-4 h-4 mr-2" />
              <span
                className={`capitalize ${
                  course.status === "published"
                    ? "text-green-600"
                    : course.status === "pending"
                    ? "text-yellow-600"
                    : "text-gray-600"
                }`}
              >
                {course.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t">
        <Link
          to={`/course/${course._id}`}
          className="flex-1 flex items-center justify-center px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </Link>
        <Link
          to={`/instructor/course/${course._id}/lessons`}
          className="flex-1 flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Manage
        </Link>
      </div>
    </div>
  );
};

const Courses = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { filteredCourses: courses, loading } = useSelector(
    (state) => state.courses
  );

  useEffect(() => {
    if (user?._id) {
      dispatch(filterCoursesByInstructor(user._id));
    }
  }, [dispatch, user?._id]);

  const handleEdit = (courseId) => {
    // Will implement in the next phase
    console.log("Edit course:", courseId);
  };

  const handleDelete = (courseId) => {
    // Will implement in the next phase
    console.log("Delete course:", courseId);
  };

  if (loading) {
    return (
      <InstructorLayout>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner />
        </div>
      </InstructorLayout>
    );
  }

  return (
    <InstructorLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
            <p className="text-gray-600 mt-1">
              Manage and track your course offerings
            </p>
          </div>
          <Link
            to="/instructor/create-course"
            className="w-full sm:w-auto flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Create Course
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No courses yet
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by creating your first course
            </p>
            <Link
              to="/instructor/create-course"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Create Course
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </InstructorLayout>
  );
};

export default Courses;
