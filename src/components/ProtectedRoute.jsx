import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  const location = useLocation();

  // Show loading state while auth state is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If roles are specified and user's role doesn't match, redirect to default route
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role?.toLowerCase())) {
    const defaultRoute = user?.role?.toLowerCase() === 'instructor' ? '/instructor/courses' : '/dashboard';
    return <Navigate to={defaultRoute} replace />;
  }

  return children;
};

export default ProtectedRoute; 