import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'sonner';

// --- API and Type Imports ---
import {
    useFetchCaseDocumentsByCaseIdQuery,
    useCreateCaseDocumentMutation,
    useDeleteCaseDocumentMutation,
} from "../../../../features/casedocument/casedocmentapi";

// --- Icon Imports ---
import {
    X, FileText, CalendarDays, Settings, ExternalLink, Trash2, Loader,
    AlertTriangle, FolderOpen, UploadCloud, XCircle
} from 'lucide-react';

interface CaseDocumentsModalProps {
    isOpen: boolean;
    onClose: () => void;
    caseId: number;
    currentUserRole?: string;
    isDarkMode?: boolean;
}

export const CaseDocumentsModal: React.FC<CaseDocumentsModalProps> = ({ isOpen, onClose, caseId, currentUserRole, isDarkMode }) => {

    // --- Data Fetching & Mutation Hooks ---
    const { data: documents, isLoading, error, refetch } = useFetchCaseDocumentsByCaseIdQuery(caseId);
    const [uploadDocument, { isLoading: isUploading }] = useCreateCaseDocumentMutation();
    const [deleteDocument, { isLoading: isDeleting }] = useDeleteCaseDocumentMutation();

    // --- Local State ---
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // --- Permissions ---
    const isReadOnlyUser = currentUserRole === 'client' || currentUserRole === 'user';

    // --- Event Handlers ---
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFileToUpload(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFileToUpload(e.target.files[0]);
        }
    };

    const handleFileUpload = async () => {
        if (!fileToUpload) {
            toast.error("Please select a file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("case_id", String(caseId));
        formData.append("document_name", fileToUpload.name);
        formData.append("file", fileToUpload);

        toast.loading("Uploading document...");

        try {
            await uploadDocument(formData).unwrap();
            toast.dismiss();
            toast.success("Document uploaded successfully!");
            setFileToUpload(null);
        } catch (err) {
            toast.dismiss();
            toast.error("Upload failed. Please try again.");
            console.error("Upload error:", err);
        }
    };

    const handleDownload = (document_url: string) => {
        window.open(document_url, '_blank');
        toast.success("Document opened in a new tab.");
    };

    const handleDelete = async () => {
        if (!confirmDeleteId) return;
        toast.loading("Deleting document...");

        try {
            await deleteDocument(confirmDeleteId).unwrap();
            toast.dismiss();
            toast.success("Document deleted successfully.");
        } catch (err) {
            toast.dismiss();
            toast.error("Failed to delete document.");
            console.error("Delete error:", err);
        } finally {
            setConfirmDeleteId(null);
        }
    };

    // --- Main Content Rendering Logic ---
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500 dark:text-slate-400">
                    <Loader className="w-12 h-12 animate-spin text-blue-600" />
                    <p className="mt-4 text-lg font-bold">Loading Documents...</p>
                </div>
            );
        }

        if (error) {
            if ('status' in error && error.status === 404) {
                 return (
                    <div className="text-center py-20">
                        <FolderOpen className="w-20 h-20 mx-auto text-slate-400 dark:text-slate-500" />
                        <p className="mt-4 text-xl font-bold text-slate-700 dark:text-slate-300">No Documents Found</p>
                        <p className="text-base text-slate-500 dark:text-slate-400">Be the first to upload a document for this case.</p>
                    </div>
                );
            }
            return (
                <div className="p-8 bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-xl text-center">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-xl font-bold text-red-800 dark:text-red-200">Something went wrong</p>
                    <p className="text-base text-red-600 dark:text-red-300 mb-5">You might be offline. Please check your connection.</p>
                    <button onClick={() => refetch()} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-bold shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500">
                        Try Again
                    </button>
                </div>
            );
        }

        if (documents && documents.length > 0) {
            return (
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg">
                    <table className="min-w-full">
                        {/* --- STYLE UPDATE: Concentrated blue table header --- */}
                        <thead className="bg-blue-600 dark:bg-blue-900">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                                    <FileText size={16} className="inline-block mr-2 align-middle" />
                                    Document Name
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                                    <CalendarDays size={16} className="inline-block mr-2 align-middle" />
                                    Last Updated
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                                    <Settings size={16} className="inline-block mr-2 align-middle" />
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                            {documents.map(doc => (
                               <tr key={doc.document_id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <p className="text-base font-semibold text-slate-900 dark:text-slate-100 truncate" title={doc.document_name}>
                                            {doc.document_name}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <p className="text-sm text-slate-600 dark:text-slate-300">
                                            {new Date(doc.updated_at).toLocaleDateString()}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            <button onClick={() => handleDownload(doc.document_url)} title="Open Document" className="p-2 rounded-md text-sky-600 hover:bg-sky-100 dark:text-sky-400 dark:hover:bg-sky-900/50 transition-colors focus-visible:ring-2 focus-visible:ring-sky-500">
                                                <ExternalLink size={18} />
                                            </button>
                                            {!isReadOnlyUser && (
                                                <button onClick={() => setConfirmDeleteId(doc.document_id)} title="Delete Document" className="p-2 rounded-md text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors focus-visible:ring-2 focus-visible:ring-red-500">
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }

        return (
            <div className="text-center py-20">
                 <FolderOpen className="w-20 h-20 mx-auto text-slate-400 dark:text-slate-500" />
                 <p className="mt-4 text-xl font-bold text-slate-700 dark:text-slate-300">No Documents Found</p>
                 <p className="text-base text-slate-500 dark:text-slate-400">There are no documents currently associated with this case.</p>
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <>
            <Toaster position="bottom-right" richColors theme={isDarkMode ? "dark" : "light"} />
            <motion.div
                className="fixed inset-0 z-[101] bg-black/70 backdrop-blur-sm overflow-y-auto h-full w-full flex items-start sm:items-center justify-center p-4 pt-16 sm:pt-4"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
            >
                <motion.div
                    className="relative w-[95vw] sm:w-full max-w-4xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-transparent max-h-[90vh] flex flex-col"
                    initial={{ scale: 0.95, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 30 }}
                    transition={{ duration: 0.2, ease: "easeOut" }} onClick={(e) => e.stopPropagation()}
                >
                    {/* --- STYLE UPDATE: Concentrated blue header with white text --- */}
                    <header className="p-6 flex-shrink-0 bg-blue-700 dark:bg-blue-800">
                        <div className="flex items-center justify-between mb-4">
                             <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <FileText size={24} className="text-blue-200" />
                                Case Documents
                            </h2>
                            <button onClick={onClose} title="Close" className="p-2 rounded-full text-blue-200 hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors focus-visible:ring-2 focus-visible:ring-white">
                                <X size={22} />
                            </button>
                        </div>

                        {!isReadOnlyUser && (
                            <div onDragEnter={handleDrag} className="p-2 bg-white/10 rounded-lg">
                                <input ref={fileInputRef} type="file" id="file-upload-input" className="hidden" onChange={handleFileChange} />
                                { !fileToUpload ? (
                                    <label
                                        htmlFor="file-upload-input"
                                        className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                                            ${dragActive ? 'border-white bg-white/20' : 'border-blue-400 hover:border-white hover:bg-white/10'}`}
                                    >
                                        <UploadCloud className="w-10 h-10 text-blue-200 mb-2" />
                                        <span className="font-bold text-white">Click to upload or drag and drop</span>
                                        <span className="text-sm text-blue-200 mt-1">PDF, DOCX, PNG, JPG, etc.</span>
                                        {dragActive && <div className="absolute inset-0 w-full h-full" onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div>}
                                    </label>
                                ) : (
                                    <div className="flex items-center justify-between p-3 bg-blue-900/50 rounded-lg">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <FileText className="w-6 h-6 text-blue-200 flex-shrink-0"/>
                                            <span className="text-sm font-bold text-white truncate">{fileToUpload.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                                             <button
                                                onClick={handleFileUpload}
                                                disabled={isUploading}
                                                className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 font-bold text-sm disabled:bg-sky-300 disabled:cursor-not-allowed flex items-center transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-400"
                                            >
                                                {isUploading && <Loader className="w-5 h-5 mr-2 animate-spin"/>}
                                                {isUploading ? 'Uploading' : 'Upload'}
                                            </button>
                                            <button onClick={() => setFileToUpload(null)} title="Clear selection" className="p-2 rounded-full text-blue-200 hover:bg-blue-600 transition-colors focus-visible:ring-2 focus-visible:ring-white">
                                                <XCircle className="w-6 h-6"/>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </header>

                    <div className="p-6 overflow-y-auto flex-grow bg-slate-50 dark:bg-slate-900 styled-scrollbar">
                        {renderContent()}
                    </div>
                </motion.div>
            </motion.div>

            {confirmDeleteId && (
                <div className="fixed inset-0 z-[102] bg-black/60 flex items-center justify-center p-4" onClick={() => setConfirmDeleteId(null)}>
                    <motion.div
                        className="bg-white dark:bg-slate-800 p-7 rounded-xl shadow-xl max-w-md w-full border border-slate-200 dark:border-slate-700"
                        onClick={e => e.stopPropagation()}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        <div className="text-center">
                            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Confirm Deletion</h3>
                            <p className="text-base text-slate-600 dark:text-slate-400 mt-2">
                                Are you sure you want to permanently delete this document? This action cannot be undone.
                            </p>
                        </div>
                        <div className="mt-8 flex justify-end space-x-4">
                            <button
                                onClick={() => setConfirmDeleteId(null)}
                                disabled={isDeleting}
                                className="px-5 py-2.5 text-sm font-bold text-slate-800 bg-slate-200 dark:bg-slate-600 dark:text-slate-100 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 disabled:opacity-60 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="px-5 py-2.5 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed flex items-center shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                            >
                                {isDeleting && <Loader className="w-5 h-5 mr-2 animate-spin"/>}
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </>
    );
};