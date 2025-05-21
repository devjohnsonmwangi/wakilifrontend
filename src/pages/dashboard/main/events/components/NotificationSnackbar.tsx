// src/features/events/components/NotificationSnackbar.tsx
import React, { useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

export interface SnackbarMessage {
  
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
  key: number;
}

interface NotificationSnackbarProps {
  snackbar: SnackbarMessage | null;
  handleCloseSnackbar: () => void;
  
}

const severityStyles = {
  success: 'bg-green-500 text-white',
  info: 'bg-blue-500 text-white',
  warning: 'bg-yellow-400 text-black',
  error: 'bg-red-500 text-white',
};

const NotificationSnackbar: React.FC<NotificationSnackbarProps> = ({
  snackbar,
  handleCloseSnackbar,
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (snackbar) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        handleCloseSnackbar();
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [snackbar, handleCloseSnackbar]);

  if (!snackbar) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <CSSTransition in={show} timeout={300} classNames="fade" unmountOnExit>
        <div
          className={`rounded-md shadow-lg px-4 py-3 transition-opacity duration-300 ease-in-out ${severityStyles[snackbar.severity]}`}
          role="alert"
        >
          <div className="flex items-start justify-between">
            <span>{snackbar.message}</span>
            <button
              className="ml-4 text-white font-bold"
              onClick={() => {
                setShow(false);
                handleCloseSnackbar();
              }}
            >
              &times;
            </button>
          </div>
        </div>
      </CSSTransition>
    </div>
  );
};

export default NotificationSnackbar;
