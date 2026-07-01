import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { io } from 'socket.io-client';
import ImageUpload from '../components/admin/ImageUpload';

import { Shield, LayoutDashboard, LogOut, Users, BarChart3, Settings as SettingsIcon, Ban, CheckCircle2, Trash2, Briefcase, Plus, Pencil, X, ChevronDown, MessageSquare, CreditCard, TrendingUp, DollarSign, Clock, Bot, Key, Send, Lock, Bell, Globe, Save, Info, AlertTriangle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ManageTestimonials from '../components/admin/ManageTestimonials';

const API = 'http://localhost:5000/api';

const ICON_OPTIONS = ['Target', 'Coins', 'BarChart3', 'Briefcase', 'Globe', 'Lightbulb', 'TrendingUp', 'Users', 'Award', 'Search'];

const emptyForm = { title: '', description: '', label: '', icon: 'Target', image_url: '' };

const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-between items-center px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
      <p className="text-sm text-gray-500">
        Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
        <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{' '}
        <span className="font-medium">{totalItems}</span> results
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [subscriptionStats, setSubscriptionStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [subscriptionsLoading, setSubscriptionsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Pagination states
  const [usersPage, setUsersPage] = useState(1);
  const [servicesPage, setServicesPage] = useState(1);
  const [subscriptionsPage, setSubscriptionsPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Services form state
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formLoading, setFormLoading] = useState(false);

  // Chatbot FAQ state
  const [faqs, setFaqs] = useState([]);
  const [faqsLoading, setFaqsLoading] = useState(true);
  
  // Settings State
  const [adminSettings, setAdminSettings] = useState({
    maintenanceMode: false,
    disableSignups: false,
    disableChatbot: false,
    emailNotifications: true,
    newSubscriptionAlerts: true,
    currency: 'USD',
    theme: 'light',
    siteTitle: 'Corporate Panel',
    supportEmail: 'support@corporate.com',
    maintenanceMessage: 'We are currently performing scheduled maintenance to improve our services. The dashboard will be back online shortly. Thank you for your patience!'
  });

  const [faqForm, setFaqForm] = useState({ keywords: '', answer: '' });
  const [faqFormLoading, setFaqFormLoading] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const adminInfo = JSON.parse(
    localStorage.getItem('adminInfo') || sessionStorage.getItem('adminInfo') || '{}'
  );

  const getToken = () => localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [usersRes, statsRes] = await Promise.all([
          axios.get(`${API}/admin/users`, { headers: { Authorization: `Bearer ${getToken()}` } }),
          axios.get(`${API}/subscriptions/stats`, { headers: { Authorization: `Bearer ${getToken()}` } }),
        ]);
        setUsers(usersRes.data.users);
        setSubscriptionStats(statsRes.data.data);
      } catch (err) {
        console.error('Failed to fetch initial data', err);
        toast.error('Failed to load data.');
        if (err.response?.status === 401) handleLogout();
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (activeTab === 'subscriptions' || activeTab === 'analytics') fetchSubscriptions();
    if (activeTab === 'chatbot') fetchFaqs();
  }, [activeTab]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${API}/admin/settings`);
        if (res.data.status === 'success' && res.data.data) {
          const fetchedSettings = { ...adminSettings, ...res.data.data };
          // Cast string booleans back to booleans
          Object.keys(fetchedSettings).forEach(key => {
            if (fetchedSettings[key] === 'true') fetchedSettings[key] = true;
            if (fetchedSettings[key] === 'false') fetchedSettings[key] = false;
          });
          setAdminSettings(fetchedSettings);
          // Also sync to localStorage for the locked pages (Signup, UserDashboard) which might load before API responds
          localStorage.setItem('adminSettings', JSON.stringify(fetchedSettings));
        }
      } catch (e) {
        console.error('Failed to fetch settings from API', e);
      }
    };
    fetchSettings();

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${API}/admin/notifications`, { headers: { Authorization: `Bearer ${getToken()}` } });
        if (res.data.status === 'success') {
          setNotifications(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    };
    fetchNotifications();

    const socket = io('http://localhost:5000');
    socket.on('newAdminNotification', (notif) => {
      setNotifications(prev => [notif, ...prev]);
      toast.success(notif.message, { icon: '🔔' });
    });

    return () => socket.disconnect();
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAllRead = async () => {
    try {
      await axios.put(`${API}/admin/notifications/read-all`, {}, { headers: { Authorization: `Bearer ${getToken()}` } });
      setNotifications(notifications.map(n => ({ ...n, is_read: 1 })));
      setShowNotifications(false);
    } catch (err) {
      console.error('Failed to mark notifications as read', err);
    }
  };

  const handleClearAll = async () => {
    try {
      await axios.delete(`${API}/admin/notifications`, { headers: { Authorization: `Bearer ${getToken()}` } });
      setNotifications([]);
      setShowNotifications(false);
      toast.success('All notifications cleared');
    } catch (err) {
      console.error('Failed to clear notifications', err);
      toast.error('Failed to clear notifications');
    }
  };

  const handleSaveSettings = async () => {
    try {
      await axios.put(`${API}/admin/settings`, adminSettings, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      // Keep localStorage in sync for instant page locks
      localStorage.setItem('adminSettings', JSON.stringify(adminSettings));
      toast.success('Admin settings saved successfully!');
    } catch (e) {
      console.error('Failed to save settings to API', e);
      toast.error('Failed to save settings.');
    }
  };

  const fetchSubscriptions = async () => {
    setSubscriptionsLoading(true);
    try {
      const [subsRes, statsRes] = await Promise.all([
        axios.get(`${API}/subscriptions`, { headers: { Authorization: `Bearer ${getToken()}` } }),
        axios.get(`${API}/subscriptions/stats`, { headers: { Authorization: `Bearer ${getToken()}` } }),
      ]);
      setSubscriptions(subsRes.data.data);
      setSubscriptionStats(statsRes.data.data);
    } catch (err) {
      console.error('Failed to fetch subscriptions', err);
    } finally {
      setSubscriptionsLoading(false);
    }
  };

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

  const fetchFaqs = async () => {
    setFaqsLoading(true);
    try {
      const res = await axios.get(`${API}/admin/chatbot/faqs`, { headers: { Authorization: `Bearer ${getToken()}` } });
      setFaqs(res.data.data);
    } catch (err) {
      console.error('Failed to fetch FAQs', err);
    } finally {
      setFaqsLoading(false);
    }
  };

  const handleAddFaq = async (e) => {
    e.preventDefault();
    if (!faqForm.keywords.trim() || !faqForm.answer.trim()) {
      toast.error('Both fields are required.');
      return;
    }
    setFaqFormLoading(true);
    try {
      await axios.post(`${API}/admin/chatbot/faqs`, faqForm, { headers: { Authorization: `Bearer ${getToken()}` } });
      setFaqForm({ keywords: '', answer: '' });
      fetchFaqs();
      toast.success('FAQ added successfully!');
    } catch (err) {
      toast.error('Failed to save FAQ.');
    } finally {
      setFaqFormLoading(false);
    }
  };

  const handleDeleteFaq = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-gray-900">
          Delete this chatbot response?
        </p>
        <div className="flex justify-end gap-2 mt-1">
          <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1.5 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">Cancel</button>
          <button onClick={async () => {
            toast.dismiss(t.id);
            try {
              await axios.delete(`${API}/admin/chatbot/faqs/${id}`, { headers: { Authorization: `Bearer ${getToken()}` } });
              setFaqs(prev => prev.filter(f => f.id !== id));
              toast.success('FAQ deleted successfully!');
            } catch (err) {
              toast.error('Failed to delete FAQ.');
            }
          }} className="px-3 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">Delete</button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const handleToggleStatus = async (userId) => {
    try {
      const res = await axios.put(`${API}/admin/users/${userId}/status`, {}, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setUsers(users.map(u => u.id === userId ? { ...u, status: res.data.newStatus } : u));
      toast.success('User status updated.');
    } catch (err) {
      toast.error('Failed to update user status.');
    }
  };

  const handleDeleteUser = (userId, userName) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-gray-900">
          Are you sure you want to delete {userName}? This cannot be undone.
        </p>
        <div className="flex justify-end gap-2 mt-1">
          <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1.5 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">Cancel</button>
          <button onClick={async () => {
            toast.dismiss(t.id);
            try {
              await axios.delete(`${API}/admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${getToken()}` }
              });
              setUsers(prev => prev.filter(u => u.id !== userId));
              toast.success('User deleted successfully.');
            } catch (err) {
              toast.error('Failed to delete user.');
            }
          }} className="px-3 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">Delete</button>
        </div>
      </div>
    ), { duration: Infinity });
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
    setShowForm(true);
  };

  const openEditForm = (service) => {
    setEditingService(service);
    setFormData({ title: service.title, description: service.description, label: service.label, icon: service.icon, image_url: service.image_url });
    setShowForm(true);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.label || !formData.icon || !formData.image_url) {
      toast.error('All fields are required.');
      return;
    }
    setFormLoading(true);
    try {
      if (editingService) {
        await axios.put(`${API}/admin/services/${editingService.id}`, formData, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        toast.success('Service updated successfully!');
      } else {
        await axios.post(`${API}/admin/services`, formData, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        toast.success('Service created successfully!');
      }
      setShowForm(false);
      fetchServices();
    } catch (err) {
      if (err.response?.status === 401) handleLogout();
      toast.error(err.response?.data?.message || 'Failed to save service.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteService = (serviceId, serviceTitle) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-gray-900">
          Delete "{serviceTitle}"? This cannot be undone.
        </p>
        <div className="flex justify-end gap-2 mt-1">
          <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1.5 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">Cancel</button>
          <button onClick={async () => {
            toast.dismiss(t.id);
            try {
              await axios.delete(`${API}/admin/services/${serviceId}`, {
                headers: { Authorization: `Bearer ${getToken()}` }
              });
              setServices(prev => prev.filter(s => s.id !== serviceId));
              toast.success('Service deleted successfully!');
            } catch (err) {
              toast.error('Failed to delete service.');
            }
          }} className="px-3 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">Delete</button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const stats = [
    { label: 'Total Users', value: loading ? '...' : users.length.toString(), icon: Users, color: 'from-[#4f46e5] to-[#7154c1]' },
    { label: 'Services', value: servicesLoading ? '...' : services.length.toString(), icon: Briefcase, color: 'from-[#f46b45] to-[#e05d3a]' },
    { label: 'Subscriptions', value: subscriptionStats ? subscriptionStats.total.toString() : '...', icon: CreditCard, color: 'from-[#22c55e] to-[#16a34a]' },
    { label: 'Total Revenue', value: subscriptionStats ? `$${Number(subscriptionStats.totalRevenue || 0).toFixed(0)}` : '...', icon: DollarSign, color: 'from-[#f59e0b] to-[#d97706]' },
  ];

  const navItems = [
    { key: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { key: 'users', icon: Users, label: 'Users' },
    { key: 'services', icon: Briefcase, label: 'Services' },
    { key: 'subscriptions', icon: CreditCard, label: 'Subscriptions' },
    { key: 'testimonials', icon: MessageSquare, label: 'Testimonials' },
    { key: 'chatbot', icon: Bot, label: 'Chatbot Training' },
    { key: 'analytics', icon: BarChart3, label: 'Analytics' },
    { key: 'settings', icon: SettingsIcon, label: 'Settings' },
  ];

  // Analytics Data Aggregation
  const getRevenueByPlanData = () => {
    if (!subscriptions || subscriptions.length === 0) return [];
    const revenueMap = {};
    subscriptions.forEach(sub => {
      const plan = sub.plan_name || 'Unknown';
      if (sub.status === 'active') {
        revenueMap[plan] = (revenueMap[plan] || 0) + Number(sub.price || 0);
      }
    });
    return Object.keys(revenueMap).map(key => ({ name: key, revenue: revenueMap[key] }));
  };

  const getUserGrowthData = () => {
    if (!users || users.length === 0) return [];
    const growthMap = {};
    users.forEach(user => {
      const date = new Date(user.created_at);
      const monthYear = date.toLocaleString('default', { month: 'short', year: '2-digit' });
      growthMap[monthYear] = (growthMap[monthYear] || 0) + 1;
    });
    return Object.keys(growthMap).map(key => ({ month: key, users: growthMap[key] }));
  };

  const getUserStatusData = () => {
    if (!users || users.length === 0) return [];
    let active = 0;
    let suspended = 0;
    users.forEach(user => {
      if (user.status === 'active') active++;
      else suspended++;
    });
    return [
      { name: 'Active', value: active, color: '#10b981' },
      { name: 'Suspended', value: suspended, color: '#ef4444' }
    ];
  };

  const Toggle = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <div>
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-indigo-600' : 'bg-gray-200'}`}
      >
        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );

  return (
    <div className={`min-h-screen bg-[#f5f6fa] font-sans ${adminSettings?.theme === 'dark' ? 'dark-admin' : ''}`}>
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
      <div className="ml-64 p-8 relative">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1a1f2c] tracking-tight">
              {activeTab === 'dashboard' ? 'Dashboard Overview'
                : activeTab === 'users' ? 'User Management'
                : activeTab === 'services' ? 'Services Management'
                : activeTab === 'subscriptions' ? 'Subscription Management'
                : activeTab === 'chatbot' ? 'Chatbot Training'
                : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {activeTab === 'dashboard' ? `Welcome back, ${adminInfo.name || 'Admin'}! Here's what's happening.`
                : activeTab === 'users' ? 'View and manage all registered accounts on the platform.'
                : activeTab === 'services' ? 'Add, edit, or remove corporate service cards shown on the public Services page.'
                : activeTab === 'subscriptions' ? 'Track all plan purchases, revenue, and subscriber details in real time.'
                : activeTab === 'testimonials' ? 'Manage customer stories and reviews.'
                : activeTab === 'chatbot' ? 'Train the chatbot by adding keywords and custom responses.'
                : 'Configure your application preferences and settings.'}
            </p>
          </div>

          {/* Real-time Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 bg-white rounded-full text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors border border-gray-200 shadow-sm"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 transform translate-x-1 -translate-y-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h3 className="font-semibold text-gray-800 text-sm">Notifications</h3>
                  <div className="flex items-center gap-3">
                    {unreadCount > 0 && (
                      <button onClick={handleMarkAllRead} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                        Mark all read
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button onClick={handleClearAll} className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors">
                        Clear all
                      </button>
                    )}
                  </div>
                </div>
                <div className="max-h-[320px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 text-sm">No new notifications</div>
                  ) : (
                    notifications.map((notif) => (
                      <div key={notif.id} className={`p-4 border-b border-gray-50 flex items-start gap-3 transition-colors ${!notif.is_read ? 'bg-indigo-50/30' : 'hover:bg-gray-50'}`}>
                        <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${!notif.is_read ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                        <div>
                          <p className={`text-sm ${!notif.is_read ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>{notif.message}</p>
                          <span className="text-[10px] text-gray-400 mt-1 block">
                            {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(notif.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
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
                    {users.slice((usersPage - 1) * ITEMS_PER_PAGE, usersPage * ITEMS_PER_PAGE).map((user) => (
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
              {users.length > ITEMS_PER_PAGE && (
                <Pagination
                  currentPage={usersPage}
                  totalItems={users.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={setUsersPage}
                />
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
                      {services.slice((servicesPage - 1) * ITEMS_PER_PAGE, servicesPage * ITEMS_PER_PAGE).map((service, idx) => (
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
                  {services.length > ITEMS_PER_PAGE && (
                    <Pagination
                      currentPage={servicesPage}
                      totalItems={services.length}
                      itemsPerPage={ITEMS_PER_PAGE}
                      onPageChange={setServicesPage}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        {/* Subscriptions Tab */}
        {activeTab === 'subscriptions' && (
          <div>
            {/* Stats mini-cards */}
            {subscriptionStats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4f46e5] to-[#7154c1] flex items-center justify-center shadow-lg shrink-0">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-[#1a1f2c]">{subscriptionStats.total}</p>
                    <p className="text-sm text-gray-400">Total Subscriptions</p>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#22c55e] to-[#16a34a] flex items-center justify-center shadow-lg shrink-0">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-[#1a1f2c]">{subscriptionStats.active}</p>
                    <p className="text-sm text-gray-400">Active Plans</p>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#f59e0b] to-[#d97706] flex items-center justify-center shadow-lg shrink-0">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-[#1a1f2c]">${Number(subscriptionStats.totalRevenue || 0).toFixed(2)}</p>
                    <p className="text-sm text-gray-400">Total Revenue</p>
                  </div>
                </div>
              </div>
            )}

            {/* Subscriptions Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#1a1f2c]">All Subscriptions</h2>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-sm text-gray-500 font-medium">Live Database</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                {subscriptionsLoading ? (
                  <div className="p-8 text-center text-gray-500">
                    <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    Loading subscriptions...
                  </div>
                ) : subscriptions.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">
                    <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="font-medium">No subscriptions yet.</p>
                    <p className="text-sm mt-1 text-gray-400">Subscriptions will appear here once users complete checkout.</p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50">
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">#</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Email</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Plan</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Amount</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Status</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {subscriptions.slice((subscriptionsPage - 1) * ITEMS_PER_PAGE, subscriptionsPage * ITEMS_PER_PAGE).map((sub, idx) => (
                        <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-gray-400">{idx + 1}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                                {sub.email.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-sm font-medium text-gray-900">{sub.email}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-block bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                              {sub.plan_name}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-gray-900">${Number(sub.price).toFixed(2)}</span>
                            <span className="text-xs text-gray-400 ml-1">/mo</span>
                          </td>
                          <td className="px-6 py-4">
                            {sub.status === 'active' ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-200/50">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> {sub.status}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5 text-sm text-gray-500">
                              <Clock className="w-3.5 h-3.5 text-gray-300" />
                              {new Date(sub.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {subscriptions.length > ITEMS_PER_PAGE && (
                  <Pagination
                    currentPage={subscriptionsPage}
                    totalItems={subscriptions.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                    onPageChange={setSubscriptionsPage}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'testimonials' && (
          <ManageTestimonials />
        )}

        {/* Chatbot Training Tab */}
        {activeTab === 'chatbot' && (
          <div className="space-y-8">
            {/* Add New Response Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4f46e5] to-[#7154c1] flex items-center justify-center shadow">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#1a1f2c]">Add New Bot Response</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Keywords are comma-separated (e.g. pricing, cost, price)</p>
                </div>
              </div>
              <form onSubmit={handleAddFaq} className="px-6 py-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      <Key className="w-3.5 h-3.5 inline mr-1.5 text-indigo-500" />
                      Trigger Keywords
                    </label>
                    <input
                      type="text"
                      value={faqForm.keywords}
                      onChange={(e) => setFaqForm({ ...faqForm, keywords: e.target.value })}
                      placeholder="e.g. refund, money back, guarantee"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      <Bot className="w-3.5 h-3.5 inline mr-1.5 text-indigo-500" />
                      Bot Answer
                    </label>
                    <input
                      type="text"
                      value={faqForm.answer}
                      onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                      placeholder="e.g. We offer a 30-day money-back guarantee!"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={faqFormLoading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    {faqFormLoading ? 'Saving...' : 'Save Response'}
                  </button>
                </div>
              </form>
            </div>

            {/* Trained Responses Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#1a1f2c]">Trained Responses</h2>
                <span className="text-sm text-gray-400 font-medium">{faqs.length} responses</span>
              </div>

              {faqsLoading ? (
                <div className="p-8 text-center text-gray-500">
                  <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  Loading responses...
                </div>
              ) : faqs.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <Bot className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="font-medium text-gray-700">No responses trained yet.</p>
                  <p className="text-sm mt-1 text-gray-400">Add your first keyword and answer above to get started.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50">
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">#</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Trigger Keywords</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Bot Response</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Created</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {faqs.map((faq, idx) => (
                        <tr key={faq.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-gray-400">{idx + 1}</td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1.5">
                              {faq.question_keywords.split(',').map((kw, i) => (
                                <span key={i} className="inline-block bg-indigo-50 text-indigo-700 border border-indigo-100 text-[11px] font-semibold px-2.5 py-1 rounded-full">
                                  {kw.trim()}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">{faq.answer}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(faq.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleDeleteFaq(faq.id)}
                              className="inline-flex items-center justify-center p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete response"
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

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Users</p>
                  <p className="text-3xl font-bold text-[#1a1f2c] mt-1">{users.length}</p>
                </div>
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <Users className="w-6 h-6" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Active Subscriptions</p>
                  <p className="text-3xl font-bold text-[#1a1f2c] mt-1">{subscriptionStats?.active || 0}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Monthly Revenue</p>
                  <p className="text-3xl font-bold text-[#1a1f2c] mt-1">${Number(subscriptionStats?.totalRevenue || 0).toFixed(0)}</p>
                </div>
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-[#1a1f2c] mb-6">User Growth</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getUserGrowthData()}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        cursor={{ stroke: '#f3f4f6', strokeWidth: 2 }}
                      />
                      <Line type="monotone" dataKey="users" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-[#1a1f2c] mb-6">Revenue by Plan</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getRevenueByPlanData()}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(val) => `$${val}`} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        cursor={{ fill: '#f9fafb' }}
                        formatter={(value) => [`$${value}`, 'Revenue']}
                      />
                      <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-[#1a1f2c] mb-6">User Status Distribution</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getUserStatusData()}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {getUserStatusData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto pb-12">
            {/* Header */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#1a1f2c] tracking-tight">Application Settings</h2>
                <p className="text-sm text-gray-500 mt-1">Manage site access, metadata, notifications, and application preferences.</p>
              </div>
              <button
                onClick={handleSaveSettings}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-[0_4px_12px_rgba(79,70,229,0.25)] hover:shadow-[0_6px_16px_rgba(79,70,229,0.3)] active:scale-[0.98]"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left Column */}
              <div className="space-y-6">
                {/* Site Identity & SEO */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:border-indigo-100 transition-colors">
                  <div className="px-6 py-5 border-b border-gray-50 flex items-center gap-4 bg-gray-50/50">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#1a1f2c]">Site Identity</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Basic information about your application.</p>
                    </div>
                  </div>
                  <div className="p-6 space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Site Title</label>
                      <input
                        type="text"
                        value={adminSettings.siteTitle}
                        onChange={(e) => setAdminSettings({ ...adminSettings, siteTitle: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all shadow-sm"
                        placeholder="e.g. Corporate Panel"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Support Email</label>
                      <input
                        type="email"
                        value={adminSettings.supportEmail}
                        onChange={(e) => setAdminSettings({ ...adminSettings, supportEmail: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all shadow-sm"
                        placeholder="e.g. support@corporate.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Application Preferences */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:border-indigo-100 transition-colors">
                  <div className="px-6 py-5 border-b border-gray-50 flex items-center gap-4 bg-gray-50/50">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                      <SettingsIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#1a1f2c]">Preferences</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Global formatting and theme options.</p>
                    </div>
                  </div>
                  <div className="p-6 space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Default Currency</label>
                      <div className="relative">
                        <select
                          value={adminSettings.currency}
                          onChange={(e) => setAdminSettings({ ...adminSettings, currency: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all shadow-sm appearance-none"
                        >
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                          <option value="INR">INR (₹)</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Dashboard Theme</label>
                      <div className="flex bg-gray-100/80 p-1 rounded-xl w-full border border-gray-200/50 shadow-inner">
                        <button
                          type="button"
                          onClick={() => setAdminSettings({ ...adminSettings, theme: 'light' })}
                          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all ${adminSettings.theme === 'light' ? 'bg-white text-gray-900 shadow-sm border border-gray-200/50' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                          Light
                        </button>
                        <button
                          type="button"
                          onClick={() => setAdminSettings({ ...adminSettings, theme: 'dark' })}
                          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all ${adminSettings.theme === 'dark' ? 'bg-white text-gray-900 shadow-sm border border-gray-200/50' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                          Dark
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Site Controls / Locks */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:border-red-100 transition-colors">
                  <div className="px-6 py-5 border-b border-gray-50 flex items-center gap-4 bg-gray-50/50">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-600">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#1a1f2c]">Access Controls</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Restrict access to specific features.</p>
                    </div>
                  </div>
                  <div className="px-6 py-2">
                    <Toggle
                      label="Maintenance Mode"
                      description="Lock the entire public website. Users will see a maintenance message."
                      checked={adminSettings.maintenanceMode}
                      onChange={() => setAdminSettings({ ...adminSettings, maintenanceMode: !adminSettings.maintenanceMode })}
                    />
                    <Toggle
                      label="Disable Signups"
                      description="Lock the registration page to prevent new users."
                      checked={adminSettings.disableSignups}
                      onChange={() => setAdminSettings({ ...adminSettings, disableSignups: !adminSettings.disableSignups })}
                    />
                    <Toggle
                      label="Disable Chatbot"
                      description="Hide the chatbot widget globally across the site."
                      checked={adminSettings.disableChatbot}
                      onChange={() => setAdminSettings({ ...adminSettings, disableChatbot: !adminSettings.disableChatbot })}
                    />
                  </div>
                </div>

                {/* Maintenance Customization */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:border-amber-100 transition-colors">
                  <div className="px-6 py-5 border-b border-gray-50 flex items-center gap-4 bg-gray-50/50">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#1a1f2c]">Maintenance Message</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Customize the lockout screen message.</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <textarea
                      rows="4"
                      value={adminSettings.maintenanceMessage}
                      onChange={(e) => setAdminSettings({ ...adminSettings, maintenanceMessage: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all shadow-sm resize-none leading-relaxed"
                      placeholder="Enter the maintenance message..."
                    />
                  </div>
                </div>

                {/* Notifications */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:border-indigo-100 transition-colors">
                  <div className="px-6 py-5 border-b border-gray-50 flex items-center gap-4 bg-gray-50/50">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#1a1f2c]">Email Notifications</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Configure automated alert emails.</p>
                    </div>
                  </div>
                  <div className="px-6 py-2">
                    <Toggle
                      label="New User Alerts"
                      description="Receive an email when a new user signs up."
                      checked={adminSettings.emailNotifications}
                      onChange={() => setAdminSettings({ ...adminSettings, emailNotifications: !adminSettings.emailNotifications })}
                    />
                    <Toggle
                      label="Subscription Alerts"
                      description="Receive an email for new or upgraded subscriptions."
                      checked={adminSettings.newSubscriptionAlerts}
                      onChange={() => setAdminSettings({ ...adminSettings, newSubscriptionAlerts: !adminSettings.newSubscriptionAlerts })}
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
