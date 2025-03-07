 import React, { useState, useEffect } from 'react';
import Footer from "../../../landingPage/Footer";
import CasesPerMonth from "./casesPerMonth";
import CardsReport from "./CardsReport";
import TicketReport from "./TicketReport";
import VSpecReport from "./appointmentReport";
import DocumentReport from "./documentreport";
import PaymentReport from './paymentreports';

const Reports: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleReports, setVisibleReports] = useState<{ [key: string]: boolean }>({
    cardsReport: true,
    paymentReport: true,
    casesPerMonth: true,
    ticketReport: true,
    vSpecReport: true,
    documentReport: true,
  });

  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    setVisibleReports({
      cardsReport: "cards report".includes(lowerSearchTerm) || lowerSearchTerm === '',
      paymentReport: "payment report".includes(lowerSearchTerm) || lowerSearchTerm === '',
      casesPerMonth: "cases per month".includes(lowerSearchTerm) || lowerSearchTerm === '',
      ticketReport: "ticket report".includes(lowerSearchTerm) || lowerSearchTerm === '',
      vSpecReport: "appointment report".includes(lowerSearchTerm) || "vspec report".includes(lowerSearchTerm) || lowerSearchTerm === '',
      documentReport: "document report".includes(lowerSearchTerm) || lowerSearchTerm === '',
    });
  }, [searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="bg-slate-200 h-full overflow-x-hidden">
      <h1 className="text-center text-2xl p-2 rounded-t-md text-blue-800 font-bold border-b-2 border-slate-500">Welcome to Wakili App Report</h1>

      {/* Search Input */}
      <div className="p-4">
        <input
          type="text"
          placeholder="Search for a report..."
          className="w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Report Components (Conditionally Rendered) */}
      {visibleReports.cardsReport && <CardsReport />}
      {visibleReports.paymentReport && <PaymentReport />}
      {visibleReports.casesPerMonth && <CasesPerMonth />}
      {visibleReports.ticketReport && <TicketReport />}
      {visibleReports.vSpecReport && <VSpecReport />}
      {visibleReports.documentReport && <DocumentReport />}

      <Footer />
    </div>
  );
};

export default Reports;
