import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSliders, FiX, FiList, FiTrendingUp } from 'react-icons/fi';
import axiosInstance from '../api/axiosInstance';
import HostelCard from '../components/HostelCard';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';

export default function HostelList() {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Filter States
  const [cityFilter, setCityFilter] = useState('');
  const [areaFilter, setAreaFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const fetchHostels = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await axiosInstance.get('/hostels');
      setHostels(res.data);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostels();
  }, []);

  const handleClearFilters = () => {
    setCityFilter('');
    setAreaFilter('');
    setSortBy('newest');
  };

  // Filter & Sort Logic
  const filteredHostels = hostels
    .filter((h) => {
      const matchesCity = !cityFilter || h.city?.toLowerCase().includes(cityFilter.toLowerCase());
      const matchesArea = !areaFilter || h.area?.toLowerCase().includes(areaFilter.toLowerCase());
      return matchesCity && matchesArea;
    })
    .sort((a, b) => {
      if (sortBy === 'name-asc') {
        return a.hostel_name.localeCompare(b.hostel_name);
      }
      if (sortBy === 'name-desc') {
        return b.hostel_name.localeCompare(a.hostel_name);
      }
      if (sortBy === 'newest') {
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      }
      return 0;
    });

  const activeFiltersCount = [cityFilter, areaFilter].filter(Boolean).length;

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-primary-100 to-blue-100 dark:from-primary-950 dark:to-blue-950 rounded-lg">
            <FiList className="text-primary-600 dark:text-primary-400 text-xl" />
          </div>
          <h1 className="text-4xl font-black tracking-tight font-display text-slate-900 dark:text-white">
            Browse Accommodations
          </h1>
        </div>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Explore all student hostels and premium PGs in our extensive collection
        </p>
      </motion.div>

      {/* Mobile Filter Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setMobileFiltersOpen(true)}
        className="sm:hidden w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-bold rounded-lg shadow-lg transition-all"
      >
        <FiSliders size={18} />
        <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
      </motion.button>

      <div className="flex flex-col sm:flex-row gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <motion.aside 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden sm:block w-72 shrink-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900/60 dark:to-slate-900/40 border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 space-y-6 shadow-md sticky top-24"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold font-display text-slate-900 dark:text-white flex items-center gap-2 text-lg">
              <FiSliders className="text-primary-500" size={20} /> Filters
            </h3>
            {activeFiltersCount > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleClearFilters}
                className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 bg-primary-50 dark:bg-primary-950/30 px-3 py-1 rounded-lg transition-colors"
              >
                Reset
              </motion.button>
            )}
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">City</label>
              <input
                type="text"
                placeholder="Search city..."
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Area / Locality</label>
              <input
                type="text"
                placeholder="Search area..."
                value={areaFilter}
                onChange={(e) => setAreaFilter(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                <option value="newest">Newest Listed</option>
                <option value="name-asc">Alphabetical (A-Z)</option>
                <option value="name-desc">Alphabetical (Z-A)</option>
              </select>
            </div>
          </div>
        </motion.aside>

        {/* Hostel Grid Container */}
        <div className="flex-1 w-full">
          {/* Results Header */}
          {!loading && !error && filteredHostels.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center space-x-2">
                <FiTrendingUp className="text-primary-500" size={20} />
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {filteredHostels.length} {filteredHostels.length === 1 ? 'property' : 'properties'} available
                </span>
              </div>
            </motion.div>
          )}

          {error ? (
            <ErrorState onRetry={fetchHostels} />
          ) : loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <SkeletonLoader type="card" count={6} />
            </div>
          ) : filteredHostels.length === 0 ? (
            <EmptyState
              title="No Accommodations Found"
              description="We couldn't find any listings matching your search parameters. Try adjusting your filters or searching for a different location."
              actionText="Reset Filters"
              onAction={handleClearFilters}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredHostels.map((hostel, idx) => (
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

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex sm:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30 }}
              className="relative ml-auto flex h-full w-full max-w-xs flex-col bg-gradient-to-br from-white to-slate-50 dark:from-slate-900/95 dark:to-slate-900/85 p-6 shadow-2xl overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-xl font-display text-slate-900 dark:text-white">Filters</h3>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Close filters"
                >
                  <FiX size={20} />
                </motion.button>
              </div>

              <div className="space-y-6 flex-1">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">City</label>
                  <input
                    type="text"
                    placeholder="Search city..."
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Area</label>
                  <input
                    type="text"
                    placeholder="Search area..."
                    value={areaFilter}
                    onChange={(e) => setAreaFilter(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  >
                    <option value="newest">Newest Listed</option>
                    <option value="name-asc">Alphabetical (A-Z)</option>
                    <option value="name-desc">Alphabetical (Z-A)</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 grid grid-cols-2 gap-2 mt-auto border-t border-slate-200 dark:border-slate-800">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    handleClearFilters();
                    setMobileFiltersOpen(false);
                  }}
                  className="px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Reset
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setMobileFiltersOpen(false)}
                  className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-primary-600 to-blue-600 font-semibold text-white text-sm hover:from-primary-700 hover:to-blue-700 transition-all"
                >
                  Apply
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
