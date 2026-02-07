import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';

interface WhatsAppFloatingButtonProps {
    phoneNumber?: string;
    message?: string;
}

const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({
    phoneNumber = '+254112810203',
    message = 'Hello! I would like to inquire about your legal services.'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const whatsappLink = `https://wa.me/${phoneNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(message)}`;

    const handleWhatsAppClick = () => {
        if (isMobile) {
            window.location.href = whatsappLink;
        } else {
            window.open(whatsappLink, '_blank', 'width=400,height=600');
        }
        setIsOpen(false);
    };

    return (
        <>
            {/* WhatsApp Floating Button - Right Side Center */}
            <div className="fixed right-4 md:right-6 top-1/2 transform -translate-y-1/2 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 font-semibold text-white ${
                        isOpen
                            ? 'bg-gray-600 dark:bg-gray-700 hover:bg-gray-700'
                            : 'bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700'
                    }`}
                    title="Chat with us on WhatsApp"
                    aria-label="Open WhatsApp chat"
                >
                    {isOpen ? (
                        <X className="w-6 h-6 md:w-7 md:h-7" />
                    ) : (
                        <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
                    )}
                </button>

                {/* Tooltip/Menu */}
                {isOpen && (
                    <div className="absolute right-full mr-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-4 w-64 md:w-72">
                        <div className="text-center mb-4">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                                Chat with Wakili
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                Have questions about our legal services? We're here to help!
                            </p>
                        </div>

                        <button
                            onClick={handleWhatsAppClick}
                            className="w-full bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-300 shadow-lg hover:shadow-xl"
                        >
                            <MessageCircle className="w-5 h-5" />
                            <span>Message on WhatsApp</span>
                        </button>

                        {/* Quick info */}
                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <p className="text-xs text-slate-500 dark:text-slate-500 text-center">
                                Phone: {phoneNumber}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-500 text-center mt-2">
                                Available 24/7
                            </p>
                        </div>

                        {/* Arrow pointer */}
                        <div className="absolute right-0 top-1/2 transform translate-x-full -translate-y-1/2 -mr-2">
                            <div className="border-8 border-transparent border-l-white dark:border-l-slate-800"></div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default WhatsAppFloatingButton;
