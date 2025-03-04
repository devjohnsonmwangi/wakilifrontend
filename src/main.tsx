// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/landingPage/Home.tsx';
import Register from './pages/register/Register.tsx';
import Login from './pages/login/Login.tsx';
import HowItWorks from './pages/HowItWorks.tsx';
import Contactus from './pages/contact.tsx';
import About from './pages/landingPage/About.tsx';
import Dashboard from './pages/dashboard/Dashboard.tsx';
import Reports from '../src/pages/dashboard/main/Reports/Reports.tsx'

import CreateCase from '../src/pages/dashboard/main/Managecases/createcase.tsx'

// import CreateCase from '../src/pages/dashboard/main/Managecases/createcase.tsx'

import  MyCases from '../src/pages/dashboard/main/Managecases/mycases.tsx'
import  Cases from '../src/pages/dashboard/main/Managecases/managecases.tsx'

import DocumentList  from  './pages/dashboard/main/managedocs/listupdatedoc.tsx'

// redux and redux-persist
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistedStore } from './app/store.ts';

import SupportTickets from './pages/dashboard/main/Tickets/SupportTickets.tsx';

 import Profile from './pages/dashboard/main/Profile.tsx';

import Error from './pages/Error.tsx';
import Account from './pages/dashboard/main/Account.tsx';

 import MyTickets from './pages/dashboard/main/Tickets/MyTickets.tsx';

 import CreateTicket from './pages/dashboard/main/Tickets/CreateTicket.tsx';

//  import CreateTicket from './pages/dashboard/main/Tickets/CreateTicket.tsx';

 import Logout from './components/logout/logout.tsx'
 import  AppointmentList from './pages/dashboard/main/manageAppointment/listappointments.tsx'

 import BranchLocationManagement from './pages/dashboard/main/branchlocation/listbranch.tsx'

  import ListAppointments from './pages/dashboard/main/manageAppointment/listappointments.tsx'

  // import ListAppointments from './pages/dashboard/main/manageAppointment/listappointments.tsx'
  import  ParentComponent   from  './pages/dashboard/main/Payments/Payments.tsx'

 


const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <Error />
  },
  {
    path: 'register',
    element: <Register />,
    errorElement: <Error />
  },
  {
    path: 'login',
    element: <Login />,
    errorElement: <Error />
  },
  {
    path: 'HowItWorks',
    element: <HowItWorks />,
    errorElement: <Error />
  },
  {
    path: 'Contactus',
    element: <Contactus />,
    errorElement: <Error />
  },

  {
    path: 'About',
    element: <About />,
    errorElement: <Error />
  },


  {
    path: 'profile',
    element: <Profile/>,
    errorElement: <Error />
  },


  {
    path: 'account',
    element: <Account/>,
    errorElement: <Error />
  },

  {
    path: 'supporttickets',
    element: <SupportTickets/>,
    errorElement: <Error />
  },

  {
    path: 'mytickets',
    element: <MyTickets/>,
    errorElement: <Error />
  },

  {
    path: 'createticket',
    element: <CreateTicket/>,
    errorElement: <Error />
  },
  {
    path: 'reports',
    element: <Reports/>,
    errorElement: <Error />
  },
  {
    path: 'createcase',
    element: <CreateCase/>,
    errorElement: <Error />
  },
  {
    path: 'mycases',
    element: < MyCases/>,
    errorElement: <Error />
  },
 
  
  {
    path:'listdoc',
    element: <DocumentList/>,
    errorElement: <Error/>
  },

  {
    path:'appoint',
    element: <ListAppointments/>,
    errorElement: <Error/>
  },
  

 

  // {
  //   path: 'profile',
  //   element: <Profile/>,
  //   errorElement: <Error />
  // },


  // {
  //   path: 'account',
  //   element: <Account/>,
  //   errorElement: <Error />
  // },

  // {
  //   path: 'supporttickets',
  //   element: <SupportTickets/>,
  //   errorElement: <Error />
  // },

  // {
  //   path: 'mytickets',
  //   element: <MyTickets/>,
  //   errorElement: <Error />
  // },

  // {
  //   path: 'createticket',
  //   element: <CreateTicket/>,
  //   errorElement: <Error />
  // },
  // {
  //   path: 'reports',
  //   element: <Reports/>,
  //   errorElement: <Error />
  // },
  // {
  //   path: 'createcase',
  //   element: <CreateCase/>,
  //   errorElement: <Error />
  // },
  // {
  //   path: 'mycases',
  //   element: < MyCases/>,
  //   errorElement: <Error />
  // },
 
  
  // {
  //   path:'listdoc',
  //   element: <DocumentList/>,
  //   errorElement: <Error/>
  // },

  // {
  //   path:'appoint',
  //   element: <ListAppointments/>,
  //   errorElement: <Error/>
  // },
  
  
  

 
 


  

 



  




  
  
  // DASHBOARD ROUTES
  {
    path: 'dashboard',
    element: <Dashboard />,
    errorElement: <Error />,
    children: [
    
      {
        path: 'supporttickets',
        element: <SupportTickets />
      },
      {
        path: 'account',
        element: <Account />
      },

      {
        path:'appoint',
        element: < AppointmentList/>,
     
      },
     

      // {
      //   path: 'payments',
      //   element: <UserBookings />
      // },

       {
        path: 'payments',
       element: <ParentComponent/>
       },

      // {
      //   path: 'payment-successful',
      //   element: <SuccessPayment />
      // },
      // {
      //   path: 'payment-failed',
      //   element: <PaymentFailed />
      // },
      {
        path: 'profile',
        element: <Profile />
      },
      {
        path:'listdoc',
        element: <DocumentList/>,
        
      },
      {
        path: 'mytickets',
        element: <MyTickets />
      },

      {
        path: 'logout',
        element: <Logout/>
      },
      {
        path: 'mycases',
        element: < MyCases/>
      },
      {
        path: 'cases',
        element: < Cases/>
      },

      {
        path: 'reports',
        element: <Reports />

      },
      {
        path:'branch',
        element: <BranchLocationManagement/>
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistedStore}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);
