import React from 'react';

export default function Spinner({ size = 'md', color = 'primary' }) {
  const sizeClasses = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  const colorClasses = {
    primary: 'border-t-primary-600 border-slate-200 dark:border-slate-800',
    white: 'border-t-white border-white/20',
  };

  return (
    <div
      className={`animate-spin rounded-full border-solid ${sizeClasses[size]} ${colorClasses[color]}`}
      role="status"
    />
  );
}
