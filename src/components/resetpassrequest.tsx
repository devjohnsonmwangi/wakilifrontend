// src/components/auth/RequestPasswordResetForm.tsx

import React, { useState, FormEvent, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useRequestPasswordResetMutation } from '../features/users/usersAPI';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

// Icon components
const IconMail = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
  </svg>
);

const IconKey = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-indigo-300">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
  </svg>
);

const IconLoadingSpinner = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export const RequestPasswordResetForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [requestReset, { isLoading, isSuccess, error, data, reset }] = useRequestPasswordResetMutation();

  const getErrorMessage = (error: FetchBaseQueryError | SerializedError | undefined): string | null => {
    if (!error) return null;
    if ('status' in error) {
      const errData = 'data' in error ? (error.data as { error?: string; msg?: string }) : undefined;
      return errData?.error || errData?.msg || `Request failed (Status: ${error.status})`;
    }
    return error.message || 'An unexpected error occurred';
  };

  useEffect(() => {
    const errorMessage = getErrorMessage(error);

    if (isSuccess && data?.msg) {
      toast.success("Request Successful", { description: data.msg });
    } else if (error && errorMessage) {
      toast.error("Request Failed", { description: errorMessage });
    }
  }, [isSuccess, error, data, reset]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || isLoading || isSuccess) return;
    try {
      await requestReset({ email });
    } catch (err) {
      console.error('Sync error during request password reset submission:', err);
      toast.error("Submission Error", { description: "An unexpected issue occurred." });
    }
  };

  return (
    <div className="min-h-screen flex items-center bg-[#c2d6c2] justify-center py-6 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl border border-gray-100">
        {/* Fancy Header */}
        <div className="bg-gradient-to-br from-indigo-200 via-white to-purple-50 p-8 text-center border-b border-gray-200">
          <div className="inline-block p-3 bg-indigo-100 rounded-full mb-4">
            <IconKey />
          </div>
          <h2 className="text-3xl font-extrabold italic text-gray-900">
            Forgot Your Password?
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Worry   Not !
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Enter your email to receive instructions on how to reset it.
          </p>
        </div>

        {/* Form Area */}
        <div className="p-8 pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input Group */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <IconMail />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading || isSuccess}
                  placeholder="you@example.com"
                  className={`block w-full rounded-lg border focus:z-10
                             border-gray-300 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900
                             placeholder-gray-400 focus:border-indigo-500 focus:outline-none
                             focus:ring-1 focus:ring-indigo-500
                             disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-500`}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading || isSuccess}
                className={`group relative flex w-full justify-center rounded-lg border border-transparent
                           bg-gradient-to-br from-indigo-600 to-purple-600 py-3 px-4
                           text-sm font-semibold text-white shadow-sm transition-all duration-150 ease-in-out
                           hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                           disabled:opacity-60 disabled:shadow-none disabled:from-indigo-400 disabled:to-purple-400
                           transform active:scale-[0.98]`}
              >
                {isLoading && <IconLoadingSpinner />}
                {isLoading ? 'Processing...' : isSuccess ? 'Check Your Email!' : 'Send Reset Instructions'}
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <Link to="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 rounded">
                Remembered password? Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
