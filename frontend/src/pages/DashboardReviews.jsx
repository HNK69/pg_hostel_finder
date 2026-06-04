import React, { useEffect, useState } from 'react';
import { FiTrash2, FiStar, FiMessageSquare } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import Spinner from '../components/Spinner';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';

export default function DashboardReviews() {
  const { user } = useAuth();
  const [hostels, setHostels] = useState([]);
  const [selectedHostelId, setSelectedHostelId] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [error, setError] = useState(false);

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

  const fetchReviews = async (hostelId) => {
    if (!hostelId) return;
    setLoadingReviews(true);
    try {
      const res = await axiosInstance.get(`/hostels/${hostelId}/reviews`);
      setReviews(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load reviews');
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchHostels();
    }
  }, [user]);

  useEffect(() => {
    if (selectedHostelId) {
      fetchReviews(selectedHostelId);
    } else {
      setReviews([]);
    }
  }, [selectedHostelId]);

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await axiosInstance.delete(`/reviews/${reviewId}`);
      toast.success('Review deleted');
      setReviews(reviews.filter((r) => r.review_id !== reviewId));
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
        <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white my-0">Review Management</h2>
        <p className="text-sm text-slate-500">Monitor and manage reviews submitted by students</p>
      </div>

      {hostels.length === 0 ? (
        <EmptyState
          title="No Hostels Registered"
          description="Register a hostel property first before viewing customer feedback."
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
          </div>

          {/* Reviews List */}
          {loadingReviews ? (
            <div className="flex justify-center py-12"><Spinner /></div>
          ) : reviews.length === 0 ? (
            <EmptyState
              title="No Reviews Submitted"
              description="No feedback has been submitted for this property yet."
              icon={FiMessageSquare}
            />
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div
                  key={rev.review_id}
                  className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex items-start justify-between gap-4 animate-fade-in"
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate font-display">{rev.user_name || 'Anonymous Student'}</h4>
                      <span className="text-xs text-slate-400">
                        {rev.created_at ? new Date(rev.created_at).toLocaleDateString() : ''}
                      </span>
                    </div>

                    <div className="flex items-center space-x-0.5">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <FiStar
                          key={idx}
                          className={`w-4 h-4 ${
                            rev.rating > idx ? 'text-amber-500 fill-amber-500' : 'text-slate-250 dark:text-slate-800'
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed break-words pt-1">{rev.comment}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteReview(rev.review_id)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 shrink-0"
                    title="Delete Review"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
