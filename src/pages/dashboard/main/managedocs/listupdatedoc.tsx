import React, { useState } from 'react';
import { Toaster, toast } from 'sonner';
import {
    useFetchCaseDocumentsQuery,
    useUpdateCaseDocumentMutation,
    useDeleteCaseDocumentMutation,
} from "../../../../features/casedocument/casedocmentapi";
import DocumentUpload from './createcasedoc'; // Adjust the path if necessary
import DeleteCaseForm from './DeleteCaseForm'; // Import the DeleteCaseForm

const CloseButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button
        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        onClick={onClick}
        aria-label="Close"
    >
        ✕
    </button>
);

const DocumentList: React.FC = () => {
    const { data: documents, isLoading, error, refetch } = useFetchCaseDocumentsQuery();
    const [updateCaseDocument] = useUpdateCaseDocumentMutation();
    const [deleteCaseDocument] = useDeleteCaseDocumentMutation();
    const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const handleDownload = (document_url: string) => {
        window.open(document_url, '_blank');
    };

    const openDeleteModal = (document_id: number) => {
        setSelectedDocumentId(document_id);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (selectedDocumentId) {
            try {
                await deleteCaseDocument(selectedDocumentId).unwrap();
                toast.success("Document deleted");
                refetch();
                setIsDeleteModalOpen(false);
            } catch (err) {
                console.error("Error deleting document:", err);
                toast.error("Failed to delete document");
            }
        }
    };

    const handleUpdate = async (document_id: number) => {
        const document = documents?.find((doc) => doc.document_id === document_id);
        if (!document) return;
        setSelectedDocumentId(document_id);
        setName(document.document_name);
        setContent(document.document_url);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedDocumentId(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDocumentId) return;
        try {
            await updateCaseDocument({ document_id: selectedDocumentId, document_name: name, document_url: content }).unwrap();
            toast.success("Document updated successfully!");
            refetch();
        } catch (err) {
            console.error("Error updating document:", err);
            toast.error("Failed to update document");
        } finally {
            closeModal();
        }
    };

    const openCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
        refetch();
    };

    const [searchTerm, setSearchTerm] = useState('');

    const filteredDocuments = documents
        ? documents.filter(document => {
            if (!document) return false;
            const name = document.document_name || '';
            const caseId = document.case_id != null ? document.case_id.toString() : '';
            return name.toLowerCase().includes(searchTerm.toLowerCase()) || caseId.includes(searchTerm);
        })
        : [];

    return (
        <div className="w-full h-full p-4 bg-gray-100 min-h-screen relative">
            <Toaster position="top-center" />
            <h1 className="text-3xl font-bold text-gray-800 mb-6 animate-pulse text-center">Manage Documents</h1>

            <div className="mb-4">
                <button
                    onClick={openCreateModal}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 w-full sm:w-auto"
                >
                    Create Case Document
                </button>
            </div>

            {isCreateModalOpen && (
                <div className="w-full">
                    <div className="relative bg-white rounded-lg shadow-xl w-full max-w-full">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Create Case Document</h2>
                        <CloseButton onClick={closeCreateModal} />
                        <DocumentUpload onClose={closeCreateModal} />
                    </div>
                </div>
            )}

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search documents...by case id or document name"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {isLoading && <div className="text-center text-gray-600">Loading documents...</div>}
            {error && (
                <div className="text-center text-red-500">
                    Error: {(error as { message: string })?.message || 'An unexpected error occurred'}
                </div>
            )}

            {!isLoading && !error && documents && (
                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="min-w-full leading-normal">
                        <thead className="bg-blue-600 text-white">
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold uppercase tracking-wider">
                                    Doc ID
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold uppercase tracking-wider">
                                    Date Updated
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold uppercase tracking-wider">
                                    Case ID
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {filteredDocuments.map(document => (
                                <tr key={document.document_id} className="hover:bg-gray-50 transition-colors duration-300">
                                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                        <div className="flex items-center">
                                            <div className="ml-3">
                                                <p className="text-gray-900 whitespace-no-wrap">{document.document_name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{document.document_id}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{new Date(document.updated_at).toLocaleDateString()}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{document.case_id}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleDownload(document.document_url)}
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
                                            >
                                                Open
                                            </button>
                                            <button
                                                onClick={() => handleUpdate(document.document_id)}
                                                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
                                            >
                                                Update
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(document.document_id)}
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && selectedDocumentId !== null && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                    <div className="relative p-5 bg-white rounded-lg shadow-xl w-full max-w-md">
                        <button onClick={closeModal} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Update Document</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                                    Name:
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">
                                    Content:
                                </label>
                                <textarea
                                    id="content"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    rows={10}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
                                    type="submit"
                                >
                                    Update Document
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && selectedDocumentId !== null && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                    <DeleteCaseForm
                        caseItem={documents?.find(doc => doc.document_id === selectedDocumentId) || null}
                        onClose={() => setIsDeleteModalOpen(false)} // Pass the close function
                        refetch={refetch}
                    />
                </div>
            )}
        </div>
    );
};

export default DocumentList;
