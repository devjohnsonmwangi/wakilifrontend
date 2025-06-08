// src/features/events/components/ConfirmationDialog.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, Info, Loader2, X as XIcon } from 'lucide-react'; 

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  dialogType?: 'warning' | 'info' | 'success' | 'danger';
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
  dialogType = 'warning',
}) => {

  const getThemeStyling = () => {
    // Common button base for confirm action
    const confirmButtonBase = "inline-flex w-full justify-center items-center rounded-md px-4 py-2.5 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
    const iconWrapperBase = "mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10";

    switch (dialogType) {
      case 'danger':
        return {
          icon: <AlertTriangle size={24} className="text-red-600 dark:text-red-400" />,
          iconWrapper: `${iconWrapperBase} bg-red-100 dark:bg-red-500/10`,
          confirmButton: `${confirmButtonBase} bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 focus-visible:outline-red-600 dark:focus-visible:outline-red-500`,
          titleText: 'text-red-700 dark:text-red-300',
        };
      case 'success':
        return {
          icon: <CheckCircle size={24} className="text-green-600 dark:text-green-400" />,
          iconWrapper: `${iconWrapperBase} bg-green-100 dark:bg-green-500/10`,
          confirmButton: `${confirmButtonBase} bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 focus-visible:outline-green-600 dark:focus-visible:outline-green-500`,
          titleText: 'text-green-700 dark:text-green-300',
        };
      case 'info':
        return {
          icon: <Info size={24} className="text-blue-600 dark:text-blue-400" />,
          iconWrapper: `${iconWrapperBase} bg-blue-100 dark:bg-blue-500/10`,
          confirmButton: `${confirmButtonBase} bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus-visible:outline-blue-600 dark:focus-visible:outline-blue-500`,
          titleText: 'text-blue-700 dark:text-blue-300',
        };
      case 'warning':
      default:
        return {
          icon: <AlertTriangle size={24} className="text-amber-600 dark:text-amber-400" />,
          iconWrapper: `${iconWrapperBase} bg-amber-100 dark:bg-amber-500/10`,
          // Warning confirm button might have dark text on light bg for better contrast
          confirmButton: `${confirmButtonBase} bg-amber-500 hover:bg-amber-600 dark:bg-amber-500 dark:hover:bg-amber-600 text-white focus-visible:outline-amber-600 dark:focus-visible:outline-amber-500`,
          titleText: 'text-amber-700 dark:text-amber-300',
        };
    }
  };

  const theme = getThemeStyling();

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -10 },
  };

  // Base for cancel button
  const cancelButtonBase = "mt-3 inline-flex w-full justify-center rounded-md px-4 py-2.5 text-sm font-semibold shadow-sm ring-1 ring-inset sm:mt-0 sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150";
  const lightCancel = "bg-white text-slate-900 ring-slate-300 hover:bg-slate-50 focus:ring-slate-400";
  const darkCancel = "dark:bg-slate-700 dark:text-slate-200 dark:ring-slate-600 dark:hover:bg-slate-600 dark:focus:ring-slate-500";


  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm p-4 transition-opacity"
          onClick={isLoading ? undefined : onClose} // Close on backdrop click if not loading
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: 'spring', damping: 20, stiffness: 250 }}
            role="alertdialog"
            aria-labelledby="confirmation-dialog-title"
            aria-describedby="confirmation-dialog-description"
            className="relative transform overflow-hidden rounded-xl bg-white dark:bg-slate-800 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
            onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside modal
          >
            {/* Close button positioned inside the panel for better accessibility */}
            <div className="absolute top-0 right-0 pt-3 pr-3 hidden sm:block">
                <button
                    type="button"
                    className="p-1.5 rounded-full text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-colors"
                    onClick={isLoading ? undefined : onClose}
                    disabled={isLoading}
                    aria-label="Close"
                >
                    <XIcon className="h-5 w-5" aria-hidden="true" />
                </button>
            </div>

            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-5">
              <div className="sm:flex sm:items-start">
                <div className={theme.iconWrapper}>
                  {theme.icon}
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className={`text-lg font-semibold leading-6 text-slate-900 dark:text-slate-100 ${theme.titleText}`} id="confirmation-dialog-title">
                    {title}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-slate-600 dark:text-slate-400" id="confirmation-dialog-description">
                      {description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 px-4 py-4 sm:flex sm:flex-row-reverse sm:px-6 rounded-b-xl border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                className={`${theme.confirmButton} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                onClick={onConfirm}
                disabled={isLoading}
                autoFocus // Auto-focus the confirm button
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
                className={`${cancelButtonBase} ${lightCancel} ${darkCancel}`}
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