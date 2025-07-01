import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useRequestPasswordResetMutation } from '../features/users/usersAPI';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

// --- SVG Icons (with added animations and styles) ---
const IconMail = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-400"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>;
const IconLoadingSpinner = () => <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
const IconAlert = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-red-500"><path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" /></svg>;
const IconShieldCheck = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-indigo-500"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286Zm-1.5 6.445 1.5 1.5 3-3" /></svg>;
const IconCheckCircle = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-indigo-500"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;

const AnimatedCheckmark = () => (
    <svg className="w-24 h-24" viewBox="0 0 130.2 130.2">
        <circle className="animate-draw-circle" cx="65.1" cy="65.1" r="62.1" fill="none" stroke="#6366F1" strokeWidth="6" strokeMiterlimit="10" style={{ strokeDasharray: 400, strokeDashoffset: 400 }}/>
        <polyline className="animate-draw-check" points="100.2,40.2 51.5,88.8 29.8,67.5" fill="none" stroke="#6366F1" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" style={{ strokeDasharray: 100, strokeDashoffset: 100 }}/>
    </svg>
);

// --- Main Component ---
export const RequestPasswordResetForm: React.FC = () => {
    // --- State Management ---
    const [email, setEmail] = useState<string>('');
    const [clientError, setClientError] = useState<string | null>(null);
    const [requestReset, { isLoading, error, reset }] = useRequestPasswordResetMutation();
    const [isSuccess, setIsSuccess] = useState(false);
    const [cooldownTime, setCooldownTime] = useState(0);
    const timerRef = useRef<NodeJS.Timeout>();

    const COOLDOWN_SECONDS = 60;

    // --- Handlers & Logic ---
    const getApiErrorMessage = (err: FetchBaseQueryError | SerializedError | undefined): string | null => {
        if (!err) return null;
        if ('status' in err) {
            const errData = 'data' in err ? (err.data as { error?: string; msg?: string }) : undefined;
            return errData?.error || errData?.msg || `An unexpected server error occurred.`;
        }
        return err.message || 'An unexpected error occurred.';
    };
    const apiErrorMessage = getApiErrorMessage(error);

    const validateEmail = (emailStr: string): boolean => {
        if (!emailStr) {
            setClientError("Email address is required.");
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailStr)) {
            setClientError("Please enter a valid email address.");
            return false;
        }
        setClientError(null);
        return true;
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isLoading || cooldownTime > 0) return;
        if (!validateEmail(email)) return;
        try {
            await requestReset({ email }).unwrap();
            setIsSuccess(true);
        } catch (err) {
            console.error('Request Password Reset submission failed:', err);
        }
    };

    const handleReset = () => {
        setIsSuccess(false);
        setEmail('');
        setClientError(null);
        reset();
    };

    // --- Effects ---
    useEffect(() => {
        if (isSuccess) {
            toast.success("Request Sent Successfully", {
                description: "If an account exists, a recovery link has been sent.",
            });
            setCooldownTime(COOLDOWN_SECONDS);
        }
    }, [isSuccess]);

    useEffect(() => {
        if (apiErrorMessage) {
            toast.error("Request Failed", { description: apiErrorMessage });
        }
    }, [apiErrorMessage]);
    
    useEffect(() => {
        if (cooldownTime > 0) {
            timerRef.current = setTimeout(() => setCooldownTime(cooldownTime - 1), 1000);
        }
        return () => clearTimeout(timerRef.current);
    }, [cooldownTime]);

    useEffect(() => {
        return () => { // Cleanup on unmount
            clearTimeout(timerRef.current);
            reset();
        };
    }, [reset]);

    const isButtonDisabled = isLoading || cooldownTime > 0;

    return (
        <div className="min-h-screen w-full bg-animated-gradient flex items-center justify-center p-4">
            <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row bg-white/70 backdrop-blur-2xl shadow-2xl shadow-slate-900/20 rounded-3xl overflow-hidden animate-fade-in-up relative border border-white/50">
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 rounded-3xl p-px bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300 -z-10"></div>
                
                {/* --- Information Panel (Always Visible) --- */}
                <div className="flex flex-col justify-center p-8 md:p-12 lg:w-1/2 bg-white/50 border-b lg:border-b-0 lg:border-r border-slate-200/50 bg-dot-pattern">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-white shadow-md border border-slate-200/80 rounded-full">
                            <IconShieldCheck />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">Account Recovery</h2>
                            <p className="text-slate-600">Securely regain access to your account.</p>
                        </div>
                    </div>
                    
                    <div className="space-y-6 text-slate-700">
                        {/* --- Restored Original Paragraph --- */}
                        <p>Follow the simple steps on the right. We will send a unique, single-use link to your registered email address.</p>
                        
                        {/* --- Restored Step-by-Step Guidance --- */}
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                                <IconCheckCircle />
                                <span><strong className="font-semibold text-slate-800">Step 1:</strong> Enter your email address.</span>
                            </li>
                            <li className="flex items-start gap-3 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                                <IconCheckCircle />
                                <span><strong className="font-semibold text-slate-800">Step 2:</strong> Click the secure link in the email we send you.</span>
                            </li>
                            <li className="flex items-start gap-3 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                                <IconCheckCircle />
                                <span><strong className="font-semibold text-slate-800">Step 3:</strong> Choose a new, strong password.</span>
                            </li>
                        </ul>
                        
                        {/* --- Restored Security First Box --- */}
                        <div className="p-4 bg-indigo-50/80 border border-indigo-200/80 rounded-lg text-sm text-indigo-900">
                            <strong className="font-semibold">Security First:</strong> We will never ask for your password via email. The link is valid for a limited time for your protection.
                        </div>

                        {/* --- Restored Footer Text --- */}
                        <p className="text-xs text-slate-500">
                            Can't find the email? Please check your spam or junk folder. If you still face issues, contact our support team.
                        </p>
                    </div>
                </div>

                {/* --- Form / Success View Panel --- */}
                <div className="p-8 md:p-12 lg:w-1/2 flex flex-col justify-center">
                    <div className="w-full max-w-md mx-auto">
                        {isSuccess ? (
                            <div className="text-center animate-fade-in-up">
                                <div className="flex justify-center mb-6">
                                    <AnimatedCheckmark />
                                </div>
                                <h3 className="text-3xl font-bold text-slate-900 mb-2">Request Sent!</h3>
                                <p className="text-slate-600 mb-6">
                                    Please check your inbox for an email sent to <br/>
                                    <strong className="text-indigo-600 break-all">{email}</strong>
                                </p>
                                <button
                                    onClick={handleReset}
                                    disabled={cooldownTime > 0}
                                    className={`w-full rounded-xl py-3.5 px-4 text-sm font-semibold transition-all duration-300
                                        ${cooldownTime > 0 
                                            ? 'bg-slate-200 text-slate-500 cursor-not-allowed' 
                                            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5'
                                        }`}
                                >
                                    {cooldownTime > 0 ? `Request Another (${cooldownTime}s)` : 'Send Another Link'}
                                </button>
                            </div>
                        ) : (
                            <div className="animate-fade-in-up">
                                <h3 className="text-3xl font-bold text-slate-900 mb-2">Forgot Password?</h3>
                                <p className="text-slate-600 mb-8">No problem. Let's get you a new one.</p>
                                
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                                        <div className="relative group">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5"><IconMail /></div>
                                            <input
                                                type="email" id="email" name="email" value={email} onChange={handleEmailChange}
                                                onBlur={() => validateEmail(email)} required disabled={isLoading} placeholder="you@example.com"
                                                className={`block w-full rounded-xl border py-3.5 pl-11 pr-4 text-sm transition duration-150 ease-in-out
                                                    ${clientError 
                                                        ? 'border-red-400 bg-red-50 text-red-900 placeholder-red-400 focus:ring-red-500 focus:border-red-500' 
                                                        : 'border-slate-300 bg-white/80 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-indigo-500'
                                                    }
                                                    focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed`}
                                            />
                                            {clientError && <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5"><IconAlert /></div>}
                                        </div>
                                        {clientError && <p className="mt-2 text-xs text-red-600 font-medium">{clientError}</p>}
                                        {apiErrorMessage && <p className="mt-2 text-xs text-red-600 font-medium">{apiErrorMessage}</p>}
                                    </div>

                                    <div>
                                        <button
                                            type="submit" disabled={isButtonDisabled}
                                            className="group relative overflow-hidden flex w-full justify-center rounded-xl border border-transparent bg-gradient-to-r from-indigo-600 to-purple-600 py-3.5 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0 active:scale-[0.98] active:shadow-md"
                                        >
                                            <span className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-white/30 via-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 animate-shine"></span>
                                            {isLoading ? <IconLoadingSpinner /> : 'Send Recovery Link'}
                                        </button>
                                    </div>
                                    
                                    <div className="text-center pt-4 border-t border-slate-200/80">
                                        <Link to="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:underline">Back to Login</Link>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};