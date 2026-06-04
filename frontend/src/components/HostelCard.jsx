import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiPhone, FiStar, FiHome, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import axiosInstance from '../api/axiosInstance';
import placeholder from '../assets/placeholder.jpg';

export default function HostelCard({ hostel }) {
  const [rooms, setRooms] = useState([]);
  const [images, setImages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchDetails = async () => {
      try {
        const [roomsRes, imagesRes, reviewsRes] = await Promise.all([
          axiosInstance.get(`/hostels/${hostel.hostel_id}/rooms`),
          axiosInstance.get(`/hostels/${hostel.hostel_id}/images`),
          axiosInstance.get(`/hostels/${hostel.hostel_id}/reviews`).catch(() => ({ data: [] })),
        ]);
        if (active) {
          setRooms(roomsRes.data);
          setImages(imagesRes.data);
          setReviews(reviewsRes.data);
        }
      } catch (err) {
        console.error('Error fetching card details', err);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchDetails();
    return () => {
      active = false;
    };
  }, [hostel.hostel_id]);

  // Compute metrics
  const startingRent = rooms.length > 0 ? Math.min(...rooms.map((r) => r.rent)) : null;
  const totalAvailableBeds = rooms.reduce((sum, r) => sum + (r.available_beds || 0), 0);
  const totalRooms = rooms.length;
  const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : null;
  const imageUrl = images.length > 0 ? images[0].image_url : null;
  
  // Get room types
  const roomTypes = [...new Set(rooms.map((r) => r.room_type))].slice(0, 2);

  return (
    <motion.div
      whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.15)' }}
      transition={{ duration: 0.3 }}
    >
      <Link
        to={`/hostels/${hostel.hostel_id}`}
        className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-900/50 backdrop-blur-sm transition-all duration-300 hover:border-primary-300 dark:hover:border-primary-700 h-full"
      >
        {/* Image Section */}
        <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900">
          {loading ? (
            <div className="h-full w-full bg-slate-300 dark:bg-slate-800 animate-pulse" />
          ) : imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt={hostel.hostel_name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-120"
                onError={(e) => {
                  e.target.src = placeholder;
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
            </>
          ) : (
            <img
              src={placeholder}
              alt="Placeholder"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-120"
            />
          )}

          {/* Availability Badge */}
          {!loading && (
            <div className="absolute top-4 right-4 z-20">
              {totalAvailableBeds > 0 ? (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-flex items-center space-x-1 rounded-full bg-emerald-500/95 backdrop-blur-sm px-3 py-1.5 text-xs font-bold text-white shadow-lg"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{totalAvailableBeds} available</span>
                </motion.span>
              ) : (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-flex items-center space-x-1 rounded-full bg-rose-500/95 backdrop-blur-sm px-3 py-1.5 text-xs font-bold text-white shadow-lg"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>Sold Out</span>
                </motion.span>
              )}
            </div>
          )}

          {/* Room Type Badges */}
          {!loading && roomTypes.length > 0 && (
            <div className="absolute bottom-4 left-4 z-20 flex flex-wrap gap-2">
              {roomTypes.map((rt, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center space-x-1 rounded-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-md"
                >
                  <FiHome size={14} />
                  <span className="capitalize">{rt}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex flex-col flex-1 p-5 space-y-4">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider flex items-center">
                <FiMapPin size={14} className="mr-1" />
                {hostel.area}
              </p>
              {avgRating && (
                <motion.div
                  className="flex items-center space-x-1 bg-amber-50 dark:bg-amber-900/30 px-2.5 py-1 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <FiStar size={14} className="text-amber-500 fill-amber-500" />
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-300">{avgRating}</span>
                  <span className="text-xs text-amber-600 dark:text-amber-400">({reviews.length})</span>
                </motion.div>
              )}
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 font-display leading-tight">
              {hostel.hostel_name}
            </h3>
          </div>

          {/* Description */}
          {hostel.description && (
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 flex-1">
              {hostel.description}
            </p>
          )}

          {/* Stats */}
          {!loading && (
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-400 py-3 border-t border-slate-100 dark:border-slate-800/60">
              <div className="flex items-center space-x-1">
                <FiHome size={16} className="text-primary-500" />
                <span>{totalRooms} rooms</span>
              </div>
              <div className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
              <span>{hostel.city}</span>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Starting from</p>
              <p className="text-xl font-black text-slate-900 dark:text-white">
                ₹{startingRent ? startingRent.toLocaleString() : 'N/A'}
                {startingRent && <span className="text-xs font-normal text-slate-500 dark:text-slate-400">/mo</span>}
              </p>
            </div>
            <motion.button
              whileHover={{ x: 4 }}
              className="p-2.5 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
              onClick={(e) => e.preventDefault()}
            >
              <FiArrowRight size={20} />
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
