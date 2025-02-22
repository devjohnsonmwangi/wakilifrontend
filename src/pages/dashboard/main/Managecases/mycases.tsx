import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';
import { caseAndPaymentAPI, CaseDataTypes, CaseStatus } from "../../../../features/case/caseAPI";
import { useState, useMemo, useEffect, useCallback } from 'react';
import CreateCase from '../../main/Managecases/createcase';
import EditUserCase from '../../main/Managecases/updatecase';
import DeleteCaseForm from '../../main/Managecases/deletecase';
import ViewCaseDetailsModal from './viewsinglecasedetails'; // Import the Modal
import { FaEdit, FaRegWindowRestore, FaPlus, FaSearch, FaTrashAlt, FaInfoCircle } from 'react-icons/fa'; // Import icons

// MyCases component
const MyCases = () => {
    const user = useSelector((state: RootState) => state.user);
    const user_id = user.user?.user_id ?? 0;

    // Fetch user-specific cases data
    const { data: caseData, isLoading: caseLoading, error: caseError, refetch } = caseAndPaymentAPI.useGetUserCasesByUserIdQuery(user_id, {
        refetchOnMountOrArgChange: true,
    });

    const [cases, setCases] = useState<CaseDataTypes[]>([]);
    const [filter, setFilter] = useState({ subject: '', description: '', status: '' });
    const [updateCase] = caseAndPaymentAPI.useUpdateCaseMutation();
    const [editCase, setEditCase] = useState<CaseDataTypes | null>(null);
    const [caseToDelete, setCaseToDelete] = useState<CaseDataTypes | null>(null);
    const [selectedCase, setSelectedCase] = useState<CaseDataTypes | null>(null); // Selected case for details modal
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state

    useEffect(() => {
        if (caseData) {
            setCases(caseData);
        }
    }, [caseData]);

    const handleDeleteCase = (caseItem: CaseDataTypes) => {
        setCaseToDelete(caseItem);
        (document.getElementById('delete_case_modal') as HTMLDialogElement)?.showModal();
    };

    const handleEditCase = (caseItem: CaseDataTypes) => {
        setEditCase(caseItem);
        (document.getElementById('edit_case_modal') as HTMLDialogElement)?.showModal();
    };

    const handleReopenCase = async (caseItem: CaseDataTypes) => {
        try {
            const updatedCase = { ...caseItem, case_status: 'open' as CaseStatus };
            await updateCase(updatedCase);
            setCases((prevCases) =>
                prevCases.map((c) => (c.case_id === caseItem.case_id ? updatedCase : c))
            );
        } catch (error) {
            console.error('Error reopening case', error);
        }
    };

    const filteredCases = useMemo(() => {
        if (!cases) return [];
        return cases.filter(caseItem => {
            const matchesSubject = caseItem.case_number.toLowerCase().includes(filter.subject.toLowerCase());
            const matchesDescription = caseItem.case_description?.toLowerCase().includes(filter.description.toLowerCase());
            const matchesStatus = filter.status ? caseItem.case_status.toLowerCase() === filter.status.toLowerCase() : true;
            return matchesSubject && matchesDescription && matchesStatus;
        });
    }, [cases, filter]);

    const resetFilters = () => {
        setFilter({ subject: '', description: '', status: '' });
    };

    // Function to open the details modal
    const openModal = useCallback((caseItem: CaseDataTypes) => {
        setSelectedCase(caseItem);
        setIsModalOpen(true);
    }, []);

    // Function to close the details modal
    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedCase(null);
    }, []);

    if (caseLoading) {
        return <div className="text-center p-8 text-2xl font-bold text-webcolor">Loading...</div>;
    }

    if (caseError) {
        return <div className="text-center p-8 text-xl text-red-600">Error loading data 😞</div>;
    }

    return (
        <div className='bg-slate-100 min-h-screen'>
            <div className='card mx-auto bg-slate-200 w-full max-w-4xl rounded-md mb-5 border-2'>
                <h2 className="text-center text-xl sm:text-2xl p-4 rounded-t-md text-webcolor font-bold bg-gradient-to-r from-teal-400 to-blue-500 text-white shadow-md">
                    🗂️ My Cases
                </h2>

                {/* Create Case Button */}
                <div className="flex flex-wrap justify-between items-center px-4 py-3 space-x-2 sm:space-x-4">
                    <button
                        className="btn bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:bg-indigo-700 transition duration-300 ease-in-out px-4 py-1 rounded-lg shadow-lg flex items-center"
                        onClick={() => (document.getElementById('create_case') as HTMLDialogElement)?.showModal()}
                    >
                        <FaPlus className="mr-1" /> Create Case
                    </button>
                </div>

                {/* Filter Section */}
                <div className="flex flex-col w-full px-4 py-3 space-y-2">
                    <div className="flex flex-wrap justify-between w-full space-x-2">
                        <div className="flex items-center flex-grow">
                            <FaSearch />
                            <input
                                type="text"
                                placeholder="Search by Case Number"
                                value={filter.subject}
                                onChange={(e) => setFilter({ ...filter, subject: e.target.value })}
                                className="input input-bordered w-full"
                            />
                        </div>
                        <div className="flex items-center flex-grow">
                            <FaSearch />
                            <input
                                type="text"
                                placeholder="Search by Description"
                                value={filter.description}
                                onChange={(e) => setFilter({ ...filter, description: e.target.value })}
                                className="input input-bordered w-full"
                            />
                        </div>
                        <div className="flex items-center flex-grow">
                            <FaSearch />
                            <select
                                title='status'
                                value={filter.status}
                                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                                className="input input-bordered w-full"
                            >
                                <option value="">Select Status</option>
                                <option value="open">Open</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>
                    </div>

                    {/* Reset Filters Button */}
                    <button
                        className="btn bg-green-800 text-white font-semibold hover:bg-green-700 transition duration-300 ease-in-out w-full py-2 rounded-lg shadow-lg"
                        onClick={resetFilters}
                    >
                        Reset Filters
                    </button>
                </div>

                <div className="overflow-x-auto px-4 py-2">
                    {filteredCases.length > 0 ? (
                        <table className="table-auto w-full shadow-lg bg-white rounded-lg">
                            <thead className="bg-green-800 text-white">
                                <tr>
                                    <th className="px-4 py-2 text-left text-sm sm:text-base">Case ID 📑</th>
                                    <th className="px-4 py-2 text-left text-sm sm:text-base">Status ⚡</th>
                                    <th className="px-4 py-2 text-left text-sm sm:text-base">Track Number</th>
                                    <th className="px-4 py-2 text-left text-sm sm:text-base">Fees</th>
                                    <th className="px-4 py-2 text-left text-sm sm:text-base">Payment Status</th>
                                    <th className="px-4 py-2 text-left text-sm sm:text-base">Actions 🔧</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCases.map((caseItem) => (
                                    <tr key={caseItem.case_id} className="border-b hover:bg-slate-100 transition duration-300">
                                        <td className="px-4 py-2 text-sm sm:text-base font-medium text-gray-700">{caseItem.case_id} 📜</td>
                                        <td className="px-4 py-2">
                                            <span className={`inline-block px-2 py-1 rounded-full ${(caseItem.case_status === 'open' ? 'bg-green-500' : 'bg-red-500')}`}>
                                                {caseItem.case_status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 text-sm sm:text-base text-gray-600">{caseItem.case_track_number}</td>
                                        <td className="px-4 py-2 text-sm sm:text-base text-gray-600">{caseItem.fee}</td>
                                        <td className="px-4 py-2 text-sm sm:text-base text-gray-600">{caseItem.payment_status}</td>
                                        <td className="px-4 py-2">
                                            <div className="flex items-center space-x-2">
                                                {caseItem.case_status === 'closed' ? (
                                                    <button
                                                        className="btn bg-yellow-500 text-white text-xs flex items-center justify-center w-8 h-8"
                                                        onClick={() => handleReopenCase(caseItem)}
                                                        title="Reopen"
                                                    >
                                                        <FaRegWindowRestore className="text-lg" />
                                                    </button>
                                                ) : (
                                                    <>
                                                        <button
                                                            className="btn bg-blue-500 text-white text-xs flex items-center justify-center w-8 h-8"
                                                            onClick={() => handleEditCase(caseItem)}
                                                            title="Edit"
                                                        >
                                                            <FaEdit className="text-lg" />
                                                        </button>
                                                        <button
                                                            className="btn bg-red-500 text-white text-xs flex items-center justify-center w-8 h-8"
                                                            onClick={() => handleDeleteCase(caseItem)}
                                                            title="Delete"
                                                        >
                                                            <FaTrashAlt className="text-lg" />
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    className="btn bg-green-500 text-white text-xs flex items-center justify-center w-8 h-8"
                                                    onClick={() => openModal(caseItem)}
                                                    title="View Details"
                                                >
                                                    <FaInfoCircle className="text-lg" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center py-6">No cases found. 🤔</div>
                    )}
                </div>
            </div>

            {/* Create case modal */}
            <dialog id='create_case' className="modal">
                <div className="modal-box w-11/12 max-w-5xl">
                    <form method="dialog" className="relative">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <CreateCase />
                </div>
            </dialog>

            {/* Edit Case Modal */}
            <dialog id='edit_case_modal' className="modal">
                <div className="modal-box w-11/12 max-w-5xl">
                    <form method="dialog" className="relative">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <EditUserCase caseItem={editCase} modalId="edit_case_modal" />
                </div>
            </dialog>

            {/* Delete Case Modal */}
            <dialog id='delete_case_modal' className="modal">
                <div className="modal-box">
                    <form method="dialog" className="relative">
                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline text-xs">✕</button>
                    </form>
                    {caseToDelete && <DeleteCaseForm caseItem={caseToDelete} modalId="delete_case_modal" refetch={refetch} />}
                </div>
            </dialog>

            {/* View Case Details Modal */}
            {isModalOpen && selectedCase && (
                <ViewCaseDetailsModal selectedCase={selectedCase} closeModal={closeModal} />
            )}
        </div>
    );
};

export default MyCases;
