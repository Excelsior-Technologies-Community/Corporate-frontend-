import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { Shield, LayoutDashboard, LogOut, Users, BarChart3, Settings, Ban, CheckCircle2, Trash2 } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  const adminInfo = JSON.parse(
    localStorage.getItem('adminInfo') || sessionStorage.getItem('adminInfo') || '{}'
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
        const res = await axios.get('http://localhost:5000/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data.users);
      } catch (err) {
        console.error('Failed to fetch users', err);
        setError('Failed to load user data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId) => {
    try {
      const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
      const res = await axios.put(`http://localhost:5000/api/admin/users/${userId}/status`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Update local state
      setUsers(users.map(u => u.id === userId ? { ...u, status: res.data.newStatus } : u));
    } catch (err) {
      console.error('Failed to toggle status', err);
      alert('Failed to update user status. Please try again.');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    const isConfirmed = window.confirm(`Are you sure you want to permanently delete ${userName}? This action cannot be undone.`);
    if (!isConfirmed) return;

    try {
      const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Remove from local state immediately
      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      console.error('Failed to delete user', err);
      alert('Failed to delete user. Please try again.');
    }
  };

  const handleLogout = () => {
    // Clear from both storages
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminInfo');
    navigate('/admin');
  };

  const stats = [
    { label: 'Total Users', value: loading ? '...' : users.length.toString(), icon: Users, color: 'from-[#4f46e5] to-[#7154c1]' },
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
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
              activeTab === 'dashboard' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
              activeTab === 'users' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4" /> Users
          </button>
          <button type="button" className="w-full flex items-center gap-3 text-white/40 hover:text-white hover:bg-white/5 rounded-xl px-4 py-3 text-sm font-medium transition-colors">
            <BarChart3 className="w-4 h-4" /> Analytics
          </button>
          <button type="button" className="w-full flex items-center gap-3 text-white/40 hover:text-white hover:bg-white/5 rounded-xl px-4 py-3 text-sm font-medium transition-colors">
            <Settings className="w-4 h-4" /> Settings
          </button>
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
          <h1 className="text-2xl font-extrabold text-[#1a1f2c] tracking-tight">
            {activeTab === 'dashboard' ? 'Dashboard Overview' : 'User Management'}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {activeTab === 'dashboard' 
              ? `Welcome back, ${adminInfo.name || 'Admin'}! Here's what's happening.`
              : 'View and manage all registered accounts on the platform.'}
          </p>
        </div>

        {activeTab === 'dashboard' && (
          /* Stats Grid */
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
        )}

        {activeTab === 'users' && (
        /* User Data Table */
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#1a1f2c]">Registered Users</h2>
            <div className="text-sm text-gray-500 font-medium">Live Database</div>
          </div>
          
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                Loading users...
              </div>
            ) : error ? (
              <div className="p-8 text-center text-red-500 font-medium">
                {error}
              </div>
            ) : users.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p>No users registered yet.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">User</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Email Address</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Registration Date</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-gray-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(user.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4">
                        {user.status === 'suspended' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-200/50">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                            Suspended
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {user.status === 'suspended' ? (
                          <button
                            onClick={() => handleToggleStatus(user.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-200"
                            title="Activate User"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Activate
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleStatus(user.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors border border-transparent hover:border-orange-200"
                            title="Suspend User"
                          >
                            <Ban className="w-4 h-4" /> Suspend
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          className="inline-flex items-center justify-center p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete User permanently"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
