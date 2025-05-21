import Footer from "../pages/landingPage/Footer"; // Assuming this path is correct
import Navbar from "../components/navbar/Navbar";
import Lottie, { Options } from "react-lottie";
import { 
    FaUserCheck, 
    FaListAlt, 
    FaFileSignature, 
    FaCalendarAlt, 
    FaFileContract, 
    FaComments, 
    FaSmile 
} from "react-icons/fa";

import animationData1 from "../utils/utils/search.json";
import animationData2 from "../utils/utils/choose.json";
import animationData3 from "../utils/utils/book.json";
// Assuming you might have different animations for these, or reuse search.json as placeholder
import animationData4 from "../utils/utils/search.json"; // Placeholder
import animationData5 from "../utils/utils/search.json"; // Placeholder
import animationData6 from "../utils/utils/search.json"; // Placeholder
import animationData7 from "../utils/utils/search.json"; // Placeholder

const defaultOptions = (animationData: object): Options => ({
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
    },
});

function HowItWorks() {
    return (
        // Outermost container for the entire page view
        // pt-16: Padding for the fixed top navbar (height of navbar, e.g., h-16)
        // pb-16: Padding for the fixed bottom mobile navbar (height of navbar)
        // lg:pb-0: On large screens, remove bottom padding as mobile bottom navbar is hidden
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white min-h-screen flex flex-col pt-16 pb-16 lg:pb-0">
            <Navbar /> {/* Navbar renders its fixed elements */}

            {/* Main content area that scrolls between fixed navbars */}
            {/* flex-grow: Ensures this area takes up available space, pushing Footer down */}
            {/* px-6: Horizontal padding */}
            {/* py-12 or py-16: Vertical padding for aesthetic spacing of content within this main block.
                Adjust as needed. The parent's pt-16 handles the top navbar. */}
            <main className="flex-grow px-6 py-12 sm:py-16">
                <h1 className="text-4xl sm:text-5xl text-center text-green-500 font-extrabold mb-10 sm:mb-12 tracking-wide animate-fade-in">
                    How <span className="text-blue-500">Wakili</span> Works
                </h1>
                <div className="max-w-6xl mx-auto space-y-12 sm:space-y-16">
                    {/** Step 1 **/}
                    <Step 
                        animation={animationData1} 
                        title="Step 1: Sign Up & Create Your Profile" 
                        icon={<FaUserCheck />} 
                        reverse={false} // Typically first item is not reversed
                        description="Start your journey by signing up on Wakili. Create your profile and provide essential information about your legal needs and preferences. This helps us tailor your experience." 
                    />
                    
                    {/** Step 2 **/}
                    <Step 
                        animation={animationData2} 
                        title="Step 2: Select Your Legal Service" 
                        icon={<FaListAlt />} 
                        reverse={true} // Alternate reverse for visual variety
                        description="Browse through a list of legal services such as property agreements, contracts, legal advice, and more. Choose the service that fits your needs. Our platform supports diverse legal requirements." 
                    />
                    
                    {/** Step 3 **/}
                    <Step 
                        animation={animationData3} 
                        title="Step 3: Book a Consultation" 
                        icon={<FaFileSignature />} 
                        reverse={false} 
                        description="Once you select a service, book a consultation with a legal expert. Choose a suitable date and time for the meeting. You’ll receive a confirmation for your booking." 
                    />
                    
                    {/** Step 4 **/}
                    <Step 
                        animation={animationData4} 
                        title="Step 4: Attend Your Consultation" 
                        icon={<FaCalendarAlt />} 
                        reverse={true} 
                        description="Meet with a lawyer or legal expert at the scheduled time. You can ask questions, seek guidance, and discuss your specific legal needs. Your privacy and confidentiality are guaranteed." 
                    />
                    
                    {/** Step 5 **/}
                    <Step 
                        animation={animationData5} 
                        title="Step 5: Get Legal Documents Prepared" 
                        icon={<FaFileContract />} 
                        reverse={false} 
                        description="Based on your needs, our legal experts will prepare all necessary documents, contracts, and agreements. We ensure everything is reviewed and ready for your signature." 
                    />
                    
                    {/** Step 6 **/}
                    <Step 
                        animation={animationData6} 
                        title="Step 6: Ongoing Support & Guidance" 
                        icon={<FaComments />} 
                        reverse={true} 
                        description="Our team is here to support you throughout the process. If you need clarification, revisions, or additional support, we’re just a message away. We ensure seamless service." 
                    />
                    
                    {/** Step 7 **/}
                    <Step 
                        animation={animationData7} 
                        title="Step 7: Complete Your Legal Service" 
                        icon={<FaSmile />} 
                        reverse={false} 
                        description="Once everything is finalized, you’ll receive your legal documents. We aim to ensure you leave satisfied with a complete understanding of your legal situation." 
                    />
                </div>
            </main>

            <Footer /> {/* Footer is an in-flow element, will respect parent's bottom padding */}
        </div>
    );
}

interface StepProps {
    animation: object; 
    title: string; 
    icon: React.ReactNode; 
    description: string; 
    reverse?: boolean; // Make reverse optional, default to false or handle in component
}

const Step: React.FC<StepProps> = ({ animation, title, icon, description, reverse = false }) => (
    // Added responsive text alignment for mobile
    <div className={`flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} items-center md:space-x-8 animate-slide-up text-center md:text-left`}>
        <div className="w-full md:w-1/2 mb-6 md:mb-0">
            <div className="p-2 sm:p-4 rounded-lg shadow-2xl hover:scale-105 transition-transform duration-300 ease-in-out inline-block"> {/* inline-block for Lottie centering */}
                <Lottie options={defaultOptions(animation)} height={250} width={250} /> {/* Adjusted size for responsiveness */}
            </div>
        </div>
        <div className="md:w-1/2 space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-green-400 flex flex-col sm:flex-row items-center sm:space-x-3 space-y-2 sm:space-y-0 justify-center md:justify-start">
                <span className="p-2 bg-green-600 text-white rounded-full hover:rotate-12 transition-transform duration-300 ease-in-out">
                    {icon}
                </span>
                <span className="hover:text-green-500 transition-colors duration-300">
                    {title}
                </span>
            </h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                {description}
            </p>
        </div>
    </div>
);

export default HowItWorks;