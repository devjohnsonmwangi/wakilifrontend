import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import Navbar from "../../components/navbar/Navbar";
// import Footer from './Footer'; // Uncomment if you have a Footer
import serviceHeroImage from '../../assets/images/landingPage/coverimageone.webp';
import pageBackground from '../../assets/images/landingPage/coverimage3.jpeg';
import { ShieldCheck, Car, Truck, DollarSign, Wrench, Clipboard, FileText, Users, ArrowRight, LucideProps } from 'lucide-react';
import React from 'react';

interface ServiceItem {
    id: string;
    icon: React.ComponentType<LucideProps>; // More specific type for Lucide icons
    title: string;
    description: string;
}

// Simulate auth status - in a real app, this would come from context or state management
// If setIsLoggedIn is not used in this specific file, the linter might still warn about it here.
// For this example, we assume isLoggedIn is the only part used by THIS component.
const useAuth = () => {
    // To test logged out state:
    // const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoggedIn] = useState(true); // Example: user is logged in
    return { isLoggedIn };
};

const Services = () => {
    const { isLoggedIn } = useAuth(); // Only isLoggedIn is used from the hook here
    const navigate = useNavigate();

    const initialServicesData: ServiceItem[] = [
        {
            id: 'legal-consultation',
            icon: Clipboard,
            title: 'Legal Consultation',
            description: 'Expert legal consultants provide tailored advice for individuals and businesses.',
        },
        {
            id: 'contract-drafting',
            icon: ShieldCheck,
            title: 'Contract Drafting & Review',
            description: 'Legally sound, clear contracts protecting your interests.',
        },
        {
            id: 'corporate-law',
            icon: Car,
            title: 'Corporate Law',
            description: 'Services like company formation, mergers, and shareholder agreements.',
        },
        {
            id: 'litigation-dispute',
            icon: Wrench,
            title: 'Litigation & Dispute Resolution',
            description: 'Mediation, arbitration, and court litigation to resolve disputes.',
        },
        {
            id: 'employment-law',
            icon: DollarSign,
            title: 'Employment Law',
            description: 'Resolve issues related to wrongful termination, workplace rights, and compliance.',
        },
        {
            id: 'ip-protection',
            icon: Truck,
            title: 'Intellectual Property Protection',
            description: 'Protect your creative work, inventions, and innovations.',
        },
        {
            id: 'oaths-commissioning',
            icon: FileText,
            title: 'Oaths Commissioning',
            description: 'Witness sworn affidavits, statutory declarations, and signing of legal documents.',
        },
        {
            id: 'family-law',
            icon: Users,
            title: 'Family Law & Divorce',
            description: 'Support for issues such as divorce, child custody, and adoption.',
        },
    ];

    const [services, setServices] = useState(initialServicesData);
    const serviceRefs = useRef<(HTMLLIElement | null)[]>([]);

    const shuffle = (array: ServiceItem[]) => {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            setServices((prevServices) => shuffle([...prevServices]));
        }, 30000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        // Capture the current value of refs for use in the effect and cleanup
        const currentRefs = serviceRefs.current;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.remove('opacity-0', 'translate-y-10');
                        entry.target.classList.add('opacity-100', 'translate-y-0');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        currentRefs.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => {
            currentRefs.forEach((ref) => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, [services]); // Re-run observer setup if services array changes (e.g., due to shuffle)

    const handleServiceClick = () => {
        if (isLoggedIn) {
            navigate('/dashboard/ourservices');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-slate-900 dark:text-gray-100 flex flex-col transition-colors duration-300">
            <Navbar /> {/* Ensure Navbar is also dark-mode aware */}

            {/* Hero Section */}
            <div
                className="relative w-full h-[60vh] md:h-[70vh] bg-cover bg-center flex items-center justify-center text-center p-6"
                style={{ backgroundImage: `url(${pageBackground})` }}
            >
                {/* Overlay for contrast - adapts to dark mode */}
                <div className="absolute inset-0 bg-white/50 dark:bg-black/70 backdrop-blur-sm transition-colors duration-300"></div>
                <div className="relative z-10 flex flex-col items-center">
                    <img
                        src={serviceHeroImage}
                        alt="Wakili Premium Services"
                        className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover shadow-2xl border-4 border-purple-500/70 dark:border-purple-500 mb-6 transform hover:scale-105 transition-transform duration-300"
                    />
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
                            Our Premium Legal Services
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-700 dark:text-gray-300 max-w-2xl transition-colors duration-300">
                        At <strong className="font-semibold text-purple-600 dark:text-purple-400">Wakili</strong>, we are dedicated to delivering exceptional legal solutions tailored to your unique needs with utmost professionalism and care.
                    </p>
                </div>
            </div>

            {/* Services Grid Section */}
            <div className="w-full max-w-7xl mx-auto p-6 md:p-12">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-purple-600 dark:text-purple-400 transition-colors duration-300">
                    Explore Our Expertise
                </h2>

                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <li
                            key={service.id}
                            ref={el => serviceRefs.current[index] = el}
                            className="opacity-0 translate-y-10 transform transition-all duration-700 ease-out group"
                        >
                            <div
                                onClick={handleServiceClick}
                                className="bg-white/80 dark:bg-slate-800/70 backdrop-blur-md p-6 rounded-xl shadow-xl hover:shadow-purple-500/20 dark:hover:shadow-purple-500/40 border border-slate-200 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-300 ease-in-out transform hover:-translate-y-2 cursor-pointer h-full flex flex-col"
                            >
                                <div className="flex items-center mb-4">
                                    <div className="p-3 bg-purple-500/10 dark:bg-purple-500/20 rounded-full mr-4 group-hover:bg-purple-500/20 dark:group-hover:bg-purple-500/30 transition-colors duration-300">
                                        <service.icon size={28} className="text-purple-600 dark:text-purple-400 group-hover:text-purple-500 dark:group-hover:text-purple-300 transition-colors duration-300" />
                                    </div>
                                    <h3 className="font-semibold text-xl text-slate-800 dark:text-gray-100 group-hover:text-purple-500 dark:group-hover:text-purple-300 transition-colors duration-300">
                                        {service.title}
                                    </h3>
                                </div>
                                <p className="text-slate-600 dark:text-gray-400 leading-relaxed text-sm mb-auto transition-colors duration-300">
                                    {service.description}
                                </p>
                                <div className="mt-6 flex justify-end items-center text-purple-600 dark:text-purple-400 group-hover:text-purple-500 dark:group-hover:text-purple-300 transition-colors duration-300">
                                    <span className="text-sm font-medium mr-2">Learn More</span>
                                    <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform duration-300" />
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            {/* <Footer /> */} {/* Ensure Footer is also dark-mode aware */}
        </div>
    );
};

export default Services;