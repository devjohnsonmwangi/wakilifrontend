import { Link } from 'react-router-dom';
import { RootState } from '../../app/store';
// import bgrides from '../../assets/images/auth/logo.jpeg'; // Commented out or remove if not used
import heroMainBackground from '../../assets/images/landingPage/justicemaragabench.jpg'; // <-- MAKE SURE THIS PATH IS CORRECT
import { useSelector } from 'react-redux';
import { useEffect, useState, useMemo } from 'react';
import { Lightbulb, Shield, ArrowRight } from 'lucide-react';

// Hypothetical import from a different library
import SimpleParticles from 'react-tsparticles'; // Replace with actual library
// The configuration options would be specific to this new library
const particleConfigLight = { /* ... options for light mode ... */ };
const particleConfigDark = { /* ... options for dark mode ... */ };


const Hero = () => {
    const user = useSelector((state: RootState) => state.user);
    const name = user.user?.full_name;

    const [contentLoaded, setContentLoaded] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme === "dark" || (!currentTheme && prefersDark)) {
            document.documentElement.classList.add('dark');
            setIsDarkMode(true);
        } else {
            document.documentElement.classList.remove('dark');
            setIsDarkMode(false);
        }
        const observer = new MutationObserver(() => {
            const hasDarkClass = document.documentElement.classList.contains('dark');
            if (isDarkMode !== hasDarkClass) setIsDarkMode(hasDarkClass);
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, [isDarkMode]);

    useEffect(() => {
        const timer = setTimeout(() => setContentLoaded(true), 300);
        return () => clearTimeout(timer);
    }, []);

    const currentParticleConfig = useMemo(() => {
        return isDarkMode ? particleConfigDark : particleConfigLight;
    }, [isDarkMode]);

    return (
        <div
            className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-gray-100 dark:bg-gray-900" // Fallback background color
            style={{ // Apply the main background image here
                backgroundImage: `url(${heroMainBackground})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Render the new particle component - on top of the background image, below the overlay */}
            <SimpleParticles
                params={currentParticleConfig}
                className="absolute inset-0 z-10" // Ensure particles are above the background (z-0 or auto) and below overlay (z-20)
            />

            {/* This div was for the faint bgrides logo. You can remove it if heroMainBackground is your primary BG */}
            {/*
            <div
                className="absolute inset-0 z-10" // If you keep it, adjust z-index. Original was 0.10 opacity.
                style={{
                    backgroundImage: `url(${bgrides})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.10, // This was very faint
                }}
            />
            */}

            {/* Gradient overlay - to ensure text readability over the background image and particles */}
            <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/20 via-black/40 to-black/70 dark:from-black/40 dark:via-black/60 dark:to-black/80"></div>

            {/* Content - on top of everything */}
            <div
                className={`relative z-30 hero-content text-center transition-all duration-1000 ease-out
                    ${contentLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                    w-full max-w-4xl lg:max-w-5xl px-4 sm:px-6 lg:px-8 py-12 md:py-16`}
            >
                 <div className="space-y-6 md:space-y-10">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white animate-fade-in-down drop-shadow-xl">
                        Welcome to Wakili <span className="text-blue-400 dark:text-blue-300">Legal Service</span>
                        {name && <span className="block text-xl sm:text-2xl mt-2 font-normal">Glad to see you, {name}!</span>}
                    </h1>

                    <p className="text-lg sm:text-xl text-gray-200 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto animate-fade-in-up animation-delay-300">
                        <Lightbulb className="inline-block mr-2 h-6 w-6 text-yellow-300 dark:text-yellow-200 align-middle" />
                        Expert legal advice, contract reviews, and robust representation. We deliver trusted solutions for your peace of mind.
                    </p>

                    <div className="mt-6 md:mt-8 p-6 sm:p-8 bg-white/5 dark:bg-black/20 backdrop-blur-lg rounded-xl shadow-2xl border border-white/10 dark:border-white/5 animate-fade-in-up animation-delay-500">
                        <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-6 text-center sm:text-left">
                            Our Core Commitments
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-left">
                            {[
                                {
                                    icon: <Lightbulb className="h-7 w-7 text-blue-300 dark:text-blue-200 mb-2" />,
                                    title: "Legal Representation",
                                    text: "Ensuring every individual has access to competent legal representation and fair treatment."
                                },
                                {
                                    icon: <Shield className="h-7 w-7 text-green-300 dark:text-green-200 mb-2" />,
                                    title: "Fair Process",
                                    text: "Upholding your right to a fair and public trial, adjudicated by an independent and impartial body."
                                },
                                {
                                    icon: <Lightbulb className="h-7 w-7 text-purple-300 dark:text-purple-200 mb-2" />,
                                    title: "Personal Liberty",
                                    text: "Protecting you from arbitrary arrest, affirming your right to liberty and security."
                                }
                            ].map((item, index) => (
                                <div key={index} className="bg-white/5 dark:bg-black/10 p-4 sm:p-5 rounded-lg hover:bg-white/10 dark:hover:bg-black/20 transition-all duration-300 transform hover:scale-105 shadow-md">
                                    {item.icon}
                                    <h3 className="text-lg font-semibold text-white mb-1.5">{item.title}</h3>
                                    <p className="text-gray-300 dark:text-gray-400 text-sm leading-relaxed">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 md:mt-10 animate-fade-in-up animation-delay-700">
                        <Link
                            to="/register"
                            className="group inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-3.5 bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white rounded-lg text-md sm:text-lg font-semibold shadow-lg hover:shadow-xl transform transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                        >
                            Register & Explore Services
                            <ArrowRight className="ml-2.5 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;