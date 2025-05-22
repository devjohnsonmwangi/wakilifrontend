// src/features/events/components/ConfirmationDialog.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, Loader2, X } from 'lucide-react'; // Import icons

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  dialogType?: 'warning' | 'info' | 'success' | 'danger'; // Added for theming
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  dialogType = 'warning', // Default to warning for confirmation
}) => {

  const getThemeClasses = () => {
    switch (dialogType) {
      case 'danger':
        return {
          icon: <AlertTriangle size={28} className="text-red-500" />,
          confirmButton: 'bg-red-600 hover:bg-red-700 focus-visible:outline-red-600',
          titleText: 'text-red-700',
        };
      case 'success':
        return {
          icon: <CheckCircle size={28} className="text-green-500" />,
          confirmButton: 'bg-green-600 hover:bg-green-700 focus-visible:outline-green-600',
          titleText: 'text-green-700',
        };
      case 'info':
        return {
          icon: <AlertTriangle size={28} className="text-blue-500" />, // Or Info icon
          confirmButton: 'bg-blue-600 hover:bg-blue-700 focus-visible:outline-blue-600',
          titleText: 'text-blue-700',
        };
      case 'warning':
      default:
        return {
          icon: <AlertTriangle size={28} className="text-yellow-500" />,
          confirmButton: 'bg-yellow-500 hover:bg-yellow-600 focus-visible:outline-yellow-500 text-yellow-900',
          titleText: 'text-yellow-700',
        };
    }
  };

  const theme = getThemeClasses();

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  };

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          // onClick={isLoading ? undefined : onClose} // Allow close on overlay if not loading
          // The below onClick on the div will close if overlay is clicked.
          // The motion.div has stopPropagation.
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: 'spring', damping: 18, stiffness: 200 }}
            role="alertdialog"
            aria-labelledby="confirmation-dialog-title"
            aria-describedby="confirmation-dialog-description"
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
            onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside modal
          >
            <div className="absolute top-0 right-0 pt-4 pr-4 sm:block">
                <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={isLoading ? undefined : onClose}
                    disabled={isLoading}
                    aria-label="Close"
                >
                    <X className="h-6 w-6" aria-hidden="true" />
                </button>
            </div>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${dialogType === 'danger' ? 'bg-red-100' : dialogType === 'success' ? 'bg-green-100' : dialogType === 'info' ? 'bg-blue-100' : 'bg-yellow-100'} sm:mx-0 sm:h-10 sm:w-10`}>
                  {theme.icon}
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className={`text-lg font-semibold leading-6 text-gray-900 ${theme.titleText}`} id="confirmation-dialog-title">
                    {title}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500" id="confirmation-dialog-description">
                      {description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                className={`inline-flex w-full justify-center items-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto transition-colors
                            ${theme.confirmButton}
                            ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                onClick={onConfirm}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  confirmText
                )}
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto disabled:opacity-75 disabled:cursor-not-allowed transition-colors"
                onClick={isLoading ? undefined : onClose}
                disabled={isLoading}
              >
                {cancelText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationDialog;