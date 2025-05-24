import { useState } from "react";
import { useParams } from "react-router-dom";
import InstructorLayout from "../../components/InstructorLayout";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import api from "../../lib/axios";

const CreateLesson = () => {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);

  const [lessonData, setLessonData] = useState({
    title: "",
  });

  const [videoData, setVideoData] = useState({
    title: "",
    duration: "",
    url: null,
  });

  const [currentLessonId, setCurrentLessonId] = useState(null);

  const handleLessonInputChange = (e) => {
    const { name, value } = e.target;
    setLessonData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVideoInputChange = (e) => {
    const { name, value } = e.target;
    setVideoData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // You might want to add validation for video file types and size here
      setVideoData((prev) => ({
        ...prev,
        url: file,
      }));
    }
  };

  const handleCreateLesson = async (e) => {
    e.preventDefault();

    if (!lessonData.title.trim()) {
      toast.error("Please enter a lesson title");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post(`/course/${courseId}/lesson/create`, {
        title: lessonData.title,
        course: courseId,
      });

      setCurrentLessonId(response.data._id);
      toast.success("Lesson created successfully!");
      // Clear the lesson form
      setLessonData({ title: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create lesson");
    } finally {
      setLoading(false);
    }
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();

    if (!currentLessonId) {
      toast.error("Please create a lesson first");
      return;
    }

    if (!videoData.title.trim()) {
      toast.error("Please enter a video title");
      return;
    }

    if (!videoData.duration.trim()) {
      toast.error("Please enter video duration");
      return;
    }

    if (!videoData.url) {
      toast.error("Please select a video file");
      return;
    }

    const formData = new FormData();
    formData.append("title", videoData.title);
    formData.append("duration", videoData.duration);
    formData.append("url", videoData.url);
    formData.append("lesson", currentLessonId);

    try {
      setVideoLoading(true);
      await api.post(`/lesson/${currentLessonId}/video`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Video added successfully!");
      // Clear the video form
      setVideoData({
        title: "",
        duration: "",
        url: null,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add video");
    } finally {
      setVideoLoading(false);
    }
  };

  return (
    <InstructorLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">
              Create New Lesson
            </h1>
            <form onSubmit={handleCreateLesson} className="space-y-6">
              <div>
                <label
                  htmlFor="lessonTitle"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Lesson Title
                </label>
                <input
                  type="text"
                  id="lessonTitle"
                  name="title"
                  value={lessonData.title}
                  onChange={handleLessonInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter lesson title"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner className="w-4 h-4 mr-2" />
                      Creating...
                    </>
                  ) : (
                    "Create Lesson"
                  )}
                </button>
              </div>
            </form>
          </div>

          {currentLessonId && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Add Video to Lesson
              </h2>
              <form onSubmit={handleAddVideo} className="space-y-6">
                <div>
                  <label
                    htmlFor="videoTitle"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Video Title
                  </label>
                  <input
                    type="text"
                    id="videoTitle"
                    name="title"
                    value={videoData.title}
                    onChange={handleVideoInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter video title"
                  />
                </div>

                <div>
                  <label
                    htmlFor="duration"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Duration (in minutes)
                  </label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={videoData.duration}
                    onChange={handleVideoInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter video duration"
                    min="1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="video"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Video File
                  </label>
                  <input
                    type="file"
                    id="video"
                    name="url"
                    onChange={handleVideoFileChange}
                    accept="video/*"
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100
                      cursor-pointer"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={videoLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {videoLoading ? (
                      <>
                        <LoadingSpinner className="w-4 h-4 mr-2" />
                        Adding Video...
                      </>
                    ) : (
                      "Add Video"
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </InstructorLayout>
  );
};

export default CreateLesson;
