import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

export default function ErrorState({
  title = 'An error occurred',
  description = 'There was a problem loading this section. Please try again.',
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-red-100 dark:border-red-950 bg-red-50/50 dark:bg-red-950/20 backdrop-blur-sm">
      <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500 mb-4">
        <FiAlertTriangle size={32} className="animate-pulse" />
      </div>
      <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 font-display mb-1">{title}</h3>
      <p className="text-sm text-red-600/80 dark:text-red-400/80 max-w-sm mb-6">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-medium text-sm rounded-xl transition duration-200 shadow-sm"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
