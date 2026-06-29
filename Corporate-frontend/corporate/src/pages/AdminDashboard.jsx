import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ImageUpload from '../components/admin/ImageUpload';

import { Shield, LayoutDashboard, LogOut, Users, BarChart3, Settings, Ban, CheckCircle2, Trash2, Briefcase, Plus, Pencil, X, ChevronDown, MessageSquare } from 'lucide-react';
import ManageTestimonials from '../components/admin/ManageTestimonials';

const API = 'http://localhost:5000/api';

const ICON_OPTIONS = ['Target', 'Coins', 'BarChart3', 'Briefcase', 'Globe', 'Lightbulb', 'TrendingUp', 'Users', 'Award', 'Search'];

const emptyForm = { title: '', description: '', label: '', icon: 'Target', image_url: '' };

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  // Services form state
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null); // null = create mode
  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const adminInfo = JSON.parse(
    localStorage.getItem('adminInfo') || sessionStorage.getItem('adminInfo') || '{}'
  );

  const getToken = () => localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API}/admin/users`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        setUsers(res.data.users);
      } catch (err) {
        console.error('Failed to fetch users', err);
        setError('Failed to load user data.');
        if (err.response?.status === 401) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setServicesLoading(true);
    try {
      const res = await axios.get(`${API}/services`);
      setServices(res.data.data);
    } catch (err) {
      console.error('Failed to fetch services', err);
    } finally {
      setServicesLoading(false);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      const res = await axios.put(`${API}/admin/users/${userId}/status`, {}, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setUsers(users.map(u => u.id === userId ? { ...u, status: res.data.newStatus } : u));
    } catch (err) {
      alert('Failed to update user status.');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}? This cannot be undone.`)) return;
    try {
      await axios.delete(`${API}/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      alert('Failed to delete user.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken'); localStorage.removeItem('adminInfo');
    sessionStorage.removeItem('adminToken'); sessionStorage.removeItem('adminInfo');
    navigate('/admin');
  };

  // Services CRUD handlers
  const openCreateForm = () => {
    setEditingService(null);
    setFormData(emptyForm);
    setFormError('');
    setShowForm(true);
  };

  const openEditForm = (service) => {
    setEditingService(service);
    setFormData({ title: service.title, description: service.description, label: service.label, icon: service.icon, image_url: service.image_url });
    setFormError('');
    setShowForm(true);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!formData.title || !formData.description || !formData.label || !formData.icon || !formData.image_url) {
      setFormError('All fields are required.');
      return;
    }
    setFormLoading(true);
    try {
      if (editingService) {
        await axios.put(`${API}/admin/services/${editingService.id}`, formData, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        setSuccessMsg('Service updated successfully!');
      } else {
        await axios.post(`${API}/admin/services`, formData, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        setSuccessMsg('Service created successfully!');
      }
      setShowForm(false);
      fetchServices();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      if (err.response?.status === 401) handleLogout();
      setFormError(err.response?.data?.message || 'Failed to save service.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteService = async (serviceId, serviceTitle) => {
    if (!window.confirm(`Delete "${serviceTitle}"? This cannot be undone.`)) return;
    try {
      await axios.delete(`${API}/admin/services/${serviceId}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setServices(services.filter(s => s.id !== serviceId));
      setSuccessMsg('Service deleted successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert('Failed to delete service.');
    }
  };

  const stats = [
    { label: 'Total Users', value: loading ? '...' : users.length.toString(), icon: Users, color: 'from-[#4f46e5] to-[#7154c1]' },
    { label: 'Services', value: servicesLoading ? '...' : services.length.toString(), icon: Briefcase, color: 'from-[#f46b45] to-[#e05d3a]' },
    { label: 'Happy Clients', value: '836', icon: Shield, color: 'from-[#22c55e] to-[#16a34a]' },
    { label: 'Cases Solved', value: '583', icon: LayoutDashboard, color: 'from-[#f59e0b] to-[#d97706]' },
  ];

  const navItems = [
    { key: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { key: 'users', icon: Users, label: 'Users' },
    { key: 'services', icon: Briefcase, label: 'Services' },
    { key: 'testimonials', icon: MessageSquare, label: 'Testimonials' },
    { key: 'analytics', icon: BarChart3, label: 'Analytics' },
    { key: 'settings', icon: Settings, label: 'Settings' },
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
          {navItems.map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                activeTab === key ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
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
            {activeTab === 'dashboard' ? 'Dashboard Overview' : activeTab === 'users' ? 'User Management' : activeTab === 'services' ? 'Services Management' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {activeTab === 'dashboard' ? `Welcome back, ${adminInfo.name || 'Admin'}! Here's what's happening.`
              : activeTab === 'users' ? 'View and manage all registered accounts on the platform.'
              : activeTab === 'services' ? 'Add, edit, or remove corporate service cards shown on the public Services page.'
              : activeTab === 'testimonials' ? 'Manage customer stories and reviews.'
              : 'Configure your application preferences and settings.'}
          </p>
        </div>

        {/* Success message */}
        {successMsg && (
          <div className="mb-6 flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 font-semibold text-sm">
            <CheckCircle2 className="w-4 h-4" /> {successMsg}
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
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

        {/* Users Tab */}
        {activeTab === 'users' && (
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
                <div className="p-8 text-center text-red-500 font-medium">{error}</div>
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
                          {new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </td>
                        <td className="px-6 py-4">
                          {user.status === 'suspended' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-200/50">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Suspended
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {user.status === 'suspended' ? (
                            <button onClick={() => handleToggleStatus(user.id)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-200" title="Activate User">
                              <CheckCircle2 className="w-4 h-4" /> Activate
                            </button>
                          ) : (
                            <button onClick={() => handleToggleStatus(user.id)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors border border-transparent hover:border-orange-200" title="Suspend User">
                              <Ban className="w-4 h-4" /> Suspend
                            </button>
                          )}
                          <button onClick={() => handleDeleteUser(user.id, user.name)} className="inline-flex items-center justify-center p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors" title="Delete User permanently">
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

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div>
            {/* Create Service Form Modal */}
            {showForm && (
              <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
                  <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-[#1a1f2c]">
                      {editingService ? 'Edit Service' : 'Add New Service'}
                    </h3>
                    <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <form onSubmit={handleFormSubmit} className="px-6 py-5 space-y-4">
                    {formError && (
                      <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium">{formError}</div>
                    )}

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Service Title</label>
                      <input
                        type="text" name="title" value={formData.title} onChange={handleFormChange}
                        placeholder="e.g. Business planning"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                      <textarea
                        name="description" value={formData.description} onChange={handleFormChange}
                        rows={3} placeholder="Short description of the service..."
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Badge Label</label>
                        <input
                          type="text" name="label" value={formData.label} onChange={handleFormChange}
                          placeholder="e.g. Creativity"
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Icon Name</label>
                        <div className="relative">
                          <select
                            name="icon" value={formData.icon} onChange={handleFormChange}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none pr-8 bg-white"
                          >
                            {ICON_OPTIONS.map(icon => (
                              <option key={icon} value={icon}>{icon}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2.5 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <ImageUpload 
                        label="Image URL / Path"
                        value={formData.image_url}
                        onChange={(url) => setFormData({ ...formData, image_url: url })}
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="submit" disabled={formLoading}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
                      >
                        {formLoading ? 'Saving...' : editingService ? 'Update Service' : 'Create Service'}
                      </button>
                      <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-sm transition-colors">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Services List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#1a1f2c]">Corporate Services</h2>
                <button
                  onClick={openCreateForm}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add Service
                </button>
              </div>

              {servicesLoading ? (
                <div className="p-8 text-center text-gray-500">
                  <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  Loading services...
                </div>
              ) : services.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="font-medium">No services yet.</p>
                  <p className="text-sm mt-1 text-gray-400">Click "Add Service" to create your first one.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50">
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">#</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Image</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Title</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Badge</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Icon</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {services.map((service, idx) => (
                        <tr key={service.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-gray-400">{idx + 1}</td>
                          <td className="px-6 py-4">
                            <img
                              src={service.image_url}
                              alt={service.title}
                              className="w-16 h-12 object-cover rounded-lg border border-gray-100"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-[#1a1f2c] text-sm">{service.title}</p>
                            <p className="text-xs text-gray-400 mt-0.5 max-w-[200px] truncate">{service.description}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-block bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                              {service.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 font-mono">{service.icon}</td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => openEditForm(service)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-200 mr-1"
                            >
                              <Pencil className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteService(service.id, service.title)}
                              className="inline-flex items-center justify-center p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete service"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
        {activeTab === 'testimonials' && (
          <ManageTestimonials />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
