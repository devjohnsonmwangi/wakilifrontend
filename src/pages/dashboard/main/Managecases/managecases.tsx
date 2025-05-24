import { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { caseAndPaymentAPI, CaseDataTypes, CaseStatus } from "../../../../features/case/caseAPI";
import { Toaster, toast } from 'sonner';
import { logAPI } from "../../../../features/log/logsapi";
import { RootState } from "../../../../app/store";
import AnimatedLoader from "../../../../components/AnimatedLoader";
import { useSelector } from "react-redux";
import {
    FaFileAlt, FaUser, FaEnvelope, FaTimes, FaSearch, FaFilter, // Added FaFilter
    FaPhone, FaIdCard, FaTrashAlt, FaCheckCircle, FaRegWindowRestore, FaMoneyBillAlt, FaInfoCircle, // Added FaMoneyBillAlt, FaInfoCircle
    FaThList // Added FaThList, FaEdit for potential future use or if missed
} from "react-icons/fa";
import DeleteCaseForm from '../../main/Managecases/deletecase';
import ViewCaseDetailsModal from "./ViewCaseDetailsModal";

// Helper function to safely format currency
const formatCurrency = (value: string | number | null | undefined): string => {
    if (value == null) return 'N/A'; // Handles null and undefined
    const num = Number(value);
    if (isNaN(num)) return 'N/A'; // Handles cases where conversion to number fails
    return `KES ${num.toFixed(2)}`;
};


const AllCases = () => {
    const [cases, setCases] = useState<CaseDataTypes[]>([]);
    const [selectedCaseModalData, setSelectedCaseModalData] = useState<CaseDataTypes | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const { data: allUserCasesData, error: rawCaseError, isLoading, refetch } = caseAndPaymentAPI.useFetchCasesQuery(undefined, {
        refetchOnMountOrArgChange: true,
        pollingInterval: 300000,
    });
    const [updateCase] = caseAndPaymentAPI.useUpdateCaseMutation();
    const { user } = useSelector((state: RootState) => state.user);
    const user_id = user?.user_id;
    const [addLog] = logAPI.useCreateLogMutation();

    const [loadingActionId, setLoadingActionId] = useState<string | null>(null);

    const [filters, setFilters] = useState({
        fullName: '',
        email: '',
        description: '',
        status: ''
    });

    const [selectedCaseIds, setSelectedCaseIds] = useState<Set<number>>(new Set());
    const [caseToDelete, setCaseToDelete] = useState<CaseDataTypes | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const errorStatus = (rawCaseError && typeof rawCaseError === 'object' && 'status' in rawCaseError) ? (rawCaseError as { status: number }).status : undefined;
    const caseErrorExists = !!rawCaseError;

    useEffect(() => {
        const is404Error = errorStatus === 404;
        if (is404Error) {
            setCases([]);
        } else if (allUserCasesData) {
            setCases(allUserCasesData);
        } else if (!isLoading && !caseErrorExists) {
            setCases([]);
        }
    }, [allUserCasesData, isLoading, caseErrorExists, errorStatus]);

    const handleUpdateStatus = async (case_id: number, case_status: CaseStatus, actionType: 'close' | 'reopen') => {
        const actionId = `${actionType}-${case_id}`;
        try {
            setLoadingActionId(actionId);
            await updateCase({ case_id, case_status }).unwrap();
            await addLog({ user_id, action: `📜 Case ${case_id} status updated to ${case_status}` }).unwrap();
            toast.success(`🎉 Case ${case_status === 'closed' ? 'closed' : 'reopened'} successfully!`);
            refetch();
        } catch (err) {
            toast.error(`❌ Failed to ${actionType} case`);
            console.error(`Error ${actionType} case:`, err);
        } finally {
            setLoadingActionId(null);
        }
    };

    const handleBulkUpdateStatus = async (case_status: CaseStatus) => {
        const currentSelectedCaseIds = Array.from(selectedCaseIds);
        if (currentSelectedCaseIds.length === 0) {
            toast.info("ℹ️ No cases selected for bulk update.");
            return;
        }
        setLoadingActionId('bulk-update');
        try {
            for (const case_id of currentSelectedCaseIds) {
                await updateCase({ case_id, case_status }).unwrap();
                await addLog({ user_id, action: `📜 Case ${case_id} status updated to ${case_status} (bulk)` }).unwrap();
            }
            toast.success('🎉 Bulk case status updated successfully!');
            setSelectedCaseIds(new Set());
            refetch();
        } catch (err) {
            toast.error('❌ Failed to update cases status in bulk');
            console.error("Bulk update error:", err);
        } finally {
            setLoadingActionId(null);
        }
    };

    const filteredCases = useMemo(() => {
        if (!cases) return [];
        return cases.filter((caseItem) => {
            const userFullName = caseItem.user?.full_name?.toLowerCase() ?? '';
            const userEmail = caseItem.user?.email?.toLowerCase() ?? '';
            const caseDesc = caseItem.case_description?.toLowerCase() ?? '';

            return (
                (filters.fullName ? userFullName.includes(filters.fullName.toLowerCase()) : true) &&
                (filters.email ? userEmail.includes(filters.email.toLowerCase()) : true) &&
                (filters.description ? caseDesc.includes(filters.description.toLowerCase()) : true) &&
                (filters.status ? caseItem.case_status.toLowerCase() === filters.status.toLowerCase() : true)
            );
        });
    }, [cases, filters]);


    const resetFilters = () => {
        setFilters({
            fullName: '',
            email: '',
            description: '',
            status: ''
        });
    };

    const handleCaseSelection = (caseId: number) => {
        setSelectedCaseIds(prevState => {
            const newSelection = new Set(prevState);
            if (newSelection.has(caseId)) {
                newSelection.delete(caseId);
            } else {
                newSelection.add(caseId);
            }
            return newSelection;
        });
    };

    const openViewModal = useCallback((caseItem: CaseDataTypes) => {
        setSelectedCaseModalData(caseItem);
        setIsViewModalOpen(true);
    }, []);

    const closeViewModal = useCallback(() => {
        setIsViewModalOpen(false);
        setSelectedCaseModalData(null);
    }, []);

    const openDeleteModal = (caseItem: CaseDataTypes) => {
        setCaseToDelete(caseItem);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setCaseToDelete(null);
    };

    const renderCasesContent = () => {
        const tableHeaders = (
            <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <tr className="text-left">
                    <th className="p-3 w-10"> {/* Checkbox */} </th>
                    <th className="p-3"><FaIdCard className="inline mr-1" />Case ID</th>
                    <th className="p-3"><FaUser className="inline mr-1" />Client Name</th>
                    <th className="p-3"><FaEnvelope className="inline mr-1" />Client Email</th>
                    <th className="p-3"><FaPhone className="inline mr-1" />Client Phone</th>
                    <th className="p-3"><FaFileAlt className="inline mr-1" />Case Type</th>
                    <th className="p-3"><FaInfoCircle className="inline mr-1" />Status</th>
                    <th className="p-3"><FaMoneyBillAlt className="inline mr-1" />Fee</th>
                    <th className="p-3"><FaMoneyBillAlt className="inline mr-1" />Payment Balance</th>
                    <th className="p-3 text-center"><FaThList className="inline mr-1" />Actions</th>
                </tr>
            </thead>
        );
        const noCasesInSystemMessage = (
             <div className="text-center py-10 px-4 bg-blue-50 border border-blue-200 rounded-md shadow-sm">
                <FaRegWindowRestore className="mx-auto text-5xl text-blue-400 mb-3" />
                <h3 className="text-xl font-semibold text-blue-700 mb-2">
                    No Cases Found
                </h3>
                <p className="text-blue-600">
                    There are currently no cases in the system.
                </p>
                <p className="text-gray-600 text-sm mt-3">
                    You can <button onClick={() => refetch()} className="text-indigo-600 hover:text-indigo-800 underline font-medium">try refreshing</button> or check back later.
                </p>
            </div>
        );


        if (isLoading) {
            return (
                <div className="flex flex-col justify-center items-center py-20 space-y-3">
                    <AnimatedLoader />
                    <p className="text-lg text-gray-600">Loading cases, please wait...</p>
                </div>
            );
        }

        if (caseErrorExists) {
            if (errorStatus === 404) {
                return noCasesInSystemMessage;
            } else {
                return (
                    <div className="text-center py-10 px-4 bg-red-50 border border-red-200 rounded-md shadow-sm">
                        <h3 className="text-xl font-semibold text-red-700 mb-2">
                            <span role="img" aria-label="error" className="mr-2">⚠️</span>
                            Oops! Something went wrong.
                        </h3>
                        <p className="text-red-600">
                            We encountered an issue loading cases (Error: {errorStatus || 'Unknown'}).
                        </p>
                        <p className="text-gray-700 text-sm mt-3">
                            Please check your internet connection and try <button onClick={() => refetch()} className="text-indigo-600 hover:text-indigo-800 underline font-medium">refreshing</button> the data.
                        </p>
                        <p className="text-gray-700 text-sm mt-1">
                            If the problem persists, please contact our support team.
                        </p>
                    </div>
                );
            }
        }
        
        if (!allUserCasesData || allUserCasesData.length === 0) {
             return noCasesInSystemMessage;
        }

        if (filteredCases.length === 0) {
            return (
                <div className="text-center py-10 px-4 bg-yellow-50 border border-yellow-200 rounded-md shadow-sm">
                    <FaSearch className="mx-auto text-5xl text-yellow-400 mb-3" />
                    <h3 className="text-xl font-semibold text-yellow-700 mb-2">
                        No Cases Match Filters
                    </h3>
                    <p className="text-yellow-600">
                        No cases match your current filter criteria.
                    </p>
                    <p className="text-gray-600 text-sm mt-3">
                        Try adjusting your search terms or <button onClick={resetFilters} className="text-indigo-600 hover:text-indigo-800 underline font-medium">resetting the filters</button>.
                    </p>
                </div>
            );
        }

        const openAndInProgressCases = filteredCases.filter(c => c.case_status === 'open' || c.case_status === 'in_progress');
        const closedCases = filteredCases.filter(c => c.case_status === 'closed');

        return (
            <>
                {/* Open and In Progress Cases Table */}
                <div className="mb-10">
                    <h2 className="text-2xl font-semibold mb-4 text-indigo-700">
                        🚀 Open & In Progress Cases ({openAndInProgressCases.length})
                    </h2>
                    {openAndInProgressCases.length > 0 ? (
                        <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200 bg-white">
                            <table className="min-w-full divide-y divide-gray-200">
                                {tableHeaders}
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {openAndInProgressCases.map(caseItem => (
                                        <tr key={caseItem.case_id} className="hover:bg-indigo-50 transition-colors duration-150">
                                            <td className="p-3"><input type="checkbox" className="checkbox checkbox-primary" checked={selectedCaseIds.has(caseItem.case_id)} onChange={() => handleCaseSelection(caseItem.case_id)} /></td>
                                            <td className="p-3 text-sm text-gray-700">{caseItem.case_id}</td>
                                            <td className="p-3 text-sm text-gray-900 font-medium">{caseItem.user?.full_name ?? 'N/A'}</td>
                                            <td className="p-3 text-sm text-gray-700">{caseItem.user?.email ?? 'N/A'}</td>
                                            <td className="p-3 text-sm text-gray-700">{caseItem.user?.phone_number ?? 'N/A'}</td>
                                            <td className="p-3 text-sm text-gray-700">{caseItem.case_type}</td>
                                            <td className="p-3 text-sm"><span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${caseItem.case_status === 'open' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{caseItem.case_status}</span></td>
                                            <td className="p-3 text-sm text-gray-700">{formatCurrency(caseItem.fee)}</td>
                                            <td className="p-3 text-sm text-gray-700">{formatCurrency(caseItem.payment_balance)}</td>
                                            <td className="p-3 text-sm text-gray-700 text-center">
                                                <div className="flex items-center justify-center space-x-2 flex-wrap gap-1">
                                                    <button onClick={() => openViewModal(caseItem)} className="btn btn-xs btn-outline btn-info flex items-center"><FaFileAlt className="mr-1" /> View</button>
                                                    <button onClick={() => handleUpdateStatus(caseItem.case_id, 'closed', 'close')} disabled={loadingActionId === `close-${caseItem.case_id}`} className="btn btn-xs btn-outline btn-success flex items-center">
                                                        {loadingActionId === `close-${caseItem.case_id}` ? <span className="loading loading-spinner loading-xs"></span> : <FaCheckCircle className="mr-1" />} Close
                                                    </button>
                                                    {/* Example of using FaEdit if you add an edit functionality later */}
                                                    {/* <button className="btn btn-xs btn-outline btn-primary flex items-center"><FaEdit className="mr-1" /> Edit</button> */}
                                                    <button onClick={() => openDeleteModal(caseItem)} className="btn btn-xs btn-outline btn-error flex items-center"><FaTrashAlt className="mr-1" /> Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">No open or in-progress cases match your filters.</p>
                    )}
                </div>

                {/* Closed Cases Table */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                        ✅ Closed Cases ({closedCases.length})
                    </h2>
                    {closedCases.length > 0 ? (
                        <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200 bg-white">
                            <table className="min-w-full divide-y divide-gray-200">
                                {tableHeaders}
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {closedCases.map(caseItem => (
                                        <tr key={caseItem.case_id} className="hover:bg-green-50 transition-colors duration-150">
                                            <td className="p-3"><input type="checkbox" className="checkbox checkbox-primary" checked={selectedCaseIds.has(caseItem.case_id)} onChange={() => handleCaseSelection(caseItem.case_id)} /></td>
                                            <td className="p-3 text-sm text-gray-700">{caseItem.case_id}</td>
                                            <td className="p-3 text-sm text-gray-900 font-medium">{caseItem.user?.full_name ?? 'N/A'}</td>
                                            <td className="p-3 text-sm text-gray-700">{caseItem.user?.email ?? 'N/A'}</td>
                                            <td className="p-3 text-sm text-gray-700">{caseItem.user?.phone_number ?? 'N/A'}</td>
                                            <td className="p-3 text-sm text-gray-700">{caseItem.case_type}</td>
                                            <td className="p-3 text-sm"><span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">{caseItem.case_status}</span></td>
                                            <td className="p-3 text-sm text-gray-700">{formatCurrency(caseItem.fee)}</td>
                                            <td className="p-3 text-sm text-gray-700">{formatCurrency(caseItem.payment_balance)}</td>
                                            <td className="p-3 text-sm text-gray-700 text-center">
                                                <div className="flex items-center justify-center space-x-2 flex-wrap gap-1">
                                                    <button onClick={() => openViewModal(caseItem)} className="btn btn-xs btn-outline btn-info flex items-center"><FaFileAlt className="mr-1" /> View</button>
                                                    <button onClick={() => handleUpdateStatus(caseItem.case_id, 'open', 'reopen')} disabled={loadingActionId === `reopen-${caseItem.case_id}`} className="btn btn-xs btn-outline btn-warning flex items-center">
                                                        {loadingActionId === `reopen-${caseItem.case_id}` ? <span className="loading loading-spinner loading-xs"></span> : <FaRegWindowRestore className="mr-1" />} Reopen
                                                    </button>
                                                    <button onClick={() => openDeleteModal(caseItem)} className="btn btn-xs btn-outline btn-error flex items-center"><FaTrashAlt className="mr-1" /> Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                     ) : (
                        <p className="text-gray-500 italic">No closed cases match your filters.</p>
                    )}
                </div>
            </>
        );
    };


    return (
        <>
            <Toaster richColors position="top-right" />
            <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
                <div className="container mx-auto max-w-7xl"> {/* Using a wider container for more space */}
                    <div className="breadcrumbs text-sm mb-6 text-gray-600">
                        <ul>
                            <li><Link to="/dashboard" className="hover:text-indigo-600">🏠 Dashboard</Link></li>
                            <li><Link to="/dashboard/account" className="hover:text-indigo-600">Admin</Link></li>
                            <li>Manage Cases</li>
                        </ul>
                    </div>

                    {/* Filters Section */}
                    <div className="mb-6 p-4 bg-white rounded-lg shadow">
                        <h3 className="text-xl font-semibold text-gray-700 mb-3 flex items-center">
                            <FaFilter className="mr-2 text-indigo-500" /> Filter Cases
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text flex items-center"><FaUser className="mr-1 text-gray-500" />Client Name</span></label>
                                <input type="text" placeholder="Search by Full Name" value={filters.fullName} onChange={(e) => setFilters({ ...filters, fullName: e.target.value })} className="input input-bordered w-full input-sm" />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text flex items-center"><FaEnvelope className="mr-1 text-gray-500" />Client Email</span></label>
                                <input type="text" placeholder="Search by Email" value={filters.email} onChange={(e) => setFilters({ ...filters, email: e.target.value })} className="input input-bordered w-full input-sm" />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text flex items-center"><FaFileAlt className="mr-1 text-gray-500" />Case Description</span></label>
                                <input type="text" placeholder="Search by Description" value={filters.description} onChange={(e) => setFilters({ ...filters, description: e.target.value })} className="input input-bordered w-full input-sm" />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text flex items-center"><FaInfoCircle className="mr-1 text-gray-500" />Status</span></label>
                                <select title="status" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="select select-bordered w-full select-sm">
                                    <option value="">All Statuses</option>
                                    <option value="open">Open</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-4 flex flex-col sm:flex-row justify-start space-y-2 sm:space-y-0 sm:space-x-2">
                            <button onClick={resetFilters} className="btn btn-outline btn-sm btn-error flex items-center">
                                <FaTimes className="mr-2" /> Reset Filters
                            </button>
                            <button
                                className="btn btn-sm btn-primary flex items-center"
                                onClick={() => handleBulkUpdateStatus('closed')}
                                disabled={selectedCaseIds.size === 0 || loadingActionId === 'bulk-update'}
                            >
                                {loadingActionId === 'bulk-update' ? <span className="loading loading-spinner loading-xs"></span> : <FaCheckCircle className="mr-1" />} Close Selected ({selectedCaseIds.size})
                            </button>
                        </div>
                    </div>

                    {/* Cases Content Area */}
                    {renderCasesContent()}

                </div>
            </div>

            {/* Modals */}
            {isViewModalOpen && selectedCaseModalData && (
               <ViewCaseDetailsModal selectedCase={selectedCaseModalData} closeModal={closeViewModal} />
            )}

            {isDeleteModalOpen && caseToDelete && (
                <DeleteCaseForm
                    isOpen={isDeleteModalOpen}
                    onClose={closeDeleteModal}
                    caseItem={caseToDelete}
                    refetch={refetch}
                />
            )}
        </>
    );
};

export default AllCases;