// --- FIX 1: Corrected import path ---
import Navbar from "../../components/navbar/Navbar";
import {
    Eye, Target, ShieldCheck, Users, TrendingUp, Lightbulb, Handshake, Sun, Moon,
    Focus,
    Puzzle,
    Zap,
    Accessibility as LucideAccessibility,
    Heart,
    RefreshCw,
    Group,
    PlayCircle,
    Video
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface TestimonialVideo {
    id: string;
    title: string;
    clientName: string;
    description?: string;
}

interface LawyerInsightVideo {
    id: string;
    title: string;
    lawyerName: string;
    topic: string;
    description: string;
}

const About = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const iconColor = "text-purple-600 dark:text-purple-400";
    const headingColor = "text-purple-700 dark:text-purple-300";

    const coreValues = [
        { icon: ShieldCheck, title: "Integrity", text: "Operating with unwavering ethical standards, ensuring honesty and fairness in all our actions." },
        { icon: Users, title: "Client-Centered", text: "Tailoring our legal expertise to meet your unique needs, ensuring personalized and effective support." },
        { icon: TrendingUp, title: "Excellence", text: "Continuously striving to improve and exceed expectations, delivering outstanding legal services." },
        { icon: Lightbulb, title: "Innovation", text: "Embracing modern technology and creative solutions to provide cutting-edge legal support." },
        { icon: Handshake, title: "Accountability", text: "Taking responsibility for our actions, fostering transparency and trust in every interaction." },
        { icon: Focus, title: "Transparency", text: "Maintaining open communication and clear processes, ensuring you are informed every step of the way." },
        { icon: Puzzle, title: "Collaboration", text: "Working together with our clients and within our team to achieve the best possible outcomes." },
        { icon: Zap, title: "Empowerment", text: "Providing you with the knowledge and tools to make informed legal decisions confidently." },
        { icon: LucideAccessibility, title: "Accessibility", text: "Striving to make legal services available and understandable to everyone, regardless of background." },
        { icon: Heart, title: "Respect", text: "Treating every client and case with dignity, empathy, and the utmost professionalism." },
        { icon: RefreshCw, title: "Adaptability", text: "Evolving with the legal landscape and client needs, embracing change to provide relevant solutions." },
        { icon: Group, title: "Community", text: "Building strong relationships and contributing positively to the communities we serve." }
    ];

    const testimonialVideos: TestimonialVideo[] = [
        { id: 's7upA30yZBs', title: 'Develop Yourself  every day!', clientName: 'To  all of  us', description: " Highly recommended!" },
        { id: 'Gb6RK32q4Qg', title: 'Peace of Mind Achieved', clientName: 'M2S', description: "Facing life   with  courage." },
        { id: 'fp85zRg2cwg', title: 'History', clientName: 'Pres Oboma', description: "Usa  and  British parliament  History" },
    ];

    const lawyerInsightVideos: LawyerInsightVideo[] = [
        { id: 'tOqUC5Yb3g4', title: 'Understanding Law Basics', lawyerName: ' Prof Githu Muigai, Senior Counsel', topic: 'Discussion on Law', description: 'A quick overview of essential elements of  Law.' },
        { id: '29uaoq0UCKw', title: 'PLO  Submission on  African leadership', lawyerName: 'John Smith, PLO PanAfricanist', topic: 'Intellectual leadership', description: 'Key considerations for protecting Africa innovative ideas and History of  Africa.' },
        { id: 'W0qEq8sy-Ws', title: 'Theory  in Law', lawyerName: 'Prof Githu Muigai, Senior Counsel', topic: 'Decerning Theory In Law', description: 'BBI  in   court  of  appeal,   Many  Prof   titles  were  cited.' },
    ];


    return (
        <div className="bg-gray-100 dark:bg-slate-900 text-gray-800 dark:text-gray-200 min-h-screen transition-colors duration-300">
            <Navbar />
            <button
                onClick={toggleTheme}
                className="fixed top-20 right-5 z-50 p-2 bg-gray-200 dark:bg-gray-700 rounded-full shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle theme"
            >
                {theme === 'light' ? <Moon className="w-5 h-5 text-purple-600" /> : <Sun className="w-5 h-5 text-yellow-400" />}
            </button>

            <div className="relative py-16 md:py-24 px-4 md:px-6 bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 text-white">
                <div className="max-w-5xl mx-auto text-center">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4">
                        Legal Help for Everyday Kenyan Problems
                    </h1>
                    <p className="text-lg md:text-xl text-purple-100 mb-6 leading-relaxed max-w-3xl mx-auto">
                        Wakili helps you solve real legal issues fast — from rent disputes and land ownership problems to workplace termination, debt recovery, divorce, child custody, and business contracts. Get practical legal advice, document drafting, and court representation from verified Kenyan advocates.
                    </p>
                    <p className="text-base md:text-lg text-purple-100/90 mb-8 max-w-3xl mx-auto">
                        Search intent we solve daily: <span className="font-semibold">how to file for divorce in Kenya</span>, <span className="font-semibold">how to recover unpaid debt</span>, <span className="font-semibold">how to resolve land disputes</span>, <span className="font-semibold">how to handle unfair dismissal</span>, and <span className="font-semibold">how to review a contract before signing</span>.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 text-sm font-semibold">
                        {['Legal Advice', 'Contract Review', 'Land Disputes', 'Family Law', 'Employment Law', 'Debt Recovery', 'Tenant Rights', 'Business Registration'].map((item) => (
                            <span key={item} className="px-3 py-1.5 rounded-full bg-white/15 border border-white/20">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">

                 <section className="mb-16 md:mb-24 p-6 md:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-xl">
                    <h2 className={`text-3xl md:text-4xl font-bold text-center mb-10 ${headingColor} tracking-tight`}>
                        Our Purpose
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
                        <div className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-slate-700/50 rounded-lg hover:shadow-lg transition-shadow duration-300">
                            <Target className={`w-12 h-12 mb-4 ${iconColor}`} />
                            <h3 className={`text-2xl font-semibold mb-2 ${headingColor}`}>Our Mission</h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                To provide universally accessible legal services, championing justice, equality, and empowerment for every individual and business.
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-slate-700/50 rounded-lg hover:shadow-lg transition-shadow duration-300">
                            <Eye className={`w-12 h-12 mb-4 ${iconColor}`} />
                            <h3 className={`text-2xl font-semibold mb-2 ${headingColor}`}>Our Vision</h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                To forge a future where legal support is inherently simple, intuitively accessible, and profoundly client-centric for all.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mb-16 md:mb-24 p-6 md:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-xl">
                    <h2 className={`text-3xl md:text-4xl font-bold text-center mb-12 ${headingColor} tracking-tight`}>
                        Our Core Values
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                        {coreValues.map((value, index) => (
                            <div key={index} className="p-6 bg-gray-50 dark:bg-slate-700/50 rounded-lg hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
                                <value.icon className={`w-10 h-10 mb-3 ${iconColor}`} />
                                <h3 className={`text-xl font-semibold mb-2 ${headingColor}`}>{value.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{value.text}</p>
                            </div>
                        ))}
                    </div>
                </section>
                
                {/* --- FIX 3: ADDED THE MISSING JSX SECTION TO USE THE VARIABLE --- */}
                <section className="mb-16 md:mb-24 p-6 md:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-xl">
                    <h2 className={`flex items-center justify-center text-3xl md:text-4xl font-bold text-center mb-12 ${headingColor} tracking-tight`}>
                        <Video className={`w-10 h-10 mr-3 ${iconColor}`} />
                        Expert Legal Insights
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {lawyerInsightVideos.map(video => (
                            <div key={video.id} className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
                                <div className="mb-4 rounded-md overflow-hidden">
                                    <iframe
                                        className="w-full aspect-video"
                                        src={`https://www.youtube.com/embed/${video.id}`}
                                        title={video.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                                <h3 className={`text-lg font-semibold ${headingColor} mb-1`}>{video.title}</h3>
                                <p className="text-sm font-medium text-purple-500 dark:text-purple-300 mb-1">{video.lawyerName}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 italic">Topic: {video.topic}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{video.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mb-16 md:mb-24 p-6 md:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-xl">
                    <h2 className={`text-3xl md:text-4xl font-bold text-center mb-4 ${headingColor} tracking-tight`}>
                        How Wakili Helps You Win Your Case
                    </h2>
                    <p className="text-center text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
                        We simplify complex Kenyan legal processes with expert guidance, verified lawyers, and fast turnaround. Whether you need a demand letter, legal opinion, or court representation, we help you move from confusion to resolution.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                title: 'Clear Legal Guidance',
                                text: 'Step-by-step explanations of your rights under Kenyan law, timelines, and what to expect.'
                            },
                            {
                                title: 'Right Lawyer Match',
                                text: 'We match you with specialized lawyers in family, land, employment, business, or criminal law.'
                            },
                            {
                                title: 'Document Drafting',
                                text: 'Demand letters, affidavits, tenancy notices, contracts, wills, and legal agreements.'
                            },
                            {
                                title: 'Court Representation',
                                text: 'Vetted advocates to represent you in Magistrate, High Court, Employment, or ELC.'
                            }
                        ].map((item, index) => (
                            <div key={index} className="bg-gray-50 dark:bg-slate-700/50 p-6 rounded-lg border border-slate-200 dark:border-slate-600 hover:shadow-lg transition-shadow">
                                <h3 className={`text-lg font-semibold mb-2 ${headingColor}`}>{item.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{item.text}</p>
                                <ul className="mt-3 text-xs text-gray-500 dark:text-gray-400 space-y-1">
                                    <li>• Fast response within 2 hours</li>
                                    <li>• Transparent pricing upfront</li>
                                    <li>• Verified LSK advocates</li>
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-gray-50 dark:bg-slate-700/50 p-6 rounded-lg border border-slate-200 dark:border-slate-600">
                            <h3 className={`text-xl font-semibold mb-3 ${headingColor}`}>
                                What You Get in the First 24 Hours
                            </h3>
                            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                                <li>• A legal intake call to understand your problem and urgency</li>
                                <li>• A lawyer match based on specialization and location</li>
                                <li>• Clear next steps: documents needed, timelines, and expected costs</li>
                                <li>• Optional draft documents (demand letter, notice, or legal opinion)</li>
                            </ul>
                        </div>
                        <div className="bg-gray-50 dark:bg-slate-700/50 p-6 rounded-lg border border-slate-200 dark:border-slate-600">
                            <h3 className={`text-xl font-semibold mb-3 ${headingColor}`}>
                                Common Outcomes We Deliver
                            </h3>
                            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                                <li>• Settlement agreements and dispute resolution without court</li>
                                <li>• Court filings prepared correctly to avoid delays</li>
                                <li>• Enforceable contracts and legal documents</li>
                                <li>• Strong representation in ELC, Employment, and Magistrate Courts</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                title: 'Documents We Draft Daily',
                                items: ['Demand Letters', 'Employment Contracts', 'Lease Agreements', 'Affidavits', 'NDAs']
                            },
                            {
                                title: 'Cases We Handle Often',
                                items: ['Unfair Dismissal', 'Land Disputes', 'Debt Recovery', 'Divorce & Custody', 'Tenant Rights']
                            },
                            {
                                title: 'How Fees Work',
                                items: ['Clear fixed-price quotes', 'No hidden charges', 'Pay per service', 'Flexible packages for businesses']
                            }
                        ].map((block, index) => (
                            <div key={index} className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-600">
                                <h4 className={`text-lg font-semibold mb-3 ${headingColor}`}>{block.title}</h4>
                                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                    {block.items.map((item) => (
                                        <li key={item}>• {item}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
                
                <section className="mb-16 md:mb-24 p-6 md:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-xl">
                    <h2 className={`flex items-center justify-center text-3xl md:text-4xl font-bold text-center mb-12 ${headingColor} tracking-tight`}>
                        <PlayCircle className={`w-10 h-10 mr-3 ${iconColor}`} />
                        Hear From Our Valued Leaders And Speaches
                    </h2>
                    {testimonialVideos.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {testimonialVideos.map(video => (
                                <div key={video.id} className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
                                    <div className="mb-4 rounded-md overflow-hidden">
                                        <iframe
                                            className="w-full aspect-video"
                                            src={`https://www.youtube.com/embed/${video.id}`}
                                            title={video.title}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                    <h3 className={`text-lg font-semibold ${headingColor} mb-1`}>{video.title}</h3>
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">- {video.clientName}</p>
                                    {video.description && (
                                         <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{video.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-lg text-gray-600 dark:text-gray-400">
                            We're currently gathering inspiring stories from our clients. Check back soon!
                        </p>
                    )}
                </section>
                <section className="py-12 md:py-16 bg-gradient-to-r from-purple-600 to-indigo-700 dark:from-purple-700 dark:to-indigo-800 text-white rounded-xl shadow-2xl">
                    <div className="max-w-3xl mx-auto text-center px-6">
                        <Handshake className="w-16 h-16 mx-auto mb-6 text-purple-300 dark:text-purple-200" />
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Ready to Partner With Us?
                        </h2>
                        <p className="text-lg md:text-xl mb-8 leading-relaxed text-purple-100 dark:text-purple-200">
                            Let us be your trusted legal partner. Contact us today to navigate the complexities of the legal landscape with confidence and clarity.
                        </p>
                        <Link
                            to="/contactus"
                            className="inline-block bg-white text-purple-700 dark:bg-purple-200 dark:text-purple-800 font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-purple-300 transform hover:scale-105 transition-all duration-300 text-lg"
                        >
                            Get in Touch
                        </Link>
                    </div>
                </section>
            </div>
            {/* <Footer /> */}
        </div>
    );
};

export default About;