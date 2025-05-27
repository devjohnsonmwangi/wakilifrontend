import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistedStore } from './app/store.ts';

// Pages and components
import Home from './pages/landingPage/Home.tsx';
import Register from './pages/register/Register.tsx';
import Login from './pages/login/Login.tsx';
import HowItWorks from './pages/HowItWorks.tsx';
import Contactus from './pages/contact.tsx';
import About from './pages/landingPage/About.tsx';
import Services from './pages/landingPage/Services.tsx';
import Dashboard from './pages/dashboard/Dashboard.tsx'; // This is your layout that will contain the tracker
import Reports from './pages/dashboard/main/Reports/Reports.tsx';
import ResetPasswordForm from './components/resetpass.tsx';
import { RequestPasswordResetForm } from './components/resetpassrequest.tsx';
import MyCases from './pages/dashboard/main/Managecases/mycases.tsx';
import Cases from './pages/dashboard/main/Managecases/managecases.tsx';
import DocumentList from './pages/dashboard/main/managedocs/listupdatedoc.tsx';
import SupportTickets from './pages/dashboard/main/Tickets/SupportTickets.tsx';
import Profile from './pages/dashboard/main/Profile.tsx';
import Error from './pages/Error.tsx';
import Account from './pages/dashboard/main/Account.tsx';
import MyTickets from './pages/dashboard/main/Tickets/MyTickets.tsx';
import Logout from './components/logout/logout.tsx';
import AppointmentList from './pages/dashboard/main/manageAppointment/listappointments.tsx';
import BranchLocationManagement from './pages/dashboard/main/branchlocation/listbranch.tsx';
import PaymentHistory from './pages/dashboard/main/Payments/PaymentModal.tsx';
import EventsPage from './pages/dashboard/main/events/EventsPage.tsx';
import DashboardOverviewLoader from './pages/dashboard/overviewloader.tsx';
import FullActivityHistory from './pages/dashboard/FullActivityHistory.tsx';
import HelpCenter from './pages/dashboard/helpcenter.tsx';
import UserPaymentPortal from './pages/dashboard/main/Payments/singleuserpayments.tsx';

// NOTE: We are NOT importing RouteChangeTracker here globally anymore.
// It will be imported and used within Dashboard.tsx

// Define routes
const router = createBrowserRouter([
  // Non-Dashboard Routes (will not be tracked by the tracker inside Dashboard.tsx)
  { path: '/', element: <Home />, errorElement: <Error /> },
  { path: 'register', element: <Register />, errorElement: <Error /> },
  { path: 'login', element: <Login />, errorElement: <Error /> },
  { path: 'howitworks', element: <HowItWorks />, errorElement: <Error /> },
  { path: 'contactus', element: <Contactus />, errorElement: <Error /> },
  { path: 'services', element: <Services />, errorElement: <Error /> },
  { path: 'about', element: <About />, errorElement: <Error /> },
  { path: 'forgot-password', element: <RequestPasswordResetForm />, errorElement: <Error /> },
  { path: 'reset-password', element: <ResetPasswordForm token="someToken" mode="reset" />, errorElement: <Error /> }, // Ensure token is dynamic or placeholder
  //account
  {path: 'account', element: <Account />, errorElement: <Error />},
  // Dashboard nested routes
  {
    path: 'dashboard',
    element: <Dashboard />, // Dashboard.tsx will contain its own DashboardRouteChangeTracker
    errorElement: <Error />,
    children: [
      { index: true, element: <DashboardOverviewLoader /> }, // Default for /dashboard
      { path: 'supporttickets', element: <SupportTickets /> },
      { path: 'account', element: <Account /> },
      { path: 'appoint', element: <AppointmentList /> },
      { path: 'events', element: <EventsPage /> },
      { path: 'payments', element: <PaymentHistory /> },
      { path: 'profile', element: <Profile /> },
      { path: 'listdoc', element: <DocumentList /> },
      { path: 'mytickets', element: <MyTickets /> },
      { path: 'logout', element: <Logout /> },
      { path: 'mycases', element: <MyCases /> },
      { path: 'cases', element: <Cases /> },
      // Example for dynamic case route:
      // { path: 'cases/:caseId', element: <YourCaseDetailPageComponent /> },
      { path: 'reports', element: <Reports /> },
      { path: 'branch', element: <BranchLocationManagement /> },
      {path: 'activity-log',element:<FullActivityHistory/>},
      {path:'help',element:<HelpCenter/>},
      {path:'dashboard',element:<DashboardOverviewLoader/>},
      //single user payment portal
      {path: 'payment-portal', element: <UserPaymentPortal  />}, // Replace 1 with dynamic userId as needed
    ],
  },
  // Remove duplicate top-level routes that are meant to be under /dashboard
  // For example, if /profile is only meant to be /dashboard/profile, remove the top-level one.
  // If they are distinct pages, keep them, but they won't be tracked by the dashboard tracker.
]);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistedStore}>
        {/* Render RouterProvider directly. The tracker is now inside Dashboard.tsx */}
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

// ... rest of your service worker code
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered: ', registration);
      })
      .catch(registrationError => {
        console.error('Service Worker registration failed: ', registrationError);
      });
  });
}