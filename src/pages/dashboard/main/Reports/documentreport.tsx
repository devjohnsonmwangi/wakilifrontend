import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { AiOutlineFile, AiOutlineDownload } from 'react-icons/ai';
import { BiFile } from 'react-icons/bi';
import { useFetchCaseDocumentsQuery } from '../../../../features/casedocument/casedocmentapi';

Chart.register(...registerables);

interface DocumentData {
    mime_type: string;
    [key: string]: any;
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
        if (analysisResults && analysisResults.keywords) {
            setKeywords(analysisResults.keywords);
        }
    }, [analysisResults]);

    useEffect(() => {
        if (!documentsLoading && documentsData.length > 0) {
            const typeCount: Record<string, number> = {};
            let totalDownloadsCount = 0;

            documentsData.forEach((doc: DocumentData) => {
                const type = doc.mime_type.split('/')[1] || 'unknown';
                typeCount[type] = (typeCount[type] || 0) + 1;

                const randomDownloads = Math.floor(Math.random() * 100);
                totalDownloadsCount += randomDownloads;
            });

            setDocumentTypesCount(typeCount);
            setTotalDownloads(totalDownloadsCount);

            initializeCharts(typeCount);
        }

        return () => {
            if (typeChartRef.current) {
                typeChartRef.current.destroy();
                typeChartRef.current = null;
            }
            if (downloadChartRef.current) {
                downloadChartRef.current.destroy();
                downloadChartRef.current = null;
            }
        };
    }, [documentsLoading, documentsData]);

    const initializeCharts = (typeCount: Record<string, number>) => {
        const typeChartCtx = document.getElementById('typeChart') as HTMLCanvasElement;
        if (typeChartCtx) {
            if (typeChartRef.current) {
                typeChartRef.current.destroy();
            }

            // Data to be rendered in floating rectangles
            const labels = Object.keys(typeCount);
            const data = Object.values(typeCount);
            const total = data.reduce((a, b) => a + b, 0);

            // Clear the canvas before rendering rectangles
            const ctx = typeChartCtx.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, typeChartCtx.width, typeChartCtx.height);

                // Define colors for rectangles
                const colors = [
                    '#264653',
                    '#2a9d8f',
                    '#e9c46a',
                    '#f4a261',
                    '#e76f51',
                ];

                // Calculate rectangle dimensions and positions
                const rectWidth = typeChartCtx.width / (labels.length + 1); // Calculate the width of each rectangle
                const rectHeight = typeChartCtx.height * 0.7; // Set the height of each rectangle to 70% of the canvas height
                const xOffset = rectWidth / 2; // Adjust the horizontal position of each rectangle

                let currentX = xOffset; // start x position

                // Render each rectangle
                labels.forEach((label, index) => {
                    const percentage = (data[index] / total) * 100;

                    ctx.fillStyle = colors[index % colors.length];
                    ctx.fillRect(currentX, (typeChartCtx.height - rectHeight) / 2, rectWidth, rectHeight);

                    // Add text to the rectangle
                    ctx.fillStyle = 'white';
                    ctx.font = '12px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText(`${label} (${percentage.toFixed(1)}%)`, currentX + rectWidth / 2, typeChartCtx.height / 2);

                    currentX += rectWidth
                });
            }
        }

        const downloadChartCtx = document.getElementById('downloadChart') as HTMLCanvasElement;
        if (downloadChartCtx) {
            if (downloadChartRef.current) {
                downloadChartRef.current.destroy();
            }

            downloadChartRef.current = new Chart(downloadChartCtx, {
                type: 'bar',
                data: {
                    labels: Object.keys(typeCount),
                    datasets: [
                        {
                            label: 'Downloads',
                            data: Object.values(typeCount).map(() => Math.floor(Math.random() * 100)),
                            backgroundColor: [
                                '#264653',
                                '#2a9d8f',
                                '#e9c46a',
                                '#f4a261',
                                '#e76f51',
                            ],
                            borderWidth: 1,
                            borderColor: '#ffffff',
                            hoverBackgroundColor: '#1a73e8',
                        },
                    ],
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                font: {
                                    size: 14,
                                },
                                color: '#333333',
                            },
                        },
                        x: {
                            ticks: {
                                font: {
                                    size: 14,
                                },
                                color: '#333333',
                            },
                        },
                    },
                    plugins: {
                        legend: {
                            display: false,
                        },
                        tooltip: {
                            bodyFont: {
                                size: 14,
                            },
                            titleFont: {
                                size: 16,
                            },
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
                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center border-l-4 border-blue-500">
                        <AiOutlineFile className="text-blue-500 text-5xl mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-800">Total Documents</h3>
                        <p className="text-3xl font-extrabold text-gray-800">{totalDocuments}</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center border-l-4 border-green-500">
                        <AiOutlineDownload className="text-green-500 text-5xl mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-800">Total Downloads</h3>
                        <p className="text-3xl font-extrabold text-gray-800">{totalDownloads}</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center border-l-4 border-gray-500">
                        <BiFile className="text-gray-500 text-5xl mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-800">Document Types</h3>
                        <p className="text-3xl font-extrabold text-gray-800">{Object.keys(documentTypesCount).length}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 mb-8">
                    <h3 className="text-xl font-bold text-center mb-4">📄 Document Types</h3>
                    <canvas id="typeChart"></canvas>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h3 className="text-xl font-bold text-center mb-4">📥 Downloads per Document Type</h3>
                    <canvas id="downloadChart"></canvas>
                </div>

                {analysisResults && analysisResults.keywords && (
                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 mt-8">
                        <h3 className="text-xl font-bold text-center mb-4">🔑 Keywords</h3>
                        <div className="flex flex-wrap justify-center gap-2">
                            {keywords.map((keyword, index) => (
                                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 transition duration-200">{keyword}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocumentReport;