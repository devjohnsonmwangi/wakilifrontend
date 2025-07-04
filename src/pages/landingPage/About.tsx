import { useSelector } from 'react-redux';
// --- FIX 1: Corrected import path ---
import { selectCurrentToken } from '../../features/users/userSlice'; 
import { useGetTeamByRolesQuery } from '../../features/team/teamApi'; // Corrected this path as well for consistency
import Navbar from "../../components/navbar/Navbar";
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
    Video,
    LogIn
} from 'lucide-react';
import backgroundImage from '../../assets/images/landingPage/coverimage3.jpeg';
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
    const token = useSelector(selectCurrentToken);
    const { data: team, isLoading, isError } = useGetTeamByRolesQuery('all', {
        skip: !token,
    });

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
            // --- FIX 2: Added explicit type ': Member' to the parameter ---
            const filteredMembers = teamMembers.filter((member: Member) => {
                return !(member.role === 'admin' && member.full_name.toLowerCase() === 'johnson mwangi');
            });
            const shuffled = shuffle([...filteredMembers]);
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

                <section className="mb-16 md:mb-24">
                    <h2 className={`text-3xl md:text-4xl font-bold text-center mb-12 ${headingColor} tracking-tight`}>
                        Meet Our Team
                    </h2>

                    {token ? (
                        <>
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
                        </>
                    ) : (
                        <div className="text-center p-8 bg-gray-50 dark:bg-slate-800 rounded-xl shadow-md flex flex-col items-center gap-4">
                            <Users className={`w-12 h-12 ${iconColor}`} />
                            <p className="text-lg text-gray-700 dark:text-gray-300">
                                Log in to interact with our legal eagles.
                            </p>
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 bg-purple-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-purple-700 transform hover:scale-105 transition-all duration-300"
                            >
                                <LogIn className="w-5 h-5" />
                                Login Now
                            </Link>
                        </div>
                    )}
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