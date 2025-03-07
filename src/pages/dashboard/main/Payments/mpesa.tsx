import React, { useState } from 'react';
import { useMpesaCallbackMutation } from '../../../../features/payment/paymentAPI'; // Adjust the import according to your file structure
import { useNavigate } from 'react-router-dom';

type PaymentType = 'direct' | 'stk';

interface MpesaPaymentProps {
    isOpen: boolean;
    onClose: () => void;
    amount: number;  // Add amount prop.
    caseId: number;
    userId: number;
}

const MpesaPayment: React.FC<MpesaPaymentProps> = ({ isOpen, onClose, amount }) => {
    const [paymentType, setPaymentType] = useState<PaymentType>('stk');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
    const [isErrorModalOpen, setErrorModalOpen] = useState(false);
    const [mpesaCallback] = useMpesaCallbackMutation();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    const handlePayment = async () => {
        if (paymentType === 'stk') {
            // Handle STK push logic here
            try {
                // Simulate payment processing
                const response = await mpesaCallback({ transaction_id: '12345', amount: amount, status: 'success' });
                if (response?.data?.success) {  // Check for undefined and nested 'success' property
                    setSuccessModalOpen(true);
                } else {
                    setErrorMessage("Failed to initiate STK push. Please check your phone number and try again.");
                    setErrorModalOpen(true);
                }
            } catch (error) {
                console.error("M-Pesa Callback Error:", error);  // Log the error for debugging
                // Specify the type of error
                const errorMessage = (error as { message?: string }).message || 'Unknown error occurred';
                setErrorMessage(`Failed to process M-Pesa callback: ${errorMessage}`);
                setErrorModalOpen(true);
            }
        } else {
            // Handle direct payment logic here
            setSuccessModalOpen(true); // Simulate success for demo purposes
        }
    };

    const SuccessModal = () => (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="flex flex-col items-center justify-center min-h-0 bg-green-50">
                <div className="bg-white p-10 rounded-lg shadow-md text-center">
                    <span role="img" aria-label="success" className="h-16 w-16 text-green-500 mx-auto mb-4 text-5xl">✅</span>
                    <h3 className="text-2xl font-bold text-green-600 mb-2">Payment Initiated!</h3>
                    <p className="text-gray-700">Please check your phone to complete the payment.</p>
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

    const ErrorModal = () => (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="flex flex-col items-center justify-center min-h-0 bg-red-50">
                <div className="bg-white p-10 rounded-lg shadow-md text-center">
                    <span role="img" aria-label="failed" className="h-16 w-16 text-red-500 mx-auto mb-4 text-5xl">❌</span>
                    <h3 className="text-2xl font-bold text-red-600 mb-2">Payment Failed!</h3>
                    <p className="text-gray-700">{errorMessage || "There was an issue processing your payment. Please try again."}</p>
                    <button
                        onClick={() => setErrorModalOpen(false)}
                        className="mt-6 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg border border-gray-200">
                <div className="flex items-center justify-center mb-6">
                    <span role="img" aria-label="mpesa" className="h-12 w-auto text-green-500 mr-2 text-4xl">📱</span>
                    <h2 className="text-2xl font-semibold text-gray-800">M-Pesa Payment</h2>
                </div>

                <div className="mb-4">
                    <label htmlFor="paymentType" className="block text-gray-700 text-sm font-bold mb-2">
                        Payment Type:
                    </label>
                    <div className="relative">
                        <select
                            id="paymentType"
                            value={paymentType}
                            onChange={(e) => setPaymentType(e.target.value as PaymentType)}
                            className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                            title="Select payment type"
                        >
                            <option value="stk">STK Push</option>
                            <option value="direct">Direct Payment</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            ▼
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-2">
                        <div className="flex items-center">
                            <span role="img" aria-label="phone" className="h-5 w-5 text-gray-500 mr-2 text-xl">📞</span>
                            Phone Number:
                        </div>
                    </label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter your phone number"
                    />
                </div>

                <button
                    onClick={handlePayment}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition duration-300"
                >
                    Make Payment
                </button>

                {/* Success Modal */}
                {isSuccessModalOpen && <SuccessModal />}

                {/* Error Modal */}
                {isErrorModalOpen && <ErrorModal />}
            </div>
        </div>
    );
};

export default MpesaPayment;
