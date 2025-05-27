// src/components/common/Modal.tsx
import React, { ReactNode, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

interface ModalProps {
    title: string;
    children: ReactNode;
    onClose: () => void;
    isOpen: boolean;
}

const Modal: React.FC<ModalProps> = ({ title, children, onClose, isOpen }) => {
    useEffect(() => {
        if (!isOpen) return;

        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        document.body.style.overflow = 'hidden'; // Prevent background scrolling

        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300 ease-in-out" 
            onClick={onClose} // Close on overlay click
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div
                className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalEnter p-6 sm:p-8"
                onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing it
            >
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                    <h3 id="modal-title" className="text-xl sm:text-2xl font-semibold text-gray-800">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                        aria-label="Close modal"
                    >
                        <FaTimes className="h-5 w-5" />
                    </button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
};

export default Modal;