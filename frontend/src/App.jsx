import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Signup from './pages/Signup';
import UserDashboard from './pages/UserDashboard';
import ChangePassword from './pages/ChangePassword';
import AdminDashboard from './pages/AdminDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminUserDetails from './pages/AdminUserDetails';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route
  path="/user"
  element={
    <ProtectedRoute allowedRoles={['NORMAL_USER']}>
      <UserDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin"
  element={
    <ProtectedRoute allowedRoles={['SYSTEM_ADMINISTRATOR']}>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/users/:id"
  element={
    <ProtectedRoute allowedRoles={['SYSTEM_ADMINISTRATOR']}>
      <AdminUserDetails />
    </ProtectedRoute>
  }
/>

<Route
  path="/owner"
  element={
    <ProtectedRoute allowedRoles={['STORE_OWNER']}>
      <OwnerDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/change-password"
  element={
    <ProtectedRoute
      allowedRoles={[
        'NORMAL_USER',
        'STORE_OWNER',
        'SYSTEM_ADMINISTRATOR',
      ]}
    >
      <ChangePassword />
    </ProtectedRoute>
  }
/>
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;