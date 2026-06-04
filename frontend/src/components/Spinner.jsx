import React from 'react';
import { motion } from 'framer-motion';

export default function Spinner({ size = 'md', color = 'primary' }) {
  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const colorClasses = {
    primary: 'from-primary-600 to-blue-600',
    white: 'from-white to-white/60',
  };

  return (
    <div className="inline-flex items-center justify-center">
      <motion.div
        className={`${sizeClasses[size]} rounded-full border-4 border-transparent bg-gradient-to-r ${colorClasses[color]} bg-clip-border`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <div className={`${sizeClasses[size]} rounded-full bg-slate-50 dark:bg-slate-950`} />
      </motion.div>
    </div>
  );
}
