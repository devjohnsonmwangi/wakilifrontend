import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar"; 
import Drawer from "./aside/Drawer"; 
import { useSelector } from 'react-redux';
import { RootState } from "../../app/store"; 
import DashboardRouteChangeTracker from "../../components/RouteChangeTracker"; 

const Dashboard = () => {
  const navigate = useNavigate();
  
  const userAuthData = useSelector((state: RootState) => state.user);
  const currentUserDetails = userAuthData?.user; 

  useEffect(() => {
    
    if (!currentUserDetails || !currentUserDetails.email) {
      navigate('/login', { replace: true });
    }
  }, [currentUserDetails, navigate]);

  
  if (!currentUserDetails || !currentUserDetails.email) { 
    
    return (
        <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <p className="text-lg text-gray-700 dark:text-gray-300">Loading user session...</p>
        </div>
    );
  }

  return (
    <>
      <DashboardRouteChangeTracker />
      <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="flex flex-1 lg:flex-row overflow-hidden mt-16"> 
          <aside className="hidden lg:flex lg:flex-col lg:w-64 flex-shrink-0">
            <Drawer />
          </aside>
          <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
            
            <div className="p-4 sm:p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Dashboard;