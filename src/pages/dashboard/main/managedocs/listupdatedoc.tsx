import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import {
    useFetchCaseDocumentsQuery,
    useUpdateCaseDocumentMutation,
} from "../../../../features/casedocument/casedocmentapi";
import DocumentUpload from './createcasedoc';
import DeleteCaseForm from './deleteCaseForm';

// --- Icon Components (Heroicons - https://heroicons.com/) ---
const SunIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-6.364-.386 1.591-1.591M3 12h2.25m.386-6.364 1.591 1.591A9.953 9.953 0 0 0 12 2.25c-2.647 0-5.058.982-6.973 2.622m13.946 0A9.953 9.953 0 0 1 12 18.75c-2.647 0-5.058-.982-6.973-2.622m0-10.756A9.953 9.953 0 0 0 12 2.25c2.647 0 5.058.982 6.973 2.622" />
    </svg>
);

const MoonIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21c3.978 0 7.44-1.992 9.002-5.001Z" />
    </svg>
);

const PlusIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

const SearchIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
);

const ExternalLinkIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
    </svg>
);

const PencilSquareIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
);

const TrashIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.56 0c-.245.035-.484.076-.72.125m12.072 0M15.36 5.79H8.64m6.72 0V3.122A2.25 2.25 0 0 0 13.122.87H10.88c-.799 0-1.473.447-1.865 1.104l-.5 1.177M15.36 5.79H8.64" />
    </svg>
);

const XMarkIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);

const DocumentTextIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h4.5m-4.5 0H5.625c-.621 0-1.125.504-1.125 1.125v2.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
);

const IdentificationIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
);

const CalendarDaysIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-3.75h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
    </svg>
);

const FolderIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
    </svg>
);

const AdjustmentsHorizontalIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
  </svg>
);

const ExclamationTriangleIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
  </svg>
);
// --- End Icon Components ---

// Helper function to extract error message
function getStructuredErrorMessage(error: unknown): string {
    if (!error) {
        return "An unknown error occurred.";
    }
    if (typeof error === 'string') {
        return error;
    }
    if (typeof error === 'object' && error !== null) {
        const errObj = error as Record<string, unknown>;
        if (
            errObj.data &&
            typeof errObj.data === 'object' &&
            typeof (errObj.data as { message?: unknown }).message === 'string'
        ) {
            return (errObj.data as { message: string }).message;
        }
        if (
            errObj.data &&
            typeof errObj.data === 'object' &&
            typeof (errObj.data as { detail?: unknown }).detail === 'string'
        ) {
            return (errObj.data as { detail: string }).detail;
        }
        if (
            errObj.data &&
            typeof errObj.data === 'object' &&
            typeof (errObj.data as { error?: unknown }).error === 'string'
        ) {
            return (errObj.data as { error: string }).error;
        }
        if (typeof errObj.message === 'string') {
            return errObj.message;
        }
        if (errObj.error && typeof errObj.error === 'string') {
            return errObj.error;
        }
    }
    console.error("Unhandled error structure for message extraction:", error);
    return "An unexpected error occurred. Please check the console for details.";
}


// Modern Modal Wrapper
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    title?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title, size = 'md' }) => {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleEsc);
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-3xl',
        full: 'w-full h-full max-w-full max-h-full rounded-none sm:rounded-lg'
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-300 ease-in-out"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                className={`relative bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-2xl rounded-lg transition-all duration-300 ease-in-out w-full ${sizeClasses[size]} flex flex-col overflow-hidden transform scale-95 opacity-0 animate-modalShow`}
                onClick={(e) => e.stopPropagation()}
            >
                {(title) && (
                    <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                        {title && <h2 className="text-xl font-semibold">{title}</h2>}
                        <button
                            onClick={onClose}
                            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                            aria-label="Close modal"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>
                )}
                <div className="p-4 sm:p-6 overflow-y-auto flex-grow">
                    {children}
                </div>
            </div>
        </div>
    );
};

const DocumentList: React.FC = () => {
    const { data: documents, isLoading, error, refetch } = useFetchCaseDocumentsQuery();
    const [updateCaseDocument] = useUpdateCaseDocumentMutation();

    const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme');
            return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const handleDownload = (document_url: string) => {
        window.open(document_url, '_blank');
    };

    const openDeleteModal = (document_id: number) => {
        setSelectedDocumentId(document_id);
        setIsDeleteModalOpen(true);
    };

    const handleUpdate = async (document_id: number) => {
        const document = documents?.find((doc) => doc.document_id === document_id);
        if (!document) return;
        setSelectedDocumentId(document_id);
        setName(document.document_name);
        setContent(document.document_url);
        setIsUpdateModalOpen(true);
    };

    const closeUpdateModal = () => {
        setIsUpdateModalOpen(false);
        setSelectedDocumentId(null);
    };

    const handleSubmitUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDocumentId) return;
        try {
            await updateCaseDocument({ document_id: selectedDocumentId, document_name: name, document_url: content }).unwrap();
            toast.success("Document updated successfully!");
            refetch();
        } catch (err) {
            console.error("Error updating document:", err);
            toast.error(getStructuredErrorMessage(err) || "Failed to update document");
        } finally {
            closeUpdateModal();
        }
    };

    const openCreateModal = () => setIsCreateModalOpen(true);
    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
        refetch();
    };

    const filteredDocuments = documents
        ? documents.filter(document => {
            if (!document) return false;
            const docName = document.document_name || '';
            const caseId = document.case_id != null ? document.case_id.toString() : '';
            return docName.toLowerCase().includes(searchTerm.toLowerCase()) || caseId.includes(searchTerm.toLowerCase());
        })
        : [];

    const tableHeaders = [
        { text: "Name", icon: DocumentTextIcon, iconClassName: "text-blue-200 dark:text-blue-300" },
        { text: "Doc ID", icon: IdentificationIcon, iconClassName: "text-slate-200 dark:text-slate-300" },
        { text: "Updated", icon: CalendarDaysIcon, iconClassName: "text-slate-200 dark:text-slate-300" },
        { text: "Case ID", icon: FolderIcon, iconClassName: "text-slate-200 dark:text-slate-300" },
        { text: "Actions", icon: AdjustmentsHorizontalIcon, iconClassName: "text-slate-200 dark:text-slate-300" }
    ];

    const inputBaseClass = "block w-full p-3 text-sm text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 placeholder-slate-400 dark:placeholder-slate-500";
    const buttonBaseClass = "flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg focus:outline-none focus:ring-4 transition-all duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed";
    const primaryButtonClass = `${buttonBaseClass} text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:ring-blue-300 dark:focus:ring-blue-800`;
    const tableActionButtonTextClass = "flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-md focus:outline-none focus:ring-2 transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed";


    return (
        <div className="w-full min-h-screen p-4 sm:p-6 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
            <Toaster position="top-center" richColors theme={isDarkMode ? "dark" : "light"} />
            
            <header className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-center">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500 mb-4 sm:mb-0">
                    Document Registry
                </h1>
                <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    aria-label="Toggle dark mode"
                >
                    {isDarkMode ? <SunIcon className="w-5 h-5"/> : <MoonIcon className="w-5 h-5"/>}
                </button>
            </header>

            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
                <button
                    onClick={openCreateModal}
                    className={`${primaryButtonClass} w-full sm:w-auto`}
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Create Document
                </button>
                <div className="relative w-full sm:flex-grow">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 dark:text-slate-500">
                        <SearchIcon />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name or case ID..."
                        className={`${inputBaseClass} pl-10`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Conditional Rendering for Loading, Error, or Table */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-10 text-slate-600 dark:text-slate-400 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-lg font-medium">Loading Documents</p>
                    <p className="text-sm">Please wait a moment...</p>
                </div>
            ) : error ? (
                <div 
                    className="my-8 p-6 sm:p-8 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-600 rounded-md shadow-md flex flex-col items-center text-center"
                    role="alert"
                >
                    <ExclamationTriangleIcon className="w-12 h-12 text-red-500 dark:text-red-600 mb-4" />
                    <h3 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-2">
                        Oops! Something Went Wrong
                    </h3>
                    <p className="text-sm text-red-600 dark:text-red-400 mb-4 max-w-md">
                        We encountered an issue while trying to fetch the documents.
                        The server reported: <strong className="font-medium">{getStructuredErrorMessage(error)}</strong>
                    </p>
                    <button 
                        onClick={() => refetch()} 
                        className={`${primaryButtonClass} bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 focus:ring-red-300 dark:focus:ring-red-700`}
                    >
                        <PlusIcon className="w-4 h-4 mr-1.5 rotate-45 transform" /> {/* Using PlusIcon rotated for a 'retry' feel */}
                        Try Again
                    </button>
                </div>
            ) : (
                <div className="overflow-x-auto bg-white dark:bg-slate-800 shadow-xl rounded-lg">
                    <table className="min-w-full leading-normal">
                        <thead className="bg-blue-600 dark:bg-blue-700 text-white dark:text-blue-50">
                            <tr>
                                {tableHeaders.map(header => (
                                    <th key={header.text} className="px-4 py-3 border-b-2 border-blue-700 dark:border-blue-800 text-left text-xs font-semibold uppercase tracking-wider">
                                        <div className="flex items-center space-x-1.5 whitespace-nowrap">
                                            <header.icon className={`w-4 h-4 ${header.iconClassName || 'text-blue-200 dark:text-blue-300'}`} />
                                            <span>{header.text}</span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDocuments.length > 0 ? filteredDocuments.map(doc => (
                                <tr key={doc.document_id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-150 border-b border-slate-200 dark:border-slate-700 last:border-b-0">
                                    <td className="px-4 py-3 text-sm">
                                        <div className="flex items-center space-x-2">
                                            <DocumentTextIcon className="w-4 h-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                                            <p className="text-slate-900 dark:text-slate-100 whitespace-nowrap font-medium truncate" title={doc.document_name}>
                                                {doc.document_name}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                       <div className="flex items-center space-x-2">
                                            <IdentificationIcon className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                                            <p className="text-slate-600 dark:text-slate-300 whitespace-nowrap">{doc.document_id}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <div className="flex items-center space-x-2">
                                            <CalendarDaysIcon className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                                            <p className="text-slate-600 dark:text-slate-300 whitespace-nowrap">{new Date(doc.updated_at).toLocaleDateString()}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <div className="flex items-center space-x-2">
                                            <FolderIcon className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                                            <p className="text-slate-600 dark:text-slate-300 whitespace-nowrap">{doc.case_id}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleDownload(doc.document_url)}
                                                title="Open/Download Document"
                                                className={`${tableActionButtonTextClass} text-white bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700 focus:ring-sky-300 dark:focus:ring-sky-800`}
                                            >
                                                <ExternalLinkIcon className="w-3.5 h-3.5" /> 
                                                <span>Open</span>
                                            </button>
                                            <button
                                                onClick={() => handleUpdate(doc.document_id)}
                                                title="Update Document"
                                                className={`${tableActionButtonTextClass} text-white bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 focus:ring-amber-300 dark:focus:ring-amber-800`}
                                            >
                                                <PencilSquareIcon className="w-3.5 h-3.5" />
                                                <span>Update</span>
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(doc.document_id)}
                                                title="Delete Document"
                                                className={`${tableActionButtonTextClass} text-white bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 focus:ring-red-300 dark:focus:ring-red-800`}
                                            >
                                                <TrashIcon className="w-3.5 h-3.5" />
                                                <span>Delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={tableHeaders.length} className="text-center py-10 text-slate-500 dark:text-slate-400">
                                        No documents found{searchTerm && " matching your search"}.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal isOpen={isCreateModalOpen} onClose={closeCreateModal} title="Create New Case Document" size="xl">
                <DocumentUpload onClose={closeCreateModal} />
            </Modal>

            <Modal isOpen={isUpdateModalOpen} onClose={closeUpdateModal} title="Update Document Details" size="md">
                <form onSubmit={handleSubmitUpdate} className="space-y-6">
                    <div>
                        <label htmlFor="update-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Document Name:
                        </label>
                        <input
                            type="text"
                            id="update-name"
                            className={inputBaseClass}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="update-url" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Document URL (Reference):
                        </label>
                        <input
                            type="url"
                            id="update-url"
                            className={inputBaseClass}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="e.g., https://example.com/document.pdf"
                        />
                         <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Note: This typically updates a reference URL. To replace the file, use the create/upload functionality.
                        </p>
                    </div>

                    <div className="flex justify-end space-x-3 pt-2">
                        <button
                            type="button"
                            onClick={closeUpdateModal}
                            className={`${buttonBaseClass} bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-200 focus:ring-slate-300 dark:focus:ring-slate-700`}
                        >
                            Cancel
                        </button>
                        <button
                            className={`${primaryButtonClass}`}
                            type="submit"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion" size="sm">
                <DeleteCaseForm
                    caseItem={documents?.find(doc => doc.document_id === selectedDocumentId) || null}
                    onClose={() => setIsDeleteModalOpen(false)}
                    refetch={refetch}
                />
            </Modal>
        </div>
    );
};

export default DocumentList;