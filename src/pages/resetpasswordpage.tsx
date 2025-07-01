// src/pages/ResetPasswordPage.tsx

import React from 'react';
import { useSearchParams } from 'react-router-dom';
// The path to your form component might be different. 
// I am using the path from your main.tsx file.
import ResetPasswordForm from '../components/resetpass.tsx'; 

const ResetPasswordPage: React.FC = () => {
  // This hook is from react-router-dom and reads URL query parameters
  const [searchParams] = useSearchParams();

  // Get the 'token' from the URL (e.g., from ?token=...)
  const token = searchParams.get('token');

  return (
    // You can add styling here to center the form on the page
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ResetPasswordForm token={token} mode="reset" />
    </div>
  );
};

export default ResetPasswordPage;