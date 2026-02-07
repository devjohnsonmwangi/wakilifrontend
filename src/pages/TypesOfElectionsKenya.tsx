import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Vote, Users, Building2, CheckCircle, AlertCircle, Scale, BarChart3 } from 'lucide-react';

// FAQ Data
const faqs = [
  {
    question: "What are the main types of elections in Kenya?",
    answer: "Kenya has three main types of elections: Presidential Elections (to elect the President and Deputy President), Parliamentary Elections (to elect Members of Parliament and Senators), and County Elections (to elect Governors, Deputy Governors, and Members of County Assemblies)."
  },
  {
    question: "How often are elections held in Kenya?",
    answer: "General elections in Kenya are held every 5 years on the second Tuesday of August. All three types of elections (Presidential, Parliamentary, and County) occur simultaneously during general elections. By-elections can occur at any time to fill vacancies."
  },
  {
    question: "What is the difference between Presidential and Parliamentary elections?",
    answer: "Presidential elections involve electing the President and Deputy President as a ticket, requiring a 50%+1 majority nationwide plus 25% in at least half of counties. Parliamentary elections involve electing individual representatives (MPs and Senators) for constituencies and counties, requiring only a simple majority in their specific area."
  },
  {
    question: "Can I vote in all three types of elections?",
    answer: "Yes, if you are a registered voter in Kenya. During general elections, you receive separate ballot papers for Presidential, Parliamentary (MP and Senator), and County elections (Governor and MCA), allowing you to vote in all races."
  },
  {
    question: "What happens if no presidential candidate wins in the first round?",
    answer: "If no presidential candidate achieves 50%+1 of votes and at least 25% in half of Kenya's counties in the first round, a presidential run-off is held within 60 days between the top two candidates. The winner of the run-off becomes President."
  },
  {
    question: "How are Members of Parliament elected?",
    answer: "Members of Parliament (MPs) are elected through a simple majority vote in their constituency. The candidate who receives the most votes in a constituency wins the seat. Kenya has 290 constituencies, each electing one MP."
  },
  {
    question: "What is the role of Senators vs Members of Parliament?",
    answer: "Senators represent counties (47 Senators total) and protect county interests in the national legislature. MPs represent constituencies (290 total) and enact national laws. Both are part of Parliament but serve different representative functions."
  },
  {
    question: "How are County Governors elected?",
    answer: "County Governors are elected alongside their Deputy Governors as a ticket, similar to the presidential election. They require a simple majority of votes in their county to win. There are 47 county governor positions."
  },
  {
    question: "What are Members of County Assembly (MCAs)?",
    answer: "MCAs are elected representatives at the ward level who form the County Assembly. They enact county legislation, approve county budgets, and oversee county government operations. Each county has multiple wards and MCAs."
  },
  {
    question: "Can independent candidates run in all types of elections?",
    answer: "Yes, independent candidates can run for all elective positions including President, MP, Senator, Governor, and MCA. They must meet the same eligibility requirements and nomination procedures as party-sponsored candidates."
  },
  {
    question: "How does IEBC ensure fair elections across all types?",
    answer: "IEBC ensures fairness through: voter registration verification, candidate vetting, transparent ballot printing, secure voting processes, public tallying with agent oversight, electronic and paper result transmission, results verification, and addressing complaints and disputes."
  },
  {
    question: "What is the gender rule in Kenyan elections?",
    answer: "The Constitution requires that no more than two-thirds of elective or appointive bodies should be of the same gender. Special women representative seats (47) and nominated positions help achieve gender balance in Parliament and County Assemblies."
  },
  {
    question: "How are election results declared for different positions?",
    answer: "Presidential results are declared by the IEBC Chairperson at the National Tallying Center. Parliamentary results (MPs) are declared by Returning Officers at constituency centers. Senate and county results are declared at county tallying centers. All results must be verified before declaration."
  },
  {
    question: "Can election results be challenged?",
    answer: "Yes, candidates can petition election results in court within 7 days for presidential elections and within prescribed timeframes for other positions. The Supreme Court handles presidential petitions, while the High Court handles parliamentary and county election petitions."
  },
  {
    question: "What documents do I need to vote in all elections?",
    answer: "You need a valid national ID or passport to vote. You must also be a registered voter and appear on the voters' roll. You can check your voter registration status online or at IEBC offices before election day."
  }
];

const TypesOfElectionsKenya: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<string>('overview');

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'presidential', 'parliamentary', 'county', 'iebc-role', 'challenges', 'rights', 'faqs'];
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

  const metaTitle = 'Presidential, Parliamentary & County Elections Explained – Kenya Guide';
  const metaDescription = 'Complete guide to Kenya\'s elections: Presidential, Parliamentary, and County elections explained. Learn how elections work, voting process, IEBC procedures, and your rights.';

  useEffect(() => {
    // Set page title and meta description
    document.title = metaTitle;
    
    const metaDescriptionTag = document.querySelector('meta[name="description"]');
    if (metaDescriptionTag) {
      metaDescriptionTag.setAttribute('content', metaDescription);
    }

    // Set OpenGraph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', metaTitle);
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute('content', metaDescription);

    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex text-sm text-gray-600">
              <Link to="/" className="hover:text-violet-600">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">Types of Elections in Kenya</span>
            </nav>
          </div>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Presidential, Parliamentary & County Elections Explained – Kenya Guide</h1>
            <p className="text-lg sm:text-xl text-violet-100 max-w-3xl">Comprehensive guide to understanding Kenya's electoral system: Presidential, Parliamentary, and County elections explained with voting processes, IEBC procedures, and citizens' rights.</p>
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
                    <BarChart3 className="w-5 h-5 text-violet-600" />
                    Quick Navigation
                  </h3>
                  <nav className="space-y-2">
                    {[
                      { id: 'overview', label: 'Overview', icon: Vote },
                      { id: 'presidential', label: 'Presidential Elections', icon: Users },
                      { id: 'parliamentary', label: 'Parliamentary Elections', icon: Building2 },
                      { id: 'county', label: 'County Elections', icon: Building2 },
                      { id: 'iebc-role', label: 'IEBC Role', icon: CheckCircle },
                      { id: 'challenges', label: 'Common Challenges', icon: AlertCircle },
                      { id: 'rights', label: 'Citizens\' Rights', icon: Scale },
                      { id: 'faqs', label: 'FAQs', icon: Vote }
                    ].map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => scrollToSection(id)}
                        className={`w-full text-left px-3 py-2 rounded transition flex items-center gap-2 ${
                          activeSection === id
                            ? 'bg-violet-100 text-violet-700 font-medium'
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
                  <Vote className="w-6 h-6 text-violet-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Overview of Kenya's Electoral System</h2>
                </div>
                
                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6 text-lg leading-relaxed">Kenya operates a multi-tier democratic electoral system where citizens elect leaders at national and county levels. The <a href="/understanding-iebc-kenya" className="text-violet-600 hover:text-violet-700 font-medium">Independent Electoral and Boundaries Commission (IEBC)</a> conducts all elections in Kenya, ensuring they are free, fair, transparent, and credible according to the Constitution of Kenya 2010.</p>

                  {/* Statistics Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                      <div className="text-3xl font-bold text-violet-700 mb-2">3</div>
                      <div className="text-gray-900 font-semibold mb-1">Types of Elections</div>
                      <div className="text-sm text-gray-600">Presidential, Parliamentary, County</div>
                    </div>
                    <div className="bg-gradient-to-br from-cyan-50 to-teal-50 border-2 border-cyan-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                      <div className="text-3xl font-bold text-cyan-700 mb-2">6</div>
                      <div className="text-gray-900 font-semibold mb-1">Elective Positions</div>
                      <div className="text-sm text-gray-600">President, MP, Senator, Governor, DG, MCA</div>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                      <div className="text-3xl font-bold text-emerald-700 mb-2">5 Years</div>
                      <div className="text-gray-900 font-semibold mb-1">Election Cycle</div>
                      <div className="text-sm text-gray-600">General elections every 5 years</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-600 p-6 rounded-lg shadow-sm mb-6">
                    <h3 className="font-bold text-gray-900 text-lg mb-3">🗳️ Kenya's Three Electoral Tiers</h3>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                        <div>
                          <p className="font-semibold text-gray-900">Presidential Elections</p>
                          <p className="text-gray-700 text-sm">National level – Elect President and Deputy President as a running mate ticket</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                        <div>
                          <p className="font-semibold text-gray-900">Parliamentary Elections</p>
                          <p className="text-gray-700 text-sm">National representation – Elect Members of Parliament (290 constituencies) and Senators (47 counties)</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
                        <div>
                          <p className="font-semibold text-gray-900">County Elections</p>
                          <p className="text-gray-700 text-sm">County level – Elect Governors, Deputy Governors, and Members of County Assembly (MCAs) in 47 counties</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Image: Three Types of Elections Diagram */}
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-8 border-2 border-purple-300 shadow-lg my-8">
                    <h3 className="font-bold text-gray-900 text-lg mb-6 text-center">🗳️ Kenya's Three Simultaneous Elections</h3>
                    <svg className="w-full h-96 mx-auto" viewBox="0 0 400 320" xmlns="http://www.w3.org/2000/svg">
                      {/* Presidential Box */}
                      <rect x="20" y="20" width="110" height="100" fill="#fce7f3" stroke="#be185d" strokeWidth="2" rx="6"/>
                      <circle cx="75" cy="45" r="15" fill="#be185d"/>
                      <text x="75" y="50" fontSize="20" fill="white" textAnchor="middle">👤</text>
                      <text x="75" y="80" fontSize="11" fontWeight="bold" fill="#831843" textAnchor="middle">Presidential</text>
                      <text x="75" y="93" fontSize="10" fill="#be185d" textAnchor="middle">&amp; Deputy</text>
                      <text x="75" y="106" fontSize="9" fill="#9d174d" textAnchor="middle">National Level</text>
                      
                      {/* Parliamentary Box */}
                      <rect x="145" y="20" width="110" height="100" fill="#dbeafe" stroke="#0284c7" strokeWidth="2" rx="6"/>
                      <circle cx="200" cy="45" r="15" fill="#0284c7"/>
                      <text x="200" y="50" fontSize="20" fill="white" textAnchor="middle">👥</text>
                      <text x="200" y="80" fontSize="11" fontWeight="bold" fill="#0c2d48" textAnchor="middle">Parliamentary</text>
                      <text x="200" y="93" fontSize="10" fill="#0284c7" textAnchor="middle">MPs (290) &amp;</text>
                      <text x="200" y="106" fontSize="9" fill="#075985" textAnchor="middle">Senators (47)</text>
                      
                      {/* County Box */}
                      <rect x="270" y="20" width="110" height="100" fill="#d1fae5" stroke="#059669" strokeWidth="2" rx="6"/>
                      <circle cx="325" cy="45" r="15" fill="#059669"/>
                      <text x="325" y="50" fontSize="20" fill="white" textAnchor="middle">🏛️</text>
                      <text x="325" y="80" fontSize="11" fontWeight="bold" fill="#064e3b" textAnchor="middle">County</text>
                      <text x="325" y="93" fontSize="10" fill="#059669" textAnchor="middle">Governors &amp;</text>
                      <text x="325" y="106" fontSize="9" fill="#065f46" textAnchor="middle">MCAs</text>
                      
                      {/* Ballot Box Container */}
                      <rect x="50" y="140" width="300" height="160" fill="#f3f4f6" stroke="#374151" strokeWidth="2" rx="8"/>
                      
                      {/* Ballot Box */}
                      <rect x="70" y="155" width="260" height="100" fill="white" stroke="#4b5563" strokeWidth="2" rx="6"/>
                      
                      {/* Slot */}
                      <rect x="185" y="145" width="30" height="15" fill="#4b5563" rx="2"/>
                      
                      {/* Checkmarks */}
                      <text x="130" y="210" fontSize="36" fill="#059669" textAnchor="middle" fontWeight="bold">✓</text>
                      <text x="200" y="210" fontSize="36" fill="#0284c7" textAnchor="middle" fontWeight="bold">✓</text>
                      <text x="270" y="210" fontSize="36" fill="#be185d" textAnchor="middle" fontWeight="bold">✓</text>
                      
                      {/* Bottom Labels */}
                      <text x="200" y="280" fontSize="13" fill="#374151" textAnchor="middle" fontWeight="bold">VOTER BALLOT</text>
                      <text x="200" y="298" fontSize="11" fill="#6b7280" textAnchor="middle">All elections on ONE ballot every 5 years</text>
                      <text x="200" y="313" fontSize="10" fill="#6b7280" textAnchor="middle">General elections held 2nd Tuesday of August</text>
                    </svg>
                  </div>

                  <p className="text-gray-700 mb-4">All three types of elections occur simultaneously during general elections held every 5 years on the <strong>second Tuesday of August</strong>. Voters receive separate ballot papers for each race, allowing them to vote for different candidates across different positions. This guide explains each election type in detail to help Kenyan citizens understand their voting rights and electoral processes.</p>
                </div>
              </section>

              {/* Section 2: Presidential Elections */}
              <section id="presidential" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Users className="w-6 h-6 text-rose-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Presidential Elections in Kenya</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Presidential elections in Kenya determine who leads the nation as President and Deputy President. This is the highest political office in Kenya, and the election process is carefully regulated to ensure legitimacy and public confidence.</p>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">Eligibility Criteria for Presidential Candidates</h3>
                  
                  <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-violet-600 to-purple-600 text-white">
                        <tr>
                          <th className="px-6 py-4 text-left font-semibold">Requirement</th>
                          <th className="px-6 py-4 text-left font-semibold">Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Citizenship</td>
                          <td className="px-6 py-4 text-gray-700">Must be a Kenyan citizen by birth</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Age</td>
                          <td className="px-6 py-4 text-gray-700">At least 35 years old</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Education</td>
                          <td className="px-6 py-4 text-gray-700">Holder of a university degree recognized in Kenya</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Voter Registration</td>
                          <td className="px-6 py-4 text-gray-700">Must be a registered voter</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Support Requirement</td>
                          <td className="px-6 py-4 text-gray-700">Nomination by a political party OR support of at least 2,000 registered voters from each of at least half (24) of Kenya's 47 counties</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Running Mate</td>
                          <td className="px-6 py-4 text-gray-700">Must nominate a Deputy President running mate who meets similar eligibility criteria</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Integrity</td>
                          <td className="px-6 py-4 text-gray-700">Must satisfy Chapter Six of the Constitution on leadership and integrity (no criminal convictions, tax compliance, etc.)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">Presidential Election Process</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 text-white font-bold text-lg shadow-md">1</div>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg mb-2">📝 Candidate Nomination</h4>
                          <p className="text-gray-700 leading-relaxed">Presidential candidates are nominated by <a href="/political-parties-registration-kenya" className="text-violet-600 hover:text-violet-700">registered political parties</a> or run as independents. They must submit nomination papers to IEBC with required signatures and documents.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-cyan-50 to-teal-50 border-2 border-cyan-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-cyan-600 to-teal-600 text-white font-bold text-lg shadow-md">2</div>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg mb-2">✅ IEBC Vetting</h4>
                          <p className="text-gray-700 leading-relaxed">IEBC vets all presidential candidates to ensure they meet constitutional requirements. This includes verification of citizenship, education credentials, integrity clearances, and support signatures.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-lg shadow-md">3</div>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg mb-2">📣 Campaign Period</h4>
                          <p className="text-gray-700 leading-relaxed">Approved candidates campaign across Kenya for approximately 60 days. Presidential debates are organized by media houses, and candidates present their manifestos to voters.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-amber-600 to-orange-600 text-white font-bold text-lg shadow-md">4</div>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg mb-2">🗳️ Voting Day</h4>
                          <p className="text-gray-700 leading-relaxed">Registered voters cast presidential ballots at polling stations. Voting is by secret ballot. Voters mark their choice on a specially designed presidential ballot paper.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">How Presidential Results Are Determined</h3>

                  <div className="bg-gradient-to-r from-rose-50 to-pink-50 border-l-4 border-rose-600 p-6 rounded-lg shadow-sm mb-6">
                    <h4 className="font-bold text-gray-900 text-lg mb-3">🏆 Winning Requirements (Constitution Article 138)</h4>
                    <div className="space-y-3">
                      <div className="flex gap-3 items-start">
                        <CheckCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-900">More than 50% of Valid Votes Cast</p>
                          <p className="text-gray-700 text-sm">The winning candidate must receive more than half of all valid votes cast nationwide (50% + 1 vote minimum)</p>
                        </div>
                      </div>
                      <div className="flex gap-3 items-start">
                        <CheckCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-900">At Least 25% in Half of Counties</p>
                          <p className="text-gray-700 text-sm">The candidate must also receive at least 25% of votes cast in at least 24 of Kenya's 47 counties</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 border-l-4 border-amber-600 p-5 rounded mb-6">
                    <p className="text-gray-900 font-semibold mb-2">⚡ Presidential Run-Off</p>
                    <p className="text-gray-700">If no candidate meets both requirements in the first round, a presidential run-off is held within 60 days between the top two candidates. The candidate with the most votes in the run-off wins and is declared President-elect.</p>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">Result Declaration Process</h3>

                  <div className="space-y-4">
                    <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">Polling Station Results</p>
                          <p className="text-gray-700 text-sm">After voting closes, results are tallied at each polling station and announced publicly with party agents present.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">Transmission to National Tallying Center</p>
                          <p className="text-gray-700 text-sm">Results are transmitted electronically and physically to the National Tallying Center at Bomas of Kenya (or designated center).</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">Verification and Consolidation</p>
                          <p className="text-gray-700 text-sm">IEBC verifies results from all 47 counties against physical Forms 34A and 34B. Any discrepancies are investigated.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">4</div>
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">Official Declaration</p>
                          <p className="text-gray-700 text-sm">The IEBC Chairperson officially <a href="/election-results-declaration-kenya" className="text-emerald-600 hover:text-emerald-700">declares the presidential results</a> publicly and announces the President-elect.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 3: Parliamentary Elections */}
              <section id="parliamentary" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Building2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Parliamentary Elections in Kenya</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Parliamentary elections in Kenya involve electing representatives to the National Assembly and the Senate. These two houses form Kenya's bicameral Parliament responsible for enacting national legislation and oversight of government.</p>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">Two Categories of Parliamentary Elections</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 p-6 rounded-xl shadow-md">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">MP</div>
                        <h4 className="text-xl font-bold text-gray-900">Members of Parliament</h4>
                      </div>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" /> <span>290 elected MPs (one per constituency)</span></li>
                        <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" /> <span>47 Women Representatives (one per county)</span></li>
                        <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" /> <span>12 nominated members for special interests</span></li>
                        <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" /> <span>Represent constituencies</span></li>
                        <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" /> <span>Enact national legislation</span></li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 p-6 rounded-xl shadow-md">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">SN</div>
                        <h4 className="text-xl font-bold text-gray-900">Senators</h4>
                      </div>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" /> <span>47 elected Senators (one per county)</span></li>
                        <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" /> <span>16 Women Senators (nominated)</span></li>
                        <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" /> <span>2 Youth Representatives (nominated)</span></li>
                        <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" /> <span>2 Persons with Disabilities (nominated)</span></li>
                        <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" /> <span>Represent and protect county interests</span></li>
                      </ul>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">Member of Parliament (MP) Elections</h3>

                  <p className="text-gray-700 mb-4">MPs are elected at the constituency level. Kenya has 290 constituencies, each electing one Member of Parliament to the National Assembly.</p>

                  <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                        <tr>
                          <th className="px-6 py-4 text-left font-semibold">Aspect</th>
                          <th className="px-6 py-4 text-left font-semibold">Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Eligibility</td>
                          <td className="px-6 py-4 text-gray-700">Kenyan citizen, at least 21 years old, registered voter, holder of degree from recognized university, meets integrity requirements</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Nomination</td>
                          <td className="px-6 py-4 text-gray-700">By political party or as independent candidate</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Voting Method</td>
                          <td className="px-6 py-4 text-gray-700">First-past-the-post (simple majority)</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">How to Win</td>
                          <td className="px-6 py-4 text-gray-700">Candidate with the most votes in the constituency wins</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Result Declaration</td>
                          <td className="px-6 py-4 text-gray-700">Returning Officer declares results at constituency tallying center</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">Senator Elections</h3>

                  <p className="text-gray-700 mb-4">Senators are elected at the county level. Each of Kenya's 47 counties elects one Senator to the Senate.</p>

                  <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                        <tr>
                          <th className="px-6 py-4 text-left font-semibold">Aspect</th>
                          <th className="px-6 py-4 text-left font-semibold">Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Eligibility</td>
                          <td className="px-6 py-4 text-gray-700">Kenyan citizen, at least 21 years old, registered voter, holder of degree from recognized university, meets integrity requirements</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Nomination</td>
                          <td className="px-6 py-4 text-gray-700">By political party or as independent candidate</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Voting Method</td>
                          <td className="px-6 py-4 text-gray-700">First-past-the-post (simple majority)</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">How to Win</td>
                          <td className="px-6 py-4 text-gray-700">Candidate with the most votes in the county wins</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Result Declaration</td>
                          <td className="px-6 py-4 text-gray-700">County Returning Officer declares results at county tallying center</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-gradient-to-r from-cyan-50 to-teal-50 border-l-4 border-cyan-600 p-6 rounded-lg shadow-sm mb-6">
                    <h4 className="font-bold text-gray-900 text-lg mb-3">🔍 Difference Between MPs and Senators</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-semibold text-gray-900 mb-2">Members of Parliament (MPs):</p>
                        <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                          <li>Represent constituencies (smaller areas)</li>
                          <li>Focus on national legislation</li>
                          <li>290 elected constituencies</li>
                          <li>Part of National Assembly</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-2">Senators:</p>
                        <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                          <li>Represent counties (larger regions)</li>
                          <li>Protect county interests and devolution</li>
                          <li>47 elected (one per county)</li>
                          <li>Part of Senate</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 4: County Elections */}
              <section id="county" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Building2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">County Elections in Kenya</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">County elections enable citizens to elect leaders who manage devolved functions at the county level. Kenya's 47 counties have their own governments responsible for health, agriculture, infrastructure, and other devolved services.</p>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">County Elective Positions</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-300 p-6 rounded-xl shadow-md">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">GV</div>
                        <h4 className="text-xl font-bold text-gray-900">County Governor</h4>
                      </div>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" /> <span>Chief executive of county government</span></li>
                        <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" /> <span>Runs with Deputy Governor as ticket</span></li>
                        <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" /> <span>Elected by simple majority in county</span></li>
                        <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" /> <span>Implements county laws and policies</span></li>
                        <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" /> <span>Manages county budget and services</span></li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 p-6 rounded-xl shadow-md">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">MCA</div>
                        <h4 className="text-xl font-bold text-gray-900">Members of County Assembly</h4>
                      </div>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" /> <span>Elected at ward level (smallest unit)</span></li>
                        <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" /> <span>Form County Assembly legislature</span></li>
                        <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" /> <span>Enact county laws and policies</span></li>
                        <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" /> <span>Approve county budgets</span></li>
                        <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" /> <span>Oversee county government operations</span></li>
                      </ul>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">Governor Election Process</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 text-white font-bold text-lg shadow-md">1</div>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg mb-2">📝 Eligibility & Nomination</h4>
                          <p className="text-gray-700 leading-relaxed text-sm">Candidate must be at least 21 years old, Kenyan citizen, registered voter, hold university degree, and meet integrity requirements. Nominated by party or run as independent.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-cyan-50 to-teal-50 border-2 border-cyan-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-cyan-600 to-teal-600 text-white font-bold text-lg shadow-md">2</div>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg mb-2">👥 Running Mate Selection</h4>
                          <p className="text-gray-700 leading-relaxed text-sm">Governor candidate must nominate a Deputy Governor running mate who also meets eligibility requirements. They run as a ticket and are elected together.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-lg shadow-md">3</div>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg mb-2">🗳️ Voting & Tallying</h4>
                          <p className="text-gray-700 leading-relaxed text-sm">County voters cast ballots for their preferred governor ticket. Votes are tallied at polling stations and transmitted to county tallying center.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-emerald-600 to-green-600 text-white font-bold text-lg shadow-md">4</div>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg mb-2">🏆 Result Declaration</h4>
                          <p className="text-gray-700 leading-relaxed text-sm">Ticket with simple majority (most votes) in the county wins. County Returning Officer declares governor-elect and deputy governor-elect.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">MCA (Ward Representative) Elections</h3>

                  <p className="text-gray-700 mb-4">MCAs are elected at the ward level, which is the smallest electoral unit in Kenya. Each ward elects one MCA to represent them in the County Assembly.</p>

                  <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
                        <tr>
                          <th className="px-6 py-4 text-left font-semibold">Aspect</th>
                          <th className="px-6 py-4 text-left font-semibold">Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Electoral Unit</td>
                          <td className="px-6 py-4 text-gray-700">Ward (sub-county division)</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Number of MCAs</td>
                          <td className="px-6 py-4 text-gray-700">Varies by county (typically 20-60 wards per county)</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Eligibility</td>
                          <td className="px-6 py-4 text-gray-700">At least 21 years old, registered voter, meets integrity requirements</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Education Requirement</td>
                          <td className="px-6 py-4 text-gray-700">None specified (unlike MPs, Senators, Governors)</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Voting Method</td>
                          <td className="px-6 py-4 text-gray-700">First-past-the-post (simple majority in ward)</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Result Declaration</td>
                          <td className="px-6 py-4 text-gray-700">Presiding Officer at ward tallying center</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-600 p-6 rounded-lg shadow-sm mb-6">
                    <h4 className="font-bold text-gray-900 text-lg mb-3">📊 County Government Structure</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs">1</div>
                        <div>
                          <p className="font-semibold text-gray-900">Executive Branch</p>
                          <p className="text-gray-700">Governor, Deputy Governor, County Executive Committee Members (appointed by Governor)</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs">2</div>
                        <div>
                          <p className="font-semibold text-gray-900">Legislative Branch</p>
                          <p className="text-gray-700">County Assembly composed of elected MCAs, special seat members, and Speaker</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs">3</div>
                        <div>
                          <p className="font-semibold text-gray-900">County Public Service Board</p>
                          <p className="text-gray-700">Manages county public service employment and HR matters</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 5: IEBC Role */}
              <section id="iebc-role" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How IEBC Ensures Free & Fair Elections</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">The <a href="/understanding-iebc-kenya" className="text-teal-600 hover:text-teal-700 font-medium">Independent Electoral and Boundaries Commission (IEBC)</a> is constitutionally mandated to conduct all elections in Kenya. Here's how IEBC ensures fairness across all three types of elections:</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border-l-4 border-teal-600 p-5 rounded-lg shadow-sm hover:shadow-md transition">
                      <h4 className="font-bold text-gray-900 mb-2 text-lg">1. Voter Registration & Verification</h4>
                      <p className="text-gray-700 text-sm">IEBC maintains a comprehensive <a href="/how-to-register-as-a-voter-kenya" className="text-teal-600 hover:text-teal-700">voter register</a> updated continuously. Voters can <a href="/how-to-check-voter-status-kenya" className="text-teal-600 hover:text-teal-700">verify their registration status</a> online or at IEBC offices.</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-blue-600 p-5 rounded-lg shadow-sm hover:shadow-md transition">
                      <h4 className="font-bold text-gray-900 mb-2 text-lg">2. Candidate Vetting & Clearance</h4>
                      <p className="text-gray-700 text-sm">All candidates for presidential, parliamentary, and county positions undergo thorough vetting to ensure they meet constitutional eligibility requirements including education, age, integrity, and citizenship.</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-l-4 border-purple-600 p-5 rounded-lg shadow-sm hover:shadow-md transition">
                      <h4 className="font-bold text-gray-900 mb-2 text-lg">3. Transparent Ballot Printing</h4>
                      <p className="text-gray-700 text-sm">IEBC prints ballot papers with security features and serial numbers. Ballots are printed separately for each race (Presidential, MP, Senator, Governor, MCA) and distributed securely to polling stations.</p>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-l-4 border-emerald-600 p-5 rounded-lg shadow-sm hover:shadow-md transition">
                      <h4 className="font-bold text-gray-900 mb-2 text-lg">4. Polling Station Management</h4>
                      <p className="text-gray-700 text-sm">IEBC trains presiding officers and clerks for each polling station. Polling stations are equipped with voter rolls, ballot boxes, indelible ink, and biometric voter verification devices.</p>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-l-4 border-amber-600 p-5 rounded-lg shadow-sm hover:shadow-md transition">
                      <h4 className="font-bold text-gray-900 mb-2 text-lg">5. Result Transmission & Tallying</h4>
                      <p className="text-gray-700 text-sm">Results are transmitted electronically and physically using Forms 34A (polling station), 34B (constituency), and 34C (presidential). Multi-layer verification ensures accuracy.</p>
                    </div>

                    <div className="bg-gradient-to-br from-rose-50 to-red-50 border-l-4 border-rose-600 p-5 rounded-lg shadow-sm hover:shadow-md transition">
                      <h4 className="font-bold text-gray-900 mb-2 text-lg">6. Dispute Resolution Mechanisms</h4>
                      <p className="text-gray-700 text-sm">IEBC has complaint handling procedures. Candidates can petition results in court. The Supreme Court handles presidential petitions, High Court handles other positions.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 6: Common Challenges */}
              <section id="challenges" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Common Challenges During Elections</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Despite robust systems, elections in Kenya face various challenges. Understanding these helps citizens and stakeholders work toward solutions.</p>

                  <div className="space-y-4">
                    <div className="bg-white border-l-4 border-orange-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">⚠️ Voter Apathy & Low Turnout</h4>
                      <p className="text-gray-700 text-sm mb-2">Some citizens don't vote due to disillusionment, lack of civic education, or logistical challenges.</p>
                      <p className="text-emerald-700 text-sm font-medium">Solution: Civic education campaigns, simplified <a href="/how-to-register-as-a-voter-kenya" className="text-emerald-600 hover:text-emerald-700">voter registration</a>, and accessible polling stations.</p>
                    </div>

                    <div className="bg-white border-l-4 border-orange-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">📊 Disputed Election Results</h4>
                      <p className="text-gray-700 text-sm mb-2">Candidates sometimes dispute results, leading to petitions and court cases that can delay final declarations.</p>
                      <p className="text-emerald-700 text-sm font-medium">Solution: Transparent tallying, results verification with party agents, and timely <a href="/election-results-declaration-kenya" className="text-emerald-600 hover:text-emerald-700">result declaration</a> processes.</p>
                    </div>

                    <div className="bg-white border-l-4 border-orange-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">🔒 Electoral Technology Challenges</h4>
                      <p className="text-gray-700 text-sm mb-2">Biometric voter verification devices (BVR) and electronic transmission systems can fail due to technical issues or poor connectivity in remote areas.</p>
                      <p className="text-emerald-700 text-sm font-medium">Solution: IEBC maintains manual backup systems (voter rolls, paper forms) to ensure voting continues even if technology fails.</p>
                    </div>

                    <div className="bg-white border-l-4 border-orange-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">💰 Campaign Finance & Resources</h4>
                      <p className="text-gray-700 text-sm mb-2">Unequal access to campaign resources can advantage wealthier candidates over qualified but less-funded opponents.</p>
                      <p className="text-emerald-700 text-sm font-medium">Solution: Political Parties Act regulates campaign finance. IEBC enforces spending limits and transparency requirements.</p>
                    </div>

                    <div className="bg-white border-l-4 border-orange-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">⚖️ Gender Imbalance</h4>
                      <p className="text-gray-700 text-sm mb-2">Women remain underrepresented in elective positions despite constitutional two-thirds gender rule requirements.</p>
                      <p className="text-emerald-700 text-sm font-medium">Solution: Special women representative seats (47 in Parliament), nominated positions, and political party efforts to nominate more women.</p>
                    </div>

                    <div className="bg-white border-l-4 border-orange-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">🌍 Voter Education Gaps</h4>
                      <p className="text-gray-700 text-sm mb-2">Some voters lack understanding of the electoral process, different ballot papers, or how to mark ballots correctly.</p>
                      <p className="text-emerald-700 text-sm font-medium">Solution: IEBC conducts voter education programs through media, community outreach, and partnerships with civil society organizations.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 7: Citizens' Rights */}
              <section id="rights" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Scale className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Citizens' Rights in Elections</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">The Constitution of Kenya guarantees all citizens fundamental rights during elections. These rights apply to all three types of elections (Presidential, Parliamentary, and County).</p>

                  <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-8 rounded-xl shadow-lg mb-6">
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                      <Scale className="w-7 h-7" />
                      Your Constitutional Electoral Rights
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        { icon: "✅", text: "Right to vote for candidates of your choice in all elections" },
                        { icon: "📝", text: "Right to register as a voter and access voter registration services" },
                        { icon: "🗳️", text: "Right to vote in secret without intimidation or coercion" },
                        { icon: "👥", text: "Right to stand for elective office if you meet eligibility requirements" },
                        { icon: "📢", text: "Right to campaign for candidates and participate in political activities" },
                        { icon: "🔍", text: "Right to observe the electoral process and witness vote counting" },
                        { icon: "⚖️", text: "Right to petition election results if you believe irregularities occurred" },
                        { icon: "📊", text: "Right to access election information, results, and IEBC reports" },
                        { icon: "🛡️", text: "Right to security and protection during the electoral process" },
                        { icon: "🚫", text: "Right to not be discriminated against based on gender, ethnicity, religion, or disability" }
                      ].map((right, index) => (
                        <div key={index} className="flex gap-3 items-start bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                          <span className="text-2xl flex-shrink-0">{right.icon}</span>
                          <span className="text-white/95 text-sm">{right.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-amber-50 border-l-4 border-amber-600 p-5 rounded mb-6">
                    <p className="text-gray-900 font-semibold mb-2">📞 Report Electoral Violations</p>
                    <p className="text-gray-700 text-sm">If your rights are violated or you witness electoral malpractice, report immediately to IEBC, election observers, or law enforcement. Document evidence (photos, videos, witness statements) when safe to do so.</p>
                  </div>
                </div>
              </section>

              {/* Section 8: FAQs */}
              <section id="faqs" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Vote className="w-6 h-6 text-violet-600 flex-shrink-0 mt-1" />
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
                          <ChevronUp className="w-5 h-5 text-violet-600 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-violet-600 flex-shrink-0" />
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
              <section className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white p-8 rounded-xl shadow-xl">
                <h3 className="text-2xl font-bold mb-4">Ready to Participate in Kenya's Democratic Process?</h3>
                <p className="mb-6 text-violet-100">Ensure you're registered and prepared for the next elections. Check your voter status and access essential election information.</p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/how-to-register-as-a-voter-kenya" className="bg-white text-violet-700 px-6 py-3 rounded-lg font-semibold hover:bg-violet-50 transition">
                    Register as Voter
                  </Link>
                  <Link to="/how-to-check-voter-status-kenya" className="bg-violet-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-violet-400 transition">
                    Check Voter Status
                  </Link>
                  <Link to="/elections-in-kenya" className="bg-violet-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-violet-600 transition">
                    View Election Calendar
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

export default TypesOfElectionsKenya;
