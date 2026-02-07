import { useState, useEffect } from 'react';
import { ChevronDown, CheckCircle, ArrowRight, FileText, Users, MessageSquare, AlertCircle } from 'lucide-react';

// FAQ Data - Constant at file level to avoid React Hook dependency warnings
const faqsData = [
  {
    id: 1,
    question: 'Why should I check my voter registration status?',
    answer: 'Checking your voter status ensures that you are registered and eligible to vote in upcoming elections. It allows you to verify that your personal details are correct in the voter register. If there are errors or if you discover you are not registered, you can take corrective action before election day. This prevents frustration and ensures your vote counts.'
  },
  {
    id: 2,
    question: 'What information do I need to check my voter status?',
    answer: 'To check your voter status, you will need your national identity number (from your national ID card, passport, or other accepted identification). Some methods may require your mobile phone number. You do not need any other documents – just your ID number and access to a phone or internet connection.'
  },
  {
    id: 3,
    question: 'Is checking voter status free?',
    answer: 'Yes, checking your voter status is completely free. IEBC provides this service to all Kenyans at no cost. Whether you check online, via SMS, or visit an IEBC office, there are no fees involved. Do not pay anyone claiming to verify your voter status – this service is provided free by IEBC.'
  },
  {
    id: 4,
    question: 'What does "registered" status mean?',
    answer: 'If your status shows "registered," it means you are on the official voter register for your constituency and are eligible to vote in elections. Your registration has been verified and approved by IEBC. You can vote using your voter card or using identification at your designated polling station on election day.'
  },
  {
    id: 5,
    question: 'What does "pending verification" status mean?',
    answer: 'If your status shows "pending verification," it means your registration has been submitted but IEBC has not yet completed verification against the national population register and ID database. This is normal and typically takes 1-2 weeks. Check back later or contact IEBC if verification takes longer than expected.'
  },
  {
    id: 6,
    question: 'What does "not registered" status mean?',
    answer: 'If the check shows "not registered," it means you do not have an active registration in the voter register for the constituency you checked. You may need to register or re-register during the next registration period. If you believe you should be registered, contact your nearest IEBC office with your ID to clarify your status.'
  },
  {
    id: 7,
    question: 'What should I do if my information on the voter register is incorrect?',
    answer: 'If you find errors in your details (name, date of birth, address), visit your nearest IEBC county or constituency office with your voter card and ID. Inform the registration officer of the errors. They will help you correct the information on the voter register. Corrections can be made during registration periods and sometimes before elections.'
  },
  {
    id: 8,
    question: 'Can I check someone else\'s voter status?',
    answer: 'For privacy and security reasons, you can generally only check your own voter status. However, authorized election observers, IEBC officials, and authorized party agents may access aggregated voter register data for legitimate electoral purposes. Personal voter information is protected under data protection laws.'
  },
  {
    id: 9,
    question: 'How often can I check my voter status?',
    answer: 'You can check your voter status as often as you wish. There is no limit to how many times you can verify your registration. You can check daily if needed, especially during registration periods or as election day approaches.'
  },
  {
    id: 10,
    question: 'What if the IEBC website or SMS service is not working?',
    answer: 'If the online portal is temporarily unavailable, try checking at a later time. You can also check your status using the SMS service or by visiting your nearest IEBC county office in person. During high-demand periods (close to elections), the website may experience slow speeds. Be patient and try again shortly.'
  },
  {
    id: 11,
    question: 'How do I know which constituency I should be registered in?',
    answer: 'Your constituency of registration depends on where you are a resident or have a genuine interest in the area. If you have moved to a new constituency, you need to register in your new location. You can check the list of constituencies on the IEBC website. If you are unsure, contact your nearest IEBC office for guidance.'
  },
  {
    id: 12,
    question: 'What happens if I am not on the voter register on election day?',
    answer: 'If you are not on the voter register when you arrive to vote, you will not be able to vote in that election. To be eligible to vote, you must have completed registration before the registration deadline (typically 60 days before general elections). If you missed registration, you can register during the next registration period for future elections.'
  }
];

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export default function HowToCheckVoterStatusKenya() {
  const [activeSection, setActiveSection] = useState('importance');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  useEffect(() => {
    // Set SEO Meta Tags
    const metaTitle = 'Check Your Voter Status Kenya – Verify Online';
    const metaDescription = 'How to check your voter registration status in Kenya. Verify online via IEBC portal or SMS. Step-by-step guide to confirm voter eligibility.';
    const metaKeywords = 'check voter status Kenya, verify voter registration, IEBC voter check, am I registered to vote, voter registration verification Kenya';

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
            'name': 'Check Voter Status'
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
              'name': 'Check Voter Status',
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
          'name': 'How to Check Your Voter Status in Kenya',
          'description': 'Step-by-step guide to verify your voter registration status online via IEBC portal',
          'step': [
            {
              '@type': 'HowToStep',
              'name': 'Visit IEBC Website',
              'text': 'Go to www.iebc.or.ke and navigate to the voter status checker tool'
            },
            {
              '@type': 'HowToStep',
              'name': 'Click Voter Status Checker',
              'text': 'Find and click the "Check Voter Status" or "Voter Register" section'
            },
            {
              '@type': 'HowToStep',
              'name': 'Enter Your ID Number',
              'text': 'Type your national identity number in the search field'
            },
            {
              '@type': 'HowToStep',
              'name': 'Select Constituency',
              'text': 'Choose the constituency where you believe you are registered'
            },
            {
              '@type': 'HowToStep',
              'name': 'Click Search',
              'text': 'Click the "Search" or "Check Status" button to retrieve your information'
            },
            {
              '@type': 'HowToStep',
              'name': 'Review Your Details',
              'text': 'Review your name, ID number, registration status, and other details'
            },
            {
              '@type': 'HowToStep',
              'name': 'Note Your Status',
              'text': 'Take note of your registration status: registered, pending verification, or not registered'
            }
          ]
        },
        {
          '@type': 'GovernmentService',
          'name': 'Voter Status Verification in Kenya',
          'description': 'Official voter registration status verification service provided by the Independent Electoral and Boundaries Commission (IEBC)',
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
    { id: 'importance', label: 'Why Check Status' },
    { id: 'eligibility', label: 'Eligibility' },
    { id: 'methods', label: 'Check Methods' },
    { id: 'online', label: 'Online Steps' },
    { id: 'interpret', label: 'Interpret Status' },
    { id: 'issues', label: 'Common Issues' },
    { id: 'rights', label: 'Your Rights' },
    { id: 'firsttime', label: 'First-Time Voters' },
    { id: 'faqs', label: 'FAQs' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-12 sm:py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4 mb-4">
            <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">How to Check Your Voter Status in Kenya</h1>
          <p className="text-lg sm:text-xl text-green-50 mb-6">Complete guide to verify your voter registration online or offline. Check eligibility, interpret your status, and fix common issues.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="https://www.iebc.or.ke" target="_blank" rel="noopener noreferrer" className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition flex items-center justify-center gap-2">
              Check Status Online <ArrowRight className="w-5 h-5" />
            </a>
            <a href="tel:+254723566000" className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition">
              Call IEBC
            </a>
          </div>
        </div>
      </section>

      {/* Breadcrumb Navigation */}
      <nav className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-3 text-sm overflow-x-auto">
            <a href="/" className="text-green-600 hover:text-green-700 whitespace-nowrap">Home</a>
            <span className="text-gray-400">/</span>
            <a href="/elections-in-kenya" className="text-green-600 hover:text-green-700 whitespace-nowrap">Elections</a>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 whitespace-nowrap">Check Voter Status</span>
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
                  ? 'bg-green-100 text-green-600 border-b-2 border-green-600'
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
                    ? 'bg-green-100 text-green-600 border-l-4 border-green-600 font-semibold'
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
          {/* Section 1: Why Check Status */}
          <section id="importance" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Why Checking Your Voter Status Is Important</h2>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">Checking your voter registration status is a critical step in preparing to participate in Kenya's electoral process. Before each election, it is essential to verify that you are registered and eligible to vote.</p>
              
              <div className="space-y-4">
                <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
                  <h3 className="font-bold text-gray-900 mb-2">✓ Verify Your Registration</h3>
                  <p className="text-gray-700">Ensure that your name appears in the official voter register for your constituency. This confirms that your registration was completed successfully and you are eligible to vote.</p>
                </div>

                <div className="bg-emerald-50 border-l-4 border-emerald-600 p-4 rounded">
                  <h3 className="font-bold text-gray-900 mb-2">✓ Confirm Your Details Are Correct</h3>
                  <p className="text-gray-700">Check that your name, date of birth, ID number, and constituency are recorded accurately. Errors can cause problems when you try to vote. Early verification allows time for corrections.</p>
                </div>

                <div className="bg-teal-50 border-l-4 border-teal-600 p-4 rounded">
                  <h3 className="font-bold text-gray-900 mb-2">✓ Take Action Before Election Day</h3>
                  <p className="text-gray-700">If you discover you are not registered or if there are errors, you have time to correct them during the registration period. This prevents complications on election day.</p>
                </div>

                <div className="bg-cyan-50 border-l-4 border-cyan-600 p-4 rounded">
                  <h3 className="font-bold text-gray-900 mb-2">✓ Avoid Frustration at Polling Stations</h3>
                  <p className="text-gray-700">Checking in advance prevents situations where you arrive to vote only to discover you are not registered. This ensures you can exercise your right to vote smoothly.</p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                  <h3 className="font-bold text-gray-900 mb-2">✓ Plan Your Voting Day</h3>
                  <p className="text-gray-700">Once you confirm your registration, you will know your polling station and voting location. You can plan accordingly and ensure you have the necessary documents.</p>
                </div>
              </div>

              <div className="mt-6 bg-green-50 border border-green-300 rounded-lg p-4">
                <p className="text-gray-700"><strong>💡 Tip:</strong> Check your voter status early, well before election day. This gives you maximum time to address any issues. The best time to check is during the voter registration period or immediately after you register.</p>
              </div>
            </div>
          </section>

          {/* Section 2: Eligibility */}
          <section id="eligibility" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Who Can Check Their Voter Status?</h2>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">Any Kenyan citizen who has previously registered or attempted to register as a voter can check their voter status.</p>
              
              <div className="bg-green-50 border-l-4 border-green-600 p-4 mb-4 rounded">
                <h3 className="font-bold text-gray-900 mb-2">Who Can Check Status:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Kenyan citizens aged 18 and above</li>
                  <li>✓ Anyone who has already registered as a voter</li>
                  <li>✓ Anyone who has submitted a voter registration application</li>
                  <li>✓ First-time voters preparing to register</li>
                  <li>✓ Anyone who believes they should be on the voter register</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">What You Need to Check Status:</h3>
              <table className="w-full border-collapse mb-4">
                <thead>
                  <tr className="bg-green-100 border border-gray-300">
                    <th className="border border-gray-300 px-4 py-2 text-left font-bold text-gray-900">Information Required</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-bold text-gray-900">Online Check</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-bold text-gray-900">SMS Check</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-bold text-gray-900">In-Person Check</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border border-gray-300">
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">National ID Number</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">✓ Required</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">✓ Required</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">✓ Required</td>
                  </tr>
                  <tr className="bg-gray-50 border border-gray-300">
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">Constituency Name</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">✓ Required</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">Optional</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">Helpful</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">Mobile Phone Number</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">Not needed</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">✓ For SMS reply</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">Not needed</td>
                  </tr>
                  <tr className="bg-gray-50 border border-gray-300">
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">Physical ID Document</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">Not needed</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">Not needed</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">✓ Bring ID</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3: Methods */}
          <section id="methods" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <Users className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Methods to Check Your Voter Status</h2>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">The <a href="/understanding-iebc-kenya" className="text-green-600 hover:text-green-700 font-medium">Independent Electoral and Boundaries Commission (IEBC)</a> provides multiple convenient ways to check your voter status.</p>
              
              <div className="space-y-4">
                <div className="bg-teal-50 border-l-4 border-teal-600 p-4 rounded">
                  <h3 className="font-bold text-gray-900 mb-2">1. Online via IEBC Portal (Fastest)</h3>
                  <p className="text-gray-700 mb-2">Visit the IEBC website at <a href="https://www.iebc.or.ke" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 font-medium">www.iebc.or.ke</a> and use the voter status checker tool. You can check anytime, 24/7. Instant results are displayed on your screen. This method requires internet access on a computer, tablet, or mobile phone.</p>
                  <p className="text-gray-700 text-sm"><strong>Time to get results:</strong> Instant (within seconds)</p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                  <h3 className="font-bold text-gray-900 mb-2">2. SMS Service (Mobile Friendly)</h3>
                  <p className="text-gray-700 mb-2">Send an SMS with your ID number to the IEBC SMS code. You will receive your registration status in a reply SMS. This method works even with basic mobile phones and minimal data. Check the IEBC website for the current SMS shortcode.</p>
                  <p className="text-gray-700 text-sm"><strong>Time to get results:</strong> Within a few minutes</p>
                </div>

                <div className="bg-cyan-50 border-l-4 border-cyan-600 p-4 rounded">
                  <h3 className="font-bold text-gray-900 mb-2">3. IEBC County Offices (In-Person)</h3>
                  <p className="text-gray-700 mb-2">Visit your nearest IEBC county or constituency office during business hours with your national ID. An IEBC staff member will check your status in their system. You will receive detailed information about your registration.</p>
                  <p className="text-gray-700 text-sm"><strong>Time to get results:</strong> Immediately (usually 5-10 minutes)</p>
                </div>

                <div className="bg-emerald-50 border-l-4 border-emerald-600 p-4 rounded">
                  <h3 className="font-bold text-gray-900 mb-2">4. Phone Call to IEBC Hotline</h3>
                  <p className="text-gray-700 mb-2">Call the IEBC toll-free customer service number to speak with an IEBC representative. Provide your ID number, and they will check your status. This method is helpful if you prefer to speak with someone directly.</p>
                  <p className="text-gray-700 text-sm"><strong>Time to get results:</strong> Immediate (while on call)</p>
                </div>

                <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded">
                  <h3 className="font-bold text-gray-900 mb-2">5. Election Observers and Voter Education Centers</h3>
                  <p className="text-gray-700 mb-2">During election periods, IEBC sets up voter education centers and stations at public places. Election observers and IEBC staff at these locations can help you check your status.</p>
                  <p className="text-gray-700 text-sm"><strong>Time to get results:</strong> Immediately</p>
                </div>
              </div>

              <div className="mt-6 bg-yellow-50 border border-yellow-300 rounded-lg p-4">
                <p className="text-gray-700"><strong>💡 Recommendation:</strong> The online method is fastest and most convenient. However, if you prefer or don't have internet access, SMS or visiting an IEBC office are excellent alternatives.</p>
              </div>
            </div>
          </section>

          {/* Section 4: Online Steps */}
          <section id="online" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <FileText className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Step-by-Step Guide to Checking Online</h2>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">Here is a detailed walkthrough of checking your voter status on the IEBC website:</p>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-600 text-white font-bold">1</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Go to the IEBC Website</h4>
                    <p className="text-gray-700">Open your web browser (Google Chrome, Safari, Firefox, etc.) and navigate to <a href="https://www.iebc.or.ke" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 font-medium">www.iebc.or.ke</a>. You can access this from a computer, laptop, tablet, or smartphone. Make sure you have a stable internet connection.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-600 text-white font-bold">2</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Look for Voter Registration Section</h4>
                    <p className="text-gray-700">On the homepage, look for a link or menu item that says "Voter Registration," "Check Voter Status," "Voter Register," or similar wording. This is usually in the main navigation menu or prominently displayed on the homepage. Click on this link.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-600 text-white font-bold">3</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Find the Voter Status Checker Tool</h4>
                    <p className="text-gray-700">You may see options for "Register to Vote," "Check Voter Status," or "Voter Register." Click on "Check Voter Status" or "Voter Status Checker" tool. This will take you to a page with a search form.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-600 text-white font-bold">4</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Enter Your National ID Number</h4>
                    <p className="text-gray-700">In the search field, type your national identity number (the 8-digit number from your national ID card or passport). Do not include any spaces or dashes – just the digits. For example: 12345678</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-600 text-white font-bold">5</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Select Your Constituency</h4>
                    <p className="text-gray-700">From the dropdown menu, select the constituency where you are registered or where you think you should be registered. If you are unsure of your constituency name, you can look it up on the IEBC website or ask at your local IEBC office. Choose from the list provided.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-600 text-white font-bold">6</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Click the Search/Check Button</h4>
                    <p className="text-gray-700">Click the "Search," "Check Status," or "Submit" button. The website will search the voter register for your information. This usually takes just a few seconds.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-600 text-white font-bold">7</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">View Your Results</h4>
                    <p className="text-gray-700">Your voter status will be displayed on the screen. You will see your name (as recorded), ID number, constituency, ward, and your registration status (registered, pending verification, or not registered). Take a screenshot or note down this information for your records.</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-green-50 border border-green-300 rounded-lg p-4">
                <p className="text-gray-700"><strong>✓ Troubleshooting:</strong> If no results appear, you may have entered the wrong ID number or selected the wrong constituency. Try again with the correct information. If you still get no results, visit an IEBC office or call the helpline for assistance.</p>
              </div>
            </div>
          </section>

          {/* Section 5: Interpret Status */}
          <section id="interpret" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How to Interpret Your Voter Registration Status</h2>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">When you check your voter status, you will receive a result that falls into one of several categories. Here is what each status means:</p>
              
              <div className="space-y-4">
                <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
                  <h3 className="font-bold text-gray-900 mb-2">✓ REGISTERED</h3>
                  <p className="text-gray-700 mb-2"><strong>What it means:</strong> You are on the official voter register for the constituency you checked. Your registration is complete and verified. You are eligible to vote in upcoming elections.</p>
                  <p className="text-gray-700 mb-2"><strong>What to do:</strong> You are all set to vote. Verify that your details are correct. Note your polling station location if provided. Prepare your ID for election day.</p>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded">
                  <h3 className="font-bold text-gray-900 mb-2">⏳ PENDING VERIFICATION</h3>
                  <p className="text-gray-700 mb-2"><strong>What it means:</strong> Your registration has been submitted and received by IEBC, but verification is still in progress. Your details are being checked against the national population register and ID database. This is normal and typically takes 1-2 weeks.</p>
                  <p className="text-gray-700 mb-2"><strong>What to do:</strong> Wait for verification to complete. You will receive notification via SMS or email when verification is done. Check again in 1-2 weeks. If it takes longer than 2 weeks, contact IEBC.</p>
                </div>

                <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
                  <h3 className="font-bold text-gray-900 mb-2">✗ NOT REGISTERED</h3>
                  <p className="text-gray-700 mb-2"><strong>What it means:</strong> You do not have an active registration in the voter register for the constituency checked. This could mean you have never registered, your registration was cancelled, or you checked in the wrong constituency.</p>
                  <p className="text-gray-700 mb-2"><strong>What to do:</strong> (1) Check you selected the correct constituency and try again, (2) Register or re-register during the next voter registration period, (3) Contact your nearest IEBC office to clarify your status, (4) Provide your ID and ask IEBC staff to help you understand why you are not registered.</p>
                </div>

                <div className="bg-gray-50 border-l-4 border-gray-600 p-4 rounded">
                  <h3 className="font-bold text-gray-900 mb-2">❌ REGISTRATION CANCELLED</h3>
                  <p className="text-gray-700 mb-2"><strong>What it means:</strong> Your registration was previously cancelled. This may have happened because you registered in multiple constituencies (illegal), were disqualified, or there was an administrative issue.</p>
                  <p className="text-gray-700 mb-2"><strong>What to do:</strong> Contact your nearest IEBC county office immediately with your ID to find out why your registration was cancelled. Ask if you can re-register. If you believe the cancellation was an error, you may submit a complaint to IEBC.</p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                  <h3 className="font-bold text-gray-900 mb-2">❓ NO RESULTS FOUND</h3>
                  <p className="text-gray-700 mb-2"><strong>What it means:</strong> The search did not return any records matching your ID number and constituency. This could mean you never registered, used a different ID number, or selected the wrong constituency.</p>
                  <p className="text-gray-700 mb-2"><strong>What to do:</strong> (1) Double-check that your ID number is correct – try again, (2) Verify you selected the right constituency – you may have moved, (3) If you have multiple ID documents, try with a different one, (4) Visit an IEBC office in person for clarification.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">Information You Should See on Your Registration</h3>
              <div className="bg-gray-100 border border-gray-300 p-4 rounded mb-4">
                <p className="text-gray-700 mb-3"><strong>When your status shows as "Registered," you should see:</strong></p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Your full name (as registered)</li>
                  <li>Your national ID number</li>
                  <li>Your date of birth</li>
                  <li>Your constituency of registration</li>
                  <li>Your polling station (if assigned)</li>
                  <li>Your registration status: "REGISTERED"</li>
                  <li>Your registration number or reference ID</li>
                </ul>
              </div>

              <div className="mt-4 bg-orange-50 border border-orange-300 rounded-lg p-4">
                <p className="text-gray-700"><strong>Important:</strong> If you see any errors in your details (name spelled wrong, date of birth incorrect, etc.), note them and contact an IEBC office to correct them. Errors can cause problems when you try to vote.</p>
              </div>
            </div>
          </section>

          {/* Section 6: Common Issues */}
          <section id="issues" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Common Issues and How to Fix Them</h2>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">Here are common issues people encounter when checking voter status and how to resolve them:</p>
              
              <div className="space-y-4">
                <div className="border-l-4 border-orange-600 bg-orange-50 p-4 rounded">
                  <h4 className="font-bold text-gray-900 mb-2">❌ Issue: "No results found" when I check my status</h4>
                  <p className="text-gray-700 mb-2"><strong>Possible causes:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 mb-2">
                    <li>You entered your ID number incorrectly</li>
                    <li>You selected the wrong constituency</li>
                    <li>You have never registered as a voter</li>
                    <li>Your registration was cancelled</li>
                  </ul>
                  <p className="text-gray-700"><strong>Solution:</strong> (1) Check your ID number carefully and try again, (2) Select a different constituency if you moved, (3) Visit an IEBC office to confirm whether you need to register, (4) Ask IEBC staff to search their system manually.</p>
                </div>

                <div className="border-l-4 border-orange-600 bg-orange-50 p-4 rounded">
                  <h4 className="font-bold text-gray-900 mb-2">❌ Issue: My name is spelled wrong on the voter register</h4>
                  <p className="text-gray-700 mb-2"><strong>Why this happens:</strong> Names may be misspelled if you provided incorrect spelling during registration or if data entry errors occurred.</p>
                  <p className="text-gray-700"><strong>Solution:</strong> Visit your nearest IEBC county office with your voter card and ID. Request a name correction. Bring any official documents that show the correct spelling. IEBC staff will update your record. This usually takes a few minutes.</p>
                </div>

                <div className="border-l-4 border-orange-600 bg-orange-50 p-4 rounded">
                  <h4 className="font-bold text-gray-900 mb-2">❌ Issue: My date of birth is recorded incorrectly</h4>
                  <p className="text-gray-700 mb-2"><strong>Why this happens:</strong> Date of birth errors can occur during registration if there was confusion about date formats or typing mistakes.</p>
                  <p className="text-gray-700"><strong>Solution:</strong> Go to an IEBC office with your voter card and ID showing your correct date of birth. Request a date correction. IEBC staff will verify your correct date and update the system. This is usually done immediately.</p>
                </div>

                <div className="border-l-4 border-orange-600 bg-orange-50 p-4 rounded">
                  <h4 className="font-bold text-gray-900 mb-2">❌ Issue: I am showing as registered in the wrong constituency</h4>
                  <p className="text-gray-700 mb-2"><strong>Why this happens:</strong> You may have registered in an old constituency before moving, or you may have made a mistake during registration.</p>
                  <p className="text-gray-700"><strong>Solution:</strong> You cannot change your constituency after registration. You must re-register in your new constituency during the next registration period. Visit an IEBC office to understand re-registration procedures. You can only be registered in ONE constituency at a time.</p>
                </div>

                <div className="border-l-4 border-orange-600 bg-orange-50 p-4 rounded">
                  <h4 className="font-bold text-gray-900 mb-2">❌ Issue: The IEBC website is very slow or not working</h4>
                  <p className="text-gray-700 mb-2"><strong>Why this happens:</strong> During peak times (close to elections), the website gets heavy traffic and may slow down or experience temporary outages.</p>
                  <p className="text-gray-700"><strong>Solution:</strong> (1) Try again later when traffic is lower, (2) Use the SMS service instead, (3) Call IEBC's customer service number, (4) Visit an IEBC office in person, (5) Try using a different web browser or device.</p>
                </div>

                <div className="border-l-4 border-orange-600 bg-orange-50 p-4 rounded">
                  <h4 className="font-bold text-gray-900 mb-2">❌ Issue: I'm still showing as "Pending Verification" after 2 weeks</h4>
                  <p className="text-gray-700 mb-2"><strong>Why this happens:</strong> Verification can take longer if there are issues verifying your details against the national population register.</p>
                  <p className="text-gray-700"><strong>Solution:</strong> (1) Contact your nearest IEBC county office, (2) Bring your ID and registration confirmation slip, (3) Ask why verification is delayed, (4) Provide any additional documents IEBC may need, (5) Request an update on the timeline.</p>
                </div>

                <div className="border-l-4 border-orange-600 bg-orange-50 p-4 rounded">
                  <h4 className="font-bold text-gray-900 mb-2">❌ Issue: My voter card has not arrived yet</h4>
                  <p className="text-gray-700 mb-2"><strong>Why this happens:</strong> Voter cards are mailed to registered addresses but may be delayed due to postal delays or address issues.</p>
                  <p className="text-gray-700"><strong>Solution:</strong> (1) Check your voter status online – if it shows "registered," you can vote even without the card, (2) Bring your ID to the polling station, (3) Request a replacement voter card from IEBC, (4) Collect your voter card from your registration center.</p>
                </div>
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-300 rounded-lg p-4">
                <p className="text-gray-700"><strong>📞 When in doubt, contact IEBC:</strong> Call the IEBC helpline, visit the nearest IEBC office, or send an email through the IEBC website. IEBC staff are available to help resolve any issues with your voter registration or status check.</p>
              </div>
            </div>
          </section>

          {/* Section 7: Your Rights */}
          <section id="rights" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Your Rights When Checking Voter Status</h2>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">As a citizen checking your voter status, you have specific rights protected by Kenyan law. Learn more about <a href="/citizens-rights-during-elections-kenya" className="text-green-600 hover:text-green-700 font-medium">citizens' rights during elections</a>.</p>
              
              <div className="space-y-3 text-gray-700 mb-6">
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900">Right to Access Your Information</h4>
                    <p>You have the right to know if you are on the voter register and what information IEBC has recorded about you. IEBC must provide you with this information upon request.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900">Right to Data Privacy</h4>
                    <p>Your personal information collected during voter registration is protected. IEBC must keep your data confidential and secure. Your voter information cannot be shared with unauthorized parties.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900">Right to Request Corrections</h4>
                    <p>If you find errors in your registration details, you have the right to request corrections. IEBC must correct legitimate errors in your name, date of birth, or other details.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900">Right to Lodge a Complaint</h4>
                    <p>If you believe there has been an error or violation regarding your voter registration, you have the right to lodge a complaint with IEBC. IEBC must investigate and respond to your complaint.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900">Right to Vote</h4>
                    <p>If you are registered, you have the constitutional right to vote in elections. No one can prevent you from voting if you are on the voter register and meet all eligibility requirements.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900">Right to Assistance</h4>
                    <p>IEBC staff must assist you in checking your voter status. If you need help understanding the process, you can request assistance at any IEBC office.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 8: First-Time Voters */}
          <section id="firsttime" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <Users className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Tips for First-Time Voters Checking Status</h2>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">If you are a first-time voter, here are important tips for checking your voter status:</p>
              
              <div className="space-y-4">
                <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded">
                  <h3 className="font-bold text-gray-900 mb-2">1. Know Your ID Number</h3>
                  <p className="text-gray-700">First-time voters often don't have a national ID yet. You can register with a birth certificate. If you have a birth certificate, find the registration number on it. When you get your national ID later, you can update your voter registration with the new ID number.</p>
                </div>

                <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded">
                  <h3 className="font-bold text-gray-900 mb-2">2. Register Early</h3>
                  <p className="text-gray-700">First-time voters aged 18 should register as soon as possible. Do not wait until close to elections. IEBC conducts special registration campaigns targeting new 18-year-old voters. Check IEBC announcements for nearest registration center.</p>
                </div>

                <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded">
                  <h3 className="font-bold text-gray-900 mb-2">3. Check Status 1-2 Weeks After Registration</h3>
                  <p className="text-gray-700">After registering, wait 1-2 weeks for IEBC to verify your details. Then check your status online. This allows time for verification to complete and for any corrections to be made if needed.</p>
                </div>

                <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded">
                  <h3 className="font-bold text-gray-900 mb-2">4. Ask for Help if Confused</h3>
                  <p className="text-gray-700">If you don't understand your status result or how to interpret it, ask IEBC staff to explain. They are available at county offices and customer service hotlines. There are no silly questions – getting accurate information is important.</p>
                </div>

                <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded">
                  <h3 className="font-bold text-gray-900 mb-2">5. Save Your Registration Details</h3>
                  <p className="text-gray-700">Once you check your status and see you are registered, take a screenshot or write down your registration number, polling station, and other details. This information will help on election day.</p>
                </div>

                <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded">
                  <h3 className="font-bold text-gray-900 mb-2">6. Know Your Polling Station</h3>
                  <p className="text-gray-700">Your polling station is assigned based on your registered location. When you check your status, note the name and location of your polling station. Know how to get there before election day.</p>
                </div>

                <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded">
                  <h3 className="font-bold text-gray-900 mb-2">7. Bring ID on Election Day</h3>
                  <p className="text-gray-700">Even if you have not received your voter card by election day, you can still vote if you are registered. Bring any valid ID to your polling station. IEBC will verify that you are on the voter register and allow you to vote.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 9: FAQs */}
          <section id="faqs" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <MessageSquare className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Frequently Asked Questions About Checking Voter Status</h2>
            </div>
            <div className="space-y-3 mt-6">
              {faqsData.map((faq: FAQItem) => (
                <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full px-4 py-4 flex items-center justify-between hover:bg-green-50 transition bg-white"
                  >
                    <span className="text-left font-semibold text-gray-900 text-sm sm:text-base">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-green-600 flex-shrink-0 transition-transform ${
                        expandedFAQ === faq.id ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedFAQ === faq.id && (
                    <div className="px-4 py-4 bg-green-50 border-t border-gray-200">
                      <p className="text-gray-700 text-sm sm:text-base">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="mt-12 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-8 border border-green-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Check Your Voter Status?</h3>
            <p className="text-gray-700 mb-6">Verify your registration today to ensure you are ready to vote in upcoming elections. The process takes just a few seconds online.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="https://www.iebc.or.ke" target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2">
                Check Status Now <ArrowRight className="w-5 h-5" />
              </a>
              <a href="https://wa.me/254112810203?text=I%20need%20help%20checking%20my%20voter%20status%20in%20Kenya" target="_blank" rel="noopener noreferrer" className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition flex items-center justify-center gap-2">
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
                <li><a href="/understanding-iebc-kenya" className="hover:text-green-400 transition">Understanding IEBC</a></li>
                <li><a href="/how-to-register-as-a-voter-kenya" className="hover:text-green-400 transition">Register as a Voter</a></li>
                <li><a href="/elections-in-kenya" className="hover:text-green-400 transition">Elections in Kenya</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Contact Us</h4>
              <p className="text-sm mb-2">Email: <a href="mailto:johnsonthuraniramwangi@gmail.com" className="text-green-400 hover:text-green-300">johnsonthuraniramwangi@gmail.com</a></p>
              <p className="text-sm">WhatsApp: <a href="https://wa.me/254112810203" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300">+254 112 810 203</a></p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Official Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://www.iebc.or.ke" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition">IEBC Website</a></li>
                <li><a href="https://www.iebc.or.ke/voter-status/" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition">Voter Status Checker</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-sm">
            <p className="mb-2">© 2026 Wakili. All rights reserved.</p>
            <p className="text-gray-500">This is an informational resource. Always refer to official <a href="https://www.iebc.or.ke" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300">IEBC sources</a> for official voter status information.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}