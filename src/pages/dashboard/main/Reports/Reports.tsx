// src/pages/dashboard/main/Reports/Reports.tsx

import React, { useState, useMemo } from 'react';
//import Footer from "../../../landingPage/Footer";
import { Link } from 'react-router-dom';
import CasesPerMonth from "./casesPerMonth";
import CardsReport from "./CardsReport";
import TicketReport from "./TicketReport";
import AppointmentReportPage from "./appointmentReport";
import DocumentReportPage from "./documentreport";
import PaymentReportPage from './paymentreports';
import { Search, SearchX } from 'lucide-react';

// Configuration for all report components
const reportConfig = [
    {
        key: 'cardsReport',
        title: 'User & Roles Analytics',
        Component: CardsReport,
        searchTerms: 'user roles cards report admin lawyer client',
    },
    {
        key: 'paymentReport',
        title: 'Financial Report: Payments',
        Component: PaymentReportPage,
        searchTerms: 'payment report financial revenue',
    },
    {
        key: 'casesPerMonth',
        title: 'Case Analytics',
        Component: CasesPerMonth,
        searchTerms: 'case analytics report status',
    },
    {
        key: 'ticketReport',
        title: 'Support & Tickets Analytics',
        Component: TicketReport,
        searchTerms: 'ticket report support workload',
    },
    {
        key: 'vSpecReport',
        title: 'Appointment Analytics',
        Component: AppointmentReportPage,
        searchTerms: 'appointment report vspec meeting',
    },
    {
        key: 'documentReport',
        title: 'Document Analytics',
        Component: DocumentReportPage,
        searchTerms: 'document report files analysis',
    },
];

const Reports: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filteredReports = useMemo(() => {
        if (!searchTerm) {
            return reportConfig;
        }
        const lowerSearchTerm = searchTerm.toLowerCase();
        return reportConfig.filter(report =>
            report.searchTerms.toLowerCase().includes(lowerSearchTerm)
        );
    }, [searchTerm]);

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
            {/* MODIFIED: Reduced padding for more content space */}
            <div className="max-w-7xl mx-auto p-2 sm:p-4">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
                        Analytics & Reports
                    </h1>
                    <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
                        An aggregated view of all system analytics. Use the search below to filter reports.
                    </p>
                </div>

                <div className="mb-8">
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search reports (e.g., 'payment', 'user', 'case')..."
                            className="block w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 py-3 pl-10 pr-3 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>

                <div className="space-y-12">
                    {filteredReports.length > 0 ? (
                        filteredReports.map(({ key, title, Component }) => (
                            <section key={key} aria-labelledby={`${key}-title`}>
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                                    <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                                        <h2 id={`${key}-title`} className="text-xl font-semibold text-gray-900 dark:text-white">
                                            {title}
                                        </h2>
                                    </div>
                                    <div className="p-4 sm:p-6">
                                        <Component />
                                    </div>
                                    
                                </div>
                            </section>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center p-12 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                             <SearchX className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No Reports Found</h3>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">
                                Your search for "{searchTerm}" did not match any reports.
                            </p>
                        </div>
                    )}
                </div>
            </div>
                   <footer className="mt-16 pt-8 border-t border-slate-300 dark:border-slate-700 text-center text-slate-500 dark:text-slate-400 text-sm">
                                    <p>© {new Date().getFullYear()} Wakili Inc. All rights reserved.</p>
                                    <p className="mt-1">
                                      <Link to="/terms" className="hover:text-teal-600 dark:hover:text-teal-400">Terms of Service</Link> | <Link to="/privacy-policy" className="hover:text-teal-600 dark:hover:text-teal-400">Privacy Policy</Link> | <Link to="/contactus" className="hover:text-teal-600 dark:hover:text-teal-400">Contact Us</Link>
                                    </p>
                                  </footer>
        </div>
    );
};

export default Reports;