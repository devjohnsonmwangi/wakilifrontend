import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  ChevronUp,
  BarChart3,
  Scale,
  AlertTriangle,
  Shield,
  Users,
  FileText,
  CheckCircle2,
  AlertCircle,
  Gavel,
  Ban,
  Phone,
  XCircle
} from 'lucide-react';

const faqs = [
  {
    question: 'What is an election offence in Kenya?',
    answer: 'An election offence is any illegal act committed during the electoral process, including voter bribery, violence, intimidation, ballot tampering, or violation of electoral laws as defined in the Election Offences Act 2016.'
  },
  {
    question: 'What is the penalty for voter bribery in Kenya?',
    answer: 'Under Section 4 of the Election Offences Act 2016, voter bribery is punishable by a fine not exceeding KES 2 million, imprisonment for up to 6 years, or both.'
  },
  {
    question: 'Is vote buying illegal in Kenya?',
    answer: 'Yes. Vote buying is a criminal offence under Section 4 of the Election Offences Act 2016 and can result in imprisonment for up to 6 years and/or fines up to KES 2 million.'
  },
  {
    question: 'What happens if you vote twice in Kenya?',
    answer: 'Double voting is a serious offence under Section 12 of the Election Offences Act 2016, punishable by imprisonment for up to 10 years and/or a fine not exceeding KES 5 million.'
  },
  {
    question: 'Is hate speech during campaigns illegal?',
    answer: 'Yes. Hate speech, ethnic incitement, and divisive political rhetoric are criminalized under the National Cohesion and Integration Act 2008 and can lead to imprisonment for up to 3 years or fines up to KES 1 million.'
  },
  {
    question: 'Can candidates be disqualified for election offences?',
    answer: 'Yes. Candidates convicted of election offences can be disqualified from holding public office for up to 10 years under the Leadership and Integrity Act.'
  },
  {
    question: 'Who can I report election offences to?',
    answer: 'You can report election offences to IEBC, the Kenya Police Service, the Director of Public Prosecutions (DPP), or file a complaint in court.'
  },
  {
    question: 'Is election violence a criminal offence?',
    answer: 'Yes. Election-related violence is a serious offence under Section 6 of the Election Offences Act 2016, punishable by imprisonment for up to 10 years.'
  },
  {
    question: 'What is ballot tampering?',
    answer: 'Ballot tampering includes destroying, altering, or interfering with ballot papers, ballot boxes, or election materials. It is punishable by up to 10 years imprisonment under Section 11 of the Election Offences Act.'
  },
  {
    question: 'Can voters be arrested for election offences?',
    answer: 'Yes. Voters who commit offences like double voting, voter impersonation, or accepting bribes can be arrested and prosecuted under the Election Offences Act 2016.'
  },
  {
    question: 'Is campaigning on election day illegal?',
    answer: 'Yes. The Elections Act prohibits all campaigning activities 48 hours before and during election day. Violations can lead to arrest and prosecution.'
  },
  {
    question: 'What is the penalty for impersonating a voter?',
    answer: 'Voter impersonation is punishable by imprisonment for up to 10 years and/or a fine not exceeding KES 5 million under Section 12 of the Election Offences Act.'
  },
  {
    question: 'Can election results be nullified due to offences?',
    answer: 'Yes. Courts can nullify election results if proven that widespread election offences materially affected the outcome, as per Supreme Court precedents.'
  },
  {
    question: 'Is misuse of government resources during campaigns illegal?',
    answer: 'Yes. Misuse of state resources for campaign purposes violates the Leadership and Integrity Act and Election Offences Act, leading to disqualification and criminal prosecution.'
  },
  {
    question: 'How long can you be jailed for election crimes in Kenya?',
    answer: 'Depending on the offence, imprisonment can range from 1 year for minor offences to 10 years for serious crimes like violence, double voting, and ballot tampering.'
  }
];

const ElectionOffencesKenya: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<string>('overview');

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  useEffect(() => {
    const metaTitle = 'Election Offences & Penalties Kenya – Legal Guide';
    const metaDescription = 'Complete legal guide to election offences and penalties in Kenya. Learn what is illegal during elections, punishments, and how to report violations.';
    const canonicalUrl = 'https://wakili.co.ke/election-offences-penalties-kenya';

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
              "name": "Election Offences & Penalties Kenya",
              "item": "https://wakili.co.ke/election-offences-penalties-kenya"
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
          "@type": "LegalService",
          "name": "Election Offences Legal Information Kenya",
          "description": "Comprehensive legal guide to election offences, crimes, penalties, and reporting procedures in Kenya",
          "areaServed": "Kenya",
          "url": "https://wakili.co.ke/election-offences-penalties-kenya"
        },
        {
          "@type": "GovernmentService",
          "name": "Election Offences Reporting and Legal Framework",
          "serviceType": "Legal information on election offences and penalties",
          "areaServed": "Kenya",
          "url": "https://wakili.co.ke/election-offences-penalties-kenya"
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
        'what-counts',
        'common-offences',
        'penalties',
        'candidate-responsibilities',
        'voter-responsibilities',
        'reporting',
        'examples',
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
              <span className="text-gray-900">Election Offences & Penalties</span>
            </nav>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Election Offences & Penalties in Kenya – Legal Guide</h1>
            <p className="text-lg sm:text-xl text-orange-100 max-w-3xl">Comprehensive legal reference on electoral crimes, violations, penalties, and reporting procedures under Kenyan law.</p>
          </div>
        </div>

        <div className="content-full-width">
        <div className="max-w-7xl mx-auto px-0 sm:px-4 md:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 flex-shrink-0">
              <div className="lg:sticky lg:top-20">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-red-600" />
                    Quick Navigation
                  </h3>
                  <nav className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 lg:block lg:space-y-2 lg:gap-0 lg:overflow-visible lg:pb-0 lg:mx-0 lg:px-0">
                    {[
                      { id: 'overview', label: 'Overview', icon: BarChart3 },
                      { id: 'legal-framework', label: 'Legal Framework', icon: Scale },
                      { id: 'what-counts', label: 'What Counts', icon: AlertTriangle },
                      { id: 'common-offences', label: 'Common Offences', icon: Ban },
                      { id: 'penalties', label: 'Penalties & Punishments', icon: Gavel },
                      { id: 'candidate-responsibilities', label: 'Candidate Duties', icon: Users },
                      { id: 'voter-responsibilities', label: 'Voter Duties', icon: Shield },
                      { id: 'reporting', label: 'How to Report', icon: Phone },
                      { id: 'examples', label: 'Examples', icon: FileText },
                      { id: 'faqs', label: 'FAQs', icon: BarChart3 }
                    ].map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => scrollToSection(id)}
                        className={`flex-shrink-0 lg:w-full text-left px-3 py-2 rounded transition flex items-center gap-2 whitespace-nowrap ${
                          activeSection === id
                            ? 'bg-red-100 text-red-700 font-medium'
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
                  <BarChart3 className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Overview of Election Laws in Kenya</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-4 text-lg leading-relaxed">Kenya's electoral system is governed by strict laws designed to ensure free, fair, transparent, and credible elections as mandated by <strong>Article 81 of the Constitution of Kenya 2010</strong>. The <strong>Election Offences Act 2016</strong> consolidates and criminalizes various forms of electoral malpractice, ranging from voter bribery and violence to ballot tampering and impersonation. Violations of these laws carry severe penalties including imprisonment, fines, disqualification from public office, and potential nullification of election results.</p>
                  
                  <p className="text-gray-700 mb-4">The legal framework is designed to protect the integrity of the electoral process and safeguard citizens' constitutional rights under <strong>Article 38</strong> (right to free, fair elections) and <strong>Article 27</strong> (equality and non-discrimination). The <strong>Independent Electoral and Boundaries Commission (IEBC)</strong>, established under Article 88, works with law enforcement agencies—including the Kenya Police Service and the Director of Public Prosecutions (DPP)—to detect, investigate, and prosecute election offences.</p>
                  
                  <p className="text-gray-700 mb-6">Understanding what constitutes an election offence is critical for candidates, voters, political parties, election officials, and the general public. This guide provides a comprehensive legal reference on election crimes, penalties, reporting mechanisms, and responsibilities under Kenyan law. For related information, see <a href="/citizens-rights-duties-elections-kenya" className="text-red-600 hover:text-red-700 font-medium">Citizens' Rights & Duties During Elections</a> and <a href="/understanding-iebc-kenya" className="text-red-600 hover:text-red-700 font-medium">Understanding IEBC Kenya</a>.</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                      <div className="text-3xl font-bold text-red-700 mb-2">Criminal</div>
                      <div className="text-gray-900 font-semibold mb-1">Serious Crimes</div>
                      <div className="text-sm text-gray-600">Election offences are criminal acts prosecuted by the state</div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                      <div className="text-3xl font-bold text-orange-700 mb-2">Penalties</div>
                      <div className="text-gray-900 font-semibold mb-1">Severe Consequences</div>
                      <div className="text-sm text-gray-600">Fines, imprisonment, and disqualification</div>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-red-50 border-2 border-amber-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                      <div className="text-3xl font-bold text-amber-700 mb-2">Reporting</div>
                      <div className="text-gray-900 font-semibold mb-1">Legal Duty</div>
                      <div className="text-sm text-gray-600">Citizens can and should report violations</div>
                    </div>
                  </div>
                </div>
              </section>

              <section id="legal-framework" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Scale className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Legal Framework</h2>
                </div>

                <div className="prose max-w-none">
                  <div className="bg-white border-2 border-red-200 p-6 rounded-xl shadow-sm mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Key laws governing election offences in Kenya</h3>
                    <div className="space-y-4 text-sm text-gray-700">
                      <div className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold">Constitution of Kenya 2010:</span>
                          <ul className="ml-4 mt-1 space-y-1 list-disc">
                            <li><strong>Article 38:</strong> Guarantees every citizen the right to free, fair, and regular elections</li>
                            <li><strong>Article 81:</strong> Establishes general principles of the electoral system (transparency, accountability, no violence)</li>
                            <li><strong>Article 27:</strong> Equality and freedom from discrimination in elections</li>
                            <li><strong>Article 88:</strong> Establishes IEBC with mandate to ensure electoral integrity</li>
                          </ul>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold">Election Offences Act 2016:</span>
                          <ul className="ml-4 mt-1 space-y-1 list-disc">
                            <li><strong>Section 3:</strong> Undue influence and intimidation of voters (up to 6 years imprisonment)</li>
                            <li><strong>Section 4:</strong> Bribery and treating voters (up to 6 years and/or KES 2 million fine)</li>
                            <li><strong>Section 5:</strong> Personation and impersonation (up to 10 years imprisonment)</li>
                            <li><strong>Section 6:</strong> Electoral violence and destruction of property (up to 10 years)</li>
                            <li><strong>Section 7:</strong> Offences by electoral officials (up to 10 years)</li>
                            <li><strong>Section 11:</strong> Unlawful possession or destruction of election materials (up to 10 years)</li>
                            <li><strong>Section 12:</strong> Offences relating to ballot papers and voting (up to 10 years)</li>
                          </ul>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold">Elections Act 2011:</span>
                          <ul className="ml-4 mt-1 space-y-1 list-disc">
                            <li><strong>Section 82:</strong> Offences by candidates and agents</li>
                            <li><strong>Section 83:</strong> Campaign finance violations</li>
                            <li><strong>Section 86:</strong> General election offences and penalties</li>
                          </ul>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold">National Cohesion and Integration Act 2008:</span>
                          <ul className="ml-4 mt-1 space-y-1 list-disc">
                            <li><strong>Section 13:</strong> Hate speech, ethnic incitement, and divisive political rhetoric (up to 3 years or KES 1 million fine)</li>
                            <li><strong>Section 62:</strong> Use of threatening, abusive, or insulting language</li>
                          </ul>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold">Penal Code (Cap 63):</span>
                          <ul className="ml-4 mt-1 space-y-1 list-disc">
                            <li><strong>Section 108:</strong> Offences against lawful authority (elections included)</li>
                            <li><strong>Sections 203-204:</strong> Assault and violence during elections</li>
                          </ul>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold">Leadership and Integrity Act 2012:</span>
                          <ul className="ml-4 mt-1 space-y-1 list-disc">
                            <li><strong>Chapter 6 Compliance:</strong> Candidates and officials convicted of election offences are disqualified from holding public office for up to 10 years</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg">
                    <p className="text-gray-900 font-semibold mb-2">Why these laws matter</p>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" /><span><strong>Protect Electoral Integrity:</strong> Prevent fraud, corruption, and manipulation of election outcomes</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" /><span><strong>Safeguard Voter Rights:</strong> Ensure voters can freely exercise their constitutional right to vote without coercion or intimidation</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" /><span><strong>Deter Misconduct:</strong> Severe penalties discourage candidates, officials, and voters from engaging in illegal activities</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" /><span><strong>Ensure Accountability:</strong> Provide legal mechanisms to prosecute offenders and nullify tainted elections</span></li>
                    </ul>
                  </div>
                </div>
              </section>

              <section id="what-counts" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What Counts as an Election Offence</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Under the <strong>Election Offences Act 2016</strong> and related laws, an election offence includes any conduct that undermines the electoral process, whether committed before, during, or after elections. Offences can be committed by candidates, voters, election officials, political party agents, media houses, or any person involved in the electoral process.</p>
                  
                  <div className="bg-orange-50 border-l-4 border-orange-600 p-6 rounded-lg mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Categories of Election Offences</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2"><XCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" /><span><strong>Corrupt Practices:</strong> Bribery, treating, undue influence, personation, and vote buying</span></li>
                      <li className="flex gap-2"><XCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" /><span><strong>Electoral Violence:</strong> Physical assault, intimidation, destruction of property, and threats against voters or officials</span></li>
                      <li className="flex gap-2"><XCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" /><span><strong>Ballot Offences:</strong> Tampering with ballots, ballot stuffing, unauthorized possession of election materials, and result manipulation</span></li>
                      <li className="flex gap-2"><XCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" /><span><strong>Illegal Campaigning:</strong> Campaigning outside permitted periods, misuse of state resources, exceeding campaign finance limits, and hate speech</span></li>
                      <li className="flex gap-2"><XCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" /><span><strong>Official Misconduct:</strong> Electoral officers who rig votes, refuse to allow eligible voters, or falsify results</span></li>
                    </ul>
                  </div>
                </div>
              </section>

              <section id="common-offences" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Ban className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Common Election Offences in Kenya</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Below are the most frequently committed election offences in Kenya, with detailed legal explanations and examples.</p>
                  
                  <div className="space-y-6">
                    <div className="bg-white border-l-4 border-red-600 p-6 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-600" />
                        1. Voter Bribery and Vote Buying
                      </h4>
                      <p className="text-gray-700 text-sm mb-3"><strong>Legal Provision:</strong> Section 4 of the Election Offences Act 2016</p>
                      <p className="text-gray-700 text-sm mb-2">Offering, giving, or promising money, gifts, jobs, services, or any other inducement to voters in exchange for voting (or not voting) for a particular candidate or party.</p>
                      <p className="text-gray-700 text-sm mb-2"><strong>Examples:</strong></p>
                      <ul className="text-xs text-gray-600 space-y-1 ml-4 list-disc">
                        <li>Giving cash handouts during campaign rallies with the expectation of votes</li>
                        <li>Promising jobs, bursaries, or business opportunities in exchange for votes</li>
                        <li>Distributing food, clothing, or household items to voters before elections</li>
                      </ul>
                      <p className="text-red-700 text-sm font-semibold mt-2">Penalty: Up to 6 years imprisonment and/or fine not exceeding KES 2 million</p>
                    </div>

                    <div className="bg-white border-l-4 border-red-600 p-6 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-600" />
                        2. Treating Voters
                      </h4>
                      <p className="text-gray-700 text-sm mb-3"><strong>Legal Provision:</strong> Section 4 of the Election Offences Act 2016</p>
                      <p className="text-gray-700 text-sm mb-2">Providing food, drinks, entertainment, or transportation to voters to influence their voting decisions.</p>
                      <p className="text-gray-700 text-sm mb-2"><strong>Examples:</strong></p>
                      <ul className="text-xs text-gray-600 space-y-1 ml-4 list-disc">
                        <li>Organizing free meals, drinks, or entertainment events for voters during campaigns</li>
                        <li>Providing free transport to rallies or polling stations with expectation of votes</li>
                      </ul>
                      <p className="text-red-700 text-sm font-semibold mt-2">Penalty: Up to 6 years imprisonment and/or fine not exceeding KES 2 million</p>
                    </div>

                    <div className="bg-white border-l-4 border-red-600 p-6 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-600" />
                        3. Electoral Violence and Intimidation
                      </h4>
                      <p className="text-gray-700 text-sm mb-3"><strong>Legal Provision:</strong> Section 6 of the Election Offences Act 2016</p>
                      <p className="text-gray-700 text-sm mb-2">Using force, violence, threats, or intimidation to prevent voters from voting, force voters to vote in a certain way, or disrupt the electoral process.</p>
                      <p className="text-gray-700 text-sm mb-2"><strong>Examples:</strong></p>
                      <ul className="text-xs text-gray-600 space-y-1 ml-4 list-disc">
                        <li>Physically assaulting voters at polling stations</li>
                        <li>Threatening voters with violence if they vote for certain candidates</li>
                        <li>Destroying polling stations or election materials</li>
                        <li>Preventing voters from accessing polling stations through roadblocks or intimidation</li>
                      </ul>
                      <p className="text-red-700 text-sm font-semibold mt-2">Penalty: Up to 10 years imprisonment</p>
                    </div>

                    <div className="bg-white border-l-4 border-red-600 p-6 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-600" />
                        4. Double Voting and Multiple Registration
                      </h4>
                      <p className="text-gray-700 text-sm mb-3"><strong>Legal Provision:</strong> Section 12 of the Election Offences Act 2016</p>
                      <p className="text-gray-700 text-sm mb-2">Voting more than once in the same election or registering as a voter in multiple constituencies.</p>
                      <p className="text-gray-700 text-sm mb-2"><strong>Examples:</strong></p>
                      <ul className="text-xs text-gray-600 space-y-1 ml-4 list-disc">
                        <li>Voting in one polling station and then voting again at another</li>
                        <li>Registering in multiple electoral areas to vote multiple times</li>
                      </ul>
                      <p className="text-red-700 text-sm font-semibold mt-2">Penalty: Up to 10 years imprisonment and/or fine not exceeding KES 5 million</p>
                    </div>

                    <div className="bg-white border-l-4 border-red-600 p-6 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-600" />
                        5. Voter Impersonation and Personation
                      </h4>
                      <p className="text-gray-700 text-sm mb-3"><strong>Legal Provision:</strong> Section 5 of the Election Offences Act 2016</p>
                      <p className="text-gray-700 text-sm mb-2">Voting while pretending to be another registered voter or allowing someone else to vote using your identity.</p>
                      <p className="text-gray-700 text-sm mb-2"><strong>Examples:</strong></p>
                      <ul className="text-xs text-gray-600 space-y-1 ml-4 list-disc">
                        <li>Using another person's ID to vote</li>
                        <li>Voting on behalf of a deceased or absent voter</li>
                      </ul>
                      <p className="text-red-700 text-sm font-semibold mt-2">Penalty: Up to 10 years imprisonment and/or fine not exceeding KES 5 million</p>
                    </div>

                    <div className="bg-white border-l-4 border-red-600 p-6 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-600" />
                        6. Ballot Tampering and Stuffing
                      </h4>
                      <p className="text-gray-700 text-sm mb-3"><strong>Legal Provision:</strong> Section 11 of the Election Offences Act 2016</p>
                      <p className="text-gray-700 text-sm mb-2">Destroying, altering, or interfering with ballot papers, ballot boxes, or election materials; or inserting fraudulent ballots into ballot boxes.</p>
                      <p className="text-gray-700 text-sm mb-2"><strong>Examples:</strong></p>
                      <ul className="text-xs text-gray-600 space-y-1 ml-4 list-disc">
                        <li>Adding pre-marked ballots to ballot boxes (ballot stuffing)</li>
                        <li>Destroying ballots marked for certain candidates</li>
                        <li>Tampering with election results forms (Form 34A, 34B, 34C)</li>
                      </ul>
                      <p className="text-red-700 text-sm font-semibold mt-2">Penalty: Up to 10 years imprisonment</p>
                    </div>

                    <div className="bg-white border-l-4 border-red-600 p-6 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-600" />
                        7. Hate Speech and Ethnic Incitement
                      </h4>
                      <p className="text-gray-700 text-sm mb-3"><strong>Legal Provision:</strong> Section 13 of the National Cohesion and Integration Act 2008</p>
                      <p className="text-gray-700 text-sm mb-2">Using threatening, abusive, or insulting language that incites ethnic hatred, violence, or discrimination during campaigns.</p>
                      <p className="text-gray-700 text-sm mb-2"><strong>Examples:</strong></p>
                      <ul className="text-xs text-gray-600 space-y-1 ml-4 list-disc">
                        <li>Making statements that incite one ethnic group against another</li>
                        <li>Using derogatory language based on ethnicity, race, or religion</li>
                        <li>Publishing inflammatory content on social media targeting specific communities</li>
                      </ul>
                      <p className="text-red-700 text-sm font-semibold mt-2">Penalty: Up to 3 years imprisonment or fine up to KES 1 million, or both</p>
                    </div>

                    <div className="bg-white border-l-4 border-red-600 p-6 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-600" />
                        8. Illegal Campaigning
                      </h4>
                      <p className="text-gray-700 text-sm mb-3"><strong>Legal Provision:</strong> Elections Act 2011 and IEBC Regulations</p>
                      <p className="text-gray-700 text-sm mb-2">Campaigning outside IEBC-designated periods, including the 48-hour blackout period before election day.</p>
                      <p className="text-gray-700 text-sm mb-2"><strong>Examples:</strong></p>
                      <ul className="text-xs text-gray-600 space-y-1 ml-4 list-disc">
                        <li>Holding rallies or distributing campaign materials during the blackout period</li>
                        <li>Campaigning on election day at polling stations</li>
                      </ul>
                      <p className="text-red-700 text-sm font-semibold mt-2">Penalty: Arrest, prosecution, and potential disqualification</p>
                    </div>

                    <div className="bg-white border-l-4 border-red-600 p-6 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-600" />
                        9. Misuse of State Resources
                      </h4>
                      <p className="text-gray-700 text-sm mb-3"><strong>Legal Provision:</strong> Leadership and Integrity Act 2012 and Election Offences Act 2016</p>
                      <p className="text-gray-700 text-sm mb-2">Incumbent government officials using public resources (vehicles, staff, funds) for campaign activities.</p>
                      <p className="text-gray-700 text-sm mb-2"><strong>Examples:</strong></p>
                      <ul className="text-xs text-gray-600 space-y-1 ml-4 list-disc">
                        <li>Using government vehicles for campaign rallies</li>
                        <li>Deploying public servants to campaign during working hours</li>
                        <li>Using public funds to finance campaign activities</li>
                      </ul>
                      <p className="text-red-700 text-sm font-semibold mt-2">Penalty: Disqualification, criminal prosecution, and potential imprisonment</p>
                    </div>
                  </div>
                </div>
              </section>

              <section id="penalties" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Gavel className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Penalties & Punishments</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Kenya's election laws prescribe severe penalties to deter and punish election offences. Penalties vary depending on the gravity of the offence and can include imprisonment, fines, disqualification from public office, and nullification of election results.</p>
                  
                  <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
                        <tr>
                          <th className="px-6 py-4 text-left font-semibold">Offence</th>
                          <th className="px-6 py-4 text-left font-semibold">Imprisonment</th>
                          <th className="px-6 py-4 text-left font-semibold">Fine</th>
                          <th className="px-6 py-4 text-left font-semibold">Other Penalties</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Voter Bribery</td>
                          <td className="px-6 py-4 text-gray-700">Up to 6 years</td>
                          <td className="px-6 py-4 text-gray-700">Up to KES 2 million</td>
                          <td className="px-6 py-4 text-gray-700">Disqualification from office</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Electoral Violence</td>
                          <td className="px-6 py-4 text-gray-700">Up to 10 years</td>
                          <td className="px-6 py-4 text-gray-700">—</td>
                          <td className="px-6 py-4 text-gray-700">Disqualification, permanent record</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Double Voting</td>
                          <td className="px-6 py-4 text-gray-700">Up to 10 years</td>
                          <td className="px-6 py-4 text-gray-700">Up to KES 5 million</td>
                          <td className="px-6 py-4 text-gray-700">Loss of voting rights</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Voter Impersonation</td>
                          <td className="px-6 py-4 text-gray-700">Up to 10 years</td>
                          <td className="px-6 py-4 text-gray-700">Up to KES 5 million</td>
                          <td className="px-6 py-4 text-gray-700">Criminal record</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Ballot Tampering</td>
                          <td className="px-6 py-4 text-gray-700">Up to 10 years</td>
                          <td className="px-6 py-4 text-gray-700">—</td>
                          <td className="px-6 py-4 text-gray-700">Result nullification possible</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Hate Speech</td>
                          <td className="px-6 py-4 text-gray-700">Up to 3 years</td>
                          <td className="px-6 py-4 text-gray-700">Up to KES 1 million</td>
                          <td className="px-6 py-4 text-gray-700">Disqualification from office</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Official Misconduct</td>
                          <td className="px-6 py-4 text-gray-700">Up to 10 years</td>
                          <td className="px-6 py-4 text-gray-700">—</td>
                          <td className="px-6 py-4 text-gray-700">Dismissal from service</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded-lg mb-6">
                    <p className="text-gray-900 font-semibold mb-3 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      Additional Consequences
                    </p>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2"><XCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" /><span><strong>Disqualification from Public Office:</strong> Convicted offenders cannot hold public office for up to 10 years under the Leadership and Integrity Act</span></li>
                      <li className="flex gap-2"><XCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" /><span><strong>Loss of Voting Rights:</strong> Persons serving sentences exceeding 6 months lose the right to vote during incarceration</span></li>
                      <li className="flex gap-2"><XCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" /><span><strong>Permanent Criminal Record:</strong> Convictions are recorded and can affect future employment and travel</span></li>
                      <li className="flex gap-2"><XCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" /><span><strong>Nullification of Election Results:</strong> Courts can annul elections if widespread offences materially affected the outcome</span></li>
                    </ul>
                  </div>
                </div>
              </section>

              <section id="candidate-responsibilities" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Users className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Responsibilities of Candidates & Political Parties</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Candidates and political parties have legal obligations to conduct campaigns lawfully and ensure their supporters and agents comply with electoral laws. Failure to do so can result in disqualification and criminal liability.</p>
                  
                  <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg">
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Comply with IEBC Code of Conduct:</strong> Sign and adhere to all provisions of the electoral code of conduct</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Prevent Bribery and Violence:</strong> Ensure campaign teams do not engage in voter bribery, treating, or violence</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Report Campaign Finance:</strong> Submit accurate campaign income and expenditure reports to IEBC within prescribed timelines</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Avoid Hate Speech:</strong> Refrain from ethnic incitement, divisive rhetoric, or inflammatory statements</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Respect Campaign Timelines:</strong> Stop all campaign activities during the 48-hour blackout period before elections</span></li>
                    </ul>
                  </div>
                </div>
              </section>

              <section id="voter-responsibilities" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Shield className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Responsibilities of Voters</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Voters have both rights and responsibilities during elections. While you have the constitutional right to vote freely, you must also comply with electoral laws to protect the integrity of the process.</p>
                  
                  <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Legal Duties of Voters</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /><span><strong>Vote Only Once:</strong> Do not attempt to vote more than once or in multiple constituencies</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /><span><strong>Vote in Your Own Name:</strong> Never impersonate another voter or allow someone to vote using your identity</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /><span><strong>Refuse Bribes:</strong> Do not accept money, gifts, or favors in exchange for your vote</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /><span><strong>Maintain Secrecy:</strong> Keep your vote secret and do not allow anyone to coerce you into revealing your choice</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /><span><strong>Report Offences:</strong> Report any witnessed election crimes to IEBC or police</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /><span><strong>Avoid Violence:</strong> Do not engage in violence, intimidation, or disruption at polling stations</span></li>
                    </ul>
                  </div>
                  
                  <p className="text-gray-700 mt-6">For more on voter rights, see <a href="/citizens-rights-duties-elections-kenya" className="text-red-600 hover:text-red-700 font-medium">Citizens' Rights & Duties During Elections</a>.</p>
                </div>
              </section>

              <section id="reporting" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Phone className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How to Report Election Offences</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Citizens, candidates, election observers, and officials have a legal duty to report suspected election offences. Multiple reporting channels exist to ensure accountability.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white border-2 border-red-200 p-6 rounded-xl shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Phone className="w-5 h-5 text-red-600" />
                        Report to IEBC
                      </h4>
                      <ul className="text-sm text-gray-700 space-y-2">
                        <li><strong>IEBC Hotline:</strong> 0709 010 000</li>
                        <li><strong>Email:</strong> complaints@iebc.or.ke</li>
                        <li><strong>County Offices:</strong> Visit nearest IEBC office</li>
                        <li><strong>Online Portal:</strong> File complaints via IEBC website</li>
                      </ul>
                    </div>
                    
                    <div className="bg-white border-2 border-red-200 p-6 rounded-xl shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Phone className="w-5 h-5 text-red-600" />
                        Report to Police
                      </h4>
                      <ul className="text-sm text-gray-700 space-y-2">
                        <li><strong>Police Hotline:</strong> 999 or 112</li>
                        <li><strong>SMS:</strong> 22456</li>
                        <li><strong>Visit:</strong> Nearest police station</li>
                        <li><strong>DCI:</strong> Directorate of Criminal Investigations</li>
                      </ul>
                    </div>
                    
                    <div className="bg-white border-2 border-red-200 p-6 rounded-xl shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Phone className="w-5 h-5 text-red-600" />
                        Court Petitions
                      </h4>
                      <ul className="text-sm text-gray-700 space-y-2">
                        <li><strong>High Court:</strong> File election petitions</li>
                        <li><strong>Magistrate Courts:</strong> Criminal complaints</li>
                        <li><strong>DPP:</strong> Director of Public Prosecutions</li>
                        <li><strong>Legal Aid:</strong> Seek free legal assistance</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">What to Include in Your Report</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" /><span><strong>Date, Time, and Location:</strong> Specify when and where the offence occurred</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" /><span><strong>Description of Offence:</strong> Clearly explain what happened</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" /><span><strong>Suspects/Witnesses:</strong> Provide names or descriptions of those involved</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" /><span><strong>Evidence:</strong> Attach photos, videos, documents, or other proof if available</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" /><span><strong>Your Contact Information:</strong> Allow follow-up for investigation</span></li>
                    </ul>
                  </div>
                </div>
              </section>

              <section id="examples" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Educational Examples of Election Offences</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Understanding real-world scenarios helps citizens recognize and avoid election offences. Below are educational summaries (not specific cases) illustrating different types of violations.</p>
                  
                  <div className="space-y-4">
                    <div className="bg-red-50 border-l-4 border-red-600 p-5 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Scenario 1: Vote Buying</h4>
                      <p className="text-gray-700 text-sm">A candidate distributes cash envelopes to voters at a campaign rally, asking them to vote for their party. This constitutes voter bribery under Section 4 of the Election Offences Act and is punishable by up to 6 years imprisonment.</p>
                    </div>
                    
                    <div className="bg-red-50 border-l-4 border-red-600 p-5 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Scenario 2: Electoral Violence</h4>
                      <p className="text-gray-700 text-sm">Supporters of opposing candidates engage in physical confrontations at a polling station, preventing voters from casting ballots. This is electoral violence under Section 6, punishable by up to 10 years imprisonment.</p>
                    </div>
                    
                    <div className="bg-red-50 border-l-4 border-red-600 p-5 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Scenario 3: Ballot Tampering</h4>
                      <p className="text-gray-700 text-sm">An election official is caught adding pre-marked ballots to a ballot box before counting begins. This is ballot tampering under Section 11, punishable by up to 10 years imprisonment and dismissal from service.</p>
                    </div>
                    
                    <div className="bg-red-50 border-l-4 border-red-600 p-5 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Scenario 4: Hate Speech</h4>
                      <p className="text-gray-700 text-sm">A candidate makes inflammatory remarks at a rally inciting one ethnic group against another. This violates Section 13 of the National Cohesion and Integration Act and can result in 3 years imprisonment or a KES 1 million fine.</p>
                    </div>
                  </div>
                </div>
              </section>

              <section id="faqs" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <BarChart3 className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
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
                          <ChevronUp className="w-5 h-5 text-red-600 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-red-600 flex-shrink-0" />
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

              <section className="bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 text-white p-8 rounded-xl shadow-xl">
                <h3 className="text-2xl font-bold mb-4">Protect Electoral Integrity – Report Violations</h3>
                <p className="mb-6 text-orange-100">If you witness or experience election offences, report immediately to the appropriate authorities.</p>
                <div className="flex flex-wrap gap-4">
                  <a href="/understanding-iebc-kenya" className="bg-white text-red-700 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition">
                    Contact IEBC
                  </a>
                  <a href="/citizens-rights-duties-elections-kenya" className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-400 transition">
                    Know Your Rights
                  </a>
                  <a href="/election-petitions-disputes-kenya" className="bg-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition">
                    File a Petition
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

export default ElectionOffencesKenya;
