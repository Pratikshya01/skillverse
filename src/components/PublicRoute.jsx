import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoadingSpinner from './LoadingSpinner';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isAuthenticated) {
    // Redirect to appropriate page based on user role
    const getDefaultRoute = (role) => {
      switch (role?.toLowerCase()) {
        case 'instructor':
          return '/instructor/courses';
        default:
          return '/dashboard';
      }
    };

    return <Navigate to={getDefaultRoute(user?.role)} replace />;
  }

  return children;
};

export default PublicRoute; 