import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
    ShieldCheck, Car, Truck, DollarSign, Wrench, Clipboard,
    FileText, Users, ArrowRight, Search, LucideProps, XCircle,
    Filter, ChevronDown, Star, Zap, Info, Briefcase,
    Landmark, Scale, GanttChartSquare,

    UsersRound, Puzzle, Target, Settings, MessageSquare, CheckCircle 
} from 'lucide-react';


// import DashboardNavbar from '../../components/dashboard/DashboardNavbar';

interface ServiceItem {
    id: string;
    slug: string;
    icon: React.ComponentType<LucideProps>;
    title: string;
    description: string; 
    category: string;
    tags?: string[];
    isNew?: boolean;
    isPopular?: boolean;
    status?: 'Available' | 'Active' | 'Requires Action' | 'Coming Soon' | 'Archived';
    lastUsed?: string;
    // Fields for ServiceDetails page
    detailedDescription?: string;
    whoIsThisFor?: string[];
    processSteps?: { title: string, description: string, icon: React.ComponentType<LucideProps> }[];
    expertBlurb?: string;
    pricingModel?: string;
    faqs?: { question: string, answer: string }[];
}



const initialServicesData: Omit<ServiceItem, 'detailedDescription' | 'whoIsThisFor' | 'processSteps' | 'expertBlurb' | 'pricingModel' | 'faqs'>[] = [
    {
        id: 'svc001', slug: 'legal-consultation', icon: Clipboard, title: 'Legal Consultation',
        description: 'Book a consultation with our expert legal advisors for personalized advice for any matter.',
        category: 'Advisory', tags: ['consultation', 'advice', 'expert'], isPopular: true, status: 'Active', lastUsed: '5 days ago'
    },
    {
        id: 'svc002', slug: 'contract-drafting-review', icon: ShieldCheck, title: 'Contract Drafting & Review',
        description: 'Ensure your contracts are legally sound and protect your interests effectively. Covers all contract types.',
        category: 'Documentation', tags: ['contracts', 'review', 'legal docs', 'drafting'], status: 'Active',
    },
    {
        id: 'svc003', slug: 'corporate-law-services', icon: Briefcase, title: 'Corporate Law & Business Setup',
        description: 'Comprehensive services including company formation, M&A, compliance, and shareholder agreements.',
        category: 'Business', tags: ['corporate', 'formation', 'mergers', 'compliance'], isNew: true, status: 'Active',
    },
    {
        id: 'svc004', slug: 'litigation-dispute-resolution', icon: Scale, title: 'Litigation & Dispute Resolution',
        description: 'Expert representation in mediation, arbitration, and complex court proceedings. We fight for you.',
        category: 'Disputes', tags: ['litigation', 'court', 'arbitration', 'mediation'], status: 'Active', lastUsed: '1 month ago'
    },
    {
        id: 'svc005', slug: 'employment-law-support', icon: Users, title: 'Employment & Labor Law',
        description: 'Guidance on employment contracts, workplace disputes, HR policies, and labor compliance.',
        category: 'Business', tags: ['employment', 'hr', 'labor', 'workplace'], isPopular: true, status: 'Active'
    },
    {
        id: 'svc006', slug: 'intellectual-property-protection', icon: Truck, title: 'Intellectual Property Protection',
        description: 'Secure your trademarks, patents, copyrights, and trade secrets with our expert IP team.',
        category: 'Protection', tags: ['ip', 'trademark', 'patent', 'copyright', 'trade secret'], status: 'Active'
    },
    {
        id: 'svc007', slug: 'oaths-commissioning-notary', icon: FileText, title: 'Oaths & Notary Services',
        description: 'Official witnessing for affidavits, statutory declarations, and notarization of legal documents.',
        category: 'Official Services', tags: ['notary', 'affidavit', 'declaration', 'commissioner'], isNew: true, status: 'Active'
    },
    {
        id: 'svc008', slug: 'family-law-divorce', icon: Users, title: 'Family Law & Divorce',
        description: 'Compassionate support for divorce, child custody, spousal support, adoption, and related matters.',
        category: 'Personal', tags: ['family', 'divorce', 'custody', 'adoption', 'support'], status: 'Active', lastUsed: 'Not used yet'
    },
    {
        id: 'svc009', slug: 'real-estate-law', icon: Landmark, title: 'Real Estate Law',
        description: 'Navigating property transactions, leasing, zoning, and land use regulations. For buyers and sellers.',
        category: 'Property', tags: ['real estate', 'property', 'conveyancing', 'leasing', 'zoning'], isPopular: true, status: 'Active'
    },
    {
        id: 'svc010', slug: 'financial-legal-services', icon: DollarSign, title: 'Financial & Banking Law',
        description: 'Advice on financial regulations, loan agreements, investment compliance, and fintech law.',
        category: 'Finance', tags: ['finance', 'banking', 'investment', 'fintech', 'regulation'], status: 'Active'
    },
    {
        id: 'svc011', slug: 'startup-legal-kickstarter', icon: Car, title: 'Startup Legal Kickstarter',
        description: 'Essential legal services for new businesses, from incorporation to initial funding rounds.',
        category: 'Business', tags: ['startup', 'new business', 'incorporation', 'funding'], isNew: true, status: 'Active'
    },
    {
        id: 'svc012', slug: 'estate-planning-wills', icon: GanttChartSquare, title: 'Estate Planning & Wills',
        description: 'Secure your legacy with comprehensive estate planning, will drafting, and trust formation.',
        category: 'Personal', tags: ['estate planning', 'wills', 'trusts', 'probate'], status: 'Active'
    },
    {
        id: 'svc013', slug: 'immigration-law-services', icon: Users, title: 'Immigration Law',
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

const specificDetailedContentMap: Record<string, Partial<ServiceItem>> = {
    'svc001': {
        detailedDescription: "Our Legal Consultation service provides direct access to experienced attorneys who can offer clarity on complex legal issues. Whether you're facing a specific challenge or seeking preventative advice, we tailor our guidance to your unique situation, empowering you to make informed decisions. We cover a wide range of legal fields, ensuring you get the specific guidance you need.",
        whoIsThisFor: [ /* ... */ ],
        processSteps: [
            { title: "Initial Inquiry", description: "Contact us with your query. We'll assess if we're the right fit.", icon: MessageSquare },
            { title: "Information Gathering", description: "We may request relevant documents or details beforehand.", icon: FileText }, // FileText is used
            { title: "Consultation Session", description: "A dedicated session with an expert to discuss your case.", icon: UsersRound }, // UsersRound is used
            { title: "Actionable Advice", description: "Receive clear, practical advice and potential next steps.", icon: CheckCircle } // CheckCircle is used
        ],
        expertBlurb: "Our advisory team comprises seasoned lawyers with specializations across diverse legal domains, ensuring you receive advice that is both comprehensive and current.",
        pricingModel: "Consultations are typically billed on an hourly basis. Package rates may be available for ongoing advisory needs. Please inquire for a specific quote.",
        faqs: [ /* ... */ ]
    },
    'svc002': {
        detailedDescription: "Protect your interests with meticulously drafted and thoroughly reviewed contracts. Our service covers everything from simple agreements to complex multi-party commercial contracts, ensuring clarity, enforceability, and risk mitigation. Ensure your contracts are legally sound and protect your interests effectively.",
        whoIsThisFor: [ /* ... */ ],
        processSteps: [
            { title: "Scope Definition", description: "Understand the purpose and key terms of the contract.", icon: Target }, // Target is used
            { title: "Drafting/Review", description: "Our experts draft or meticulously review your document.", icon: Wrench }, // Wrench is used
            { title: "Revisions & Feedback", description: "Incorporate your feedback and make necessary adjustments.", icon: Settings }, // Settings is used
            { title: "Finalization", description: "Deliver a polished, legally sound contract ready for execution.", icon: ShieldCheck } // ShieldCheck is used
        ],
        expertBlurb: "Our contract law specialists have extensive experience across various industries, adept at crafting and analyzing agreements that stand up to scrutiny.",
        pricingModel: "Services are offered on a fixed-fee basis for standard contracts or hourly for complex/custom work. We provide transparent quotes upfront.",
        faqs: [ /* ... */ ]
    },
    'svc003': {
        detailedDescription: "From inception to expansion, our corporate law services provide the backbone for your business success. We assist with formation, governance, mergers, acquisitions, and ongoing compliance, ensuring your operations are legally sound and strategically positioned. Navigate the complexities of corporate governance with ease.",
        whoIsThisFor: [ /* ... */ ],
        processSteps: [
            { title: "Needs Assessment", description: "Understand your business goals and legal requirements.", icon: Briefcase }, // Briefcase is used
            { title: "Strategic Planning", description: "Develop a legal strategy for formation, M&A, or compliance.", icon: GanttChartSquare }, // GanttChartSquare is used
            { title: "Execution & Filing", description: "Handle all necessary documentation and filings.", icon: FileText },
            { title: "Ongoing Support", description: "Provide continued advice on corporate governance.", icon: UsersRound }
        ],
        expertBlurb: "Our corporate lawyers are strategic partners, offering deep expertise in navigating the intricate world of business law and corporate transactions.",
        pricingModel: "We offer tailored packages for business setup and fixed or retainer fees for ongoing corporate counsel. M&A services are typically project-based.",
        faqs: [ /* ... */ ]
    },
};

const genericDetailedContentDefaults: Omit<ServiceItem, 'id' | 'slug' | 'icon' | 'title' | 'description' | 'category' | 'status' | 'tags' | 'isNew' | 'isPopular' | 'lastUsed' > = {
    whoIsThisFor: ["Individuals and businesses seeking expert assistance.", "Clients requiring specialized knowledge in this area.", "Those looking for reliable and effective solutions."],
    processSteps: [
        { title: "Initial Consultation", description: "We start by understanding your specific needs and objectives.", icon: MessageSquare }, // MessageSquare is used
        { title: "Strategy Development", description: "A tailored plan is created to address your requirements.", icon: Puzzle }, // Puzzle is used
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

const allDashboardServices: ServiceItem[] = initialServicesData.map(baseService => {
    const specificDetails = specificDetailedContentMap[baseService.id];
    const detailedDescription = specificDetails?.detailedDescription || baseService.description + " Our team provides in-depth support and guidance for all aspects related to this service, ensuring your needs are met with professionalism and expertise.";

    if (specificDetails) {
        return {
            ...baseService,
            ...specificDetails,
            detailedDescription
        };
    }
    return {
        ...baseService,
        ...genericDetailedContentDefaults,
        detailedDescription,
    };
});



type SortOption = 'title-asc' | 'title-desc' | 'popularity' | 'newest' | 'category';


const OurServices: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [sortBy, setSortBy] = useState<SortOption>('popularity');
    const [visibleServices, setVisibleServices] = useState<ServiceItem[]>([]);
    const serviceItemRefs = useRef<(HTMLDivElement | null)[]>([]);

    const categories = useMemo(() => {
        const uniqueCategories = ['all', ...new Set(allDashboardServices.map(s => s.category))];
        return uniqueCategories.sort((a, b) => a === 'all' ? -1 : b === 'all' ? 1 : a.localeCompare(b));
    }, []);

    const processedServices = useMemo(() => {
        let services = [...allDashboardServices];

        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            services = services.filter(service =>
                service.title.toLowerCase().includes(lowerCaseSearchTerm) ||
                service.description.toLowerCase().includes(lowerCaseSearchTerm) ||
                service.category.toLowerCase().includes(lowerCaseSearchTerm) ||
                (service.tags && service.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearchTerm)))
            );
        }

        if (selectedCategory !== 'all') {
            services = services.filter(service => service.category === selectedCategory);
        }

        switch (sortBy) {
            case 'title-asc':
                services.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'title-desc':
                services.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case 'popularity':
                services.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0) || a.title.localeCompare(b.title));
                break;
            case 'newest':
                services.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0) || a.title.localeCompare(b.title));
                break;
            case 'category':
                 services.sort((a,b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title));
                 break;
        }
        return services;
    }, [searchTerm, selectedCategory, sortBy]);

    useEffect(() => {
        setVisibleServices(processedServices);
        serviceItemRefs.current = serviceItemRefs.current.slice(0, processedServices.length);
    }, [processedServices]);

    useEffect(() => {
        const currentRefs = serviceItemRefs.current;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.remove('opacity-0', 'translate-y-5');
                        entry.target.classList.add('opacity-100', 'translate-y-0');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -20px 0px' }
        );

        currentRefs.forEach(ref => {
            if (ref) {
                ref.classList.add('opacity-0', 'translate-y-5');
                observer.observe(ref);
            }
        });

        return () => {
            currentRefs.forEach(ref => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, [visibleServices]);

    const handleServiceNavigation = (slug: string) => {
        navigate(`/dashboard/servicesdetails/${slug}`);
    };

    const getStatusColor = (status?: ServiceItem['status']) => {
        switch (status) {
            case 'Active': return 'bg-green-100 dark:bg-green-500/30 text-green-700 dark:text-green-300';
            case 'Requires Action': return 'bg-yellow-100 dark:bg-yellow-500/30 text-yellow-700 dark:text-yellow-300';
            case 'Coming Soon': return 'bg-sky-100 dark:bg-sky-500/30 text-sky-700 dark:text-sky-300';
            case 'Archived': return 'bg-gray-200 dark:bg-slate-600/40 text-gray-600 dark:text-slate-400';
            case 'Available':
            default: return 'bg-gray-100 dark:bg-slate-700/50 text-gray-700 dark:text-slate-300';
        }
    };

    return (
        <div className="flex-1 p-4 sm:p-6 md:p-8 bg-gray-100 dark:bg-slate-900 min-h-screen transition-colors duration-300">
            <header className="mb-8 md:mb-12 p-6 sm:p-8 md:p-10 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 dark:from-purple-700 dark:via-indigo-700 dark:to-blue-800 rounded-xl shadow-xl text-center">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
                    Explore Our Premier Legal Services
                </h1>
                <p className="text-md sm:text-lg text-purple-100 dark:text-purple-200 max-w-3xl mx-auto">
                    Discover tailored solutions for all your legal needs. Expertise and dedication, at your service.
                </p>
            </header>

            <div className="mb-6 md:mb-8 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="md:col-span-1">
                        <label htmlFor="search-service" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Search Services</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                            </div>
                            <input
                                id="search-service" type="text" placeholder="E.g., 'contract', 'IP'"
                                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-10 py-2.5 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-transparent text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                                    aria-label="Clear search"
                                >
                                    <XCircle className="h-5 w-5" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="md:col-span-1">
                        <label htmlFor="category-filter" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Filter by Category</label>
                        <div className="relative">
                            <select
                                id="category-filter" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full pl-3 pr-10 py-2.5 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-transparent text-slate-700 dark:text-slate-200 appearance-none transition-colors"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat} className="dark:bg-slate-700 dark:text-white">
                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <ChevronDown className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-1">
                         <label htmlFor="sort-by" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Sort by</label>
                        <div className="relative">
                            <select
                                id="sort-by" value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)}
                                className="w-full pl-3 pr-10 py-2.5 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-transparent text-slate-700 dark:text-slate-200 appearance-none transition-colors"
                            >
                                <option value="popularity" className="dark:bg-slate-700 dark:text-white">Popularity</option>
                                <option value="newest" className="dark:bg-slate-700 dark:text-white">Newest First</option>
                                <option value="title-asc" className="dark:bg-slate-700 dark:text-white">Title (A-Z)</option>
                                <option value="title-desc" className="dark:bg-slate-700 dark:text-white">Title (Z-A)</option>
                                <option value="category" className="dark:bg-slate-700 dark:text-white">Category</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <ChevronDown className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {visibleServices.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                    {visibleServices.map((service, index) => (
                        <div
                            key={service.id}
                            ref={el => { serviceItemRefs.current[index] = el; }}
                            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-500 ease-out hover:shadow-xl dark:hover:shadow-purple-600/30 hover:-translate-y-1 flex flex-col group"
                        >
                            <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-700/50">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                                        {service.category}
                                    </span>
                                    <div className="flex space-x-2">
                                        {service.isNew && (
                                            <span title="New Service" className="flex items-center text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-500/30 dark:text-green-300">
                                                <Zap size={12} className="mr-1" /> New
                                            </span>
                                        )}
                                        {service.isPopular && (
                                            <span title="Popular Service" className="flex items-center text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-500/30 dark:text-yellow-300">
                                                <Star size={12} className="mr-1" /> Popular
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 sm:p-6 flex-grow">
                                <div className="flex items-start mb-3">
                                    <div className="p-3 bg-purple-100 dark:bg-purple-500/10 rounded-lg mr-4 transition-colors duration-300 group-hover:bg-purple-200 dark:group-hover:bg-purple-500/20">
                                        <service.icon size={28} className="text-purple-600 dark:text-purple-400 transition-colors duration-300" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-slate-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors duration-300 mb-1">
                                            {service.title}
                                        </h2>
                                         {service.status && (
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusColor(service.status)}`}>
                                                {service.status}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed line-clamp-3">
                                    {service.description}
                                </p>
                                {service.lastUsed && (
                                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                                        <Info size={12} className="inline mr-1" />
                                        Last used: {service.lastUsed}
                                    </p>
                                )}
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-slate-800/60 border-t border-gray-200 dark:border-slate-700/50">
                                <button
                                    onClick={() => handleServiceNavigation(service.slug)}
                                    className="w-full flex items-center justify-center text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 group-hover:bg-purple-100 dark:group-hover:bg-purple-500/10 py-2.5 px-4 rounded-md transition-all duration-300"
                                >
                                    View Details
                                    <ArrowRight size={16} className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <Filter size={48} className="mx-auto text-slate-400 dark:text-slate-500 mb-4" />
                    <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">No Services Match Your Criteria</h3>
                    <p className="text-slate-500 dark:text-slate-400">
                        Try adjusting your search or filter settings.
                    </p>
                </div>
            )}
             <footer className="mt-16 pt-8 border-t border-slate-300 dark:border-slate-700 text-center text-slate-500 dark:text-slate-400 text-sm">
                      <p>© {new Date().getFullYear()} Wakili Inc. All rights reserved.</p>
                      <p className="mt-1">
                        <Link to="/terms" className="hover:text-teal-600 dark:hover:text-teal-400">Terms of Service</Link> | <Link to="/privacy-policy" className="hover:text-teal-600 dark:hover:text-teal-400">Privacy Policy</Link> | <Link to="/contactus" className="hover:text-teal-600 dark:hover:text-teal-400">Contact Us</Link>
                      </p>
                    </footer>
        </div>
    );
};

export default OurServices; // Changed export name