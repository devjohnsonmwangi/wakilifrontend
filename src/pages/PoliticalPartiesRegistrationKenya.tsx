import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Users, FileText, CheckCircle2, AlertCircle, BarChart3, Scale, Building2 } from 'lucide-react';

// FAQ Data
const faqs = [
  {
    question: "What is a political party in Kenya?",
    answer: "A political party is an organized group of citizens with a shared political ideology that seeks to influence government policy and win elective office. In Kenya, political parties are registered with the Office of the Registrar of Political Parties (ORPP) and play a crucial role in the democratic process."
  },
  {
    question: "How many political parties are registered in Kenya?",
    answer: "As of 2026, Kenya has over 60 registered political parties. The number varies as new parties are registered and others are deregistered for non-compliance with party registration requirements. Major parties include Jubilee Party, ODM, Kenya Kwanza Alliance members, and many others."
  },
  {
    question: "What is ORPP and what does it do?",
    answer: "ORPP (Office of the Registrar of Political Parties) is an independent constitutional office established under Article 92 of the Constitution. It registers, regulates, monitors, and oversees political parties in Kenya to ensure compliance with electoral laws and democratic principles."
  },
  {
    question: "How much does it cost to register a political party?",
    answer: "The registration fee for a political party is KES 100,000. This fee must be paid to ORPP when submitting the party registration application. Additional costs may include legal representation and printing of required documents."
  },
  {
    question: "How long does political party registration take?",
    answer: "ORPP typically takes 30-60 days to process a political party registration application. The timeframe depends on the completeness of your application, verification of member signatures, and ORPP's workload. You can check the status through ORPP's portal."
  },
  {
    question: "Can independent candidates run without a political party?",
    answer: "Yes, independent candidates can run for elective office without a political party. They must meet the same eligibility requirements as party-sponsored candidates and follow the same nomination procedures, but they do not need party affiliation."
  },
  {
    question: "What is the minimum number of members required to form a political party?",
    answer: "A political party must have a minimum of 1,000 registered members spread across at least 24 counties. Members must be Kenyan citizens aged 18+ and registered voters. Each county must have at least 10 members."
  },
  {
    question: "Can a political party be deregistered?",
    answer: "Yes, ORPP can deregister a political party for violations including: failure to meet financial reporting requirements, inactivity (not fielding candidates), member reduction below minimums, violation of the Political Parties Code of Conduct, or failure to pay annual registration fees."
  },
  {
    question: "How are candidates nominated by political parties?",
    answer: "Political parties nominate candidates through internal party processes including: primaries, party leader selection, consensus, or other party-defined methods. Nominated candidates must meet constitutional eligibility requirements and complete IEBC registration within the prescribed timeframe."
  },
  {
    question: "What are political party coalitions?",
    answer: "Political party coalitions are formal alliances of two or more registered political parties that work together during elections. Coalitions are registered with ORPP and function as single entities for electoral purposes, allowing parties to combine resources and candidate support."
  },
  {
    question: "Can a political party receive foreign funding?",
    answer: "No, political parties are prohibited from receiving funding from foreign governments, organizations, or individuals. All party funding must come from Kenyan citizens and registered organizations. The Political Parties Act strictly regulates and limits party financing."
  },
  {
    question: "What is a party symbol and how is it registered?",
    answer: "A party symbol is a unique visual mark (logo or emblem) used by a political party on ballots. Parties must register their symbol with ORPP to prevent confusion during voting. Symbols must be distinct and approved before the party is officially registered."
  },
  {
    question: "What are party membership requirements?",
    answer: "Party members must be Kenyan citizens aged 18+, registered voters, and willing to abide by the party's constitution. Members have rights including participation in party decisions, attending party meetings, and voting in party elections or primaries."
  },
  {
    question: "How are political parties funded in Kenya?",
    answer: "Political parties are funded through: membership dues, party fundraising activities, private donations from Kenyan citizens (with limits), grants from organizations supporting democracy, and state funding allocated by Parliament through the Political Parties Fund."
  },
  {
    question: "What happens if a political party fails annual compliance?",
    answer: "If a party fails annual compliance checks, ORPP sends a warning letter. The party has 30 days to remedy violations. Continued non-compliance can result in suspension of funding, limitations on candidate nomination, and eventual deregistration."
  }
];

const PoliticalPartiesRegistrationKenya: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<string>('overview');

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  useEffect(() => {
    const metaTitle = 'Political Parties & Party Registration in Kenya – Legal Guide';
    const metaDescription = 'Complete legal guide to political parties in Kenya. Learn how to register, party laws, ORPP requirements, nomination process, and party funding regulations.';

    document.title = metaTitle;
    
    const metaDescriptionTag = document.querySelector('meta[name="description"]');
    if (metaDescriptionTag) {
      metaDescriptionTag.setAttribute('content', metaDescription);
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', metaTitle);
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute('content', metaDescription);

    // JSON-LD Structured Data
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
              "name": "Political Parties Registration",
              "item": "https://wakili.co.ke/political-parties-registration-kenya"
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
          "@type": "HowTo",
          "name": "How to Register a Political Party in Kenya",
          "step": [
            {
              "@type": "HowToStep",
              "name": "Prepare Documentation",
              "text": "Gather party constitution, member details, symbol design, and financial information"
            },
            {
              "@type": "HowToStep",
              "name": "Collect 1,000+ Members",
              "text": "Recruit minimum 1,000 members from at least 24 counties with at least 10 per county"
            },
            {
              "@type": "HowToStep",
              "name": "Submit Application to ORPP",
              "text": "Complete ORPP forms with party details, constitution, and member register"
            },
            {
              "@type": "HowToStep",
              "name": "ORPP Verification",
              "text": "ORPP verifies documentation, member signatures, and compliance within 30-60 days"
            },
            {
              "@type": "HowToStep",
              "name": "Official Registration",
              "text": "ORPP issues registration certificate and party is gazetted as officially registered"
            }
          ]
        },
        {
          "@type": "GovernmentOrganization",
          "name": "Office of the Registrar of Political Parties (ORPP)",
          "url": "https://www.orpp.or.ke",
          "sameAs": "https://www.orpp.or.ke",
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "Customer Service",
            "telephone": "+254-20-3865000",
            "url": "https://www.orpp.or.ke/contact"
          },
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Laikipia Road, Upper Hill",
            "addressLocality": "Nairobi",
            "postalCode": "00100",
            "addressCountry": "Kenya"
          },
          "areaServed": "Kenya",
          "description": "Constitutional office responsible for registering, monitoring and regulating political parties in Kenya"
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
      const sections = ['overview', 'definition', 'legal-framework', 'orpp-role', 'types', 'requirements', 'process', 'membership', 'nomination', 'funding', 'disputes', 'faqs'];
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
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex text-sm text-gray-600">
              <Link to="/" className="hover:text-blue-600">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">Political Parties Registration</span>
            </nav>
          </div>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Political Parties & Party Registration in Kenya – Complete Legal Guide</h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-3xl">Master guide to registering a political party, understanding party laws, nomination processes, and compliance requirements with ORPP in Kenya.</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar TOC */}
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
                      { id: 'definition', label: 'What is a Party', icon: Users },
                      { id: 'legal-framework', label: 'Legal Framework', icon: Scale },
                      { id: 'orpp-role', label: 'ORPP Role', icon: Building2 },
                      { id: 'types', label: 'Types of Parties', icon: Users },
                      { id: 'requirements', label: 'Requirements', icon: CheckCircle2 },
                      { id: 'process', label: 'Registration Process', icon: FileText },
                      { id: 'membership', label: 'Membership Rules', icon: Users },
                      { id: 'nomination', label: 'Nomination Process', icon: CheckCircle2 },
                      { id: 'funding', label: 'Funding & Compliance', icon: BarChart3 },
                      { id: 'disputes', label: 'Legal Issues', icon: AlertCircle },
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

            {/* Main Content */}
            <main className="flex-1">
              {/* Section 1: Overview */}
              <section id="overview" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <BarChart3 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Overview: Political Parties in Kenya</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6 text-lg leading-relaxed">Political parties are fundamental to Kenya's democratic system. The <a href="/understanding-iebc-kenya" className="text-blue-600 hover:text-blue-700 font-medium">Independent Electoral and Boundaries Commission (IEBC)</a> works alongside the Office of the Registrar of Political Parties (ORPP) to ensure fair, transparent, and democratic electoral processes.</p>

                  {/* Statistics Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                      <div className="text-3xl font-bold text-blue-700 mb-2">60+</div>
                      <div className="text-gray-900 font-semibold mb-1">Registered Parties</div>
                      <div className="text-sm text-gray-600">Political parties registered with ORPP</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                      <div className="text-3xl font-bold text-purple-700 mb-2">KES 100K</div>
                      <div className="text-gray-900 font-semibold mb-1">Registration Fee</div>
                      <div className="text-sm text-gray-600">Cost to register a new political party</div>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                      <div className="text-3xl font-bold text-indigo-700 mb-2">24 Counties</div>
                      <div className="text-gray-900 font-semibold mb-1">Minimum Spread</div>
                      <div className="text-sm text-gray-600">Membership requirement across counties</div>
                    </div>
                  </div>

                  {/* Image: Political Party Structure */}
                  <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl p-8 border-2 border-blue-300 shadow-lg my-8">
                    <h3 className="font-bold text-gray-900 text-lg mb-6 text-center">🏛️ Political Party Ecosystem in Kenya</h3>
                    <svg className="w-full h-80 mx-auto" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                      {/* ORPP Center */}
                      <circle cx="200" cy="150" r="40" fill="#1e40af" stroke="#1e3a8a" strokeWidth="2"/>
                      <text x="200" y="145" fontSize="12" fill="white" textAnchor="middle" fontWeight="bold">ORPP</text>
                      <text x="200" y="160" fontSize="10" fill="white" textAnchor="middle">Regulator</text>
                      
                      {/* Political Parties */}
                      <circle cx="80" cy="80" r="30" fill="#7c3aed" stroke="#6d28d9" strokeWidth="2"/>
                      <text x="80" y="85" fontSize="11" fill="white" textAnchor="middle" fontWeight="bold">Party A</text>
                      <path d="M 115 115 L 165 140" stroke="#666" strokeWidth="2" strokeDasharray="5,5"/>
                      
                      <circle cx="200" cy="40" r="30" fill="#7c3aed" stroke="#6d28d9" strokeWidth="2"/>
                      <text x="200" y="45" fontSize="11" fill="white" textAnchor="middle" fontWeight="bold">Party B</text>
                      <path d="M 200 70 L 200 110" stroke="#666" strokeWidth="2" strokeDasharray="5,5"/>
                      
                      <circle cx="320" cy="80" r="30" fill="#7c3aed" stroke="#6d28d9" strokeWidth="2"/>
                      <text x="320" y="85" fontSize="11" fill="white" textAnchor="middle" fontWeight="bold">Party C</text>
                      <path d="M 285 115 L 235 140" stroke="#666" strokeWidth="2" strokeDasharray="5,5"/>
                      
                      {/* Coalition */}
                      <rect x="100" y="210" width="200" height="50" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2" rx="4"/>
                      <text x="200" y="230" fontSize="12" fill="#15803d" textAnchor="middle" fontWeight="bold">Coalition</text>
                      <text x="200" y="245" fontSize="10" fill="#16a34a" textAnchor="middle">(Multiple Parties)</text>
                      <path d="M 80 110 L 140 210" stroke="#16a34a" strokeWidth="2"/>
                      <path d="M 200 110 L 200 210" stroke="#16a34a" strokeWidth="2"/>
                      <path d="M 320 110 L 260 210" stroke="#16a34a" strokeWidth="2"/>
                      
                      {/* IEBC Connection */}
                      <circle cx="200" cy="280" r="12" fill="#059669"/>
                      <text x="200" y="285" fontSize="10" fill="white" textAnchor="middle" fontWeight="bold">IEBC</text>
                      <path d="M 200 190 L 200 268" stroke="#059669" strokeWidth="2"/>
                      
                      {/* Labels */}
                      <text x="20" y="25" fontSize="11" fill="#374151" fontWeight="bold">Registered Parties</text>
                      <text x="80" y="280" fontSize="10" fill="#666" textAnchor="middle">Elections</text>
                    </svg>
                    <p className="text-center text-sm text-gray-600 mt-4">ORPP regulates parties; parties form coalitions; all participate in IEBC-managed elections</p>
                  </div>
                </div>
              </section>

              {/* Section 2: Definition */}
              <section id="definition" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Users className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What is a Political Party in Kenya?</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">A political party is a registered organization of citizens united by common political ideologies and goals, seeking to influence government policy and win elective office through democratic processes. In Kenya, political parties are constitutional entities regulated by both the <a href="/elections-in-kenya" className="text-blue-600 hover:text-blue-700">Constitution</a> and the Political Parties Act.</p>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">Key Characteristics of Political Parties</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white border-l-4 border-blue-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">🎯 Party Ideology</h4>
                      <p className="text-gray-700 text-sm">Each party has a constitution defining its political ideology, values, and objectives. Parties may be left-wing, right-wing, centrist, or focused on specific regional or economic interests.</p>
                    </div>

                    <div className="bg-white border-l-4 border-purple-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">👥 Membership Base</h4>
                      <p className="text-gray-700 text-sm">Parties maintain registered members who participate in party decision-making, elections, and fund generation. Members must be Kenyan citizens aged 18+ and registered voters.</p>
                    </div>

                    <div className="bg-white border-l-4 border-indigo-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">📋 Leadership Structure</h4>
                      <p className="text-gray-700 text-sm">Parties have defined leadership hierarchies including party president/leader, national executive committee, regional officers, and grassroots structures in counties and constituencies.</p>
                    </div>

                    <div className="bg-white border-l-4 border-pink-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">💰 Financial Management</h4>
                      <p className="text-gray-700 text-sm">Parties manage budgets, collect membership dues, receive donations, and report finances to ORPP annually. Transparency and compliance with funding limits are mandatory.</p>
                    </div>

                    <div className="bg-white border-l-4 border-green-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">🏛️ Electoral Participation</h4>
                      <p className="text-gray-700 text-sm">Registered parties nominate candidates for elective positions and participate in elections. They can contest independently or form coalitions with other parties.</p>
                    </div>

                    <div className="bg-white border-l-4 border-orange-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">⚖️ Legal Accountability</h4>
                      <p className="text-gray-700 text-sm">Parties must comply with electoral laws, the Political Parties Code of Conduct, and ORPP regulations. Non-compliance can result in sanctions or deregistration.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 3: Legal Framework */}
              <section id="legal-framework" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Scale className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Legal Framework Governing Political Parties</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Kenya's political parties operate within a comprehensive legal framework designed to ensure democratic governance, transparency, and fair electoral competition.</p>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">Constitutional Foundation</h3>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-blue-600 p-6 rounded-lg shadow-sm mb-6">
                    <h4 className="font-bold text-gray-900 mb-3">Constitution of Kenya 2010</h4>
                    <ul className="space-y-3 text-sm text-gray-700">
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Article 33:</strong> Citizens have freedom of association and right to form political parties</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Article 91-92:</strong> Establishes ORPP as independent constitutional office responsible for party registration and regulation</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Article 107:</strong> Defines party nomination process for parliamentary candidates</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Chapter 15:</strong> Addresses political parties and elections</span></li>
                    </ul>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">Primary Legislation</h3>

                  <div className="space-y-4 mb-6">
                    <div className="bg-white border-2 border-purple-300 p-5 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><FileText className="w-5 h-5 text-purple-600" /> Political Parties Act 2011</h4>
                      <ul className="space-y-2 text-gray-700 text-sm ml-7">
                        <li>• <strong>Section 3:</strong> Sets minimum membership requirements (1,000 members from 24+ counties)</li>
                        <li>• <strong>Section 5:</strong> Prescribes registration fee and required documentation</li>
                        <li>• <strong>Section 12:</strong> Defines party nomination process and selection methods</li>
                        <li>• <strong>Section 23:</strong> Establishes party financial reporting requirements</li>
                        <li>• <strong>Section 24:</strong> Regulates political party funding and donation limits</li>
                        <li>• <strong>Section 33:</strong> Allows for party deregistration due to non-compliance</li>
                      </ul>
                    </div>

                    <div className="bg-white border-2 border-indigo-300 p-5 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><FileText className="w-5 h-5 text-indigo-600" /> Elections Act 2011</h4>
                      <ul className="space-y-2 text-gray-700 text-sm ml-7">
                        <li>• <strong>Sections 71-80:</strong> Party nomination procedures for parliamentary candidates</li>
                        <li>• <strong>Section 79:</strong> Timeline requirements for nominating and registering candidates with IEBC</li>
                        <li>• <strong>Section 92:</strong> Defines relationships between IEBC and political parties</li>
                      </ul>
                    </div>

                    <div className="bg-white border-2 border-blue-300 p-5 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><FileText className="w-5 h-5 text-blue-600" /> Election Operations Act 2017</h4>
                      <ul className="space-y-2 text-gray-700 text-sm ml-7">
                        <li>• <strong>Part IV:</strong> Specifies party nomination timelines and procedures</li>
                        <li>• <strong>Section 34:</strong> Sets candidate nomination deadlines</li>
                      </ul>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">ORPP Regulations & Standards</h3>

                  <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded-lg shadow-sm">
                    <div className="space-y-2 text-sm text-gray-700">
                      <p className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" /><span><strong>Political Parties Code of Conduct 2013:</strong> Ethical standards and democratic principles parties must follow</span></p>
                      <p className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" /><span><strong>ORPP Regulations 2012:</strong> Detailed procedures for party registration, compliance, and monitoring</span></p>
                      <p className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" /><span><strong>Political Parties Financial Disclosure Guide:</strong> Requirements for annual financial reporting and transparency</span></p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 4: ORPP Role */}
              <section id="orpp-role" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Building2 className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Role of the Office of the Registrar of Political Parties (ORPP)</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">The Office of the Registrar of Political Parties (ORPP) is an independent constitutional office established under Article 92 of the Constitution. ORPP plays a critical regulatory role in Kenya's political system.</p>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">ORPP Functions & Responsibilities</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200 p-6 rounded-xl shadow-sm">
                      <h4 className="font-bold text-gray-900 text-lg mb-3">📝 Party Registration</h4>
                      <p className="text-gray-700 text-sm">Receives applications, verifies documentation and membership, approves party symbols, and issues registration certificates to qualifying political parties.</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 p-6 rounded-xl shadow-sm">
                      <h4 className="font-bold text-gray-900 text-lg mb-3">🔍 Monitoring & Compliance</h4>
                      <p className="text-gray-700 text-sm">Monitors parties for compliance with laws, the Political Parties Code of Conduct, and ORPP regulations. Investigates complaints and ensures parties meet annual compliance requirements.</p>
                    </div>

                    <div className="bg-gradient-to-br from-cyan-50 to-teal-50 border-2 border-cyan-200 p-6 rounded-xl shadow-sm">
                      <h4 className="font-bold text-gray-900 text-lg mb-3">💰 Financial Oversight</h4>
                      <p className="text-gray-700 text-sm">Receives and reviews party financial disclosures, tracks donations and funding sources, ensures compliance with funding limits, and manages Political Parties Fund distribution.</p>
                    </div>

                    <div className="bg-gradient-to-br from-teal-50 to-green-50 border-2 border-teal-200 p-6 rounded-xl shadow-sm">
                      <h4 className="font-bold text-gray-900 text-lg mb-3">⚖️ Enforcement & Discipline</h4>
                      <p className="text-gray-700 text-sm">Imposes sanctions on non-compliant parties (warnings, fines, suspension of funding), deregisters parties that fail to meet requirements, and handles disputes between parties.</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg shadow-sm mb-6">
                    <p className="text-gray-900 font-semibold mb-2">📞 Contact ORPP</p>
                    <p className="text-gray-700 text-sm mb-2"><strong>Website:</strong> <a href="https://www.orpp.or.ke" className="text-blue-600 hover:text-blue-700">www.orpp.or.ke</a></p>
                    <p className="text-gray-700 text-sm mb-2"><strong>Telephone:</strong> +254-20-3865000</p>
                    <p className="text-gray-700 text-sm"><strong>Address:</strong> Laikipia Road, Upper Hill, Nairobi, Kenya</p>
                  </div>
                </div>
              </section>

              {/* Section 5: Types of Political Parties */}
              <section id="types" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Users className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Types of Political Parties in Kenya</h2>
                </div>

                <div className="prose max-w-none">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-300 p-6 rounded-xl shadow-sm">
                      <h4 className="font-bold text-gray-900 text-lg mb-3">🌍 National Parties</h4>
                      <p className="text-gray-700 text-sm mb-3">Operate across the entire country with presence in most or all counties. Field candidates for presidential, parliamentary, and county offices nationwide.</p>
                      <p className="text-gray-700 text-sm font-semibold">Examples: ODM, Jubilee, AIC</p>
                    </div>

                    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-300 p-6 rounded-xl shadow-sm">
                      <h4 className="font-bold text-gray-900 text-lg mb-3">🏘️ County Parties</h4>
                      <p className="text-gray-700 text-sm mb-3">Operate in specific counties only. Can only field candidates for county offices (Governor, Deputy Governor, MCAs). May not contest presidential or parliamentary races.</p>
                      <p className="text-gray-700 text-sm font-semibold">Examples: Various regional parties</p>
                    </div>

                    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-300 p-6 rounded-xl shadow-sm">
                      <h4 className="font-bold text-gray-900 text-lg mb-3">🤝 Coalitions</h4>
                      <p className="text-gray-700 text-sm mb-3">Formal alliances of two or more registered parties working together. Registered as single entity with ORPP. Field candidates under coalition banner.</p>
                      <p className="text-gray-700 text-sm font-semibold">Examples: Kenya Kwanza, Azimio la Umoja</p>
                    </div>
                  </div>

                  <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
                        <tr>
                          <th className="px-6 py-4 text-left font-semibold">Party Type</th>
                          <th className="px-6 py-4 text-left font-semibold">Geographic Scope</th>
                          <th className="px-6 py-4 text-left font-semibold">Candidate Rights</th>
                          <th className="px-6 py-4 text-left font-semibold">Registration Requirements</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">National</td>
                          <td className="px-6 py-4 text-gray-700">Nationwide</td>
                          <td className="px-6 py-4 text-gray-700">Presidential, Parliamentary, County</td>
                          <td className="px-6 py-4 text-gray-700">1,000 members from 24+ counties</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">County</td>
                          <td className="px-6 py-4 text-gray-700">Single county only</td>
                          <td className="px-6 py-4 text-gray-700">County positions only</td>
                          <td className="px-6 py-4 text-gray-700">300 members in that county</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Coalition</td>
                          <td className="px-6 py-4 text-gray-700">Determined by member parties</td>
                          <td className="px-6 py-4 text-gray-700">All positions (via member parties)</td>
                          <td className="px-6 py-4 text-gray-700">2+ registered parties minimum</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* Section 6: Requirements */}
              <section id="requirements" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Requirements to Register a Political Party</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">To register a political party in Kenya, you must meet specific constitutional and legal requirements set by ORPP.</p>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">Membership Requirements (National Parties)</h3>

                  <div className="bg-white border-2 border-emerald-300 p-6 rounded-xl shadow-sm mb-6">
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">Minimum 1,000 Members</p>
                          <p className="text-gray-700 text-sm">Party must have at least 1,000 registered members who are Kenyan citizens, aged 18+, and registered voters</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">Spread Across 24+ Counties</p>
                          <p className="text-gray-700 text-sm">Members must be distributed across at least 24 of Kenya's 47 counties (more than half)</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">Minimum 10 Members per County</p>
                          <p className="text-gray-700 text-sm">Each county where the party has members must have at least 10 registered members</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">Documentation Requirements</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="bg-white border-l-4 border-blue-600 p-5 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2">📋 Party Constitution</h4>
                      <p className="text-gray-700 text-sm">Complete party constitution outlining party structure, leadership, membership, dispute resolution, nomination process, and amendment procedures</p>
                    </div>

                    <div className="bg-white border-l-4 border-indigo-600 p-5 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2">👥 Member Register</h4>
                      <p className="text-gray-700 text-sm">Complete list of 1,000+ founding members with names, ID numbers, phone numbers, and counties. Must include member signatures</p>
                    </div>

                    <div className="bg-white border-l-4 border-purple-600 p-5 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2">🎨 Party Symbol</h4>
                      <p className="text-gray-700 text-sm">Unique, distinct party symbol/logo suitable for ballot display. Design must be approved by ORPP and not conflict with other parties' symbols</p>
                    </div>

                    <div className="bg-white border-l-4 border-pink-600 p-5 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2">👔 Leadership Details</h4>
                      <p className="text-gray-700 text-sm">Names and contact information of party leader, national chair, secretary general, and other key office holders</p>
                    </div>

                    <div className="bg-white border-l-4 border-red-600 p-5 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2">💳 Payment Proof</h4>
                      <p className="text-gray-700 text-sm">Proof of KES 100,000 registration fee payment to ORPP bank account</p>
                    </div>

                    <div className="bg-white border-l-4 border-orange-600 p-5 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2">📝 Application Forms</h4>
                      <p className="text-gray-700 text-sm">Completed ORPP application forms (Form A) with all required information and declarations</p>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">Other Requirements</h3>

                  <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded-lg">
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" /><span>Party name must be unique and not identical to existing registered parties</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" /><span>Party must not violate democratic principles or promote violence/discrimination</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" /><span>Party must have transparent governance structure with democratic decision-making</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" /><span>Party must commit to Code of Conduct and ORPP regulations</span></li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 7: Registration Process */}
              <section id="process" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Step-by-Step Party Registration Process</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Registering a political party with ORPP involves multiple steps over 30-60 days. Follow this process carefully.</p>

                  <div className="space-y-4 mb-8">
                    <div className="bg-white border-l-4 border-cyan-600 p-5 rounded-lg shadow-sm">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">Prepare Documentation</p>
                          <p className="text-gray-700 text-sm">Draft party constitution, compile member register with 1,000+ members from 24+ counties, design party symbol, identify leadership</p>
                          <p className="text-gray-600 text-xs mt-2">Timeline: 2-4 weeks</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border-l-4 border-cyan-600 p-5 rounded-lg shadow-sm">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">Pay Registration Fee</p>
                          <p className="text-gray-700 text-sm">Pay KES 100,000 to ORPP designated bank account. Keep payment proof and receipt</p>
                          <p className="text-gray-600 text-xs mt-2">Timeline: 1 day</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border-l-4 border-cyan-600 p-5 rounded-lg shadow-sm">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">Submit Application to ORPP</p>
                          <p className="text-gray-700 text-sm">Submit completed ORPP application form with all documents: constitution, member register, symbol design, payment proof, leadership details</p>
                          <p className="text-gray-600 text-xs mt-2">Timeline: Same day</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border-l-4 border-cyan-600 p-5 rounded-lg shadow-sm">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold">4</div>
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">ORPP Verification Process</p>
                          <p className="text-gray-700 text-sm">ORPP verifies documentation completeness, verifies member signatures against voter register, checks symbol distinctiveness, assesses compliance with requirements</p>
                          <p className="text-gray-600 text-xs mt-2">Timeline: 30-45 days</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border-l-4 border-cyan-600 p-5 rounded-lg shadow-sm">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold">5</div>
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">ORPP Decision</p>
                          <p className="text-gray-700 text-sm">ORPP approves registration or requests corrections/additional information. Contact party applicant with decision</p>
                          <p className="text-gray-600 text-xs mt-2">Timeline: Day 30-60</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border-l-4 border-cyan-600 p-5 rounded-lg shadow-sm">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold">6</div>
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">Issue Registration Certificate</p>
                          <p className="text-gray-700 text-sm">Upon approval, ORPP issues official registration certificate and gazettes party name in Kenya Gazette</p>
                          <p className="text-gray-600 text-xs mt-2">Timeline: Day 60</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border-l-4 border-cyan-600 p-5 rounded-lg shadow-sm">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold">7</div>
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">Official Registration Complete</p>
                          <p className="text-gray-700 text-sm">Party is now officially registered and can participate in elections, nominate candidates, and receive political party fund allocations</p>
                          <p className="text-gray-600 text-xs mt-2">Timeline: Day 60+</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg">
                    <p className="text-gray-900 font-semibold mb-2">💡 Registration Tips</p>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Ensure all member signatures are verified and valid ID numbers are correct</li>
                      <li>• Keep duplicate copies of all documents submitted to ORPP</li>
                      <li>• Respond promptly to any ORPP requests for additional information</li>
                      <li>• Check ORPP portal or contact ORPP for application status updates</li>
                      <li>• Ensure party constitution is comprehensive and complies with ORPP guidelines</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 8: Membership Rules */}
              <section id="membership" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Users className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Party Membership Rules & Rights</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Political party members have specific rights and responsibilities defined by party constitutions and the Political Parties Act.</p>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">Member Eligibility Requirements</h3>

                  <div className="bg-white border-2 border-purple-300 p-6 rounded-xl shadow-sm mb-6">
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-900">Kenyan Citizenship</p>
                          <p className="text-gray-700 text-sm">Must be a Kenyan citizen by birth or naturalization</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-900">Age Requirement</p>
                          <p className="text-gray-700 text-sm">Must be at least 18 years old</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-900">Voter Registration</p>
                          <p className="text-gray-700 text-sm">Must be a registered voter with a valid voter registration number</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-900">Party Commitment</p>
                          <p className="text-gray-700 text-sm">Must voluntarily commit to party ideology and abide by party constitution</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">Member Rights</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="bg-white border-l-4 border-green-600 p-5 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2">✓ Vote in Party Elections</h4>
                      <p className="text-gray-700 text-sm">Vote in party primary elections to select candidates or party leaders</p>
                    </div>

                    <div className="bg-white border-l-4 border-green-600 p-5 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2">✓ Run for Party Office</h4>
                      <p className="text-gray-700 text-sm">Eligible to contest for positions in party leadership hierarchy</p>
                    </div>

                    <div className="bg-white border-l-4 border-green-600 p-5 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2">✓ Attend Party Meetings</h4>
                      <p className="text-gray-700 text-sm">Participate in party meetings, conferences, and decision-making forums</p>
                    </div>

                    <div className="bg-white border-l-4 border-green-600 p-5 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2">✓ Access Party Information</h4>
                      <p className="text-gray-700 text-sm">Receive party communications, manifestos, and policy information</p>
                    </div>

                    <div className="bg-white border-l-4 border-green-600 p-5 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2">✓ Voice Concerns</h4>
                      <p className="text-gray-700 text-sm">Raise concerns or complaints through party internal dispute mechanisms</p>
                    </div>

                    <div className="bg-white border-l-4 border-green-600 p-5 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2">✓ Fair Treatment</h4>
                      <p className="text-gray-700 text-sm">Receive fair treatment without discrimination based on protected characteristics</p>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">Member Responsibilities</h3>

                  <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded-lg">
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" /><span>Pay membership dues as required by party constitution</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" /><span>Abide by party constitution and rules</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" /><span>Support party candidates and policy positions</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" /><span>Comply with Political Parties Code of Conduct</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" /><span>Not engage in unethical or violent behavior on behalf of party</span></li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 9: Nomination Process */}
              <section id="nomination" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="w-6 h-6 text-pink-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Candidate Nomination Process</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Political parties nominate candidates through internal processes defined in their constitutions. The Elections Act and Election Operations Act provide timelines and requirements.</p>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">Party Nomination Methods</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white border-2 border-pink-300 p-6 rounded-xl shadow-sm">
                      <h4 className="font-bold text-gray-900 text-lg mb-3">🗳️ Primary Elections</h4>
                      <p className="text-gray-700 text-sm">Party members vote directly to select candidates. Conducted at grassroots level with transparent, verifiable results. Common for most major parties.</p>
                    </div>

                    <div className="bg-white border-2 border-orange-300 p-6 rounded-xl shadow-sm">
                      <h4 className="font-bold text-gray-900 text-lg mb-3">👤 Party Leader Selection</h4>
                      <p className="text-gray-700 text-sm">Party leader or national executive committee selects candidates. Used by parties emphasizing strong leadership. Must be transparent per party constitution.</p>
                    </div>

                    <div className="bg-white border-2 border-red-300 p-6 rounded-xl shadow-sm">
                      <h4 className="font-bold text-gray-900 text-lg mb-3">🤝 Consensus Method</h4>
                      <p className="text-gray-700 text-sm">Party reaches agreement on candidates through consultation and negotiation. Used in some regional or community-based parties.</p>
                    </div>

                    <div className="bg-white border-2 border-rose-300 p-6 rounded-xl shadow-sm">
                      <h4 className="font-bold text-gray-900 text-lg mb-3">📋 Party-Defined Process</h4>
                      <p className="text-gray-700 text-sm">Any method outlined in party constitution that is democratic and transparent. ORPP requires all methods be fair and non-discriminatory.</p>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">Nomination Timelines (Election Operations Act 2017)</h3>

                  <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-pink-600 to-red-600 text-white">
                        <tr>
                          <th className="px-6 py-4 text-left font-semibold">Position</th>
                          <th className="px-6 py-4 text-left font-semibold">Party Nomination Deadline</th>
                          <th className="px-6 py-4 text-left font-semibold">IEBC Submission Deadline</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Presidential</td>
                          <td className="px-6 py-4 text-gray-700">Set by IEBC (typically 60 days before election)</td>
                          <td className="px-6 py-4 text-gray-700">40 days before election day</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Parliamentary (MPs/Senators)</td>
                          <td className="px-6 py-4 text-gray-700">Set by IEBC (typically 60 days before election)</td>
                          <td className="px-6 py-4 text-gray-700">40 days before election day</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">County Elections</td>
                          <td className="px-6 py-4 text-gray-700">Set by IEBC (typically 60 days before election)</td>
                          <td className="px-6 py-4 text-gray-700">40 days before election day</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-pink-50 border-l-4 border-pink-600 p-6 rounded-lg">
                    <p className="text-gray-900 font-semibold mb-2">⚠️ Important Nomination Requirements</p>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Nominated candidates must meet constitutional eligibility requirements</li>
                      <li>• Gender rule: At least 1/3 of nominated candidates must be of each gender</li>
                      <li>• Youth and PwD inclusion required (specific percentages per party constitution)</li>
                      <li>• All nominated candidates must complete IEBC registration within prescribed timeframe</li>
                      <li>• Nomination disputes resolved through party internal mechanisms or courts</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 10: Funding & Compliance */}
              <section id="funding" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <BarChart3 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Political Party Funding & Compliance</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Political parties in Kenya are regulated in how they raise and spend money. Transparency and compliance are critical for maintaining registration and receiving state funding.</p>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">Legitimate Party Funding Sources</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white border-l-4 border-green-600 p-5 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2">💚 Membership Dues</h4>
                      <p className="text-gray-700 text-sm">Fees paid by party members. Amount determined by party constitution. Regular and reliable funding source</p>
                    </div>

                    <div className="bg-white border-l-4 border-green-600 p-5 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2">💙 Party Fundraising</h4>
                      <p className="text-gray-700 text-sm">Events, rallies, or other fundraising activities organized by parties to raise money</p>
                    </div>

                    <div className="bg-white border-l-4 border-green-600 p-5 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2">💛 Private Donations</h4>
                      <p className="text-gray-700 text-sm">Contributions from Kenyan individuals or organizations. Subject to donation limits (max KES 2 million per donor per year)</p>
                    </div>

                    <div className="bg-white border-l-4 border-green-600 p-5 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2">🏛️ Political Parties Fund</h4>
                      <p className="text-gray-700 text-sm">State funding allocated by Parliament to registered parties based on electoral performance and compliance</p>
                    </div>

                    <div className="bg-white border-l-4 border-green-600 p-5 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2">🤝 NGO Grants</h4>
                      <p className="text-gray-700 text-sm">Funding from Kenyan organizations supporting democratic parties (democracy, civic education)</p>
                    </div>

                    <div className="bg-white border-l-4 border-green-600 p-5 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2">📺 Campaign Funds</h4>
                      <p className="text-gray-700 text-sm">Special campaign financing during election period regulated by IEBC and political finance laws</p>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">Prohibited Funding Sources</h3>

                  <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg shadow-sm mb-6">
                    <div className="space-y-2 text-gray-700 text-sm">
                      <p className="flex gap-2"><AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" /><span><strong>Foreign Governments:</strong> No funding from any foreign government or state actor</span></p>
                      <p className="flex gap-2"><AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" /><span><strong>Foreign Organizations:</strong> No funding from international organizations, NGOs, or foreign entities</span></p>
                      <p className="flex gap-2"><AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" /><span><strong>Foreign Individuals:</strong> No donations from non-Kenyans or foreign nationals</span></p>
                      <p className="flex gap-2"><AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" /><span><strong>Proceeds of Crime:</strong> No funding from criminal activities, drug trafficking, or corrupt sources</span></p>
                      <p className="flex gap-2"><AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" /><span><strong>Anonymous Donations:</strong> No donations from undisclosed or anonymous sources above certain thresholds</span></p>
                      <p className="flex gap-2"><AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" /><span><strong>Excessive Donations:</strong> No single donor may contribute more than KES 2 million per calendar year</span></p>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">Annual Compliance Requirements</h3>

                  <div className="space-y-4 mb-8">
                    <div className="bg-white border border-gray-200 p-5 rounded-lg">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">Financial Disclosure Report</p>
                          <p className="text-gray-700 text-sm">Submit detailed annual financial report to ORPP by March 31st showing income sources, donors, and expenditures</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 p-5 rounded-lg">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">Membership Update</p>
                          <p className="text-gray-700 text-sm">Confirm maintenance of minimum 1,000 members spread across 24+ counties. Submit updated member register to ORPP</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 p-5 rounded-lg">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">Party Documents Update</p>
                          <p className="text-gray-700 text-sm">Submit updated party constitution if amended, leadership changes, or symbol modifications</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 p-5 rounded-lg">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">4</div>
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">Annual Registration Fee</p>
                          <p className="text-gray-700 text-sm">Pay annual registration fee to ORPP (amount set by ORPP, typically KES 50,000-100,000)</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg">
                    <p className="text-gray-900 font-semibold mb-2">⚠️ Consequences of Non-Compliance</p>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Warning letter from ORPP with 30-day cure period</li>
                      <li>• Suspension of Political Parties Fund allocation</li>
                      <li>• Prohibition on nominating candidates in next election</li>
                      <li>• Deregistration of party if violations continue</li>
                      <li>• Potential criminal penalties for financial misconduct</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 11: Legal Disputes */}
              <section id="disputes" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Common Legal Issues & Disputes</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Political parties frequently encounter legal issues and disputes. Understanding common problems helps prevent costly violations.</p>

                  <div className="space-y-4 mb-8">
                    <div className="bg-white border-l-4 border-orange-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">🗳️ Nomination Disputes</h4>
                      <p className="text-gray-700 text-sm mb-2">Candidates or members challenging nomination process fairness. Common issues: ballot stuffing, voter intimidation, exclusion of candidates</p>
                      <p className="text-gray-700 text-sm font-semibold">Resolution: Internal party dispute mechanism, then courts if unresolved</p>
                    </div>

                    <div className="bg-white border-l-4 border-orange-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">💰 Funding Violations</h4>
                      <p className="text-gray-700 text-sm mb-2">Receiving foreign funding, exceeding donation limits, or failing financial disclosures. Serious compliance issue</p>
                      <p className="text-gray-700 text-sm font-semibold">Resolution: ORPP investigation, fines, suspension, or deregistration</p>
                    </div>

                    <div className="bg-white border-l-4 border-orange-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">👥 Membership Disputes</h4>
                      <p className="text-gray-700 text-sm mb-2">Disagreements over party member removals, suspension, or expulsions. Can affect party registration if membership drops below 1,000</p>
                      <p className="text-gray-700 text-sm font-semibold">Resolution: Party constitution procedures, ORPP review</p>
                    </div>

                    <div className="bg-white border-l-4 border-orange-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">🎨 Symbol/Name Disputes</h4>
                      <p className="text-gray-700 text-sm mb-2">Competing parties claiming same or similar symbols or names. ORPP must approve all symbols before use</p>
                      <p className="text-gray-700 text-sm font-semibold">Resolution: ORPP makes determination based on distinctiveness</p>
                    </div>

                    <div className="bg-white border-l-4 border-orange-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">📋 Leadership Disputes</h4>
                      <p className="text-gray-700 text-sm mb-2">Rival factions within party claiming legitimate leadership. Can create party paralysis or splinter the party</p>
                      <p className="text-gray-700 text-sm font-semibold">Resolution: Party constitution rules, courts as last resort</p>
                    </div>

                    <div className="bg-white border-l-4 border-orange-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">⚖️ Gender & Inclusion Rule</h4>
                      <p className="text-gray-700 text-sm mb-2">Failing to meet 1/3 gender rule or youth/PwD inclusion requirements in nominations. Candidates may be disqualified</p>
                      <p className="text-gray-700 text-sm font-semibold">Resolution: IEBC review, resubmission of candidates</p>
                    </div>

                    <div className="bg-white border-l-4 border-orange-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">🚫 Code of Conduct Violations</h4>
                      <p className="text-gray-700 text-sm mb-2">Party or members engaging in violent language, hate speech, or unethical conduct. Can result in party sanctions</p>
                      <p className="text-gray-700 text-sm font-semibold">Resolution: ORPP investigation, sanctions, potential deregistration</p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded-lg">
                    <p className="text-gray-900 font-semibold mb-2">💡 How to Prevent Legal Issues</p>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Maintain clear, detailed party constitution that everyone understands</li>
                      <li>• Keep accurate financial records and disclose donations transparently</li>
                      <li>• Conduct fair, transparent nomination processes with proper documentation</li>
                      <li>• Maintain membership above minimum requirements</li>
                      <li>• Comply with all ORPP requirements and regulations</li>
                      <li>• Conduct member training on Code of Conduct and ethical practices</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 12: FAQs */}
              <section id="faqs" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <BarChart3 className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
                </div>

                <div className="space-y-3">
                  {faqs.map((faq, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full flex justify-between items-center p-5 text-left hover:bg-gray-50 transition"
                      >
                        <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                        {openFaqIndex === index ? (
                          <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        )}
                      </button>
                      {openFaqIndex === index && (
                        <div className="px-5 pb-5">
                          <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* CTA Section */}
              <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-8 rounded-xl shadow-xl">
                <h3 className="text-2xl font-bold mb-4">Ready to Register Your Political Party?</h3>
                <p className="mb-6 text-blue-100">Contact ORPP today to start the registration process or learn more about political party regulations in Kenya.</p>
                <div className="flex flex-wrap gap-4">
                  <a href="https://www.orpp.or.ke" target="_blank" rel="noopener noreferrer" className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
                    Visit ORPP Website
                  </a>
                  <Link to="/elections-in-kenya" className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-400 transition">
                    Learn About Elections
                  </Link>
                  <Link to="/understanding-iebc-kenya" className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition">
                    Understand IEBC
                  </Link>
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default PoliticalPartiesRegistrationKenya;
