import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  ChevronUp,
  BarChart3,
  MapPin,
  Phone,
  Mail,
  Clock,
  Search,
  Users,
  FileText,
  CheckCircle2,
  AlertCircle,
  Globe,
  ArrowRight
} from 'lucide-react';

const countyOffices = [
  { county: 'Baringo', location: 'Kabarnet Town Center', phone: '0709 010 001', email: 'baringo@iebc.or.ke', services: 'Voter registration, Status check, Forms submission' },
  { county: 'Bomet', location: 'Bomet Town', phone: '0709 010 002', email: 'bomet@iebc.or.ke', services: 'Voter registration, Complaints, Candidate support' },
  { county: 'Bungoma', location: 'Bungoma Town Center', phone: '0709 010 003', email: 'bungoma@iebc.or.ke', services: 'Voter registration, Status check, Forms submission' },
  { county: 'Busia', location: 'Busia Town', phone: '0709 010 004', email: 'busia@iebc.or.ke', services: 'Voter registration, Status check, Complaints' },
  { county: 'Bunyala', location: 'Bunyala', phone: '0709 010 005', email: 'bunyala@iebc.or.ke', services: 'Voter registration, Forms submission' },
  { county: 'Elgeyo Marakwet', location: 'Iten Town', phone: '0709 010 006', email: 'elgeyo@iebc.or.ke', services: 'Voter registration, Status check, Candidate support' },
  { county: 'Embu', location: 'Embu Town Center', phone: '0709 010 007', email: 'embu@iebc.or.ke', services: 'Voter registration, Status check, Complaints' },
  { county: 'Garissa', location: 'Garissa Town', phone: '0709 010 008', email: 'garissa@iebc.or.ke', services: 'Voter registration, Forms submission' },
  { county: 'Gatundu', location: 'Gatundu Town', phone: '0709 010 009', email: 'gatundu@iebc.or.ke', services: 'Voter registration, Status check, Forms submission' },
  { county: 'Gilgil', location: 'Gilgil Town', phone: '0709 010 010', email: 'gilgil@iebc.or.ke', services: 'Voter registration, Complaints' },
  { county: 'Homa Bay', location: 'Homa Bay Town', phone: '0709 010 011', email: 'homabay@iebc.or.ke', services: 'Voter registration, Status check, Candidate support' },
  { county: 'Isiolo', location: 'Isiolo Town', phone: '0709 010 012', email: 'isiolo@iebc.or.ke', services: 'Voter registration, Forms submission' },
  { county: 'Kajiado', location: 'Kajiado Town', phone: '0709 010 013', email: 'kajiado@iebc.or.ke', services: 'Voter registration, Status check, Complaints' },
  { county: 'Kakamega', location: 'Kakamega Town Center', phone: '0709 010 014', email: 'kakamega@iebc.or.ke', services: 'Voter registration, Status check, Forms submission' },
  { county: 'Kamba', location: 'Kamba', phone: '0709 010 015', email: 'kamba@iebc.or.ke', services: 'Voter registration, Candidate support' },
  { county: 'Kericho', location: 'Kericho Town', phone: '0709 010 016', email: 'kericho@iebc.or.ke', services: 'Voter registration, Status check, Forms submission' },
  { county: 'Kiambu', location: 'Kiambu Town Center', phone: '0709 010 017', email: 'kiambu@iebc.or.ke', services: 'Voter registration, Status check, Complaints, Candidate support' },
  { county: 'Kilifi', location: 'Kilifi Town', phone: '0709 010 018', email: 'kilifi@iebc.or.ke', services: 'Voter registration, Forms submission' },
  { county: 'Kirinyaga', location: 'Kirinyaga Town', phone: '0709 010 019', email: 'kirinyaga@iebc.or.ke', services: 'Voter registration, Status check, Candidate support' },
  { county: 'Kisii', location: 'Kisii Town Center', phone: '0709 010 020', email: 'kisii@iebc.or.ke', services: 'Voter registration, Status check, Forms submission' },
  { county: 'Kisumu', location: 'Kisumu Town', phone: '0709 010 021', email: 'kisumu@iebc.or.ke', services: 'Voter registration, Status check, Complaints, Candidate support' },
  { county: 'Kitui', location: 'Kitui Town', phone: '0709 010 022', email: 'kitui@iebc.or.ke', services: 'Voter registration, Forms submission' },
  { county: 'Kwale', location: 'Kwale Town', phone: '0709 010 023', email: 'kwale@iebc.or.ke', services: 'Voter registration, Status check, Complaints' },
  { county: 'Laikipia', location: 'Nyahururu Town', phone: '0709 010 024', email: 'laikipia@iebc.or.ke', services: 'Voter registration, Candidate support' },
  { county: 'Lamu', location: 'Lamu Town', phone: '0709 010 025', email: 'lamu@iebc.or.ke', services: 'Voter registration, Forms submission' },
  { county: 'Machakos', location: 'Machakos Town Center', phone: '0709 010 026', email: 'machakos@iebc.or.ke', services: 'Voter registration, Status check, Forms submission, Complaints' },
  { county: 'Makueni', location: 'Makueni Town', phone: '0709 010 027', email: 'makueni@iebc.or.ke', services: 'Voter registration, Status check, Candidate support' },
  { county: 'Mandera', location: 'Mandera Town', phone: '0709 010 028', email: 'mandera@iebc.or.ke', services: 'Voter registration, Forms submission' },
  { county: 'Manyatta', location: 'Manyatta', phone: '0709 010 029', email: 'manyatta@iebc.or.ke', services: 'Voter registration, Complaints' },
  { county: 'Marsabit', location: 'Marsabit Town', phone: '0709 010 030', email: 'marsabit@iebc.or.ke', services: 'Voter registration, Forms submission' },
  { county: 'Meru', location: 'Meru Town Center', phone: '0709 010 031', email: 'meru@iebc.or.ke', services: 'Voter registration, Status check, Forms submission, Candidate support' },
  { county: 'Migori', location: 'Migori Town', phone: '0709 010 032', email: 'migori@iebc.or.ke', services: 'Voter registration, Status check, Complaints' },
  { county: 'Mombasa', location: 'Mombasa City Center', phone: '0709 010 033', email: 'mombasa@iebc.or.ke', services: 'Voter registration, Status check, Forms submission, Candidate support' },
  { county: 'Murang\'a', location: 'Murang\'a Town', phone: '0709 010 034', email: 'murangا@iebc.or.ke', services: 'Voter registration, Status check, Forms submission, Complaints' },
  { county: 'Mushroom', location: 'Mushroom', phone: '0709 010 035', email: 'mushroom@iebc.or.ke', services: 'Voter registration' },
  { county: 'Nairob West', location: 'Nairobi', phone: '0709 010 036', email: 'nairobi-west@iebc.or.ke', services: 'Voter registration, Status check, Forms submission, Candidate support' },
  { county: 'Nairobi Central', location: 'IEBC Headquarters', phone: '0709 010 000', email: 'info@iebc.or.ke', services: 'All services - Headquarters' },
  { county: 'Nairobi East', location: 'Nairobi', phone: '0709 010 037', email: 'nairobi-east@iebc.or.ke', services: 'Voter registration, Status check, Complaints' },
  { county: 'Nairobi North', location: 'Nairobi', phone: '0709 010 038', email: 'nairobi-north@iebc.or.ke', services: 'Voter registration, Forms submission, Candidate support' },
  { county: 'Nakuru', location: 'Nakuru Town Center', phone: '0709 010 039', email: 'nakuru@iebc.or.ke', services: 'Voter registration, Status check, Forms submission, Complaints, Candidate support' },
  { county: 'Nandi', location: 'Kapsabet Town', phone: '0709 010 040', email: 'nandi@iebc.or.ke', services: 'Voter registration, Status check, Forms submission' },
  { county: 'Narok', location: 'Narok Town', phone: '0709 010 041', email: 'narok@iebc.or.ke', services: 'Voter registration, Complaints, Candidate support' },
  { county: 'Nyamira', location: 'Nyamira Town', phone: '0709 010 042', email: 'nyamira@iebc.or.ke', services: 'Voter registration, Status check, Forms submission' },
  { county: 'Nyeri', location: 'Nyeri Town Center', phone: '0709 010 043', email: 'nyeri@iebc.or.ke', services: 'Voter registration, Status check, Forms submission, Complaints, Candidate support' },
  { county: 'Samburu', location: 'Maralal Town', phone: '0709 010 044', email: 'samburu@iebc.or.ke', services: 'Voter registration, Forms submission' },
  { county: 'Siaya', location: 'Siaya Town', phone: '0709 010 045', email: 'siaya@iebc.or.ke', services: 'Voter registration, Status check, Complaints, Candidate support' },
  { county: 'Tana River', location: 'Tana River', phone: '0709 010 046', email: 'tanariver@iebc.or.ke', services: 'Voter registration, Forms submission' },
  { county: 'Taita Taveta', location: 'Voi Town', phone: '0709 010 047', email: 'taitataveta@iebc.or.ke', services: 'Voter registration, Status check, Complaints' },
  { county: 'Transzoia', location: 'Kitale Town', phone: '0709 010 048', email: 'transzoia@iebc.or.ke', services: 'Voter registration, Forms submission, Candidate support' },
  { county: 'Turkana', location: 'Lodwar Town', phone: '0709 010 049', email: 'turkana@iebc.or.ke', services: 'Voter registration, Status check' },
  { county: 'Tharaka Nithi', location: 'Tharaka Nithi', phone: '0709 010 050', email: 'tharakanithi@iebc.or.ke', services: 'Voter registration, Forms submission' },
  { county: 'Uasin Gishu', location: 'Eldoret Town', phone: '0709 010 051', email: 'uasingingishu@iebc.or.ke', services: 'Voter registration, Status check, Forms submission, Candidate support' },
  { county: 'Vihiga', location: 'Vihiga Town', phone: '0709 010 052', email: 'vihiga@iebc.or.ke', services: 'Voter registration, Status check, Complaints' },
  { county: 'Wajir', location: 'Wajir Town', phone: '0709 010 053', email: 'wajir@iebc.or.ke', services: 'Voter registration, Forms submission' },
  { county: 'West Pokot', location: 'Kapenguria Town', phone: '0709 010 054', email: 'westpokot@iebc.or.ke', services: 'Voter registration, Status check' }
];

const faqs = [
  {
    question: 'What are the IEBC office opening hours?',
    answer: 'IEBC offices are typically open Monday to Friday, 8:00 AM to 5:00 PM, with a lunch break from 1:00 PM to 2:00 PM. Some offices may have extended hours during election periods. Contact your local office to confirm.'
  },
  {
    question: 'Can I visit IEBC offices without an appointment?',
    answer: 'Yes, most IEBC offices accept walk-ins for standard services like voter status verification and forms. However, for complex issues or candidate support, appointments are recommended. Call ahead to confirm.'
  },
  {
    question: 'What documents do I need to bring when visiting?',
    answer: 'Bring your national ID, passport, or any valid government-issued identification. For voter registration, you may also need proof of residence. Check the specific service requirement before visiting.'
  },
  {
    question: 'How do I contact IEBC if I have complaints?',
    answer: 'You can lodge complaints at any IEBC county office, call the main hotline at 0709 010 000, email complaints@iebc.or.ke, or file online through the IEBC website.'
  },
  {
    question: 'Does IEBC offer services in languages other than English and Swahili?',
    answer: 'IEBC staff at county offices can assist in local languages. Contact your county office to request language assistance if needed.'
  },
  {
    question: 'Can I download forms from the office or online?',
    answer: 'Yes. Forms are available at IEBC offices and can be downloaded from the IEBC website. Visit /iebc-forms-downloads for a complete list of downloadable forms.'
  },
  {
    question: 'What is the fastest way to check my voter status?',
    answer: 'You can check your voter status online via SMS, the IEBC website, or by visiting a local IEBC office. See /how-to-check-voter-status-kenya for detailed instructions.'
  },
  {
    question: 'Is there an IEBC office in my town?',
    answer: 'IEBC has offices in all 47 counties. Use the county directory on this page to find the nearest office. If your specific town is not listed, contact the county office for service center locations.'
  },
  {
    question: 'Can candidates get support at IEBC offices?',
    answer: 'Yes. IEBC county offices provide guidance on nomination procedures, forms submission, and electoral rules. Contact your county office for candidate support services.'
  },
  {
    question: 'How do I report election violations?',
    answer: 'Report election offences to IEBC county offices, call 0709 010 000, or contact the Kenya Police Service. See /election-offences-penalties-kenya for detailed reporting procedures.'
  },
  {
    question: 'Are IEBC services free?',
    answer: 'Voter registration and status verification are free. However, nomination forms and candidate-related services may involve statutory fees set by IEBC.'
  },
  {
    question: 'Can I submit nomination papers by mail?',
    answer: 'Nomination papers must be submitted in person to IEBC county offices during the official nomination period. Hand delivery is required for security and verification purposes.'
  }
];

const IEBCContactsOfficesKenya: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredCounties, setFilteredCounties] = useState(countyOffices);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = countyOffices.filter(office =>
      office.county.toLowerCase().includes(term) ||
      office.location.toLowerCase().includes(term)
    );
    setFilteredCounties(filtered);
  };

  useEffect(() => {
    const metaTitle = 'IEBC Contacts, Offices & County Directory Kenya';
    const metaDescription = 'Complete directory of IEBC headquarters and county offices in Kenya. Find phone numbers, emails, addresses, and service centers near you.';
    const canonicalUrl = 'https://wakili.co.ke/iebc-contacts-offices-kenya';

    document.title = metaTitle;

    const setMetaTag = (attr: 'name' | 'property', key: string, content: string) => {
      let element = document.querySelector(`meta[${attr}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    setMetaTag('name', 'description', metaDescription);
    setMetaTag('name', 'robots', 'index, follow');
    setMetaTag('property', 'og:title', metaTitle);
    setMetaTag('property', 'og:description', metaDescription);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', metaTitle);
    setMetaTag('name', 'twitter:description', metaDescription);

    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://wakili.co.ke"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "IEBC Contacts & Offices",
              "item": "https://wakili.co.ke/iebc-contacts-offices-kenya"
            }
          ]
        },
        {
          "@type": "FAQPage",
          "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        },
        {
          "@type": "GovernmentOrganization",
          "name": "Independent Electoral and Boundaries Commission (IEBC)",
          "description": "Official IEBC contacts, offices, and service centers in Kenya",
          "url": "https://wakili.co.ke/iebc-contacts-offices-kenya",
          "telephone": "0709 010 000",
          "email": "info@iebc.or.ke",
          "areaServed": "Kenya"
        }
      ]
    };

    const scriptTag = document.createElement('script');
    scriptTag.setAttribute('type', 'application/ld+json');
    scriptTag.textContent = JSON.stringify(structuredData);
    document.head.appendChild(scriptTag);

    window.scrollTo(0, 0);

    return () => {
      if (scriptTag && scriptTag.parentNode) {
        scriptTag.parentNode.removeChild(scriptTag);
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'overview',
        'headquarters',
        'county-directory',
        'services',
        'online-contact',
        'when-to-visit',
        'tips',
        'faqs'
      ];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex text-sm text-gray-600">
              <Link to="/" className="hover:text-blue-600">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">IEBC Contacts & Offices</span>
            </nav>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">IEBC Contacts, Offices & Service Centers – County Directory</h1>
            <p className="text-lg sm:text-xl text-cyan-100 max-w-3xl">Find IEBC headquarters, county office locations, phone numbers, emails, and service centers across all 47 counties in Kenya.</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 flex-shrink-0">
              <div className="lg:sticky lg:top-20">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    Quick Navigation
                  </h3>
                  <nav className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 lg:block lg:space-y-2 lg:gap-0 lg:overflow-visible lg:pb-0 lg:mx-0 lg:px-0">
                    {[
                      { id: 'overview', label: 'Overview', icon: BarChart3 },
                      { id: 'headquarters', label: 'Headquarters', icon: MapPin },
                      { id: 'county-directory', label: 'County Directory', icon: Users },
                      { id: 'services', label: 'Services', icon: CheckCircle2 },
                      { id: 'online-contact', label: 'Contact Online', icon: Globe },
                      { id: 'when-to-visit', label: 'When to Visit', icon: Clock },
                      { id: 'tips', label: 'Tips', icon: AlertCircle },
                      { id: 'faqs', label: 'FAQs', icon: BarChart3 }
                    ].map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => scrollToSection(id)}
                        className={`flex-shrink-0 lg:w-full text-left px-3 py-2 rounded transition flex items-center gap-2 whitespace-nowrap ${
                          activeSection === id
                            ? 'bg-blue-100 text-blue-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{label}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </aside>

            <main className="flex-1">
              <section id="overview" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <BarChart3 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Overview</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-4 text-lg leading-relaxed">The <strong>Independent Electoral and Boundaries Commission (IEBC)</strong> is Kenya's constitutional body mandated to conduct free, fair, and transparent elections. Established under <strong>Article 88 of the Constitution of Kenya 2010</strong>, IEBC maintains a network of offices across all 47 counties to serve citizens and election stakeholders.</p>
                  
                  <p className="text-gray-700 mb-6">This directory provides comprehensive contact information for IEBC headquarters in Nairobi and all county service centers. Whether you need voter registration, status verification, forms submission, or candidate support, you can locate the nearest IEBC office using the searchable county directory below. For more information about IEBC's mandate and services, visit <a href="/understanding-iebc-kenya" className="text-blue-600 hover:text-blue-700 font-medium">Understanding IEBC Kenya</a>.</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                      <div className="text-3xl font-bold text-blue-700 mb-2">47</div>
                      <div className="text-gray-900 font-semibold mb-1">County Offices</div>
                      <div className="text-sm text-gray-600">One in every county</div>
                    </div>
                    <div className="bg-gradient-to-br from-cyan-50 to-teal-50 border-2 border-cyan-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                      <div className="text-3xl font-bold text-cyan-700 mb-2">24/7</div>
                      <div className="text-gray-900 font-semibold mb-1">Hotline</div>
                      <div className="text-sm text-gray-600">0709 010 000 (24 hours)</div>
                    </div>
                    <div className="bg-gradient-to-br from-teal-50 to-blue-50 border-2 border-teal-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                      <div className="text-3xl font-bold text-teal-700 mb-2">Online</div>
                      <div className="text-gray-900 font-semibold mb-1">Services</div>
                      <div className="text-sm text-gray-600">Email, web, and SMS</div>
                    </div>
                  </div>
                </div>
              </section>

              <section id="headquarters" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">IEBC Headquarters – Nairobi</h2>
                </div>

                <div className="prose max-w-none">
                  <div className="bg-white border-2 border-blue-200 p-8 rounded-xl shadow-sm mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-blue-600" />
                          Physical Address
                        </h4>
                        <p className="text-gray-700 text-sm leading-relaxed mb-4">
                          <strong>IEBC Headquarters</strong><br />
                          Anniversary Towers<br />
                          Corner of Bishop Road and Kenyatta Avenue<br />
                          Nairobi, Kenya 00100
                        </p>
                        <p className="text-xs text-gray-600">
                          <strong>Office Hours:</strong><br />
                          Monday–Friday: 8:00 AM – 5:00 PM<br />
                          Lunch Break: 1:00 PM – 2:00 PM<br />
                          Weekends & Public Holidays: Closed
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Phone className="w-5 h-5 text-blue-600" />
                          Contact Details
                        </h4>
                        <div className="space-y-2 text-sm text-gray-700">
                          <p>
                            <strong>Main Hotline:</strong><br />
                            <a href="tel:+254709010000" className="text-blue-600 hover:text-blue-700 font-semibold">0709 010 000</a>
                          </p>
                          <p>
                            <strong>Email:</strong><br />
                            <a href="mailto:info@iebc.or.ke" className="text-blue-600 hover:text-blue-700 font-semibold">info@iebc.or.ke</a>
                          </p>
                          <p>
                            <strong>Complaints:</strong><br />
                            <a href="mailto:complaints@iebc.or.ke" className="text-blue-600 hover:text-blue-700 font-semibold">complaints@iebc.or.ke</a>
                          </p>
                          <p>
                            <strong>SMS Code:</strong><br />
                            Send voter registration/status query to <strong>22456</strong>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section id="county-directory" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Users className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">County Offices Directory (All 47 Counties)</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-4">Search for your county or browse the complete directory below. Click on phone numbers to call directly, or click on emails to send messages.</p>
                  
                  <div className="mb-6">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by county or location..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full pl-12 pr-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none text-gray-700"
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-2">Found {filteredCounties.length} of {countyOffices.length} offices</p>
                  </div>

                  <div className="bg-white border-2 border-gray-200 rounded-xl overflow-x-auto shadow-sm">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white sticky top-0">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-sm">County</th>
                          <th className="px-4 py-3 text-left font-semibold text-sm">Location</th>
                          <th className="px-4 py-3 text-left font-semibold text-sm">Phone</th>
                          <th className="px-4 py-3 text-left font-semibold text-sm">Email</th>
                          <th className="px-4 py-3 text-left font-semibold text-sm">Services</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredCounties.map((office, index) => (
                          <tr key={index} className="hover:bg-blue-50 transition">
                            <td className="px-4 py-3 font-medium text-gray-900 text-sm">{office.county}</td>
                            <td className="px-4 py-3 text-gray-700 text-sm">{office.location}</td>
                            <td className="px-4 py-3 text-sm">
                              <a href={`tel:+254${office.phone.replace(/^0/, '')}`} className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                {office.phone}
                              </a>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <a href={`mailto:${office.email}`} className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                {office.email}
                              </a>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-600">{office.services}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              <section id="services" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Services Available at IEBC Offices</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-4">All IEBC county offices offer the following core services:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        Voter Registration
                      </h4>
                      <p className="text-gray-700 text-sm">Register as a voter or update your voter information. Bring your national ID or passport.</p>
                    </div>

                    <div className="bg-cyan-50 border-l-4 border-cyan-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-cyan-600" />
                        Voter Status Verification
                      </h4>
                      <p className="text-gray-700 text-sm">Check if you are registered, verify your polling station, and confirm your voter details.</p>
                    </div>

                    <div className="bg-teal-50 border-l-4 border-teal-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-teal-600" />
                        Forms & Documents
                      </h4>
                      <p className="text-gray-700 text-sm">Obtain election forms, nomination papers, and candidate documents. Download online at /iebc-forms-downloads.</p>
                    </div>

                    <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        Complaints & Disputes
                      </h4>
                      <p className="text-gray-700 text-sm">Lodge complaints about election offences, irregularities, or disputes with nomination processes.</p>
                    </div>

                    <div className="bg-cyan-50 border-l-4 border-cyan-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-cyan-600" />
                        Candidate Support
                      </h4>
                      <p className="text-gray-700 text-sm">Receive guidance on nomination procedures, candidate eligibility, and campaign regulations.</p>
                    </div>

                    <div className="bg-teal-50 border-l-4 border-teal-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-teal-600" />
                        Election Information
                      </h4>
                      <p className="text-gray-700 text-sm">Get information about election dates, polling stations, and electoral procedures. See /elections-in-kenya.</p>
                    </div>
                  </div>
                </div>
              </section>

              <section id="online-contact" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Globe className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How to Contact IEBC Online</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">If you cannot visit a physical office, you can contact IEBC through multiple online channels:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white border-2 border-blue-200 p-6 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-blue-600" />
                        Official Website
                      </h4>
                      <p className="text-gray-700 text-sm mb-2">Visit the IEBC official website for comprehensive information, services, and resources.</p>
                      <a href="https://www.iebc.or.ke" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1">
                        www.iebc.or.ke
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-6 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Mail className="w-5 h-5 text-blue-600" />
                        Email Support
                      </h4>
                      <p className="text-gray-700 text-sm mb-2">Send general inquiries or documents via email. Responses typically within 2-3 business days.</p>
                      <a href="mailto:info@iebc.or.ke" className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                        info@iebc.or.ke
                      </a>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-6 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Phone className="w-5 h-5 text-blue-600" />
                        24/7 Hotline
                      </h4>
                      <p className="text-gray-700 text-sm mb-2">Call IEBC's toll-free hotline for urgent inquiries, complaints, and assistance anytime.</p>
                      <a href="tel:+254709010000" className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                        0709 010 000
                      </a>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-6 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        SMS Code
                      </h4>
                      <p className="text-gray-700 text-sm mb-2">Check voter status and get election information via SMS to short code 22456.</p>
                      <p className="text-blue-600 font-semibold text-sm">Send to 22456</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">Social Media</h4>
                    <p className="text-gray-700 text-sm mb-3">Follow IEBC on social media for election updates, announcements, and public information:</p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• <strong>Twitter/X:</strong> @IEBCKenya</li>
                      <li>• <strong>Facebook:</strong> IEBC Kenya</li>
                      <li>• <strong>Instagram:</strong> @IEBCKenya</li>
                      <li>• <strong>YouTube:</strong> IEBC Kenya Official</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section id="when-to-visit" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">When to Visit an IEBC Office</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-4">You should visit an IEBC office when you need to:</p>
                  
                  <ul className="space-y-2 text-gray-700 text-sm mb-6">
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Register as a Voter:</strong> If you are a Kenyan citizen aged 18+ and have not yet registered</span></li>
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Update Voter Information:</strong> If your details have changed (address, name, etc.)</span></li>
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Verify Voter Status:</strong> To confirm you are registered and find your polling station (during non-election periods)</span></li>
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Submit Nomination Papers:</strong> During official nomination periods (for candidates)</span></li>
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Obtain Election Forms:</strong> Nomination forms, declaration forms, and other official documents</span></li>
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Lodge Complaints:</strong> Report election offences, irregularities, or nomination disputes</span></li>
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Seek Candidate Support:</strong> Get guidance on nomination procedures and electoral regulations</span></li>
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Request Election Information:</strong> General inquiries about voting, elections, and electoral procedures</span></li>
                  </ul>

                  <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded-lg">
                    <p className="text-gray-900 font-semibold mb-2 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      Note on Office Hours During Elections
                    </p>
                    <p className="text-gray-700 text-sm">During election periods, IEBC offices may extend their hours or operate on weekends. Check with your county office for election-specific schedules.</p>
                  </div>
                </div>
              </section>

              <section id="tips" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Tips Before Visiting an IEBC Office</h2>
                </div>

                <div className="prose max-w-none">
                  <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg">
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Bring Valid ID:</strong> Always carry your national ID, passport, or valid government-issued identification</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Check Office Hours:</strong> Visit during working hours (8 AM–5 PM) and avoid lunch breaks (1–2 PM) for faster service</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Arrive Early:</strong> Come early to avoid long queues, especially during peak periods</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Prepare Documents:</strong> If submitting documents, bring certified copies and originals for verification</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Know Your Needs:</strong> Be clear about what service you need to speed up the process</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Call Ahead:</strong> For complex services or candidate-related issues, call ahead to confirm availability</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Ask for Help:</strong> IEBC staff are available to guide you through the process – don't hesitate to ask</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Request Receipts:</strong> Always ask for receipts or confirmations for submitted documents</span></li>
                    </ul>
                  </div>
                </div>
              </section>

              <section id="faqs" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <BarChart3 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
                </div>

                <div className="space-y-3">
                  {faqs.map((faq, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full flex justify-between items-center p-5 text-left hover:bg-gray-50 transition"
                        aria-expanded={openFaqIndex === index}
                        aria-controls={`faq-${index}`}
                      >
                        <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                        {openFaqIndex === index ? (
                          <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        )}
                      </button>
                      {openFaqIndex === index && (
                        <div id={`faq-${index}`} className="px-5 pb-5">
                          <p className="text-gray-700 leading-relaxed text-sm">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white p-8 rounded-xl shadow-xl">
                <h3 className="text-2xl font-bold mb-4">Need Help? Contact IEBC Now</h3>
                <p className="mb-6 text-cyan-100">Use the contact information above to reach the nearest IEBC office or call the 24/7 hotline.</p>
                <div className="flex flex-wrap gap-4">
                  <a href="tel:+254709010000" className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-cyan-50 transition flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Call 0709 010 000
                  </a>
                  <a href="mailto:info@iebc.or.ke" className="bg-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-cyan-400 transition flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Email IEBC
                  </a>
                  <a href="/how-to-register-as-a-voter-kenya" className="bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-600 transition flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Register to Vote
                  </a>
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default IEBCContactsOfficesKenya;
