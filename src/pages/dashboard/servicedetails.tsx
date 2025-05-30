import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ShieldCheck, Car, Truck, DollarSign, Wrench, Clipboard, // Car, Truck, DollarSign will be used
    FileText, Users, LucideProps, ArrowLeft, CheckCircle, Star, // Users will be used
    CalendarPlus, Zap, ThumbsUp, Info, Briefcase, Landmark, Scale, GanttChartSquare, // Landmark, Scale will be used
    UsersRound, Puzzle, HelpCircle, ChevronDown, Target, Settings, Package, MessageSquare, ArrowRight // ArrowRight added
} from 'lucide-react';

interface ServiceItem {
    id: string;
    slug: string;
    icon: React.ComponentType<LucideProps>;
    title: string;
    description: string; // Short description
    category: string;
    tags?: string[];
    isNew?: boolean;
    isPopular?: boolean;
    status?: 'Available' | 'Active' | 'Requires Action' | 'Coming Soon' | 'Archived';
    lastUsed?: string;
    detailedDescription?: string; // Longer description for the details page
    whoIsThisFor?: string[];
    processSteps?: { title: string, description: string, icon: React.ComponentType<LucideProps> }[];
    expertBlurb?: string;
    pricingModel?: string;
    faqs?: { question: string, answer: string }[];
}

// 1. Define the base data for all services with correct icons and short descriptions
const initialServicesData: Omit<ServiceItem, 'detailedDescription' | 'whoIsThisFor' | 'processSteps' | 'expertBlurb' | 'pricingModel' | 'faqs'>[] = [
    {
        id: 'svc001', slug: 'legal-consultation', icon: Clipboard, title: 'Legal Consultation',
        description: 'Book a consultation with our expert legal advisors for personalized advice for any matter.',
        category: 'Advisory', tags: ['consultation', 'advice', 'expert'], isPopular: true, status: 'Active', lastUsed: '5 days ago'
    },
    {
        id: 'svc002', slug: 'contract-drafting-review', icon: ShieldCheck, title: 'Contract Drafting & Review',
        description: 'Ensure your contracts are legally sound and protect your interests effectively.',
        category: 'Documentation', tags: ['contracts', 'review', 'legal docs', 'drafting'], status: 'Active',
    },
    {
        id: 'svc003', slug: 'corporate-law-services', icon: Briefcase, title: 'Corporate Law & Business Setup',
        description: 'Comprehensive services including company formation, M&A, compliance, and shareholder agreements.',
        category: 'Business', tags: ['corporate', 'formation', 'mergers', 'compliance'], isNew: true, status: 'Active',
    },
    {
        id: 'svc004', slug: 'litigation-dispute-resolution', icon: Scale, title: 'Litigation & Dispute Resolution', // Uses Scale
        description: 'Expert representation in mediation, arbitration, and complex court proceedings.',
        category: 'Disputes', tags: ['litigation', 'court', 'arbitration', 'mediation'], status: 'Active', lastUsed: '1 month ago'
    },
    {
        id: 'svc005', slug: 'employment-law-support', icon: Users, title: 'Employment & Labor Law', // Uses Users
        description: 'Guidance on employment contracts, workplace disputes, HR policies, and labor compliance.',
        category: 'Business', tags: ['employment', 'hr', 'labor', 'workplace'], isPopular: true, status: 'Active'
    },
    {
        id: 'svc006', slug: 'intellectual-property-protection', icon: Truck, title: 'Intellectual Property Protection', // Uses Truck
        description: 'Secure your trademarks, patents, copyrights, and trade secrets with our expert IP team.',
        category: 'Protection', tags: ['ip', 'trademark', 'patent', 'copyright', 'trade secret'], status: 'Active'
    },
    {
        id: 'svc007', slug: 'oaths-commissioning-notary', icon: FileText, title: 'Oaths & Notary Services',
        description: 'Official witnessing for affidavits, statutory declarations, and notarization of legal documents.',
        category: 'Official Services', tags: ['notary', 'affidavit', 'declaration', 'commissioner'], isNew: true, status: 'Active'
    },
    {
        id: 'svc008', slug: 'family-law-divorce', icon: Users, title: 'Family Law & Divorce', // Uses Users
        description: 'Compassionate support for divorce, child custody, spousal support, adoption, and related matters.',
        category: 'Personal', tags: ['family', 'divorce', 'custody', 'adoption', 'support'], status: 'Active', lastUsed: 'Not used yet'
    },
    {
        id: 'svc009', slug: 'real-estate-law', icon: Landmark, title: 'Real Estate Law', // Uses Landmark
        description: 'Navigating property transactions, leasing, zoning, and land use regulations.',
        category: 'Property', tags: ['real estate', 'property', 'conveyancing', 'leasing', 'zoning'], isPopular: true, status: 'Active'
    },
    {
        id: 'svc010', slug: 'financial-legal-services', icon: DollarSign, title: 'Financial & Banking Law', // Uses DollarSign
        description: 'Advice on financial regulations, loan agreements, investment compliance, and fintech law.',
        category: 'Finance', tags: ['finance', 'banking', 'investment', 'fintech', 'regulation'], status: 'Active'
    },
    {
        id: 'svc011', slug: 'startup-legal-kickstarter', icon: Car, title: 'Startup Legal Kickstarter', // Uses Car
        description: 'Essential legal services for new businesses, from incorporation to initial funding rounds.',
        category: 'Business', tags: ['startup', 'new business', 'incorporation', 'funding'], isNew: true, status: 'Active'
    },
    {
        id: 'svc012', slug: 'estate-planning-wills', icon: GanttChartSquare, title: 'Estate Planning & Wills',
        description: 'Secure your legacy with comprehensive estate planning, will drafting, and trust formation.',
        category: 'Personal', tags: ['estate planning', 'wills', 'trusts', 'probate'], status: 'Active'
    },
    {
        id: 'svc013', slug: 'immigration-law-services', icon: Users, title: 'Immigration Law', // Uses Users
        description: 'Assistance with visa applications, residency permits, citizenship, and immigration appeals.',
        category: 'Immigration', tags: ['immigration', 'visa', 'residency', 'citizenship'], isPopular: true, status: 'Active', lastUsed: '2 weeks ago'
    },
    {
        id: 'svc014', slug: 'dispute-mediation-service', icon: Wrench, title: 'Alternative Dispute Resolution (ADR)',
        description: 'Facilitating resolutions outside of court through expert mediation and negotiation services.',
        category: 'Disputes', tags: ['adr', 'mediation', 'negotiation', 'settlement'], status: 'Active',
    },
    {
        id: 'svc015', slug: 'archived-legacy-service', icon: Clipboard, title: 'Legacy Data Archival (Old)',
        description: 'Access to archived records from our previous data management system. Read-only access.',
        category: 'Archived', tags: ['legacy', 'archive', 'old records'], status: 'Active', lastUsed: '1 year ago'
    }
];

// 2. Define specific detailed content for some services
const specificDetailedContentMap: Record<string, Partial<ServiceItem>> = {
    'svc001': {
        detailedDescription: "Our Legal Consultation service provides direct access to experienced attorneys who can offer clarity on complex legal issues. Whether you're facing a specific challenge or seeking preventative advice, we tailor our guidance to your unique situation, empowering you to make informed decisions. We cover a wide range of legal fields, ensuring you get the specific guidance you need.",
        whoIsThisFor: [
            "Individuals seeking clarity on personal legal matters.",
            "Businesses requiring expert advice on corporate law, contracts, or compliance.",
            "Startups navigating the legal landscape of formation and funding.",
            "Anyone needing a professional legal opinion before taking significant action."
        ],
        processSteps: [
            { title: "Initial Inquiry", description: "Contact us with your query. We'll assess if we're the right fit.", icon: MessageSquare },
            { title: "Information Gathering", description: "We may request relevant documents or details beforehand.", icon: FileText },
            { title: "Consultation Session", description: "A dedicated session with an expert to discuss your case.", icon: UsersRound },
            { title: "Actionable Advice", description: "Receive clear, practical advice and potential next steps.", icon: CheckCircle }
        ],
        expertBlurb: "Our advisory team comprises seasoned lawyers with specializations across diverse legal domains, ensuring you receive advice that is both comprehensive and current.",
        pricingModel: "Consultations are typically billed on an hourly basis. Package rates may be available for ongoing advisory needs. Please inquire for a specific quote.",
        faqs: [
            { question: "How long is a typical consultation?", answer: "Standard consultations range from 30 to 60 minutes, but can be tailored to your needs." },
            { question: "What should I prepare?", answer: "Gather any relevant documents, a list of questions, and a clear summary of your situation." },
            { question: "Is the information confidential?", answer: "Absolutely. All consultations are protected by attorney-client privilege." }
        ]
    },
    'svc002': {
        detailedDescription: "Protect your interests with meticulously drafted and thoroughly reviewed contracts. Our service covers everything from simple agreements to complex multi-party commercial contracts, ensuring clarity, enforceability, and risk mitigation. Ensure your contracts are legally sound and protect your interests effectively.",
        whoIsThisFor: [
            "Businesses of all sizes needing robust contractual agreements.",
            "Individuals entering into significant personal or financial agreements.",
            "Freelancers and consultants requiring service agreements.",
            "Landlords and tenants for lease agreements."
        ],
        processSteps: [
            { title: "Scope Definition", description: "Understand the purpose and key terms of the contract.", icon: Target },
            { title: "Drafting/Review", description: "Our experts draft or meticulously review your document.", icon: Wrench },
            { title: "Revisions & Feedback", description: "Incorporate your feedback and make necessary adjustments.", icon: Settings },
            { title: "Finalization", description: "Deliver a polished, legally sound contract ready for execution.", icon: ShieldCheck }
        ],
        expertBlurb: "Our contract law specialists have extensive experience across various industries, adept at crafting and analyzing agreements that stand up to scrutiny.",
        pricingModel: "Services are offered on a fixed-fee basis for standard contracts or hourly for complex/custom work. We provide transparent quotes upfront.",
        faqs: [
            { question: "What types of contracts do you handle?", answer: "We handle a wide array, including business, employment, real estate, IP, and personal contracts." },
            { question: "How long does it take?", answer: "Turnaround time varies by complexity, typically ranging from a few business days to two weeks." }
        ]
    },
    'svc003': {
        detailedDescription: "From inception to expansion, our corporate law services provide the backbone for your business success. We assist with formation, governance, mergers, acquisitions, and ongoing compliance, ensuring your operations are legally sound and strategically positioned. Navigate the complexities of corporate governance with ease.",
        whoIsThisFor: ["Entrepreneurs starting new ventures.", "Established companies seeking M&A support.", "Businesses needing compliance audits.", "Organizations restructuring their corporate entities."],
        processSteps: [
            { title: "Needs Assessment", description: "Understand your business goals and legal requirements.", icon: Briefcase },
            { title: "Strategic Planning", description: "Develop a legal strategy for formation, M&A, or compliance.", icon: GanttChartSquare },
            { title: "Execution & Filing", description: "Handle all necessary documentation and filings.", icon: FileText },
            { title: "Ongoing Support", description: "Provide continued advice on corporate governance.", icon: UsersRound }
        ],
        expertBlurb: "Our corporate lawyers are strategic partners, offering deep expertise in navigating the intricate world of business law and corporate transactions.",
        pricingModel: "We offer tailored packages for business setup and fixed or retainer fees for ongoing corporate counsel. M&A services are typically project-based.",
        faqs: [
            { question: "Can you help with international business setup?", answer: "Yes, we have experience and networks to assist with cross-border corporate matters." },
            { question: "What's included in a business setup package?", answer: "Typically, registration, foundational documents, and initial compliance advice." }
        ]
    },
};

// 3. Define generic detailed content for other services
const genericDetailedContentDefaults: Omit<ServiceItem, 'id' | 'slug' | 'icon' | 'title' | 'description' | 'category' | 'status'> = {
    whoIsThisFor: ["Individuals and businesses seeking expert assistance.", "Clients requiring specialized knowledge in this area.", "Those looking for reliable and effective solutions."],
    processSteps: [
        { title: "Initial Consultation", description: "We start by understanding your specific needs and objectives.", icon: MessageSquare },
        { title: "Strategy Development", description: "A tailored plan is created to address your requirements.", icon: Puzzle },
        { title: "Service Execution", description: "Our experts implement the plan with diligence and precision.", icon: Settings },
        { title: "Review & Follow-up", description: "We ensure your satisfaction and provide ongoing support if needed.", icon: CheckCircle }
    ],
    expertBlurb: "Our dedicated team of professionals brings years of experience and a commitment to excellence in delivering this service.",
    pricingModel: "Pricing is customized based on the scope of work. We offer transparent quotes and flexible engagement models. Contact us for details.",
    faqs: [
        { question: "How do I get started?", answer: "Simply contact us to schedule an initial discussion about your needs." },
        { question: "What makes your service different?", answer: "Our commitment to personalized service, expert knowledge, and client satisfaction sets us apart." }
    ]
};

// 4. Combine base data with detailed content
const allDashboardServices: ServiceItem[] = initialServicesData.map(baseService => {
    const specificDetails = specificDetailedContentMap[baseService.id];
    const detailedDescription = specificDetails?.detailedDescription || baseService.description + " Our team provides in-depth support and guidance for all aspects related to this service, ensuring your needs are met with professionalism and expertise.";
    
    if (specificDetails) {
        return { 
            ...baseService, 
            ...specificDetails,
            detailedDescription // Ensure specific detailedDescription is used if available
        };
    }
    // Apply generic details if no specific details are found
    return {
        ...baseService,
        ...genericDetailedContentDefaults,
        detailedDescription, // Use the constructed detailedDescription
    };
});


const FAQItem: React.FC<{ faq: { question: string, answer: string } }> = ({ faq }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-slate-200 dark:border-slate-700">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between items-center w-full py-4 text-left text-slate-700 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-400 focus:outline-none"
            >
                <span className="font-medium">{faq.question}</span>
                <ChevronDown
                    size={20}
                    className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            {isOpen && (
                <div className="pb-4 pr-6 text-slate-600 dark:text-slate-300 leading-relaxed">
                    {faq.answer}
                </div>
            )}
        </div>
    );
};


const ServiceDetails: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [service, setService] = useState<ServiceItem | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            const foundService = allDashboardServices.find(s => s.slug === slug);
            setService(foundService);
            setIsLoading(false);
            window.scrollTo(0, 0);
        }, 300);
    }, [slug]);

    const keyFeatures = useMemo(() => {
        if (service?.slug === 'legal-consultation') {
            return [
                "Direct Access to Legal Experts", "Tailored Advice Sessions", "Confidential & Secure Platform",
                "Actionable Next Steps Provided", "Multi-Disciplinary Coverage"
            ];
        }
        return [
            "Expert Professionals", "Personalized Strategy", "Transparent Communication",
            "Comprehensive Analysis", "Confidentiality Assured"
        ];
    }, [service]);

    const benefits = useMemo(() => {
        if (service?.slug === 'legal-consultation') {
            return [
                "Gain Clarity on Complex Issues", "Make Informed Decisions", "Mitigate Potential Risks Early",
                "Understand Your Legal Rights", "Save Time and Future Costs"
            ];
        }
        return [
            "Achieve desired outcomes", "Mitigate risks effectively", "Gain peace of mind",
            "Save time and resources", "Empowered decision-making"
        ];
    }, [service]);


    const relatedServices = useMemo(() => {
        if (!service) return [];
        return allDashboardServices
            .filter(s => s.category === service.category && s.id !== service.id)
            .slice(0, 2);
    }, [service]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 dark:border-purple-400 mx-auto mb-4"></div>
                    <p className="text-slate-700 dark:text-slate-300 text-lg">Loading service details...</p>
                </div>
            </div>
        );
    }

    if (!service) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-950 p-4 text-center">
                <Info size={64} className="text-red-500 mb-4" />
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Service Not Found</h1>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                    The service you are looking for does not exist or may have been moved.
                </p>
                <button
                    onClick={() => navigate('/dashboard/ourservices')}
                    className="flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md transition duration-300"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Back to All Services
                </button>
            </div>
        );
    }

    const ServiceIcon = service.icon; // This will now correctly use Car, Truck, Scale etc.

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300">
            <header className="bg-gradient-to-br from-slate-800 via-slate-900 to-black py-12 md:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-purple-700/10 dark:bg-purple-900/20 opacity-50 mix-blend-multiply"></div>
                <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-purple-500/20 rounded-full filter blur-3xl opacity-60 animate-pulse"></div>
                <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-indigo-500/20 rounded-full filter blur-3xl opacity-60 animate-pulse animation-delay-2000"></div>

                <div className="max-w-5xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                        <div className="p-4 bg-white/10 dark:bg-slate-700/50 rounded-xl shadow-lg backdrop-blur-sm">
                            <ServiceIcon size={64} className="text-purple-400 dark:text-purple-300" />
                        </div>
                        <div className="text-center md:text-left">
                            <span className="text-sm font-medium text-purple-400 dark:text-purple-300 uppercase tracking-wider">
                                {service.category}
                            </span>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mt-1 mb-3 tracking-tight">
                                {service.title}
                            </h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                {service.tags?.map(tag => (
                                    <span key={tag} className="text-xs px-3 py-1 bg-slate-700/50 dark:bg-slate-600/70 text-slate-300 dark:text-slate-200 rounded-full">
                                        {tag}
                                    </span>
                                ))}
                                {service.isPopular && (
                                    <span className="text-xs px-3 py-1 bg-yellow-500/80 text-yellow-900 dark:bg-yellow-400/80 dark:text-yellow-900 rounded-full flex items-center">
                                        <Star size={12} className="mr-1" /> Popular
                                    </span>
                                )}
                                {service.isNew && (
                                    <span className="text-xs px-3 py-1 bg-green-500/80 text-green-900 dark:bg-green-400/80 dark:text-green-900 rounded-full flex items-center">
                                        <Zap size={12} className="mr-1" /> New
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 -mt-10 md:-mt-16 relative z-20">
                <div className="bg-white dark:bg-slate-800 shadow-xl rounded-xl overflow-hidden">
                    <div className="p-6 md:p-8">
                        <button
                            onClick={() => navigate('/dashboard/ourservices')}
                            className="inline-flex items-center text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 mb-6 font-medium group"
                        >
                            <ArrowLeft size={18} className="mr-2 transition-transform group-hover:-translate-x-1" />
                            Back to All Services
                        </button>

                        <section className="mb-10">
                            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-3">
                                Service Overview
                            </h2>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base md:text-lg whitespace-pre-line">
                                {service.detailedDescription || service.description}
                            </p>
                            {service.lastUsed && (
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 flex items-center">
                                    <Info size={16} className="mr-2 text-sky-500" />
                                    Last accessed: {service.lastUsed}
                                </p>
                            )}
                        </section>

                        {service.whoIsThisFor && service.whoIsThisFor.length > 0 && (
                            <section className="mb-10 p-6 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
                                <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-100 mb-4 flex items-center">
                                    <Target size={22} className="mr-3 text-purple-500 dark:text-purple-400" /> Who Is This Service For?
                                </h3>
                                <ul className="space-y-2">
                                    {service.whoIsThisFor.map((item, index) => (
                                        <li key={index} className="flex items-start">
                                            <CheckCircle size={18} className="text-green-500 dark:text-green-400 mr-3 mt-1 flex-shrink-0" />
                                            <span className="text-slate-600 dark:text-slate-300">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {service.processSteps && service.processSteps.length > 0 && (
                            <section className="mb-10">
                                <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-100 mb-6 flex items-center">
                                    <Puzzle size={22} className="mr-3 text-purple-500 dark:text-purple-400" /> Our Approach / Typical Process
                                </h3>
                                <div className="space-y-6">
                                    {service.processSteps.map((step, index) => {
                                        const StepIcon = step.icon;
                                        return (
                                        <div key={index} className="flex items-start">
                                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 flex items-center justify-center mr-4">
                                                <StepIcon size={24} />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-medium text-slate-800 dark:text-white">{step.title}</h4>
                                                <p className="text-slate-600 dark:text-slate-300">{step.description}</p>
                                            </div>
                                        </div>
                                    )})}
                                </div>
                            </section>
                        )}


                        <div className="grid md:grid-cols-2 gap-8 mb-10">
                            <section>
                                <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-100 mb-4 flex items-center">
                                    <CheckCircle size={22} className="mr-2 text-green-500" /> Key Features
                                </h3>
                                <ul className="space-y-2">
                                    {keyFeatures.map((feature, index) => (
                                        <li key={index} className="flex items-start">
                                            <ThumbsUp size={18} className="text-purple-500 dark:text-purple-400 mr-3 mt-1 flex-shrink-0" />
                                            <span className="text-slate-600 dark:text-slate-300">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                            <section>
                                <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-100 mb-4 flex items-center">
                                    <Star size={22} className="mr-2 text-yellow-500" /> Client Benefits
                                </h3>
                                <ul className="space-y-2">
                                    {benefits.map((benefit, index) => (
                                        <li key={index} className="flex items-start">
                                            <Zap size={18} className="text-purple-500 dark:text-purple-400 mr-3 mt-1 flex-shrink-0" />
                                            <span className="text-slate-600 dark:text-slate-300">{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </div>

                        {service.expertBlurb && (
                            <section className="mb-10 p-6 bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 dark:from-slate-800/30 dark:via-slate-800/50 dark:to-slate-800/70 rounded-lg shadow">
                                <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-100 mb-3 flex items-center">
                                    <UsersRound size={22} className="mr-3 text-indigo-500 dark:text-indigo-400" /> Meet Our Experts
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                    {service.expertBlurb}
                                </p>
                                <Link
                                    to="/about"
                                    className="mt-4 inline-flex items-center text-sm text-purple-600 dark:text-purple-400 hover:underline font-medium group"
                                >
                                    Learn More About Our Team <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </section>
                        )}

                         {service.pricingModel && (
                            <section className="mb-10">
                                <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-100 mb-3 flex items-center">
                                    <Package size={22} className="mr-3 text-purple-500 dark:text-purple-400" /> Pricing & Packages
                                </h3>
                                <div className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-md">
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                        {service.pricingModel}
                                    </p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                                        For detailed pricing or custom package inquiries, please contact us for a personalized quote.
                                    </p>
                                </div>
                            </section>
                        )}


                        {service.faqs && service.faqs.length > 0 && (
                            <section className="mb-10">
                                <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-100 mb-4 flex items-center">
                                    <HelpCircle size={22} className="mr-3 text-purple-500 dark:text-purple-400" /> Frequently Asked Questions
                                </h3>
                                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                                    {service.faqs.map((faq, index) => (
                                        <FAQItem key={index} faq={faq} />
                                    ))}
                                </div>
                            </section>
                        )}


                        <section className="text-center py-10 border-t border-slate-200 dark:border-slate-700 mt-10">
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
                                Ready to Proceed with {service.title}?
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-lg mx-auto">
                                Take the next step with our expert team. Book an appointment  by  contacting us to discuss your specific needs and let us help you achieve your legal objectives.
                            </p>
                            <button
                                onClick={() => navigate('/contactus')}
                                className="inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                            >
                                <CalendarPlus size={22} className="mr-3" />
                                Book Appointment
                            </button>
                        </section>
                    </div>

                    {relatedServices.length > 0 && (
                        <section className="bg-slate-50 dark:bg-slate-800/50 p-6 md:p-8 border-t border-slate-200 dark:border-slate-700">
                            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-100 mb-6 text-center md:text-left">
                                You Might Also Be Interested In
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-6">
                                {relatedServices.map(related => {
                                    const RelatedIcon = related.icon; // This will also use the correct icons
                                    return (
                                        <Link
                                            to={`/dashboard/servicesdetails/${related.slug}`}
                                            key={related.id}
                                            className="block p-4 bg-white dark:bg-slate-700/70 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 group"
                                        >
                                            <div className="flex items-center mb-2">
                                                <div className="p-2 bg-purple-100 dark:bg-purple-500/20 rounded-md mr-3">
                                                    <RelatedIcon size={24} className="text-purple-600 dark:text-purple-400" />
                                                </div>
                                                <h4 className="font-semibold text-slate-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                                                    {related.title}
                                                </h4>
                                            </div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                                                {related.description}
                                            </p>
                                        </Link>
                                    );
                                })}
                            </div>
                        </section>
                    )}
                </div>
            </main>

            <footer className="text-center py-8 text-sm text-slate-500 dark:text-slate-400">
                © {new Date().getFullYear()} Your Law Firm. All Rights Reserved.
                <p className="mt-1 text-xs">Disclaimer: The information on this application is for general informational purposes only and does not constitute legal advice.</p>
            </footer>
        </div>
    );
};

export default ServiceDetails;