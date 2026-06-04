import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiPlus, FiEdit, FiTrash2, FiImage, FiX, FiCheck, FiChevronLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import Spinner from '../components/Spinner';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';

export default function DashboardHostels() {
  const { user } = useAuth();
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // UI Modes: 'list' | 'create' | 'edit'
  const [mode, setMode] = useState('list');
  const [selectedHostel, setSelectedHostel] = useState(null);

  // Image Management Modal State
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [hostelForImages, setHostelForImages] = useState(null);
  const [imagesList, setImagesList] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const fetchHostels = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await axiosInstance.get('/hostels');
      const ownerHostels = res.data.filter((h) => h.owner_id === user?.user_id);
      setHostels(ownerHostels);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchHostels();
    }
  }, [user]);

  // Open Form for Creation
  const handleOpenCreate = () => {
    reset();
    setMode('create');
  };

  // Open Form for Editing
  const handleOpenEdit = (hostel) => {
    setSelectedHostel(hostel);
    setValue('hostel_name', hostel.hostel_name);
    setValue('description', hostel.description || '');
    setValue('city', hostel.city || '');
    setValue('area', hostel.area || '');
    setValue('address', hostel.address || '');
    setValue('contact_phone', hostel.contact_phone || '');
    setMode('edit');
  };

  const handleFormSubmit = async (data) => {
    try {
      if (mode === 'create') {
        await axiosInstance.post('/hostels/', data);
        toast.success('Hostel listed successfully!');
      } else {
        await axiosInstance.put(`/hostels/${selectedHostel.hostel_id}`, data);
        toast.success('Hostel updated successfully!');
      }
      setMode('list');
      fetchHostels();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteHostel = async (hostelId) => {
    if (!window.confirm('Are you sure you want to delete this hostel? This deletes all associated rooms, images, and reviews.')) return;
    try {
      await axiosInstance.delete(`/hostels/${hostelId}`);
      toast.success('Hostel deleted successfully');
      setHostels(hostels.filter((h) => h.hostel_id !== hostelId));
    } catch (err) {
      console.error(err);
    }
  };

  // --- IMAGE MANAGEMENT ---
  const handleOpenImageManager = async (hostel) => {
    setHostelForImages(hostel);
    setImageModalOpen(true);
    setLoadingImages(true);
    setNewImageUrl('');
    try {
      const res = await axiosInstance.get(`/hostels/${hostel.hostel_id}/images`);
      setImagesList(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingImages(false);
    }
  };

  const handleAddImage = async (e) => {
    e.preventDefault();
    if (!newImageUrl) return;
    try {
      const res = await axiosInstance.post('/images/', {
        hostel_id: hostelForImages.hostel_id,
        image_url: newImageUrl,
      });
      toast.success('Image added');
      setImagesList([...imagesList, res.data.image]);
      setNewImageUrl('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await axiosInstance.delete(`/images/${imageId}`);
      toast.success('Image deleted');
      setImagesList(imagesList.filter((img) => img.image_id !== imageId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && mode === 'list') {
    return (
      <div className="flex h-[50vh] items-center justify-center animate-fade-in">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header bar */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white my-0">
            {mode === 'list' ? 'My Hostels' : mode === 'create' ? 'Add New Hostel' : 'Edit Hostel'}
          </h2>
          <p className="text-sm text-slate-500">
            {mode === 'list'
              ? 'List and manage properties'
              : mode === 'create'
              ? 'Fill in the information below'
              : `Update details for ${selectedHostel?.hostel_name}`}
          </p>
        </div>

        {mode === 'list' ? (
          <button
            onClick={handleOpenCreate}
            className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 px-5 rounded-xl text-sm transition duration-200"
          >
            <FiPlus />
            <span>List Hostel</span>
          </button>
        ) : (
          <button
            onClick={() => setMode('list')}
            className="flex items-center space-x-2 border hover:bg-slate-100 dark:hover:bg-slate-800 font-bold py-2.5 px-5 rounded-xl text-sm transition duration-200"
          >
            <FiChevronLeft />
            <span>Back</span>
          </button>
        )}
      </div>

      {error && mode === 'list' && <ErrorState onRetry={fetchHostels} />}

      {/* LIST VIEW */}
      {mode === 'list' && !error && (
        hostels.length === 0 ? (
          <EmptyState
            title="No Properties Registered"
            description="You haven't listed any PG or hostel accommodations. Click List Hostel to get started."
            actionText="List Your First Hostel"
            onAction={handleOpenCreate}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hostels.map((h) => (
              <div
                key={h.hostel_id}
                className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate font-display">{h.hostel_name}</h3>
                  <p className="text-xs text-slate-400 capitalize mt-1">{h.area}, {h.city}</p>
                  <p className="text-sm text-slate-500 mt-3 line-clamp-2">{h.description || 'No description.'}</p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-4 mt-6">
                  {/* Quick controls */}
                  <button
                    onClick={() => handleOpenImageManager(h)}
                    className="flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-primary-605"
                  >
                    <FiImage />
                    <span>Images</span>
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenEdit(h)}
                      className="p-2 text-slate-500 hover:text-primary-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
                      title="Edit Hostel"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteHostel(h.hostel_id)}
                      className="p-2 text-slate-500 hover:text-rose-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
                      title="Delete Hostel"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* CREATE & EDIT FORM VIEW */}
      {mode !== 'list' && (
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 p-8 rounded-3xl max-w-2xl shadow-md glass space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-1.5">Hostel/PG Name</label>
              <input
                type="text"
                placeholder="e.g. St. Johns Premium PG"
                {...register('hostel_name', { required: 'Name is required' })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
              {errors.hostel_name && <p className="text-xs text-rose-500 mt-1">{errors.hostel_name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-1.5">City</label>
              <input
                type="text"
                placeholder="e.g. Bangalore"
                {...register('city', { required: 'City is required' })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
              {errors.city && <p className="text-xs text-rose-500 mt-1">{errors.city.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-1.5">Area</label>
              <input
                type="text"
                placeholder="e.g. Koramangala"
                {...register('area', { required: 'Area is required' })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
              {errors.area && <p className="text-xs text-rose-500 mt-1">{errors.area.message}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Complete Address</label>
              <textarea
                rows={3}
                placeholder="Door No, Street Name, Landmark..."
                {...register('address', { required: 'Address is required' })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
              {errors.address && <p className="text-xs text-rose-500 mt-1">{errors.address.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-1.5">Contact Phone</label>
              <input
                type="text"
                placeholder="e.g. 9876543210"
                {...register('contact_phone', { required: 'Contact phone is required' })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
              {errors.contact_phone && <p className="text-xs text-rose-500 mt-1">{errors.contact_phone.message}</p>}
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-1.5">Description</label>
              <textarea
                rows={4}
                placeholder="Mention amenities (WiFi, Food, Laundry, Gym)..."
                {...register('description')}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-bold py-3.5 px-6 rounded-xl text-sm transition duration-200 shadow-md"
          >
            <FiCheck />
            <span>{mode === 'create' ? 'List Property' : 'Save Changes'}</span>
          </button>
        </form>
      )}

      {/* IMAGE MANAGEMENT MODAL */}
      {imageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setImageModalOpen(false)} />
          
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between border-b pb-4 mb-4 dark:border-slate-800">
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                Manage Images for {hostelForImages?.hostel_name}
              </h3>
              <button onClick={() => setImageModalOpen(false)} className="p-1 rounded-lg text-slate-405" aria-label="Close image manager">
                <FiX size={20} />
              </button>
            </div>

            {/* List images scroll section */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {loadingImages ? (
                <div className="flex justify-center py-8"><Spinner /></div>
              ) : imagesList.length === 0 ? (
                <p className="text-center text-sm text-slate-400 py-8">No images uploaded yet. Paste an image URL below to add one.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {imagesList.map((img) => (
                    <div key={img.image_id} className="relative group rounded-xl overflow-hidden aspect-video bg-slate-100 dark:bg-slate-800">
                      <img src={img.image_url} alt="hostel" className="h-full w-full object-cover" />
                      <button
                        onClick={() => handleDeleteImage(img.image_id)}
                        className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition duration-150"
                        title="Delete image"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Input URL form */}
            <form onSubmit={handleAddImage} className="border-t pt-4 mt-4 space-y-3 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-400 uppercase">New Image URL</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/hostel.jpg"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  required
                />
                <button
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-5 rounded-xl text-sm transition"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
