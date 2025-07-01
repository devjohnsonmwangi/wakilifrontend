import React, { useState, FormEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useResetPasswordMutation, useChangePasswordMutation } from '../features/users/usersAPI';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

// --- SVG Icons ---
const IconLock = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-400"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 0 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>;
const IconEye = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>;
const IconEyeSlash = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.575M2.25 2.25l19.5 19.5" /></svg>;
const IconLoadingSpinner = () => <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
const IconBrokenLink = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-red-400"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg>;
const AnimatedCheckmark = () => <svg className="w-24 h-24" viewBox="0 0 130.2 130.2"><circle className="animate-draw-circle" cx="65.1" cy="65.1" r="62.1" fill="none" stroke="#22C55E" strokeWidth="6" strokeMiterlimit="10" style={{ strokeDasharray: 400, strokeDashoffset: 400 }}/><polyline className="animate-draw-check" points="100.2,40.2 51.5,88.8 29.8,67.5" fill="none" stroke="#22C55E" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" style={{ strokeDasharray: 100, strokeDashoffset: 100 }}/></svg>;
const IconValidation = ({ valid }: { valid: boolean }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 transition-colors ${valid ? 'text-green-500' : 'text-slate-400'}`}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>;

// --- API Error Type ---
interface APIErrorData { error?: string; msg?: string; issues?: Record<string, unknown>; }

// --- Component Props ---
interface ResetPasswordFormProps { token: string | null; mode: 'reset' | 'change'; }

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ token, mode }) => {
    // --- State Management ---
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [clientError, setClientError] = useState<string | null>(null);
    const [passwordValidity, setPasswordValidity] = useState({
        length: false,
        uppercase: false,
        number: false,
        specialChar: false,
    });

    const navigate = useNavigate();

    // --- RTK Query Hooks ---
    const [submitPasswordReset, resetState] = useResetPasswordMutation();
    const [submitPasswordChange, changeState] = useChangePasswordMutation();

    const { isLoading, isSuccess, error, data } = mode === 'reset' ? resetState : changeState;

    // --- Effects ---
    useEffect(() => {
        const uppercaseRegex = /[A-Z]/;
        const numberRegex = /[0-9]/;
        const specialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

        setPasswordValidity({
            length: newPassword.length >= 8,
            uppercase: uppercaseRegex.test(newPassword),
            number: numberRegex.test(newPassword),
            specialChar: specialCharRegex.test(newPassword),
        });
    }, [newPassword]);
    
    // --- Handlers ---
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setClientError(null);

        if (!Object.values(passwordValidity).every(Boolean)) {
            setClientError("Password does not meet all requirements.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setClientError("Passwords do not match.");
            return;
        }
        if (!token) {
            setClientError("Password reset token is missing or invalid.");
            return;
        }

        try {
            const payload = { token, newPassword };
            if (mode === 'reset') {
                await submitPasswordReset(payload).unwrap();
            } else {
                await submitPasswordChange(payload).unwrap();
            }
        } catch (err) {
            // API error is handled by the `error` state from RTK Query
            console.error(`Failed to ${mode} password:`, err);
        }
    };
    
    const getApiErrorMessage = (err: FetchBaseQueryError | SerializedError | undefined): string | null => {
        if (!err) return null;
        if ('status' in err) {
            const errData = 'data' in err ? (err.data as APIErrorData) : undefined;
            return errData?.error || errData?.msg || `An unexpected error occurred.`;
        }
        return err.message || 'An unexpected error occurred.';
    };
    const apiErrorMessage = getApiErrorMessage(error);

    // --- Render Views ---
    const InvalidTokenView = () => (
        <div className="text-center animate-fade-in-up">
            <div className="flex justify-center mb-6">
                <IconBrokenLink />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Invalid Token</h2>
            <p className="text-slate-600 mt-2 mb-6">This password reset link is either invalid or has expired. Please request a new one.</p>
            <Link
                to="/forgot-password"
                className="inline-flex items-center justify-center w-full rounded-xl py-3 px-4 text-sm font-semibold transition-all duration-300 bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5"
            >
                Request a New Link
            </Link>
        </div>
    );
    
    const SuccessView = () => (
        <div className="text-center animate-fade-in-up">
            <div className="flex justify-center mb-6">
                <AnimatedCheckmark />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Password Updated!</h2>
            <p className="text-slate-600 mt-2 mb-8">{data?.msg || "Your password has been changed successfully. You can now log in with your new credentials."}</p>
            <button
                onClick={() => navigate('/login')}
                className="group relative overflow-hidden flex w-full justify-center rounded-xl border border-transparent bg-gradient-to-r from-green-500 to-emerald-600 py-3.5 px-4 text-sm font-semibold text-white shadow-lg shadow-green-500/30 transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-0.5"
            >
                Proceed to Login →
            </button>
        </div>
    );

    const PasswordFormView = () => (
        <div className="animate-fade-in-up">
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-2">
                {mode === 'reset' ? 'Set a New Password' : 'Change Your Password'}
            </h2>
            <p className="text-slate-600 text-center mb-8">Your new password must be strong and secure.</p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* New Password Field */}
                <div>
                    <label htmlFor="newPassword" className="block text-sm font-semibold text-slate-700 mb-1.5">New Password</label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5"><IconLock /></div>
                        <input
                            type={showPassword ? 'text' : 'password'} id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                            required disabled={isLoading} placeholder="Enter new password"
                            className="block w-full rounded-xl border border-slate-300 bg-white/80 py-3 pl-11 pr-12 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 hover:text-indigo-600">
                            {showPassword ? <IconEyeSlash /> : <IconEye />}
                        </button>
                    </div>
                </div>

                {/* Password Strength Checklist */}
                <ul className="space-y-1.5 text-xs text-slate-600 pl-1">
                    <li className="flex items-center gap-2"><IconValidation valid={passwordValidity.length} /> At least 8 characters long</li>
                    <li className="flex items-center gap-2"><IconValidation valid={passwordValidity.uppercase} /> Contains an uppercase letter</li>
                    <li className="flex items-center gap-2"><IconValidation valid={passwordValidity.number} /> Contains a number</li>
                    <li className="flex items-center gap-2"><IconValidation valid={passwordValidity.specialChar} /> Contains a special character (!@#$)</li>
                </ul>

                {/* Confirm Password Field */}
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm New Password</label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5"><IconLock /></div>
                        <input
                            type={showPassword ? 'text' : 'password'} id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                            required disabled={isLoading} placeholder="Confirm new password"
                            className="block w-full rounded-xl border border-slate-300 bg-white/80 py-3 pl-11 pr-12 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                {/* Error Display */}
                {(clientError || apiErrorMessage) && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                        {clientError || apiErrorMessage}
                    </div>
                )}

                {/* Submit Button */}
                <div>
                    <button
                        type="submit" disabled={isLoading}
                        className="group relative overflow-hidden flex w-full justify-center rounded-xl border border-transparent bg-gradient-to-r from-indigo-600 to-purple-600 py-3.5 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0 active:scale-[0.98]"
                    >
                        <span className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-white/30 via-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 animate-shine"></span>
                        {isLoading ? <IconLoadingSpinner /> : 'Update Password'}
                    </button>
                </div>
            </form>
        </div>
    );

    return (
        <div className="w-full max-w-lg mx-auto bg-white/70 backdrop-blur-2xl shadow-2xl shadow-slate-900/20 rounded-3xl p-8 md:p-12 border border-white/50 animate-fade-in-up">
            <div className="absolute inset-0 rounded-3xl p-px bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300 -z-10"></div>
            {!token ? <InvalidTokenView /> : isSuccess ? <SuccessView /> : <PasswordFormView />}
        </div>
    );
};

export default ResetPasswordForm;