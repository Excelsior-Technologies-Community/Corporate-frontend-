import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Wrench } from 'lucide-react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
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
import Chatbot from './components/Chatbot';

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
      
      toast.error('Your account has been suspended by the administrator.');
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

const AppContent = () => {
  const location = useLocation();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('We are currently performing scheduled maintenance. The dashboard will be back online shortly. Thank you for your patience!');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/settings');
        if (res.data.status === 'success' && res.data.data) {
          if (res.data.data.maintenanceMode) setMaintenanceMode(true);
          if (res.data.data.maintenanceMessage) setMaintenanceMessage(res.data.data.maintenanceMessage);
        }
      } catch (e) {
        console.error('Failed to fetch settings for maintenance', e);
      }
    };
    fetchSettings();

    const socket = io('http://localhost:5000');
    socket.on('settingsUpdated', (fetchedSettings) => {
      setMaintenanceMode(fetchedSettings.maintenanceMode === 'true' || fetchedSettings.maintenanceMode === true);
      if (fetchedSettings.maintenanceMessage) setMaintenanceMessage(fetchedSettings.maintenanceMessage);
    });

    return () => socket.disconnect();
  }, []);

  const isAdminRoute = location.pathname.startsWith('/admin');

  if (maintenanceMode && !isAdminRoute) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center items-center py-20 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="bg-white p-10 rounded-3xl shadow-sm max-w-md w-full text-center border border-gray-100 relative overflow-hidden animate-in fade-in zoom-in duration-500">
          <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
          <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-6">
            <Wrench className="w-10 h-10 text-amber-500 transform rotate-6" />
          </div>
          <h2 className="text-2xl font-bold text-[#1a1f2c] mb-3">Under Maintenance</h2>
          <p className="text-gray-500 leading-relaxed">
            {maintenanceMessage}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
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
      <Chatbot />
    </>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}