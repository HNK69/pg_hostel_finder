import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiPhone } from 'react-icons/fi';
import axiosInstance from '../api/axiosInstance';
import placeholder from '../assets/placeholder.jpg';

export default function HostelCard({ hostel }) {
  const [rooms, setRooms] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchDetails = async () => {
      try {
        const [roomsRes, imagesRes] = await Promise.all([
          axiosInstance.get(`/hostels/${hostel.hostel_id}/rooms`),
          axiosInstance.get(`/hostels/${hostel.hostel_id}/images`),
        ]);
        if (active) {
          setRooms(roomsRes.data);
          setImages(imagesRes.data);
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

  // Compute starting rent and total available beds
  const startingRent = rooms.length > 0 ? Math.min(...rooms.map((r) => r.rent)) : null;
  const totalAvailableBeds = rooms.reduce((sum, r) => sum + (r.available_beds || 0), 0);
  const imageUrl = images.length > 0 ? images[0].image_url : null;

  return (
    <Link
      to={`/hostels/${hostel.hostel_id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800/80 dark:bg-slate-900/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        {loading ? (
          <div className="h-full w-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={hostel.hostel_name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.src = placeholder;
            }}
          />
        ) : (
          <img
            src={placeholder}
            alt="Placeholder"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {!loading && (
          totalAvailableBeds > 0 ? (
            <span className="absolute top-3 right-3 rounded-full bg-emerald-500/90 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {totalAvailableBeds} {totalAvailableBeds === 1 ? 'bed' : 'beds'} left
            </span>
          ) : (
            <span className="absolute top-3 right-3 rounded-full bg-rose-500/90 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              Sold Out
            </span>
          )
        )}
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center text-xs text-primary-600 dark:text-primary-400 font-semibold mb-1.5 uppercase tracking-wide">
          <FiMapPin className="mr-1" />
          {hostel.area}, {hostel.city}
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1 font-display">
          {hostel.hostel_name}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 flex-1">
          {hostel.description || 'No description provided.'}
        </p>

        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-4 mt-4 text-slate-700 dark:text-slate-300">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Starting Rent</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white flex items-center">
              {startingRent ? `₹${startingRent.toLocaleString()}` : 'N/A'}
              {startingRent && <span className="text-xs font-normal text-slate-500 dark:text-slate-400">/mo</span>}
            </span>
          </div>
          {hostel.contact_phone && (
            <div className="flex items-center text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-primary-600">
              <FiPhone className="mr-1" />
              {hostel.contact_phone}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
