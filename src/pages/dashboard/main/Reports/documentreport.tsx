import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables, TooltipItem } from 'chart.js';
import { AiOutlineFile, AiOutlineDownload } from 'react-icons/ai';
import { BiFile } from 'react-icons/bi';
import { useFetchCaseDocumentsQuery } from '../../../../features/casedocument/casedocmentapi';

Chart.register(...registerables);

// Define the structure of a document
interface CaseDocumentDataTypes {
    mime_type: string;
    // Add other properties that are part of CaseDocumentDataTypes
}

interface AnalysisResults {
    keywords: string[];
}

interface DocumentReportProps {
    analysisResults?: AnalysisResults;
}

const DocumentReport: React.FC<DocumentReportProps> = ({ analysisResults }) => {
    const { data: documentsData = [], isLoading: documentsLoading } = useFetchCaseDocumentsQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    const [documentTypesCount, setDocumentTypesCount] = useState<Record<string, number>>({});
    const [totalDownloads, setTotalDownloads] = useState<number>(0);
    const [keywords, setKeywords] = useState<string[]>([]);

    const typeChartRef = useRef<Chart | null>(null);
    const downloadChartRef = useRef<Chart | null>(null);

    useEffect(() => {
        if (analysisResults?.keywords) {
            setKeywords(analysisResults.keywords);
        }
    }, [analysisResults]);

    useEffect(() => {
        if (!documentsLoading && documentsData.length > 0) {
            const typeCount: Record<string, number> = {};
            let totalDownloadsCount = 0;

            // Use CaseDocumentDataTypes for the doc parameter
            documentsData.forEach((doc: CaseDocumentDataTypes) => {
                const type = doc.mime_type.split('/')[1] || 'unknown';
                typeCount[type] = (typeCount[type] || 0) + 1;
                totalDownloadsCount += Math.floor(Math.random() * 100); // Simulated download count
            });

            setDocumentTypesCount(typeCount);
            setTotalDownloads(totalDownloadsCount);
            initializeCharts(typeCount);
        }

        return () => {
            typeChartRef.current?.destroy();
            downloadChartRef.current?.destroy();
        };
    }, [documentsLoading, documentsData]);

    const initializeCharts = (typeCount: Record<string, number>) => {
        const typeChartCtx = document.getElementById('typeChart') as HTMLCanvasElement;
        const downloadChartCtx = document.getElementById('downloadChart') as HTMLCanvasElement;

        if (typeChartCtx) {
            typeChartRef.current?.destroy();
            const labels = Object.keys(typeCount);
            const data = Object.values(typeCount);
            const total = data.reduce((a, b) => a + b, 0);

            typeChartRef.current = new Chart(typeChartCtx, {
                type: 'doughnut',
                data: {
                    labels,
                    datasets: [{
                        data,
                        backgroundColor: ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'],
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'top' },
                        tooltip: {
                            callbacks: {
                                label: (tooltipItem: TooltipItem<'doughnut'>) => {
                                    const value = tooltipItem.raw as number; // Assert raw as number
                                    const percentage = ((value / total) * 100).toFixed(1);
                                    return `${tooltipItem.label}: ${percentage}%`;
                                },
                            },
                        },
                    },
                },
            });
        }

        if (downloadChartCtx) {
            downloadChartRef.current?.destroy();
            downloadChartRef.current = new Chart(downloadChartCtx, {
                type: 'bar',
                data: {
                    labels: Object.keys(typeCount),
                    datasets: [{
                        label: 'Downloads',
                        data: Object.values(typeCount).map(() => Math.floor(Math.random() * 100)),
                        backgroundColor: '#264653',
                        borderWidth: 2,
                        borderColor: '#ffffff',
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                font: { size: 14 },
                                color: '#333333',
                            },
                        },
                        x: {
                            ticks: {
                                font: { size: 14 },
                                color: '#333333',
                            },
                        },
                    },
                    plugins: {
                        legend: { display: true },
                        tooltip: {
                            bodyFont: { size: 14 },
                            titleFont: { size: 16 },
                            backgroundColor: 'rgba(0,0,0,0.8)',
                        },
                    },
                },
            });
        }
    };

    if (documentsLoading) {
        return <div className="text-center mt-20 text-lg font-semibold">Loading report...</div>;
    }

    const totalDocuments = documentsData.length;

    return (
        <div className="bg-gradient-to-br from-blue-50 to-blue-200 min-h-screen p-6">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">📊 Document Report</h2>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    {[
                        { icon: <AiOutlineFile />, label: 'Total Documents', value: totalDocuments, color: 'blue' },
                        { icon: <AiOutlineDownload />, label: 'Total Downloads', value: totalDownloads, color: 'green' },
                        { icon: <BiFile />, label: 'Document Types', value: Object.keys(documentTypesCount).length, color: 'gray' },
                    ].map(({ icon, label, value, color }) => (
                        <div key={label} className={`bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center border-l-4 border-${color}-500`}>
                            {React.cloneElement(icon, { className: `text-${color}-500 text-5xl mx-auto mb-4` })}
                            <h3 className="text-xl font-bold text-gray-800">{label}</h3>
                            <p className="text-3xl font-extrabold text-gray-800">{value}</p>
                        </div>
                    ))}
                </div>

                <ChartSection title="📄 Document Types" chartId="typeChart" />
                <ChartSection title="📥 Downloads per Document Type" chartId="downloadChart" />

                {analysisResults?.keywords && (
                    <KeywordsSection keywords={keywords} />
                )}

                <ConclusionSection />
            </div>
        </div>
    );
};

const ChartSection: React.FC<{ title: string; chartId: string }> = ({ title, chartId }) => (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 mb-8">
        <h3 className="text-xl font-bold text-center mb-4">{title}</h3>
        <div className="h-64">
            <canvas id={chartId}></canvas>
        </div>
    </div>
);

const KeywordsSection: React.FC<{ keywords: string[] }> = ({ keywords }) => (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 mt-8">
        <h3 className="text-xl font-bold text-center mb-4">🔑 Keywords</h3>
        <div className="flex flex-wrap justify-center gap-2">
            {keywords.map((keyword, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 transition duration-200">{keyword}</span>
            ))}
        </div>
    </div>
);

const ConclusionSection = () => (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 mt-8">
        <h3 className="text-xl font-bold text-center mb-4">📝 Conclusion Notes</h3>
        <p className="text-gray-700">
            The document report provides insights into the types of documents available and their respective download counts. 
            The pie chart illustrates the distribution of document types, while the bar graph shows the download frequency for each type. 
            This analysis can help identify which document types are most utilized and guide future document management strategies.
        </p>
    </div>
);

export default DocumentReport;
