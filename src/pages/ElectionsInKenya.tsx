import { useState, useEffect } from 'react';
import { ChevronDown, CheckCircle, ArrowRight, FileText, Users, MessageSquare, BarChart3, AlertCircle } from 'lucide-react';

// FAQ Data - Constant at file level to avoid React Hook dependency warnings
const faqsData = [
  {
    id: 1,
    question: 'How often are general elections held in Kenya?',
    answer: 'General elections are held every 5 years in Kenya. This includes presidential, parliamentary, and county elections conducted simultaneously. The most recent general elections were held in August 2022. The next general elections are scheduled for August 2027. Special elections may be held in between for by-elections or specific races.'
  },
  {
    id: 2,
    question: 'What is the difference between a general election and a by-election?',
    answer: 'A general election is conducted nationwide for all presidential, parliamentary, and county positions simultaneously, held every 5 years. A by-election is a special election held to fill a single vacancy (e.g., when a legislator resigns or passes away) in a specific constituency or county. By-elections can occur at any time outside the general election schedule.'
  },
  {
    id: 3,
    question: 'Can I vote in multiple elections on the same day?',
    answer: 'Yes. During general elections, Kenyan voters typically vote for multiple candidates on the same day: President, Member of Parliament (MP), Senator, County Governor, County Representative (MCA), and possibly referendum questions. All voting is done at the same polling station using separate ballot papers for each race.'
  },
  {
    id: 4,
    question: 'What disqualifies a person from running for elected office?',
    answer: 'According to Kenyan law, a person cannot run for elected office if they: (1) are not a Kenyan citizen, (2) are not a registered voter, (3) are convicted of crime involving dishonesty (disqualification may be permanent), (4) are sentenced to imprisonment for 6+ months, (5) are of unsound mind (as declared by court), (6) failed to pay taxes in previous years (for some positions), (7) have unresolved conflicts of interest, or (8) are disqualified under electoral law.'
  },
  {
    id: 5,
    question: 'How are constituencies and wards determined?',
    answer: 'Constituencies are determined by the IEBC through boundary delimitation, which redistributes electoral boundaries based on population census data (every 10 years). Wards are determined similarly at the county level. Boundary delimitation aims to ensure equal representation. If you believe your residence is in the wrong constituency or ward, you can lodge a complaint to IEBC during the delimitation process.'
  },
  {
    id: 6,
    question: 'What happens if no candidate gets the required votes to win?',
    answer: 'For presidential elections, a candidate must win the presidency with 50% + 1 of all valid votes cast. If no candidate achieves this threshold, a run-off election is held between the top two candidates within 60 days. The candidate who receives the most votes in the run-off is declared president. For parliamentary and county seats, the candidate with the most votes wins (simple majority).'
  },
  {
    id: 7,
    question: 'Who observes elections and ensures they are fair?',
    answer: 'Multiple groups observe Kenyan elections to ensure they are free and fair: (1) International observers from the African Union, Commonwealth, UN, and international organizations, (2) Domestic observers accredited by IEBC, (3) Civil society organizations and election monitoring groups, (4) Political party agents at each polling station, (5) Election officials and security personnel. These observers monitor compliance with electoral rules and report violations.'
  },
  {
    id: 8,
    question: 'What security measures are in place on election day?',
    answer: 'IEBC coordinates with security agencies to ensure election security: (1) Police and security personnel are deployed at polling stations, (2) Polling stations are secured with transparent containers for ballot boxes, (3) Election materials are sealed and secured, (4) Electronic transmission of results is encrypted, (5) Backup paper records are maintained, (6) Voter verification systems detect fraud attempts, (7) Security forces monitor for violence or irregularities, (8) Strict rules govern who can enter polling stations.'
  },
  {
    id: 9,
    question: 'How can I monitor or observe elections?',
    answer: 'You can monitor elections as a citizen observer: (1) Register with IEBC as a domestic observer during the application period, (2) Provide your personal details and background information, (3) IEBC will accredit you and issue an observer certificate, (4) Attend training provided by IEBC on election procedures and observer conduct, (5) You can then observe polling stations on election day. You must follow observer rules and maintain neutrality.'
  },
  {
    id: 10,
    question: 'What happens if election results are disputed?',
    answer: 'If candidates or voters believe election results are incorrect, they can lodge complaints: (1) First, they lodge complaints to IEBC\'s Election Dispute Resolution Committees (EDRCs), (2) If unsatisfied, they can petition the Election Court, (3) The Election Court reviews evidence and can order a recount or rerun of elections, (4) Court decisions can be appealed to the Supreme Court. All disputes must be filed within specific timeframes set by law.'
  },
  {
    id: 11,
    question: 'What role do political parties play in elections?',
    answer: 'Political parties are central to Kenya\'s elections: (1) They nominate candidates for elected offices, (2) They conduct internal primary elections to select candidates, (3) They campaign on behalf of their candidates, (4) They must be registered with IEBC, (5) Their agents monitor at polling stations, (6) They fund campaigns (with some funding limits), (7) They participate in election disputes if their candidates\' results are challenged. Parties must follow electoral code of conduct.'
  },
  {
    id: 12,
    question: 'How are election results transmitted and verified?',
    answer: 'Election results follow a secure transmission process: (1) Polling station officials tally votes and prepare results forms, (2) Results are publicly announced at the polling station, (3) Constituency tallying officers compile results from multiple polling stations, (4) Results are transmitted electronically (with encryption) to IEBC national center, (5) Paper backup records are also maintained, (6) IEBC verifies all results against tallying reports, (7) Discrepancies are investigated, (8) Final results are announced by the IEBC Chairperson after verification.'
  },
  {
    id: 13,
    question: 'What is the role of the Supreme Court in elections?',
    answer: 'The Supreme Court of Kenya has specific election-related responsibilities: (1) It hears petitions challenging presidential election results, (2) It can order recounts or reruns if it finds irregularities, (3) It interprets election laws and constitutional provisions, (4) It reviews decisions by Election Courts on other elections, (5) Its decisions on elections are final and binding. The Supreme Court ensures the constitutional validity of election outcomes.'
  },
  {
    id: 14,
    question: 'What happens during the campaign period?',
    answer: 'During the campaign period (typically 60 days before elections): (1) Candidates and political parties campaign publicly, (2) They hold rallies, debates, and meet voters, (3) Media coverage increases, (4) Campaign financing is regulated and reported, (5) Both electronic and traditional media conduct elections coverage, (6) The Electoral Code of Conduct is enforced, (7) Election observers begin their work, (8) IEBC conducts voter education, (9) Security measures are increased, (10) Political parties ensure their members follow conduct rules.'
  },
  {
    id: 15,
    question: 'How does IEBC ensure all votes are counted accurately?',
    answer: 'IEBC employs multiple mechanisms for vote accuracy: (1) Ballot papers are printed securely with authentication features, (2) Voting is done in secret using sealed voting booths, (3) Ballots are placed in transparent ballot boxes for public visibility, (4) Polling station officials manually count and record votes, (5) Results are publicly announced immediately after tallying, (6) Party agents and observers verify tallies, (7) Technology is used for aggregation and verification, (8) Paper records allow for audits and recounts, (9) Stringent security protocols prevent ballot tampering, (10) Training ensures officials understand procedures.'
  },
  {
    id: 16,
    question: 'What does the Data Protection Act say about voter data?',
    answer: 'The Data Protection Act, 2019 protects voter privacy: (1) IEBC must protect personal data collected during voter registration including biometric information, (2) Voter data cannot be shared with political parties for targeting without voter consent, (3) Voters have rights to access their personal data held by IEBC, (4) IEBC must implement security measures to prevent data breaches, (5) Data Protection Commissioner investigates complaints about data misuse, (6) IEBC officials who violate data protection can face fines up to KES 5 million, (7) Voters can sue for damages if their data is misused, (8) All election-related data must meet international data protection standards.'
  },
  {
    id: 17,
    question: 'What are the main election laws in Kenya and what do they cover?',
    answer: 'Kenya has several interconnected election laws: (1) The Constitution (2010) - establishes democratic rights, IEBC authority, and election procedures, (2) IEBC Act (2011) - defines IEBC structure, voter registration, and election management, (3) Elections Act (2011) - covers voting procedures, candidate nomination, campaign finance, dispute resolution, and electoral offences, (4) Election Operations Act (2017) - modernizes elections using technology, electronic results transmission, and biometric verification, (5) Political Parties Act (2011) - regulates party registration, internal democracy, and candidate nomination, (6) Data Protection Act (2019) - protects voter personal data, (7) Various Regulations and IEBC Procedures - specify detailed operational standards and election observer rules.'
  },
  {
    id: 18,
    question: 'What electoral offences carry the most serious penalties?',
    answer: 'The most serious electoral offences under Kenyan law include: (1) Ballot stuffing or result manipulation (up to 5 years imprisonment), (2) Bribery of voters or election officials (up to 5 years imprisonment), (3) Election violence and intimidation (up to 5 years imprisonment), (4) Unauthorized access to election systems/databases (up to 5 years imprisonment), (5) Hate speech and electoral violence (up to 3 years imprisonment), (6) Dual voter registration (up to 3 years imprisonment). Penalties may include both imprisonment and substantial fines (up to KES 500,000+). Perpetrators may be permanently disqualified from voting or holding office. Victims can also recover damages through civil suits.'
  },
  {
    id: 19,
    question: 'How does Kenya ensure disabled persons can vote?',
    answer: 'Kenya\'s election laws ensure accessibility for voters with disabilities: (1) IEBC Election Regulations mandate wheelchair accessibility at all polling stations, (2) Persons with visual impairment can use braille ballots or receive voting assistance, (3) Persons with physical disabilities can request assistance in the voting booth, (4) Persons with hearing impairment can bring interpreters to polling stations, (5) The Data Protection Act requires that accessibility accommodations do not compromise voting privacy/secrecy, (6) Training materials are provided in multiple formats including large print and audio, (7) IEBC conducts accessibility assessments of polling stations before each election, (8) Election observers monitor compliance with accessibility requirements.'
  },
  {
    id: 20,
    question: 'What is the Electoral Code of Conduct and who enforces it?',
    answer: 'The Electoral Code of Conduct is established annually by IEBC for each election cycle: (1) All candidates, political parties, election officials, and security personnel must follow the Code, (2) The Code prohibits hate speech, ethnic/regional/religious incitement, and threats, (3) It requires respectful campaign conduct and fair competition, (4) Violence, intimidation, and voter coercion are prohibited, (5) Violations must not disrupt public peace or endanger lives, (6) IEBC\'s Election Dispute Resolution Committees (EDRCs) investigate Code violations, (7) Penalties range from warnings to fines to temporary/permanent disqualification, (8) The National Cohesion Commission also monitors hate speech violations, (9) Court decisions can enforce Code of Conduct violations through contempt or criminal proceedings.'
  }
];

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export default function ElectionsInKenya() {
  const [activeSection, setActiveSection] = useState('overview');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  useEffect(() => {
    // Set SEO Meta Tags
    const metaTitle = 'Elections in Kenya 2027 – Electoral Process, Legal Framework & Guide';
    const metaDescription = 'Comprehensive guide to Kenya\'s 2027 elections including electoral process, legal framework, all laws and acts governing elections, IEBC role, voting procedures, and complete election timeline.';
    const metaKeywords = 'Kenya elections 2027, electoral process, election laws, IEBC, voting procedure Kenya, election legal framework, how elections work Kenya, election timeline 2027';

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
          'url': window.location.href
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
          'name': 'How Elections Are Conducted in Kenya',
          'description': 'Step-by-step guide to Kenya\'s electoral process from announcement to result declaration',
          'step': [
            {
              '@type': 'HowToStep',
              'name': 'Election Announcement',
              'text': 'President announces general elections, typically 60+ days before election day'
            },
            {
              '@type': 'HowToStep',
              'name': 'Voter Registration Closure',
              'text': 'Voter registration closes 60 days before elections for final verification'
            },
            {
              '@type': 'HowToStep',
              'name': 'Nomination of Candidates',
              'text': 'Political parties nominate candidates through internal primary elections'
            },
            {
              '@type': 'HowToStep',
              'name': 'Campaign Period',
              'text': 'Candidates and parties campaign publicly for approximately 60 days'
            },
            {
              '@type': 'HowToStep',
              'name': 'Election Day Voting',
              'text': 'Registered voters go to polling stations and cast votes in secret'
            },
            {
              '@type': 'HowToStep',
              'name': 'Vote Tallying',
              'text': 'Polling officials count votes and transmit results to constituency tallying centers'
            },
            {
              '@type': 'HowToStep',
              'name': 'Result Verification',
              'text': 'IEBC verifies results against paper records and announces final outcomes'
            },
            {
              '@type': 'HowToStep',
              'name': 'Result Declaration',
              'text': 'IEBC Chairperson officially declares final results; candidates can petition if disputed'
            }
          ]
        },
        {
          '@type': 'GovernmentService',
          'name': 'Elections in Kenya',
          'description': 'Official electoral process conducted by the Independent Electoral and Boundaries Commission (IEBC)',
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
    { id: 'overview', label: 'Overview' },
    { id: 'legal-framework', label: 'Legal Framework' },
    { id: '2027-timeline', label: '2027 Timeline' },
    { id: 'types', label: 'Types of Elections' },
    { id: 'electoral-process', label: 'Electoral Process' },
    { id: 'iebc-role', label: 'IEBC Role' },
    { id: 'common-issues', label: 'Common Issues' },
    { id: 'rights', label: 'Citizens\' Rights' },
    { id: 'faqs', label: 'FAQs' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white py-12 sm:py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4 mb-4">
            <BarChart3 className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Kenya Elections 2027 – Complete Electoral Process, Legal Framework & Guide</h1>
          <p className="text-lg sm:text-xl text-violet-50 mb-6">Comprehensive guide to Kenya's 2027 elections, electoral laws, IEBC procedures, and how to participate in the democratic process. Understand all laws and acts governing elections in Kenya.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="https://www.iebc.or.ke" target="_blank" rel="noopener noreferrer" className="bg-white text-violet-600 px-6 py-3 rounded-lg font-semibold hover:bg-violet-50 transition flex items-center justify-center gap-2">
              Visit IEBC <ArrowRight className="w-5 h-5" />
            </a>
            <a href="/how-to-check-voter-status-kenya" className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-violet-600 transition">
              Check Voter Status
            </a>
          </div>
        </div>
      </section>

      {/* Breadcrumb Navigation */}
      <nav className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-3 text-sm overflow-x-auto">
            <a href="/" className="text-violet-600 hover:text-violet-700 whitespace-nowrap">Home</a>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 whitespace-nowrap">Elections in Kenya</span>
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
                  ? 'bg-violet-100 text-violet-600 border-b-2 border-violet-600'
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
                    ? 'bg-violet-100 text-violet-600 border-l-4 border-violet-600 font-semibold'
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
          {/* Section 1: Overview */}
          <section id="overview" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-6">
              <CheckCircle className="w-8 h-8 text-violet-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Overview of Elections in Kenya</h2>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">Kenya is a democratic republic that conducts regular, free, and fair elections to choose leaders and representatives at national and county levels. Elections are the cornerstone of Kenya's democratic system, empowering citizens to participate in governance, hold their representatives accountable, and shape the nation's future through their votes.</p>
              
              {/* Key Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-violet-100 to-violet-50 border-2 border-violet-300 rounded-xl p-6 text-center shadow-md hover:shadow-lg transition">
                  <div className="text-4xl font-bold text-violet-700 mb-2">290</div>
                  <div className="text-sm font-semibold text-violet-900">Constituencies</div>
                  <div className="text-xs text-gray-600 mt-1">For Parliamentary Elections</div>
                </div>
                <div className="bg-gradient-to-br from-purple-100 to-purple-50 border-2 border-purple-300 rounded-xl p-6 text-center shadow-md hover:shadow-lg transition">
                  <div className="text-4xl font-bold text-purple-700 mb-2">47</div>
                  <div className="text-sm font-semibold text-purple-900">Counties</div>
                  <div className="text-xs text-gray-600 mt-1">For County Governance</div>
                </div>
                <div className="bg-gradient-to-br from-indigo-100 to-indigo-50 border-2 border-indigo-300 rounded-xl p-6 text-center shadow-md hover:shadow-lg transition">
                  <div className="text-4xl font-bold text-indigo-700 mb-2">22M+</div>
                  <div className="text-sm font-semibold text-indigo-900">Registered Voters</div>
                  <div className="text-xs text-gray-600 mt-1">As of 2022 Elections</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-violet-50 to-violet-100 border-l-4 border-violet-600 p-5 rounded-lg shadow-sm hover:shadow-md transition">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center text-white font-bold">✓</div>
                    <h3 className="font-bold text-gray-900 text-lg">Democratic Foundation</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">Kenya's 2010 Constitution established a revolutionary devolved democratic system with elections at national and county levels. This constitutional framework guarantees democratic participation, ensures checks and balances, and protects fundamental rights. Elections are not just procedures—they are the foundation of Kenya's constitutional governance framework.</p>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 border-l-4 border-purple-600 p-5 rounded-lg shadow-sm hover:shadow-md transition">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">✓</div>
                    <h3 className="font-bold text-gray-900 text-lg">Regular Electoral Cycles</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">General elections (presidential, parliamentary, and county) are held every 5 years on the second Tuesday of August. The most recent general elections were held on August 9, 2022. The next general elections are scheduled for August 2027. By-elections may occur between general elections to fill specific vacancies caused by death, resignation, or disqualification.</p>
                </div>

                <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-l-4 border-indigo-600 p-5 rounded-lg shadow-sm hover:shadow-md transition">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">✓</div>
                    <h3 className="font-bold text-gray-900 text-lg">Independent Administration</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">The <a href="/understanding-iebc-kenya" className="text-violet-600 hover:text-violet-700 font-semibold underline">Independent Electoral and Boundaries Commission (IEBC)</a> independently administers and supervises all elections and referendums. IEBC is constitutionally mandated to conduct free, fair, transparent, and credible elections. The Commission operates free from political interference and is accountable to the people of Kenya through Parliament.</p>
                </div>

                <div className="bg-gradient-to-r from-fuchsia-50 to-fuchsia-100 border-l-4 border-fuchsia-600 p-5 rounded-lg shadow-sm hover:shadow-md transition">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-fuchsia-600 rounded-full flex items-center justify-center text-white font-bold">✓</div>
                    <h3 className="font-bold text-gray-900 text-lg">Universal Adult Suffrage</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">Every Kenyan citizen aged 18 and above has the constitutional right to vote. Elections are conducted by secret ballot in private voting booths, allowing voters to make completely free choices without coercion, surveillance, or intimidation. Your vote is your voice—and it is protected by law.</p>
                </div>

                <div className="bg-gradient-to-r from-rose-50 to-rose-100 border-l-4 border-rose-600 p-5 rounded-lg shadow-sm hover:shadow-md transition">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-rose-600 rounded-full flex items-center justify-center text-white font-bold">✓</div>
                    <h3 className="font-bold text-gray-900 text-lg">Multi-Level Governance</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">Kenya conducts elections at two levels: national level (President, Members of Parliament, Senators, Women Representatives) and county level (County Governors, County Assembly Members). This devolved system allows citizens to choose leaders at multiple governance levels, ensuring representation from the national to the grassroots level.</p>
                </div>
              </div>

              <div className="mt-6 bg-gradient-to-br from-violet-100 via-purple-50 to-indigo-100 border-2 border-violet-400 rounded-xl p-6 shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">📊</div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">Election Scope & Participation</h4>
                    <p className="text-gray-700 leading-relaxed">Kenya is divided into <strong className="text-violet-700">290 constituencies</strong> for parliamentary representation and <strong className="text-purple-700">47 counties</strong> for devolved governance. Over <strong className="text-indigo-700">22 million registered voters</strong> participated in the 2022 elections, making Kenya one of Africa's most vibrant democracies. Every vote counts in shaping Kenya's future.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Legal Framework */}
          <section id="legal-framework" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <FileText className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Complete Legal Framework Governing Elections in Kenya</h2>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">Kenya's elections are governed by a comprehensive and evolving legal framework established in the Constitution (2010) and implemented through various Acts, Regulations, and standards. This legal framework ensures elections are free, fair, transparent, and conducted in accordance with democratic principles.</p>
              
              <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">The Constitution of Kenya (2010)</h3>
              <div className="bg-gray-50 border border-gray-300 p-4 rounded mb-4">
                <p className="text-gray-700 mb-3"><strong>Constitutional Foundation for Elections:</strong></p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Article 38 – Democratic Rights:</strong> Establishes the fundamental right of every citizen to participate in elections and democratic processes. Provides for universal adult suffrage (all citizens 18+ can vote). Guarantees the right to vote by secret ballot.</li>
                  <li><strong>Article 33 – Political Rights:</strong> Protects freedom of association and expression essential to electoral processes. Includes the right to form, join, and participate in political parties without discrimination.</li>
                  <li><strong>Article 81-90 – Presidential Elections:</strong> Defines who can run for president (citizenship, age 35+, registered voter, not disqualified by law). Specifies presidential election procedures and timelines. Establishes that a president must win 50% + 1 of valid votes cast; if not achieved, a run-off is held.</li>
                  <li><strong>Article 96-114 – Parliamentary Elections:</strong> Defines constituency representation and MP qualifications. Establishes procedures for electing Members of Parliament, Senators, and Women Representatives. Specifies timelines and dispute resolution mechanisms for parliamentary elections.</li>
                  <li><strong>Article 177-207 – County Elections & Devolved Governance:</strong> Establishes county government structure. Defines elections for County Governors, Senators, and County Assembly Members (MCAs). Specifies county-level electoral procedures and timelines.</li>
                  <li><strong>Article 250-259 – IEBC Establishment & Mandate:</strong> Constitutionally establishes the Independent Electoral and Boundaries Commission (IEBC) as independent body. Defines IEBC's powers to conduct elections, manage voter registration, and administer electoral disputes. Ensures IEBC independence from executive and political interference.</li>
                  <li><strong>Article 260 – Interpreting the Constitution:</strong> When there are disputes about constitutional election provisions, courts must interpret provisions in a manner that promotes the values of democracy, rule of law, and constitutional supremacy.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">The Independent Electoral and Boundaries Commission (IEBC) Act, 2011 (As Amended)</h3>
              <div className="bg-gray-50 border border-gray-300 p-4 rounded mb-4">
                <p className="text-gray-700 mb-3"><strong>Key Provisions & Functions:</strong></p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Section 3-4:</strong> Establishes IEBC as constitutional independent body with legal personality. Defines IEBC's core functions and powers regarding election administration.</li>
                  <li><strong>Sections 5-9:</strong> Details IEBC structure including Chairperson, Vice-Chairperson, and four Commissioners. Specifies appointment procedures and requires parliamentary approval. Establishes security of tenure and protection from arbitrary removal.</li>
                  <li><strong>Sections 17-21 – Voter Registration Authority:</strong> Grants IEBC exclusive power to manage voter registration. Establishes biometric voter registration system. Requires IEBC to maintain accessible voter register. Specifies voter eligibility requirements including citizenship, age 18+, not disqualified. Requires IEBC to conduct continuous voter registration and periodic review of register.</li>
                  <li><strong>Sections 39-42 – Management of Elections:</strong> Empowers IEBC to conduct presidential, parliamentary, and county elections. Grants authority to manage polling stations and election materials. Specifies procedures for nomination, ballot preparation, and result transmission.</li>
                  <li><strong>Sections 43-47 – Electoral Boundaries & Delimitation:</strong> Requires IEBC to conduct boundary delimitation every 10 years following census. Establishes procedures for public participation in boundary changes. Requires delimitation to ensure roughly equal population in constituencies/wards (±40% variance allowed).</li>
                  <li><strong>Section 47A – Voter Education:</strong> Mandates IEBC to conduct comprehensive voter education campaigns. Requires non-partisan, balanced, and accessible voter education covering registration, voting procedures, and candidates. Must reach all regions including vulnerable populations.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">The Elections Act, 2011 (As Amended)</h3>
              <div className="bg-gray-50 border border-gray-300 p-4 rounded mb-4">
                <p className="text-gray-700 mb-3"><strong>Comprehensive Electoral Procedures & Regulations:</strong></p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Part I – Preliminary Provisions:</strong> Defines key terms (elections, election, polling station, etc.). Establishes interpretation principles. Specifies application to presidential, parliamentary, county, and referendum elections.</li>
                  <li><strong>Part II – Registration of Electors (Voter Registration):</strong> Detailed procedures for voter registration including qualifications, disqualifications, and registration process. Requires IEBC to maintain preliminary, supplementary, and final registers. Specifies voter registration timelines and procedures. Establishes requirements for voter identification (national ID, passport, birth certificate).</li>
                  <li><strong>Part III – Nomination of Candidates:</strong> Establishes nomination procedures for all election types. Specifies nomination deadlines (typically 60 days before election). Requires political party nomination for most candidates. Establishes independent candidate nomination procedures. Specifies candidate vetting and approval process by IEBC.</li>
                  <li><strong>Part IV – Campaign Finance & Regulation:</strong> Establishes campaign finance rules and spending limits. Requires political parties and candidates to report donations and spending. Prohibits certain funding sources (foreign donations, anonymous donations beyond limits). Establishes Electoral Code of Conduct for campaigns.</li>
                  <li><strong>Part V – Voting & Poll Administration (Sections 74-114):</strong> Details voting procedures including secrecy of ballot, accessibility for persons with disabilities, and voter identification. Establishes polling station procedures and closing times. Specifies ballot paper design and security features. Requires election officials' conduct standards including impartiality and competence.</li>
                  <li><strong>Part VI – Counting, Tallying & Results (Sections 125-138):</strong> Establishes vote counting procedures at polling stations. Specifies tallying procedures at constituency and national levels. Requires public announcement of results at each stage. Mandates transparency throughout results compilation. Allows for recounts if irregularities are suspected.</li>
                  <li><strong>Part VII – Electoral Disputes (Sections 139-147):</strong> Establishes two-tier dispute resolution: (1) Election Dispute Resolution Committees (EDRCs) at constituency level for complaints and disputes, (2) Election Court for appeals. Specifies timelines for filing disputes (typically within 5 days of results announcement). Allows for Supreme Court review of presidential election results.</li>
                  <li><strong>Part VIII – Electoral Offences (Sections 97-114, 148-180):</strong> Establishes criminal offences including: dual voter registration (up to 3 years imprisonment), false information on voter forms, bribery of voters or officials, ballot stuffing, result manipulation, unauthorized access to election materials, violence at polling stations. Penalties range from fines to imprisonment. Violations can result in disqualification from voting or holding office.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">The Election Operations Act, 2017</h3>
              <div className="bg-gray-50 border border-gray-300 p-4 rounded mb-4">
                <p className="text-gray-700 mb-3"><strong>Modernization of Election Operations & Technology:</strong></p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Sections 3-10 – Electoral Technology & Systems:</strong> Authorizes use of modern technology in elections including electronic voting and result transmission systems. Establishes security standards for technology systems. Requires systems to have backup manual procedures (paper ballots). Specifies that technology must enhance transparency and security, not replace fundamental safeguards.</li>
                  <li><strong>Section 4 – Biometric Voter Verification:</strong> Establishes requirements for biometric voter identification systems. Specifies fingerprint or iris recognition as verification method. Requires systems to prevent multiple voting. Mandates fallback to manual procedures if biometric system fails.</li>
                  <li><strong>Section 5 – Electronic Result Transmission:</strong> Authorizes electronic transmission of results from polling stations to tallying centers. Requires encryption and security protocols for electronic transmission. Mandates parallel transmission of paper records for verification. Specifies data integrity checks and audit trails.</li>
                  <li><strong>Section 6 – Ballot Paper Security:</strong> Specifies security features for ballot papers including watermarks, holograms, and unique identification codes. Requires secure printing and distribution of ballots. Establishes chain of custody for ballot papers from printing to destruction after elections.</li>
                  <li><strong>Section 7 – Dispute Resolution Technology:</strong> Establishes procedures for using technology in election dispute resolution. Allows for digital records as evidence in election petitions. Specifies admissibility of digital evidence in courts.</li>
                  <li><strong>Section 8-10 – Data Protection & Security:</strong> Requires all election data to meet data protection standards. Specifies cybersecurity measures for election systems. Requires regular security audits and penetration testing. Mandates backup systems and disaster recovery plans.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">The Political Parties Act, 2011 (As Amended)</h3>
              <div className="bg-gray-50 border border-gray-300 p-4 rounded mb-4">
                <p className="text-gray-700 mb-3"><strong>Political Party Registration & Internal Democracy:</strong></p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Part II – Registration of Political Parties:</strong> Establishes requirements for political party registration with IEBC. Requires parties to have democratic constitutions and structures. Specifies minimum membership requirements (1,000 members, in at least 15 counties). Establishes annual political party funding grants from government.</li>
                  <li><strong>Sections 35-37 – Democratic Processes:</strong> Requires political parties to conduct internal democratic elections for leadership. Mandates transparent nomination procedures for candidates. Specifies inclusion of women, youth, and marginalized groups in party structures and nominations. Requires parties to follow their own constitutions in internal elections.</li>
                  <li><strong>Section 100-105 – Campaign Conduct:</strong> Requires parties and candidates to adhere to Electoral Code of Conduct. Prohibits hate speech, violence, or incitement during campaigns. Specifies party agent roles and accreditation at polling stations. Establishes sanctions for code of conduct violations.</li>
                  <li><strong>Section 95-99 – Political Finance:</strong> Establishes transparency requirements for political party funding. Requires parties to report donors (except for private donations under defined limits). Specifies prohibited funding sources (foreign donations, anonymous donations exceeding limits, proceeds from crime). Annual political party funding grants support democratic participation.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">The Registration of Persons Act (Cap. 107)</h3>
              <div className="bg-gray-50 border border-gray-300 p-4 rounded mb-4">
                <p className="text-gray-700 mb-3"><strong>National Identification & Voter Eligibility Verification:</strong></p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Establishes national ID as official document of identity and citizenship verification for voter registration.</li>
                  <li>Requires national ID cardholders to have demonstrable Kenyan citizenship and residency.</li>
                  <li>Specifies that only persons with valid national IDs (or other approved documents like passports or birth certificates) can register as voters.</li>
                  <li>IEBC uses registration data from this Act to verify voter eligibility and prevent dual registration.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">The Data Protection Act, 2019 (As Amended)</h3>
              <div className="bg-gray-50 border border-gray-300 p-4 rounded mb-4">
                <p className="text-gray-700 mb-3"><strong>Personal Data Privacy & Security in Elections:</strong></p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Sections 4-46:</strong> Establishes data protection principles applicable to election data including IEBC voter registers and biometric information. Specifies lawful processing conditions for election data (consent, legal obligation, necessary functions). Requires IEBC to have explicit legal basis for processing personal data.</li>
                  <li><strong>Data Subject Rights:</strong> Specifies voter rights to access their personal data held by IEBC, correct inaccurate information, and know how their data is used. Voters can lodge complaints with Data Protection Commissioner for violations.</li>
                  <li><strong>Security Requirements:</strong> Mandates IEBC to implement appropriate security measures to protect voter data from unauthorized access, disclosure, or loss. Requires encryption of sensitive biometric data. Specifies incident reporting requirements if data is breached.</li>
                  <li><strong>Data Protection Commissioner Oversight:</strong> Grants Data Protection Commissioner authority to investigate complaints about IEBC data handling, issue enforcement orders, and impose penalties for violations.</li>
                  <li><strong>Cross-Border Data Transfer:</strong> Restricts transfer of voter data outside Kenya without appropriate safeguards. Prohibits sharing voter data with political parties or candidates for targeting purposes without voter consent.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">The Election Regulations & IEBC Standards</h3>
              <div className="bg-gray-50 border border-gray-300 p-4 rounded mb-4">
                <p className="text-gray-700 mb-3"><strong>Statutory Instruments & Operational Standards:</strong></p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Electoral Code of Conduct (2016 & 2022):</strong> Establishes conduct standards for all election participants including candidates, parties, election officials, and security personnel. Prohibits hate speech, violence, disenfranchisement, and voter intimidation. Specifies sanctions for violations including fines and temporary suspension from elections.</li>
                  <li><strong>IEBC Procedures & Guidelines:</strong> IEBC issues detailed operational guidelines for election administration including: polling station procedures, election official responsibilities, biometric system operations, result transmission protocols, dispute handling, and observer accreditation.</li>
                  <li><strong>Election Security Protocols:</strong> Establishes security measures for polling stations, ballot papers, election officials, and voting facilities. Specifies use of security personnel and coordination with law enforcement. Includes voter protection measures and peaceful polling procedures.</li>
                  <li><strong>Accessibility Standards:</strong> Requires IEBC to ensure elections are accessible to persons with disabilities including wheelchair access, voting assistants, and alternative voting methods (braille ballots, large print, etc.).</li>
                  <li><strong>Election Observer Accreditation Standards:</strong> Specifies procedures for accrediting international and domestic election observers. Establishes observer conduct code and access rights at polling stations.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">The East African Community Protocol & International Conventions</h3>
              <div className="bg-gray-50 border border-gray-300 p-4 rounded mb-4">
                <p className="text-gray-700 mb-3"><strong>Regional & International Electoral Standards:</strong></p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>African Charter on Democracy, Elections & Governance:</strong> Kenya has ratified this charter committing to democratic elections and respecting electoral outcomes. Establishes continental standards for free, fair, and transparent elections.</li>
                  <li><strong>International Covenant on Civil & Political Rights (ICCPR):</strong> Kenya's commitment to this covenant requires respecting voting rights and non-discrimination in elections. Requires periodic review of election laws to ensure compliance with international standards.</li>
                  <li><strong>East African Community Protocol:</strong> Establishes principles for fair elections across the EAC region and promotes electoral best practices.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">Related Legislation & Court Decisions</h3>
              <div className="bg-gray-50 border border-gray-300 p-4 rounded mb-4">
                <p className="text-gray-700 mb-3"><strong>Complementary Laws & Judicial Precedents:</strong></p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Public Order Act (Cap. 56):</strong> Establishes procedures for public meetings and rallies during elections. Requires notification of security forces for public gatherings. Specifies that campaign events must not disturb public peace.</li>
                  <li><strong>National Cohesion & Integration Act, 2008:</strong> Prohibits hate speech and electoral violence that promote ethnic, religious, or regional divisions. Specifies that all candidates and parties must promote national cohesion during campaigns.</li>
                  <li><strong>Penal Code (Chapter 63):</strong> Establishes criminal penalties for common offences during elections including violence, fraud, bribery, and intimidation. Applies general criminal law principles to electoral offences.</li>
                  <li><strong>Supreme Court Decisions on Elections (2013, 2017, 2022):</strong> Key court decisions have established important electoral principles: election results can be challenged if there are substantial irregularities, Supreme Court has authority to nullify presidential results, IEBC decisions can be judicially reviewed for legality, and voters' fundamental rights to vote must be protected.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">Restrictions on Voter Registration & Election Candidacy</h3>
              <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded mb-4">
                <p className="text-gray-700 mb-2"><strong>Persons Who Cannot Vote or Run for Office:</strong></p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Non-citizens (persons without Kenyan citizenship)</li>
                  <li>Persons under 18 years of age</li>
                  <li>Persons convicted of crime involving dishonesty or moral turpitude (permanent disqualification unless court orders otherwise)</li>
                  <li>Persons sentenced to imprisonment for 6 months or longer (disqualified during imprisonment + 5 years after release for candidates; voting disqualification during imprisonment)</li>
                  <li>Persons declared to be of unsound mind by competent court authority</li>
                  <li>Persons with unresolved conflict of interest or who fail financial accountability standards (for candidates)</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">Electoral Offences & Penalties (2027 Framework)</h3>
              <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
                <p className="text-gray-700 mb-2"><strong>Serious Electoral Violations & Consequences:</strong></p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Dual Voter Registration:</strong> Registering to vote in multiple constituencies. Penalty: Up to 3 years imprisonment or KES 100,000+ fine. Also results in permanent disqualification from voting.</li>
                  <li><strong>False Information on Voter Forms:</strong> Providing false personal information during registration. Penalty: Up to 2 years imprisonment or KES 50,000+ fine. Also results in registration cancellation.</li>
                  <li><strong>Ballot Stuffing & Result Manipulation:</strong> Adding extra ballots or falsifying vote counts. Penalty: Up to 5 years imprisonment or KES 500,000+ fine. Also results in lifetime ban from election-related work.</li>
                  <li><strong>Bribery of Voters or Election Officials:</strong> Offering money/gifts for votes or official actions. Penalty: Up to 5 years imprisonment and forfeiture of assets. Also results in disqualification from holding office.</li>
                  <li><strong>Violence & Intimidation at Polling Stations:</strong> Using violence or threats to prevent voting or influence results. Penalty: Up to 5 years imprisonment and compensation to victims. Also results in disqualification from candidacy.</li>
                  <li><strong>Unauthorized Access to Election Materials/Systems:</strong> Accessing voter database or election systems without authorization. Penalty: Up to 5 years imprisonment or KES 500,000+ fine. Also results in data protection violations penalty.</li>
                  <li><strong>Election Official Misconduct:</strong> Violation of official duties including bias, fraud, or negligence. Penalty: Up to 3 years imprisonment and removal from office. Also subjects official to civil liability.</li>
                  <li><strong>Hate Speech & Electoral Violence:</strong> Incitement to violence based on ethnicity, religion, or region. Penalty: Up to 3 years imprisonment and KES 300,000+ fine under National Cohesion Act.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3: 2027 Election Timeline & Important Dates */}
          <section id="2027-timeline" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-6">
              <BarChart3 className="w-8 h-8 text-teal-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">2027 General Elections – Important Dates & Timeline</h2>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">Kenya's 2027 general elections will follow the constitutional 5-year electoral cycle. The elections are expected to be held on the <strong className="text-teal-700">second Tuesday of August 2027</strong> (approximately August 10, 2027). Here is the comprehensive timeline based on Kenyan electoral law and IEBC procedures:</p>
              
              {/* Visual Timeline */}
              <div className="space-y-4 mb-8">
                <div className="relative">
                  <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-400 to-teal-600"></div>
                  
                  <div className="relative flex gap-4 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10">1</div>
                    <div className="flex-1 bg-gradient-to-r from-teal-50 to-teal-100 border-l-4 border-teal-600 p-5 rounded-lg shadow-sm hover:shadow-md transition">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-teal-600 text-white px-3 py-1 rounded-full text-sm font-bold">June 2027</span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg mb-2">Election Announcement</h4>
                      <p className="text-gray-700 leading-relaxed">President is expected to announce 2027 general elections (typically 90+ days before election day). This announcement triggers the electoral calendar and begins comprehensive election preparations by IEBC, political parties, and all stakeholders.</p>
                    </div>
                  </div>

                  <div className="relative flex gap-4 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10">2</div>
                    <div className="flex-1 bg-gradient-to-r from-cyan-50 to-cyan-100 border-l-4 border-cyan-600 p-5 rounded-lg shadow-sm hover:shadow-md transition">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-cyan-600 text-white px-3 py-1 rounded-full text-sm font-bold">July-August 2027</span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg mb-2">Voter Registration Period Opens</h4>
                      <p className="text-gray-700 leading-relaxed">Voter registration opens and runs for approximately 60 days. Kenyans can <a href="/how-to-register-as-a-voter-kenya" className="text-violet-600 hover:text-violet-700 font-semibold underline">register for the first time</a> or update their voter registration. Registration is conducted nationwide at all IEBC registration centers, online portals, and mobile registration drives.</p>
                    </div>
                  </div>

                  <div className="relative flex gap-4 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10">3</div>
                    <div className="flex-1 bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-600 p-5 rounded-lg shadow-sm hover:shadow-md transition">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">September 2027</span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg mb-2">Registration Closes & Verification Begins</h4>
                      <p className="text-gray-700 leading-relaxed">Voter registration closes 60 days before election day (around early-mid September). IEBC begins comprehensive verification of the voter register. Boundary delimitation (if required) is finalized. Preliminary voter register is published for public inspection.</p>
                    </div>
                  </div>

                  <div className="relative flex gap-4 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10">4</div>
                    <div className="flex-1 bg-gradient-to-r from-indigo-50 to-indigo-100 border-l-4 border-indigo-600 p-5 rounded-lg shadow-sm hover:shadow-md transition">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-bold">Late September 2027</span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg mb-2">Party Primaries & Candidate Nomination</h4>
                      <p className="text-gray-700 leading-relaxed\">Political parties begin internal primary elections to nominate candidates democratically. Candidate nomination period opens as candidates file nominations with IEBC. Aspiring leaders declare their candidacy and submit required documentation.</p>
                    </div>
                  </div>

                  <div className="relative flex gap-4 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10">5</div>
                    <div className="flex-1 bg-gradient-to-r from-purple-50 to-purple-100 border-l-4 border-purple-600 p-5 rounded-lg shadow-sm hover:shadow-md transition">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">October 2027</span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg mb-2">Candidate Approval & Campaign Launch</h4>
                      <p className="text-gray-700 leading-relaxed">Candidate nomination deadline (typically 60 days before election day). IEBC vets and approves candidates for constitutional and legal compliance. Final list of candidates is published. Official campaign period begins with candidates and parties launching their manifestos.</p>
                    </div>
                  </div>

                  <div className="relative flex gap-4 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10">6</div>
                    <div className="flex-1 bg-gradient-to-r from-pink-50 to-pink-100 border-l-4 border-pink-600 p-5 rounded-lg shadow-sm hover:shadow-md transition">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-pink-600 text-white px-3 py-1 rounded-full text-sm font-bold">October-November 2027</span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg mb-2">Intensive Campaign Period</h4>
                      <p className="text-gray-700 leading-relaxed">Intensive campaign period runs for approximately 60 days. Candidates and political parties conduct campaigns, rallies, debates, and meet voters nationwide. Media coverage intensifies. Election observers are accredited. IEBC conducts comprehensive voter education. Electoral Code of Conduct is strictly enforced.</p>
                    </div>
                  </div>

                  <div className="relative flex gap-4 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10">⚡</div>
                    <div className="flex-1 bg-gradient-to-r from-amber-50 to-amber-100 border-l-4 border-amber-600 p-5 rounded-lg shadow-md hover:shadow-lg transition">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-bold">August 10, 2027 (Estimated)</span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-xl mb-2">🗳️ GENERAL ELECTION DAY</h4>
                      <p className="text-gray-700 leading-relaxed font-medium">General elections are held nationwide. Presidential, parliamentary, county, and MCA elections conducted simultaneously. Voting runs from 6:00 AM to 5:00 PM (typically). All registered voters go to their assigned polling stations to cast their votes in secret.</p>
                    </div>
                  </div>

                  <div className="relative flex gap-4 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10">7</div>
                    <div className="flex-1 bg-gradient-to-r from-emerald-50 to-emerald-100 border-l-4 border-emerald-600 p-5 rounded-lg shadow-sm hover:shadow-md transition">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-bold">August 10-15, 2027</span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg mb-2">Vote Counting & Results Transmission</h4>
                      <p className="text-gray-700 leading-relaxed">Votes are counted at polling stations immediately after voting closes. Results are transmitted to constituency and national tallying centers. Results verification process begins with IEBC consolidating and verifying results against paper records. Transparency maintained at all stages.</p>
                    </div>
                  </div>

                  <div className="relative flex gap-4 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10">8</div>
                    <div className="flex-1 bg-gradient-to-r from-violet-50 to-violet-100 border-l-4 border-violet-600 p-5 rounded-lg shadow-sm hover:shadow-md transition">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-violet-600 text-white px-3 py-1 rounded-full text-sm font-bold">August 15-20, 2027</span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg mb-2">Final Results Announcement</h4>
                      <p className="text-gray-700 leading-relaxed">Final verified results announced by IEBC Chairperson for all races. If presidential run-off required (no candidate gets 50%+1 of votes), run-off is scheduled within 60 days. Candidates can petition election results within 7 days if they believe irregularities occurred.</p>
                    </div>
                  </div>

                  <div className="relative flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10">9</div>
                    <div className="flex-1 bg-gradient-to-r from-orange-50 to-orange-100 border-l-4 border-orange-600 p-5 rounded-lg shadow-sm hover:shadow-md transition">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold">October 2027 (If Needed)</span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg mb-2">Presidential Run-Off (If Required)</h4>
                      <p className="text-gray-700 leading-relaxed">Presidential run-off election held within 60 days if no candidate achieves 50%+1 in the first round. The two leading candidates compete in the run-off. Winner is declared president. Results of run-off are final.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-100 via-blue-50 to-cyan-100 border-2 border-blue-400 rounded-xl p-6 shadow-lg mb-8">
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-3xl">📅</div>
                  <h4 className="font-bold text-gray-900 text-xl">Important Note</h4>
                </div>
                <p className="text-gray-700 leading-relaxed"><strong className="text-blue-700">These are estimated dates</strong> based on past election patterns and constitutional requirements. The exact 2027 election date and timeline will be officially announced by IEBC and the President. Kenyans should regularly check <a href="https://www.iebc.or.ke" target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:text-violet-700 font-semibold underline">IEBC's official website (www.iebc.or.ke)</a> for official dates, updates, and announcements as the election approaches.</p>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4 flex items-center gap-2">
                <span className="text-2xl">✅</span> What You Should Do Now to Prepare for 2027 Elections
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-400 rounded-lg p-5 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                    <h5 className="font-bold text-gray-900">Register to Vote</h5>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">Complete your <a href="/how-to-register-as-a-voter-kenya" className="text-violet-600 hover:text-violet-700 font-semibold underline">voter registration</a> before the registration period closes in 2027. Registration is free and takes only 10-15 minutes.</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-400 rounded-lg p-5 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                    <h5 className="font-bold text-gray-900">Update Your Details</h5>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">If you have moved or changed your name, update your voter registration during the 2027 registration period to vote in your current constituency.</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-violet-50 border-2 border-purple-400 rounded-lg p-5 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
                    <h5 className="font-bold text-gray-900">Get Your National ID</h5>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">Ensure you have a valid national ID, which is required for voter registration and voting. Apply early if you don't have one yet.</p>
                </div>

                <div className="bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-400 rounded-lg p-5 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center text-white font-bold">4</div>
                    <h5 className="font-bold text-gray-900">Know Your Polling Station</h5>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">When the 2027 election is announced, <a href="/how-to-check-voter-status-kenya" className="text-violet-600 hover:text-violet-700 font-semibold underline">check your voter status</a> and find out which polling station will serve your area.</p>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-400 rounded-lg p-5 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold">5</div>
                    <h5 className="font-bold text-gray-900">Follow Political Developments</h5>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">Stay informed about candidate announcements and campaign platforms from 2027 onwards. Understand their positions on key issues.</p>
                </div>

                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-400 rounded-lg p-5 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold">6</div>
                    <h5 className="font-bold text-gray-900">Stay Updated on Election Info</h5>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">Visit <a href="/understanding-iebc-kenya" className="text-violet-600 hover:text-violet-700 font-semibold underline">IEBC's website</a> regularly for election dates, procedures, and updates as they approach in 2027.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3-Alternative: Types of Elections */}
          <section id="types" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <Users className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Types of Elections in Kenya</h2>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">Kenya conducts several types of elections at different levels and times.</p>
              
              <table className="w-full border-collapse mb-4">
                <thead>
                  <tr className="bg-violet-100 border border-gray-300">
                    <th className="border border-gray-300 px-4 py-2 text-left font-bold text-gray-900">Election Type</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-bold text-gray-900">Frequency</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-bold text-gray-900">What Is Elected</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border border-gray-300">
                    <td className="border border-gray-300 px-4 py-2 text-gray-700"><strong><a href="/presidential-parliamentary-county-elections-kenya" className="text-violet-600 hover:text-violet-700">General Election</a></strong></td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">Every 5 years</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">President, Parliament, County Governors, MCAs</td>
                  </tr>
                  <tr className="bg-gray-50 border border-gray-300">
                    <td className="border border-gray-300 px-4 py-2 text-gray-700"><strong>Presidential Election</strong></td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">Every 5 years</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">President and Deputy President</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="border border-gray-300 px-4 py-2 text-gray-700"><strong>Parliamentary Election</strong></td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">Every 5 years</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">Members of Parliament (MPs), Senators</td>
                  </tr>
                  <tr className="bg-gray-50 border border-gray-300">
                    <td className="border border-gray-300 px-4 py-2 text-gray-700"><strong>County Election</strong></td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">Every 5 years</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">County Governors, County Representatives (MCAs)</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="border border-gray-300 px-4 py-2 text-gray-700"><strong>By-Election</strong></td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">As needed</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">Single vacant seat (MP, Senator, Governor, MCA)</td>
                  </tr>
                  <tr className="bg-gray-50 border border-gray-300">
                    <td className="border border-gray-300 px-4 py-2 text-gray-700"><strong>Referendum</strong></td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">As needed</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">Constitutional or major policy questions</td>
                  </tr>
                </tbody>
              </table>

              <div className="space-y-4">
                <div className="bg-violet-50 border-l-4 border-violet-600 p-4 rounded">
                  <h3 className="font-bold text-gray-900 mb-2">General Elections</h3>
                  <p className="text-gray-700">Held every 5 years nationwide, general elections allow Kenyans to simultaneously choose their President, Members of Parliament, Senators, County Governors, and County Assembly Members (MCAs). Multiple ballot papers are used for different races.</p>
                </div>

                <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded">
                  <h3 className="font-bold text-gray-900 mb-2">By-Elections</h3>
                  <p className="text-gray-700">Held to fill specific vacancies in Parliament or County Assemblies when a seat becomes vacant due to resignation, death, or disqualification. By-elections can occur at any time and affect only the specific constituency or county.</p>
                </div>

                <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded">
                  <h3 className="font-bold text-gray-900 mb-2">Referendums</h3>
                  <p className="text-gray-700">Conducted when constitutional amendments or major national policies require direct citizen approval. For example, a referendum was held in 2010 to ratify the new Constitution.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Electoral Process */}
          <section id="electoral-process" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-fuchsia-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Step-by-Step Electoral Process</h2>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">Kenya's electoral process follows a structured timeline from election announcement through result declaration.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 text-white font-bold text-lg shadow-md">1</div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-2">📢 Election Announcement</h4>
                      <p className="text-gray-700 leading-relaxed">The President typically announces general elections at least 60 days in advance. This announcement triggers the electoral calendar and begins election preparations.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-cyan-50 to-teal-50 border-2 border-cyan-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-cyan-600 to-teal-600 text-white font-bold text-lg shadow-md">2</div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-2">📝 <a href="/how-to-register-as-a-voter-kenya" className="text-cyan-600 hover:text-cyan-700">Voter Registration Period</a></h4>
                      <p className="text-gray-700 leading-relaxed">IEBC opens voter registration for new and updated registrations. Registration typically closes 60 days before election day. Citizens must register to be eligible to vote.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-lg shadow-md">3</div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-2">👥 Candidate Nomination</h4>
                      <p className="text-gray-700 leading-relaxed">Political parties nominate candidates for presidential, parliamentary, and county positions through internal primary elections. <a href="/political-parties-registration-kenya" className="text-blue-600 hover:text-blue-700">Registered political parties</a> submit their candidates to IEBC for vetting and approval.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold text-lg shadow-md">4</div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-2">📣 Campaign Period</h4>
                      <p className="text-gray-700 leading-relaxed">Begins after candidate approval and typically runs for about 60 days until 48 hours before election day. Candidates and political parties campaign publicly, hold rallies, debates, and meet voters. Media coverage increases significantly during this period.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-emerald-600 to-green-600 text-white font-bold text-lg shadow-md">5</div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-2">⚙️ Election Day Preparations</h4>
                      <p className="text-gray-700 leading-relaxed">IEBC prepares polling stations, prints ballots, trains election officials, and deploys security. Ballot papers are printed with security features. Election observers and monitors are accredited. IEBC tests all voting systems.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-amber-600 to-orange-600 text-white font-bold text-lg shadow-md">6</div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-2">🗳️ Voting Day</h4>
                      <p className="text-gray-700 leading-relaxed">Registered voters go to their assigned polling stations to cast votes. Voting is done by secret ballot in secure voting booths. Voters cast separate ballots for different races (President, MP, Governor, etc.). Voting typically runs from early morning to early evening.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-rose-50 to-red-50 border-2 border-rose-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-rose-600 to-red-600 text-white font-bold text-lg shadow-md">7</div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-2">🔢 Vote Tallying at Polling Stations</h4>
                      <p className="text-gray-700 leading-relaxed">After voting ends, polling officials count ballots at each polling station. Results are tallied for each race. Observers, party agents, and election officials witness the tallying. Results are publicly announced and recorded on tally forms.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-sky-50 to-blue-50 border-2 border-sky-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-sky-600 to-blue-600 text-white font-bold text-lg shadow-md">8</div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-2">📡 Results Transmission</h4>
                      <p className="text-gray-700 leading-relaxed">Results from polling stations are transmitted to constituency tallying centers (for parliamentary races) and national tallying centers (for presidential and county races). Electronic transmission is encrypted. Paper backup records are maintained for verification.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-bold text-lg shadow-md">9</div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-2">✅ Results Verification & Consolidation</h4>
                      <p className="text-gray-700 leading-relaxed">IEBC verifies submitted results against paper forms and tallying records. Any discrepancies are investigated. Results are consolidated at county and national levels. Verification typically takes several days to ensure accuracy.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 text-white font-bold text-lg shadow-md">10</div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-2">🏆 Result Declaration</h4>
                      <p className="text-gray-700 leading-relaxed">IEBC officially announces final verified results. The IEBC Chairperson publicly declares results for all races. Candidates can challenge results by filing petitions within prescribed timeframes if they believe there were irregularities.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: IEBC Role */}
          <section id="iebc-role" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <BarChart3 className="w-6 h-6 text-rose-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Role of IEBC in Ensuring Free & Fair Elections</h2>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">The <a href="/understanding-iebc-kenya" className="text-violet-600 hover:text-violet-700 font-medium">Independent Electoral and Boundaries Commission (IEBC)</a> plays a critical role in conducting Kenya's elections according to constitutional principles.</p>
              
              <div className="space-y-4">
                <div className="bg-rose-50 border-l-4 border-rose-600 p-4 rounded">
                  <h3 className="font-bold text-gray-900 mb-2">1. Election Administration</h3>
                  <p className="text-gray-700">IEBC prepares comprehensive election plans, establishes polling stations, trains election officials, and manages all election logistics. IEBC ensures that elections are conducted in accordance with constitutional and legal requirements.</p>
                </div>

                <div className="bg-rose-50 border-l-4 border-rose-600 p-4 rounded">
                  <h3 className="font-bold text-gray-900 mb-2">2. Voter Registration & Management</h3>
                  <p className="text-gray-700">IEBC maintains the voter register through continuous registration, manages registration centers, verifies voter eligibility, and maintains data security. IEBC ensures that only eligible voters can participate in elections.</p>
                </div>

                <div className="bg-rose-50 border-l-4 border-rose-600 p-4 rounded">
                  <h3 className="font-bold text-gray-900 mb-2">3. Candidate Vetting & Nomination</h3>
                  <p className="text-gray-700">IEBC receives candidate nominations from political parties, vets candidates for constitutional and legal compliance, and approves candidates who meet eligibility requirements. IEBC ensures that only qualified candidates appear on ballots.</p>
                </div>

                <div className="bg-rose-50 border-l-4 border-rose-600 p-4 rounded">
                  <h3 className="font-bold text-gray-900 mb-2">4. Election Observer Accreditation</h3>
                  <p className="text-gray-700">IEBC accredits election observers from international organizations, civil society, and domestic monitors. Observers monitor elections for fairness and transparency. IEBC coordinates with observers to ensure elections are observed and monitored.</p>
                </div>

                <div className="bg-rose-50 border-l-4 border-rose-600 p-4 rounded">
                  <h3 className="font-bold text-gray-900 mb-2">5. Security Coordination</h3>
                  <p className="text-gray-700">IEBC works with security agencies to ensure polling stations are secure, election materials are protected, and voting occurs without violence or intimidation. Security measures protect the integrity of the electoral process.</p>
                </div>

                <div className="bg-rose-50 border-l-4 border-rose-600 p-4 rounded">
                  <h3 className="font-bold text-gray-900 mb-2">6. Technology & Systems Management</h3>
                  <p className="text-gray-700">IEBC manages election technology systems including voter registration databases, result transmission systems, and tallying software. All systems are tested and secured to prevent manipulation and ensure accuracy.</p>
                </div>

                <div className="bg-rose-50 border-l-4 border-rose-600 p-4 rounded">
                  <h3 className="font-bold text-gray-900 mb-2">7. Results Management & Transparency</h3>
                  <p className="text-gray-700">IEBC receives, verifies, and consolidates election results from all polling stations. Results are verified against paper records. IEBC ensures transparency by publicly announcing results and allowing verification by candidates and observers.</p>
                </div>

                <div className="bg-rose-50 border-l-4 border-rose-600 p-4 rounded">
                  <h3 className="font-bold text-gray-900 mb-2">8. Dispute Resolution</h3>
                  <p className="text-gray-700">IEBC receives election complaints and disputes through Election Dispute Resolution Committees (EDRCs). IEBC investigates complaints and can refer serious issues to election courts for resolution.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6: Common Issues */}
          <section id="common-issues" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Common Issues During Elections & How They Are Addressed</h2>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">Despite careful planning, elections may face challenges. Here is how common issues are identified and addressed:</p>
              
              <div className="space-y-4">
                <div className="border-l-4 border-orange-600 bg-orange-50 p-4 rounded">
                  <h4 className="font-bold text-gray-900 mb-2">Issue: Long Queues at Polling Stations</h4>
                  <p className="text-gray-700 mb-2"><strong>Why it happens:</strong> High voter turnout or insufficient polling stations in some areas can cause long queues.</p>
                  <p className="text-gray-700"><strong>Solution:</strong> IEBC sets up additional polling stations, extends voting hours if necessary, and ensures adequate staffing to manage voter flow efficiently.</p>
                </div>

                <div className="border-l-4 border-orange-600 bg-orange-50 p-4 rounded">
                  <h4 className="font-bold text-gray-900 mb-2">Issue: Voter Confusion About Polling Locations</h4>
                  <p className="text-gray-700 mb-2"><strong>Why it happens:</strong> Voters may not know where their assigned polling station is located.</p>
                  <p className="text-gray-700"><strong>Solution:</strong> IEBC conducts voter education campaigns, publishes polling station locations, and provides SMS services where voters can check their polling station by texting their ID number.</p>
                </div>

                <div className="border-l-4 border-orange-600 bg-orange-50 p-4 rounded">
                  <h4 className="font-bold text-gray-900 mb-2">Issue: Missing or Spoiled Ballot Papers</h4>
                  <p className="text-gray-700 mb-2"><strong>Why it happens:</strong> Printing delays, transportation issues, or accidental damage can result in shortage of ballots.</p>
                  <p className="text-gray-700"><strong>Solution:</strong> IEBC prints extra ballots as backup. If ballots run out at a polling station, IEBC can deliver additional ballots or extend voting hours. In extreme cases, supplementary elections can be held.</p>
                </div>

                <div className="border-l-4 border-orange-600 bg-orange-50 p-4 rounded">
                  <h4 className="font-bold text-gray-900 mb-2">Issue: Election Official Misconduct</h4>
                  <p className="text-gray-700 mb-2"><strong>Why it happens:</strong> Dishonest officials may attempt to manipulate votes or violate procedures.</p>
                  <p className="text-gray-700"><strong>Solution:</strong> IEBC trains officials on conduct standards, monitors their performance, accepts complaints from observers and candidates, and can remove or prosecute officials who violate rules. Election observers monitor official conduct.</p>
                </div>

                <div className="border-l-4 border-orange-600 bg-orange-50 p-4 rounded">
                  <h4 className="font-bold text-gray-900 mb-2">Issue: Violence or Intimidation at Polling Stations</h4>
                  <p className="text-gray-700 mb-2"><strong>Why it happens:</strong> Political tensions or attempts to prevent certain groups from voting.</p>
                  <p className="text-gray-700"><strong>Solution:</strong> Security personnel are deployed at all polling stations. IEBC can temporarily close stations if violence erupts. Perpetrators can be prosecuted. International observers monitor for violence.</p>
                </div>

                <div className="border-l-4 border-orange-600 bg-orange-50 p-4 rounded">
                  <h4 className="font-bold text-gray-900 mb-2">Issue: Results Discrepancies</h4>
                  <p className="text-gray-700 mb-2"><strong>Why it happens:</strong> Errors in tallying, transmission problems, or disagreements between different records.</p>
                  <p className="text-gray-700"><strong>Solution:</strong> IEBC compares paper records with transmitted results. Discrepancies are investigated. If results don't match, papers records are used as verification. Candidates can file petitions if they believe results are incorrect.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 7: Citizens' Rights */}
          <section id="rights" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Citizens' Rights During Elections</h2>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">Every Kenyan citizen has important rights and protections during elections:</p>
              
              <div className="space-y-3 text-gray-700 mb-6">
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900">Right to Vote</h4>
                    <p>Every registered Kenyan citizen aged 18+ has the right to vote in elections held in their constituency.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900">Right to Vote Secretly</h4>
                    <p>Voting is done in private voting booths where no one can see or influence your choices.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900">Right to Vote Freely</h4>
                    <p>No one can force you to vote for a particular candidate. Your choice is your own.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900">Right to Access Voting Information</h4>
                    <p>IEBC must provide information about polling locations, voting procedures, and candidates.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900">Right to Vote Without Discrimination</h4>
                    <p>You cannot be denied the right to vote based on gender, ethnicity, religion, disability, or other characteristics.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900">Right to Assistance</h4>
                    <p>If you have a disability or cannot read/write, you have the right to request assistance when voting.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900">Right to Observe Elections</h4>
                    <p>You can volunteer as an election observer to monitor elections and ensure they are fair.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900">Right to Lodge Complaints</h4>
                    <p>If you believe election procedures were violated, you can file complaints with IEBC or election courts.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900">Right to Challenge Results</h4>
                    <p>If you believe election results are incorrect, you or your candidate can petition election courts for review.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Key Highlights Section - Visual Summary */}
          <section className="mb-12">
            <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 rounded-2xl p-8 shadow-2xl text-white">
              <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-center">🗳️ Key Highlights: Kenya Elections 2027</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition">
                  <div className="text-4xl mb-3">📅</div>
                  <h4 className="font-bold text-lg mb-2">Election Date</h4>
                  <p className="text-sm text-violet-100">Second Tuesday of August 2027 (Estimated: August 10, 2027)</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition">
                  <div className="text-4xl mb-3">👥</div>
                  <h4 className="font-bold text-lg mb-2">Who Can Vote</h4>
                  <p className="text-sm text-violet-100">All Kenyan citizens aged 18+ who are registered voters</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition">
                  <div className="text-4xl mb-3">🏛️</div>
                  <h4 className="font-bold text-lg mb-2">Positions Elected</h4>
                  <p className="text-sm text-violet-100">President, MPs, Senators, Governors, Women Reps, MCAs</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition">
                  <div className="text-4xl mb-3">⚖️</div>
                  <h4 className="font-bold text-lg mb-2">Electoral Body</h4>
                  <p className="text-sm text-violet-100">Independent Electoral & Boundaries Commission (IEBC)</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition">
                  <div className="text-4xl mb-3">📜</div>
                  <h4 className="font-bold text-lg mb-2">Governing Laws</h4>
                  <p className="text-sm text-violet-100">Constitution 2010, IEBC Act, Elections Act, Election Operations Act</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition">
                  <div className="text-4xl mb-3">🔒</div>
                  <h4 className="font-bold text-lg mb-2">Voting Method</h4>
                  <p className="text-sm text-violet-100">Secret ballot with biometric verification at polling stations</p>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-violet-100 text-sm mb-4">Your vote is your voice. Make it count in 2027.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a href="/how-to-register-as-a-voter-kenya" className="bg-white text-violet-600 px-6 py-3 rounded-lg font-semibold hover:bg-violet-50 transition inline-block">
                    Register to Vote →
                  </a>
                  <a href="/how-to-check-voter-status-kenya" className="bg-violet-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-violet-400 transition inline-block">
                    Check Voter Status →
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Section 8: FAQs */}
          <section id="faqs" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <MessageSquare className="w-6 h-6 text-violet-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Frequently Asked Questions About Elections in Kenya</h2>
            </div>
            <div className="space-y-3 mt-6">
              {faqsData.map((faq: FAQItem) => (
                <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full px-4 py-4 flex items-center justify-between hover:bg-violet-50 transition bg-white"
                  >
                    <span className="text-left font-semibold text-gray-900 text-sm sm:text-base">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-violet-600 flex-shrink-0 transition-transform ${
                        expandedFAQ === faq.id ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedFAQ === faq.id && (
                    <div className="px-4 py-4 bg-violet-50 border-t border-gray-200">
                      <p className="text-gray-700 text-sm sm:text-base">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="mt-12 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg p-8 border border-violet-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Participate in Kenya's Democratic Elections</h3>
            <p className="text-gray-700 mb-6">Elections are fundamental to Kenya's democracy. Every vote counts. Make sure you are registered, stay informed, and exercise your right to vote.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="/how-to-register-as-a-voter-kenya" className="bg-violet-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-violet-700 transition flex items-center justify-center gap-2">
                Register to Vote <ArrowRight className="w-5 h-5" />
              </a>
              <a href="/how-to-check-voter-status-kenya" className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2">
                Check Voter Status <CheckCircle className="w-5 h-5" />
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
                <li><a href="/understanding-iebc-kenya" className="hover:text-violet-400 transition">Understanding IEBC</a></li>
                <li><a href="/how-to-register-as-a-voter-kenya" className="hover:text-violet-400 transition">Register as a Voter</a></li>
                <li><a href="/how-to-check-voter-status-kenya" className="hover:text-violet-400 transition">Check Voter Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Contact Us</h4>
              <p className="text-sm mb-2">Email: <a href="mailto:johnsonthuraniramwangi@gmail.com" className="text-violet-400 hover:text-violet-300">johnsonthuraniramwangi@gmail.com</a></p>
              <p className="text-sm">WhatsApp: <a href="https://wa.me/254112810203" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300">+254 112 810 203</a></p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Official Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://www.iebc.or.ke" target="_blank" rel="noopener noreferrer" className="hover:text-violet-400 transition">IEBC Website</a></li>
                <li><a href="https://www.iebc.or.ke/elections/" target="_blank" rel="noopener noreferrer" className="hover:text-violet-400 transition">Elections Information</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-sm">
            <p className="mb-2">© 2026 Wakili. All rights reserved.</p>
            <p className="text-gray-500">This is an informational resource. Always refer to official <a href="https://www.iebc.or.ke" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300">IEBC sources</a> for official election information.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}