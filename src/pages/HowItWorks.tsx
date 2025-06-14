import React from "react";
//import Footer from "../pages/landingPage/Footer"; 
import Navbar from "../components/navbar/Navbar";
import { Link } from "react-router-dom";
import {
    FaUserCheck, FaListAlt, FaFileSignature, FaCalendarAlt,
    FaFileContract, FaComments, FaSmile, FaQuestionCircle, FaQuoteLeft
} from "react-icons/fa";
import { ChevronRight, ShieldCheck, Zap, Users
} from "lucide-react";

// --- INTERFACES ---

interface StepContent {
    step: number;
    imageUrl: string; 
    title: string;
    icon: React.ReactElement;
    description: string;
}

interface Benefit {
    icon: React.ReactElement;
    title: string;
    description: string;
}

// --- DATA ARRAYS WITH CORRECTED, STABLE IMAGE URLS ---

const stepsData: StepContent[] = [
    {
        step: 1, 
        // A professional person working on a laptop, signifying creating a profile.
        imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
        title: "Sign Up & Create Profile",
        icon: <FaUserCheck className="w-6 h-6" />,
        description: "Embark on your legal journey by creating a secure Wakili profile. Share your needs, and we'll personalize your experience from the start."
    },
    {
        step: 2, 
        // A magnifying glass over documents, signifying discovery/search.
        imageUrl: "https://blog.careerlauncher.com/wp-content/uploads/2021/07/lawopportunities.jpg",
        title: "Discover Your Legal Solution",
        icon: <FaListAlt className="w-6 h-6" />,
        description: "Explore a comprehensive suite of legal services. From property agreements to intricate contracts, find the precise support you require with ease."
    },
    {
        step: 3, 
        // A person using a digital calendar to book an appointment.
        imageUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe",
        title: "Book Your Expert Consultation",
        icon: <FaFileSignature className="w-6 h-6" />,
        description: "Seamlessly schedule a consultation with a seasoned legal expert. Select a convenient time, and receive instant confirmation for your appointment."
    },
    {
        step: 4, 
        // A professional meeting/consultation in progress.
        imageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7",
        title: "Engage in Your Consultation",
        icon: <FaCalendarAlt className="w-6 h-6" />,
        description: "Connect with your lawyer for a confidential discussion. Ask questions, gain clarity, and outline your specific legal objectives in a secure environment."
    },
    {
        step: 5, 
        // Hands exchanging a signed document, representing contract delivery.
        imageUrl: "https://images.pexels.com/photos/357514/pexels-photo-357514.jpeg?cs=srgb",
        title: "Receive Expertly Drafted Documents",
        icon: <FaFileContract className="w-6 h-6" />,
        description: "Our legal professionals will meticulously prepare all necessary documents, ensuring accuracy and compliance, ready for your review and approval."
    },
    {
        step: 6, 
        // A person providing customer support via headset, signifying ongoing help.
        imageUrl: "https://www.ikonixusa.com/media/wysiwyg/Ongoing-Support-Icon.png",
        title: "Benefit from Ongoing Support",
        icon: <FaComments className="w-6 h-6" />,
        description: "Experience continuous support throughout your legal process. Our dedicated team is readily available for any clarifications, revisions, or further assistance."
    },
    {
        step: 7, 
        // Hand signing a document with house keys, signifying finalization and peace of mind.
        imageUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?fm=jpg",
        title: "Achieve Legal Peace of Mind",
        icon: <FaSmile className="w-6 h-6" />,
        description: "Finalize your legal matters with confidence. Receive your completed documents and a clear understanding of your empowered legal standing and future protection."
    },
];

const benefitsData: Benefit[] = [
    {
        icon: <Zap className="w-8 h-8 text-purple-500 dark:text-purple-400" />,
        title: "Lightning Fast Process",
        description: "Navigate legal complexities quicker than ever with our optimized digital workflows and responsive experts."
    },
    {
        icon: <ShieldCheck className="w-8 h-8 text-green-500 dark:text-green-400" />,
        title: "Secure & Confidential",
        description: "Your data and communications are protected with bank-grade security and strict confidentiality protocols."
    },
    {
        icon: <Users className="w-8 h-8 text-blue-500 dark:text-blue-400" />,
        title: "Expert Guidance at Every Step",
        description: "Access a network of vetted legal professionals ready to provide tailored advice and support."
    }
];

// --- COMPONENTS ---

function HowItWorks() {
    return (
        <div className="bg-gray-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 min-h-screen flex flex-col transition-colors duration-300">
            <Navbar />

            <main className="flex-grow px-4 sm:px-6 py-16 sm:py-24">
                <div className="text-center mb-16 sm:mb-20">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 dark:from-purple-400 dark:via-pink-400 dark:to-orange-400 animate-fade-in">
                            How Wakili Works
                        </span>
                    </h1>
                    <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        Navigating legal matters can be complex. At Wakili, we've simplified the entire process into clear, manageable steps, connecting you with expert legal help efficiently and transparently.
                    </p>
                </div>

                {/* Steps Section */}
                <div className="max-w-7xl mx-auto space-y-16 sm:space-y-20 lg:space-y-24">
                    {stepsData.map((stepInfo, index) => (
                        <StepCard
                            key={stepInfo.step}
                            {...stepInfo}
                            reverse={index % 2 !== 0}
                            animationDelay={`${index * 0.15}s`}
                        />
                    ))}
                </div>

                {/* Why Choose Wakili Section */}
                <section className="py-16 sm:py-24 mt-16 sm:mt-20 bg-white dark:bg-slate-800/50 rounded-xl shadow-xl">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-4">
                            Why Streamline Your Legal Needs with <span className="text-purple-600 dark:text-purple-400">Wakili?</span>
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
                            We're committed to making legal services accessible, understandable, and stress-free.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
                            {benefitsData.map((benefit, index) => (
                                <div key={index} className="p-6 bg-gray-50 dark:bg-slate-700/60 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
                                    <div className="flex justify-center mb-4">
                                        {benefit.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-700 dark:text-white mb-2">{benefit.title}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-300">{benefit.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials Snippet Section */}
                <section className="py-16 sm:py-24">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                         <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-12">
                            Hear From Our <span className="text-pink-500 dark:text-pink-400">Satisfied Users</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
                                <FaQuoteLeft className="text-3xl text-purple-400 dark:text-purple-300 mb-4 opacity-50" />
                                <p className="text-slate-600 dark:text-slate-300 italic mb-4">"Wakili made the daunting process of contract review so simple! The platform is intuitive, and the lawyers were incredibly helpful."</p>
                                <p className="font-semibold text-slate-700 dark:text-white">- Alex P., Small Business Owner</p>
                            </div>
                            <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
                                <FaQuoteLeft className="text-3xl text-purple-400 dark:text-purple-300 mb-4 opacity-50" />
                                <p className="text-slate-600 dark:text-slate-300 italic mb-4">"Booking a consultation was a breeze, and I got the expert advice I needed without any hassle. Highly recommend Wakili!"</p>
                                <p className="font-semibold text-slate-700 dark:text-white">- Sarah K., Individual Client</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Snippet Section */}
                <section className="py-16 sm:py-24 bg-gray-100 dark:bg-slate-800/50 rounded-xl shadow-xl">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-12 text-center">
                            Quick <span className="text-orange-500 dark:text-orange-400">Questions?</span>
                        </h2>
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-semibold text-slate-700 dark:text-white mb-2 flex items-center">
                                    <FaQuestionCircle className="w-6 h-6 mr-3 text-purple-500 dark:text-purple-400" />
                                    Is my information secure on Wakili?
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300 pl-9">
                                    Absolutely. We use state-of-the-art encryption and security protocols to protect all your personal information and case details. Your privacy is our top priority.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-slate-700 dark:text-white mb-2 flex items-center">
                                    <FaQuestionCircle className="w-6 h-6 mr-3 text-purple-500 dark:text-purple-400" />
                                    How are lawyers on Wakili vetted?
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300 pl-9">
                                    All legal professionals on our platform undergo a rigorous verification process, including checks for qualifications, experience, and professional standing, to ensure you receive high-quality service.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <div className="text-center mt-20 sm:mt-28">
                    <button
                        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-pink-500/50 dark:focus:ring-pink-400/50"
                    >
                        <Link  to='/dashboard/ourservices'>Ready to Simplify Your Legal Needs?</Link>
                        <ChevronRight className="inline-block ml-2 w-5 h-5" />
                    </button>
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
}

interface StepCardProps extends StepContent {
    reverse?: boolean;
    animationDelay?: string;
}

const StepCard: React.FC<StepCardProps> = ({ step, imageUrl, title, icon, description, reverse = false, animationDelay = '0s' }) => {
    const imageContainerClasses = `w-full lg:w-2/5 flex justify-center items-center p-6 ${reverse ? 'lg:order-2' : 'lg:order-1'}`;
    const textContainerClasses = `w-full lg:w-3/5 space-y-4 p-6 sm:p-8 ${reverse ? 'lg:order-1 lg:pr-12' : 'lg:order-2 lg:pl-12'}`;

    return (
        <div
            className="flex flex-col lg:flex-row items-center bg-white dark:bg-slate-800/70 rounded-xl sm:rounded-2xl shadow-2xl dark:shadow-slate-900/50 overflow-hidden transform transition-all duration-500 hover:scale-[1.02] dark:hover:shadow-purple-500/20 animate-slide-up group"
            style={{ animationDelay }}
        >
            <div className={imageContainerClasses}>
                <div className="bg-gradient-to-br from-purple-100 via-pink-50 to-orange-50 dark:from-purple-900/50 dark:via-pink-900/30 dark:to-orange-900/30 p-4 sm:p-6 rounded-xl shadow-inner aspect-square max-w-sm w-full transition-all duration-300 group-hover:shadow-lg">
                    <img
                        src={`${imageUrl}?auto=format&fit=crop&w=400&q=80`}
                        alt={title}
                        className="w-full h-full object-cover rounded-lg"
                        loading="lazy"
                    />
                </div>
            </div>

            <div className={textContainerClasses}>
                <div className="flex items-center space-x-4 mb-3 sm:mb-4">
                    <span className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 text-white font-bold text-xl sm:text-2xl shadow-md transform group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                        {step}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                        {title}
                    </h2>
                </div>
                <div className="flex items-start space-x-3 text-purple-600 dark:text-purple-400">
                    <div className="flex-shrink-0 mt-1 opacity-80 group-hover:opacity-100 transition-opacity duration-300">{icon}</div>
                    <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>
           
        </div>
    );
};

export default HowItWorks;