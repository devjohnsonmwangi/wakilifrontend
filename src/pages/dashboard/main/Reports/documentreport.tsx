// src/components/DocumentReport.tsx

import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables, TooltipItem } from 'chart.js';
import {
    File, FileArchive, FileImage, FileText, FileVideo, FileCode, Database,
    Download, AlertTriangle, ServerCrash, Info, Tags, ListTree
} from 'lucide-react';
import { useFetchCaseDocumentsQuery } from '../../../../features/casedocument/casedocmentapi';

// Register Chart.js components
Chart.register(...registerables);



interface CaseDocumentDataTypes {
    mime_type?: string;
    
}

// --- THEME & COLOR CONFIGURATION ---

const useTheme = () => {
    const [theme, setTheme] = useState('light');
    useEffect(() => {
        const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const updateTheme = () => setTheme(document.documentElement.classList.contains('dark') || darkQuery.matches ? 'dark' : 'light');
        updateTheme();
        const observer = new MutationObserver(updateTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        darkQuery.addEventListener('change', updateTheme);
        return () => { observer.disconnect(); darkQuery.removeEventListener('change', updateTheme); };
    }, []);
    return theme;
};

const LIGHT_COLORS = ['#3b82f6', '#16a34a', '#f97316', '#ef4444', '#9333ea', '#db2777', '#64748b'];
const DARK_COLORS = ['#60a5fa', '#4ade80', '#fb923c', '#f87171', '#c084fc', '#f472b6', '#94a3b8'];

// --- MODERN UI COMPONENTS ---

const SkeletonLoader = () => (
    <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-80"></div>)}
        </div>
    </div>
);

const ChartSection: React.FC<{ title: string; chartId: string; icon: React.ReactNode }> = ({ title, chartId, icon }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center gap-2 mb-4">
            {icon}
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
        </div>
        <div className="h-72">
            <canvas id={chartId}></canvas>
        </div>
    </div>
);


const getIconForMimeType = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('pdf')) return FileText;
    if (['jpeg', 'png', 'gif', 'svg', 'webp'].some(ext => lowerType.includes(ext))) return FileImage;
    if (['zip', 'rar', '7z', 'tar'].some(ext => lowerType.includes(ext))) return FileArchive;
    if (['mp4', 'mov', 'avi', 'mkv', 'webm'].some(ext => lowerType.includes(ext))) return FileVideo;
    if (['html', 'css', 'javascript', 'json', 'typescript'].some(ext => lowerType.includes(ext))) return FileCode;
    return File; // Default icon
};


const DocumentReport: React.FC<{ analysisResults?: { keywords: string[] } }> = ({ analysisResults }) => {
    const theme = useTheme();
    const { data: documentsData = [], isLoading, isError, error, refetch } = useFetchCaseDocumentsQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    const [summary, setSummary] = useState<{ total: number; types: number; downloads: number }>({ total: 0, types: 0, downloads: 0 });
    const [typeDetails, setTypeDetails] = useState<{ name: string; count: number; Icon: React.ElementType }[]>([]);
    const typeChartRef = useRef<Chart | null>(null);
    const countChartRef = useRef<Chart | null>(null);

    useEffect(() => {
        if (!isLoading && documentsData.length > 0) {
            const typeCount: Record<string, number> = {};
            
            documentsData.forEach((doc: CaseDocumentDataTypes) => {
                const type = doc.mime_type?.split('/')[1]?.toLowerCase() || 'unknown';
                typeCount[type] = (typeCount[type] || 0) + 1;
            });

            const totalDownloadsCount = documentsData.length * (Math.floor(Math.random() * 20) + 5);
            
            setSummary({ total: documentsData.length, types: Object.keys(typeCount).length, downloads: totalDownloadsCount });
            
            
            const details = Object.entries(typeCount).map(([name, count]) => ({
                name: name.toUpperCase(),
                count,
                Icon: getIconForMimeType(name),
            }));
            setTypeDetails(details);

            initializeCharts(typeCount, theme);
        }

        return () => {
            typeChartRef.current?.destroy();
            countChartRef.current?.destroy();
        };
    }, [isLoading, documentsData, theme]);

    const initializeCharts = (typeCount: Record<string, number>, currentTheme: string) => {
        const typeChartCtx = document.getElementById('typeChart') as HTMLCanvasElement | null;
        const countChartCtx = document.getElementById('countChart') as HTMLCanvasElement | null;
        
        const CHART_COLORS = currentTheme === 'dark' ? DARK_COLORS : LIGHT_COLORS;
        const tickColor = currentTheme === 'dark' ? '#a1a1aa' : '#374151'; 
        const gridColor = currentTheme === 'dark' ? '#3f3f46' : '#e5e7eb';
        const legendColor = currentTheme === 'dark' ? '#d4d4d8' : '#1f2937';

        const labels = Object.keys(typeCount);
        const data = Object.values(typeCount);
        const total = data.reduce((a, b) => a + b, 0);

        if (typeChartCtx) {
            typeChartRef.current = new Chart(typeChartCtx, {
                type: 'doughnut',
                data: { labels, datasets: [{ data, backgroundColor: CHART_COLORS }] },
                options: {
                    responsive: true, maintainAspectRatio: false, cutout: '60%',
                    plugins: {
                        legend: { position: 'bottom', labels: { color: legendColor } },
                        tooltip: {
                            callbacks: {
                                label: (tooltipItem: TooltipItem<'doughnut'>) => {
                                    const value = tooltipItem.raw as number;
                                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                                    return ` ${tooltipItem.label}: ${value} (${percentage}%)`;
                                },
                            },
                        },
                    },
                },
            });
        }

        if (countChartCtx) {
            countChartRef.current = new Chart(countChartCtx, {
                type: 'bar',
                data: { labels, datasets: [{ label: 'Document Count', data, backgroundColor: CHART_COLORS[0], borderRadius: 8 }] },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    scales: { y: { beginAtZero: true, ticks: { color: tickColor }, grid: { color: gridColor } }, x: { ticks: { color: tickColor }, grid: { display: false } } },
                    plugins: { legend: { display: false } },
                },
            });
        }
    };
    
    if (isLoading) return <SkeletonLoader />;

    if (isError) {
        const errorMessage = (error && 'data' in error) ? JSON.stringify(error.data) : 'An unknown error occurred.';
        return (
            <div className="flex flex-col items-center justify-center p-10 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800">
                <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
                <h3 className="text-xl font-semibold text-red-800 dark:text-red-300">Failed to Load Documents</h3>
                <p className="text-red-600 dark:text-red-400 mt-2 mb-6 max-w-md text-center">{errorMessage}</p>
                <button onClick={() => refetch()} className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-all">Try Again</button>
            </div>
        );
    }
    
    if (documentsData.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-10 bg-gray-50 dark:bg-gray-800/20 rounded-2xl border-dashed border-gray-300 dark:border-gray-700">
                <ServerCrash className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No Documents Found</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">There are no documents available to generate a report.</p>
            </div>
        );
    }

    const statCards = [
        { icon: File, label: 'Total Documents', value: summary.total, color: 'from-blue-500 to-sky-600' },
        { icon: Download, label: 'Total Downloads', value: summary.downloads, color: 'from-green-500 to-emerald-600', note: '(simulated)' },
        { icon: Database, label: 'Document Types', value: summary.types, color: 'from-purple-500 to-violet-600' },
    ];
    
    return (
        <div className="w-full space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map(({ icon: Icon, label, value, color, note }) => (
                    <div key={label} className={`relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg`}>
                        <div className="flex justify-between items-start">
                            <div className='space-y-1'>
                                <p className="font-semibold">{label}</p>
                                <p className="text-4xl font-bold">{value} <span className="text-lg font-normal opacity-70">{note}</span></p>
                            </div>
                            <Icon className="w-8 h-8 text-white/50" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartSection title="Document Type Distribution" chartId="typeChart" icon={<FileImage className="text-blue-500" />} />
                <ChartSection title="Volume per Document Type" chartId="countChart" icon={<FileText className="text-green-500" />} />
            </div>

            {/* NEW SECTION to use all icons and provide more detail */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <ListTree className="text-teal-500" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Document Breakdown</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {typeDetails.map(({ name, count, Icon }) => (
                        <div key={name} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <Icon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                            <div>
                                <p className="font-semibold text-gray-700 dark:text-gray-200">{name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{count} file(s)</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {analysisResults?.keywords && analysisResults.keywords.length > 0 && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Tags className="text-purple-500" />
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Key Terms Found</h3>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                        {analysisResults.keywords.map((keyword, index) => (
                            <span key={index} className="bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium">{keyword}</span>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg">
                <div className="flex"><div className="flex-shrink-0"><Info className="h-5 w-5 text-blue-500" /></div><div className="ml-3">
                    <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">Conclusion Notes</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                        This report provides insights into the types and volume of documents. The analysis can help identify which document types are most common and guide future document management strategies.
                    </p>
                </div></div>
            </div>
        </div>
    );
};

// Main page container
const DocumentReportPage = () => {
     return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Document Analytics Report</h1>
                    <p className="mt-1 text-md text-gray-500 dark:text-gray-400">An overview of document types and distribution.</p>
                </div>
                <DocumentReport />
            </div>
        </div>
    );
}

export default DocumentReportPage;