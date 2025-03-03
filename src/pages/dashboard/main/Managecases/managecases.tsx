import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { caseAndPaymentAPI, CaseDataTypes, CaseStatus } from "../../../../features/case/caseAPI";
import { Toaster, toast } from 'sonner';
import { logAPI } from "../../../../features/log/logsapi";
import { RootState } from "../../../../app/store";
import AnimatedLoader from "../../../../components/AnimatedLoader";
import { useSelector } from "react-redux";
import {
    FaFileAlt, FaUser, FaEnvelope, FaTimes,
    FaPhone, FaIdCard, FaTrashAlt, FaCheckCircle
} from "react-icons/fa";
import DeleteCaseForm from '../../main/Managecases/deletecase'; // Import the DeleteCaseForm component
import ViewCaseDetailsModal from "./ViewCaseDetailsModal";

const AllCases = () => {
    const [cases, setCases] = useState<CaseDataTypes[]>([]);
    const [selectedCase, setSelectedCase] = useState<CaseDataTypes | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: allUserCases, isError, isLoading, refetch } = caseAndPaymentAPI.useFetchCasesQuery(undefined, {
        refetchOnMountOrArgChange: true,
        pollingInterval: 600000,
    });
    const [updateCase] = caseAndPaymentAPI.useUpdateCaseMutation();
    const { user } = useSelector((state: RootState) => state.user);
    const user_id = user?.user_id;
    const [addLog] = logAPI.useCreateLogMutation();

    const [loadingReopenId, setLoadingReopenId] = useState<number | null>(null);
    const [loadingCaseId, setLoadingCaseId] = useState<number | null>(null); // to implement loading of close case button

    const [filters, setFilters] = useState({
        full_name: '',
        email: '',
        subject: '',
        status: ''
    });

    const [selectedCases, setSelectedCases] = useState<Set<number>>(new Set());
    const [caseToDelete, setCaseToDelete] = useState<CaseDataTypes | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        if (allUserCases) {
            setCases(allUserCases);
        }
    }, [allUserCases]);

    const handleUpdateStatus = async (case_id: number, case_status: CaseStatus) => {
        try {
            setLoadingCaseId(case_id); // Setting the case Id to the loading so it can display loading
            await updateCase({ case_id, case_status }).unwrap();
            await addLog({ user_id, action: `📜 Case ${case_id} status updated to ${case_status}` }).unwrap();
            toast.success('🎉 Case status updated successfully!');
            refetch(); // Refresh the data after updating status
        } catch (err) {
            toast.error('❌ Failed to update case status');
        } finally {
            setLoadingCaseId(null); // Setting it to null after the request is processed
        }
    };

    const handleBulkUpdateStatus = async (case_status: CaseStatus) => {
        const selectedCaseIds = Array.from(selectedCases);
        try {
            for (const case_id of selectedCaseIds) {
                await updateCase({ case_id, case_status }).unwrap();
                await addLog({ user_id, action: `📜 Case ${case_id} status updated to ${case_status}` }).unwrap();
            }
            toast.success('🎉 Bulk case status updated successfully!');
            setSelectedCases(new Set());
            refetch(); // Refresh data after bulk update
        } catch (err) {
            toast.error('❌ Failed to update cases status');
        }
    };

    const handleReopenCase = async (case_id: number) => {
        try {
            setLoadingReopenId(case_id);
            await updateCase({ case_id, case_status: 'open' }).unwrap();
            await addLog({ user_id, action: `📜 Case ${case_id} status updated to open` }).unwrap();
            toast.success('🎉 Case reopened successfully! ');
            refetch(); // Refresh data after reopening
        } catch (err) {
            toast.error('❌ Failed to reopen case');
        } finally {
            setLoadingReopenId(null);
        }
    };

    const filteredCases = cases.filter((caseItem) => {
        return (
            (filters.full_name ? caseItem.user.full_name.toLowerCase().includes(filters.full_name.toLowerCase()) : true) &&
            (filters.email ? caseItem.user.email.toLowerCase().includes(filters.email.toLowerCase()) : true) &&
            (filters.subject ? (caseItem.case_description ? caseItem.case_description.toLowerCase().includes(filters.subject.toLowerCase()) : false) : true) &&
            (filters.status ? caseItem.case_status.toLowerCase() === filters.status.toLowerCase() : true)
        );
    });

    if (isLoading) {
        return <div className="text-center"><AnimatedLoader /> Loading Cases...</div>;
    }

    if (isError) {
        toast.error('❌ Failed to load cases');
        return <div className="text-center">Failed to load cases</div>;
    }

    const resetFilters = () => {
        setFilters({
            full_name: '',
            email: '',
            subject: '',
            status: ''
        });
    };

    const handleCaseSelection = (caseId: number) => {
        setSelectedCases(prevState => {
            const newSelection = new Set(prevState);
            if (newSelection.has(caseId)) {
                newSelection.delete(caseId);
            } else {
                newSelection.add(caseId);
            }
            return newSelection;
        });
    };

    const openModal = (caseItem: CaseDataTypes) => {
        setSelectedCase(caseItem);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCase(null);
    };

    const openDeleteModal = (caseItem: CaseDataTypes) => {
        setCaseToDelete(caseItem);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setCaseToDelete(null);
    };

    return (
        <>
            <Toaster position="top-right" />
            <div className="w-full h-full p-0 m-0"> {/* Full width and height with no padding or margin */}
                <div className="py-6">
                    <div className="breadcrumbs text-sm my-6 text-yellow-300 flex items-center gap-2">
                        <FaFileAlt />
                        <ul className="flex gap-2">
                            <li><Link to="/dashboard/profile">🏠 Dashboard</Link></li>
                            <li><Link to="/dashboard/account">📋 Admin</Link></li>
                            <li><span className="inline-flex items-center gap-2">📁 Cases</span></li>
                        </ul>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-2">
                        <div className="flex items-center gap-1">
                            <FaUser />
                            <input
                                type="text"
                                placeholder="Search by Full Name"
                                value={filters.full_name}
                                onChange={(e) => setFilters({ ...filters, full_name: e.target.value })}
                                className="input input-bordered w-full"
                            />
                        </div>
                        <div className="flex items-center gap-1">
                            <FaEnvelope />
                            <input
                                type="text"
                                placeholder="Search by Email"
                                value={filters.email}
                                onChange={(e) => setFilters({ ...filters, email: e.target.value })}
                                className="input input-bordered w-full"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <FaFileAlt />
                            <input
                                type="text"
                                placeholder="Search by Description"
                                value={filters.subject}
                                onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
                                className="input input-bordered w-full"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <FaFileAlt />
                            <select
                                title="status"
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                className="select select-bordered w-full"
                            >
                                <option value="">All Statuses</option>
                                <option value="open">Open</option>
                                <option value="in_progress">In Progress</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-center mb-4"> {/* Flex container for buttons */}
                        <button
                            onClick={resetFilters}
                            className="btn btn-outline btn-error w-full sm:w-auto mb-2 sm:mb-0"
                        >
                            <FaTimes className="inline mr-2" />
                            Reset Filters
                        </button>
                        <button
                            className="btn bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                            onClick={() => handleBulkUpdateStatus('closed')}
                            disabled={selectedCases.size === 0}
                        >
                            Close Selected Cases
                        </button>
                    </div>

                    <h2 className="text-3xl font-semibold mb-6 text-indigo-600">
                        🚀 Open and In Progress Cases
                    </h2>

                    <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
                        <table className="table table-zebra text-gray-800 w-full">
                            <thead className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                                <tr className="text-xl">
                                    <th></th>
                                    <th>📁</th>
                                    <th>🙋 Full Name</th>
                                    <th><FaPhone className="inline mr-1 text-green-600" />Phone</th>
                                    <th>Case Type</th>
                                    <th>⚙️ Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCases
                                    .filter(caseItem => caseItem.case_status === 'open' || caseItem.case_status === 'in_progress')
                                    .map(caseItem => (
                                        <tr key={caseItem.case_id} className="hover:bg-indigo-50">
                                            <td>
                                                <input
                                                    title="checkbox"
                                                    type="checkbox"
                                                    checked={selectedCases.has(caseItem.case_id)}
                                                    onChange={() => handleCaseSelection(caseItem.case_id)}
                                                    className="checkbox"
                                                />
                                            </td>
                                            <td><FaIdCard className="inline mr-1 text-indigo-600" />{caseItem.case_id}</td>
                                            <td><FaUser className="inline mr-1 text-indigo-600" />{caseItem.user.full_name}</td>
                                            <td><FaPhone className="inline mr-1 text-indigo-600" />{caseItem.user.phone_number}</td>
                                            <td>{caseItem.case_type}</td>
                                            <td className="flex gap-2 justify-center flex-wrap"> {/* Added flex-wrap for responsiveness */}
                                                <button
                                                    title="View"
                                                    className="btn btn-outline btn-info text-white hover:bg-indigo-500 flex items-center"
                                                    onClick={() => openModal(caseItem)} // Open modal with case details
                                                >
                                                    <FaFileAlt className="mr-1" />
                                                    View
                                                </button>
                                                <button
                                                    className="btn btn-outline btn-success text-white hover:bg-green-500 flex items-center"
                                                    onClick={() => handleUpdateStatus(caseItem.case_id, 'closed')}
                                                    disabled={loadingCaseId === caseItem.case_id}
                                                >
                                                    {loadingCaseId === caseItem.case_id ? (
                                                        <FaCheckCircle className="animate-spin mr-1" />
                                                    ) : (
                                                        <FaCheckCircle className="mr-1" />
                                                    )}
                                                    Close
                                                </button>
                                                <button
                                                    title="Delete"
                                                    className="btn btn-outline btn-error text-white hover:bg-red-500 flex items-center"
                                                    onClick={() => openDeleteModal(caseItem)}
                                                >
                                                    <FaTrashAlt className="mr-1" />
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>

                    <h2 className="text-3xl font-semibold mt-8 mb-6 text-gray-700">
                        ✅ Closed Cases
                    </h2>
                    <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
                        <table className="table table-zebra text-gray-800 w-full">
                            <thead className="bg-gradient-to-r from-green-600 to-green-400 text-white">
                                <tr className="text-xl">
                                    <th></th>
                                    <th>📁</th>
                                    <th>🙋 Full Name</th>
                                    <th><FaPhone className="inline mr-1 text-green-600" />Phone</th>
                                    <th>Case Type</th>
                                    <th>⚙️ Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCases
                                    .filter(caseItem => caseItem.case_status === 'closed')
                                    .map(caseItem => (
                                        <tr key={caseItem.case_id} className="hover:bg-green-50">
                                            <td>
                                                <input
                                                    title="checkbox"
                                                    type="checkbox"
                                                    checked={selectedCases.has(caseItem.case_id)}
                                                    onChange={() => handleCaseSelection(caseItem.case_id)}
                                                    className="checkbox"
                                                />
                                            </td>
                                            <td><FaIdCard className="inline mr-1 text-green-600" />{caseItem.case_id}</td>
                                            <td><FaUser className="inline mr-1 text-green-600" />{caseItem.user.full_name}</td>
                                            <td><FaPhone className="inline mr-1 text-green-600" />{caseItem.user.phone_number}</td>
                                            <td>{caseItem.case_type}</td>
                                            <td className="flex gap-2 justify-center flex-wrap"> {/* Added flex-wrap for responsiveness */}
                                                <button
                                                    title="View"
                                                    className="btn btn-outline btn-info text-white hover:bg-indigo-500 flex items-center"
                                                    onClick={() => openModal(caseItem)} // Open modal with case details
                                                >
                                                    <FaFileAlt className="mr-1" />
                                                    View
                                                </button>
                                                <button
                                                    className="btn btn-outline btn-warning flex items-center"
                                                    onClick={() => handleReopenCase(caseItem.case_id)}
                                                    disabled={loadingReopenId === caseItem.case_id}
                                                >
                                                    {loadingReopenId === caseItem.case_id ? 'Reopening...' : 'Reopen'}
                                                </button>
                                                <button
                                                    title="Delete"
                                                    className="btn btn-outline btn-error text-white hover:bg-red-500 flex items-center"
                                                    onClick={() => openDeleteModal(caseItem)}
                                                >
                                                    <FaTrashAlt className="mr-1" />
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Modal for displaying case details */}
                    {isModalOpen && selectedCase && (
                       <ViewCaseDetailsModal selectedCase={selectedCase} closeModal={closeModal} />
                    )}

                    {/* Delete Case Modal */}
                    {isDeleteModalOpen && caseToDelete && (
                        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto relative">
                                <button
                                    title="button"
                                    className="absolute top-2 right-2 btn btn-sm btn-circle btn-ghost"
                                    onClick={closeDeleteModal}
                                >
                                    <FaTimes />
                                </button>
                                <DeleteCaseForm
                                    caseItem={caseToDelete}
                                    modalId="delete_case_modal"
                                    refetch={refetch}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AllCases;
