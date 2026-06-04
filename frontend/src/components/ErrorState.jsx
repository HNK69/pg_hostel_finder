import React from 'react';
import { motion } from 'framer-motion';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

export default function ErrorState({
  title = 'An error occurred',
  description = 'There was a problem loading this section. Please try again.',
  onRetry,
}) {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const iconVariants = {
    animate: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center p-12 sm:p-16 text-center rounded-2xl border-2 border-rose-200 dark:border-rose-900 bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-950/40 dark:to-red-950/30 backdrop-blur-xl"
    >
      <motion.div
        variants={iconVariants}
        animate="animate"
        className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-rose-100 to-red-100 dark:from-rose-900/40 dark:to-red-900/30 text-rose-600 dark:text-rose-500 mb-6 shadow-lg"
      >
        <FiAlertTriangle size={40} />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-xl sm:text-2xl font-bold text-rose-900 dark:text-rose-100 font-display mb-2"
      >
        {title}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-rose-700/80 dark:text-rose-200/80 max-w-sm mb-8 leading-relaxed"
      >
        {description}
      </motion.p>

      {onRetry && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <FiRefreshCw size={18} />
          <span>Try Again</span>
        </motion.button>
      )}
    </motion.div>
  );
}
