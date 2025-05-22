// src/components/dashboard/DashboardOverviewLoader.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store'; // Adjust path
import DashboardOverview from './dashboardoverview'; // Adjust path
import { Navigate } from 'react-router-dom';

const DashboardOverviewLoader: React.FC = () => {
  const userData = useSelector((state: RootState) => state.user.user); // Assuming user details are in state.user.user

  // Since notifications does not exist on RootState, provide a default value
  const notificationCount = 3; // Default or fetch from another valid source

  if (!userData) {
    // This case should ideally be handled by the parent Dashboard layout's redirect
    // but as a safeguard or if user data is somehow lost:
    console.warn("DashboardOverviewLoader: User data not found, redirecting to login.");
    return <Navigate to="/login" replace />;
  }

  // Construct the props for DashboardOverview
  // Adjust these based on your actual Redux state structure
  const userName = userData.full_name || userData.full_name || 'Wakili User'; // Prioritize full_name
  const userEmail = userData.email || 'No email provided';
  const userAvatarUrl = userData.profile_picture || undefined; // Assuming image_url for avatar

  return (
    <DashboardOverview
      userName={userName}
      userEmail={userEmail}
      userAvatarUrl={userAvatarUrl}
      notificationCount={notificationCount}
      userRole={userData.role}
    />
  );
};

export default DashboardOverviewLoader;