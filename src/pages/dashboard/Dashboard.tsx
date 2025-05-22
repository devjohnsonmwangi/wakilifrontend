import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar"; // Ensure correct path
import Drawer from "./aside/Drawer"; // Ensure correct path
import { useSelector } from 'react-redux';
import { RootState } from "../../app/store"; // Ensure correct path
import DashboardRouteChangeTracker from "../../components/RouteChangeTracker"; // Adjust this path as needed

const Dashboard = () => {
  const navigate = useNavigate();
  // Assuming 'user' from Redux state is the slice, and 'user.user' has the details
  const userAuthData = useSelector((state: RootState) => state.user);
  const currentUserDetails = userAuthData?.user; // This should be the object with email, name, etc.

  useEffect(() => {
    // Check if the currentUserDetails object exists and perhaps a key property like email
    if (!currentUserDetails || !currentUserDetails.email) { // Adjust 'email' if your user object key is different
      navigate('/login', { replace: true });
    }
  }, [currentUserDetails, navigate]);

  // This loading/redirect state should ideally happen before rendering the tracker
  // or the tracker itself should be resilient to missing user data if that's possible for its logic.
  // However, since the tracker logs activity, it implies a user is logged in.
  if (!currentUserDetails || !currentUserDetails.email) { // Adjust 'email' check
    // You might want a more specific loading component here
    return (
        <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <p className="text-lg text-gray-700 dark:text-gray-300">Loading user session...</p>
        </div>
    );
  }

  return (
    <> {/* Use a React Fragment to wrap the tracker and the main layout div */}
      <DashboardRouteChangeTracker /> {/* <<< Tracker is added here */}
      <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="flex flex-1 lg:flex-row overflow-hidden mt-16"> {/* mt-16 for top navbar */}
          <aside className="hidden lg:flex lg:flex-col lg:w-64 flex-shrink-0">
            <Drawer />
          </aside>
          <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
            {/* Padding: If your DashboardOverview and other pages handle their own padding,
                you might want p-0 here. If you want consistent padding from the layout, keep p-4 sm:p-6.
                I'll keep your original padding for now. */}
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