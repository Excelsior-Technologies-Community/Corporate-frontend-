import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, MessageSquare, Star } from 'lucide-react';
import ImageUpload from './ImageUpload';

const API = 'http://localhost:5000/api';

const emptyForm = { name: '', role: '', content: '', rating: '5.0', avatar_url: '', date: '', status: 'active' };

export default function ManageTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formLoading, setFormLoading] = useState(false);

  const getToken = () => localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      // Admins get all testimonials (active + inactive)
      const res = await axios.get(`${API}/admin/testimonials`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setTestimonials(res.data.data);
    } catch (err) {
      console.error('Failed to fetch testimonials', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin';
      }
    } finally {
      setLoading(false);
    }
  };

  const openCreateForm = () => {
    setEditingTestimonial(null);
    setFormData(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setEditingTestimonial(item);
    setFormData({
      name: item.name,
      role: item.role,
      content: item.content,
      rating: item.rating,
      avatar_url: item.avatar_url,
      date: item.date,
      status: item.status
    });
    setShowForm(true);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.role || !formData.content || !formData.avatar_url || !formData.date) {
      toast.error('All fields are required.');
      return;
    }
    setFormLoading(true);
    try {
      if (editingTestimonial) {
        await axios.put(`${API}/admin/testimonials/${editingTestimonial.id}`, formData, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        toast.success('Testimonial updated successfully!');
      } else {
        await axios.post(`${API}/admin/testimonials`, formData, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        toast.success('Testimonial created successfully!');
      }
      setShowForm(false);
      fetchTestimonials();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save testimonial.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = (id, name) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-gray-900">
          Delete testimonial from "{name}"? This cannot be undone.
        </p>
        <div className="flex justify-end gap-2 mt-1">
          <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1.5 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">Cancel</button>
          <button onClick={async () => {
            toast.dismiss(t.id);
            try {
              await axios.delete(`${API}/admin/testimonials/${id}`, {
                headers: { Authorization: `Bearer ${getToken()}` }
              });
              setTestimonials(prev => prev.filter(t => t.id !== id));
              toast.success('Testimonial deleted successfully!');
            } catch (err) {
              toast.error('Failed to delete testimonial.');
            }
          }} className="px-3 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">Delete</button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  if (loading) {
    return <div className="p-8 text-gray-500">Loading testimonials...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#1a1f2c]">Manage Testimonials</h2>
          <p className="text-sm text-gray-500">Add, edit, or remove customer reviews shown on the Testimonials page.</p>
        </div>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 bg-[#4f46e5] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#4338ca] transition-colors shadow-sm shadow-indigo-200"
        >
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      {showForm ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h3 className="font-bold text-[#1a1f2c] flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#4f46e5]" />
              {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
            </h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleFormSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Customer Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] transition-all outline-none"
                  placeholder="e.g. Alexander Johnson"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Role / Company</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] transition-all outline-none"
                  placeholder="e.g. Themezaa, Co founder"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Testimonial Content</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleFormChange}
                rows="3"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] transition-all outline-none"
                placeholder="Exceeded all my expectations. We strive to develop..."
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="lg:col-span-2">
                <ImageUpload 
                  label="Avatar Image"
                  value={formData.avatar_url}
                  onChange={(url) => setFormData({ ...formData, avatar_url: url })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Rating</label>
                <select
                  name="rating"
                  value={formData.rating}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] transition-all outline-none"
                >
                  <option value="5.0">5.0 Stars</option>
                  <option value="4.5">4.5 Stars</option>
                  <option value="4.0">4.0 Stars</option>
                  <option value="3.5">3.5 Stars</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date</label>
                <input
                  type="text"
                  name="date"
                  value={formData.date}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] transition-all outline-none"
                  placeholder="e.g. 26 Nov"
                />
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                className="w-full md:w-1/3 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] transition-all outline-none"
              >
                <option value="active">Active (Visible)</option>
                <option value="inactive">Inactive (Hidden)</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formLoading}
                className="bg-[#1a1f2c] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-black transition-colors disabled:opacity-50"
              >
                {formLoading ? 'Saving...' : editingTestimonial ? 'Save Changes' : 'Create Testimonial'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Content</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {testimonials.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      No testimonials found. Click "Add Testimonial" to create one.
                    </td>
                  </tr>
                ) : (
                  testimonials.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={item.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                          <div>
                            <p className="font-semibold text-[#1a1f2c] text-sm">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 line-clamp-2 max-w-xs">{item.content}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-[#f97316] fill-current" />
                          <span className="text-sm font-semibold text-[#1a1f2c]">{item.rating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${item.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {item.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditForm(item)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.name)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
