import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  PlusCircle,
  Video,
  FileText, ChevronDown,
  ChevronUp,
  Clock,
  BookOpen,
  Brain,
  Plus,
  Edit2,
  Trash
} from "lucide-react";
import InstructorLayout from "../../components/InstructorLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import api from "../../lib/axios";
import toast from "react-hot-toast";

const QuizForm = ({ onSubmit, initialData = null, onCancel, isLoading }) => {
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [questions, setQuestions] = useState(
    initialData?.questions || [
      { question: "", options: ["", "", "", ""], correctAnswer: 0 },
    ]
  );
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Validate description
    if (!description.trim()) {
      newErrors.description = "Quiz description is required";
    }

    // Validate questions
    const questionErrors = [];
    questions.forEach((q, qIndex) => {
      const qErrors = {};

      if (!q.question.trim()) {
        qErrors.question = `Question ${qIndex + 1} is required`;
      }

      const optionErrors = [];
      q.options.forEach((opt, optIndex) => {
        if (!opt.trim()) {
          optionErrors[optIndex] = `Option ${optIndex + 1} is required`;
        }
      });

      if (optionErrors.length > 0) {
        qErrors.options = optionErrors;
      }

      if (Object.keys(qErrors).length > 0) {
        questionErrors[qIndex] = qErrors;
      }
    });

    if (questionErrors.length > 0) {
      newErrors.questions = questionErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctAnswer: 0 },
    ]);
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    if (field === "options") {
      newQuestions[index].options = value;
    } else {
      newQuestions[index][field] = value;
    }
    setQuestions(newQuestions);

    // Clear errors for the changed field
    if (errors.questions?.[index]) {
      const newErrors = { ...errors };
      if (field === "question") {
        delete newErrors.questions[index].question;
      } else if (field === "options") {
        delete newErrors.questions[index].options;
      }
      if (Object.keys(newErrors.questions[index]).length === 0) {
        delete newErrors.questions[index];
      }
      if (Object.keys(newErrors.questions).length === 0) {
        delete newErrors.questions;
      }
      setErrors(newErrors);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ description, questions });
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quiz Description
          </label>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) {
                setErrors({ ...errors, description: null });
              }
            }}
            className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
            rows="3"
            placeholder="Enter quiz description"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        <div className="space-y-4">
          {questions.map((question, qIndex) => (
            <div key={qIndex} className="border rounded-md p-4">
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question {qIndex + 1}
                </label>
                <input
                  type="text"
                  value={question.question}
                  onChange={(e) =>
                    handleQuestionChange(qIndex, "question", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.questions?.[qIndex]?.question
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter question"
                />
                {errors.questions?.[qIndex]?.question && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.questions[qIndex].question}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                {question.options.map((option, oIndex) => (
                  <div key={oIndex}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Option {oIndex + 1}
                    </label>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...question.options];
                        newOptions[oIndex] = e.target.value;
                        handleQuestionChange(qIndex, "options", newOptions);
                      }}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.questions?.[qIndex]?.options?.[oIndex]
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder={`Option ${oIndex + 1}`}
                    />
                    {errors.questions?.[qIndex]?.options?.[oIndex] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.questions[qIndex].options[oIndex]}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correct Answer
                </label>
                <select
                  value={question.correctAnswer}
                  onChange={(e) =>
                    handleQuestionChange(
                      qIndex,
                      "correctAnswer",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {question.options.map((_, index) => (
                    <option key={index} value={index}>
                      Option {index + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleAddQuestion}
            className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Question
          </button>
          <div className="space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center">
                  {initialData ? "Updating..." : "Creating..."}
                </div>
              ) : initialData ? (
                "Update Quiz"
              ) : (
                "Create Quiz"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

const ManageLessons = () => {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [expandedSections, setExpandedSections] = useState({});
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [addingLesson, setAddingLesson] = useState(false);
  const [videoDataMap, setVideoDataMap] = useState({});
  const [addingVideoMap, setAddingVideoMap] = useState({});
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [quizzes, setQuizzes] = useState({});
  const [quizOperations, setQuizOperations] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => {
    const fetchCourseAndLessons = async () => {
      try {
        const courseRes = await api.get(`/course/${courseId}`);
        setCourse(courseRes.data.courseDetails);
        setLessons(courseRes.data.courseDetails.lessonDetails || []);

        // Set first section as expanded by default
        if (courseRes.data.courseDetails.lessonDetails?.length > 0) {
          setExpandedSections({
            [courseRes.data.courseDetails.lessonDetails[0]._id]: true,
          });
        }

        // Fetch quizzes for each lesson
        const quizzesData = {};
        for (const lesson of courseRes.data.courseDetails.lessonDetails || []) {
          const quizRes = await api.get(`/quizzes/${lesson._id}`);
          quizzesData[lesson._id] = quizRes.data.quizzes;
        }
        setQuizzes(quizzesData);
      } catch (error) {
        console.error("Error fetching course and lessons:", error);
        toast.error("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndLessons();
  }, [courseId]);

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    if (!newLessonTitle.trim()) {
      toast.error("Please enter a lesson title");
      return;
    }

    try {
      setAddingLesson(true);
      const response = await api.post(`/course/${courseId}/lesson/create`, {
        title: newLessonTitle,
        course: courseId,
      });

      // Update lessons with the new lesson from response.data.newLesson
      setLessons((prev) => [
        ...prev,
        {
          _id: response.data.newLesson._id,
          title: response.data.newLesson.title,
          videoDetails: [], // Initialize empty video details array
          quiz: [], // Initialize empty quiz array
          createdAt: response.data.newLesson.createdAt,
          updatedAt: response.data.newLesson.updatedAt,
        },
      ]);

      setNewLessonTitle("");
      setShowAddLesson(false);
      toast.success(response.data.message || "Lesson added successfully!");
    } catch (error) {
      console.error("Error adding lesson:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to add lesson";
      toast.error(errorMessage);
    } finally {
      setAddingLesson(false);
    }
  };

  const handleVideoFileChange = (e, lessonId) => {
    const file = e.target.files[0];
    if (file) {
      // Create a temporary URL for the video file
      const videoUrl = URL.createObjectURL(file);
      const video = document.createElement("video");

      // Add error handling for video loading
      video.onerror = () => {
        console.error("Error loading video file");
        toast.error("Error loading video file");
        URL.revokeObjectURL(videoUrl);
      };

      video.src = videoUrl;

      // When video metadata is loaded, we can access duration
      video.onloadedmetadata = () => {
        const duration = Math.round(video.duration);
        console.log("Video duration:", duration); // Debug log
        setVideoDataMap((prev) => ({
          ...prev,
          [lessonId]: {
            file,
            duration,
            name: file.name,
            title: file.name.split(".")[0], // Default title from filename
          },
        }));
        // Clean up
        URL.revokeObjectURL(videoUrl);
      };
    }
  };

  const handleVideoTitleChange = (lessonId, newTitle) => {
    setVideoDataMap((prev) => ({
      ...prev,
      [lessonId]: {
        ...prev[lessonId],
        title: newTitle,
      },
    }));
  };

  const handleAddVideo = async (lessonId) => {
    const videoData = videoDataMap[lessonId];
    if (!videoData?.file) {
      toast.error("Please select a video file");
      return;
    }

    if (!videoData.title.trim()) {
      toast.error("Please enter a video title");
      return;
    }

    try {
      setAddingVideoMap((prev) => ({ ...prev, [lessonId]: true }));
      const formData = new FormData();

      console.log("Sending video data:", {
        name: videoData.name,
        title: videoData.title,
        duration: videoData.duration,
        lessonId: lessonId,
      });

      formData.append("url", videoData.file);
      formData.append("title", videoData.title);
      formData.append("duration", videoData.duration.toString());
      formData.append("lesson", lessonId);

      const response = await api
        .post(`/lesson/${lessonId}/video`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .catch((error) => {
          console.error("API Error Response:", error.response?.data);
          console.error("API Error Status:", error.response?.status);
          console.error("Full Error:", error);
          throw error;
        });

      console.log("API Response:", response.data);

      // Update lessons with the new video from response.data.newVideo
      setLessons((prev) =>
        prev.map((lesson) =>
          lesson._id === lessonId
            ? {
                ...lesson,
                videoDetails: [
                  ...(lesson.videoDetails || []),
                  {
                    _id: response.data.newVideo._id,
                    title: response.data.newVideo.title,
                    url: response.data.newVideo.url,
                    duration: response.data.newVideo.duration,
                    createdAt: response.data.newVideo.createdAt,
                    updatedAt: response.data.newVideo.updatedAt,
                  },
                ],
              }
            : lesson
        )
      );

      setVideoDataMap((prev) => {
        const newMap = { ...prev };
        delete newMap[lessonId];
        return newMap;
      });

      toast.success(response.data.message || "Video added successfully!");
    } catch (error) {
      console.error("Error uploading video:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to add video";
      toast.error(errorMessage);
    } finally {
      setAddingVideoMap((prev) => ({ ...prev, [lessonId]: false }));
    }
  };

  const handleCreateQuiz = async (lessonId, quizData) => {
    setQuizOperations((prev) => ({
      ...prev,
      [lessonId]: { ...prev[lessonId], creating: true },
    }));
    try {
      const response = await api.post("/quiz/create", {
        lesson: lessonId,
        ...quizData,
      });

      setQuizzes((prev) => ({
        ...prev,
        [lessonId]: [...(prev[lessonId] || []), response.data.data],
      }));

      setShowQuizForm(false);
      toast.success("Quiz created successfully!");
    } catch (error) {
      console.error("Error creating quiz:", error);
      toast.error(error?.response?.data?.message || "Failed to create quiz");
    } finally {
      setQuizOperations((prev) => ({
        ...prev,
        [lessonId]: { ...prev[lessonId], creating: false },
      }));
    }
  };

  const handleUpdateQuiz = async (quizId, quizData) => {
    setQuizOperations((prev) => ({
      ...prev,
      [quizId]: { ...prev[quizId], updating: true },
    }));
    try {
      const response = await api.put(`/quiz/edit/${quizId}`, quizData);

      setQuizzes((prev) => {
        const newQuizzes = { ...prev };
        const lessonId = editingQuiz.lesson;
        newQuizzes[lessonId] = newQuizzes[lessonId].map((quiz) =>
          quiz._id === quizId ? response.data.updatedQuiz : quiz
        );
        return newQuizzes;
      });

      setEditingQuiz(null);
      toast.success("Quiz updated successfully!");
    } catch (error) {
      console.error("Error updating quiz:", error);
      toast.error(error?.response?.data?.message || "Failed to update quiz");
    } finally {
      setQuizOperations((prev) => ({
        ...prev,
        [quizId]: { ...prev[quizId], updating: false },
      }));
    }
  };

  const handleDeleteQuiz = async (quizId, lessonId) => {
    setQuizOperations((prev) => ({
      ...prev,
      [quizId]: { ...prev[quizId], deleting: true },
    }));
    try {
      await api.delete(`/quiz/delete/${quizId}`);

      setQuizzes((prev) => ({
        ...prev,
        [lessonId]: prev[lessonId].filter((quiz) => quiz._id !== quizId),
      }));

      setShowDeleteConfirm(null);
      toast.success("Quiz deleted successfully!");
    } catch (error) {
      console.error("Error deleting quiz:", error);
      toast.error(error?.response?.data?.message || "Failed to delete quiz");
    } finally {
      setQuizOperations((prev) => ({
        ...prev,
        [quizId]: { ...prev[quizId], deleting: false },
      }));
    }
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
      <div className="min-h-screen bg-gray-50">
        <div className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-lg font-medium text-gray-900">Manage Lessons</h1>
              <p className="text-sm text-gray-600">
                {course?.title || "Loading course..."}
              </p>
              <div className="mt-2 flex items-center gap-4 text-xs text-gray-600">
                <span className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-1" />
                  {lessons.length} Lessons
                </span>
                <span className="flex items-center">
                  <Video className="w-4 h-4 mr-1" />
                  {lessons.reduce(
                    (acc, lesson) => acc + (lesson.videoDetails?.length || 0),
                    0
                  )}{" "}
                  Videos
                </span>
                <span className="flex items-center">
                  <Brain className="w-4 h-4 mr-1" />
                  {lessons.reduce(
                    (acc, lesson) => acc + (lesson.quiz?.length || 0),
                    0
                  )}{" "}
                  Quizzes
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowAddLesson(true)}
              className="w-full sm:w-auto bg-blue-600 text-white py-2.5 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap"
            >
              Add New Lesson
            </button>
          </div>

          {showAddLesson && (
            <div className="bg-white rounded-md p-4">
              <form onSubmit={handleAddLesson} className="space-y-3">
                <div>
                  <label
                    htmlFor="lessonTitle"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Lesson Title
                  </label>
                  <input
                    type="text"
                    id="lessonTitle"
                    value={newLessonTitle}
                    onChange={(e) => setNewLessonTitle(e.target.value)}
                    className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter lesson title"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    type="submit"
                    disabled={addingLesson}
                    className="w-full px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {addingLesson ? "Adding..." : "Add Lesson"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddLesson(false)}
                    className="w-full px-4 py-2 text-sm text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-2">
            {lessons.length === 0 ? (
              <div className="text-center py-6 bg-white rounded-md">
                <FileText className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                <h3 className="text-base font-medium text-gray-900 mb-1">
                  No lessons yet
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Start by adding your first lesson to this course
                </p>
                <button
                  onClick={() => setShowAddLesson(true)}
                  className="inline-flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add First Lesson
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-md divide-y divide-gray-100">
                {lessons.map((lesson) => (
                  <div key={lesson._id} className="p-4">
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleSection(lesson._id)}
                    >
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {lesson.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                          <span className="flex items-center">
                            <Video className="w-3.5 h-3.5 mr-1" />
                            {lesson.videoDetails?.length || 0} Videos
                          </span>
                          <span className="flex items-center">
                            <Brain className="w-3.5 h-3.5 mr-1" />
                            {lesson.quiz?.length || 0} Quizzes
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        {expandedSections[lesson._id] ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {expandedSections[lesson._id] && (
                      <div className="mt-4">
                        {/* Videos Section */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium text-gray-900">Videos</h4>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const input = document.createElement("input");
                                input.type = "file";
                                input.accept = "video/*";
                                input.onchange = (e) =>
                                  handleVideoFileChange(e, lesson._id);
                                input.click();
                              }}
                              className="flex items-center text-xs text-blue-600 hover:text-blue-700"
                            >
                              <Plus className="w-3.5 h-3.5 mr-1" />
                              Add Video
                            </button>
                          </div>

                          {lesson.videoDetails && lesson.videoDetails.length > 0 && (
                            <div className="space-y-2">
                              {lesson.videoDetails.map((video) => (
                                <div
                                  key={video?._id}
                                  className="flex items-center justify-between py-2 text-sm"
                                >
                                  <div className="flex items-center min-w-0">
                                    <Video className="flex-shrink-0 w-3.5 h-3.5 text-gray-400 mr-2" />
                                    <span className="truncate text-gray-900">
                                      {video?.title}
                                    </span>
                                  </div>
                                  <div className="flex items-center text-xs text-gray-500 ml-2">
                                    <Clock className="w-3.5 h-3.5 mr-1" />
                                    {video?.duration}s
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {videoDataMap[lesson._id] && (
                            <div className="mt-2 space-y-3">
                              <div>
                                <label
                                  htmlFor={`video-title-${lesson._id}`}
                                  className="block text-xs font-medium text-gray-700 mb-1"
                                >
                                  Video Title
                                </label>
                                <input
                                  type="text"
                                  id={`video-title-${lesson._id}`}
                                  value={videoDataMap[lesson._id].title}
                                  onChange={(e) =>
                                    handleVideoTitleChange(lesson._id, e.target.value)
                                  }
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="Enter video title"
                                />
                              </div>
                              <div className="text-xs text-gray-500">
                                <div className="truncate">
                                  File: {videoDataMap[lesson._id].name}
                                </div>
                                <div>
                                  Duration: {videoDataMap[lesson._id].duration}s
                                </div>
                              </div>
                              <button
                                onClick={() => handleAddVideo(lesson._id)}
                                disabled={addingVideoMap[lesson._id]}
                                className="w-full flex items-center justify-center px-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50"
                              >
                                {addingVideoMap[lesson._id] ? "Uploading..." : "Upload Video"}
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Quizzes Section */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium text-gray-900">Quizzes</h4>
                            <button
                              onClick={() => {
                                setShowQuizForm(lesson._id);
                                setEditingQuiz(null);
                              }}
                              className="flex items-center text-xs text-blue-600 hover:text-blue-700"
                            >
                              <Plus className="w-3.5 h-3.5 mr-1" />
                              Add Quiz
                            </button>
                          </div>

                          {showQuizForm === lesson._id && (
                            <QuizForm
                              onSubmit={(data) => handleCreateQuiz(lesson._id, data)}
                              onCancel={() => setShowQuizForm(false)}
                              isLoading={quizOperations[lesson._id]?.creating}
                            />
                          )}

                          {quizzes[lesson._id]?.map((quiz) => (
                            <div
                              key={quiz._id}
                              className="py-2"
                            >
                              <div className="flex items-start justify-between">
                                <div className="min-w-0 flex-1">
                                  <h5 className="text-sm font-medium text-gray-900 truncate">
                                    {quiz.description}
                                  </h5>
                                  <p className="text-xs text-gray-500">
                                    {quiz.questions.length} Questions
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                  <button
                                    onClick={() => setEditingQuiz(quiz)}
                                    disabled={quizOperations[quiz._id]?.updating}
                                    className="text-xs text-blue-600 hover:text-blue-700 disabled:opacity-50"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => setShowDeleteConfirm(quiz)}
                                    disabled={quizOperations[quiz._id]?.deleting}
                                    className="text-xs text-red-600 hover:text-red-700 disabled:opacity-50"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>

                              {editingQuiz?._id === quiz._id && (
                                <QuizForm
                                  initialData={quiz}
                                  onSubmit={(data) => handleUpdateQuiz(quiz._id, data)}
                                  onCancel={() => setEditingQuiz(null)}
                                  isLoading={quizOperations[quiz._id]?.updating}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-4 rounded-md shadow-lg w-full max-w-sm mx-auto">
              <h3 className="text-base font-medium text-gray-900 mb-3">
                Delete Quiz
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to delete this quiz? This action cannot be undone.
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() =>
                    handleDeleteQuiz(showDeleteConfirm._id, showDeleteConfirm.lesson)
                  }
                  disabled={quizOperations[showDeleteConfirm._id]?.deleting}
                  className="w-full px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {quizOperations[showDeleteConfirm._id]?.deleting
                    ? "Deleting..."
                    : "Delete"}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="w-full px-4 py-2 text-sm text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </InstructorLayout>
  );
};

export default ManageLessons;
