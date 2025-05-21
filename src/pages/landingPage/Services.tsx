import { useState, useEffect, useRef, LegacyRef } from 'react';
import Navbar from "../../components/navbar/Navbar";
//import Footer from './Footer';
import serviceimg from '../../assets/images/landingPage/coverimageone.webp';
import bgrides from '../../assets/images/landingPage/coverimage3.jpeg';
import { ShieldCheck, Car, Truck, DollarSign, Wrench, Clipboard, FileText, Users } from 'lucide-react';
import React from 'react';

interface ServiceItem {
    icon: React.ComponentType<any>;
    title: string;
    description: string;
    ref: React.RefObject<HTMLLIElement>; // Add a ref to each service item
}

const Services = () => {
    const initialServices: ServiceItem[] = [
        {
            icon: Clipboard,
            title: 'Legal Consultation',
            description: 'Expert legal consultants provide tailored advice for individuals and businesses.',
            ref: useRef<HTMLLIElement>(null),
        },
        {
            icon: ShieldCheck,
            title: 'Contract Drafting & Review',
            description: 'Legally sound, clear contracts protecting your interests.',
            ref: useRef<HTMLLIElement>(null),
        },
        {
            icon: Car,
            title: 'Corporate Law',
            description: 'Services like company formation, mergers, and shareholder agreements.',
            ref: useRef<HTMLLIElement>(null),
        },
        {
            icon: Wrench,
            title: 'Litigation & Dispute Resolution',
            description: 'Mediation, arbitration, and court litigation to resolve disputes.',
            ref: useRef<HTMLLIElement>(null),
        },
        {
            icon: DollarSign,
            title: 'Employment Law',
            description: 'Resolve issues related to wrongful termination, workplace rights, and compliance.',
            ref: useRef<HTMLLIElement>(null),
        },
        {
            icon: Truck,
            title: 'Intellectual Property Protection',
            description: 'Protect your creative work, inventions, and innovations.',
            ref: useRef<HTMLLIElement>(null),
        },
        {
            icon: FileText,
            title: 'Oaths Commissioning',
            description: 'Witness sworn affidavits, statutory declarations, and signing of legal documents.',
            ref: useRef<HTMLLIElement>(null),
        },
        {
            icon: Users,
            title: 'Family Law & Divorce',
            description: 'Support for issues such as divorce, child custody, and adoption.',
            ref: useRef<HTMLLIElement>(null),
        },
    ];

    const [services, setServices] = useState(initialServices);
    const [visibleServices, setVisibleServices] = useState<number[]>([]);

    // Function to shuffle array (Fisher-Yates shuffle)
    const shuffle = (array: ServiceItem[]) => {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
        return array;
    };

    // useEffect for shuffling services every 10 seconds
    useEffect(() => {
        const intervalId = setInterval(() => {
            setServices((prevServices) => shuffle([...prevServices]));
        }, 30000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const nextVisible = visibleServices.length;
            if (nextVisible < services.length) {
                const nextService = services[nextVisible];
                if (nextService.ref.current) {
                    const rect = nextService.ref.current.getBoundingClientRect();
                    if (rect.top <= window.innerHeight * 0.75) { // Adjust 0.75 as needed
                        setVisibleServices([...visibleServices, nextVisible]);
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check

        return () => window.removeEventListener('scroll', handleScroll);
    }, [services, visibleServices]);

    return (
     <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white min-h-screen flex flex-col">
                    <Navbar />
        <div
            className="w-full bg-cover bg-center min-h-screen py-10 relative overflow-hidden"
            style={{ backgroundImage: `url(${bgrides})` }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-500 opacity-20"></div>

            <div className="relative z-10 w-full mx-auto p-6 md:p-8 rounded-xl shadow-lg text-gray-700 bg-white">
                {/* Image and Header Section */}
                <div className="flex flex-col md:flex-row items-center p-4 rounded-lg shadow-md">
                    <img
                        src={serviceimg}
                        alt="Wakili Services"
                        className="w-32 h-32 md:w-48 md:h-48 rounded-full shadow-xl border-4 border-purple-400 mb-4 md:mb-0 md:mr-8"
                    />
                    <div className="text-center md:text-left">
                        <h2 className="font-extrabold text-3xl md:text-4xl text-purple-600 mb-2 tracking-tight">
                            Our Premium Legal Services
                        </h2>
                        <p className="text-base md:text-lg leading-relaxed">
                            At <strong className="font-semibold text-2xl text-purple-600">Wakili</strong>, we are committed to providing top-notch legal services that cater to your needs.
                        </p>
                    </div>
                </div>

                {/* Services List */}
                <ul className="mt-8 space-y-6">
                    {services.map((service, index) => (
                        <li
                            key={index}
                            ref={service.ref as LegacyRef<HTMLLIElement>} // Attach ref to the service item
                            className={`flex items-start gap-4 p-4 rounded-lg shadow-sm bg-gray-50 hover:bg-gray-100 transition-opacity duration-500 ${visibleServices.includes(index) ? 'opacity-100' : 'opacity-0'}`}
                        >
                            <service.icon size={30} className="text-purple-500 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-xl text-purple-600 mb-1">{service.title}</h3>
                                <p className="text-gray-700 leading-relaxed">{service.description}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
   
    </div>
    );
};

export default Services;