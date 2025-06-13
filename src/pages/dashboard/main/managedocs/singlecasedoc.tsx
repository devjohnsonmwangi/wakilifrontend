import React, { useState } from 'react';
import { Toaster, toast } from 'sonner';
import {
    useFetchCaseDocumentsByCaseIdQuery,

    CaseDocument,
} from "../../../../features/casedocument/casedocmentapi";
import DeleteCaseForm from './deleteCaseForm'; // Assuming this is in a reusable location

// --- Reusable Icons (copied from DocumentList for self-containment) ---
const DocumentTextIcon = ({ className = "w-5 h-5" }: { className?: string }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h4.5m-4.5 0H5.625c-.621 0-1.125.504-1.125 1.125v2.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg> );
const CalendarDaysIcon = ({ className = "w-5 h-5" }: { className?: string }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-3.75h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" /></svg> );
const AdjustmentsHorizontalIcon = ({ className = "w-5 h-5" }: { className?: string }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" /></svg> );
const ExternalLinkIcon = ({ className = "w-4 h-4" }: { className?: string }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg> );
const PencilSquareIcon = ({ className = "w-4 h-4" }: { className?: string }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg> );
const TrashIcon = ({ className = "w-4 h-4" }: { className?: string }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.56 0c-.245.035-.484.076-.72.125m12.072 0M15.36 5.79H8.64m6.72 0V3.122A2.25 2.25 0 0 0 13.122.87H10.88c-.799 0-1.473.447-1.865 1.104l-.5 1.177M15.36 5.79H8.64" /></svg> );
const ExclamationTriangleIcon = ({ className = "w-6 h-6" }: { className?: string }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg> );

// Note: Modal component and getStructuredErrorMessage are assumed to be available from a shared utility file.
// If not, they would need to be defined here or imported.

interface CaseDocumentsViewerProps {
    caseId: number;
    isDarkMode?: boolean;
}

const CaseDocumentsViewer: React.FC<CaseDocumentsViewerProps> = ({ caseId, isDarkMode }) => {
    // Fetch documents for the specific case ID
    const { data: documents, isLoading, error, refetch } = useFetchCaseDocumentsByCaseIdQuery(caseId);
    
    // Mutations for deleting
    const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleDownload = (document_url: string) => {
        window.open(document_url, '_blank');
    };

    const openDeleteModal = (document_id: number) => {
        setSelectedDocumentId(document_id);
        setIsDeleteModalOpen(true);
    };
    
    // We can add Update functionality later if needed, keeping it simple for now.
    const handleUpdate = (doc: CaseDocument) => {
        toast.info(`Update functionality for "${doc.document_name}" can be implemented here.`);
        // To implement fully, you'd open a modal similar to DocumentList
    };

    const tableHeaders = [
        { text: "Document Name", icon: DocumentTextIcon },
        { text: "Last Updated", icon: CalendarDaysIcon },
        { text: "Actions", icon: AdjustmentsHorizontalIcon }
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8 text-slate-500 dark:text-slate-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
                Loading Documents...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg text-center">
                <ExclamationTriangleIcon className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-red-700 dark:text-red-300 font-semibold">Failed to load documents.</p>
                <button onClick={() => refetch()} className="mt-2 text-sm text-blue-600 dark:text-sky-500 hover:underline">Try Again</button>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
            <Toaster position="bottom-right" richColors theme={isDarkMode ? "dark" : "light"} />
            
            {documents && documents.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                {tableHeaders.map(header => (
                                    <th key={header.text} className="px-4 py-3 border-b-2 border-slate-200 dark:border-slate-600 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                        <div className="flex items-center">
                                            <header.icon className="mr-2 opacity-80" />
                                            {header.text}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {documents.map(doc => (
                                <tr key={doc.document_id} className="hover:bg-slate-100 dark:hover:bg-slate-700/70 transition-colors duration-150 border-b border-slate-200 dark:border-slate-600 last:border-b-0">
                                    <td className="px-4 py-3 text-sm">
                                        <p className="text-slate-900 dark:text-slate-100 font-medium truncate" title={doc.document_name}>
                                            {doc.document_name}
                                        </p>
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <p className="text-slate-600 dark:text-slate-300 whitespace-nowrap">
                                            {new Date(doc.updated_at).toLocaleDateString()}
                                        </p>
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <div className="flex items-center space-x-2">
                                            <button onClick={() => handleDownload(doc.document_url)} title="Open Document" className="p-1.5 rounded text-sky-600 hover:bg-sky-100 dark:text-sky-400 dark:hover:bg-sky-900/50 transition-colors"><ExternalLinkIcon className="w-4 h-4" /></button>
                                            <button onClick={() => handleUpdate(doc)} title="Update Document" className="p-1.5 rounded text-amber-600 hover:bg-amber-100 dark:text-amber-400 dark:hover:bg-amber-900/50 transition-colors"><PencilSquareIcon className="w-4 h-4" /></button>
                                            <button onClick={() => openDeleteModal(doc.document_id)} title="Delete Document" className="p-1.5 rounded text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors"><TrashIcon className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-6">
                    <p className="text-slate-500 dark:text-slate-400">No documents are currently associated with this case.</p>
                </div>
            )}
            
            {/* The Delete Modal - This assumes a generic Modal wrapper and DeleteCaseForm component exist */}
            {isDeleteModalOpen && (
                 <DeleteCaseForm
                    caseItem={documents?.find((doc: CaseDocument) => doc.document_id === selectedDocumentId) || null}
                    onClose={() => setIsDeleteModalOpen(false)}
                    refetch={refetch}
                />
            )}
        </div>
    );
};

export default CaseDocumentsViewer;