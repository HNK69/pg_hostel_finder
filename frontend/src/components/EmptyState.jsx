import React from 'react';
import { motion } from 'framer-motion';
import { FiInbox, FiArrowRight } from 'react-icons/fi';

export default function EmptyState({
  title = 'No data found',
  description = 'There are no items matching your criteria at the moment.',
  icon: Icon = FiInbox,
  actionText,
  onAction,
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
      y: [0, -8, 0],
      transition: {
        duration: 3,
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
      className="flex flex-col items-center justify-center p-12 sm:p-16 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/60 dark:to-slate-900/40 backdrop-blur-xl"
    >
      <motion.div
        variants={iconVariants}
        animate="animate"
        className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800/50 dark:to-slate-900 text-slate-400 dark:text-slate-600 mb-6 shadow-lg"
      >
        <Icon size={40} />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display mb-2"
      >
        {title}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-slate-600 dark:text-slate-400 max-w-sm mb-8 leading-relaxed"
      >
        {description}
      </motion.p>

      {actionText && onAction && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <span>{actionText}</span>
          <FiArrowRight size={18} />
        </motion.button>
      )}
    </motion.div>
  );
}
