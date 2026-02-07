import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  ChevronUp,
  BarChart3,
  Scale,
  Users,
  FileText,
  CheckCircle2,
  AlertCircle,
  Building2,
  BadgeCheck,
  ClipboardList,
  Coins,
  Megaphone
} from 'lucide-react';

const faqs = [
  {
    question: 'What are the basic qualifications to run for office in Kenya?',
    answer: 'You must be a Kenyan citizen, a registered voter, meet age requirements for the specific position, and satisfy integrity requirements under the Constitution and Elections Act.'
  },
  {
    question: 'Can I run as an independent candidate in Kenya?',
    answer: 'Yes. Independent candidates can run for office if they meet legal requirements, submit supporter lists, and comply with IEBC nomination rules.'
  },
  {
    question: 'What is the minimum age for president in Kenya?',
    answer: 'The Constitution requires a presidential candidate to be at least 35 years old.'
  },
  {
    question: 'What is the minimum age for governor, senator, and MP?',
    answer: 'Governors, Senators, and Members of Parliament must be at least 18 years old, subject to any additional statutory requirements.'
  },
  {
    question: 'Do I need to belong to a political party to run?',
    answer: 'No. You may run as a party-sponsored or independent candidate. Party candidates must follow party nomination processes.'
  },
  {
    question: 'What forms are required for nomination?',
    answer: 'Nomination forms vary by position and candidate type. Official IEBC nomination forms and declarations are required.'
  },
  {
    question: 'How many supporters do independent candidates need?',
    answer: 'Supporter numbers depend on the position and are set by IEBC regulations. Supporters must be registered voters in the relevant area.'
  },
  {
    question: 'What is the nomination deadline?',
    answer: 'IEBC sets nomination deadlines for each election cycle. Always confirm from the IEBC election calendar.'
  },
  {
    question: 'What is a clearance certificate?',
    answer: 'Clearance refers to statutory compliance checks, including tax and integrity clearance where required, and confirmation of eligibility.'
  },
  {
    question: 'Are nomination fees required?',
    answer: 'Yes. IEBC and political parties charge nomination fees. Fees differ by position and candidate category.'
  },
  {
    question: 'Can my nomination be rejected?',
    answer: 'Yes, if documents are incomplete, deadlines are missed, or eligibility requirements are not met.'
  },
  {
    question: 'What are common mistakes candidates make?',
    answer: 'Submitting wrong forms, missing signatures, late filing, and failing to meet supporter requirements are common errors.'
  },
  {
    question: 'What laws govern nomination and candidacy?',
    answer: 'The Constitution, Elections Act, IEBC Act, Political Parties Act, and relevant regulations govern nominations and candidacy.'
  },
  {
    question: 'What happens after nomination approval?',
    answer: 'Approved candidates receive confirmation from IEBC and can begin campaigns within legal rules.'
  },
  {
    question: 'Where can I get official forms?',
    answer: 'Use the IEBC forms hub to access official nomination documents and submission guidance.'
  }
];

const BecomeCandidateKenya: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<string>('overview');

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  useEffect(() => {
    const metaTitle = 'How to Become a Candidate in Kenya – Legal Guide';
    const metaDescription = 'Official guide to becoming a candidate in Kenya: eligibility, nomination steps, forms, fees, timelines, and legal requirements.';
    const canonicalUrl = 'https://wakili.co.ke/become-candidate-kenya';

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
              "name": "Become a Candidate in Kenya",
              "item": "https://wakili.co.ke/become-candidate-kenya"
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
          "name": "How to Become a Candidate in Kenya",
          "step": [
            {
              "@type": "HowToStep",
              "name": "Choose Path",
              "text": "Decide whether to run as party-sponsored or independent candidate"
            },
            {
              "@type": "HowToStep",
              "name": "Confirm Eligibility",
              "text": "Verify age, citizenship, voter registration, and integrity requirements"
            },
            {
              "@type": "HowToStep",
              "name": "Collect Supporters",
              "text": "Gather required supporter signatures if running as independent"
            },
            {
              "@type": "HowToStep",
              "name": "Fill IEBC Forms",
              "text": "Complete official nomination forms and statutory declarations"
            },
            {
              "@type": "HowToStep",
              "name": "Submit & Pay Fees",
              "text": "Submit forms to IEBC and pay nomination fees within timelines"
            },
            {
              "@type": "HowToStep",
              "name": "Clearance & Approval",
              "text": "Receive clearance and confirmation from IEBC"
            }
          ]
        },
        {
          "@type": "GovernmentService",
          "name": "IEBC Candidate Nomination Guidance",
          "areaServed": "Kenya",
          "serviceType": "Candidate nomination requirements and guidance",
          "url": "https://wakili.co.ke/become-candidate-kenya"
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
        'positions',
        'eligibility',
        'party-vs-independent',
        'process',
        'documents',
        'fees',
        'mistakes',
        'after-nomination',
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
              <span className="text-gray-900">Become a Candidate</span>
            </nav>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">How to Become a Candidate in Kenya – Nomination Requirements & Process</h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-3xl">Official, evergreen guide to candidate eligibility, nomination requirements, forms, fees, and lawful campaign compliance.</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 flex-shrink-0">
              <div className="lg:sticky lg:top-20">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                    Quick Navigation
                  </h3>
                  <nav className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 lg:block lg:space-y-2 lg:gap-0 lg:overflow-visible lg:pb-0 lg:mx-0 lg:px-0">
                    {[
                      { id: 'overview', label: 'Overview', icon: BarChart3 },
                      { id: 'legal-framework', label: 'Legal Framework', icon: Scale },
                      { id: 'positions', label: 'Elective Positions', icon: Users },
                      { id: 'eligibility', label: 'Eligibility Table', icon: BadgeCheck },
                      { id: 'party-vs-independent', label: 'Party vs Independent', icon: Building2 },
                      { id: 'process', label: 'Nomination Process', icon: ClipboardList },
                      { id: 'documents', label: 'Documents Checklist', icon: FileText },
                      { id: 'fees', label: 'Fees & Timelines', icon: Coins },
                      { id: 'mistakes', label: 'Common Mistakes', icon: AlertCircle },
                      { id: 'after-nomination', label: 'After Nomination', icon: Megaphone },
                      { id: 'faqs', label: 'FAQs', icon: BarChart3 }
                    ].map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => scrollToSection(id)}
                        className={`flex-shrink-0 lg:w-full text-left px-3 py-2 rounded transition flex items-center gap-2 whitespace-nowrap ${
                          activeSection === id
                            ? 'bg-indigo-100 text-indigo-700 font-medium'
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
                  <BarChart3 className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Overview of Running for Public Office in Kenya</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-4 text-lg leading-relaxed">Running for public office in Kenya is governed by a comprehensive legal framework established by the <strong>Constitution of Kenya 2010</strong>, the <strong>Elections Act 2011</strong>, the <strong>IEBC Act 2011</strong>, and subsidiary legislation including the <strong>Elections (General) Regulations 2012</strong>. Article 38 of the Constitution guarantees every citizen the right to stand for elective office, while Articles 99, 137, 180, and 193 set specific eligibility requirements for different positions. The <strong>Independent Electoral and Boundaries Commission (IEBC)</strong>, established under Article 88 and the IEBC Act 2011, is the sole constitutional body mandated to conduct and supervise elections, including the nomination of candidates.</p>
                  
                  <p className="text-gray-700 mb-4">Candidates must meet age, citizenship, voter registration, and integrity requirements as stipulated in the Constitution and interpreted through the <strong>Leadership and Integrity Act 2012</strong>. The <strong>Political Parties Act 2011</strong> regulates party nomination processes, while independent candidates must comply with supporter signature requirements outlined in the Elections Act and IEBC regulations. The nomination process is time-sensitive and highly procedural—failure to submit correct forms, pay fees, or meet deadlines can result in automatic disqualification under Section 14 of the Elections Act 2011.</p>
                  
                  <p className="text-gray-700 mb-6">Whether you are a party-sponsored or independent candidate, strict compliance with legal procedures is mandatory. The <strong>Elections (General) Regulations 2012</strong> prescribe the exact format of nomination forms, supporter lists, and statutory declarations. Non-compliance can lead to disqualification, disputes before IEBC's Dispute Resolution Committee (established under Section 74 of the Elections Act), or petitions to the High Court. For more on election disputes, see <a href="/election-petitions-disputes-kenya" className="text-indigo-600 hover:text-indigo-700 font-medium">Election Petitions & Disputes</a>. This guide also links to <a href="/understanding-iebc-kenya" className="text-indigo-600 hover:text-indigo-700 font-medium">Understanding IEBC</a>, <a href="/elections-in-kenya" className="text-indigo-600 hover:text-indigo-700 font-medium">Elections in Kenya</a>, and official forms in <a href="/iebc-forms-downloads" className="text-indigo-600 hover:text-indigo-700 font-medium">IEBC Forms & Downloads</a>.</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                      <div className="text-3xl font-bold text-indigo-700 mb-2">Eligibility</div>
                      <div className="text-gray-900 font-semibold mb-1">Legal Thresholds</div>
                      <div className="text-sm text-gray-600">Age, citizenship, voter registration</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                      <div className="text-3xl font-bold text-blue-700 mb-2">Nomination</div>
                      <div className="text-gray-900 font-semibold mb-1">IEBC Process</div>
                      <div className="text-sm text-gray-600">Forms, fees, deadlines</div>
                    </div>
                    <div className="bg-gradient-to-br from-cyan-50 to-indigo-50 border-2 border-cyan-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                      <div className="text-3xl font-bold text-cyan-700 mb-2">Compliance</div>
                      <div className="text-gray-900 font-semibold mb-1">Rules & Conduct</div>
                      <div className="text-sm text-gray-600">Campaign law and integrity</div>
                    </div>
                  </div>
                </div>
              </section>

              <section id="legal-framework" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Scale className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Legal Framework</h2>
                </div>

                <div className="prose max-w-none">
                  <div className="bg-white border-2 border-indigo-200 p-6 rounded-xl shadow-sm mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Key laws and regulations governing candidate nomination</h3>
                    <div className="space-y-4 text-sm text-gray-700">
                      <div className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold">Constitution of Kenya 2010:</span>
                          <ul className="ml-4 mt-1 space-y-1 list-disc">
                            <li><strong>Article 38:</strong> Guarantees every citizen the right to stand for elective office</li>
                            <li><strong>Article 81:</strong> Establishes general principles of the electoral system (free, fair, transparent)</li>
                            <li><strong>Article 99:</strong> Prescribes qualifications for Members of Parliament (citizenship, age 18+, voter registration)</li>
                            <li><strong>Article 137:</strong> Sets presidential qualifications (citizen by birth, at least 35 years, degree holder, nominated by political party or as independent)</li>
                            <li><strong>Article 180:</strong> County government qualifications for governors and members of county assembly</li>
                            <li><strong>Article 193:</strong> Qualifications for members of county assemblies</li>
                            <li><strong>Articles 73-75:</strong> Leadership and integrity requirements (state officers must demonstrate competence and integrity)</li>
                          </ul>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold">Elections Act 2011:</span>
                          <ul className="ml-4 mt-1 space-y-1 list-disc">
                            <li><strong>Section 13:</strong> Specifies qualifications and disqualifications for candidates</li>
                            <li><strong>Section 14:</strong> Details grounds for disqualification (undischarged bankruptcy, mental incapacity, criminal convictions)</li>
                            <li><strong>Section 22:</strong> Independent candidate nomination and supporter requirements</li>
                            <li><strong>Section 24:</strong> Procedures for nomination of candidates by political parties</li>
                            <li><strong>Section 74:</strong> Establishment of IEBC's Dispute Resolution Committee to handle nomination disputes</li>
                          </ul>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold">IEBC Act 2011:</span>
                          <ul className="ml-4 mt-1 space-y-1 list-disc">
                            <li><strong>Section 4:</strong> Establishes the IEBC as the sole body responsible for conducting elections and supervising candidate nomination</li>
                            <li><strong>Section 9:</strong> Powers of IEBC to issue guidelines and regulations for nomination procedures</li>
                            <li><strong>Section 10:</strong> IEBC's duty to ensure transparent and accountable nomination processes</li>
                          </ul>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold">Elections (General) Regulations 2012:</span>
                          <ul className="ml-4 mt-1 space-y-1 list-disc">
                            <li><strong>Regulation 47:</strong> Prescribes forms and procedures for submission of nomination papers</li>
                            <li><strong>Regulation 48:</strong> Requirements for independent candidate supporter lists and declarations</li>
                            <li><strong>Regulation 50:</strong> Nomination fees and payment timelines</li>
                            <li><strong>Regulation 52:</strong> Procedures for scrutiny and clearance of nomination documents</li>
                          </ul>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold">Political Parties Act 2011:</span>
                          <ul className="ml-4 mt-1 space-y-1 list-disc">
                            <li><strong>Section 35:</strong> Party nomination rules and internal democracy requirements</li>
                            <li><strong>Section 37:</strong> Obligations of parties to conduct free and fair nomination processes</li>
                            <li><strong>Section 38:</strong> Dispute resolution mechanisms within political parties</li>
                          </ul>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold">Leadership and Integrity Act 2012:</span>
                          <ul className="ml-4 mt-1 space-y-1 list-disc">
                            <li><strong>Section 22:</strong> Requirements for integrity clearance from the Ethics and Anti-Corruption Commission (EACC)</li>
                            <li><strong>Section 25:</strong> Tax compliance clearance from the Kenya Revenue Authority (KRA)</li>
                            <li><strong>Chapter 6 Compliance:</strong> State officers (including elective leaders) must demonstrate integrity, competence, and financial probity</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded-lg">
                    <p className="text-gray-900 font-semibold mb-2">Why the legal framework matters</p>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" /><span><strong>Constitutional Mandate:</strong> Article 38 grants the right to stand for office, but this right is subject to qualifications and limitations set by law</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" /><span><strong>Defines Eligibility:</strong> The legal framework sets clear age, citizenship, and integrity thresholds to ensure qualified leadership</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" /><span><strong>Sets Nomination Procedures:</strong> Detailed regulations ensure uniform, transparent nomination processes across all parties and constituencies</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" /><span><strong>Protects Electoral Integrity:</strong> Strict compliance requirements prevent fraud, corruption, and unqualified candidates from contesting elections</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" /><span><strong>Provides Dispute Mechanisms:</strong> Clear legal pathways exist for challenging improper nominations or disqualifications</span></li>
                    </ul>
                  </div>
                </div>
              </section>

              <section id="positions" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Users className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Types of Elective Positions</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Kenya's electoral system, as defined under Article 81 of the Constitution, provides for six main categories of elective positions at national and county levels. Each position has specific constitutional and statutory qualifications outlined in the Constitution and Elections Act 2011.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white border-l-4 border-blue-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">President</h4>
                      <p className="text-gray-700 text-sm mb-3">Head of State and Government, elected nationally under <strong>Article 137 of the Constitution</strong>.</p>
                      <ul className="text-xs text-gray-600 space-y-1 ml-4 list-disc">
                        <li>Must be a citizen by birth</li>
                        <li>At least 35 years old</li>
                        <li>Holder of a degree from a university recognized in Kenya</li>
                        <li>Nominated by a political party or runs as independent</li>
                        <li>Must meet Chapter 6 integrity requirements</li>
                      </ul>
                    </div>
                    <div className="bg-white border-l-4 border-blue-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">Governor</h4>
                      <p className="text-gray-700 text-sm mb-3">County executive leader elected at county level under <strong>Article 180 of the Constitution</strong>.</p>
                      <ul className="text-xs text-gray-600 space-y-1 ml-4 list-disc">
                        <li>Must be a Kenyan citizen</li>
                        <li>At least 18 years old (subject to statutory amendments)</li>
                        <li>Registered voter in the county</li>
                        <li>Holder of a degree from a university recognized in Kenya</li>
                        <li>Must meet Chapter 6 integrity requirements</li>
                      </ul>
                    </div>
                    <div className="bg-white border-l-4 border-blue-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">Senator</h4>
                      <p className="text-gray-700 text-sm mb-3">Represents counties in the Senate under <strong>Article 98 of the Constitution</strong>.</p>
                      <ul className="text-xs text-gray-600 space-y-1 ml-4 list-disc">
                        <li>Must be a Kenyan citizen</li>
                        <li>At least 18 years old</li>
                        <li>Registered voter</li>
                        <li>Meets leadership and integrity requirements</li>
                        <li>No disqualifying criminal convictions</li>
                      </ul>
                    </div>
                    <div className="bg-white border-l-4 border-blue-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">Member of Parliament (MP)</h4>
                      <p className="text-gray-700 text-sm mb-3">Represents constituencies in the National Assembly under <strong>Article 99 of the Constitution</strong>.</p>
                      <ul className="text-xs text-gray-600 space-y-1 ml-4 list-disc">
                        <li>Must be a Kenyan citizen</li>
                        <li>At least 18 years old</li>
                        <li>Registered voter</li>
                        <li>No disqualifications under Elections Act</li>
                        <li>Meets integrity requirements</li>
                      </ul>
                    </div>
                    <div className="bg-white border-l-4 border-blue-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">Woman Representative</h4>
                      <p className="text-gray-700 text-sm mb-3">Represents counties for gender equity in the National Assembly under <strong>Article 97(1)(c) of the Constitution</strong>.</p>
                      <ul className="text-xs text-gray-600 space-y-1 ml-4 list-disc">
                        <li>Must be a Kenyan citizen (female)</li>
                        <li>At least 18 years old</li>
                        <li>Registered voter in the county</li>
                        <li>Meets leadership and integrity requirements</li>
                      </ul>
                    </div>
                    <div className="bg-white border-l-4 border-blue-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">Member of County Assembly (MCA)</h4>
                      <p className="text-gray-700 text-sm mb-3">Represents wards in county assemblies under <strong>Article 193 of the Constitution</strong>.</p>
                      <ul className="text-xs text-gray-600 space-y-1 ml-4 list-disc">
                        <li>Must be a Kenyan citizen</li>
                        <li>At least 18 years old</li>
                        <li>Registered voter in the ward</li>
                        <li>No disqualifications under Elections Act</li>
                        <li>Meets integrity requirements</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section id="eligibility" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <BadgeCheck className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Eligibility Requirements for Each Position</h2>
                </div>

                <div className="prose max-w-none">
                  <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
                        <tr>
                          <th className="px-6 py-4 text-left font-semibold">Position</th>
                          <th className="px-6 py-4 text-left font-semibold">Minimum Age</th>
                          <th className="px-6 py-4 text-left font-semibold">Key Requirements</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">President</td>
                          <td className="px-6 py-4 text-gray-700">35 years</td>
                          <td className="px-6 py-4 text-gray-700">Citizen by birth, registered voter, party or independent compliance</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Governor</td>
                          <td className="px-6 py-4 text-gray-700">18 years</td>
                          <td className="px-6 py-4 text-gray-700">Registered voter, integrity compliance, party/independent rules</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Senator</td>
                          <td className="px-6 py-4 text-gray-700">18 years</td>
                          <td className="px-6 py-4 text-gray-700">Registered voter, meets leadership and integrity requirements</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">MP</td>
                          <td className="px-6 py-4 text-gray-700">18 years</td>
                          <td className="px-6 py-4 text-gray-700">Registered voter, nomination compliance</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Woman Rep</td>
                          <td className="px-6 py-4 text-gray-700">18 years</td>
                          <td className="px-6 py-4 text-gray-700">Registered voter, nomination compliance</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">MCA</td>
                          <td className="px-6 py-4 text-gray-700">18 years</td>
                          <td className="px-6 py-4 text-gray-700">Registered voter, ward-based requirements</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              <section id="party-vs-independent" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Building2 className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Party-Sponsored vs Independent Candidates</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Both party-sponsored and independent candidates are constitutionally recognized under <strong>Article 38 of the Constitution</strong>. However, their nomination pathways differ significantly. <strong>Section 24 of the Elections Act 2011</strong> governs party nominations, while <strong>Section 22</strong> regulates independent candidate procedures.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white border-2 border-indigo-200 p-6 rounded-xl shadow-sm">
                      <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-indigo-600" />
                        Party-Sponsored Candidates
                      </h3>
                      <p className="text-gray-700 text-sm mb-3">Party candidates must participate in party primaries or nomination processes governed by the <strong>Political Parties Act 2011</strong>. Section 35 of the Act requires parties to conduct free, fair, and democratic nominations.</p>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" /><span><strong>Win Party Nomination:</strong> Must participate in and win the party's nomination election or selection process</span></li>
                        <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" /><span><strong>Party Nomination Certificate:</strong> Issued by the party after successful nomination as proof for IEBC submission</span></li>
                        <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" /><span><strong>Party Rules & Code of Conduct:</strong> Bound by party constitution, rules, and ethics as required by Section 37 of Political Parties Act</span></li>
                        <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" /><span><strong>Party Symbol:</strong> Use the official party symbol on the ballot paper</span></li>
                        <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" /><span><strong>Party Support:</strong> Access to party resources, branding, and campaign support structures</span></li>
                      </ul>
                    </div>
                    <div className="bg-white border-2 border-blue-200 p-6 rounded-xl shadow-sm">
                      <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        Independent Candidates
                      </h3>
                      <p className="text-gray-700 text-sm mb-3">Independent candidates are regulated under <strong>Section 22 of the Elections Act 2011</strong> and <strong>Regulation 48 of the Elections (General) Regulations 2012</strong>. They must collect supporter signatures from registered voters in their electoral area.</p>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Supporter Signatures:</strong> Must collect and submit supporter lists with signatures of registered voters (number varies by position—check IEBC regulations)</span></li>
                        <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Statutory Declarations:</strong> Must submit sworn declarations of eligibility and compliance with legal requirements</span></li>
                        <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Independent Symbol:</strong> Assigned an independent candidate symbol by IEBC for the ballot paper</span></li>
                        <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>No Party Affiliation:</strong> Cannot be a registered member of any political party at the time of nomination</span></li>
                        <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Self-Funded Campaign:</strong> Must rely on personal resources and supporters without party infrastructure</span></li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded-lg">
                    <p className="text-gray-900 font-semibold mb-2 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      Important Legal Considerations
                    </p>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" /><span><strong>Party Disputes:</strong> Section 38 of the Political Parties Act provides for internal party dispute resolution. If unresolved, disputes can be taken to IEBC or the Political Parties Disputes Tribunal</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" /><span><strong>Independent Supporter Verification:</strong> IEBC verifies supporter signatures against the voter register. False or duplicate signatures can lead to disqualification</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" /><span><strong>Switching from Party to Independent:</strong> A candidate who loses party nomination cannot immediately run as independent unless they resign party membership and comply with cooling-off periods if prescribed</span></li>
                    </ul>
                  </div>
                  
                  <p className="text-gray-700 mt-6">For party rules and registration, see <a href="/political-parties-registration-kenya" className="text-indigo-600 hover:text-indigo-700 font-medium">Political Parties Registration</a>.</p>
                </div>
              </section>

              <section id="process" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <ClipboardList className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Step-by-Step Nomination Process</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">The nomination process is governed by <strong>Regulation 47-52 of the Elections (General) Regulations 2012</strong> and must be completed within timelines set by IEBC under <strong>Section 9 of the IEBC Act 2011</strong>. The process is uniform but has different requirements for party-sponsored and independent candidates.</p>
                  
                  <div className="space-y-4 mb-6">
                    <div className="bg-white border-l-4 border-indigo-600 p-5 rounded-lg shadow-sm">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                        <div>
                          <p className="font-semibold text-gray-900 mb-2">Choose Your Nomination Path</p>
                          <p className="text-gray-700 text-sm mb-2">Decide whether to run as a party-sponsored candidate or as an independent candidate. This decision determines your entire nomination pathway and requirements.</p>
                          <ul className="text-xs text-gray-600 space-y-1 ml-4 list-disc">
                            <li><strong>Party-Sponsored:</strong> Register with and participate in the nomination process of a registered political party under the Political Parties Act 2011</li>
                            <li><strong>Independent:</strong> Ensure you are not a registered member of any political party and prepare to collect supporter signatures as per Section 22 of the Elections Act</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white border-l-4 border-indigo-600 p-5 rounded-lg shadow-sm">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                        <div>
                          <p className="font-semibold text-gray-900 mb-2">Confirm Your Eligibility</p>
                          <p className="text-gray-700 text-sm mb-2">Verify that you meet all constitutional and statutory qualifications for the position you seek. This includes age, citizenship, voter registration, and integrity requirements.</p>
                          <ul className="text-xs text-gray-600 space-y-1 ml-4 list-disc">
                            <li><strong>Age Requirement:</strong> President (35+ years, Article 137), all other positions (18+ years, Articles 99, 180, 193)</li>
                            <li><strong>Citizenship:</strong> President must be citizen by birth; others must be Kenyan citizens</li>
                            <li><strong>Voter Registration:</strong> Must be a registered voter in Kenya (Article 38 and Section 13, Elections Act)</li>
                            <li><strong>Integrity Clearance:</strong> Obtain tax compliance certificate from KRA and clearance from EACC under Section 22 & 25 of Leadership and Integrity Act</li>
                            <li><strong>No Disqualifications:</strong> Ensure you have no disqualifying criminal convictions, bankruptcy, or mental incapacity (Section 14, Elections Act)</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white border-l-4 border-indigo-600 p-5 rounded-lg shadow-sm">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
                        <div>
                          <p className="font-semibold text-gray-900 mb-2">Collect Supporter Signatures (Independent Candidates Only)</p>
                          <p className="text-gray-700 text-sm mb-2">If running as an independent candidate, collect the required number of supporter signatures from registered voters in your electoral area as prescribed by Regulation 48 of the Elections (General) Regulations 2012.</p>
                          <ul className="text-xs text-gray-600 space-y-1 ml-4 list-disc">
                            <li><strong>Presidential Candidates:</strong> Must collect signatures from at least 2,000 registered voters from each of at least 24 counties</li>
                            <li><strong>Gubernatorial Candidates:</strong> Number set by IEBC regulations (typically 1,000-2,000 registered voters from the county)</li>
                            <li><strong>Other Positions:</strong> Check IEBC guidelines for specific numbers per position</li>
                            <li><strong>Verification:</strong> All supporters must be on the current voter register. IEBC will verify signatures and may reject invalid or duplicate entries</li>
                            <li><strong>Forms:</strong> Use official IEBC supporter list forms available at <a href="/iebc-forms-downloads" className="text-indigo-600 hover:text-indigo-700">IEBC Forms Hub</a></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white border-l-4 border-indigo-600 p-5 rounded-lg shadow-sm">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">4</div>
                        <div>
                          <p className="font-semibold text-gray-900 mb-2">Complete Official IEBC Nomination Forms</p>
                          <p className="text-gray-700 text-sm mb-2">Fill out the correct IEBC nomination forms prescribed under Regulation 47. Forms vary by position and candidate type (party or independent).</p>
                          <ul className="text-xs text-gray-600 space-y-1 ml-4 list-disc">
                            <li><strong>Personal Information:</strong> Full legal name, ID/passport number, date of birth, contact details</li>
                            <li><strong>Electoral Area Details:</strong> Specify the county, constituency, or ward for which you are contesting</li>
                            <li><strong>Party Information (if applicable):</strong> Party name, party nomination certificate number and date</li>
                            <li><strong>Statutory Declarations:</strong> Swear/affirm that you meet all eligibility requirements and have no disqualifications</li>
                            <li><strong>Signatures:</strong> Sign before a commissioner of oaths or authorized IEBC officer</li>
                            <li><strong>Download Forms:</strong> Access official forms at <a href="/iebc-forms-downloads" className="text-indigo-600 hover:text-indigo-700">IEBC Forms & Downloads</a></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white border-l-4 border-indigo-600 p-5 rounded-lg shadow-sm">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">5</div>
                        <div>
                          <p className="font-semibold text-gray-900 mb-2">Submit Documents & Pay Nomination Fees</p>
                          <p className="text-gray-700 text-sm mb-2">Submit your complete nomination packet to the IEBC returning officer for your electoral area and pay the prescribed nomination fees under Regulation 50.</p>
                          <ul className="text-xs text-gray-600 space-y-1 ml-4 list-disc">
                            <li><strong>Submission Deadline:</strong> Must be submitted within the IEBC-designated nomination window (typically 7-14 days before elections)</li>
                            <li><strong>Document Checklist:</strong> Nomination forms, ID/passport copy, voter registration confirmation, supporter lists (independent), party certificate (party), integrity certificates, degree certificates (President/Governor)</li>
                            <li><strong>Nomination Fees:</strong> Paid to IEBC via bank deposit, M-Pesa, or other approved payment methods. Fees vary by position—check current IEBC fee schedule</li>
                            <li><strong>Receipt:</strong> IEBC issues a receipt confirming submission and payment</li>
                            <li><strong>Scrutiny:</strong> IEBC officers scrutinize documents for completeness and compliance within 24-48 hours</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white border-l-4 border-indigo-600 p-5 rounded-lg shadow-sm">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">6</div>
                        <div>
                          <p className="font-semibold text-gray-900 mb-2">Clearance, Approval & Gazettement</p>
                          <p className="text-gray-700 text-sm mb-2">IEBC reviews your nomination papers under Regulation 52, conducts final clearance, and officially gazetted approved candidates.</p>
                          <ul className="text-xs text-gray-600 space-y-1 ml-4 list-disc">
                            <li><strong>Document Review:</strong> IEBC verifies all submitted documents against legal requirements</li>
                            <li><strong>Clearance Process:</strong> IEBC may request additional documentation or clarification if needed</li>
                            <li><strong>Approval/Rejection:</strong> IEBC issues written approval or rejection. Rejections must state reasons and legal basis</li>
                            <li><strong>Gazettement:</strong> Approved candidates are published in the Kenya Gazette and displayed at IEBC offices</li>
                            <li><strong>Appeals:</strong> Rejected candidates can appeal to IEBC's Dispute Resolution Committee within 24-48 hours, or file a petition in court</li>
                            <li><strong>Nomination Certificate:</strong> Approved candidates receive an official IEBC nomination certificate allowing them to campaign lawfully</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg">
                    <p className="text-gray-900 font-semibold mb-2 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-blue-600" />
                      Critical Timelines to Remember
                    </p>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>IEBC sets specific nomination windows:</strong> Typically 120 days before election day, with final submission deadlines 60-90 days before elections</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Late submissions are automatically rejected:</strong> No extensions are granted except by court order</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Always verify current IEBC calendar:</strong> Check the official IEBC website or contact IEBC offices for exact dates</span></li>
                    </ul>
                  </div>
                </div>
              </section>

              <section id="documents" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Required Documents Checklist</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Under <strong>Regulation 47 of the Elections (General) Regulations 2012</strong>, all candidates must submit specific documents to prove eligibility and compliance with legal requirements. The exact documents required may vary slightly by position and candidate type.</p>
                  
                  <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Mandatory Documents for All Candidates</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>National ID or Passport:</strong> Valid government-issued identification proving citizenship and age</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Voter Registration Confirmation:</strong> Proof of registration on the current voter register (obtain from IEBC or check online at <a href="/how-to-check-voter-status-kenya" className="text-indigo-600 hover:text-indigo-700">How to Check Voter Status</a>)</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Completed IEBC Nomination Forms:</strong> Official forms prescribed for your specific position (download at <a href="/iebc-forms-downloads" className="text-indigo-600 hover:text-indigo-700">IEBC Forms Hub</a>)</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Statutory Declarations:</strong> Sworn affidavits declaring eligibility, no disqualifications, and compliance with Constitution and Elections Act</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Tax Compliance Certificate:</strong> Certificate from Kenya Revenue Authority (KRA) showing compliance with tax obligations under Section 25 of the Leadership and Integrity Act</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Clearance Certificate from EACC:</strong> Ethics and Anti-Corruption Commission clearance showing no integrity concerns under Section 22 of the Leadership and Integrity Act</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Clearance from Higher Education Loans Board (HELB):</strong> Confirmation of no outstanding student loan arrears (if applicable)</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Criminal Records Certificate:</strong> Certificate from Directorate of Criminal Investigations (DCI) or courts showing no disqualifying criminal convictions</span></li>
                    </ul>
                  </div>
                  
                  <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded-lg mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Additional Documents for Party-Sponsored Candidates</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" /><span><strong>Party Nomination Certificate:</strong> Official certificate from the political party confirming nomination after successful party primaries (issued under Section 24 of Elections Act and Section 37 of Political Parties Act)</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" /><span><strong>Party Membership Card:</strong> Proof of valid membership in the nominating political party</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" /><span><strong>Party Nomination Receipts:</strong> Proof of payment of party nomination fees (if required by the party)</span></li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-lg mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Additional Documents for Independent Candidates</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /><span><strong>Supporter Lists with Signatures:</strong> Lists containing names, ID numbers, signatures, and voter registration details of supporters (number varies by position—prescribed under Section 22 of Elections Act and Regulation 48)</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /><span><strong>Independent Candidate Declaration:</strong> Statutory declaration that you are not a member of any registered political party</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /><span><strong>Supporter Verification Forms:</strong> Official IEBC forms signed by each supporter confirming their voluntary support</span></li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Position-Specific Additional Documents</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" /><span><strong>Presidential Candidates:</strong> University degree certificate from a recognized institution (Article 137(3) of Constitution), deputy presidential nominee details and consent</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" /><span><strong>Gubernatorial Candidates:</strong> University degree certificate from a recognized institution (Article 180(2) of Constitution), deputy governor nominee details and consent</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" /><span><strong>All Candidates:</strong> Passport-size photographs (as specified by IEBC), proof of payment of nomination fees (receipt from IEBC)</span></li>
                    </ul>
                  </div>
                </div>
              </section>

              <section id="fees" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Coins className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Nomination Fees & Timelines</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Nomination fees are prescribed under <strong>Regulation 50 of the Elections (General) Regulations 2012</strong> and are payable to IEBC upon submission of nomination papers. Fees vary by elective position and are subject to periodic review. Political parties may also charge separate internal nomination fees under the <strong>Political Parties Act 2011</strong>.</p>
                  
                  <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
                        <tr>
                          <th className="px-6 py-4 text-left font-semibold">Position</th>
                          <th className="px-6 py-4 text-left font-semibold">IEBC Nomination Fees</th>
                          <th className="px-6 py-4 text-left font-semibold">Nomination Timelines</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">President</td>
                          <td className="px-6 py-4 text-gray-700">Fee set by IEBC regulations (check current IEBC fee schedule). Party fees vary by party.</td>
                          <td className="px-6 py-4 text-gray-700">Nomination window: 120-90 days before election. Submission deadline: 90 days before election.</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Governor</td>
                          <td className="px-6 py-4 text-gray-700">Fee set by IEBC regulations per county. Party fees apply for party candidates.</td>
                          <td className="px-6 py-4 text-gray-700">Nomination window set by IEBC, typically 90-60 days before election.</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Senator</td>
                          <td className="px-6 py-4 text-gray-700">Fee set by IEBC regulations per county. Check with political party for party fees.</td>
                          <td className="px-6 py-4 text-gray-700">Nomination window set by IEBC, typically 90-60 days before election.</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Member of Parliament (MP)</td>
                          <td className="px-6 py-4 text-gray-700">Fee set by IEBC regulations per constituency. Party fees vary by party.</td>
                          <td className="px-6 py-4 text-gray-700">Nomination window set by IEBC, typically 90-60 days before election.</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Woman Representative</td>
                          <td className="px-6 py-4 text-gray-700">Fee set by IEBC regulations per county. Party fees may apply.</td>
                          <td className="px-6 py-4 text-gray-700">Nomination window set by IEBC, typically 90-60 days before election.</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Member of County Assembly (MCA)</td>
                          <td className="px-6 py-4 text-gray-700">Fee set by IEBC regulations per ward. Party fees vary by party.</td>
                          <td className="px-6 py-4 text-gray-700">Nomination window set by IEBC, typically 90-60 days before election.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded-lg mb-6">
                    <p className="text-gray-900 font-semibold mb-3 flex items-center gap-2">
                      <Coins className="w-5 h-5 text-yellow-600" />
                      Fee Payment & Timeline Requirements
                    </p>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" /><span><strong>IEBC Fees:</strong> Payable to IEBC via bank deposit, M-Pesa, or other approved methods. Proof of payment (receipt) must accompany nomination papers.</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" /><span><strong>Party Nomination Fees:</strong> If running as a party candidate, check with your political party for internal nomination fees. These are separate from IEBC fees and governed by party rules under Section 35 of the Political Parties Act.</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" /><span><strong>Non-Refundable:</strong> Nomination fees are generally non-refundable, even if nomination is rejected or candidate withdraws.</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" /><span><strong>Payment Deadline:</strong> Fees must be paid before or at the time of submitting nomination papers. Late payment results in automatic rejection.</span></li>
                    </ul>
                  </div>
                  
                  <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded-lg">
                    <p className="text-gray-900 font-semibold mb-3 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-indigo-600" />
                      Critical Timeline Information
                    </p>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" /><span><strong>IEBC Election Calendar:</strong> IEBC publishes an official election calendar at least 12 months before each general election, specifying exact nomination windows under Section 9 of the IEBC Act.</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" /><span><strong>Party Primaries:</strong> Political parties must complete internal nominations at least 60-90 days before IEBC's final nomination deadline (Section 24 of Elections Act).</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" /><span><strong>No Extensions:</strong> IEBC nomination deadlines are strict. Late submissions are automatically rejected unless a court grants an extension.</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" /><span><strong>Check Official Sources:</strong> Always verify current fee schedules and timelines from the official IEBC website (<a href="/understanding-iebc-kenya" className="text-indigo-600 hover:text-indigo-700">Learn more about IEBC</a>) or IEBC county offices.</span></li>
                    </ul>
                  </div>
                </div>
              </section>

              <section id="mistakes" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Common Mistakes to Avoid</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Many candidate nominations are rejected due to avoidable errors. Understanding common mistakes can help ensure your nomination is accepted. These errors violate the strict procedural requirements of the <strong>Elections (General) Regulations 2012</strong> and the <strong>Elections Act 2011</strong>.</p>
                  
                  <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      Common Nomination Errors to Avoid
                    </h4>
                    <ul className="space-y-3 text-gray-700 text-sm">
                      <li className="flex gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold">Using Outdated or Incorrect Nomination Forms</span>
                          <p className="text-xs text-gray-600 mt-1">IEBC updates forms regularly. Using old versions or forms for the wrong position/candidate type leads to automatic rejection under Regulation 47. Always download the latest forms from <a href="/iebc-forms-downloads" className="text-indigo-600 hover:text-indigo-700">IEBC Forms Hub</a>.</p>
                        </div>
                      </li>
                      <li className="flex gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold">Missing Signatures or Statutory Declarations</span>
                          <p className="text-xs text-gray-600 mt-1">Nomination forms must be signed before a commissioner of oaths or authorized IEBC officer. Unsigned forms or missing declarations violate Section 13 of the Elections Act and are rejected immediately.</p>
                        </div>
                      </li>
                      <li className="flex gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold">Submitting Invalid or Incomplete Supporter Lists (Independent Candidates)</span>
                          <p className="text-xs text-gray-600 mt-1">Supporter lists under Section 22 and Regulation 48 must contain complete details (full names, ID numbers, signatures, voter registration numbers). Duplicate signatures, unregistered supporters, or signatures from wrong electoral areas invalidate the entire list.</p>
                        </div>
                      </li>
                      <li className="flex gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold">Late Submission After IEBC Deadlines</span>
                          <p className="text-xs text-gray-600 mt-1">IEBC nomination deadlines under the election calendar are absolute. Even one-minute late submissions are rejected. Courts rarely grant extensions except in exceptional circumstances.</p>
                        </div>
                      </li>
                      <li className="flex gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold">Failure to Pay Nomination Fees or Providing Wrong Payment Proof</span>
                          <p className="text-xs text-gray-600 mt-1">Regulation 50 requires payment of prescribed fees. Submitting incorrect receipt numbers, paying to wrong accounts, or paying less than required fees causes rejection.</p>
                        </div>
                      </li>
                      <li className="flex gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold">Missing Mandatory Clearance Certificates</span>
                          <p className="text-xs text-gray-600 mt-1">Integrity clearance under the Leadership and Integrity Act is mandatory. Missing tax compliance (KRA), EACC clearance, or criminal records certificates violates Chapter 6 of the Constitution and results in disqualification.</p>
                        </div>
                      </li>
                      <li className="flex gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold">Incorrect Electoral Area Information</span>
                          <p className="text-xs text-gray-600 mt-1">Specifying the wrong county, constituency, or ward, or not being a registered voter in that area, violates eligibility requirements under Articles 99, 137, 180, and 193 of the Constitution.</p>
                        </div>
                      </li>
                      <li className="flex gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold">Failing to Disclose Disqualifying Information</span>
                          <p className="text-xs text-gray-600 mt-1">Section 14 of the Elections Act disqualifies persons with certain criminal convictions, bankruptcy, or mental incapacity. Failure to disclose such information constitutes fraud and can lead to criminal charges under the Election Offences Act.</p>
                        </div>
                      </li>
                      <li className="flex gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold">Party Candidates Without Valid Party Nomination Certificates</span>
                          <p className="text-xs text-gray-600 mt-1">Party candidates under Section 24 must submit official party nomination certificates. Forged certificates, certificates from unregistered parties, or certificates issued contrary to party rules are rejected and may lead to criminal prosecution.</p>
                        </div>
                      </li>
                      <li className="flex gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold">Independent Candidates Who Are Party Members</span>
                          <p className="text-xs text-gray-600 mt-1">Independent candidates must not be registered members of any political party. IEBC verifies membership status with the Registrar of Political Parties. Party members running as independents are automatically disqualified.</p>
                        </div>
                      </li>
                      <li className="flex gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold">Missing Academic Qualifications (President and Governor)</span>
                          <p className="text-xs text-gray-600 mt-1">Articles 137(3) and 180(2) of the Constitution require presidential and gubernatorial candidates to hold university degrees. Failure to submit verified degree certificates from recognized institutions leads to disqualification. The Commission for University Education (CUE) verifies degrees.</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-lg">
                    <p className="text-gray-900 font-semibold mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      Best Practices to Ensure Successful Nomination
                    </p>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /><span><strong>Start Early:</strong> Begin gathering documents and clearances at least 3-6 months before nomination deadlines.</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /><span><strong>Use Checklists:</strong> Maintain a detailed checklist of all required documents and verify each one before submission.</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /><span><strong>Verify Forms:</strong> Always download the latest IEBC forms from official sources and confirm they match your position and candidate type.</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /><span><strong>Get Legal Assistance:</strong> Consider engaging an election lawyer to review your nomination papers before submission.</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /><span><strong>Submit Early:</strong> Don't wait until the last day. Submit at least 2-3 days before the deadline to allow time for corrections if needed.</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /><span><strong>Keep Copies:</strong> Retain certified copies of all submitted documents and payment receipts for dispute resolution purposes.</span></li>
                    </ul>
                  </div>
                </div>
              </section>

              <section id="after-nomination" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Megaphone className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">After Nomination – Campaign Rules</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">After IEBC approves your nomination under <strong>Regulation 52 of the Elections (General) Regulations 2012</strong>, you become an official candidate with the legal right to campaign. However, campaigning is strictly regulated under the <strong>Election Campaign Financing Act 2013</strong>, the <strong>Election Offences Act 2016</strong>, and IEBC's Code of Conduct for candidates.</p>
                  
                  <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Megaphone className="w-5 h-5 text-blue-600" />
                      Campaign Rules & Legal Requirements
                    </h4>
                    <ul className="space-y-3 text-gray-700 text-sm">
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold">Comply with IEBC Campaign Timelines</span>
                          <p className="text-xs text-gray-600 mt-1">IEBC sets official campaign start and end dates under Section 9 of the IEBC Act. Campaigning outside these dates is illegal and punishable under the Election Offences Act. Typically, campaigns run for 60-90 days before election day and must end 48 hours before polling day (campaign blackout period).</p>
                        </div>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold">Adhere to Code of Conduct</span>
                          <p className="text-xs text-gray-600 mt-1">All candidates must sign and comply with the IEBC Code of Conduct, which prohibits hate speech, ethnic incitement, violence, voter bribery, and defamation. Violations can lead to disqualification, fines, or criminal prosecution under Sections 3-12 of the Election Offences Act 2016.</p>
                        </div>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold">Respect Campaign Finance Laws</span>
                          <p className="text-xs text-gray-600 mt-1">The <strong>Election Campaign Financing Act 2013</strong> sets spending limits for each position. Presidential candidates have higher limits than county-level candidates. All campaign income and expenditure must be documented and reported to IEBC within the prescribed timelines (usually 30-60 days after elections). Exceeding limits or failing to file reports can result in disqualification and penalties.</p>
                        </div>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold">Avoid Hate Speech and Ethnic Incitement</span>
                          <p className="text-xs text-gray-600 mt-1">The <strong>National Cohesion and Integration Act 2008</strong> criminalizes hate speech, ethnic incitement, and divisive political rhetoric. Violations can lead to immediate arrest, criminal prosecution (up to 3 years imprisonment or fines up to KES 1 million), and automatic disqualification from office.</p>
                        </div>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold">No Voter Bribery or Undue Influence</span>
                          <p className="text-xs text-gray-600 mt-1">Sections 4-6 of the Election Offences Act 2016 prohibit offering money, gifts, jobs, or favors to voters in exchange for votes. Treating voters (e.g., buying meals, drinks) is also illegal. Convicted offenders face disqualification, fines, and imprisonment for up to 6 years.</p>
                        </div>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold">Equal Access to Public Media</span>
                          <p className="text-xs text-gray-600 mt-1">IEBC ensures equitable access to state-owned media (KBC, etc.) for all candidates under Article 81 of the Constitution. Private media coverage should be fair and balanced. Candidates can lodge complaints with the Media Council of Kenya or IEBC if coverage is biased.</p>
                        </div>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold">Restrictions on Use of State Resources</span>
                          <p className="text-xs text-gray-600 mt-1">Incumbent officeholders (sitting MPs, governors, etc.) are prohibited from using government vehicles, offices, staff, or resources for campaign activities under the Leadership and Integrity Act. Violations constitute abuse of office and can lead to removal from office and criminal charges.</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded-lg mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Campaign Finance Reporting Requirements</h4>
                    <p className="text-gray-700 text-sm mb-2">Under the <strong>Election Campaign Financing Act 2013</strong>, candidates must:</p>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" /><span>Open a dedicated campaign bank account and channel all campaign income/expenditure through it</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" /><span>Submit preliminary campaign finance reports during the campaign period (timelines set by IEBC)</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" /><span>Submit final audited campaign finance reports within 30-60 days after election day</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" /><span>Disclose sources of campaign funding (anonymous donations above certain thresholds are illegal)</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" /><span>Foreign funding for campaign activities is strictly prohibited</span></li>
                    </ul>
                  </div>
                  
                  <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Post-Nomination Responsibilities</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" /><span><strong>Attend IEBC Candidate Orientation:</strong> IEBC conducts orientation sessions for all candidates on electoral procedures, code of conduct, and legal obligations. Attendance is usually mandatory.</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" /><span><strong>Appoint Election Agents:</strong> Candidates may appoint agents to represent them at polling stations and tallying centers. Agent appointment forms must be submitted to IEBC.</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" /><span><strong>Monitor Voter Register Updates:</strong> Track any changes to the voter register and report anomalies to IEBC. See <a href="/how-to-check-voter-status-kenya" className="text-indigo-600 hover:text-indigo-700">How to Check Voter Status</a>.</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" /><span><strong>Report Election Offences:</strong> Candidates can report violations by opponents or third parties to IEBC, police, or the Director of Public Prosecutions. See <a href="/citizens-rights-duties-elections-kenya" className="text-indigo-600 hover:text-indigo-700">Citizens' Rights & Duties During Elections</a>.</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" /><span><strong>Prepare for Election Day:</strong> Understand polling procedures, result transmission, and tallying processes. Ensure agents are properly trained and accredited.</span></li>
                    </ul>
                  </div>
                </div>
              </section>

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
                        aria-expanded={openFaqIndex === index}
                        aria-controls={`faq-${index}`}
                      >
                        <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                        {openFaqIndex === index ? (
                          <ChevronUp className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-indigo-600 flex-shrink-0" />
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

              <section className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 text-white p-8 rounded-xl shadow-xl">
                <h3 className="text-2xl font-bold mb-4">Start Your Nomination Journey</h3>
                <p className="mb-6 text-blue-100">Download official forms, follow IEBC requirements, and understand party rules before filing.</p>
                <div className="flex flex-wrap gap-4">
                  <a href="/iebc-forms-downloads" className="bg-white text-indigo-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
                    Download Nomination Forms
                  </a>
                  <a href="/understanding-iebc-kenya" className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-400 transition">
                    Contact IEBC
                  </a>
                  <a href="/political-parties-registration-kenya" className="bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-600 transition">
                    Learn About Political Parties
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

export default BecomeCandidateKenya;
