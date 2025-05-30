import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import { useCreateCaseDocumentMutation } from "../../../../features/casedocument/casedocmentapi";
import { useCreateLogMutation } from "../../../../features/log/logsapi";
import { Toaster, toast } from "sonner";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';

import { judiciaryTemplates, PdfTemplateFunction } from "../../../../utils/judiciaryTemplates";

// --- Icon Components (Heroicons - https://heroicons.com/) ---
// SearchIcon removed as it's no longer used
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
// --- End Icon Components ---

interface GeneralDocumentUploadProps {
    onClose: () => void;
    // Optional: callback for when upload/creation is successful, 
    // could pass back document info if needed.
    // onUploadSuccess?: (documentInfo: any) => void; 
}

const GeneralDocumentUpload: React.FC<GeneralDocumentUploadProps> = ({ onClose }) => {
    const [file, setFile] = useState<File | null>(null);
    const [createDocument, { isLoading: isCreatingDocumentMutation }] = useCreateCaseDocumentMutation();
    const [createLog] = useCreateLogMutation();
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [pages, setPages] = useState<string[]>([""]);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

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
            setSelectedTemplate(null); 
            setPages([""]); 
        }
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error("Please choose a document to upload.");
            return;
        }
        setIsUploading(true);
        const formData = new FormData();
        formData.append("document_name", file.name);
        formData.append("file", file);

        try {
            await createDocument(formData).unwrap(); // No assignment to uploadedDoc
            await createLog({ action: `Uploaded document: ${file.name}` });
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
            const documentName = selectedTemplate 
                ? `${selectedTemplate.replace(/\s+/g, '_')}.pdf` 
                : `custom_document_${Date.now()}.pdf`;

            const formData = new FormData();
            formData.append("document_name", documentName);
            formData.append("file", documentBlob, documentName);

            await createDocument(formData).unwrap(); // No assignment to createdDoc
            await createLog({ action: `Created document: ${documentName}` });
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
    };

    const inputBaseClass = "block w-full p-3 text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 placeholder-gray-400 dark:placeholder-gray-500";
    const buttonBaseClass = "flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-4 transition-all duration-150 ease-in-out";
    const primaryButtonClass = `${buttonBaseClass} bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:ring-blue-300 dark:focus:ring-blue-800 disabled:opacity-60 disabled:cursor-not-allowed`;
    const secondaryButtonClass = `${buttonBaseClass} bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 focus:ring-indigo-300 dark:focus:ring-indigo-900 disabled:opacity-60 disabled:cursor-not-allowed`;
    const successButtonClass = `${buttonBaseClass} bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 focus:ring-green-300 dark:focus:ring-green-800 disabled:opacity-60 disabled:cursor-not-allowed`;
    
    const gradientTextClass = "text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500";

    const isLoadingOperation = isUploading || isGeneratingPdf || isCreatingDocumentMutation;

    return (
        <div className="w-full max-w-3xl h-[70vh] mx-auto bg-white dark:bg-slate-900 rounded-xl shadow-2xl text-gray-900 dark:text-gray-100 flex flex-col">
            <Toaster position="top-center" richColors theme="dark" />
            
            <div className="p-4 sm:p-6 border-b dark:border-gray-700">
                <h2 className={`text-2xl sm:text-3xl font-bold text-center ${gradientTextClass}`}>
                    Upload or Create Document
                </h2>
            </div>

            <div className="flex-grow overflow-y-auto p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm`}>
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
                            disabled={isLoadingOperation}
                        />
                        <button
                            onClick={handleUpload}
                            className={`${primaryButtonClass} w-full mt-4`}
                            disabled={isLoadingOperation || !file}
                        >
                            {isUploading ? <SpinnerIcon /> : <UploadIcon />}
                            {isUploading ? "Uploading..." : "Upload Document"}
                        </button>
                        {isUploading && <p className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">Please wait...</p>}
                    </div>

                    <div className={`p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm`}>
                        <h3 className={`text-xl font-bold mb-4 ${gradientTextClass}`}>Create New Document</h3>
                        <select
                            title="Select template"
                            className={`${inputBaseClass} mb-4`}
                            value={selectedTemplate || ""}
                            onChange={(e) => {
                                setSelectedTemplate(e.target.value || null);
                                if (e.target.value) setFile(null); 
                            }}
                            disabled={isLoadingOperation}
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
                                    className={`${inputBaseClass} min-h-[100px] sm:min-h-[150px] resize-y`}
                                    placeholder="Enter content for this page..."
                                    disabled={isLoadingOperation}
                                />
                            </div>
                        ))}
                        
                        <button
                            onClick={handleAddPage}
                            className={`${secondaryButtonClass} w-full mb-4`}
                            disabled={isLoadingOperation}
                        >
                            <PlusCircleIcon /> Add New Page
                        </button>

                        <button
                            onClick={handleCreateDocument}
                            className={`${successButtonClass} w-full`}
                            disabled={isLoadingOperation || pages.every(p => p.trim() === "")}
                        >
                            {isGeneratingPdf ? <SpinnerIcon /> : <DocumentCheckIcon />}
                            {isGeneratingPdf ? "Generating..." : "Save Document"}
                        </button>
                        {isGeneratingPdf && <p className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">Please wait while the PDF is being generated...</p>}
                         {isCreatingDocumentMutation && !isGeneratingPdf && !isUploading && <p className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">Saving to server...</p>}
                    </div>
                </div>
            </div>

            <div className="p-4 sm:p-6 border-t dark:border-gray-700">
                <button
                    onClick={onClose}
                    disabled={isLoadingOperation}
                    className="w-full sm:w-auto block mx-auto text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors disabled:opacity-50"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default GeneralDocumentUpload;