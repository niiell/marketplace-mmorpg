'use client';

import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
  onClose?: () => void;
}

export default function NotificationToaster({ message, type, duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    const timer = setTimeout(handleClose, duration);
    return () => clearTimeout(timer);
  }, [duration, handleClose]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Escape') {
      handleClose();
    }
  };

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  }[type];

  const icon = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    info: 'fas fa-info-circle'
  }[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          role="alert"
          className={`fixed bottom-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2`}
          aria-live="polite"
          aria-atomic="true"
          tabIndex={0}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onKeyDown={handleKeyDown}
        >
          <i className={`fas ${icon} mr-2`} />
          <span>{message}</span>
          <button
            onClick={handleClose}
            className="ml-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white p-1 hover:opacity-80"
            aria-label="Close notification"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
