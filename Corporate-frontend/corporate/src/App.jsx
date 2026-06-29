import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Services from './pages/Services';
import Settings from './pages/Settings';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Testimonials from './pages/Testimonials';
import Pricing from './pages/Pricing';

// Global Axios Interceptor for handling auto-logout on suspension
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403 && error.response.data.message === 'Account suspended.') {
      // Clear user tokens
      localStorage.removeItem('userToken');
      localStorage.removeItem('userInfo');
      sessionStorage.removeItem('userToken');
      sessionStorage.removeItem('userInfo');
      
      // Dispatch event to update UI immediately
      window.dispatchEvent(new Event('authChange'));
      
      alert('Your account has been suspended by the administrator.');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Guard: Redirect to /admin if not authenticated
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
  if (!token) return <Navigate to="/admin" replace />;
  return children;
};

// Guard: Redirect to /login if not authenticated as regular user
const UserProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('userToken') || sessionStorage.getItem('userToken');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* User Routes */}
        <Route
          path="/dashboard"
          element={
            <UserProtectedRoute>
              <UserDashboard />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <UserProtectedRoute>
              <Settings />
            </UserProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}