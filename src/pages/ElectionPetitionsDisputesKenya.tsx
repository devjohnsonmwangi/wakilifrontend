import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Scale,
  FileText,
  CheckCircle2,
  Building2,
  Gavel,
  Clock,
  Shield,
  BarChart3,
  Users,
  Search
} from 'lucide-react';

const faqs = [
  {
    question: 'What is an election petition in Kenya?',
    answer: 'An election petition is a formal legal challenge filed in a court of law to dispute election results or the validity of an election process. It is governed by the Constitution, the Elections Act, and the Election Petition Rules.'
  },
  {
    question: 'Who can file an election petition?',
    answer: 'A registered voter, a candidate, or a political party with a direct interest in the election outcome can file an election petition. The petitioner must show legal standing and follow court procedures.'
  },
  {
    question: 'What is the time limit to file a petition?',
    answer: 'Time limits vary by election type. Presidential petitions must be filed within 7 days of declaration. Parliamentary and county petitions are typically filed within 28 days of declaration.'
  },
  {
    question: 'Which court handles presidential election petitions?',
    answer: 'Presidential election petitions are heard exclusively by the Supreme Court of Kenya, as provided under Article 163 of the Constitution.'
  },
  {
    question: 'Which court handles parliamentary and county petitions?',
    answer: 'Parliamentary and county election petitions are generally filed in the High Court. Some disputes may be handled by Magistrates’ Courts depending on the position and statutory thresholds.'
  },
  {
    question: 'What evidence is required in an election petition?',
    answer: 'Evidence can include certified result forms, polling station diaries, witness affidavits, expert reports, and digital transmission logs. The petitioner must show substantial non-compliance or irregularities affecting results.'
  },
  {
    question: 'Can the court order a recount?',
    answer: 'Yes. Courts may order a recount, scrutiny, or audit of votes or electoral materials where it assists in resolving disputed results.'
  },
  {
    question: 'What outcomes can result from a petition?',
    answer: 'Outcomes include upholding results, ordering a recount, nullifying the election, or ordering a fresh election. The court may also issue compliance orders to IEBC.'
  },
  {
    question: 'What are election nomination disputes?',
    answer: 'Nomination disputes involve disagreements about party primaries or candidate selection. They must first be resolved internally within political parties and then through the Political Parties Disputes Tribunal (PPDT) or courts.'
  },
  {
    question: 'Is there a legal cost risk to filing a petition?',
    answer: 'Yes. Courts may award costs against an unsuccessful party. Petitioners should be prepared for filing fees, legal representation costs, and potential adverse costs.'
  },
  {
    question: 'Can I withdraw an election petition?',
    answer: 'Yes, but only with court permission. The court may require notice to other parties and may order payment of costs.'
  },
  {
    question: 'What is the standard of proof in election petitions?',
    answer: 'The standard is higher than a balance of probabilities but lower than beyond reasonable doubt. The petitioner must prove substantial non-compliance and impact on results.'
  },
  {
    question: 'Are election petitions public?',
    answer: 'Yes. Election petitions are public court proceedings, with published judgments and orders unless a court directs otherwise.'
  },
  {
    question: 'How long do election petitions take to resolve?',
    answer: 'Timelines are strict. Presidential petitions are determined within 14 days. Other petitions are generally determined within 6 months, subject to the Elections Act and court rules.'
  },
  {
    question: 'Can an election petition challenge IEBC processes?',
    answer: 'Yes. Petitions can challenge IEBC’s conduct, tallying, and compliance with electoral laws, provided the irregularities materially affected results.'
  }
];

const ElectionPetitionsDisputesKenya: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<string>('overview');

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  useEffect(() => {
    const metaTitle = 'Election Petitions & Disputes Kenya – Legal Guide';
    const metaDescription = 'Complete legal guide to election petitions in Kenya. Learn how to challenge results, courts, timelines, evidence, and outcomes.';
    const canonicalUrl = 'https://wakili.co.ke/election-petitions-disputes-kenya';

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
              "name": "Election Petitions & Disputes",
              "item": "https://wakili.co.ke/election-petitions-disputes-kenya"
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
          "name": "How to File an Election Petition in Kenya",
          "step": [
            {
              "@type": "HowToStep",
              "name": "Confirm Filing Deadline",
              "text": "Verify the statutory filing deadline based on the election type and date of declaration"
            },
            {
              "@type": "HowToStep",
              "name": "Prepare Petition and Evidence",
              "text": "Draft petition, collect affidavits, certified forms, logs, and supporting documentation"
            },
            {
              "@type": "HowToStep",
              "name": "File in the Correct Court",
              "text": "File the petition in the Supreme Court, High Court, or Magistrates Court as applicable"
            },
            {
              "@type": "HowToStep",
              "name": "Serve Respondents",
              "text": "Serve the petition on IEBC, declared winner, and other respondents within required timelines"
            },
            {
              "@type": "HowToStep",
              "name": "Attend Pre-Trial and Hearing",
              "text": "Participate in pre-trial directions, scrutiny applications, and oral hearings"
            },
            {
              "@type": "HowToStep",
              "name": "Receive Judgment",
              "text": "Court delivers judgment and orders on validity of election and any reliefs"
            }
          ]
        },
        {
          "@type": "LegalService",
          "name": "Election Petition Legal Guidance",
          "areaServed": "Kenya",
          "serviceType": "Election petition guidance and dispute resolution",
          "url": "https://wakili.co.ke/election-petitions-disputes-kenya"
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
        'definition',
        'legal-framework',
        'types',
        'courts',
        'who-can-file',
        'timelines',
        'how-to-file',
        'evidence',
        'outcomes',
        'costs',
        'cases',
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
              <span className="text-gray-900">Election Petitions & Disputes</span>
            </nav>
          </div>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Election Petitions & Disputes in Kenya – Legal Guide</h1>
            <p className="text-lg sm:text-xl text-orange-100 max-w-3xl">Official, evergreen guide to filing election petitions, challenging results, and resolving election disputes under Kenyan law.</p>
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
                    <BarChart3 className="w-5 h-5 text-orange-600" />
                    Quick Navigation
                  </h3>
                  <nav className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 lg:block lg:space-y-2 lg:gap-0 lg:overflow-visible lg:pb-0 lg:mx-0 lg:px-0">
                    {[
                      { id: 'overview', label: 'Overview', icon: BarChart3 },
                      { id: 'definition', label: 'What is a Petition', icon: Gavel },
                      { id: 'legal-framework', label: 'Legal Framework', icon: Scale },
                      { id: 'types', label: 'Types of Disputes', icon: AlertCircle },
                      { id: 'courts', label: 'Courts', icon: Building2 },
                      { id: 'who-can-file', label: 'Who Can File', icon: Users },
                      { id: 'timelines', label: 'Time Limits', icon: Clock },
                      { id: 'how-to-file', label: 'How to File', icon: FileText },
                      { id: 'evidence', label: 'Evidence', icon: Search },
                      { id: 'outcomes', label: 'Outcomes', icon: CheckCircle2 },
                      { id: 'costs', label: 'Costs & Risks', icon: Shield },
                      { id: 'cases', label: 'Case Examples', icon: FileText },
                      { id: 'faqs', label: 'FAQs', icon: BarChart3 }
                    ].map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => scrollToSection(id)}
                        className={`flex-shrink-0 lg:w-full text-left px-3 py-2 rounded transition flex items-center gap-2 whitespace-nowrap ${
                          activeSection === id
                            ? 'bg-orange-100 text-orange-700 font-medium'
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
                  <BarChart3 className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Overview: Election Petitions in Kenya</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-4 text-lg leading-relaxed">Election petitions are the legal mechanisms for challenging election results in Kenya. They provide a structured court process to resolve disputes while protecting democratic integrity. This guide links with election resources such as <a href="/election-results-declaration-kenya" className="text-orange-600 hover:text-orange-700 font-medium">Election Results Declaration</a>, the broader constitutional framework in <a href="/elections-in-kenya" className="text-orange-600 hover:text-orange-700 font-medium">Elections in Kenya</a>, and the full election structure in <a href="/presidential-parliamentary-county-elections-kenya" className="text-orange-600 hover:text-orange-700 font-medium">Presidential, Parliamentary & County Elections</a>.</p>
                  <p className="text-gray-700 mb-6">The goal of an election petition is not political advantage but legal accountability. Courts focus on whether the election complied with the Constitution, the Elections Act, and the Election Petition Rules, and whether any irregularities materially affected the final result.</p>

                  <div className="bg-white border-l-4 border-orange-600 p-5 rounded-lg shadow-sm mb-8">
                    <h4 className="font-bold text-gray-900 mb-2">What this guide covers</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" /><span>Who can file petitions, where to file, and strict time limits</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" /><span>Legal framework: Constitution, Elections Act, and Petition Rules</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" /><span>Evidence standards, scrutiny, recounts, and possible court orders</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" /><span>Costs, risks, and how to avoid procedural disqualification</span></li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                      <div className="text-3xl font-bold text-amber-700 mb-2">7 Days</div>
                      <div className="text-gray-900 font-semibold mb-1">Presidential Petition</div>
                      <div className="text-sm text-gray-600">Deadline to file after results declaration</div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                      <div className="text-3xl font-bold text-orange-700 mb-2">28 Days</div>
                      <div className="text-gray-900 font-semibold mb-1">Other Petitions</div>
                      <div className="text-sm text-gray-600">Parliamentary & county petitions</div>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                      <div className="text-3xl font-bold text-red-700 mb-2">6 Months</div>
                      <div className="text-gray-900 font-semibold mb-1">Resolution Window</div>
                      <div className="text-sm text-gray-600">Target timeline for court decisions</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl p-8 border-2 border-amber-300 shadow-lg my-8">
                    <h3 className="font-bold text-gray-900 text-lg mb-6 text-center">⚖️ Petition Flow: From Declaration to Judgment</h3>
                    <svg className="w-full h-80 mx-auto" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                          <polygon points="0 0, 10 3, 0 6" fill="#b45309" />
                        </marker>
                      </defs>
                      <rect x="20" y="40" width="100" height="70" rx="6" fill="#fde68a" stroke="#b45309" strokeWidth="2" />
                      <text x="70" y="65" fontSize="12" textAnchor="middle" fill="#92400e" fontWeight="bold">Results</text>
                      <text x="70" y="82" fontSize="10" textAnchor="middle" fill="#92400e">Declared</text>

                      <rect x="150" y="40" width="100" height="70" rx="6" fill="#fdba74" stroke="#c2410c" strokeWidth="2" />
                      <text x="200" y="65" fontSize="12" textAnchor="middle" fill="#9a3412" fontWeight="bold">Petition</text>
                      <text x="200" y="82" fontSize="10" textAnchor="middle" fill="#9a3412">Filed</text>

                      <rect x="280" y="40" width="100" height="70" rx="6" fill="#fecaca" stroke="#b91c1c" strokeWidth="2" />
                      <text x="330" y="65" fontSize="12" textAnchor="middle" fill="#991b1b" fontWeight="bold">Hearing</text>
                      <text x="330" y="82" fontSize="10" textAnchor="middle" fill="#991b1b">& Judgment</text>

                      <path d="M 120 75 L 150 75" stroke="#b45309" strokeWidth="2" markerEnd="url(#arrowhead)" />
                      <path d="M 250 75 L 280 75" stroke="#b45309" strokeWidth="2" markerEnd="url(#arrowhead)" />

                      <rect x="50" y="160" width="300" height="90" rx="8" fill="#fff7ed" stroke="#f59e0b" strokeWidth="2" />
                      <text x="200" y="190" fontSize="12" textAnchor="middle" fill="#92400e" fontWeight="bold">Court Orders</text>
                      <text x="120" y="215" fontSize="10" textAnchor="middle" fill="#92400e">Uphold</text>
                      <text x="200" y="215" fontSize="10" textAnchor="middle" fill="#92400e">Recount</text>
                      <text x="280" y="215" fontSize="10" textAnchor="middle" fill="#92400e">Fresh Election</text>
                    </svg>
                    <p className="text-center text-sm text-gray-600 mt-4">Petition process follows strict timelines and court procedures to deliver final decisions</p>
                  </div>
                </div>
              </section>

              {/* Section 2: What is a Petition */}
              <section id="definition" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Gavel className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What is an Election Petition?</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-4">An election petition is a formal court challenge brought after election results are declared. It seeks judicial review of the election process, tallying, and outcome. Petitions ensure elections comply with constitutional standards and protect voters’ rights.</p>
                  <p className="text-gray-700 mb-6">Courts do not re-run elections; they evaluate whether the legal thresholds were met and whether irregularities were substantial enough to affect the result. This means the petitioner must show both non-compliance and material impact.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white border-l-4 border-orange-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">🎯 Purpose</h4>
                      <p className="text-gray-700 text-sm">To verify legality, transparency, and accuracy of election results and ensure compliance with electoral laws.</p>
                    </div>
                    <div className="bg-white border-l-4 border-amber-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">📜 Legal Basis</h4>
                      <p className="text-gray-700 text-sm">Constitution of Kenya, Elections Act 2011, and Election Petition Rules govern petitions and procedures.</p>
                    </div>
                    <div className="bg-white border-l-4 border-red-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">⚖️ Court Process</h4>
                      <p className="text-gray-700 text-sm">Handled by designated courts with strict timelines, hearings, and evidence standards.</p>
                    </div>
                    <div className="bg-white border-l-4 border-rose-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">🧾 Remedies</h4>
                      <p className="text-gray-700 text-sm">Possible court orders include upholding results, recounts, nullification, or fresh elections.</p>
                    </div>
                  </div>

                  <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-orange-600 to-amber-600 text-white">
                        <tr>
                          <th className="px-6 py-4 text-left font-semibold">Dispute Type</th>
                          <th className="px-6 py-4 text-left font-semibold">Typical Forum</th>
                          <th className="px-6 py-4 text-left font-semibold">First Step</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Nomination disputes</td>
                          <td className="px-6 py-4 text-gray-700">Party dispute bodies / PPDT</td>
                          <td className="px-6 py-4 text-gray-700">Exhaust internal party mechanisms</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Result disputes</td>
                          <td className="px-6 py-4 text-gray-700">Election Courts</td>
                          <td className="px-6 py-4 text-gray-700">File petition within statutory timelines</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Process irregularities</td>
                          <td className="px-6 py-4 text-gray-700">Election Courts</td>
                          <td className="px-6 py-4 text-gray-700">Gather evidence and prepare affidavits</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Party conflicts</td>
                          <td className="px-6 py-4 text-gray-700">PPDT / High Court</td>
                          <td className="px-6 py-4 text-gray-700">Follow Political Parties Act procedures</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-amber-50 border-l-4 border-amber-600 p-6 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">Key legal tests courts apply</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" /><span>Was the election conducted in accordance with the Constitution and Elections Act?</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" /><span>Were any breaches substantial or minor technical issues?</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" /><span>Did the irregularities materially affect the final result?</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" /><span>Were the rights of voters and candidates protected?</span></li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 3: Legal Framework */}
              <section id="legal-framework" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Scale className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Legal Framework for Election Disputes</h2>
                </div>

                <div className="prose max-w-none">
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-l-4 border-amber-600 p-6 rounded-lg shadow-sm mb-6">
                    <h4 className="font-bold text-gray-900 mb-2">Constitution of Kenya 2010</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" /><span><strong>Article 81:</strong> Free, fair, transparent elections</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" /><span><strong>Article 87:</strong> Parliament to establish mechanisms for timely resolution of disputes</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" /><span><strong>Article 105:</strong> High Court jurisdiction over parliamentary elections</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" /><span><strong>Article 140:</strong> Supreme Court jurisdiction for presidential election petitions</span></li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white border-2 border-orange-300 p-5 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2">Elections Act 2011</h4>
                      <p className="text-gray-700 text-sm mb-3">Provides the statutory framework for filing petitions, election court procedures, timelines, and remedies including recounts, scrutiny, and nullification.</p>
                      <ul className="space-y-1 text-xs text-gray-700">
                        <li>• Defines election courts and petition filing requirements</li>
                        <li>• Sets timelines for petitions and responses</li>
                        <li>• Governs scrutiny, recounts, and audit orders</li>
                        <li>• Provides remedies and costs provisions</li>
                      </ul>
                    </div>
                    <div className="bg-white border-2 border-amber-300 p-5 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2">Election Petition Rules</h4>
                      <p className="text-gray-700 text-sm mb-3">Detailed court rules governing pleadings, service, evidence, pre-trial directions, and timelines for hearing petitions.</p>
                      <ul className="space-y-1 text-xs text-gray-700">
                        <li>• Form and content of petitions and affidavits</li>
                        <li>• Service requirements and response timelines</li>
                        <li>• Pre-trial conferences and case management</li>
                        <li>• Evidence presentation and witness handling</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white border-2 border-orange-200 p-6 rounded-lg mb-6">
                    <h4 className="font-bold text-gray-900 mb-2">Related Legal Instruments</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                      <div className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" /><span><strong>Supreme Court Rules:</strong> Procedures for presidential petition hearings and judgments</span></div>
                      <div className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" /><span><strong>Political Parties Act:</strong> Nomination disputes and internal party dispute mechanisms</span></div>
                      <div className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" /><span><strong>PPDT Regulations:</strong> Political Parties Disputes Tribunal processes</span></div>
                      <div className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" /><span><strong>IEBC Regulations:</strong> Operational standards for counting, tallying, and results transmission</span></div>
                    </div>
                  </div>

                  <p className="text-gray-700">For related election procedures, see <a href="/election-results-declaration-kenya" className="text-orange-600 hover:text-orange-700 font-medium">Election Results Declaration</a> and <a href="/presidential-parliamentary-county-elections-kenya" className="text-orange-600 hover:text-orange-700 font-medium">Types of Elections in Kenya</a>.</p>

                  <div className="bg-amber-50 border-l-4 border-amber-600 p-6 rounded-lg mt-6">
                    <h4 className="font-bold text-gray-900 mb-2">Common legal grounds in petitions</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" /><span>Non-compliance with constitutional and statutory election procedures</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" /><span>Irregularities in vote tallying or results transmission</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" /><span>Bribery, intimidation, or undue influence affecting voters</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" /><span>Invalid votes counted or valid votes excluded</span></li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 4: Types of Disputes */}
              <section id="types" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Types of Election Disputes</h2>
                </div>

                <div className="prose max-w-none">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white border-l-4 border-red-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">🗳️ Voting Irregularities</h4>
                      <p className="text-gray-700 text-sm">Claims of voter intimidation, ballot stuffing, missing ballots, or improper voting procedures.</p>
                    </div>
                    <div className="bg-white border-l-4 border-orange-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">📊 Result Disputes</h4>
                      <p className="text-gray-700 text-sm">Disagreements over tallying, transmission errors, or discrepancies between physical forms and electronic results.</p>
                    </div>
                    <div className="bg-white border-l-4 border-amber-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">🏛️ Party Nomination Conflicts</h4>
                      <p className="text-gray-700 text-sm">Challenges to party primary results or candidate selection decisions.</p>
                    </div>
                    <div className="bg-white border-l-4 border-rose-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">🧾 Compliance Disputes</h4>
                      <p className="text-gray-700 text-sm">Claims that IEBC or other agencies failed to comply with legal election requirements.</p>
                    </div>
                  </div>

                  <div className="bg-orange-50 border-l-4 border-orange-600 p-6 rounded-lg mb-6">
                    <h4 className="font-bold text-gray-900 mb-2">Typical dispute triggers</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" /><span>Mismatch between physical forms and electronic results</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" /><span>Unlawful exclusion of agents or observers</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" /><span>Late opening or early closing of polling stations</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" /><span>Failure to follow mandatory tallying procedures</span></li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 5: Courts */}
              <section id="courts" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Building2 className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Courts That Handle Election Petitions</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Election petitions are filed in specific courts depending on the position contested. The courts apply strict timelines and may conduct pre-trial conferences, scrutiny, or recounts. Appeals are limited by law to protect finality and stability.</p>
                  <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
                        <tr>
                          <th className="px-6 py-4 text-left font-semibold">Court</th>
                          <th className="px-6 py-4 text-left font-semibold">Jurisdiction</th>
                          <th className="px-6 py-4 text-left font-semibold">Election Types</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Supreme Court</td>
                          <td className="px-6 py-4 text-gray-700">Exclusive original jurisdiction</td>
                          <td className="px-6 py-4 text-gray-700">Presidential petitions</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">High Court</td>
                          <td className="px-6 py-4 text-gray-700">Election court for parliamentary and county</td>
                          <td className="px-6 py-4 text-gray-700">MP, Senator, Governor, MCA</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Magistrates’ Courts</td>
                          <td className="px-6 py-4 text-gray-700">Statutory jurisdiction for certain petitions</td>
                          <td className="px-6 py-4 text-gray-700">Some county-level disputes</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Court of Appeal</td>
                          <td className="px-6 py-4 text-gray-700">Appeals from High Court/Magistrates Courts</td>
                          <td className="px-6 py-4 text-gray-700">Parliamentary and county appeals</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-orange-50 border-l-4 border-orange-600 p-6 rounded-lg mb-6">
                    <h4 className="font-bold text-gray-900 mb-2">Appeals and Finality</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" /><span>Presidential petitions are final in the Supreme Court</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" /><span>Parliamentary and county petitions may be appealed to the Court of Appeal</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" /><span>Courts prioritize timely resolution to avoid prolonged uncertainty</span></li>
                    </ul>
                  </div>

                  <p className="text-gray-700">For IEBC’s election management role, see <a href="/understanding-iebc-kenya" className="text-orange-600 hover:text-orange-700 font-medium">Understanding IEBC</a>.</p>
                </div>
              </section>

              {/* Section 6: Who Can File */}
              <section id="who-can-file" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Users className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Who Can File an Election Petition?</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">To file a petition, the petitioner must have legal standing and a direct interest in the election. Courts reject petitions filed by individuals without a clear connection to the contested election or without compliance with filing requirements.</p>
                  <div className="bg-white border-l-4 border-amber-600 p-6 rounded-lg shadow-sm mb-6">
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" /><span>Any registered voter in the affected electoral area</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" /><span>Any candidate who contested the election</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" /><span>Any political party with a direct legal interest</span></li>
                    </ul>
                  </div>

                  <div className="bg-amber-50 border-l-4 border-amber-600 p-6 rounded-lg mb-6">
                    <p className="text-gray-900 font-semibold mb-2">Standing checklist</p>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" /><span>You are a registered voter or candidate in the affected electoral area</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" /><span>You can demonstrate how the alleged irregularity affected the outcome</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" /><span>You can comply with filing and service requirements within timelines</span></li>
                    </ul>
                  </div>

                  <p className="text-gray-700">Parties involved in nomination disputes should also review <a href="/political-parties-registration-kenya" className="text-orange-600 hover:text-orange-700 font-medium">Political Parties & Registration</a> for internal dispute mechanisms.</p>
                </div>
              </section>

              {/* Section 7: Time Limits */}
              <section id="timelines" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Clock className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Time Limits for Filing Petitions</h2>
                </div>

                <div className="prose max-w-none">
                  <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
                        <tr>
                          <th className="px-6 py-4 text-left font-semibold">Election Type</th>
                          <th className="px-6 py-4 text-left font-semibold">Filing Deadline</th>
                          <th className="px-6 py-4 text-left font-semibold">Legal Basis</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Presidential</td>
                          <td className="px-6 py-4 text-gray-700">7 days after declaration</td>
                          <td className="px-6 py-4 text-gray-700">Constitution Article 140</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Parliamentary</td>
                          <td className="px-6 py-4 text-gray-700">28 days after declaration</td>
                          <td className="px-6 py-4 text-gray-700">Elections Act</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">County</td>
                          <td className="px-6 py-4 text-gray-700">28 days after declaration</td>
                          <td className="px-6 py-4 text-gray-700">Elections Act</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-orange-50 border-l-4 border-orange-600 p-6 rounded-lg">
                    <p className="text-gray-900 font-semibold mb-2">⏳ Strict Deadlines</p>
                    <p className="text-gray-700 text-sm mb-3">Missing a filing deadline automatically disqualifies a petition. Always confirm timelines based on the official result declaration date.</p>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" /><span>Service on respondents must happen within strict court timelines</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" /><span>Responses and affidavits are due within court-set deadlines</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" /><span>Pre-trial directions define final timelines for hearings</span></li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 8: How to File */}
              <section id="how-to-file" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Step-by-Step Guide to Filing an Election Petition</h2>
                </div>

                <div className="prose max-w-none">
                  <div className="space-y-4 mb-8">
                    {[
                      {
                        step: '1',
                        title: 'Confirm Deadline and Court',
                        desc: 'Identify the correct court and statutory deadline based on the election type and declaration date.'
                      },
                      {
                        step: '2',
                        title: 'Prepare Petition',
                        desc: 'Draft a detailed petition setting out grounds of dispute, legal provisions, and desired remedies.'
                      },
                      {
                        step: '3',
                        title: 'Compile Evidence',
                        desc: 'Collect certified forms, polling station diaries, affidavits, and transmission logs supporting your claims.'
                      },
                      {
                        step: '4',
                        title: 'File and Pay Fees',
                        desc: 'File the petition in the correct registry and pay prescribed court filing fees.'
                      },
                      {
                        step: '5',
                        title: 'Serve Respondents',
                        desc: 'Serve IEBC, the declared winner, and other respondents within the required service timeline.'
                      },
                      {
                        step: '6',
                        title: 'Attend Pre-Trial Directions',
                        desc: 'Participate in pre-trial case management, including timelines for affidavits and evidence disclosure.'
                      },
                      {
                        step: '7',
                        title: 'Hearing and Judgment',
                        desc: 'Present evidence at hearing and await judgment and court orders.'
                      }
                    ].map((item) => (
                      <div key={item.step} className="bg-white border-l-4 border-amber-600 p-5 rounded-lg shadow-sm">
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold">{item.step}</div>
                          <div>
                            <p className="font-semibold text-gray-900 mb-1">{item.title}</p>
                            <p className="text-gray-700 text-sm">{item.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-amber-50 border-l-4 border-amber-600 p-6 rounded-lg">
                    <p className="text-gray-900 font-semibold mb-2">📌 Document Checklist</p>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" /><span>Certified results forms (e.g., Form 34A/34B/34C)</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" /><span>Sworn affidavits from witnesses and agents</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" /><span>Polling station diaries or occurrence books</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" /><span>Digital transmission logs and audit trails</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" /><span>Petition forms and supporting legal documents</span></li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 9: Evidence */}
              <section id="evidence" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Search className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Evidence Required in Election Disputes</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Evidence is the backbone of any petition. Courts require clear, credible, and relevant proof. Petitioners should preserve documents immediately after election day and seek certified copies from IEBC or courts where applicable.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white border-l-4 border-orange-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">📄 Documentary Evidence</h4>
                      <p className="text-gray-700 text-sm">Certified results forms, tally sheets, and IEBC official communications.</p>
                    </div>
                    <div className="bg-white border-l-4 border-amber-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">👥 Witness Affidavits</h4>
                      <p className="text-gray-700 text-sm">Sworn statements from candidates, agents, observers, and voters.</p>
                    </div>
                    <div className="bg-white border-l-4 border-red-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">🧪 Expert Reports</h4>
                      <p className="text-gray-700 text-sm">Forensic analysis, statistical reports, or technology audits.</p>
                    </div>
                    <div className="bg-white border-l-4 border-rose-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">💻 Digital Logs</h4>
                      <p className="text-gray-700 text-sm">Electronic results transmission logs and system access records.</p>
                    </div>
                  </div>

                  <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-orange-600 to-amber-600 text-white">
                        <tr>
                          <th className="px-6 py-4 text-left font-semibold">Evidence Type</th>
                          <th className="px-6 py-4 text-left font-semibold">Examples</th>
                          <th className="px-6 py-4 text-left font-semibold">Purpose</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Official Forms</td>
                          <td className="px-6 py-4 text-gray-700">Form 34A/34B/34C, tally sheets</td>
                          <td className="px-6 py-4 text-gray-700">Verify declared results and counts</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Witness Evidence</td>
                          <td className="px-6 py-4 text-gray-700">Affidavits by agents, voters, officials</td>
                          <td className="px-6 py-4 text-gray-700">Describe irregularities or misconduct</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Digital Logs</td>
                          <td className="px-6 py-4 text-gray-700">Transmission records, audit logs</td>
                          <td className="px-6 py-4 text-gray-700">Assess system integrity and discrepancies</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Expert Reports</td>
                          <td className="px-6 py-4 text-gray-700">Forensic, statistical or IT audits</td>
                          <td className="px-6 py-4 text-gray-700">Interpret technical evidence</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-amber-50 border-l-4 border-amber-600 p-6 rounded-lg">
                    <p className="text-gray-900 font-semibold mb-2">Evidence quality tips</p>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" /><span>Use certified copies of results forms where possible</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" /><span>Ensure affidavits are properly sworn and detailed</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" /><span>Keep a clear chain of custody for digital records</span></li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 10: Outcomes */}
              <section id="outcomes" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Possible Outcomes of a Petition</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">The court’s primary role is to determine whether the election was conducted in accordance with the law and whether any breach affected the result. Orders may be limited or expansive depending on the findings and statutory powers.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white border-2 border-green-300 p-5 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2">✅ Upholding Results</h4>
                      <p className="text-gray-700 text-sm">Court confirms the election as valid and maintains declared results.</p>
                    </div>
                    <div className="bg-white border-2 border-emerald-300 p-5 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2">🔁 Recount or Scrutiny</h4>
                      <p className="text-gray-700 text-sm">Court orders recount or scrutiny of votes or results forms.</p>
                    </div>
                    <div className="bg-white border-2 border-yellow-300 p-5 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2">🗳️ Fresh Election</h4>
                      <p className="text-gray-700 text-sm">Court nullifies results and orders a fresh election within specified timelines.</p>
                    </div>
                    <div className="bg-white border-2 border-red-300 p-5 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2">❌ Nullification</h4>
                      <p className="text-gray-700 text-sm">Court declares election invalid due to substantial non-compliance or illegalities.</p>
                    </div>
                  </div>

                  <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">Additional court directions</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /><span>Orders for scrutiny of specific polling stations</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /><span>Declaration of a candidate as validly elected in clear cases</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /><span>Costs orders based on conduct and complexity</span></li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 11: Costs */}
              <section id="costs" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Shield className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Legal Costs & Risks</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Election petitions involve legal costs and financial risk. Petitioners should budget for filing fees, legal representation, evidence collection, and potential adverse costs if unsuccessful.</p>

                  <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
                        <tr>
                          <th className="px-6 py-4 text-left font-semibold">Cost Category</th>
                          <th className="px-6 py-4 text-left font-semibold">Typical Items</th>
                          <th className="px-6 py-4 text-left font-semibold">Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Court Fees</td>
                          <td className="px-6 py-4 text-gray-700">Filing fees, registry charges</td>
                          <td className="px-6 py-4 text-gray-700">Set by court rules</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Legal Counsel</td>
                          <td className="px-6 py-4 text-gray-700">Advocate fees, research, drafting</td>
                          <td className="px-6 py-4 text-gray-700">Varies by case complexity</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Evidence Costs</td>
                          <td className="px-6 py-4 text-gray-700">Certified documents, expert reports</td>
                          <td className="px-6 py-4 text-gray-700">May include audits or forensic work</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Adverse Costs</td>
                          <td className="px-6 py-4 text-gray-700">Costs ordered against losing party</td>
                          <td className="px-6 py-4 text-gray-700">Risk if petition fails</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg">
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2"><AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" /><span>Filing fees and court charges are mandatory and vary by court.</span></li>
                      <li className="flex gap-2"><AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" /><span>Legal representation fees can be substantial given complex litigation.</span></li>
                      <li className="flex gap-2"><AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" /><span>Courts may award costs against the losing party.</span></li>
                      <li className="flex gap-2"><AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" /><span>Weak or frivolous petitions may attract punitive costs.</span></li>
                    </ul>
                  </div>

                  <div className="bg-orange-50 border-l-4 border-orange-600 p-6 rounded-lg mt-6">
                    <h4 className="font-bold text-gray-900 mb-2">Risk management tips</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" /><span>Use a qualified advocate familiar with election law</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" /><span>File complete affidavits and evidence early</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" /><span>Seek clear legal advice on prospects before filing</span></li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 12: Case Examples */}
              <section id="cases" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Real-Life Case Examples (Educational Summaries)</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">These summaries are educational and highlight common legal questions courts address. They are not political commentary and are designed to help citizens understand how courts reason through evidence and legal standards.</p>

                  <div className="space-y-4">
                    <div className="bg-white border-l-4 border-amber-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">Case Example 1: Presidential Petition</h4>
                      <p className="text-gray-700 text-sm">Petition challenged tallying and transmission processes. The court analyzed constitutional compliance and evidence before issuing a final decision within strict timelines.</p>
                    </div>
                    <div className="bg-white border-l-4 border-orange-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">Case Example 2: Parliamentary Petition</h4>
                      <p className="text-gray-700 text-sm">A petitioner alleged irregularities in a constituency tally center. The court ordered scrutiny of forms and upheld results after confirming minimal impact.</p>
                    </div>
                    <div className="bg-white border-l-4 border-red-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">Case Example 3: County Petition</h4>
                      <p className="text-gray-700 text-sm">A county election petition alleged intimidation and unlawful exclusion of agents. The court found substantial non-compliance and ordered a fresh election.</p>
                    </div>
                    <div className="bg-white border-l-4 border-rose-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">Case Example 4: Nomination Dispute</h4>
                      <p className="text-gray-700 text-sm">A party member challenged primary results for failure to follow internal rules. The tribunal ordered a repeat nomination exercise and directed compliance with party constitution.</p>
                    </div>
                    <div className="bg-white border-l-4 border-amber-700 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">Case Example 5: Result Discrepancy</h4>
                      <p className="text-gray-700 text-sm">A petition alleged mismatched figures between results forms and the public portal. The court ordered limited scrutiny and ruled on whether discrepancies affected final outcome.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 13: FAQs */}
              <section id="faqs" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <BarChart3 className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
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
                          <ChevronUp className="w-5 h-5 text-orange-600 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-orange-600 flex-shrink-0" />
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
              <section className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white p-8 rounded-xl shadow-xl">
                <h3 className="text-2xl font-bold mb-4">Need Help Filing an Election Petition?</h3>
                <p className="mb-6 text-orange-100">Get guidance on election disputes, petition filing, and results verification from a trusted legal resource.</p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/contactus" className="bg-white text-orange-700 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition">
                    Get Legal Help
                  </Link>
                  <a href="/election-petitions-disputes-kenya#how-to-file" className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-400 transition">
                    Download Petition Forms
                  </a>
                  <a href="/election-results-declaration-kenya" className="bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition">
                    Learn About Election Results
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

export default ElectionPetitionsDisputesKenya;
