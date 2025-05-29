// ReasonDisplayModal.tsx
import React from 'react';
import { X, FileText, AlertCircle } from 'lucide-react'; // FileText for details, AlertCircle for no reason

interface ReasonDisplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason: string;
  partyName: string;
  isDarkMode: boolean;
}

const ReasonDisplayModal: React.FC<ReasonDisplayModalProps> = ({
  isOpen,
  onClose,
  reason,
  partyName,
  isDarkMode,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-in-out ${
        isOpen ? 'opacity-100 backdrop-blur-md' : 'opacity-0 pointer-events-none' // Enhanced backdrop blur
      }`}
      onClick={onClose}
    >
      <div
        className={`fixed inset-0 ${
          isDarkMode ? 'bg-slate-900/70' : 'bg-slate-900/60' // Darker overlay for more focus
        }`}
        aria-hidden="true"
      ></div>

      <div
        className={`relative z-10 w-full max-w-lg transform overflow-hidden rounded-xl shadow-2xl transition-all duration-300 ease-in-out ${ // max-w-lg is good for text
          isDarkMode
            ? 'bg-slate-800 text-slate-200 border border-slate-700'
            : 'bg-white text-slate-800' // Removed light mode border for cleaner look on white
        } ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-5 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-lg flex-shrink-0 ${isDarkMode ? 'bg-sky-600/30 text-sky-400' : 'bg-sky-100 text-sky-600'}`}>
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className={`text-base sm:text-lg font-bold ${isDarkMode ? 'text-green-100' : 'text-sky-900'}`}>
                Appointment Details
              </h2>
              <p className={`text-xs sm:text-sm font-bold ${isDarkMode ? 'text-sky-500' : 'text-sky-600'}`}>
                Party Name : {partyName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`ml-4 p-1.5 rounded-full transition-colors flex-shrink-0 ${
              isDarkMode
                ? 'text-slate-400 hover:bg-slate-700/70 hover:text-slate-100'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
            }`}
            aria-label="Close details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-400 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
          <div>
            <h4 className={`text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDarkMode ? 'text-sky-500' : 'text-sky-600'}`}>
              Reason  for Appointment as  Provided:
            </h4>
            {reason ? (
              <div className={`p-3.5 rounded-lg text-sm leading-relaxed whitespace-pre-wrap ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-50 text-slate-700'}`}>
                {reason}
              </div>
            ) : (
              <div className={`flex items-center space-x-2 p-3.5 rounded-lg text-sm ${isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                <AlertCircle className={`h-4 w-4 flex-shrink-0 ${isDarkMode ? 'text-amber-400' : 'text-amber-500'}`} />
                <span>No specific reason was recorded for this appointment.</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={`px-5 py-3.5 border-t ${isDarkMode ? 'border-slate-700 bg-slate-800/30' : 'border-slate-200 bg-slate-50/30'} flex justify-end`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isDarkMode
                ? 'bg-sky-600 hover:bg-sky-500 text-white focus:ring-sky-500 focus:ring-offset-slate-800'
                : 'bg-sky-500 hover:bg-sky-600 text-white focus:ring-sky-600 focus:ring-offset-white'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReasonDisplayModal;