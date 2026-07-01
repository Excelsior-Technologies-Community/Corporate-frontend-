import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Settings, Activity, Folder, Plus, ArrowRight, Clock, Star, ArrowLeft, LogOut, Wrench } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { io } from 'socket.io-client';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [dashboardData, setDashboardData] = useState({ stats: { activeProjects: 0, activeConsultations: 0 }, projects: [], activities: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const info = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');
    if (info) {
      setUserInfo(JSON.parse(info));
    } else {
      navigate('/login');
    }

    // Fetch settings from API
    // Not needed anymore for Maintenance Mode (handled in App.jsx)
  }, [navigate]);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  const fetchDashboard = useCallback(async () => {
    const token = localStorage.getItem('userToken') || sessionStorage.getItem('userToken');
    if (!token) return;
    try {
      const res = await axios.get('http://localhost:5000/api/users/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setDashboardData(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to fetch dashboard data');
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    
    const token = localStorage.getItem('userToken') || sessionStorage.getItem('userToken');
    setIsCreatingProject(true);
    
    try {
      await axios.post('http://localhost:5000/api/users/projects', 
        { name: newProjectName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsProjectModalOpen(false);
      setNewProjectName('');
      toast.success('Project created successfully!');
      fetchDashboard(); // refresh data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project');
      console.error('Failed to create project:', err);
    } finally {
      setIsCreatingProject(false);
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



  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-12">
      {/* Dashboard Top Navigation */}
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link to="/" className="text-xl font-bold text-[#1a1f2c] flex items-baseline">
          Corporate
          <span className="w-1.5 h-1.5 rounded-full bg-[#f43f5e] ml-0.5"></span>
        </Link>
        <div className="flex items-center gap-4">
          <Link 
            to="/"
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#1a1f2c] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Website
          </Link>
          <div className="w-px h-6 bg-gray-200 mx-2"></div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </nav>

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] pt-16 pb-32 px-8 relative overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute top-1/2 -left-24 w-72 h-72 bg-rose-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Welcome back, {userInfo.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-400 mt-2 text-lg">
            Here's what's happening with your account today.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 -mt-16 relative z-20">
        {/* Main Stats/Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer group">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Active Projects</p>
              <p className="text-3xl font-bold text-[#1a1f2c]">{loading ? '...' : dashboardData.stats.activeProjects}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Folder className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer group">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Consultations</p>
              <p className="text-3xl font-bold text-[#1a1f2c]">{loading ? '...' : dashboardData.stats.activeConsultations}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6 text-emerald-600" />
            </div>
          </div>

          <div onClick={() => setIsProjectModalOpen(true)} className="bg-gradient-to-br from-[#4f46e5] to-[#7154c1] rounded-2xl p-6 shadow-lg text-white flex flex-col justify-center relative overflow-hidden group cursor-pointer">
            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 rounded-full bg-white opacity-10 group-hover:scale-150 transition-transform duration-500"></div>
            <h3 className="text-lg font-bold mb-1 relative z-10">Start a new project</h3>
            <p className="text-indigo-100 text-sm mb-3 relative z-10">Get in touch with our team</p>
            <div className="flex items-center gap-2 text-sm font-semibold relative z-10">
              Explore <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#1a1f2c]">Your Projects</h2>
                <button onClick={() => setIsProjectModalOpen(true)} className="text-indigo-600 text-sm font-medium hover:text-indigo-700 flex items-center gap-1">
                  <Plus className="w-4 h-4" /> New
                </button>
              </div>
              {loading ? (
                <div className="p-12 text-center text-gray-500">Loading...</div>
              ) : dashboardData.projects.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <Folder className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-900 font-medium mb-1">No active projects</p>
                  <p className="text-sm">When you start a project with us, it will appear here.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {dashboardData.projects.map((proj) => (
                    <div key={proj.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-[#1a1f2c]">{proj.name}</p>
                        <p className="text-sm text-gray-500 capitalize">Status: {proj.status}</p>
                      </div>
                      <span className="text-sm text-gray-400">{new Date(proj.created_at).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            {/* Profile Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#f46b45] to-[#f59e0b] flex items-center justify-center text-white font-bold text-xl shadow-md">
                  {userInfo.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-[#1a1f2c]">{userInfo.name}</h3>
                  <p className="text-sm text-gray-500 truncate w-40">{userInfo.email}</p>
                </div>
              </div>
              <Link 
                to="/settings"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-4 h-4" /> Edit Profile
              </Link>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-[#1a1f2c] mb-4">Recent Activity</h2>
              {loading ? (
                <p className="text-sm text-gray-500">Loading...</p>
              ) : dashboardData.activities.length === 0 ? (
                <p className="text-sm text-gray-500">No recent activity.</p>
              ) : (
                <div className="space-y-4">
                  {dashboardData.activities.map((activity) => {
                    const isSignup = activity.type === 'signup';
                    const isUpdate = activity.type === 'update';
                    const Icon = isSignup ? Star : isUpdate ? Settings : Activity;
                    const color = isSignup ? 'text-yellow-500' : isUpdate ? 'text-blue-500' : 'text-emerald-500';
                    const bg = isSignup ? 'bg-yellow-50' : isUpdate ? 'bg-blue-50' : 'bg-emerald-50';

                    return (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-4 h-4 ${color}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{new Date(activity.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Project Modal */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-[#1a1f2c]">Create New Project</h3>
              <button 
                onClick={() => setIsProjectModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleCreateProject} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                <input 
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="e.g. Website Redesign"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button 
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isCreatingProject || !newProjectName.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  {isCreatingProject ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper icon
const MailIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);

export default UserDashboard;
