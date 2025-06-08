import React, { useState, useEffect } from "react";

 import { Link } from "react-router-dom"; 
import { useFetchCasesQuery } from "../../../../features/case/caseAPI";
import { useCreateCaseDocumentMutation } from "../../../../features/casedocument/casedocmentapi";
import { useCreateLogMutation } from "../../../../features/log/logsapi";
import { Toaster, toast } from "sonner";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';

import { judiciaryTemplates, PdfTemplateFunction } from "../../../../utils/judiciaryTemplates";

// --- Icon Components (Heroicons - https://heroicons.com/) ---
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
);
const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
    </svg>
);
const PlusCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);
const DocumentCheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.165 9.335L10.5 12.75M10.5 12.75l1.688-1.688M10.5 12.75V18m6.75-6H21M8.25 6H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
);
const SpinnerIcon = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);
const HashtagIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h13.5m-13.5 4.5h13.5m-13.5 4.5h13.5m0-13.5L12 3m0 0L8.25 4.5M12 3v18" />
    </svg>
);
const FileTextIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25M9.75 9.75h4.5M9.75 12.75h4.5M9.75 15.75h4.5M5.625 19.5h12.75a1.875 1.875 0 001.875-1.875V6.75A1.875 1.875 0 0018.375 4.5H5.625A1.875 1.875 0 003.75 6.75v11.25c0 1.036.84 1.875 1.875 1.875z" />
    </svg>
);
const RouteIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const Cog6ToothIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.646.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.333.183-.582.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const CheckIconMini = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);
const ChevronRightIconMini = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
);
const ExclamationTriangleIcon = ({ className = "w-12 h-12" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
);
const FolderPlusIcon = ({ className = "w-12 h-12" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m3.75 1.5H15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 15 4.5h-4.5m0 0V9a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 9V6.75A2.25 2.25 0 0 1 5.25 4.5H7.5" />
    </svg>
);


interface DocumentUploadProps {
    onClose: () => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onClose }) => {
    // GET isError and error from the hook
    const { data: cases, isLoading, isError, error } = useFetchCasesQuery();
    const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [createCaseDocument] = useCreateCaseDocumentMutation();
    const [createLog] = useCreateLogMutation();
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [pages, setPages] = useState<string[]>([""]);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    
    useEffect(() => {
    }, [cases, isLoading, selectedCaseId]);

    useEffect(() => {
        if (selectedTemplate) {
            const template = judiciaryTemplates.find(t => t.name === selectedTemplate);
            if (template) {
                const textContent = extractTextFromTemplate(template.templateFunction);
                setPages([textContent]);
            }
        } else {
            setPages([""]);
        }
    }, [selectedTemplate]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = event.target.files?.[0];
        if (uploadedFile) {
            setFile(uploadedFile);
        }
    };

    const handleUpload = async () => {
        if (!selectedCaseId || !file) {
            toast.error("Please select a case and choose a document to upload.");
            return;
        }
        setIsUploading(true);
        const formData = new FormData();
        formData.append("case_id", selectedCaseId.toString());
        formData.append("document_name", file.name);
        formData.append("file", file);

        try {
            await createCaseDocument(formData).unwrap();
            await createLog({ action: `Uploaded document: ${file.name} for case ID ${selectedCaseId}` });
            toast.success("Document uploaded successfully!");
            resetForm();
            onClose();
        } catch (err) {
            console.error("Failed to upload document:", err);
            toast.error("Failed to upload document. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleAddPage = () => {
        setPages([...pages, ""]);
    };

    const handlePageChange = (index: number, value: string) => {
        const newPages = [...pages];
        newPages[index] = value;
        setPages(newPages);
    };

    const handleCreateDocument = async () => {
        if (!selectedCaseId) {
            toast.error("Please select a case before creating a document.");
            return;
        }
        if (pages.every(page => page.trim() === "")) {
            toast.error("Cannot create an empty document. Please add content or select a template.");
            return;
        }

        setIsGeneratingPdf(true);
        try {
            const pdf = new jsPDF();
            let y = 20;
            const lineHeight = 7;
            const margin = 15;
            const pageHeight = pdf.internal.pageSize.getHeight();
            pdf.setFontSize(10);

            pages.forEach((pageContent, index) => {
                if (index > 0) {
                    pdf.addPage();
                    y = margin;
                }
                const availableWidth = pdf.internal.pageSize.getWidth() - 2 * margin;
                const lines = pdf.splitTextToSize(pageContent, availableWidth);

                lines.forEach((line: string) => {
                    if (y > pageHeight - margin) {
                        pdf.addPage();
                        y = margin;
                    }
                    pdf.text(line, margin, y);
                    y += lineHeight;
                });
            });

            const documentBlob = pdf.output('blob');
            const documentName = selectedTemplate ? `${selectedTemplate.replace(/\s+/g, '_')}.pdf` : `custom_document_${Date.now()}.pdf`;

            const formData = new FormData();
            formData.append("case_id", selectedCaseId.toString());
            formData.append("document_name", documentName);
            formData.append("file", documentBlob, documentName);

            await createCaseDocument(formData).unwrap();
            await createLog({ action: `Created document: ${documentName} for case ID ${selectedCaseId}` });
            toast.success("Document created and uploaded successfully!");
            resetForm();
            onClose();
        } catch (err: unknown) {
            console.error("Failed to generate PDF:", err);
            toast.error("Failed to generate PDF and upload. Please try again.");
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    const extractTextFromTemplate = (templateFunction: PdfTemplateFunction): string => {
        const functionString = templateFunction.toString();
        const textRegex = /doc\.text\(([^)]*)\)/g;
        let match;
        let allText = "";
        while ((match = textRegex.exec(functionString)) !== null) {
            const args = match[1].split(",").map(arg => arg.trim());
            const text = args[0].replace(/^['"`]|['"`]$/g, '');
            allText += text + "\n";
        }
        return allText.trim();
    };

    const resetForm = () => {
        setFile(null);
        setSelectedTemplate(null);
        setPages([""]);
        setSearchTerm("");
    };

    const filteredCases = cases?.filter(c =>
        c.case_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.case_track_number.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const inputBaseClass = "block w-full p-3 text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 placeholder-gray-400 dark:placeholder-gray-500";
    const buttonBaseClass = "flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-4 transition-all duration-150 ease-in-out";
    const primaryButtonClass = `${buttonBaseClass} bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:ring-blue-300 dark:focus:ring-blue-800 disabled:opacity-60 disabled:cursor-not-allowed`;
    const secondaryButtonClass = `${buttonBaseClass} bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 focus:ring-indigo-300 dark:focus:ring-indigo-900 disabled:opacity-60 disabled:cursor-not-allowed`;
    const successButtonClass = `${buttonBaseClass} bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 focus:ring-green-300 dark:focus:ring-green-800 disabled:opacity-60 disabled:cursor-not-allowed`;
    
    const headerIconClass = "w-5 h-5 inline mr-2 align-middle";
    const cellIconClass = "w-4 h-4 inline mr-1.5 align-middle text-gray-400 dark:text-gray-500";
    const gradientTextClass = "text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500";

    const caseListContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center py-10 text-gray-500 dark:text-gray-400">
                    <SpinnerIcon />
                    <p className="mt-2">Loading cases...</p>
                </div>
            );
        }
        if (isError) {
            
            console.error("Error fetching cases:", error);
            return (
                <div className="flex flex-col items-center justify-center py-10 text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-300 dark:border-red-700">
                    <ExclamationTriangleIcon className="w-12 h-12 mb-3" />
                    <p className="font-semibold text-lg">Could not load cases.</p>
                    <p className="text-sm">Please check your internet connection and try again.</p>
                </div>
            );
        }
        if (!cases || cases.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-10 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/30 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <FolderPlusIcon className="w-12 h-12 mb-3 text-blue-500 dark:text-blue-400" />
                    <p className="font-semibold text-lg mb-1">No cases found.</p>
                    <p className="text-sm mb-4">You haven't created any cases yet.</p>
                     
                        
                        <Link to="/my-cases" className={`${primaryButtonClass} px-6`}>
                            Go to My Cases
                        </Link>
                    
                    <button 
                        onClick={() => {
                            // Placeholder for navigation. 
                            // e.g., navigate('/my-cases') or router.push('/my-cases')
                            toast.info("Navigating to 'My Cases' (placeholder)...");
                            // You might want to close the modal after this action too:
                             onClose(); 
                        }}
                        className={`${primaryButtonClass} px-6 py-2 text-sm`}
                    >
                        Go to My Cases to Create One
                    </button>
                </div>
            );
        }
        if (!filteredCases || filteredCases.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-10 text-gray-500 dark:text-gray-400">
                    <SearchIcon /> 
                    <p className="mt-2 font-semibold">No cases match your search "{searchTerm}".</p>
                    <p className="text-sm">Try a different search term.</p>
                </div>
            );
        }

        // Render the table if cases are available and filtered
        return (
            <div className="overflow-x-auto max-h-60 rounded-md border border-gray-200 dark:border-gray-700">
                <table className="w-full text-sm text-left text-gray-600 dark:text-gray-300">
                    <thead className="text-xs text-white uppercase bg-blue-600 dark:bg-blue-700 sticky top-0">
                        <tr>
                            <th scope="col" className="px-4 py-3 whitespace-nowrap">
                                <HashtagIcon className={headerIconClass} />Case ID
                            </th>
                            <th scope="col" className="px-4 py-3 whitespace-nowrap">
                                <FileTextIcon className={headerIconClass} />Case Number
                            </th>
                            <th scope="col" className="px-4 py-3 whitespace-nowrap">
                                <RouteIcon className={headerIconClass} />Track Number
                            </th>
                            <th scope="col" className="px-4 py-3 text-center whitespace-nowrap">
                                <Cog6ToothIcon className={headerIconClass} />Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCases.map((caseItem) => (
                            <tr key={caseItem.case_id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-150">
                                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                    <HashtagIcon className={cellIconClass} />{caseItem.case_id}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <FileTextIcon className={cellIconClass} />{caseItem.case_number}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <RouteIcon className={cellIconClass} />{caseItem.case_track_number}
                                </td>
                                <td className="px-4 py-3 text-center whitespace-nowrap">
                                    <button
                                        onClick={() => setSelectedCaseId(caseItem.case_id)}
                                        className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-150 whitespace-nowrap
                                            ${selectedCaseId === caseItem.case_id 
                                                ? "bg-green-600 text-white hover:bg-green-700" 
                                                : "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"}`}
                                    >
                                        {selectedCaseId === caseItem.case_id ? (
                                            <>
                                                <CheckIconMini className="mr-1.5" /> Selected
                                            </>
                                        ) : (
                                            <>
                                                Select <ChevronRightIconMini className="ml-1.5" />
                                            </>
                                        )}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };


    return (
        <div className="w-full max-w-3xl h-[70vh] mx-auto bg-white dark:bg-slate-900 rounded-xl shadow-2xl text-gray-900 dark:text-gray-100 flex flex-col">
            <Toaster position="top-center" richColors theme="dark" />
            
            <div className="p-4 sm:p-6 border-b dark:border-gray-700">
                <h2 className={`text-2xl sm:text-3xl font-bold text-center ${gradientTextClass}`}>
                    Create Case Document Here
                </h2>
            </div>

            <div className="flex-grow overflow-y-auto p-4 sm:p-6">
                <div className="mb-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                    <h3 className={`text-xl font-bold mb-3 ${gradientTextClass}`}>Select a Case</h3>
                    <div className="relative mb-4">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 dark:text-gray-500">
                            <SearchIcon />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by case number or track number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`${inputBaseClass} pl-10`}
                            disabled={isLoading || isError || !cases || cases.length === 0} // Disable search if no cases or error
                        />
                    </div>

                    {/* RENDER THE CASE LIST OR MESSAGES */}
                    {caseListContent()}
                    
                    {selectedCaseId && !isLoading && !isError && cases && cases.length > 0 && (
                        <p className="mt-3 text-sm text-green-600 dark:text-green-400">
                            Selected Case ID: <span className="font-semibold">{selectedCaseId}</span>
                        </p>
                    )}
                </div>

                {/* Upload and Create Sections (disable if no case selected, or during loading/error of cases) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm ${(!selectedCaseId || isLoading || isError) ? 'opacity-50 pointer-events-none' : ''}`}>
                        <h3 className={`text-xl font-bold mb-4 ${gradientTextClass}`}>Upload Existing Document</h3>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className={`
                                ${inputBaseClass} 
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 dark:file:bg-blue-700 
                                file:text-blue-700 dark:file:text-blue-300
                                hover:file:bg-blue-100 dark:hover:file:bg-blue-600
                                cursor-pointer
                            `}
                            title="Upload file"
                            disabled={!selectedCaseId || isUploading}
                        />
                        <button
                            onClick={handleUpload}
                            className={`${primaryButtonClass} w-full mt-4`}
                            disabled={isUploading || !selectedCaseId || !file}
                        >
                            {isUploading ? <SpinnerIcon /> : <UploadIcon />}
                            {isUploading ? "Uploading..." : "Upload Document"}
                        </button>
                        {isUploading && <p className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">Please wait...</p>}
                    </div>

                    <div className={`p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm ${(!selectedCaseId || isLoading || isError) ? 'opacity-50 pointer-events-none' : ''}`}>
                        <h3 className={`text-xl font-bold mb-4 ${gradientTextClass}`}>Create New Document</h3>
                        <select
                            title="Select template"
                            className={`${inputBaseClass} mb-4`}
                            value={selectedTemplate || ""}
                            onChange={(e) => setSelectedTemplate(e.target.value || null)}
                            disabled={!selectedCaseId || isGeneratingPdf}
                        >
                            <option value="">Start Blank or Select Template</option>
                            {judiciaryTemplates.map((template) => (
                                <option key={template.name} value={template.name}>{template.name}</option>
                            ))}
                        </select>

                        {pages.map((pageContent, index) => (
                            <div key={index} className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-1">
                                    Page {index + 1} Content:
                                </label>
                                <textarea
                                    title={`Content for page ${index + 1}`}
                                    value={pageContent}
                                    onChange={(e) => handlePageChange(index, e.target.value)}
                                    className={`${inputBaseClass} min-h-[150px] resize-y`}
                                    placeholder="Enter content for this page..."
                                    disabled={!selectedCaseId || isGeneratingPdf}
                                />
                            </div>
                        ))}
                        
                        <button
                            onClick={handleAddPage}
                            className={`${secondaryButtonClass} w-full mb-4`}
                            disabled={!selectedCaseId || isGeneratingPdf}
                        >
                            <PlusCircleIcon /> Add New Page
                        </button>

                        <button
                            onClick={handleCreateDocument}
                            className={`${successButtonClass} w-full`}
                            disabled={isGeneratingPdf || !selectedCaseId || pages.every(p => p.trim() === "")}
                        >
                            {isGeneratingPdf ? <SpinnerIcon /> : <DocumentCheckIcon />}
                            {isGeneratingPdf ? "Generating PDF..." : "Save Document"}
                        </button>
                        {isGeneratingPdf && <p className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">Please wait while the PDF is being generated...</p>}
                    </div>
                </div>
            </div>

            <div className="p-4 sm:p-6 border-t dark:border-gray-700">
                <button
                    onClick={onClose}
                    className="w-full sm:w-auto block mx-auto text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default DocumentUpload;