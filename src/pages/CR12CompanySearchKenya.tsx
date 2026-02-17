import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, AlertCircle, ArrowRight, FileText, Clock, DollarSign, Shield, Search, BookOpen, Building2, Download, Lock } from 'lucide-react';

const CR12CompanySearchKenya = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // FAQ data
  const faqs = [
    {
      question: 'What is the difference between CR12 and company search?',
      answer: 'Company search is finding company information online on BRELA portal (free, instant). CR12 is the official Certificate of Incorporation (proof company exists) requested from BRELA. Search tells you company exists and basic details. CR12 is the official legal document (required by banks, courts, tenders). You usually search first to get company details, then apply for CR12 if needed (Companies Act 2015, Section 30).'
    },
    {
      question: 'Can anyone search company details or do I need permission?',
      answer: 'Yes, anyone can search. Company information is public record (Companies Act 2015, Section 370). BRELA provides free online search to public on eCitizen portal. No permission needed. Directors cannot hide company information. This transparency protects creditors, customers, and business partners.'
    },
    {
      question: 'How do I know if a company is legitimate or a scam?',
      answer: 'Search company on BRELA: visit eCitizen or Business Registry. Check: company name matches exactly, registration date is valid, directors are listed, CR12 certificate exists. Red flags: new companies (less than 6 months), directors with criminal records (search online), address doesn\'t exist, company hasn\'t filed annual returns. Always verify before signing contracts or sending money.'
    },
    {
      question: 'Can I get a CR12 for a company that is not mine?',
      answer: 'Yes. CR12 is public document (Companies Act 2015, Section 30). BRELA issues CR12 to anyone requesting it (you don\'t need to own the company). You can apply online or visit Business Registry. Cost: KES 1,000-3,000. This is how you verify companies before doing business with them.'
    },
    {
      question: 'What if I cannot find a company on BRELA search?',
      answer: 'Company may: 1) Not be registered yet (check if it\'s in name reservation phase), 2) Be struck off (dissolved/deregistered), 3) Be sole proprietorship or partnership (not limited company), 4) Have closed but not officially deregistered, 5) Name may be spelled differently. Try variations of company name. Contact BRELA directly if still unclear (Companies Act 2015).'
    },
    {
      question: 'Can I search a company using directors\' names?',
      answer: 'eCitizen search is primarily by company name or registration number. To search by director name, you may need to: 1) Visit Business Registry physically, 2) Request from BRELA directly (fee applies), 3) Use third-party company search services (may have director index). eCitizen doesn\'t have director-name search function currently.'
    },
    {
      question: 'What does it mean if a company has not filed annual returns?',
      answer: 'Companies must file annual returns (CR1) within 30 days of anniversary (Companies Act 2015, Sections 350-380). If no returns filed: 1) Company may be struck off (dissolved), 2) Directors face fines up to KES 100,000, 3) Company cannot legally operate. If considering business with such company, it\'s a red flag for poor management or financial trouble.'
    },
    {
      question: 'Is a CR12 required to open a business bank account?',
      answer: 'Yes, absolutely. All banks require CR12 certificate to open company accounts (Banking Regulation Act, FATF compliance). You must submit: CR12, company KRA PIN, directors\' IDs, Memorandum & Articles, board resolution. Without CR12, bank cannot verify company is legitimate.'
    },
    {
      question: 'How often should I check if a company is still registered?',
      answer: 'For business partners, check before: signing major contracts, giving credit/payments, awarding tenders, entering partnerships. For internal monitoring (your own company), check annual returns are filed on time. Companies can change status quickly (struck off, liquidated). Always verify current status before important business decisions.'
    },
    {
      question: 'What information can I see from directors listed on CR12?',
      answer: 'CR12 shows: director name, ID/passport number, nationality, residential address (sometimes). You can then: cross-check identity, verify if person has conflicts of interest, search online for director\'s reputation, check if director is on BRELA blacklist for bad governance. This helps assess company leadership quality.'
    },
    {
      question: 'Can I request old/historical CR12 documents?',
      answer: 'Yes. BRELA keeps historical records. You can request: CR12 from specific date, old annual returns (CR1), director change certificates (CR2), shareholding changes (CR8). Useful for: audits, due diligence on acquisitions, litigation, dispute resolution. Request from Business Registry. Takes 7-14 days. Fee: KES 1,000-5,000 depending on document age.'
    },
    {
      question: 'What is a certified copy of CR12 and when do I need it?',
      answer: 'Certified copy: original CR12 certificate + BRELA stamp (certified true copy). Needed when: submitting to government (tenders, permits), court proceedings, major contracts requiring notarized proof. Costs more (KES 2,000-5,000) but legally accepted. Uncertified copies acceptable for most business uses (banks, partners).'
    },
    {
      question: 'How can I verify if a director is legitimate and not blacklisted?',
      answer: '1) Check CR12 shows director details, 2) Search director name online for criminal history, 3) Check BRELA records for director sanctions/blacklisting (some directors banned for fraud/bad governance), 4) Search with county corruption bureaus, 5) Ask company for director\'s director\'s resume/background. Many businesses request director background checks before major partnerships.'
    },
    {
      question: 'Can a company have multiple CR12 certificates?',
      answer: 'No. Company has ONE CR12 Certificate of Incorporation (issued at registration, never changes). eCitizen shows current/original CR12. If company changes: name, directors, shareholders, you file changes on CR2/CR8 forms (not new CR12). CR12 stays the same. You can request certified copies of same CR12 as needed for different purposes.'
    },
    {
      question: 'What does "company struck off" or "deregistered" mean?',
      answer: 'Company is dissolved/ceased to exist legally (Companies Act 2015, Section 365). Reasons: 1) Failed to file returns for 2+ years, 2) Director applied to strike off, 3) Court dissolved due to insolvency. Effect: company cannot operate, sign contracts, own property, sue/be sued. Can be restored within 10 years by court application. Check status before any business dealings.'
    }
  ];

  // CR12 information content
  const cr12Shows = [
    {
      title: 'Company Name',
      description: 'Exact legal name with "Limited" or "Ltd" (Companies Act 2015, Section 12). Ensure matches contracts and agreements exactly.'
    },
    {
      title: 'Registration Number',
      description: 'Unique identifier assigned by BRELA (e.g., PVT-000123456). Use this to search company records.'
    },
    {
      title: 'Date of Incorporation',
      description: 'Exact date company was registered (Companies Act 2015, Section 30). Shows how long company has existed.'
    },
    {
      title: 'Registered Office Address',
      description: 'Physical address in Kenya. Official location for legal notices. Must match eCitizen records.'
    },
    {
      title: 'Company Type',
      description: 'Private Limited Company, Public Limited Company, etc. (Companies Act 2015, Sections 12-20).'
    },
    {
      title: 'Directors (Current)',
      description: 'Names and ID numbers of all current directors managing company. Changes on CR2 form. Essential for due diligence.'
    },
    {
      title: 'Shareholders (Ownership)',
      description: 'Names of shareholders, number of shares, shareholding percentage (Companies Act 2015, Section 140-160). Shows true ownership.'
    },
    {
      title: 'Share Capital',
      description: 'Total authorized and issued share capital amount (e.g., KES 1,000,000). Shows capital structure.'
    },
    {
      title: 'Company Status',
      description: 'Active, Struck Off, Under Liquidation, Dormant. Must be Active to legally operate.'
    }
  ];

  // Reasons to need CR12
  const reasonsForCR12 = [
    {
      title: 'Opening Company Bank Account',
      description: 'Banks require CR12 before opening business accounts (Banking Regulation Act). Without it, no company transactions possible.'
    },
    {
      title: 'Tenders & Government Contracts',
      description: 'All government tenders require CR12 as proof of legal registration (Public Procurement and Asset Disposal Act). Also required for corporate tenders.'
    },
    {
      title: 'Signing Contracts & Agreements',
      description: 'Major business contracts (leases, partnerships, loans) require CR12 as proof company legally exists and can be held liable.'
    },
    {
      title: 'Due Diligence Before Business',
      description: 'Before entering partnerships, giving credit, or signing agreements, verify company is legitimate, active, and well-managed.'
    },
    {
      title: 'Loan Applications',
      description: 'Banks require CR12 to assess creditworthiness and ensure company is registered and legitimate (Basel regulations).'
    },
    {
      title: 'Court Proceedings',
      description: 'CR12 required in litigation to prove company has standing to sue or be sued (Civil Procedure Act). Certified copy often needed.'
    },
    {
      title: 'Vendor Due Diligence',
      description: 'Large companies require vendor CR12 before procurement. Insurance companies check CR12 for coverage. Verification step for partners.'
    },
    {
      title: 'Audit & Compliance',
      description: 'Auditors require CR12 and annual returns to verify company governance, structure, and compliance with Companies Act 2015.'
    }
  ];

  // Search steps
  const searchSteps = [
    {
      number: 1,
      title: 'Go to eCitizen Portal',
      description: 'Open www.ecitizen.go.ke in web browser. No login required for company search.'
    },
    {
      number: 2,
      title: 'Navigate to Business Registry',
      description: 'On homepage, find "Business Registration" or "Business Registry" section. Click on "Business Search" or similar option.'
    },
    {
      number: 3,
      title: 'Enter Company Name or Registration Number',
      description: 'Type company name exactly as registered (e.g., "Tech Solutions Limited"). Or use registration number if you have it. Click "Search".'
    },
    {
      number: 4,
      title: 'View Search Results',
      description: 'Results show: company name, registration number, date registered, status. Click on company name to see detailed information.'
    },
    {
      number: 5,
      title: 'Check Company Details',
      description: 'View: directors, shareholders, registered address, share capital, company status. Screenshot or note details for records.'
    },
    {
      number: 6,
      title: 'Verify Information',
      description: 'Ensure details match what you\'re told (name, directors, address). Discrepancies indicate possible fraud or outdated information.'
    }
  ];

  // CR12 application steps
  const cr12Steps = [
    {
      number: 1,
      title: 'Prepare Company Details',
      description: 'Get company name exactly as registered (from contract/business card). Or company registration number. Both help locate company.'
    },
    {
      number: 2,
      title: 'Go to BRELA/eCitizen Portal',
      description: 'Visit www.ecitizen.go.ke. Navigate to "Business Registration" → "Request for Company Documents" or "CR12 Application".'
    },
    {
      number: 3,
      title: 'Fill Application Form',
      description: 'Complete online form: company name/registration number, your details, purpose of CR12, number of copies needed. Clear all mandatory fields.'
    },
    {
      number: 4,
      title: 'Pay Fee Online',
      description: 'Pay KES 1,000-3,000 via M-Pesa, bank transfer, or card (depending on urgency). Standard = 3-7 days. Expedited = 1-2 days.'
    },
    {
      number: 5,
      title: 'Submit Application',
      description: 'Submit application online. You\'ll receive confirmation email with reference number. Keep for tracking.'
    },
    {
      number: 6,
      title: 'Wait for Processing',
      description: 'BRELA processes: standard service 3-7 days, expedited 1-2 days. You\'ll receive email notification when ready.'
    },
    {
      number: 7,
      title: 'Download or Collect CR12',
      description: 'Download CR12 PDF from eCitizen (digital version) OR collect printed copy from Business Registry office. Digital version accepted by banks/government.'
    },
    {
      number: 8,
      title: 'Save & Secure CR12',
      description: 'Save digital copy in secure location. Print multiple copies (banks, tenders, contracts). Keep original safe.'
    }
  ];

  // CR12 costs
  const cr12Costs = [
    { service: 'Company Search (eCitizen)', cost: 'Free' },
    { service: 'Company Search (Physical - Business Registry)', cost: 'Free' },
    { service: 'CR12 Certificate (Standard - 3-7 days)', cost: 'KES 1,000' },
    { service: 'CR12 Certificate (Expedited - 1-2 days)', cost: 'KES 2,000' },
    { service: 'Certified Copy of CR12', cost: 'KES 2,000 - 3,000' },
    { service: 'Historical/Old CR12 Document', cost: 'KES 1,000 - 5,000' },
    { service: 'Director Change Certificate (CR2)', cost: 'KES 500 - 1,000' },
    { service: 'Shareholder Change Certificate (CR8)', cost: 'KES 500 - 1,000' },
    { service: 'Annual Returns Search (CR1)', cost: 'Free (view) - KES 1,000 (certified copy)' },
    { service: 'Bulk Company Search (Research)', cost: 'KES 5,000 - 50,000 (depends on scope)' }
  ];

  // Timeline
  const timeline = [
    { stage: 'Company Search (Online)', duration: 'Instant (5-30 seconds)' },
    { stage: 'CR12 Request (Standard Service)', duration: '3-7 business days' },
    { stage: 'CR12 Request (Expedited Service)', duration: '1-2 business days' },
    { stage: 'Certified Copy of CR12', duration: '3-7 business days' },
    { stage: 'Historical Documents', duration: '7-14 business days' }
  ];

  // Common problems
  const commonProblems = [
    {
      problem: 'Company Not Found on BRELA Search',
      solution: 'Check spelling carefully (exact match required). Try without "Limited". Company may be sole proprietorship (different registry). If newly registered (less than 1 week), may not appear yet. Contact BRELA or visit Business Registry office.'
    },
    {
      problem: 'CR12 Shows Different Directors than Expected',
      solution: 'Directors may have changed. Old CR12 outdated. Request current CR12. Ask company for explanation. If unauthorized change, could indicate fraud or dispute. Check annual returns (CR1) to verify director changes.'
    },
    {
      problem: 'Company Status Shows "Struck Off"',
      solution: 'Company is dissolved/deregistered. Cannot legally operate. Do NOT sign contracts or give money. Company can be restored within 10 years via court. Ask company if restoring. Risky business partner.'
    },
    {
      problem: 'CR12 Downloaded is Blurry or Unreadable',
      solution: 'Request certified copy from BRELA (more official/clear). Print from eCitizen at good resolution. Try different browser. Download again. Still issues? Visit Business Registry office to get printed official copy.'
    },
    {
      problem: 'Cannot Open CR12 PDF File',
      solution: 'Install/update PDF reader (Adobe Reader, browser PDF viewer). Try different device (computer vs phone). File may be corrupted. Download again from eCitizen. Still blocked? File damaged - request new copy from BRELA.'
    }
  ];

  // Tips to avoid scams
  const scamTips = [
    'Always search company on BRELA before signing contracts or sending money',
    'Verify company name matches EXACTLY (including "Limited" or "Ltd")',
    'Check company status is ACTIVE (not Struck Off, Under Liquidation, or Dormant)',
    'Verify directors listed on CR12 - cross-check with who you\'re negotiating with',
    'Check when company was registered - new companies (less than 6 months) = higher risk',
    'Verify registered address is real - visit if possible, call to confirm',
    'Search director names online for criminal history or fraud cases',
    'Check if company has filed annual returns - 2+ years of missing returns = red flag',
    'Request physical address (not just P.O. Box) - meet in person before major deals',
    'Ask for physical CR12 (not just screenshot) - easy to fake screenshots',
    'Check bank account registered to company (banks verify CR12) - never give to personal accounts',
    'Report suspicious companies to BRELA or CID if you suspect fraud',
    'Use secure payment methods (bank transfer, verified channels) - never cash/mobile money to unknown account',
    'For major deals, hire lawyer to do due diligence on company - worth the investment'
  ];

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'what-is-cr12', 'cr12-information', 'why-need-cr12', 'company-search', 'apply-cr12', 'documents', 'fees', 'timeline', 'interpret', 'common-problems', 'offline-search', 'avoid-scams', 'faqs'];
      
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
        <title>CR12 & Company Search Kenya – Verify Company Online</title>
        <meta name="description" content="How to search companies, get CR12 certificate, verify directors in Kenya. Step-by-step guide to BRELA company search, fees, timelines & verification." />
        <link rel="canonical" href="https://yoursite.com/company-cr12-and-search-kenya" />
        
        {/* OpenGraph */}
        <meta property="og:title" content="CR12 & Company Search Kenya – Verify Company Details Online" />
        <meta property="og:description" content="Complete guide to searching companies, obtaining CR12 certificate, and verifying company details in Kenya on BRELA/eCitizen." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://yoursite.com/company-cr12-and-search-kenya" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=630&fit=crop" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="CR12 & Company Search Kenya – Verify Company Details Online" />
        <meta name="twitter:description" content="Complete guide to searching companies, obtaining CR12 certificate, and verifying company details in Kenya." />
        <meta name="twitter:image" content="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=630&fit=crop" />
        
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
            "description": "Company registration and legal services in Kenya"
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
                "name": "CR12 & Company Search Kenya",
                "item": "https://yoursite.com/company-cr12-and-search-kenya"
              }
            ]
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Search Companies and Get CR12 in Kenya",
            "description": "Step-by-step guide to searching companies on BRELA and obtaining CR12 certificates online",
            "step": [
              ...searchSteps.map(step => ({
                "@type": "HowToStep",
                "position": step.number,
                "name": step.title,
                "text": step.description
              })),
              ...cr12Steps.map((step, idx) => ({
                "@type": "HowToStep",
                "position": searchSteps.length + idx + 1,
                "name": step.title,
                "text": step.description
              }))
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
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">CR12, Company Search & Directors Verification in Kenya</h1>
            </div>
            <p className="text-blue-100 text-lg max-w-3xl">Complete guide to searching companies, obtaining CR12 certificates, and verifying company details and directors in Kenya. Learn how to conduct company searches on BRELA/eCitizen, get official company documents, and avoid business scams.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="https://ecitizen.go.ke" target="_blank" rel="noopener noreferrer" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 flex items-center gap-2">
                <Search className="w-5 h-5" />
                Search Company on eCitizen
              </a>
              <a href="/limited-company-registration-kenya" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
                Register a Company <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="content-full-width">
        <div className="max-w-6xl mx-auto px-0 sm:px-4 md:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm text-gray-600">
            <ol className="flex items-center gap-2">
              <li><a href="/" className="text-blue-600 hover:text-blue-700">Home</a></li>
              <li>/</li>
              <li>CR12 & Company Search</li>
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
                    { id: 'what-is-cr12', label: 'What is CR12' },
                    { id: 'cr12-information', label: 'CR12 Info' },
                    { id: 'why-need-cr12', label: 'Why Need CR12' },
                    { id: 'company-search', label: 'Company Search' },
                    { id: 'apply-cr12', label: 'Get CR12' },
                    { id: 'documents', label: 'Documents' },
                    { id: 'fees', label: 'Fees' },
                    { id: 'timeline', label: 'Timeline' },
                    { id: 'interpret', label: 'Interpret CR12' },
                    { id: 'common-problems', label: 'Problems & Fixes' },
                    { id: 'offline-search', label: 'Offline Search' },
                    { id: 'avoid-scams', label: 'Avoid Scams' },
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
                    { id: 'what-is-cr12', label: 'What is CR12' },
                    { id: 'cr12-information', label: 'CR12 Information' },
                    { id: 'why-need-cr12', label: 'Why Need CR12' },
                    { id: 'company-search', label: 'Company Search Steps' },
                    { id: 'apply-cr12', label: 'Apply for CR12' },
                    { id: 'documents', label: 'Documents' },
                    { id: 'fees', label: 'Fees & Costs' },
                    { id: 'timeline', label: 'Timeline' },
                    { id: 'interpret', label: 'Interpret CR12' },
                    { id: 'common-problems', label: 'Common Problems' },
                    { id: 'offline-search', label: 'Offline Search' },
                    { id: 'avoid-scams', label: 'Avoid Scams' },
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
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Overview: CR12 & Company Search</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                    The <strong>CR12 Certificate of Incorporation</strong> is the official document proving a company legally exists in Kenya. A <strong>company search</strong> on BRELA allows you to find and verify any registered company's details—directors, shareholders, address, registration number—instantly and for free online. This guide explains both processes and how to use them to protect yourself in business.
                  </p>

                  <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border-l-4 border-blue-600">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-700 mb-1">Free</div>
                        <div className="text-xs text-gray-600">Company Search</div>
                        <p className="text-sm text-gray-700 mt-2">Instant on eCitizen</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-700 mb-1">KES 1,000+</div>
                        <div className="text-xs text-gray-600">CR12 Certificate</div>
                        <p className="text-sm text-gray-700 mt-2">3-7 days standard</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-700 mb-1">100%</div>
                        <div className="text-xs text-gray-600">Public Records</div>
                        <p className="text-sm text-gray-700 mt-2">Anyone can search</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded-lg mb-6">
                    <h4 className="font-bold text-gray-900 mb-2">Why This Guide Matters</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Verify Legitimacy:</strong> Know if company is real and legally registered before doing business</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Avoid Scams:</strong> Check directors, address, and registration status to protect yourself</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Get Official Proof:</strong> CR12 certificate needed for banks, tenders, contracts, court proceedings</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Due Diligence:</strong> Research companies before signing major deals or partnerships</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* What is CR12 */}
              <section id="what-is-cr12" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Lock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What is a CR12 Form?</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">CR12 is the <strong>Certificate of Incorporation</strong> issued by BRELA (Business Registration and Licensing Authority) proving a company legally exists.</p>

                  <img 
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop"
                    alt="Company Registry Document"
                    className="rounded-lg shadow-lg w-full mb-6"
                  />

                  <div className="bg-white border-2 border-gray-200 p-6 rounded-xl mb-6">
                    <h4 className="font-bold text-gray-900 mb-3">Key Facts About CR12</h4>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex gap-3">
                        <span className="text-blue-600 font-bold">•</span>
                        <span><strong>Official Legal Document:</strong> Issued by BRELA, the government authority managing company registrations (Companies Act 2015, Section 30)</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-blue-600 font-bold">•</span>
                        <span><strong>Proof of Legal Existence:</strong> Shows company is registered and legally recognized to operate in Kenya</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-blue-600 font-bold">•</span>
                        <span><strong>Public Document:</strong> Anyone can request CR12 (you don't need to own the company). Company information is public record (Companies Act 2015, Section 370)</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-blue-600 font-bold">•</span>
                        <span><strong>Never Changes:</strong> Company gets one CR12 at registration. Changes to directors/shareholders don't create new CR12 (reported on CR2/CR8 forms instead)</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-blue-600 font-bold">•</span>
                        <span><strong>Required by Law:</strong> Needed for: bank accounts, government tenders, major contracts, court proceedings, business loans (Banking Act, PPADA, Companies Act 2015)</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-cyan-50 border-l-4 border-cyan-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>Simple Analogy:</strong> CR12 is like a birth certificate for companies. It proves the company exists, when it was created, and who created it. Just as you can't open a bank account without a birth certificate, companies can't open accounts without CR12.</p>
                  </div>
                </div>
              </section>

              {/* CR12 Information */}
              <section id="cr12-information" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What Information Does CR12 Show?</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">CR12 contains comprehensive company information essential for business verification:</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {cr12Shows.map((item, index) => (
                      <div key={index} className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                        <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                        <p className="text-gray-700 text-sm">{item.description}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>Why This Matters:</strong> Before signing contracts, giving credit, or starting partnerships, verify all CR12 information matches what company told you. Discrepancies indicate possible fraud or outdated records.</p>
                  </div>
                </div>
              </section>

              {/* Why Need CR12 */}
              <section id="why-need-cr12" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Why You May Need a CR12</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">CR12 is required or recommended in many business situations:</p>

                  <div className="space-y-3">
                    {reasonsForCR12.map((reason, index) => (
                      <div key={index} className="bg-white border-2 border-green-200 p-5 rounded-xl">
                        <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          {reason.title}
                        </h4>
                        <p className="text-gray-700 text-sm">{reason.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Company Search */}
              <section id="company-search" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Search className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How to Conduct a Company Search on eCitizen</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Company search is free, instant, and available to anyone. No login required. Here's how:</p>

                  <div className="space-y-4 mb-6">
                    {searchSteps.map((step) => (
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

                  <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>Pro Tip:</strong> Company search is your first verification step before any business dealings. Takes 2 minutes online. Use this before signing contracts, giving credit, or starting partnerships.</p>
                  </div>
                </div>
              </section>

              {/* Apply CR12 */}
              <section id="apply-cr12" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Download className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How to Apply for a CR12 Online</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Apply for official CR12 certificate online through eCitizen or BRELA portal. Takes 3-7 days standard (1-2 days expedited):</p>

                  <div className="space-y-4 mb-6">
                    {cr12Steps.map((step) => (
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

                  <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>Certification:</strong> Digital CR12 from eCitizen is accepted by banks, government, and courts. For very formal proceedings (court submissions), request "certified copy" with BRELA stamp (additional KES 1,000-2,000, takes 3-7 days extra).</p>
                  </div>
                </div>
              </section>

              {/* Documents Required */}
              <section id="documents" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Documents Required</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">To apply for CR12, you need minimal information:</p>

                  <div className="bg-white border-2 border-gray-200 p-6 rounded-xl space-y-3 mb-6">
                    <div className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold text-gray-900">Company Name (Exact)</h4>
                        <p className="text-gray-700 text-sm">Must match as registered including "Limited" or "Ltd"</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold text-gray-900">Company Registration Number (Optional)</h4>
                        <p className="text-gray-700 text-sm">If you have it (speeds up search). Format: PVT-000123456</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold text-gray-900">Your Email Address</h4>
                        <p className="text-gray-700 text-sm">For CR12 delivery and processing updates</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold text-gray-900">Purpose of CR12 (Optional)</h4>
                        <p className="text-gray-700 text-sm">Bank account, tender, contract, verification. Helps BRELA process correctly</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold text-gray-900">Payment Method</h4>
                        <p className="text-gray-700 text-sm">M-Pesa, bank transfer, or credit card (processed online)</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>Note:</strong> No need to prove you own the company or explain why you want CR12. It's a public document available to anyone (Companies Act 2015, Section 370).</p>
                  </div>
                </div>
              </section>

              {/* Fees & Costs */}
              <section id="fees" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <DollarSign className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">CR12 Fees & Costs</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-4">Here's the complete cost breakdown:</p>

                  <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6 overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">Service</th>
                          <th className="px-4 py-3 text-left font-semibold">Cost (KES)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {cr12Costs.map((fee, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">{fee.service}</td>
                            <td className="px-4 py-3 text-gray-700 font-semibold">{fee.cost}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>Best Value:</strong> Free company search on eCitizen gives you all information you need for most purposes (verification, due diligence, partner checks). Pay for CR12 only if you need official document (banks, tenders, courts).</p>
                  </div>
                </div>
              </section>

              {/* Timeline */}
              <section id="timeline" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How Long Does It Take?</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Timeline for company search and CR12 requests:</p>

                  <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">Task</th>
                          <th className="px-4 py-3 text-left font-semibold">Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {timeline.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">{item.stage}</td>
                            <td className="px-4 py-3 text-gray-700">{item.duration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>Pro Tip:</strong> Company search = immediate verification. CR12 = 3-7 days for official document. For urgent bank account or tender, use expedited CR12 (KES 2,000, 1-2 days).</p>
                  </div>
                </div>
              </section>

              {/* Interpret CR12 */}
              <section id="interpret" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <BookOpen className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How to Interpret CR12 Information</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">When you receive CR12, here's how to read and verify the information:</p>

                  <div className="space-y-4 mb-6">
                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">1. Check Company Status</h4>
                      <p className="text-gray-700 text-sm mb-2"><strong>Status must be: ACTIVE</strong></p>
                      <p className="text-gray-700 text-sm">Red flags: Struck Off (dissolved), Under Liquidation, Dormant. Company cannot legally operate if not Active. Do NOT sign contracts with non-active companies.</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">2. Verify Company Name Matches</h4>
                      <p className="text-gray-700 text-sm mb-2">Compare CR12 name with: business card, website, contracts. Exact spelling must match (including "Limited" or "Ltd").</p>
                      <p className="text-gray-700 text-sm">Red flag: Different name = possibly wrong company or fraud.</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">3. Check Registration Date</h4>
                      <p className="text-gray-700 text-sm mb-2">Know how long company has existed. New companies (less than 6 months) = higher risk. Established companies (5+ years) = more credible.</p>
                      <p className="text-gray-700 text-sm">Note: Older date ≠ better; many fraudsters use old registered shell companies.</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">4. Verify Directors Match</h4>
                      <p className="text-gray-700 text-sm mb-2">Check names of directors on CR12. If negotiating with person claiming to be director, verify name matches exactly.</p>
                      <p className="text-gray-700 text-sm">Red flag: Person using different name than listed on CR12 = possible fraud or impersonation.</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">5. Check Address Exists</h4>
                      <p className="text-gray-700 text-sm mb-2">Registered address on CR12 should be real physical location. Use Google Maps to verify address. Visit if possible.</p>
                      <p className="text-gray-700 text-sm">Red flag: Address doesn't exist or is just P.O. Box = possible shell company.</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">6. Understand Share Capital</h4>
                      <p className="text-gray-700 text-sm mb-2">Share capital = company's declared assets. Higher share capital shows more stability/investment (e.g., KES 1M vs KES 100).</p>
                      <p className="text-gray-700 text-sm">Note: Share capital doesn't guarantee solvency; many failed companies had large share capital.</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">7. Cross-Check with Annual Returns</h4>
                      <p className="text-gray-700 text-sm mb-2">If you have company's latest annual returns (CR1), compare directors, address, share capital with CR12.</p>
                      <p className="text-gray-700 text-sm">Discrepancies = outdated information, changes not reported, or fraud.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Common Problems */}
              <section id="common-problems" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Common Problems & Fixes</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Encountered an issue with company search or CR12? Here are solutions:</p>

                  <div className="space-y-3">
                    {commonProblems.map((item, index) => (
                      <div key={index} className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                        <h4 className="font-bold text-gray-900 mb-1">❌ {item.problem}</h4>
                        <p className="text-gray-700 text-sm"><strong>Solution:</strong> {item.solution}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg mt-6">
                    <p className="text-gray-700 text-sm"><strong>Need More Help?</strong> Contact BRELA directly: Phone +254 20 2639000 or visit Business Registry office (Treasury Building, Nairobi). Email: info@brela.or.ke</p>
                  </div>
                </div>
              </section>

              {/* Offline Search */}
              <section id="offline-search" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Building2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Offline Search at Business Registry</h2>
                </div>

                <div className="prose max-x-none">
                  <p className="text-gray-700 mb-6">No internet access? You can search companies at BRELA office:</p>

                  <div className="bg-white border-2 border-blue-200 p-6 rounded-xl mb-6 space-y-4">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">📍 Main Office Location</h4>
                      <p className="text-gray-700 text-sm">Business Registration and Licensing Authority (BRELA)<br/>Treasury Building, 4th Floor<br/>Nairobi, Kenya</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">📞 Contact</h4>
                      <p className="text-gray-700 text-sm">Phone: +254 20 2639000<br/>Email: info@brela.or.ke<br/>Hours: 8am-4:30pm Mon-Fri</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">📋 What to Bring</h4>
                      <ul className="text-gray-700 text-sm space-y-1">
                        <li>• Company name (exact spelling)</li>
                        <li>• Company registration number (if you have)</li>
                        <li>• Your ID/passport</li>
                        <li>• Cash (for certified copies)</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">⏱️ Processing at Office</h4>
                      <p className="text-gray-700 text-sm">Search: Instant. CR12 printed copy: 30 minutes to 1 hour. Certified copy: 1-3 hours.</p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>Tip:</strong> Online (eCitizen) is faster and available 24/7. Visit office only if: no internet access, need physical certified copy for court, or need urgent documents same day.</p>
                  </div>
                </div>
              </section>

              {/* Avoid Scams */}
              <section id="avoid-scams" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Tips to Avoid Company Scams</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Use company search and CR12 to protect yourself from business fraud:</p>

                  <div className="bg-gradient-to-br from-red-50 to-orange-50 border-l-4 border-red-600 p-6 rounded-lg mb-6">
                    <h4 className="font-bold text-gray-900 mb-4">🚨 14 Tips to Avoid Scams</h4>
                    <ol className="space-y-2 text-gray-700 text-sm">
                      {scamTips.map((tip, index) => (
                        <li key={index} className="flex gap-2">
                          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold flex-shrink-0">{index + 1}</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>⚠️ Warning Signs of Fraud:</strong> Pressure to pay urgently, request for cash payment, vague company address, newly registered company with large contracts, directors with poor reputations, no physical office, inconsistent company info, demands for personal guarantees.</p>
                  </div>
                </div>
              </section>

              {/* FAQs */}
              <section id="faqs" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
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
                <h3 className="text-2xl font-bold mb-4">Ready to Verify a Company?</h3>
                <p className="text-blue-100 mb-6 max-w-2xl mx-auto">Search companies for free on eCitizen, request CR12 online, or verify directors before signing contracts.</p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <a href="https://ecitizen.go.ke" target="_blank" rel="noopener noreferrer" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 inline-flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Search Company Now
                  </a>
                  <a href="/limited-company-registration-kenya" className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold inline-flex items-center gap-2">
                    Register Your Company <ArrowRight className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Related Links */}
              <div className="bg-gray-100 rounded-xl p-6 mt-8">
                <h3 className="font-bold text-gray-900 mb-4">Related Guides</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <a href="/limited-company-registration-kenya" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Limited Company Registration Kenya
                  </a>
                  <a href="/how-to-register-business-kenya" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    How to Register a Business in Kenya
                  </a>
                  <a href="/company-annual-returns-kenya" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Company Annual Returns Guide
                  </a>
                  <a href="/closing-or-deregistering-company-kenya" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Closing or Deregistering a Company
                  </a>
                  <a href="/business-permits-and-licenses-kenya" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Business Permits & Licenses Kenya
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default CR12CompanySearchKenya;
