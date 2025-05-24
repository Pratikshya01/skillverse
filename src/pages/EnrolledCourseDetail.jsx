import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Play, CheckCircle, Lock, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import api from '../lib/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const BASE_URL = "https://learnify-server-s6fg.onrender.com";

const EnrolledCourseDetail = () => {
  const { courseId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});
  const [currentVideo, setCurrentVideo] = useState(null);
  const [quizzes, setQuizzes] = useState({});
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizSubmitting, setQuizSubmitting] = useState(false);
  const [quizResults, setQuizResults] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const [lessonsRes, progressRes] = await Promise.all([
          api.get(`/course/${courseId}/lessons`),
          api.get(`/progress/${user._id}/${courseId}`)
            .catch(error => {
              // If progress is not found, return default values
              if (error.response?.status === 404 && error.response?.data?.message === "Progress not found") {
                return {
                  data: {
                    courseId,
                    userId: user._id,
                    completedLessonsCount: 0,
                    completedVideosCount: 0,
                    totalLessonsCount: 0,
                    totalVideosCount: 0,
                    completedLessons: [],
                    completedVideos: [],
                    courseCompletionPercentage: 0
                  }
                };
              }
              throw error;
            })
        ]);

        setLessons(lessonsRes.data.lessons);
        setProgress(progressRes.data);

        // Calculate total lessons and videos if progress is new
        if (progressRes.data.totalLessonsCount === 0) {
          const totalLessons = lessonsRes.data.lessons.length;
          const totalVideos = lessonsRes.data.lessons.reduce(
            (total, lesson) => total + (lesson.videoDetails?.length || 0),
            0
          );
          setProgress(prev => ({
            ...prev,
            totalLessonsCount: totalLessons,
            totalVideosCount: totalVideos
          }));
        }

        // Fetch quizzes for each lesson
        const quizzesData = {};
        await Promise.all(
          lessonsRes.data.lessons.map(async (lesson) => {
            try {
              const quizRes = await api.get(`/quizzes/${lesson._id}`);
              if (quizRes.data.quizzes.length > 0) {
                quizzesData[lesson._id] = quizRes.data.quizzes;
              }
            } catch (error) {
              console.error(`Failed to fetch quizzes for lesson ${lesson._id}:`, error);
            }
          })
        );
        setQuizzes(quizzesData);

        // Set first section as expanded by default
        if (lessonsRes.data.lessons.length > 0) {
          setExpandedSections({
            [lessonsRes.data.lessons[0]._id]: true
          });
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
        toast.error('Failed to load course data');
      } finally {
        setLoading(false);
      }
    };

    if (courseId && user?._id) {
      fetchCourseData();
    }
  }, [courseId, user?._id]);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const isVideoCompleted = (videoId) => {
    return progress?.completedVideos.includes(videoId);
  };

  const handleStartQuiz = (quiz) => {
    setCurrentVideo(null);
    setCurrentQuiz(quiz);
    setUserAnswers(new Array(quiz.questions.length).fill(null));
    setQuizResults(null);
  };

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setUserAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[questionIndex] = optionIndex;
      return newAnswers;
    });
  };

  const handleQuizSubmit = async () => {
    if (userAnswers.some(answer => answer === null)) {
      toast.error('Please answer all questions');
      return;
    }

    try {
      setQuizSubmitting(true);

      // Submit quiz answers
      const submitRes = await api.post(`/quiz/answer/${currentQuiz._id}`, {
        answers: userAnswers
      });

      // Update quiz score
      const scoreRes = await api.post('/progress/updateQuizScore', {
        userId: user._id,
        courseId: courseId,
        quizId: currentQuiz._id,
        userAnswers: userAnswers
      });

      setQuizResults({
        ...submitRes.data,
        ...scoreRes.data
      });

      toast.success('Quiz submitted successfully!');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to submit quiz');
    } finally {
      setQuizSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!lessons.length) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">No lessons found</h2>
            <p className="mt-4 text-gray-600">This course doesn't have any lessons yet.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-8">
            {/* Video Player or Quiz Section */}
            <div className="bg-white rounded-lg shadow-sm mb-8">
              {currentQuiz ? (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{currentQuiz.description}</h2>
                  <div className="space-y-6">
                    {currentQuiz.questions.map((q, questionIndex) => (
                      <div key={q._id} className="border rounded-lg p-4">
                        <p className="text-lg font-medium text-gray-900 mb-4">
                          {questionIndex + 1}. {q.question}
                        </p>
                        <div className="space-y-2">
                          {q.options.map((option, optionIndex) => (
                            <button
                              key={optionIndex}
                              onClick={() => handleAnswerSelect(questionIndex, optionIndex)}
                              className={`w-full text-left p-3 rounded-lg border ${
                                userAnswers[questionIndex] === optionIndex
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-blue-300'
                              }`}
                              disabled={quizResults || quizSubmitting}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {quizResults ? (
                    <div className="mt-6 p-4 rounded-lg bg-gray-50">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Quiz Results</h3>
                      <div className="space-y-2">
                        <p>Score: {quizResults.obtainedMarks}/{quizResults.totalMarks}</p>
                        <p>Correct Answers: {quizResults.correctAnswers}/{quizResults.totalQuestions}</p>
                        <p className={`font-medium ${
                          quizResults.status === 'Pass' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          Status: {quizResults.status}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={handleQuizSubmit}
                      disabled={quizSubmitting}
                      className="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {quizSubmitting ? 'Submitting...' : 'Submit Quiz'}
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="aspect-video bg-gray-900">
                    {currentVideo ? (
                      <video
                        src={`${BASE_URL}/${currentVideo.url}`}
                        controls
                        className="w-full h-full"
                      >
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white">
                        Select a video to start learning
                      </div>
                    )}
                  </div>
                  {currentVideo && (
                    <div className="p-4">
                      <h2 className="text-xl font-semibold text-gray-900">{currentVideo.title}</h2>
                      <p className="text-sm text-gray-600 mt-1">Duration: {currentVideo.duration} minutes</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Course Content */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Content</h2>
                {lessons.map((section) => (
                  <div key={section._id} className="border rounded-lg mb-4">
                    <button
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
                      onClick={() => toggleSection(section._id)}
                    >
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">{section.title}</span>
                        <span className="ml-2 text-sm text-gray-500">
                          {section.videoDetails.length} lessons
                          {quizzes[section._id]?.length > 0 && ' • 1 quiz'}
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
                        {section.videoDetails.map((video) => (
                          <button
                            key={video._id}
                            onClick={() => {
                              setCurrentVideo(video);
                              setCurrentQuiz(null);
                            }}
                            className="w-full flex items-center px-4 py-3 hover:bg-gray-50 text-left"
                          >
                            {isVideoCompleted(video._id) ? (
                              <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                            ) : (
                              <Play className="w-5 h-5 text-gray-400 mr-3" />
                            )}
                            <div className="flex-1">
                              <span className="text-gray-900">{video.title}</span>
                              <span className="ml-2 text-sm text-gray-500">
                                {video.duration} min
                              </span>
                            </div>
                          </button>
                        ))}
                        {quizzes[section._id]?.map((quiz) => (
                          <button
                            key={quiz._id}
                            onClick={() => handleStartQuiz(quiz)}
                            className="w-full flex items-center px-4 py-3 hover:bg-gray-50 text-left"
                          >
                            <FileText className="w-5 h-5 text-blue-500 mr-3" />
                            <div className="flex-1">
                              <span className="text-gray-900">Section Quiz</span>
                              <span className="ml-2 text-sm text-gray-500">
                                {quiz.questions.length} questions
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Progress Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your Progress</h2>
              
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Course Progress</span>
                  <span>{progress?.courseCompletionPercentage}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${progress?.courseCompletionPercentage}%` }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completed Lessons</span>
                  <span className="font-medium text-gray-900">
                    {progress?.completedLessonsCount} / {progress?.totalLessonsCount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completed Videos</span>
                  <span className="font-medium text-gray-900">
                    {progress?.completedVideosCount} / {progress?.totalVideosCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrolledCourseDetail; 