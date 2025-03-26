// // src/components/PaymentModal.tsx
// import React, { useState, useEffect, useCallback } from 'react';
// import { PaymentGateway } from '../../../../features/payment/paymentAPI';
// import { toast } from "sonner";
// import { useFetchCasesQuery, CaseDataTypes } from '../../../../features/case/caseAPI';
// import StripePaymentModal from './stripe';
// import CashPaymentModal from './cash';
// import MpesaPayment from './mpesa';

// interface PaymentModalProps {
//     isOpen: boolean; // Ensure this is passed correctly
//     onClose: () => void; // Ensure this is passed correctly
// }

// const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
//     const [paymentAmount, setPaymentAmount] = useState('');
//     const [paymentGateway, setPaymentGateway] = useState<PaymentGateway | null>(null);
//     const [selectedCase, setSelectedCase] = useState<CaseDataTypes | null>(null);
//     const [filterText, setFilterText] = useState('');
//     const { data: cases, isLoading: isCasesLoading, isError: isCasesError, error: casesError } = useFetchCasesQuery();

//     const [isCashModalOpen, setIsCashModalOpen] = useState(false);
//     const [isMpesaModalOpen, setIsMpesaModalOpen] = useState(false);
//     const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);

//     useEffect(() => {
//         if (isCasesError) {
//             console.error('Error fetching cases:', casesError);
//             toast.error('Failed to load cases. Please try again.');
//         }
//     }, [isCasesError, casesError]);

//     const filteredCases = useCallback(() => {
//         if (!cases) return [];

//         const lowerFilter = filterText.toLowerCase();
//         return cases.filter(c =>
//             c.case_number.toLowerCase().includes(lowerFilter) ||
//             c.case_track_number.toLowerCase().includes(lowerFilter) ||
//             c.parties.toLowerCase().includes(lowerFilter)
//         );
//     }, [cases, filterText]);

//     useEffect(() => {
//         if (selectedCase) {
//             setPaymentAmount(selectedCase.fee.toString());
//         } else {
//             setPaymentAmount('');
//             setPaymentGateway(null);
//         }
//     }, [selectedCase]);

//     const handleInitiatePayment = () => {
//         if (!selectedCase) {
//             toast.error('Please select a case.');
//             return;
//         }

//         if (!paymentAmount) {
//             toast.error('Payment amount is required.');
//             return;
//         }

//         if (!paymentGateway) {
//             toast.error('Please select a payment gateway.');
//             return;
//         }

//         const amount = parseFloat(paymentAmount);
//         if (isNaN(amount) || amount <= 0) {
//             toast.error('Please enter a valid payment amount.');
//             return;
//         }

//         switch (paymentGateway) {
//             case 'cash':
//                 setIsCashModalOpen(true);
//                 break;
//             case 'mpesa':
//                 setIsMpesaModalOpen(true);
//                 break;
//             case 'stripe':
//                 setIsStripeModalOpen(true);
//                 break;
//             default:
//                 toast.error('Invalid payment gateway selected.');
//                 break;
//         }
//     };

//     const handleCloseAllModals = () => {
//         setIsCashModalOpen(false);
//         setIsMpesaModalOpen(false);
//         setIsStripeModalOpen(false);
//         resetForm();
//         onClose();
//     };

//     const resetForm = () => {
//         setPaymentAmount('');
//         setSelectedCase(null);
//         setPaymentGateway(null);
//         setFilterText('');
//     };

//     if (!isOpen) return null; // Ensure modal is not rendered when not open

//     return (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/30 dark:bg-neutral-900/80 z-40">
//             <div className="mx-auto max-w-3xl max-h-[80vh] overflow-y-auto rounded-lg bg-white dark:bg-neutral-800 p-6 shadow-lg ring-1 ring-black/5">
//                 <h2 className="text-xl font-bold text-blue-600 mb-4">Initiate Payment</h2>

//                 <div className="mt-4">
//                     <label htmlFor="filterText" className="block text-sm font-bold text-blue-600 mb-1">Filter Cases</label>
//                     <input
//                         type="text"
//                         id="filterText"
//                         className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-neutral-700 rounded-md dark:bg-neutral-900 dark:text-white p-2"
//                         placeholder="Enter case number, track number, or parties"
//                         value={filterText}
//                         onChange={(e) => setFilterText(e.target.value)}
//                     />
//                 </div>

//                 <div className="mt-4">
//                     <h3 className="text-lg font-semibold text-blue-600 mb-2">Please select a case to make a payment:</h3>
//                 </div>

//                 <div className="mt-4 overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
//                         <thead className="bg-blue-600">
//                             <tr>
//                                 <th className="px-4 py-2 text-left text-sm font-bold text-white">Case Number</th>
//                                 <th className="px-4 py-2 text-left text-sm font-bold text-white">Track Number</th>
//                                 <th className="px-4 py-2 text-left text-sm font-bold text-white">Parties</th>
//                                 <th className="px-4 py-2 text-left text-sm font-bold text-white">Action</th>
//                             </tr>
//                         </thead>
//                         <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-neutral-700">
//                             {isCasesLoading ? (
//                                 <tr>
//                                     <td colSpan={4} className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 text-center">Loading cases...</td>
//                                 </tr>
//                             ) : filteredCases().length > 0 ? (
//                                 filteredCases().map((caseItem) => (
//                                     <tr key={caseItem.case_id} className="hover:bg-gray-100 dark:hover:bg-neutral-700 transition duration-150">
//                                         <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{caseItem.case_number}</td>
//                                         <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{caseItem.case_track_number}</td>
//                                         <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{caseItem.parties}</td>
//                                         <td className="px-4 py-2 text-sm text-gray-900 dark:text-white text-right">
//                                             <button
//                                                 onClick={() => setSelectedCase(caseItem)}
//                                                 className={`font-medium text-white px-3 py-1 rounded-md ${selectedCase?.case_id === caseItem.case_id ? 'bg-green-500' : 'bg-blue-500 hover:bg-blue-600'}`}
//                                             >
//                                                 Select
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan={4} className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 text-center">No cases available</td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>

//                 {selectedCase && (
//                     <div className="mt-4">
//                         <p className="text-sm text-gray-500 dark:text-gray-400">Selected Case: <span className="font-medium">{selectedCase.parties}</span></p>
//                         <p className="text-sm text-gray-500 dark:text-gray-400">Case Fee: <span className="font-medium">{selectedCase.fee}</span></p>
//                     </div>
//                 )}

//                 <div className="mt-4">
//                     <label htmlFor="paymentAmount" className="block text-sm font-bold text-blue-600 mb-1">Payment Amount</label>
//                     <input
//                         type="number"
//                         id="paymentAmount"
//                         className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-neutral-700 rounded-md dark:bg-neutral-900 dark:text-white p-2"
//                         placeholder="Enter amount"
//                         value={paymentAmount}
//                         onChange={(e) => setPaymentAmount(e.target.value)}
//                     />
//                 </div>

//                 <div className="mt-4">
//                     <label htmlFor="paymentGateway" className="block text-sm font-bold text-blue-600 mb-1">Payment Gateway</label>
//                     <select
//                         id="paymentGateway"
//                         className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-neutral-700 rounded-md dark:bg-neutral-900 dark:text-white p-2"
//                         value={paymentGateway || ''}
//                         onChange={(e) => setPaymentGateway(e.target.value as PaymentGateway)}
//                     >
//                         <option value="">Select Payment Gateway</option>
//                         <option value="stripe">Stripe</option>
//                         <option value="mpesa">M-Pesa</option>
//                         <option value="cash">Cash</option>
//                     </select>
//                 </div>

//                 <div className="mt-6 flex justify-end space-x-2">
//                     <button
//                         type="button"
//                         className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                         onClick={onClose}
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         type="button"
//                         className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
//                         onClick={handleInitiatePayment}
//                         disabled={!selectedCase || !paymentGateway}
//                     >
//                         Initiate Payment
//                     </button>
//                 </div>
//             </div>

//             {selectedCase && (
//                 <>
//                     <CashPaymentModal
//                         isOpen={isCashModalOpen}
//                         onClose={handleCloseAllModals}
//                         caseId={selectedCase.case_id}
//                         userId={selectedCase.user_id}
//                         amount={paymentAmount ? parseFloat(paymentAmount) : null}
//                     />
//                     <MpesaPayment
//                         isOpen={isMpesaModalOpen}
//                         onClose={handleCloseAllModals}
//                         amount={paymentAmount ? parseFloat(paymentAmount) : null}
//                         caseId={selectedCase.case_id}
//                         userId={selectedCase.user_id}
//                     />
//                     <StripePaymentModal
//                         isOpen={isStripeModalOpen}
//                         onClose={handleCloseAllModals}
//                         caseId={selectedCase.case_id}
//                         userId={selectedCase.user_id}
//                         amount={paymentAmount ? parseFloat(paymentAmount) : null}
//                     />
//                 </>
//             )}
//         </div>
//     );
// };

// export default PaymentModal;
