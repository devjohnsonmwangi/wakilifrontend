import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { AlertCircle, ArrowRight, FileText, Building2, AlertTriangle, BookOpen, Globe, Shield, BarChart, XCircle, Clock } from 'lucide-react';

const BusinessTaxObligationsKenya = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // FAQ data
  const faqs = [
    {
      question: 'What taxes must my business pay?',
      answer: 'Depends on business structure and income: Sole proprietor (income above KES 400K): income tax + possible VAT, Company: income tax + PAYE (if employees) + VAT (if above KES 16M turnover), Small trader (below KES 16M): turnover tax alternative. All businesses: must register for KRA PIN. Which taxes apply: determine by business type, income level, employee count. Multiple taxes can apply simultaneously. Example: restaurant pays VAT (16% on sales) + PAYE (employee salaries) + income tax (profit). Recommendation: use accountant to determine exact tax obligations.'
    },
    {
      question: 'Is VAT registration mandatory?',
      answer: 'Mandatory if: annual turnover exceeds KES 16 million. Optional if: below KES 16M (can register voluntarily). Non-taxable businesses exempt (nonprofits, certain services). Benefits of voluntary VAT: recover VAT on business expenses, appear more professional, easier accounting, transparent with suppliers. Disadvantage: added complexity + compliance burden. Process: register on iTax (same as income tax registration). Cost: FREE (no registration fee). Monthly filing required: file every month (VAT returns).'
    },
    {
      question: 'How much is VAT rate?',
      answer: 'VAT (Value Added Tax) standard rate: 16% on most goods/services in Kenya. How it works: add 16% to selling price (customer pays), remit 16% to KRA monthly, recover VAT paid on business expenses. Net VAT = VAT collected minus VAT paid. Example: business sells goods for KES 100,000 net + 16% = KES 116,000 (customer pays). If business spent KES 50,000 on supplies + 16% = KES 58,000, nets KES 8,000 VAT to remit (16,000 - 8,000). Some items zero-rated (0% VAT): basic food, export services, medical. Exempt items (no VAT): insurance, education, health services.'
    },
    {
      question: 'When do I file PAYE returns?',
      answer: 'PAYE (Pay As You Earn) monthly obligation: Must file monthly (by 9th of following month), Calculate employee tax (10%-30% depending on salary), Withhold from employee paychecks, Remit to KRA monthly. Example: January salaries paid → PAYE return due by February 9. File via iTax (automated mostly). Timeline: same month employees paid → KRA gets payment by 9th next month. Late payment penalties: 20% interest per annum + fines. Important: employee trust - delay payment breaches fiduciary duty. Keep PAYE records: 5 years (auditable).'
    },
    {
      question: 'What is turnover tax?',
      answer: 'Turnover tax: simplified tax alternative for small businesses. Rate: 1-3% on gross turnover (some brackets: 1% for KES 0-5M, 2% for KES 5-10M, 3% for KES 10-16M). Who qualifies: small traders/SMEs with turnover under KES 16M annually. Benefits: simpler than income tax (no detailed expense documentation), lower rate for some businesses, faster filing, less compliance burden. Disadvantage: can be more expensive than income tax if business has high expenses. Choose either: turnover tax OR income tax (not both). Switch possible: can switch to income tax if business grows.'
    },
    {
      question: 'How do I register for taxes on iTax?',
      answer: 'iTax registration process: Go to itax.go.ke, Create account (email + password), Log in, Select tax type (income tax, VAT, PAYE, turnover tax), Fill registration form (business details, income estimate, activity type), Upload documents (ID, business address, KRA PIN if applicable), Submit, KRA reviews (1-3 days), Approval + PIN issued, you can start filing. Mobile app alternative: download KRA iTax app (same process on phone). Cost: FREE registration. Timeline: 1-3 days for approval. Keep reference number for tracking.'
    },
    {
      question: 'What documents do I need for VAT registration?',
      answer: 'VAT registration requirements: KRA PIN (must have first), Business registration/license, Bank account details (business account), Proof of business address (utility bill, lease), ID/passport (owner), Turnover projection (estimated annual revenue), Business description (what you sell), Accounting software (if applicable). Optional: accountant letter (shows professional management). Submit via iTax (digital upload). Processing: 2-5 days. Cost: FREE. Once approved: can charge VAT on invoices + recover VAT on expenses (subject to rules).'
    },
    {
      question: 'Can I claim VAT on expenses?',
      answer: 'VAT recovery rule: Can recover VAT on goods/services used in business (input VAT). Exception: VAT on exempt goods/personal expenses NOT recoverable. Examples recoverable: office rent (16%), supplies (16%), equipment (16%), professional services (16%). NOT recoverable: fuel/vehicle maintenance (exempt), personal items, entertainment expenses (restricted), medical (exempt). Documentation critical: keep all VAT invoices (mandatory 5 years). False claims = fraud (serious penalty). Process: claim VAT recovery in monthly VAT return. Net VAT = output (VAT collected) - input (VAT paid).'
    },
    {
      question: 'What is the income tax rate?',
      answer: 'Income tax rates: Progressive scale (higher income = higher rate). Rates: 10% on first KES 288,000 (annual), 15% on KES 288,000-388,000, 20% on KES 388,000-6,000,000, 25% on KES 6,000,000-9,200,000, 30% on above KES 9,200,000. How calculated: apply rates to taxable income (revenue minus allowable expenses). Personal relief: KES 2,400 (reduces tax). Other reliefs: insurance premium, mortgage interest, certain donations. Deadline: file by June 30 annually (for KES 400K+ earners). Cost: depends on income (progressive system). Examples: KES 500K income ≈ KES 65,000 tax (13%). KES 2M income ≈ KES 475,000 tax (24%).'
    },
    {
      question: 'How do I file tax returns if behind?',
      answer: 'If behind on filing: File immediately (today if possible), Penalties increase with delay, Arrears accumulate interest (20% per annum). Catch-up process: File all missing years returns (may need amended filings), Calculate interest + penalties owed, Pay what you owe, Self-report (better than being caught by audit). Pro tip: work with accountant (costs KES 10,000-50,000) to file back returns properly + negotiate payment plan with KRA. KRA typically accepts late filings without criminal prosecution if you file willingly + pay. Avoiding future delays: mark calendar, use accountant, file early.'
    },
    {
      question: 'What penalties apply for late tax payments?',
      answer: 'Late payment penalties: Interest: 20% per annum (compounded daily/monthly), Specific penalties: vary by tax type (PAYE vs VAT vs income tax), Accumulation: interest + penalties grow quickly. Examples: KES 100,000 VAT 60 days late = KES 100,000 + interest (KES 3,300) + fine (5-10%) = KES 110,000+. Severity increases: 1-30 days late (light), 30-90 days (moderate), 90+ days (severe + notices). Consequences beyond money: business name suspension, director action, asset seizure (extreme cases). Prevention: file on time (zero penalty), Set reminders, Use accountant. If late: pay immediately (interest compounds daily).'
    },
    {
      question: 'Do sole proprietors file differently than companies?',
      answer: 'Yes, different filing requirements: Sole proprietor: file income tax return (personal + business income combined), KRA PIN required (if income above KES 400K), No VAT unless above turnover, File by June 30. Company: file corporate income tax (separate legal entity), PAYE mandatory (if employees), VAT if above KES 16M turnover, CR12 annual returns (to Companies Registry), File by June 30 (both). Both must register for KRA PIN. Both file on iTax. Different forms used (individual vs corporate tax return). Sole proprietors simpler (fewer obligations), Companies more regulated. Example: sole proprietor restaurant = income tax + VAT. Company restaurant = income tax + VAT + PAYE + CR12.'
    },
    {
      question: 'How long must I keep tax records?',
      answer: 'Record retention requirement: 5 years minimum (from year of transaction). What to keep: invoices, receipts, bank statements, payroll records, VAT invoices, expense documentation, contracts, correspondence with KRA. Storage: physical copies (safe) or digital (backed up), either acceptable. Penalties for not keeping: KES 10,000-50,000 if unable to produce during audit. Destruction: after 5 years, can destroy (but keep summary). Importance: audit-proof (proves income, deductions, expenses). Digital option: scan all documents (high resolution), backup to cloud (Google Drive, Dropbox), create index/folder system. Accountants typically manage record storage.'
    },
    {
      question: 'Can I get a tax refund?',
      answer: 'Tax refund eligibility: If you overpaid taxes (paid more than owed), You can claim refund from KRA. Common refund cases: Excess PAYE withheld (salary earner), VAT overpayment (business), Quarterly estimated payments (paid too much). How to claim: File annual income tax return (shows overpayment), KRA calculates refund owed, Request refund (on iTax or in person), Processing: 2-8 weeks (varies). Direct deposit: KRA deposits to bank account (provide account details). Delays: common if account details wrong, system issues, or ongoing audits. Tip: accurate filing = correct refunds. Accountant helps ensure correct calculation + faster processing.'
    },
    {
      question: 'What happens if I don\'t pay taxes?',
      answer: 'Consequences of non-payment: Fines: 10-50% of unpaid tax, Interest: 20% per annum (compounds), Business suspension: KRA can suspend business license/permits, Asset seizure: KRA can pursue asset recovery, Director liability: personal fines/jail possible (severe cases), Credit rating: impacts borrowing/contracts, Reputational damage: affects business credibility. Enforcement: KRA actively pursues large defaulters (public list published), Businesses named, Customers lose trust. Prevention: pay taxes on time (budget for taxes), payment plans available (request if cannot pay lump sum), amnesty programs (occasional one-time offers). Solution if in arrears: contact KRA, explain circumstances, negotiate payment plan, hire accountant to help negotiate.'
    }
  ];

  // Tax types table
  const taxTypes = [
    {
      type: 'Income Tax',
      rate: '10-30% progressive',
      who: 'All businesses earning above KES 400K',
      filing: 'Annually by June 30',
      documents: 'Financial statements, expense receipts, profit calculation'
    },
    {
      type: 'VAT',
      rate: '16% on sales',
      who: 'Businesses with turnover above KES 16M',
      filing: 'Monthly (by 9th of next month)',
      documents: 'Sales invoices, purchase invoices, VAT calculations'
    },
    {
      type: 'PAYE',
      rate: '10-30% employee tax',
      who: 'Employers with salaried employees',
      filing: 'Monthly (by 9th of next month)',
      documents: 'Payroll records, employee IDs, salary calculations'
    },
    {
      type: 'Turnover Tax',
      rate: '1-3% of gross turnover',
      who: 'Small businesses under KES 16M turnover',
      filing: 'Monthly or quarterly',
      documents: 'Sales records, turnover documentation'
    },
    {
      type: 'Excise Duty',
      rate: 'Varies (5%-100%+)',
      who: 'Manufacturers/importers of excisable goods',
      filing: 'As applicable per product',
      documents: 'Manufacturing records, import documents'
    }
  ];

  // Filing steps
  const filingSteps = [
    {
      number: 1,
      title: 'Determine Your Tax Obligations',
      description: 'Assess business to determine applicable taxes: Business type (sole proprietor vs company), Annual income/turnover (estimate for year), Number of employees (triggers PAYE), Type of goods/services (some excisable). Use checklist: Income above KES 400K = income tax, Turnover above KES 16M = VAT, Any employees = PAYE, Sell excisable goods = excise duty. Consult accountant if unsure. This determines which taxes to register for on iTax.'
    },
    {
      number: 2,
      title: 'Create/Update KRA PIN',
      description: 'Ensure you have valid KRA PIN (11-digit number). If new business: apply for PIN first (via iTax), If existing: verify PIN active + current (KRA portal). KRA PIN required for all tax registrations. PIN shows tax compliance status. Cost: FREE. Timeline: 1-3 days for new PIN. This is prerequisite before registering for specific taxes.'
    },
    {
      number: 3,
      title: 'Open eCitizen/iTax Account',
      description: 'Go to ecitizen.go.ke or itax.go.ke (same system), Create account using: valid email address, strong password (8+ characters), phone number (for verification), Accept terms, Verify email (click link in confirmation), Account ready to use. Save login details (don\'t forget password). Account allows: tax registration, return filing, payment tracking, correspondence with KRA.'
    },
    {
      number: 4,
      title: 'Register for Income Tax (If Applicable)',
      description: 'Log into iTax, Select "Individual Registration" or "Company Registration", Choose "Income Tax Registration", Enter business details: name, PIN, business activity, income estimate, Enter address and contact, Upload: ID copy, business address proof, bank details, Submit registration, KRA approves (1-3 days), Receive confirmation + PIN.'
    },
    {
      number: 5,
      title: 'Register for VAT (If Applicable)',
      description: 'If annual turnover above KES 16M: Return to iTax, Select "VAT Registration", Enter business details, Input turnover estimate, Upload: KRA PIN, business license, sales invoices (sample), business address proof, Submit, KRA approves (2-5 days), Receive VAT registration confirmation. Can now charge 16% VAT on sales and recover VAT on expenses.'
    },
    {
      number: 6,
      title: 'Register for PAYE (If You Have Employees)',
      description: 'If any salaried employees: Log into iTax, Select "PAYE Registration", Enter employer details, List employees: names, IDs, salaries, designations, Enter bank account (for salary payments), Select salary payment frequency, Upload: KRA PIN, employee list, payroll records, Submit registration, KRA approves (1-3 days), PAYE account ready.'
    },
    {
      number: 7,
      title: 'Register for Turnover Tax (If Applicable)',
      description: 'If small business under KES 16M turnover (optional, alternative to income tax): Choose on iTax: either turnover tax OR income tax (not both), Select "Turnover Tax Registration", Enter turnover estimate + business type, Upload: KRA PIN, business documents, Submit, KRA approves (1-3 days). Note: once chosen, switching later possible but involves process.'
    },
    {
      number: 8,
      title: 'Set Up Accounting System',
      description: 'Prepare to track for tax filing: Use accounting software (QuickBooks, Sage, Wave), or manual records (spreadsheets), Track: all income, all expenses, employee salaries, all VAT transactions, bank statements. Best practice: implement before registering for taxes (shows professionalism). Cost: FREE software to premium (KES 5,000-50,000/year). Accountant can help set up (costs KES 10,000-30,000 one-time).'
    },
    {
      number: 9,
      title: 'Prepare Supporting Documents',
      description: 'Gather for all tax filings: Bank statements (monthly reconciliation), Invoice copies (sales + purchases), Payroll records (if employees), Expense receipts (organized by category), Professional fees (accountant, consultants), Depreciation schedules (equipment), Loan documentation (interest deductible). Organize systematically (by month, by category). Digital copies (scanned, high resolution). Keep 5-year history minimum. Documentation = audit proof + credible tax position.'
    },
    {
      number: 10,
      title: 'File First Return Within Deadline',
      description: 'First filing deadline: Income tax: by June 30 (for previous year), VAT: first month after registration, PAYE: first month after employee starts. File via iTax: Log in, Select relevant tax type return, Fill form accurately (match your records), Attach supporting documents (scans), Review before submission, Submit + pay if owed, Receive reference number. Keep reference (proof of filing). Most systems process within 1-2 days if complete.'
    },
    {
      number: 11,
      title: 'Set Up Regular Filing Schedule',
      description: 'Create calendar reminder for all filings: Income tax: June 30 (annual), VAT: 9th of every month (if registered), PAYE: 9th of every month (if employees), Turnover tax: as per registration (monthly/quarterly). Set reminders: 2 weeks before (start preparing), 1 week before (finalize), day before (final check). Use phone calendar + spreadsheet tracker. Accountant typically manages this (included in their service).'
    },
    {
      number: 12,
      title: 'Maintain Compliance Going Forward',
      description: 'Ongoing obligations: File all returns on time (zero penalty is goal), Keep accurate records (5 years), Pay taxes when due (20% interest if late), Update KRA if business changes (address, activity, structure), Respond to KRA communications (audits, queries), Hire accountant if needed (helps ensure compliance). Annual review: audit financial statements (if required), check KRA compliance status, update tax obligations (if income changed).'
    }
  ];

  // Documents table
  const documentsTable = [
    {
      tax: 'Income Tax',
      documents: 'Financial statements, expense receipts, bank statements, profit/loss calculation, professional fee receipts, depreciation schedule',
      annual: 'Yes',
      keeping: '5 years'
    },
    {
      tax: 'VAT',
      documents: 'Sales invoices, purchase invoices, VAT calculations, import documents (if applicable), credit notes, debit notes',
      annual: 'No (monthly)',
      keeping: '5 years'
    },
    {
      tax: 'PAYE',
      documents: 'Payroll records, employee IDs, salary certificates, tax deduction proofs, statutory deduction receipts, leave records',
      annual: 'Reconciliation only',
      keeping: '5 years'
    },
    {
      tax: 'Turnover Tax',
      documents: 'Sales records, gross turnover documentation, business registration, KRA PIN, accounting records',
      annual: 'Depends on filing frequency',
      keeping: '5 years'
    }
  ];

  // Penalties table
  const penaltiesTable = [
    {
      violation: 'Late income tax filing',
      penalty: '5-10% of unpaid tax',
      interest: '20% per annum',
      consequence: 'KRA notice issued, payment demand'
    },
    {
      violation: 'Late VAT filing',
      penalty: '5-10% of VAT owed',
      interest: '20% per annum',
      consequence: 'Account suspension possible'
    },
    {
      violation: 'Late PAYE payment',
      penalty: '10-20% of PAYE owed',
      interest: '20% per annum',
      consequence: 'Director personal liability possible'
    },
    {
      violation: 'False tax information',
      penalty: '50-100% of tax evaded',
      interest: 'Penalty interest on penalty',
      consequence: 'Criminal prosecution, jail possible'
    },
    {
      violation: 'Non-filing (6+ months)',
      penalty: 'Estimated tax + fine',
      interest: 'Compounds daily',
      consequence: 'License suspension, director action'
    }
  ];

  // Common mistakes
  const commonMistakes = [
    { mistake: 'Filing late', fix: 'File immediately even if late. Penalties increase with delay. Set calendar reminders.' },
    { mistake: 'Wrong income figures', fix: 'Ensure financial statements match tax return. Reconcile bank statements.' },
    { mistake: 'Missing VAT invoices', fix: 'Keep ALL sales/purchase invoices (5 years). Digital copies acceptable if high quality.' },
    { mistake: 'Incorrect PAYE calculation', fix: 'Use tax tables or software. Verify employee rates annually. Consult accountant.' },
    { mistake: 'Not keeping supporting documents', fix: 'Organize receipts by category. Scan high-resolution. Backup to cloud.' },
    { mistake: 'Claiming non-deductible expenses', fix: 'Learn what\'s deductible (professional, business-related). Personal expenses not allowed.' },
    { mistake: 'Switching tax regimes without notice', fix: 'Notify KRA formally when switching income tax to turnover tax (or vice versa).' },
    { mistake: 'Not reconciling with accountant', fix: 'Hire accountant to review annual records. Catches errors early. Costs less than penalties.' }
  ];

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'intro', 'tax-types', 'who-registers', 'registration-process', 'vat-filing', 'paye-filing', 'income-tax-filing', 'turnover-tax', 'documents', 'deadlines-penalties', 'correct-mistakes', 'hire-professionals', 'faqs'];
      
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
        <title>Business Tax Obligations Kenya – VAT PAYE Income Tax Guide</title>
        <meta name="description" content="Complete guide to business taxes in Kenya. Learn VAT, PAYE, income tax, turnover tax registration and filing on iTax. Deadlines, penalties, and compliance." />
        <link rel="canonical" href="https://yoursite.com/business-tax-obligations-kenya" />
        
        {/* OpenGraph */}
        <meta property="og:title" content="Business Tax Obligations Kenya – Complete Tax Compliance Guide 2026" />
        <meta property="og:description" content="Register and file VAT, PAYE, income tax for your business. Step-by-step iTax guide with deadlines, penalties, and compliance requirements." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://yoursite.com/business-tax-obligations-kenya" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=630&fit=crop" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Business Tax Obligations Kenya – VAT PAYE Income Tax 2026" />
        <meta name="twitter:description" content="Complete tax compliance guide for Kenyan businesses. VAT, PAYE, income tax registration, filing deadlines, and penalty avoidance." />
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
            "description": "Business tax obligations and compliance guidance in Kenya"
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
                "name": "Business Tax Obligations",
                "item": "https://yoursite.com/business-tax-obligations-kenya"
              }
            ]
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Register and File Business Taxes in Kenya",
            "description": "Step-by-step guide to registering for business taxes and filing on iTax",
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
              <BarChart className="w-8 h-8 flex-shrink-0" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">Business Tax Obligations in Kenya – VAT, PAYE, Income & Turnover Tax Guide</h1>
            </div>
            <p className="text-blue-100 text-lg max-w-3xl">Complete step-by-step guide to registering for business taxes and filing returns on iTax. Learn VAT, PAYE, income tax, deadlines, and how to avoid penalties.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="https://itax.go.ke" target="_blank" rel="noopener noreferrer" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Register on iTax
              </a>
              <a href="/kra-pin-and-tax-registration-kenya" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
                KRA PIN Registration <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:block sticky top-0 bg-white shadow-md z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex gap-2 overflow-x-auto">
              {['overview', 'intro', 'tax-types', 'who-registers', 'registration-process', 'vat-filing', 'paye-filing', 'income-tax-filing', 'turnover-tax', 'documents', 'deadlines-penalties', 'correct-mistakes', 'hire-professionals', 'faqs'].map((section) => (
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
              {['overview', 'tax-types', 'registration-process', 'documents', 'deadlines-penalties', 'faqs'].map((section) => (
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
                  {section === 'overview' ? 'Overview' : section === 'tax-types' ? 'Types' : section === 'registration-process' ? 'Register' : section === 'documents' ? 'Docs' : section === 'deadlines-penalties' ? 'Penalties' : 'FAQs'}
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
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Introduction to Business Taxes in Kenya</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Kenyan businesses must comply with multiple tax obligations depending on business type, size, and structure. Understanding which taxes apply is critical for legal operation and avoiding penalties.</p>

              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop"
                alt="Business tax obligations and compliance in Kenya"
                className="rounded-lg shadow-lg w-full mb-6"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">✓ Why Taxes Matter</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Legal requirement (failure = penalties)</li>
                    <li>• Business legitimacy (credibility)</li>
                    <li>• Access to financing (banks require compliance)</li>
                    <li>• Government contracts (KRA clearance mandatory)</li>
                    <li>• Risk management (avoid seizure/closure)</li>
                  </ul>
                </div>

                <div className="bg-green-50 border-l-4 border-green-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">📋 Tax Registration Authority</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• KRA (Kenya Revenue Authority) - all taxes</li>
                    <li>• Registration via: iTax.go.ke or eCitizen</li>
                    <li>• All registrations: FREE</li>
                    <li>• Processing time: 1-5 days typically</li>
                    <li>• Support: KRA helpline + online chat</li>
                  </ul>
                </div>
              </div>

              <p className="text-gray-700 mb-4"><strong>Key fact:</strong> Businesses must register for applicable taxes and file returns on time. Non-compliance results in penalties (5-100% of tax owed) + interest (20% per annum) + business consequences (suspension, closure, director liability).</p>
            </div>
          </section>

          {/* Tax Types Overview */}
          <section id="tax-types" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <BarChart className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Types of Taxes Businesses Must Pay</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Different businesses pay different taxes. Below is complete breakdown:</p>

              <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto mb-6">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Tax Type</th>
                      <th className="px-4 py-3 text-left font-semibold">Rate</th>
                      <th className="px-4 py-3 text-left font-semibold">Who Pays</th>
                      <th className="px-4 py-3 text-left font-semibold">Filing</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {taxTypes.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                        <td className="px-4 py-3 font-semibold text-gray-900 text-sm">{item.type}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.rate}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.who}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.filing}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-white border-l-4 border-blue-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Income Tax (10-30%)</h4>
                  <p className="text-gray-700 text-sm">Tax on business profit (revenue minus expenses). Progressive rates: 10% on first KES 288K, 15-30% on higher income. All businesses earning above KES 400K must file. Deadline: June 30 annually. Can reduce via allowable deductions (professional fees, insurance, loan interest).</p>
                </div>

                <div className="bg-white border-l-4 border-blue-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">VAT (16%)</h4>
                  <p className="text-gray-700 text-sm">Sales tax on goods/services. Mandatory if turnover above KES 16M annually. Customer pays (add 16% to invoice). Business recovers VAT paid on expenses. Monthly filing (by 9th of next month). Some goods zero-rated (food, exports). Some exempt (education, health, insurance).</p>
                </div>

                <div className="bg-white border-l-4 border-blue-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">PAYE (10-30%)</h4>
                  <p className="text-gray-700 text-sm">Employer withholding tax on employee salaries. Required if any salaried employees. Employer withholds from salary, pays to KRA monthly (by 9th). Employee ultimately pays through salary deduction. Failure to remit = serious penalty (20% interest + fines + director liability).</p>
                </div>

                <div className="bg-white border-l-4 border-blue-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Turnover Tax (1-3%)</h4>
                  <p className="text-gray-700 text-sm">Simplified tax alternative for small businesses. Calculate as percentage of gross turnover (not profit). Rates vary: 1% (0-5M), 2% (5-10M), 3% (10-16M). Choose either turnover tax OR income tax (not both). Easier for businesses with high expenses.</p>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-606 p-5 rounded-lg">
                <p className="text-gray-700 text-sm"><strong>Key decision:</strong> Determine applicable taxes early. Use accountant to calculate which option saves most money (income tax vs turnover tax). Multiple taxes can apply simultaneously (e.g., restaurant pays VAT + PAYE + income tax).</p>
              </div>
            </div>
          </section>

          {/* Who Must Register */}
          <section id="who-registers" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <Building2 className="w-6 h-6 text-blue-606 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Who Must Register for Each Tax</h2>
            </div>

            <div className="prose max-w-none">
              <div className="space-y-3 mb-6">
                <div className="bg-white border-l-4 border-green-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">✓ Income Tax (Mandatory If)</h4>
                  <p className="text-gray-700 text-sm">Sole proprietor earning above KES 400,000 annually. Any company earning any income. Partner in partnership earning above threshold. Director receiving salary above threshold. Freelancer/consultant with consistent income. Threshold: KES 400,000 annual income (combined all sources).</p>
                </div>

                <div className="bg-white border-l-4 border-green-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">✓ VAT (Mandatory If)</h4>
                  <p className="text-gray-700 text-sm">Annual turnover exceeds KES 16 million (any business type). Optional if below KES 16M (voluntary registration beneficial). Automatic if dealing in excisable goods. Non-taxable businesses exempt (nonprofits, certain services). Zero-rated businesses can register (export, certain foods).</p>
                </div>

                <div className="bg-white border-l-4 border-green-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">✓ PAYE (Mandatory If)</h4>
                  <p className="text-gray-700 text-sm">Any business with salaried employee(s). Includes: full-time, part-time, temporary, seasonal employees. Threshold: one employee = PAYE mandatory. Even if only 1 person paid salary = PAYE applies. Covers: salary, bonus, allowances, benefits. Non-salaried contractors exempt (self-employed pay own tax).</p>
                </div>

                <div className="bg-white border-l-4 border-green-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">✓ Turnover Tax (Optional Alternative)</h4>
                  <p className="text-gray-700 text-sm">Small businesses with turnover under KES 16M (choice: turnover tax OR income tax). Good for businesses with: high expenses, complicated accounting, sole traders, simple business model. Not available if: turnover above KES 16M, company registered (companies pay income tax), professional services (advocates, doctors). Choose once; switching later involves process.</p>
                </div>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-606 p-4 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">🎯 Determination Checklist</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Income above KES 400K? → Register income tax</li>
                  <li>• Turnover above KES 16M? → Register VAT</li>
                  <li>• Have employees? → Register PAYE</li>
                  <li>• Below KES 16M turnover? → Choose turnover tax or income tax</li>
                  <li>• Unsure? → Consult accountant (free initial advice)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Registration Process */}
          <section id="registration-process" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <Globe className="w-6 h-6 text-blue-606 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Step-by-Step Registration Process on iTax</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Complete process from account creation to tax registration:</p>

              <div className="space-y-4">
                {filingSteps.map((step) => (
                  <div key={step.number} className="bg-white border-2 border-gray-200 p-5 rounded-xl hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-606 to-cyan-606 text-white font-bold">
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

              <div className="bg-green-50 border-l-4 border-green-606 p-4 rounded-lg mt-6">
                <h4 className="font-bold text-gray-900 mb-2">💡 Registration Tips for Success</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Complete KRA PIN first (prerequisite for all tax registration)</li>
                  <li>• Have KRA PIN, ID, business address proof ready before starting</li>
                  <li>• Accurate information = faster approval (no rejection/delays)</li>
                  <li>• Save reference numbers for all registrations</li>
                  <li>• Monitor email for approval confirmations + KRA requests</li>
                  <li>• Register for all applicable taxes simultaneously (saves time)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* VAT Filing */}
          <section id="vat-filing" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <FileText className="w-6 h-6 text-blue-606 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How to File VAT Returns (Monthly)</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">VAT returns filed monthly (by 9th of following month):</p>

              <div className="space-y-4 mb-6">
                <div className="bg-white border-l-4 border-blue-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Step 1: Collect Monthly Sales & Purchase Records</h4>
                  <p className="text-gray-700 text-sm">Gather all invoices: sales invoices (showing 16% VAT charged), purchase invoices (showing VAT paid), credit notes (refunds/adjustments), debit notes (price corrections). Organize by date. Verify amounts. Count total output VAT (VAT you collected) and input VAT (VAT you paid).</p>
                </div>

                <div className="bg-white border-l-4 border-blue-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Step 2: Calculate VAT Owed</h4>
                  <p className="text-gray-700 text-sm">Calculate: Output VAT = 16% of total sales. Input VAT = 16% of eligible purchases. Net VAT owed = Output minus Input. Example: Sales KES 1M (output VAT KES 160K) minus purchases KES 500K (input VAT KES 80K) = KES 80K net VAT owed. If input exceeds output = KRA owes you (refund claimed next month or carry forward).</p>
                </div>

                <div className="bg-white border-l-4 border-blue-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Step 3: Log Into iTax & File VAT Return</h4>
                  <p className="text-gray-700 text-sm">Go to iTax.go.ke, Log in (email + password), Select "File VAT Return", Choose month/period, Enter: output VAT (sales), input VAT (purchases), other items (imports, adjustments), Review calculated net VAT, Attach supporting documents (if requested), Submit.</p>
                </div>

                <div className="bg-white border-l-4 border-blue-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Step 4: Pay VAT or Claim Refund</h4>
                  <p className="text-gray-700 text-sm">If VAT owed: pay via M-Pesa, bank transfer, or card (by 9th of next month). If refund due: KRA processes refund to bank account (2-4 weeks). Keep proof of payment (receipt). VAT non-payment = serious penalty (20% interest + fines + account suspension possible).</p>
                </div>

                <div className="bg-white border-l-4 border-blue-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Step 5: Maintain Supporting Documentation</h4>
                  <p className="text-gray-700 text-sm">Keep all invoices (5-year retention mandatory): digital copies (scanned), organized by month, indexed, backed up. Purpose: audit defense, reconciliation with bank, verification if KRA questions filing. Loss of invoices = cannot prove input VAT = loses deduction = higher tax liability.</p>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-606 p-4 rounded-lg">
                <p className="text-gray-700 text-sm"><strong>Critical:</strong> VAT filing is monthly (not optional). Late filing = penalties. If unable to file: contact KRA (payment plan available). Accurate records = correct VAT = avoid audit.</p>
              </div>
            </div>
          </section>

          {/* PAYE Filing */}
          <section id="paye-filing" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <Clock className="w-6 h-6 text-blue-606 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How to File PAYE Returns (Monthly)</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">PAYE returns filed monthly (by 9th of following month). Critical compliance:</p>

              <div className="space-y-4 mb-6">
                <div className="bg-white border-l-4 border-red-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">⚠️ Important: PAYE Non-Payment Is Serious</h4>
                  <p className="text-gray-700 text-sm">PAYE is trust money (belongs to employees). Withholding but not remitting = theft. Consequences: 20% interest per annum, KES 50,000-500,000 fines, director personal liability (jail possible), business account suspension, employee relations damage. ALWAYS pay PAYE on time (before any other business expenses if cash-strapped).</p>
                </div>

                <div className="bg-white border-l-4 border-blue-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Step 1: Calculate Employee PAYE</h4>
                  <p className="text-gray-700 text-sm">For each employee: Gross salary (before tax), Apply tax tables (10-30% progressive), Calculate tax owed, Deduct from salary (net pay to employee), Calculate employer's statutory contribution (if applicable). Use: KRA tax tables, payroll software (QuickBooks, Sage), or accountant. Verify accuracy (most common error source).</p>
                </div>

                <div className="bg-white border-l-4 border-blue-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Step 2: Pay Salaries & Withhold PAYE</h4>
                  <p className="text-gray-700 text-sm">Pay salaries (net amount) to employees, Withhold PAYE (employee tax deducted from salary), Retain PAYE pending remittance. Timeline: pay salaries whenever (weekly, biweekly, monthly), but remit PAYE to KRA by 9th of next month. Example: January salaries paid Jan 31 → PAYE due to KRA Feb 9.</p>
                </div>

                <div className="bg-white border-l-4 border-blue-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Step 3: File PAYE Return on iTax</h4>
                  <p className="text-gray-700 text-sm">Go to iTax.go.ke, Log in, Select "File PAYE Return", Choose month, Enter: employee count, total gross salaries, total PAYE withheld, any statutory deductions, Review calculations, Submit.</p>
                </div>

                <div className="bg-white border-l-4 border-blue-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Step 4: Remit PAYE to KRA</h4>
                  <p className="text-gray-700 text-sm">Pay PAYE by 9th of next month (deadline strict). Payment methods: M-Pesa (if small), bank transfer (for larger), KRA office (in person if small). Keep receipt (proof of payment). Late payment = interest accrues daily. If short on cash: contact KRA (payment plan may be available, but penalty still applies).</p>
                </div>

                <div className="bg-white border-l-4 border-blue-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Step 5: Annual PAYE Reconciliation</h4>
                  <p className="text-gray-700 text-sm">By June 30: file annual PAYE reconciliation return (reconciles monthly payments with annual totals). Compares: total PAYE paid during year vs total owed. Adjusts if discrepancies. Annual certificate issued (employees may request). Keeps records: 5 years minimum (auditable).</p>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-606 p-4 rounded-lg">
                <p className="text-gray-700 text-sm"><strong>Best practice:</strong> Set up automatic payroll system (software or accountant manages). Eliminates calculation errors. Ensures timely payment. Professional appearance to employees.</p>
              </div>
            </div>
          </section>

          {/* Income Tax Filing */}
          <section id="income-tax-filing" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <FileText className="w-6 h-6 text-blue-606 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How to File Income Tax Returns (Annually)</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Income tax deadline: June 30 (annual filing for previous year). Process:</p>

              <div className="space-y-4 mb-6">
                <div className="bg-white border-l-4 border-blue-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Step 1: Prepare Financial Statements</h4>
                  <p className="text-gray-700 text-sm">Create for calendar year (or your accounting year): Profit & Loss Statement (revenue minus expenses = net profit), Balance Sheet (assets, liabilities, equity), Schedules: depreciation, deductions, adjustments. Use accountant or accounting software. Statements must be accurate (basis for tax calculation). For companies: audited statements (if turnover above KES 40M).</p>
                </div>

                <div className="bg-white border-l-4 border-blue-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Step 2: Calculate Taxable Income</h4>
                  <p className="text-gray-700 text-sm">Formula: Gross profit (revenue - direct costs) minus: operating expenses, depreciation, interest on loans, professional fees, allowable deductions = Taxable income. Apply: personal relief (KES 2,400 individual), other reliefs (insurance, mortgage, donations). Result = taxable amount. Apply progressive tax rates (10-30% depending on income bracket).</p>
                </div>

                <div className="bg-white border-l-4 border-blue-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Step 3: Collect Supporting Documents</h4>
                  <p className="text-gray-700 text-sm">Gather: bank statements (full year), invoices (sales + purchases), receipts (organized by category), professional fees (accountant, lawyer bills), insurance policies, depreciation schedules, loan documentation (interest), employee records (if any). Organize chronologically. All documents = audit defense. Missing docs = loses deduction claim.</p>
                </div>

                <div className="bg-white border-l-4 border-blue-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Step 4: File Income Tax Return on iTax</h4>
                  <p className="text-gray-700 text-sm">Go to iTax.go.ke, Log in, Select "File Income Tax Return", Choose tax year, Fill form: business details, gross income, expenses (categorized), depreciation, reliefs, Attach financial statements + supporting schedules, Calculate tax owed, Review + verify accuracy, Submit.</p>
                </div>

                <div className="bg-white border-l-4 border-blue-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Step 5: Pay Tax or Claim Refund</h4>
                  <p className="text-gray-700 text-sm">If tax owed: pay via iTax (M-Pesa, card, transfer), by June 30 (deadline). If refund due: KRA processes (2-8 weeks). Keep payment proof. Late payment = 20% interest per annum. If insufficient funds: contact KRA (payment plan available, but penalty still applies).</p>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-606 p-4 rounded-lg">
                <p className="text-gray-700 text-sm"><strong>Pro tip:</strong> File early (May, not June). Beats end-of-month rush. More time for KRA queries. Accountant typically files (KES 5,000-20,000 cost is small vs audit/penalty risk).</p>
              </div>
            </div>
          </section>

          {/* Turnover Tax */}
          <section id="turnover-tax" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <BarChart className="w-6 h-6 text-blue-606 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How to File Turnover Tax Returns</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Turnover tax is simplified alternative for small businesses (under KES 16M annual turnover). Easier than income tax:</p>

              <div className="space-y-4 mb-6">
                <div className="bg-white border-l-4 border-blue-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Turnover Tax Overview</h4>
                  <p className="text-gray-700 text-sm">Calculate as: percentage of GROSS turnover (not profit). Rates: 1% on sales 0-5M annually, 2% on 5-10M, 3% on 10-16M. Advantage: simpler bookkeeping (no need detailed expense documentation), faster filing, lower rate sometimes (if high expenses, turnover tax cheaper). Disadvantage: fixed rate regardless of profit (can be more expensive if very profitable). Once chosen: cannot switch easily (switching involves process).</p>
                </div>

                <div className="bg-white border-l-4 border-blue-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Filing Process</h4>
                  <p className="text-gray-700 text-sm">Frequency: monthly or quarterly (depends on registration). Required: total sales/turnover for period, apply rate (1-3%), pay to KRA. Documents: sales records, turnover documentation, cash book, receipts. Less detailed than income tax (no expense deductions claimed). Filing deadline: as per registration (monthly by 9th or quarterly). Cost: typically zero (file yourself on iTax).</p>
                </div>

                <div className="bg-white border-l-4 border-blue-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">When to Choose Turnover Tax</h4>
                  <p className="text-gray-700 text-sm">Good choice if: sole trader with simple business, no employees (or minimal), high operating expenses (rent, stock, supplies), less sophisticated accounting available, wants simpler compliance. Not recommended if: high-profit business (turnover tax becomes expensive), complex structure, planning to expand significantly (will exceed KES 16M threshold), want to claim large deductions (cannot do with turnover tax). Seek accountant advice (free initial consultation to determine best option).</p>
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-606 p-4 rounded-lg">
                <p className="text-gray-700 text-sm"><strong>Decision tool:</strong> Calculate both income tax and turnover tax scenarios. Choose option paying less. Accountant can do this analysis quickly.</p>
              </div>
            </div>
          </section>

          {/* Documents Required */}
          <section id="documents" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <FileText className="w-6 h-6 text-blue-606 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Required Documents for Each Tax Type</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Documentation critical for compliance and audit defense:</p>

              <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto mb-6">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-606 to-cyan-606 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Tax Type</th>
                      <th className="px-4 py-3 text-left font-semibold">Documents Required</th>
                      <th className="px-4 py-3 text-left font-semibold">Annual Filing</th>
                      <th className="px-4 py-3 text-left font-semibold">Record Retention</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {documentsTable.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 font-medium text-gray-900 text-sm">{item.tax}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.documents}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.annual}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.keeping}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">📋 Critical: Five-Year Record Retention</h4>
                  <p className="text-gray-700 text-sm">Kenyan law requires keeping all tax-related documents 5 years minimum. KRA can audit back to 5 years. If unable to produce during audit: document loss penalties apply (KES 10,000-50,000). Best practice: scan all documents (high resolution: 300+ DPI), organize by year + category, backup to cloud (Google Drive, Dropbox), maintain physical copies (safe storage).</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">✓ Digital vs Physical Records</h4>
                  <p className="text-gray-700 text-sm">Digital acceptable: scanned invoices, digital receipts, bank statements (PDF). Must be: high quality (legible), searchable, backed up (multiple copies), indexed (organized system). Physical: originals kept, filed safely, protection from damage/loss. Hybrid approach best: digital primary (convenient) + physical backup (legal protection).</p>
                </div>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-606 p-4 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">💼 Accountant's Role</h4>
                <p className="text-gray-700 text-sm">Professional accountant typically: receives documents (you provide), organizes + categorizes, verifies completeness, flags missing items, prepares tax returns, files on iTax, manages compliance calendar, responds to KRA queries. Cost: KES 5,000-50,000/year (depends on business complexity). Value: ensures accuracy + timely filing + audit defense + peace of mind.</p>
              </div>
            </div>
          </section>

          {/* Deadlines & Penalties */}
          <section id="deadlines-penalties" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-606 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Deadlines & Penalties for Non-Compliance</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Strict deadlines with escalating penalties for delays:</p>

              <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto mb-6">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-red-606 to-orange-606 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Violation</th>
                      <th className="px-4 py-3 text-left font-semibold">Penalty %</th>
                      <th className="px-4 py-3 text-left font-semibold">Interest/Annum</th>
                      <th className="px-4 py-3 text-left font-semibold">Consequence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {penaltiesTable.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 font-medium text-gray-900 text-sm">{item.violation}</td>
                        <td className="px-4 py-3 text-red-700 font-bold text-sm">{item.penalty}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.interest}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.consequence}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-red-50 border-l-4 border-red-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">🚨 Key Filing Deadlines</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Income Tax Annual Return: by June 30</li>
                    <li>• VAT Return: monthly by 9th of next month</li>
                    <li>• PAYE Return: monthly by 9th of next month</li>
                    <li>• Turnover Tax: per registration (monthly/quarterly)</li>
                    <li>• Company Annual Returns (CR12): within 30 days of year-end</li>
                  </ul>
                </div>

                <div className="bg-red-50 border-l-4 border-red-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">💰 Penalty Examples</h4>
                  <p className="text-gray-700 text-sm"><strong>Income Tax (KES 100K owed, 60 days late):</strong> Base tax KES 100K + 20% interest (KES 3,333) + 5-10% penalty (KES 5-10K) = total KES 108K-113K+</p>
                  <p className="text-gray-700 text-sm"><strong>VAT (KES 50K owed, 30 days late):</strong> KES 50K + interest (KES 250+) + penalty (KES 2-5K) = total KES 52-55K+</p>
                  <p className="text-gray-700 text-sm"><strong>PAYE (KES 75K owed, 60 days late):</strong> KES 75K + 20% interest (KES 2,500) + 10-20% penalty (KES 7.5-15K) = total KES 85-92.5K+</p>
                </div>

                <div className="bg-red-50 border-l-4 border-red-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">⚠️ Worst Case: Business Suspension</h4>
                  <p className="text-gray-700 text-sm">If non-filing continues: KRA can suspend business license/permits, suspend bank account (cannot conduct business), seize assets (repayment), list business publicly (credibility damage). Recovery: expensive, time-consuming, reputational damage. Prevention: file on time, every time.</p>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-606 p-5 rounded-lg">
                <p className="text-gray-700 text-sm"><strong>Action if behind:</strong> File immediately (penalties increase with delay). Contact KRA (payment plan available). Hire accountant to manage catch-up. Self-report before KRA notices (better terms). Ignoring worsens situation.</p>
              </div>
            </div>
          </section>

          {/* Correct Mistakes */}
          <section id="correct-mistakes" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <XCircle className="w-6 h-6 text-blue-606 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How to Correct Mistakes in Tax Returns</h2>
            </div>

            <div className="prose max-w-none">
              <div className="space-y-4 mb-6">
                <div className="bg-white border-l-4 border-blue-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Minor Errors (Typos, Small Math)</h4>
                  <p className="text-gray-700 text-sm">File amended return: resubmit on iTax with correction, include note explaining error, pay amendment fee (if any: usually KES 500-1,000), KRA updates records (2-3 days). Better to fix early than leave on record.</p>
                </div>

                <div className="bg-white border-l-4 border-blue-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Major Errors (Income/Expense Figures Wrong)</h4>
                  <p className="text-gray-700 text-sm">Submit amended return with corrected financial statements, If income underreported: may owe back tax + interest + penalties, If expenses overstated: lose deductions + owe difference. Accountant assistance recommended (they handle communication with KRA). Process: submit amendment + documentation + explanation.</p>
                </div>

                <div className="bg-white border-l-4 border-blue-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">After KRA Audit/Notice</h4>
                  <p className="text-gray-700 text-sm">If KRA identifies errors: respond within deadline (typically 14-30 days), explain discrepancies, provide supporting documentation, negotiate settlement if necessary. Hire accountant/tax advisor (critical at this stage). Ignoring KRA notice = auto-acceptance of their findings + penalties.</p>
                </div>

                <div className="bg-white border-l-4 border-blue-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Prevention: Double-Check Before Filing</h4>
                  <p className="text-gray-700 text-sm">Best approach: prevent errors before submission. Review form multiple times before submitting. Have accountant review. Cross-check figures against bank statements + documents. Verify calculations twice. Prevention cost (time/accountant) much less than correction/penalty cost.</p>
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-606 p-4 rounded-lg">
                <p className="text-gray-700 text-sm"><strong>Key point:</strong> Amended returns common (normal business practice). KRA accepts them. Small fee + time = corrected record. Don't ignore errors.</p>
              </div>
            </div>
          </section>

          {/* Hire Professionals */}
          <section id="hire-professionals" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-blue-606 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">When to Hire an Accountant or Tax Consultant</h2>
            </div>

            <div className="prose max-w-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white border-2 border-blue-200 rounded-xl p-5">
                  <h4 className="font-bold text-gray-900 mb-3">✓ DIY (Save Money)</h4>
                  <p className="text-gray-700 text-sm font-bold mb-2">File yourself if:</p>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Simple sole proprietor (no employees)</li>
                    <li>• Straightforward income</li>
                    <li>• No VAT (below KES 16M turnover)</li>
                    <li>• Comfortable with numbers</li>
                    <li>• Have basic accounting records</li>
                  </ul>
                  <p className="text-gray-700 text-xs mt-3 font-bold">Cost: KES 500-1,000 (filing fees only)</p>
                </div>

                <div className="bg-white border-2 border-orange-200 rounded-xl p-5">
                  <h4 className="font-bold text-gray-900 mb-3">⚠️ Hire Professional (Worth Cost)</h4>
                  <p className="text-gray-700 text-sm font-bold mb-2">Hire accountant if:</p>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Company with employees</li>
                    <li>• VAT registration (complex filings)</li>
                    <li>• Multiple income sources</li>
                    <li>• Complex expenses/deductions</li>
                    <li>• First time filing (confused about process)</li>
                  </ul>
                  <p className="text-gray-700 text-xs mt-3 font-bold">Cost: KES 5,000-50,000/year</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">What Accountants Provide</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Tax advice (which option saves most money)</li>
                    <li>• Records organization + bookkeeping</li>
                    <li>• Accurate financial statements preparation</li>
                    <li>• Tax return filing (on iTax)</li>
                    <li>• Compliance calendar management</li>
                    <li>• Audit defense + KRA communication</li>
                    <li>• Tax optimization strategies</li>
                    <li>• Year-round support + consulting</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">How to Find Accountant</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Ask business contacts for recommendations</li>
                    <li>• Check ICPAK (Institute of Certified Public Accountants Kenya) register</li>
                    <li>• Get quotes from 2-3 accountants</li>
                    <li>• Verify CPA certification (not just "accountant")</li>
                    <li>• Ask references (previous client feedback)</li>
                    <li>• Ensure they handle business tax filings specifically</li>
                    <li>• Negotiate fee + scope of services</li>
                  </ul>
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-606 p-5 rounded-lg">
                <p className="text-gray-700 text-sm"><strong>ROI Analysis:</strong> Accountant cost (KES 10,000-30,000) vs potential penalties (KES 100,000+) or missed deductions (KES 50,000+). Professional investment pays for itself quickly through tax savings + penalty avoidance.</p>
              </div>
            </div>
          </section>

          {/* Common Mistakes */}
          <section id="common-mistakes" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-606 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Common Mistakes to Avoid</h2>
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
                <p className="text-gray-700 text-sm"><strong>✓ Prevention tip:</strong> Most mistakes preventable. Double-check everything. Have second person review. Use accountant. Schedule calendar reminders. Invest in compliance = saves money long-term.</p>
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
              <h2 className="text-2xl font-bold mb-4">Ready to Get Your Business Taxes Sorted?</h2>
              <p className="text-blue-100 mb-6">Don't wait. Register for taxes today and ensure your business stays compliant and legally operational.</p>
              
              <div className="flex flex-wrap gap-3">
                <a href="https://itax.go.ke" target="_blank" rel="noopener noreferrer" className="bg-white text-blue-606 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Register on iTax Now
                </a>
                <a href="/kra-pin-and-tax-registration-kenya" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
                  KRA PIN Guide <ArrowRight className="w-5 h-5" />
                </a>
                <a href="/company-annual-returns-and-filing-kenya" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
                  Annual Returns <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </section>

          {/* Internal Links */}
          <section className="mt-12 pt-8 border-t-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Related Business Compliance Guides</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <a href="/how-to-register-business-kenya" className="p-4 border-2 border-blue-200 rounded-lg hover:shadow-lg transition-shadow hover:border-blue-606">
                <h4 className="font-bold text-gray-900 mb-1">How to Register a Business</h4>
                <p className="text-gray-600 text-sm">Complete business registration guide in Kenya</p>
              </a>
              <a href="/kra-pin-and-tax-registration-kenya" className="p-4 border-2 border-green-200 rounded-lg hover:shadow-lg transition-shadow hover:border-green-606">
                <h4 className="font-bold text-gray-900 mb-1">KRA PIN & Tax Registration</h4>
                <p className="text-gray-600 text-sm">Register for KRA PIN and start paying taxes</p>
              </a>
              <a href="/business-permits-licenses-kenya" className="p-4 border-2 border-orange-200 rounded-lg hover:shadow-lg transition-shadow hover:border-orange-606">
                <h4 className="font-bold text-gray-900 mb-1">Business Permits & Licenses</h4>
                <p className="text-gray-600 text-sm">Get business permits and operating licenses</p>
              </a>
              <a href="/company-annual-returns-and-filing-kenya" className="p-4 border-2 border-purple-200 rounded-lg hover:shadow-lg transition-shadow hover:border-purple-606">
                <h4 className="font-bold text-gray-900 mb-1">Company Annual Returns</h4>
                <p className="text-gray-600 text-sm">File CR12 annual returns and stay compliant</p>
              </a>
              <a href="/limited-company-registration-kenya" className="p-4 border-2 border-red-200 rounded-lg hover:shadow-lg transition-shadow hover:border-red-606">
                <h4 className="font-bold text-gray-900 mb-1">Limited Company Registration</h4>
                <p className="text-gray-600 text-sm">Register and incorporate a limited company</p>
              </a>
              <a href="/partnership-llp-registration-kenya" className="p-4 border-2 border-indigo-200 rounded-lg hover:shadow-lg transition-shadow hover:border-indigo-606">
                <h4 className="font-bold text-gray-900 mb-1">Partnership & LLP Registration</h4>
                <p className="text-gray-600 text-sm">Register a partnership or limited liability partnership</p>
              </a>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default BusinessTaxObligationsKenya;
