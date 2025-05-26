// src/components/MpesaPayment.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import {
  useFetchCasesQuery,
  CaseDataTypes as Case, // IMPORTANT: Ensure this type definition includes your backend balance field
                           // e.g., payment_balance?: number | string;
  CaseStatus,
  CaseType,
} from '../../../../features/case/caseAPI';

import {
  useInitiateMpesaStkPushMutation,
  // useFetchPaymentsQuery, // REMOVED: No longer fetching all payments here
} from '../../../../features/payment/paymentAPI';

// --- Custom useDebounce Hook ---
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}
// --- End Custom useDebounce Hook ---

const MPESA_ICON_URL = "https://stagepass.co.ke/theme/images/clients/WEB-LOGOS-14.jpg";
const DEBOUNCE_DELAY = 300; // milliseconds

// !!!!! IMPORTANT !!!!!
// This should be the EXACT field name on your Case object from the backend
// that holds the current outstanding balance.
const BALANCE_FIELD_NAME_FROM_BACKEND = 'payment_balance'; // Example, adjust if needed

// --- Constants for localStorage suggestions ---
const LAST_USED_PHONE_NUMBERS_KEY = 'mpesaPayment_lastUsedPhoneNumbers';
const LAST_USED_EMAILS_KEY = 'mpesaPayment_lastUsedEmails';
const MAX_SUGGESTIONS = 5; // Max number of suggestions to store and display
// --- End Constants for localStorage suggestions ---


interface MpesaPaymentProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CreateMpesaPaymentVariables {
  case_id: number;
  user_id: number;
  amount: number;
  phoneNumber: string;
  customer_email?: string;
}

interface MpesaTransactionDetails {
  success: boolean;
  message: string;
  amount?: string;
  transactionId?: string;
  phoneNumber?: string;
  status?: string;
  payerName?: string;
}

interface ApiError {
  response?: {
    data?: {
      success: boolean;
      message?: string;
      status?: string;
    };
    status?: number;
  };
  message?: string;
}

const MpesaPayment: React.FC<MpesaPaymentProps> = ({ isOpen, onClose }) => {
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [clientSideIsLoading, setClientSideIsLoading] = useState(false);
  const [initiateMpesaStkPush, { isLoading: isMutationLoading }] = useInitiateMpesaStkPushMutation();
  const navigate = useNavigate();
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isFailModalOpen, setIsFailModalOpen] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<CaseStatus | ''>('');
  const [typeFilter, setTypeFilter] = useState<CaseType | ''>('');
  const [stationFilterInput, setStationFilterInput] = useState('');
  const [caseNumberFilterInput, setCaseNumberFilterInput] = useState('');
  const [searchTermInput, setSearchTermInput] = useState('');

  const debouncedStationFilter = useDebounce(stationFilterInput, DEBOUNCE_DELAY);
  const debouncedCaseNumberFilter = useDebounce(caseNumberFilterInput, DEBOUNCE_DELAY);
  const debouncedSearchTerm = useDebounce(searchTermInput, DEBOUNCE_DELAY);

  const { data: casesData, isLoading: isLoadingCases, isError: isErrorCases, error: errorCases } = useFetchCasesQuery();
  const cases = useMemo(() => Array.isArray(casesData) ? casesData : [], [casesData]);

  // --- State for input suggestions ---
  const [lastUsedPhoneNumbers, setLastUsedPhoneNumbers] = useState<string[]>([]);
  const [lastUsedEmails, setLastUsedEmails] = useState<string[]>([]);
  // --- End State for input suggestions ---

  // --- Effect to load suggestions from localStorage ---
  useEffect(() => {
    try {
      const storedPhones = localStorage.getItem(LAST_USED_PHONE_NUMBERS_KEY);
      if (storedPhones) {
        setLastUsedPhoneNumbers(JSON.parse(storedPhones));
      }
    } catch (e) {
      console.error("Failed to load last used phone numbers from localStorage:", e);
      // Optionally clear corrupted data: localStorage.removeItem(LAST_USED_PHONE_NUMBERS_KEY);
    }

    try {
      const storedEmails = localStorage.getItem(LAST_USED_EMAILS_KEY);
      if (storedEmails) {
        setLastUsedEmails(JSON.parse(storedEmails));
      }
    } catch (e) {
      console.error("Failed to load last used emails from localStorage:", e);
      // Optionally clear corrupted data: localStorage.removeItem(LAST_USED_EMAILS_KEY);
    }
  }, []); // Empty dependency array ensures it runs only on mount
  // --- End Effect to load suggestions ---

  // --- Function to update and save last used values ---
  const updateLastUsedValues = (type: 'phone' | 'email', newValue: string) => {
    if (!newValue || !newValue.trim()) return; // Don't save empty or whitespace-only values

    if (type === 'phone') {
      setLastUsedPhoneNumbers(prev => {
        const updated = [newValue, ...prev.filter(p => p !== newValue)].slice(0, MAX_SUGGESTIONS);
        try {
          localStorage.setItem(LAST_USED_PHONE_NUMBERS_KEY, JSON.stringify(updated));
        } catch (e) {
          console.error("Failed to save last used phone numbers to localStorage:", e);
        }
        return updated;
      });
    } else if (type === 'email') {
      setLastUsedEmails(prev => {
        const updated = [newValue, ...prev.filter(e => e !== newValue)].slice(0, MAX_SUGGESTIONS);
        try {
          localStorage.setItem(LAST_USED_EMAILS_KEY, JSON.stringify(updated));
        } catch (e) {
          console.error("Failed to save last used emails to localStorage:", e);
        }
        return updated;
      });
    }
  };
  // --- End Function to update and save last used values ---


  const filteredCases = useMemo(() => {
    if (!Array.isArray(cases) || isLoadingCases) return [];
    let tempFilteredCases = [...cases];

    if (statusFilter) {
      tempFilteredCases = tempFilteredCases.filter(caseItem => caseItem.case_status === statusFilter);
    }
    if (typeFilter) {
      tempFilteredCases = tempFilteredCases.filter(caseItem => caseItem.case_type === typeFilter);
    }
    if (debouncedStationFilter) {
      tempFilteredCases = tempFilteredCases.filter(caseItem =>
        (caseItem.station ?? '').toLowerCase().includes(debouncedStationFilter.toLowerCase())
      );
    }
    if (debouncedCaseNumberFilter) {
      tempFilteredCases = tempFilteredCases.filter(caseItem =>
        caseItem.case_number.toLowerCase().includes(debouncedCaseNumberFilter.toLowerCase())
      );
    }
    if (debouncedSearchTerm) {
      const term = debouncedSearchTerm.toLowerCase();
      tempFilteredCases = tempFilteredCases.filter(caseItem =>
        caseItem.case_number.toLowerCase().includes(term) ||
        (caseItem.case_track_number && caseItem.case_track_number.toLowerCase().includes(term)) ||
        (caseItem.parties ?? '').toLowerCase().includes(term) ||
        (caseItem.station ?? '').toLowerCase().includes(term)
      );
    }

    return tempFilteredCases.filter(caseItem => {
      const balanceValueFromBackend = (caseItem as Case)[BALANCE_FIELD_NAME_FROM_BACKEND as keyof Case];
      let numericBalance = 0;

      if (balanceValueFromBackend !== null && balanceValueFromBackend !== undefined) {
        const parsed = parseFloat(String(balanceValueFromBackend));
        if (!isNaN(parsed)) {
          numericBalance = parsed;
        }
      }
      return numericBalance > 0;
    });
  }, [
    cases,
    isLoadingCases,
    statusFilter,
    typeFilter,
    debouncedStationFilter,
    debouncedCaseNumberFilter,
    debouncedSearchTerm,
  ]);

  useEffect(() => {
    if (selectedCase) {
      const balanceValueFromBackend = (selectedCase as Case)[BALANCE_FIELD_NAME_FROM_BACKEND as keyof Case];
      let currentBalance = 0;

      if (balanceValueFromBackend !== null && balanceValueFromBackend !== undefined) {
        const parsed = parseFloat(String(balanceValueFromBackend));
        if (!isNaN(parsed)) {
          currentBalance = parsed;
        }
      }

      if (currentBalance > 0) {
        setAmount(currentBalance.toFixed(2));
      } else {
        const fee = parseFloat(String(selectedCase.fee));
        if (!isNaN(fee) && fee > 0 && currentBalance <= 0) {
           console.warn(
                `MpesaPayment: Case ID ${selectedCase.case_id} was selected, but its backend balance ('${BALANCE_FIELD_NAME_FROM_BACKEND}': ${balanceValueFromBackend}) is not positive. ` +
                `Falling back to the full case fee for the amount field.`
            );
          setAmount(fee.toFixed(2));
        } else {
          setAmount('0.00');
        }
      }
    } else {
      setAmount('');
    }
  }, [selectedCase]);

  const handlePayment = async () => {
    if (!phoneNumber) {
      toast.error("Phone number is required.");
      setPhoneNumberError("Phone number is required.");
      return;
    }
    if (!selectedCase) {
      toast.error("Case needs to be selected.");
      return;
    }
    if (!amount) {
      toast.error("Amount is required.");
      return;
    }
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error('Please enter a valid positive amount.');
      return;
    }

    const balanceValueFromBackend = (selectedCase as Case)[BALANCE_FIELD_NAME_FROM_BACKEND as keyof Case];
    let maxPayable = 0;
    if (balanceValueFromBackend !== null && balanceValueFromBackend !== undefined) {
        const parsed = parseFloat(String(balanceValueFromBackend));
        if (!isNaN(parsed) && parsed > 0) {
            maxPayable = parsed;
        }
    }
    if (maxPayable <= 0) {
        const fee = parseFloat(String(selectedCase.fee));
        if (!isNaN(fee) && fee > 0) {
            maxPayable = fee;
            console.warn(`MpesaPayment: Submitting for Case ID ${selectedCase.case_id}: Backend balance ('${BALANCE_FIELD_NAME_FROM_BACKEND}') was not positive/available. Using full case fee as max payable.`);
        }
    }
    if (maxPayable <= 0) {
        toast.error("This case appears to have no outstanding balance, or balance information is unavailable. Payment cannot be recorded.");
        return;
    }
    if (numericAmount > maxPayable) {
        toast.error(`Amount (${numericAmount.toFixed(2)}) cannot exceed the outstanding balance of ${maxPayable.toFixed(2)}.`);
        return;
    }


    if (!customerEmail) {
      toast.error("Customer email is required for the receipt.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    const isValid = isValidPhoneNumber(phoneNumber);
    if (!isValid) {
      toast.error("Please enter a valid Kenyan phone number starting with 01 or 07 and has 10 digits.");
      setPhoneNumberError("Please enter a valid Kenyan phone number starting with 01 or 07 and has 10 digits.");
      return;
    }

    setClientSideIsLoading(true);
    setPaymentError(null);
    setPhoneNumberError(null);

    try {
      const paymentData: CreateMpesaPaymentVariables = {
        case_id: selectedCase.case_id,
        user_id: selectedCase.user_id,
        amount: numericAmount,
        phoneNumber: phoneNumber,
        customer_email: customerEmail,
      };
      const response = await initiateMpesaStkPush(paymentData).unwrap() as MpesaTransactionDetails;
      if (response.success) {
        toast.success(response.message);
        setIsSuccessModalOpen(true);
        // Update last used values on successful payment
        updateLastUsedValues('phone', phoneNumber);
        updateLastUsedValues('email', customerEmail);
      } else {
        const rawErrorMessage = response.message || "Payment Failed";
        toast.error(rawErrorMessage);
        setPaymentError(rawErrorMessage);
        setIsFailModalOpen(true);
      }
    } catch (error) {
      const err = error as ApiError;
      console.error("M-Pesa Payment Error:", error);
      let rawErrorMessage = "Failed to initiate M-Pesa payment.";
      if (err.response?.data?.message) {
        rawErrorMessage = err.response.data.message;
      } else if (err.message) {
        rawErrorMessage = err.message;
      } else {
        rawErrorMessage = JSON.stringify(err);
      }
      try {
           const parsedError = JSON.parse(rawErrorMessage);
            rawErrorMessage = parsedError?.data?.message || parsedError.message || rawErrorMessage;
      } catch (parseError) { /* Ignore */ }
      toast.error(rawErrorMessage);
      setPaymentError(rawErrorMessage);
      setIsFailModalOpen(true);
    } finally {
      setClientSideIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedCase(null);
    setPhoneNumber('');
    setAmount('');
    setCustomerEmail('');
    setPaymentError(null);
    setPhoneNumberError(null);
    setIsSuccessModalOpen(false);
    setIsFailModalOpen(false);
    setClientSideIsLoading(false);
    setStatusFilter('');
    setTypeFilter('');
    setStationFilterInput('');
    setCaseNumberFilterInput('');
    setSearchTermInput('');
    onClose();
  };

  const SuccessModal = () => { /* ... same as before ... */
    const [showFireworks, setShowFireworks] = useState(true);
    const encouragementQuotes = [
      "The only way to do great work is to love what you do.",
      "Believe you can and you're halfway there.",
      "The future belongs to those who believe in the beauty of their dreams.",
      "Success is not final, failure is not fatal: It is the courage to continue that counts.",
      "Don't watch the clock; do what it does. Keep going."
    ];
    const randomQuote = encouragementQuotes[Math.floor(Math.random() * encouragementQuotes.length)];

    useEffect(() => {
      const timer = setTimeout(() => {
        setShowFireworks(false);
      }, 5000);
      return () => clearTimeout(timer);
    }, []);

    const fireworkStyle = (): React.CSSProperties => ({
      position: 'absolute', width: '10px', height: '10px',
      transformOrigin: 'bottom center', animation: 'fireworkExplode 2s ease-out forwards, fireworkRise 2s ease-out forwards',
      animationDelay: `${Math.random() * 2}s`, left: `${Math.random() * 100}%`, top: `${Math.random() * 30 + 50}%`,
    });
    const sparkStyle = (): React.CSSProperties => ({
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '50%',
      transformOrigin: 'center', animation: 'fireworkSpark 1s ease-out forwards',
      animationDelay: `${Math.random() * 0.05}s`, backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
    });
    const fireworksContainerStyle: React.CSSProperties = {
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
      overflow: 'hidden', pointerEvents: 'none', zIndex: 1,
    };

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
        <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-700 text-center">
          {showFireworks && (
            <div className="fireworks-container" style={fireworksContainerStyle}>
              {[...Array(15)].map((_, i) => (
                <div key={i} className="firework" style={fireworkStyle()}>
                  {[...Array(10)].map((_, j) => ( <div key={j} className="spark" style={sparkStyle()}></div> ))}
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center justify-center mb-4 relative">
            <svg className="h-12 w-12 text-green-500 animate-bounce relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            <h3 className="text-3xl font-extrabold text-green-600 animate-pulse relative z-10">Payment Successful!</h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-center mb-4 relative z-10">Thank you for your payment! We appreciate you always.</p>
          <p className="text-lg italic text-gray-500 dark:text-gray-400 mb-6 relative z-10">"{randomQuote}"</p>
          <button
            onClick={() => { setIsSuccessModalOpen(false); handleClose(); navigate('/dashboard') }}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-full hover:bg-gradient-to-r hover:from-green-500 hover:to-blue-600 transition duration-300 block mx-auto relative z-10"
          >Okay</button>
        </div>
      </div>
    );
  };

  const FailModal = () => (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
        <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-center justify-center mb-4">
            <svg className="h-12 w-12 text-red-500 animate-shake" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            <h3 className="text-2xl font-semibold text-red-500">Payment Unsuccessful!</h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-center">Oops, something went wrong. Please try again.</p>
          <p className="text-red-700 dark:text-red-300 text-center">Message: {paymentError}</p>
          <button
            onClick={() => setIsFailModalOpen(false)}
            className="mt-6 px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-700 transition duration-300 block mx-auto"
          >Okay</button>
        </div>
      </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50 overflow-auto">
      <div className="relative p-4 w-full max-w-4xl h-full md:h-auto">
        <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-xl dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-700 overflow-y-auto max-h-[90vh]">
          <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
            <span role="img" aria-label="mpesa" className="h-12 w-auto text-green-500 mr-2 text-4xl">
              <img src={MPESA_ICON_URL} alt="Mpesa Icon" className="h-8 w-8" />
            </span>
            <h3 className="text-3xl font-extrabold text-green-600 text-center">M-Pesa Payment Portal</h3>
            <button
              type="button"
              className="text-gray-500 bg-transparent hover:bg-gray-300 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={handleClose}
              title="Close"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            </button>
          </div>

          <div className="p-6">
            <h4 className="text-xl font-semibold text-green-500 mb-3">Select Case To Make Payment (only cases with outstanding balance):</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {/* Filter inputs remain the same */}
              <div>
                <label htmlFor="mpesaStatusFilter" className="block text-sm font-bold text-gray-700 dark:text-gray-300">Filter by Status:</label>
                <select
                  id="mpesaStatusFilter"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as CaseStatus | '')}
                >
                  <option value="">All Statuses</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="closed">Closed</option>
                  <option value="on_hold">On Hold</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
              <div>
                <label htmlFor="mpesaTypeFilter" className="block text-sm font-bold text-gray-700 dark:text-gray-300">Filter by Type:</label>
                <select
                  id="mpesaTypeFilter"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as CaseType | '')}
                >
                  <option value="">All Types</option>
                  <option value="criminal">Criminal</option>
                  <option value="civil">Civil</option>
                  <option value="family">Family</option>
                  <option value="corporate">Corporate</option>
                  <option value="property">Property</option>
                  <option value="employment">Employment</option>
                  <option value="intellectual_property">Intellectual Property</option>
                  <option value="immigration">Immigration</option>
                  <option value="elc">ELC</option>
                  <option value="childrenCase">Children Case</option>
                  <option value="tribunal">Tribunal</option>
                  <option value="conveyances">Conveyances</option>
                </select>
              </div>
              <div>
                <label htmlFor="mpesaStationFilter" className="block text-sm font-bold text-gray-700 dark:text-gray-300">Filter by Station:</label>
                <input
                  type="text"
                  id="mpesaStationFilter"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Enter Station"
                  value={stationFilterInput}
                  onChange={(e) => setStationFilterInput(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="mpesaCaseNumberFilter" className="block text-sm font-bold text-gray-700 dark:text-gray-300">Filter by Case Number:</label>
                <input
                  type="text"
                  id="mpesaCaseNumberFilter"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Enter Case Number"
                  value={caseNumberFilterInput}
                  onChange={(e) => setCaseNumberFilterInput(e.target.value)}
                />
              </div>
              <div className="lg:col-span-2">
                <label htmlFor="mpesaSearchTerm" className="block text-sm font-bold text-gray-700 dark:text-gray-300">Search (Parties, Track No., etc.):</label>
                <input
                  type="text"
                  id="mpesaSearchTerm"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Search..."
                  value={searchTermInput}
                  onChange={(e) => setSearchTermInput(e.target.value)}
                />
              </div>
            </div>

            {isLoadingCases ? (
              <p className="text-center text-gray-500 dark:text-gray-400">Loading cases...</p>
            ) : isErrorCases ? (
              <p className="text-center text-red-500 dark:text-red-400">Error loading cases: {errorCases instanceof Error ? errorCases.message : 'Unknown error'}</p>
            ) : (
              <div className="overflow-x-auto rounded-lg shadow-md max-h-72">
                <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                  <thead className="bg-green-50 dark:bg-green-900 sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wider">Case ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wider">User ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wider">Case Fee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wider">Payment Balance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wider">Station</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wider">Case Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-300 dark:bg-gray-700 dark:divide-gray-600">
                    {filteredCases.map((caseItem) => {
                      const balanceValueFromBackend = (caseItem as Case)[BALANCE_FIELD_NAME_FROM_BACKEND as keyof Case];
                      let displayBalance = "0.00";
                      if (balanceValueFromBackend !== null && balanceValueFromBackend !== undefined) {
                          const parsed = parseFloat(String(balanceValueFromBackend));
                          if (!isNaN(parsed) && parsed > 0) {
                              displayBalance = parsed.toFixed(2);
                          }
                      }
                      return (
                        <tr key={caseItem.case_id} className={`hover:bg-gray-100 dark:hover:bg-gray-600 ${selectedCase?.case_id === caseItem.case_id ? "bg-blue-100 dark:bg-blue-900" : ""}`}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{caseItem.case_id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{caseItem.user_id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{parseFloat(String(caseItem.fee)).toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            {displayBalance}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{caseItem.case_status}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{caseItem.case_type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{caseItem.station}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{caseItem.case_number}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => setSelectedCase(caseItem)}
                              className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 transition-colors duration-200"
                              title="Select Case"
                            >
                              Select
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredCases.length === 0 && !isLoadingCases && (
                  <p className="text-center py-4 text-gray-500 dark:text-gray-400">No cases with outstanding payments match your filters.</p>
                )}
              </div>
            )}
          </div>

          <div className="p-6">
            <h4 className="text-xl font-semibold text-green-500 mb-3">Payment Details</h4>
            <div className="mb-6">
              <label htmlFor="mpesaAmount" className="block text-sm font-bold text-gray-700 dark:text-gray-300">Amount to Pay:</label>
              <input
                type="number"
                id="mpesaAmount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="Enter amount"
                disabled={!selectedCase}
                step="0.01"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="mpesaCustomerEmail" className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                <div className="flex items-center">
                  <span role="img" aria-label="email" className="h-5 w-5 text-gray-500 mr-2 text-xl">📧</span>
                  Customer Email (for receipt):
                </div>
              </label>
              <input
                type="email"
                id="mpesaCustomerEmail"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="Enter customer's email address"
                list="lastUsedEmailsDatalist" 
              />
              <datalist id="lastUsedEmailsDatalist"> {/* Added datalist element */}
                {lastUsedEmails.map((email, index) => (
                  <option key={`email-suggestion-${index}`} value={email} />
                ))}
              </datalist>
            </div>
            <div className="mb-6">
              <label htmlFor="mpesaPhoneNumber" className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                <div className="flex items-center">
                  <span role="img" aria-label="phone" className="h-5 w-5 text-gray-500 mr-2 text-xl">📞</span>
                  Phone Number:
                </div>
              </label>
              <input
                type="tel"
                id="mpesaPhoneNumber"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  setPhoneNumberError(null);
                }}
                className={`shadow-sm bg-gray-50 border ${phoneNumberError ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                placeholder="Enter M-Pesa phone number (e.g., 07XXXXXXXX or 01XXXXXXXX)"
                list="lastUsedPhoneNumbersDatalist" 
              />
              <datalist id="lastUsedPhoneNumbersDatalist"> {/* Added datalist element */}
                {lastUsedPhoneNumbers.map((phone, index) => (
                  <option key={`phone-suggestion-${index}`} value={phone} />
                ))}
              </datalist>
              {phoneNumberError && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">{phoneNumberError}</p>
              )}
            </div>

            {(clientSideIsLoading || isMutationLoading) && (
              <div className="p-4 rounded-md bg-yellow-100 border border-yellow-400 mb-4">
                <p className="text-gray-700">
                  Processing M-Pesa payment... Please check your phone to complete the payment. This may take up to 60 seconds.
                </p>
              </div>
            )}
            {paymentError && !isFailModalOpen && (
              <div className="p-4 rounded-md bg-red-100 border border-red-400 mb-4">
                <h3 className="text-lg font-semibold text-red-700">Payment Unsuccessful!</h3>
                <p className="text-gray-700">Message: {paymentError}</p>
              </div>
            )}

            <div className="flex justify-between pt-2">
              <button
                onClick={handlePayment}
                className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-1/2 transition duration-300 ${clientSideIsLoading || isMutationLoading || !selectedCase || !!phoneNumberError ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={clientSideIsLoading || isMutationLoading || !selectedCase || !!phoneNumberError}
              >
                {clientSideIsLoading || isMutationLoading ? (
                  <div className='flex items-center justify-center'>
                    <span className="loading loading-spinner text-white mr-2"></span>
                    <span> Processing...</span>
                  </div>
                ) : 'Make Payment'}
              </button>
              <button
                type="button"
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-1/2 ml-2 transition duration-300"
                onClick={handleClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      {isSuccessModalOpen && <SuccessModal />}
      {isFailModalOpen && <FailModal />}
    </div>
  );

  function isValidPhoneNumber(phoneNum: string): boolean {
    const phoneRegex = /^(01[0-9]{8}|07[0-9]{8})$/;
    return phoneRegex.test(phoneNum);
  }
};

export default MpesaPayment;