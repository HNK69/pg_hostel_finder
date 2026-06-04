import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiUsers, FiShield } from 'react-icons/fi';
import axiosInstance from '../api/axiosInstance';
import HostelCard from '../components/HostelCard';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorState from '../components/ErrorState';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Search form state
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [roomType, setRoomType] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const res = await axiosInstance.get('/hostels');
        // Take first 3 for featured hostels
        setFeatured(res.data.slice(0, 3));
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchHostels();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.append('city', city);
    if (area) params.append('area', area);
    if (roomType) params.append('room_type', roomType);
    navigate(`/search?${params.toString()}`);
  };

  const cities = [
    { name: 'Bangalore', hostelsCount: 15, img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=300&q=80' },
    { name: 'Mumbai', hostelsCount: 12, img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=300&q=80' },
    { name: 'Delhi', hostelsCount: 8, img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=300&q=80' },
    { name: 'Pune', hostelsCount: 9, img: 'https://images.unsplash.com/photo-1601962325915-d72b220e8b15?auto=format&fit=crop&w=300&q=80' },
  ];

  return (
    <div className="space-y-20 pb-12">
      {/* Hero Section */}
      <section 
        className="relative rounded-3xl overflow-hidden bg-cover bg-center text-white py-24 px-6 sm:px-12 shadow-xl"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1600&q=80')" }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px]" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <motion.h1
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight font-display text-white"
          >
            Find Verified <br />
            <span className="text-primary-400">Student Hostels & PGs</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto font-medium"
          >
            Explore verified accommodations near your college. Simple search, transparent rates, real reviews.
          </motion.p>

          {/* Search Form Card */}
          <motion.form
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            onSubmit={handleSearchSubmit}
            className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl shadow-2xl grid grid-cols-1 sm:grid-cols-4 gap-4 text-slate-800 border border-slate-100 dark:border-slate-800"
          >
            <div className="text-left">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">City</label>
              <input
                type="text"
                placeholder="e.g. Bangalore"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition duration-200"
              />
            </div>
            
            <div className="text-left">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Area</label>
              <input
                type="text"
                placeholder="e.g. Koramangala"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition duration-200"
              />
            </div>

            <div className="text-left">
              <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Room Type</label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition duration-200 appearance-none"
              >
                <option value="">Any Sharing</option>
                <option value="single">Single Sharing</option>
                <option value="double">Double Sharing</option>
                <option value="triple">Triple Sharing</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition duration-200"
              >
                <FiSearch size={18} />
                <span>Search</span>
              </button>
            </div>
          </motion.form>

          {/* Stats Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-6 sm:gap-12 pt-6 text-sm text-slate-300"
          >
            <div className="flex items-center space-x-2">
              <FiShield className="text-primary-400" size={20} />
              <span>100% Verified Listings</span>
            </div>
            <div className="flex items-center space-x-2">
              <FiUsers className="text-primary-400" size={20} />
              <span>5,000+ Happy Renters</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Hostels Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display">Featured Accommodations</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Handpicked premium properties matching top standards</p>
          </div>
          <Link
            to="/hostels"
            className="text-sm font-bold text-primary-600 dark:text-primary-400 hover:underline"
          >
            View All Hostels
          </Link>
        </div>

        {error ? (
          <ErrorState onRetry={() => window.location.reload()} />
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <SkeletonLoader type="card" count={3} />
          </div>
        ) : featured.length === 0 ? (
          <div className="py-8 text-center text-slate-550 dark:text-slate-400">No properties available at the moment.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {featured.map((hostel) => (
              <HostelCard key={hostel.hostel_id} hostel={hostel} />
            ))}
          </div>
        )}
      </section>

      {/* Popular Cities Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display">Explore Popular Cities</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Find rooms in India's leading student hubs</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {cities.map((c) => (
            <Link
              key={c.name}
              to={`/search?city=${c.name}`}
              className="group relative h-40 overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <img
                src={c.img}
                alt={c.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-4 left-4 z-10 text-white">
                <h3 className="font-bold text-lg font-display">{c.name}</h3>
                <p className="text-xs text-slate-350">{c.hostelsCount} properties</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
