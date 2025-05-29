import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ShieldCheck, Car, Truck, DollarSign, Wrench, Clipboard,
    FileText, Users, ArrowRight, Search, LucideProps, XCircle,
    Filter, ChevronDown, Star, Zap, Info, Briefcase, // Added Briefcase for more icon variety
    Landmark, Scale, GanttChartSquare // Added more for variety
} from 'lucide-react';

// (Optional) If you have a shared Navbar for the dashboard
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
    status?: 'Available' | 'Active' | 'Requires Action' | 'Coming Soon' | 'Archived'; // Added 'Archived'
    lastUsed?: string;
}

// Expanded and diversified sample service data, ensuring icon usage
const allDashboardServices: ServiceItem[] = [
    {
        id: 'svc001', slug: 'legal-consultation', icon: Clipboard, title: 'Legal Consultation',
        description: 'Book a consultation with our expert legal advisors for personalized advice for any matter.',
        category: 'Advisory', tags: ['consultation', 'advice'], isPopular: true, status: 'Active', lastUsed: '5 days ago'
    },
    {
        id: 'svc002', slug: 'contract-drafting-review', icon: ShieldCheck, title: 'Contract Drafting & Review',
        description: 'Ensure your contracts are legally sound and protect your interests effectively. Covers all contract types.',
        category: 'Documentation', tags: ['contracts', 'review', 'legal docs'], status: 'Available',
    },
    {
        id: 'svc003', slug: 'corporate-law-services', icon: Briefcase, title: 'Corporate Law & Business Setup', // Used Briefcase
        description: 'Comprehensive services including company formation, M&A, compliance, and shareholder agreements.',
        category: 'Business', tags: ['corporate', 'formation', 'mergers', 'compliance'], isNew: true, status: 'Available',
    },
    {
        id: 'svc004', slug: 'litigation-dispute-resolution', icon: Scale, title: 'Litigation & Dispute Resolution', // Used Scale
        description: 'Expert representation in mediation, arbitration, and complex court proceedings. We fight for you.',
        category: 'Disputes', tags: ['litigation', 'court', 'arbitration', 'mediation'], status: 'Requires Action', lastUsed: '1 month ago'
    },
    {
        id: 'svc005', slug: 'employment-law-support', icon: Users, title: 'Employment & Labor Law', // Users icon
        description: 'Guidance on employment contracts, workplace disputes, HR policies, and labor compliance.',
        category: 'Business', tags: ['employment', 'hr', 'labor', 'workplace'], isPopular: true, status: 'Available'
    },
    {
        id: 'svc006', slug: 'intellectual-property-protection', icon: Truck, title: 'Intellectual Property Protection', // Truck for IP delivery/protection
        description: 'Secure your trademarks, patents, copyrights, and trade secrets with our expert IP team.',
        category: 'Protection', tags: ['ip', 'trademark', 'patent', 'copyright', 'trade secret'], status: 'Available'
    },
    {
        id: 'svc007', slug: 'oaths-commissioning-notary', icon: FileText, title: 'Oaths & Notary Services', // FileText for documents
        description: 'Official witnessing for affidavits, statutory declarations, and notarization of legal documents.',
        category: 'Official Services', tags: ['notary', 'affidavit', 'declaration', 'commissioner'], isNew: true, status: 'Coming Soon'
    },
    {
        id: 'svc008', slug: 'family-law-divorce', icon: Users, title: 'Family Law & Divorce', // Users for family
        description: 'Compassionate support for divorce, child custody, spousal support, adoption, and related matters.',
        category: 'Personal', tags: ['family', 'divorce', 'custody', 'adoption', 'support'], status: 'Available', lastUsed: 'Not used yet'
    },
    {
        id: 'svc009', slug: 'real-estate-law', icon: Landmark, title: 'Real Estate Law', // Used Landmark
        description: 'Navigating property transactions, leasing, zoning, and land use regulations. For buyers and sellers.',
        category: 'Property', tags: ['real estate', 'property', 'conveyancing', 'leasing', 'zoning'], isPopular: true, status: 'Available'
    },
    {
        id: 'svc010', slug: 'financial-legal-services', icon: DollarSign, title: 'Financial & Banking Law', // DollarSign
        description: 'Advice on financial regulations, loan agreements, investment compliance, and fintech law.',
        category: 'Finance', tags: ['finance', 'banking', 'investment', 'fintech', 'regulation'], status: 'Available'
    },
    {
        id: 'svc011', slug: 'startup-legal-package', icon: Car, title: 'Startup Legal Kickstarter', // Car as a vehicle for new ventures
        description: 'Essential legal services for new businesses, from incorporation to initial funding rounds.',
        category: 'Business', tags: ['startup', 'new business', 'incorporation', 'funding'], isNew: true, status: 'Available'
    },
    {
        id: 'svc012', slug: 'estate-planning-wills', icon: GanttChartSquare, title: 'Estate Planning & Wills', // Used GanttChartSquare for planning
        description: 'Secure your legacy with comprehensive estate planning, will drafting, and trust formation.',
        category: 'Personal', tags: ['estate planning', 'wills', 'trusts', 'probate'], status: 'Available'
    },
    {
        id: 'svc013', slug: 'immigration-law-services', icon: Users, title: 'Immigration Law', // Users for people moving
        description: 'Assistance with visa applications, residency permits, citizenship, and immigration appeals.',
        category: 'Immigration', tags: ['immigration', 'visa', 'residency', 'citizenship'], isPopular: true, status: 'Active', lastUsed: '2 weeks ago'
    },
    {
        id: 'svc014', slug: 'dispute-mediation-service', icon: Wrench, title: 'Alternative Dispute Resolution (ADR)', // Wrench for 'fixing' disputes alternatively
        description: 'Facilitating resolutions outside of court through expert mediation and negotiation services.',
        category: 'Disputes', tags: ['adr', 'mediation', 'negotiation', 'settlement'], status: 'Available',
    },
    {
        id: 'svc015', slug: 'archived-legacy-service', icon: Clipboard, title: 'Legacy Data Archival (Old)',
        description: 'Access to archived records from our previous data management system. Read-only access.',
        category: 'Archived', tags: ['legacy', 'archive', 'old records'], status: 'Archived', lastUsed: '1 year ago'
    }
];

type SortOption = 'title-asc' | 'title-desc' | 'popularity' | 'newest' | 'category';

const DashboardServices: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [sortBy, setSortBy] = useState<SortOption>('popularity');
    const [visibleServices, setVisibleServices] = useState<ServiceItem[]>([]);
    const serviceItemRefs = useRef<(HTMLDivElement | null)[]>([]);

    const categories = useMemo(() => {
        const uniqueCategories = ['all', ...new Set(allDashboardServices.map(s => s.category))];
        return uniqueCategories.sort((a, b) => a === 'all' ? -1 : b === 'all' ? 1 : a.localeCompare(b)); // Keep 'all' at top
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
        navigate(`/dashboard/services/${slug}`);
    };

    const getStatusColor = (status?: ServiceItem['status']) => {
        switch (status) {
            case 'Active': return 'bg-green-100 dark:bg-green-500/30 text-green-700 dark:text-green-300';
            case 'Requires Action': return 'bg-yellow-100 dark:bg-yellow-500/30 text-yellow-700 dark:text-yellow-300';
            case 'Coming Soon': return 'bg-sky-100 dark:bg-sky-500/30 text-sky-700 dark:text-sky-300'; // Changed from blue for differentiation
            case 'Archived': return 'bg-gray-200 dark:bg-slate-600/40 text-gray-600 dark:text-slate-400';
            case 'Available':
            default: return 'bg-gray-100 dark:bg-slate-700/50 text-gray-700 dark:text-slate-300';
        }
    };

    return (
        <div className="flex-1 p-4 sm:p-6 md:p-8 bg-gray-100 dark:bg-slate-900 min-h-screen transition-colors duration-300">
            <header className="mb-6 md:mb-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 dark:text-white">
                    Our Legal Services
                </h1>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-1">
                    Browse, filter, and access a wide range of legal services.
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
                            ref={el => serviceItemRefs.current[index] = el}
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
                                _</div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed line-clamp-3">
                                    {service.description}
                                </p>
                                {service.lastUsed && service.status !== 'Archived' && ( // Don't show lastUsed for archived items
                                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                                        <Info size={12} className="inline mr-1" />
                                        Last used: {service.lastUsed}
                                    </p>
                                )}
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-slate-800/60 border-t border-gray-200 dark:border-slate-700/50">
                                <button
                                    onClick={() => handleServiceNavigation(service.slug)}
                                    className="w-full flex items-center justify-center text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 group-hover:bg-purple-100 dark:group-hover:bg-purple-500/10 py-2.5 px-4 rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={service.status === 'Coming Soon' || service.status === 'Archived'} // Disable button for certain statuses
                                >
                                    {service.status === 'Coming Soon' ? 'Coming Soon' : service.status === 'Archived' ? 'View Archive' : 'View Details'}
                                    {service.status !== 'Coming Soon' && service.status !== 'Archived' && <ArrowRight size={16} className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1" />}
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
        </div>
    );
};

export default DashboardServices;