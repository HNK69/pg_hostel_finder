import React from 'react';

export default function SkeletonLoader({ type = 'card', count = 1 }) {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800/80 dark:bg-slate-900 animate-pulse">
            <div className="h-48 w-full bg-slate-200 dark:bg-slate-800" />
            <div className="p-5 space-y-3">
              <div className="h-6 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-5 w-1/4 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
          </div>
        );
      case 'list':
        return (
          <div className="flex items-center space-x-4 p-4 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl animate-pulse">
            <div className="h-16 w-16 rounded-lg bg-slate-200 dark:bg-slate-800 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        );
      case 'detail':
        return (
          <div className="space-y-6 animate-pulse">
            <div className="h-[400px] w-full rounded-2xl bg-slate-200 dark:bg-slate-800" />
            <div className="space-y-3">
              <div className="h-8 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <React.Fragment key={idx}>{renderSkeleton()}</React.Fragment>
      ))}
    </>
  );
}
