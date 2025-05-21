// src/components/auth/ResetPasswordForm.tsx
import React, { useState, FormEvent, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useResetPasswordMutation, useChangePasswordMutation } from '../features/users/usersAPI';

interface ResetPasswordFormProps {
  token: string | null;
  mode: 'reset' | 'change';
}

interface APIError {
  status: number;
  data: {
    error: string;
  };
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ token, mode }) => {
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [apiErrorMsg, setApiErrorMsg] = useState<string | null>(null);

  const [submitPasswordReset, resetState] = useResetPasswordMutation();
  const [submitPasswordChange, changeState] = useChangePasswordMutation();

  const isLoading = mode === 'reset' ? resetState.isLoading : changeState.isLoading;
  const isSuccess = mode === 'reset' ? resetState.isSuccess : changeState.isSuccess;
  const error = mode === 'reset' ? resetState.error : changeState.error;
  const data = mode === 'reset' ? resetState.data : changeState.data;

  useEffect(() => {
    if (error) {
      let message = 'An unknown error occurred';
      if ('status' in error) {
        const apiError = error as APIError;
        message = apiError.data?.error || message;
      } else if (error instanceof Error) {
        message = error.message || message;
      }
      setApiErrorMsg(message);
      setErrorMsg(null);
    } else {
      setApiErrorMsg(null);
    }
  }, [error]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setApiErrorMsg(null);

    if (!token) {
      setErrorMsg("Password reset token is missing or invalid. Please request a new link.");
      return;
    }
    if (newPassword.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
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
      console.error(`Failed to ${mode} password:`, err);
    }
  };

  return (
    <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        {mode === 'reset' ? 'Reset Your Password' : 'Change Your Password'}
      </h2>

      {!token && (
        <p className="text-sm text-center text-red-600 mt-4">
          Invalid or missing password {mode} token. Please request the link again.
        </p>
      )}

      {token && !isSuccess && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              New Password:
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              disabled={isLoading}
              placeholder="Enter new password (min 8 chars)"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password:
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              disabled={isLoading}
              placeholder="Confirm new password"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {errorMsg && <p className="text-sm text-center text-red-600">{errorMsg}</p>}
          {apiErrorMsg && <p className="text-sm text-center text-red-600">{apiErrorMsg}</p>}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : 'Update Password'}
            </button>
          </div>
        </form>
      )}

      {isSuccess && data && (
        <div className="text-center mt-4 space-y-3">
          <p className="text-sm text-green-600">{data.msg}</p>
          <Link to="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            Proceed to Login →
          </Link>
        </div>
      )}
    </div>
  );
};

export default ResetPasswordForm;
