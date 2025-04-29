import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';

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

  if (!isVisible) return null;

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  }[type];

  return (
    <button
      role="status"
      className={`fixed bottom-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${type === 'success' ? 'green' : type === 'error' ? 'red' : 'blue'}-400`}
      onClick={handleClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label={`${type} notification: ${message}`}
    >
      <span>{message}</span>
      <span aria-hidden="true" className="ml-2">&times;</span>
    </button>
  );
}
