// src/features/events/components/NotificationSnackbar.tsx
import React, { useEffect, useState } from 'react';

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
  success: 'bg-green-100 text-green-700 border-green-400 dark:bg-green-900 dark:text-green-200 dark:border-green-700',
  info: 'bg-blue-100 text-blue-700 border-blue-400 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-400 dark:bg-yellow-700 dark:text-yellow-100 dark:border-yellow-600',
  error: 'bg-red-100 text-red-700 border-red-400 dark:bg-red-900 dark:text-red-200 dark:border-red-700',
};

const iconSeverityStyles = {
  success: 'text-green-500 dark:text-green-400',
  info: 'text-blue-500 dark:text-blue-400',
  warning: 'text-yellow-500 dark:text-yellow-400',
  error: 'text-red-500 dark:text-red-400',
};


const AlertIcons = {
  success: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  info: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
    </svg>
  ),
  warning: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
  ),
  error: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
    </svg>
  ),
};



const NotificationSnackbar: React.FC<NotificationSnackbarProps> = ({
  snackbar,
  handleCloseSnackbar,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Correctly type timers for environments that might use NodeJS.Timeout or number
  
    let closeTimer: ReturnType<typeof setTimeout>;

    if (snackbar) {
      setIsVisible(true); // Trigger fade-in

      // Auto-close after 6 seconds
      closeTimer = setTimeout(() => {
        setIsVisible(false);
        // Delay handleCloseSnackbar to allow fade-out animation to complete
        setTimeout(handleCloseSnackbar, 300); // Match transition duration
      }, 6000);
    } else {
      // If snackbar becomes null (e.g., due to external clear), ensure it hides
      setIsVisible(false);
    }

    return () => {
      const openTimer = setTimeout(() => {}, 0); // Clear any open timer
      
      clearTimeout(openTimer);
      clearTimeout(closeTimer);
    };
  }, [snackbar, handleCloseSnackbar]);

  if (!snackbar && !isVisible) { // Only return null if snackbar is null AND it's not currently visible (fading out)
    return null;
  }

  // Get the specific icon for the severity, fallback to info if somehow snackbar is null here (should not happen due to above check)
  const IconComponent = snackbar ? AlertIcons[snackbar.severity] : AlertIcons.info;
  const iconColorClass = snackbar ? iconSeverityStyles[snackbar.severity] : iconSeverityStyles.info;


  return (
    <div
      // Apply transition classes directly based on isVisible state
      className={`fixed bottom-4 right-4 z-[100] w-full max-w-sm transition-all duration-300 ease-in-out
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`} // Added pointer-events-none when hidden
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      {snackbar && ( // Conditionally render content only if snackbar data exists
        <div
          className={`rounded-md shadow-lg p-4 border-l-4 ${severityStyles[snackbar.severity]}`}
        >
          <div className="flex items-start">
            <div className={`flex-shrink-0 ${iconColorClass}`}>
              <IconComponent />
            </div>
            <div className="ml-3 flex-1 md:flex md:justify-between">
              <p className={`text-sm font-medium ${severityStyles[snackbar.severity].includes('text-black') ? 'text-black' : severityStyles[snackbar.severity].includes('text-yellow-100') ? 'text-yellow-100' : 'text-inherit' }`}>
                {snackbar.message}
              </p>
              <button
                type="button"
                className={`ml-auto pl-3 -mx-1.5 -my-1.5 inline-flex items-center justify-center h-8 w-8 rounded-md
                            focus:outline-none focus:ring-2 focus:ring-offset-2
                            ${severityStyles[snackbar.severity].includes('bg-yellow-100') ? 'text-yellow-500 hover:bg-yellow-200 focus:ring-yellow-600 focus:ring-offset-yellow-50 dark:hover:bg-yellow-600 dark:text-yellow-300' :
                              severityStyles[snackbar.severity].includes('bg-green-100') ? 'text-green-500 hover:bg-green-200 focus:ring-green-600 focus:ring-offset-green-50 dark:hover:bg-green-800 dark:text-green-300' :
                              severityStyles[snackbar.severity].includes('bg-blue-100') ? 'text-blue-500 hover:bg-blue-200 focus:ring-blue-600 focus:ring-offset-blue-50 dark:hover:bg-blue-800 dark:text-blue-300' :
                              severityStyles[snackbar.severity].includes('bg-red-100') ? 'text-red-500 hover:bg-red-200 focus:ring-red-600 focus:ring-offset-red-50 dark:hover:bg-red-800 dark:text-red-300' :
                              'text-gray-500 hover:bg-gray-200 focus:ring-gray-600 focus:ring-offset-gray-50 dark:hover:bg-gray-600 dark:text-gray-300'
                            }`}
                onClick={() => {
                  setIsVisible(false);
                  // Delay handleCloseSnackbar to allow fade-out animation to complete
                  setTimeout(handleCloseSnackbar, 300); // Match transition duration
                }}
                aria-label="Dismiss"
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSnackbar;