import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Star, ShoppingCart } from "lucide-react";
import { capitalizeName } from "../utils/stringUtils";
import { addToCart } from "../features/cart/cartSlice";
import { enrollInCourse } from "../features/user/userSlice";
import toast from "react-hot-toast";

const CourseCard = ({ course }) => {
  const {
    _id,
    title,
    description,
    price,
    avgRating,
    thumbnail,
    instructorName,
    instructor,
    category,
    courseType,
  } = course;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);
  const isInCart = cartItems.some((item) => item._id === _id);
  const isOwnCourse = user?._id === instructor;

  // Construct the full image URL
  const imageUrl = thumbnail
    ? `https://learnify-server-s6fg.onrender.com/${thumbnail.replace(
        /\\/g,
        "/"
      )}`
    : "https://via.placeholder.com/400x225?text=No+Image";

  const handleEnrollClick = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to enroll in the course");
      navigate("/login", { state: { from: location } });
      return;
    }

    try {
      if (courseType === "free") {
        await dispatch(
          enrollInCourse({ courseId: _id, userId: user._id })
        ).unwrap();
        toast.success("Successfully enrolled in the course!");
        navigate("/enrolled-courses");
      } else {
        if (isInCart) {
          navigate("/cart");
        } else {
          dispatch(
            addToCart({
              _id,
              title,
              price,
              thumbnail,
              instructorName,
            })
          );
          toast.success("Course added to cart successfully!");
          navigate("/cart");
        }
      }
    } catch (error) {
      toast.error(error?.message || "Failed to process enrollment");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/course/${_id}`}>
        <div className="relative aspect-video">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3
            className="text-lg font-semibold text-gray-900 mb-1 truncate cursor-help"
            title={title}
          >
            {title}
          </h3>

          {/* Price section */}
          <div className="mb-2 flex items-center justify-between">
            {price > 0 && (
              <span className="text-lg font-bold text-blue-600">₹{price}</span>
            )}
            <span className="text-xs px-2 py-1 bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 font-medium rounded-full border border-amber-300 shadow-sm">
              {capitalizeName(courseType)}
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">
                {avgRating ? avgRating.toFixed(1) : "New"}
              </span>
            </div>
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
              {category}
            </span>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            By{" "}
            <span className="text-blue-600">
              {instructorName ? capitalizeName(instructorName) : "Unknown"}
            </span>
          </div>
        </div>
      </Link>
      {!isOwnCourse && (
        <div className="px-4 pb-4">
          <button
            onClick={handleEnrollClick}
            className="w-full mt-4 px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-md font-medium transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {courseType === "free" ? (
              "Enroll Now"
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                {isInCart ? "Go to Cart" : "Add to Cart"}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseCard;
