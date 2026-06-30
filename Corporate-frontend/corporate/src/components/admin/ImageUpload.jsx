import React, { useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { UploadCloud, X, Loader2, Image as ImageIcon } from 'lucide-react';

export default function ImageUpload({ value, onChange, label = "Image Upload" }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const getToken = () => localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');

  const handleUpload = async (file) => {
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (JPEG, PNG, etc).');
      return;
    }

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit.');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post('http://localhost:5000/api/admin/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${getToken()}`
        }
      });
      
      if (res.data.status === 'success') {
        onChange(res.data.url);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      toast.error(err.response?.data?.message || 'Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const onFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files[0]);
    }
  };

  const clearImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      
      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50 h-32 flex items-center justify-center">
          <img src={value} alt="Uploaded preview" className="h-full object-contain" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={clearImage}
              className="bg-white text-red-500 rounded-full p-2 shadow-lg transform scale-90 group-hover:scale-100 transition-transform hover:bg-red-50"
              title="Remove image"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`relative h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors
            ${isDragging ? 'border-[#4f46e5] bg-indigo-50/50' : 'border-gray-300 hover:border-[#4f46e5] hover:bg-gray-50/50'}
          `}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileSelect}
            accept="image/*"
            className="hidden"
          />
          
          {uploading ? (
            <div className="flex flex-col items-center text-[#4f46e5]">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <span className="text-sm font-medium">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-gray-500">
              <UploadCloud className={`w-8 h-8 mb-2 ${isDragging ? 'text-[#4f46e5]' : 'text-gray-400'}`} />
              <p className="text-sm font-medium">
                <span className="text-[#4f46e5]">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
