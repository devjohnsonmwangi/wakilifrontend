import { Link } from 'react-router-dom';
import { RootState } from '../../app/store';
// import bgrides from '../../assets/images/auth/logo.jpeg'; 
// import heroMainBackground from '../../assets/images/landingPage/loginandregisterimage.webp'; 
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Shield, ArrowRight, Scale, Users, Clock, CheckCircle, Phone, Star } from 'lucide-react';


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

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl dark:bg-blue-900/30 animate-pulse" />
            <div className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-900/30 animate-pulse" />
            <div className="absolute top-1/2 left-1/2 h-96 w-96 rounded-full bg-purple-200/20 blur-3xl dark:bg-purple-900/20 animate-pulse" style={{animationDelay: '1s'}} />

            {/* Content - Full Width Card with Background */}
            <div
                className={`relative z-10 transition-all duration-1000 ease-out
                    ${contentLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                    w-full py-12 md:py-16`}
            >
                {/* Full-Width Content Card */}
                <div className="w-full bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl border-y border-slate-200/70 dark:border-slate-700/60 shadow-2xl">
                    <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 2xl:px-32 py-10 sm:py-12 lg:py-16">
                <div className="grid items-center gap-10 lg:grid-cols-2 xl:gap-16">
                    {/* Left: Headline & CTAs */}
                    <div className="space-y-6 text-center lg:text-left animate-fade-in-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-xs sm:text-sm font-semibold hover:scale-105 transition-transform duration-300">
                            <Shield className="h-4 w-4 animate-pulse" />
                            Kenya's Trusted Legal Platform
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-slate-900 dark:text-white leading-tight">
                            Find a Lawyer in Kenya for
                            <span className="block bg-gradient-to-r from-emerald-600 via-green-500 to-teal-600 dark:from-emerald-400 dark:via-green-400 dark:to-teal-400 bg-clip-text text-transparent mt-2 animate-gradient">
                                Family, Land, Business & Employment Cases
                            </span>
                            {name && (
                                <span className="block text-base sm:text-lg lg:text-xl mt-4 font-normal text-slate-700 dark:text-gray-300">
                                    Welcome back, {name}!
                                </span>
                            )}
                        </h1>
                        <p className="text-base sm:text-lg text-slate-600 dark:text-gray-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
                            Need help with divorce, child custody, land disputes, rent issues, employment termination, debt recovery, or contract review? Wakili connects you to verified Kenyan lawyers for fast legal advice, representation, and document drafting.
                        </p>
                        <div className="flex flex-wrap justify-center lg:justify-start gap-2 text-xs sm:text-sm font-semibold">
                            {[
                                'Legal Consultation',
                                'Contract Review',
                                'Land Disputes',
                                'Divorce & Custody',
                                'Employment Law',
                                'Business Registration'
                            ].map((item, idx) => (
                                <span
                                    key={item}
                                    className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-gray-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-700 dark:hover:text-emerald-400 transition-all duration-300 hover:scale-110 cursor-pointer"
                                    style={{animationDelay: `${idx * 0.1}s`}}
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                        <div className="flex flex-wrap justify-center lg:justify-start gap-3 text-xs sm:text-sm font-semibold">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer">
                                <CheckCircle className="h-4 w-4 animate-bounce" style={{animationDuration: '2s'}} />
                                24/7 Support
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer">
                                <CheckCircle className="h-4 w-4 animate-bounce" style={{animationDuration: '2s', animationDelay: '0.2s'}} />
                                500+ Cases Won
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer">
                                <CheckCircle className="h-4 w-4 animate-bounce" style={{animationDuration: '2s', animationDelay: '0.4s'}} />
                                98% Success Rate
                            </span>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                            <Link
                                to="/dashboard/ourservices"
                                className="group inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl text-base font-bold shadow-lg hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 ease-in-out hover:scale-110 w-full sm:w-auto"
                            >
                                Get Started Now
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                            </Link>
                            <Link
                                to="/dashboard/ourservices"
                                className="group inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-base font-semibold border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-xl hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-300 ease-in-out hover:scale-105 w-full sm:w-auto"
                            >
                                <Phone className="mr-2 h-5 w-5" />
                                Speak to a Lawyer
                            </Link>
                        </div>
                        <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 text-xs sm:text-sm text-slate-600 dark:text-gray-400">
                            <span className="inline-flex items-center gap-1.5">
                                <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                2-Hour Response
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                100% Confidential
                            </span>
                        </div>
                    </div>

                    {/* Right: Feature Card */}
                    <div className="relative animate-fade-in-right">
                        <div className="rounded-2xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 backdrop-blur shadow-2xl border border-slate-200/70 dark:border-slate-700 p-6 sm:p-7 hover:shadow-3xl transition-shadow duration-500">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Get Help in 3 Steps</h2>
                                <div className="inline-flex items-center gap-1 text-amber-500">
                                    <Star className="h-4 w-4 fill-current" />
                                    <Star className="h-4 w-4 fill-current" />
                                    <Star className="h-4 w-4 fill-current" />
                                    <Star className="h-4 w-4 fill-current" />
                                    <Star className="h-4 w-4 fill-current" />
                                    <span className="text-xs text-slate-600 dark:text-gray-400 ml-1">4.9/5</span>
                                </div>
                            </div>
                            <ul className="space-y-3 text-sm sm:text-base text-slate-700 dark:text-gray-300">
                                <li className="flex items-start gap-3">
                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold">1</span>
                                    Tell us your issue and location
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold">2</span>
                                    Get matched with the right lawyer
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-bold">3</span>
                                    Start your case within hours
                                </li>
                            </ul>
                            <div className="mt-5">
                                <p className="text-xs font-semibold text-slate-500 dark:text-gray-400 mb-2">Popular Case Types</p>
                                <div className="flex flex-wrap gap-2">
                                    {['Family Law', 'Land Disputes', 'Employment', 'Debt Recovery', 'Contracts'].map((item) => (
                                        <span key={item} className="px-2.5 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-gray-200">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-5 grid grid-cols-2 gap-3 text-xs sm:text-sm">
                                <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-3">
                                    <p className="text-emerald-700 dark:text-emerald-300 font-semibold">500+</p>
                                    <p className="text-slate-600 dark:text-gray-400">Successful Cases</p>
                                </div>
                                <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3">
                                    <p className="text-blue-700 dark:text-blue-300 font-semibold">2 Hours</p>
                                    <p className="text-slate-600 dark:text-gray-400">Avg. Response</p>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -z-10 -right-4 -bottom-4 h-24 w-24 rounded-2xl bg-emerald-200/50 dark:bg-emerald-900/30 blur-xl" />
                    </div>
                </div>

                {/* Additional Content Section - Why Choose Wakili */}
                <div className="mt-12 pt-10 border-t border-slate-200 dark:border-slate-700">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white text-center mb-8 animate-fade-in">
                        Why Kenyan Businesses & Individuals Trust Wakili
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: <Shield className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />,
                                title: "Licensed Lawyers Only",
                                desc: "All lawyers are verified members of the Law Society of Kenya with active practicing certificates."
                            },
                            {
                                icon: <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
                                title: "Fast Turnaround",
                                desc: "Get matched with a lawyer within 2 hours. Most consultations happen the same day."
                            },
                            {
                                icon: <Scale className="h-8 w-8 text-purple-600 dark:text-purple-400" />,
                                title: "Transparent Pricing",
                                desc: "No hidden fees. Get upfront quotes for legal services before you commit to anything."
                            },
                            {
                                icon: <Users className="h-8 w-8 text-amber-600 dark:text-amber-400" />,
                                title: "Specialized Expertise",
                                desc: "From family law to corporate law, find lawyers with specific expertise in your case type."
                            }
                        ].map((item, index) => (
                            <div key={index} className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-700/50 p-6 rounded-xl border border-slate-200 dark:border-slate-600 hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:border-emerald-500 dark:hover:border-emerald-500 cursor-pointer animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                                <div className="mb-4">{item.icon}</div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                                <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* How-To Search Intent Section */}
                <div className="mt-10">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white text-center mb-6">
                        How to Get Legal Help in Kenya - Step-by-Step Guides
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[
                            {
                                question: "How to Find a Lawyer in Kenya?",
                                steps: [
                                    "1. Tell us your legal issue and location",
                                    "2. Get matched with verified lawyers",
                                    "3. Compare quotes and reviews",
                                    "4. Book a consultation instantly"
                                ]
                            },
                            {
                                question: "How to File for Divorce in Kenya?",
                                steps: [
                                    "1. Consult with a family law lawyer",
                                    "2. Prepare divorce petition documents",
                                    "3. File at the Family Division Court",
                                    "4. Serve papers and attend hearings"
                                ]
                            },
                            {
                                question: "How to Recover Unpaid Debts?",
                                steps: [
                                    "1. Send a legal demand letter",
                                    "2. File a civil claim if ignored",
                                    "3. Obtain court judgment",
                                    "4. Execute the judgment"
                                ]
                            },
                            {
                                question: "How to Register a Business in Kenya?",
                                steps: [
                                    "1. Reserve your business name",
                                    "2. Prepare registration documents",
                                    "3. Submit to Business Registration Service",
                                    "4. Obtain KRA PIN and licenses"
                                ]
                            },
                            {
                                question: "How to Handle Unfair Dismissal?",
                                steps: [
                                    "1. Document all termination details",
                                    "2. File complaint with Employment Court",
                                    "3. Attend conciliation hearing",
                                    "4. Pursue compensation claim"
                                ]
                            },
                            {
                                question: "How to Resolve Land Disputes?",
                                steps: [
                                    "1. Verify land ownership documents",
                                    "2. Engage a land law specialist",
                                    "3. File suit at Environment & Land Court",
                                    "4. Present evidence and get judgment"
                                ]
                            }
                        ].map((item, index) => (
                            <div key={index} className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-700 p-5 rounded-xl border border-slate-200 dark:border-slate-600 hover:shadow-2xl hover:scale-105 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all duration-500 cursor-pointer animate-fade-in-up" style={{animationDelay: `${index * 0.15}s`}}>
                                <h4 className="font-bold text-base text-emerald-700 dark:text-emerald-400 mb-3">{item.question}</h4>
                                <ul className="space-y-2">
                                    {item.steps.map((step, idx) => (
                                        <li key={idx} className="text-sm text-slate-700 dark:text-gray-300 flex items-start gap-2">
                                            <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                                            <span>{step}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Common Legal Issues Section */}
                <div className="mt-10">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white text-center mb-6">
                        Common Legal Problems We Solve Daily
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {[
                            { title: "Landlord-Tenant Disputes", desc: "Eviction notices, rent arrears, security deposit issues" },
                            { title: "Divorce & Separation", desc: "Uncontested divorce, child custody, alimony claims" },
                            { title: "Land Title Issues", desc: "Title transfer, boundary disputes, land fraud cases" },
                            { title: "Employment Termination", desc: "Unfair dismissal, redundancy pay, employment contracts" },
                            { title: "Debt Collection", desc: "Unpaid loans, defaulted payments, legal demand letters" },
                            { title: "Business Contracts", desc: "Partnership agreements, supplier contracts, NDAs" },
                            { title: "Traffic Offenses", desc: "DUI cases, license suspension, accident claims" },
                            { title: "Estate & Wills", desc: "Will drafting, succession, probate applications" },
                            { title: "Consumer Protection", desc: "Faulty products, service disputes, refund claims" }
                        ].map((item, index) => (
                            <div key={index} className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors">
                                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">{item.title}</h4>
                                <p className="text-xs text-slate-600 dark:text-gray-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;