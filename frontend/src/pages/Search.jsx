import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSliders, FiX, FiFilter, FiSearch, FiTrendingUp } from 'react-icons/fi';
import useDebounce from '../hooks/useDebounce';
import axiosInstance from '../api/axiosInstance';
import HostelCard from '../components/HostelCard';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Search Fields
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [area, setArea] = useState(searchParams.get('area') || '');
  const [roomType, setRoomType] = useState(searchParams.get('room_type') || '');
  const [minRent, setMinRent] = useState(searchParams.get('min_rent') || '');
  const [maxRent, setMaxRent] = useState(searchParams.get('max_rent') || '');
  const [available, setAvailable] = useState(searchParams.get('available') === 'true');

  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Debounced search queries
  const debouncedCity = useDebounce(city, 400);
  const debouncedArea = useDebounce(area, 400);
  const debouncedMinRent = useDebounce(minRent, 400);
  const debouncedMaxRent = useDebounce(maxRent, 400);

  // Count active filters
  const activeFiltersCount = [city, area, roomType, minRent, maxRent, available].filter(Boolean).length;

  // Trigger search whenever input changes (debounced text or immediate selections)
  useEffect(() => {
    const performSearch = async () => {
      setLoading(true);
      setError(false);
      try {
        const queryParams = new URLSearchParams();
        if (debouncedCity) queryParams.append('city', debouncedCity);
        if (debouncedArea) queryParams.append('area', debouncedArea);
        if (roomType) queryParams.append('room_type', roomType);
        if (debouncedMinRent) queryParams.append('min_rent', debouncedMinRent);
        if (debouncedMaxRent) queryParams.append('max_rent', debouncedMaxRent);
        if (available) queryParams.append('available', 'true');

        // Sync URL search params
        setSearchParams(queryParams);

        const res = await axiosInstance.get(`/search/hostels?${queryParams.toString()}`);
        setHostels(res.data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [debouncedCity, debouncedArea, roomType, debouncedMinRent, debouncedMaxRent, available, setSearchParams]);

  const handleResetFilters = () => {
    setCity('');
    setArea('');
    setRoomType('');
    setMinRent('');
    setMaxRent('');
    setAvailable(false);
    setMobileFiltersOpen(false);
  };

  const filterChips = [
    city && { label: `📍 ${city}`, value: 'city' },
    area && { label: `🏘️ ${area}`, value: 'area' },
    roomType && { label: `🛏️ ${roomType}`, value: 'roomType' },
    (minRent || maxRent) && { label: `₹ ${minRent || '0'} - ${maxRent || '∞'}`, value: 'rent' },
    available && { label: '✓ Available Only', value: 'available' },
  ].filter(Boolean);

  const removeFilter = (filterValue) => {
    switch (filterValue) {
      case 'city': setCity(''); break;
      case 'area': setArea(''); break;
      case 'roomType': setRoomType(''); break;
      case 'rent': setMinRent(''); setMaxRent(''); break;
      case 'available': setAvailable(false); break;
      default: break;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-primary-100 to-blue-100 dark:from-primary-950 dark:to-blue-950 rounded-lg">
            <FiSearch className="text-primary-600 dark:text-primary-400 text-xl" />
          </div>
          <h1 className="text-4xl font-black tracking-tight font-display text-slate-900 dark:text-white">
            Find Your Home
          </h1>
        </div>
        <p className="text-lg text-slate-600 dark:text-slate-400">Search and discover perfect accommodations matching your needs</p>
      </motion.div>

      {/* Active Filters Chips */}
      {filterChips.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2 items-center"
        >
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Active filters:</span>
          {filterChips.map((chip, idx) => (
            <motion.button
              key={chip.value}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => removeFilter(chip.value)}
              className="inline-flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-primary-100 to-blue-100 dark:from-primary-950/50 dark:to-blue-950/50 text-primary-700 dark:text-primary-300 rounded-full text-xs font-semibold hover:from-primary-200 hover:to-blue-200 dark:hover:from-primary-900/70 dark:hover:to-blue-900/70 transition-all"
            >
              <span>{chip.label}</span>
              <FiX size={14} className="hover:scale-125 transition-transform" />
            </motion.button>
          ))}
          <button
            onClick={handleResetFilters}
            className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            Clear all
          </button>
        </motion.div>
      )}

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="lg:hidden flex items-center justify-center space-x-2 w-full px-4 py-3 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-bold rounded-lg shadow-lg transition-all"
        >
          <FiFilter size={18} />
          <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
        </button>

        {/* Sidebar Filters */}
        {(mobileFiltersOpen || window.innerWidth >= 1024) && (
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-80 shrink-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900/60 dark:to-slate-900/40 border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 space-y-6 shadow-md"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold font-display text-slate-900 dark:text-white flex items-center gap-2 text-lg">
                <FiSliders className="text-primary-500" size={20} /> Filters
              </h3>
              {activeFiltersCount > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 bg-primary-50 dark:bg-primary-950/30 px-3 py-1 rounded-lg transition-colors"
                >
                  Reset
                </motion.button>
              )}
            </div>

            <div className="space-y-5">
              {/* City */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">City</label>
                <input
                  type="text"
                  placeholder="e.g. Bangalore"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Area */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Area / Locality</label>
                <input
                  type="text"
                  placeholder="e.g. Koramangala"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Room Type */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Room Type</label>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                >
                  <option value="">Any Capacity</option>
                  <option value="single">Single Sharing</option>
                  <option value="double">Double Sharing</option>
                  <option value="triple">Triple Sharing</option>
                </select>
              </div>

              {/* Budget Range */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Monthly Rent (₹)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minRent}
                    onChange={(e) => setMinRent(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxRent}
                    onChange={(e) => setMaxRent(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Availability */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="available"
                      checked={available}
                      onChange={(e) => setAvailable(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${available ? 'bg-primary-600 border-primary-600' : 'border-slate-300 dark:border-slate-700 group-hover:border-primary-500'}`}>
                      {available && <span className="text-white font-bold text-xs">✓</span>}
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Only show available beds</span>
                </label>
              </div>
            </div>

            {mobileFiltersOpen && window.innerWidth < 1024 && (
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Close Filters
              </button>
            )}
          </motion.aside>
        )}

        {/* Results Container */}
        <div className="flex-1 w-full">
          {/* Results Header */}
          {!loading && !error && hostels.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center space-x-2">
                <FiTrendingUp className="text-primary-500" size={20} />
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {hostels.length} {hostels.length === 1 ? 'property' : 'properties'} found
                </span>
              </div>
            </motion.div>
          )}

          {error ? (
            <ErrorState onRetry={() => window.location.reload()} />
          ) : loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <SkeletonLoader type="card" count={6} />
            </div>
          ) : hostels.length === 0 ? (
            <EmptyState
              title="No Listings Found"
              description="Try adjusting your filters or searching for a different location to find perfect accommodations."
              actionText="Clear Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {hostels.map((hostel, idx) => (
                <motion.div
                  key={hostel.hostel_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <HostelCard hostel={hostel} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
