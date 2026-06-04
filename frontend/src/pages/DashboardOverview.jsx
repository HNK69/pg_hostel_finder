import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import Spinner from '../components/Spinner';
import ErrorState from '../components/ErrorState';
import { FiHome, FiLayers, FiUsers, FiStar } from 'react-icons/fi';

export default function DashboardOverview() {
  const { user } = useAuth();
  const [hostels, setHostels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(false);
    try {
      // Get all hostels
      const hostelsRes = await axiosInstance.get('/hostels');
      // Filter owner's hostels
      const ownerHostels = hostelsRes.data.filter((h) => h.owner_id === user?.user_id);
      setHostels(ownerHostels);

      // Fetch rooms and reviews for each owner hostel
      const roomsPromises = ownerHostels.map((h) => axiosInstance.get(`/hostels/${h.hostel_id}/rooms`));
      const reviewsPromises = ownerHostels.map((h) => axiosInstance.get(`/hostels/${h.hostel_id}/reviews`));

      const roomsResults = await Promise.all(roomsPromises);
      const reviewsResults = await Promise.all(reviewsPromises);

      // Flatten arrays
      const allRooms = roomsResults.flatMap((r) => r.data);
      const allReviews = reviewsResults.flatMap((r) => r.data);

      setRooms(allRooms);
      setReviews(allReviews);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorState onRetry={fetchDashboardData} title="Failed to load dashboard statistics" />;
  }

  // Stats calculations
  const totalBeds = rooms.reduce((sum, r) => sum + r.capacity, 0);
  const availableBeds = rooms.reduce((sum, r) => sum + r.available_beds, 0);
  const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 'N/A';

  const stats = [
    { title: 'My Hostels', value: hostels.length, icon: FiHome, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400' },
    { title: 'Total Rooms', value: rooms.length, icon: FiLayers, color: 'text-primary-600 bg-primary-50 dark:bg-primary-950/40 dark:text-primary-400' },
    { title: 'Capacity / Available', value: `${totalBeds} / ${availableBeds}`, icon: FiUsers, color: 'text-emerald-650 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400' },
    { title: 'Average Rating', value: avgRating, icon: FiStar, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white my-0">Dashboard Overview</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back, {user?.name}! Here is a summary of your properties.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm hover:shadow transition duration-200 flex items-center space-x-4"
          >
            <div className={`p-4 rounded-xl shrink-0 ${stat.color}`}>
              <stat.icon size={22} />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">{stat.title}</p>
              <h2 className="text-2xl font-black font-display text-slate-900 dark:text-white mt-1 leading-none">{stat.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Summary Table of properties */}
      <div className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
        <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-6">Property Summary</h3>
        {hostels.length === 0 ? (
          <div className="text-center py-8 text-slate-400">No properties registered. Go to "My Hostels" to list your first PG/Hostel.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800/80 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  <th className="pb-3 pr-4">Hostel Name</th>
                  <th className="pb-3 px-4">Location</th>
                  <th className="pb-3 px-4">Contact Phone</th>
                  <th className="pb-3 pl-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
                {hostels.map((h) => (
                  <tr key={h.hostel_id} className="text-slate-700 dark:text-slate-350 hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-4 pr-4 font-semibold text-slate-900 dark:text-white">{h.hostel_name}</td>
                    <td className="py-4 px-4">{h.area}, {h.city}</td>
                    <td className="py-4 px-4">{h.contact_phone || 'N/A'}</td>
                    <td className="py-4 pl-4 text-primary-600">
                      <a href={`/hostels/${h.hostel_id}`} className="hover:underline font-bold">
                        View Public Details
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
