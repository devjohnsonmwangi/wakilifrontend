import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, AlertCircle, ArrowRight, FileText, Clock, DollarSign, Shield, TrendingUp, Users, Briefcase, Building2, Calendar, XCircle } from 'lucide-react';

const CompanyAnnualReturnsKenya = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // FAQ data
  const faqs = [
    {
      question: 'What is the difference between annual returns and financial statements?',
      answer: 'Annual returns (CR1 form) = public filing showing directors, shareholders, registered address, share capital filed with BRELA (Companies Act 2015, Sections 350-380). Financial statements = detailed company accounting showing income, expenses, assets, liabilities filed with KRA and sometimes auditors. Companies must file BOTH. Annual returns are public (anyone can search). Financial statements can be private unless you\'re a public company (Companies Act 2015, Section 424).'
    },
    {
      question: 'What happens if I miss the annual returns deadline?',
      answer: 'Penalties escalate: 1-3 months late = KES 50,000 fine. 3-6 months = KES 100,000 fine + daily interest. 6-12 months = KES 100,000 + compounding penalties. 2+ years = company automatically struck off (dissolved). Once struck, cannot legally operate, sign contracts, or access bank accounts. Can be restored within 10 years via court application (Companies Act 2015, Sections 365, 380).'
    },
    {
      question: 'Can I file annual returns late?',
      answer: 'Yes, but with penalties. File immediately when you realize late (don\'t delay further). BRELA will add penalties based on delay period. Explanation helps courts when restoring struck-off companies. Better to file late than never. Once company struck off (2+ years late), restoration costs KES 50,000-200,000+ in legal fees.'
    },
    {
      question: 'Do sole proprietorships and partnerships file annual returns?',
      answer: 'No. Only limited companies and public companies file annual returns with BRELA (Companies Act 2015). Sole proprietorships and partnerships file tax returns with KRA but not BRELA annual returns. If you\'re unsure what structure you have, check BRELA (company = limited/public). Different filing requirements per structure.'
    },
    {
      question: 'What if my company has no activity or is dormant?',
      answer: 'Still must file annual returns (mandatory). Leave financial figures as zero if no income/expenses. Mark as "dormant" or "no activity" in comments. Failure to file even for inactive companies = same penalties and struck-off risk. If truly inactive, deregister company formally instead (costs less than penalties).'
    },
    {
      question: 'Can directors file annual returns themselves or need an accountant?',
      answer: 'Directors can file DIY (eCitizen form is simple). BUT if company has employees, turnover exceeds KES 5M, or has complex structure: hire accountant. Accountant ensures numbers are correct (BRELA checks for obvious fraud). Incorrect filings = amendments needed (delays + fees). Budget KES 10,000-50,000 for accountant if turnover &gt; KES 5M.'
    },
    {
      question: 'What is the filing fee for annual returns?',
      answer: 'Standard eCitizen filing: Free - KES 1,000 (usually free if filed on time). Late filing: KES 1,000-5,000 (increases with delay). Certified copy of filed returns: KES 1,000-2,000. Physical filing at BRELA office: KES 500-1,000. Late penalties separate from filing fees (can reach KES 100,000+).'
    },
    {
      question: 'Can I file annual returns on behalf of my company?',
      answer: 'Only authorized persons can file: company director (most common), company secretary, or authorized agent (lawyer/accountant with power of attorney). Cannot be random person. Director must authorize agent in writing. Agent logs in with eCitizen account + company credentials. eCitizen tracks who filed (audit trail).'
    },
    {
      question: 'How do I know if my company is struck off?',
      answer: 'Check BRELA company search on eCitizen: status will show "Struck Off" or "Under Deregistration". Or call BRELA +254 20 2639000. Struck off means: failed to file returns for 2+ years, automatically deregistered. Cannot legally operate. To restore: file with court, pay restoration fee (KES 50,000-200,000+), get approval. Takes 1-3 months.'
    },
    {
      question: 'What if I have directors or shareholders who passed away?',
      answer: 'File annual returns showing deceased person (must file within 30 days regardless). Then file CR2 form (director change) to remove deceased, add new director. Death certificate required. Process: 1) File returns with old directors, 2) File CR2 with probate order, 3) Get updated CR12. BRELA allows 30 days grace for deaths (Companies Act 2015, Section 185).'
    },
    {
      question: 'Is there a grace period for filing annual returns?',
      answer: 'No official grace period. Filing deadline is exactly 30 days after company anniversary (Companies Act 2015, Section 350). BRELA accepts late filings but charges escalating penalties. No "30-day grace before penalties" - penalties start from day 31. File early (at least 1 week before deadline) to avoid system delays.'
    },
    {
      question: 'What if my company information changed mid-year (director resigned, address changed)?',
      answer: 'Must file changes immediately on CR2/CR8 forms (within 30 days). Annual returns show status at filing date. Changes mid-year reported separately. Example: Director A resigned March, Director B appointed May. Annual returns show both (report dates of changes). Subsequent annual return won\'t list Director A if no longer director.'
    },
    {
      question: 'Can I amend annual returns after filing?',
      answer: 'Yes. File CR9 form (Amendment) with BRELA. Costs KES 1,000-2,000. Takes 7-14 days. Common reasons: spelling error, wrong shareholder number, incorrect address. Directors can amend anytime (even years later). BRELA updates records. Original filed document marked "amended" in system. Better to get right first time (CR9 adds delays + costs).'
    },
    {
      question: 'What if I disagree with BRELA about penalties or struck-off status?',
      answer: 'Can appeal to BRELA or take legal action. File complaint with BRELA first (they may waive penalties for genuine hardship/error). If unsatisfied, hire lawyer to file in court. Can argue: system error, delay by BRELA, hardship circumstances. Court has discretion to waive/reduce penalties (Companies Act 2015, Section 380). Takes 3-12 months + KES 50,000-200,000 legal fees.'
    }
  ];

  // Filing steps
  const filingSteps = [
    {
      number: 1,
      title: 'Prepare Company Information',
      description: 'Gather: current directors (names, IDs), shareholders (names, share count), registered address, share capital, company bank account details, any director/shareholder changes during year. Have most recent CR12, previous year\'s returns (for reference).'
    },
    {
      number: 2,
      title: 'Prepare Financial Information (if required)',
      description: 'If turnover exceeds KES 5M: prepare profit & loss statement, balance sheet, assets/liabilities list. If sole director with no employees and under KES 5M: simple summary may suffice. Hire accountant if uncertain (protects against errors).'
    },
    {
      number: 3,
      title: 'Log Into eCitizen Portal',
      description: 'Go to www.ecitizen.go.ke. Log in with eCitizen account (username/password). Navigate to "Business Registration" → "File Annual Returns" or "CR1 Filing".'
    },
    {
      number: 4,
      title: 'Enter Company Basic Details',
      description: 'System pre-fills: company name, registration number, address. Verify all details correct. Correct any errors (address change, contact info). Click "Next".'
    },
    {
      number: 5,
      title: 'List Current Directors',
      description: 'Add all current directors: name, ID/passport number, nationality. Check box "still director" if no changes. If director changed during year, note date of change (on previous or current form depending on timing). Complete director form for each person.'
    },
    {
      number: 6,
      title: 'List Current Shareholders',
      description: 'Add all current shareholders: name, number of shares held, shareholding %. Check total shares equal issued share capital. If shareholder changed during year, note date. System auto-calculates percentages.'
    },
    {
      number: 7,
      title: 'Enter Financial Summary',
      description: 'If applicable: total company income, total expenses, net profit/loss. If turnover under KES 5M and sole director: may just need declaration. Larger companies need audited figures. Ensure numbers match company bank records and tax filed with KRA.'
    },
    {
      number: 8,
      title: 'Report Any Company Changes',
      description: 'Check if filed any changes during year: director appointments/resignations, shareholder changes, address changes, name changes. Mark "yes" if changes, system will ask for details. Dates of changes must be documented.'
    },
    {
      number: 9,
      title: 'Review & Declaration',
      description: 'System shows summary of all data entered. Director declares: information is true and accurate. False declaration = perjury (criminal offense). Review carefully before signing/declaring (Companies Act 2015, Section 350).'
    },
    {
      number: 10,
      title: 'Pay Filing Fee',
      description: 'Pay filing fee (usually free if on-time, KES 1,000-5,000 if late). Method: M-Pesa, bank transfer, or credit card (processed in 5-10 minutes).'
    },
    {
      number: 11,
      title: 'Submit Application',
      description: 'Click "Submit" or "File Returns". System generates reference number. Email confirmation sent. Keep reference number for tracking/queries.'
    },
    {
      number: 12,
      title: 'Wait for Processing & Approval',
      description: 'BRELA processes: 1-7 business days (standard). Checks for obvious errors/completeness. If missing info: email request for amendments. Director must file CR9 amendment form (costs KES 1,000).'
    },
    {
      number: 13,
      title: 'Receive Confirmation',
      description: 'Once approved, receive email + SMS. Annual returns officially filed. Can download/print proof of filing. Company compliance current until next anniversary.'
    }
  ];

  // Filing deadlines
  const deadlines = [
    { period: 'First Annual Returns', deadline: '30 days from incorporation date' },
    { period: 'Subsequent Returns', deadline: '30 days from company anniversary date' },
    { period: 'Late Filing (No penalties)', deadline: 'File immediately upon realization' },
    { period: 'Penalties Start', deadline: 'Day 31 after anniversary' },
    { period: 'Strike-off Risk', deadline: '2+ years (24+ months) of non-filing' }
  ];

  // Penalties table
  const penalties = [
    { delay: '1-3 months late', penalty: 'KES 50,000' },
    { delay: '3-6 months late', penalty: 'KES 100,000' },
    { delay: '6-12 months late', penalty: 'KES 100,000 + interest' },
    { delay: '12-24 months late', penalty: 'KES 100,000 + compounding interest' },
    { delay: '24+ months late', penalty: 'Company Struck Off (dissolved)' }
  ];

  // Documents required
  const documentsRequired = [
    { document: 'Current CR12 Certificate', required: 'Yes', notes: 'Proof of company registration' },
    { document: 'Director IDs/Passports', required: 'Yes', notes: 'For all directors (copies sufficient)' },
    { document: 'Shareholder List', required: 'Yes', notes: 'Names, ID numbers, share count' },
    { document: 'Company Bank Statements (if required)', required: 'Sometimes', notes: 'If company has turnover &gt; KES 5M' },
    { document: 'Profit & Loss Statement', required: 'Sometimes', notes: 'If turnover exceeds KES 5M (audited)' },
    { document: 'Balance Sheet', required: 'Sometimes', notes: 'For medium/large companies' },
    { document: 'Changes Documentation', required: 'If applicable', notes: 'CR2 forms, director resignation letters' },
    { document: 'Registered Address Proof', required: 'If changed', notes: 'Lease agreement, utility bill' }
  ];

  // Filing fees
  const filingFees = [
    { service: 'Annual Returns (On-time filing)', cost: 'Free - KES 1,000' },
    { service: 'Annual Returns (1-3 months late)', cost: 'KES 1,000 + KES 50,000 penalty' },
    { service: 'Annual Returns (3-6 months late)', cost: 'KES 1,000 + KES 100,000 penalty' },
    { service: 'Amendment (CR9 form)', cost: 'KES 1,000 - 2,000' },
    { service: 'Certified Copy of Filed Returns', cost: 'KES 1,000 - 2,000' },
    { service: 'Director Change (CR2) - Filed with returns', cost: 'KES 500 - 1,000' },
    { service: 'Accountant Review (if hired)', cost: 'KES 10,000 - 50,000' }
  ];

  // Common mistakes
  const commonMistakes = [
    {
      mistake: 'Missing Annual Returns Deadline',
      consequence: 'Penalties KES 50,000-100,000+. Company risk of strike-off after 2 years. Operations disrupted. Bank accounts frozen. Cannot sign contracts.'
    },
    {
      mistake: 'Providing Inaccurate Director/Shareholder Info',
      consequence: 'Legal liability for directors (false declaration = perjury). BRELA amendments required (costs KES 1,000-2,000, delays). Company records inaccurate.'
    },
    {
      mistake: 'Not Updating Changes (Director/Shareholder Mid-Year)',
      consequence: 'Annual returns show outdated info. BRELA assumes fraud. Inconsistencies with CR12. Directors may face liability.'
    },
    {
      mistake: 'Filing Without Financial Records',
      consequence: 'Incorrect income/expense figures filed. Mismatch with KRA tax filings (red flag for audit). Amendments needed.'
    },
    {
      mistake: 'Sole Director Not Filing',
      consequence: 'Company automatically struck off after 2 years. Cannot operate, access funds, renew licenses. Restoration costs KES 50,000-200,000+ legal fees.'
    },
    {
      mistake: 'Not Checking Company Status Before Filing',
      consequence: 'May discover company already struck off (cannot file until restored). Must restore first (court process, 1-3 months, costs KES 50,000+).'
    },
    {
      mistake: 'Listing Wrong Share Capital or Shareholders',
      consequence: 'Ownership disputes arise. Investors confused. BRELA asks for proof. May need court resolution. Expensive and time-consuming.'
    }
  ];

  // Compliance check points
  const complianceChecks = [
    'Company name, registration number, address match CR12?',
    'All directors listed with correct IDs and spelling?',
    'All shareholders listed with share counts totaling issued capital?',
    'Directors signed/declared information is accurate?',
    'Financial figures (if provided) match tax returns filed with KRA?',
    'Any director/shareholder changes during year reported?',
    'Company status is ACTIVE (not Struck Off)?',
    'Filing deadline not missed (or late filing fee included)?',
    'All required documents scanned/ready?',
    'Contact email/phone current for BRELA notifications?'
  ];

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'what-are', 'who-must-file', 'why-mandatory', 'when-due', 'documents', 'filing-steps', 'fees', 'penalties', 'update-details', 'check-status', 'common-mistakes', 'not-filing', 'hire-help', 'faqs'];
      
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
        <title>Company Annual Returns Kenya – Filing Guide 2026 & 2027</title>
        <meta name="description" content="Complete guide to company annual returns filing in Kenya. Step-by-step eCitizen process, deadlines, penalties, compliance requirements & filing fees." />
        <link rel="canonical" href="https://yoursite.com/company-annual-returns-kenya" />
        
        {/* OpenGraph */}
        <meta property="og:title" content="Company Annual Returns Kenya – Complete Filing Guide 2026 & 2027" />
        <meta property="og:description" content="Step-by-step guide to filing company annual returns on eCitizen. Deadlines, penalties, compliance requirements & legal obligations for Kenyan companies." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://yoursite.com/company-annual-returns-kenya" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=630&fit=crop" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Company Annual Returns Kenya – Filing Guide 2026 & 2027" />
        <meta name="twitter:description" content="Complete guide to filing company annual returns in Kenya on eCitizen. Deadlines, penalties, requirements & compliance." />
        <meta name="twitter:image" content="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=630&fit=crop" />
        
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
            "description": "Company compliance and legal services in Kenya"
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
                "name": "Company Annual Returns Kenya",
                "item": "https://yoursite.com/company-annual-returns-kenya"
              }
            ]
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to File Company Annual Returns in Kenya",
            "description": "Step-by-step guide to filing company annual returns on eCitizen in Kenya",
            "step": filingSteps.map(step => ({
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
              <FileText className="w-8 h-8 flex-shrink-0" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">Company Annual Returns & Compliance in Kenya</h1>
            </div>
            <p className="text-blue-100 text-lg max-w-3xl">Complete guide to filing company annual returns on eCitizen. Learn mandatory deadlines, penalties for late filing, compliance requirements, and step-by-step filing instructions for Kenya.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="https://ecitizen.go.ke" target="_blank" rel="noopener noreferrer" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                File Annual Returns
              </a>
              <a href="/company-cr12-and-search-kenya" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
                Check Company Status <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="content-full-width">
        <div className="max-w-6xl mx-auto px-0 sm:px-4 md:px-8 py-12">
            <div className="flex items-start gap-3 mb-4">
              <FileText className="w-8 h-8 flex-shrink-0" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">Company Annual Returns & Compliance in Kenya</h1>
            </div>
            <p className="text-blue-100 text-lg max-w-3xl">Complete guide to filing company annual returns on eCitizen. Learn mandatory deadlines, penalties for late filing, compliance requirements, and step-by-step filing instructions for Kenya.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="https://ecitizen.go.ke" target="_blank" rel="noopener noreferrer" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                File Annual Returns
              </a>
              <a href="/company-cr12-and-search-kenya" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
                Check Company Status <ArrowRight className="w-5 h-5" />
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
              <li>Company Annual Returns</li>
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
                    { id: 'what-are', label: 'What Are Returns' },
                    { id: 'who-must-file', label: 'Who Must File' },
                    { id: 'why-mandatory', label: 'Why Mandatory' },
                    { id: 'when-due', label: 'When Due' },
                    { id: 'documents', label: 'Documents' },
                    { id: 'filing-steps', label: 'Filing Steps' },
                    { id: 'fees', label: 'Fees & Costs' },
                    { id: 'penalties', label: 'Penalties' },
                    { id: 'update-details', label: 'Update Details' },
                    { id: 'check-status', label: 'Check Status' },
                    { id: 'common-mistakes', label: 'Mistakes' },
                    { id: 'not-filing', label: 'Consequences' },
                    { id: 'hire-help', label: 'Get Help' },
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
                    { id: 'what-are', label: 'What Are Annual Returns' },
                    { id: 'who-must-file', label: 'Who Must File' },
                    { id: 'why-mandatory', label: 'Why Mandatory' },
                    { id: 'when-due', label: 'When Returns Are Due' },
                    { id: 'documents', label: 'Documents Required' },
                    { id: 'filing-steps', label: 'Filing Steps' },
                    { id: 'fees', label: 'Fees & Costs' },
                    { id: 'penalties', label: 'Penalties for Late Filing' },
                    { id: 'update-details', label: 'Update Company Details' },
                    { id: 'check-status', label: 'Check Compliance Status' },
                    { id: 'common-mistakes', label: 'Common Mistakes' },
                    { id: 'not-filing', label: 'Not Filing Consequences' },
                    { id: 'hire-help', label: 'When to Hire Help' },
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
                  <Calendar className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Overview: Company Annual Returns & Compliance</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                    <strong>Annual returns</strong> are mandatory yearly filings that every limited company must submit to BRELA (Business Registration and Licensing Authority) showing current directors, shareholders, registered address, and financial summary. This guide explains what annual returns are, when they're due, what happens if you don't file, and complete step-by-step instructions for filing on eCitizen.
                  </p>

                  <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border-l-4 border-blue-600">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-700 mb-1">30 Days</div>
                        <div className="text-xs text-gray-600">Filing Deadline</div>
                        <p className="text-sm text-gray-700 mt-2">After company anniversary</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-700 mb-1">Free-KES 1,000</div>
                        <div className="text-xs text-gray-600">Filing Fee</div>
                        <p className="text-sm text-gray-700 mt-2">On-time filing</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-700 mb-1">KES 50,000+</div>
                        <div className="text-xs text-gray-600">Late Penalties</div>
                        <p className="text-sm text-gray-700 mt-2">Starting 31 days late</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded-lg mb-6">
                    <h4 className="font-bold text-gray-900 mb-2">Key Facts About Annual Returns</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Mandatory Compliance:</strong> All limited companies must file (Companies Act 2015, Sections 350-380)</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Public Record:</strong> Anyone can search your annual returns on BRELA (transparency requirement)</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Penalties Severe:</strong> KES 50,000-100,000+ for late filing, company struck off (dissolved) after 2 years non-filing</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Online Process:</strong> File on eCitizen in 30-60 minutes (no office visit needed)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* What Are Annual Returns */}
              <section id="what-are" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What Are Company Annual Returns?</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Annual returns (officially CR1 form) are official yearly reports filed with BRELA showing the current status of a limited company.</p>

                  <img 
                    src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop"
                    alt="Annual Returns Filing"
                    className="rounded-lg shadow-lg w-full mb-6"
                  />

                  <div className="bg-white border-2 border-gray-200 p-6 rounded-xl mb-6">
                    <h4 className="font-bold text-gray-900 mb-3">Information Included in Annual Returns</h4>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex gap-3">
                        <span className="text-blue-600 font-bold">•</span>
                        <span><strong>Directors:</strong> Names, ID numbers, nationality of all current directors (Companies Act 2015, Section 350)</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-blue-600 font-bold">•</span>
                        <span><strong>Shareholders:</strong> Names, address, number of shares held, shareholding percentage</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-blue-600 font-bold">•</span>
                        <span><strong>Registered Address:</strong> Official company address for legal notices</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-blue-600 font-bold">•</span>
                        <span><strong>Share Capital:</strong> Total issued and authorized share capital</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-blue-600 font-bold">•</span>
                        <span><strong>Financial Summary:</strong> Total income, expenses, profit/loss (if applicable) (Companies Act 2015, Section 424)</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-blue-600 font-bold">•</span>
                        <span><strong>Changes During Year:</strong> Any director resignations, new director appointments, shareholder changes</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-cyan-50 border-l-4 border-cyan-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>Public Document:</strong> Annual returns are public record (Companies Act 2015, Section 370). Anyone can search BRELA and view your company's annual returns. This transparency protects creditors, investors, and business partners.</p>
                  </div>
                </div>
              </section>

              {/* Who Must File */}
              <section id="who-must-file" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Users className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Who Must File Annual Returns?</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Annual returns are mandatory for specific business structures:</p>

                  <div className="bg-white border-2 border-green-200 p-6 rounded-xl mb-6">
                    <h4 className="font-bold text-gray-900 mb-3">✅ Must File Annual Returns</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Private Limited Companies (Ltd):</strong> Most common structure. Every private limited company must file (Companies Act 2015, Section 350)</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Public Limited Companies (PLC):</strong> Larger companies. Additional compliance beyond annual returns (financial audit required)</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Foreign Companies Operating in Kenya:</strong> Branch of international company operating in Kenya must file</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white border-2 border-red-200 p-6 rounded-xl mb-6">
                    <h4 className="font-bold text-gray-900 mb-3">❌ Do NOT File Annual Returns</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2">
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Sole Proprietorships:</strong> File only tax returns with KRA, not annual returns with BRELA</span>
                      </li>
                      <li className="flex gap-2">
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Partnerships:</strong> File tax returns with KRA only, not BRELA compliance returns</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>Not sure what structure you have?</strong> Check BRELA company search (eCitizen). Search your company name. If shown as "Limited Company" or "Limited" = must file annual returns. If "Sole Proprietorship" or "Partnership" = file only with KRA.</p>
                  </div>
                </div>
              </section>

              {/* Why Mandatory */}
              <section id="why-mandatory" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Why Filing Is Mandatory (Legal Requirements)</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Annual returns filing is a core legal obligation under Kenyan company law:</p>

                  <div className="space-y-4 mb-6">
                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">📜 Legal Basis: Companies Act 2015</h4>
                      <p className="text-gray-700 text-sm">Sections 350-380 require all limited companies to file annual returns within 30 days of anniversary. Law created in 2015 (replaced 2005 Act). Still current and strictly enforced (Companies Act 2015, Section 350).</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">🔍 Transparency & Accountability</h4>
                      <p className="text-gray-700 text-sm">Annual returns ensure public can verify: company directors (not fraudsters), ownership structure (for creditors), and company status (active/struck off). Protects customers, suppliers, employees from unlicensed/fraudulent operators (Companies Act 2015, Section 370).</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">🏛️ Government Compliance</h4>
                      <p className="text-gray-700 text-sm">BRELA (government authority) uses annual returns data for: statistics on business registration, compliance monitoring, fraud detection, strike-off of non-compliant companies. Maintained by Ministry of Industrialization, Trade and Enterprise Development.</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">⚖️ Enforcement & Penalties</h4>
                      <p className="text-gray-700 text-sm">Failure to file = severe consequences: fines KES 50,000-100,000+, company struck off (dissolved) after 2 years, personal liability for directors. BRELA actively monitors and enforces compliance (Companies Act 2015, Sections 365, 380).</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* When Due */}
              <section id="when-due" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">When Annual Returns Are Due</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Exact deadline depends on your company's anniversary date:</p>

                  <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6 overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">Filing Period</th>
                          <th className="px-4 py-3 text-left font-semibold">Deadline</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {deadlines.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">{item.period}</td>
                            <td className="px-4 py-3 text-gray-700">{item.deadline}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded-lg mb-6">
                    <h4 className="font-bold text-gray-900 mb-2">📅 How to Find Your Company Anniversary</h4>
                    <p className="text-gray-700 text-sm">Company anniversary = date company was first registered (incorporation date). Check CR12 certificate or BRELA search. Example: Company registered Jan 15, 2023 → anniversary is Jan 15 each year → returns due by Feb 14. First returns may be due within 30 days of incorporation (Companies Act 2015, Section 350).</p>
                  </div>

                  <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>⚠️ Important:</strong> Deadline is exactly 30 days from anniversary. No grace period. Day 31 = penalties start. No extensions possible (Companies Act 2015, Section 350). Mark anniversary date in calendar now!</p>
                  </div>
                </div>
              </section>

              {/* Documents Required */}
              <section id="documents" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Documents Required Before Filing</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Gather these documents before starting your annual returns filing:</p>

                  <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6 overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">Document</th>
                          <th className="px-4 py-3 text-left font-semibold">Required?</th>
                          <th className="px-4 py-3 text-left font-semibold">Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {documentsRequired.map((doc, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900 text-sm">{doc.document}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={doc.required === 'Yes' ? 'text-green-700 font-semibold' : doc.required === 'Sometimes' ? 'text-yellow-700 font-semibold' : 'text-blue-700 font-semibold'}>
                                {doc.required}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-700 text-sm">{doc.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>Tip:</strong> Have everything ready BEFORE starting eCitizen filing. Incomplete filings = errors, amendments needed, delays. File 1 week before deadline (not day 30) to avoid system delays or last-minute issues.</p>
                  </div>
                </div>
              </section>

              {/* Filing Steps */}
              <section id="filing-steps" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Step-by-Step Filing on eCitizen</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Complete guide to filing annual returns online. Takes 30-60 minutes if you have all documents ready:</p>

                  <div className="space-y-4 mb-6">
                    {filingSteps.map((step) => (
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
                    <p className="text-gray-700 text-sm"><strong>Filing Successful?</strong> Email confirmation shows "Annual returns filed successfully". Print/save confirmation. Company compliance current until next anniversary. If no email after 7 days: contact BRELA (info@brela.or.ke or +254 20 2639000).</p>
                  </div>
                </div>
              </section>

              {/* Fees & Costs */}
              <section id="fees" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <DollarSign className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Filing Fees & Government Costs</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-4">Complete breakdown of costs for annual returns filing:</p>

                  <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6 overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">Service</th>
                          <th className="px-4 py-3 text-left font-semibold">Cost</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filingFees.map((fee, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">{fee.service}</td>
                            <td className="px-4 py-3 text-gray-700 font-semibold">{fee.cost}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>Budget Tip:</strong> On-time filing is completely free or minimal cost. Late filing penalties (KES 50,000-100,000+) FAR exceed filing fees. It's much cheaper to file on time. If company turnover under KES 5M and no employees, director can file themselves (saves accountant fees KES 10,000-50,000).</p>
                  </div>
                </div>
              </section>

              {/* Penalties */}
              <section id="penalties" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Penalties for Late Filing</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Penalties escalate severely for late annual returns filings (Companies Act 2015, Section 380):</p>

                  <div className="bg-white border-2 border-red-200 rounded-xl overflow-hidden shadow-sm mb-6 overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-red-600 text-white">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">Late by:</th>
                          <th className="px-4 py-3 text-left font-semibold">Penalty Amount:</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {penalties.map((item, index) => (
                          <tr key={index} className="hover:bg-red-50">
                            <td className="px-4 py-3 font-medium text-gray-900">{item.delay}</td>
                            <td className="px-4 py-3 text-red-700 font-bold">{item.penalty}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg space-y-3">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">🚨 Struck Off Consequence</h4>
                      <p className="text-gray-700 text-sm">If company fails to file returns for 24 months (2+ years), BRELA automatically strikes off company (dissolves it). Company legally ceases to exist. Cannot: operate, sign contracts, access bank accounts, pay employees, engage in business. (Companies Act 2015, Section 365)</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">💰 Total Cost of Late Filing</h4>
                      <p className="text-gray-700 text-sm">Example: 6 months late = KES 1,000 filing fee + KES 100,000 penalty = KES 101,000. Accountant to fix errors = KES 10,000-50,000. Total = KES 111,000-151,000. Compare: on-time filing = Free. NOT WORTH BEING LATE.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Update Details */}
              <section id="update-details" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Building2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How to Update Company Details While Filing</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Annual returns filing is the perfect time to update any company information that changed during the year:</p>

                  <div className="space-y-4 mb-6">
                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">Director Changes During Year</h4>
                      <p className="text-gray-700 text-sm mb-2">While filing annual returns, you can report: new director appointed, old director resigned, director address changed. System asks for dates of changes. Also file CR2 form separately to officially update records (costs KES 500-1,000, takes 7 days).</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">Shareholder Changes During Year</h4>
                      <p className="text-gray-700 text-sm mb-2">New shareholder acquired shares, old shareholder sold. Report in annual returns filing. Also file CR8 form separately to officially update ownership (costs KES 500-1,000, takes 7 days).</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">Registered Address Changed</h4>
                      <p className="text-gray-700 text-sm mb-2">Company moved to new office. Provide new address on annual returns form. Also file separately to update CR12 certificate (proof of address required - lease/utility bill). Takes 7-14 days.</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">Share Capital Increase/Decrease</h4>
                      <p className="text-gray-700 text-sm mb-2">Company issued new shares or reduced capital. Must file special resolution + company gazette notice first. THEN report in annual returns (Companies Act 2015, Section 140-160). Consult lawyer for complex capital changes.</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>Note:</strong> Annual returns filing shows company status AT FILING DATE. Changes mid-year are reported on same form (with dates). Significant changes may also need separate CR2/CR8 forms filed with BRELA (Companies Act 2015, Sections 185-200).</p>
                  </div>
                </div>
              </section>

              {/* Check Status */}
              <section id="check-status" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How to Check Your Company Compliance Status</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Verify your company's filing status anytime online:</p>

                  <div className="bg-white border-2 border-blue-200 p-6 rounded-xl mb-6">
                    <h4 className="font-bold text-gray-900 mb-4">Compliance Checklist</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      {complianceChecks.map((check, index) => (
                        <li key={index} className="flex gap-3">
                          <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span>{check}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">🔍 How to Check on eCitizen</h4>
                    <p className="text-gray-700 text-sm mb-2">1. Go to www.ecitizen.go.ke → Business Search</p>
                    <p className="text-gray-700 text-sm mb-2">2. Type company name exactly</p>
                    <p className="text-gray-700 text-sm mb-2">3. View company details: status (Active/Struck Off), last filed returns, directors, shareholders</p>
                    <p className="text-gray-700 text-sm">4. If status = "Struck Off" = non-compliant. Must restore before can operate (court order required, costs KES 50,000-200,000+)</p>
                  </div>
                </div>
              </section>

              {/* Common Mistakes */}
              <section id="common-mistakes" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <XCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Common Mistakes to Avoid</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Learn from others' mistakes and avoid costly errors:</p>

                  <div className="space-y-3">
                    {commonMistakes.map((item, index) => (
                      <div key={index} className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                        <h4 className="font-bold text-gray-900 mb-1">❌ {item.mistake}</h4>
                        <p className="text-gray-700 text-sm"><strong>Consequence:</strong> {item.consequence}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Not Filing Consequences */}
              <section id="not-filing" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What Happens If You Don't File?</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Failing to file annual returns has serious legal and business consequences:</p>

                  <div className="space-y-4 mb-6">
                    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">📌 Financial Penalties</h4>
                      <p className="text-gray-700 text-sm">KES 50,000-100,000+ in penalties (escalates monthly). Plus interest charges. Total can reach KES 100,000-500,000+ by time company is struck off (Companies Act 2015, Section 380).</p>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">🚨 Automatic Strike-off</h4>
                      <p className="text-gray-700 text-sm">After 24 months (2 years) non-filing, BRELA automatically strikes off company (dissolves). Company legally ceases to exist. Can be restored via court (costs KES 50,000-200,000+ legal fees, takes 1-3 months). (Companies Act 2015, Section 365)</p>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">🏦 Bank Account Frozen</h4>
                      <p className="text-gray-700 text-sm">Banks regularly check company compliance status. If struck off, accounts frozen. Cannot withdraw funds, pay employees, suppliers, or debts. Creates cash crisis and legal liability.</p>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">⚖️ Business Deals Blocked</h4>
                      <p className="text-gray-700 text-sm">Cannot sign contracts, leases, or agreements. Business partners/landlords will search BRELA and see company struck off. No one will deal with dissolved company. Client relationships damaged.</p>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">👨‍⚖️ Director Personal Liability</h4>
                      <p className="text-gray-700 text-sm">Directors personally liable for penalties, fines, and restoring company. Can be sued by creditors/shareholders. Criminal prosecution possible for willful non-compliance (Companies Act 2015, Section 387).</p>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">📋 Government Tenders Blocked</h4>
                      <p className="text-gray-700 text-sm">All government contracts require current company compliance. Struck off companies cannot bid. Eliminates major revenue source for many businesses.</p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>Reality Check:</strong> It costs KES 50-100 to file on time. Cost of not filing: KES 100,000+ penalties + KES 50,000-200,000 restoration + business damage. NOT WORTH THE RISK.</p>
                  </div>
                </div>
              </section>

              {/* Hire Help */}
              <section id="hire-help" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Briefcase className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">When to Hire an Accountant or Lawyer</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">You can file yourself (DIY), but sometimes professional help is worthwhile:</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        DIY Filing (No Professional)
                      </h4>
                      <p className="text-gray-700 text-sm mb-2"><strong>Good for:</strong></p>
                      <ul className="space-y-1 text-gray-700 text-sm">
                        <li>• Small company (sole director, 1-2 shareholders)</li>
                        <li>• No employees</li>
                        <li>• Turnover under KES 5M</li>
                        <li>• No complex ownership structure</li>
                        <li>• Budget-conscious (saves KES 10,000-50,000)</li>
                      </ul>
                    </div>

                    <div className="bg-white border-2 border-green-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        Hire Professional
                      </h4>
                      <p className="text-gray-700 text-sm mb-2"><strong>Recommended for:</strong></p>
                      <ul className="space-y-1 text-gray-700 text-sm">
                        <li>• Large company (multiple directors/shareholders)</li>
                        <li>• Turnover exceeds KES 5M</li>
                        <li>• Has employees</li>
                        <li>• Complex structure (holding company, foreign investment)</li>
                        <li>• Need financial audit</li>
                        <li>• Uncertain about compliance</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>Accountant Costs:</strong> KES 10,000-50,000 per filing (depends on company complexity). Lawyer: KES 15,000-100,000+ (usually for complicated issues like disputes, restoration). Compare cost vs. risk: KES 20,000 accountant is cheap insurance against KES 100,000+ penalties.</p>
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
                <h3 className="text-2xl font-bold mb-4">Time to File Your Annual Returns?</h3>
                <p className="text-blue-100 mb-6 max-w-2xl mx-auto">File on eCitizen today. It takes 30-60 minutes online. Ensure your company stays compliant and avoids penalties.</p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <a href="https://ecitizen.go.ke" target="_blank" rel="noopener noreferrer" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 inline-flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    File on eCitizen
                  </a>
                  <a href="/limited-company-registration-kenya" className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold inline-flex items-center gap-2">
                    Company Registration Guide <ArrowRight className="w-5 h-5" />
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
                  <a href="/company-cr12-and-search-kenya" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    CR12 & Company Search Kenya
                  </a>
                  <a href="/how-to-register-business-kenya" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    How to Register Business Kenya
                  </a>
                  <a href="/kra-pin-for-business-kenya" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    KRA PIN for Business Guide
                  </a>
                  <a href="/closing-or-deregistering-company-kenya" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Closing or Deregistering Company
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

export default CompanyAnnualReturnsKenya;
