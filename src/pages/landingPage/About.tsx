import { useGetTeamByRolesQuery } from '../../features/team/teamApi';
import Navbar from "../../components/navbar/Navbar";
// import Footer from './Footer'; // Assuming you might add this later
import {
    Mail, Phone, Loader2, Eye, Target, ShieldCheck, Users, TrendingUp, Lightbulb, Handshake, Sun, Moon,
    Focus,
    Puzzle,
    Zap,
    Accessibility as LucideAccessibility,
    Heart,
    RefreshCw,
    Group,
    PlayCircle,
    Video // New icon for lawyer insights
} from 'lucide-react';
import backgroundImage from '../../assets/images/landingPage/coverimage3.jpeg'; // Ensure this path is correct
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Member {
    id: number;
    full_name: string;
    role: string;
    email: string;
    phone_number: string;
    profile_picture?: string;
}

interface TestimonialVideo {
    id: string; // YouTube video ID
    title: string;
    clientName: string;
    description?: string;
}

interface LawyerInsightVideo {
    id: string; // YouTube video ID
    title: string;
    lawyerName: string;
    topic: string; // e.g., "Corporate Law", "Intellectual Property"
    description: string;
}

const About = () => {
    const { data: team, isLoading, isError } = useGetTeamByRolesQuery('all');
    const [members, setMembers] = useState<Member[]>([]);
    const [shuffleTrigger, setShuffleTrigger] = useState(0);
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

    const shuffle = (array: Member[]) => {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    };

    useEffect(() => {
        if (team) {
            const teamMembers = Array.isArray(team) ? team : team?.users || [];
            const shuffled = shuffle([...teamMembers]);
            setMembers(shuffled);
        }
    }, [team, shuffleTrigger]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setShuffleTrigger(prevTrigger => prevTrigger + 1);
        }, 10000);

        return () => clearInterval(intervalId);
    }, []);

    const iconColor = "text-purple-600 dark:text-purple-400";
    const headingColor = "text-purple-700 dark:text-purple-300";
    const strongTextColor = "text-black-600 dark:text-blue-400";
    const hoverTextColor = "hover:text-purple-500 dark:hover:text-purple-300";

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
        { id: 'dQw4w9WgXcQ', title: 'A Game Changer for My Business!', clientName: 'Sarah L., Entrepreneur', description: "Wakili's team provided invaluable insights that helped us navigate complex contracts. Highly recommended!" },
        { id: 'oHg5SJYRHA0', title: 'Peace of Mind Achieved', clientName: 'Michael B., Homeowner', description: "Facing a property dispute was stressful, but Wakili handled everything with professionalism and care." },
        { id: 'L_LUpnjgPso', title: 'Expert Guidance When I Needed It Most', clientName: 'Aisha K., Freelancer', description: "Their advice on intellectual property was clear, concise, and exactly what I needed to protect my work." },
    ];

    const lawyerInsightVideos: LawyerInsightVideo[] = [
        { id: 'yPYZpwSpKmA', title: 'Understanding Contract Basics', lawyerName: 'Jane Doe, Senior Counsel', topic: 'Contract Law', description: 'A quick overview of essential elements every business owner should know about contracts.' },
        { id: 'sBws8MSXN7A', title: 'Navigating IP for Startups', lawyerName: 'John Smith, IP Specialist', topic: 'Intellectual Property', description: 'Key considerations for protecting your innovative ideas and brand identity from day one.' },
        { id: '3tmd-ClpJxA', title: 'Real Estate Due Diligence Tips', lawyerName: 'Alice Brown, Real Estate Attorney', topic: 'Real Estate Law', description: 'Learn what to look for before purchasing a commercial or residential property.' },
        // Add more lawyer insight videos here
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

            <div
                className="relative py-20 md:py-32 px-4 md:px-6 bg-cover bg-center"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            >
                <div className="absolute inset-0 bg-black/60 dark:bg-black/70"></div>
                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 drop-shadow-lg">
                        Discover <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">Wakili</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 dark:text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto">
                        At <strong className={strongTextColor}>Wakili</strong>, we are revolutionizing legal access. Our mission is to empower you with transparent, client-focused solutions, built on a foundation of trust and innovation.
                    </p>
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

                {/* Lawyer Insights Section */}
                <section className="mb-16 md:mb-24 p-6 md:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-xl">
                    <h2 className={`flex items-center justify-center text-3xl md:text-4xl font-bold text-center mb-12 ${headingColor} tracking-tight`}>
                        <Video className={`w-10 h-10 mr-3 ${iconColor}`} />
                        Expert Legal Insights
                    </h2>
                    {lawyerInsightVideos.length > 0 ? (
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
                    ) : (
                        <p className="text-center text-lg text-gray-600 dark:text-gray-400">
                            Our lawyers are preparing insightful content. Stay tuned for valuable legal tips and discussions!
                        </p>
                    )}
                </section>


                <section className="mb-16 md:mb-24">
                    <h2 className={`text-3xl md:text-4xl font-bold text-center mb-12 ${headingColor} tracking-tight`}>
                        Meet Our  Team
                    </h2>
                    {isLoading ? (
                        <div className="flex flex-col justify-center items-center h-40 w-full text-center">
                            <Loader2 className={`w-10 h-10 animate-spin ${iconColor}`} />
                            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Summoning the legal eagles...</p>
                        </div>
                    ) : isError ? (
                        <p className="text-center text-red-500 dark:text-red-400 text-lg p-6 bg-red-50 dark:bg-red-900/30 rounded-lg">
                            Oops! Failed to load team members. Please check your internet connection and refresh.
                        </p>
                    ) : members.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {members.map((member: Member) => (
                                <div
                                    key={member.id}
                                    className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
                                >
                                    <div className="relative h-40 bg-gradient-to-br from-purple-500 to-indigo-600 dark:from-purple-600 dark:to-indigo-700">
                                        <img
                                            src={member.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.full_name)}&background=random&color=fff&size=128`}
                                            alt={member.full_name}
                                            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-24 h-24 md:w-28 md:h-28 object-cover rounded-full border-4 border-white dark:border-slate-800 shadow-md group-hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="pt-16 pb-6 px-6 text-center">
                                        <h3 className={`text-xl font-bold ${headingColor}`}>{member.full_name}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{member.role}</p>
                                        <div className="space-y-2 text-sm mb-4">
                                            <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300">
                                                <Mail className={`w-4 h-4 flex-shrink-0 ${iconColor}`} />
                                                <a href={`mailto:${member.email}`} className={` ${hoverTextColor} hover:underline break-all transition-colors duration-300`}>{member.email}</a>
                                            </div>
                                            <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300">
                                                <Phone className={`w-4 h-4 flex-shrink-0 ${iconColor}`} />
                                                <a href={`tel:${member.phone_number}`} className={`${hoverTextColor} hover:underline transition-colors duration-300`}>{member.phone_number}</a>
                                            </div>
                                        </div>
                                        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 italic leading-relaxed px-2">
                                            {`With expertise in ${member.role}, ${member.full_name.split(' ')[0]} is a key contributor to our clients' success.`}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-lg text-gray-600 dark:text-gray-400 p-6 bg-gray-50 dark:bg-slate-800 rounded-lg">No team members found. Our roster is currently being updated!</p>
                    )}
                </section>

                <section className="mb-16 md:mb-24 p-6 md:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-xl">
                    <h2 className={`flex items-center justify-center text-3xl md:text-4xl font-bold text-center mb-12 ${headingColor} tracking-tight`}>
                        <PlayCircle className={`w-10 h-10 mr-3 ${iconColor}`} />
                        Hear From Our Valued Clients
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