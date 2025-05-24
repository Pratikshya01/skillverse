import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../lib/axios";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";

const QuizAttempts = () => {
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchQuizAttempts = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/quiz/result/${user._id}`);
        setQuizAttempts(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch quiz attempts");
        console.error("Error fetching quiz attempts:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchQuizAttempts();
    }
  }, [user?._id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <p>{error}</p>
      </div>
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(quizAttempts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAttempts = quizAttempts.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">My Quiz Attempts</h1>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quiz
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Questions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Correct Answers
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Result
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentAttempts.map((attempt) => (
                  <tr key={attempt._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {attempt.quizDescription}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {attempt.totalQuestions}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {attempt.correctAnswers}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          attempt.correctAnswers === attempt.totalQuestions
                            ? "bg-green-100 text-green-800"
                            : attempt.correctAnswers >=
                              attempt.totalQuestions / 2
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {attempt.correctAnswers === attempt.totalQuestions
                          ? "Passed"
                          : attempt.correctAnswers >= attempt.totalQuestions / 2
                          ? "Average"
                          : "Failed"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 py-4 bg-white border-t border-gray-200">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronFirst className="h-5 w-5" />
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="px-4 py-2 rounded-md bg-blue-50 text-blue-600 font-medium">
                {currentPage}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLast className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {quizAttempts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No quiz attempts found.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default QuizAttempts;
