import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');

  if (!token || !userData) {
    return <Navigate to="/" replace />;
  }

  const user = JSON.parse(userData);

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'SYSTEM_ADMINISTRATOR') {
      return <Navigate to="/admin" replace />;
    }

    if (user.role === 'STORE_OWNER') {
      return <Navigate to="/owner" replace />;
    }

    if (user.role === 'NORMAL_USER') {
      return <Navigate to="/user" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;