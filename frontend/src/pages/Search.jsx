import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSliders } from 'react-icons/fi';
import useDebounce from '../hooks/useDebounce';
import axiosInstance from '../api/axiosInstance';
import HostelCard from '../components/HostelCard';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();

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
  }, [debouncedCity, debouncedArea, roomType, debouncedMinRent, debouncedMaxRent, available]);

  const handleResetFilters = () => {
    setCity('');
    setArea('');
    setRoomType('');
    setMinRent('');
    setMaxRent('');
    setAvailable(false);
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight font-display my-0">Search Hostel Listings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Search and filter properties in real-time matching your preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-80 shrink-0 bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 space-y-6 glass">
          <div className="flex items-center justify-between">
            <h3 className="font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
              <FiSliders className="text-primary-500" /> Search Options
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">City</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Bangalore"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Area</label>
              <input
                type="text"
                placeholder="e.g. Koramangala"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Room Sharing Type</label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 animate-none"
              >
                <option value="">Any Capacity</option>
                <option value="single">Single Sharing</option>
                <option value="double">Double Sharing</option>
                <option value="triple">Triple Sharing</option>
              </select>
            </div>

            {/* Budget Range */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Monthly Rent Range (₹)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minRent}
                  onChange={(e) => setMinRent(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxRent}
                  onChange={(e) => setMaxRent(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Bed availability checkbox */}
            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="available"
                checked={available}
                onChange={(e) => setAvailable(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 bg-slate-50 dark:bg-slate-950 dark:border-slate-800"
              />
              <label htmlFor="available" className="text-sm font-semibold text-slate-700 dark:text-slate-300 select-none">
                Only show available beds
              </label>
            </div>
          </div>
        </aside>

        {/* Results Container */}
        <div className="flex-1 w-full">
          {error ? (
            <ErrorState onRetry={() => window.location.reload()} />
          ) : loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <SkeletonLoader type="card" count={4} />
            </div>
          ) : hostels.length === 0 ? (
            <EmptyState
              title="No Listings Found"
              description="Try adjusting your filters, searching for a different city or clearing the filters to view all properties."
              actionText="Reset Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {hostels.map((hostel) => (
                <HostelCard key={hostel.hostel_id} hostel={hostel} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
