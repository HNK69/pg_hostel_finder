import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

export default function Login() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setApiLoading(true);
    try {
      await login(data.email, data.password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
    } finally {
      setApiLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-100 dark:border-slate-800/80 p-8 rounded-2xl shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Sign in to manage your PG & hostel listings
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <FiMail />
              </span>
              <input
                type="email"
                placeholder="you@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
                })}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition duration-200"
              />
            </div>
            {errors.email && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <FiLock />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password', { required: 'Password is required' })}
                className="w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-650"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={apiLoading}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition duration-200 mt-6"
          >
            {apiLoading ? <Spinner size="sm" color="white" /> : <span>Sign In</span>}
            {!apiLoading && <FiArrowRight />}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          Don't have an owner account?{' '}
          <Link to="/register" className="font-semibold text-primary-600 hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
}
