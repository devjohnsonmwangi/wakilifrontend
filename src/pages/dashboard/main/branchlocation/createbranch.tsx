import React, { useState } from 'react';
import {
  useCreateBranchLocationMutation,
} from '../../../../features/branchlocation/branchlocationapi'; // Adjust the path as needed
import { Toaster, toast } from 'sonner';
import { motion } from 'framer-motion'; // Import framer-motion
import { X } from 'lucide-react'; // Import close Icon

interface BranchLocationDataTypes {
  branch_id?: number;
  name: string;
  address: string;
  contact_phone: string;
}

interface CreateBranchLocationProps {
  onClose: () => void;
}

const CreateBranchLocation: React.FC<CreateBranchLocationProps> = ({ onClose }) => {
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

      if (typeof err === 'object' && err !== null && 'data' in err && typeof err.data === 'string' && err.data.includes('Branch with this address already exists')) {
        toast.error('A  branch  with  simmilar  address exists. Please enter a different address branches  must  have different  addresses.', {
          duration: 5000,
        });
        return;
      }

      if (err instanceof Error) {
        errorMessage = err.message;
      }

      toast.error(errorMessage, {
        duration: 5000,
      });
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
          title='Close Modal'
          className="absolute top-4 right-4 hover:bg-gray-200 rounded-full p-2 transition-colors duration-200"
          onClick={onClose}
        >
          <X className="h-6 w-6 text-gray-700" />
        </button>

        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 mb-4 tracking-tight">
            Create Branch Location
          </h2>
          <p className="mt-2 text-lg text-gray-700 italic">
            Unleash the potential of our firm with a brand new, strategically placed branch location!
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
              type="submit"
              className="bg-gradient-to-br from-blue-600 to-purple-600 hover:bg-gradient-to-bl text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition-transform duration-300 hover:scale-105 tracking-wide shadow-md"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Branch'}
            </button>
          </div>
        </form>
      </motion.div>
      <Toaster richColors />
    </motion.div>
  );
};

export default CreateBranchLocation;
