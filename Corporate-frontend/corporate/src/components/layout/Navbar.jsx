import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Mail, UserCircle, LogOut, Menu, X, ChevronDown, LayoutDashboard, Settings } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Close menus when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  const checkAuth = () => {
    const userInfo = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
    // Listen for our custom authChange event
    window.addEventListener('authChange', checkAuth);

    // Polling mechanism: quietly check user status every 30 seconds if logged in
    let interval;
    const token = localStorage.getItem('userToken') || sessionStorage.getItem('userToken');
    if (token) {
      interval = setInterval(async () => {
        try {
          // The interceptor in App.jsx will catch a 403 and automatically log them out
          await axios.get('http://localhost:5000/api/users/check-status', {
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (error) {
          // Ignore general errors (e.g. network failure), the interceptor handles 403s
        }
      }, 30000); // 30 seconds
    }

    return () => {
      window.removeEventListener('authChange', checkAuth);
      if (interval) clearInterval(interval);
    };
  }, [user?.id]); // Re-run if user changes so polling starts/stops

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
    sessionStorage.removeItem('userToken');
    sessionStorage.removeItem('userInfo');
    setUser(null);
    navigate('/');
  };

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Services', to: '/services' },
    { label: 'Testimonials', to: '/testimonials' },
    { label: 'Pricing', to: '/pricing' },
    { label: 'Blog', to: '/blog' },
    { label: 'Contact', to: '/contact' },
  ];

  return (
    <nav className="w-full bg-white px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
      {/* Logo */}
      <div className="flex-shrink-0">
        <Link to="/" className="text-2xl font-bold text-[#1a1f2c] flex items-baseline">
          Corporate
          <span className="w-1.5 h-1.5 rounded-full bg-[#f43f5e] ml-0.5"></span>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="hidden lg:flex items-center space-x-8">
        {navLinks.map(({ label, to }) => (
          <Link
            key={to}
            to={to}
            className={`text-[15px] transition-colors ${
              location.pathname === to
                ? 'font-semibold text-[#1a1f2c]'
                : 'font-medium text-gray-600 hover:text-[#1a1f2c]'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center space-x-6">
        <button className="text-gray-600 hover:text-[#1a1f2c] transition-colors">
          <Search className="w-5 h-5" />
        </button>

        {user ? (
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 focus:outline-none"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4f46e5] to-[#7154c1] flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white hover:ring-indigo-100 transition-all">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-semibold text-[#1a1f2c]">{user.name}</span>
                <span className="text-xs text-gray-500 font-medium">Member</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <>
                {/* Backdrop for clicking outside */}
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setIsProfileOpen(false)}
                ></div>
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-gray-100 mb-2">
                    <p className="text-sm font-semibold text-[#1a1f2c]">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  
                  <Link 
                    to="/dashboard"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                  <Link 
                    to="/settings"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                  >
                    <Settings className="w-4 h-4" /> Settings
                  </Link>
                  
                  <div className="h-px bg-gray-100 my-2"></div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-[14px] font-semibold text-[#1a1f2c] hover:text-indigo-600 transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="group hidden md:flex items-center space-x-2 border border-[#1a1f2c] rounded-full px-7 py-3 text-[14px] font-semibold text-white bg-[#1a1f2c] hover:bg-white hover:text-[#1a1f2c] transition-colors duration-400 ease-in-out"
            >
              <span className="relative overflow-hidden inline-flex">
                <span className="transition-transform duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-full block">
                  Sign Up
                </span>
                <span className="absolute top-full left-0 transition-transform duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-full block" aria-hidden="true">
                  Sign Up
                </span>
              </span>
            </Link>
          </div>
        )}
        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden text-gray-600 hover:text-[#1a1f2c] transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 lg:hidden flex flex-col py-4 px-6 space-y-4">
          <div className="flex flex-col space-y-4">
            {navLinks.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className={`text-[15px] transition-colors ${
                  location.pathname === to
                    ? 'font-semibold text-[#1a1f2c]'
                    : 'font-medium text-gray-600 hover:text-[#1a1f2c]'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
          
          <div className="pt-4 border-t border-gray-100 flex flex-col space-y-4">
            {!user && (
              <>
                <Link
                  to="/login"
                  className="text-[15px] font-semibold text-[#1a1f2c] hover:text-indigo-600 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="text-center border border-[#1a1f2c] rounded-xl px-4 py-3 text-[14px] font-semibold text-white bg-[#1a1f2c] hover:bg-white hover:text-[#1a1f2c] transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
