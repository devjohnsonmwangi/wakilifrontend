import { Link } from 'react-router-dom';
import { RootState } from '../../app/store';
import bgrides from '../../assets/images/auth/logo.jpeg';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Lightbulb, Shield } from 'lucide-react';

const Hero = () => {
    const user = useSelector((state: RootState) => state.user);
    const name = user.user?.full_name;

    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(true);
    }, []);

    return (
        <div
            className="relative hero min-h-screen w-full flex flex-col justify-center items-center overflow-hidden"
            style={{
                backgroundImage: `url(${bgrides})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>

            {/* Content */}
            <div
                className={`relative hero-content text-neutral-content text-center transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'} 
                    w-full sm:w-11/12 md:w-10/12 lg:w-9/12 px-2 sm:px-4`} // Further Reduced Padding on Small Screens
            >
                <div
                    className={`transform transition-transform duration-1000 ${loaded ? 'translate-y-0' : '-translate-y-10'}`}
                >

                    {/* Heading with marquee animation */}
                    <h1 className="mb-2 md:mb-4 mt-4 md:mt-8 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-dark-green max-w-full break-words">  {/* Added break-words */}
                        <div className="inline-block whitespace-nowrap animate-marquee">
                            Welcome to Wakili Legal Services<span>{name ? `, ${name}` : ''}</span>
                        </div>
                    </h1>

                    {/* Call-to-action Subtext */}
                    <p className="mb-2 md:mb-4 text-sm sm:text-base md:text-lg font-medium text-soft-yellow animate-twinkle max-w-full leading-relaxed break-words"> {/* Added break-words */}
                        <Lightbulb className="inline-block mr-2 text-xl sm:text-2xl text-yellow-500 align-middle" />
                        Access expert legal advice, from contract reviews to legal representation, we provide trusted solutions for your legal needs.
                    </p>

                    <p className="mb-2 md:mb-4 text-sm sm:text-base md:text-lg font-medium text-soft-yellow animate-twinkle max-w-full leading-relaxed break-words"> {/* Added break-words */}
                        <Lightbulb className="inline-block mr-2 text-xl sm:text-2xl text-soft-yellow align-middle" />
                        Whether you're dealing with personal matters, business contracts, or legal disputes, our team is here to ensure your rights are protected.
                    </p>

                    <p className="mb-2 md:mb-4 text-sm sm:text-base md:text-lg font-medium text-soft-yellow animate-twinkle max-w-full leading-relaxed break-words"> {/* Added break-words */}
                        <Shield className="inline-block mr-2 text-xl sm:text-2xl text-green-500 align-middle" />
                        Join us at Wakili for legal services that give you peace of mind and a clear path forward.
                    </p>

                    {/* Articles of the Constitution */}
                    <div className="bg-black bg-opacity-60 p-2 sm:p-4 md:p-6 rounded-lg w-full sm:w-11/12 md:w-10/12 lg:w-9/12 mt-2 md:mt-4"> {/* Reduced Padding and Margins */}
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">Articles of the Constitution</h2>

                        <div className="space-y-2 md:space-y-3"> {/* Reduced Spacing */}
                            <div className="text-sm sm:text-base">
                                <h3 className="font-semibold text-white"><Lightbulb className="inline-block mr-2 text-lg align-middle" />Article 1: Right to Legal Representation</h3>
                                <p className="text-gray-300 leading-relaxed break-words">Every individual has the right to competent legal representation, ensuring fair treatment under the law.</p> {/* Added break-words */}
                            </div>

                            <div className="text-sm sm:text-base">
                                <h3 className="font-semibold text-white"><Lightbulb className="inline-block mr-2 text-lg align-middle" />Article 2: Right to a Fair Trial</h3>
                                <p className="text-gray-300 leading-relaxed break-words">All individuals are entitled to a fair and public trial without undue delay, by an independent and impartial tribunal.</p> {/* Added break-words */}
                            </div>

                            <div className="text-sm sm:text-base">
                                <h3 className="font-semibold text-white"><Shield className="inline-block mr-2 text-lg align-middle" />Article 3: Protection from Unlawful Detention</h3>
                                <p className="text-gray-300 leading-relaxed break-words">No person shall be subject to arbitrary arrest or detention. Every individual has the right to liberty and security of person.</p> {/* Added break-words */}
                            </div>
                        </div>
                    </div>

                    {/* Call-to-Action Button */}
                    <div className="mt-2 md:mt-3"> {/* Reduced Margin */}
                        <Link
                            to="/register"
                            className="px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-button-gradient-start to-button-gradient-end text-white rounded-lg text-sm sm:text-lg font-bold hover:scale-105 transition-transform duration-300 inline-block"
                        >
                            Register To Explore Our Legal Services
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Hero;