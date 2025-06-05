import { FC } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Building, LifeBuoy, Ticket, ArrowRight, ChevronRight } from 'lucide-react';

const BookAppointmentPage: FC = () => {
  const options = [
    {
      id: 'ticket',
      Icon: Ticket,
      title: 'Request via Ticketing',
      description: 'Submit a detailed request through our ticketing system. Our team will review, process, and contact you to finalize your appointment details.',
      actionText: 'Create a Ticket',
      route: '/dashboard/mytickets',
      bgColorClass: 'bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600',
      iconBgColorClass: 'bg-sky-100 dark:bg-sky-900',
      iconTextColorClass: 'text-sky-600 dark:text-sky-400',
      featured: true,
    },
    {
      id: 'contact',
      Icon: Phone,
      title: 'Contact Us Directly',
      description: 'For urgent matters or if you prefer to speak with someone, call us. We can assist you with scheduling over the phone.',
      actionText: 'View Contact Info',
      route: '/contactus',
      bgColorClass: 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600',
      iconBgColorClass: 'bg-emerald-100 dark:bg-emerald-900',
      iconTextColorClass: 'text-emerald-600 dark:text-emerald-400',
      featured: false,
    },
    {
      id: 'visit',
      Icon: Building,
      title: 'Visit Our Branches',
      description: 'Find our nearest branch. You can view location details and typical availability to plan your in-person consultation.',
      actionText: 'Find Locations',
      route: '/dashboard/branch',
      bgColorClass: 'bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600',
      iconBgColorClass: 'bg-amber-100 dark:bg-amber-900',
      iconTextColorClass: 'text-amber-600 dark:text-amber-400',
      featured: false,
    },
  ];

  const featuredOption = options.find(opt => opt.featured);
  const otherOptions = options.filter(opt => !opt.featured);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 text-slate-800 dark:text-slate-200 transition-all duration-300 font-sans">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-500 via-sky-500 to-amber-500 dark:from-emerald-700 dark:via-sky-700 dark:to-amber-700 text-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
        <div className="absolute inset-0 opacity-20">
          <LifeBuoy className="absolute -top-1/4 -left-1/4 w-64 h-64 text-white/20 animate-spin-slow opacity-50" />
          <Ticket className="absolute -bottom-1/4 -right-1/4 w-72 h-72 text-white/20 rotate-12 opacity-50" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <LifeBuoy className="mx-auto h-14 w-14 sm:h-16 mb-5 drop-shadow-lg" />
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-5 drop-shadow-md">
              Schedule Your Consultation
            </h1>
            <p className="text-lg sm:text-xl text-white/90 mb-4">
              Connect with our legal experts through your preferred method. We're here to help.
            </p>
            <p className="text-sm sm:text-md text-white/80">
              Once confirmed, appointments appear in{' '}
              <Link
                to="/dashboard/myappointments"
                className="underline hover:text-white/90 font-semibold"
              >
                My Appointments
              </Link>
              .
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Option */}
      {featuredOption && (
        <section className="py-14 sm:py-20 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col lg:flex-row group"
          >
            <div
              className={`lg:w-2/5 p-8 flex flex-col items-center lg:items-start text-center lg:text-left ${featuredOption.iconBgColorClass}`}
            >
              <featuredOption.Icon
                className={`h-20 w-20 mb-6 ${featuredOption.iconTextColorClass} group-hover:scale-110 transition-transform`}
              />
              <h2 className="text-2xl sm:text-3xl font-bold mb-1">{featuredOption.title}</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Our recommended method.
              </p>
            </div>
            <div className="lg:w-3/5 p-8 space-y-6">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {featuredOption.description}
              </p>
              <Link
                to={featuredOption.route}
                className={`inline-flex items-center justify-center px-6 py-3 text-white font-semibold rounded-lg ${featuredOption.bgColorClass} shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
              >
                {featuredOption.actionText}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        </section>
      )}

      {/* Other Options */}
      <section className="px-4 pb-20">
        <div className={`grid grid-cols-1 ${otherOptions.length > 1 ? 'md:grid-cols-2' : ''} gap-6`}>
          {otherOptions.map((option) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md group hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="p-6 flex items-start gap-4">
                <div className={`p-3 rounded-lg ${option.iconBgColorClass}`}>
                  <option.Icon
                    className={`h-8 w-8 ${option.iconTextColorClass} group-hover:scale-110 transition-transform duration-300`}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{option.title}</h3>
                </div>
              </div>
              <div className="px-6 pb-6 flex flex-col">
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                  {option.description}
                </p>
                <Link
                  to={option.route}
                  className={`inline-flex items-center self-start px-5 py-2.5 text-white text-sm font-medium rounded-md ${option.bgColorClass} shadow hover:shadow-lg transform transition-transform duration-300 hover:scale-105`}
                >
                  {option.actionText}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Help Section */}
      <section className="bg-slate-200/60 dark:bg-slate-800/60 py-16 px-4 text-center">
        <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100">
          Not Sure Where to Start?
        </h3>
        <p className="text-slate-700 dark:text-slate-300 max-w-xl mx-auto mb-6">
          Our team is ready to help. If you're uncertain which option is best,{' '}
          <Link
            to="/contactus"
            className="text-emerald-600 dark:text-emerald-400 font-medium underline hover:opacity-90"
          >
            reach out to us
          </Link>
          .
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/dashboard/ourservices"
            className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-emerald-500"
          >
            Explore Our Services
          </Link>
          <Link
            to="/dashboard/help"
            className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-sky-500"
          >
            FAQs
          </Link>
        </div>
      </section>
    </div>
  );
};

export default BookAppointmentPage;
