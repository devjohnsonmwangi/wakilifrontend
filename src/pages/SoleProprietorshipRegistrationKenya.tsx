import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, AlertCircle, ArrowRight, FileText, Clock, DollarSign, Shield, TrendingUp, Users, Briefcase, BookOpen, Building2 } from 'lucide-react';

const SoleProprietorshipRegistrationKenya = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // FAQ data
  const faqs = [
    {
      question: 'What is the difference between sole proprietorship and limited company?',
      answer: 'A sole proprietorship is owned and managed by one person who is personally liable for all debts. A limited company is a separate legal entity with shareholders and directors, offering liability protection. Sole proprietorship is simpler and cheaper to set up, while limited companies offer more protection and credibility (Business Registration Act, Companies Act 2015).'
    },
    {
      question: 'Can I register a sole proprietorship if I\'m employed?',
      answer: 'Yes. Employment law doesn\'t prohibit side businesses unless your employment contract restricts it. You can register a sole proprietorship while employed, but check your contract for non-compete or conflict-of-interest clauses (Employment Act 2007).'
    },
    {
      question: 'Do I need to register if I just sell online or on social media?',
      answer: 'Legally, any business activity generating income should be registered for tax purposes (Income Tax Act, Section 3). While many small online sellers operate informally, registration gives you legal protection, credibility, access to loans, and compliance with KRA requirements.'
    },
    {
      question: 'How much does sole proprietorship registration cost?',
      answer: 'Business name reservation costs KES 0-500, business registration is usually free for sole proprietors on eCitizen (BRELA), business permit costs KES 2,000-10,000+ depending on county and business type. Total minimum: KES 2,000-15,000 (Business Registration Act, County Government Act).'
    },
    {
      question: 'Can I use my own name as the business name?',
      answer: 'Yes. You can trade under your personal name (e.g., "John Mwangi"). However, if you want a trade name (e.g., "Mwangi Hardware"), you must register it and add your business type (e.g., "Mwangi Hardware - Sole Proprietorship"). Personal name use doesn\'t require separate name registration (Business Registration Act, Section 5).'
    },
    {
      question: 'How long does registration take?',
      answer: 'Name reservation: 5-30 seconds. Business registration on eCitizen: 1-3 business days if all documents are correct. Business permit: 7-30 days depending on county. Total timeline: 1-6 weeks from start to full operation (BRELA eCitizen, County regulations).'
    },
    {
      question: 'Do I need a physical office or shop to register?',
      answer: 'No. You can register with a home address, temporary stall, or mobile business location. However, for business permits, counties may require proof of premises (lease agreement, landlord consent). Home-based businesses are allowed but check county zoning rules (County Government Act).'
    },
    {
      question: 'Can foreigners register a sole proprietorship in Kenya?',
      answer: 'Yes, but with restrictions. Foreign nationals need a valid work permit or investor permit before registering (Kenya Citizenship and Immigration Act, Business Registration Act). Refugees with valid documents can also register. Consult immigration authorities first.'
    },
    {
      question: 'What taxes do sole proprietors pay?',
      answer: 'Income Tax: 10%-30% on net profits (Income Tax Act). Turnover Tax: 3% if annual turnover is below KES 25M (optional). VAT: 16% if turnover exceeds KES 5M annually. PAYE: If you hire employees. NHIF/NSSF: Mandatory for employees, optional for self (NHIF Act, NSSF Act).'
    },
    {
      question: 'Can I have employees in a sole proprietorship?',
      answer: 'Yes. You can hire employees and must register with NSSF, NHIF, and deduct PAYE taxes. You remain personally liable for all employment obligations (Employment Act 2007, Labour Relations Act, NSSF Act, NHIF Act).'
    },
    {
      question: 'What happens if my business fails? Am I personally liable?',
      answer: 'Yes. As a sole proprietor, you are personally liable for all business debts. Creditors can pursue your personal assets (house, car, savings) to settle business debts. This is the biggest risk vs. a limited company (Business Registration Act, Insolvency Act).'
    },
    {
      question: 'Can I change my sole proprietorship to a limited company later?',
      answer: 'Yes. You can upgrade by registering a new limited company and transferring assets, contracts, and business operations. The sole proprietorship and limited company are separate entities. Consult a lawyer for smooth transition (Companies Act 2015, Business Registration Act).'
    },
    {
      question: 'Do I need a lawyer to register a sole proprietorship?',
      answer: 'No. The eCitizen process is simple enough for DIY registration. A lawyer is helpful if you have complex business structures, contracts, intellectual property, or regulatory compliance questions, but not mandatory (Business Registration Act).'
    },
    {
      question: 'What if I want to operate in multiple counties?',
      answer: 'You need a separate business permit for each county where you physically operate. One business registration covers all counties, but permits are county-specific (County Government Act, Business Licensing Act).'
    },
    {
      question: 'Can I trademark my business name as a sole proprietor?',
      answer: 'Yes. Business name registration and trademark are separate. Register business name with BRELA, then apply for trademark protection with Kenya Industrial Property Institute (KIPI) to prevent others from using your brand (Trademarks Act, Business Registration Act).'
    }
  ];

  // Registration costs
  const registrationCosts = [
    { item: 'Business Name Search (eCitizen)', cost: 'Free' },
    { item: 'Business Name Reservation (eCitizen)', cost: 'Free - KES 500' },
    { item: 'Business Registration Certificate (eCitizen)', cost: 'Free' },
    { item: 'KRA PIN Application', cost: 'Free' },
    { item: 'County Business Permit/License', cost: 'KES 2,000 - 10,000+' },
    { item: 'Single Business Permit (optional)', cost: 'KES 10,000+' },
    { item: 'Fire Safety Certificate (if applicable)', cost: 'KES 3,000 - 5,000' },
    { item: 'Public Health License (food/health businesses)', cost: 'KES 1,000 - 5,000' },
    { item: 'Total Estimated Cost (minimum)', cost: 'KES 2,000 - 20,000' }
  ];

  // Registration steps
  const registrationSteps = [
    {
      number: 1,
      title: 'Get Your KRA PIN',
      description: 'If you don\'t have one, apply on iTax (www.itax.kra.go.ke). It\'s free and takes 1-3 days. You MUST have a KRA PIN before registering a business (Income Tax Act, Section 3-5).'
    },
    {
      number: 2,
      title: 'Search and Reserve Business Name',
      description: 'Go to eCitizen → Business Registration → Name Search. Type your desired name. If available, reserve it for 6 months (free or KES 500). You have 6 months to complete registration (Business Registration Act, Section 5).'
    },
    {
      number: 3,
      title: 'Prepare Required Documents',
      description: 'Gather: Copy of ID/Passport, KRA PIN certificate, proof of business address (utility bill, lease), passport photo. Scan all documents to PDF format (BRELA requirements).'
    },
    {
      number: 4,
      title: 'Register Business on eCitizen',
      description: 'Log into eCitizen → Business Registration → Register Business. Select "Sole Proprietorship". Fill in personal details, business name, location, nature of business. Upload documents. Submit application (Business Registration Act).'
    },
    {
      number: 5,
      title: 'Pay Registration Fee (if applicable)',
      description: 'Most sole proprietorships are free. If a fee is required, pay via M-Pesa, bank transfer, or card. You\'ll receive payment confirmation via SMS/email (BRELA eCitizen).'
    },
    {
      number: 6,
      title: 'Download Business Registration Certificate',
      description: 'After approval (1-3 days), log into eCitizen and download your certificate. This is your proof of registration. Save multiple copies (digital + printed) (Business Registration Act).'
    },
    {
      number: 7,
      title: 'Apply for County Business Permit',
      description: 'Visit your county government website or office. Apply for business permit/license. Submit business certificate, ID, KRA PIN, lease/landlord consent, photos. Pay permit fee (County Government Act, Business Licensing Act).'
    },
    {
      number: 8,
      title: 'Register with NHIF & NSSF (if hiring employees)',
      description: 'If you plan to hire workers, register as an employer with NHIF and NSSF. This is mandatory for all employers (NHIF Act, NSSF Act, Employment Act 2007).'
    }
  ];

  // Timeline
  const timeline = [
    { stage: 'KRA PIN Application', duration: '1-3 days', cost: 'Free' },
    { stage: 'Business Name Search & Reservation', duration: '5-30 seconds', cost: 'Free - KES 500' },
    { stage: 'Business Registration (eCitizen)', duration: '1-3 business days', cost: 'Free' },
    { stage: 'County Business Permit', duration: '7-30 days', cost: 'KES 2,000 - 10,000+' },
    { stage: 'NHIF/NSSF Registration (employers)', duration: '3-7 days', cost: 'Free' },
    { stage: 'Total Timeline (fastest)', duration: '2-6 weeks', cost: 'KES 2,000 - 20,000' }
  ];

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'what-is', 'who-should-choose', 'benefits-limitations', 'requirements', 'registration-steps', 'name-reservation', 'documents', 'fees', 'timeline', 'after-registration', 'taxes', 'mistakes', 'upgrade', 'faqs'];
      
      try {
        for (const sectionId of sections) {
          const element = document.getElementById(sectionId);
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top >= 0 && rect.top <= 200) {
              setActiveSection(sectionId);
              break;
            }
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
        <title>Sole Proprietorship Registration Kenya – eCitizen Guide 2026 & 2027</title>
        <meta name="description" content="Complete guide to registering a sole proprietorship in Kenya. Step-by-step eCitizen registration, costs, requirements, permits & tax guide. Start your small business legally." />
        <link rel="canonical" href="https://yoursite.com/sole-proprietorship-registration-kenya" />
        
        {/* OpenGraph */}
        <meta property="og:title" content="Sole Proprietorship Registration Kenya – eCitizen Guide 2026 & 2027" />
        <meta property="og:description" content="Complete guide to registering a sole proprietorship in Kenya. Step-by-step eCitizen registration, costs, requirements, permits & tax guide." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://yoursite.com/sole-proprietorship-registration-kenya" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=630&fit=crop" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sole Proprietorship Registration Kenya – eCitizen Guide 2026 & 2027" />
        <meta name="twitter:description" content="Complete guide to registering a sole proprietorship in Kenya. Step-by-step eCitizen registration, costs, requirements, permits & tax guide." />
        <meta name="twitter:image" content="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=630&fit=crop" />
        
        {/* Robots */}
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

        {/* JSON-LD Schemas */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Wakili Legal Services",
            "url": "https://yoursite.com",
            "logo": "https://yoursite.com/logo.png",
            "description": "Legal services and business registration guidance in Kenya"
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
                "item": "https://yoursite.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Sole Proprietorship Registration Kenya",
                "item": "https://yoursite.com/sole-proprietorship-registration-kenya"
              }
            ]
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Register a Sole Proprietorship in Kenya",
            "description": "Complete step-by-step guide to registering a sole proprietorship business in Kenya through eCitizen",
            "step": registrationSteps.map(step => ({
              "@type": "HowToStep",
              "position": step.number,
              "name": step.title,
              "text": step.description
            }))
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
              <Briefcase className="w-8 h-8 flex-shrink-0" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">Sole Proprietorship Registration in Kenya</h1>
            </div>
            <p className="text-blue-100 text-lg max-w-3xl">Complete guide to registering your small business as a sole proprietorship in Kenya. Step-by-step eCitizen registration, costs, permits, and tax guide for 2025.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="https://ecitizen.go.ke" target="_blank" rel="noopener noreferrer" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Register on eCitizen
              </a>
              <a href="/business-name-search-kenya" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
                Check Business Name <ArrowRight className="w-5 h-5" />
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
              <li>Sole Proprietorship Registration</li>
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
                    { id: 'what-is', label: 'What is Sole Proprietorship' },
                    { id: 'who-should-choose', label: 'Who Should Choose' },
                    { id: 'benefits-limitations', label: 'Benefits & Limitations' },
                    { id: 'requirements', label: 'Requirements' },
                    { id: 'registration-steps', label: 'Registration Steps' },
                    { id: 'name-reservation', label: 'Name Reservation' },
                    { id: 'documents', label: 'Documents' },
                    { id: 'fees', label: 'Fees & Costs' },
                    { id: 'timeline', label: 'Timeline' },
                    { id: 'after-registration', label: 'After Registration' },
                    { id: 'taxes', label: 'Taxes' },
                    { id: 'mistakes', label: 'Common Mistakes' },
                    { id: 'upgrade', label: 'Upgrade to Ltd' },
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
                    { id: 'what-is', label: 'What is Sole Proprietorship' },
                    { id: 'who-should-choose', label: 'Who Should Choose' },
                    { id: 'benefits-limitations', label: 'Benefits & Limitations' },
                    { id: 'requirements', label: 'Requirements' },
                    { id: 'registration-steps', label: 'Registration Steps' },
                    { id: 'name-reservation', label: 'Name Reservation' },
                    { id: 'documents', label: 'Documents' },
                    { id: 'fees', label: 'Fees & Costs' },
                    { id: 'timeline', label: 'Timeline' },
                    { id: 'after-registration', label: 'After Registration' },
                    { id: 'taxes', label: 'Taxes' },
                    { id: 'mistakes', label: 'Common Mistakes' },
                    { id: 'upgrade', label: 'Upgrade to Ltd' },
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
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Overview: Sole Proprietorship Registration in Kenya</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                    A <strong>sole proprietorship</strong> (also called "biashara" or "single owner business") is the simplest and most common business structure in Kenya. It's owned and managed by one person who is personally responsible for all business debts and obligations. Registering a sole proprietorship is governed by the <strong>Business Registration Act (Cap. 499)</strong> and is done online through <strong>eCitizen</strong>. This guide explains everything you need to know to start your small business legally in Kenya in 2025.
                  </p>

                  <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border-l-4 border-blue-600">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-700 mb-1">Free - KES 500</div>
                        <div className="text-xs text-gray-600">Registration Cost</div>
                        <p className="text-sm text-gray-700 mt-2">Most sole proprietors register for free</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-700 mb-1">1-3</div>
                        <div className="text-xs text-gray-600">Days to Register</div>
                        <p className="text-sm text-gray-700 mt-2">Fast online process</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-700 mb-1">100%</div>
                        <div className="text-xs text-gray-600">Online</div>
                        <p className="text-sm text-gray-700 mt-2">No physical office visits</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded-lg mb-6">
                    <h4 className="font-bold text-gray-900 mb-2">Why Register Your Sole Proprietorship?</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Legal Protection:</strong> Separates personal and business identity for contracts and legal matters</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Tax Compliance:</strong> Required by KRA for business income tax filing (Income Tax Act)</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Bank Account:</strong> Most banks require registration certificate to open business account</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Business Permits:</strong> County licenses require proof of registration (County Government Act)</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Credibility:</strong> Professional image for suppliers, customers, and lenders</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* What is Sole Proprietorship */}
              <section id="what-is" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Users className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What is a Sole Proprietorship?</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">A sole proprietorship is a business owned and operated by ONE individual. There's no legal separation between the owner and the business—you ARE the business.</p>

                  <img 
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop"
                    alt="Small Business Owner"
                    className="rounded-lg shadow-lg w-full mb-6"
                  />

                  <div className="bg-white border-2 border-gray-200 p-6 rounded-xl mb-6">
                    <h4 className="font-bold text-gray-900 mb-3">Key Characteristics</h4>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex gap-3">
                        <span className="text-blue-600 font-bold">•</span>
                        <span><strong>Single Owner:</strong> Only one person owns the business (Business Registration Act)</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-blue-600 font-bold">•</span>
                        <span><strong>Unlimited Liability:</strong> Your personal assets (house, car, savings) are at risk if business fails</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-blue-600 font-bold">•</span>
                        <span><strong>Full Control:</strong> You make all decisions without partners or shareholders</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-blue-600 font-bold">•</span>
                        <span><strong>Simple Setup:</strong> Easiest and cheapest business structure to register</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-blue-600 font-bold">•</span>
                        <span><strong>Personal Tax:</strong> Business income is taxed as personal income (Income Tax Act)</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-cyan-50 border-l-4 border-cyan-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>Real Example:</strong> Maria runs a salon in Nairobi. She's the sole owner, makes all decisions, keeps all profits, but is personally liable for rent, supplier debts, and employee salaries. If the business fails, creditors can seize her personal property. This is a sole proprietorship.</p>
                  </div>
                </div>
              </section>

              {/* Who Should Choose Sole Proprietorship */}
              <section id="who-should-choose" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <BookOpen className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Who Should Choose Sole Proprietorship?</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Sole proprietorship is ideal for:</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        <h4 className="font-bold text-gray-900">Small Traders</h4>
                      </div>
                      <p className="text-gray-700 text-sm">Retail shops, kiosks, hawkers, market vendors, boutiques</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        <h4 className="font-bold text-gray-900">Freelancers</h4>
                      </div>
                      <p className="text-gray-700 text-sm">Graphic designers, writers, photographers, consultants</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        <h4 className="font-bold text-gray-900">Service Providers</h4>
                      </div>
                      <p className="text-gray-700 text-sm">Salons, barbers, tailors, mechanics, electricians, plumbers</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        <h4 className="font-bold text-gray-900">Online Businesses</h4>
                      </div>
                      <p className="text-gray-700 text-sm">E-commerce, social media sellers, dropshipping, digital services</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        <h4 className="font-bold text-gray-900">Artisans & Craftsmen</h4>
                      </div>
                      <p className="text-gray-700 text-sm">Carpenters, welders, painters, craftspeople, handymen</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        <h4 className="font-bold text-gray-900">Transport Operators</h4>
                      </div>
                      <p className="text-gray-700 text-sm">Boda boda, taxi, matatu owners, delivery services</p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">⚠️ Not Recommended For:</h4>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• High-risk businesses (construction, manufacturing with heavy machinery)</li>
                      <li>• Businesses with multiple owners (use Partnership or Limited Company)</li>
                      <li>• Large capital investments requiring investor protection</li>
                      <li>• Businesses planning to raise funding from investors</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Benefits and Limitations */}
              <section id="benefits-limitations" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Benefits and Limitations</h2>
                </div>

                <div className="prose max-w-none">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-green-50 border-2 border-green-300 p-6 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        Benefits
                      </h4>
                      <ul className="space-y-3 text-gray-700 text-sm">
                        <li className="flex gap-2">
                          <span className="text-green-600">✓</span>
                          <span><strong>Easy to Start:</strong> Simplest registration process, minimal paperwork</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-green-600">✓</span>
                          <span><strong>Low Cost:</strong> Free or cheap registration (KES 0-20,000 total)</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-green-600">✓</span>
                          <span><strong>Full Control:</strong> All decisions are yours alone</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-green-600">✓</span>
                          <span><strong>Keep All Profits:</strong> No sharing with partners or shareholders</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-green-600">✓</span>
                          <span><strong>Simple Taxes:</strong> Filed with personal income tax (Income Tax Act)</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-green-600">✓</span>
                          <span><strong>Flexible:</strong> Easy to close or restructure business</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-green-600">✓</span>
                          <span><strong>Privacy:</strong> No public disclosure of finances (unlike limited companies)</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-red-50 border-2 border-red-300 p-6 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        Limitations
                      </h4>
                      <ul className="space-y-3 text-gray-700 text-sm">
                        <li className="flex gap-2">
                          <span className="text-red-600">✗</span>
                          <span><strong>Unlimited Liability:</strong> Personal assets at risk if business fails</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-red-600">✗</span>
                          <span><strong>Limited Capital:</strong> Harder to raise investment or loans</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-red-600">✗</span>
                          <span><strong>No Continuity:</strong> Business dies if owner dies or quits</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-red-600">✗</span>
                          <span><strong>Less Credible:</strong> Some clients prefer limited companies</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-red-600">✗</span>
                          <span><strong>Tax Burden:</strong> All business income taxed at personal rates (up to 30%)</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-red-600">✗</span>
                          <span><strong>Solo Responsibility:</strong> All work and stress falls on one person</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-red-600">✗</span>
                          <span><strong>No Investors:</strong> Can't sell shares to raise capital</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>Decision Point:</strong> If your business is small, low-risk, and you want full control with minimal paperwork, sole proprietorship is perfect. If you need liability protection, investor funding, or plan to scale significantly, consider a <a href="/limited-company-registration-kenya" className="text-blue-600 hover:text-blue-700 font-semibold">limited company</a>.</p>
                  </div>
                </div>
              </section>

              {/* Requirements Before Registration */}
              <section id="requirements" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Requirements Before Registration</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Before you start registration, make sure you have:</p>

                  <div className="space-y-4 mb-6">
                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">1. Valid National ID or Passport</h4>
                          <p className="text-gray-700 text-sm">For Kenyan citizens: National ID. For foreigners: Valid passport + work permit/investor permit. Refugees: Alien card + UNHCR documentation (Kenya Citizenship and Immigration Act).</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">2. KRA PIN</h4>
                          <p className="text-gray-700 text-sm">Mandatory for all businesses. Apply free on iTax (www.itax.kra.go.ke). Takes 1-3 days. Without KRA PIN, you cannot register (Income Tax Act, Section 3-5). <a href="/kra-pin-for-business-kenya" className="text-blue-600 hover:text-blue-700 font-semibold">Learn how to get KRA PIN</a>.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">3. Business Name</h4>
                          <p className="text-gray-700 text-sm">Choose a unique name. Search on eCitizen to check availability. You can use your personal name (e.g., "John Kamau") or trade name (e.g., "Kamau Hardware"). Must include business type (e.g., "Sole Proprietorship"). <a href="/business-name-search-kenya" className="text-blue-600 hover:text-blue-700 font-semibold">Check name availability</a>.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">4. Business Physical Address</h4>
                          <p className="text-gray-700 text-sm">Where your business operates (shop, office, home, stall, mobile). You'll need proof: utility bill, lease agreement, or landlord consent letter. Home-based businesses are allowed (County Government Act).</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">5. eCitizen Account</h4>
                          <p className="text-gray-700 text-sm">Create free account on www.ecitizen.go.ke. Use email and mobile number. Verify account via SMS. Required for all online registrations (BRELA eCitizen Framework).</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">6. Passport Photo (Optional)</h4>
                          <p className="text-gray-700 text-sm">Some counties require a passport-size photo for business permit applications. Not always needed for eCitizen registration.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>Quick Checklist:</strong> ✓ National ID/Passport ✓ KRA PIN ✓ Business name ✓ Physical address ✓ eCitizen account ✓ Internet connection ✓ M-Pesa for payments (if applicable)</p>
                  </div>
                </div>
              </section>

              {/* Step-by-Step Registration */}
              <section id="registration-steps" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Step-by-Step Registration on eCitizen</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Follow these exact steps to register your sole proprietorship online:</p>

                  <img 
                    src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=400&fit=crop"
                    alt="Online Registration Process"
                    className="rounded-lg shadow-lg w-full mb-8"
                  />

                  <div className="space-y-4 mb-6">
                    {registrationSteps.map((step) => (
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

                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>Pro Tip:</strong> Do all 8 steps in one sitting (takes 30-60 minutes). Have all documents ready as PDFs. Use desktop/laptop for easier uploading. Check your email and SMS for approval notifications.</p>
                  </div>
                </div>
              </section>

              {/* Business Name Reservation */}
              <section id="name-reservation" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Business Name Reservation Process</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Before registering, you must search and reserve your business name. This is a separate step governed by <strong>Business Registration Act, Section 5</strong>.</p>

                  <div className="bg-white border-2 border-gray-200 p-6 rounded-xl mb-6">
                    <h4 className="font-bold text-gray-900 mb-3">Name Reservation Quick Guide</h4>
                    <ol className="space-y-3 text-gray-700">
                      <li className="flex gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-bold flex-shrink-0">1</span>
                        <span>Go to eCitizen → Business Registration → Name Search</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-bold flex-shrink-0">2</span>
                        <span>Type your desired name (e.g., "Kamau Hardware")</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-bold flex-shrink-0">3</span>
                        <span>System shows if name is available (5-30 seconds)</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-bold flex-shrink-0">4</span>
                        <span>If available, click "Reserve Name"</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-bold flex-shrink-0">5</span>
                        <span>Pay KES 0-500 (most sole proprietors get free reservation)</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-bold flex-shrink-0">6</span>
                        <span>Download reservation certificate (valid 6 months)</span>
                      </li>
                    </ol>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded-lg mb-6">
                    <h4 className="font-bold text-gray-900 mb-2">Naming Rules for Sole Proprietorships</h4>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• Must include business type: "Sole Proprietorship" or your full name</li>
                      <li>• Cannot be identical to existing registered name</li>
                      <li>• Cannot use prohibited words: "Bank", "Insurance", "Government", "National" without permission</li>
                      <li>• Cannot be misleading, offensive, or immoral</li>
                      <li>• English language only for formal registration</li>
                    </ul>
                  </div>

                  <p className="text-gray-700 text-sm">
                    <strong>Example Names:</strong> "John Kamau - Sole Proprietorship", "Kamau Hardware - Sole Proprietorship", "Mary Njeri Beauty Salon", "Njeri Tailoring Services"
                  </p>

                  <p className="text-gray-700 text-sm mt-4">
                    <a href="/business-name-search-kenya" className="text-blue-600 hover:text-blue-700 font-semibold">Read full guide: Business Name Search & Reservation in Kenya →</a>
                  </p>
                </div>
              </section>

              {/* Documents Needed */}
              <section id="documents" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Documents Needed for Registration</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Prepare and scan these documents before starting registration:</p>

                  <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">Document</th>
                          <th className="px-4 py-3 text-left font-semibold">Required?</th>
                          <th className="px-4 py-3 text-left font-semibold">Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">National ID or Passport</td>
                          <td className="px-4 py-3 text-green-700 font-semibold">Yes</td>
                          <td className="px-4 py-3 text-gray-700 text-sm">Scanned copy (PDF or JPG)</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">KRA PIN Certificate</td>
                          <td className="px-4 py-3 text-green-700 font-semibold">Yes</td>
                          <td className="px-4 py-3 text-gray-700 text-sm">Download from iTax portal</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">Business Name Reservation Certificate</td>
                          <td className="px-4 py-3 text-green-700 font-semibold">Yes</td>
                          <td className="px-4 py-3 text-gray-700 text-sm">From eCitizen name reservation</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">Proof of Business Address</td>
                          <td className="px-4 py-3 text-green-700 font-semibold">Yes</td>
                          <td className="px-4 py-3 text-gray-700 text-sm">Utility bill, lease, or landlord letter</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">Passport Photo</td>
                          <td className="px-4 py-3 text-yellow-700 font-semibold">Optional</td>
                          <td className="px-4 py-3 text-gray-700 text-sm">Needed for county permit</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">Work Permit (foreigners)</td>
                          <td className="px-4 py-3 text-green-700 font-semibold">Yes (foreigners)</td>
                          <td className="px-4 py-3 text-gray-700 text-sm">Valid permit from immigration</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>Document Format:</strong> Scan all documents as PDF files (max 2MB each). Use phone camera or scanner app. Ensure text is clear and readable. Keep originals for county permit applications.</p>
                  </div>
                </div>
              </section>

              {/* Fees & Costs */}
              <section id="fees" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <DollarSign className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Registration Fees & Costs</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-4">Here's the complete breakdown of costs to register and operate a sole proprietorship in Kenya:</p>

                  <img 
                    src="https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=800&h=400&fit=crop"
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
                        {registrationCosts.map((fee, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">{fee.item}</td>
                            <td className="px-4 py-3 text-gray-700 font-semibold">{fee.cost}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>Budget Summary:</strong> Most sole proprietors spend KES 2,000-10,000 total for registration + county permit. The main cost is the county business permit (varies by county and business type). Registration itself is usually free on eCitizen.</p>
                  </div>
                </div>
              </section>

              {/* Timeline */}
              <section id="timeline" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How Long Does Registration Take?</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Here's the realistic timeline from start to full operation:</p>

                  <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">Stage</th>
                          <th className="px-4 py-3 text-left font-semibold">Duration</th>
                          <th className="px-4 py-3 text-left font-semibold">Cost</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {timeline.map((stage, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">{stage.stage}</td>
                            <td className="px-4 py-3 text-gray-700">{stage.duration}</td>
                            <td className="px-4 py-3 text-gray-700 font-semibold">{stage.cost}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>Fastest Possible:</strong> If you already have a KRA PIN and all documents ready, you can complete online registration in 1-3 days. County permit adds 1-4 weeks. Total: 2-6 weeks from start to legal operation.</p>
                  </div>
                </div>
              </section>

              {/* After Registration */}
              <section id="after-registration" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What to Do After Registration</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Once you have your business registration certificate, complete these critical next steps:</p>

                  <div className="space-y-4 mb-6">
                    <div className="bg-white border-2 border-blue-200 p-6 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        1. Apply for County Business Permit/License
                      </h4>
                      <p className="text-gray-700 text-sm mb-2"><strong>(County Government Act, Business Licensing Act):</strong> Required to legally operate. Visit county government office or website. Submit: business certificate, ID, KRA PIN, lease/address proof, passport photos. Pay permit fee (KES 2,000-10,000+). Processing: 7-30 days. Without this, you can be fined or shut down.</p>
                      <p className="text-gray-700 text-sm"><a href="/business-permits-and-licenses-kenya" className="text-blue-600 hover:text-blue-700 font-semibold">Learn more: Business Permits & Licenses in Kenya →</a></p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-6 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        2. Update KRA PIN for Business Income
                      </h4>
                      <p className="text-gray-700 text-sm"><strong>(Income Tax Act, Section 3-5):</strong> Log into iTax → Update Profile → Add Business Details. Link your business registration to your KRA PIN. This allows you to file business income tax returns. Mandatory for all registered businesses.</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-6 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        3. Open a Business Bank Account
                      </h4>
                      <p className="text-gray-700 text-sm">Separate business and personal finances. Most banks require: business certificate, ID, KRA PIN, county permit. Helps with record-keeping, taxes, and professionalism. Recommended even for small businesses.</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-6 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        4. Register with NHIF & NSSF (If Hiring Employees)
                      </h4>
                      <p className="text-gray-700 text-sm"><strong>(NHIF Act, NSSF Act, Employment Act 2007):</strong> Mandatory if you employ workers. Register as employer on NHIF and NSSF portals. Deduct and remit monthly contributions. Failure to register = fines up to KES 100,000.</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-6 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        5. Get Additional Licenses (Industry-Specific)
                      </h4>
                      <p className="text-gray-700 text-sm">Food businesses: Public Health License (County). Alcohol: Liquor License (County). Childcare: ECDE License (County). Medical: Pharmacy Board License. Transport: NTSA PSV License. Check your industry requirements.</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-6 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        6. Start Keeping Proper Records
                      </h4>
                      <p className="text-gray-700 text-sm"><strong>(Income Tax Act, VAT Act):</strong> Record all sales, expenses, invoices. Use accounting software or simple ledger. Required for tax filing. Retain records for 7 years. Poor records = tax penalties.</p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>Don't Skip These Steps!</strong> Many businesses register on eCitizen but forget county permits, NHIF/NSSF, or proper tax setup. This leads to fines, closure, or legal trouble later. Complete all 6 steps for full compliance.</p>
                  </div>
                </div>
              </section>

              {/* Taxes for Sole Proprietors */}
              <section id="taxes" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <DollarSign className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Taxes for Sole Proprietors (Simple Explanation)</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">As a sole proprietor, you must pay taxes on business income. Here's what you need to know:</p>

                  <div className="space-y-4 mb-6">
                    <div className="bg-white border-2 border-blue-200 p-6 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">1. Income Tax (10%-30%)</h4>
                      <p className="text-gray-700 text-sm mb-2"><strong>(Income Tax Act, Sections 3-5):</strong> Tax on net profits (income minus expenses). Rates:</p>
                      <ul className="space-y-1 text-gray-700 text-sm ml-4">
                        <li>• First KES 288,000: 10%</li>
                        <li>• Next KES 100,000: 25%</li>
                        <li>• Above KES 388,000: 30%</li>
                      </ul>
                      <p className="text-gray-700 text-sm mt-2">File annual tax returns on iTax. Deadline: June 30 each year.</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-6 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">2. Turnover Tax (3%) - Optional Alternative</h4>
                      <p className="text-gray-700 text-sm"><strong>(Income Tax Act, Section 12C):</strong> If annual turnover is below KES 25 million, you can choose Turnover Tax instead of Income Tax. Pay 3% on total sales (not profits). Simpler than income tax. File quarterly. Many small businesses prefer this.</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-6 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">3. VAT (16%) - Only If Turnover &gt; KES 5M</h4>
                      <p className="text-gray-700 text-sm"><strong>(VAT Act 2013):</strong> Register for VAT if annual turnover exceeds KES 5 million. Charge 16% VAT on sales. File monthly VAT returns. Most small sole proprietors don't reach this threshold.</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-6 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">4. PAYE (If You Have Employees)</h4>
                      <p className="text-gray-700 text-sm"><strong>(Employment Act 2007, Income Tax Act):</strong> Deduct income tax from employee salaries. Remit to KRA monthly. Rates same as income tax (10%-30%). Mandatory for all employers.</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-6 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">5. NHIF & NSSF (If You Have Employees)</h4>
                      <p className="text-gray-700 text-sm"><strong>(NHIF Act, NSSF Act):</strong> NHIF: KES 150-1,700/month per employee. NSSF: 6% of gross salary (you pay 6%, employee pays 6%). Mandatory for all employers. File and pay monthly.</p>
                    </div>
                  </div>

                  <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>Tax Tips:</strong> Keep all receipts and invoices. Use accounting software (free options: Wave, Zoho). File taxes on time to avoid penalties (20% late fee + interest). Consider hiring a tax accountant if turnover exceeds KES 500,000/year.</p>
                  </div>
                </div>
              </section>

              {/* Common Mistakes */}
              <section id="mistakes" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Common Mistakes to Avoid</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Avoid these costly mistakes when registering and running your sole proprietorship:</p>

                  <div className="space-y-3">
                    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">❌ Operating Without County Business Permit</h4>
                      <p className="text-gray-700 text-sm"><strong>Consequence:</strong> County can fine you, close your business, or confiscate goods. Permit is mandatory even after eCitizen registration (County Government Act, Business Licensing Act). Always get county permit.</p>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">❌ Not Updating KRA PIN with Business Details</h4>
                      <p className="text-gray-700 text-sm"><strong>Consequence:</strong> Cannot file business tax returns. KRA penalties up to KES 1 million + 6 months jail (Income Tax Act, Section 91-95). Always link business to your KRA PIN on iTax.</p>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">❌ Mixing Personal and Business Finances</h4>
                      <p className="text-gray-700 text-sm"><strong>Consequence:</strong> Impossible to track profits, file accurate taxes, or prove income for loans. KRA can reject your tax returns. Open separate business bank account.</p>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">❌ Not Keeping Proper Records</h4>
                      <p className="text-gray-700 text-sm"><strong>Consequence:</strong> KRA can estimate your income and charge higher taxes + penalties. No proof of expenses = higher tax bill. Law requires 7 years of records (Income Tax Act, VAT Act).</p>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">❌ Hiring Employees Without NHIF/NSSF Registration</h4>
                      <p className="text-gray-700 text-sm"><strong>Consequence:</strong> Fines up to KES 100,000 per violation. Employees can sue. Legal liability for unpaid benefits. Always register as employer first (Employment Act 2007, NHIF Act, NSSF Act).</p>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">❌ Choosing Wrong Business Structure</h4>
                      <p className="text-gray-700 text-sm"><strong>Consequence:</strong> Sole proprietorship exposes you to unlimited liability. If your business has high risk (construction, manufacturing), consider limited company for protection. Changing later is costly.</p>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">❌ Letting Name Reservation Expire</h4>
                      <p className="text-gray-700 text-sm"><strong>Consequence:</strong> Your reserved name becomes available to others. You lose KES 500 fee. Must reserve again if name is still available. Complete registration within 6 months (Business Registration Act, Section 5).</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* When to Upgrade */}
              <section id="upgrade" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Building2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">When to Upgrade to a Limited Company</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Consider upgrading from sole proprietorship to a limited company when:</p>

                  <div className="space-y-4 mb-6">
                    <div className="bg-white border-2 border-green-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        Your Business is Growing Significantly
                      </h4>
                      <p className="text-gray-700 text-sm">Annual turnover exceeds KES 5-10 million. More than 5 employees. Multiple locations. High-value contracts. Limited company offers better structure, credibility, and liability protection.</p>
                    </div>

                    <div className="bg-white border-2 border-green-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-green-600" />
                        You Need Liability Protection
                      </h4>
                      <p className="text-gray-700 text-sm">Your business has high financial risk (construction, manufacturing, medical). You want to protect personal assets (house, savings) from business debts. Limited company = separate legal entity (Companies Act 2015).</p>
                    </div>

                    <div className="bg-white border-2 border-green-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        You Want to Raise Investment or Loans
                      </h4>
                      <p className="text-gray-700 text-sm">Banks, investors, and venture capital prefer limited companies. Can issue shares to raise capital. Better access to large loans. Sole proprietorships have limited funding options.</p>
                    </div>

                    <div className="bg-white border-2 border-green-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <Users className="w-5 h-5 text-green-600" />
                        You Want Partners or Shareholders
                      </h4>
                      <p className="text-gray-700 text-sm">Sole proprietorship is for one owner only. If you want co-owners, investors, or shareholders, you must register a limited company or partnership (Companies Act 2015, Partnership Act).</p>
                    </div>

                    <div className="bg-white border-2 border-green-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-green-600" />
                        Corporate Clients Require Limited Company Status
                      </h4>
                      <p className="text-gray-700 text-sm">Some tenders, contracts, and corporate clients only work with registered limited companies. Government tenders often require limited company status with CR12 certificate.</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>How to Upgrade:</strong> Register a new limited company on eCitizen (KES 10,000-15,000). Transfer business assets, contracts, and operations to the new company. Close sole proprietorship or keep both (not recommended). Consult a lawyer for smooth transition. <a href="/limited-company-registration-kenya" className="text-blue-600 hover:text-blue-700 font-semibold">Learn more: Limited Company Registration in Kenya →</a></p>
                  </div>
                </div>
              </section>

              {/* FAQs */}
              <section id="faqs" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Frequently Asked Questions (FAQs)</h2>
                </div>

                <div className="space-y-3">
                  {faqs.map((faq, index) => (
                    <div key={index} className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition"
                      >
                        <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                        <span className="text-blue-600 text-xl flex-shrink-0">
                          {expandedFaq === index ? '−' : '+'}
                        </span>
                      </button>
                      {expandedFaq === index && (
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                          <p className="text-gray-700 text-sm leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* CTA Section */}
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-8 text-white text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to Register Your Sole Proprietorship?</h3>
                <p className="text-blue-100 mb-6 max-w-2xl mx-auto">Start your legal small business in Kenya today. Follow our step-by-step guide and get registered in 1-3 days.</p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <a href="https://ecitizen.go.ke" target="_blank" rel="noopener noreferrer" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 inline-flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Register on eCitizen
                  </a>
                  <a href="/how-to-register-business-kenya" className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold inline-flex items-center gap-2">
                    Read Full Business Guide <ArrowRight className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Related Links */}
              <div className="bg-gray-100 rounded-xl p-6 mt-8">
                <h3 className="font-bold text-gray-900 mb-4">Related Guides</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <a href="/how-to-register-business-kenya" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    How to Register a Business in Kenya
                  </a>
                  <a href="/business-name-search-kenya" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Business Name Search & Reservation
                  </a>
                  <a href="/limited-company-registration-kenya" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Limited Company Registration
                  </a>
                  <a href="/kra-pin-for-business-kenya" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    How to Get KRA PIN for Business
                  </a>
                  <a href="/business-permits-and-licenses-kenya" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Business Permits & Licenses Guide
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SoleProprietorshipRegistrationKenya;
