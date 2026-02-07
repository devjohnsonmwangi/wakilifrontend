import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, AlertCircle, ArrowRight, FileText, Building2, AlertTriangle, BookOpen, Globe, Shield, BarChart, XCircle } from 'lucide-react';

const CompanyAnnualReturnsAndFilingKenya = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // FAQ data
  const faqs = [
    {
      question: 'What are annual returns exactly?',
      answer: 'Annual returns are official documents companies must file with the Companies Registry showing company status for the past year. Contains: company financial statements (profit/loss, balance sheet), director/shareholder information, company address confirmation, auditor details. Filed using CR12 form (for most companies) or CR13 (for dormant companies). Due within 30 days after accounting year-end. Example: If company accounting year ends December 31 = CR12 due by January 30. Annual returns prove company is active, compliant, and keeps government records current.'
    },
    {
      question: 'Is annual return filing mandatory?',
      answer: 'Yes, absolutely mandatory for all registered companies in Kenya. Legal requirement under Companies Act 2015. Exceptions: Only exempt if company is struck off/dissolved. Non-filing consequences: company name removal from registry (very bad - loses legal status), fines KES 50,000-500,000, directors may face personal liability, cannot operate legally, investors lose confidence. Filing is not optional - it\'s law. Even dormant/inactive companies must file (using CR13 dormant form).'
    },
    {
      question: 'What is CR12 form?',
      answer: 'CR12 is the standard annual return form for active companies in Kenya. Filed with Companies Registry (now eCitizen online). CR12 contains: Company registration number (unique ID), Accounting year-end date, Financial statements summary (profit/loss, assets/liabilities), Director names and addresses, Shareholder information, Company address, Auditor details (if applicable), Director signatures. CR12 different from CR13 (dormant companies). Different from CR14 (strike-off application). CR12 is the main/most common annual return form used by operating companies.'
    },
    {
      question: 'When are annual returns due?',
      answer: 'Annual returns due within 30 days after company accounting year-end. Most common deadlines: If year-end is December 31 → due January 30. If year-end is June 30 → due July 30. If year-end is March 31 → due April 30. Each company chooses own accounting year (can be any 12-month period). Deadline is strict (no grace period). Filing late = penalties. Pro tip: Set reminder 1-2 weeks before deadline. Start preparing 3-4 weeks early (collect documents, prepare financials). File early (avoid last-minute rush).'
    },
    {
      question: 'What if I miss the annual return deadline?',
      answer: 'Missing deadline consequences: After 30 days late: company name placed on default list, After 6 months late: company struck off registry (name removal, loses legal status), Fines: KES 50,000-500,000 (varies), Director personal liability: may face individual legal action, Business impact: can\'t sign contracts, open bank accounts, get permits, attract investors. Can reinstate if: file missing returns + pay penalties + apply for restoration (costly, time-consuming). Better to file on time than deal with strike-off/restoration process. If behind: file immediately (even if late, better than struck off).'
    },
    {
      question: 'What documents do I need to file annual returns?',
      answer: 'Required documents: CR12 form (companies registry template), Financial statements (profit/loss statement, balance sheet), Auditor\'s report (if company turnover over KES 40M or shareholders request), Director identification (copies of IDs), Director addresses (residential/office), Shareholder information (if shareholding changed), Company address confirmation, Bank statement (optional but helpful - shows company activity), Tax compliance certificate (KRA PIN status - sometimes required). For dormant companies: CR13 form + proof of dormancy (no transactions). Collect all documents 3-4 weeks before deadline.'
    },
    {
      question: 'How do I file annual returns online on eCitizen?',
      answer: 'eCitizen online filing process: Go to ecitizen.go.ke, Create/log into account (email, password), Select "Company Registry Services", Choose "Annual Return Filing" or "CR12 Filing", Enter company registration number (unique ID), Fill in company details (address, year-end date, etc.), Upload financial statements (PDF/scans), Upload auditor report (if applicable), Upload director ID copies, Enter director information (names, addresses), Upload payment proof or pay online, Review all information, Submit CR12 form, Receive reference number (save for records), Status updates sent via email (1-5 business days for approval). Online is fastest method (2-5 days processing).'
    },
    {
      question: 'What if company has no financial statements?',
      answer: 'Every company must have financial statements (even if minimal income). If no income/transactions: create nil return (zero profit/loss statement). If small company (turnover under KES 40M): can use simplified financial statements (less detailed). If unable to prepare: hire accountant (costs KES 5,000-30,000 depending on company size). Submitting without financials = incomplete filing = rejected by registry. Must have some form of financial documentation. For truly dormant companies: use CR13 form (different process, simpler documentation). Cannot skip financial statements - registry requires them.'
    },
    {
      question: 'Do sole proprietors need to file annual returns?',
      answer: 'No. Sole proprietors do NOT file annual returns (they\'re individuals, not companies). Sole proprietor obligations: Register business name with county (not companies registry), Get KRA PIN (if income over threshold), File personal income tax annually (KRA, not companies registry), Keep business records (5 years minimum). Companies (limited companies, partnerships) file annual returns. Sole proprietors file tax returns (different process). Confusion: Many sole proprietors mistakenly think they file with companies registry - they don\'t. Annual returns only for registered companies.'
    },
    {
      question: 'What is the difference between CR12 and CR13?',
      answer: 'CR12 (Active Companies): Filed by operating/active companies, Contains full financial statements, Director/shareholder details required, Annual filing within 30 days of year-end, More documentation required. CR13 (Dormant Companies): Filed by inactive companies (no transactions for 12+ months), Simplified documentation (no detailed financials), Fewer details required, Still mandatory (even dormant must file), Simpler process. Choose CR13 only if company truly dormant (no trading, no bank activity). If company active - must file CR12. Filing wrong form = rejected by registry.'
    },
    {
      question: 'What happens if company name is struck off?',
      answer: 'Struck off consequences: Company loses legal status (no longer recognized), Cannot operate business legally, Cannot sign contracts/agreements, Cannot open bank accounts, Cannot sue/be sued, Assets may be seized, Directors held personally liable, Investors\' investment at risk, Damage to business reputation. Recovery process: Apply for restoration (with Companies Registry), File missing annual returns (back payments), Pay penalties/fines, Provide explanation (why struck off), Timeline: 2-6 weeks if straightforward, Costs: KES 10,000-50,000+ (restoration fees + penalties + accountant). Prevention: File on time, every year. Much cheaper/easier than restoration.'
    },
    {
      question: 'Do I need an auditor for annual returns?',
      answer: 'Auditor requirement depends on company size: If turnover under KES 40M: auditor NOT mandatory (can self-file), If turnover over KES 40M: auditor mandatory, If shareholders request: auditor required (even if small company), If public company: auditor mandatory. Benefits of auditor even if not required: Credibility (shows accounts audited/verified), Easier financing (banks prefer audited accounts), Legal protection (reduces director liability), Professional quality (catches errors early). Cost: KES 20,000-100,000+ per year (depends on company complexity). For small companies: consider hiring to save time/ensure accuracy.'
    },
    {
      question: 'Can I file annual returns late but avoid strike-off?',
      answer: 'Partially yes: Filing after 30 days = late filing penalty (fines, interest). Filing within 6 months = still possible to file before strike-off. Filing after 6 months = company already struck off (cannot simply file - must apply for restoration first). Timeline matters: 0-30 days: on-time filing (no penalties). 30-180 days: late filing (penalties apply, still possible to file). 180+ days: company struck off (need restoration). Action: If behind on filing, file immediately (even if late). Penalties less severe than being struck off. If already struck off: apply for restoration (costly, 2-6 week process). Always file - don\'t wait.'
    },
    {
      question: 'How do I correct mistakes in annual returns?',
      answer: 'If mistake discovered after filing: File amended CR12 (corrected version) immediately, Include explanation of error, Submit with supporting documents, Pay correction fee (KES 1,000-5,000 usually), Registry updates records. For minor errors (typo, small number change): amended filing usually accepted. For major errors (wrong financial statements, missing info): may require re-audit/review. Prevention: Double-check before submitting (catch errors early). If caught by registry staff before approval: ask to correct before final approval (easier). Timeline: Amended filings processed in 2-3 days. Cost: Minimal (amendment fee) if minor correction. Always correct errors - shows good compliance.'
    },
    {
      question: 'What is penalty amount for late annual returns?',
      answer: 'Late filing penalties breakdown: Filing 1-30 days late: KES 10,000-50,000 (depending on company size), Filing 30-60 days late: KES 50,000-100,000 + interest, Filing 60+ days: increasing penalties + strike-off risk. Additional: Interest on late payment (usually 20% per annum), Director personal fines (KES 10,000-100,000), Strike-off fees if restoration needed (KES 20,000-100,000+). Example: Company 60 days late filing: KES 100,000 penalty + KES 50,000+ interest + risk of strike-off = minimum KES 150,000+. Prevention: Filing on time costs zero and avoids all penalties. If late: file immediately (penalties increase with delay).'
    }
  ];

  // Annual return requirements table
  const annualReturnRequirements = [
    {
      item: 'CR12 Form',
      who: 'Active companies',
      deadline: '30 days after year-end',
      required: 'Yes'
    },
    {
      item: 'Financial Statements',
      who: 'All companies',
      deadline: 'At filing time',
      required: 'Yes'
    },
    {
      item: 'Auditor Report',
      who: 'Companies over KES 40M turnover',
      deadline: 'If applicable',
      required: 'Conditional'
    },
    {
      item: 'Director Information',
      who: 'All companies',
      deadline: 'Current information',
      required: 'Yes'
    },
    {
      item: 'Shareholder Details',
      who: 'If shareholding changed',
      deadline: 'Current info',
      required: 'Conditional'
    },
    {
      item: 'Company Address',
      who: 'All companies',
      deadline: 'Current address',
      required: 'Yes'
    },
    {
      item: 'Accounting Year-End Date',
      who: 'All companies',
      deadline: 'Confirmation only',
      required: 'Yes'
    },
    {
      item: 'KRA Tax Compliance',
      who: 'If required by registry',
      deadline: 'Varies',
      required: 'Sometimes'
    },
    {
      item: 'Bank Details',
      who: 'Recommended (not mandatory)',
      deadline: 'Optional',
      required: 'No'
    },
    {
      item: 'Previous Year Filed Returns',
      who: 'Continuity check',
      deadline: 'On record',
      required: 'Yes'
    }
  ];

  // Filing steps
  const filingSteps = [
    {
      number: 1,
      title: 'Determine Your Company Accounting Year-End Date',
      description: 'Confirm when your company accounting year ends (should be on company registration documents or incorporation certificate). Most common year-ends: December 31, June 30, March 31, or September 30. You choose (any 12-month period is valid). Mark on calendar. Example: If December 31 year-end = annual returns due by January 30. This determines your filing deadline every year.'
    },
    {
      number: 2,
      title: 'Gather All Required Documents',
      description: 'Collect necessary documents 3-4 weeks before deadline: Profit/loss statement (P&L - shows revenue, expenses, profit), Balance sheet (shows assets, liabilities, equity as of year-end), Director identification (copies of IDs, all directors), Director addresses (current residential/office addresses), Shareholder information (if shareholding changed), Auditor report (if turnover over KES 40M or requested), Company address confirmation (current business location), Bank statement sample (shows company activity - optional but helpful). Organize documents in folder for easy access.'
    },
    {
      number: 3,
      title: 'Prepare Financial Statements',
      description: 'Create accurate financial statements showing: Revenue (total income for year), Expenses (operating costs, salaries, rent, etc.), Net profit/loss (revenue minus expenses), Assets (money, equipment, property owned), Liabilities (money owed, loans), Equity (owner\'s stake in company). For small companies: simplified format acceptable. For large companies or if required: full audit by accountant. Financial statements should match: Bank records, KRA records (if filed), Company bookkeeping. Accuracy is critical - auditors and registry verify details.'
    },
    {
      number: 4,
      title: 'Obtain Auditor Report (If Required)',
      description: 'If company turnover exceeds KES 40M or shareholders request audit: Hire certified auditor (list available from ICPAK - Institute of Certified Public Accountants), Provide financial statements + supporting documents to auditor, Auditor reviews and verifies accuracy, Receive auditor\'s report (usually 1-2 weeks), Cost: KES 20,000-100,000+ depending on company complexity. If under KES 40M and no shareholder request: auditor optional (but still beneficial). For companies without auditor: company director/accountant signs off on financials.'
    },
    {
      number: 5,
      title: 'Verify All Director & Shareholder Information',
      description: 'Confirm all current information is accurate: Director names (exactly as per ID), Director addresses (current residential or office), Director ID numbers, Changes: If director resigned/new director appointed, update details immediately, If shareholders changed, update shareholding %, Ensure all signatories (people who sign CR12) are identified. This information must match Companies Registry records. If mismatch = filing rejected = delays. Double-check before submission.'
    },
    {
      number: 6,
      title: 'Create eCitizen Account (If First-Time Filer)',
      description: 'Go to ecitizen.go.ke, Click "Register" (if new user), Enter email address, Create password (strong: 8+ characters, mix of letters/numbers), Accept terms and conditions, Verify email (click link in confirmation email), Account created and ready. For subsequent years: just log in with email/password. eCitizen account saves your company details (no need to re-enter every year). Set password reminder (don\'t forget password).'
    },
    {
      number: 7,
      title: 'Log Into eCitizen & Select CR12 Annual Return Filing',
      description: 'Log into ecitizen.go.ke using email/password, Navigate to "Company Registry Services", Select "Annual Return Filing" or "File CR12", Enter company registration number (unique ID from incorporation certificate), System retrieves company details, Select tax year (year just ended), Review pre-filled information (update if changed), Begin form entry.'
    },
    {
      number: 8,
      title: 'Complete CR12 Form with Accurate Information',
      description: 'Fill CR12 form sections: Company Details (name, registration number, year-end date), Financial Summary (total revenue, total expenses, net profit/loss), Directors (names, addresses, ID numbers, resignation/appointment dates if applicable), Shareholders (shareholding percentages if changed), Auditor information (name, firm, contact - if applicable), Company address (current registered office), Sign declarations (directors certifying information is accurate). Double-check every field - errors cause rejections/delays. Form typically takes 30-60 minutes to complete accurately.'
    },
    {
      number: 9,
      title: 'Upload Supporting Documents',
      description: 'Scan and upload required documents: Financial statements (PDF or JPG - high quality, legible), Auditor report (if applicable - PDF), Director ID copies (front + back, all directors), Director address proof (if new directors - utility bill or letter), Shareholder agreement (if shareholding changed - optional but helpful), Any corrections/explanations (if updating prior year errors). File sizes usually 2-20MB per document. Ensure scans are clear and readable (blurry documents rejected).'
    },
    {
      number: 10,
      title: 'Review CR12 Before Submission',
      description: 'Final review checklist: All sections completed (no blanks), Information accurate (names, addresses, numbers), Financial figures match documents, Director signatures obtained (digital or scanned), All supporting documents uploaded, Contact information correct (phone, email), Payment method selected (M-Pesa, card, bank transfer). Identify any missing items and add before submitting. Once submitted = harder to edit. Better to review thoroughly before submission.'
    },
    {
      number: 11,
      title: 'Submit CR12 Form & Pay Filing Fee',
      description: 'Review all information one final time, Click "Submit" button, Confirm submission (system may ask for confirmation), Online payment options: M-Pesa (for amounts under certain limit), Bank card (Visa/Mastercard), Bank transfer (for larger amounts), Pay the filing fee (typically KES 2,000-5,000 depending on company type), Receive reference/tracking number (save this number), Email confirmation sent to registered email address. Fee payment completes the submission process.'
    },
    {
      number: 12,
      title: 'Track Filing Status & Receive Approval',
      description: 'Companies Registry processes CR12 (typically 2-5 business days): Check status on eCitizen portal (using reference number), Status updates sent via email (in-progress, approved, issues), If registry requests additional information: respond within 5-7 days (or filing rejected), Once approved: certificate of filing issued (digital PDF or physical), Receipt shows: filing date, reference number, year covered, company name. Keep certificate (proof of compliance). Processing timeline: 2-5 days if complete, 5-10 days if minor issues, Can take longer if complex/incomplete.'
    }
  ];

  // Penalties table
  const penaltiesTable = [
    {
      timeframe: '1-30 days late',
      penalty: 'KES 10,000-50,000',
      interest: '5-10% on late amount',
      consequence: 'Placed on default list'
    },
    {
      timeframe: '30-60 days late',
      penalty: 'KES 50,000-100,000',
      interest: '10-20% per annum',
      consequence: 'Name on default list, strike-off warning'
    },
    {
      timeframe: '60-180 days late',
      penalty: 'KES 100,000-200,000',
      interest: '20% per annum cumulative',
      consequence: 'Company removal imminent'
    },
    {
      timeframe: '180+ days late',
      penalty: 'Automatic strike-off',
      interest: 'N/A - company struck off',
      consequence: 'Company name removed, loses legal status'
    },
    {
      timeframe: 'Non-filing (no filing ever)',
      penalty: 'Variable - can exceed KES 500,000',
      interest: 'Continues accumulating',
      consequence: 'Immediate strike-off possible, director liability'
    }
  ];

  // Common mistakes
  const commonMistakes = [
    { mistake: 'Filing after deadline', fix: 'File immediately even if late. Penalties increase with delay. After 180 days = struck off.' },
    { mistake: 'Incomplete financial statements', fix: 'Ensure profit/loss and balance sheet both included. Cannot submit partial financials.' },
    { mistake: 'Director information outdated', fix: 'Update if directors changed. Cannot use stale director details from previous year.' },
    { mistake: 'Wrong company registration number', fix: 'Verify number matches incorporation certificate. System rejects if mismatch.' },
    { mistake: 'Auditor report missing (when required)', fix: 'If turnover over KES 40M, audit mandatory. Cannot file without auditor report.' },
    { mistake: 'Illegible document scans', fix: 'Rescan at higher resolution (300 DPI). Blurry documents rejected by registry.' },
    { mistake: 'Shareholder info not updated', fix: 'If shareholding changed, update percentages. Old shareholder data causes rejection.' },
    { mistake: 'Filing for wrong year', fix: 'Select correct tax year (year just ended). Filing for wrong year = late filing.' }
  ];

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'what-are', 'legal-requirement', 'who-must-file', 'documents-required', 'filing-process', 'cr12-online', 'deadlines-penalties', 'correct-mistakes', 'dormant-companies', 'kra-link', 'hire-professionals', 'mistakes-to-avoid', 'faqs'];
      
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
        <title>Company Annual Returns Kenya – CR12 Filing & Compliance Guide</title>
        <meta name="description" content="Complete guide to filing company annual returns in Kenya. Step-by-step CR12 filing on eCitizen, deadlines, penalties, and compliance requirements for registered companies." />
        <link rel="canonical" href="https://yoursite.com/company-annual-returns-and-filing-kenya" />
        
        {/* OpenGraph */}
        <meta property="og:title" content="Company Annual Returns Kenya – CR12 Filing Guide 2026" />
        <meta property="og:description" content="File CR12 annual returns for your company in Kenya. Complete guide with step-by-step instructions, deadlines, penalties, and compliance checklist." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://yoursite.com/company-annual-returns-and-filing-kenya" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=630&fit=crop" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Company Annual Returns Kenya – CR12 Filing & Compliance 2026" />
        <meta name="twitter:description" content="Step-by-step guide to filing CR12 annual returns. Includes deadlines, penalties, documents needed, and compliance requirements for Kenyan companies." />
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
            "description": "Company annual returns and CR12 filing guidance in Kenya"
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
                "name": "Company Annual Returns",
                "item": "https://yoursite.com/company-annual-returns-and-filing-kenya"
              }
            ]
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to File Company Annual Returns in Kenya",
            "description": "Step-by-step guide to filing CR12 annual returns on eCitizen",
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
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">Company Annual Returns in Kenya – CR12 Filing & Compliance Guide</h1>
            </div>
            <p className="text-blue-100 text-lg max-w-3xl">Complete step-by-step guide to filing CR12 annual returns. Learn deadlines, penalties, documents needed, and how to stay compliant with Companies Registry requirements.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="https://ecitizen.go.ke" target="_blank" rel="noopener noreferrer" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                File on eCitizen
              </a>
              <a href="/limited-company-registration-kenya" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
                Company Registration <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:block sticky top-0 bg-white shadow-md z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex gap-2 overflow-x-auto">
              {['overview', 'what-are', 'legal-requirement', 'who-must-file', 'documents-required', 'filing-process', 'cr12-online', 'deadlines-penalties', 'correct-mistakes', 'dormant-companies', 'kra-link', 'hire-professionals', 'mistakes-to-avoid', 'faqs'].map((section) => (
                <button
                  key={section}
                  onClick={() => {
                    const element = document.getElementById(section);
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors text-sm ${
                    activeSection === section
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1).replace(/-/g, ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden sticky top-0 bg-white shadow-md z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {['overview', 'what-are', 'documents-required', 'filing-process', 'deadlines-penalties', 'faqs'].map((section) => (
                <button
                  key={section}
                  onClick={() => {
                    const element = document.getElementById(section);
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors text-sm ${
                    activeSection === section
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {section === 'overview' ? 'Overview' : section === 'what-are' ? 'What Are' : section === 'documents-required' ? 'Docs' : section === 'filing-process' ? 'Filing' : section === 'deadlines-penalties' ? 'Penalties' : 'FAQs'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Overview */}
          <section id="overview" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What Are Company Annual Returns?</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Company annual returns are mandatory documents companies must file with Kenya's Companies Registry proving the company is active and compliant. Think of them as the company's annual "check-in" with the government showing: financial status, management details, operational status.</p>

              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop"
                alt="Company annual returns and CR12 form filing"
                className="rounded-lg shadow-lg w-full mb-6"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">✓ What's Included</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Financial statements (profit/loss, balance sheet)</li>
                    <li>• Director names and addresses</li>
                    <li>• Shareholder information</li>
                    <li>• Company address confirmation</li>
                    <li>• Auditor details (if applicable)</li>
                    <li>• Year-end accounting date</li>
                  </ul>
                </div>

                <div className="bg-green-50 border-l-4 border-green-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">📋 Key Documents</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• CR12 form (most common)</li>
                    <li>• CR13 form (dormant companies)</li>
                    <li>• Financial statements</li>
                    <li>• Auditor report (if required)</li>
                    <li>• Director identification</li>
                    <li>• Company registration number</li>
                  </ul>
                </div>
              </div>

              <p className="text-gray-700 mb-4"><strong>Key fact:</strong> Annual returns are filed using CR12 form (for active companies) or CR13 (for dormant companies). Due within 30 days after company's accounting year-end. Non-filing results in company name removal from registry and heavy penalties.</p>
            </div>
          </section>

          {/* What Are Annual Returns */}
          <section id="what-are" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Understanding Annual Returns & CR12 Forms</h2>
            </div>

            <div className="prose max-w-none">
              <div className="space-y-4 mb-6">
                <div className="bg-white border-2 border-gray-200 p-5 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-2">CR12 Form (Active Companies)</h4>
                  <p className="text-gray-700 text-sm">The standard annual return form for operating/active companies. Contains full financial statements, director information, shareholder details, auditor information. Filed annually within 30 days of accounting year-end. Most companies use CR12. Cost to file: KES 2,000-5,000 depending on company structure.</p>
                </div>

                <div className="bg-white border-2 border-gray-200 p-5 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-2">CR13 Form (Dormant Companies)</h4>
                  <p className="text-gray-700 text-sm">Simplified form for inactive/dormant companies (no transactions 12+ months). Fewer requirements than CR12. Still mandatory filing (even dormant must file). Simplified documentation. Easier/faster process. Use CR13 only if company truly dormant (no trading, no bank activity).</p>
                </div>

                <div className="bg-white border-2 border-gray-200 p-5 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-2">Financial Statements Required</h4>
                  <p className="text-gray-700 text-sm">Two documents needed: (1) Profit & Loss Statement (income, expenses, profit), (2) Balance Sheet (assets, liabilities, equity). For small companies: simplified format acceptable. For large companies or audited: detailed statements required. Statements must be accurate and match company records/KRA records. False/misleading statements = fraud (serious penalty).</p>
                </div>

                <div className="bg-white border-2 border-gray-200 p-5 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-2">Director Information Updates</h4>
                  <p className="text-gray-700 text-sm">CR12 requires current director details: names (exact as per ID), addresses (residential or office), ID numbers, appointment/resignation dates (if changed). Must match Companies Registry records. If mismatch = filing rejected. If director changed: update immediately + include in CR12. Cannot use outdated director info from previous year.</p>
                </div>

                <div className="bg-white border-2 border-gray-200 p-5 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-2">Shareholder Information</h4>
                  <p className="text-gray-700 text-sm">Include shareholder details if shareholding changed during year: Names of shareholders, Shareholding percentages (must add up to 100%), Changes in ownership (new shareholders, departures), Share transfers. If shareholding unchanged from prior year: may not need full resubmission (confirm with registry). Any major shareholding change must be reported.</p>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg">
                <p className="text-gray-700 text-sm"><strong>Bottom line:</strong> Annual returns prove company is legitimate, compliant, and active. Non-filing = company struck off registry (very bad). Filing is mandatory, simple process, and takes about 1 hour on eCitizen.</p>
              </div>
            </div>
          </section>

          {/* Legal Requirement */}
          <section id="legal-requirement" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Legal Requirement Under Companies Act 2015</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Annual return filing is mandatory under Kenya's Companies Act 2015, Section 395. Every registered company MUST file within 30 days of accounting year-end. No exceptions. No grace periods.</p>

              <div className="space-y-3 mb-6">
                <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">📜 Legal Requirement</h4>
                  <p className="text-gray-700 text-sm">Companies Act 2015, Section 395 states: Every company must file annual returns within 30 days after end of its accounting reference period. Non-compliance = breach of law. Enforced by Companies Registry + Registrar.</p>
                </div>

                <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">⚖️ Consequences of Non-Filing</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Penalties: KES 50,000-500,000 (depending on delay)</li>
                    <li>• Strike-off: Company name removed after 180 days late</li>
                    <li>• Director liability: Personal fines/legal action against directors</li>
                    <li>• Business impact: Cannot operate legally, sign contracts, open bank accounts</li>
                    <li>• Restoration costs: If struck off, costs KES 20,000-100,000+ to restore</li>
                  </ul>
                </div>

                <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">🚨 What Is Strike-Off</h4>
                  <p className="text-gray-700 text-sm">Strike-off means company name is permanently removed from Companies Registry. Company loses legal status, cannot operate, cannot sign contracts, investors lose protection. Recovery process is expensive/time-consuming (restoration application + back payments + penalties). Prevention: File on time, every year.</p>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg">
                <p className="text-gray-700 text-sm"><strong>Key takeaway:</strong> Filing is law. Non-filing has serious legal/business consequences. Filing is easy and inexpensive (compared to penalties/restoration). Always file on time.</p>
              </div>
            </div>
          </section>

          {/* Who Must File */}
          <section id="who-must-file" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <Building2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Who Must File Annual Returns?</h2>
            </div>

            <div className="prose max-w-none">
              <div className="space-y-3 mb-6">
                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">✓ Limited Companies (Must File)</h4>
                  <p className="text-gray-700 text-sm">All registered limited companies MUST file annual returns. Whether company is profitable, loss-making, active, or dormant - filing is mandatory. Filing deadline: 30 days after accounting year-end. Form: CR12 (active) or CR13 (dormant).</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">✓ Holding Companies (Must File)</h4>
                  <p className="text-gray-700 text-sm">Parent/holding companies must file annual returns. Even if only holding shares in subsidiary. Financial statements show: investments in subsidiaries, dividend income, asset values. Same deadline/process as regular companies.</p>
                </div>

                <div className="bg-white border-l-4 border-blue-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">✓ Dormant Companies (Must File)</h4>
                  <p className="text-gray-700 text-sm">Dormant companies (no transactions 12+ months) must file using CR13 form. Still mandatory even if inactive. Filing shows company status (dormant, not struck off). If no filing = assumed defunct = struck off. Companies can be dormant for years legally IF they file CR13 annually.</p>
                </div>

                <div className="bg-white border-l-4 border-blue-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">✓ Public Companies (Must File)</h4>
                  <p className="text-gray-700 text-sm">Public companies have stricter requirements: audited financial statements mandatory, public financial reporting, additional regulatory filings. Annual returns due same 30-day deadline. Penalties more severe for public companies (as they affect public investors).</p>
                </div>

                <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">✗ Sole Proprietors (Do NOT File)</h4>
                  <p className="text-gray-700 text-sm">Sole proprietors do NOT file annual returns (not a registered company). Sole proprietors file personal income tax (different process). Companies registry annual returns are for companies only, not individuals.</p>
                </div>

                <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">✗ Partnerships (Do NOT File)</h4>
                  <p className="text-gray-700 text-sm">Regular partnerships do not file with Companies Registry (partnerships are not registered). Limited Partnerships (LLP) DO file (they are registered entities). If you have LLP = file annual returns. If regular partnership = file with KRA tax office, not companies registry.</p>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg">
                <p className="text-gray-700 text-sm"><strong>Quick rule:</strong> If company is registered with Companies Registry (has CR number) = must file annual returns. Period.</p>
              </div>
            </div>
          </section>

          {/* Documents Required */}
          <section id="documents-required" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Documents Required for Annual Return Filing</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Gather these documents before filing. Organize 3-4 weeks before deadline:</p>

              <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto mb-6">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Document</th>
                      <th className="px-4 py-3 text-left font-semibold">Required For</th>
                      <th className="px-4 py-3 text-left font-semibold">Mandatory?</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {annualReturnRequirements.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                        <td className="px-4 py-3 font-semibold text-gray-900 text-sm">{item.item}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.who}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm"><span className={`px-2 py-1 rounded text-xs font-semibold ${item.required === 'Yes' ? 'bg-green-100 text-green-800' : item.required === 'Conditional' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>{item.required}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-3 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Financial Statements (Most Critical)</h4>
                  <p className="text-gray-700 text-sm">Profit/Loss Statement: shows revenue, expenses, net profit/loss for year. Balance Sheet: shows assets, liabilities, equity as of year-end. Both must be present + accurate. Statements should match: company books, bank records, KRA records (if filed). If inaccurate = filing rejected or penalties.</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Auditor Report (If Required)</h4>
                  <p className="text-gray-700 text-sm">Required if: company turnover exceeds KES 40M annually, shareholders request audit, public company. Optional if: below KES 40M + no shareholder request. Auditor verifies financial statements accuracy. Professional review reduces risk. Cost: KES 20,000-100,000+ depending on company size.</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Director Identification</h4>
                  <p className="text-gray-700 text-sm">Copies of ID (front + back) for ALL current directors. Names must match ID exactly. Addresses must be current. If director changed: include new director ID + resignation/appointment dates. Registry cross-checks director info against records.</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Company Registration Details</h4>
                  <p className="text-gray-700 text-sm">Company name (exactly as registered), Company registration number (unique ID), Accounting year-end date, Current company address (physical, not P.O. box), Contact details (phone, email). Verify all details match incorporation certificate/registry records.</p>
                </div>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-600 p-4 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">📋 Preparation Tips</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Scan documents at high resolution (300 DPI)</li>
                  <li>• Use PDF or JPG format</li>
                  <li>• Ensure all text legible (blurry documents rejected)</li>
                  <li>• File size: 2-20MB per document usually</li>
                  <li>• Double-check before uploading (errors cause rejection)</li>
                  <li>• Collect documents 3-4 weeks before deadline</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Filing Process */}
          <section id="filing-process" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <ArrowRight className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Step-by-Step Annual Return Filing Process</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Complete step-by-step process for filing annual returns via eCitizen:</p>

              <div className="space-y-4">
                {filingSteps.map((step) => (
                  <div key={step.number} className="bg-white border-2 border-gray-200 p-5 rounded-xl hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold">
                          {step.number}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">{step.title}</h4>
                        <p className="text-gray-700 text-sm">{step.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-lg mt-6">
                <h4 className="font-bold text-gray-900 mb-2">💡 Pro Tips for Fast Filing</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• File on weekday (avoid weekends - slower processing)</li>
                  <li>• Have all documents scanned before starting</li>
                  <li>• Use same email/phone for consistency</li>
                  <li>• Keep reference number (for tracking)</li>
                  <li>• Monitor email for registry requests</li>
                  <li>• File early (avoid year-end rush)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* CR12 Online */}
          <section id="cr12-online" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <Globe className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Detailed CR12 Online Filing Instructions on eCitizen</h2>
            </div>

            <div className="prose max-w-none">
              <div className="space-y-4 mb-6">
                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Step 1: Access eCitizen</h4>
                  <p className="text-gray-700 text-sm">Open browser, go to ecitizen.go.ke, create account or log in (email + password). If new user: register, verify email (click confirmation link), confirm phone number. Takes 5-10 minutes first time.</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Step 2: Select Annual Return Service</h4>
                  <p className="text-gray-700 text-sm">Navigate to "Company Registry Services" menu, Select "Annual Return Filing" or "File CR12", System displays form template. Some counties may have slightly different navigation (look for "company" or "registry" services).</p>
                </div>

                <div className="bg-white border-l-4 border-blue-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Step 3: Enter Company Details</h4>
                  <p className="text-gray-700 text-sm">Input company registration number (from incorporation certificate), System retrieves company record, Confirm company name (must match registry), Confirm accounting year-end date, Enter current company address (update if changed). System shows last filing (for reference).</p>
                </div>

                <div className="bg-white border-l-4 border-blue-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Step 4: Fill Financial Information</h4>
                  <p className="text-gray-700 text-sm">Enter financial summary: Total revenue (for year), Total expenses (for year), Net profit/loss (revenue minus expenses), Total assets, Total liabilities, Retained earnings/equity. These should match financial statements exactly. Even small discrepancies cause rejection.</p>
                </div>

                <div className="bg-white border-l-4 border-blue-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Step 5: Enter Director Information</h4>
                  <p className="text-gray-700 text-sm">List all current directors: Name (exact as per ID), ID number, Address (residential or office), Appointment date (if new director), Resignation date (if director left). If director changed during year: include transition dates. If no changes: confirm existing directors.</p>
                </div>

                <div className="bg-white border-l-4 border-blue-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Step 6: Upload Supporting Documents</h4>
                  <p className="text-gray-700 text-sm">Upload scanned files: Financial statements (PDF), Auditor report (if applicable), Director ID copies, Any supporting documentation (marked pages, amendments). System accepts PDF, JPG, PNG. File must be legible (high resolution). Total upload size usually 20-50MB limit.</p>
                </div>

                <div className="bg-white border-l-4 border-blue-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Step 7: Review & Confirm Information</h4>
                  <p className="text-gray-700 text-sm">System displays summary for final review: All fields filled correctly, All documents uploaded, No obvious errors. Review carefully. Once submitted, harder to edit. Check especially: Company details, Financial figures, Director information, Document uploads.</p>
                </div>

                <div className="bg-white border-l-4 border-blue-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Step 8: Select Payment Method</h4>
                  <p className="text-gray-700 text-sm">Choose payment: M-Pesa (quick, instant), Card (Visa/Mastercard), Bank transfer (for large amounts). System generates payment prompt. Complete payment (usually 2-5 seconds). Keep receipt/reference number.</p>
                </div>

                <div className="bg-white border-l-4 border-blue-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Step 9: Submit & Receive Reference</h4>
                  <p className="text-gray-700 text-sm">Click "Submit" button (final confirmation). System generates reference/tracking number (save this). Email confirmation sent (check inbox + spam folder). Status shows "In Progress" (processing). Typical processing: 2-5 business days if complete.</p>
                </div>

                <div className="bg-white border-l-4 border-blue-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Step 10: Track Status & Receive Approval</h4>
                  <p className="text-gray-700 text-sm">Log back into eCitizen, Enter reference number to check status, Possible statuses: "In Review" (staff processing), "Approved" (filed successfully), "Rejected" (requires corrections), "Need Info" (additional docs requested). Monitor email for updates. If approved: certificate issued (download PDF). If rejected: response explains what's needed.</p>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg">
                <p className="text-gray-700 text-sm"><strong>Total timeline:</strong> Submission to approval: 2-5 days (if documents complete). If corrections needed: add 5-7 days more. Filing from start to finish: 30-60 minutes (including document preparation).</p>
              </div>
            </div>
          </section>

          {/* Deadlines & Penalties */}
          <section id="deadlines-penalties" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Deadlines & Penalties for Late Filing</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Filing deadlines are strict. Non-compliance has escalating penalties:</p>

              <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto mb-6">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Filing Timeframe</th>
                      <th className="px-4 py-3 text-left font-semibold">Penalty Amount</th>
                      <th className="px-4 py-3 text-left font-semibold">Additional Interest</th>
                      <th className="px-4 py-3 text-left font-semibold">Consequence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {penaltiesTable.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 font-medium text-gray-900 text-sm">{item.timeframe}</td>
                        <td className="px-4 py-3 text-red-700 font-bold text-sm">{item.penalty}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.interest}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.consequence}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">🚨 Critical: 180-Day Deadline</h4>
                  <p className="text-gray-700 text-sm">After 180 days (6 months) of non-filing: Company is automatically struck off registry. Name removed. Loses legal status. Very difficult/expensive to restore (restoration process takes 2-6 weeks + costs KES 20,000-100,000+). Before 180 days = can still file + pay penalties. After 180 days = must apply for restoration first (much worse).</p>
                </div>

                <div className="bg-red-50 border-l-4 border-red-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">💰 Example Penalty Calculation</h4>
                  <p className="text-gray-700 text-sm">Company files 90 days late: Base penalty (for 60+ days late): KES 100,000-200,000. Plus interest (20% per annum on late amount): KES 50,000. Director personal fines: potentially KES 10,000-50,000. Total penalty: KES 160,000-300,000+. Filing on time (zero cost) vs. late filing (potentially KES 300,000+) = massive difference.</p>
                </div>

                <div className="bg-orange-50 border-l-4 border-orange-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">⏰ Action If Behind on Filing</h4>
                  <p className="text-gray-700 text-sm">If you haven't filed: File immediately (today if possible). Penalties increase with delay. Even filing 6 months late is better than being struck off. Gather documents quickly. Use expedited filing if available. Contact accountant/professional to help. Cost of professional help (KES 5,000-20,000) much less than penalties.</p>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-606 p-5 rounded-lg">
                <p className="text-gray-700 text-sm"><strong>Prevention is best:</strong> Mark deadline in calendar. Start preparing 3-4 weeks early. File 1-2 weeks before deadline (avoid last-minute issues). Set phone reminder (1 week before + day before).</p>
              </div>
            </div>
          </section>

          {/* Correct Mistakes */}
          <section id="correct-mistakes" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <XCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How to Correct Mistakes in Annual Returns</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">If errors discovered after filing, amend the return:</p>

              <div className="space-y-4">
                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Minor Errors (Typos, Small Numbers)</h4>
                  <p className="text-gray-700 text-sm">File amended CR12 with corrections, Include note explaining error, Submit via eCitizen, Pay amendment fee (KES 1,000-3,000 usually), Registry approves + updates records (2-3 days). Better to fix errors early than leave them on record.</p>
                </div>

                <div className="bg-white border-l-4 border-blue-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Major Errors (Financial Statement Corrections)</h4>
                  <p className="text-gray-700 text-sm">If major errors (revenue/expenses significantly wrong), Submit amended financial statements + auditor review (if applicable), File amended CR12, Explain reason for amendment (calculation error, prior period adjustment, etc.). Registry may: approve quickly, request additional explanation, or reject if too many changes.</p>
                </div>

                <div className="bg-white border-l-4 border-blue-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Director/Shareholder Changes (Mid-Year)</h4>
                  <p className="text-gray-700 text-sm">If director/shareholder changes occurred during year but not included in filing: File amended return with current information + dates of changes, Registry updates records. Important for: dividend payments, succession planning, liability issues.</p>
                </div>

                <div className="bg-white border-l-4 border-blue-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Prevention: Double-Check Before Submitting</h4>
                  <p className="text-gray-700 text-sm">Most effective: catch errors BEFORE filing. Review form multiple times before submission. Have second person review (catches errors you miss). Verify numbers against documents. Check director details match IDs exactly. Verify company name/address against registration. Prevention costs: zero. Amendment cost: KES 1,000-3,000. Problem cost (if causes issues): much higher.</p>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-606 p-5 rounded-lg">
                <p className="text-gray-700 text-sm"><strong>Key point:</strong> Amended returns are normal (happens regularly). Registry accepts them easily. Just file amendment + pay small fee. Don't ignore errors - fix them.</p>
              </div>
            </div>
          </section>

          {/* Dormant Companies */}
          <section id="dormant-companies" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <Building2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How to File for Dormant or Inactive Companies</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Dormant companies (inactive 12+ months) file using CR13 form instead of CR12:</p>

              <div className="space-y-4 mb-6">
                <div className="bg-white border-2 border-gray-200 p-5 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-2">What is "Dormant" Status?</h4>
                  <p className="text-gray-700 text-sm">Company is dormant if: No trading/business activities for 12+ months, No financial transactions, No bank deposits/withdrawals, No employee salaries paid, No significant asset changes. Dormant companies still exist legally + can reactivate. Filing CR13 annually keeps company on record (not struck off). Important for: future reactivation, asset protection, ownership continuity.</p>
                </div>

                <div className="bg-white border-2 border-gray-200 p-5 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-2">CR13 vs CR12 Differences</h4>
                  <div className="space-y-2">
                    <p className="text-gray-700 text-sm"><strong>CR12 (Active):</strong> Full financial statements required, Director updates required, Auditor report if applicable, Complex documentation</p>
                    <p className="text-gray-700 text-sm"><strong>CR13 (Dormant):</strong> Minimal documentation, No detailed financials, Simple statement (no profit/loss needed), Proof of dormancy only</p>
                  </div>
                </div>

                <div className="bg-white border-2 border-gray-200 p-5 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-2">How to File CR13</h4>
                  <p className="text-gray-700 text-sm">Process similar to CR12: Go to eCitizen.go.ke, Select "Dormant Return Filing" or "CR13", Enter company details, State period of dormancy (12+ months), Upload dormancy proof (bank statement showing no activity, or declaration), Pay filing fee (usually KES 1,000-2,000, cheaper than CR12), Submit + wait for approval (2-3 days). Easier + faster than CR12.</p>
                </div>

                <div className="bg-white border-2 border-gray-200 p-5 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-2">Reactivating a Dormant Company</h4>
                  <p className="text-gray-700 text-sm">If company was dormant but now reactivating: File CR12 (not CR13) from now on, Update director/shareholder info (if changed during dormancy), Restart financial documentation, Settle any accumulated tax/compliance issues, Update KRA (if change in tax status). Process: Simple if no serious issues, Can take 2-4 weeks if catching up on back filings/taxes.</p>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-606 p-5 rounded-lg">
                <p className="text-gray-700 text-sm"><strong>Important:</strong> Filing CR13 (dormant) is still mandatory. Cannot simply ignore filing. Even dormant companies must file annually or risk strike-off. CR13 annual filing keeps company active on registry for future use.</p>
              </div>
            </div>
          </section>

          {/* KRA Link */}
          <section id="kra-link" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <BarChart className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Link Between Annual Returns & KRA Tax Compliance</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Annual returns filed with Companies Registry AND tax returns filed with KRA (Kenya Revenue Authority) are separate but linked:</p>

              <div className="space-y-4 mb-6">
                <div className="bg-white border-2 border-gray-200 p-5 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-2">Companies Registry (Annual Returns)</h4>
                  <p className="text-gray-700 text-sm"><strong>What:</strong> File CR12/CR13 with Companies Registry, <strong>When:</strong> Within 30 days of accounting year-end, <strong>Why:</strong> Prove company active + compliant with corporate law, <strong>Penalty:</strong> Strike-off if non-filing, <strong>Form:</strong> CR12 (active) or CR13 (dormant)</p>
                </div>

                <div className="bg-white border-2 border-gray-200 p-5 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-2">KRA Tax Compliance (Income Tax)</h4>
                  <p className="text-gray-700 text-sm"><strong>What:</strong> File income tax return with KRA, <strong>When:</strong> By June 30 (annual deadline), <strong>Why:</strong> Prove income + pay applicable taxes, <strong>Penalty:</strong> Fines if non-filing, <strong>Form:</strong> Tax return (via iTax system)</p>
                </div>

                <div className="bg-white border-2 border-gray-200 p-5 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-2">How They Link</h4>
                  <p className="text-gray-700 text-sm">Financial statements in CR12 should match KRA tax return (same profit/loss figures). KRA cross-checks company filings against Companies Registry. Discrepancies trigger audits/investigations. Best practice: File both on time with matching information. KRA compliance certificate sometimes required for CR12 filing (depending on company). Synchronized filing = smooth compliance.</p>
                </div>

                <div className="bg-white border-2 border-gray-200 p-5 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-2">Both Are Mandatory</h4>
                  <p className="text-gray-700 text-sm">Company must file: CR12 (Companies Registry) AND income tax return (KRA). Missing either = penalties + potential strike-off (for CR12). File both on time. Use consistent financial information. Keep records (5 years minimum). Professional accountant can ensure both filed correctly + on time.</p>
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-606 p-5 rounded-lg">
                <p className="text-gray-700 text-sm"><strong>Action:</strong> When preparing for CR12 filing, also prepare tax return for KRA (same financial data). File both. Don't miss either deadline.</p>
              </div>
            </div>
          </section>

          {/* Hire Professionals */}
          <section id="hire-professionals" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-blue-606 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">When to Hire Professionals for Annual Return Filing</h2>
            </div>

            <div className="prose max-w-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white border-2 border-blue-200 rounded-xl p-5">
                  <h4 className="font-bold text-gray-900 mb-3">✓ DIY Filing (Save Money)</h4>
                  <p className="text-gray-700 text-sm font-bold mb-2">File yourself if:</p>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Small company (turnover under KES 5M)</li>
                    <li>• Simple business structure</li>
                    <li>• No major changes (same directors/shareholders)</li>
                    <li>• Straightforward financials</li>
                    <li>• Know how to use eCitizen</li>
                  </ul>
                  <p className="text-gray-700 text-xs mt-3 font-bold">Cost: KES 2,000-3,000 (filing fee only)</p>
                </div>

                <div className="bg-white border-2 border-orange-200 rounded-xl p-5">
                  <h4 className="font-bold text-gray-900 mb-3">⚠️ Hire Professional (Worth Cost)</h4>
                  <p className="text-gray-700 text-sm font-bold mb-2">Hire accountant if:</p>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Large company (turnover over KES 10M)</li>
                    <li>• Complex business structure</li>
                    <li>• Director/shareholder changes</li>
                    <li>• Requires audit</li>
                    <li>• Behind on filings</li>
                  </ul>
                  <p className="text-gray-700 text-xs mt-3 font-bold">Cost: KES 5,000-30,000 + filing fee</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">What Accountants Do</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Prepare accurate financial statements</li>
                    <li>• Conduct audit (if required/beneficial)</li>
                    <li>• Complete CR12 form correctly</li>
                    <li>• Organize supporting documents</li>
                    <li>• File on eCitizen (handle entire process)</li>
                    <li>• Track status + respond to registry requests</li>
                    <li>• Coordinate with KRA for tax compliance</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">How to Find Accountant</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Ask business contacts for recommendations</li>
                    <li>• Check ICPAK (Institute of Certified Public Accountants Kenya) list</li>
                    <li>• Get quotes from 2-3 accountants (compare fees)</li>
                    <li>• Check references (ask for previous client feedback)</li>
                    <li>• Ensure they're CPA (certified professional accountant)</li>
                    <li>• Verify they handle Companies Registry filings</li>
                  </ul>
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-606 p-5 rounded-lg">
                <p className="text-gray-700 text-sm"><strong>Value proposition:</strong> Professional accountant ensures filing is accurate, on time, and compliant. Cost (KES 5,000-30,000) is small compared to penalties (KES 100,000+) or strike-off restoration (KES 50,000-100,000+). Investment in professional = saves money in long run.</p>
              </div>
            </div>
          </section>

          {/* Common Mistakes */}
          <section id="mistakes-to-avoid" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-606 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Common Mistakes to Avoid When Filing Annual Returns</h2>
            </div>

            <div className="prose max-w-none">
              <div className="space-y-3">
                {commonMistakes.map((item, index) => (
                  <div key={index} className="bg-white border-l-4 border-red-606 p-4 rounded-lg hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-gray-900 mb-1 flex items-start gap-2">
                      <XCircle className="w-5 h-5 text-red-606 flex-shrink-0 mt-0.5" />
                      {item.mistake}
                    </h4>
                    <p className="text-gray-700 text-sm"><strong>✓ Fix:</strong> {item.fix}</p>
                  </div>
                ))}
              </div>

              <div className="bg-green-50 border-l-4 border-green-606 p-4 rounded-lg mt-6">
                <p className="text-gray-700 text-sm"><strong>✓ Prevention tip:</strong> Most mistakes are preventable. Double-check everything before submitting. Have second person review. Ask accountant to verify. Time spent preventing errors saves expensive corrections later.</p>
              </div>
            </div>
          </section>

          {/* FAQs */}
          <section id="faqs" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-blue-606 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
            </div>

            <div className="prose max-w-none">
              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors flex items-start justify-between"
                    >
                      <span className="font-bold text-gray-900 pr-4">{faq.question}</span>
                      <span className={`text-blue-606 flex-shrink-0 text-2xl transition-transform ${expandedFaq === index ? 'rotate-45' : ''}`}>+</span>
                    </button>
                    
                    {expandedFaq === index && (
                      <div className="px-6 py-4 bg-blue-50 border-t-2 border-gray-200">
                        <p className="text-gray-700 text-sm">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="mt-16 bg-gradient-to-r from-blue-606 to-cyan-606 rounded-xl p-8 text-white">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold mb-4">Ready to File Your Annual Returns?</h2>
              <p className="text-blue-100 mb-6">Don't wait until the deadline. File now and ensure your company stays compliant and legally active.</p>
              
              <div className="flex flex-wrap gap-3">
                <a href="https://ecitizen.go.ke" target="_blank" rel="noopener noreferrer" className="bg-white text-blue-606 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  File on eCitizen Now
                </a>
                <a href="/limited-company-registration-kenya" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
                  Company Registration <ArrowRight className="w-5 h-5" />
                </a>
                <a href="/kra-pin-and-tax-registration-kenya" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
                  Tax Compliance <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </section>

          {/* Internal Links */}
          <section className="mt-12 pt-8 border-t-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Related Business & Compliance Guides</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <a href="/how-to-register-business-kenya" className="p-4 border-2 border-blue-200 rounded-lg hover:shadow-lg transition-shadow hover:border-blue-606">
                <h4 className="font-bold text-gray-900 mb-1">How to Register a Business</h4>
                <p className="text-gray-600 text-sm">Complete guide to business registration in Kenya</p>
              </a>
              <a href="/limited-company-registration-kenya" className="p-4 border-2 border-green-200 rounded-lg hover:shadow-lg transition-shadow hover:border-green-606">
                <h4 className="font-bold text-gray-900 mb-1">Limited Company Registration</h4>
                <p className="text-gray-600 text-sm">How to register a limited company in Kenya</p>
              </a>
              <a href="/sole-proprietorship-registration-kenya" className="p-4 border-2 border-orange-200 rounded-lg hover:shadow-lg transition-shadow hover:border-orange-606">
                <h4 className="font-bold text-gray-900 mb-1">Sole Proprietor Registration</h4>
                <p className="text-gray-600 text-sm">Register as a sole proprietor in Kenya</p>
              </a>
              <a href="/partnership-llp-registration-kenya" className="p-4 border-2 border-purple-200 rounded-lg hover:shadow-lg transition-shadow hover:border-purple-606">
                <h4 className="font-bold text-gray-900 mb-1">Partnership & LLP Registration</h4>
                <p className="text-gray-600 text-sm">Register a partnership or limited liability partnership</p>
              </a>
              <a href="/kra-pin-and-tax-registration-kenya" className="p-4 border-2 border-red-200 rounded-lg hover:shadow-lg transition-shadow hover:border-red-606">
                <h4 className="font-bold text-gray-900 mb-1">KRA PIN & Tax Registration</h4>
                <p className="text-gray-600 text-sm">Register for KRA PIN and tax compliance</p>
              </a>
              <a href="/business-permits-licenses-kenya" className="p-4 border-2 border-indigo-200 rounded-lg hover:shadow-lg transition-shadow hover:border-indigo-606">
                <h4 className="font-bold text-gray-900 mb-1">Business Permits & Licenses</h4>
                <p className="text-gray-600 text-sm">Get business permits and licenses in Kenya</p>
              </a>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default CompanyAnnualReturnsAndFilingKenya;
