import { useGetTeamByRolesQuery } from '../../features/team/teamApi';
import Navbar from "../../components/navbar/Navbar";
//import Footer from './Footer';
import {
    Mail, Phone, Loader2, Eye, Target, ShieldCheck, Users, TrendingUp, Lightbulb, Handshake
} from 'lucide-react';
import backgroundImage from '../../assets/images/landingPage/coverimage3.jpeg';
import { useState, useEffect } from 'react';

interface Member {
    id: number;
    full_name: string;
    role: string;
    email: string;
    phone_number: string;
    profile_picture?: string;
}

const About = () => {
    const { data: team, isLoading, isError } = useGetTeamByRolesQuery('all');
    const [members, setMembers] = useState<Member[]>([]);
    const [shuffleTrigger, setShuffleTrigger] = useState(0);

    // Function to shuffle array (Fisher-Yates shuffle)
    const shuffle = (array: any[]) => {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
        return array;
    };

    // Shuffle members on component mount and when shuffleTrigger changes
    useEffect(() => {
        if (team) {
            const teamMembers = Array.isArray(team) ? team : team?.users || [];
            const shuffled = shuffle([...teamMembers]);
            setMembers(shuffled);
        }
    }, [team, shuffleTrigger]);

    // Set interval for reshuffling team every 2 seconds
    useEffect(() => {
        const intervalId = setInterval(() => {
            setShuffleTrigger(prevTrigger => prevTrigger + 1);
        }, 100000); // 2000 milliseconds = 2 seconds

        // Clean up the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []); // Empty dependency array ensures this effect runs only once (on mount)

    return (
     <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white min-h-screen flex flex-col">
                    <Navbar />
        <div className="relative mt-10 mb-10 px-4 md:px-6 overflow-hidden">
            {/* Background Image with Subtle Animation */}
            <div
                className="absolute inset-0 bg-cover bg-center rounded-xl transition-opacity duration-500"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            ></div>

            {/* Overlaid Gradient for Depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-500 opacity-20"></div>

            {/* Main Content Container */}
            <div className="relative z-10 w-full mx-auto bg-white p-6 md:p-8 rounded-xl shadow-lg text-gray-700">

                {/* Title Section */}
                <h1 className="text-4xl md:text-5xl font-extrabold text-center py-4 md:py-6 italic drop-shadow-md text-purple-600 tracking-tight hover:text-purple-500 transition-colors duration-300">
                    About Wakili App
                </h1>

                {/* Company Introduction */}
                <p className="text-center text-base md:text-lg mb-6 md:mb-8 italic leading-relaxed">
                    At <strong className="text-purple-600 hover:text-purple-500 transition-colors duration-300">Wakili</strong>, we're dedicated to empowering individuals, businesses, and communities with accessible, transparent, and client-focused legal solutions.
                    Our journey began with a simple, yet powerful idea.
                </p>

                {/* Mission & Vision Section */}
                <section className="mt-6 md:mt-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-center py-3 md:py-4 text-purple-600 tracking-tight hover:text-purple-500 transition-colors duration-300">Our Mission & Vision</h2>
                    <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10">
                        <div className="flex items-center gap-3 md:gap-4 transform hover:scale-105 transition-transform duration-300">
                            <Target className="w-8 h-8 md:w-10 md:h-10 text-purple-600" />
                            <p className="text-sm md:text-lg leading-relaxed">
                                <strong className="text-purple-600 hover:text-purple-500 transition-colors duration-300">Our Mission:</strong> Accessible legal services for all, fostering justice and equality.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 md:gap-4 transform hover:scale-105 transition-transform duration-300">
                            <Eye className="w-8 h-8 md:w-10 md:h-10 text-purple-600" />
                            <p className="text-sm md:text-lg leading-relaxed">
                                <strong className="text-purple-600 hover:text-purple-500 transition-colors duration-300">Our Vision:</strong> A future where legal support is simple, accessible, and client-centric.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Core Values Section */}
                <section className="mt-6 md:mt-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-center py-3 md:py-4 text-purple-600 tracking-tight hover:text-purple-500 transition-colors duration-300">Our Core Values</h2>
                    <ul className="list-none space-y-4 md:space-y-6">
                        <li className="flex items-center gap-3 md:gap-4 transform hover:scale-105 transition-transform duration-300">
                            <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
                            <p className="text-sm md:text-lg leading-relaxed"><strong className="text-purple-600 hover:text-purple-500 transition-colors duration-300">Integrity:</strong> We operate with unwavering ethical standards, ensuring honesty and fairness in all our actions.</p>
                        </li>
                        <li className="flex items-center gap-3 md:gap-4 transform hover:scale-105 transition-transform duration-300">
                            <Users className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
                            <p className="text-sm md:text-lg leading-relaxed"><strong className="text-purple-600 hover:text-purple-500 transition-colors duration-300">Client-Centered:</strong> We tailor our legal expertise to meet your unique needs, ensuring personalized and effective support.</p>
                        </li>
                        <li className="flex items-center gap-3 md:gap-4 transform hover:scale-105 transition-transform duration-300">
                            <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
                            <p className="text-sm md:text-lg leading-relaxed"><strong className="text-purple-600 hover:text-purple-500 transition-colors duration-300">Excellence:</strong> We continuously strive to improve and exceed expectations, delivering outstanding legal services.</p>
                        </li>
                        <li className="flex items-center gap-3 md:gap-4 transform hover:scale-105 transition-transform duration-300">
                            <Lightbulb className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
                            <p className="text-sm md:text-lg leading-relaxed"><strong className="text-purple-600 hover:text-purple-500 transition-colors duration-300">Innovation:</strong> We embrace modern technology and creative solutions to provide cutting-edge legal support.</p>
                        </li>
                        <li className="flex items-center gap-3 md:gap-4 transform hover:scale-105 transition-transform duration-300">
                            <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
                            <p className="text-sm md:text-lg leading-relaxed"><strong className="text-purple-600 hover:text-purple-500 transition-colors duration-300">Accountability:</strong> We take responsibility for our actions, fostering transparency and trust in every interaction.</p>
                        </li>
                    </ul>
                </section>

                {/* Meet Our Team Section */}
                <section className="mt-6 md:mt-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-center py-3 md:py-4 text-purple-600 tracking-tight hover:text-purple-500 transition-colors duration-300">Meet Our Team</h2>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-32 md:h-40 w-full">
                            <Loader2 className="w-8 h-8 md:w-10 md:h-10 animate-spin text-purple-600" />
                            <p className="ml-4">Loading team members...</p>
                        </div>
                    ) : isError ? (
                        <p className="text-center text-red-500">Failed to load team members. Please check  your  internet connection and refresh  the page.</p>
                    ) : members.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {members.map((member: Member) => (
                                <div
                                    key={member.id}
                                    className="bg-gray-100 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                                >
                                    <div className="flex justify-center mt-4">
                                        <img
                                            src={member.profile_picture || '/default-image.jpg'}
                                            alt={member.full_name}
                                            className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-full border-4 border-purple-600 transition-transform duration-300 hover:scale-110"
                                        />
                                    </div>

                                    <div className="p-4">
                                        <h3 className="text-lg font-bold text-center text-purple-600">{member.full_name}</h3>
                                        <p className="text-center text-sm text-gray-500">{member.role}</p>

                                        <div className="flex items-center mt-2 gap-2">
                                            <Mail className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                                            <a
                                                href={`mailto:${member.email}`}
                                                className="text-sm hover:text-purple-500 hover:underline break-all transition-colors duration-300"
                                            >
                                                {member.email}
                                            </a>
                                        </div>

                                        <div className="flex items-center mt-2 gap-2">
                                            <Phone className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                                            <a
                                                href={`tel:${member.phone_number}`}
                                                className="text-sm hover:text-purple-500 hover:underline transition-colors duration-300"
                                            >
                                                {member.phone_number}
                                            </a>
                                        </div>

                                        <p className="mt-4 text-sm leading-relaxed">
                                            <span className="font-extrabold text-purple-600">{member.full_name}</span>
                                            <span className="font-bold text-gray-500"> {member.role} </span>
                                            <span className="italic text-purple-400">
                                                {`We highly recommend ${member.full_name} for their exceptional work in ${member.role}.
                                                Their expertise and dedication make them an invaluable asset to our team and to our clients.`}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center">No team members found.</p>
                    )}
                </section>

                {/* Partner With Us Section */}
                <section className="mt-6 md:mt-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-center py-3 md:py-4 text-purple-600 tracking-tight hover:text-purple-500 transition-colors duration-300">Partner With Us</h2>
                    <div className="flex items-center justify-center gap-3 md:gap-4 transform hover:scale-105 transition-transform duration-300">
                        <Handshake className="w-8 h-8 md:w-10 md:h-10 text-purple-600" />
                        <p className="text-center text-sm md:text-lg leading-relaxed">
                            Contact us today and let us be your trusted legal partner, guiding you through the complexities of the legal landscape with confidence.
                        </p>
                    </div>
                </section>

            </div>
        </div>
        
      </div>  
    );
};

export default About;