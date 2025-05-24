import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import InstructorLayout from "../../components/InstructorLayout";
import { createCourse } from "../../features/courses/courseSlice";
import { fetchCategories } from "../../features/categories/categorySlice";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";

const CreateCourse = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { categories, loading: categoriesLoading } = useSelector(
    (state) => state.categories
  );
  const { loading: courseLoading } = useSelector((state) => state.courses);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    thumbnail: null,
    category: "",
    courseType: "premium",
    rating: 0,
    videos: [],
  });
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        thumbnail: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter a course title");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Please enter a course description");
      return;
    }

    if (!formData.price || formData.price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }

    if (!formData.thumbnail) {
      toast.error("Please upload a course thumbnail");
      return;
    }

    const courseFormData = new FormData();
    courseFormData.append("title", formData.title);
    courseFormData.append("description", formData.description);
    courseFormData.append("price", formData.price);
    courseFormData.append("category", formData.category);
    courseFormData.append("thumbnail", formData.thumbnail);
    courseFormData.append("courseType", formData.courseType);
    courseFormData.append("rating", formData.rating);
    courseFormData.append("videos", JSON.stringify(formData.videos));
    courseFormData.append("instructor", user?._id);

    try {
      await dispatch(createCourse(courseFormData)).unwrap();
      toast.success("Course created successfully!");
      navigate(`/instructor/courses`);
    } catch (error) {
      toast.error(error.message || "Failed to create course");
    }
  };

  if (categoriesLoading) {
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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">
              Create New Course
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Course Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter course title"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter course description"
                />
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter course price"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label
                  htmlFor="thumbnail"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Course Thumbnail
                </label>
                <input
                  type="file"
                  id="thumbnail"
                  name="thumbnail"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100
                    cursor-pointer"
                />
                {thumbnailPreview && (
                  <div className="mt-2">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={courseLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {courseLoading ? (
                    <>
                      <LoadingSpinner className="w-4 h-4 mr-2" />
                      Creating...
                    </>
                  ) : (
                    "Create Course"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </InstructorLayout>
  );
};

export default CreateCourse;
