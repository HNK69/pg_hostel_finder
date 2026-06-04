import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiBriefcase, FiCalendar } from 'react-icons/fi';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-8 shadow-xl glass space-y-6">
        <div className="flex items-center space-x-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-600 text-white font-black text-2xl shadow font-display">
            {user?.name?.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white my-0">{user?.name}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">{user?.role} Account</p>
          </div>
        </div>

        <hr className="border-slate-100 dark:border-slate-800/80" />

        <div className="space-y-4 pt-2">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 text-slate-400 rounded-xl">
              <FiMail size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Email Address</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 text-slate-400 rounded-xl">
              <FiBriefcase size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">System Role</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5 capitalize">{user?.role}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 text-slate-400 rounded-xl">
              <FiCalendar size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Member Since</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
