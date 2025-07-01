import React, { useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { X, AlertTriangle as DefaultDestructiveIcon, CheckCircle as DefaultPrimaryIcon, Loader2 } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  intent?: 'destructive' | 'primary';
  icon?: React.ElementType;
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
  intent = 'destructive',
  icon: CustomIcon,
}) => {
  // --- ACTION: Added 'as const' to the 'ease' properties to satisfy Framer Motion's types ---
  const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: 'easeOut' as const } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.15, ease: 'easeIn' as const } },
  };

  const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, isLoading]);

  const isDestructive = intent === 'destructive';
  const IconComponent = CustomIcon || (isDestructive ? DefaultDestructiveIcon : DefaultPrimaryIcon);
  
  const iconWrapperClasses = isDestructive
    ? 'bg-red-100 dark:bg-red-900/30'
    : 'bg-sky-100 dark:bg-sky-900/30';
  
  const iconClasses = isDestructive
    ? 'text-red-600 dark:text-red-400'
    : 'text-sky-600 dark:text-sky-400';

  const confirmButtonClasses = isDestructive
    ? 'bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 focus:ring-red-500'
    : 'bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 focus:ring-sky-500';

  if (!isOpen) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={!isLoading ? onClose : undefined}
        >
          <motion.div
            className="relative p-6 sm:p-8 border w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl border-slate-200 dark:border-slate-700"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-labelledby="confirmation-title"
            aria-describedby="confirmation-message"
          >
            <button
              title='Close Modal'
              aria-label="Close modal"
              className="absolute top-3 right-3 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full p-1.5 transition-colors"
              onClick={onClose}
              disabled={isLoading}
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-14 h-14 mb-5 rounded-full ${iconWrapperClasses}`}>
                <IconComponent className={`w-8 h-8 ${iconClasses}`} aria-hidden="true" />
              </div>
              <h3 id="confirmation-title" className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-2">
                {title}
              </h3>
              <div id="confirmation-message" className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed px-2">
                {message}
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-center gap-3">
              <motion.button
                type="button"
                className="w-full sm:w-auto font-medium py-2.5 px-5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 dark:focus:ring-offset-slate-800 transition-colors text-sm shadow-sm"
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
                className={`w-full sm:w-auto font-semibold py-2.5 px-5 rounded-lg text-white transition-colors shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${confirmButtonClasses}`}
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    {confirmText}
                  </span>
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