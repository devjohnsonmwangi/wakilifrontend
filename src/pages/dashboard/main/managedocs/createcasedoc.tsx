import React, { useState, useEffect } from "react";
import { useFetchCasesQuery } from "../../../../features/case/caseAPI";
import { useCreateCaseDocumentMutation } from "../../../../features/casedocument/casedocmentapi";
import { useCreateLogMutation } from "../../../../features/logs/logsapi";
import { Toaster, toast } from "sonner";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';

import { judiciaryTemplates, PdfTemplateFunction } from "../../../../utils/judiciaryTemplates";

interface DocumentUploadProps {
    onClose: () => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onClose }) => {
    const { data: cases, isLoading } = useFetchCasesQuery();
    const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [createCaseDocument] = useCreateCaseDocumentMutation();
    const [createLog] = useCreateLogMutation();
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [pages, setPages] = useState<string[]>([""]);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const [isUploading, setIsUploading] = useState(false); // New state for upload loading

    useEffect(() => {
        if (!isLoading && cases?.length) {
            setSelectedCaseId(cases[0].case_id);
        }
    }, [cases, isLoading]);

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
            toast.error("Please select a case and upload a document.");
            return;
        }

        setIsUploading(true); // Set uploading state to true

        const formData = new FormData();
        formData.append("case_id", selectedCaseId.toString());
        formData.append("document_name", file.name);
        formData.append("file", file); // Let browser handle File conversion.
        // No longer appending mime_type and file_size.
        console.log("Data being sent (Upload):", {
            case_id: selectedCaseId,
            document_name: file.name,
            file: file,
        });

        try {
            // IMPORTANT: No longer expect a direct URL back. The backend will now manage.
            await createCaseDocument(formData).unwrap();
            await createLog({ action: `Uploaded document: ${file.name}` }); //Removed from azure since is not being stored there
            toast.success("Document uploaded successfully!"); //removed azure
            resetForm();
            onClose();
        } catch (error: any) {
            console.error("Failed to upload document:", error);
            toast.error("Failed to upload document"); //Specific message Removed azure
        } finally {
            setIsUploading(false); // Reset uploading state in finally block
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
            toast.error("Please select a case.");
            return;
        }

        setIsGeneratingPdf(true);

        try {
            const pdf = new jsPDF();
            let y = 20;
            const lineHeight = 10;
            const margin = 20;

            pages.forEach((pageContent, index) => {
                if (index > 0) {
                    pdf.addPage();
                    y = 20;
                }
                const availableWidth = pdf.internal.pageSize.getWidth() - 2 * margin;
                const lines = pdf.splitTextToSize(pageContent, availableWidth);

                lines.forEach(line => {
                    if (y > pdf.internal.pageSize.getHeight() - margin) {
                        pdf.addPage();
                        y = margin;
                    }
                    pdf.text(line, margin, y);
                    y += lineHeight;
                });
            });

            //Convert to blob and send.
            const documentBlob = pdf.output('blob');
            const documentName = selectedTemplate ? `${selectedTemplate}.pdf` : "document.pdf";

            const formData = new FormData();
            formData.append("case_id", selectedCaseId.toString());
            formData.append("document_name", documentName);
            formData.append("file", documentBlob, documentName);

            // Log the form data before sending (for debugging)
            console.log("Data being sent (Create):", {
                case_id: selectedCaseId,
                document_name: documentName,
                file: documentBlob,
            });

            await createCaseDocument(formData).unwrap();
            await createLog({ action: `Created document: ${documentName}` }); // removed azure
            toast.success("Document created and uploaded!"); //removed azure
            resetForm();
            onClose();

        } catch (error: any) {
            console.error("Failed to generate PDF:", error);
            toast.error("Failed to generate PDF and upload"); //Specific message removed azure
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
            const text = args[0].replace(/['"`]/g, '');
            allText += text + "\n";
        }

        return allText;
    };

    const resetForm = () => {
        setFile(null);
        setSelectedTemplate(null);
        setPages([""]);
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <Toaster position="top-center" />
            <h2 className="text-xl font-bold mb-4">Upload or Create Document</h2>
            <input
                type="text"
                placeholder="Search by case number or case truck number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 border rounded w-full mb-4"
            />

            <div className="overflow-x-auto">
                <table className="w-full border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2">Case ID</th>
                            <th className="border p-2">Case Number</th>
                            <th className="border p-2">Case Description</th>
                            <th className="border p-2">Select</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cases?.filter(c =>
                            c.case_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            c.case_track_number.toLowerCase().includes(searchTerm.toLowerCase())
                        ).map((caseItem) => (
                            <tr key={caseItem.case_id} className="hover:bg-gray-100">
                                <td className="border p-2">{caseItem.case_id}</td>
                                <td className="border p-2">{caseItem.case_number}</td>
                                <td className="border p-2">{caseItem.case_description}</td>
                                <td className="border p-2">
                                    <button
                                        onClick={() => setSelectedCaseId(caseItem.case_id)}
                                        className={`px-3 py-1 rounded text-white ${selectedCaseId === caseItem.case_id ? "bg-green-500" : "bg-blue-500"}`}
                                    >
                                        {selectedCaseId === caseItem.case_id ? "Selected" : "Select"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4">
                <h3 className="text-lg font-semibold">Upload a Document</h3>
                <input type="file" onChange={handleFileChange} className="p-2 border rounded w-full mb-4" title="upload file" />
                <button
                    onClick={handleUpload}
                    className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
                    disabled={isUploading} // Disable the button while uploading
                >
                    {isUploading ? "Uploading..." : "Upload Document"} {/* Show loading text */}
                </button>
            </div>

            <div className="mt-6">
                <h3 className="text-lg font-semibold">Create a Document</h3>

                <select
                    title="select template"
                    className="p-2 border rounded w-full mb-4"
                    value={selectedTemplate || ""}
                    onChange={(e) => {
                        setSelectedTemplate(e.target.value);
                    }}
                >
                    <option value="">Select Template</option>
                    {judiciaryTemplates.map((template) => (
                        <option key={template.name} value={template.name}>{template.name}</option>
                    ))}
                </select>

                <button
                    onClick={handleAddPage}
                    className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 mb-4"
                >
                    Add New Page
                </button>

                {pages.map((pageContent, index) => (
                    <div key={index} className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Page {index + 1}:
                        </label>
                        <textarea
                            title="handlechange"
                            value={pageContent}
                            onChange={(e) => handlePageChange(index, e.target.value)}
                            className="p-4 border rounded w-full bg-gray-100 min-h-[200px]"
                        />
                    </div>
                ))}

                <button
                    onClick={handleCreateDocument}
                    className="bg-green-500 text-white px-4 py-2 rounded w-full hover:bg-green-600 mt-4"
                    disabled={isGeneratingPdf}
                >
                    {isGeneratingPdf ? "Generating PDF..." : "Save Document"}
                </button>
                {isGeneratingPdf && <p className="mt-2 text-sm text-gray-500">Please wait while the PDF is being generated...</p>}
            </div>
        </div>
    );
};

export default DocumentUpload;