import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserProfile,
  updateUserProfile,
} from "../features/user/userSlice";
import { updateUser } from "../features/auth/authSlice";
import LoadingSpinner from "../components/LoadingSpinner";
import Toast from "../components/Toast";
import { User, Camera } from "lucide-react";
import { capitalizeName } from "../utils/stringUtils";

const Profile = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    profilePicture: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const hasFetchedProfile = useRef(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?._id && !hasFetchedProfile.current && !user) {
      hasFetchedProfile.current = true;
      dispatch(fetchUserProfile(user._id));
    }
  }, [dispatch, user?._id, user]);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        profilePicture: null,
      });

      // If there's a profile picture URL, set it as preview
      if (user?.profilePicture) {
        setPreviewImage(user?.profilePicture);
      }
    }
  }, [user]);

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
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setShowToast(true);
        setToastMessage("File size must be less than 5MB");
        setToastType("error");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        setShowToast(true);
        setToastMessage("Please upload an image file");
        setToastType("error");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        profilePicture: file,
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.onerror = () => {
        setShowToast(true);
        setToastMessage("Failed to read the image file");
        setToastType("error");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('first_name', formData.first_name);
      formDataToSend.append('last_name', formData.last_name);
      formDataToSend.append('email', formData.email);
      
      if (formData.profilePicture instanceof File) {
        formDataToSend.append('profilePicture', formData.profilePicture);
      }

      const result = await dispatch(
        updateUserProfile({
          userId: user._id,
          userData: formDataToSend,
        })
      ).unwrap();
      
      dispatch(updateUser(result.user));
      setIsEditing(false);
      setShowToast(true);
      setToastMessage("Profile updated successfully!");
      setToastType("success");

      // Reset the preview image and profile picture in form data
      setPreviewImage(result.user.profilePicture || null);
      setFormData(prev => ({
        ...prev,
        profilePicture: null,
      }));
    } catch (error) {
      setShowToast(true);
      setToastMessage(
        error?.message ||
        error?.response?.data?.message ||
        "Failed to update profile"
      );
      setToastType("error");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  console.log(user?.profilePicture);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {loading ? (
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Profile Information
                </h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                        {previewImage ? (
                          <img
                            src={previewImage}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : user?.profilePicture ? (
                          <img
                            src={`${import.meta.env.VITE_API_URL}/${user.profilePicture}`}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <label
                        htmlFor="profilePicture"
                        className="absolute bottom-0 right-0 bg-blue-600 p-1.5 rounded-full text-white cursor-pointer hover:bg-blue-700 transition-colors"
                      >
                        <Camera className="w-4 h-4" />
                        <input
                          type="file"
                          id="profilePicture"
                          name="profilePicture"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-gray-900">
                        {user
                          ? capitalizeName(
                              `${user.first_name} ${user.last_name}`
                            )
                          : ""}
                      </h3>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                      <p className="text-sm text-gray-500">
                        Joined:{" "}
                        {new Date(user?.dateJoined).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="first_name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        id="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="last_name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        id="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
                      placeholder="Your email address"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                      {user?.profilePicture ? (
                        <img
                          src={previewImage || user?.profilePicture}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-gray-900">
                        {user
                          ? capitalizeName(
                              `${user.first_name} ${user.last_name}`
                            )
                          : ""}
                      </h3>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                      <p className="text-sm text-gray-500">
                        Joined:{" "}
                        {new Date(user?.dateJoined).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        First Name
                      </h4>
                      <p className="mt-1 text-sm text-gray-900">
                        {user ? capitalizeName(user.first_name) : ""}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Last Name
                      </h4>
                      <p className="mt-1 text-sm text-gray-900">
                        {user ? capitalizeName(user.last_name) : ""}
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <h4 className="text-sm font-medium text-gray-500">
                        Email Address
                      </h4>
                      <p className="mt-1 text-sm text-gray-900">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default Profile;
