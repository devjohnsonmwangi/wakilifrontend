import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, AlertCircle, ArrowRight, Search, Clock, DollarSign, FileText, Shield, TrendingUp, X } from 'lucide-react';

const BusinessNameSearchKenya = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [searchName, setSearchName] = useState<string>('');
  const [showSearchSimulation, setShowSearchSimulation] = useState<boolean>(false);

  // FAQ data
  const faqs = [
    {
      question: 'Can I search for a business name without registering?',
      answer: 'Yes. You can search eCitizen without creating an account to check name availability. But you must create an account and log in to reserve a name. Searching is free; reservation costs KES 500 or is free depending on the business type (governed by Business Registration Act, Section 5).'
    },
    {
      question: 'How long can I reserve a business name?',
      answer: 'A business name is reserved for 6 months (Business Registration Act, Section 5). If you don\'t complete registration within 6 months, the reservation expires and the name becomes available again. You can apply for a new reservation if needed.'
    },
    {
      question: 'Can someone else use my reserved name?',
      answer: 'No. Once you reserve a name on eCitizen, it\'s locked to your reservation for 6 months. No one else can reserve or register that exact name during this period (Business Registration Act, Section 5). This gives you exclusive use.'
    },
    {
      question: 'What makes a name "too similar" to an existing one?',
      answer: 'BRELA considers names too similar if they have the same spelling, sound, or meaning. Example: "John\'s Hardware" and "Johns Hardware" (different apostrophe) could be rejected. Minor differences in punctuation or spelling don\'t matter. BRELA uses a similarity algorithm to check.'
    },
    {
      question: 'Can I reserve multiple names at once?',
      answer: 'Yes, but each reservation requires a separate fee (KES 500 per name or free). You can reserve up to 5-10 names depending on your business type. This is common for entrepreneurs exploring options (Business Registration Act, Section 5).'
    },
    {
      question: 'What if my name gets rejected? Can I appeal?',
      answer: 'Yes. If BRELA rejects your name, you\'ll receive a reason (e.g., too similar to existing name, prohibited word). You can modify the name and reapply for free. If you believe the rejection is wrong, you can submit an appeal with justification through eCitizen (Business Registration Act, Section 5 appeals process).'
    },
    {
      question: 'Do I need a lawyer to search and reserve a business name?',
      answer: 'No. The eCitizen process is simple and free/cheap. Most people do it themselves. A lawyer is only helpful if you\'re unsure about naming rules or want legal advice on brand protection, which is optional (Business Registration Act, Section 5).'
    },
    {
      question: 'Can foreigners search and reserve names in Kenya?',
      answer: 'Yes. Foreign nationals can search and reserve business names (Business Registration Act, Section 4 allows foreign ownership with valid identification). You must have a valid passport or alien travel document and a Kenya address for the reservation.'
    },
    {
      question: 'How do I check if a name is already trademarked?',
      answer: 'The eCitizen name search only checks BRELA\'s business register. For trademark protection, separately search the Kenya Industrial Property Institute (KIPI) database at www.kipi.go.ke. Business name ≠ trademark registration. Both are separate legal protections (Business Registration Act, Section 5; Trademark Act).'
    },
    {
      question: 'Can I register a business without reserving a name first?',
      answer: 'Technically no. You must search and reserve a name before completing full registration (Business Registration Act, Section 5). The reserved name becomes part of your registration application. Name reservation is mandatory.'
    },
    {
      question: 'What if my preferred name includes a registered trademark?',
      answer: 'BRELA will likely reject it (Business Registration Act, Section 5 prohibits misleading or identical names). If your name includes a trademarked term, you may face legal action from the trademark holder. Always check both BRELA and KIPI databases.'
    },
    {
      question: 'Can I transfer my reserved name to someone else?',
      answer: 'No. A reserved name is locked to the person who made the reservation (Business Registration Act, Section 5). You cannot transfer it. The person must do the full registration using that reserved name.'
    },
    {
      question: 'What if I misspelled my name during reservation?',
      answer: 'You can cancel the incorrect reservation (KES 100 fee or free depending on circumstances) and make a new reservation with the correct spelling (Business Registration Act, Section 5). Process this quickly to avoid wasting your 6-month window.'
    },
    {
      question: 'Do I need to reserve a name for a sole proprietorship or partnership?',
      answer: 'Yes. All business types (sole proprietorship, partnership, limited company, NGO) require name reservation before registration (Business Registration Act, Section 5 applies to all). The process is identical for all types.'
    },
    {
      question: 'What is the difference between name search and name reservation?',
      answer: 'Name search: Quick check to see if a name is available. Free. Does not lock the name. Name reservation: Officially reserves the name for you for 6 months. Costs KES 500 or free. Only you can use it during this period (Business Registration Act, Section 5).'
    }
  ];

  // Name rules data
  const nameRules = [
    {
      rule: 'Must contain business type indicator (Ltd, & Co, Partnership)',
      example: '"John Smith Electrical Ltd" ✓ | "John Smith Electrical" ✗',
      source: 'Business Registration Act, Section 5'
    },
    {
      rule: 'Cannot be identical to existing registered name',
      example: '"ABC Hardware Ltd" (if already exists) ✗',
      source: 'Business Registration Act, Section 5'
    },
    {
      rule: 'Cannot be misleading or offensive',
      example: '"Magic Medicine" (misleading health claim) ✗',
      source: 'Business Registration Act, Section 5'
    },
    {
      rule: 'Cannot use protected words without permission',
      example: '"Bank", "Insurance", "Court" without license ✗',
      source: 'Business Registration Act, Section 5'
    },
    {
      rule: 'Cannot be in a language other than English',
      example: '"Kinyozi Ya Mama" (Swahili) ✗',
      source: 'Business Registration Act, Section 5 (English only for formal registration)'
    },
    {
      rule: 'Must have minimum 2 characters',
      example: '"A Hardware" ✗ | "AA Hardware" ✓',
      source: 'BRELA eCitizen Standards'
    }
  ];

  // Name reservation fees
  const reservationFees = [
    { item: 'Sole Proprietorship Name Search', cost: 'Free' },
    { item: 'Sole Proprietorship Name Reservation', cost: 'Free - KES 500' },
    { item: 'Partnership Name Reservation', cost: 'KES 500' },
    { item: 'Limited Company Name Reservation', cost: 'KES 500' },
    { item: 'NGO/Society Name Reservation', cost: 'KES 500' },
    { item: 'Name Cancellation (early termination)', cost: 'KES 100 or Free' },
    { item: 'Additional Reserve (if first expires)', cost: 'KES 500' }
  ];

  // Step-by-step registration process
  const steps = [
    {
      number: 1,
      title: 'Go to eCitizen Portal',
      description: 'Visit www.ecitizen.go.ke (BRELA eCitizen Framework). This is the official Kenya government services portal. It\'s secure and regulated by the Treasury.'
    },
    {
      number: 2,
      title: 'Create or Log In to Your Account',
      description: 'Create a free eCitizen account using your email and phone number (Business Registration Act, Section 4 requires identity verification). If you already have an account, just log in.'
    },
    {
      number: 3,
      title: 'Navigate to BRELA Services',
      description: 'Look for "Business Registration" or "BRELA Services" on the eCitizen dashboard. Select "Search Business Name" or "Name Search & Reservation" (BRELA digital framework).'
    },
    {
      number: 4,
      title: 'Enter Your Desired Business Name',
      description: 'Type the exact name you want to use, including business type (Ltd, & Co, Partnership). Example: "Tech Solutions Ltd" or "Mary\'s Salon & Spa". The system is case-insensitive (Business Registration Act, Section 5).'
    },
    {
      number: 5,
      title: 'Click Search and Check Results',
      description: 'The system instantly checks BRELA\'s register. Results show: "Available" (you can reserve), "Taken" (identical name exists), or "Similar" (too close to existing name). The search takes 5-30 seconds.'
    },
    {
      number: 6,
      title: 'Choose Reserve or Continue Searching',
      description: 'If available, click "Reserve Name" to lock it for 6 months (Business Registration Act, Section 5). If not available, try alternative names. Most people search 3-5 options before finding one they like.'
    },
    {
      number: 7,
      title: 'Complete Payment (if applicable)',
      description: 'Pay the reservation fee using M-Pesa, bank account, or credit card (BRELA Transaction Framework). Sole proprietorships may get free reservation; others pay KES 500. You receive a confirmation immediately.'
    },
    {
      number: 8,
      title: 'Receive Reservation Certificate',
      description: 'Your reserved name is now locked for 6 months (Business Registration Act, Section 5). Download your reservation certificate immediately from eCitizen. Save it — you need this for full business registration.'
    }
  ];

  // Scroll tracking
  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      try {
        const sectionList = ['overview', 'what-is-search', 'why-important', 'naming-rules', 'how-to-search', 'how-to-reserve', 'requirements', 'fees', 'timeline', 'rejection-reasons', 'tips', 'after-approval', 'faqs'];
        
        for (let i = sectionList.length - 1; i >= 0; i--) {
          const element = document.getElementById(sectionList[i]);
          if (element && element.offsetTop <= window.scrollY + 100) {
            setActiveSection(sectionList[i]);
            break;
          }
        }
      } catch (error) {
        console.error('Error in scroll tracking:', error);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Helmet>
        <title>Business Name Search & Reservation Kenya – eCitizen Guide 2026 & 2027</title>
        <meta name="description" content="Check business name availability in Kenya on eCitizen. Complete guide to name search, reservation (6 months), rules, fees. Step-by-step instructions & legal requirements." />
        <meta name="keywords" content="business name search kenya, check name availability kenya, name reservation kenya, ecitizen name search, business name check online, register business name, name approval kenya" />
        <link rel="canonical" href="https://wakili.co.ke/business-name-search-kenya" />
        <meta property="og:title" content="Business Name Search & Reservation in Kenya – eCitizen Guide 2026 & 2027" />
        <meta property="og:description" content="Learn how to search, check availability, and reserve your business name in Kenya. Complete legal guide with step-by-step instructions." />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Business Name Search Kenya – eCitizen Name Reservation Guide 2026 & 2027" />
        <meta name="twitter:description" content="Step-by-step guide to search availability and reserve your business name on eCitizen. Free/KES 500 reservation fee." />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* JSON-LD Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Wakili Legal Services",
            "url": "https://wakili.co.ke",
            "logo": "https://wakili.co.ke/logo.png",
            "description": "Kenya's leading legal services platform for business registration and legal guidance"
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "url": "https://wakili.co.ke",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://ecitizen.go.ke/#!/search?q={search_term}"
              },
              "query-input": "required name=search_term"
            }
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
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
                "name": "Business Name Search & Reservation",
                "item": "https://wakili.co.ke/business-name-search-kenya"
              }
            ]
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Search and Reserve a Business Name in Kenya",
            "description": "Complete step-by-step guide to searching business name availability and making a reservation on eCitizen",
            "step": [
              {
                "@type": "HowToStep",
                "position": 1,
                "name": "Go to eCitizen Portal",
                "text": "Visit www.ecitizen.go.ke - Kenya's official government services portal"
              },
              {
                "@type": "HowToStep",
                "position": 2,
                "name": "Create or Log In to Account",
                "text": "Create a free eCitizen account or log in with your existing credentials"
              },
              {
                "@type": "HowToStep",
                "position": 3,
                "name": "Navigate to BRELA Services",
                "text": "Select 'Business Registration' or 'BRELA Services' from the dashboard"
              },
              {
                "@type": "HowToStep",
                "position": 4,
                "name": "Search Your Business Name",
                "text": "Enter your desired name including business type (Ltd, & Co, Partnership)"
              },
              {
                "@type": "HowToStep",
                "position": 5,
                "name": "Check Availability",
                "text": "System shows if name is Available, Taken, or Similar to existing names"
              },
              {
                "@type": "HowToStep",
                "position": 6,
                "name": "Reserve the Name",
                "text": "Click 'Reserve Name' to lock it for 6 months (if available)"
              },
              {
                "@type": "HowToStep",
                "position": 7,
                "name": "Pay Reservation Fee",
                "text": "Pay using M-Pesa, bank transfer, or credit card (KES 500 or free)"
              },
              {
                "@type": "HowToStep",
                "position": 8,
                "name": "Download Certificate",
                "text": "Save your reservation certificate - needed for full business registration"
              }
            ]
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })}
        </script>
      </Helmet>

      {/* Main Content */}
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 text-white py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-start gap-3 mb-4">
              <Search className="w-8 h-8 flex-shrink-0" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">Business Name Search & Reservation in Kenya</h1>
            </div>
            <p className="text-blue-100 text-lg max-w-3xl">Check availability, reserve your business name online on eCitizen, and understand Kenya's naming rules. Complete legal guide with step-by-step instructions.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="https://ecitizen.go.ke" target="_blank" rel="noopener noreferrer" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 flex items-center gap-2">
                <Search className="w-5 h-5" />
                Check Name on eCitizen
              </a>
              <a href="/how-to-register-business-kenya" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
                Start Business Registration <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm text-gray-600">
            <ol className="flex items-center gap-2">
              <li><a href="/" className="text-blue-600 hover:text-blue-700">Home</a></li>
              <li>/</li>
              <li>Business Name Search</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar TOC */}
            <div className="lg:col-span-1">
              {/* Mobile: Horizontal scrolling navigation */}
              <div className="lg:hidden mb-6 bg-white rounded-xl shadow-sm p-4">
                <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Contents</h3>
                <nav className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'what-is-search', label: 'What is Name Search' },
                    { id: 'why-important', label: 'Why Reservation Matters' },
                    { id: 'naming-rules', label: 'Naming Rules' },
                    { id: 'how-to-search', label: 'How to Search' },
                    { id: 'how-to-reserve', label: 'How to Reserve' },
                    { id: 'requirements', label: 'Requirements' },
                    { id: 'fees', label: 'Fees & Costs' },
                    { id: 'timeline', label: 'Timeline' },
                    { id: 'rejection-reasons', label: 'Rejection Reasons' },
                    { id: 'tips', label: 'Tips for Approval' },
                    { id: 'after-approval', label: 'After Approval' },
                    { id: 'faqs', label: 'FAQs' }
                  ].map(item => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={() => setActiveSection(item.id)}
                      className={`whitespace-nowrap text-sm py-2 px-4 rounded-lg transition flex-shrink-0 ${
                        activeSection === item.id
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Desktop: Sticky sidebar navigation */}
              <div className="hidden lg:block sticky top-20 bg-white rounded-xl shadow-sm p-6 max-h-screen overflow-y-auto">
                <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Contents</h3>
                <nav className="space-y-2">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'what-is-search', label: 'What is Name Search' },
                    { id: 'why-important', label: 'Why Reservation Matters' },
                    { id: 'naming-rules', label: 'Naming Rules' },
                    { id: 'how-to-search', label: 'How to Search' },
                    { id: 'how-to-reserve', label: 'How to Reserve' },
                    { id: 'requirements', label: 'Requirements' },
                    { id: 'fees', label: 'Fees & Costs' },
                    { id: 'timeline', label: 'Timeline' },
                    { id: 'rejection-reasons', label: 'Rejection Reasons' },
                    { id: 'tips', label: 'Tips for Approval' },
                    { id: 'after-approval', label: 'After Approval' },
                    { id: 'faqs', label: 'FAQs' }
                  ].map(item => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={() => setActiveSection(item.id)}
                      className={`block text-sm py-2 px-3 rounded-lg transition ${
                        activeSection === item.id
                          ? 'bg-blue-100 text-blue-700 font-semibold'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-12">
              {/* Overview Section */}
              <section id="overview" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Overview: Business Name Search in Kenya</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                    Before you register a business in Kenya, you must search for and reserve your desired business name on <strong>eCitizen</strong>, Kenya's official online government portal. This step is mandatory under the <strong>Business Registration Act (Cap. 499), Section 5</strong>, and is overseen by <strong>BRELA (Business Registration and Licensing Authority)</strong>. The process is simple, fast (5-30 seconds), and costs KES 500 or free depending on your business type. This guide explains every step, the rules you must follow, common mistakes, and answers to frequently asked questions.
                  </p>

                  <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border-l-4 border-blue-600">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-700 mb-1">5-30</div>
                        <div className="text-xs text-gray-600">Seconds to Search</div>
                        <p className="text-sm text-gray-700 mt-2">Instant availability check</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-700 mb-1">6</div>
                        <div className="text-xs text-gray-600">Months Reservation</div>
                        <p className="text-sm text-gray-700 mt-2">Name locked for you</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-700 mb-1">KES 500</div>
                        <div className="text-xs text-gray-600">or Free</div>
                        <p className="text-sm text-gray-700 mt-2">Reservation fee</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded-lg mb-6">
                    <h4 className="font-bold text-gray-900 mb-2">Why This Step Matters</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Legal Requirement:</strong> Business Registration Act, Section 5 mandates name search before registration</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Exclusive Rights:</strong> Reservation locks your name for 6 months—no one else can use it</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Time Saver:</strong> Catch naming conflicts early, avoid registration rejection and delays</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Affordable:</strong> Free or KES 500—cheapest part of business registration</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* What is Business Name Search */}
              <section id="what-is-search" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Search className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What is a Business Name Search?</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-4">
                    A <strong>business name search</strong> is an online check through BRELA's register to see if your desired business name is available for registration in Kenya. It's governed by the <strong>Business Registration Act, Section 5</strong>, which requires all business owners to search before registering.
                  </p>

                  <div className="bg-white border-2 border-gray-200 p-6 rounded-xl mb-6">
                    <h4 className="font-bold text-gray-900 mb-3">How It Works (Simple Version)</h4>
                    <ol className="space-y-3 text-gray-700">
                      <li className="flex gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-bold flex-shrink-0">1</span>
                        <span>You type your desired business name into eCitizen</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-bold flex-shrink-0">2</span>
                        <span>The system searches BRELA's database of all registered names in Kenya</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-bold flex-shrink-0">3</span>
                        <span>Results appear instantly (5–30 seconds): "Available", "Taken", or "Similar"</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-bold flex-shrink-0">4</span>
                        <span>If available, you can reserve it for 6 months (Business Registration Act, Section 5)</span>
                      </li>
                    </ol>
                  </div>

                  <div className="bg-cyan-50 border-l-4 border-cyan-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>Key Point:</strong> Name search is different from name reservation. <strong>Search</strong> = free check. <strong>Reservation</strong> = officially locks the name for 6 months (costs KES 500 or free). You must do both.</p>
                  </div>
                </div>
              </section>

              {/* Why Name Reservation is Important */}
              <section id="why-important" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Why Name Reservation is Important</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Name reservation is a critical step in business registration. Here's why it matters under Kenyan law:</p>

                  {/* Image Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <img 
                      src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=300&fit=crop"
                      alt="Business Planning"
                      className="rounded-lg shadow-lg w-full h-64 object-cover"
                    />
                    <img 
                      src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=500&h=300&fit=crop"
                      alt="Brand Protection"
                      className="rounded-lg shadow-lg w-full h-64 object-cover"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white border-2 border-blue-200 p-6 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        Exclusive Rights for 6 Months
                      </h4>
                      <p className="text-gray-700 text-sm"><strong>(Business Registration Act, Section 5):</strong> Once you reserve a name, no one else can register or use that exact name for 6 months. You have exclusive right to it during this period. This protects your brand while you prepare for full registration.</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-6 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        Avoids Registration Rejection
                      </h4>
                      <p className="text-gray-700 text-sm">If you don't reserve first and someone registers your intended name before you complete registration, your application will be rejected. Reservation prevents this costly delay. <strong>(Business Registration Act, Section 5)</strong></p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-6 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        Legal Proof of Intent
                      </h4>
                      <p className="text-gray-700 text-sm">Your reservation certificate is proof that you legally intended to register this business. It shows dates, name, and your identity. Required for full registration and useful for legal disputes. <strong>(Business Registration Act, Section 5)</strong></p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-6 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        Prevents Squatting
                      </h4>
                      <p className="text-gray-700 text-sm">Prevents others from "squatting" on your chosen name. Without reservation, someone could register your intended name and force you to choose a different one, damaging your brand.</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-6 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        Fast & Cheap
                      </h4>
                      <p className="text-gray-700 text-sm">Reservation takes 5 minutes online and costs KES 500 (or free). It's the cheapest and fastest part of business registration. No reason not to do it immediately.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Naming Rules */}
              <section id="naming-rules" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Rules for Choosing a Business Name in Kenya</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Not every name is acceptable. Kenya's <strong>Business Registration Act, Section 5</strong> sets strict rules. If your name violates these rules, BRELA will reject it. Here are all the rules:</p>

                  <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">Rule</th>
                          <th className="px-4 py-3 text-left font-semibold">Good Example ✓</th>
                          <th className="px-4 py-3 text-left font-semibold">Bad Example ✗</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {nameRules.map((rule, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900 text-sm">{rule.rule} <br /> <span className="text-xs text-gray-500">{rule.source}</span></td>
                            <td className="px-4 py-3 text-green-700 text-sm font-semibold">{rule.example.split(' | ')[0]}</td>
                            <td className="px-4 py-3 text-red-700 text-sm font-semibold">{rule.example.split(' | ')[1]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>Pro Tip:</strong> When choosing your name, think of 3–5 alternatives. If your first choice is rejected, you can immediately search and reserve your second choice without losing time.</p>
                  </div>
                </div>
              </section>

              {/* How to Check Name Availability - Interactive */}
              <section id="how-to-search" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Search className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How to Check Name Availability on eCitizen (Step-by-Step)</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Here's the exact, detailed process to search for your business name on eCitizen. It takes 5–10 minutes total.</p>

                  {/* Instructional Image */}
                  <img 
                    src="https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=800&h=400&fit=crop"
                    alt="eCitizen Portal Step-by-Step"
                    className="rounded-lg shadow-lg w-full mb-8"
                  />

                  <div className="space-y-4 mb-6">
                    {steps.slice(0, 5).map((step) => (
                      <div key={step.number} className="bg-white border-2 border-gray-200 p-6 rounded-xl">
                        <div className="flex gap-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex-shrink-0">
                            {step.number}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 mb-2">{step.title}</h4>
                            <p className="text-gray-700 text-sm">{step.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Search Simulation UI */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 p-6 rounded-xl mb-6">
                    <h4 className="font-bold text-gray-900 mb-4">🔍 Try It Out: Simulate a Name Search</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Enter Your Desired Business Name:</label>
                        <input
                          type="text"
                          placeholder="e.g., Tech Solutions Ltd"
                          value={searchName}
                          onChange={(e) => setSearchName(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                        />
                      </div>
                      <button
                        onClick={() => setShowSearchSimulation(true)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
                      >
                        <Search className="w-5 h-5" />
                        Search eCitizen
                      </button>
                    </div>

                    {showSearchSimulation && searchName && (
                      <div className="mt-4 p-4 bg-white rounded-lg border-2 border-blue-300">
                        <p className="text-sm text-gray-600 mb-3">Searching BRELA database...</p>
                        <div className="space-y-2">
                          <p className="text-sm"><strong>Search Query:</strong> "{searchName}"</p>
                          <p className="text-sm"><strong>Status:</strong> <span className="text-green-700 font-semibold">✓ AVAILABLE</span></p>
                          <p className="text-sm text-green-700"><strong>Result:</strong> This name is not registered in BRELA's database. You can proceed to reserve it.</p>
                          <button
                            onClick={() => setShowSearchSimulation(false)}
                            className="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
                          >
                            Reserve This Name
                          </button>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => setShowSearchSimulation(false)}
                      className="mt-2 text-sm text-gray-600 hover:text-gray-900"
                    >
                      {showSearchSimulation && 'Close'}
                    </button>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>Real Search:</strong> This is a simulation. For a real search, visit <a href="https://ecitizen.go.ke" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-semibold">www.ecitizen.go.ke</a> directly and follow these exact steps.</p>
                  </div>
                </div>
              </section>

              {/* How to Reserve Name */}
              <section id="how-to-reserve" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How to Reserve Your Business Name (Step-by-Step)</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">After you find an available name, here's how to officially reserve it for 6 months <strong>(Business Registration Act, Section 5)</strong>:</p>

                  <div className="space-y-4 mb-6">
                    {steps.slice(5, 8).map((step) => (
                      <div key={step.number} className="bg-white border-2 border-gray-200 p-6 rounded-xl">
                        <div className="flex gap-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex-shrink-0">
                            {step.number}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 mb-2">{step.title}</h4>
                            <p className="text-gray-700 text-sm">{step.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-lg mb-6">
                    <h4 className="font-bold text-gray-900 mb-2">✓ Reservation Confirmed!</h4>
                    <p className="text-gray-700 text-sm">Once you see the confirmation message and download your certificate, your name is officially reserved. No one else can use it. You now have 6 months to complete your business registration <strong>(Business Registration Act, Section 5)</strong>.</p>
                  </div>
                </div>
              </section>

              {/* Requirements */}
              <section id="requirements" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Required Details & Documents</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-4">To search and reserve a business name on eCitizen, you'll need these minimal details <strong>(Business Registration Act, Section 4)</strong>:</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white border-2 border-gray-200 p-6 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-3">For Name Search (Free)</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li className="flex gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          No account needed
                        </li>
                        <li className="flex gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          Just the business name you want to check
                        </li>
                        <li className="flex gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          Takes 5 seconds
                        </li>
                      </ul>
                    </div>

                    <div className="bg-white border-2 border-gray-200 p-6 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-3">For Name Reservation</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li className="flex gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          eCitizen account (email + phone number)
                        </li>
                        <li className="flex gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          Valid National ID or passport <strong>(Business Registration Act, Section 4)</strong>
                        </li>
                        <li className="flex gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          Payment method (M-Pesa, bank, or card)
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>Tip:</strong> Create your eCitizen account NOW before you search for names. Account creation takes 5 minutes and is free. You'll need it anyway for business registration.</p>
                  </div>
                </div>
              </section>

              {/* Fees Section */}
              <section id="fees" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <DollarSign className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Name Reservation Fees & Costs</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-4">Here's the complete breakdown of costs for name search and reservation in Kenya <strong>(BRELA 2025 fees)</strong>:</p>

                  {/* Cost Visualization Image */}
                  <img 
                    src="https://images.unsplash.com/photo-1526628652108-aa545b6f6d97?w=800&h=400&fit=crop"
                    alt="Business Registration Costs"
                    className="rounded-lg shadow-lg w-full mb-6"
                  />

                  <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">Service</th>
                          <th className="px-4 py-3 text-left font-semibold">Cost (KES)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {reservationFees.map((fee, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">{fee.item}</td>
                            <td className="px-4 py-3 text-gray-700 font-semibold">{fee.cost}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>Budget Summary:</strong> Most businesses pay KES 500 to reserve a name. Sole proprietorships may get free reservation. Total cost for name search + reservation: KES 0–500.</p>
                  </div>
                </div>
              </section>

              {/* Timeline */}
              <section id="timeline" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How Long Does Name Reservation Last?</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Here's the timeline for name reservations in Kenya <strong>(Business Registration Act, Section 5)</strong>:</p>

                  {/* Timeline Image */}
                  <img 
                    src="https://images.unsplash.com/photo-1495530046612-b6d3abf32e2e?w=800&h=400&fit=crop"
                    alt="Timeline and Duration"
                    className="rounded-lg shadow-lg w-full mb-6"
                  />

                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 p-6 rounded-xl mb-6">
                    <h4 className="font-bold text-gray-900 mb-4">📅 Name Reservation Timeline</h4>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="text-center flex-shrink-0">
                          <div className="text-2xl font-bold text-blue-700">Day 1</div>
                          <div className="text-xs text-gray-600">Reservation</div>
                        </div>
                        <div className="text-gray-700 text-sm">
                          <p><strong>You reserve your name on eCitizen.</strong> Reservation begins immediately. You receive a confirmation email with your reservation certificate.</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="text-center flex-shrink-0">
                          <div className="text-2xl font-bold text-blue-700">Days 1–180</div>
                          <div className="text-xs text-gray-600">6 Months</div>
                        </div>
                        <div className="text-gray-700 text-sm">
                          <p><strong>Your name is locked exclusively.</strong> No one else can register or reserve this name. You have 6 months (180 days) to complete your business registration <strong>(Business Registration Act, Section 5)</strong>.</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="text-center flex-shrink-0">
                          <div className="text-2xl font-bold text-blue-700">Day 180</div>
                          <div className="text-xs text-gray-600">Expiration</div>
                        </div>
                        <div className="text-gray-700 text-sm">
                          <p><strong>Reservation expires if you haven't registered.</strong> If you don't complete business registration within 6 months, the reservation automatically expires. The name becomes available for others to reserve.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">⚠️ Don't Wait Too Long!</h4>
                    <p className="text-gray-700 text-sm">You have 6 months to register from the reservation date. If you miss this deadline, your reservation expires and you'll need to re-reserve the name (another KES 500) if it's still available. Best practice: Register your business within 1–2 months of reserving the name.</p>
                  </div>
                </div>
              </section>

              {/* Rejection Reasons */}
              <section id="rejection-reasons" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Common Reasons Names Are Rejected</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Here are the most common reasons BRELA rejects business names <strong>(Business Registration Act, Section 5)</strong>. Understand these to avoid delays:</p>

                  {/* Rejection Reasons Image */}
                  <img 
                    src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop"
                    alt="Common Rejection Reasons"
                    className="rounded-lg shadow-lg w-full mb-6"
                  />

                  <div className="space-y-3">
                    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">❌ Name Already Exists (Identical Match)</h4>
                      <p className="text-gray-700 text-sm"><strong>(Business Registration Act, Section 5):</strong> The exact name is already registered. Example: If "ABC Hardware Ltd" exists, you cannot register another "ABC Hardware Ltd". Search more carefully or choose a unique name.</p>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">❌ Name Too Similar to Existing Name</h4>
                      <p className="text-gray-700 text-sm"><strong>(Business Registration Act, Section 5):</strong> BRELA's algorithm detects names that sound the same or look too similar. Example: "ABC Hardwre Ltd" vs "ABC Hardware Ltd" (typo) may be rejected as too similar.</p>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">❌ Missing Business Type Indicator</h4>
                      <p className="text-gray-700 text-sm"><strong>(Business Registration Act, Section 5):</strong> Name doesn't include Ltd, & Co, or Partnership. Example: "John's Salon" ✗ should be "John's Salon Ltd" ✓</p>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">❌ Misleading or Offensive Name</h4>
                      <p className="text-gray-700 text-sm"><strong>(Business Registration Act, Section 5):</strong> Name suggests illegal activity, makes false medical claims, or contains offensive language. Example: "Miracle Cancer Cure Ltd" ✗</p>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">❌ Protected Word Without License</h4>
                      <p className="text-gray-700 text-sm"><strong>(Business Registration Act, Section 5):</strong> Using words like "Bank", "Insurance", "University", "Court" without proper government license. Example: "John's Bank Ltd" ✗ (not licensed)</p>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">❌ Name Not in English</h4>
                      <p className="text-gray-700 text-sm"><strong>(Business Registration Act, Section 5):</strong> BRELA only accepts names in English for formal business registration. Example: "Kinyozi Mama Ltd" (Swahili) ✗ should be "Mom's Barbershop Ltd" ✓</p>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">❌ Name Contains Forbidden Characters</h4>
                      <p className="text-gray-700 text-sm"><strong>(BRELA eCitizen Standards):</strong> Special characters like @, #, $, %, &* may cause rejection. Stick to letters, numbers, and basic punctuation (apostrophe, hyphen, period).</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg mt-6">
                    <h4 className="font-bold text-gray-900 mb-2">💡 Quick Fix</h4>
                    <p className="text-gray-700 text-sm">If your name is rejected, BRELA will tell you why. Simply modify the name (add "Ltd", change spelling, remove problematic words) and search again immediately. No extra fee for reapplication.</p>
                  </div>
                </div>
              </section>

              {/* Tips for Faster Approval */}
              <section id="tips" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Tips for Faster Name Approval</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Follow these tips to ensure your name is approved instantly <strong>(Business Registration Act, Section 5)</strong>:</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-green-50 border-2 border-green-200 p-6 rounded-xl">
                      <h4 className="font-bold text-green-700 mb-3">✓ Do These</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li className="flex gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          Include business type (Ltd, & Co, Partnership)
                        </li>
                        <li className="flex gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          Use common English words easy to spell
                        </li>
                        <li className="flex gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          Choose 3–5 backup names (in case first is taken)
                        </li>
                        <li className="flex gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          Check trademark database (KIPI) for protection
                        </li>
                        <li className="flex gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          Reserve multiple names if budget allows
                        </li>
                      </ul>
                    </div>

                    <div className="bg-red-50 border-2 border-red-200 p-6 rounded-xl">
                      <h4 className="font-bold text-red-700 mb-3">✗ Avoid These</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li className="flex gap-2">
                          <X className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                          Names suggesting illegal activity or false claims
                        </li>
                        <li className="flex gap-2">
                          <X className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                          Very long names (hard to remember and type)
                        </li>
                        <li className="flex gap-2">
                          <X className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                          Names too similar to major brands
                        </li>
                        <li className="flex gap-2">
                          <X className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                          Names with special characters (@, #, $, %)
                        </li>
                        <li className="flex gap-2">
                          <X className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                          Names that violate other laws (trademark, protected words)
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">🎯 Pro Strategy</h4>
                    <p className="text-gray-700 text-sm">Come up with a unique, memorable name that represents your business. Search it with BRELA (free check). If taken, immediately add a location or qualifier. Example: "ABC Hardware Ltd" taken? Try "ABC Hardware Nairobi Ltd" or "ABC Premium Hardware Ltd".</p>
                  </div>
                </div>
              </section>

              {/* After Approval */}
              <section id="after-approval" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What to Do After Name Approval</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Congratulations! Your name is reserved. Now you have 6 months <strong>(Business Registration Act, Section 5)</strong> to complete these legal steps:</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white border-2 border-gray-200 p-6 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        Save Your Reservation Certificate
                      </h4>
                      <p className="text-gray-700 text-sm">Download and save the PDF certificate to your phone/computer. You'll need this to complete business registration. Keep multiple copies (digital and printed).</p>
                    </div>

                    <div className="bg-white border-2 border-gray-200 p-6 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        Complete Business Registration
                      </h4>
                      <p className="text-gray-700 text-sm"><strong>(Business Registration Act, Section 5):</strong> Complete your full business registration on eCitizen within 6 months. Use your reserved name and your reservation certificate.</p>
                    </div>

                    <div className="bg-white border-2 border-gray-200 p-6 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        Get KRA PIN Certificate
                      </h4>
                      <p className="text-gray-700 text-sm"><strong>(Income Tax Act, Section 3-5):</strong> Apply for a KRA PIN (Tax Identification Number) from Kenya Revenue Authority. Required for taxes and bank accounts. See <a href="/kra-pin-for-business-kenya" className="text-blue-600 hover:text-blue-700 font-medium">KRA PIN for Business</a>.</p>
                    </div>

                    <div className="bg-white border-2 border-gray-200 p-6 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        Open Business Bank Account
                      </h4>
                      <p className="text-gray-700 text-sm"><strong>(Business Registration Act, Section 8):</strong> Open a business bank account in your company's name. Banks require your business registration certificate or reservation certificate to do this.</p>
                    </div>

                    <div className="bg-white border-2 border-gray-200 p-6 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        Get Business Permits & Licenses
                      </h4>
                      <p className="text-gray-700 text-sm"><strong>(BRELA Licensing Framework):</strong> Depending on your business type, obtain necessary licenses (food handling, retail, etc.). Your reserved name must match official licenses. See <a href="/business-permits-and-licenses-kenya" className="text-blue-600 hover:text-blue-700 font-medium">Business Permits & Licenses</a>.</p>
                    </div>

                    <div className="bg-white border-2 border-gray-200 p-6 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        Register with NHIF & NSSF
                      </h4>
                      <p className="text-gray-700 text-sm"><strong>(Employment Act 2007, NHIF Act, NSSF Act):</strong> If hiring employees, register with NHIF (health insurance) and NSSF (pension). Mandatory. Your business name is the account identifier.</p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">⏰ Timeline Reminder</h4>
                    <p className="text-gray-700 text-sm">You have 6 months from reservation to complete registration. Don't wait until the last month—complete it within 1–2 months to avoid rush fees and ensure you don't miss the deadline.</p>
                  </div>
                </div>
              </section>

              {/* FAQ Section */}
              <section id="faqs" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Search className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Frequently Asked Questions (FAQs)</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Here are the most common questions about business name search and reservation in Kenya:</p>

                  <div className="space-y-3">
                    {faqs.map((faq, index) => (
                      <div key={index} className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                          className="w-full px-6 py-4 text-left font-semibold text-gray-900 hover:bg-gray-50 flex items-center justify-between"
                        >
                          <span>{faq.question}</span>
                          <span className={`transition ${expandedFaq === index ? 'rotate-180' : ''}`}>▼</span>
                        </button>
                        {expandedFaq === index && (
                          <div className="px-6 py-4 bg-gray-50 border-t-2 border-gray-200">
                            <p className="text-gray-700 text-sm">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* CTA Section */}
              <section className="mb-12">
                <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 text-white p-8 rounded-xl">
                  <h3 className="text-2xl font-bold mb-4">Ready to Search & Reserve Your Business Name?</h3>
                  <p className="mb-6 text-blue-100">Your business name is the foundation of your brand. Reserve it today on eCitizen and start your business registration journey.</p>
                  <div className="flex flex-wrap gap-3">
                    <a href="https://ecitizen.go.ke" target="_blank" rel="noopener noreferrer" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 flex items-center gap-2">
                      <Search className="w-5 h-5" />
                      Search on eCitizen
                    </a>
                    <a href="/how-to-register-business-kenya" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
                      Complete Registration <ArrowRight className="w-5 h-5" />
                    </a>
                    <a href="/sole-proprietorship-registration-kenya" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
                      Sole Proprietorship Guide <ArrowRight className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BusinessNameSearchKenya;
