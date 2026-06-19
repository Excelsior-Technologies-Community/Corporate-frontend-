import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Shield, LayoutDashboard, LogOut, Users, BarChart3, Settings } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const adminInfo = JSON.parse(
    localStorage.getItem('adminInfo') || sessionStorage.getItem('adminInfo') || '{}'
  );

  const handleLogout = () => {
    // Clear from both storages
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminInfo');
    navigate('/admin');
  };

  const stats = [
    { label: 'Total Users', value: '1,284', icon: Users, color: 'from-[#4f46e5] to-[#7154c1]' },
    { label: 'Reports', value: '99%', icon: BarChart3, color: 'from-[#f46b45] to-[#e05d3a]' },
    { label: 'Happy Clients', value: '836', icon: Shield, color: 'from-[#22c55e] to-[#16a34a]' },
    { label: 'Cases Solved', value: '583', icon: LayoutDashboard, color: 'from-[#f59e0b] to-[#d97706]' },
  ];

  return (
    <div className="min-h-screen bg-[#f5f6fa] font-sans">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-white flex flex-col z-50 shadow-2xl">
        <div className="flex items-center gap-3 px-6 py-7 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4f46e5] to-[#7154c1] flex items-center justify-center shadow-lg">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-extrabold tracking-tight">Corporate</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#f43f5e] inline-block ml-0.5 mb-1" />
            <p className="text-[10px] text-white/40 font-medium uppercase tracking-widest">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
        <Link to="/admin/dashboard" className="flex items-center gap-3 bg-white/10 text-white rounded-xl px-4 py-3 text-sm font-semibold">
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>
          <a href="#" className="flex items-center gap-3 text-white/40 hover:text-white hover:bg-white/5 rounded-xl px-4 py-3 text-sm font-medium transition-colors">
            <Users className="w-4 h-4" /> Users
          </a>
          <a href="#" className="flex items-center gap-3 text-white/40 hover:text-white hover:bg-white/5 rounded-xl px-4 py-3 text-sm font-medium transition-colors">
            <BarChart3 className="w-4 h-4" /> Analytics
          </a>
          <a href="#" className="flex items-center gap-3 text-white/40 hover:text-white hover:bg-white/5 rounded-xl px-4 py-3 text-sm font-medium transition-colors">
            <Settings className="w-4 h-4" /> Settings
          </a>
        </nav>

        <div className="px-4 py-6 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#f46b45] to-[#7154c1] flex items-center justify-center text-white font-bold text-sm">
              {adminInfo.name?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{adminInfo.name || 'Admin'}</p>
              <p className="text-xs text-white/40 truncate max-w-[120px]">{adminInfo.email || ''}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 justify-center bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-[#1a1f2c] tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-400 text-sm mt-1">Welcome back, {adminInfo.name || 'Admin'}! Here's what's happening.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-extrabold text-[#1a1f2c] tracking-tight">{stat.value}</p>
              <p className="text-sm text-gray-400 font-medium mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Placeholder Panel */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4f46e5] to-[#7154c1] flex items-center justify-center mx-auto mb-4 shadow-lg">
            <LayoutDashboard className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-[#1a1f2c] mb-2">Admin Dashboard Active</h2>
          <p className="text-gray-400 text-sm max-w-sm mx-auto">
            You are successfully logged in as master admin. More sections and management features can be added here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
