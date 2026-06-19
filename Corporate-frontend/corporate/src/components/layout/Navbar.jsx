import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Mail } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

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
        <Link
          to="/contact"
          className="group hidden md:flex items-center space-x-2 border border-gray-200 rounded-full px-7 py-3 text-[14px] font-semibold text-[#1a1f2c] hover:bg-[#1a1f2c] hover:border-[#1a1f2c] hover:text-white transition-colors duration-400 ease-in-out"
        >
          <span className="relative overflow-hidden inline-flex">
            <span className="transition-transform duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-full block">
              Free consultation
            </span>
            <span className="absolute top-full left-0 transition-transform duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-full block" aria-hidden="true">
              Free consultation
            </span>
          </span>
          <Mail className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors duration-400" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
