import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  fetchCourses,
  filterCoursesByCategory,
  filterCoursesByInstructor,
} from "../features/courses/courseSlice";
import { fetchCategories } from "../features/categories/categorySlice";
import { fetchInstructors } from "../features/user/userSlice";
import CourseCard from "../components/CourseCard";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { capitalizeName } from "../utils/stringUtils";

const Courses = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { courses, filteredCourses, loading, error, isFiltered } = useSelector(
    (state) => state.courses
  );
  const { categories } = useSelector((state) => state.categories);
  const { instructors } = useSelector((state) => state.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isInstructorOpen, setIsInstructorOpen] = useState(false);
  const coursesPerPage = 6;

  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchCategories());
    dispatch(fetchInstructors());
  }, [dispatch]);

  // Handle category from URL search params
  useEffect(() => {
    const categoryId = searchParams.get("category");
    if (categoryId) {
      setSelectedCategory(categoryId);
      dispatch(filterCoursesByCategory([categoryId]));
    }
  }, [searchParams, dispatch]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedInstructor, searchQuery]);

  const getCategoryName = (categoryId) => {
    const category = categories?.find((cat) => cat._id === categoryId);
    return category ? category.name : "Uncategorized";
  };

  const getInstructorName = (instructorId, course) => {
    if (course.instructorName) {
      return course.instructorName;
    }
    const instructor = instructors?.find((inst) => inst._id === instructorId);
    return instructor
      ? capitalizeName(`${instructor.first_name} ${instructor.last_name}`)
      : "Unknown Instructor";
  };

  const handleCategoryFilter = (categoryId) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
      dispatch(fetchCourses());
    } else {
      setSearchParams({ category: categoryId });
      setSelectedCategory(categoryId);
      dispatch(filterCoursesByCategory([categoryId]));
    }
    setSelectedInstructor(null);
  };

  const handleInstructorFilter = (instructorId) => {
    if (selectedInstructor === instructorId) {
      setSelectedInstructor(null);
      dispatch(fetchCourses());
    } else {
      setSelectedInstructor(instructorId);
      dispatch(filterCoursesByInstructor(instructorId));
    }
    setSelectedCategory(null);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedInstructor(null);
    setSearchQuery("");
    setSearchParams({});
    dispatch(fetchCourses());
  };

  const displayCourses = isFiltered ? filteredCourses : courses;
  const filteredResults = displayCourses?.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredResults?.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );
  const totalPages = Math.ceil((filteredResults?.length || 0) / coursesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".filter-dropdown")) {
        setIsCategoryOpen(false);
        setIsInstructorOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar - Desktop */}
        <div className="hidden md:block w-64 space-y-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Filters</h3>
              {(selectedCategory || selectedInstructor || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </button>
              )}
            </div>

            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Search courses..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Categories */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Categories
              </h4>
              <div className="space-y-2">
                {categories?.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => handleCategoryFilter(category._id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                      selectedCategory === category._id
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Instructors */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Instructors
              </h4>
              <div className="space-y-2">
                {instructors?.map((instructor) => (
                  <button
                    key={instructor._id}
                    onClick={() => handleInstructorFilter(instructor._id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                      selectedInstructor === instructor._id
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {capitalizeName(
                      `${instructor.first_name} ${instructor.last_name}`
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filters - Mobile */}
        <div className="md:hidden space-y-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Filters</h3>
              {(selectedCategory || selectedInstructor || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </button>
              )}
            </div>

            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  id="search-mobile"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Search courses..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="mb-4 filter-dropdown">
              <button
                onClick={() => {
                  setIsCategoryOpen(!isCategoryOpen);
                  setIsInstructorOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span>
                  {selectedCategory
                    ? getCategoryName(selectedCategory)
                    : "Select Category"}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                    isCategoryOpen ? "transform rotate-180" : ""
                  }`}
                />
              </button>

              {isCategoryOpen && (
                <div className="mt-1 max-h-60 overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    {categories?.map((category) => (
                      <button
                        key={category._id}
                        onClick={() => {
                          handleCategoryFilter(category._id);
                          setIsCategoryOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          selectedCategory === category._id
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Instructor Dropdown */}
            <div className="filter-dropdown">
              <button
                onClick={() => {
                  setIsInstructorOpen(!isInstructorOpen);
                  setIsCategoryOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span>
                  {selectedInstructor
                    ? capitalizeName(
                        instructors?.find((i) => i._id === selectedInstructor)
                          ?.first_name +
                          " " +
                          instructors?.find((i) => i._id === selectedInstructor)
                            ?.last_name
                      )
                    : "Select Instructor"}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                    isInstructorOpen ? "transform rotate-180" : ""
                  }`}
                />
              </button>

              {isInstructorOpen && (
                <div className="mt-1 max-h-60 overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    {instructors?.map((instructor) => (
                      <button
                        key={instructor._id}
                        onClick={() => {
                          handleInstructorFilter(instructor._id);
                          setIsInstructorOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          selectedInstructor === instructor._id
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {capitalizeName(
                          `${instructor.first_name} ${instructor.last_name}`
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory
                ? `Courses in ${getCategoryName(selectedCategory)}`
                : isFiltered
                ? "Filtered Courses"
                : "All Courses"}
            </h2>
            <span className="text-sm text-gray-500">
              {filteredResults?.length} courses found
            </span>
          </div>

          {filteredResults?.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentCourses.map((course) => (
                  <CourseCard
                    key={course._id}
                    course={{
                      ...course,
                      category: getCategoryName(course.category),
                      instructorName: getInstructorName(
                        course.instructor,
                        course
                      ),
                    }}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-md ${
                      currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        currentPage === index + 1
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-md ${
                      currentPage === totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Filter className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No courses found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;
