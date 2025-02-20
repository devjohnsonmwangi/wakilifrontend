import React, { useState, useEffect } from 'react';
import {
  useUpdateBranchLocationMutation,
} from '../../../../features/branchlocation/branchlocationapi'; // Adjust the path as needed
import { Toaster, toast } from 'sonner';
import { motion } from 'framer-motion'; // Import framer-motion
import { X } from 'lucide-react'; // Import close Icon

interface BranchLocationDataTypes {
  branch_id: number; // Make branch_id required
  name: string;
  address: string;
  contact_phone: string;
}

interface EditBranchLocationProps {
  branch: BranchLocationDataTypes;
  onClose: () => void;
}

const EditBranchLocation = ({ branch, onClose }: EditBranchLocationProps) => {
  const [name, setName] = useState(branch.name);
  const [address, setAddress] = useState(branch.address);
  const [contactPhone, setContactPhone] = useState(branch.contact_phone);

  const [updateBranchLocation, { isLoading }] = useUpdateBranchLocationMutation();

  useEffect(() => {
    setName(branch.name);
    setAddress(branch.address);
    setContactPhone(branch.contact_phone);
  }, [branch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedBranch: BranchLocationDataTypes = {
      branch_id: branch.branch_id,
      name,
      address,
      contact_phone: contactPhone,
    };

    try {
      await updateBranchLocation(updatedBranch).unwrap();

      // Display a success toast
      toast.success('Branch location updated successfully!', {
        duration: 3000,
      });

      onClose(); // Close the modal after successful update

    } catch (err) {
        if (err instanceof Error) {
          console.error('Failed to update branch location:', err.message);
          toast.error(`Failed to update branch location: ${err.message}`, {
            duration: 5000,
          });
        } else {
          console.error('An unknown error occurred:', err);
          toast.error('Failed to update branch location. Please try again.', {
            duration: 5000,
          });
        }
      }
    };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-60 overflow-y-auto h-full w-full flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="relative p-8 border w-full max-w-md bg-white rounded-3xl shadow-2xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <button
          title="Close Modal"
          className="absolute top-4 right-4 hover:bg-gray-200 rounded-full p-2 transition-colors duration-200"
          onClick={onClose}
        >
           <X className="h-6 w-6 text-gray-700" />
        </button>

        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 mb-4 tracking-tight">
            Edit Branch Location
          </h2>
          <p className="mt-2 text-lg text-gray-700 italic">
             Fine-tune the details to ensure our branch information is perfectly accurate!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="name" className="block text-gray-700 text-lg font-semibold mb-2">
              Name:
            </label>
            <input
              type="text"
              id="name"
              className="shadow-sm appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow duration-300"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Wakili Branch Name"
              required
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-gray-700 text-lg font-semibold mb-2">
              Address:
            </label>
            <textarea
              id="address"
              className="shadow-sm appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow duration-300"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Justice Lane, Cityville"
              required
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="contactPhone" className="block text-gray-700 text-lg font-semibold mb-2">
              Contact Phone:
            </label>
            <input
              type="tel"
              id="contactPhone"
              className="shadow-sm appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow duration-300"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="(555) 123-4567"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button" // Change type to "button"
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400 transition-transform duration-300 hover:scale-105 tracking-wide shadow-md"
              onClick={onClose} // Call onClose when the button is clicked
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gradient-to-br from-green-600 to-teal-600 hover:bg-gradient-to-bl text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400 transition-transform duration-300 hover:scale-105 tracking-wide shadow-md"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Updating...
                </div>
              ) : (
                'Update Branch'
              )}
            </button>
          </div>
        </form>
      </motion.div>
      <Toaster richColors />
    </motion.div>
  );
};

export default EditBranchLocation;