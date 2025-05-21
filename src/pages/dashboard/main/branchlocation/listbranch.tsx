import { useState, useCallback } from 'react';
import {
  useFetchBranchLocationsQuery,
  useDeleteBranchLocationMutation,
} from '../../../../features/branchlocation/branchlocationapi';
import CreateBranchLocation from './createbranch';
import EditBranchLocation from './editbranch';
import { Toaster, toast } from 'sonner';
import { Trash2, Edit } from 'lucide-react';
import { motion } from 'framer-motion';

interface BranchLocationDataTypes {
  branch_id: number;
  name: string;
  address: string;
  contact_phone: string;
}
interface DocumentListProps {}

const BranchLocationManagement: React.FC<DocumentListProps> = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<BranchLocationDataTypes | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingBranchId, setDeletingBranchId] = useState<number | null>(null); // Track ID of branch being deleted

  const { data: branchLocations, isLoading, error, refetch } = useFetchBranchLocationsQuery();
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


  const handleDeleteBranch = useCallback(async (branchId: number) => {
    try {
      console.log("Deleting branch with ID:", branchId);
      setDeletingBranchId(branchId); // Set the ID of the branch being deleted
      await deleteBranchLocation(branchId).unwrap();
      toast.success('Branch location deleted successfully!!');
      refetch();
    } catch (err) {
      console.error("Error deleting branch location:", err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete branch location.';
      toast.error(errorMessage);
    } finally {
      setDeletingBranchId(null); // Clear the deleting ID, regardless of success or failure
    }
  }, [deleteBranchLocation, refetch]);

  if (isLoading) return <div className="text-center">Loading branch locations...</div>;

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load branch locations, please check  your internet connection .if connected to  internet and   this error persist please contact support team.';
    return <div className="text-center text-red-500">{errorMessage}</div>;
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
                  {/* <div className="breadcrumbs text-sm my-6 text-yellow-300 flex items-center gap-2">
                      <FaTicketAlt />
                      <ul className="flex gap-2">
                          <li><Link to="/dashboard/profile">🏠 Dashboard</Link></li>
                          <li><Link to="/dashboard/account">📋 my profile/Link></li>
                          <li><span className="inline-flex items-center gap-2">🎟️ Tickets</span></li>
                      </ul>
                  </div> */}
      <Toaster richColors />
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight">Branch Locations</h1>
        <motion.button
          whileHover={{ scale: 1.1, boxShadow: "0px 0px 10px rgba(0,0,0,0.2)" }}
          whileTap={{ scale: 0.95 }}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300 transition-transform duration-200 shadow-md"
          onClick={handleOpenCreateModal}
        >
          Create New Branch
        </motion.button>
      </div>

      {isCreateModalOpen && <CreateBranchLocation onClose={handleCloseCreateModal} />}
      {isEditModalOpen && selectedBranch && <EditBranchLocation branch={selectedBranch} onClose={handleCloseEditModal} />}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white leading-normal shadow-md rounded-3xl overflow-hidden">
          <thead>
            <tr className="bg-blue-100">
              <th className="px-6 py-4 border-b-2 border-gray-200 text-left text-lg font-semibold text-blue-700 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 border-b-2 border-gray-200 text-left text-lg font-semibold text-blue-700 uppercase tracking-wider">Address</th>
              <th className="px-6 py-4 border-b-2 border-gray-200 text-left text-lg font-semibold text-blue-700 uppercase tracking-wider">Contact Phone</th>
              <th className="px-6 py-4 border-b-2 border-gray-200 text-left text-lg font-semibold text-blue-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {branchLocations?.map((branch: BranchLocationDataTypes) => (
              <motion.tr
                key={branch.branch_id}
                className="hover:bg-blue-50 transition-colors duration-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * 1 }}
              >
                <td className="px-6 py-4 border-b border-gray-200 text-lg">{branch.name}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-lg">{branch.address}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-lg">{branch.contact_phone}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-lg">
                  <div className="flex items-center space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.2, color: "#2563eb" }}
                      className="text-blue-500 transition-colors duration-200"
                      title="Edit Branch"
                      onClick={() => handleOpenEditModal(branch)}
                    >
                      <Edit className="h-6 w-6" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.2, color: "#dc2626" }}
                      onClick={() => handleDeleteBranch(branch.branch_id)}
                      className="text-red-500 transition-colors duration-200"
                      title="Delete Branch"
                      disabled={deletingBranchId === branch.branch_id} // Disable only the button for the deleting branch
                    >
                      {deletingBranchId === branch.branch_id ? ( // Show spinner only for deleting branch
                        <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-gray-900 rounded-full" />
                      ) : (
                        <Trash2 className="h-6 w-6" />
                      )}
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default BranchLocationManagement;