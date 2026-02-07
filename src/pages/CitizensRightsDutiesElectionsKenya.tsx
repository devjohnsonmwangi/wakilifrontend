import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  ChevronUp,
  Shield,
  CheckCircle2,
  AlertCircle,
  Scale,
  Users,
  BarChart3,
  Megaphone,
  Handshake,
  Eye
} from 'lucide-react';

const faqs = [
  {
    question: 'What are the basic voter rights in Kenya?',
    answer: 'Voters have the right to vote, a secret ballot, security at polling stations, freedom from intimidation, equal access, and accurate counting of their vote.'
  },
  {
    question: 'Is voting compulsory in Kenya?',
    answer: 'Voting is a constitutional right, not a legal obligation. However, citizens are encouraged to participate to strengthen democracy.'
  },
  {
    question: 'What is the right to a secret ballot?',
    answer: 'It means your vote must be private and confidential. No one can force you to reveal your choice or track how you voted.'
  },
  {
    question: 'What is illegal on voting day?',
    answer: 'Illegal acts include bribery, voter intimidation, violence, hate speech, double voting, tampering with ballots, and obstructing polling officers.'
  },
  {
    question: 'Can I be assisted to vote if I have a disability?',
    answer: 'Yes. The law allows assisted voting for persons with disabilities, the elderly, and others who need support. The process must respect the voter’s choice and secrecy.'
  },
  {
    question: 'Who enforces election laws?',
    answer: 'IEBC administers elections, while the National Police Service and courts enforce offences and prosecute violations.'
  },
  {
    question: 'How do I report election misconduct?',
    answer: 'You can report to IEBC officials at polling stations, contact the police, or file a legal complaint in court depending on the nature of the misconduct.'
  },
  {
    question: 'What is voter intimidation?',
    answer: 'Any act that threatens, coerces, or pressures a voter to vote in a certain way or discourages them from voting.'
  },
  {
    question: 'Can I take photos in the polling station?',
    answer: 'No. Photography or recording inside the polling station is generally prohibited to protect ballot secrecy and order.'
  },
  {
    question: 'Are political campaigns allowed on election day?',
    answer: 'No. Campaigning on election day is prohibited. Political materials and activities are restricted around polling stations.'
  },
  {
    question: 'What is an election offence?',
    answer: 'An election offence is a crime under election laws such as bribery, violence, tampering, impersonation, or hate speech.'
  },
  {
    question: 'What should I do if I am denied the right to vote?',
    answer: 'Immediately alert the presiding officer, record details if possible, and consider reporting to IEBC or filing a complaint in court.'
  },
  {
    question: 'Are observers allowed at polling stations?',
    answer: 'Yes. Accredited observers and party agents are allowed to observe the process and promote transparency.'
  },
  {
    question: 'Can I vote more than once?',
    answer: 'No. Double voting is a serious offence and can lead to prosecution and penalties.'
  },
  {
    question: 'How are vulnerable voters protected?',
    answer: 'The law provides for accessibility measures, assisted voting, priority queues, and protection against intimidation or discrimination.'
  }
];

const CitizensRightsDutiesElectionsKenya: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<string>('overview');

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  useEffect(() => {
    const metaTitle = 'Citizens’ Rights & Duties During Elections – Kenya';
    const metaDescription = 'Official legal guide to voter rights and duties in Kenya. Learn what is allowed, offences, reporting channels, and protections.';
    const canonicalUrl = 'https://wakili.co.ke/citizens-rights-duties-elections-kenya';

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
    setMetaTag('property', 'og:type', 'article');
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
              "name": "Citizens’ Rights & Duties During Elections",
              "item": "https://wakili.co.ke/citizens-rights-duties-elections-kenya"
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
          "@type": "GovernmentService",
          "name": "Voter Rights and Election Conduct Guidance",
          "areaServed": "Kenya",
          "serviceType": "Civic education and election conduct guidance",
          "url": "https://wakili.co.ke/citizens-rights-duties-elections-kenya"
        },
        {
          "@type": "LegalService",
          "name": "Election Rights & Duties Legal Guidance",
          "areaServed": "Kenya",
          "serviceType": "Legal guidance on voter rights and election offences",
          "url": "https://wakili.co.ke/citizens-rights-duties-elections-kenya"
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
        'rights',
        'duties',
        'allowed',
        'illegal',
        'offences',
        'reporting',
        'observers',
        'vulnerable',
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
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex text-sm text-gray-600">
              <Link to="/" className="hover:text-blue-600">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">Citizens’ Rights & Duties</span>
            </nav>
          </div>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Citizens’ Rights & Duties During Elections in Kenya</h1>
            <p className="text-lg sm:text-xl text-emerald-100 max-w-3xl">Official civic guide on voter rights, responsibilities, election offences, and legal protections under Kenyan law.</p>
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
                    <BarChart3 className="w-5 h-5 text-emerald-600" />
                    Quick Navigation
                  </h3>
                  <nav className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 lg:block lg:space-y-2 lg:gap-0 lg:overflow-visible lg:pb-0 lg:mx-0 lg:px-0">
                    {[
                      { id: 'overview', label: 'Overview', icon: BarChart3 },
                      { id: 'rights', label: 'Voter Rights', icon: Shield },
                      { id: 'duties', label: 'Citizen Duties', icon: Users },
                      { id: 'allowed', label: 'Allowed on Voting Day', icon: CheckCircle2 },
                      { id: 'illegal', label: 'Illegal Acts', icon: AlertCircle },
                      { id: 'offences', label: 'Offences & Penalties', icon: Scale },
                      { id: 'reporting', label: 'Report Misconduct', icon: Megaphone },
                      { id: 'observers', label: 'Observers & Agents', icon: Eye },
                      { id: 'vulnerable', label: 'Vulnerable Voters', icon: Handshake },
                      { id: 'faqs', label: 'FAQs', icon: BarChart3 }
                    ].map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => scrollToSection(id)}
                        className={`flex-shrink-0 lg:w-full text-left px-3 py-2 rounded transition flex items-center gap-2 whitespace-nowrap ${
                          activeSection === id
                            ? 'bg-emerald-100 text-emerald-700 font-medium'
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
                  <BarChart3 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Overview of Citizen Participation in Elections</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-4 text-lg leading-relaxed">Citizens are central to Kenya’s electoral democracy. The Constitution guarantees the right to vote and protects voters from intimidation, discrimination, and unlawful interference. This guide connects with <a href="/understanding-iebc-kenya" className="text-emerald-600 hover:text-emerald-700 font-medium">Understanding IEBC</a> and voter resources including <a href="/how-to-register-as-a-voter-kenya" className="text-emerald-600 hover:text-emerald-700 font-medium">How to Register as a Voter</a> and <a href="/how-to-check-voter-status-kenya" className="text-emerald-600 hover:text-emerald-700 font-medium">How to Check Voter Status</a>.</p>
                  <p className="text-gray-700 mb-6">Elections also require citizens to follow lawful procedures, respect polling rules, and avoid offences. Understanding these rights and duties protects democracy and reduces disputes. For legal disputes, see <a href="/election-petitions-disputes-kenya" className="text-emerald-600 hover:text-emerald-700 font-medium">Election Petitions & Disputes</a>.</p>

                  <div className="bg-white border-2 border-emerald-200 p-6 rounded-xl shadow-sm mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Core legal foundation</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                      <div className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" /><span><strong>Constitution of Kenya 2010:</strong> Articles 38, 81, 83, 86, 28, 29, 33, 37</span></div>
                      <div className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" /><span><strong>Elections Act 2011:</strong> Voting procedures, tallying, and transparency</span></div>
                      <div className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" /><span><strong>Election Offences Act 2016:</strong> Bribery, intimidation, violence, double voting offences</span></div>
                      <div className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" /><span><strong>IEBC Act 2011:</strong> IEBC’s mandate to regulate and manage elections</span></div>
                      <div className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" /><span><strong>Political Parties Act 2011:</strong> Party conduct and nomination rules</span></div>
                      <div className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" /><span><strong>National Cohesion and Integration Act:</strong> Hate speech and incitement controls</span></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                      <div className="text-3xl font-bold text-emerald-700 mb-2">Rights</div>
                      <div className="text-gray-900 font-semibold mb-1">Protected by Law</div>
                      <div className="text-sm text-gray-600">Constitutional guarantees for every voter</div>
                    </div>
                    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                      <div className="text-3xl font-bold text-teal-700 mb-2">Duties</div>
                      <div className="text-gray-900 font-semibold mb-1">Civic Responsibility</div>
                      <div className="text-sm text-gray-600">Lawful conduct and respect for procedures</div>
                    </div>
                    <div className="bg-gradient-to-br from-cyan-50 to-emerald-50 border-2 border-cyan-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                      <div className="text-3xl font-bold text-cyan-700 mb-2">Protection</div>
                      <div className="text-gray-900 font-semibold mb-1">Enforced by Law</div>
                      <div className="text-sm text-gray-600">Offences and penalties deter misconduct</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl p-8 border-2 border-emerald-300 shadow-lg my-8">
                    <h3 className="font-bold text-gray-900 text-lg mb-6 text-center">🗳️ Voting Day Conduct at a Glance</h3>
                    <svg className="w-full h-80 mx-auto" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                      <rect x="30" y="40" width="100" height="80" rx="6" fill="#d1fae5" stroke="#059669" strokeWidth="2" />
                      <text x="80" y="70" fontSize="12" textAnchor="middle" fill="#065f46" fontWeight="bold">Register</text>
                      <text x="80" y="86" fontSize="10" textAnchor="middle" fill="#065f46">Verify ID</text>

                      <rect x="150" y="40" width="100" height="80" rx="6" fill="#a7f3d0" stroke="#0f766e" strokeWidth="2" />
                      <text x="200" y="70" fontSize="12" textAnchor="middle" fill="#0f766e" fontWeight="bold">Vote</text>
                      <text x="200" y="86" fontSize="10" textAnchor="middle" fill="#0f766e">Secret Ballot</text>

                      <rect x="270" y="40" width="100" height="80" rx="6" fill="#cffafe" stroke="#0891b2" strokeWidth="2" />
                      <text x="320" y="70" fontSize="12" textAnchor="middle" fill="#0e7490" fontWeight="bold">Leave</text>
                      <text x="320" y="86" fontSize="10" textAnchor="middle" fill="#0e7490">No Campaigning</text>

                      <path d="M 130 80 L 150 80" stroke="#059669" strokeWidth="2" />
                      <path d="M 250 80 L 270 80" stroke="#0f766e" strokeWidth="2" />

                      <rect x="70" y="170" width="260" height="90" rx="8" fill="#ecfeff" stroke="#06b6d4" strokeWidth="2" />
                      <text x="200" y="195" fontSize="12" textAnchor="middle" fill="#0e7490" fontWeight="bold">Legal Conduct</text>
                      <text x="120" y="220" fontSize="10" textAnchor="middle" fill="#0e7490">Peaceful</text>
                      <text x="200" y="220" fontSize="10" textAnchor="middle" fill="#0e7490">Respect Rules</text>
                      <text x="280" y="220" fontSize="10" textAnchor="middle" fill="#0e7490">No Bribery</text>
                    </svg>
                    <p className="text-center text-sm text-gray-600 mt-4">Follow IEBC instructions, protect secrecy of the vote, and avoid prohibited conduct.</p>
                  </div>
                </div>
              </section>

              {/* Section 2: Rights */}
              <section id="rights" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Shield className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Constitutional Rights of Voters</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-4">Kenya’s Constitution guarantees the right to vote and sets standards for free and fair elections. Voters are protected by law before, during, and after election day.</p>
                  <p className="text-gray-700 mb-6">These rights are reinforced by the Elections Act and IEBC regulations, which outline how identification, polling, counting, and results declaration must be conducted.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white border-l-4 border-emerald-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">✅ Right to Vote</h4>
                      <p className="text-gray-700 text-sm">Every registered voter has the right to vote without discrimination or undue restrictions.</p>
                    </div>
                    <div className="bg-white border-l-4 border-teal-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">🔒 Right to Secret Ballot</h4>
                      <p className="text-gray-700 text-sm">No one can demand to see or control your vote. Secrecy protects freedom of choice.</p>
                    </div>
                    <div className="bg-white border-l-4 border-cyan-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">🛡️ Right to Security</h4>
                      <p className="text-gray-700 text-sm">Voters must be protected from violence or threats at polling stations.</p>
                    </div>
                    <div className="bg-white border-l-4 border-emerald-700 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">🚫 Freedom from Intimidation</h4>
                      <p className="text-gray-700 text-sm">Any act of coercion or voter harassment is illegal and punishable.</p>
                    </div>
                    <div className="bg-white border-l-4 border-teal-700 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">⚖️ Equal Access</h4>
                      <p className="text-gray-700 text-sm">All voters must access polling services equally regardless of gender, disability, or background.</p>
                    </div>
                    <div className="bg-white border-l-4 border-cyan-700 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">📄 Right to Transparent Counting</h4>
                      <p className="text-gray-700 text-sm">Results must be counted, verified, and announced openly following legal procedures.</p>
                    </div>
                  </div>

                  <div className="bg-emerald-50 border-l-4 border-emerald-600 p-6 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">Legal foundations</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" /><span><strong>Article 38:</strong> Political rights including the right to vote and to be registered</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" /><span><strong>Article 81:</strong> Principles of the electoral system (free, fair, transparent)</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" /><span><strong>Article 83:</strong> Voter registration and qualification requirements</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" /><span><strong>Article 86:</strong> Voting and results processes, verification, and transparency</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" /><span><strong>Articles 28–29:</strong> Dignity and security of the person</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" /><span><strong>Articles 33 & 37:</strong> Freedom of expression and peaceful assembly (lawful limits apply)</span></li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 3: Duties */}
              <section id="duties" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Users className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Responsibilities & Duties of Citizens</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-4">Rights come with responsibilities. Citizens must uphold peaceful conduct, follow IEBC procedures, and respect the rights of other voters.</p>
                  <p className="text-gray-700 mb-6">Duties are anchored in the Constitution and operationalized by the Elections Act, IEBC regulations, and the Election Offences Act, which define unacceptable conduct.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white border-l-4 border-teal-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">✅ Lawful Conduct</h4>
                      <p className="text-gray-700 text-sm">Obey election laws and avoid any conduct that undermines integrity.</p>
                    </div>
                    <div className="bg-white border-l-4 border-emerald-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">📋 Follow Polling Rules</h4>
                      <p className="text-gray-700 text-sm">Respect queues, instructions from officials, and polling station order.</p>
                    </div>
                    <div className="bg-white border-l-4 border-cyan-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">🧘 Avoid Violence</h4>
                      <p className="text-gray-700 text-sm">No intimidation, threats, or incitement at any stage of the election.</p>
                    </div>
                    <div className="bg-white border-l-4 border-teal-700 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">🤝 Respect Others</h4>
                      <p className="text-gray-700 text-sm">Allow all voters equal access and avoid discriminatory behavior.</p>
                    </div>
                  </div>

                  <div className="bg-teal-50 border-l-4 border-teal-600 p-6 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">Citizen duty checklist</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" /><span>Carry valid identification to the polling station</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" /><span>Maintain peace and follow lawful instructions</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" /><span>Do not accept or offer bribes or inducements</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" /><span>Protect ballot secrecy and avoid taking photos</span></li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 4: Allowed */}
              <section id="allowed" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What Is Allowed on Voting Day</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Allowed activities are those that support a peaceful and transparent process: lawful voting, respectful participation, and following IEBC instructions.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white border-l-4 border-emerald-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">✅ Queueing and Voting</h4>
                      <p className="text-gray-700 text-sm">Arrive early, follow the queue, present ID, and vote in privacy.</p>
                    </div>
                    <div className="bg-white border-l-4 border-teal-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">✅ Assisted Voting</h4>
                      <p className="text-gray-700 text-sm">Eligible voters may receive assistance as provided by IEBC rules.</p>
                    </div>
                    <div className="bg-white border-l-4 border-cyan-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">✅ Observers & Agents</h4>
                      <p className="text-gray-700 text-sm">Accredited observers and agents can monitor procedures and raise concerns.</p>
                    </div>
                    <div className="bg-white border-l-4 border-emerald-700 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">✅ Reporting Issues</h4>
                      <p className="text-gray-700 text-sm">Report irregularities to IEBC officials or police calmly and promptly.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 5: Illegal */}
              <section id="illegal" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What Is Illegal During Elections</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Illegal conduct is criminalized under the Election Offences Act, Elections Act, Penal Code, and the National Cohesion and Integration Act. These laws protect voters and the integrity of the vote.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white border-l-4 border-red-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">🚫 Bribery</h4>
                      <p className="text-gray-700 text-sm">Offering money, gifts, or favors to influence voting is illegal.</p>
                    </div>
                    <div className="bg-white border-l-4 border-rose-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">🚫 Violence</h4>
                      <p className="text-gray-700 text-sm">Threats, assault, or destruction of property related to voting.</p>
                    </div>
                    <div className="bg-white border-l-4 border-orange-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">🚫 Intimidation</h4>
                      <p className="text-gray-700 text-sm">Coercion or pressure to vote in a certain way or not to vote.</p>
                    </div>
                    <div className="bg-white border-l-4 border-amber-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">🚫 Hate Speech</h4>
                      <p className="text-gray-700 text-sm">Incitement of hatred or violence during election period.</p>
                    </div>
                    <div className="bg-white border-l-4 border-red-700 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">🚫 Double Voting</h4>
                      <p className="text-gray-700 text-sm">Casting more than one ballot or voting in multiple stations.</p>
                    </div>
                    <div className="bg-white border-l-4 border-rose-700 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">🚫 Ballot Tampering</h4>
                      <p className="text-gray-700 text-sm">Interfering with ballots, boxes, or results forms.</p>
                    </div>
                  </div>

                  <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">Real-life examples</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2"><AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" /><span>Offering transport or cash in exchange for votes is bribery</span></li>
                      <li className="flex gap-2"><AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" /><span>Blocking access to a polling station is intimidation</span></li>
                      <li className="flex gap-2"><AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" /><span>Recording voters inside a booth violates ballot secrecy</span></li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 6: Offences */}
              <section id="offences" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Scale className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Election Offences & Legal Penalties</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">The Election Offences Act and Elections Act list offences and prescribe penalties such as fines, imprisonment, or disqualification. Serious offences can also trigger election petitions or criminal prosecution.</p>
                  <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                        <tr>
                          <th className="px-6 py-4 text-left font-semibold">Offence</th>
                          <th className="px-6 py-4 text-left font-semibold">Examples</th>
                          <th className="px-6 py-4 text-left font-semibold">Penalties</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Bribery</td>
                          <td className="px-6 py-4 text-gray-700">Gifts, money, or favors to influence voting</td>
                          <td className="px-6 py-4 text-gray-700">Fines, imprisonment, disqualification</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Violence or Threats</td>
                          <td className="px-6 py-4 text-gray-700">Assault, threats, destruction of property</td>
                          <td className="px-6 py-4 text-gray-700">Criminal charges and jail terms</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Double Voting</td>
                          <td className="px-6 py-4 text-gray-700">Voting more than once</td>
                          <td className="px-6 py-4 text-gray-700">Prosecution and penalties</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Hate Speech</td>
                          <td className="px-6 py-4 text-gray-700">Incitement or ethnic hostility</td>
                          <td className="px-6 py-4 text-gray-700">Fines and imprisonment</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <p className="text-gray-700">Election offences are prosecuted under the Elections Act, Election Offences Act, Penal Code, and related statutes. Penalties may include disqualification from office or future candidacy.</p>
                </div>
              </section>

              {/* Section 7: Reporting */}
              <section id="reporting" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Megaphone className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How to Report Election Misconduct</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Timely reporting helps prevent escalation and preserves evidence for investigations. Use official channels and keep accurate records.</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white border-l-4 border-teal-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">🏛️ IEBC</h4>
                      <p className="text-gray-700 text-sm">Report to presiding officers or IEBC officials at polling stations.</p>
                    </div>
                    <div className="bg-white border-l-4 border-emerald-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">👮 Police</h4>
                      <p className="text-gray-700 text-sm">Report criminal acts such as violence, bribery, or intimidation.</p>
                    </div>
                    <div className="bg-white border-l-4 border-cyan-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">⚖️ Courts</h4>
                      <p className="text-gray-700 text-sm">File legal complaints or petitions when required by law.</p>
                    </div>
                  </div>

                  <div className="bg-teal-50 border-l-4 border-teal-600 p-6 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">Reporting checklist</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" /><span>Record the date, time, and location of the incident</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" /><span>Identify witnesses and keep contact details</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" /><span>Preserve evidence such as forms, messages, or photos</span></li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 8: Observers */}
              <section id="observers" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Eye className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Role of Observers & Agents</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Observers and party agents promote transparency and accountability. They do not control the voting process but can monitor, report, and record irregularities.</p>
                  <p className="text-gray-700 mb-6">Their roles are recognized under IEBC regulations and the Elections Act, which outline accreditation, conduct, and limits on interference.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white border-l-4 border-cyan-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">👀 Observers</h4>
                      <p className="text-gray-700 text-sm">Accredited observers from civil society or international organizations monitor procedures and issue reports.</p>
                    </div>
                    <div className="bg-white border-l-4 border-emerald-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">🧾 Party Agents</h4>
                      <p className="text-gray-700 text-sm">Agents represent candidates and parties, verifying forms and raising concerns.</p>
                    </div>
                  </div>

                  <div className="bg-cyan-50 border-l-4 border-cyan-600 p-6 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">What observers and agents can do</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-0.5" /><span>Monitor opening and closing of polling stations</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-0.5" /><span>Observe counting and signing of results forms</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-0.5" /><span>Record and report irregularities to IEBC or police</span></li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 9: Vulnerable Voters */}
              <section id="vulnerable" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Handshake className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How the Law Protects Vulnerable Voters</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">The Constitution and IEBC regulations require inclusive access and non-discrimination for all voters. Special procedures protect those who need assistance while preserving ballot secrecy.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white border-l-4 border-emerald-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">♿ Persons with Disabilities</h4>
                      <p className="text-gray-700 text-sm">Accessible polling stations, priority queues, and assisted voting procedures.</p>
                    </div>
                    <div className="bg-white border-l-4 border-teal-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">👵 Elderly Voters</h4>
                      <p className="text-gray-700 text-sm">Priority service, seating, and assistance where necessary.</p>
                    </div>
                    <div className="bg-white border-l-4 border-cyan-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">🧑‍🤝‍🧑 Marginalized Groups</h4>
                      <p className="text-gray-700 text-sm">Protection from discrimination and equal access to polling services.</p>
                    </div>
                    <div className="bg-white border-l-4 border-emerald-700 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">👩‍👧 Women & Youth</h4>
                      <p className="text-gray-700 text-sm">Protection from intimidation and targeted violence.</p>
                    </div>
                  </div>

                  <p className="text-gray-700">If vulnerable voters are denied access or protection, they may report to IEBC officials or seek legal recourse.</p>
                </div>
              </section>

              {/* Section 10: FAQs */}
              <section id="faqs" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <BarChart3 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
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
                          <ChevronUp className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        )}
                      </button>
                      {openFaqIndex === index && (
                        <div id={`faq-${index}`} className="px-5 pb-5">
                          <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* CTA Section */}
              <section className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white p-8 rounded-xl shadow-xl">
                <h3 className="text-2xl font-bold mb-4">Protect Your Rights During Elections</h3>
                <p className="mb-6 text-emerald-100">Know your rights, avoid offences, and report misconduct to protect Kenya’s democracy.</p>
                <div className="flex flex-wrap gap-4">
                  <a href="/how-to-check-voter-status-kenya" className="bg-white text-emerald-700 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition">
                    Know Your Rights
                  </a>
                  <a href="/election-petitions-disputes-kenya" className="bg-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-400 transition">
                    Report an Election Offence
                  </a>
                  <a href="/understanding-iebc-kenya" className="bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition">
                    Contact IEBC
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

export default CitizensRightsDutiesElectionsKenya;
