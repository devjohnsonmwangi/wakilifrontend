import React, { useState, useEffect } from 'react';
import {
  useUpdateBranchLocationMutation,
} from '../../../../features/branchlocation/branchlocationapi'; // Adjust the path as needed
import { toast } from 'sonner'; // Toaster component itself is likely at a higher level
import { motion } from 'framer-motion';
import { X, Building, MapPin, Phone, Edit3 } from 'lucide-react'; // Using Edit3 for title icon

interface BranchLocationDataTypes {
  branch_id: number;
  name: string;
  address: string;
  contact_phone: string;
}

// Define a more specific type for the error data from the backend if known
interface ApiErrorData {
  error?: string;
  message?: string;
  // Add other potential error fields from your backend
}

interface RtkQueryErrorShape {
  data?: ApiErrorData | string;
  error?: string; // For FetchBaseQueryError string
  // other RTK Query error fields
}

interface EditBranchLocationProps {
  isDarkMode?: boolean; // Prop for dark mode, parent will set it
  branch: BranchLocationDataTypes;
  onClose: () => void;
}

const EditBranchLocation: React.FC<EditBranchLocationProps> = ({ branch, onClose }) => {
  // isDarkMode is received, Tailwind dark: prefixes will work based on <html> class.
  const [name, setName] = useState(branch.name);
  const [address, setAddress] = useState(branch.address);
  const [contactPhone, setContactPhone] = useState(branch.contact_phone);

  const [updateBranchLocation, { isLoading }] = useUpdateBranchLocationMutation();

  useEffect(() => {
    setName(branch.name);
    setAddress(branch.address);
    setContactPhone(branch.contact_phone);
  }, [branch]); // Re-populate form if the branch prop changes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedBranch: BranchLocationDataTypes = {
      branch_id: branch.branch_id, // Crucial for identifying which branch to update
      name,
      address,
      contact_phone: contactPhone,
    };

    try {
      await updateBranchLocation(updatedBranch).unwrap();
      toast.success('Branch location updated successfully!', {
        duration: 3000,
      });
      onClose();
    } catch (err: unknown) {
      console.error('Failed to update branch location:', err);

      let errorMessage = 'Failed to update branch location. Please try again.';
      if (typeof err === 'object' && err !== null) {
        const errorShape = err as RtkQueryErrorShape;
        if (errorShape.data) {
          if (typeof errorShape.data === 'object' && errorShape.data !== null) {
            const errorData = errorShape.data as ApiErrorData;
            if (errorData.error) errorMessage = errorData.error;
            else if (errorData.message) errorMessage = errorData.message;
          } else if (typeof errorShape.data === 'string' && errorShape.data.length > 0) {
            errorMessage = errorShape.data;
          }
        } else if (errorShape.error && typeof errorShape.error === 'string') {
          errorMessage = errorShape.error;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }
      }
      
      if (errorMessage.toLowerCase().includes('branch with this address already exists') || 
          errorMessage.toLowerCase().includes('similar address exists')) {
        toast.error('A branch with a similar address already exists. Please use a different address.', {
          duration: 5000,
        });
        return;
      }

      toast.error(errorMessage, {
        duration: 5000,
      });
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2, ease: "easeIn" } },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center p-4"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div
        className={`relative p-6 sm:p-8 border w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl
                   text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700`}
        variants={modalVariants}
        initial="hidden" 
        animate="visible"
        exit="exit" 
      >
        <button
          title='Close Modal'
          className="absolute top-4 right-4 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full p-2 transition-colors duration-200"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center mb-8">
           <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-green-500 to-teal-600 dark:from-emerald-500 dark:to-cyan-600">
                <Edit3 className="w-8 h-8 text-white" /> {/* Icon for Edit */}
            </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-2 tracking-tight">
            Edit Branch Details
          </h2>
          <p className="text-sm sm:text-md text-slate-600 dark:text-slate-400">
             Fine-tune the details to ensure our branch information is up-to-date.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              <Building size={16} className="mr-2 opacity-70" />
              Branch Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full py-2.5 px-4 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 
                         rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 
                         focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-emerald-500 focus:border-transparent 
                         transition-shadow duration-200 shadow-sm hover:shadow-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Downtown Central Branch"
              required
            />
          </div>

          <div>
            <label htmlFor="address" className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              <MapPin size={16} className="mr-2 opacity-70" />
              Full Address
            </label>
            <textarea
              id="address"
              className="w-full py-2.5 px-4 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 
                         rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 
                         focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-emerald-500 focus:border-transparent 
                         transition-shadow duration-200 shadow-sm hover:shadow-md resize-none"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Justice Lane, Suite 100, Cityville, ST 12345"
              required
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="contactPhone" className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              <Phone size={16} className="mr-2 opacity-70" />
              Contact Phone
            </label>
            <input
              type="tel"
              id="contactPhone"
              className="w-full py-2.5 px-4 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 
                         rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 
                         focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-emerald-500 focus:border-transparent 
                         transition-shadow duration-200 shadow-sm hover:shadow-md"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="(555) 123-4567"
              required
            />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row-reverse sm:justify-start gap-3"> {/* Changed button order and layout for common patterns */}
            <motion.button
              type="submit"
              className={`w-full sm:w-auto font-semibold py-3 px-6 rounded-lg text-white
                          bg-gradient-to-r from-green-500 to-teal-600 dark:from-emerald-500 dark:to-cyan-600
                          hover:from-green-600 hover:to-teal-700 dark:hover:from-emerald-600 dark:hover:to-cyan-700
                          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-cyan-500 
                          dark:focus:ring-offset-slate-800
                          transition-all duration-300 ease-in-out shadow-md hover:shadow-lg
                          disabled:opacity-60 disabled:cursor-not-allowed`}
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.03 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full mr-2" />
                  Updating...
                </div>
              ) : 'Save Changes'}
            </motion.button>
            <motion.button
              type="button"
              className="w-full sm:w-auto font-semibold py-3 px-6 rounded-lg 
                         bg-slate-100 hover:bg-slate-200 text-slate-700 
                         dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-slate-200
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 dark:focus:ring-slate-500
                         dark:focus:ring-offset-slate-800
                         transition-all duration-300 ease-in-out shadow-sm hover:shadow-md"
              onClick={onClose}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
          </div>
        </form>
      </motion.div>
      {/* Global Toaster preferred */}
    </motion.div>
  );
};

export default EditBranchLocation;