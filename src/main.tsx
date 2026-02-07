import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// --- Router Imports ---
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// --- Helmet Imports ---
import { HelmetProvider } from 'react-helmet-async';

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
import  LegalNewsSection from './pages/updates.tsx';
import TermsAndServicesPage from './pages/terms.tsx';
import PrivacyPolicyPage from './pages/privacypolicy.tsx';
import CookiePolicyPage from './pages/cookies.tsx';
import FamilyLaw from './pages/FamilyLaw.tsx';
import DivorceKenya from './pages/DivorceKenya.tsx';
import DivorceLawKenya from './pages/DivorceLawKenya.tsx';
import ChildLawKenya from './pages/ChildLawKenya.tsx';
import SuccessionLawKenya from './pages/SuccessionLawKenya.tsx';
import HowToWriteWillKenya from './pages/HowToWriteWillKenya.tsx';
import LettersAdministrationProbateKenya from './pages/LettersAdministrationProbateKenya.tsx';
import LandTransferAfterDeathKenya from './pages/LandTransferAfterDeathKenya.tsx';
import LandOwnershipTitleDeedKenya from './pages/LandOwnershipTitleDeedKenya.tsx';
import LandTransferProcessKenya from './pages/LandTransferProcessKenya.tsx';
import HowToBuyLandSafelyKenya from './pages/HowToBuyLandSafelyKenya.tsx';
import LandDisputesKenya from './pages/LandDisputesKenya.tsx';
import AdversePossessionKenya from './pages/AdversePossessionKenya.tsx';
import LeaseholdFreeholdKenya from './pages/LeaseholdFreeholdKenya.tsx';
import LostTitleDeedReplacementKenya from './pages/LostTitleDeedReplacementKenya.tsx';
import LandRatesPropertyTaxesKenya from './pages/LandRatesPropertyTaxesKenya.tsx';
import SubdivisionSurveyProcessKenya from './pages/SubdivisionSurveyProcessKenya.tsx';
import PlanningPermissionZoningLawsKenya from './pages/PlanningPermissionZoningLawsKenya.tsx';
import UnderstandingIEBCKenya from './pages/UnderstandingIEBCKenya.tsx';
import HowToRegisterAsAVoterKenya from './pages/HowToRegisterAsAVoterKenya.tsx';
import HowToCheckVoterStatusKenya from './pages/HowToCheckVoterStatusKenya.tsx';
import ElectionsInKenya from './pages/ElectionsInKenya.tsx';
import TypesOfElectionsKenya from './pages/TypesOfElectionsKenya.tsx';
import ElectionResultsDeclarationKenya from './pages/ElectionResultsDeclarationKenya.tsx';
import PoliticalPartiesRegistrationKenya from './pages/PoliticalPartiesRegistrationKenya.tsx';
import ElectionPetitionsDisputesKenya from './pages/ElectionPetitionsDisputesKenya.tsx';
import CitizensRightsDutiesElectionsKenya from './pages/CitizensRightsDutiesElectionsKenya.tsx';
import IEBCFormsDownloadsKenya from './pages/IEBCFormsDownloadsKenya.tsx';
import BecomeCandidateKenya from './pages/BecomeCandidateKenya.tsx';
import ElectionOffencesKenya from './pages/ElectionOffencesKenya.tsx';
import IEBCContactsOfficesKenya from './pages/IEBCContactsOfficesKenya.tsx';
import HowToRegisterBusinessKenya from './pages/HowToRegisterBusinessKenya.tsx';
import BusinessNameSearchKenya from './pages/BusinessNameSearchKenya.tsx';
import SoleProprietorshipRegistrationKenya from './pages/SoleProprietorshipRegistrationKenya.tsx';
import LimitedCompanyRegistrationKenya from './pages/LimitedCompanyRegistrationKenya.tsx';
import CR12CompanySearchKenya from './pages/CR12CompanySearchKenya.tsx';
import CompanyAnnualReturnsKenya from './pages/CompanyAnnualReturnsKenya.tsx';
import KRAPINRegistrationKenya from './pages/KRAPINRegistrationKenya.tsx';
import ClosingDeregisteringCompanyKenya from './pages/ClosingDeregisteringCompanyKenya.tsx';
import PartnershipLLPRegistrationKenya from './pages/PartnershipLLPRegistrationKenya.tsx';
import NGOCBOSocietyRegistrationKenya from './pages/NGOCBOSocietyRegistrationKenya.tsx';
import BusinessPermitsLicensesKenya from './pages/BusinessPermitsLicensesKenya.tsx';
import KRAPINAndTaxRegistrationKenya from './pages/KRAPINAndTaxRegistrationKenya.tsx';
import CompanyAnnualReturnsAndFilingKenya from './pages/CompanyAnnualReturnsAndFilingKenya.tsx';
import BusinessTaxObligationsKenya from './pages/BusinessTaxObligationsKenya.tsx';
import KenyaEmploymentLabourLaws from './pages/KenyaEmploymentLabourLaws.tsx';
import EmploymentContractsKenya from './pages/EmploymentContractsKenya.tsx';
import LabourDisputeResolutionKenya from './pages/LabourDisputeResolutionKenya.tsx';
import TerminationRedundancySeveranceKenya from './pages/TerminationRedundancySeveranceKenya.tsx';
import OccupationalHealthSafetyKenya from './pages/OccupationalHealthSafetyKenya.tsx';

// Authentication & Account
//import ResetPasswordForm from './components/resetpass.tsx';
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
import GeneralPaymentPortal from './pages/dashboard/main/Payments/generalpayments.tsx';
import ResetPasswordPage from './pages/resetpasswordpage.tsx';
import WhatsAppButton from './components/WhatsAppButton.tsx';

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
  { path: 'reset-password', element: <ResetPasswordPage />, errorElement: <Error /> },
  { path: 'privacy-policy', element: <PrivacyPolicyPage />, errorElement: <Error /> },
  { path: 'terms', element: <TermsAndServicesPage />, errorElement: <Error /> },
  { path: 'cookies', element: <CookiePolicyPage />, errorElement: <Error /> },
  { path: 'updates', element: < LegalNewsSection />, errorElement: <Error /> },
  { path: 'family-law-divorce-kenya', element: <FamilyLaw />, errorElement: <Error /> },
  { path: 'divorce-in-kenya', element: <DivorceKenya />, errorElement: <Error /> },
  { path: 'divorce-law-in-kenya', element: <DivorceLawKenya />, errorElement: <Error /> },
  { path: 'child-law-kenya', element: <ChildLawKenya />, errorElement: <Error /> },
  { path: 'succession-inheritance-law-kenya', element: <SuccessionLawKenya />, errorElement: <Error /> },
  { path: 'how-to-write-a-will-kenya', element: <HowToWriteWillKenya />, errorElement: <Error /> },
  { path: 'letters-of-administration-probate-kenya', element: <LettersAdministrationProbateKenya />, errorElement: <Error /> },
  { path: 'land-transfer-after-death', element: <LandTransferAfterDeathKenya />, errorElement: <Error /> },
  { path: 'land-ownership-title-deed-verification-kenya', element: <LandOwnershipTitleDeedKenya />, errorElement: <Error /> },
  { path: 'land-transfer-process-kenya', element: <LandTransferProcessKenya />, errorElement: <Error /> },
  { path: 'how-to-buy-land-safely-kenya', element: <HowToBuyLandSafelyKenya />, errorElement: <Error /> },
  { path: 'land-disputes-kenya', element: <LandDisputesKenya />, errorElement: <Error /> },
  { path: 'adverse-possession-kenya', element: <AdversePossessionKenya />, errorElement: <Error /> },
  { path: 'leasehold-freehold-kenya', element: <LeaseholdFreeholdKenya />, errorElement: <Error /> },
  { path: 'lost-title-deed-replacement-kenya', element: <LostTitleDeedReplacementKenya />, errorElement: <Error /> },
  { path: 'land-rates-property-taxes-kenya', element: <LandRatesPropertyTaxesKenya />, errorElement: <Error /> },
  { path: 'subdivision-survey-process-kenya', element: <SubdivisionSurveyProcessKenya />, errorElement: <Error /> },
  { path: 'planning-permission-zoning-laws-kenya', element: <PlanningPermissionZoningLawsKenya />, errorElement: <Error /> },
  { path: 'understanding-iebc-kenya', element: <UnderstandingIEBCKenya />, errorElement: <Error /> },
  { path: 'how-to-register-as-a-voter-kenya', element: <HowToRegisterAsAVoterKenya />, errorElement: <Error /> },
  { path: 'how-to-check-voter-status-kenya', element: <HowToCheckVoterStatusKenya />, errorElement: <Error /> },
  { path: 'elections-in-kenya', element: <ElectionsInKenya />, errorElement: <Error /> },
  { path: 'types-of-elections-kenya', element: <TypesOfElectionsKenya />, errorElement: <Error /> },
  { path: 'presidential-parliamentary-county-elections-kenya', element: <TypesOfElectionsKenya />, errorElement: <Error /> },
  { path: 'election-results-declaration-kenya', element: <ElectionResultsDeclarationKenya />, errorElement: <Error /> },
  { path: 'political-parties-registration-kenya', element: <PoliticalPartiesRegistrationKenya />, errorElement: <Error /> },
  { path: 'election-petitions-disputes-kenya', element: <ElectionPetitionsDisputesKenya />, errorElement: <Error /> },
  { path: 'citizens-rights-duties-elections-kenya', element: <CitizensRightsDutiesElectionsKenya />, errorElement: <Error /> },
  { path: 'iebc-forms-downloads-kenya', element: <IEBCFormsDownloadsKenya />, errorElement: <Error /> },
  { path: 'iebc-forms-downloads', element: <IEBCFormsDownloadsKenya />, errorElement: <Error /> },
  { path: 'become-candidate-kenya', element: <BecomeCandidateKenya />, errorElement: <Error /> },
  { path: 'election-offences-penalties-kenya', element: <ElectionOffencesKenya />, errorElement: <Error /> },
  { path: 'iebc-contacts-offices-kenya', element: <IEBCContactsOfficesKenya />, errorElement: <Error /> },
  { path: 'how-to-register-business-kenya', element: <HowToRegisterBusinessKenya />, errorElement: <Error /> },
  { path: 'business-name-search-kenya', element: <BusinessNameSearchKenya />, errorElement: <Error /> },
  { path: 'sole-proprietorship-registration-kenya', element: <SoleProprietorshipRegistrationKenya />, errorElement: <Error /> },
  { path: 'limited-company-registration-kenya', element: <LimitedCompanyRegistrationKenya />, errorElement: <Error /> },
  { path: 'company-cr12-and-search-kenya', element: <CR12CompanySearchKenya />, errorElement: <Error /> },
  { path: 'company-annual-returns-kenya', element: <CompanyAnnualReturnsKenya />, errorElement: <Error /> },
  { path: 'kra-pin-for-business-kenya', element: <KRAPINRegistrationKenya />, errorElement: <Error /> },
  { path: 'closing-or-deregistering-company-kenya', element: <ClosingDeregisteringCompanyKenya />, errorElement: <Error /> },
  { path: 'partnership-llp-registration-kenya', element: <PartnershipLLPRegistrationKenya />, errorElement: <Error /> },
  { path: 'ngo-cbo-society-registration-kenya', element: <NGOCBOSocietyRegistrationKenya />, errorElement: <Error /> },
  { path: 'business-permits-licenses-kenya', element: <BusinessPermitsLicensesKenya />, errorElement: <Error /> },
  { path: 'kra-pin-and-tax-registration-kenya', element: <KRAPINAndTaxRegistrationKenya />, errorElement: <Error /> },
  { path: 'company-annual-returns-and-filing-kenya', element: <CompanyAnnualReturnsAndFilingKenya />, errorElement: <Error /> },
  { path: 'business-tax-obligations-kenya', element: <BusinessTaxObligationsKenya />, errorElement: <Error /> },
  { path: 'kenya-employment-labour-laws', element: <KenyaEmploymentLabourLaws />, errorElement: <Error /> },
  { path: 'employment-contracts-kenya', element: <EmploymentContractsKenya />, errorElement: <Error /> },
  { path: 'labour-dispute-resolution-kenya', element: <LabourDisputeResolutionKenya />, errorElement: <Error /> },
  { path: 'termination-redundancy-severance-kenya', element: <TerminationRedundancySeveranceKenya />, errorElement: <Error /> },
  { path: 'occupational-health-safety-kenya', element: <OccupationalHealthSafetyKenya />, errorElement: <Error /> },

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
      {path:'generalpayments',element:<GeneralPaymentPortal />},
    ],
  },
  { path: '*', element: <Error /> }
]);

// --- Wrapper Component to Manage Socket.IO Connection ---
export const AppWrapper = () => {
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
  return (
    <>
      <RouterProvider router={router} />
      <WhatsAppButton />
    </>
  );
};


// --- Main Render Function ---
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {/* Render the AppWrapper, which contains the socket logic and the router */}
          <AppWrapper />
        </PersistGate>
      </Provider>
    </HelmetProvider>
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