import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchCourses } from '../features/courses/courseSlice';
import { fetchCategories, selectCategories, selectCategoriesLoading, selectCategoriesError } from '../features/categories/categorySlice';
import CourseCard from '../components/CourseCard';
import { CourseCardSkeleton } from '../components/Skeleton';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, Lock, BookOpen, Users, Award, Code, Briefcase, Palette, Globe, Heart, ArrowRight, Music, Camera } from 'lucide-react';

const categoryIcons = {
  'Development': Code,
  'Business': Briefcase,
  'Design': Palette,
  'Marketing': Globe,
  'Music': Music,
  'Photography': Camera,
  'Health': Heart,
  'default': BookOpen,
};

const Home = () => {
  const dispatch = useDispatch();
  const { courses, loading } = useSelector((state) => state.courses);
  const categories = useSelector(selectCategories);
  const categoriesLoading = useSelector(selectCategoriesLoading);
  const categoriesError = useSelector(selectCategoriesError);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        await dispatch(fetchCategories()).unwrap();
      } catch (error) {
        // Error handling without console log
      }
    };

    loadCategories();
    dispatch(fetchCourses());
  }, [dispatch]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const getCategoryName = (categoryId) => {
    const category = categories?.find(cat => cat._id === categoryId);
    return category ? category.name : 'Uncategorized';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (categoriesError) {
    return <div>Error: {categoriesError}</div>;
  }

  // Get 4 random courses for popular courses section
  const popularCourses = [...courses]
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Learn Without Limits
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Start, switch, or advance your career with thousands of courses from expert instructors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/courses"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50"
              >
                Browse Courses
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-blue-700"
                >
                  Sign Up Free
                </Link>
              )}
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2">10,000+ Courses</h3>
              <p className="text-blue-100">Explore a variety of fresh topics</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Expert Instructors</h3>
              <p className="text-blue-100">Learn from industry experts</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Certificate</h3>
              <p className="text-blue-100">Get certified upon completion</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Discover Your Next Course
          </h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Top Categories Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Top Categories</h2>
            <Link
              to="/courses"
              className="text-blue-600 hover:text-blue-700 flex items-center text-sm font-medium"
            >
              View all categories
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories?.map((category) => {
              const Icon = categoryIcons[category.name] || categoryIcons.default;
              return (
                <Link
                  key={category._id}
                  to={`/courses?category=${category._id}`}
                  className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow text-center"
                >
                  <div className="flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900">{category.name}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Popular Courses Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Popular Courses</h2>
            <Link
              to="/courses"
              className="text-blue-600 hover:text-blue-700 flex items-center text-sm font-medium"
            >
              View all courses
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularCourses.map((course) => (
              <CourseCard 
                key={course._id} 
                course={{
                  ...course,
                  category: getCategoryName(course.category)
                }} 
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home; 