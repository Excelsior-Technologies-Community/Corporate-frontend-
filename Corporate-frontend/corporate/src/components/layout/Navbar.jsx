import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Mail, UserCircle, LogOut } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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
    return () => window.removeEventListener('authChange', checkAuth);
  }, []);

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
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <UserCircle className="w-6 h-6 text-gray-400" />
              <span className="text-sm font-semibold text-[#1a1f2c]">{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
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
      </div>
    </nav>
  );
};

export default Navbar;
