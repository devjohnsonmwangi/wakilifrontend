import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar"; // Ensure correct path
import Drawer from "./aside/Drawer"; // Ensure correct path
import { useSelector } from 'react-redux';
import { RootState } from "../../app/store"; // Ensure correct path

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!user || !user.user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  if (!user || !user.user) {
    return null; // Or a loading indicator
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Navbar will render the mobile AppDrawer instance when toggled */}
      <Navbar />

      <div className="flex flex-1 lg:flex-row overflow-hidden mt-16"> {/* mt-16 for top navbar */}
        {/* Desktop Sidebar - Drawer handles its own 'hidden lg:flex' internally now via isMobileMode={false} */}
        {/* The <Drawer /> component itself handles being 'relative' and filling this space on desktop */}
        {/* Or, explicitly hide this instance on mobile if Drawer.tsx doesn't handle it strongly enough */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 flex-shrink-0">
          {/* Pass isMobileMode={false} or no props (defaults to false) for desktop */}
          <Drawer />
        </aside>

        <main className="flex-1 overflow-y-auto pb-16 lg:pb-0"> {/* pb-16 for bottom mobile navbar */}
          <div className="p-4 sm:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;