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

  const stats = [
    { icon: FiShield, label: '100% Verified', value: 'Listings' },
    { icon: FiUsers, label: '5,000+', value: 'Happy Renters' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="space-y-24 pb-16">
      {/* Premium Hero Section */}
      <section 
        className="relative -mx-6 sm:-mx-12 lg:mx-0 lg:rounded-3xl overflow-hidden bg-cover bg-center text-white py-32 px-6 sm:px-12 shadow-2xl"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=2000&q=80')" }}
      >
        {/* Multi-layer overlay for premium effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/70 to-slate-950/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-950/5 to-transparent" />
        
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-10">
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-4"
          >
            <h1 className="text-5xl sm:text-7xl font-black tracking-tighter leading-tight font-display text-white">
              Find Your Perfect
              <br />
              <span className="bg-gradient-to-r from-primary-400 via-primary-300 to-blue-300 bg-clip-text text-transparent">
                Student Home
              </span>
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg sm:text-xl text-slate-200 max-w-3xl mx-auto font-medium leading-relaxed"
          >
            Discover verified accommodations in prime locations. Compare rooms, check real reviews, and secure your stay with transparent pricing.
          </motion.p>

          {/* Search Form Card - Enhanced */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            onSubmit={handleSearchSubmit}
            className="mt-10 bg-white/95 dark:bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-slate-800 border border-white/30 dark:border-slate-800/60"
          >
            <div className="text-left">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2 uppercase tracking-wider">City</label>
              <input
                type="text"
                placeholder="Bangalore, Mumbai..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200"
              />
            </div>
            
            <div className="text-left">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2 uppercase tracking-wider">Area / Locality</label>
              <input
                type="text"
                placeholder="Koramangala, Indiranagar..."
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200"
              />
            </div>

            <div className="text-left">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2 uppercase tracking-wider">Room Type</label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200"
              >
                <option value="">All Types</option>
                <option value="single">Single Room</option>
                <option value="double">Double Sharing</option>
                <option value="triple">Triple Sharing</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-bold py-3.5 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                <FiSearch size={20} />
                <span>Explore Now</span>
              </button>
            </div>
          </motion.form>

          {/* Trust Badges - Enhanced */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap justify-center gap-8 sm:gap-12 pt-10 text-sm"
          >
            {stats.map((stat, idx) => (
              <motion.div key={idx} variants={itemVariants} className="flex items-center space-x-3">
                <div className="p-2.5 bg-primary-500/20 rounded-lg">
                  <stat.icon className="text-primary-300" size={22} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-100">{stat.label}</p>
                  <p className="text-xs text-slate-300">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Hostels Section - Enhanced */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight font-display text-slate-900 dark:text-white">
              Featured Accommodations
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400 mt-2">Handpicked premium properties trusted by students</p>
          </div>
          <Link
            to="/hostels"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 w-fit"
          >
            <span>View All Hostels</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {error ? (
          <ErrorState onRetry={() => window.location.reload()} />
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonLoader type="card" count={3} />
          </div>
        ) : featured.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-slate-500 dark:text-slate-400 font-medium">No properties available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((hostel, idx) => (
              <motion.div
                key={hostel.hostel_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
              >
                <HostelCard hostel={hostel} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Popular Cities Section - Enhanced */}
      <section className="space-y-8">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight font-display text-slate-900 dark:text-white">
            Explore Popular Cities
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 mt-2">Discover accommodations in India's top student hubs</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
          {cities.map((c, idx) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.5 }}
            >
              <Link
                to={`/search?city=${c.name}`}
                className="group relative h-44 sm:h-48 overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 block"
              >
                <img
                  src={c.img}
                  alt={c.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-125"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/10 group-hover:from-slate-950/95 group-hover:via-slate-950/50 transition-all duration-300" />
                <div className="absolute inset-0 flex flex-col justify-end p-5 z-10">
                  <h3 className="font-bold text-xl sm:text-2xl font-display text-white group-hover:text-primary-300 transition-colors">{c.name}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 group-hover:text-slate-100 transition-colors">{c.hostelsCount} premium properties</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section - New */}
      <section className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-slate-900/40 dark:to-slate-900/60 rounded-3xl p-10 sm:p-16 border border-primary-100 dark:border-slate-800">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight font-display text-slate-900 dark:text-white">
            Why Choose HostelFinder?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            We're committed to helping students find their perfect home away from home
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: FiShield, title: 'Verified Listings', desc: 'All properties verified for authenticity and quality standards' },
            { icon: FiUsers, title: 'Real Reviews', desc: 'Genuine reviews from actual renters and students' },
            { icon: FiSearch, title: 'Easy Search', desc: 'Smart filters to find exactly what you\'re looking for' },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="text-center p-6"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-primary-600 to-blue-600 rounded-xl mb-4 transform group-hover:scale-110 transition-transform">
                <item.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
