import { useState, useCallback, useEffect } from 'react';
import {
  useFetchBranchLocationsQuery,
  useDeleteBranchLocationMutation,
} from '../../../../features/branchlocation/branchlocationapi';
import CreateBranchLocation from './createbranch';
import EditBranchLocation from './editbranch';
import { Toaster, toast } from 'sonner';
import { Trash2, Edit, PlusCircle, MapPin, Phone, Building, ServerCrash, WifiOff, Sun, Moon } from 'lucide-react'; // Removed AlertTriangle
import { motion, AnimatePresence } from 'framer-motion';

interface BranchLocationDataTypes {
  branch_id: number;
  name: string;
  address: string;
  contact_phone: string;
}

// Define a type for API error responses (adjust based on your backend)
interface ApiErrorResponse {
    message?: string;
    error?: string;
    detail?: string | { msg: string; type: string }[];
  }
  
// Interface to represent the structure of errors from RTK Query
interface RtkQueryError {
    status?: number | string;
    data?: ApiErrorResponse | string;
    error?: string;
}
  

const BranchLocationManagement: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<BranchLocationDataTypes | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingBranchId, setDeletingBranchId] = useState<number | null>(null);

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('theme');
      return savedMode === 'dark' || (!savedMode && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };


  const { data: branchLocations, isLoading, error: rawError, refetch } = useFetchBranchLocationsQuery();
  const [deleteBranchLocation] = useDeleteBranchLocationMutation();

  const handleOpenCreateModal = useCallback(() => setIsCreateModalOpen(true), []);
  const handleCloseCreateModal = useCallback(() => setIsCreateModalOpen(false), []);

  const handleOpenEditModal = useCallback((branch: BranchLocationDataTypes) => {
    setSelectedBranch(branch);
    setIsEditModalOpen(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setSelectedBranch(null);
    setIsEditModalOpen(false);
  }, []);

  const getApiErrorMessage = (error: unknown): string => {
    const defaultMessage = "An unexpected error occurred. Please try again or contact support.";
    if (typeof error === 'object' && error !== null) {
        const errObj = error as RtkQueryError;

        if (errObj.data) {
            if (typeof errObj.data === 'object') {
                const errorData = errObj.data as ApiErrorResponse;
                if (errorData.message) return errorData.message;
                if (errorData.error && typeof errorData.error === 'string') return errorData.error;
                if (errorData.detail) {
                    if (typeof errorData.detail === 'string') return errorData.detail;
                    if (Array.isArray(errorData.detail) && errorData.detail.length > 0 && typeof errorData.detail[0] === 'object' && 'msg' in errorData.detail[0]) {
                        return `Validation Error: ${(errorData.detail[0] as { msg: string }).msg}`;
                    }
                }
            } else if (typeof errObj.data === 'string' && errObj.data.trim() !== "") {
                return errObj.data;
            }
        }
        if (errObj.error && typeof errObj.error === 'string') {
            if (errObj.status === 'FETCH_ERROR') return `Network error: ${errObj.error}. Please check your connection.`;
            if (errObj.status === 'PARSING_ERROR') return `Error parsing server response. Please contact support.`;
            if (errObj.status === 'TIMEOUT_ERROR') return `The request timed out. Please try again.`;
            if (errObj.status === 'CUSTOM_ERROR') return `A custom error occurred: ${errObj.error}`;
            return errObj.error;
        }
        if (typeof errObj.status === 'number') {
            if (errObj.status === 400) return 'Bad Request: The server could not understand the request (400).';
            if (errObj.status === 401) return 'Unauthorized: Authentication failed or is required (401).';
            if (errObj.status === 403) return 'Forbidden: You do not have permission to perform this action (403).';
            if (errObj.status === 404) return 'Not Found: The requested resource could not be found (404).';
            if (errObj.status === 422) return 'Validation Error: Please check the data you provided (422).';
            if (errObj.status >= 500) return `Server Error: The server encountered an issue (${errObj.status}). Please try again later.`;
            return `Request failed with status code ${errObj.status}.`;
        }
        if ('message' in errObj && typeof (errObj as { message: unknown }).message === 'string') {
            return (errObj as { message: string }).message;
        }
    }
    if (typeof error === 'string') return error;
    return defaultMessage;
  };

  const handleDeleteBranch = useCallback(async (branchId: number) => {
    const branchToDelete = branchLocations?.find(b => b.branch_id === branchId);
    if (!branchToDelete) {
        toast.error("Branch not found for deletion.");
        return;
    }

    toast(
        `Are you sure you want to delete the branch "${branchToDelete.name}"? This action cannot be undone.`,
        {
          action: {
            label: 'Delete',
            onClick: async () => {
                try {
                    setDeletingBranchId(branchId);
                    await deleteBranchLocation(branchId).unwrap();
                    toast.success('Branch location deleted successfully!');
                    refetch();
                  } catch (err) {
                    console.error("Error deleting branch location:", err);
                    const errorMessage = getApiErrorMessage(err);
                    toast.error(errorMessage);
                  } finally {
                    setDeletingBranchId(null);
                  }
            },
          },
          cancel: {
            label: 'Cancel',
            onClick: () => {},
          },
          duration: Infinity,
        }
      );
  }, [deleteBranchLocation, refetch, branchLocations]);

  const ErrorDisplay = ({ error }: { error: unknown }) => {
    const errorMessage = getApiErrorMessage(error);
    const rtkError = error as RtkQueryError | null;
    let icon = <ServerCrash size={48} className="text-red-400 dark:text-red-500" />;
    if (rtkError?.status === 'FETCH_ERROR') {
        icon = <WifiOff size={48} className="text-yellow-400 dark:text-yellow-500" />;
    } else if (rtkError?.status === 404) {
        icon = <MapPin size={48} className="text-sky-400 dark:text-sky-500" />
    }

    return (
      <div className="flex flex-col items-center justify-center text-center p-8 my-10 bg-white dark:bg-slate-800/50 border border-red-200 dark:border-red-700/50 rounded-xl shadow-lg max-w-2xl mx-auto">
        <div className="mb-4">{icon}</div>
        <h3 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-3">
          {rtkError?.status === 404 ? 'No Locations Found' : 'An Error Occurred'}
        </h3>
        <p className="text-gray-700 dark:text-slate-300 mb-6">{errorMessage}</p>
        {rtkError?.status !== 404 && (
            <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 dark:focus:ring-red-500 transition-colors duration-200"
            onClick={() => refetch()}
          >
            Try Again
          </motion.button>
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center text-center py-20 min-h-[300px]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-t-blue-500 dark:border-t-sky-400 border-gray-200 dark:border-slate-700 rounded-full mb-4"
              ></motion.div>
              <p className="text-xl font-medium text-gray-700 dark:text-slate-300">Loading Branch Locations...</p>
            </div>
          );
    }

    if (rawError) {
      return <ErrorDisplay error={rawError} />;
    }
    
    if (!branchLocations || branchLocations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center text-center p-8 my-10 bg-white dark:bg-slate-800/50 border border-sky-200 dark:border-sky-700/50 rounded-xl shadow-lg max-w-lg mx-auto">
              <MapPin size={48} className="text-sky-400 dark:text-sky-500 mb-4" />
              <h3 className="text-2xl font-semibold text-sky-600 dark:text-sky-300 mb-3">No Branch Locations Found</h3>
              <p className="text-gray-600 dark:text-slate-400 mb-6">
                It seems there are no branch locations set up yet. Get started by creating one!
              </p>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 12px rgba(56, 189, 248, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2.5 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 dark:focus:ring-sky-500 transition-colors duration-200 shadow-md flex items-center"
                onClick={handleOpenCreateModal}
              >
                <PlusCircle size={20} className="mr-2" /> Create First Branch
              </motion.button>
            </div>
          );
    }

    return (
      <div className="overflow-x-auto bg-white dark:bg-slate-800 shadow-2xl rounded-2xl p-1 md:p-0">
        <table className="min-w-full leading-normal">
          <thead >
            <tr className="bg-slate-100 dark:bg-slate-700/50 border-b-2 border-slate-200 dark:border-slate-700">
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider whitespace-nowrap min-w-[200px]">
                <Building size={18} className="inline mr-2 opacity-70" />Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider whitespace-nowrap min-w-[250px]">
                <MapPin size={18} className="inline mr-2 opacity-70" />Address
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider whitespace-nowrap min-w-[180px]">
                <Phone size={18} className="inline mr-2 opacity-70" />Contact Phone
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider whitespace-nowrap min-w-[120px]">Actions</th>
            </tr>
          </thead>
          <tbody className="text-slate-700 dark:text-slate-300">
            <AnimatePresence>
              {branchLocations?.map((branch: BranchLocationDataTypes, index: number) => (
                <motion.tr
                  key={branch.branch_id}
                  className="hover:bg-sky-50 dark:hover:bg-slate-700/60 transition-colors duration-200 odd:bg-white dark:odd:bg-slate-800 even:bg-slate-50 dark:even:bg-slate-800/40"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <td className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-100">{branch.name}</td>
                  <td className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 text-sm">{branch.address}</td>
                  <td className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 text-sm">{branch.contact_phone}</td>
                  <td className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 text-sm">
                    <div className="flex items-center justify-center space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-sky-500 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 transition-colors duration-200 p-1.5 rounded-full hover:bg-sky-100 dark:hover:bg-sky-700/50"
                        title="Edit Branch"
                        onClick={() => handleOpenEditModal(branch)}
                      >
                        <Edit className="h-5 w-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteBranch(branch.branch_id)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200 p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-700/50"
                        title="Delete Branch"
                        disabled={deletingBranchId === branch.branch_id}
                      >
                        {deletingBranchId === branch.branch_id ? (
                          <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-current rounded-full" />
                        ) : (
                          <Trash2 className="h-5 w-5" />
                        )}
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    );
  }


  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-100 dark:bg-slate-900 min-h-screen transition-colors duration-300">
      <Toaster richColors theme={isDarkMode ? 'dark' : 'light'} position="top-right" />
      <header className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-slate-700">
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight flex items-center">
          <Building size={32} className="mr-3 text-blue-600 dark:text-sky-400" />
          Branch Locations
        </h1>
        <div className="flex items-center gap-4">
            <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 12px rgba(56, 189, 248, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-500 hover:bg-blue-600 dark:bg-sky-500 dark:hover:bg-sky-600 text-white font-semibold py-2.5 px-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-sky-400 transition-all duration-200 shadow-md flex items-center"
                onClick={handleOpenCreateModal}
            >
                <PlusCircle size={20} className="mr-2" /> Create New
            </motion.button>
            <button
                onClick={toggleDarkMode}
                className="p-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                aria-label="Toggle dark mode"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
                {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
            </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
            key={isLoading ? "loading" : rawError ? "error" : (branchLocations && branchLocations.length > 0) ? "data" : "no-data"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
        >
            {renderContent()}
        </motion.div>
      </AnimatePresence>

      {/* Ensure these modal components are updated to accept and use the isDarkMode prop */}
      {isCreateModalOpen && <CreateBranchLocation onClose={handleCloseCreateModal} isDarkMode={isDarkMode} />}
      {isEditModalOpen && selectedBranch && <EditBranchLocation branch={selectedBranch} onClose={handleCloseEditModal} isDarkMode={isDarkMode} />}

    </div>
  );
};

export default BranchLocationManagement;