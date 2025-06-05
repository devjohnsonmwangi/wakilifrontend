import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './app/store.ts';

// Pages and components
import Home from './pages/landingPage/Home.tsx';
import Register from './pages/register/Register.tsx';
import Login from './pages/login/Login.tsx';
import HowItWorks from './pages/HowItWorks.tsx';
import Contactus from './pages/contact.tsx';
import About from './pages/landingPage/About.tsx';
import Services from './pages/landingPage/Services.tsx';
import Dashboard from './pages/dashboard/Dashboard.tsx';
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
import UserPaymentRecords from './pages/dashboard/main/Payments/userpayments.tsx';
import MyDiary from './pages/dashboard/main/events/diary.tsx';
import SettingsPage from './pages/dashboard/main/settings.tsx';
import UserAppointments from './pages/dashboard/main/manageAppointment/myappointments.tsx';
import BranchAppointments from './pages/dashboard/main/manageAppointment/branchappointments.tsx';
import LegalNewsSection from './pages/updates.tsx';
// Corrected import name if your list page is indeed OurServices.tsx
import OurServices from './pages/dashboard/ourservices.tsx'; // <--- RENAMED IMPORT
import ServiceDetails from './pages/dashboard/servicedetails.tsx';
import LibDocumentList from './pages/dashboard/main/managedocs/library.tsx';
import BookAppointmentPage from './pages/dashboard/howtoappoint.tsx';
import TermsAndServicesPage from './pages/terms.tsx';
import PrivacyPolicyPage from './pages/privacypolicy.tsx';
import CookiePolicyPage from './pages/cookies.tsx';
import ClientAppointments from './pages/dashboard/main/manageAppointment/clientsappointments.tsx';
import ChatPage from './pages/ChatPage.tsx';

// Define routes
const router = createBrowserRouter([
  // Non-Dashboard Routes
  { path: '/', element: <Home />, errorElement: <Error /> },
  { path: 'register', element: <Register />, errorElement: <Error /> },
  { path: 'login', element: <Login />, errorElement: <Error /> },
  { path: 'howitworks', element: <HowItWorks />, errorElement: <Error /> },
  { path: 'contactus', element: <Contactus />, errorElement: <Error /> },
  { path: 'services', element: <Services />, errorElement: <Error /> }, // This is your landing page services
  { path: 'about', element: <About />, errorElement: <Error /> },
  { path: 'forgot-password', element: <RequestPasswordResetForm />, errorElement: <Error /> },
  { path: 'reset-password', element: <ResetPasswordForm token="someToken" mode="reset" />, errorElement: <Error /> },
  { path: 'account', element: <Account />, errorElement: <Error /> }, // Assuming this is a top-level account page separate from dashboard
  {path:'privacy-policy', element: <PrivacyPolicyPage />, errorElement: <Error /> }, // Assuming this is a privacy policy page
  {path:'terms', element: <TermsAndServicesPage />, errorElement: <Error /> }, // Assuming this is a terms page
  {path:'cookies', element: <CookiePolicyPage />, errorElement: <Error /> }, // Assuming this is a cookies page, can be same as terms
  { path: 'updates', element: <LegalNewsSection />, errorElement: <Error /> }, // Top-level updates

  // Dashboard nested routes
  {
    path: 'dashboard',
    element: <Dashboard />,
    errorElement: <Error />,
    children: [
      { index: true, element: <DashboardOverviewLoader /> },
      { path: 'supporttickets', element: <SupportTickets /> },
      // Corrected path for OurServices (list page) and ServiceDetails (detail page)
      { path: 'ourservices', element: <OurServices /> }, // Path: /dashboard/services
      { path: 'servicesdetails/:slug', element: <ServiceDetails /> }, // Path: /dashboard/servicesdetails/some-service-slug
      // ^^^ ENSURE THIS PATH IS CORRECT ^^^
      { path: 'account', element: <Account /> }, // Path: /dashboard/account
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
      // { path: 'dashboard', element: <DashboardOverviewLoader /> }, // This is redundant, index:true handles /dashboard
      { path: 'payment-portal', element: <UserPaymentPortal /> },
      { path: 'user-payments', element: <UserPaymentRecords /> },
      { path: 'mydiary', element: <MyDiary /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'updates', element: <LegalNewsSection /> }, // Path: /dashboard/updates (if different from top-level)
      { path: 'myclientsappointments', element: <UserAppointments /> },
      { path: 'branchappointments', element: <BranchAppointments /> },
      //general   document library
      {path: 'library', element: <LibDocumentList /> }, // Assuming this is a general document library
      //how  to  get an appointment
      {path: 'appoints', element: <BookAppointmentPage /> }, // Assuming this is a page explaining how to book appointments
      //clients  appointment
      {path:'myappointments', element: <ClientAppointments /> }, // Assuming this is a page for clients to view their appointments
      //import chatpage
      {path:'chats',element: <ChatPage /> }, // Placeholder for chat page, replace with actual component if needed
    ],
  },
  // No need for a separate global fallback here if Dashboard has its own errorElement
  // and top-level routes also have errorElement.
  // However, a global "catch-all" at the very end can be useful.
  { path: '*', element: <Error /> } // A simple catch-all for truly unmatched routes
]);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
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