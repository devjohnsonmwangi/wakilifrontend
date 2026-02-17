import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertTriangle,
  FileCheck,
  Building2,
  Users,
  
  MapPin,
  DollarSign,
  Shield,
  Phone,
  ArrowRight,
  Home,
  Search,
  Eye,
  Zap,
  Lock,
  Briefcase,
  Globe,
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface Checklist {
  item: string;
  description: string;
}

// FAQ data moved outside component to avoid dependency issues
const faqsData: FAQItem[] = [
  {
    question: 'How long does the land buying process take in Kenya?',
    answer:
      'The land buying process typically takes 2–4 months from identification to title registration. The longest phase is usually the Land Transfer Registry processing (4–8 weeks). However, due diligence alone (searches, verification, surveys) can take 2–3 weeks. Using a qualified advocate expedites the process significantly.',
  },
  {
    question: 'What is the most common land fraud in Kenya?',
    answer:
      'The most common fraud is selling land that is already mortgaged, disputed, or belongs to someone else. Fraudsters forge title deeds or present fake ownership documents. Other scams include selling the same land multiple times or misrepresenting land boundaries. Always conduct a Lands Registry search and hire a surveyor to verify boundaries.',
  },
  {
    question: 'Can I buy land in Kenya as a foreigner?',
    answer:
      'Yes, but with restrictions. Foreign nationals cannot buy land in Nairobi, Mombasa, or other urban areas unless they have lived in Kenya for 7+ years. However, they can buy commercial properties or land outside restricted zones. Diaspora Kenyans have easier access but still need valid identification. Always consult an advocate before purchasing.',
  },
  {
    question: 'What documents do I need to bring to a land search at the Lands Registry?',
    answer:
      'Bring the Land Reference Number (LRN), Folio Number, or Property Description. You can also bring the seller\'s national ID or passport. If you don\'t have the LRN, the Lands Registry can search by property location. Searches cost KES 500–1,500 depending on complexity. Request a comprehensive search including encumbrances (mortgages, leases, easements).',
  },
  {
    question: 'How do I know if a title deed is fake?',
    answer:
      'Check the physical deed for security features: holographic watermarks, serial numbers, and tamper-evident seals. Cross-reference with the Lands Registry database (now online). Verify the seal of the Lands Registry and the signature of the Registry officer. Never rely on photocopies—always verify with original documents at the Registry.',
  },
  {
    question: 'What is Land Control Board consent and when is it required?',
    answer:
      'Land Control Board (LCB) consent is required when buying land in Group Representative Areas or Customary Land. The Board ensures land is not sold to non-group members or used for prohibited purposes. Consent takes 2–4 weeks and costs KES 1,000–5,000. Your advocate will initiate the process. Without LCB consent, the transfer is invalid.',
  },
  {
    question: 'Should I pay a down payment before verification is complete?',
    answer:
      'No. Never pay any money until verification, searches, and legal review are complete. Scammers often demand upfront payments claiming they "hold" the land for you. Safe practice: Pay only after land search confirms clean title, surveyor confirms boundaries, and your advocate reviews all documents. Use lawyer escrow accounts for security.',
  },
  {
    question: 'What happens if the land has an existing mortgage?',
    answer:
      'You cannot buy mortgaged land unless the seller clears the mortgage before transfer. The lender must discharge the mortgage at the Lands Registry. If the seller promises to clear it "after" you pay, protect yourself: Require an undertaking letter from the seller\'s advocate, place funds in lawyer escrow, or structure payment to occur only after mortgage is cleared.',
  },
  {
    question: 'How much does a land survey cost in Kenya?',
    answer:
      'Professional land surveys cost KES 15,000–50,000 depending on land size and location. Small urban plots (< 0.5 acres) cost KES 15,000–25,000. Large agricultural land costs more. The surveyor confirms boundaries, identifies encroachments, and produces an official survey plan for transfer documentation. Always hire licensed surveyors only.',
  },
  {
    question: 'Can I buy land with a power of attorney?',
    answer:
      'Yes, but with caution. A General Power of Attorney (GPA) allows someone to act on your behalf. However, land purchases are sensitive—use a Special Power of Attorney (SPA) specific to that transaction. Verify the GPA/SPA is authentic at the High Court. For non-residents or diaspora Kenyans, SPA is common. Always use a qualified advocate to execute the process.',
  },
  {
    question: 'What is the difference between freehold and leasehold land in Kenya?',
    answer:
      'Freehold land is owned outright indefinitely. Leasehold land is rented from the government or private owner for a fixed term (typically 99 years). Freehold is preferred; it increases in value and transfers fully. Leasehold requires renewal after expiry (now easier under new laws). Check the title deed to confirm which type. Leasehold land with < 30 years remaining is risky.',
  },
  {
    question: 'What if the property boundary is disputed?',
    answer:
      'Do not proceed with purchase if boundaries are disputed. Commission a professional boundary survey to compare against Registry records. If neighbors dispute the boundary, require the seller to resolve it through court or mutual agreement before sale. Get written confirmation from the seller\'s advocate that no boundary disputes exist. This protects you from inheriting legal battles.',
  },
  {
    question: 'How do I verify land rates are paid in full?',
    answer:
      'Contact the county government Land Valuation office or search online (many counties have digital portals now). Request a Land Rates Certificate showing payment status. Unpaid rates become the buyer\'s liability. Require the seller to provide a clearance certificate or include rate clearance in the purchase agreement. Rates arrears can accumulate interest and penalties.',
  },
  {
    question: 'Can I buy off-plan land safely?',
    answer:
      'Off-plan purchases (land sold before development) carry higher risk. Verify the developer\'s registration with the National Treasury, check building permits from local authorities, and ensure all infrastructure licenses are current. Get a lawyer to review the project prospectus and booking agreement. Avoid cash payments—use escrow accounts. Many off-plan projects fail; prioritize established developers only.',
  },
];

const HowToBuyLandSafelyKenya: React.FC = () => {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    document.title = 'How to Buy Land Safely in Kenya - Complete Legal Due Diligence Guide 2026';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', 'Learn how to buy land safely in Kenya with our comprehensive legal due diligence guide. Avoid fraud, verify ownership, conduct registry searches & complete checklist.');
    }

    // Set meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', 'how to buy land in kenya, buy land safely kenya, steps to buy land kenya, documents needed to buy land, how to avoid land fraud kenya, fake title deed kenya, land buying checklist kenya, land due diligence kenya, verify land ownership kenya');

    // Set canonical tag
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.href);

    // Set OpenGraph tags
    const ogTags = [
      { property: 'og:title', content: 'How to Buy Land Safely in Kenya - Complete Legal Guide 2026' },
      { property: 'og:description', content: 'Step-by-step legal guide to buying land safely in Kenya. Avoid fraud, conduct due diligence, verify ownership, and complete your land purchase securely.' },
      { property: 'og:type', content: 'article' },
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

    // Set Twitter Card tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'How to Buy Land Safely in Kenya - Complete Legal Guide 2026' },
      { name: 'twitter:description', content: 'Learn the complete step-by-step process to buy land safely in Kenya with legal due diligence checklist and fraud prevention tips.' }
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

    // Set robots meta
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
          name: 'How to Buy Land Safely in Kenya',
          description: 'Step-by-step guide to safely purchasing land in Kenya with legal due diligence.',
          inLanguage: 'en-KE'
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: window.location.origin },
            { '@type': 'ListItem', position: 2, name: 'Land Law', item: `${window.location.origin}/land-laws` },
            { '@type': 'ListItem', position: 3, name: 'How to Buy Land Safely', item: window.location.href }
          ]
        },
        {
          '@type': 'FAQPage',
          mainEntity: faqsData.map(faq => ({
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
  }, []);

  const checklistItems: Checklist[] = [
    {
      item: 'Land Reference Number (LRN)',
      description: 'Unique identifier for the property at the Lands Registry. Find it on the title deed.',
    },
    {
      item: 'Current Title Deed (Original)',
      description: 'The legal ownership document. Must be original, with proper seals and signatures.',
    },
    {
      item: 'Lands Registry Search Certificate',
      description: 'Confirms ownership, encumbrances (mortgages, leases), and any legal disputes.',
    },
    {
      item: 'Zoning Certificate',
      description: 'From county government confirming land use restrictions (residential, commercial, agricultural).',
    },
    {
      item: 'Survey Plan',
      description: 'Official boundary map from a licensed surveyor. Must match Registry records.',
    },
    {
      item: 'Land Rates Clearance Certificate',
      description: 'Proof that property taxes are paid to date. From county valuation office.',
    },
    {
      item: 'Utility Clearance Certificates',
      description: 'Proof that water, electricity, sewerage bills are settled (if applicable).',
    },
    {
      item: 'Land Control Board Consent',
      description: 'Required for Group Land or Customary Land. Proof of LCB approval.',
    },
    {
      item: 'Environmental Compliance Certificate',
      description: 'For commercial/industrial land. Confirms NEMA environmental clearance.',
    },
    {
      item: 'Title Insurance (Optional)',
      description: 'Protects against hidden defects or claims. Increasingly recommended for safe purchases.',
    },
  ];

  const redFlags = [
    'Seller refuses a Lands Registry search',
    'Title deed shows signs of forgery or alterations',
    'Seller demands cash payment upfront',
    'Land has an active mortgage that seller won\'t clear',
    'Boundary disputes with neighboring properties',
    'Zoning restrictions that conflict with intended use',
    'Unpaid land rates or utility bills',
    'Multiple title deeds for the same property',
    'Seller cannot produce original title deed',
    'Property is in an active land dispute at court',
    'Agent or seller pressures you to decide quickly',
    'Price is significantly below market value',
  ];

  const buyingSteps = [
    {
      step: 1,
      title: 'Identify Property & Verify Location',
      description:
        'Research properties in your target area. Verify location with GPS coordinates. Check land size, frontage, and access roads. Visit the property physically multiple times (day and night). Confirm neighboring land use.',
      icon: <MapPin className="w-8 h-8 text-amber-600" />,
      details: ['Visit property multiple times', 'Check neighborhood development', 'Verify GPS coordinates', 'Confirm road access quality'],
    },
    {
      step: 2,
      title: 'Conduct Lands Registry Search',
      description:
        'Visit the Lands Registry office or use online portals. Provide the Land Reference Number (LRN). Request a comprehensive search including encumbrances (mortgages, leases, easements). Get an official search certificate.',
      icon: <Search className="w-8 h-8 text-amber-600" />,
      details: ['Get LRN from seller', 'Search for mortgages', 'Check for easements', 'Verify no legal disputes'],
    },
    {
      step: 3,
      title: 'Verify Ownership & Title Deed',
      description:
        'Examine the original title deed. Cross-reference owner name with national ID. Check for security features (holograms, watermarks, serial numbers). Compare deed description with Registry search. Confirm last transfer was legitimate.',
      icon: <FileCheck className="w-8 h-8 text-amber-600" />,
      details: ['Verify security features', 'Check owner\'s ID', 'Compare with Registry', 'Look for alterations'],
    },
    {
      step: 4,
      title: 'Hire Licensed Surveyor',
      description:
        'Engage a surveyor from the Board of Surveyors of Kenya. Commission a fresh boundary survey. Confirm land size matches deed description. Identify any encroachments. Produce official survey plan for transfer documentation.',
      icon: <Eye className="w-8 h-8 text-amber-600" />,
      details: ['Hire licensed surveyor', 'Confirm boundaries', 'Check for encroachments', 'Get official survey plan'],
    },
    {
      step: 5,
      title: 'Get Zoning & Land Rates Certificates',
      description:
        'Contact county government for zoning certificate. Confirm land use restrictions match your intended purpose. Request Land Rates Certificate from valuation office. Verify rates are paid to date. Check for any arrears.',
      icon: <Building2 className="w-8 h-8 text-amber-600" />,
      details: ['Confirm zoning compatibility', 'Check rates payment status', 'Verify no arrears exist', 'Get county certificates'],
    },
    {
      step: 6,
      title: 'Hire Qualified Advocate',
      description:
        'Engage a lawyer registered with the Law Society of Kenya. Advocate conducts due diligence review. Negotiates purchase terms. Prepares sale agreement. Ensures legal compliance. Handles transfer documentation and registration.',
      icon: <Briefcase className="w-8 h-8 text-amber-600" />,
      details: ['Find Law Society verified lawyer', 'Review purchase agreement', 'Negotiate terms', 'Plan transfer strategy'],
    },
    {
      step: 7,
      title: 'Negotiate & Draft Sale Agreement',
      description:
        'Agree on price, payment schedule, and conditions. Include contingencies for searches and inspections. Define transfer date and responsibilities. Include clear dispute resolution clauses. Specify down payment amount and safety provisions.',
      icon: <DollarSign className="w-8 h-8 text-amber-600" />,
      details: ['Agree on final price', 'Set payment schedule', 'Include contingencies', 'Define dispute resolution'],
    },
    {
      step: 8,
      title: 'Arrange Safe Payment & Documentation',
      description:
        'Never give cash directly. Use lawyer escrow accounts or bank transfers. Require mortgage clearance before final payment. Get undertaking letters from seller\'s advocate. Ensure seller is prepared for Land Transfer Registry lodgment.',
      icon: <Lock className="w-8 h-8 text-amber-600" />,
      details: ['Use lawyer escrow', 'Get bank transfers', 'Require clear documents', 'Confirm mortgage clearance'],
    },
    {
      step: 9,
      title: 'Lodging at Land Transfer Registry',
      description:
        'Your advocate lodges transfer documents at the Land Registry. Include: signed transfer deed, ID copies, survey plan, search certificate, rates clearance. Registry processes transfer over 4–8 weeks. Pay lodgment fees (typically 1.5% of property value).',
      icon: <Zap className="w-8 h-8 text-amber-600" />,
      details: ['Prepare all documents', 'Pay lodgment fees', 'Track registration status', 'Monitor processing'],
    },
    {
      step: 10,
      title: 'Collect New Title & Complete Transfer',
      description:
        'Once Registry issues new title deed in your name, collect it with your advocate. Verify all details are correct. Register the property in your preferred name. Update your insurance records. Keep certified copies in safe storage.',
      icon: <CheckCircle className="w-8 h-8 text-amber-600" />,
      details: ['Collect new title', 'Verify all details', 'Register ownership', 'Secure documentation'],
    },
  ];

  const costBreakdown = [
    { category: 'Land Survey', costRange: 'KES 15,000 – 50,000', details: 'Depends on land size; larger properties cost more' },
    { category: 'Lands Registry Search', costRange: 'KES 500 – 1,500', details: 'Official search certificate from Registry' },
    { category: 'Lawyer Fees', costRange: 'KES 30,000 – 100,000+', details: 'Depends on property value and complexity' },
    { category: 'Title Deed Transfer', costRange: '1.5% of property value', details: 'Paid to Land Registry during lodgment' },
    { category: 'Stamp Duty', costRange: '5% of property value', details: 'Payable on the transfer deed (or exempted if <5M)' },
    { category: 'County Charges', costRange: 'KES 5,000 – 20,000', details: 'Zoning cert, valuation cert, and misc charges' },
    { category: 'Surveyor Plan Registration', costRange: 'KES 5,000 – 15,000', details: 'Costs to register new survey plan at Registry' },
    { category: 'Property Valuation', costRange: 'KES 20,000 – 100,000', details: 'Optional but recommended; affects stamp duty calculations' },
  ];

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        {/* Breadcrumb Navigation */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2 text-sm">
            <Link to="/" className="text-amber-600 hover:text-amber-700">
              Home
            </Link>
            <ChevronDown className="w-4 h-4 text-gray-400 rotate-270" />
            <span className="text-gray-600">How to Buy Land Safely</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white py-12 md:py-16">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-start gap-4">
              <Home className="w-12 h-12 flex-shrink-0 mt-1" />
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-3">How to Buy Land Safely in Kenya</h1>
                <p className="text-lg md:text-xl text-amber-100">
                  Complete Step-by-Step Legal & Due Diligence Guide 2026
                </p>
                <p className="text-amber-50 mt-3 text-base">
                  Master the essential steps to avoid fraud, verify ownership, and secure your land purchase with confidence.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="content-full-width">
          <div className="max-w-5xl mx-auto px-0 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sticky Table of Contents */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 bg-white rounded-lg shadow-md p-4 h-fit">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Table of Contents</h3>
                <nav className="space-y-2 text-sm">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'scams', label: 'Common Scams' },
                    { id: 'process', label: 'Buying Process' },
                    { id: 'documents', label: 'Documents Checklist' },
                    { id: 'verify', label: 'Verify Title' },
                    { id: 'search', label: 'Registry Search' },
                    { id: 'roles', label: 'Professional Roles' },
                    { id: 'redflags', label: 'Red Flags' },
                    { id: 'special', label: 'Special Cases' },
                    { id: 'costs', label: 'Costs & Fees' },
                    { id: 'foreigner', label: 'Foreigners & Diaspora' },
                    { id: 'faqs', label: 'FAQs' },
                  ].map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveSection(item.id);
                        document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`block px-2 py-2 rounded transition ${
                        activeSection === item.id
                          ? 'bg-amber-100 text-amber-700 font-semibold'
                          : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
                      }`}
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Overview Section */}
              <section id="overview" className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-8 h-8 text-amber-600" />
                  Why Buying Land in Kenya Requires Due Diligence
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Land is one of the most significant investments Kenyans make, yet land fraud remains a persistent challenge.
                    Thousands of Kenyans lose money annually to forged title deeds, double sales, and disputed ownership. The risks
                    are real:
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li className="flex gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>
                        <strong>Forged title deeds</strong> – Criminals produce convincing fake documents that fool even experienced
                        buyers
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>
                        <strong>Double sales</strong> – The same land sold to multiple buyers by unscrupulous sellers
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>
                        <strong>Hidden mortgages</strong> – Land with existing bank loans that you inherit after purchase
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>
                        <strong>Boundary disputes</strong> – Conflicting ownership claims with neighbors leading to court battles
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>
                        <strong>Zoning violations</strong> – Purchasing land you cannot use as intended due to government restrictions
                      </span>
                    </li>
                  </ul>
                  <p className="mt-4">
                    This comprehensive guide walks you through each step to buy land safely, verify ownership, conduct legal searches,
                    and protect yourself from fraud. Follow this checklist religiously.
                  </p>
                </div>
              </section>

              {/* Common Scams Section */}
              <section id="scams" className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                  Common Land Scams & Fraud Tactics
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        title: 'Fake Title Deeds',
                        description:
                          'Sophisticated forged documents with correct watermarks, serial numbers, and Registry seals. Detected only through Registry cross-check.',
                      },
                      {
                        title: 'Double Sales',
                        description:
                          'Same land sold to multiple buyers by conniving sellers or agents. Usually discovered only after lodging transfer at Registry.',
                      },
                      {
                        title: 'Mortgaged Land Sales',
                        description:
                          'Seller transfers land without clearing existing bank mortgage. New owner inherits the debt and may lose the property.',
                      },
                      {
                        title: 'Boundary Switching',
                        description:
                          'Seller deliberately misrepresents boundaries. You discover the actual land is smaller or includes neighbors\' property.',
                      },
                      {
                        title: 'Impersonation Fraud',
                        description:
                          'Criminal impersonates legal owner using forged ID. Documents are signed fraudulently, transfer is later challenged.',
                      },
                      {
                        title: 'Commission Scams',
                        description:
                          'Fake agents demand commission upfront before finding property. They disappear after payment with no follow-up.',
                      },
                      {
                        title: 'Land Control Board Tricks',
                        description:
                          'Seller claims LCB consent is obtained, but transfer fails at Registry because consent was never given.',
                      },
                      {
                        title: 'Zoning Misrepresentation',
                        description:
                          'Seller claims land is residential when it\'s actually commercial-only or agricultural, preventing your intended use.',
                      },
                    ].map((scam, idx) => (
                      <div key={idx} className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h4 className="font-bold text-red-900 mb-2">{scam.title}</h4>
                        <p className="text-red-800 text-sm">{scam.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Step-by-Step Process */}
              <section id="process" className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Zap className="w-8 h-8 text-amber-600" />
                  Step-by-Step Safe Land Buying Process
                </h2>
                <div className="space-y-6">
                  {buyingSteps.map((step, idx) => (
                    <div key={idx} className="flex gap-4 pb-6 border-b border-gray-200 last:border-b-0">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-amber-100">
                          {step.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900 mb-1">
                          Step {step.step}: {step.title}
                        </h4>
                        <p className="text-gray-700 mb-3">{step.description}</p>
                        <div className="bg-amber-50 rounded-lg p-3">
                          <ul className="text-sm text-gray-700 space-y-1">
                            {step.details.map((detail, didx) => (
                              <li key={didx} className="flex gap-2">
                                <CheckCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Documents Checklist */}
              <section id="documents" className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileCheck className="w-8 h-8 text-amber-600" />
                  Documents Checklist Before Purchase
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-amber-100 border border-amber-300">
                        <th className="px-4 py-3 text-left font-bold text-gray-900">Document</th>
                        <th className="px-4 py-3 text-left font-bold text-gray-900">Purpose</th>
                      </tr>
                    </thead>
                    <tbody>
                      {checklistItems.map((item, idx) => (
                        <tr key={idx} className={`border ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                          <td className="px-4 py-3 font-semibold text-gray-900">{item.item}</td>
                          <td className="px-4 py-3 text-gray-700">{item.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Verify Title Deed */}
              <section id="verify" className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Eye className="w-8 h-8 text-amber-600" />
                  How to Verify a Title Deed
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    A title deed is the legal proof of land ownership in Kenya. Here's how to verify it's genuine:
                  </p>
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-6 space-y-4">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">1. Check Physical Features</h4>
                      <ul className="text-gray-700 space-y-1 ml-4 text-sm">
                        <li>
                          • <strong>Security features</strong> – Look for holographic watermarks and tamper-evident seals
                        </li>
                        <li>
                          • <strong>Serial number</strong> – Verify with Lands Registry database that it's unique
                        </li>
                        <li>
                          • <strong>Registry seal</strong> – Should be crisp and clearly visible
                        </li>
                        <li>
                          • <strong>Registry officer signature</strong> – Must be legible and match Registry records
                        </li>
                        <li>
                          • <strong>No alterations</strong> – Check for overwriting, scratching, or suspicious amendments
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">2. Cross-Reference with Registry</h4>
                      <ul className="text-gray-700 space-y-1 ml-4 text-sm">
                        <li>
                          • Visit the <strong>Lands Registry office</strong> in person (don't rely on photocopy)
                        </li>
                        <li>
                          • Request <strong>official Registry records</strong> for the property
                        </li>
                        <li>
                          • Compare deed description, boundaries, and owner name
                        </li>
                        <li>
                          • Check for <strong>encumbrances</strong> (mortgages, leases, easements)
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">3. Verify Ownership Chain</h4>
                      <ul className="text-gray-700 space-y-1 ml-4 text-sm">
                        <li>
                          • Check last 2–3 transfers are documented at Registry
                        </li>
                        <li>
                          • Verify seller's name matches current deed
                        </li>
                        <li>
                          • Confirm no gap between when seller acquired and selling (indicates possible fraud)
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">4. Hire Your Lawyer to Verify</h4>
                      <ul className="text-gray-700 space-y-1 ml-4 text-sm">
                        <li>
                          • Your advocate will conduct <strong>official searches</strong> at the Registry
                        </li>
                        <li>
                          • They have access to check historical transfers and any disputes
                        </li>
                        <li>
                          • They'll identify red flags you might miss
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Registry Search */}
              <section id="search" className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Search className="w-8 h-8 text-amber-600" />
                  How to Conduct a Land Registry Search
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    A Lands Registry search is your most important tool to verify ownership and identify hidden liabilities. Here's how
                    to do it:
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                    <h4 className="font-bold text-gray-900">What the Search Reveals:</h4>
                    <ul className="text-gray-700 text-sm space-y-1 ml-4">
                      <li>✓ Current registered owner</li>
                      <li>✓ Property description and boundaries</li>
                      <li>✓ Active mortgages or loans (encumbrances)</li>
                      <li>✓ Leases or easements</li>
                      <li>✓ Court orders or caveats</li>
                      <li>✓ Land Control Board restrictions</li>
                      <li>✓ Any pending disputes</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">How to Conduct a Search:</h4>
                    <ol className="text-gray-700 space-y-2 ml-4 text-sm">
                      <li>
                        <strong>1. Get the Land Reference Number (LRN)</strong> – Ask seller for title deed. LRN is written on it.
                      </li>
                      <li>
                        <strong>2. Visit Lands Registry office or use online portal</strong> – Many county registries now have digital
                        searches. Go to <strong>app.lands.go.ke</strong> if available.
                      </li>
                      <li>
                        <strong>3. Submit the LRN</strong> – Provide exact LRN to avoid wrong results.
                      </li>
                      <li>
                        <strong>4. Pay search fee</strong> – Typically KES 500–1,500 depending on property type.
                      </li>
                      <li>
                        <strong>5. Request comprehensive search certificate</strong> – Ensure you get full details, not summary.
                      </li>
                      <li>
                        <strong>6. Review results carefully</strong> – Check for any red flags like mortgages, disputes, or restrictions.
                      </li>
                    </ol>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-900 font-semibold mb-2">⚠️ Red Flags in Registry Search:</p>
                    <ul className="text-red-800 text-sm space-y-1 ml-4">
                      <li>• Active mortgage or charge</li>
                      <li>• Caveat or court order against property</li>
                      <li>• Multiple parties with interest</li>
                      <li>• Land Control Board restriction</li>
                      <li>• Discrepancy between deed and Registry records</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Professional Roles */}
              <section id="roles" className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-8 h-8 text-amber-600" />
                  Role of Lawyers, Surveyors & Agents
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      role: 'Advocate (Lawyer)',
                      responsibility:
                        'Conducts legal due diligence, reviews all documents, negotiates terms, prepares sale agreement, handles Registry searches, oversees transfer registration, and protects your legal interests throughout the process.',
                      cost: 'KES 30,000 – 100,000+',
                    },
                    {
                      role: 'Licensed Surveyor',
                      responsibility:
                        'Confirms land boundaries, identifies encroachments, measures land area, produces official survey plan, and verifies land description matches Registry records.',
                      cost: 'KES 15,000 – 50,000',
                    },
                    {
                      role: 'Property Valuer',
                      responsibility:
                        'Assesses market value of property, determines stamp duty obligations, and provides valuation report for loan/mortgage purposes.',
                      cost: 'KES 20,000 – 100,000',
                    },
                    {
                      role: 'Real Estate Agent',
                      responsibility:
                        'Connects buyers and sellers, provides market information, arranges property viewing, and facilitates negotiation (NOT a replacement for lawyer).',
                      cost: 'Commission (typically 5% of purchase price)',
                    },
                  ].map((prof, idx) => (
                    <div key={idx} className="bg-amber-50 border border-amber-300 rounded-lg p-4">
                      <h4 className="font-bold text-gray-900 mb-2">{prof.role}</h4>
                      <p className="text-gray-700 text-sm mb-3">{prof.responsibility}</p>
                      <p className="text-amber-700 font-semibold text-sm">Cost: {prof.cost}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Red Flags */}
              <section id="redflags" className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                  Red Flags to Avoid
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {redFlags.map((flag, idx) => (
                    <div key={idx} className="flex gap-3 bg-red-50 p-3 rounded-lg border border-red-200">
                      <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-red-900 text-sm">{flag}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-red-100 border-l-4 border-red-600 rounded">
                  <p className="text-red-900 font-semibold">
                    ⛔ If you spot ANY of these red flags, STOP and do NOT proceed with the purchase. Consult your advocate immediately.
                  </p>
                </div>
              </section>

              {/* Special Cases */}
              <section id="special" className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 className="w-8 h-8 text-amber-600" />
                  Special Cases
                </h2>
                <div className="space-y-4">
                  <div className="border-l-4 border-amber-600 pl-4 py-2">
                    <h4 className="font-bold text-gray-900 mb-2">Buying Family Land</h4>
                    <p className="text-gray-700 text-sm">
                      Even from family, conduct full Registry search. Family land often has disputes or is co-owned by multiple parties.
                      Get written family consent before proceeding. Require the seller to clear any mortgages or debts. Use a formal
                      purchase agreement even within family.
                    </p>
                  </div>
                  <div className="border-l-4 border-amber-600 pl-4 py-2">
                    <h4 className="font-bold text-gray-900 mb-2">Buying Company Land</h4>
                    <p className="text-gray-700 text-sm">
                      Verify the company is registered with CIRC (Companies Registrar). Check company financial status and any debts.
                      Require board resolution authorizing the sale. Verify the signatory has authority. This purchase is more complex
                      and requires additional scrutiny.
                    </p>
                  </div>
                  <div className="border-l-4 border-amber-600 pl-4 py-2">
                    <h4 className="font-bold text-gray-900 mb-2">Buying Off-Plan Plots</h4>
                    <p className="text-gray-700 text-sm">
                      Off-plan (land sold before development) carries higher risk. Verify developer registration with National Treasury.
                      Check building permits from local authority. Ensure infrastructure licenses are current. Get a lawyer to review
                      the project prospectus. Use escrow accounts—never pay cash directly to developer.
                    </p>
                  </div>
                  <div className="border-l-4 border-amber-600 pl-4 py-2">
                    <h4 className="font-bold text-gray-900 mb-2">Buying Agricultural Land</h4>
                    <p className="text-gray-700 text-sm">
                      Verify zoning is agricultural (not converted to residential). Check soil quality and water rights. Confirm no
                      environmental restrictions. Verify county council has not earmarked for public projects. Agricultural land may
                      have different transfer procedures depending on county.
                    </p>
                  </div>
                </div>
              </section>

              {/* Costs & Fees */}
              <section id="costs" className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="w-8 h-8 text-amber-600" />
                  Estimated Costs & Fees
                </h2>
                <div className="overflow-x-auto mb-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-amber-100 border border-amber-300">
                        <th className="px-4 py-3 text-left font-bold text-gray-900">Cost Category</th>
                        <th className="px-4 py-3 text-left font-bold text-gray-900">Amount</th>
                        <th className="px-4 py-3 text-left font-bold text-gray-900">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {costBreakdown.map((cost, idx) => (
                        <tr key={idx} className={`border ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                          <td className="px-4 py-3 font-semibold text-gray-900">{cost.category}</td>
                          <td className="px-4 py-3 text-amber-700 font-bold">{cost.costRange}</td>
                          <td className="px-4 py-3 text-gray-700">{cost.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-gray-700 text-sm">
                    <strong>Example:</strong> For a KES 2,000,000 property:
                    <br />
                    Survey: ~KES 25,000 | Lawyer: ~KES 50,000 | Stamp Duty (5%): ~KES 100,000 | Transfer (1.5%): ~KES 30,000 |
                    Registry/County fees: ~KES 15,000
                    <br />
                    <strong>Total approximate costs: KES 220,000 (11% of purchase price)</strong>
                  </p>
                </div>
              </section>

              {/* Foreigners & Diaspora */}
              <section id="foreigner" className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Globe className="w-8 h-8 text-amber-600" />
                  Buying Land as a Foreigner or Diaspora Kenyan
                </h2>
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-bold text-gray-900 mb-2">Foreign Nationals</h4>
                    <ul className="text-gray-700 text-sm space-y-2 ml-4">
                      <li>
                        • <strong>CANNOT buy</strong> land in Nairobi, Mombasa, and other restricted urban areas
                      </li>
                      <li>
                        • Can buy in rural/agricultural areas outside restricted zones
                      </li>
                      <li>
                        • <strong>Exemption:</strong> 7+ years continuous residency in Kenya allows urban property purchase
                      </li>
                      <li>
                        • Must obtain approval from the Attorney General's office (for security-sensitive land)
                      </li>
                      <li>
                        • May require tax identification number (PIN) and bank account
                      </li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-bold text-gray-900 mb-2">Diaspora Kenyans</h4>
                    <ul className="text-gray-700 text-sm space-y-2 ml-4">
                      <li>
                        • Can buy land anywhere in Kenya (fewer restrictions than foreign nationals)
                      </li>
                      <li>
                        • Must provide valid Kenyan passport or national ID
                      </li>
                      <li>
                        • Can use Power of Attorney (POA) if not present in Kenya
                      </li>
                      <li>
                        • Should use Special Power of Attorney (SPA) specific to property transaction
                      </li>
                      <li>
                        • Verify POA/SPA at High Court Registry
                      </li>
                      <li>
                        • Consider hiring lawyer to manage process remotely
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* FAQs */}
              <section id="faqs" className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Briefcase className="w-8 h-8 text-amber-600" />
                  Frequently Asked Questions
                </h2>
                <div className="space-y-3">
                  {faqsData.map((faq, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleFAQ(idx)}
                        className="w-full px-4 py-4 flex items-center justify-between bg-amber-50 hover:bg-amber-100 transition"
                      >
                        <span className="text-left font-semibold text-gray-900">{faq.question}</span>
                        {expandedFAQ === idx ? (
                          <ChevronUp className="w-5 h-5 text-amber-600 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-amber-600 flex-shrink-0" />
                        )}
                      </button>
                      {expandedFAQ === idx && (
                        <div className="px-4 py-4 bg-white border-t border-gray-200">
                          <p className="text-gray-700 text-sm">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* CTA Section */}
              <section className="bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg shadow-md p-6 md:p-8">
                <h3 className="text-2xl font-bold mb-4">Ready to Buy Land Safely?</h3>
                <p className="mb-6">
                  Use this comprehensive guide to conduct due diligence and protect your land investment. If you're unsure about any
                  step, consult a qualified advocate immediately.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="bg-white text-amber-700 font-bold py-3 px-4 rounded-lg hover:bg-amber-50 transition flex items-center justify-center gap-2">
                    <Search className="w-5 h-5" />
                    Start Land Search
                  </button>
                  <button className="bg-white text-amber-700 font-bold py-3 px-4 rounded-lg hover:bg-amber-50 transition flex items-center justify-center gap-2">
                    <FileCheck className="w-5 h-5" />
                    Download Checklist
                  </button>
                  <button className="bg-white text-amber-700 font-bold py-3 px-4 rounded-lg hover:bg-amber-50 transition flex items-center justify-center gap-2">
                    <Phone className="w-5 h-5" />
                    Get Legal Help
                  </button>
                </div>
              </section>

              {/* Internal Links Section */}
              <section className="bg-gray-50 rounded-lg shadow-md p-6 md:p-8 mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Related Land Law Resources</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link
                    to="/land-ownership-title-deed-verification-kenya"
                    className="block p-4 bg-white border border-amber-300 rounded-lg hover:shadow-lg transition"
                  >
                    <div className="flex items-start gap-3">
                      <Home className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Land Ownership & Title Deed Verification</h4>
                        <p className="text-gray-600 text-sm">Comprehensive guide to verifying land ownership and title deeds in Kenya</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" />
                    </div>
                  </Link>
                  <Link
                    to="/land-transfer-process-kenya"
                    className="block p-4 bg-white border border-amber-300 rounded-lg hover:shadow-lg transition"
                  >
                    <div className="flex items-start gap-3">
                      <Home className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Land Transfer Process in Kenya</h4>
                        <p className="text-gray-600 text-sm">Step-by-step guide to transferring land title in Kenya with all procedures</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" />
                    </div>
                  </Link>
                  <Link
                    to="/succession-inheritance-law-kenya"
                    className="block p-4 bg-white border border-amber-300 rounded-lg hover:shadow-lg transition"
                  >
                    <div className="flex items-start gap-3">
                      <Home className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Succession & Inheritance Law in Kenya</h4>
                        <p className="text-gray-600 text-sm">Guide to legal succession, wills, and inheritance rights in Kenya</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" />
                    </div>
                  </Link>
                  <div className="p-4 bg-white border border-amber-300 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Home className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Land Disputes & Resolution</h4>
                        <p className="text-gray-600 text-sm">Coming soon – Guide to resolving land disputes and legal remedies in Kenya</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToBuyLandSafelyKenya;
