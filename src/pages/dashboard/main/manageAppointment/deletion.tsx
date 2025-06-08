// ConfirmationModal.tsx
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle as WarningIcon, Loader2, Trash2 as ConfirmIcon } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  isDarkMode?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  isLoading = false,
  isDarkMode = false,
}) => {
  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, y: 30, scale: 0.95, transition: { duration: 0.2, ease: "easeIn" } },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  // useEffect to handle Escape key press for closing the modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose, isLoading]);

  if (!isOpen) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] bg-black/60 dark:bg-black/70 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={!isLoading ? onClose : undefined} // Close on backdrop click only if not loading
        >
          <motion.div
            className={`relative p-6 sm:p-8 border w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl
                       text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700`}
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              title='Close Modal'
              aria-label="Close modal"
              className="absolute top-3 right-3 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full p-1.5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500"
              onClick={onClose}
              disabled={isLoading}
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 mb-4 sm:mb-5 rounded-full 
                              ${isDarkMode ? 'bg-red-500/10' : 'bg-red-100'}`}>
                <WarningIcon className={`w-7 h-7 sm:w-8 sm:h-8 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-2 tracking-tight">
                {title}
              </h3>
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-6 sm:mb-8 leading-relaxed px-2">
                {message}
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-center gap-3">
              <motion.button
                type="button"
                className="w-full sm:w-auto font-medium py-2.5 px-5 rounded-lg 
                            bg-slate-100 hover:bg-slate-200 text-slate-700 
                            dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 dark:focus:ring-slate-500
                            dark:focus:ring-offset-slate-800
                            transition-colors duration-200 ease-in-out text-sm shadow-sm"
                onClick={onClose}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                disabled={isLoading}
              >
                {cancelText}
              </motion.button>
              <motion.button
                type="button"
                onClick={onConfirm}
                className={`w-full sm:w-auto font-semibold py-2.5 px-5 rounded-lg text-white
                            bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-red-500
                            dark:focus:ring-offset-slate-800
                            transition-colors duration-200 ease-in-out shadow-md hover:shadow-lg
                            disabled:opacity-70 disabled:cursor-not-allowed text-sm`}
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="animate-spin h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                     <ConfirmIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5" />
                    {confirmText}
                  </div>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;