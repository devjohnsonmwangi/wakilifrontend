import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useInitiateMpesaStkPushMutation } from '../../../../features/payment/paymentAPI';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMobileAlt, FaTimes, FaCheckCircle, FaLock } from 'react-icons/fa';
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

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeInOut" } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2, ease: "easeInOut" } }
};

const MPESA_LOGO_URL = "https://stagepass.co.ke/theme/images/clients/WEB-LOGOS-14.jpg";

const SingleCaseMpesaPayment: React.FC<SingleCaseMpesaPaymentProps> = ({
  caseId,
  userId,
  fee,
  isOpen,
  onClose,
  onPaymentSuccess,
  onPaymentFailure,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentAmount, setPaymentAmount] = useState<number>(fee);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [phoneNumberError, setPhoneNumberError] = useState<string | null>(null);
  const [amountError, setAmountError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const [initiateMpesaStkPush] = useInitiateMpesaStkPushMutation();

  useEffect(() => {
    if (paymentSuccess) {
      setShowSuccessMessage(true);
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
        onClose();
        if (onPaymentSuccess) {
          onPaymentSuccess();
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [paymentSuccess, onClose, onPaymentSuccess]);

  const handlePayment = async () => {
    if (!phoneNumber) {
      toast.error("Phone number is required.");
      setPhoneNumberError("Phone number is required.");
      return;
    }

    const isValid = isValidPhoneNumber(phoneNumber);
    if (!isValid) {
      toast.error("Please enter a valid Kenyan phone number starting with 01 or 07 and has 10 digits.");
      setPhoneNumberError("Phone number is required.");
      return;
    }

    if (!paymentAmount || paymentAmount <= 0) {
      toast.error("Please enter a valid payment amount.");
      setAmountError("Please enter a valid payment amount.");
      return;
    }

    if (paymentAmount > fee) {
      toast.error("Payment amount cannot be greater than the total fee.");
      setAmountError("Payment amount cannot be greater than the total fee.");
      return;
    }

    setIsLoading(true);
    setPaymentError(null);
    setPhoneNumberError(null);
    setAmountError(null);

    try {
      const paymentData: CreateMpesaPaymentVariables = {
        case_id: caseId,
        user_id: userId,
        amount: paymentAmount,
        phoneNumber: phoneNumber,
      };

      const response = await initiateMpesaStkPush(paymentData).unwrap() as MpesaTransactionDetails;

      if (response.success) {
        toast.success(response.message);
        setPaymentSuccess(true);
      } else {
        const rawErrorMessage = response.message || "Payment Failed";
        const errorMessage = rawErrorMessage;
        toast.error(errorMessage);
        setPaymentError(errorMessage);
        if (onPaymentFailure) {
          onPaymentFailure();
        }
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
      } catch (parseError) {
        console.error("Error parsing error message:", parseError);
      }

      const errorMessage = rawErrorMessage;
      toast.error(errorMessage);
      setPaymentError(errorMessage);
      if (onPaymentFailure) {
        onPaymentFailure();
      }
    } finally {
      setIsLoading(false);
    }
  };

  function isValidPhoneNumber(phoneNumber: string): boolean {
    const phoneRegex = /^(01[0-9]{8}|07[0-9]{8})$/;
    return phoneRegex.test(phoneNumber);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-75 z-50"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalVariants}
        >
          <motion.div className="relative p-6 w-full max-w-md h-auto bg-gray-100 rounded-xl shadow-lg">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 overflow-hidden">
              <div className="flex justify-between items-center p-5 rounded-t border-b dark:border-gray-600 bg-blue-50">
                <h3 className="flex items-center text-xl font-semibold text-green-600 dark:text-white">
                  <img src={MPESA_LOGO_URL} className="w-6 h-6 mr-2" alt="M-Pesa Logo" />
                  M-Pesa Payment
                  <FaLock className="inline-block ml-1 text-gray-500" />
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={onClose}
                  aria-label="Close"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {showSuccessMessage ? (
                  <div className="bg-green-100 text-green-800 border border-green-200 rounded p-4 flex items-center">
                    <FaCheckCircle className="mr-2 text-xl" />
                    Payment successful!
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">
                        Phone Number: <FaMobileAlt className="inline-block ml-1 text-gray-500" />
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          id="phoneNumber"
                          value={phoneNumber}
                          onChange={(e) => {
                            setPhoneNumber(e.target.value);
                            setPhoneNumberError(null);
                          }}
                          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${phoneNumberError ? 'border-red-500' : ''}`}
                          placeholder="07XXXXXXXX"
                          aria-label="Phone Number"
                        />
                      </div>
                      {phoneNumberError && (
                        <p className="text-red-500 text-xs italic">{phoneNumberError}</p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">
                        Amount:
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          id="paymentAmount"
                          value={paymentAmount}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            setPaymentAmount(value);
                            setAmountError(null);
                          }}
                          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${amountError ? 'border-red-500' : ''}`}
                          placeholder="Enter amount"
                          aria-label="Amount"
                        />
                        {amountError && (
                          <p className="text-red-500 text-xs italic">{amountError}</p>
                        )}
                      </div>
                    </div>

                    {paymentError && (
                      <div className="bg-red-100 text-red-800 border border-red-200 rounded p-4 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.834 1 1 0 01-1.995.282c-.244-.472-.598-.985-.985-1.532a1 1 0 01.4-1.067l3-3z" clipRule="evenodd"></path>
                        </svg>
                        {paymentError}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <button
                        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        type="button"
                        onClick={handlePayment}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            Processing...
                            <BiLoaderAlt className="inline-block ml-2 animate-spin" />
                          </>
                        ) : (
                          'Make Payment'
                        )}
                      </button>
                      <button
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button"
                        onClick={onClose}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SingleCaseMpesaPayment;