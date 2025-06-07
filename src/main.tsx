import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// --- Router Imports ---
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// --- Redux Imports ---
import { Provider, useSelector, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor, RootState, AppDispatch } from './app/store.ts';

// --- Real-time Online Status Imports ---
import { socket } from './socket.ts';
import { setUserStatus, setInitialOnlineUsers } from './features/online/online.ts';

// --- Page & Component Imports ---
// Core Pages
import Home from './pages/landingPage/Home.tsx';
import Register from './pages/register/Register.tsx';
import Login from './pages/login/Login.tsx';
import Error from './pages/Error.tsx';

// Landing & Info Pages
import HowItWorks from './pages/HowItWorks.tsx';
import Contactus from './pages/contact.tsx';
import About from './pages/landingPage/About.tsx';
import Services from './pages/landingPage/Services.tsx';
import LegalNewsSection from './pages/updates.tsx';
import TermsAndServicesPage from './pages/terms.tsx';
import PrivacyPolicyPage from './pages/privacypolicy.tsx';
import CookiePolicyPage from './pages/cookies.tsx';

// Authentication & Account
import ResetPasswordForm from './components/resetpass.tsx';
import { RequestPasswordResetForm } from './components/resetpassrequest.tsx';
import Logout from './components/logout/logout.tsx';

// Dashboard and Main Feature Pages
import Dashboard from './pages/dashboard/Dashboard.tsx';
import DashboardOverviewLoader from './pages/dashboard/overviewloader.tsx';
import Reports from './pages/dashboard/main/Reports/Reports.tsx';
import MyCases from './pages/dashboard/main/Managecases/mycases.tsx';
import Cases from './pages/dashboard/main/Managecases/managecases.tsx';
import DocumentList from './pages/dashboard/main/managedocs/listupdatedoc.tsx';
import SupportTickets from './pages/dashboard/main/Tickets/SupportTickets.tsx';
import Profile from './pages/dashboard/main/Profile.tsx';
import Account from './pages/dashboard/main/Account.tsx';
import MyTickets from './pages/dashboard/main/Tickets/MyTickets.tsx';
import AppointmentList from './pages/dashboard/main/manageAppointment/listappointments.tsx';
import BranchLocationManagement from './pages/dashboard/main/branchlocation/listbranch.tsx';
import PaymentHistory from './pages/dashboard/main/Payments/PaymentModal.tsx';
import EventsPage from './pages/dashboard/main/events/EventsPage.tsx';
import FullActivityHistory from './pages/dashboard/FullActivityHistory.tsx';
import HelpCenter from './pages/dashboard/helpcenter.tsx';
import UserPaymentPortal from './pages/dashboard/main/Payments/singleuserpayments.tsx';
import UserPaymentRecords from './pages/dashboard/main/Payments/userpayments.tsx';
import MyDiary from './pages/dashboard/main/events/diary.tsx';
import SettingsPage from './pages/dashboard/main/settings.tsx';
import UserAppointments from './pages/dashboard/main/manageAppointment/myappointments.tsx';
import BranchAppointments from './pages/dashboard/main/manageAppointment/branchappointments.tsx';
import OurServices from './pages/dashboard/ourservices.tsx';
import ServiceDetails from './pages/dashboard/servicedetails.tsx';
import LibDocumentList from './pages/dashboard/main/managedocs/library.tsx';
import BookAppointmentPage from './pages/dashboard/howtoappoint.tsx';
import ClientAppointments from './pages/dashboard/main/manageAppointment/clientsappointments.tsx';
import ChatPage from './pages/ChatPage.tsx';
import NotificationsPage from './features/notifications/components/NotificationsPage.tsx';

// --- Router Definition ---
const router = createBrowserRouter([
  // Non-Dashboard Routes
  { path: '/', element: <Home />, errorElement: <Error /> },
  { path: 'register', element: <Register />, errorElement: <Error /> },
  { path: 'login', element: <Login />, errorElement: <Error /> },
  { path: 'howitworks', element: <HowItWorks />, errorElement: <Error /> },
  { path: 'contactus', element: <Contactus />, errorElement: <Error /> },
  { path: 'services', element: <Services />, errorElement: <Error /> },
  { path: 'about', element: <About />, errorElement: <Error /> },
  { path: 'forgot-password', element: <RequestPasswordResetForm />, errorElement: <Error /> },
  { path: 'reset-password', element: <ResetPasswordForm token="someToken" mode="reset" />, errorElement: <Error /> },
  { path: 'privacy-policy', element: <PrivacyPolicyPage />, errorElement: <Error /> },
  { path: 'terms', element: <TermsAndServicesPage />, errorElement: <Error /> },
  { path: 'cookies', element: <CookiePolicyPage />, errorElement: <Error /> },
  { path: 'updates', element: <LegalNewsSection />, errorElement: <Error /> },

  // Dashboard nested routes
  {
    path: 'dashboard',
    element: <Dashboard />,
    errorElement: <Error />,
    children: [
      { index: true, element: <DashboardOverviewLoader /> },
      { path: 'supporttickets', element: <SupportTickets /> },
      { path: 'ourservices', element: <OurServices /> },
      { path: 'servicesdetails/:slug', element: <ServiceDetails /> },
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
      { path: 'reports', element: <Reports /> },
      { path: 'branch', element: <BranchLocationManagement /> },
      { path: 'activity-log', element: <FullActivityHistory /> },
      { path: 'help', element: <HelpCenter /> },
      { path: 'payment-portal', element: <UserPaymentPortal /> },
      { path: 'user-payments', element: <UserPaymentRecords /> },
      { path: 'mydiary', element: <MyDiary /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'myclientsappointments', element: <UserAppointments /> },
      { path: 'branchappointments', element: <BranchAppointments /> },
      { path: 'library', element: <LibDocumentList /> },
      { path: 'appoints', element: <BookAppointmentPage /> },
      { path: 'myappointments', element: <ClientAppointments /> },
      { path: 'chats', element: <ChatPage /> },
      {path:'notifications', element:<NotificationsPage />},
    ],
  },
  { path: '*', element: <Error /> }
]);


// --- Wrapper Component to Manage Socket.IO Connection ---
const AppWrapper = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const dispatch = useDispatch<AppDispatch>();

  // This useEffect hook manages the entire lifecycle of the socket connection.
  useEffect(() => {
    // Define functions to handle events from the server
    function onUserStatusChange({ userId, isOnline }: { userId: number, isOnline: boolean }) {
      dispatch(setUserStatus({ userId, isOnline }));
    }
    
    function onInitialUsersList(userIds: number[]) {
      dispatch(setInitialOnlineUsers(userIds));
    }

    // Manage connection based on login status
    if (token) {
      if (!socket.connected) {
        socket.connect();
      }
      socket.emit('authenticate', token);
      socket.on('user-status-change', onUserStatusChange);
      socket.on('online-users-list', onInitialUsersList);
    }

    // Cleanup function: runs on logout or when the app closes
    return () => {
      socket.off('user-status-change', onUserStatusChange);
      socket.off('online-users-list', onInitialUsersList);
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, [token, dispatch]);

  // The wrapper's job is to manage the side effect, then render the app's router.
  return <RouterProvider router={router} />;
};


// --- Main Render Function ---
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* Render the AppWrapper, which contains the socket logic and the router */}
        <AppWrapper />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

// Service worker registration
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