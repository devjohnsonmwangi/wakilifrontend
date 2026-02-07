import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  FileText,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  
  MessageCircle,
  Mail,
  Landmark,
  Users,
  Scale,
  Building2,
  MapPin,
  TrendingUp,
  FileCheck,
  
  AlertTriangle,
  Check,
  Gavel,
  Search,
  Shield,
  BadgeCheck
} from 'lucide-react';

// FAQs data - defined outside component
const faqs = [
  {
    question: 'What is the difference between a title deed and a Certificate of Ownership?',
    answer: 'A title deed is the original document issued by the Lands Registry proving ownership of land registered under the old registration system (Registry Index Maps). A Certificate of Ownership is the newer document under the digital land registration system. Both prove legal ownership, but they are issued under different systems. Always check which system applies to your land.'
  },
  {
    question: 'How do I verify if a title deed is genuine or fake?',
    answer: 'Check for these security features: (1) Government watermark and security threads, (2) Serial number unique to that property, (3) Lands Registry stamp and signatures, (4) Holographic strip with coat of arms, (5) Correct land registry office details. Verify the serial number and property description by searching at the Lands Registry office or online through their portal. A fake deed will lack proper watermarks and security features.'
  },
  {
    question: 'Can I search land ownership online in Kenya?',
    answer: 'Yes. The Ministry of Lands has launched an online land search portal where you can search for property details using the land reference number or property description. Visit lands.go.ke and use their online search tool. However, you still need to visit the registry office for official certified copies and verification. Online searches provide quick information but are not official certificates of ownership.'
  },
  {
    question: 'What does "subject to" mean on a title deed?',
    answer: '"Subject to" notations on a title deed indicate restrictions or encumbrances on the property. Common examples: "subject to caveat" (legal claim), "subject to mortgage" (bank loan), "subject to easement" (right of way granted to others). Always review all "subject to" entries before buying land, as these restrict your ownership rights and may affect the property\'s value and usability.'
  },
  {
    question: 'How much does it cost to verify a title deed in Kenya?',
    answer: 'Title deed verification costs typically include: Land searches (KES 500-2,000), Certified copies (KES 500-1,000 per copy), Lawyer consultation (KES 5,000-20,000), Surveyor inspection (KES 10,000-50,000 depending on land size). Most people spend KES 20,000-100,000 for comprehensive verification. Free land search is possible through online Ministry of Lands portal, but lawyer review is strongly recommended.'
  },
  {
    question: 'What are common land fraud scams in Kenya?',
    answer: 'Common scams include: (1) Selling land twice with forged title deeds, (2) Selling land with pending court cases not disclosed, (3) Selling communal land as private property, (4) Selling land with fake consent from co-owners, (5) Selling land subject to mortgage without buyer knowledge, (6) Impersonation of actual owner using fake national ID, (7) Creating fake title deeds on blank government paper. Always verify ownership through the Lands Registry, not just from the seller.'
  },
  {
    question: 'How long does a land search take at the Lands Registry?',
    answer: 'Manual searches at the registry office typically take 1-7 days depending on the system (RIM vs digital) and how busy the office is. Online searches through the Ministry portal are instant. Certified copies take 1-2 days. To speed up the process, hire a professional land search company or lawyer who has direct access to the registry. During peak periods, searches can take 2 weeks.'
  },
  {
    question: 'What documents do I need to buy land safely in Kenya?',
    answer: 'Essential documents: (1) Original or certified title deed, (2) Search report from Lands Registry, (3) Land survey plan, (4) Ownership verification documents, (5) Rates and land rent clearance, (6) Lawyer\'s title opinion letter, (7) Bank valuation report, (8) Title insurance report (if available). Additional checks: Verify no court cases, no mortgages, no pending disputes, no squatters or informal occupants on the land.'
  },
  {
    question: 'Can I buy land that is subject to a mortgage?',
    answer: 'Yes, but the mortgage must be discharged (paid off) before or at the time of transfer. The bank holding the mortgage will not release the land unless the loan is paid in full. If the seller owes a mortgage, the purchase price is typically held in escrow until the mortgage is cleared. Always check the title deed for mortgage notations and get written confirmation from the bank that the mortgage will be discharged at transfer.'
  },
  {
    question: 'What is the procedure for changing a title deed name after purchase?',
    answer: 'After purchase, the new owner must lodge the transfer documents at the Lands Registry: (1) Original/certified old title deed, (2) Transfer deed signed by seller, (3) Transfer deed signed by buyer, (4) Stamp duty receipt, (5) Property valuation, (6) Rates/land rent clearance, (7) Lawyer\'s undertaking. Processing takes 1-3 months. Once complete, the Lands Registry issues a new title deed in the buyer\'s name. The seller is then removed as owner.'
  },
  {
    question: 'What is the difference between registered and unregistered land in Kenya?',
    answer: 'Registered land has formal title issued by the Lands Registry with legal proof of ownership. Unregistered land (customary land) belongs to communities but has no individual title deed. Benefits of registered land: Legal proof of ownership, mortgage-able, can be sold, inherited, taxed. Unregistered land is risky for purchase as ownership is unclear and cannot be mortgaged. Always buy registered land with a title deed.'
  },
  {
    question: 'How do I report a fake title deed or land fraud?',
    answer: 'Report to: (1) Local police station (file FIR), (2) Lands Registry Fraud Investigation Unit, (3) Director of Public Prosecutions for criminal prosecution, (4) County Land Control Board, (5) Law Society of Kenya for lawyer misconduct. Provide evidence: fake deed samples, photographs, witness statements, transactions records. Land fraud is a serious criminal offense in Kenya. Police and the DPP will investigate and prosecute offenders.'
  }
];

const LandOwnershipTitleDeedKenya = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    document.title = 'Land Ownership & Title Deed Verification in Kenya - Complete Legal Guide 2026';

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Complete guide to title deed verification, land ownership laws, and safe land buying in Kenya. Learn how to verify authentic title deeds, conduct land registry searches, and avoid fraud. Updated 2026.'
      );
    }

    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute(
      'content',
      'title deed verification Kenya, how to verify land ownership Kenya, land registry search Kenya, how to check land owner online, buy land safely Kenya, fake title deed Kenya, land ownership laws Kenya, land search process Kenya, land fraud Kenya, documents needed to buy land, land transfer Kenya, Ministry of Lands Kenya'
    );

    // Canonical tag
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.href);

    // OpenGraph tags
    const ogTags = [
      { property: 'og:title', content: 'Land Ownership & Title Deed Verification in Kenya' },
      { property: 'og:description', content: 'Complete guide to verifying title deeds, land ownership, and safe property buying in Kenya.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: window.location.href }
    ];

    ogTags.forEach(tag => {
      let metaTag = document.querySelector(`meta[property="${tag.property}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', tag.property);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', tag.content);
    });

    // Twitter tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Land Ownership & Title Deed Verification in Kenya' },
      { name: 'twitter:description', content: 'How to verify authentic title deeds, conduct land registry searches, and buy land safely in Kenya.' }
    ];

    twitterTags.forEach(tag => {
      let metaTag = document.querySelector(`meta[name="${tag.name}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', tag.name);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', tag.content);
    });

    // Robots meta
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute('content', 'index, follow');

    // JSON-LD Structured Data
    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': window.location.href,
          name: 'Land Ownership & Title Deed Verification in Kenya',
          description: 'Complete guide to land ownership laws, title deed verification, and safe property buying in Kenya',
          inLanguage: 'en-KE'
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: window.location.origin
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Land Law',
              item: `${window.location.origin}/land-law`
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: 'Land Ownership & Title Deed Verification',
              item: window.location.href
            }
          ]
        },
        {
          '@type': 'HowTo',
          name: 'How to Verify a Title Deed in Kenya',
          description: 'Step-by-step process for verifying authentic land title deeds and ownership',
          step: [
            {
              '@type': 'HowToStep',
              name: 'Obtain Title Deed Copy',
              text: 'Get the original or certified copy of the title deed from the seller or Lands Registry'
            },
            {
              '@type': 'HowToStep',
              name: 'Check Security Features',
              text: 'Verify watermarks, security threads, holographic strips, and government stamps'
            },
            {
              '@type': 'HowToStep',
              name: 'Conduct Land Registry Search',
              text: 'Search the property at the Lands Registry to confirm ownership and any restrictions'
            },
            {
              '@type': 'HowToStep',
              name: 'Review Encumbrances',
              text: 'Check for mortgages, caveats, or other "subject to" restrictions'
            },
            {
              '@type': 'HowToStep',
              name: 'Get Lawyer Opinion',
              text: 'Have a lawyer review the title deed and provide a title opinion letter'
            },
            {
              '@type': 'HowToStep',
              name: 'Get Professional Survey',
              text: 'Hire a surveyor to verify land boundaries and physical condition'
            }
          ]
        },
        {
          '@type': 'FAQPage',
          mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer
            }
          }))
        }
      ]
    };

    let scriptTag = document.querySelector('script[type="application/ld+json"]');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);

    window.scrollTo(0, 0);
    setTimeout(() => setIsVisible(true), 100);

    // Intersection Observer for active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const tableOfContents = [
    { id: 'understanding-laws', title: 'Understanding Laws' },
    { id: 'what-is-title', title: 'What is Title Deed' },
    { id: 'verify-title', title: 'Verify Title Deed' },
    { id: 'registry-search', title: 'Registry Search' },
    { id: 'documents-required', title: 'Documents Required' },
    { id: 'land-fraud', title: 'Land Fraud' },
    { id: 'safe-buying', title: 'Safe Buying' },
    { id: 'transfer-overview', title: 'Transfer Overview' },
    { id: 'legal-rights', title: 'Legal Rights' },
    { id: 'disputes-prevention', title: 'Disputes Prevention' },
    { id: 'hire-lawyer', title: 'Hire Lawyer?' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      {/* Breadcrumb */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 py-2 sm:py-3 px-2 sm:px-4 md:px-8 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-0">
          <ol className="flex items-center space-x-2 text-sm flex-wrap">
            <li>
              <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center transition-colors duration-200">
                <Home className="w-4 h-4 mr-1" /> Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-700 font-medium">Land Ownership & Title Deed Verification</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative bg-gradient-to-r from-blue-700 via-indigo-600 to-teal-600 text-white py-12 sm:py-20 px-3 sm:px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className={`max-w-7xl mx-auto relative z-10 transition-all duration-1000 px-0 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center mb-6">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl mr-4 shadow-xl">
              <FileCheck className="w-12 h-12" />
            </div>
            <div>
              <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                Land Ownership & Title Deed Verification in Kenya
              </h1>
              <p className="text-lg md:text-xl opacity-90 mt-2">Complete Legal Guide to Authentic Property Ownership</p>
            </div>
          </div>
          <p className="text-xl md:text-2xl opacity-95 max-w-4xl leading-relaxed mb-6">
            Complete guide to verifying title deeds, understanding land ownership laws, conducting land registry searches, and safely buying property in Kenya. Learn how to spot fake deeds and protect yourself from land fraud. <span className="font-semibold text-blue-200">Updated 2026.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`https://wa.me/254112810203?text=${encodeURIComponent('Hello! I need help with title deed verification and land ownership in Kenya. Please guide me.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 text-sm sm:text-base"
              aria-label="Get title deed verification assistance on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              WhatsApp Guidance
            </a>
            <a
              href={`mailto:johnsonthuraniramwangi@gmail.com?subject=${encodeURIComponent('Title Deed Verification Assistance')}&body=${encodeURIComponent('Hello,\n\nI need professional assistance with title deed verification and land ownership in Kenya.\n\nPlease contact me to discuss:\n- Title deed verification\n- Land registry searches\n- Land fraud prevention\n\nThank you.')}`}
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl border border-white/30 shadow-lg transition-all duration-300 hover:scale-105 text-sm sm:text-base"
              aria-label="Email for title deed assistance"
            >
              <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
              Email Inquiry
            </a>
          </div>
        </div>
      </header>

      {/* Table of Contents - Sticky */}
      <div className="bg-white border-b border-gray-200 sticky top-14 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <span className="text-sm font-semibold text-gray-700 flex-shrink-0">Quick Jump:</span>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
              {tableOfContents.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`text-xs px-3 py-1 rounded-full whitespace-nowrap transition-all duration-200 ${
                    activeSection === item.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
                  }`}
                >
                  {item.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-8 sm:py-12">
        
        {/* Section 1: Understanding Land Ownership Laws */}
        <section id="understanding-laws" className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200">
            <div className="flex items-start mb-6">
              <div className="bg-blue-100 p-3 rounded-xl mr-4">
                <Scale className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Understanding Land Ownership Laws in Kenya</h2>
                <p className="text-gray-600">Legal framework for property ownership</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Land ownership in Kenya is governed by the <strong>Constitution of Kenya 2010</strong>, the <strong>Land Act 2012</strong>, the <strong>Land Registration Act 2012</strong>, and the <strong>Property Law</strong>. The legal system recognizes two types of land: <strong>registered land</strong> (with formal title from the government) and <strong>unregistered customary land</strong> (community-owned land with no individual titles).
              </p>

              <p className="text-gray-700 leading-relaxed mb-6">
                If you own land registered with the Lands Registry, you have a legal title deed proving your ownership. This title is <strong>registered at a specific county Lands Registry office</strong> and recorded in the official land register. Without a registered title, you do not have legal proof of ownership in Kenya.
              </p>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 mb-6">
                <h3 className="font-bold text-xl text-blue-900 mb-4">Types of Land Ownership in Kenya</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-5 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                      <FileCheck className="w-5 h-5 text-blue-600 mr-2" />
                      Registered Land (Freehold/Leasehold)
                    </h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Has official title deed from Lands Registry</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Can be bought, sold, mortgaged, inherited</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Legal protection from government</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Subject to county property tax (rating)</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Freehold = perpetual ownership; Leasehold = time-limited</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                      <AlertCircle className="w-5 h-5 text-orange-600 mr-2" />
                      Unregistered Land (Customary)
                    </h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>No individual title deed issued</span>
                      </li>
                      <li className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Ownership not officially recognized by government</span>
                      </li>
                      <li className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Cannot be mortgaged by banks</span>
                      </li>
                      <li className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Risky for purchase - ownership can be disputed</span>
                      </li>
                      <li className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Can be registered now through adjudication process</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
                <h3 className="font-bold text-lg text-blue-900 mb-3">KEY PRINCIPLE: Always Buy Registered Land</h3>
                <p className="text-gray-700">
                  Never purchase unregistered customary land without a government title deed. If a seller cannot show you an official title deed from the Lands Registry, do not buy the property. The land may have unclear ownership, pending disputes, or claims from other family members or the community.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: What is a Title Deed */}
        <section id="what-is-title" className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200">
            <div className="flex items-start mb-6">
              <div className="bg-green-100 p-3 rounded-xl mr-4">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">What is a Title Deed?</h2>
                <p className="text-gray-600">Understanding government property documents</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                A <strong>title deed</strong> is an official government document issued by the Lands Registry that proves legal ownership of a specific parcel of land in Kenya. It contains the owner's name, land size, location, boundaries, and any restrictions on the land. The title deed is the legal evidence that you own the property.
              </p>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 mb-6">
                <h3 className="font-bold text-xl text-green-900 mb-4">What a Title Deed Contains</h3>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-5 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-2">Personal Information Section</h4>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>✓ Full name of land owner (must match national ID exactly)</li>
                      <li>✓ Date title was issued</li>
                      <li>✓ Serial number (unique to this property)</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-2">Property Description Section</h4>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>✓ Land reference number (e.g., Nairobi/Block 123/Unit 456)</li>
                      <li>✓ Property size in acres or hectares</li>
                      <li>✓ County location and detailed boundaries</li>
                      <li>✓ GPS coordinates (in newer digital system)</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-2">Encumbrances Section ("Subject To")</h4>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>✓ Lists any restrictions on the property</li>
                      <li>✓ Examples: mortgages, easements, caveats, leases</li>
                      <li>✓ These limit your ownership rights</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-2">Security & Verification Features</h4>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>✓ Lands Registry stamp and signatures</li>
                      <li>✓ Government watermark and security threads</li>
                      <li>✓ Holographic security strip with coat of arms</li>
                      <li>✓ Official registry office seal</li>
                    </ul>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Original vs. Certified Copies:</strong> The "original" title deed is kept by the Lands Registry. What the owner receives is a <strong>certified copy</strong> (photostat copy) certified and stamped by the registry. This certified copy is legal proof of ownership and is used for all transactions (selling, mortgaging, inheritance). The original remains in the registry file.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: How to Verify a Title Deed */}
        <section id="verify-title" className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200">
            <div className="flex items-start mb-6">
              <div className="bg-purple-100 p-3 rounded-xl mr-4">
                <BadgeCheck className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">How to Verify a Title Deed (Step-by-Step)</h2>
                <p className="text-gray-600">Complete verification process</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                Follow these steps to verify that a title deed is genuine and that the owner has clear legal ownership:
              </p>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200 mb-6">
                <div className="space-y-6">
                  <div className="bg-white rounded-lg p-5 shadow-sm border-l-4 border-purple-500">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-bold mr-3 text-sm">1</span>
                      Check Physical Security Features
                    </h4>
                    <ul className="space-y-2 text-gray-700 text-sm ml-11">
                      <li>✓ Hold the deed to light - look for watermark with "Ministry of Lands" text</li>
                      <li>✓ Feel for security threads embedded in the paper (tactile verification)</li>
                      <li>✓ Check for holographic strip on the deed (3D security feature with coat of arms)</li>
                      <li>✓ Verify Lands Registry stamp is clear and properly positioned</li>
                      <li>✓ Check official signatures and dates are legible</li>
                      <li>✓ Fake deeds lack these features or have poor quality reproductions</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm border-l-4 border-blue-500">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold mr-3 text-sm">2</span>
                      Verify Owner Details
                    </h4>
                    <ul className="space-y-2 text-gray-700 text-sm ml-11">
                      <li>✓ Confirm owner's name matches their national ID exactly (spelling, spacing)</li>
                      <li>✓ Check date of title issuance - matches when owner acquired property</li>
                      <li>✓ Verify serial number format - should be unique and properly formatted</li>
                      <li>✓ Confirm county registry office name matches property location</li>
                      <li>✓ Check that title is in seller's name (not someone else's)</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm border-l-4 border-green-500">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 font-bold mr-3 text-sm">3</span>
                      Verify Property Description
                    </h4>
                    <ul className="space-y-2 text-gray-700 text-sm ml-11">
                      <li>✓ Confirm land reference number (e.g., Nairobi/Block 456/Unit 123)</li>
                      <li>✓ Check property size matches what you expect</li>
                      <li>✓ Verify location and county details</li>
                      <li>✓ Review boundary descriptions to ensure they match physical land</li>
                      <li>✓ Compare the land to survey plan if available</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm border-l-4 border-red-500">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 font-bold mr-3 text-sm">4</span>
                      Check "Subject To" Restrictions
                    </h4>
                    <ul className="space-y-2 text-gray-700 text-sm ml-11">
                      <li>✓ Carefully read ALL "subject to" entries - these are critical</li>
                      <li>✓ Look for mortgages (means bank has claim to property)</li>
                      <li>✓ Look for caveats (legal claims preventing sale)</li>
                      <li>✓ Look for easements (right of way granted to others)</li>
                      <li>✓ Look for pending court cases affecting the property</li>
                      <li>✓ Each restriction affects value and usability</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm border-l-4 border-indigo-500">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold mr-3 text-sm">5</span>
                      Conduct Lands Registry Search
                    </h4>
                    <ul className="space-y-2 text-gray-700 text-sm ml-11">
                      <li>✓ Visit the county Lands Registry office or use online search portal</li>
                      <li>✓ Search the property using the land reference number</li>
                      <li>✓ Obtain official search report confirming current owner and restrictions</li>
                      <li>✓ Certified copy from registry costs KES 500-2,000</li>
                      <li>✓ Cross-check search result with the deed the seller provided</li>
                      <li>✓ Any differences indicate a problem</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm border-l-4 border-orange-500">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold mr-3 text-sm">6</span>
                      Hire Lawyer for Title Opinion
                    </h4>
                    <ul className="space-y-2 text-gray-700 text-sm ml-11">
                      <li>✓ Hire a practicing lawyer to review the deed and search results</li>
                      <li>✓ Lawyer provides written "title opinion letter" confirming clear title</li>
                      <li>✓ Lawyer identifies any risks or issues with the property</li>
                      <li>✓ Lawyer fees typically KES 5,000-20,000 for this service</li>
                      <li>✓ Never skip this step - protects your investment</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm border-l-4 border-teal-500">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 text-teal-600 font-bold mr-3 text-sm">7</span>
                      Get Professional Survey
                    </h4>
                    <ul className="space-y-2 text-gray-700 text-sm ml-11">
                      <li>✓ Hire a licensed surveyor to physically inspect the land</li>
                      <li>✓ Surveyor verifies land boundaries match the title deed description</li>
                      <li>✓ Surveyor checks for squatters or unauthorized occupants</li>
                      <li>✓ Surveyor confirms property access and infrastructure</li>
                      <li>✓ Surveyor fee typically KES 10,000-50,000 depending on size</li>
                      <li>✓ Get detailed survey plan for your records</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Land Registry Search */}
        <section id="registry-search" className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200">
            <div className="flex items-start mb-6">
              <div className="bg-cyan-100 p-3 rounded-xl mr-4">
                <Search className="w-8 h-8 text-cyan-600" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">How to Conduct a Land Registry Search</h2>
                <p className="text-gray-600">Official property verification methods</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                A land registry search is an official government search at the Lands Registry office to confirm property ownership, identify any restrictions, and verify that the seller has clear title. This is ESSENTIAL before buying any land.
              </p>

              <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-xl text-cyan-900 mb-4">Three Ways to Search Land in Kenya</h3>
                
                <div className="space-y-5">
                  <div className="bg-white rounded-lg p-5 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-3">Method 1: Online Land Search (Fastest)</h4>
                    <ul className="space-y-2 text-gray-700 text-sm mb-4">
                      <li className="flex items-start">
                        <span className="text-cyan-600 font-bold mr-2">•</span>
                        <span>Visit: <strong>www.lands.go.ke</strong></span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-600 font-bold mr-2">•</span>
                        <span>Use the online land search tool on Ministry of Lands website</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-600 font-bold mr-2">•</span>
                        <span>Enter the land reference number or property description</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-600 font-bold mr-2">•</span>
                        <span>Results show in seconds with owner details and restrictions</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-600 font-bold mr-2">•</span>
                        <span>Cost: Free or minimal fee</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-600 font-bold mr-2">•</span>
                        <span>Limitation: Not official certification (use as preliminary check)</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-3">Method 2: In-Person Registry Search (Official)</h4>
                    <ul className="space-y-2 text-gray-700 text-sm mb-4">
                      <li className="flex items-start">
                        <span className="text-cyan-600 font-bold mr-2">•</span>
                        <span>Visit the county Lands Registry office where land is located</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-600 font-bold mr-2">•</span>
                        <span>Request "Official Search" of the property</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-600 font-bold mr-2">•</span>
                        <span>Provide land reference number and/or property description</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-600 font-bold mr-2">•</span>
                        <span>Wait 1-7 days for results (varies by county)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-600 font-bold mr-2">•</span>
                        <span>Cost: KES 500-2,000 depending on property and county</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-600 font-bold mr-2">•</span>
                        <span>Advantage: Official certified document accepted by lawyers and banks</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-3">Method 3: Professional Land Search Company</h4>
                    <ul className="space-y-2 text-gray-700 text-sm mb-4">
                      <li className="flex items-start">
                        <span className="text-cyan-600 font-bold mr-2">•</span>
                        <span>Hire a professional land search/investigation firm</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-600 font-bold mr-2">•</span>
                        <span>They conduct official registry search on your behalf</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-600 font-bold mr-2">•</span>
                        <span>Provide comprehensive report with all details and recommendations</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-600 font-bold mr-2">•</span>
                        <span>Cost: KES 5,000-20,000 depending on property complexity</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-600 font-bold mr-2">•</span>
                        <span>Advantage: Convenient, professional expertise, includes verification</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-lg">
                <h3 className="font-bold text-lg text-red-900 mb-3 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  RED FLAGS: Avoid These Properties
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-2">✗</span>
                    <span>Seller cannot produce certified title deed</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-2">✗</span>
                    <span>Registry search shows different owner than seller</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-2">✗</span>
                    <span>Multiple "subject to" entries (mortgages, caveats)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-2">✗</span>
                    <span>Pending court cases against the property</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-2">✗</span>
                    <span>Seller rushing you to buy without time to verify</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-2">✗</span>
                    <span>Price too good to be true for the location</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Documents Needed Before Buying Land */}
        <section id="documents-required" className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200">
            <div className="flex items-start mb-6">
              <div className="bg-amber-100 p-3 rounded-xl mr-4">
                <FileText className="w-8 h-8 text-amber-600" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Documents Needed Before Buying Land</h2>
                <p className="text-gray-600">Essential paperwork checklist</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Before signing any contracts or transferring money, ensure you have verified the following documents:
              </p>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-xl text-amber-900 mb-4">Critical Documents</h3>
                
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-amber-600 font-bold mr-3">✓</span>
                    <div>
                      <strong>Original or Certified Title Deed</strong>
                      <p className="text-sm text-gray-600">The most important document. Must show property details and current owner name. Get certified copy from Lands Registry.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 font-bold mr-3">✓</span>
                    <div>
                      <strong>Official Land Registry Search Report</strong>
                      <p className="text-sm text-gray-600">Confirms current registered owner and all restrictions on the property. Must match the title deed provided.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 font-bold mr-3">✓</span>
                    <div>
                      <strong>Land Survey Plan</strong>
                      <p className="text-sm text-gray-600">Shows exact boundaries and size of the property. Verifies land is correctly described. Should be signed by licensed surveyor.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 font-bold mr-3">✓</span>
                    <div>
                      <strong>Rates and Land Rent Clearance Certificate</strong>
                      <p className="text-sm text-gray-600">Proves no outstanding taxes or arrears. Obtained from county office and Lands Registry office.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 font-bold mr-3">✓</span>
                    <div>
                      <strong>Seller's Identification Documents</strong>
                      <p className="text-sm text-gray-600">National ID, passport, or other government-issued ID. Name must match exactly on title deed.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 font-bold mr-3">✓</span>
                    <div>
                      <strong>Power of Attorney (if seller not present)</strong>
                      <p className="text-sm text-gray-600">If seller cannot sign documents personally, must provide signed and witnessed power of attorney.</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
                <h3 className="font-bold text-lg text-indigo-900 mb-4">Hire Professional Advisors</h3>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                      <Gavel className="w-5 h-5 text-indigo-600 mr-2" />
                      Lawyer
                    </h4>
                    <p className="text-gray-700 text-sm mb-3">Reviews all documents, title deed, and registry search. Provides written "title opinion letter" confirming clear ownership. Cost: KES 5,000-20,000</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                      <MapPin className="w-5 h-5 text-indigo-600 mr-2" />
                      Surveyor
                    </h4>
                    <p className="text-gray-700 text-sm mb-3">Verifies land boundaries match title description. Checks for squatters. Provides detailed survey plan. Cost: KES 10,000-50,000</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                      <Building2 className="w-5 h-5 text-indigo-600 mr-2" />
                      Property Valuer
                    </h4>
                    <p className="text-gray-700 text-sm mb-3">Assesses fair market value and quality. Required for mortgage approval. Identifies defects. Cost: KES 10,000-30,000</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                      <Search className="w-5 h-5 text-indigo-600 mr-2" />
                      Land Search Firm
                    </h4>
                    <p className="text-gray-700 text-sm mb-3">Conducts comprehensive property search and investigation. Identifies fraud risks. Cost: KES 5,000-20,000</p>
                  </div>
                </div>

                <p className="text-gray-700 text-sm">
                  <strong>Total professional advisor costs: KES 30,000-100,000</strong> - This is a small investment compared to protecting a land investment worth millions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Common Land Fraud & Fake Title Scams */}
        <section id="land-fraud" className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200">
            <div className="flex items-start mb-6">
              <div className="bg-red-100 p-3 rounded-xl mr-4">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Common Land Fraud & Fake Title Scams</h2>
                <p className="text-gray-600">How to identify and avoid scams</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                Land fraud is extremely common in Kenya. Criminals use fake title deeds, forged documents, and deceptive tactics to steal millions from unsuspecting buyers. Here are the most common scams:
              </p>

              <div className="space-y-5 mb-6">
                <div className="bg-red-50 border-l-4 border-red-600 p-5 rounded-r-lg">
                  <h3 className="font-bold text-lg text-red-900 mb-3">Scam 1: Selling Land Twice</h3>
                  <p className="text-gray-700 mb-2">
                    A criminal forges a title deed and sells the same land to multiple buyers. Victims only discover they don't actually own the land after "buying" it. The legitimate owner appears later with the original deed.
                  </p>
                  <p className="text-gray-700"><strong>Prevention:</strong> Always search the Lands Registry to confirm the seller is the registered owner. Never rely on the title deed alone.</p>
                </div>

                <div className="bg-red-50 border-l-4 border-red-600 p-5 rounded-r-lg">
                  <h3 className="font-bold text-lg text-red-900 mb-3">Scam 2: Fake Title Deeds</h3>
                  <p className="text-gray-700 mb-2">
                    Criminals create completely fake title deeds on blank government-style paper using desktop printers. These look similar to genuine deeds but lack authentic security features (watermarks, holograms, security threads).
                  </p>
                  <p className="text-gray-700"><strong>Prevention:</strong> Check security features thoroughly. Verify with Lands Registry. When in doubt, get a lawyer to verify authenticity.</p>
                </div>

                <div className="bg-red-50 border-l-4 border-red-600 p-5 rounded-r-lg">
                  <h3 className="font-bold text-lg text-red-900 mb-3">Scam 3: Selling Land with Court Cases</h3>
                  <p className="text-gray-700 mb-2">
                    Seller hides pending court disputes about land ownership. After you buy and pay, the court rules in favor of someone else, and you lose both land and money.
                  </p>
                  <p className="text-gray-700"><strong>Prevention:</strong> Search the land registry and ask lawyer to search for any court cases. Review all "subject to" entries carefully.</p>
                </div>

                <div className="bg-red-50 border-l-4 border-red-600 p-5 rounded-r-lg">
                  <h3 className="font-bold text-lg text-red-900 mb-3">Scam 4: Selling Mortgaged Land</h3>
                  <p className="text-gray-700 mb-2">
                    Seller agrees to sell land that still has an outstanding bank mortgage. Buyer pays seller's money but the bank repossesses the land before transfer is completed.
                  </p>
                  <p className="text-gray-700"><strong>Prevention:</strong> Check title deed for "subject to mortgage" notation. Get written confirmation from the bank that mortgage will be discharged before/at transfer.</p>
                </div>

                <div className="bg-red-50 border-l-4 border-red-600 p-5 rounded-r-lg">
                  <h3 className="font-bold text-lg text-red-900 mb-3">Scam 5: Identity Fraud</h3>
                  <p className="text-gray-700 mb-2">
                    An imposter with a fake national ID and forged Power of Attorney poses as the real owner and sells their land. The real owner doesn't know their property has been "sold."
                  </p>
                  <p className="text-gray-700"><strong>Prevention:</strong> Verify seller's identity thoroughly. Meet with seller multiple times. Get lawyer to conduct proper verification. For large sums, require seller to sign documents in front of lawyer/registrar.</p>
                </div>

                <div className="bg-red-50 border-l-4 border-red-600 p-5 rounded-r-lg">
                  <h3 className="font-bold text-lg text-red-900 mb-3">Scam 6: Selling Communal/Customary Land</h3>
                  <p className="text-gray-700 mb-2">
                    Someone sells communal land belonging to an entire community or clan as if it's their private property. After purchase, the community claims ownership and forces buyer off the land.
                  </p>
                  <p className="text-gray-700"><strong>Prevention:</strong> Always buy registered land with title deed. Avoid unregistered customary land. Verify land is registered in the seller's individual name.</p>
                </div>

                <div className="bg-red-50 border-l-4 border-red-600 p-5 rounded-r-lg">
                  <h3 className="font-bold text-lg text-red-900 mb-3">Scam 7: Selling Land with Squatters</h3>
                  <p className="text-gray-700 mb-2">
                    Seller doesn't disclose that someone is illegally living on the land (squatter). After you buy, evicting the squatter costs months and thousands in legal fees.
                  </p>
                  <p className="text-gray-700"><strong>Prevention:</strong> Get surveyor to physically inspect and confirm no squatters. Ask seller to sign affidavit that property is vacant. Walk the entire land boundary.</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
                <h3 className="font-bold text-xl text-red-900 mb-4">Typical Land Fraud Process (Beware!)</h3>
                <div className="space-y-3">
                  <div className="flex items-start bg-white rounded-lg p-4 shadow-sm">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 font-bold mr-3 flex-shrink-0">1</span>
                    <span className="text-gray-700">Criminal obtains a blank or stolen title deed template</span>
                  </div>
                  <div className="flex items-start bg-white rounded-lg p-4 shadow-sm">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 font-bold mr-3 flex-shrink-0">2</span>
                    <span className="text-gray-700">Creates fake title deed for someone else's land using desktop printer</span>
                  </div>
                  <div className="flex items-start bg-white rounded-lg p-4 shadow-sm">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 font-bold mr-3 flex-shrink-0">3</span>
                    <span className="text-gray-700">Meets potential buyer and shows fake deed (looks convincing)</span>
                  </div>
                  <div className="flex items-start bg-white rounded-lg p-4 shadow-sm">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 font-bold mr-3 flex-shrink-0">4</span>
                    <span className="text-gray-700">Offers price well below market rate to rush the sale</span>
                  </div>
                  <div className="flex items-start bg-white rounded-lg p-4 shadow-sm">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 font-bold mr-3 flex-shrink-0">5</span>
                    <span className="text-gray-700">Pressures buyer to pay immediately ("Another buyer interested")</span>
                  </div>
                  <div className="flex items-start bg-white rounded-lg p-4 shadow-sm">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 font-bold mr-3 flex-shrink-0">6</span>
                    <span className="text-gray-700">Buyer pays money but land never gets transferred</span>
                  </div>
                  <div className="flex items-start bg-white rounded-lg p-4 shadow-sm">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 font-bold mr-3 flex-shrink-0">7</span>
                    <span className="text-gray-700">Lands Registry rejects the fake deed - buyer has lost money</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 7: Safe Process for Buying Land */}
        <section id="safe-buying" className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200">
            <div className="flex items-start mb-6">
              <div className="bg-green-100 p-3 rounded-xl mr-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Safe Process for Buying Land in Kenya</h2>
                <p className="text-gray-600">Step-by-step checklist</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                Follow this exact process to protect yourself from land fraud and ensure you acquire clear, undisputed property:
              </p>

              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                <div className="space-y-5">
                  <div className="bg-white rounded-lg p-5 shadow-sm border-l-4 border-green-600">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-600 font-bold text-sm">✓</span>
                      <span className="ml-3">Step 1: Verify Seller's Identity</span>
                    </h4>
                    <ul className="ml-10 space-y-1 text-gray-700 text-sm">
                      <li>• Request seller's national ID and confirm matching with title deed</li>
                      <li>• Meet seller multiple times to verify they are consistent person</li>
                      <li>• Confirm seller's story of how they acquired the land</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm border-l-4 border-green-600">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-600 font-bold text-sm">✓</span>
                      <span className="ml-3">Step 2: Obtain Physical Inspection</span>
                    </h4>
                    <ul className="ml-10 space-y-1 text-gray-700 text-sm">
                      <li>• Visit the property yourself at different times of day</li>
                      <li>• Walk all boundaries and verify physical land matches description</li>
                      <li>• Check for squatters, informal structures, or unauthorized use</li>
                      <li>• Take photographs/video for your records</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm border-l-4 border-green-600">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-600 font-bold text-sm">✓</span>
                      <span className="ml-3">Step 3: Get Professional Land Search</span>
                    </h4>
                    <ul className="ml-10 space-y-1 text-gray-700 text-sm">
                      <li>• Hire land search firm OR visit Lands Registry personally</li>
                      <li>• Obtain official search report confirming registered owner</li>
                      <li>• Verify seller's name matches registered owner exactly</li>
                      <li>• Document all "subject to" restrictions and encumbrances</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm border-l-4 border-green-600">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-600 font-bold text-sm">✓</span>
                      <span className="ml-3">Step 4: Hire Qualified Lawyer</span>
                    </h4>
                    <ul className="ml-10 space-y-1 text-gray-700 text-sm">
                      <li>• Engage lawyer well before signing any documents</li>
                      <li>• Lawyer reviews title deed, search results, and all documents</li>
                      <li>• Lawyer provides written title opinion confirming clear title</li>
                      <li>• Lawyer searches for any court cases involving the property</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm border-l-4 border-green-600">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-600 font-bold text-sm">✓</span>
                      <span className="ml-3">Step 5: Hire Licensed Surveyor</span>
                    </h4>
                    <ul className="ml-10 space-y-1 text-gray-700 text-sm">
                      <li>• Hire surveyor to measure and verify land boundaries</li>
                      <li>• Obtain detailed survey plan showing exact measurements</li>
                      <li>• Surveyor confirms no encroachments or boundary disputes</li>
                      <li>• Survey plan should be registered at Lands Registry</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm border-l-4 border-green-600">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-600 font-bold text-sm">✓</span>
                      <span className="ml-3">Step 6: Obtain Clearance Certificates</span>
                    </h4>
                    <ul className="ml-10 space-y-1 text-gray-700 text-sm">
                      <li>• Get rates clearance certificate from county government</li>
                      <li>• Get land rent clearance certificate from Lands Registry</li>
                      <li>• Confirms no outstanding taxes or arrears on property</li>
                      <li>• Without these, Lands Registry won't process transfer</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm border-l-4 border-green-600">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-600 font-bold text-sm">✓</span>
                      <span className="ml-3">Step 7: Get Property Valuation</span>
                    </h4>
                    <ul className="ml-10 space-y-1 text-gray-700 text-sm">
                      <li>• Hire registered property valuer to assess market value</li>
                      <li>• Valuation required for mortgage if you're financing</li>
                      <li>• Helps confirm fair purchase price</li>
                      <li>• Valuer identifies any defects or issues</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm border-l-4 border-green-600">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-600 font-bold text-sm">✓</span>
                      <span className="ml-3">Step 8: Negotiate & Prepare Sale Agreement</span>
                    </h4>
                    <ul className="ml-10 space-y-1 text-gray-700 text-sm">
                      <li>• Negotiate purchase price based on valuation and condition</li>
                      <li>• Lawyer prepares written sale agreement</li>
                      <li>• Agreement includes: purchase price, payment schedule, conditions</li>
                      <li>• Specify that transfer will be to buyer's name</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm border-l-4 border-green-600">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-600 font-bold text-sm">✓</span>
                      <span className="ml-3">Step 9: Arrange Secure Payment</span>
                    </h4>
                    <ul className="ml-10 space-y-1 text-gray-700 text-sm">
                      <li>• Never pay cash directly to seller</li>
                      <li>• Use bank transfer or lawyer's client account (escrow)</li>
                      <li>• Lawyer holds money until all conditions are met</li>
                      <li>• Gets proof of payment documented</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm border-l-4 border-green-600">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-600 font-bold text-sm">✓</span>
                      <span className="ml-3">Step 10: Sign Transfer Deeds</span>
                    </h4>
                    <ul className="ml-10 space-y-1 text-gray-700 text-sm">
                      <li>• Only sign after all verifications are complete</li>
                      <li>• Sign transfer documents in presence of lawyer</li>
                      <li>• Seller must provide signed consent from any co-owners</li>
                      <li>• All signatures must be witnessed</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm border-l-4 border-green-600">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-600 font-bold text-sm">✓</span>
                      <span className="ml-3">Step 11: Pay Stamp Duty</span>
                    </h4>
                    <ul className="ml-10 space-y-1 text-gray-700 text-sm">
                      <li>• Buyer responsible for paying stamp duty (2% of value)</li>
                      <li>• Paid to Kenya Revenue Authority (KRA)</li>
                      <li>• Obtain stamp duty certificate before transfer</li>
                      <li>• Without stamp duty, Lands Registry won't process</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm border-l-4 border-green-600">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-600 font-bold text-sm">✓</span>
                      <span className="ml-3">Step 12: Lodge at Lands Registry</span>
                    </h4>
                    <ul className="ml-10 space-y-1 text-gray-700 text-sm">
                      <li>• Lawyer lodges all transfer documents at county Lands Registry</li>
                      <li>• Documents checked for completeness and accuracy</li>
                      <li>• Processing takes 1-3 months depending on county</li>
                      <li>• You receive new title deed in your name</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 8: Land Transfer & Registration Overview */}
        <section id="transfer-overview" className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200">
            <div className="flex items-start mb-6">
              <div className="bg-teal-100 p-3 rounded-xl mr-4">
                <TrendingUp className="w-8 h-8 text-teal-600" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Land Transfer & Registration Overview</h2>
                <p className="text-gray-600">How property changes hands legally</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Land transfer is the legal process of changing ownership from the seller to the buyer. It involves the Lands Registry and several official procedures.
              </p>

              <div className="bg-teal-50 border border-teal-200 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-xl text-teal-900 mb-4">Land Transfer Process</h3>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-5 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-2">1. Seller Signs Consent</h4>
                    <p className="text-gray-700 text-sm">Seller consents to transfer ownership to you. Document signed in front of witness/lawyer.</p>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-2">2. Payment Cleared</h4>
                    <p className="text-gray-700 text-sm">Full payment transferred from buyer to seller via bank or lawyer's escrow account. Get receipt/confirmation.</p>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-2">3. Stamp Duty Paid</h4>
                    <p className="text-gray-700 text-sm">Buyer pays 2% stamp duty to Kenya Revenue Authority. Obtain KRA receipt/certificate.</p>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-2">4. Transfer Documents Prepared</h4>
                    <p className="text-gray-700 text-sm">Lawyer prepares official transfer deed showing buyer as new owner. Both parties sign.</p>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-2">5. Documents Lodged at Registry</h4>
                    <p className="text-gray-700 text-sm">Lawyer submits all documents to county Lands Registry office for processing.</p>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-2">6. Registry Processing (1-3 months)</h4>
                    <p className="text-gray-700 text-sm">Registry staff verify all documents are complete and correct. May request additional information.</p>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-2">7. New Title Issued</h4>
                    <p className="text-gray-700 text-sm">Registry issues new title deed showing buyer as owner. Old title cancelled. Seller's name removed.</p>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-2">8. Collect New Title</h4>
                    <p className="text-gray-700 text-sm">Buyer collects new title deed from registry. You are now the legal owner.</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200">
                  <h3 className="font-bold text-lg text-indigo-900 mb-3">Two Land Registration Systems</h3>
                  <p className="text-gray-700 text-sm mb-3"><strong>Old System (RIM):</strong> Registry Index Maps - paper-based, slower, found in older registration offices</p>
                  <p className="text-gray-700 text-sm"><strong>New System (Digital):</strong> Computerized system with GPS coordinates, faster, now used in most counties</p>
                </div>

                <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                  <h3 className="font-bold text-lg text-orange-900 mb-3">Processing Times</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Efficient counties: 4-8 weeks</li>
                    <li>• Average: 8-12 weeks (2-3 months)</li>
                    <li>• Slow counties: 3-6 months</li>
                    <li>• Delays due to incomplete documents or registry backlog</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 9: Legal Rights of Land Owners */}
        <section id="legal-rights" className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200">
            <div className="flex items-start mb-6">
              <div className="bg-indigo-100 p-3 rounded-xl mr-4">
                <Landmark className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Legal Rights of Land Owners in Kenya</h2>
                <p className="text-gray-600">What ownership means legally</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                Once you receive a title deed, you have significant legal rights under Kenyan property law:
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200">
                  <h3 className="font-bold text-lg text-indigo-900 mb-4">Rights You Have</h3>
                  <ul className="space-y-3 text-gray-700 text-sm">
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Right to Possess:</strong> Occupy and control the land exclusively</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Right to Use:</strong> Use land for legal purposes (residence, business, etc.)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Right to Lease:</strong> Rent the property to tenants for income</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Right to Sell:</strong> Transfer ownership to another person</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Right to Mortgage:</strong> Use as security to borrow money from banks</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Right to Inherit:</strong> Pass to heirs after death</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Right to Develop:</strong> Build structures subject to planning rules</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                  <h3 className="font-bold text-lg text-red-900 mb-4">Restrictions & Duties</h3>
                  <ul className="space-y-3 text-gray-700 text-sm">
                    <li className="flex items-start">
                      <AlertTriangle className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Pay Property Tax:</strong> County rates (property tax) owed annually</span>
                    </li>
                    <li className="flex items-start">
                      <AlertTriangle className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Pay Land Rent:</strong> For leasehold, annual rent to Ministry of Lands</span>
                    </li>
                    <li className="flex items-start">
                      <AlertTriangle className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Follow Planning Rules:</strong> Building plans approval required</span>
                    </li>
                    <li className="flex items-start">
                      <AlertTriangle className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Respect Easements:</strong> Allow others to use rights of way</span>
                    </li>
                    <li className="flex items-start">
                      <AlertTriangle className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Not Misuse:</strong> Cannot use for illegal purposes</span>
                    </li>
                    <li className="flex items-start">
                      <AlertTriangle className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Environmental:</strong> Comply with environmental protection laws</span>
                    </li>
                    <li className="flex items-start">
                      <AlertTriangle className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Maintain Security:</strong> Prevent trespassing or squatting</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 10: Common Land Disputes and Prevention */}
        <section id="disputes-prevention" className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200">
            <div className="flex items-start mb-6">
              <div className="bg-yellow-100 p-3 rounded-xl mr-4">
                <AlertCircle className="w-8 h-8 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Common Land Disputes and Prevention</h2>
                <p className="text-gray-600">Avoid costly conflicts</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                Land disputes are common in Kenya and can cost thousands to resolve. Here are common disputes and how to prevent them:
              </p>

              <div className="space-y-5 mb-6">
                <div className="bg-yellow-50 border-l-4 border-yellow-600 p-5 rounded-r-lg">
                  <h3 className="font-bold text-lg text-yellow-900 mb-2">Boundary Disputes</h3>
                  <p className="text-gray-700 text-sm mb-3"><strong>Problem:</strong> Neighbors claim your land or boundary is incorrect. Can result in costly court cases.</p>
                  <p className="text-gray-700 text-sm"><strong>Prevention:</strong> Get licensed surveyor to conduct detailed boundary survey before buying. Get new survey plan registered at Lands Registry. Ensure neighbors acknowledge boundaries (get written agreements).</p>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-600 p-5 rounded-r-lg">
                  <h3 className="font-bold text-lg text-yellow-900 mb-2">Succession Disputes</h3>
                  <p className="text-gray-700 text-sm mb-3"><strong>Problem:</strong> After owner dies, multiple family members claim ownership based on different wills or succession laws.</p>
                  <p className="text-gray-700 text-sm"><strong>Prevention:</strong> Write a clear will specifying exactly who gets the land. Get will properly witnessed and filed with courts. Update if circumstances change. Inform family of your intentions.</p>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-600 p-5 rounded-r-lg">
                  <h3 className="font-bold text-lg text-yellow-900 mb-2">Spousal/Co-Owner Disputes</h3>
                  <p className="text-gray-700 text-sm mb-3"><strong>Problem:</strong> Spouse or co-owner claims right to land during divorce or separation. One owner tries to sell without other's consent.</p>
                  <p className="text-gray-700 text-sm"><strong>Prevention:</strong> For married couples, clearly document each spouse's share and ownership. If co-owned, agreement on who can sell and how profits divide. Keep marriage certificate and ownership records safe.</p>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-600 p-5 rounded-r-lg">
                  <h3 className="font-bold text-lg text-yellow-900 mb-2">Mortgaged Property Disputes</h3>
                  <p className="text-gray-700 text-sm mb-3"><strong>Problem:</strong> Bank forecloses on mortgaged land if owner defaults on loan payments.</p>
                  <p className="text-gray-700 text-sm"><strong>Prevention:</strong> Understand mortgage terms completely before borrowing. Make all payments on time. If financial difficulty, negotiate with bank immediately. Get legal help if facing foreclosure.</p>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-600 p-5 rounded-r-lg">
                  <h3 className="font-bold text-lg text-yellow-900 mb-2">Squatter Disputes</h3>
                  <p className="text-gray-700 text-sm mb-3"><strong>Problem:</strong> Someone illegally lives on your land and claims ownership through long occupation.</p>
                  <p className="text-gray-700 text-sm"><strong>Prevention:</strong> Occupy land regularly to prevent squatting. Fence/demarcate boundaries clearly. Visit frequently to check for unauthorized use. If squatters appear, report to police immediately - don't wait.</p>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-600 p-5 rounded-r-lg">
                  <h3 className="font-bold text-lg text-yellow-900 mb-2">Easement/Right of Way Disputes</h3>
                  <p className="text-gray-700 text-sm mb-3"><strong>Problem:</strong> Someone claims right to cross your land or use it (for water, electricity, road access).</p>
                  <p className="text-gray-700 text-sm"><strong>Prevention:</strong> Check title deed carefully for "subject to easement" notations. Understand who has rights and for what purpose. Negotiate terms if you disagree. Document all agreements in writing.</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                <h3 className="font-bold text-xl text-yellow-900 mb-4">General Dispute Prevention Tips</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-2">1. Document Everything</h4>
                    <p className="text-gray-700 text-sm">Keep original receipts, contracts, title deeds, communications, photographs. Store safely - make copies.</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-2">2. Hire Professionals</h4>
                    <p className="text-gray-700 text-sm">Lawyer, surveyor, and valuer help identify and prevent issues early before they become disputes.</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-2">3. Get Written Agreements</h4>
                    <p className="text-gray-700 text-sm">Never rely on verbal promises. All agreements about land should be written, signed, and witnessed.</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-2">4. Register Promptly</h4>
                    <p className="text-gray-700 text-sm">After purchase, register transfer immediately. Delay increases risk of disputes or claims.</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-2">5. Update Title Deed</h4>
                    <p className="text-gray-700 text-sm">If married, add spouse to title. If circumstances change, update ownership records at registry.</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-2">6. Know Your Rights</h4>
                    <p className="text-gray-700 text-sm">Understand what your title deed allows and restricts. Read all "subject to" entries carefully.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 11: When to Hire a Lawyer or Surveyor */}
        <section id="hire-lawyer" className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200">
            <div className="flex items-start mb-6">
              <div className="bg-emerald-100 p-3 rounded-xl mr-4">
                <Gavel className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">When to Hire a Lawyer or Surveyor</h2>
                <p className="text-gray-600">Professional guidance is essential</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                While not legally required, hiring professionals protects your investment and prevents costly mistakes:
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
                  <h3 className="font-bold text-lg text-emerald-900 mb-4">Hire a Lawyer If:</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Buying land (almost always recommended)</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Verifying title deed authenticity</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Dealing with property disputes</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Preparing sale/purchase agreements</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Resolving land access or boundary issues</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Registering land transfer at Lands Registry</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Dealing with inheritance or succession issues</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="font-bold text-lg text-blue-900 mb-4">Hire a Surveyor If:</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Buying land - to verify boundaries</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Dealing with boundary disputes with neighbors</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Subdividing land among multiple owners</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Building on land (building plans require survey)</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Resolving land encroachment issues</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Registering new land title at Lands Registry</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
                <h3 className="font-bold text-xl text-emerald-900 mb-4">Typical Costs</h3>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                    <h4 className="font-bold text-gray-900 mb-2">Lawyer Fees</h4>
                    <p className="text-lg font-bold text-emerald-600 mb-1">KES 5,000 - 50,000</p>
                    <p className="text-gray-700 text-xs">Title verification, agreements, transfer registration</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                    <h4 className="font-bold text-gray-900 mb-2">Surveyor Fees</h4>
                    <p className="text-lg font-bold text-blue-600 mb-1">KES 10,000 - 50,000</p>
                    <p className="text-gray-700 text-xs">Boundary verification, survey plans, measurements</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                    <h4 className="font-bold text-gray-900 mb-2">Valuer Fees</h4>
                    <p className="text-lg font-bold text-teal-600 mb-1">KES 10,000 - 30,000</p>
                    <p className="text-gray-700 text-xs">Property valuation, market assessment</p>
                  </div>
                </div>

                <p className="text-gray-700 text-sm mt-4 text-center">
                  <strong>Total investment: KES 25,000 - 130,000 is cheap compared to losing millions to land fraud or disputes</strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Internal Links Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-xl p-6 md:p-10 border border-blue-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Related Land Law Resources</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                to="/land-disputes-kenya"
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 group"
              >
                <AlertTriangle className="w-10 h-10 text-red-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg text-gray-900 mb-2">Land Disputes</h3>
                <p className="text-gray-600 text-sm">How to resolve boundary and ownership conflicts</p>
              </Link>

              <Link
                to="/land-transfer-process-kenya"
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 group"
              >
                <TrendingUp className="w-10 h-10 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg text-gray-900 mb-2">Land Transfer Process</h3>
                <p className="text-gray-600 text-sm">Complete guide to selling and buying land in Kenya</p>
              </Link>

              <Link
                to="/how-to-buy-land-safely-kenya"
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 group"
              >
                <Shield className="w-10 h-10 text-green-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg text-gray-900 mb-2">Buy Land Safely</h3>
                <p className="text-gray-600 text-sm">Step-by-step guide to secure land purchases</p>
              </Link>

              <Link
                to="/succession-inheritance-law-kenya"
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 group"
              >
                <Users className="w-10 h-10 text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg text-gray-900 mb-2">Succession & Inheritance</h3>
                <p className="text-gray-600 text-sm">Laws on inheriting land and property</p>
              </Link>

              <Link
                to="/letters-of-administration-probate-kenya"
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 group"
              >
                <Gavel className="w-10 h-10 text-orange-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg text-gray-900 mb-2">Probate & Letters</h3>
                <p className="text-gray-600 text-sm">Court process for estate administration</p>
              </Link>

              <Link
                to="/land-transfer-after-death"
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 group"
              >
                <Building2 className="w-10 h-10 text-teal-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg text-gray-900 mb-2">Transfer After Death</h3>
                <p className="text-gray-600 text-sm">How to transfer inherited property to beneficiaries</p>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4 max-w-4xl mx-auto">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-5 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                    aria-expanded={openFaq === index}
                  >
                    <span className="font-semibold text-left text-gray-900 pr-4">{faq.question}</span>
                    {openFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="p-5 bg-white border-t border-gray-200">
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 rounded-2xl shadow-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Need Help with Title Deed Verification?</h2>
            <p className="text-xl opacity-95 mb-8 max-w-3xl mx-auto">
              Land ownership and title deed verification are complex. Our experienced team can verify authenticity, conduct registry searches, and guide you through safe land purchases to protect your investment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`https://wa.me/254112810203?text=${encodeURIComponent('Hello! I need help with title deed verification and land ownership in Kenya. Please assist me.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp Us Now
              </a>
              <a
                href={`mailto:johnsonthuraniramwangi@gmail.com?subject=${encodeURIComponent('Title Deed Verification Assistance')}&body=${encodeURIComponent('Hello,\n\nI need professional assistance with title deed verification and land ownership.\n\nThank you.')}`}
                className="inline-flex items-center justify-center gap-2 bg-blue-800 hover:bg-blue-900 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Mail className="w-5 h-5" />
                Email Consultation
              </a>
            </div>
          </div>
        </section>

      </main>

      {/* Footer Note */}
      <footer className="bg-gray-100 border-t border-gray-300 py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <p className="text-gray-600 text-sm">
            <strong>Disclaimer:</strong> This information is for general guidance only and does not constitute legal advice. 
            Land ownership and title deed verification are complex matters. Always consult with a qualified lawyer and conduct official Lands Registry searches before making significant land purchases.
          </p>
          <p className="text-gray-500 text-xs mt-4">
            © 2026 Wakili Legal Services. All rights reserved. | Updated February 2026
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandOwnershipTitleDeedKenya;