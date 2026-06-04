import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheck } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';

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
    formState: { errors, isValid },
    watch,
  } = useForm({ mode: 'onChange' });

  const passwordValue = watch('password');
  const emailValue = watch('email');

  const onSubmit = async (data) => {
    setApiLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Successfully signed in!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Sign in failed. Please try again.');
      console.error(err);
    } finally {
      setApiLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-gradient-to-br from-primary-400/20 to-blue-400/20 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-gradient-to-tr from-primary-400/20 to-blue-400/20 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-blue-600 rounded-2xl mb-4 shadow-lg">
            <FiLock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black font-display tracking-tight text-slate-900 dark:text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Sign in to manage your properties and listings</p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          variants={itemVariants}
          className="relative bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/60 rounded-2xl shadow-xl backdrop-blur-xl p-8 space-y-6"
        >
          {/* Decorative border glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/10 to-blue-500/10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 space-y-5">
            {/* Email Field */}
            <motion.div variants={itemVariants} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                {emailValue && !errors.email && (
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                    <FiCheck size={14} />
                    <span>Valid</span>
                  </span>
                )}
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-primary-500 transition-colors pointer-events-none">
                  <FiMail size={18} />
                </div>
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Please enter a valid email address' },
                  })}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/50 text-slate-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 group-hover:border-slate-300 dark:group-hover:border-slate-700"
                />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-rose-500 font-medium flex items-center space-x-1"
                >
                  <span>●</span>
                  <span>{errors.email.message}</span>
                </motion.p>
              )}
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                {passwordValue && !errors.password && (
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                    <FiCheck size={14} />
                    <span>Entered</span>
                  </span>
                )}
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-primary-500 transition-colors pointer-events-none">
                  <FiLock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password', { required: 'Password is required' })}
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/50 text-slate-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 group-hover:border-slate-300 dark:group-hover:border-slate-700"
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </motion.button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-rose-500 font-medium flex items-center space-x-1"
                >
                  <span>●</span>
                  <span>{errors.password.message}</span>
                </motion.p>
              )}
            </motion.div>

            {/* Sign In Button */}
            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={apiLoading || !isValid}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 mt-8"
            >
              {apiLoading ? (
                <>
                  <Spinner size="sm" color="white" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <FiArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center space-x-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">New to platform?</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />
          </div>

          {/* Sign Up Link */}
          <motion.div variants={itemVariants} className="text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors underline decoration-2 decoration-primary-200 dark:decoration-primary-900 underline-offset-2"
              >
                Create one now
              </Link>
            </p>
          </motion.div>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          variants={itemVariants}
          className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6"
        >
          Sign in as a property owner to manage your listings
        </motion.p>
      </motion.div>
    </div>
  );
}
