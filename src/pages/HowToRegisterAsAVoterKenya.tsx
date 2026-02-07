import { useState, useEffect } from 'react';
import { ChevronDown, CheckCircle, ArrowRight, FileText, Users, MessageSquare } from 'lucide-react';

// FAQ Data - Constant at file level to avoid React Hook dependency warnings
const faqsData = [
  {
    id: 1,
    question: 'Who is eligible to register as a voter in Kenya?',
    answer: 'Any Kenyan citizen who is at least 18 years old and has a valid national ID (national identity card, passport, or birth certificate + Kenyan national documents) can register as a voter. You must also be a resident or have genuine interest in the constituency/county you wish to register in. However, you cannot be registered in more than one constituency.'
  },
  {
    id: 2,
    question: 'What documents do I need to register as a voter?',
    answer: 'To register as a voter, you will need a valid identification document. Accepted documents include: (1) National Identity Card (ID), (2) Passport, (3) Birth Certificate (for first-time voters), (4) Military ID (for armed forces personnel), or (5) Alien Travel Document (for recognized refugees). The ID must be valid and not expired. Have your document ready, as it will be scanned during registration.'
  },
  {
    id: 3,
    question: 'How do I register to vote online through the IEBC portal?',
    answer: 'Visit the IEBC official website (www.iebc.or.ke) and navigate to the voter registration portal. Click "Register to Vote Online" and follow the prompts. You will need to provide your personal details, national ID number, and choose your registration location. Upload a clear photo of your ID. Review your information carefully, then submit. You will receive a confirmation message with your registration details. Keep this for your records.'
  },
  {
    id: 4,
    question: 'What is the step-by-step process for offline voter registration?',
    answer: 'Visit your nearest voter registration center (located at county offices, constituencies, and educational institutions). Bring your valid ID. Inform the registration officer that you wish to register. Provide your personal information (full name, date of birth, mobile number, address). The registration officer will scan your ID and take your biometric data. You will receive a confirmation slip. Keep this slip until you receive your voter card. The entire process takes 10-15 minutes.'
  },
  {
    id: 5,
    question: 'Can I register to vote online and offline?',
    answer: 'Yes, you can choose either method. However, you can only register once in one constituency. If you register online, you do not need to register offline, and vice versa. Registering twice in different locations is illegal and will result in your registration being cancelled.'
  },
  {
    id: 6,
    question: 'How do I know if my voter registration was successful?',
    answer: 'After registering, you will receive a confirmation message via SMS or email. When IEBC completes verification (usually 1-2 weeks), you will receive your voter card by mail to your registered address, or you can collect it from your nearest registration center. You can also check your voter status by visiting the IEBC website or contacting your local IEBC office. Always verify your details are correct on your voter card.'
  },
  {
    id: 7,
    question: 'What is the deadline for voter registration?',
    answer: 'The IEBC sets specific voter registration deadlines before each election. Typically, voter registration is closed 60 days before a general election. However, IEBC may conduct continuous voter registration during non-election periods. Always check the IEBC official website for the latest registration deadlines. Once registration is closed for an election, you will not be able to register for that election.'
  },
  {
    id: 8,
    question: 'What if I made mistakes on my voter registration form?',
    answer: 'If you notice errors in your personal details (name, date of birth, address), visit your nearest voter registration center with your voter card and ID. The registration officer will help you correct the information. Changes can typically be made before the registration period closes. For minor errors, you can sometimes request corrections when you vote. Contact IEBC for specific guidance on your situation.'
  },
  {
    id: 9,
    question: 'How can I check if I am registered as a voter?',
    answer: 'You can check your voter registration status through several methods: (1) Visit the IEBC website and use the voter status checker tool, (2) Contact your nearest IEBC county office by phone or email, (3) Visit a voter registration center in person with your ID, or (4) Send a text message to the IEBC SMS service (details on the website). You will need your national ID number to check your status.'
  },
  {
    id: 10,
    question: 'Can I change my constituency/county of registration after registering?',
    answer: 'You cannot change your constituency of registration after you have registered. You can only register once in one constituency. If you have relocated to a different constituency, you must re-register in your new constituency during the next registration period. You cannot vote in your old constituency once you have registered in a new one.'
  },
  {
    id: 11,
    question: 'What are my rights as a registered voter?',
    answer: 'As a registered voter, you have the right to: (1) Vote freely and in secret, (2) Have your vote counted fairly and accurately, (3) Have access to voting information, (4) Observe elections, (5) Report concerns or violations to IEBC, (6) Request assistance if you have disabilities, (7) Vote at the designated polling station in your constituency, and (8) Lodge complaints if you believe election procedures were violated.'
  },
  {
    id: 12,
    question: 'What should I do if I have not received my voter card?',
    answer: 'If you registered but have not received your voter card within 2-3 weeks, contact your nearest IEBC county office. Bring your national ID and registration confirmation. IEBC can provide a replacement card or confirm that your registration is active and you can vote. Do not worry – even without a physical voter card, if you are on the voter register, you are eligible to vote at your designated polling station.'
  }
];

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export default function HowToRegisterAsAVoterKenya() {
  const [activeSection, setActiveSection] = useState('eligibility');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  useEffect(() => {
    // Set SEO Meta Tags
    const metaTitle = 'How to Register as a Voter in Kenya – Step-by-Step Guide';
    const metaDescription = 'Complete guide to voter registration in Kenya. Learn eligibility, online & offline registration steps, IEBC requirements, deadlines, and your voting rights.';
    const metaKeywords = 'voter registration Kenya, register to vote Kenya, IEBC voter registration, how to register as voter Kenya, voter registration steps';

    // Set Meta Title
    document.title = metaTitle;

    // Helper function to set or create meta tag
    const setMetaTag = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    const setOGTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    setMetaTag('description', metaDescription);
    setMetaTag('keywords', metaKeywords);
    setMetaTag('robots', 'index, follow');
    setMetaTag('viewport', 'width=device-width, initial-scale=1.0');

    // OG Tags
    setOGTag('og:title', metaTitle);
    setOGTag('og:description', metaDescription);
    setOGTag('og:type', 'website');
    setOGTag('og:url', window.location.href);

    // Twitter Tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', metaTitle);
    setMetaTag('twitter:description', metaDescription);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.href);

    // JSON-LD Structured Data
    const jsonLdData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': window.location.href,
          'name': metaTitle,
          'description': metaDescription,
          'url': window.location.href,
          'potentialAction': {
            '@type': 'Action',
            'name': 'Register as Voter'
          }
        },
        {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Home',
              'item': window.location.origin
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': 'Elections in Kenya',
              'item': `${window.location.origin}/elections-in-kenya`
            },
            {
              '@type': 'ListItem',
              'position': 3,
              'name': 'Voter Registration',
              'item': window.location.href
            }
          ]
        },
        {
          '@type': 'FAQPage',
          'mainEntity': faqsData.map(faq => ({
            '@type': 'Question',
            'name': faq.question,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': faq.answer
            }
          }))
        },
        {
          '@type': 'HowTo',
          'name': 'How to Register as a Voter in Kenya',
          'description': 'Step-by-step guide to register as a voter online through IEBC portal',
          'step': [
            {
              '@type': 'HowToStep',
              'name': 'Visit IEBC Website',
              'text': 'Go to www.iebc.or.ke and navigate to the voter registration portal'
            },
            {
              '@type': 'HowToStep',
              'name': 'Click Register to Vote',
              'text': 'Click the "Register to Vote Online" button and begin the registration process'
            },
            {
              '@type': 'HowToStep',
              'name': 'Provide Personal Information',
              'text': 'Enter your full name, date of birth, national ID number, and mobile number'
            },
            {
              '@type': 'HowToStep',
              'name': 'Upload ID Document',
              'text': 'Take a clear photo of your national ID and upload it to the portal'
            },
            {
              '@type': 'HowToStep',
              'name': 'Select Registration Location',
              'text': 'Choose your constituency and preferred registration location'
            },
            {
              '@type': 'HowToStep',
              'name': 'Review and Submit',
              'text': 'Review all your information carefully, then submit your registration'
            },
            {
              '@type': 'HowToStep',
              'name': 'Receive Confirmation',
              'text': 'You will receive a confirmation message via SMS or email with your registration details'
            }
          ]
        },
        {
          '@type': 'GovernmentService',
          'name': 'Voter Registration in Kenya',
          'description': 'Official voter registration service provided by the Independent Electoral and Boundaries Commission (IEBC)',
          'provider': {
            '@type': 'GovernmentOrganization',
            'name': 'Independent Electoral and Boundaries Commission (IEBC)',
            'url': 'https://www.iebc.or.ke'
          },
          'areaServed': 'KE',
          'serviceUrl': 'https://www.iebc.or.ke'
        }
      ]
    };

    let script = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(jsonLdData);
  }, []);

  const toggleFAQ = (id: number) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const sections = [
    { id: 'eligibility', label: 'Eligibility' },
    { id: 'legal-framework', label: 'Legal Framework' },
    { id: 'methods', label: 'Registration Methods' },
    { id: 'online', label: 'Online Registration' },
    { id: 'offline', label: 'Offline Registration' },
    { id: 'update', label: 'Update Details' },
    { id: 'mistakes', label: 'Common Mistakes' },
    { id: 'confirmation', label: 'Confirmation' },
    { id: 'rights', label: 'Voter Rights' },
    { id: 'faqs', label: 'FAQs' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-teal-600 to-cyan-600 text-white py-12 sm:py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4 mb-4">
            <Users className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">How to Register as a Voter in Kenya</h1>
          <p className="text-lg sm:text-xl text-blue-50 mb-6">Complete step-by-step guide to voter registration. Learn eligibility, online & offline methods, and your voting rights.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="https://www.iebc.or.ke" target="_blank" rel="noopener noreferrer" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition flex items-center justify-center gap-2">
              Register to Vote Online <ArrowRight className="w-5 h-5" />
            </a>
            <a href="tel:+254723566000" className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition">
              Contact IEBC
            </a>
          </div>
        </div>
      </section>

      {/* Breadcrumb Navigation */}
      <nav className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-3 text-sm overflow-x-auto">
            <a href="/" className="text-teal-600 hover:text-teal-700 whitespace-nowrap">Home</a>
            <span className="text-gray-400">/</span>
            <a href="/elections-in-kenya" className="text-teal-600 hover:text-teal-700 whitespace-nowrap">Elections</a>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 whitespace-nowrap">Voter Registration</span>
          </div>
        </div>
      </nav>

      {/* Mobile TOC - Horizontal Scroll */}
      <div className="lg:hidden sticky top-0 bg-white border-b border-gray-200 z-40 overflow-x-auto -mx-2 px-2 py-2">
        <div className="flex gap-2 min-w-max">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-3 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition ${
                activeSection === section.id
                  ? 'bg-blue-100 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Desktop TOC - Sticky Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <nav className="sticky top-24 bg-gray-50 rounded-lg p-6 space-y-2 max-h-screen overflow-y-auto">
            <h3 className="font-bold text-gray-900 mb-4">Contents</h3>
            {sections.map(section => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection(section.id);
                }}
                className={`block px-4 py-2 rounded-lg transition ${
                  activeSection === section.id
                    ? 'bg-blue-100 text-blue-600 border-l-4 border-blue-600 font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {section.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Section 1: Eligibility Requirements */}
          <section id="eligibility" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Eligibility Requirements for Voter Registration</h2>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">Before you register as a voter in Kenya, you must meet certain eligibility criteria set by the <a href="/understanding-iebc-kenya" className="text-blue-600 hover:text-blue-700 font-medium">Independent Electoral and Boundaries Commission (IEBC)</a>.</p>
              
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-4 rounded">
                <h3 className="font-bold text-gray-900 mb-2">Key Eligibility Criteria:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li><strong>Age:</strong> You must be at least 18 years old by the time you register. Your date of birth will be verified through your national ID.</li>
                  <li><strong>Citizenship:</strong> You must be a Kenyan citizen. Permanent residents and non-citizens cannot register as voters.</li>
                  <li><strong>Valid ID:</strong> You must possess a valid identification document accepted by IEBC (national ID, passport, birth certificate, military ID, or alien travel document).</li>
                  <li><strong>Single Registration:</strong> You can only be registered as a voter in ONE constituency. Dual registration is illegal and results in cancellation of both registrations.</li>
                  <li><strong>Not Disqualified:</strong> You must not be disqualified by law (e.g., convicted of election offences, mental incapacity as declared by a court).</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">Accepted Identification Documents</h3>
              <table className="w-full border-collapse mb-4">
                <thead>
                  <tr className="bg-blue-100 border border-gray-300">
                    <th className="border border-gray-300 px-4 py-2 text-left font-bold text-gray-900">Document Type</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-bold text-gray-900">Valid For Registration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border border-gray-300">
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">National Identity Card (ID)</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">✓ Yes (must not be expired)</td>
                  </tr>
                  <tr className="bg-gray-50 border border-gray-300">
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">Passport</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">✓ Yes (must be valid)</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">Birth Certificate</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">✓ Yes (for first-time voters, must be certified)</td>
                  </tr>
                  <tr className="bg-gray-50 border border-gray-300">
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">Military ID</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">✓ Yes (for armed forces personnel)</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">Alien Travel Document</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">✓ Yes (for recognized refugees)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 2: Legal Framework */}
          <section id="legal-framework" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <FileText className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Legal Framework Governing Voter Registration in Kenya</h2>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">Voter registration in Kenya is governed by comprehensive legal instruments that establish the rights, responsibilities, and procedures for citizens to participate in elections. These laws ensure that the electoral process is fair, transparent, and accessible to all eligible Kenyans.</p>
              
              <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 mb-6 rounded">
                <h3 className="font-bold text-gray-900 mb-3">Key Laws and Acts:</h3>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">1. The Constitution of Kenya (2010)</h3>
              <div className="bg-gray-50 border border-gray-300 p-4 rounded mb-4">
                <p className="text-gray-700 mb-2"><strong>Legal Basis:</strong> Article 38 – Democratic Rights</p>
                <p className="text-gray-700 mb-2"><strong>Key Provisions:</strong></p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Article 38(1):</strong> Every Kenyan citizen has the right to participate in the electoral process, including the right to vote and be elected.</li>
                  <li><strong>Article 38(2):</strong> Election of state officers shall be by universal adult suffrage and secret ballot, free and fair, and shall reflect the will of the people.</li>
                  <li><strong>Article 38(3):</strong> Citizens are entitled to participate in electoral processes including: (a) voting, (b) being elected, (c) contesting for elections, (d) participating as election observers, (e) accessing voter and candidate information.</li>
                  <li><strong>Article 33:</strong> The state must respect, protect, and fulfill the rights to democratic participation and freedom of expression.</li>
                </ul>
                <p className="text-gray-700 mt-3"><strong>Significance:</strong> The Constitution establishes the foundational right to vote and participate in elections. All voter registration procedures must comply with these constitutional principles, which guarantee that elections are free, fair, and based on universal adult suffrage.</p>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">2. The Independent Electoral and Boundaries Commission (IEBC) Act, 2011</h3>
              <div className="bg-gray-50 border border-gray-300 p-4 rounded mb-4">
                <p className="text-gray-700 mb-2"><strong>Legal Basis:</strong> Act No. 9 of 2011 (as amended)</p>
                <p className="text-gray-700 mb-2"><strong>Key Provisions on Voter Registration:</strong></p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Section 17:</strong> Establishes IEBC's power to conduct voter registration and maintain the voter register with all persons who meet constitutional and statutory eligibility requirements.</li>
                  <li><strong>Section 17(2):</strong> IEBC shall prepare, maintain, update, and correct the voter register in accordance with this Act and regulations made under it.</li>
                  <li><strong>Section 17(3):</strong> The voter register shall be demarcated by constituency and shall form the basis for voting in elections.</li>
                  <li><strong>Section 18:</strong> IEBC may conduct continuous voter registration during non-election periods and at such other times as it deems necessary, provided that it shall close the register 60 days before a general election.</li>
                  <li><strong>Section 19:</strong> A person is eligible for registration as a voter if they are: (a) a Kenyan citizen, (b) 18 years or older, (c) a resident in the constituency in which they seek to register, and (d) not disqualified by law.</li>
                  <li><strong>Section 20:</strong> IEBC shall have the authority to use technology, including biometric registration systems, to collect voter information and prevent duplicate registrations.</li>
                  <li><strong>Section 21:</strong> IEBC shall maintain the secrecy and security of the voter register and protect personal information collected during registration.</li>
                </ul>
                <p className="text-gray-700 mt-3"><strong>Significance:</strong> This Act is the primary legislation establishing IEBC's mandate to conduct voter registration. It defines eligibility requirements, IEBC's powers and responsibilities, and the framework for maintaining the voter register. The Act empowers IEBC to use technology for registration and ensures that registration is done in compliance with constitutional principles.</p>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">3. The Elections Act, 2011</h3>
              <div className="bg-gray-50 border border-gray-300 p-4 rounded mb-4">
                <p className="text-gray-700 mb-2"><strong>Legal Basis:</strong> Act No. 1 of 2011 (as amended)</p>
                <p className="text-gray-700 mb-2"><strong>Key Provisions on Voter Registration:</strong></p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Section 4:</strong> Defines the voting qualifications and establishes that only registered voters can vote in elections.</li>
                  <li><strong>Section 5:</strong> Specifies that the voter register prepared by IEBC is the sole basis for determining who is eligible to vote.</li>
                  <li><strong>Section 40-45:</strong> Provides procedures for voter registration, including registration centers, registration deadlines, and verification processes.</li>
                  <li><strong>Section 41:</strong> IEBC must publicize the schedule and locations of voter registration centers in all constituencies.</li>
                  <li><strong>Section 42:</strong> Voter registration shall be conducted during designated periods, with closure 60 days before general elections.</li>
                  <li><strong>Section 43:</strong> IEBC shall use an electronic voter register to facilitate accurate and transparent voter verification.</li>
                  <li><strong>Section 44:</strong> Any person whose name appears in the voter register may vote in the constituency for which they are registered.</li>
                  <li><strong>Section 45:</strong> IEBC may correct clerical errors and remove names of ineligible persons from the voter register following prescribed procedures.</li>
                  <li><strong>Section 112-115:</strong> Provides remedies for persons who believe their right to vote has been violated, including complaints to IEBC and petitions to election courts.</li>
                </ul>
                <p className="text-gray-700 mt-3"><strong>Significance:</strong> This Act operationalizes voter registration procedures and establishes the legal framework for conducting elections. It requires IEBC to conduct registration transparently, maintain the voter register accurately, and provide mechanisms for correcting errors. The Act ensures that only registered voters can participate in elections.</p>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">4. The Election Operations Act, 2017</h3>
              <div className="bg-gray-50 border border-gray-300 p-4 rounded mb-4">
                <p className="text-gray-700 mb-2"><strong>Legal Basis:</strong> Act No. 34 of 2017</p>
                <p className="text-gray-700 mb-2"><strong>Key Provisions on Voter Registration:</strong></p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Section 3-10:</strong> Provides detailed procedures for voter registration operations, including the use of technology and digital systems.</li>
                  <li><strong>Section 6:</strong> Establishes that IEBC may use biometric and electronic systems to collect, process, and manage voter data.</li>
                  <li><strong>Section 7:</strong> Requires IEBC to establish security measures to protect voter data from unauthorized access and manipulation.</li>
                  <li><strong>Section 8:</strong> Mandates that the voter register be updated continuously and audited for accuracy.</li>
                  <li><strong>Section 9:</strong> Provides procedures for citizen complaint and dispute resolution regarding voter registration.</li>
                </ul>
                <p className="text-gray-700 mt-3"><strong>Significance:</strong> This Act modernizes election operations and voter registration procedures by enabling the use of technology. It sets standards for data security and establishes mechanisms for dispute resolution, ensuring that the registration process is transparent, accurate, and secure.</p>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">5. The Political Parties Act, 2011</h3>
              <div className="bg-gray-50 border border-gray-300 p-4 rounded mb-4">
                <p className="text-gray-700 mb-2"><strong>Legal Basis:</strong> Act No. 6 of 2011</p>
                <p className="text-gray-700 mb-2"><strong>Relevant Provisions:</strong></p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Section 35:</strong> Establishes that only voters registered in the voter register can vote in primary elections and party nomination processes.</li>
                  <li><strong>Section 37:</strong> Requires political parties to ensure that their nomination processes are free, fair, and based on registered voters.</li>
                </ul>
                <p className="text-gray-700 mt-3"><strong>Significance:</strong> This Act ties voter registration to political party processes, ensuring that the electorate has a role in selecting party candidates and participating in democratic processes at the grassroots level.</p>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">6. The Registration of Persons Act (Cap. 107)</h3>
              <div className="bg-gray-50 border border-gray-300 p-4 rounded mb-4">
                <p className="text-gray-700 mb-2"><strong>Legal Basis:</strong> Cap. 107 of the Laws of Kenya</p>
                <p className="text-gray-700 mb-2"><strong>Key Provisions:</strong></p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Section 14:</strong> Establishes procedures for the issuance and registration of national identification documents.</li>
                  <li><strong>Section 15:</strong> Requires that national IDs contain verified personal information used for voter registration verification.</li>
                </ul>
                <p className="text-gray-700 mt-3"><strong>Significance:</strong> This Act provides the legal framework for national identification, which is the primary document used to verify voter eligibility. It ensures that voter registration is based on verified personal information from a credible government source.</p>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">7. The Data Protection Act, 2019</h3>
              <div className="bg-gray-50 border border-gray-300 p-4 rounded mb-4">
                <p className="text-gray-700 mb-2"><strong>Legal Basis:</strong> Act No. 27 of 2019</p>
                <p className="text-gray-700 mb-2"><strong>Key Provisions Relevant to Voter Registration:</strong></p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Section 4-7:</strong> Establishes principles for lawful collection, processing, and protection of personal data.</li>
                  <li><strong>Section 8-10:</strong> Provides data subjects' rights, including the right to know what personal data is collected and how it is used.</li>
                  <li><strong>Section 35:</strong> Requires data controllers (including IEBC) to implement reasonable security measures to protect personal data.</li>
                  <li><strong>Section 44-46:</strong> Establishes procedures for individuals to lodge complaints about data protection violations.</li>
                </ul>
                <p className="text-gray-700 mt-3"><strong>Significance:</strong> This Act protects voter privacy and personal data collected during registration. It requires IEBC to safeguard voter information and ensures that citizens have rights regarding how their personal data is used. IEBC must comply with data protection principles when collecting biometric and personal information.</p>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">8. Election-Related Regulations and Statutory Instruments</h3>
              <div className="bg-gray-50 border border-gray-300 p-4 rounded mb-4">
                <p className="text-gray-700 mb-2"><strong>Key Regulations:</strong></p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>IEBC Voter Registration Regulations:</strong> Detailed regulations specifying registration procedures, timelines, locations, and documentation requirements.</li>
                  <li><strong>IEBC Biometric Regulations:</strong> Standards for collection and verification of biometric data during registration.</li>
                  <li><strong>Electoral Code of Conduct:</strong> Establishes ethical standards for all participants in electoral processes, including conduct during voter registration.</li>
                  <li><strong>IEBC Strategic Plans:</strong> Multi-year plans detailing IEBC's voter registration targets, methodologies, and innovations.</li>
                </ul>
                <p className="text-gray-700 mt-3"><strong>Significance:</strong> These regulations provide the detailed operational framework for voter registration. They ensure consistency, transparency, and compliance with the legal requirements established in the Acts.</p>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">Restrictions on Voter Registration</h3>
              <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded mb-4">
                <p className="text-gray-700 mb-3"><strong>Section 19(2) of the IEBC Act lists persons who CANNOT register as voters:</strong></p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>A person who is not a Kenyan citizen</li>
                  <li>A person who is less than 18 years of age</li>
                  <li>A person who is of unsound mind (as declared by a court)</li>
                  <li>A person serving a sentence of imprisonment for a term exceeding 6 months (disqualification lasts the duration of imprisonment)</li>
                  <li>A person convicted of a crime involving dishonesty (disqualification may be indefinite or time-limited depending on the court's judgment)</li>
                  <li>A person disqualified under any other law relating to elections</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">Penalties for Electoral Offences</h3>
              <div className="bg-orange-50 border-l-4 border-orange-600 p-4 rounded mb-4">
                <p className="text-gray-700 mb-3"><strong>The Elections Act establishes penalties for voter registration offences:</strong></p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Dual Registration:</strong> A person who registers in more than one constituency commits an offence and is liable to a fine or imprisonment (or both).</li>
                  <li><strong>False Information:</strong> Providing false information during voter registration is an offence.</li>
                  <li><strong>Interference with Registration:</strong> Any person who interferes with or obstructs voter registration is liable to criminal penalties.</li>
                  <li><strong>Unauthorized Access:</strong> Unauthorized access to the voter register or voter data is a criminal offence under the Elections Act and Data Protection Act.</li>
                </ul>
                <p className="text-gray-700 mt-3"><strong>Significance:</strong> These penalties ensure the integrity of the voter registration process and protect the electoral system from fraud and manipulation.</p>
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-300 rounded-lg p-4">
                <p className="text-gray-700"><strong>📋 Summary:</strong> Voter registration in Kenya is underpinned by a comprehensive legal framework designed to ensure that all eligible citizens can participate in elections while protecting the integrity of the electoral process. These laws establish clear eligibility criteria, procedures, data protection safeguards, and penalties for violations, working together to support Kenya's democratic ideals of free, fair, and transparent elections.</p>
              </div>
            </div>
          </section>

          {/* Section 3: Registration Methods */}
          <section id="methods" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <Users className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Voter Registration Methods in Kenya</h2>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">The IEBC offers multiple ways to register as a voter, making the process accessible to all eligible Kenyans.</p>
              
              <div className="space-y-4">
                <div className="bg-teal-50 border-l-4 border-teal-600 p-4 rounded">
                  <h3 className="font-bold text-gray-900 mb-2">1. Online Registration via IEBC Portal</h3>
                  <p className="text-gray-700">Register from home through the official IEBC website (www.iebc.or.ke). This method is fast, convenient, and available 24/7 during voter registration periods. You will need your national ID and a clear photo.</p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                  <h3 className="font-bold text-gray-900 mb-2">2. Physical Registration at County Offices</h3>
                  <p className="text-gray-700">Visit your county IEBC office during business hours to register in person. Bring your valid ID. An IEBC registration officer will assist you through the process. This method is ideal if you are not comfortable registering online.</p>
                </div>

                <div className="bg-cyan-50 border-l-4 border-cyan-600 p-4 rounded">
                  <h3 className="font-bold text-gray-900 mb-2">3. Constituency Registration Centers</h3>
                  <p className="text-gray-700">IEBC sets up temporary or permanent registration centers in constituencies, educational institutions, and public institutions. These centers operate during specific registration periods. Check the IEBC website for locations and dates in your area.</p>
                </div>

                <div className="bg-emerald-50 border-l-4 border-emerald-600 p-4 rounded">
                  <h3 className="font-bold text-gray-900 mb-2">4. Special Registration Programs</h3>
                  <p className="text-gray-700">IEBC conducts special registration drives targeting first-time voters (youth aged 18), PWDs (persons with disabilities), elderly citizens, and marginalized communities. Keep checking the IEBC website for announcements about special registration campaigns.</p>
                </div>
              </div>

              <div className="mt-6 bg-yellow-50 border border-yellow-300 rounded-lg p-4">
                <p className="text-gray-700"><strong>💡 Tip:</strong> Choose the registration method that is most convenient for you. Whether online or offline, the process takes only 10-15 minutes, and you only need to register once.</p>
              </div>
            </div>
          </section>

          {/* Section 3: Online Registration */}
          <section id="online" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Step-by-Step Guide to Registering Online</h2>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">Registering to vote online is the fastest and most convenient method. Follow these simple steps:</p>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold">1</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Visit the IEBC Website</h4>
                    <p className="text-gray-700">Go to <a href="https://www.iebc.or.ke" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-medium">www.iebc.or.ke</a> on your computer, tablet, or mobile phone. Look for the "Voter Registration Portal" or "Register to Vote Online" section on the homepage.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold">2</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Click "Register to Vote Online"</h4>
                    <p className="text-gray-700">Click the registration button and read through any information provided. The system may ask you to accept terms and conditions before proceeding. Read these carefully, then click "I Agree" to continue.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold">3</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Enter Your Personal Information</h4>
                    <p className="text-gray-700">Provide your full name (first name and surname), date of birth, mobile phone number, and email address (if prompted). Ensure all information matches your national ID exactly, as this is used for verification.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold">4</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Enter Your National ID Number</h4>
                    <p className="text-gray-700">Type your national identity number (found on your ID card). Double-check this, as it is the primary identifier for voter registration. The system will verify this against the national population register.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold">5</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Upload a Clear Photo of Your ID</h4>
                    <p className="text-gray-700">The system will prompt you to upload a digital copy of your ID (front page). Use your mobile phone camera or scanner to take a clear, well-lit photo. Ensure the ID is fully visible and legible. File formats accepted are usually JPEG, PNG, or PDF.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold">6</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Select Your Registration Location</h4>
                    <p className="text-gray-700">Choose your province, county, and constituency from the dropdown menus. This is the area where you will be registered as a voter. You can only be registered in ONE constituency. Select the constituency where you are eligible to vote.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold">7</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Review and Submit Your Registration</h4>
                    <p className="text-gray-700">Carefully review all the information you have entered. Check that your name, ID number, and registration location are correct. Once you are certain, click the "Submit" or "Complete Registration" button.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold">8</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Receive Confirmation</h4>
                    <p className="text-gray-700">You will receive a confirmation message via SMS or email with your registration details and reference number. Save this information. The message confirms that your registration has been submitted to IEBC for processing.</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-green-50 border border-green-300 rounded-lg p-4">
                <p className="text-gray-700"><strong>✓ Registration Complete:</strong> Once you receive confirmation, your registration is submitted. IEBC will verify your details and add you to the voter roll. You will receive your voter card by mail in 1-2 weeks, or you can collect it from your registration center.</p>
              </div>
            </div>
          </section>

          {/* Section 4: Offline Registration */}
          <section id="offline" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <Users className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Step-by-Step Guide to Registering Offline</h2>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">If you prefer to register in person, visit a voter registration center. Here is what to expect:</p>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-emerald-600 text-white font-bold">1</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Locate Your Nearest Registration Center</h4>
                    <p className="text-gray-700">Visit <a href="https://www.iebc.or.ke" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-medium">www.iebc.or.ke</a> and find the list of voter registration centers in your county and constituency. Registration centers are usually at county offices, sub-county offices, and educational institutions. Note the opening hours and address.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-emerald-600 text-white font-bold">2</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Bring Your Valid ID</h4>
                    <p className="text-gray-700">Carry one of the accepted identification documents (national ID, passport, birth certificate, etc.). Ensure your ID is valid and not expired. Also bring any other personal documents that may help verify your identity if needed.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-emerald-600 text-white font-bold">3</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Visit During Operating Hours</h4>
                    <p className="text-gray-700">Registration centers usually operate during normal business hours (8:00 AM – 5:00 PM, Monday to Friday). During special registration campaigns, they may operate on weekends or extended hours. Check the IEBC website for exact hours at your center.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-emerald-600 text-white font-bold">4</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Check In at the Reception</h4>
                    <p className="text-gray-700">When you arrive, go to the reception desk and inform them that you want to register as a voter. They will provide you with any forms or instructions you need. There is no registration fee – voter registration is free.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-emerald-600 text-white font-bold">5</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Meet with Registration Officer</h4>
                    <p className="text-gray-700">An IEBC registration officer will call you to their station. Present your ID and provide the requested information (full name, date of birth, address, mobile number, etc.). Answer the officer's questions honestly and completely.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-emerald-600 text-white font-bold">6</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Biometric Data Collection</h4>
                    <p className="text-gray-700">The registration officer will scan your ID using a biometric scanner. This captures your fingerprints and facial features for verification purposes. This is a standard security measure to prevent duplicate registrations.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-emerald-600 text-white font-bold">7</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Receive Confirmation Slip</h4>
                    <p className="text-gray-700">After completion, you will receive a confirmation slip with your registration details. Keep this slip safely – it proves you have registered. Note the registration number on the slip.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-emerald-600 text-white font-bold">8</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Collect Voter Card</h4>
                    <p className="text-gray-700">IEBC will process your registration and produce your voter card within 1-2 weeks. You will receive it by mail to your registered address, or you can collect it from your registration center. Always verify that your name and details on the voter card are correct.</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-green-50 border border-green-300 rounded-lg p-4">
                <p className="text-gray-700"><strong>⏱ Registration Duration:</strong> The offline registration process typically takes 10-15 minutes per person. During peak periods, there may be a queue, so arrive early or during less busy times.</p>
              </div>
            </div>
          </section>

          {/* Section 5: Update Details */}
          <section id="update" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How to Update or Correct Voter Registration Details</h2>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">If you notice errors or changes in your voter registration details, you can request corrections before or during registration period closures.</p>
              
              <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">Reasons to Update Your Registration:</h3>
              <ul className="space-y-2 text-gray-700 mb-4">
                <li>You misspelled your name during registration</li>
                <li>Your date of birth is incorrect</li>
                <li>You have relocated to a different constituency (requires new registration)</li>
                <li>Your mobile number or address has changed</li>
                <li>Your ID details were incorrectly entered</li>
              </ul>

              <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">Steps to Correct Your Registration:</h3>
              <ol className="space-y-3 text-gray-700 mb-4 list-decimal list-inside">
                <li>Visit your nearest IEBC county office or registration center with your voter card and ID</li>
                <li>Inform the registration officer of the errors you want to correct</li>
                <li>The officer will pull up your registration details on the system</li>
                <li>Review the current information and indicate the corrections needed</li>
                <li>The officer will make the corrections and print a new confirmation slip</li>
                <li>Keep the confirmation slip – your updated voter card will be reissued</li>
              </ol>

              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
                <p className="text-gray-700"><strong>Important:</strong> Corrections can be made during the voter registration period. Once the registration period closes for an election (typically 60 days before), corrections may not be allowed for that specific election. Plan ahead and correct errors early.</p>
              </div>
            </div>
          </section>

          {/* Section 6: Common Mistakes */}
          <section id="mistakes" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Common Mistakes to Avoid During Voter Registration</h2>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">Here are common mistakes that applicants make during voter registration – and how to avoid them:</p>
              
              <div className="space-y-4">
                <div className="border-l-4 border-red-600 bg-red-50 p-4 rounded">
                  <h4 className="font-bold text-gray-900 mb-2">❌ Mistake 1: Providing Inconsistent Information</h4>
                  <p className="text-gray-700">Ensure that the information you provide (name, date of birth, ID number) matches your official ID documents exactly. Any mismatch will cause verification to fail and delay your voter card.</p>
                </div>

                <div className="border-l-4 border-red-600 bg-red-50 p-4 rounded">
                  <h4 className="font-bold text-gray-900 mb-2">❌ Mistake 2: Using an Expired ID</h4>
                  <p className="text-gray-700">IEBC will not register you with an expired identification document. Before registering, check that your ID is still valid. If expired, renew it at the nearest Huduma Centre before registering.</p>
                </div>

                <div className="border-l-4 border-red-600 bg-red-50 p-4 rounded">
                  <h4 className="font-bold text-gray-900 mb-2">❌ Mistake 3: Registering in Multiple Constituencies</h4>
                  <p className="text-gray-700">You can only register in ONE constituency. If you register in multiple constituencies, all your registrations will be cancelled. You will have to restart the process.</p>
                </div>

                <div className="border-l-4 border-red-600 bg-red-50 p-4 rounded">
                  <h4 className="font-bold text-gray-900 mb-2">❌ Mistake 4: Uploading Blurry Photos of ID</h4>
                  <p className="text-gray-700">If you register online, ensure that your ID photo is clear, well-lit, and shows all details legibly. Blurry photos will cause verification to fail. Take multiple photos and choose the clearest one.</p>
                </div>

                <div className="border-l-4 border-red-600 bg-red-50 p-4 rounded">
                  <h4 className="font-bold text-gray-900 mb-2">❌ Mistake 5: Not Verifying Information Before Submission</h4>
                  <p className="text-gray-700">Always review your registration details before clicking "Submit." Once submitted, corrections take time and may cause delays. A quick review can save you from having to correct errors later.</p>
                </div>

                <div className="border-l-4 border-red-600 bg-red-50 p-4 rounded">
                  <h4 className="font-bold text-gray-900 mb-2">❌ Mistake 6: Missing Registration Deadlines</h4>
                  <p className="text-gray-700">IEBC closes voter registration 60 days before general elections. Do not wait until the last day to register. Register early to ensure your details are verified and your voter card is issued before the deadline.</p>
                </div>

                <div className="border-l-4 border-red-600 bg-red-50 p-4 rounded">
                  <h4 className="font-bold text-gray-900 mb-2">❌ Mistake 7: Losing Your Confirmation Slip</h4>
                  <p className="text-gray-700">Keep your registration confirmation slip and voter card in a safe place. These documents prove your registration status. If lost, you can request replacements from IEBC by providing your ID number.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 7: Confirmation */}
          <section id="confirmation" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How IEBC Confirms Your Voter Registration</h2>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">After you submit your voter registration (online or offline), IEBC begins a verification process to confirm your eligibility.</p>
              
              <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">The Verification Timeline:</h3>
              
              <table className="w-full border-collapse mb-4">
                <thead>
                  <tr className="bg-green-100 border border-gray-300">
                    <th className="border border-gray-300 px-4 py-2 text-left font-bold text-gray-900">Timeline</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-bold text-gray-900">What Happens</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border border-gray-300">
                    <td className="border border-gray-300 px-4 py-2 text-gray-700"><strong>Day 1</strong></td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">You receive SMS/email confirmation that registration was received</td>
                  </tr>
                  <tr className="bg-gray-50 border border-gray-300">
                    <td className="border border-gray-300 px-4 py-2 text-gray-700"><strong>Days 2-7</strong></td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">IEBC verifies your details against national population register and ID database</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="border border-gray-300 px-4 py-2 text-gray-700"><strong>Days 8-14</strong></td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">If verified successfully, your voter card is printed and dispatched</td>
                  </tr>
                  <tr className="bg-gray-50 border border-gray-300">
                    <td className="border border-gray-300 px-4 py-2 text-gray-700"><strong>Day 14+</strong></td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">You receive your voter card by mail OR collect it from registration center</td>
                  </tr>
                </tbody>
              </table>

              <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">How to Check Your Voter Status:</h3>
              <div className="space-y-3 text-gray-700">
                <p><strong>Method 1: IEBC Website</strong><br />Visit <a href="https://www.iebc.or.ke" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-medium">www.iebc.or.ke</a> and use the "Check Voter Status" tool. Enter your national ID number to check registration status.</p>
                <p><strong>Method 2: SMS</strong><br />Send an SMS to IEBC's dedicated number (check the website for current number). Include your ID number. You will receive a reply with your registration status.</p>
                <p><strong>Method 3: IEBC Office</strong><br />Visit your nearest IEBC county or constituency office with your ID. Staff will check your status and provide information about your voter card.</p>
                <p><strong>Method 4: Call IEBC</strong><br />Call the IEBC toll-free line (numbers available on the website) during business hours to inquire about your registration status.</p>
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-300 rounded-lg p-4">
                <p className="text-gray-700"><strong>What if verification fails?</strong> If IEBC cannot verify your details, you will receive a notification with instructions on how to correct the information or re-register. Contact IEBC immediately to resolve any issues.</p>
              </div>
            </div>
          </section>

          {/* Section 8: Voter Rights */}
          <section id="rights" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Your Rights as a Registered Voter</h2>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">Once you are registered as a voter, you have important rights and responsibilities. Learn more about <a href="/citizens-rights-during-elections-kenya" className="text-blue-600 hover:text-blue-700 font-medium">citizens' rights during elections</a>.</p>
              
              <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">Your Rights as a Voter:</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900">Right to Vote</h4>
                    <p className="text-gray-700">You have the right to cast your vote freely and in secret. No one can force you to vote for a particular candidate or party.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900">Fair and Accurate Vote Counting</h4>
                    <p className="text-gray-700">Your vote must be counted fairly and accurately. IEBC is obligated to ensure transparent vote tallying and result declaration.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900">Access to Voting Information</h4>
                    <p className="text-gray-700">IEBC must provide you with information about where, when, and how to vote. You have the right to ask questions about election procedures.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900">Right to Observe Elections</h4>
                    <p className="text-gray-700">You can volunteer to observe elections and ensure they are conducted fairly. IEBC accredits observers to monitor polling stations.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900">Right to Report Violations</h4>
                    <p className="text-gray-700">If you witness election violations or irregularities, you can report them to IEBC, election monitors, or law enforcement agencies.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900">Right to Assistance</h4>
                    <p className="text-gray-700">If you are elderly, have a disability, or cannot read/write, you have the right to request assistance when voting. A person of your choice can help you cast your vote.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900">Right to Challenge Results</h4>
                    <p className="text-gray-700">If you believe election results are incorrect, you have the right to lodge a petition before the courts within the specified timeframe.</p>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mt-8 mb-3">Your Responsibilities as a Voter:</h3>
              <ul className="space-y-2 text-gray-700">
                <li><strong>Vote Responsibly:</strong> Take your voting decision seriously and vote for candidates of your choice.</li>
                <li><strong>Respect Election Rules:</strong> Follow all election procedures and instructions from polling station officials.</li>
                <li><strong>Report Problems:</strong> If you see irregularities or violations, report them to the appropriate authorities.</li>
                <li><strong>Maintain Voter Secrecy:</strong> Do not disclose who you voted for, and respect others' voting privacy.</li>
                <li><strong>Participate in Civic Processes:</strong> Beyond voting, engage in other civic activities to strengthen democracy.</li>
              </ul>
            </div>
          </section>

          {/* Section 9: FAQs */}
          <section id="faqs" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <MessageSquare className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Frequently Asked Questions About Voter Registration</h2>
            </div>
            <div className="space-y-3 mt-6">
              {faqsData.map((faq: FAQItem) => (
                <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full px-4 py-4 flex items-center justify-between hover:bg-teal-50 transition bg-white"
                  >
                    <span className="text-left font-semibold text-gray-900 text-sm sm:text-base">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-teal-600 flex-shrink-0 transition-transform ${
                        expandedFAQ === faq.id ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedFAQ === faq.id && (
                    <div className="px-4 py-4 bg-teal-50 border-t border-gray-200">
                      <p className="text-gray-700 text-sm sm:text-base">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="mt-12 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg p-8 border border-blue-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Register as a Voter?</h3>
            <p className="text-gray-700 mb-6">Don't miss the opportunity to participate in Kenya's democratic process. Register now to have your voice heard in upcoming elections.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="https://www.iebc.or.ke" target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2">
                Register Online Now <ArrowRight className="w-5 h-5" />
              </a>
              <a href="https://wa.me/254112810203?text=I%20need%20help%20with%20voter%20registration%20in%20Kenya" target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2">
                Chat on WhatsApp <MessageSquare className="w-5 h-5" />
              </a>
            </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-16 py-8 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-white mb-4">Related Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/understanding-iebc-kenya" className="hover:text-teal-400 transition">Understanding IEBC</a></li>
                <li><a href="/elections-in-kenya" className="hover:text-teal-400 transition">Elections in Kenya</a></li>
                <li><a href="/presidential-parliamentary-county-elections-kenya" className="hover:text-teal-400 transition">Types of Elections</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Contact Us</h4>
              <p className="text-sm mb-2">Email: <a href="mailto:johnsonthuraniramwangi@gmail.com" className="text-teal-400 hover:text-teal-300">johnsonthuraniramwangi@gmail.com</a></p>
              <p className="text-sm">WhatsApp: <a href="https://wa.me/254112810203" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300">+254 112 810 203</a></p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Official Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://www.iebc.or.ke" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition">IEBC Website</a></li>
                <li><a href="https://www.iebc.or.ke/registration/" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition">Voter Registration Portal</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-sm">
            <p className="mb-2">© 2026 Wakili. All rights reserved.</p>
            <p className="text-gray-500">This is an informational resource. Always refer to official <a href="https://www.iebc.or.ke" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300">IEBC sources</a> for official voter registration procedures.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}