import React, { useState } from 'react';
import {
    CardElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';

import { useCreatePaymentMutation, PaymentDataTypes, useCreatePaymentIntentMutation } from '../../../../features/payment/paymentAPI';  // Adjust path
import { useNavigate } from 'react-router-dom'; // Import useNavigate

interface StripePaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    caseId: number;
    userId: number;
    amount: number; // Required prop for the payment amount
}

const StripePaymentModal: React.FC<StripePaymentModalProps> = ({ isOpen, onClose, caseId, userId, amount }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [createPayment] = useCreatePaymentMutation();
    const [createPaymentIntent] = useCreatePaymentIntentMutation(); // Get this Hook.

    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate(); // Initialize useNavigate

    const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
    const [isErrorModalOpen, setErrorModalOpen] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            setErrorMessage('Stripe.js has not yet loaded.');
            setErrorModalOpen(true);
            return; // Stripe not loaded
        }

        setIsSubmitting(true);
        setErrorMessage('');
        setSuccessMessage('');

        const card = elements.getElement(CardElement);
        if (!card) {
            setErrorMessage('Card element not found.');
            setErrorModalOpen(true);
            return;
        }

        try {
            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card,
            });

            if (error) {
                console.error("Stripe Payment Method Error", error);
                setErrorMessage(`Stripe Error: ${error.message}`);
                setErrorModalOpen(true);
            } else {
                const amountInCents = amount * 100;

                const paymentData: Omit<PaymentDataTypes, 'payment_id' | 'payment_date' | 'updated_at' | 'payment_status'> = {
                    case_id: caseId,
                    user_id: userId,
                    payment_amount: amount,
                    payment_gateway: "stripe",
                    transaction_id: paymentMethod.id,
                    stripe_charge_id: null,
                    stripe_customer_id: paymentMethod.customer || null,
                    mpesa_checkout_request_id: null,
                    mpesa_receipt_number: null,
                    mpesa_phone_number: null,
                    payment_notes: null,
                };

                try {
                    const payment = await createPayment(paymentData).unwrap();

                    const createPaymentIntentRequest = {
                        amount: amountInCents,
                        payment_id: payment.payment_id!,
                    };

                    const { clientSecret } = await createPaymentIntent(createPaymentIntentRequest).unwrap();
                    if (clientSecret) {
                        const result = await stripe.confirmCardPayment(clientSecret, {
                            payment_method: paymentMethod.id,
                        });

                        if (result.error) {
                            setErrorMessage(result.error.message || 'Payment confirmation failed.');
                            setErrorModalOpen(true);
                            setIsSubmitting(false);
                        } else {
                            setSuccessMessage("Redirecting you to Stripe...");
                            setSuccessModalOpen(true);
                            setIsSubmitting(false);
                        }
                    } else {
                        setErrorMessage("Unable to get client secret from API.");
                        setErrorModalOpen(true);
                        setIsSubmitting(false);
                    }
                } catch (apiError: unknown) { // Changed to unknown
                    console.error("API Payment Creation Error", apiError);
                    const errorMessage = (apiError as { data?: { message?: string }; message?: string }).data?.message || (apiError as Error).message || 'Failed to create payment intent';
                    setErrorMessage(`API Error: ${errorMessage}`);
                    setErrorModalOpen(true);
                }
            }
        } catch (e: unknown) { // Changed to unknown
            console.error("Stripe Error", e);
            const errorMessage = (e as Error).message || "An unknown error occurred.";
            setErrorMessage(`Payment Error: ${errorMessage}`);
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
                    <h3 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h3>
                    <p className="text-gray-700">Your payment was processed successfully.</p>
                    <button
                        onClick={() => {
                            setSuccessModalOpen(false);
                            onClose(); // Close the modal
                            navigate('/dashboard'); // Navigate to dashboard
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
                    <h3 className="text-2xl font-bold text-red-600 mb-2">Payment Failed!</h3>
                    <p className="text-gray-700">{errorMessage}</p>
                    <button
                        onClick={() => {
                            setErrorModalOpen(false);
                            onClose();
                        }}
                        className="mt-6 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
                    >
                        Retry Payment
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
                            <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">Pay with Stripe</h3>
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="card-element" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                        Card Details
                                    </label>
                                    <CardElement id="card-element" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                                </div>
                                {errorMessage && <div className="text-red-500">{errorMessage}</div>}
                                {successMessage && <div className="text-green-500">{successMessage}</div>}
                                <button
                                    type="submit"
                                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    disabled={isSubmitting || !stripe}
                                    title="Pay Now"
                                >
                                    {isSubmitting ? "Processing..." : "Pay Now"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Render the modals */}
            {isSuccessModalOpen && <SuccessModal />}
            {isErrorModalOpen && <ErrorModal />}
        </>
    );
};

export default StripePaymentModal;
