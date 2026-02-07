import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, BarChart3, CheckCircle2, AlertCircle, Users, FileText, TrendingUp, Shield } from 'lucide-react';

// FAQ Data
const faqs = [
  {
    question: "How long does it take for IEBC to declare official results?",
    answer: "IEBC typically declares results within 7-10 days after the election. Presidential results must be declared within 7 days according to the Constitution. The exact timeline depends on the number of votes to verify and any disputes that arise."
  },
  {
    question: "What is the difference between announced results and official results?",
    answer: "Announced results are preliminary totals broadcasted during tallying. Official results are the final verified numbers announced by IEBC after thorough verification against all physical forms and records. Only official results count legally."
  },
  {
    question: "How does IEBC prevent result manipulation?",
    answer: "IEBC uses multiple security layers: biometric voter verification, serial-numbered ballot papers, Forms 34A (polling station), 34B (constituency), and 34C (national level). Party agents witness tallying, results are transmitted both electronically and physically, and paper records are kept for verification."
  },
  {
    question: "Can election results be changed after being announced?",
    answer: "Official results can be challenged through court petitions if evidence of irregularities exists. Results declared by the IEBC Chairperson are final unless a court overturns them. Citizens have 7 days to file presidential election petitions."
  },
  {
    question: "What happens if votes don't match between electronic and physical records?",
    answer: "IEBC investigators examine the discrepancy. Physical forms are considered the official record since they're witnessed by party agents. If a significant difference is found, the result may be amended or the constituency's votes re-tallied."
  },
  {
    question: "How are results transmitted from polling stations?",
    answer: "Results are transmitted through two channels: 1) Electronic transmission via secure encrypted systems to county/national tallying centers, and 2) Physical transmission of Form 34A (polling station results) for verification and backup."
  },
  {
    question: "Who announces the final presidential results?",
    answer: "The IEBC Chairperson officially announces final presidential results at the National Tallying Center (usually Bomas of Kenya). The Chairperson declares the President-elect once all votes are verified and the winner meets the constitutional threshold."
  },
  {
    question: "How are parliamentary results different from presidential results?",
    answer: "Parliamentary results are declared at constituency level for MPs and at county level for Senators. Each Returning Officer declares MP and Senator results for their area. Presidential results are consolidated nationally and declared by the IEBC Chairperson."
  },
  {
    question: "What is the role of election observers in result verification?",
    answer: "Election observers from IEBC, international bodies, political parties, and civil society organizations witness vote tallying and result transmission. They ensure transparency and can raise concerns about irregularities or discrepancies they observe."
  },
  {
    question: "How do I verify that my vote was counted?",
    answer: "IEBC publishes detailed results at polling station level on their website. You can check your polling station's results to see the vote totals and verify the outcome. However, individual voter secrecy is maintained—your specific vote isn't tracked."
  },
  {
    question: "What happens if there's a tie in the results?",
    answer: "For presidential elections, a tie is resolved through a run-off election between the tied candidates. For parliamentary seats, the candidate with the highest vote total wins (a true tie is extremely rare). For governor elections, a simple majority determines the winner."
  },
  {
    question: "Are election results publicly accessible?",
    answer: "Yes, IEBC publishes all results on its website (www.iebc.or.ke) by polling station, constituency, county, and national level. Results are also available in various formats including downloadable datasets, making election data transparent and accessible."
  },
  {
    question: "Can I petition results at my polling station or constituency level?",
    answer: "Only official IEBC-declared results can be petitioned in court. Presidential results are petitioned at the Supreme Court, while parliamentary and county results are petitioned at the High Court within prescribed timeframes."
  },
  {
    question: "How many days do I have to file an election petition?",
    answer: "For presidential elections, candidates have 7 days from result declaration to file a petition at the Supreme Court. For parliamentary and county elections, the timeframe is typically 14 days, but specific rules vary by election type."
  },
  {
    question: "What happens during a manual recount?",
    answer: "If a petition is successful, courts may order a manual recount of ballots from specific areas. Ballots are physically recounted by court-appointed officials, and new results are calculated. This process is time-consuming and typically takes several weeks."
  }
];

const ElectionResultsDeclarationKenya: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<string>('overview');

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  useEffect(() => {
    const metaTitle = 'Election Results in Kenya – How They Are Declared & Verified';
    const metaDescription = 'Complete guide to election results declaration in Kenya. Learn how IEBC tallies, verifies, transmits and declares presidential, parliamentary and county election results.';

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
              "name": "Election Results Declaration",
              "item": "https://wakili.co.ke/election-results-declaration-kenya"
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
          "name": "How Election Results Are Declared in Kenya",
          "step": [
            {
              "@type": "HowToStep",
              "name": "Voting & Tallying",
              "text": "Votes are cast and immediately tallied at polling stations with witnesses present"
            },
            {
              "@type": "HowToStep",
              "name": "Results Transmission",
              "text": "Results are transmitted to constituency and county centers through electronic and physical channels"
            },
            {
              "@type": "HowToStep",
              "name": "Results Verification",
              "text": "IEBC verifies all results against physical forms to ensure accuracy"
            },
            {
              "@type": "HowToStep",
              "name": "Official Declaration",
              "text": "IEBC officially declares final verified results to the public"
            }
          ]
        },
        {
          "@type": "GovernmentService",
          "name": "Election Results Declaration and Verification",
          "serviceType": "Election Administration",
          "provider": {
            "@type": "GovernmentOrganization",
            "name": "Independent Electoral and Boundaries Commission (IEBC)",
            "url": "https://www.iebc.or.ke"
          },
          "areaServed": "Kenya",
          "availableLanguage": ["en"],
          "description": "Official declaration and verification of presidential, parliamentary, and county election results by IEBC"
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
      const sections = ['overview', 'vote-counting', 'verification', 'declaration', 'discrepancies', 'access', 'issues', 'faqs', 'rights'];
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
              <Link to="/" className="hover:text-violet-600">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">Election Results Declaration</span>
            </nav>
          </div>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Election Results in Kenya – How They Are Declared & Verified</h1>
            <p className="text-lg sm:text-xl text-emerald-100 max-w-3xl">Complete guide to understanding how IEBC tallies, verifies, transmits and officially declares election results for presidential, parliamentary, and county elections.</p>
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
                  <nav className="space-y-2">
                    {[
                      { id: 'overview', label: 'Overview', icon: BarChart3 },
                      { id: 'vote-counting', label: 'Vote Counting', icon: Users },
                      { id: 'verification', label: 'Verification', icon: CheckCircle2 },
                      { id: 'declaration', label: 'Declaration', icon: TrendingUp },
                      { id: 'discrepancies', label: 'Discrepancies', icon: AlertCircle },
                      { id: 'access', label: 'Access Results', icon: FileText },
                      { id: 'issues', label: 'Common Issues', icon: AlertCircle },
                      { id: 'faqs', label: 'FAQs', icon: BarChart3 },
                      { id: 'rights', label: 'Citizens\' Rights', icon: Shield }
                    ].map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => scrollToSection(id)}
                        className={`w-full text-left px-3 py-2 rounded transition flex items-center gap-2 ${
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
              {/* Section Overview with Image */}
              <section id="overview" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <BarChart3 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Overview of Election Results Process</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6 text-lg leading-relaxed">Election results declaration is one of the most critical phases of Kenya's electoral process. The <a href="/understanding-iebc-kenya" className="text-emerald-600 hover:text-emerald-700 font-medium">Independent Electoral and Boundaries Commission (IEBC)</a> is responsible for ensuring accurate, transparent, and timely result tallying, verification, and declaration.</p>

                  {/* Statistics Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                      <div className="text-3xl font-bold text-emerald-700 mb-2">7 Days</div>
                      <div className="text-gray-900 font-semibold mb-1">Presidential Results</div>
                      <div className="text-sm text-gray-600">Constitutional deadline for declaring presidential results</div>
                    </div>
                    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                      <div className="text-3xl font-bold text-cyan-700 mb-2">290 + 47</div>
                      <div className="text-gray-900 font-semibold mb-1">Electoral Constituencies</div>
                      <div className="text-sm text-gray-600">290 constituencies + 47 county senate seats to declare</div>
                    </div>
                    <div className="bg-gradient-to-br from-teal-50 to-green-50 border-2 border-teal-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                      <div className="text-3xl font-bold text-teal-700 mb-2">Multiple</div>
                      <div className="text-gray-900 font-semibold mb-1">Verification Layers</div>
                      <div className="text-sm text-gray-600">Electronic and physical verification for accuracy</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-l-4 border-emerald-600 p-6 rounded-lg shadow-sm mb-6">
                    <h3 className="font-bold text-gray-900 text-lg mb-3">📊 The Election Results Timeline</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                        <div>
                          <p className="font-semibold text-gray-900">Election Day: Voting & Tallying</p>
                          <p className="text-gray-700">Votes are cast and immediately tallied at polling stations</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                        <div>
                          <p className="font-semibold text-gray-900">Results Transmission (Day 1-2)</p>
                          <p className="text-gray-700">Results transmitted to constituency and county centers</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
                        <div>
                          <p className="font-semibold text-gray-900">Results Verification (Day 2-7)</p>
                          <p className="text-gray-700">IEBC verifies all results against physical forms</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">4</div>
                        <div>
                          <p className="font-semibold text-gray-900">Official Declaration (Day 7)</p>
                          <p className="text-gray-700">IEBC officially declares final verified results</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700">This guide explains each phase of the results declaration process, how IEBC ensures accuracy, how to access results, and what citizens should know about contesting results if needed.</p>
                </div>
              </section>

              {/* Section 2: Vote Counting */}
              <section id="vote-counting" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Users className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How Votes Are Counted</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Vote counting happens at polling stations immediately after voting closes. The process is witnessed by election officials, party agents, election observers, and members of the public.</p>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">Vote Counting Process at Polling Stations</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 text-white font-bold text-lg shadow-md">1</div>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg mb-2">🛑 Voting Closure</h4>
                          <p className="text-gray-700 leading-relaxed text-sm">Polling station officials close voting at the appointed time. Presiding Officer seals ballot boxes and records the number of ballots issued.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 text-white font-bold text-lg shadow-md">2</div>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg mb-2">📋 Ballot Box Opening</h4>
                          <p className="text-gray-700 leading-relaxed text-sm">Ballot boxes are opened one race at a time (Presidential first, then MP, Senator, Governor, MCA). Number of ballots is verified against ballots issued.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-teal-50 to-green-50 border-2 border-teal-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-teal-600 to-green-600 text-white font-bold text-lg shadow-md">3</div>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg mb-2">🔍 Vote Verification</h4>
                          <p className="text-gray-700 leading-relaxed text-sm">Each ballot is examined to ensure it's marked correctly. Invalid or contested ballots are set aside. Valid votes are separated by candidate.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-lg shadow-md">4</div>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg mb-2">🔢 Vote Tallying</h4>
                          <p className="text-gray-700 leading-relaxed text-sm">Votes for each candidate are counted and tallied. Results are recorded on Form 34A (polling station results form) in the presence of witnesses.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">Differences in Counting by Election Type</h3>

                  <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                        <tr>
                          <th className="px-6 py-4 text-left font-semibold">Election Type</th>
                          <th className="px-6 py-4 text-left font-semibold">Counting Location</th>
                          <th className="px-6 py-4 text-left font-semibold">First Results Announced</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Presidential</td>
                          <td className="px-6 py-4 text-gray-700">At polling stations, transmitted to national center</td>
                          <td className="px-6 py-4 text-gray-700">Preliminary results from polling stations</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">MPs</td>
                          <td className="px-6 py-4 text-gray-700">Counted at polling stations, compiled at constituencies</td>
                          <td className="px-6 py-4 text-gray-700">Constituency-level results</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Senators</td>
                          <td className="px-6 py-4 text-gray-700">Counted at polling stations, compiled at counties</td>
                          <td className="px-6 py-4 text-gray-700">County-level results</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Governors</td>
                          <td className="px-6 py-4 text-gray-700">Counted at polling stations, compiled at counties</td>
                          <td className="px-6 py-4 text-gray-700">County-level results</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">MCAs</td>
                          <td className="px-6 py-4 text-gray-700">Counted at polling stations, compiled at wards</td>
                          <td className="px-6 py-4 text-gray-700">Ward-level results</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-amber-50 border-l-4 border-amber-600 p-5 rounded mb-6">
                    <p className="text-gray-900 font-semibold mb-2">⚠️ Transparency During Counting</p>
                    <p className="text-gray-700 text-sm">The counting process is open to the public. Party agents, election observers, and citizens can witness vote counting at polling stations. This transparency ensures accountability and confidence in results.</p>
                  </div>
                </div>
              </section>

              {/* Section 3: Verification */}
              <section id="verification" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Role of IEBC in Verification & Transmission</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">After results are tallied at polling stations, IEBC verifies and transmits them through multiple channels to ensure accuracy and prevent manipulation.</p>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">Forms Used in Results Verification</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white border-2 border-emerald-300 p-6 rounded-xl shadow-sm hover:shadow-md transition">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">34A</div>
                        <h4 className="text-lg font-bold text-gray-900">Form 34A</h4>
                      </div>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" /> <span>Polling Station Results</span></li>
                        <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" /> <span>Contains results from each polling station</span></li>
                        <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" /> <span>Signed by polling officials and party agents</span></li>
                        <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" /> <span>Primary verification document</span></li>
                      </ul>
                    </div>

                    <div className="bg-white border-2 border-cyan-300 p-6 rounded-xl shadow-sm hover:shadow-md transition">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">34B</div>
                        <h4 className="text-lg font-bold text-gray-900">Form 34B</h4>
                      </div>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" /> <span>Constituency/County Results</span></li>
                        <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" /> <span>Consolidates polling station results</span></li>
                        <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" /> <span>Signed by Returning Officer</span></li>
                        <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" /> <span>Used for parliamentary/county verification</span></li>
                      </ul>
                    </div>

                    <div className="bg-white border-2 border-teal-300 p-6 rounded-xl shadow-sm hover:shadow-md transition">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">34C</div>
                        <h4 className="text-lg font-bold text-gray-900">Form 34C</h4>
                      </div>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" /> <span>National Presidential Results</span></li>
                        <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" /> <span>Consolidates all 47 counties</span></li>
                        <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" /> <span>Signed by IEBC officials</span></li>
                        <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" /> <span>Final presidential verification document</span></li>
                      </ul>
                    </div>

                    <div className="bg-white border-2 border-blue-300 p-6 rounded-xl shadow-sm hover:shadow-md transition">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">EL</div>
                        <h4 className="text-lg font-bold text-gray-900">Electronic Logs</h4>
                      </div>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" /> <span>Digital transmission of results</span></li>
                        <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" /> <span>Encrypted for security</span></li>
                        <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" /> <span>Parallel to physical transmission</span></li>
                        <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" /> <span>Backup and cross-verification</span></li>
                      </ul>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">Verification Steps</h3>

                  <div className="space-y-4">
                    <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">Physical Form Verification</p>
                          <p className="text-gray-700 text-sm">IEBC staff verify that Form 34As match electronically transmitted data. Signatures and seals are checked for authenticity.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">Discrepancy Investigation</p>
                          <p className="text-gray-700 text-sm">If electronic and physical records don't match, investigators examine the discrepancy. Polling station officials may be interviewed.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">Results Consolidation</p>
                          <p className="text-gray-700 text-sm">Verified results from all polling stations are consolidated at constituency, county, and national levels using Forms 34B and 34C.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">4</div>
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">Final Verification</p>
                          <p className="text-gray-700 text-sm">Senior IEBC officials conduct final checks before official declaration. Constitutional requirements are verified (e.g., presidential threshold).</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 4: Declaration */}
              <section id="declaration" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How Results Are Officially Declared</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Official result declaration is the final step where IEBC publicly announces verified election outcomes. Different officials declare results at different levels.</p>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">Declaration by Position & Level</h3>

                  <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                        <tr>
                          <th className="px-6 py-4 text-left font-semibold">Position</th>
                          <th className="px-6 py-4 text-left font-semibold">Declared By</th>
                          <th className="px-6 py-4 text-left font-semibold">Declaration Location</th>
                          <th className="px-6 py-4 text-left font-semibold">Timeline</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">President & Deputy</td>
                          <td className="px-6 py-4 text-gray-700">IEBC Chairperson</td>
                          <td className="px-6 py-4 text-gray-700">National Tallying Center (Bomas)</td>
                          <td className="px-6 py-4 text-gray-700">Within 7 days</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">MPs</td>
                          <td className="px-6 py-4 text-gray-700">Constituency Returning Officer</td>
                          <td className="px-6 py-4 text-gray-700">Constituency Tallying Center</td>
                          <td className="px-6 py-4 text-gray-700">5-7 days</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Senators</td>
                          <td className="px-6 py-4 text-gray-700">County Returning Officer</td>
                          <td className="px-6 py-4 text-gray-700">County Tallying Center</td>
                          <td className="px-6 py-4 text-gray-700">5-7 days</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Governors & Deputy</td>
                          <td className="px-6 py-4 text-gray-700">County Returning Officer</td>
                          <td className="px-6 py-4 text-gray-700">County Tallying Center</td>
                          <td className="px-6 py-4 text-gray-700">5-7 days</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">MCAs</td>
                          <td className="px-6 py-4 text-gray-700">Ward/Constituency Officer</td>
                          <td className="px-6 py-4 text-gray-700">Ward Tallying Center</td>
                          <td className="px-6 py-4 text-gray-700">5-7 days</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 p-6 rounded-lg shadow-sm mb-6">
                    <h4 className="font-bold text-gray-900 text-lg mb-3">🏆 Presidential Results Declaration (Constitutional Requirements)</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex gap-3 items-start">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-900">50%+1 Nationwide</p>
                          <p className="text-gray-700">Candidate must receive more than 50% of valid votes cast nationwide</p>
                        </div>
                      </div>
                      <div className="flex gap-3 items-start">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-900">25% in Half of Counties</p>
                          <p className="text-gray-700">Candidate must also get at least 25% in at least 24 of Kenya's 47 counties</p>
                        </div>
                      </div>
                      <div className="flex gap-3 items-start">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-900">Deputy President Running Mate</p>
                          <p className="text-gray-700">Only the Deputy President candidate of the winning presidential ticket is declared</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">Official Declaration Process</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-l-4 border-emerald-600 p-5 rounded-lg shadow-sm hover:shadow-md transition">
                      <h4 className="font-bold text-gray-900 mb-2 text-lg">📢 Public Announcement</h4>
                      <p className="text-gray-700 text-sm">Results are announced publicly at the tallying center. Media is present. The announcement is broadcast live to ensure transparency and reach all Kenyans.</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-blue-600 p-5 rounded-lg shadow-sm hover:shadow-md transition">
                      <h4 className="font-bold text-gray-900 mb-2 text-lg">📜 Issuance of Certificates</h4>
                      <p className="text-gray-700 text-sm">Election certificates are issued to the winners of presidential, parliamentary, gubernatorial, and other elective positions, confirming their legal status as winners.</p>
                    </div>

                    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border-l-4 border-cyan-600 p-5 rounded-lg shadow-sm hover:shadow-md transition">
                      <h4 className="font-bold text-gray-900 mb-2 text-lg">🌐 Website Publication</h4>
                      <p className="text-gray-700 text-sm">All detailed results are published on the <a href="/elections-in-kenya" className="text-cyan-600 hover:text-cyan-700">IEBC website</a> in multiple formats: by polling station, constituency, county, and national level.</p>
                    </div>

                    <div className="bg-gradient-to-br from-teal-50 to-green-50 border-l-4 border-teal-600 p-5 rounded-lg shadow-sm hover:shadow-md transition">
                      <h4 className="font-bold text-gray-900 mb-2 text-lg">📊 Gazette Publication</h4>
                      <p className="text-gray-700 text-sm">Official results are published in the Kenya Gazette, the government's official newspaper, making them part of the official public record.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 5: Discrepancies */}
              <section id="discrepancies" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Handling Discrepancies and Contested Results</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">If there are discrepancies in vote counts or concerns about election irregularities, IEBC has procedures to investigate and resolve them. Citizens also have the right to contest results through the courts.</p>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">Types of Discrepancies</h3>

                  <div className="space-y-4 mb-6">
                    <div className="bg-white border-l-4 border-orange-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">Electronic vs Physical Mismatch</h4>
                      <p className="text-gray-700 text-sm">If electronic transmission differs from physical Form 34A, IEBC investigates which record is correct. Physical forms are considered the official record since they're witnessed by multiple parties.</p>
                    </div>

                    <div className="bg-white border-l-4 border-orange-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">Missing or Incomplete Forms</h4>
                      <p className="text-gray-700 text-sm">If a polling station's Form 34A is missing or incomplete, IEBC works with available records and may conduct verification procedures to recover the information.</p>
                    </div>

                    <div className="bg-white border-l-4 border-orange-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">Disputed or Invalid Ballots</h4>
                      <p className="text-gray-700 text-sm">Ballots that don't clearly show a vote choice during counting are disputed. These are set aside and may be counted or rejected based on IEBC procedures and party agent agreement.</p>
                    </div>

                    <div className="bg-white border-l-4 border-orange-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">Vote Count Errors</h4>
                      <p className="text-gray-700 text-sm">Mathematical errors in tallying at any level can lead to incorrect totals. These are corrected once discovered through verification processes.</p>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">Election Petitions</h3>

                  <p className="text-gray-700 mb-4">Candidates can petition election results if they believe there were irregularities or violations that affected the outcome. The process varies by position:</p>

                  <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
                        <tr>
                          <th className="px-6 py-4 text-left font-semibold">Election Type</th>
                          <th className="px-6 py-4 text-left font-semibold">Petition Court</th>
                          <th className="px-6 py-4 text-left font-semibold">Timeframe</th>
                          <th className="px-6 py-4 text-left font-semibold">Grounds for Petition</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Presidential</td>
                          <td className="px-6 py-4 text-gray-700">Supreme Court</td>
                          <td className="px-6 py-4 text-gray-700">7 days from declaration</td>
                          <td className="px-6 py-4 text-gray-700">Constitutional violations, irregularities affecting outcome</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">Parliamentary</td>
                          <td className="px-6 py-4 text-gray-700">High Court</td>
                          <td className="px-6 py-4 text-gray-700">14 days from declaration</td>
                          <td className="px-6 py-4 text-gray-700">Electoral laws violated, irregularities occurred</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">County Elections</td>
                          <td className="px-6 py-4 text-gray-700">High Court</td>
                          <td className="px-6 py-4 text-gray-700">14 days from declaration</td>
                          <td className="px-6 py-4 text-gray-700">Electoral laws violated, irregularities affected results</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-gradient-to-r from-rose-50 to-pink-50 border-l-4 border-rose-600 p-6 rounded-lg shadow-sm mb-6">
                    <h4 className="font-bold text-gray-900 text-lg mb-3">⚖️ What Happens During a Presidential Petition</h4>
                    <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
                      <li>Candidate files petition at Supreme Court within 7 days with evidence of irregularities</li>
                      <li>Supreme Court reviews petition and IEBC's response</li>
                      <li>Court holds hearings where evidence is presented by both sides</li>
                      <li>If evidence supports the petition, court may order recounting in specific areas</li>
                      <li>Final court ruling determines if results stand or are annulled</li>
                      <li>If results annulled, fresh presidential election is called within 60 days</li>
                    </ol>
                  </div>
                </div>
              </section>

              {/* Section 6: Access Results */}
              <section id="access" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How Citizens Can Access Election Results</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Election results are public information. IEBC provides multiple channels through which citizens can access detailed election results.</p>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">Official Result Sources</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">🌐</div>
                        <h4 className="text-lg font-bold text-gray-900">IEBC Website</h4>
                      </div>
                      <p className="text-gray-700 text-sm mb-3">Official results published at www.iebc.or.ke with full breakdown by polling station, constituency, county, and national level.</p>
                      <p className="text-sm text-purple-700 font-medium">Most detailed and authoritative source</p>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">📱</div>
                        <h4 className="text-lg font-bold text-gray-900">IEBC Mobile App</h4>
                      </div>
                      <p className="text-gray-700 text-sm mb-3">Download the official IEBC mobile application to view results by location, constituency, or candidate name.</p>
                      <p className="text-sm text-indigo-700 font-medium">Convenient access on smartphones</p>
                    </div>

                    <div className="bg-gradient-to-br from-cyan-50 to-teal-50 border-2 border-cyan-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">📰</div>
                        <h4 className="text-lg font-bold text-gray-900">Kenya Gazette</h4>
                      </div>
                      <p className="text-gray-700 text-sm mb-3">Official government newspaper publishes final verified results, making them part of the official public record.</p>
                      <p className="text-sm text-cyan-700 font-medium">Official legal record</p>
                    </div>

                    <div className="bg-gradient-to-br from-rose-50 to-red-50 border-2 border-rose-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-rose-600 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">📺</div>
                        <h4 className="text-lg font-bold text-gray-900">Media Coverage</h4>
                      </div>
                      <p className="text-gray-700 text-sm mb-3">Major news outlets report on election results with analysis and candidate reactions.</p>
                      <p className="text-sm text-rose-700 font-medium">Real-time coverage and analysis</p>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">How to Search for Results by Polling Station</h3>

                  <div className="space-y-4">
                    <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">Visit IEBC Website</p>
                          <p className="text-gray-700 text-sm">Go to www.iebc.or.ke and navigate to "Election Results" section</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">Select County & Constituency</p>
                          <p className="text-gray-700 text-sm">Choose your county, then your constituency from the dropdown menus</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">Find Your Polling Station</p>
                          <p className="text-gray-700 text-sm">Select your specific polling station from the list of all stations in your constituency</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">4</div>
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">View Detailed Results</p>
                          <p className="text-gray-700 text-sm">See vote totals for each candidate at your polling station, constituency, and county levels</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 7: Common Issues */}
              <section id="issues" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Common Issues During Result Transmission</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Despite best efforts, challenges sometimes occur during results tallying and transmission. Understanding these issues helps ensure transparency.</p>

                  <div className="space-y-4">
                    <div className="bg-white border-l-4 border-yellow-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">🌐 Network Connectivity Issues</h4>
                      <p className="text-gray-700 text-sm mb-2">Electronic transmission may fail in areas with poor network coverage.</p>
                      <p className="text-green-700 text-sm font-medium">Solution: Physical transmission via Forms 34A serves as backup</p>
                    </div>

                    <div className="bg-white border-l-4 border-yellow-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">📝 Form Errors</h4>
                      <p className="text-gray-700 text-sm mb-2">Officials may make mathematical errors or incomplete entries on paper forms.</p>
                      <p className="text-green-700 text-sm font-medium">Solution: Verification processes catch and correct errors</p>
                    </div>

                    <div className="bg-white border-l-4 border-yellow-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">🔐 Security Concerns</h4>
                      <p className="text-gray-700 text-sm mb-2">Potential for tampering with electronic transmissions if not properly secured.</p>
                      <p className="text-green-700 text-sm font-medium">Solution: Encryption, physical form verification, and multi-layer oversight</p>
                    </div>

                    <div className="bg-white border-l-4 border-yellow-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">⏱️ Delays in Declaration</h4>
                      <p className="text-gray-700 text-sm mb-2">Verification processes take time, potentially delaying official result declarations.</p>
                      <p className="text-green-700 text-sm font-medium">Solution: IEBC works within constitutional 7-day deadline</p>
                    </div>

                    <div className="bg-white border-l-4 border-yellow-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">📊 Disputed Vote Counts</h4>
                      <p className="text-gray-700 text-sm mb-2">Different tallies from electronic and physical records can cause disputes.</p>
                      <p className="text-green-700 text-sm font-medium">Solution: Investigation procedures resolve discrepancies</p>
                    </div>

                    <div className="bg-white border-l-4 border-yellow-600 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">👥 Personnel Issues</h4>
                      <p className="text-gray-700 text-sm mb-2">Trained officials may be unavailable or make mistakes during tallying.</p>
                      <p className="text-green-700 text-sm font-medium">Solution: Multiple officials at each level provide oversight</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 8: FAQs */}
              <section id="faqs" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <BarChart3 className="w-6 h-6 text-violet-600 flex-shrink-0 mt-1" />
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

              {/* Section 8.5: Legal Framework */}
              <section id="legal-framework" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Legal Framework Governing Election Results</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Election results declaration in Kenya is governed by a comprehensive legal framework designed to ensure accuracy, transparency, and adherence to constitutional principles.</p>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">🏛️ Constitutional Framework</h3>

                  <div className="bg-white border-2 border-blue-300 p-6 rounded-xl shadow-sm mb-6">
                    <div className="space-y-4">
                      <div className="border-l-4 border-blue-600 pl-4">
                        <h4 className="font-bold text-gray-900 mb-2">Constitution of Kenya 2010 - Chapter Nine (Elections & Referendums)</h4>
                        <p className="text-gray-700 text-sm mb-2"><strong>Article 81:</strong> Establishes the framework for presidential elections and constitutional requirements for results declaration (50%+1 nationwide, 25% in 24 counties)</p>
                        <p className="text-gray-700 text-sm mb-2"><strong>Article 97:</strong> Governs parliamentary elections (MPs and Senators) and specifies declaration procedures</p>
                        <p className="text-gray-700 text-sm mb-2"><strong>Article 176-185:</strong> Addresses county elections (Governors, Deputy Governors, and MCAs) including results verification timelines</p>
                        <p className="text-gray-700 text-sm"><strong>Article 88:</strong> Grants IEBC full autonomy in election management and results declaration without political interference</p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">📋 Primary Legislation</h3>

                  <div className="space-y-4 mb-6">
                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border-l-4 border-indigo-600 p-5 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2">The Elections Act 2011</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" /><span><strong>Part VII (Sections 35-43):</strong> Results tallying, verification, and declaration procedures</span></li>
                        <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" /><span><strong>Section 38:</strong> IEBC authority to verify and announce official results</span></li>
                        <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" /><span><strong>Section 39:</strong> Timelines for results declaration (7 days for presidential)</span></li>
                        <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" /><span><strong>Section 40:</strong> Procedures for handling disputed results and discrepancies</span></li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-br from-cyan-50 to-teal-50 border-l-4 border-cyan-600 p-5 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2">The Election Operations Act 2017</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-0.5" /><span><strong>Section 49:</strong> Prescribes Form 34A, 34B, 34C formats and usage in tallying</span></li>
                        <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-0.5" /><span><strong>Section 54:</strong> Electronic transmission of results and security protocols</span></li>
                        <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-0.5" /><span><strong>Section 56:</strong> Verification procedures and discrepancy handling</span></li>
                        <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-0.5" /><span><strong>Section 60:</strong> Publication of results and gazette notice requirements</span></li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-l-4 border-emerald-600 p-5 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2">The Independent Electoral and Boundaries Commission Act 2011</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" /><span><strong>Section 11:</strong> IEBC functions including results verification and declaration</span></li>
                        <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" /><span><strong>Section 23:</strong> IEBC staff qualifications and training for tallying operations</span></li>
                        <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" /><span><strong>Section 29:</strong> Powers of investigation into electoral malpractice during results</span></li>
                      </ul>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">⚖️ Supporting Legislation</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white border-2 border-purple-300 p-5 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-purple-600" /> Political Parties Act 2011</h4>
                      <p className="text-gray-700 text-sm">Section 19: Party agent rights during tallying and result verification</p>
                    </div>

                    <div className="bg-white border-2 border-pink-300 p-5 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-pink-600" /> Election Offences Act 2016</h4>
                      <p className="text-gray-700 text-sm">Sections 35-45: Criminal penalties for result manipulation and falsification</p>
                    </div>

                    <div className="bg-white border-2 border-orange-300 p-5 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-orange-600" /> Supreme Court (Election Petition) Rules 2017</h4>
                      <p className="text-gray-700 text-sm">Rules 1-35: Procedures for challenging election results through courts</p>
                    </div>

                    <div className="bg-white border-2 border-red-300 p-5 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-red-600" /> Data Protection Act 2019</h4>
                      <p className="text-gray-700 text-sm">Sections 4-6: Protection of voter data during transmission and tallying</p>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">📜 IEBC Regulations & Standards</h3>

                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300 p-6 rounded-lg shadow-sm mb-6">
                    <div className="space-y-3 text-sm text-gray-700">
                      <p className="flex gap-2"><span className="font-semibold min-w-32">IEBC Code of Conduct:</span> Ensures neutral, impartial administration of results</p>
                      <p className="flex gap-2"><span className="font-semibold min-w-32">IEBC Regulations 2012:</span> Detailed operational procedures for tallying and verification</p>
                      <p className="flex gap-2"><span className="font-semibold min-w-32">Election Operations Manual:</span> Technical guidelines for results transmission and declaration</p>
                      <p className="flex gap-2"><span className="font-semibold min-w-32">Forms and Schedules:</span> Standard forms (34A, 34B, 34C) for recording results</p>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">🌍 International Standards</h3>

                  <p className="text-gray-700 mb-4">Kenya's election results process aligns with international best practices and standards:</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white border border-gray-200 p-4 rounded-lg">
                      <p className="font-semibold text-gray-900 mb-1">International IDEA Standards</p>
                      <p className="text-gray-700 text-sm">Democratic election procedures and transparency in results management</p>
                    </div>
                    <div className="bg-white border border-gray-200 p-4 rounded-lg">
                      <p className="font-semibold text-gray-900 mb-1">African Union Guidelines</p>
                      <p className="text-gray-700 text-sm">Standards for democratic elections in African nations</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 9: Citizens' Rights */}
              <section id="rights" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Shield className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Citizens' Rights During Result Announcement</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">The Constitution of Kenya protects citizens' rights throughout the election results process. Understanding these rights ensures you can participate meaningfully in democracy.</p>

                  <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-8 rounded-xl shadow-lg mb-6">
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                      <Shield className="w-7 h-7" />
                      Your Electoral Rights
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        { icon: "✅", text: "Right to access official election results from IEBC" },
                        { icon: "📊", text: "Right to verify results at your polling station level" },
                        { icon: "👁️", text: "Right to observe vote counting and result tallying" },
                        { icon: "⚖️", text: "Right to petition contested election results" },
                        { icon: "📢", text: "Right to receive official result information from IEBC" },
                        { icon: "🔍", text: "Right to request investigation of electoral malpractice" },
                        { icon: "📋", text: "Right to independent election monitoring and observation" },
                        { icon: "🛡️", text: "Right to protection while exercising electoral rights" }
                      ].map((right, index) => (
                        <div key={index} className="flex gap-3 items-start bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                          <span className="text-2xl flex-shrink-0">{right.icon}</span>
                          <span className="text-white/95 text-sm">{right.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">How to Report Election Concerns</h3>

                  <div className="space-y-3 mb-6">
                    <div className="bg-white border-l-4 border-indigo-600 p-5 rounded-lg shadow-sm">
                      <p className="font-semibold text-gray-900 mb-2">📞 Contact IEBC Directly</p>
                      <p className="text-gray-700 text-sm">Call IEBC toll-free: 0800 800 400 or visit any IEBC office. Report specific concerns with details of location and time.</p>
                    </div>

                    <div className="bg-white border-l-4 border-indigo-600 p-5 rounded-lg shadow-sm">
                      <p className="font-semibold text-gray-900 mb-2">🌐 Online Report</p>
                      <p className="text-gray-700 text-sm">Submit concerns via the IEBC website at www.iebc.or.ke. Include detailed information and supporting evidence if available.</p>
                    </div>

                    <div className="bg-white border-l-4 border-indigo-600 p-5 rounded-lg shadow-sm">
                      <p className="font-semibold text-gray-900 mb-2">👁️ Election Observers</p>
                      <p className="text-gray-700 text-sm">Contact election observer organizations who can document and raise concerns about observed irregularities.</p>
                    </div>

                    <div className="bg-white border-l-4 border-indigo-600 p-5 rounded-lg shadow-sm">
                      <p className="font-semibold text-gray-900 mb-2">⚖️ Court Petition</p>
                      <p className="text-gray-700 text-sm">File an election petition with the appropriate court (Supreme Court for presidential, High Court for others) within the prescribed timeframe.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* CTA Section */}
              <section className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white p-8 rounded-xl shadow-xl">
                <h3 className="text-2xl font-bold mb-4">Stay Informed About Election Results</h3>
                <p className="mb-6 text-emerald-100">Access official results and understand the electoral process through trusted IEBC resources.</p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/understanding-iebc-kenya" className="bg-white text-emerald-700 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition">
                    Learn About IEBC
                  </Link>
                  <Link to="/elections-in-kenya" className="bg-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-400 transition">
                    Understand Elections
                  </Link>
                  <Link to="/types-of-elections-kenya" className="bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition">
                    Election Types
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

export default ElectionResultsDeclarationKenya;
