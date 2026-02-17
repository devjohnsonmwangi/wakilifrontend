import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  ChevronUp,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  FileText,
  Clock,
  Shield,
  TrendingUp,
  ArrowRight,
  Search,
  Building2
} from 'lucide-react';

const faqs = [
  {
    question: 'What is the difference between eCitizen and physical registration?',
    answer: 'eCitizen is Kenya\'s online portal for government services, including business registration. It is faster, cheaper, and more transparent than physical registration. You can register your business entirely online, receive approvals digitally, and access documents online. Physical registration at the Registrar\'s office is no longer the main method.'
  },
  {
    question: 'How long does business registration take on eCitizen?',
    answer: 'Business registration on eCitizen typically takes 1-3 business days. Name search and reservation takes a few minutes, while the complete registration process (search, reservation, forms submission, and approval) takes 1-3 days depending on document verification.'
  },
  {
    question: 'Can I register a business with any name?',
    answer: 'No. Your business name must be unique and not identical or similar to existing registered businesses. You must conduct a business name search on eCitizen first to check availability, then reserve the name (which is free and valid for 6 months).'
  },
  {
    question: 'What is the cheapest business structure to register in Kenya?',
    answer: 'Sole Proprietorship is the cheapest to register, costing KES 500 (or sometimes free on eCitizen). Partnerships cost slightly more (KES 1,000), while Limited Companies cost KES 5,000-10,000 depending on the service center and any additional features.'
  },
  {
    question: 'Do I need a lawyer to register a business in Kenya?',
    answer: 'For simple businesses like sole proprietorships, you can register without a lawyer. However, for Limited Companies, partnerships, or complex business structures, hiring a lawyer is recommended to ensure compliance with the Companies Act and proper documentation.'
  },
  {
    question: 'What documents do I need for business registration?',
    answer: 'You typically need: (1) National ID or passport, (2) PIN certificate or KRA PIN, (3) Proof of residence, (4) Business plan or description, (5) ID/details of directors and shareholders (for limited companies), (6) Certificate of Search or business name reservation. Specific requirements vary by business type.'
  },
  {
    question: 'Can I register a business online as a foreigner?',
    answer: 'Yes, foreigners can register businesses in Kenya, but with additional requirements. You may need a valid passport, visa/work permit, and possibly an Alien Certificate of Registration from immigration. Some business structures (like sole proprietorship) have restrictions for non-citizens.'
  },
  {
    question: 'How do I get a KRA PIN for my new business?',
    answer: 'You can apply for a KRA PIN online on the KRA eCitizen portal or visit a KRA office with your business registration certificate and national ID. The process is free and can be completed within a few hours. See /kra-pin-for-business-kenya for detailed steps.'
  },
  {
    question: 'Is business registration on eCitizen safe and secure?',
    answer: 'Yes. eCitizen uses secure encryption, requires two-factor authentication, and is an official government platform. Your documents are stored securely, and you receive digital certificates and approvals that are legally valid.'
  },
  {
    question: 'What happens after I register my business?',
    answer: 'After registration, you should: (1) Get a KRA PIN, (2) Register with NHIF/NSSF if you have employees, (3) Get business permits/licenses if required (varies by business type), (4) Open a business bank account, (5) Keep up with annual returns (for limited companies), (6) Comply with tax obligations.'
  },
  {
    question: 'Can I change my business name after registration?',
    answer: 'Yes, you can change your business name by filing a change of business name form with the Registrar. For sole proprietorships, you can do this online on eCitizen. For companies, you need shareholder approval and must file the change officially. There may be minimal costs involved.'
  },
  {
    question: 'What is a CR12 and when do I need it?',
    answer: 'A CR12 (Certificate of Registration) is issued after your company is registered. It is your proof of legal business existence. You need it to open a bank account, apply for licenses, and conduct official business. For sole proprietorships, you get a Certificate of Business Registration instead.'
  },
  {
    question: 'How much does it cost to register a business in Kenya 2025?',
    answer: 'Costs vary: Sole Proprietorship: KES 500-1,000 | Partnership: KES 1,000-2,000 | Limited Company: KES 5,000-10,000 | Name search/reservation: Free-500 | Additional services/legal help: KES 2,000-10,000. Total budget: KES 5,000-20,000 for a complete setup including all requirements.'
  },
  {
    question: 'What is the difference between Sole Proprietorship and Limited Company?',
    answer: 'Sole Proprietorship: You own and operate the business alone, unlimited personal liability, simple to register, cheaper. Limited Company: Multiple shareholders possible, limited personal liability (company\'s debts don\'t affect personal assets), more complex registration and ongoing compliance, slightly more expensive. See /sole-proprietorship-registration-kenya vs /limited-company-registration-kenya.'
  },
  {
    question: 'Can I register a business part-time or as a side hustle?',
    answer: 'Yes, absolutely. You can register a sole proprietorship or partnership for any type of business, part-time or full-time. The registration process is the same. However, you must still comply with tax laws and file annual returns if required by your business structure.'
  }
];

const businessTypes = [
  {
    type: 'Sole Proprietorship',
    description: 'You own and operate the business alone. Simplest and cheapest option.',
    cost: 'KES 500-1,000',
    time: '1-2 days',
    liability: 'Unlimited personal liability',
    link: '/sole-proprietorship-registration-kenya'
  },
  {
    type: 'Partnership',
    description: 'Two or more people own the business together. Shared responsibility and profits.',
    cost: 'KES 1,000-2,000',
    time: '2-3 days',
    liability: 'General partners have unlimited liability',
    link: '/partnership-registration-kenya'
  },
  {
    type: 'Limited Company',
    description: 'Separate legal entity owned by shareholders. Most formal and professional option.',
    cost: 'KES 5,000-10,000',
    time: '3-5 days',
    liability: 'Limited liability for shareholders',
    link: '/limited-company-registration-kenya'
  },
  {
    type: 'NGO / Society',
    description: 'Non-profit organization. For charitable, social, or community purposes.',
    cost: 'KES 3,000-5,000',
    time: '5-7 days',
    liability: 'Limited liability',
    link: '/ngo-registration-kenya'
  }
];

const registrationSteps = [
  {
    step: 1,
    title: 'Create eCitizen Account',
    description: 'Go to www.ecitizen.go.ke and register for an account using your email and phone number. Verify your email and set up two-factor authentication for security. This is your gateway to all government services.'
  },
  {
    step: 2,
    title: 'Search & Reserve Business Name',
    description: 'Log in and search for your desired business name (Business Registration Act, Section 5). If available, reserve it for KES 500 or free (varies). The reservation is valid for 6 months. See /business-name-search-kenya for detailed steps.'
  },
  {
    step: 3,
    title: 'Choose Business Type',
    description: 'Decide whether you want to register as a Sole Proprietor, Partnership (Partnership Act), Limited Company (Companies Act 2015), or NGO/Society. Each has different legal requirements and ongoing compliance obligations.'
  },
  {
    step: 4,
    title: 'Gather Required Documents',
    description: 'Prepare your national ID/passport (Business Registration Act, Section 4), proof of residence, PIN certificate, and documents relevant to your business type. Have digital copies ready for upload as specified by BRELA regulations.'
  },
  {
    step: 5,
    title: 'Fill Registration Form',
    description: 'Complete the eCitizen registration form with accurate business details, owner information (Business Registration Act, Section 6), business description, and location. False information can lead to cancellation of registration.'
  },
  {
    step: 6,
    title: 'Upload Documents & Pay',
    description: 'Upload all required documents as PDFs (BRELA digital framework). Pay the registration fee online via M-Pesa, bank transfer, or credit card. Payment confirmation is instant and required before processing.'
  },
  {
    step: 7,
    title: 'Verification & Approval',
    description: 'BRELA or the Registrar verifies your documents and information under the Business Registration Act. You receive email updates on your application status. Approval usually takes 1-3 business days.'
  },
  {
    step: 8,
    title: 'Receive Certificate',
    description: 'Download your Certificate of Registration (CR12 for companies under Companies Act Section 30, or Business Registration Certificate for sole proprietorship). This is your legal proof of business existence and is required for opening bank accounts and obtaining licenses.'
  }
];

const requiredDocuments = {
  'Sole Proprietorship': [
    'National ID or passport (Business Registration Act, Section 4)',
    'Proof of residence (utility bill, lease agreement) (Section 6)',
    'PIN certificate or KRA PIN (Income Tax Act requirement)',
    'Business plan or description (2-3 lines) (BRELA requirement)',
    'Identification details of owner (for verification)'
  ],
  'Partnership': [
    'National IDs of all partners (Partnership Act, Section 2)',
    'Proof of residence for each partner (Business Registration Act, Section 6)',
    'PIN certificate for each partner (Income Tax Act)',
    'Partnership agreement (drafted per Partnership Act, Section 3)',
    'Business plan (BRELA requirement)',
    'Identification details of all partners (for verification)'
  ],
  'Limited Company': [
    'National IDs of all directors and shareholders (Companies Act, Section 12)',
    'Proof of residence for each director (Companies Act, Section 15)',
    'PIN certificates for each director (Income Tax Act)',
    'Memorandum and Articles of Association (Companies Act, Section 13)',
    'Directors\' declaration (Companies Act, Section 19)',
    'Form CR1 (filed with BRELA) (Companies Act compliance)',
    'Business plan (BRELA requirement)',
    'Shareholder agreements (if multiple shareholders) (Companies Act, Section 140)'
  ]
};

const registrationFees = [
  { item: 'Business Name Search', cost: 'Free-KES 500' },
  { item: 'Business Name Reservation (optional)', cost: 'Free-KES 500' },
  { item: 'Sole Proprietorship Registration', cost: 'KES 500-1,000' },
  { item: 'Partnership Registration', cost: 'KES 1,000-2,000' },
  { item: 'Limited Company Registration', cost: 'KES 5,000-10,000' },
  { item: 'NGO/Society Registration', cost: 'KES 3,000-5,000' },
  { item: 'CR12 (Certificate of Registration)', cost: 'Included' },
  { item: 'KRA PIN Application', cost: 'Free' },
  { item: 'Legal/Professional Assistance (optional)', cost: 'KES 2,000-10,000' }
];

const HowToRegisterBusinessKenya: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<string>('overview');

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  useEffect(() => {
    const metaTitle = 'Register a Business in Kenya – eCitizen 2025 Guide';
    const metaDescription = 'Complete step-by-step guide to registering a business or company in Kenya using eCitizen. Includes costs, documents, and all business types.';
    const canonicalUrl = 'https://wakili.co.ke/how-to-register-business-kenya';

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
              "name": "Register Business in Kenya",
              "item": "https://wakili.co.ke/how-to-register-business-kenya"
            }
          ]
        },
        {
          "@type": "Organization",
          "name": "Business Registration Kenya Guide",
          "url": "https://wakili.co.ke/how-to-register-business-kenya",
          "description": "Official guide to registering businesses and companies in Kenya using eCitizen",
          "areaServed": "Kenya"
        },
        {
          "@type": "WebSite",
          "url": "https://wakili.co.ke",
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://wakili.co.ke/how-to-register-business-kenya?search={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        },
        {
          "@type": "HowTo",
          "name": "How to Register a Business in Kenya",
          "step": registrationSteps.map((s) => ({
            "@type": "HowToStep",
            "position": s.step,
            "name": s.title,
            "text": s.description
          }))
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
        'legal-framework',
        'business-types',
        'requirements',
        'steps',
        'name-search',
        'documents',
        'fees',
        'timeline',
        'after-registration',
        'mistakes',
        'lawyer',
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
              <span className="text-gray-900">Register Business in Kenya</span>
            </nav>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">How to Register a Business or Company in Kenya</h1>
            <p className="text-lg sm:text-xl text-indigo-100 max-w-3xl">Complete step-by-step guide to registering your business on eCitizen with all costs, requirements, and types explained.</p>
          </div>
        </div>

        <div className="content-full-width">
        <div className="max-w-7xl mx-auto px-0 sm:px-4 md:px-8 py-12">
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
                      { id: 'legal-framework', label: 'Legal Framework', icon: Shield },
                      { id: 'business-types', label: 'Business Types', icon: Building2 },
                      { id: 'requirements', label: 'Requirements', icon: CheckCircle2 },
                      { id: 'steps', label: 'Registration Steps', icon: ArrowRight },
                      { id: 'name-search', label: 'Name Search', icon: Search },
                      { id: 'documents', label: 'Documents', icon: FileText },
                      { id: 'fees', label: 'Fees & Costs', icon: DollarSign },
                      { id: 'timeline', label: 'Timeline', icon: Clock },
                      { id: 'after-registration', label: 'After Registration', icon: CheckCircle2 },
                      { id: 'mistakes', label: 'Mistakes to Avoid', icon: AlertCircle },
                      { id: 'lawyer', label: 'When to Hire Lawyer', icon: Shield },
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
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Overview of Business Registration in Kenya</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-4 text-lg leading-relaxed">Registering a business in Kenya is now faster, cheaper, and easier than ever through <strong>eCitizen</strong>, Kenya's official online government portal. Whether you want to start as a <strong>sole proprietor</strong>, <strong>partnership</strong>, or <strong>limited company</strong>, this guide will walk you through every step. Business registration in Kenya is governed by the <strong>Business Registration Act</strong>, the <strong>Companies Act (2015)</strong>, and the <strong>Partnership Act</strong>, with all registrations now managed through <strong>BRELA (Business Registration and Licensing Authority)</strong> and accessed via eCitizen.</p>

                  <div className="bg-white rounded-xl shadow-md border-2 border-blue-200 p-8 mb-6">
                    <img 
                      src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop"
                      alt="Business registration process illustration showing eCitizen platform"
                      className="w-full h-auto rounded-lg mb-4 border border-gray-200"
                    />
                    <p className="text-sm text-gray-600 text-center">eCitizen platform is Kenya's official online government services portal</p>
                  </div>

                  <p className="text-gray-700 mb-4">In Kenya, business registration is regulated by the <strong>Business Registration Act</strong>, the <strong>Companies Act (2015)</strong>, and the <strong>Partnership Act</strong>. The <strong>Business Registration and Licensing Authority (BRELA)</strong> oversees all registrations. Most registrations now go through <strong>eCitizen (www.ecitizen.go.ke)</strong>, which makes the process transparent and accessible to everyone.</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                      <div className="text-2xl font-bold text-blue-700 mb-1">1-3 Days</div>
                      <div className="text-sm font-medium text-gray-900">Average Registration Time</div>
                      <div className="text-xs text-gray-600 mt-1">From application to certificate</div>
                    </div>
                    <div className="bg-cyan-50 border-l-4 border-cyan-600 p-4 rounded">
                      <div className="text-2xl font-bold text-cyan-700 mb-1">KES 500+</div>
                      <div className="text-sm font-medium text-gray-900">Starting Cost</div>
                      <div className="text-xs text-gray-600 mt-1">For sole proprietorship</div>
                    </div>
                    <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded">
                      <div className="text-2xl font-bold text-indigo-700 mb-1">100% Online</div>
                      <div className="text-sm font-medium text-gray-900">eCitizen Process</div>
                      <div className="text-xs text-gray-600 mt-1">Register from anywhere</div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Why Register Your Business?</h3>
                  <ul className="space-y-2 text-gray-700 text-sm mb-6">
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Legal Compliance:</strong> Operating legally protects you from penalties and fines</span></li>
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Bank Account:</strong> Open a business bank account with your CR12 certificate</span></li>
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Credibility:</strong> Customers and suppliers trust registered businesses</span></li>
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Tax ID (KRA PIN):</strong> Essential for paying taxes and conducting business</span></li>
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Licenses & Permits:</strong> Required to obtain industry-specific licenses</span></li>
                  </ul>
                </div>
              </section>

              <section id="legal-framework" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Legal Framework Governing Business Registration</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Business registration in Kenya is regulated by multiple laws and acts. Here's the complete legal framework:</p>

                  <div className="space-y-4 mb-6">
                    <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2">Business Registration Act (Cap. 499)</h4>
                      <p className="text-gray-700 text-sm mb-2">This is the primary law governing business registration in Kenya. It outlines:</p>
                      <ul className="space-y-1 text-gray-700 text-sm list-disc list-inside">
                        <li><strong>Registration Requirements:</strong> Sole proprietorships and partnerships must be registered under this act</li>
                        <li><strong>Business Names:</strong> Section 5 specifies that business names must not be misleading or offensive, and cannot be identical to existing registered businesses</li>
                        <li><strong>Registrar's Powers:</strong> The Registrar has authority to register, renew, and cancel business registrations</li>
                        <li><strong>Register Maintenance:</strong> BRELA maintains the national register of all businesses in Kenya</li>
                        <li><strong>Certificates of Registration:</strong> Required proof of legal business existence</li>
                      </ul>
                    </div>

                    <div className="bg-cyan-50 border-l-4 border-cyan-600 p-6 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2">Companies Act (2015)</h4>
                      <p className="text-gray-700 text-sm mb-2">Governs the registration and operation of Limited Companies. Key provisions include:</p>
                      <ul className="space-y-1 text-gray-700 text-sm list-disc list-inside">
                        <li><strong>Section 12-20:</strong> Registration process for companies – requirements for company formation, memorandum and articles of association</li>
                        <li><strong>Section 30:</strong> Certificate of Incorporation (CR12) – proof of a company's legal existence</li>
                        <li><strong>Section 80-100:</strong> Board of Directors requirements and responsibilities</li>
                        <li><strong>Section 140-160:</strong> Shareholder rights and protections</li>
                        <li><strong>Section 350-380:</strong> Annual Returns requirement – companies must file financial statements and company information every year by March 15th</li>
                        <li><strong>Section 470-500:</strong> Striking off and deregistration of companies that are inactive</li>
                      </ul>
                    </div>

                    <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2">Partnership Act (Cap. 273)</h4>
                      <p className="text-gray-700 text-sm mb-2">Regulates the formation and operation of partnerships. Important sections:</p>
                      <ul className="space-y-1 text-gray-700 text-sm list-disc list-inside">
                        <li><strong>Section 2-10:</strong> Definition of partnership and types (general and limited partnerships)</li>
                        <li><strong>Section 11:</strong> Rights and duties of partners</li>
                        <li><strong>Section 24:</strong> Liability of partners – general partners have joint and several liability</li>
                        <li><strong>Section 32:</strong> Dissolution and winding up procedures</li>
                        <li>Partnerships must also register under the Business Registration Act</li>
                      </ul>
                    </div>

                    <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2">BRELA Regulations & eCitizen Services</h4>
                      <p className="text-gray-700 text-sm mb-2">Business Registration and Licensing Authority operates under these frameworks:</p>
                      <ul className="space-y-1 text-gray-700 text-sm list-disc list-inside">
                        <li><strong>BRELA Act (2015):</strong> Established BRELA to streamline business registration and licensing</li>
                        <li><strong>eCitizen Portal:</strong> Official online government services platform approved by Treasury and Cabinet Office</li>
                        <li><strong>Digital Certification:</strong> Digital certificates from eCitizen have the same legal status as physical documents</li>
                        <li><strong>Transaction Fees:</strong> Regulated and transparent; published on eCitizen and BRELA websites</li>
                      </ul>
                    </div>

                    <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2">Income Tax Act & KRA PIN Requirement</h4>
                      <p className="text-gray-700 text-sm mb-2">Tax obligations for registered businesses:</p>
                      <ul className="space-y-1 text-gray-700 text-sm list-disc list-inside">
                        <li><strong>Section 3-5:</strong> All businesses must register with Kenya Revenue Authority (KRA) and obtain a Personal Identification Number (PIN)</li>
                        <li><strong>Section 12:</strong> Requirement to file annual tax returns showing business income</li>
                        <li><strong>Section 91-95:</strong> Penalties for non-compliance – fines up to KES 1 million and/or 6 months imprisonment</li>
                        <li><strong>KRA PIN:</strong> Mandatory for all business transactions, bank accounts, and government contracts</li>
                      </ul>
                    </div>

                    <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2">Labor Laws & Employee Registration</h4>
                      <p className="text-gray-700 text-sm mb-2">If you have employees, these laws apply:</p>
                      <ul className="space-y-1 text-gray-700 text-sm list-disc list-inside">
                        <li><strong>Employment Act (2007):</strong> Defines employer-employee relationships and working conditions</li>
                        <li><strong>NHIF Act & Regulations:</strong> Mandatory health insurance for all employees</li>
                        <li><strong>NSSF Act:</strong> Mandatory pension contribution (6% employer, 5% employee)</li>
                        <li><strong>PAYE:</strong> Pay As You Earn – mandatory withholding of income tax from employee salaries</li>
                        <li>Non-compliance results in fines and potential business closure</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-blue-100 border-l-4 border-blue-700 p-4 rounded-lg">
                    <p className="text-gray-900 text-sm"><strong>Legal Compliance Note:</strong> All business owners must comply with these laws. Ignorance of the law is not an excuse. Register properly and keep up with annual obligations to avoid penalties, fines, and potential business deregistration.</p>
                  </div>
                </div>
              </section>

              <section id="business-types" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Building2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Types of Businesses You Can Register</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Kenya allows registration of four main business structures. Each has different costs, complexity, and legal implications:</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {businessTypes.map((business, index) => (
                      <div key={index} className="bg-white border-2 border-gray-200 p-6 rounded-xl hover:shadow-lg transition">
                        <h4 className="text-lg font-bold text-gray-900 mb-2">{business.type}</h4>
                        <p className="text-gray-700 text-sm mb-4">{business.description}</p>
                        <div className="space-y-1 text-xs text-gray-600 mb-4">
                          <p><strong>Cost:</strong> {business.cost}</p>
                          <p><strong>Time:</strong> {business.time}</p>
                          <p><strong>Liability:</strong> {business.liability}</p>
                        </div>
                        <Link
                          to={business.link}
                          className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1"
                        >
                          Learn more <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section id="requirements" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Requirements Before You Start</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-4">Before registering on eCitizen, ensure you have the following. These requirements are set by the Business Registration Act (Cap. 499), Companies Act (2015), and BRELA regulations:</p>

                  <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded-lg space-y-3 mb-6">
                    <div className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-gray-900">Valid Identification</h4>
                        <p className="text-gray-700 text-sm"><strong>(Business Registration Act, Section 4):</strong> National ID, Passport, or Alien Certificate of Registration (for foreigners). This verifies your legal identity as the business owner.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-gray-900">eCitizen Account</h4>
                        <p className="text-gray-700 text-sm"><strong>(BRELA eCitizen Framework):</strong> Register free at www.ecitizen.go.ke using your email and phone. This is the official government portal for all business registrations.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-gray-900">Unique Business Name</h4>
                        <p className="text-gray-700 text-sm"><strong>(Business Registration Act, Section 5):</strong> A name that's not already registered. Must not be misleading, offensive, or identical to existing businesses. Search and reserve on eCitizen first.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-gray-900">PIN Certificate (Optional but Recommended)</h4>
                        <p className="text-gray-700 text-sm"><strong>(Income Tax Act, Section 3-5):</strong> KRA PIN is mandatory for tax purposes. You can apply before or after registration. Makes future tax compliance easier.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-gray-900">Payment Method</h4>
                        <p className="text-gray-700 text-sm"><strong>(BRELA Transaction Framework):</strong> M-Pesa, bank transfer, or credit card to pay registration fees online. Payment is secure and required before certificate issuance.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-gray-900">Proof of Residence</h4>
                        <p className="text-gray-700 text-sm"><strong>(Business Registration Act, Section 6):</strong> Utility bill, lease agreement, or bank statement showing your address. Verifies the principal place of business.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded-lg">
                    <p className="text-sm text-gray-900"><strong>Legal Note for Foreigners:</strong> Under the Business Registration Act and Immigration regulations, foreigners may need additional documents like a work permit or visa. Some business structures are restricted. Consult the Immigration Services or a lawyer before registering.</p>
                  </div>
                </div>
              </section>

              <section id="steps" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <ArrowRight className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Step-by-Step Registration on eCitizen</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Follow these 8 steps to complete your business registration on eCitizen:</p>

                  <div className="space-y-4">
                    {registrationSteps.map((item, index) => (
                      <div key={index} className="bg-white border-2 border-gray-200 p-6 rounded-xl hover:shadow-md transition">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white font-bold">
                              {item.step}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h4>
                            <p className="text-gray-700 text-sm">{item.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section id="name-search" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Search className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Business Name Search & Reservation</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-4">Before registering, you must ensure your business name is unique. Here's how:</p>

                  <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg mb-4">
                    <h4 className="font-bold text-gray-900 mb-3">How to Search Business Names on eCitizen</h4>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
                      <li>Go to www.ecitizen.go.ke</li>
                      <li>Log in with your credentials</li>
                      <li>Select "Business Registration"</li>
                      <li>Click "Search Business Name"</li>
                      <li>Enter your desired business name</li>
                      <li>Click Search – the system will show if the name is available or already taken</li>
                    </ol>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 border-2 border-green-200 p-4 rounded-lg">
                      <h4 className="font-bold text-green-700 mb-2">✓ Name is Available?</h4>
                      <p className="text-gray-700 text-sm">Great! Proceed to reserve it. Pay KES 500 (or it may be free). The name is reserved for 6 months, giving you time to complete registration.</p>
                    </div>
                    <div className="bg-red-50 border-2 border-red-200 p-4 rounded-lg">
                      <h4 className="font-bold text-red-700 mb-2">✗ Name is Taken?</h4>
                      <p className="text-gray-700 text-sm">The name is already registered. Choose a different name and search again. You can try variations like adding your location or adding "Ltd" or "Kenya".</p>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm mt-4">See <a href="/business-name-search-kenya" className="text-blue-600 hover:text-blue-700 font-medium">/business-name-search-kenya</a> for detailed name search and reservation guide.</p>
                </div>
              </section>

              <section id="documents" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Documents Needed for Registration</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-4">The documents you need depend on your business type. These are mandated by the Business Registration Act and Companies Act (2015):</p>

                  {Object.entries(requiredDocuments).map(([type, docs], index) => (
                    <div key={index} className="mb-6">
                      <h4 className="text-lg font-bold text-gray-900 mb-3">{type}</h4>
                      <ul className="space-y-2">
                        {docs.map((doc, i) => (
                          <li key={i} className="flex gap-2 text-gray-700 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                            {doc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>Pro Tip:</strong> Have digital copies (PDFs) of all documents ready before you start on eCitizen. You'll upload them during the application process.</p>
                  </div>
                </div>
              </section>

              <section id="fees" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <DollarSign className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Registration Fees & Costs</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-4">Here's a complete breakdown of all costs associated with business registration in Kenya (2025):</p>

                  <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">Item</th>
                          <th className="px-4 py-3 text-left font-semibold">Cost (KES)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {registrationFees.map((fee, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">{fee.item}</td>
                            <td className="px-4 py-3 text-gray-700">{fee.cost}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>Total Budget:</strong> Budget KES 5,000-20,000 for complete business setup including registration, KRA PIN, and optional legal assistance. The exact cost depends on your business type and complexity.</p>
                  </div>
                </div>
              </section>

              <section id="timeline" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How Long Registration Takes</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">The timeline varies by business type and how quickly you respond to requests:</p>

                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 p-6 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">Sole Proprietorship / Partnership</h4>
                      <div className="flex gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-700">1-2</div>
                          <div className="text-xs text-gray-600">Business Days</div>
                        </div>
                        <div className="text-gray-700 text-sm">
                          <p><strong>Fastest option.</strong> Usually approved within 1-2 days if all documents are correct.</p>
                          <p className="mt-1">Name search: 5 minutes | Registration: 1-2 days | Certificate download: instant</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-cyan-50 to-indigo-50 border-2 border-cyan-200 p-6 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">Limited Company</h4>
                      <div className="flex gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-cyan-700">3-5</div>
                          <div className="text-xs text-gray-600">Business Days</div>
                        </div>
                        <div className="text-gray-700 text-sm">
                          <p><strong>More verification required.</strong> Takes longer due to director checks, shareholder agreements.</p>
                          <p className="mt-1">Name search: 5 minutes | Registration: 3-5 days | Certificate download: instant</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-200 p-6 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">NGO / Society</h4>
                      <div className="flex gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-indigo-700">5-7</div>
                          <div className="text-xs text-gray-600">Business Days</div>
                        </div>
                        <div className="text-gray-700 text-sm">
                          <p><strong>Longest process.</strong> Requires additional verification of founding documents and governance structure.</p>
                          <p className="mt-1">Registration: 5-7 days | Certificate download: instant</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded-lg mt-6">
                    <p className="text-gray-700 text-sm"><strong>Speed Tips:</strong> Submit complete, error-free documents to avoid delays. Respond quickly to any eCitizen notifications or requests. Defects can add 3-5 days to the process.</p>
                  </div>
                </div>
              </section>

              <section id="after-registration" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">After Registration (Next Legal Steps)</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-4">Congratulations! Your business is registered. But there are several important next steps to fully comply with Kenyan law:</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white border-2 border-gray-200 p-6 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        Get KRA PIN
                      </h4>
                      <p className="text-gray-700 text-sm mb-3"><strong>(Income Tax Act, Section 3-5):</strong> Apply for a Tax Identification Number (PIN) from the Kenya Revenue Authority (KRA). Essential for paying taxes and doing business officially. See <a href="/kra-pin-for-business-kenya" className="text-blue-600 hover:text-blue-700 font-medium">KRA PIN for Business</a>.</p>
                    </div>

                    <div className="bg-white border-2 border-gray-200 p-6 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        Open Business Bank Account
                      </h4>
                      <p className="text-gray-700 text-sm mb-3"><strong>(Business Registration Act, Section 8):</strong> Use your CR12 (Certificate of Registration) to open a business bank account. Required to separate personal and business finances and comply with AML regulations.</p>
                    </div>

                    <div className="bg-white border-2 border-gray-200 p-6 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        Business Permits & Licenses
                      </h4>
                      <p className="text-gray-700 text-sm mb-3"><strong>(BRELA Licensing Framework):</strong> Depending on your industry, you may need: restaurant license, salon license, retail license, etc. Operating without required licenses is illegal. See <a href="/business-permits-and-licenses-kenya" className="text-blue-600 hover:text-blue-700 font-medium">Business Permits & Licenses</a>.</p>
                    </div>

                    <div className="bg-white border-2 border-gray-200 p-6 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        NHIF & NSSF Registration
                      </h4>
                      <p className="text-gray-700 text-sm mb-3"><strong>(Employment Act 2007, NHIF Act, NSSF Act):</strong> If you have employees, register them with NHIF (health insurance) and NSSF (pension: 6% employer, 5% employee). Mandatory by law. Failure incurs fines.</p>
                    </div>

                    <div className="bg-white border-2 border-gray-200 p-6 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        Annual Returns (Companies Only)
                      </h4>
                      <p className="text-gray-700 text-sm mb-3"><strong>(Companies Act 2015, Section 350-380):</strong> Limited companies must file annual returns with BRELA by March 15th every year. Failure to file results in deregistration. See <a href="/company-annual-returns-kenya" className="text-blue-600 hover:text-blue-700 font-medium">Company Annual Returns</a>.</p>
                    </div>

                    <div className="bg-white border-2 border-gray-200 p-6 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        Keep Compliance Records
                      </h4>
                      <p className="text-gray-700 text-sm mb-3"><strong>(Income Tax Act, Section 82):</strong> Maintain business records, invoices, contracts, and financial statements for at least 5 years. Required for tax audits and business management.</p>
                    </div>
                  </div>
                </div>
              </section>

              <section id="mistakes" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Common Mistakes to Avoid</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-4">Don't let preventable errors delay your registration or create legal problems later:</p>

                  <div className="space-y-3">
                    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">❌ Not Searching Business Name First</h4>
                      <p className="text-gray-700 text-sm"><strong>(Business Registration Act, Section 5):</strong> Choosing a duplicate or misleading name causes automatic rejection. Always search and reserve the name on eCitizen first (6-month reservation period).</p>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">❌ Submitting Incomplete or False Information</h4>
                      <p className="text-gray-700 text-sm"><strong>(Business Registration Act, Section 6; Income Tax Act, Section 82):</strong> Missing or false information causes rejection and can result in registration cancellation. Knowingly providing false documents is a criminal offense punishable by fine and/or imprisonment.</p>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">❌ Inconsistent Information Across Documents</h4>
                      <p className="text-gray-700 text-sm"><strong>(Business Registration Act, Section 4):</strong> Your name, ID number, and address must match exactly across all documents. Mismatches trigger automatic defects and delays. Deliberate discrepancies can result in denial and legal investigation.</p>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">❌ Submitting Poor Quality Document Scans</h4>
                      <p className="text-gray-700 text-sm"><strong>(BRELA Digital Certification Standards):</strong> All documents must be clear, high-resolution, and legible. Blurry or incomplete scans will be rejected by the automated system or manual reviewer, causing 3-5 day delays.</p>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">❌ Operating Without a KRA PIN</h4>
                      <p className="text-gray-700 text-sm"><strong>(Income Tax Act, Sections 3-5, 91-95):</strong> Failure to register with KRA and obtain a PIN is illegal. Penalties: KES 1 million fine and/or 6 months imprisonment. Banks also won't open accounts without a PIN.</p>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">❌ Delaying Employee Registration (NHIF/NSSF)</h4>
                      <p className="text-gray-700 text-sm"><strong>(Employment Act 2007, NHIF Act, NSSF Act):</strong> All employees must be registered immediately. Failure: fines up to KES 50,000 per employee per month, plus recovery of unpaid contributions, and potential criminal prosecution.</p>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">❌ Not Filing Annual Returns (Limited Companies)</h4>
                      <p className="text-gray-700 text-sm"><strong>(Companies Act 2015, Section 350-380):</strong> Directors must file annual returns by March 15th every year. Missing deadline: KES 50,000-100,000 fine + company deregistration. Directors can be held personally liable.</p>
                    </div>
                  </div>
                </div>
              </section>

              <section id="lawyer" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">When to Hire a Lawyer or Agent</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-4">You can register a sole proprietorship yourself. But here's when professional help is worth the investment:</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-green-50 border-2 border-green-200 p-6 rounded-xl">
                      <h4 className="font-bold text-green-700 mb-3">✓ You Can DIY</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li className="flex gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          Sole proprietorship
                        </li>
                        <li className="flex gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          Simple business with no employees
                        </li>
                        <li className="flex gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          Budget is tight
                        </li>
                        <li className="flex gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          You're comfortable with online processes
                        </li>
                      </ul>
                    </div>

                    <div className="bg-yellow-50 border-2 border-yellow-200 p-6 rounded-xl">
                      <h4 className="font-bold text-yellow-700 mb-3">⚠️ Consider Getting Help</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li className="flex gap-2">
                          <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                          Registering a limited company
                        </li>
                        <li className="flex gap-2">
                          <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                          Multiple shareholders or complex structure
                        </li>
                        <li className="flex gap-2">
                          <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                          Franchise or corporate partnership
                        </li>
                        <li className="flex gap-2">
                          <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                          You're a foreigner with visa questions
                        </li>
                        <li className="flex gap-2">
                          <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                          You want everything done professionally
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>Estimated Costs:</strong> Legal/agent assistance for sole proprietorship: KES 2,000-5,000 | For limited company: KES 5,000-15,000 | Includes form preparation, document review, eCitizen submission.</p>
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

              <section className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 text-white p-8 rounded-xl shadow-xl">
                <h3 className="text-2xl font-bold mb-4">Ready to Register Your Business?</h3>
                <p className="mb-6 text-indigo-100">Start your business registration on eCitizen today. It's fast, secure, and affordable.</p>
                <div className="flex flex-wrap gap-4">
                  <a 
                    href="https://www.ecitizen.go.ke" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition flex items-center gap-2"
                  >
                    <ArrowRight className="w-5 h-5" />
                    Go to eCitizen
                  </a>
                  <a 
                    href="/business-name-search-kenya"
                    className="bg-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-cyan-400 transition flex items-center gap-2"
                  >
                    <Search className="w-5 h-5" />
                    Search Business Name
                  </a>
                  <a 
                    href="/kra-pin-for-business-kenya"
                    className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Get KRA PIN
                  </a>
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default HowToRegisterBusinessKenya;
