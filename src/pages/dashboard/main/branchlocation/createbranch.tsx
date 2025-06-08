import React, { useState } from 'react';
import {
  useCreateBranchLocationMutation,
} from '../../../../features/branchlocation/branchlocationapi'; 
import { toast } from 'sonner'; 
import { motion } from 'framer-motion';
import { X, Building, MapPin, Phone, Briefcase } from 'lucide-react';

interface BranchLocationDataTypes {
  branch_id?: number;
  name: string;
  address: string;
  contact_phone: string;
}

interface ApiErrorData {
  error?: string;
  message?: string;
  
}

interface RtkQueryErrorShape {
    data?: ApiErrorData | string; // Can be an object or a string
    error?: string; 
    
  }

interface CreateBranchLocationProps {
  isDarkMode?: boolean; // Prop for dark mode, parent will set it
  onClose: () => void;
}

const CreateBranchLocation: React.FC<CreateBranchLocationProps> = ({ onClose }) => {
  // isDarkMode is received as a prop to potentially influence non-Tailwind logic if needed,
  // or to be passed to deeper child components. Tailwind's dark: prefixes work
  // based on the class on the <html> tag, so isDarkMode might not be directly
  // used for className concatenation in this specific component for Tailwind styles.
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const [createBranchLocation, { isLoading }] = useCreateBranchLocationMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newBranch: BranchLocationDataTypes = {
      name,
      address,
      contact_phone: contactPhone,
    };

    try {
      await createBranchLocation(newBranch).unwrap();
      toast.success('Branch location created successfully!', {
        duration: 3000,
      });
      
      setName('');
      setAddress('');
      setContactPhone('');
      onClose();
    } catch (err: unknown) {
      console.error('Failed to create branch location:', err);

      let errorMessage = 'Failed to create branch location. Please try again.';
      
      // Type guard for RTK Query error structure
      if (typeof err === 'object' && err !== null) {
        const errorShape = err as RtkQueryErrorShape; // Assert to our defined shape

        if (errorShape.data) {
          if (typeof errorShape.data === 'object' && errorShape.data !== null) {
            const errorData = errorShape.data as ApiErrorData; // Assert data part
            if (errorData.error) {
              errorMessage = errorData.error;
            } else if (errorData.message) {
              errorMessage = errorData.message;
            }
          } else if (typeof errorShape.data === 'string' && errorShape.data.length > 0) {
            errorMessage = errorShape.data;
          }
        } else if (errorShape.error && typeof errorShape.error === 'string') {
          errorMessage = errorShape.error; // For RTK Query FetchBaseQueryError string
        } else if (err instanceof Error) { // Fallback for general JS Error
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
           <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 dark:from-sky-500 dark:to-indigo-600">
                <Briefcase className="w-8 h-8 text-white" />
            </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-2 tracking-tight">
            New Branch Location
          </h2>
          <p className="text-sm sm:text-md text-slate-600 dark:text-slate-400">
            Expand our reach by establishing a new strategic location.
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
                         focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-sky-500 focus:border-transparent 
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
                         focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-sky-500 focus:border-transparent 
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
                         focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-sky-500 focus:border-transparent 
                         transition-shadow duration-200 shadow-sm hover:shadow-md"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="(555) 123-4567"
              required
            />
          </div>

          <div className="pt-2">
            <motion.button
              type="submit"
              className={`w-full font-semibold py-3 px-6 rounded-lg text-white
                          bg-gradient-to-r from-blue-600 to-purple-600 dark:from-sky-500 dark:to-indigo-600
                          hover:from-blue-700 hover:to-purple-700 dark:hover:from-sky-600 dark:hover:to-indigo-700
                          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-sky-500 
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
                  Creating...
                </div>
              ) : 'Create Branch Location'}
            </motion.button>
          </div>
        </form>
      </motion.div>
     
    </motion.div>
  );
};

export default CreateBranchLocation;