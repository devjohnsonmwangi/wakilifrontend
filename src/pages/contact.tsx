import { Link } from "react-router-dom";
import { 
  Mail, 
  MapPin, 
  Phone, 
  Ticket, 
  MessageSquareText, 
  ChevronRight,
  Building
} from 'lucide-react';
import Navbar from "../components/navbar/Navbar";

// --- Data for the contact method cards for easy maintenance ---
const contactMethods = [
  {
    icon: Ticket,
    title: "Submit a Support Ticket",
    description: "Best for specific case inquiries, technical issues, or billing questions. Our team will get back to you with a detailed response.",
    link: "/dashboard/mytickets",
    buttonText: "Go to My Tickets"
  },
  {
    icon: MessageSquareText,
    title: "Chat with Our Staff",
    description: "Have a quick question or need immediate assistance? Start a live chat with one of our available team members.",
    link: "/dashboard/chats",
    buttonText: "Start a Chat"
  },
  {
    icon: Building,
    title: "Find a Branch",
    description: "Need to speak with someone in person or find a direct phone number? Locate your nearest branch for address and contact details.",
    link: "/dashboard/branch",
    buttonText: "View Branch Locations"
  }
];

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-slate-950 font-sans">
      <Navbar />

      {/* Main content area with padding to avoid navbars */}
      <main className="pt-16 pb-16 lg:pb-0">
        <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-12 md:py-16">

          {/* 1. MODERNIZED HEADER */}
          <div className="text-center mb-16 p-8 bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-sky-500">
                Get in Touch
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              We're here to help. Choose the best way to reach us below, and we'll connect you with the right person.
            </p>
          </div>

          {/* 2. PRIMARY CONTACT METHODS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contactMethods.map((method) => (
              <div 
                key={method.title}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-lg dark:shadow-slate-900/50 rounded-xl p-8 flex flex-col transform transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl"
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-emerald-100 dark:bg-slate-700 flex items-center justify-center mb-5">
                  <method.icon className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-grow">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
                    {method.title}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {method.description}
                  </p>
                </div>
                <div className="mt-8">
                  <Link
                    to={method.link}
                    className="inline-flex items-center justify-center w-full px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 group"
                  >
                    {method.buttonText}
                    <ChevronRight className="w-5 h-5 ml-2 transform transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* 3. SECONDARY CONTACT INFO */}
          <div className="mt-20 text-center">
            <div className="inline-block relative">
              <h3 className="text-2xl font-semibold text-slate-700 dark:text-slate-300">For General Inquiries</h3>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-0.5 bg-emerald-500 mt-2"></div>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-10 text-slate-600 dark:text-slate-400">
              <a href="tel:+254112810203" className="flex items-center hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                <Phone className="w-5 h-5 mr-2" />
                <span>+254 112 810 203</span>
              </a>
              <a href="mailto:info@wakili.com" className="flex items-center hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                <Mail className="w-5 h-5 mr-2" />
                <span>info@wakili.com</span>
              </a>
              <a href="https://maps.google.com/?q=123+Wakili+Street,+Nairobi,+Kenya" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                 <MapPin className="w-5 h-5 mr-2" />
                 <span>143-10300, Kerugoya</span>
              </a>
            </div>
          </div>

        </section>
      </main>
    </div>
  );
};

export default ContactPage;