import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Star,
  Clock,
  FileText,
  Play,
  ChevronDown,
  ChevronUp,
  ShoppingCart,
} from "lucide-react";
import api from "../lib/axios";
import LoadingSpinner from "../components/LoadingSpinner";
import { enrollInCourse } from "../features/user/userSlice";
import { addToCart } from "../features/cart/cartSlice";
import toast from "react-hot-toast";
import { capitalizeName } from "../utils/stringUtils";

const BASE_URL = "https://learnify-server-s6fg.onrender.com";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { filteredCourses } = useSelector((state) => state.courses);
  const cartItems = useSelector((state) => state.cart.items);
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const isInCart = cartItems.some((item) => item._id === id);
  const isOwnCourse = filteredCourses.some((course) => course._id === id);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const [courseRes, reviewsRes] = await Promise.all([
          api.get(`/course/${id}`),
          api.get(`/reviews/${id}`),
        ]);
        setCourse(courseRes.data.courseDetails);

        // Map through reviews to ensure proper name display
        const formattedReviews = reviewsRes.data.map((review) => ({
          ...review,
          displayName: review.user?.name || review.name || "Anonymous",
        }));
        setReviews(formattedReviews);

        // Set first section as expanded by default
        if (courseRes.data.courseDetails.lessonDetails?.length > 0) {
          setExpandedSections({
            [courseRes.data.courseDetails.lessonDetails[0]._id]: true,
          });
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
        toast.error("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleEnroll = async () => {
    if (!user) {
      toast.error("Please login to enroll in the course");
      navigate("/login", { state: { from: location } });
      return;
    }

    try {
      // Add to cart first (even if it's free)
      if (!isInCart) {
        dispatch(
          addToCart({
            _id: course._id,
            title: course.title,
            price: 0, // Free course
            thumbnail: course.thumbnail,
            instructorName: course.instructorName,
          })
        );
      }

      await dispatch(
        enrollInCourse({ courseId: id, userId: user._id })
      ).unwrap();
      toast.success("Successfully enrolled in the course!");
      navigate("/enrolled-courses");
    } catch (error) {
      toast.error(error?.message || "Failed to enroll in the course");
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add course to cart");
      navigate("/login", { state: { from: location } });
      return;
    }

    if (isInCart) {
      navigate("/cart");
      return;
    }

    dispatch(
      addToCart({
        _id: course._id,
        title: course.title,
        price: course.price,
        thumbnail: course.thumbnail,
        instructorName: course.instructorName,
      })
    );
    toast.success("Course added to cart successfully!");
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to submit a review");
      navigate("/login", { state: { from: location } });
      return;
    }

    if (!userRating) {
      toast.error("Please select a rating");
      return;
    }

    try {
      setSubmittingReview(true);
      const response = await api.post(`/review/create`, {
        courseId: id,
        userId: user._id,
        rating: userRating,
        comment: userComment,
      });

      // Add the new review to the reviews list with the current user's name
      const newReview = {
        ...response.data.review,
        displayName: user.first_name + " " + user.last_name, // Use current user's name for immediate display
      };

      setReviews((prev) => [...prev, newReview]);
      setUserRating(0);
      setUserComment("");
      toast.success(response.data.message || "Review submitted successfully!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Course not found</h2>
      </div>
    );
  }

  const averageRating = course.rating || 0;
  const totalDuration =
    course.lessonDetails?.reduce((total, section) => {
      return (
        total +
        section?.videoDetails?.reduce(
          (sectionTotal, video) => sectionTotal + (video.duration || 0),
          0
        )
      );
    }, 0) || 0;

  const totalLessons =
    course.lessonDetails?.reduce((total, section) => {
      return total + section?.videoDetails?.length;
    }, 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Course Header */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="aspect-video w-full max-w-3xl mx-auto bg-gradient-to-r from-blue-500 to-blue-400 rounded-lg overflow-hidden mb-8">
            <img
              src={
                course.thumbnail
                  ? `${BASE_URL}/${course.thumbnail.replace(/\\/g, "/")}`
                  : `${BASE_URL}/uploads/default-course.jpg`
              }
              alt={course.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-blue-500 rounded-full text-sm text-white">
                {capitalizeName(course.courseType)}
              </span>
              <span className="px-3 py-1 bg-blue-500 rounded-full text-sm text-white">
                By {course.instructorName}
              </span>
            </div>

            <h1 className="text-4xl font-bold text-white mb-4">
              {course.title}
            </h1>
            <p className="text-blue-100 mb-6">{course.description}</p>

            <div className="flex items-center justify-center space-x-6 text-blue-100">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= averageRating
                        ? "text-yellow-400 fill-current"
                        : "text-blue-300"
                    }`}
                  />
                ))}
                <span className="ml-2">({reviews.length})</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>{Math.round(totalDuration / 60)} hours</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>{totalLessons} lessons</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Curriculum */}
            <div className="bg-white rounded-lg shadow-sm mb-8">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Course Curriculum</h2>
                {course?.lessonDetails?.length > 0 ? (
                  course.lessonDetails?.map((section, index) => (
                    <div key={index} className="border rounded-lg mb-4">
                      <button
                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
                        onClick={() => toggleSection(section._id)}
                      >
                        <div className="flex items-center">
                          <span className="font-medium text-gray-900 text-left">
                            {section.title}
                          </span>
                          <span className="ml-2 text-sm text-gray-500">
                            {section?.videoDetails?.length} lessons
                          </span>
                        </div>
                        {expandedSections[section._id] ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                      {expandedSections[section._id] && (
                        <div className="border-t">
                          {section?.videoDetails?.map((video) => (
                            <div
                              key={video._id}
                              className="flex items-center px-4 py-3 hover:bg-gray-50"
                            >
                              <Play className="w-4 h-4 text-gray-400 mr-3" />
                              <span className="text-gray-700">
                                {video.title}
                              </span>
                              <span className="ml-auto text-sm text-gray-500">
                                {video.duration} min
                              </span>
                            </div>
                          ))}
                          {section.quiz?.length > 0 && (
                            <div className="px-4 py-3 hover:bg-gray-50 flex items-center">
                              <FileText className="w-4 h-4 text-blue-600 mr-3" />
                              <span className="text-blue-600 font-medium">
                                Section Quiz
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">
                    No lessons available for this course.
                  </p>
                )}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-6">Student Reviews</h2>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review._id} className="border-b pb-6">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                        <span className="text-gray-600 font-medium">
                          {review.name ? review.name[0] : "A"}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {review.displayName}
                        </div>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="ml-auto text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>

              {/* Add Review Form */}
              {!isOwnCourse && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4">Add a Review</h3>
                  <form onSubmit={handleSubmitReview}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating
                      </label>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setUserRating(star)}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= userRating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comment
                      </label>
                      <textarea
                        value={userComment}
                        onChange={(e) => setUserComment(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows="4"
                        placeholder="Share your experience with this course..."
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {submittingReview ? "Submitting..." : "Submit Review"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Course Details & Instructor - Right Sidebar */}
          <div className="lg:col-span-4">
            {/* Course Details Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <div className="text-3xl font-bold text-gray-900 mb-6">
                ₹{course.price}
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Instructor:{" "}
                    <span className="text-primary">
                      {capitalizeName(course.instructorName)}
                    </span>
                  </h3>
                  <div className="flex items-center space-x-2">
                    {course.instructor?.profilePicture ? (
                      <img
                        src={`${BASE_URL}/${course.instructor.profilePicture.replace(
                          /\\/g,
                          "/"
                        )}`}
                        alt={course.instructor.name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {course.instructorName?.[0]?.toUpperCase() || "I"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Start Date:
                  </h3>
                  <div className="text-gray-900">01 Dec 2023</div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Total Duration:
                  </h3>
                  <div className="text-gray-900">
                    {Math.round(totalDuration / 60)}h {totalDuration % 60}m
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Enrolled:
                  </h3>
                  <div className="text-gray-900">532 students</div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Lectures:
                  </h3>
                  <div className="text-gray-900">{totalLessons} lectures</div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Skill Level:
                  </h3>
                  <div className="text-gray-900">Basic</div>
                </div>
              </div>

              {!isOwnCourse && (
                <>
                  <button
                    onClick={
                      course.courseType === "free"
                        ? handleEnroll
                        : handleAddToCart
                    }
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors mb-4 flex items-center justify-center gap-2"
                  >
                    {course.courseType === "free" ? (
                      "Enroll Now"
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        {isInCart ? "Already in Cart" : "Add to Cart"}
                      </>
                    )}
                  </button>

                  <p className="text-sm text-gray-500 text-center">
                    30-Day Money-Back Guarantee
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
