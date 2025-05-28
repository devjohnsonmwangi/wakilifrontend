import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useInitiateMpesaStkPushMutation } from '../../../../features/payment/paymentAPI'; // Ensure this path is correct
import { motion, AnimatePresence }from 'framer-motion';
import {
  FaMobileAlt,
  FaTimes,
  FaCheckCircle,
  FaLock,
  FaExclamationCircle,
} from 'react-icons/fa';
import { BiLoaderAlt } from 'react-icons/bi';

interface SingleCaseMpesaPaymentProps {
  caseId: number;
  userId: number;
  fee: number;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess?: () => void;
  onPaymentFailure?: () => void;
}

interface CreateMpesaPaymentVariables {
  case_id: number;
  user_id: number;
  amount: number;
  phoneNumber: string;
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

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, ease: "easeInOut" } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: "easeInOut" } },
};

const modalPanelVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2, ease: "easeIn" } },
};

// Using a known M-PESA logo URL. Consider hosting this asset locally if possible.
const MPESA_LOGO_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/M-PESA_LOGO-01.svg/2560px-M-PESA_LOGO-01.svg.png"; // Switched to a more common SVG version


const SingleCaseMpesaPayment: React.FC<SingleCaseMpesaPaymentProps> = ({
  caseId,
  userId,
  fee,
  isOpen,
  onClose,
  onPaymentSuccess: onParentPaymentSuccess, // Renamed to avoid conflict
  onPaymentFailure: onParentPaymentFailure, // Renamed to avoid conflict
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentAmount, setPaymentAmount] = useState<number>(fee);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [phoneNumberError, setPhoneNumberError] = useState<string | null>(null);
  const [amountError, setAmountError] = useState<string | null>(null);
  const [internalPaymentSuccess, setInternalPaymentSuccess] = useState(false); // Renamed
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const [initiateMpesaStkPush] = useInitiateMpesaStkPushMutation();

  useEffect(() => {
    // Reset form state when modal opens/closes or fee changes
    if (isOpen) {
      setPhoneNumber('');
      setPaymentAmount(fee);
      setIsLoading(false);
      setPaymentError(null);
      setPhoneNumberError(null);
      setAmountError(null);
      setInternalPaymentSuccess(false);
      setShowSuccessMessage(false);
    }
  }, [isOpen, fee]);

  useEffect(() => {
    if (internalPaymentSuccess) {
      setShowSuccessMessage(true);
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
        onClose(); // Close modal first
        if (onParentPaymentSuccess) {
          onParentPaymentSuccess(); // Then call parent callback
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [internalPaymentSuccess, onClose, onParentPaymentSuccess]);

  const validatePhoneNumber = (number: string): boolean => {
    // Kenyan phone numbers: 07xxxxxxxx, 01xxxxxxxx, or 2547xxxxxxxx, 2541xxxxxxxx
    // For STK push, it's often preferred in 254 format, but let's be flexible for input
    // and convert later if necessary. The current regex handles 01/07.
    const phoneRegex = /^(01[0-9]{8}|07[0-9]{8})$/;
    return phoneRegex.test(number);
  };
  
  // Function to format phone number to 254xxxxxxxxx if backend expects it
  // For this example, we assume backend handles 07/01 format based on original code
  // const formatPhoneNumberForApi = (number: string): string => {
  //   if (number.startsWith('0')) {
  //     return `254${number.substring(1)}`;
  //   }
  //   return number;
  // };

  const handlePayment = async () => {
    let hasError = false;
    setPhoneNumberError(null);
    setAmountError(null);
    setPaymentError(null);

    if (!phoneNumber) {
      setPhoneNumberError("Phone number is required.");
      hasError = true;
    } else if (!validatePhoneNumber(phoneNumber)) {
      setPhoneNumberError("Enter a valid 10-digit Kenyan number (07xx or 01xx).");
      hasError = true;
    }

    if (!paymentAmount || paymentAmount <= 0) {
      setAmountError("Please enter a valid payment amount.");
      hasError = true;
    } else if (paymentAmount > fee) {
      setAmountError(`Amount cannot exceed KES ${fee.toLocaleString()}.`);
      hasError = true;
    }
    
    if (hasError) {
        toast.error("Please correct the errors in the form.");
        return;
    }


    setIsLoading(true);

    try {
      const paymentData: CreateMpesaPaymentVariables = {
        case_id: caseId,
        user_id: userId,
        amount: paymentAmount,
        phoneNumber: phoneNumber, // Use as is, or formatPhoneNumberForApi(phoneNumber) if needed
      };

      const response = await initiateMpesaStkPush(paymentData).unwrap() as MpesaTransactionDetails;

      if (response.success) {
        toast.success(response.message || "STK push initiated successfully. Check your phone.");
        setInternalPaymentSuccess(true);
      } else {
        const errorMessage = response.message || "Payment initiation failed. Please try again.";
        toast.error(errorMessage);
        setPaymentError(errorMessage);
        if (onParentPaymentFailure) {
          onParentPaymentFailure();
        }
      }
    } catch (error) {
      const err = error as ApiError;
      console.error("M-Pesa Payment Error:", error);

      let parsedErrorMessage = "Failed to initiate M-Pesa payment. Please try again later.";
      if (err.response?.data?.message) {
        parsedErrorMessage = err.response.data.message;
      } else if (typeof err.message === 'string' && err.message.length < 200) { // Avoid overly long/generic messages
         parsedErrorMessage = err.message;
      }
      // Attempt to parse if message is JSON string (common with some RTK Query error structures)
      try {
        const nestedError = JSON.parse(parsedErrorMessage);
        if (nestedError?.data?.message) parsedErrorMessage = nestedError.data.message;
        else if (nestedError?.message) parsedErrorMessage = nestedError.message;
      } catch (e) {
        // Not a JSON string, use as is
      }

      toast.error(parsedErrorMessage);
      setPaymentError(parsedErrorMessage);
      if (onParentPaymentFailure) {
        onParentPaymentFailure();
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          aria-labelledby="mpesa-payment-modal-title"
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            className="relative w-full max-w-md overflow-hidden rounded-xl bg-white dark:bg-slate-800 shadow-2xl"
            variants={modalPanelVariants}
            // initial, animate, exit are inherited from parent AnimatePresence context if not specified
            // but explicit declaration is fine for clarity or specific overrides.
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h3 id="mpesa-payment-modal-title" className="flex items-center text-lg font-semibold text-slate-800 dark:text-white">
                <img 
                  src={MPESA_LOGO_URL} 
                  className="h-6 mr-2.5 dark:invert-[0.05] dark:brightness-[3] " // invert for dark mode, adjust brightness
                  alt="M-Pesa Logo" 
                />
                M-Pesa Payment
                <FaLock className="ml-2 h-4 w-4 text-slate-400 dark:text-slate-500" aria-label="Secure payment"/>
              </h3>
              <button
                type="button"
                className="p-1.5 rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-slate-800"
                onClick={onClose}
                aria-label="Close payment modal"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              {showSuccessMessage ? (
                <div className="flex items-center space-x-3 rounded-lg border border-green-500/30 bg-green-50 dark:bg-green-500/10 p-4 text-green-700 dark:text-green-300">
                  <FaCheckCircle className="h-6 w-6 flex-shrink-0 text-green-500 dark:text-green-400" />
                  <div>
                    <p className="font-medium">Payment Initiated!</p>
                    <p className="text-sm">Please check your phone to complete the transaction.</p>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Safaricom Phone Number
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                        <FaMobileAlt className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                      </div>
                      <input
                        type="tel"
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => {
                          setPhoneNumber(e.target.value);
                          if (phoneNumberError) setPhoneNumberError(null);
                        }}
                        className={`block w-full rounded-lg border py-2.5 pl-11 pr-4 text-slate-900 dark:text-slate-50 shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:ring-1 focus:outline-none sm:text-sm
                          ${phoneNumberError 
                            ? 'border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500' 
                            : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700/50 focus:border-green-500 focus:ring-green-500'
                          }`}
                        placeholder="07XX XXX XXX"
                        aria-label="Safaricom Phone Number"
                        aria-describedby={phoneNumberError ? "phoneNumber-error" : undefined}
                        aria-invalid={!!phoneNumberError}
                      />
                    </div>
                    {phoneNumberError && (
                      <p id="phoneNumber-error" className="mt-1.5 text-xs text-red-600 dark:text-red-400">{phoneNumberError}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="paymentAmount" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Amount to Pay (KES)
                    </label>
                    <input
                      type="number"
                      id="paymentAmount"
                      value={paymentAmount}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        setPaymentAmount(isNaN(value) ? 0 : value);
                        if(amountError) setAmountError(null);
                      }}
                      className={`block w-full rounded-lg border py-2.5 px-4 text-slate-900 dark:text-slate-50 shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:ring-1 focus:outline-none sm:text-sm
                        ${amountError 
                          ? 'border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500' 
                          : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700/50 focus:border-green-500 focus:ring-green-500'
                        }`}
                      placeholder="Enter amount"
                      aria-label="Amount to Pay"
                      aria-describedby={amountError ? "amount-error" : undefined}
                      aria-invalid={!!amountError}
                    />
                     {amountError && (
                      <p id="amount-error" className="mt-1.5 text-xs text-red-600 dark:text-red-400">{amountError}</p>
                    )}
                  </div>

                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Total Fee: <span className="font-semibold">KES {fee.toLocaleString()}</span>
                  </div>

                  {paymentError && (
                    <div className="flex items-start space-x-3 rounded-lg border border-red-500/30 bg-red-50 dark:bg-red-500/10 p-3 text-red-700 dark:text-red-400">
                      <FaExclamationCircle className="h-5 w-5 mt-0.5 flex-shrink-0 text-red-500 dark:text-red-400" />
                      <p className="text-sm">{paymentError}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 pt-3">
                    <button
                      className="mt-3 sm:mt-0 inline-flex w-full justify-center rounded-lg bg-white dark:bg-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-slate-200 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 dark:focus:ring-offset-slate-800"
                      type="button"
                      onClick={onClose}
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      className={`inline-flex w-full justify-center items-center rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:opacity-60 disabled:cursor-not-allowed dark:bg-green-500 dark:hover:bg-green-600 dark:focus-visible:outline-green-500`}
                      type="button"
                      onClick={handlePayment}
                      disabled={isLoading || !phoneNumber || !paymentAmount || paymentAmount <= 0 || !!phoneNumberError || !!amountError}
                    >
                      {isLoading ? (
                        <>
                          <BiLoaderAlt className="mr-2 h-5 w-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        `Pay KES ${paymentAmount.toLocaleString()}`
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SingleCaseMpesaPayment;