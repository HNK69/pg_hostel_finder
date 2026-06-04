import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiPlus, FiEdit, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import Spinner from '../components/Spinner';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';

export default function DashboardRooms() {
  const { user } = useAuth();
  const [hostels, setHostels] = useState([]);
  const [selectedHostelId, setSelectedHostelId] = useState('');
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [error, setError] = useState(false);

  // Form overlay state
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('create'); // 'create' | 'edit'
  const [selectedRoom, setSelectedRoom] = useState(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  // Fetch only hostels belonging to the current owner
  const fetchHostels = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await axiosInstance.get('/hostels');
      const ownerHostels = res.data.filter((h) => h.owner_id === user?.user_id);
      setHostels(ownerHostels);
      if (ownerHostels.length > 0) {
        setSelectedHostelId(ownerHostels[0].hostel_id.toString());
      }
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Fetch rooms for selected hostel
  const fetchRooms = async (hostelId) => {
    if (!hostelId) return;
    setLoadingRooms(true);
    try {
      const res = await axiosInstance.get(`/hostels/${hostelId}/rooms`);
      setRooms(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load rooms');
    } finally {
      setLoadingRooms(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchHostels();
    }
  }, [user]);

  useEffect(() => {
    if (selectedHostelId) {
      fetchRooms(selectedHostelId);
    } else {
      setRooms([]);
    }
  }, [selectedHostelId]);

  const handleOpenCreate = () => {
    reset({
      room_type: 'single',
      rent: '',
      capacity: 1,
      available_beds: 1,
    });
    setFormMode('create');
    setFormOpen(true);
  };

  const handleOpenEdit = (room) => {
    setSelectedRoom(room);
    setValue('room_type', room.room_type);
    setValue('rent', room.rent);
    setValue('capacity', room.capacity);
    setValue('available_beds', room.available_beds);
    setFormMode('edit');
    setFormOpen(true);
  };

  const handleFormSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        rent: parseFloat(data.rent),
        capacity: parseInt(data.capacity),
        available_beds: parseInt(data.available_beds),
        hostel_id: parseInt(selectedHostelId),
      };

      if (formMode === 'create') {
        await axiosInstance.post('/rooms/', payload);
        toast.success('Room configuration created successfully!');
      } else {
        await axiosInstance.put(`/rooms/${selectedRoom.room_id}`, payload);
        toast.success('Room configuration updated successfully!');
      }
      setFormOpen(false);
      fetchRooms(selectedHostelId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room configuration?')) return;
    try {
      await axiosInstance.delete(`/rooms/${roomId}`);
      toast.success('Room deleted successfully');
      setRooms(rooms.filter((r) => r.room_id !== roomId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center animate-fade-in">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorState onRetry={fetchHostels} title="Failed to load hostels list" />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white my-0">Room Configurations</h2>
        <p className="text-sm text-slate-500">Configure sharing options, pricing, and availability for rooms</p>
      </div>

      {hostels.length === 0 ? (
        <EmptyState
          title="No Hostels Listed"
          description="List a PG or hostel property first before configuring room categories."
          actionText="List Hostel"
          onAction={() => window.location.href = '/dashboard/hostels'}
        />
      ) : (
        <div className="space-y-6">
          {/* Hostel Selector bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900/40 p-4 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm glass">
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <span className="text-sm font-semibold text-slate-500 shrink-0">Select Property:</span>
              <select
                value={selectedHostelId}
                onChange={(e) => setSelectedHostelId(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                {hostels.map((h) => (
                  <option key={h.hostel_id} value={h.hostel_id}>
                    {h.hostel_name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleOpenCreate}
              className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 px-5 rounded-xl text-sm transition duration-200"
            >
              <FiPlus />
              <span>Add Room Sharing</span>
            </button>
          </div>

          {/* Rooms List */}
          {loadingRooms ? (
            <div className="flex justify-center py-12"><Spinner /></div>
          ) : rooms.length === 0 ? (
            <EmptyState
              title="No Rooms Configured"
              description="Configure room capacities and rent pricing for this property by clicking Add Room Sharing."
              actionText="Add First Room"
              onAction={handleOpenCreate}
            />
          ) : (
            <div className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800/80 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="pb-3 pr-4">Room Type</th>
                      <th className="pb-3 px-4">Rent Pricing</th>
                      <th className="pb-3 px-4">Capacity</th>
                      <th className="pb-3 px-4">Beds Left</th>
                      <th className="pb-3 pl-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
                    {rooms.map((room) => (
                      <tr key={room.room_id} className="text-slate-700 dark:text-slate-350 hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="py-4 pr-4">
                          <span className="px-2.5 py-0.5 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400 text-xs font-semibold uppercase tracking-wide">
                            {room.room_type} sharing
                          </span>
                        </td>
                        <td className="py-4 px-4 font-semibold text-slate-900 dark:text-white">₹{room.rent.toLocaleString()}/mo</td>
                        <td className="py-4 px-4">{room.capacity} beds</td>
                        <td className="py-4 px-4">
                          {room.available_beds > 0 ? (
                            <span className="text-emerald-500 font-semibold">{room.available_beds} beds left</span>
                          ) : (
                            <span className="text-rose-500 font-semibold">Full</span>
                          )}
                        </td>
                        <td className="py-4 pl-4 text-right space-x-1.5">
                          <button
                            onClick={() => handleOpenEdit(room)}
                            className="p-1.5 text-slate-500 hover:text-primary-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                            title="Edit Room"
                          >
                            <FiEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteRoom(room.room_id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                            title="Delete Room"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ADD/EDIT ROOM MODAL OVERLAY */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setFormOpen(false)} />
          
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl glass space-y-4"
          >
            <div className="flex items-center justify-between border-b pb-4 dark:border-slate-800">
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                {formMode === 'create' ? 'Add Room Configuration' : 'Edit Room Configuration'}
              </h3>
              <button type="button" onClick={() => setFormOpen(false)} className="p-1 rounded-lg text-slate-400" aria-label="Close form">
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-1.5">Sharing Type</label>
                <select
                  {...register('room_type', { required: 'Sharing type is required' })}
                  className="w-full bg-slate-55 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                >
                  <option value="single">Single Sharing</option>
                  <option value="double">Double Sharing</option>
                  <option value="triple">Triple Sharing</option>
                </select>
                {errors.room_type && <p className="text-xs text-rose-500 mt-1">{errors.room_type.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-1.5">Monthly Rent (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 7500"
                  {...register('rent', { required: 'Rent pricing is required', min: { value: 1, message: 'Must be greater than 0' } })}
                  className="w-full bg-slate-55 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                />
                {errors.rent && <p className="text-xs text-rose-500 mt-1">{errors.rent.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-1.5">Bed Capacity</label>
                  <input
                    type="number"
                    placeholder="e.g. 2"
                    {...register('capacity', { required: 'Capacity is required', min: { value: 1, message: 'Must be at least 1' } })}
                    className="w-full bg-slate-55 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                  />
                  {errors.capacity && <p className="text-xs text-rose-500 mt-1">{errors.capacity.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-1.5">Available Beds</label>
                  <input
                    type="number"
                    placeholder="e.g. 2"
                    {...register('available_beds', { required: 'Available beds is required', min: { value: 0, message: 'Cannot be negative' } })}
                    className="w-full bg-slate-55 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                  />
                  {errors.available_beds && <p className="text-xs text-rose-500 mt-1">{errors.available_beds.message}</p>}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition duration-200 shadow-md mt-6"
            >
              <FiCheck />
              <span>{formMode === 'create' ? 'Add Sharing' : 'Save Changes'}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
