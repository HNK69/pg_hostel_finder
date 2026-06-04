import React, { useEffect, useState } from 'react';
import { FiSliders, FiX } from 'react-icons/fi';
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

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight font-display my-0">Browse Accommodations</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Explore all student hostels and PGs in our system</p>
        </div>
        
        {/* Mobile Filter Button */}
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="sm:hidden flex items-center space-x-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm font-semibold"
        >
          <FiSliders />
          <span>Filters</span>
        </button>
      </div>

      <div className="flex gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden sm:block w-64 shrink-0 bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 space-y-6 sticky top-24 glass">
          <div className="flex items-center justify-between">
            <h3 className="font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
              <FiSliders className="text-primary-500" /> Filters
            </h3>
            <button
              onClick={handleClearFilters}
              className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline"
            >
              Reset All
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">City</label>
              <input
                type="text"
                placeholder="Search city..."
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Area</label>
              <input
                type="text"
                placeholder="Search area..."
                value={areaFilter}
                onChange={(e) => setAreaFilter(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="newest">Newest Listed</option>
                <option value="name-asc">Alphabetical (A-Z)</option>
                <option value="name-desc">Alphabetical (Z-A)</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Hostel Grid Container */}
        <div className="flex-1">
          {error ? (
            <ErrorState onRetry={fetchHostels} />
          ) : loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <SkeletonLoader type="card" count={6} />
            </div>
          ) : filteredHostels.length === 0 ? (
            <EmptyState
              title="No Accommodations Found"
              description="We couldn't find any listings matching your search parameters. Try adjusting your filters."
              actionText="Reset Filters"
              onAction={handleClearFilters}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHostels.map((hostel) => (
                <HostelCard key={hostel.hostel_id} hostel={hostel} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Filter Menu */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex sm:hidden">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
          
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col bg-white dark:bg-slate-900 p-6 shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg font-display text-slate-900 dark:text-white">Filters</h3>
              <button onClick={() => setMobileFiltersOpen(false)} className="p-1 rounded-lg text-slate-400" aria-label="Close filters">
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">City</label>
                <input
                  type="text"
                  placeholder="Search city..."
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Area</label>
                <input
                  type="text"
                  placeholder="Search area..."
                  value={areaFilter}
                  onChange={(e) => setAreaFilter(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none"
                >
                  <option value="newest">Newest Listed</option>
                  <option value="name-asc">Alphabetical (A-Z)</option>
                  <option value="name-desc">Alphabetical (Z-A)</option>
                </select>
              </div>

              <div className="pt-6 grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    handleClearFilters();
                    setMobileFiltersOpen(false);
                  }}
                  className="px-4 py-2.5 rounded-xl border font-semibold text-sm"
                >
                  Reset
                </button>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-primary-600 font-semibold text-white text-sm"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
