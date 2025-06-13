import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'sonner';

// --- API and Type Imports ---
import {
    useFetchCaseDocumentsByCaseIdQuery,
    useCreateCaseDocumentMutation, 
    useDeleteCaseDocumentMutation, // Import the delete mutation
    
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
        // Construct the FormData to match the backend's requirements
        formData.append("case_id", String(caseId));
        formData.append("document_name", fileToUpload.name);
        formData.append("file", fileToUpload); // The key is 'file'

        toast.loading("Uploading document...");

        try {
            await uploadDocument(formData).unwrap();
            toast.dismiss();
            toast.success("Document uploaded successfully!");
            setFileToUpload(null);
            // RTK Query tags will auto-refetch the list
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
            // RTK Query tags will auto-refetch the list
        } catch (err) {
            toast.dismiss();
            toast.error("Failed to delete document.");
            console.error("Delete error:", err);
        } finally {
            setConfirmDeleteId(null); // Close the confirmation dialog
        }
    };

    // --- Main Content Rendering Logic ---
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center py-16 text-slate-500 dark:text-slate-400">
                    <Loader className="w-10 h-10 animate-spin text-blue-500" />
                    <p className="mt-3 text-lg font-semibold">Loading Documents...</p>
                </div>
            );
        }

        if (error) {
            if ('status' in error && error.status === 404) {
                 return (
                    <div className="text-center py-16">
                        <FolderOpen className="w-16 h-16 mx-auto text-slate-400 dark:text-slate-500" />
                        <p className="mt-4 text-lg font-semibold text-slate-600 dark:text-slate-300">No Documents Found</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Be the first to upload a document for this case.</p>
                    </div>
                );
            }
            return (
                <div className="p-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg text-center">
                    <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                    <p className="text-lg font-semibold text-red-800 dark:text-red-200">Something went wrong</p>
                    <p className="text-sm text-red-600 dark:text-red-300 mb-4">You might be offline. Please check your connection.</p>
                    <button onClick={() => refetch()} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-semibold">
                        Try Again
                    </button>
                </div>
            );
        }

        if (documents && documents.length > 0) {
            return (
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead><tr>
                            <th className="px-4 py-3 border-b-2 border-slate-200 dark:border-slate-700 bg-blue-50 dark:bg-slate-700 text-left text-xs font-semibold text-blue-900 dark:text-blue-300 uppercase tracking-wider whitespace-nowrap"><FileText size={14} className="inline mr-2"/>Document Name</th>
                            <th className="px-4 py-3 border-b-2 border-slate-200 dark:border-slate-700 bg-blue-50 dark:bg-slate-700 text-left text-xs font-semibold text-blue-900 dark:text-blue-300 uppercase tracking-wider whitespace-nowrap"><CalendarDays size={14} className="inline mr-2"/>Last Updated</th>
                            <th className="px-4 py-3 border-b-2 border-slate-200 dark:border-slate-700 bg-blue-50 dark:bg-slate-700 text-left text-xs font-semibold text-blue-900 dark:text-blue-300 uppercase tracking-wider whitespace-nowrap"><Settings size={14} className="inline mr-2"/>Actions</th>
                        </tr></thead>
                        <tbody>{documents.map(doc => (
                           <tr key={doc.document_id} className="hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors duration-150">
                                <td className="px-4 py-3 border-b border-slate-200 dark:border-slate-600 text-sm"><p className="text-slate-900 dark:text-slate-100 font-medium truncate" title={doc.document_name}>{doc.document_name}</p></td>
                                <td className="px-4 py-3 border-b border-slate-200 dark:border-slate-600 text-sm"><p className="text-slate-600 dark:text-slate-300 whitespace-nowrap">{new Date(doc.updated_at).toLocaleDateString()}</p></td>
                                <td className="px-4 py-3 border-b border-slate-200 dark:border-slate-600 text-sm">
                                    <div className="flex items-center space-x-1">
                                        <button onClick={() => handleDownload(doc.document_url)} title="Open Document" className="p-1.5 rounded text-sky-600 hover:bg-sky-100 dark:text-sky-400 dark:hover:bg-sky-900/50 transition-colors"><ExternalLink size={16} /></button>
                                        {!isReadOnlyUser && (
                                            <button onClick={() => setConfirmDeleteId(doc.document_id)} title="Delete Document" className="p-1.5 rounded text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors"><Trash2 size={16} /></button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}</tbody>
                    </table>
                </div>
            );
        }
        
        return (
            <div className="text-center py-16">
                 <FolderOpen className="w-16 h-16 mx-auto text-slate-400 dark:text-slate-500" />
                 <p className="mt-4 text-lg font-semibold text-slate-600 dark:text-slate-300">No Documents Found</p>
                 <p className="text-sm text-slate-500 dark:text-slate-400">There are no documents currently associated with this case.</p>
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
                    className="relative w-[95vw] sm:w-full max-w-4xl bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[90vh] flex flex-col"
                    initial={{ scale: 0.95, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 30 }}
                    transition={{ duration: 0.2, ease: "easeOut" }} onClick={(e) => e.stopPropagation()}
                >
                    <header className="p-5 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                        <div className="flex items-center justify-between mb-4">
                             <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center">
                                <FileText size={22} className="mr-3 text-blue-600 dark:text-sky-500" />
                                Case Documents
                            </h2>
                            <button onClick={onClose} title="Close" className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400">
                                <X size={20} />
                            </button>
                        </div>

                        {!isReadOnlyUser && (
                            <div onDragEnter={handleDrag}>
                                <input ref={fileInputRef} type="file" id="file-upload-input" className="hidden" onChange={handleFileChange} />
                                { !fileToUpload ? (
                                    <label 
                                        htmlFor="file-upload-input"
                                        className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                                            ${dragActive ? 'border-blue-500 bg-blue-50 dark:bg-slate-700' : 'border-slate-300 dark:border-slate-600 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                                    >
                                        <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                                        <span className="font-semibold text-slate-600 dark:text-slate-300">Click to upload or drag and drop</span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">PDF, DOCX, PNG, or JPG</span>
                                        {dragActive && <div className="absolute inset-0 w-full h-full" onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div>}
                                    </label>
                                ) : (
                                    <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <FileText className="w-5 h-5 text-slate-500 flex-shrink-0"/>
                                            <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{fileToUpload.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                             <button 
                                                onClick={handleFileUpload}
                                                disabled={isUploading}
                                                className="px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold text-xs disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center"
                                            >
                                                {isUploading && <Loader className="w-4 h-4 mr-2 animate-spin"/>}
                                                {isUploading ? 'Uploading...' : 'Upload'}
                                            </button>
                                            <button onClick={() => setFileToUpload(null)} title="Clear selection" className="p-1 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600">
                                                <XCircle className="w-5 h-5"/>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </header>
                    
                    <div className="p-5 overflow-y-auto flex-grow styled-scrollbar">
                        {renderContent()}
                    </div>
                </motion.div>
            </motion.div>

            {confirmDeleteId && (
                <div className="fixed inset-0 z-[102] bg-black/60 flex items-center justify-center p-4" onClick={() => setConfirmDeleteId(null)}>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl max-w-md w-full" onClick={e => e.stopPropagation()}>
                        <div className="text-center">
                            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Confirm Deletion</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                                Are you sure you want to permanently delete this document? This action cannot be undone.
                            </p>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setConfirmDeleteId(null)}
                                disabled={isDeleting}
                                className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-200 dark:bg-slate-600 dark:text-slate-200 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed flex items-center"
                            >
                                {isDeleting && <Loader className="w-4 h-4 mr-2 animate-spin"/>}
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};