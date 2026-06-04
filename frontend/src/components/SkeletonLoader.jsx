import React from 'react';
import { motion } from 'framer-motion';

export default function SkeletonLoader({ type = 'card', count = 1 }) {
  const pulseVariants = {
    animate: {
      opacity: [0.5, 0.8, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <motion.div variants={pulseVariants} animate="animate" className="flex flex-col overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm">
            <div className="h-56 w-full bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700" />
            <div className="p-5 space-y-4">
              <div className="space-y-2">
                <div className="h-3 w-1/4 rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="h-6 w-3/4 rounded-lg bg-slate-200 dark:bg-slate-800" />
              </div>
              <div className="h-4 w-full rounded-lg bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 w-5/6 rounded-lg bg-slate-200 dark:bg-slate-800" />
              <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="h-5 w-1/3 rounded-lg bg-slate-200 dark:bg-slate-800" />
                <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
          </motion.div>
        );
      case 'list':
        return (
          <motion.div variants={pulseVariants} animate="animate" className="flex items-center space-x-4 p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 rounded-xl">
            <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-4 w-1/3 rounded-lg bg-slate-200 dark:bg-slate-800" />
              <div className="h-3 w-1/2 rounded-lg bg-slate-200 dark:bg-slate-800" />
              <div className="h-3 w-2/5 rounded-lg bg-slate-200 dark:bg-slate-800" />
            </div>
          </motion.div>
        );
      case 'detail':
        return (
          <motion.div variants={pulseVariants} animate="animate" className="space-y-6">
            <div className="h-96 w-full rounded-2xl bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="space-y-3">
                  <div className="h-8 w-1/3 rounded-lg bg-slate-200 dark:bg-slate-800" />
                  <div className="h-4 w-full rounded-lg bg-slate-200 dark:bg-slate-800" />
                  <div className="h-4 w-5/6 rounded-lg bg-slate-200 dark:bg-slate-800" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-32 w-full rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700" />
              </div>
            </div>
          </motion.div>
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
