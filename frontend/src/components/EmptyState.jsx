import React from 'react';
import { FiInbox } from 'react-icons/fi';

export default function EmptyState({
  title = 'No data found',
  description = 'There are no items matching your criteria at the moment.',
  icon: Icon = FiInbox,
  actionText,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
      <div className="p-4 rounded-full bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 mb-4">
        <Icon size={40} />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white font-display mb-1">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-medium text-sm rounded-xl transition duration-200 shadow-sm"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
