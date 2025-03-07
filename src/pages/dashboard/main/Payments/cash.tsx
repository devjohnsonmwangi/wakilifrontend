import React, { useState } from 'react';
import { useCreateCashPaymentMutation, PaymentDataTypes } from '../../../../features/payment/paymentAPI'; // Adjust the path
import { useNavigate } from 'react-router-dom';

interface CashPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    caseId: number;
    userId: number;
}

const CashPaymentModal: React.FC<CashPaymentModalProps> = ({ isOpen, onClose, caseId, userId }) => {
    const [amount, setAmount] = useState('');
    const [paymentNotes, setPaymentNotes] = useState(''); // Added for notes
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [createCashPayment] = useCreateCashPaymentMutation();
    const navigate = useNavigate();

    const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
    const [isErrorModalOpen, setErrorModalOpen] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            setErrorMessage('Please enter a valid positive amount.');
            setErrorModalOpen(true);
            return;
        }

        setIsSubmitting(true);
        setErrorMessage('');
        setSuccessMessage('');

        const paymentData: Omit<PaymentDataTypes, 'payment_id' | 'payment_date' | 'updated_at' | 'payment_status' | 'stripe_charge_id' | 'stripe_customer_id' | 'mpesa_checkout_request_id' | 'mpesa_receipt_number' | 'mpesa_phone_number'> = {
            case_id: caseId,
            user_id: userId,
            payment_amount: Number(amount),
            payment_gateway: "cash",
            transaction_id: "CASH_" + Date.now(),  // Unique transaction ID
            payment_notes: paymentNotes || null, // Use the payment notes
        };

        try {
            await createCashPayment(paymentData).unwrap();
            setSuccessMessage("Payment successful!");
            setSuccessModalOpen(true);
            setTimeout(() => {
                onClose(); // Close after a delay
                setSuccessModalOpen(false);
                navigate('/dashboard');
            }, 1500);
        } catch (apiError) {
            console.error("API Payment Creation Error", apiError);
            // Check if apiError has a specific structure
            const errorMessage = (apiError as { data?: { message?: string } }).data?.message || 'Failed to create payment record';
            setErrorMessage(`API Error: ${errorMessage}`);
            setErrorModalOpen(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Success Modal Component
    const SuccessModal = () => (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="flex flex-col items-center justify-center min-h-0 bg-green-50">
                <div className="bg-white p-10 rounded-lg shadow-md text-center">
                    <span role="img" aria-label="success" className="h-16 w-16 text-green-500 mx-auto mb-4 text-5xl">✅</span>
                    <h3 className="text-2xl font-bold text-green-600 mb-2">Payment Recorded!</h3>
                    <p className="text-gray-700">Cash payment of {amount} recorded successfully.</p>
                    <button
                        onClick={() => {
                            setSuccessModalOpen(false);
                            onClose();
                            navigate('/dashboard');
                        }}
                        className="mt-6 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );

    // Error Modal Component
    const ErrorModal = () => (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="flex flex-col items-center justify-center min-h-0 bg-red-50">
                <div className="bg-white p-10 rounded-lg shadow-md text-center">
                    <span role="img" aria-label="failed" className="h-16 w-16 text-red-500 mx-auto mb-4 text-5xl">❌</span>
                    <h3 className="text-2xl font-bold text-red-600 mb-2">Invalid Amount!</h3>
                    <p className="text-gray-700">{errorMessage}</p>
                    <button
                        onClick={() => {
                            setErrorModalOpen(false);
                            // Consider resetting the form or state
                        }}
                        className="mt-6 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
                    >
                        Retry
                    </button>
                </div>
            </div>
        </div>
    );

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
                <div className="relative p-4 w-full max-w-md h-full md:h-auto">
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <button
                            type="button"
                            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                            onClick={onClose}
                            title="Close"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        </button>
                        <div className="py-6 px-6 lg:px-8">
                            <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">Record Cash Payment</h3>
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                        Amount
                                    </label>
                                    <input
                                        type="number"
                                        id="amount"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                        placeholder="Enter Amount"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="paymentNotes" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                        Payment Notes
                                    </label>
                                    <textarea
                                        id="paymentNotes"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                        placeholder="Enter any notes about the payment"
                                        value={paymentNotes}
                                        onChange={(e) => setPaymentNotes(e.target.value)}
                                    />
                                </div>
                                {errorMessage && <div className="text-red-500">{errorMessage}</div>}
                                {successMessage && <div className="text-green-500">{successMessage}</div>}
                                <button
                                    type="submit"
                                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    disabled={isSubmitting}
                                    title="Record Payment"
                                >
                                    {isSubmitting ? "Processing..." : "Record Payment"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {isSuccessModalOpen && <SuccessModal />}
            {isErrorModalOpen && <ErrorModal />}
        </>
    );
};

export default CashPaymentModal;
