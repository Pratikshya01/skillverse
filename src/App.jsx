import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CourseDetail from "./pages/CourseDetail";
import VideoPlayer from "./pages/VideoPlayer";
import Profile from "./pages/Profile";
import Courses from "./pages/Courses";
import EnrolledCourses from "./pages/EnrolledCourses";
import QuizAttempts from "./pages/QuizAttempts";
import Cart from "./pages/Cart";
import EnrolledCourseDetail from "./pages/EnrolledCourseDetail";
import PaymentSuccess from "./pages/PaymentSuccess";

// Instructor Pages
import InstructorCourses from "./pages/instructor/Courses";
import InstructorCreateCourse from "./pages/instructor/CreateCourse";
import InstructorProfile from "./pages/instructor/InstructorProfile";
import ManageLessons from "./pages/instructor/ManageLessons";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            {/* Student Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <Courses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/enrolled-courses"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <EnrolledCourses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-quiz-attempts"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <QuizAttempts />
                </ProtectedRoute>
              }
            />

            <Route
              path="/paymentsuccess"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <PaymentSuccess />
                </ProtectedRoute>
              }
            />

            <Route
              path="/enrolled-course/:courseId"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <EnrolledCourseDetail />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes (All Authenticated Users) */}
            <Route
              path="/course/:id"
              element={
                <ProtectedRoute>
                  <CourseDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/course/:courseId/video/:videoId"
              element={
                <ProtectedRoute>
                  <VideoPlayer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Instructor Routes */}
            <Route
              path="/instructor/profile"
              element={
                <ProtectedRoute allowedRoles={["instructor"]}>
                  <InstructorProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/courses"
              element={
                <ProtectedRoute allowedRoles={["instructor"]}>
                  <InstructorCourses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/create-course"
              element={
                <ProtectedRoute allowedRoles={["instructor"]}>
                  <InstructorCreateCourse />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/course/:courseId/lessons"
              element={
                <ProtectedRoute allowedRoles={["instructor"]}>
                  <ManageLessons />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
        <Toaster position="top-center" />
      </div>
    </Router>
  );
}

export default App;
