import Navbar from "../components/navbar/Navbar"; 
//import Footer from "../pages/landingPage/Footer"; 
import { Link } from "react-router-dom";

import { Mail, MapPin, Phone, User, MessageSquareText } from 'lucide-react';

const ContactPage = () => {
  return (
    
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 dark:from-slate-900 dark:to-gray-900 font-sans transition-colors duration-300">
      <Navbar />

      <main className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Contact Section Header */}
          <div className="text-center mb-16 md:mb-20 animate__animated animate__fadeIn animate__delay-1s">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-sky-500 dark:from-emerald-400 dark:to-sky-400">
                Contact Us
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
              We’re thrilled to hear from you! Whether you have questions, feedback, or need assistance, our team is ready to help.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Contact Form Section - Enhanced with glassmorphism feel */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg shadow-2xl dark:shadow-[0_0_30px_rgba(245,158,11,0.15)] rounded-xl p-6 sm:p-8 md:p-10 transition-all duration-300 ease-in-out hover:shadow-emerald-500/20 dark:hover:shadow-amber-500/20">
              <h2 className="text-3xl font-semibold text-slate-800 dark:text-white mb-8">
                Send a Message
              </h2>
              <form className="space-y-6">
                {/* Name Input */}
                <div className="relative">
                  <User 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500 peer-focus:text-emerald-500 dark:peer-focus:text-amber-400"
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    id="name"
                    className="peer w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-200 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-amber-500 transition-all duration-300"
                    placeholder="Your Name"
                  />
                  <label
                    htmlFor="name"
                    className="absolute left-10 -top-2.5 text-xs text-slate-500 dark:text-slate-400 bg-transparent px-1 transition-all duration-200
                               peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 dark:peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-3.5
                               peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-emerald-600 dark:peer-focus:text-amber-500"
                  >
                    Your Name
                  </label>
                </div>

                {/* Email Input */}
                <div className="relative">
                  <Mail 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500 peer-focus:text-emerald-500 dark:peer-focus:text-amber-400"
                    aria-hidden="true"
                  />
                  <input
                    type="email"
                    id="email"
                    className="peer w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-200 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-amber-500 transition-all duration-300"
                    placeholder="Your Email"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-10 -top-2.5 text-xs text-slate-500 dark:text-slate-400 bg-transparent px-1 transition-all duration-200
                               peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 dark:peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-3.5
                               peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-emerald-600 dark:peer-focus:text-amber-500"
                  >
                    Your Email
                  </label>
                </div>

                {/* Message Textarea */}
                <div className="relative">
                   <MessageSquareText 
                    className="absolute left-3 top-4 h-5 w-5 text-slate-400 dark:text-slate-500 peer-focus:text-emerald-500 dark:peer-focus:text-amber-400"
                    aria-hidden="true"
                   />
                  <textarea
                    id="message"
                    rows={5}
                    className="peer w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-200 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-amber-500 transition-all duration-300 resize-none"
                    placeholder="Your Message"
                  ></textarea>
                  <label
                    htmlFor="message"
                    className="absolute left-10 -top-2.5 text-xs text-slate-500 dark:text-slate-400 bg-transparent px-1 transition-all duration-200
                               peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 dark:peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-3.5
                               peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-emerald-600 dark:peer-focus:text-amber-500"
                  >
                    Your Message
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 dark:from-amber-500 dark:to-orange-500 dark:hover:from-amber-600 dark:hover:to-orange-600 text-white font-semibold text-lg px-8 py-3.5 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-amber-500 dark:focus:ring-offset-slate-800 transition-all duration-300 transform hover:scale-105 active:scale-95"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>

            {/* Contact Info Section */}
            <div className="space-y-8 md:pt-4">
              <h2 className="text-3xl font-semibold text-slate-800 dark:text-white mb-6 md:mb-0">
                Reach Us Directly
              </h2>
              {[
                {
                  icon: <MapPin className="h-8 w-8 text-emerald-500 dark:text-amber-500" aria-hidden="true" />, 
                  title: "Our Office",
                  lines: ["123 Wakili Street", "Nairobi, Kenya"],
                  href: "https://maps.google.com/?q=123+Wakili+Street,+Nairobi,+Kenya"
                },
                {
                  icon: <Phone className="h-8 w-8 text-emerald-500 dark:text-amber-500" aria-hidden="true" />,
                  title: "Call Us",
                  lines: ["+254 112 810 203"],
                  href: "tel:+254112810203"
                },
                {
                  icon: <Mail className="h-8 w-8 text-emerald-500 dark:text-amber-500" aria-hidden="true" />, 
                  title: "Email Us",
                  lines: ["info@wakili.com", "support@wakili.com"],
                  href: "mailto:info@wakili.com"
                },
              ].map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start p-6 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl dark:shadow-[0_0_20px_rgba(245,158,11,0.1)] dark:hover:shadow-amber-500/20 transition-all duration-300 group"
                >
                  <div className="flex-shrink-0 p-3 bg-emerald-100 dark:bg-slate-700 rounded-full group-hover:bg-emerald-200 dark:group-hover:bg-amber-600/30 transition-colors duration-300">
                    {item.icon}
                  </div>
                  <div className="ml-5">
                    <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-amber-400 transition-colors duration-300">
                      {item.title}
                    </h3>
                    {item.lines.map((line, lineIdx) => (
                       <p key={lineIdx} className="text-slate-600 dark:text-slate-400 mt-1">{line}</p>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>

       <footer className="mt-16 pt-8 border-t border-slate-300 dark:border-slate-700 text-center text-slate-500 dark:text-slate-400 text-sm">
                <p>© {new Date().getFullYear()} Wakili Inc. All rights reserved.</p>
                <p className="mt-1">
                  <Link to="/terms" className="hover:text-teal-600 dark:hover:text-teal-400">Terms of Service</Link> | <Link to="/privacy-policy" className="hover:text-teal-600 dark:hover:text-teal-400">Privacy Policy</Link> | <Link to="/contactus" className="hover:text-teal-600 dark:hover:text-teal-400">Contact Us</Link>
                </p>
              </footer>
    </div>
  );
};

export default ContactPage;