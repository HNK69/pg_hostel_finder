import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiHome, FiSearch, FiList, FiGrid, FiLogOut, FiMoon, FiSun } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const activeStyle = ({ isActive }) =>
    `flex items-center space-x-2 text-sm font-semibold transition-all duration-200 py-2 px-3.5 rounded-lg relative ${
      isActive
        ? 'text-primary-600 dark:text-primary-400'
        : 'text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400'
    }`;

  const navLinks = [
    { to: '/', label: 'Home', icon: FiHome },
    { to: '/hostels', label: 'Hostels', icon: FiList },
    { to: '/search', label: 'Search', icon: FiSearch },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.3 },
    }),
  };

  return (
    <motion.nav 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="sticky top-0 z-50 border-b border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md bg-white/80 dark:bg-slate-950/80 transition-all duration-300 shadow-sm"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.div
            variants={itemVariants}
            custom={0}
            initial="hidden"
            animate="visible"
          >
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 text-white font-black text-lg shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 group-hover:scale-105 transition-all duration-200">
                H
              </div>
              <div className="hidden sm:block">
                <span className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  Hostel<span className="text-primary-600 dark:text-primary-400">Finder</span>
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Find Your Home</p>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Nav */}
          <motion.div 
            className="hidden md:flex items-center space-x-1 lg:space-x-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {navLinks.map((link, i) => (
              <motion.div key={link.to} variants={itemVariants} custom={i + 1}>
                <NavLink to={link.to} className={activeStyle}>
                  <div className="relative">
                    <link.icon className="h-4 w-4" />
                  </div>
                  <span>{link.label}</span>
                </NavLink>
              </motion.div>
            ))}
          </motion.div>

          {/* Right Side Options (Dark mode, Auth actions) */}
          <motion.div 
            className="hidden md:flex items-center space-x-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.button
              whileHover={{ scale: 1.1, rotate: 20 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
            </motion.button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400 bg-slate-100/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 px-4 py-2 rounded-lg transition-all duration-200"
                  >
                    <FiGrid className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="inline-flex items-center space-x-2 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:text-white hover:bg-rose-600 dark:hover:bg-rose-600 px-4 py-2 border border-rose-200/50 dark:border-rose-900/30 rounded-lg transition-all duration-200"
                >
                  <FiLogOut className="h-4 w-4" />
                  <span>Logout</span>
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/login"
                    className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400 px-4 py-2 rounded-lg transition-all duration-200"
                  >
                    Sign In
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/register"
                    className="text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Register
                  </Link>
                </motion.div>
              </div>
            )}
          </motion.div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 20 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
            >
              {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
            >
              {mobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-b from-white/95 to-slate-50/95 dark:from-slate-950/95 dark:to-slate-900/95 backdrop-blur-lg px-4 pt-2 pb-4 space-y-2"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <NavLink
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-700 dark:text-slate-200 font-semibold transition-all ${
                      isActive
                        ? 'bg-primary-100/50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400'
                        : 'hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
                    }`
                  }
                >
                  <link.icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </NavLink>
              </motion.div>
            ))}
            <hr className="border-slate-200/50 dark:border-slate-800/50 my-3" />
            {isAuthenticated ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-2"
              >
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 font-semibold transition-all"
                >
                  <FiGrid className="h-5 w-5 text-slate-400" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 font-semibold text-left transition-all"
                >
                  <FiLogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-2 gap-2 pt-2"
              >
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2.5 rounded-lg text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-semibold hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2.5 rounded-lg text-white bg-gradient-to-r from-primary-600 to-blue-600 font-semibold hover:from-primary-700 hover:to-blue-700 transition-all"
                >
                  Register
                </Link>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
