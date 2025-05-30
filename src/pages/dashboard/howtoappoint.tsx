import { FC } from 'react';
import { Link } from 'react-router-dom'; // Assuming you use React Router
import { Phone, Building, LifeBuoy, Ticket } from 'lucide-react';

// --- Navbar Import (Optional - if you have a global layout, it might already be there) ---
// import Navbar from '../components/layout/Navbar'; // Adjust path if needed

const BookAppointmentPage: FC = () => {

  const options = [
    {
      id: 'contact',
      Icon: Phone,
      title: 'Contact Us Directly',
      description: 'Speak with our team immediately for urgent matters or quick queries. We are here to help you.',
      actionText: 'Go to Contact Page',
      route: '/contactus',
      bgColor: 'bg-emerald-500 dark:bg-emerald-600',
      hoverBgColor: 'hover:bg-emerald-600 dark:hover:bg-emerald-700',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      borderColor: 'border-emerald-500 dark:border-emerald-600',
    },
    {
      id: 'ticket',
      Icon: Ticket, // Changed from Edit3 to Ticket for better relevance
      title: 'Request via Ticketing',
      description: 'Create a ticket with your appointment request. Our team will review it, close it once seen, and contact you. You can reopen tickets if needed.',
      actionText: 'Go to My Tickets',
      route: '/dashboard/mytickets',
      bgColor: 'bg-sky-500 dark:bg-sky-600',
      hoverBgColor: 'hover:bg-sky-600 dark:hover:bg-sky-700',
      textColor: 'text-sky-600 dark:text-sky-400',
      borderColor: 'border-sky-500 dark:border-sky-600',
    },
    {
      id: 'visit',
      Icon: Building,
      title: 'Visit Our Branches',
      description: 'Prefer an in-person consultation? Find our nearest branch and schedule a visit at your convenience.',
      actionText: 'Find Locations',
      route: '/dashboard/branch',
      bgColor: 'bg-amber-500 dark:bg-amber-600',
      hoverBgColor: 'hover:bg-amber-600 dark:hover:bg-amber-700',
      textColor: 'text-amber-600 dark:text-amber-400',
      borderColor: 'border-amber-500 dark:border-amber-600',
    },
  ];

  return (
    <>
      {/* <Navbar />  // Uncomment if your Navbar isn't part of a global layout */}
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-gray-200 dark:from-slate-900 dark:to-gray-950 py-12 sm:py-16 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <header className="text-center mb-12 md:mb-16">
            <LifeBuoy className="mx-auto h-16 w-16 text-emerald-500 dark:text-emerald-400 mb-4" />
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 via-sky-500 to-amber-500 dark:from-emerald-400 dark:via-sky-400 dark:to-amber-400">
                Book Your Appointment
              </span>
            </h1>
            <p className="mt-4 text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
              Choose your preferred method to connect with our legal experts  And   Schedule  An Appointment . We're committed to providing timely and effective assistance.Add  the  Appointment  to 
                your diary for easy tracking and management. Add  a  reminder to ensure you never miss an important meeting with us.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {options.map((option) => (
              <div
                key={option.id}
                className="bg-white dark:bg-slate-800/70 backdrop-blur-md shadow-xl dark:shadow-slate-900/50 rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl flex flex-col group"
              >
                <div className={`p-6 ${option.bgColor} flex items-center justify-center h-32 sm:h-36`}>
                  <option.Icon className="h-16 w-16 sm:h-20 sm:w-20 text-white opacity-80 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110" />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className={`text-2xl font-semibold ${option.textColor} mb-3`}>{option.title}</h2>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6 flex-grow">
                    {option.description}
                  </p>
                  <Link
                    to={option.route}
                    className={`mt-auto self-start inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white ${option.bgColor} ${option.hoverBgColor} focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:${option.borderColor} transition-colors duration-200 ease-in-out w-full sm:w-auto`}
                  >
                    {option.actionText}
                    <span aria-hidden="true" className="ml-2 text-xl group-hover:translate-x-1 transition-transform duration-200">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <section className="mt-16 md:mt-24 text-center py-10 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-lg dark:shadow-slate-900/30 px-6">
            <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
              Need Assistance Choosing?
            </h3>
            <p className="text-slate-600 dark:text-slate-300 max-w-xl mx-auto mb-6">
              If you're unsure which option is best for your needs, feel free to start with our <Link to="/contactus" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Contact Page</Link>, and our team can guide you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
                 <Link to="/dashboard/ourservices" className="text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                    View Services
                </Link>
                <span className="text-slate-400 dark:text-slate-600">|</span>
                <Link to="/terms" className="text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                    Terms of Service
                </Link>
            </div>
          </section>

        </div>
      </div>
    </>
  );
};

export default BookAppointmentPage;