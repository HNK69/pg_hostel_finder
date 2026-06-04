import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FiGrid, FiHome, FiStar, FiLogOut, FiMenu, FiX, FiBriefcase } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

export default function DashboardLayout() {
  const { user, logout, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { to: '/dashboard', label: 'Overview', icon: FiGrid, end: true },
    { to: '/dashboard/hostels', label: 'My Hostels', icon: FiHome },
    { to: '/dashboard/rooms', label: 'Rooms Manager', icon: FiBriefcase },
    { to: '/dashboard/reviews', label: 'Review Manager', icon: FiStar },
  ];

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Spinner size="lg" />
      </div>
    );
  }

  const activeLink = ({ isActive }) =>
    `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
      isActive
        ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-950 dark:hover:text-white'
    }`;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 transition-colors duration-300">
      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800/80">
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-primary-600 to-indigo-600 text-white font-black text-sm">
              H
            </div>
            <span className="font-display text-lg font-bold text-slate-900 dark:text-white">
              Hostel<span className="text-primary-600 dark:text-primary-400">Finder</span>
            </span>
          </Link>
          <button className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-100" onClick={() => setSidebarOpen(false)}>
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 font-bold uppercase font-display">
              {user?.name?.substring(0, 2) || 'OW'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user?.name || 'Owner'}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 truncate capitalize">{user?.role || 'Hostel Owner'}</p>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setSidebarOpen(false)} className={activeLink}>
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80">
          <Link
            to="/"
            className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-950 dark:hover:text-white transition duration-200"
          >
            <FiHome className="h-5 w-5" />
            <span>Back to Website</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition duration-200 text-left"
          >
            <FiLogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header Bar */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 backdrop-blur px-6 lg:px-8">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="mr-4 text-slate-500 hover:text-slate-700 focus:outline-none lg:hidden"
              aria-label="Open Sidebar"
            >
              <FiMenu className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              Dashboard Panel
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
            </div>
          </div>
        </header>

        {/* Router View Outlet */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
