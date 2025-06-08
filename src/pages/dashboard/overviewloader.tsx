// src/components/dashboard/DashboardOverviewLoader.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store'; 
import DashboardOverview from './dashboardoverview'; 
import { Navigate } from 'react-router-dom';

const DashboardOverviewLoader: React.FC = () => {
  const userData = useSelector((state: RootState) => state.user.user); 

  
  const notificationCount = 3; 

  if (!userData) {
    
    console.warn("DashboardOverviewLoader: User data not found, redirecting to login.");
    return <Navigate to="/login" replace />;
  }

  
  const userName = userData.full_name || userData.full_name || 'Wakili User'; 
  const userEmail = userData.email || 'No email provided';
  const userAvatarUrl = userData.profile_picture || undefined; 

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