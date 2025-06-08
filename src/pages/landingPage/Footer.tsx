import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { href: 'https://facebook.com', icon: FaFacebookF, label: 'Facebook' },
    { href: 'https://twitter.com', icon: FaTwitter, label: 'Twitter' },
    { href: 'https://linkedin.com', icon: FaLinkedinIn, label: 'LinkedIn' },
    { href: 'https://instagram.com', icon: FaInstagram, label: 'Instagram' },
  ];

  return (
    
    <footer className="bg-[#081f08] text-gray-300">
      <div className="container mx-auto px-6 py-8 sm:py-12 lg:py-16">

        <div className="hidden sm:block">
          <div className="mb-10 flex flex-col items-center space-y-6 text-center md:flex-row md:justify-between md:space-y-0">
            <Link to="/" className="text-3xl font-bold text-yellow-400 hover:text-yellow-300 transition-colors duration-300">
              Wakili
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Services Section */}
            <div>
              
              <h6 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Our Services</h6>
              <ul className="space-y-2">
                
                <li><Link to="dashboard/ourservices" className="hover:text-yellow-400 transition-colors duration-300">Legal Consultation</Link></li>
                <li><Link to="dashboard/ourservices" className="hover:text-yellow-400 transition-colors duration-300">Case Representation</Link></li>
                <li><Link to="dashboard/ourservices" className="hover:text-yellow-400 transition-colors duration-300">Document Review</Link></li>
                <li><Link to="dashboard/ourservices" className="hover:text-yellow-400 transition-colors duration-300">Contract Drafting</Link></li>
                <li><Link to="dashboard/ourservices" className="hover:text-yellow-400 transition-colors duration-300">Legal Advice</Link></li>
              </ul>
            </div>

            {/* Company Section */}
            <div>
              <h6 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Company</h6>
              <ul className="space-y-2">
                <li><Link to="/about" className="hover:text-yellow-400 transition-colors duration-300">About Us</Link></li>
                <li><Link to="/dashboard" className="hover:text-yellow-400 transition-colors duration-300">Dashboard</Link></li>
                <li><Link to="/services" className="hover:text-yellow-400 transition-colors duration-300">Services</Link></li>
                <li><Link to="/contactus" className="hover:text-yellow-400 transition-colors duration-300">Contact Us</Link></li>
              </ul>
            </div>

            {/* Legal Section */}
            <div>
              <h6 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Legal</h6>
              <ul className="space-y-2">
                <li><Link to="/terms" className="hover:text-yellow-400 transition-colors duration-300">Terms of Use</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-yellow-400 transition-colors duration-300">Privacy Policy</Link></li>
                <li><Link to="/cookies" className="hover:text-yellow-400 transition-colors duration-300">Cookie Policy</Link></li>
              </ul>
            </div>

            {/* Connect With Us Section (Social Media) */}
            <div>
              <h6 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Connect With Us</h6>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    
                    className="text-gray-400 hover:text-yellow-400 transition-colors duration-300"
                  >
                    <social.icon className="h-6 w-6" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

      
        <div className="text-center text-sm sm:mt-10 sm:pt-8 sm:border-t border-green-700"> {/* Tailwind's green-700 is #15803d */}
        
          <p className="text-gray-400">
            © {currentYear} <Link to="/" className="font-semibold text-gray-300 hover:text-yellow-400 transition-colors duration-300">Wakili</Link>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;