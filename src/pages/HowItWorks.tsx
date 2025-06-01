import React from "react";
//import Footer from "../pages/landingPage/Footer"; // Adjust path if needed
import Navbar from "../components/navbar/Navbar";
import Lottie, { Options as LottieOptions } from "react-lottie";
import { Link } from "react-router-dom";
import {
    FaUserCheck, FaListAlt, FaFileSignature, FaCalendarAlt,
    FaFileContract, FaComments, FaSmile, FaQuestionCircle, FaQuoteLeft
} from "react-icons/fa";
import { ChevronRight, ShieldCheck, Zap, Users
} from "lucide-react";

// --- EMBEDDED MINIMAL LOTTIE ANIMATION DATA ---
const lottieAnimations = [
    // 1. Simple Search Icon
    { "v":"5.9.6","fr":30,"ip":0,"op":30,"w":100,"h":100,"nm":"Search","ddd":0,"assets":[],
      "layers":[
        {"ddd":0,"ind":1,"ty":4,"nm":"Loop","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[50,50,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[
          {"ddd":0,"ind":0,"ty":"gr","nm":"Group","it":[
            {"ddd":0,"ind":0,"ty":"el","nm":"Circle","p":{"a":0,"k":[0,-10],"ix":2},"s":{"a":0,"k":[30,30],"ix":3},"sr":1},
            {"ddd":0,"ind":1,"ty":"rc","nm":"Handle","p":{"a":0,"k":[20,10],"ix":2},"s":{"a":0,"k":[5,20],"ix":3},"r":{"a":0,"k":-45,"ix":7},"sr":1},
            {"ddd":0,"ind":2,"ty":"st","nm":"Stroke","c":{"a":0,"k":[0.1,0.1,0.8,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":5,"ix":5},"lc":2,"lj":2,"ml":4,"bm":0}
          ],"bm":0}
        ],"ip":0,"op":30,"st":0,"bm":0}
      ]
    },
    // 2. Simple List Icon
    { "v":"5.9.6","fr":30,"ip":0,"op":30,"w":100,"h":100,"nm":"List","ddd":0,"assets":[],
      "layers":[
        {"ddd":0,"ind":1,"ty":4,"nm":"List Group","sr":1,"ks":{"o":{"a":0,"k":100},"r":{"a":0,"k":0},"p":{"a":0,"k":[50,50,0]},"a":{"a":0,"k":[0,0,0]},"s":{"a":0,"k":[100,100,100]}},"ao":0,"shapes":[
          {"ddd":0,"ind":0,"ty":"gr","nm":"Group","it":[
            {"ddd":0,"ind":0,"ty":"rc","nm":"Line 1","p":{"a":0,"k":[0,-20]},"s":{"a":0,"k":[60,8]}},
            {"ddd":0,"ind":1,"ty":"rc","nm":"Line 2","p":{"a":0,"k":[0,0]},"s":{"a":0,"k":[60,8]}},
            {"ddd":0,"ind":2,"ty":"rc","nm":"Line 3","p":{"a":0,"k":[0,20]},"s":{"a":0,"k":[60,8]}},
            {"ddd":0,"ind":3,"ty":"fl","nm":"Fill","c":{"a":0,"k":[0.8,0.2,0.2,1]},"o":{"a":0,"k":100}}
          ]}
        ],"ip":0,"op":30,"st":0,"bm":0}
      ]
    },
    // 3. Simple Document/Pen Icon
    { "v":"5.9.6","fr":30,"ip":0,"op":30,"w":100,"h":100,"nm":"Document","ddd":0,"assets":[],
      "layers":[
        {"ddd":0,"ind":1,"ty":4,"nm":"Doc Group","sr":1,"ks":{"o":{"a":0,"k":100},"r":{"a":0,"k":0},"p":{"a":0,"k":[50,50,0]},"a":{"a":0,"k":[0,0,0]},"s":{"a":0,"k":[100,100,100]}},"ao":0,"shapes":[
          {"ddd":0,"ind":0,"ty":"gr","nm":"Group","it":[
            {"ddd":0,"ind":0,"ty":"rc","nm":"Page","p":{"a":0,"k":[0,0]},"s":{"a":0,"k":[50,70]}},
            {"ddd":0,"ind":1,"ty":"rc","nm":"Pen Line","p":{"a":0,"k":[10, -25]},"s":{"a":0,"k":[5,20]}},
            {"ddd":0,"ind":2,"ty":"fl","nm":"Fill","c":{"a":0,"k":[0.2,0.8,0.2,1]},"o":{"a":0,"k":100}}
          ]}
        ],"ip":0,"op":30,"st":0,"bm":0}
      ]
    },
    // 4. Simple Calendar Icon
    { "v":"5.9.6","fr":30,"ip":0,"op":30,"w":100,"h":100,"nm":"Calendar","ddd":0,"assets":[],
      "layers":[
        {"ddd":0,"ind":1,"ty":4,"nm":"Calendar Group","sr":1,"ks":{"o":{"a":0,"k":100},"r":{"a":0,"k":0},"p":{"a":0,"k":[50,50,0]},"a":{"a":0,"k":[0,0,0]},"s":{"a":0,"k":[100,100,100]}},"ao":0,"shapes":[
          {"ddd":0,"ind":0,"ty":"gr","nm":"Group","it":[
            {"ddd":0,"ind":0,"ty":"rc","nm":"Base","p":{"a":0,"k":[0,5]},"s":{"a":0,"k":[60,50]}},
            {"ddd":0,"ind":1,"ty":"rc","nm":"Top Bar","p":{"a":0,"k":[0,-25]},"s":{"a":0,"k":[60,10]}},
            {"ddd":0,"ind":2,"ty":"rc","nm":"Ring1","p":{"a":0,"k":[-15,-30]},"s":{"a":0,"k":[5,10]}},
            {"ddd":0,"ind":3,"ty":"rc","nm":"Ring2","p":{"a":0,"k":[15,-30]},"s":{"a":0,"k":[5,10]}},
            {"ddd":0,"ind":4,"ty":"fl","nm":"Fill","c":{"a":0,"k":[0.8,0.8,0.1,1]},"o":{"a":0,"k":100}}
          ]}
        ],"ip":0,"op":30,"st":0,"bm":0}
      ]
    },
    // 5. Simple Files Icon
    { "v":"5.9.6","fr":30,"ip":0,"op":30,"w":100,"h":100,"nm":"Files","ddd":0,"assets":[],
      "layers":[
        {"ddd":0,"ind":1,"ty":4,"nm":"Files Group","sr":1,"ks":{"o":{"a":0,"k":100},"r":{"a":0,"k":0},"p":{"a":0,"k":[50,50,0]},"a":{"a":0,"k":[0,0,0]},"s":{"a":0,"k":[100,100,100]}},"ao":0,"shapes":[
          {"ddd":0,"ind":0,"ty":"gr","nm":"Group","it":[
            {"ddd":0,"ind":0,"ty":"rc","nm":"File 1","p":{"a":0,"k":[-5,5]},"s":{"a":0,"k":[50,60]}},
            {"ddd":0,"ind":1,"ty":"rc","nm":"File 2","p":{"a":0,"k":[5,-5]},"s":{"a":0,"k":[50,60]}},
            {"ddd":0,"ind":2,"ty":"fl","nm":"Fill 1","c":{"a":0,"k":[0.3,0.3,0.8,1]},"o":{"a":0,"k":80}},
            {"ddd":0,"ind":3,"ty":"gs","nm":"Stroke","c":{"a":0,"k":[0.1,0.1,0.1,1]},"o":{"a":0,"k":100},"w":{"a":0,"k":3},"lc":2,"lj":2,"ml":4,"bm":0,"gr":{"p":2,"s":[0,100],"e":[100,100],"t":1,"clr":[]}} // Simplified gradient stroke
          ]}
        ],"ip":0,"op":30,"st":0,"bm":0}
      ]
    },
    // 6. Simple Chat Bubble Icon
    { "v":"5.9.6","fr":30,"ip":0,"op":30,"w":100,"h":100,"nm":"Chat","ddd":0,"assets":[],
      "layers":[
        {"ddd":0,"ind":1,"ty":4,"nm":"Chat Group","sr":1,"ks":{"o":{"a":0,"k":100},"r":{"a":0,"k":0},"p":{"a":0,"k":[50,50,0]},"a":{"a":0,"k":[0,0,0]},"s":{"a":0,"k":[100,100,100]}},"ao":0,"shapes":[
          {"ddd":0,"ind":0,"ty":"gr","nm":"Group","it":[
            {"ddd":0,"ind":0,"ty":"rc","nm":"Bubble","p":{"a":0,"k":[0,-5]},"s":{"a":0,"k":[70,50]}, "r":{"a":0,"k":15}}, // Rounded corners
            {"ddd":0,"ind":1,"ty":"tr","nm":"Triangle","p":{"a":0,"k":[0,25]},"s":{"a":0,"k":[15,15]},"r":{"a":0,"k":0},"d":1,"pts":[[0,-7.5],[7.5,7.5],[-7.5,7.5]]},
            {"ddd":0,"ind":2,"ty":"fl","nm":"Fill","c":{"a":0,"k":[0.1,0.7,0.7,1]},"o":{"a":0,"k":100}}
          ]}
        ],"ip":0,"op":30,"st":0,"bm":0}
      ]
    },
    // 7. Simple Checkmark Icon
    { "v":"5.9.6","fr":30,"ip":0,"op":30,"w":100,"h":100,"nm":"Checkmark","ddd":0,"assets":[],
      "layers":[
        {"ddd":0,"ind":1,"ty":4,"nm":"Check Group","sr":1,"ks":{"o":{"a":0,"k":100},"r":{"a":0,"k":0},"p":{"a":0,"k":[50,50,0]},"a":{"a":0,"k":[0,0,0]},"s":{"a":0,"k":[100,100,100]}},"ao":0,"shapes":[
          {"ddd":0,"ind":0,"ty":"gr","nm":"Group","it":[
            {"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[-1.381,0],[0,0]],"o":[[0,0],[1.381,0]],"v":[[-20,-5],[0,15],[30,-25]],"c":false},"ix":2},"nm":"Path"},
            {"ddd":0,"ind":1,"ty":"st","nm":"Stroke","c":{"a":0,"k":[0.2,0.6,0.1,1]},"o":{"a":0,"k":100},"w":{"a":0,"k":10},"lc":2,"lj":2,"ml":4,"bm":0}
          ]}
        ],"ip":0,"op":30,"st":0,"bm":0}
      ]
    }
];
// --- END OF EMBEDDED LOTTIE ANIMATION DATA ---


const defaultLottieOptions = (animationData: object): LottieOptions => ({
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
    },
});

interface StepContent {
    step: number;
    animation: object;
    title: string;
    icon: React.ReactElement;
    description: string;
}

const stepsData: StepContent[] = [
    {
        step: 1, animation: lottieAnimations[0], title: "Sign Up & Create Profile",
        icon: <FaUserCheck className="w-6 h-6" />,
        description: "Embark on your legal journey by creating a secure Wakili profile. Share your needs, and we'll personalize your experience from the start."
    },
    {
        step: 2, animation: lottieAnimations[1], title: "Discover Your Legal Solution",
        icon: <FaListAlt className="w-6 h-6" />,
        description: "Explore a comprehensive suite of legal services. From property agreements to intricate contracts, find the precise support you require with ease."
    },
    {
        step: 3, animation: lottieAnimations[2], title: "Book Your Expert Consultation",
        icon: <FaFileSignature className="w-6 h-6" />,
        description: "Seamlessly schedule a consultation with a seasoned legal expert. Select a convenient time, and receive instant confirmation for your appointment."
    },
    {
        step: 4, animation: lottieAnimations[3], title: "Engage in Your Consultation",
        icon: <FaCalendarAlt className="w-6 h-6" />,
        description: "Connect with your lawyer for a confidential discussion. Ask questions, gain clarity, and outline your specific legal objectives in a secure environment."
    },
    {
        step: 5, animation: lottieAnimations[4], title: "Receive Expertly Drafted Documents",
        icon: <FaFileContract className="w-6 h-6" />,
        description: "Our legal professionals will meticulously prepare all necessary documents, ensuring accuracy and compliance, ready for your review and approval."
    },
    {
        step: 6, animation: lottieAnimations[5], title: "Benefit from Ongoing Support",
        icon: <FaComments className="w-6 h-6" />,
        description: "Experience continuous support throughout your legal process. Our dedicated team is readily available for any clarifications, revisions, or further assistance."
    },
    {
        step: 7, animation: lottieAnimations[6], title: "Achieve Legal Peace of Mind",
        icon: <FaSmile className="w-6 h-6" />,
        description: "Finalize your legal matters with confidence. Receive your completed documents and a clear understanding of your empowered legal standing and future protection."
    },
];

interface Benefit {
    icon: React.ReactElement;
    title: string;
    description: string;
}

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

                {/* Testimonials Snippet Section (Placeholder) */}
                <section className="py-16 sm:py-24">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                         <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-12">
                            Hear From Our <span className="text-pink-500 dark:text-pink-400">Satisfied Users</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Testimonial 1 */}
                            <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
                                <FaQuoteLeft className="text-3xl text-purple-400 dark:text-purple-300 mb-4 opacity-50" />
                                <p className="text-slate-600 dark:text-slate-300 italic mb-4">"Wakili made the daunting process of contract review so simple! The platform is intuitive, and the lawyers were incredibly helpful."</p>
                                <p className="font-semibold text-slate-700 dark:text-white">- Alex P., Small Business Owner</p>
                            </div>
                            {/* Testimonial 2 */}
                            <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
                                <FaQuoteLeft className="text-3xl text-purple-400 dark:text-purple-300 mb-4 opacity-50" />
                                <p className="text-slate-600 dark:text-slate-300 italic mb-4">"Booking a consultation was a breeze, and I got the expert advice I needed without any hassle. Highly recommend Wakili!"</p>
                                <p className="font-semibold text-slate-700 dark:text-white">- Sarah K., Individual Client</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Snippet Section (Placeholder) */}
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
                        <Link  to='/login'>Ready to Simplify Your Legal Needs?</Link>
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

const StepCard: React.FC<StepCardProps> = ({ step, animation, title, icon, description, reverse = false, animationDelay = '0s' }) => {
    const lottieContainerClasses = `w-full lg:w-2/5 flex justify-center items-center p-6 ${reverse ? 'lg:order-2' : 'lg:order-1'}`;
    const textContainerClasses = `w-full lg:w-3/5 space-y-4 p-6 sm:p-8 ${reverse ? 'lg:order-1 lg:pr-12' : 'lg:order-2 lg:pl-12'}`;

    // Ensure animation data is a valid object before passing to Lottie
    const validAnimationData = (typeof animation === 'object' && animation !== null) ? animation : {};


    return (
        <div
            className="flex flex-col lg:flex-row items-center bg-white dark:bg-slate-800/70 rounded-xl sm:rounded-2xl shadow-2xl dark:shadow-slate-900/50 overflow-hidden transform transition-all duration-500 hover:scale-[1.02] dark:hover:shadow-purple-500/20 animate-slide-up group"
            style={{ animationDelay }}
        >
            <div className={lottieContainerClasses}>
                <div className="bg-gradient-to-br from-purple-100 via-pink-50 to-orange-50 dark:from-purple-900/50 dark:via-pink-900/30 dark:to-orange-900/30 p-4 sm:p-6 rounded-xl shadow-inner aspect-square max-w-sm w-full transition-all duration-300 group-hover:shadow-lg">
                    <Lottie options={defaultLottieOptions(validAnimationData)} height="100%" width="100%" />
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