import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
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
    `flex items-center space-x-2 text-sm font-semibold transition-colors py-2 px-3 rounded-lg ${
      isActive
        ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400'
        : 'text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/30'
    }`;

  const navLinks = [
    { to: '/', label: 'Home', icon: FiHome },
    { to: '/hostels', label: 'Hostels', icon: FiList },
    { to: '/search', label: 'Search', icon: FiSearch },
  ];

  return (
    <nav className="sticky top-0 z-50 glass border-b transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-600 text-white font-black text-lg shadow-md shadow-primary-500/20">
              H
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Hostel<span className="text-primary-600 dark:text-primary-400">Finder</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={activeStyle}>
                <link.icon className="h-4 w-4" />
                <span>{link.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Right Side Options (Dark mode, Auth actions) */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition duration-200"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl transition duration-200"
                >
                  <FiGrid className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-sm font-semibold text-rose-600 hover:text-white hover:bg-rose-600 px-4 py-2 border border-rose-200 dark:border-rose-900/50 rounded-xl transition duration-200"
                >
                  <FiLogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-primary-600 px-4 py-2 rounded-xl transition duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-xl shadow-sm hover:shadow transition duration-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white dark:bg-slate-900/90 backdrop-blur-lg px-4 pt-2 pb-4 space-y-2 shadow-lg">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
            >
              <link.icon className="h-5 w-5 text-slate-400" />
              <span>{link.label}</span>
            </NavLink>
          ))}
          <hr className="border-slate-100 dark:border-slate-800/80 my-2" />
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
              >
                <FiGrid className="h-5 w-5 text-slate-400" />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 font-semibold text-left"
              >
                <FiLogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center px-4 py-2.5 rounded-xl text-slate-700 dark:text-slate-200 border dark:border-slate-800 font-semibold"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center px-4 py-2.5 rounded-xl text-white bg-primary-600 font-semibold"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
