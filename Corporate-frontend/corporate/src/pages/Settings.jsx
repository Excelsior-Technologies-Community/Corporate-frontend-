import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft, User, Lock, CheckCircle2, AlertCircle,
  Eye, EyeOff, LogOut, Save
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const API = 'http://localhost:5000/api/users';

const Settings = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [activeTab, setActiveTab] = useState('profile');

  // Profile form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    const info = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');
    if (!info) {
      navigate('/login');
      return;
    }
    const parsed = JSON.parse(info);
    setUserInfo(parsed);
    setName(parsed.name || '');
    setEmail(parsed.email || '');
  }, [navigate]);

  const getToken = () =>
    localStorage.getItem('userToken') || sessionStorage.getItem('userToken');

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error('Name and email are required.');
      return;
    }
    setProfileLoading(true);
    try {
      const res = await axios.put(`${API}/profile`, { name, email }, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const { token, user } = res.data;

      // Update storage with fresh user info & token
      const storage = localStorage.getItem('userToken') ? localStorage : sessionStorage;
      storage.setItem('userToken', token);
      storage.setItem('userInfo', JSON.stringify(user));

      // Notify Navbar
      window.dispatchEvent(new Event('authChange'));

      setUserInfo(user);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('All fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters.');
      return;
    }
    setPasswordLoading(true);
    try {
      await axios.put(`${API}/change-password`, { currentPassword, newPassword }, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
    sessionStorage.removeItem('userToken');
    sessionStorage.removeItem('userInfo');
    window.dispatchEvent(new Event('authChange'));
    navigate('/');
  };

  const tabs = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'security', label: 'Security', icon: Lock },
  ];

  const getPasswordStrength = (pwd) => {
    if (!pwd) return null;
    if (pwd.length < 6) return { label: 'Weak', color: 'bg-red-400', width: 'w-1/4' };
    if (pwd.length < 9) return { label: 'Fair', color: 'bg-yellow-400', width: 'w-2/4' };
    if (pwd.match(/[A-Z]/) && pwd.match(/[0-9]/) && pwd.match(/[^a-zA-Z0-9]/))
      return { label: 'Strong', color: 'bg-emerald-500', width: 'w-full' };
    return { label: 'Good', color: 'bg-blue-500', width: 'w-3/4' };
  };

  const strength = getPasswordStrength(newPassword);

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      {/* Top Nav */}
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <Link to="/" className="text-xl font-bold text-[#1a1f2c] flex items-baseline">
          Corporate<span className="w-1.5 h-1.5 rounded-full bg-[#f43f5e] ml-0.5 inline-block mb-1" />
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#1a1f2c] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="w-px h-6 bg-gray-200 mx-2" />
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-600 transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </nav>

      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] pt-14 pb-28 px-8 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
          <div className="absolute top-1/2 -left-20 w-64 h-64 bg-rose-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        </div>
        <div className="max-w-4xl mx-auto relative z-10 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4f46e5] to-[#7154c1] flex items-center justify-center text-white font-bold text-2xl shadow-xl">
            {userInfo.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{userInfo.name}</h1>
            <p className="text-gray-400 text-sm mt-0.5">{userInfo.email} · Member</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-8 -mt-14 relative z-20 pb-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Tab Header */}
          <div className="flex border-b border-gray-100">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2.5 px-8 py-4 text-sm font-semibold transition-colors border-b-2 -mb-px ${
                  activeTab === key
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="p-8 md:p-10">
              <div className="mb-8">
                <h2 className="text-lg font-bold text-[#1a1f2c]">Profile Information</h2>
                <p className="text-sm text-gray-500 mt-1">Update your name and email address.</p>
              </div>

              <form onSubmit={handleProfileSave} className="space-y-6 max-w-lg">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    placeholder="your@email.com"
                  />
                </div>

                {/* Avatar Preview */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4f46e5] to-[#7154c1] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{name || 'Your Name'}</p>
                    <p className="text-xs text-gray-500">{email || 'your@email.com'}</p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={profileLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />
                  {profileLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="p-8 md:p-10">
              <div className="mb-8">
                <h2 className="text-lg font-bold text-[#1a1f2c]">Change Password</h2>
                <p className="text-sm text-gray-500 mt-1">Update your password to keep your account secure.</p>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-6 max-w-lg">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600">
                      {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600">
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Password strength bar */}
                  {newPassword && (
                    <div className="mt-2">
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`} />
                      </div>
                      <p className={`text-xs mt-1 font-medium ${
                        strength.label === 'Weak' ? 'text-red-500' :
                        strength.label === 'Fair' ? 'text-yellow-600' :
                        strength.label === 'Good' ? 'text-blue-600' : 'text-emerald-600'
                      }`}>{strength.label} password</p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full px-4 py-3 pr-12 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                        confirmPassword && confirmPassword !== newPassword
                          ? 'border-red-300 bg-red-50'
                          : confirmPassword && confirmPassword === newPassword
                          ? 'border-emerald-300 bg-emerald-50'
                          : 'border-gray-200'
                      }`}
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    {confirmPassword && confirmPassword === newPassword && (
                      <CheckCircle2 className="absolute right-10 top-3.5 w-4 h-4 text-emerald-500" />
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm disabled:opacity-60"
                >
                  <Lock className="w-4 h-4" />
                  {passwordLoading ? 'Updating...' : 'Update Password'}
                </button>
              </form>

              {/* Security tips */}
              <div className="mt-10 p-5 bg-indigo-50 rounded-xl border border-indigo-100 max-w-lg">
                <p className="text-sm font-bold text-indigo-800 mb-2">💡 Security Tips</p>
                <ul className="space-y-1 text-xs text-indigo-700">
                  <li>• Use at least 8 characters including letters, numbers, and symbols.</li>
                  <li>• Avoid reusing passwords from other accounts.</li>
                  <li>• Never share your password with anyone.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
