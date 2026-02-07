import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, AlertCircle, ArrowRight, FileText, DollarSign, Shield, Download, Users, Briefcase, Building2, TrendingUp, XCircle, Lock } from 'lucide-react';

const KRAPINRegistrationKenya = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // FAQ data
  const faqs = [
    {
      question: 'What is the difference between a personal PIN and a company PIN?',
      answer: 'Personal PIN = for individual sole proprietors, freelancers, self-employed (KRA Income Tax Law, Section 91). Company PIN = for limited companies, partnerships, trusts (Companies Act 2015, Section 11). Personal PIN used for personal income tax, VAT if sole trader. Company PIN used for corporate income tax, VAT, PAYE for employees, turnover tax. Cannot use personal PIN for company operations (illegal).'
    },
    {
      question: 'How much does a KRA PIN cost?',
      answer: 'KRA PIN registration is completely FREE (no government fees). Provided by Kenya Revenue Authority as public service. However, if you hire accountant/tax consultant to help: KES 5,000-20,000 professional fees (optional). No hidden charges, no annual PIN renewal fees. PIN is permanent once registered (Income Tax Act, Section 92).'
    },
    {
      question: 'Can I register for KRA PIN online via iTax?',
      answer: 'Yes, fully online via iTax portal (www.itax.kra.go.ke). Requires: valid Kenya ID or passport, email address, mobile number, business details. Takes 15-30 minutes to complete registration. PIN issued immediately upon successful registration (downloadable certificate). No office visit needed (KRA Digital Transformation Initiative).'
    },
    {
      question: 'What if I already have a business registered but no KRA PIN?',
      answer: 'Register immediately on iTax. Many businesses registered with BRELA (business name/company registration) but without KRA PIN = illegal. KRA will detect during audits. Penalties: KES 50,000+ fines + tax assessments + interest charges. Better to register now (free) than face penalties later.'
    },
    {
      question: 'Is KRA PIN same as company registration number?',
      answer: 'No, different. Company registration number = issued by BRELA (Business Registration Authority) when company incorporated. Shows company legally exists. KRA PIN = issued by Kenya Revenue Authority for tax purposes. Both required for limited companies. Sole proprietors: no company number, only KRA PIN for tax. (Companies Act 2015 vs Income Tax Act)'
    },
    {
      question: 'Do sole proprietors need a KRA PIN even with no employees?',
      answer: 'Yes, mandatory if: business income exceeds KES 500,000/year OR you want to register for VAT. Even if no income yet, register if operating business (Income Tax Act, Section 91). Penalties for non-registration: KES 50,000+ fines even if no tax owed. Free to register, no excuses.'
    },
    {
      question: 'What if I lose my PIN certificate or forgot my PIN number?',
      answer: 'PIN number is permanent and unique. Can retrieve anytime: log into iTax account, download certificate again. Or call KRA +254 20 3283222. Certificate: can be re-downloaded for free anytime from iTax. No replacement fees. PIN number never changes even if you change address, business structure, etc.'
    },
    {
      question: 'Can I have multiple KRA PINs for different businesses?',
      answer: 'Each business = separate PIN. If you have 2 sole proprietorships: register 2 PINs (Income Tax Act, Section 91). If 2 limited companies: each company gets 1 PIN. Cannot reuse same PIN for different businesses (system prevents duplicate). Must register each separately on iTax. Helps KRA track income per business source.'
    },
    {
      question: 'What happens if I do not register for a KRA PIN?',
      answer: 'Operating illegally. Consequences: KES 50,000-100,000+ penalties, tax assessments with backdated interest (can reach KES 500,000+), business bank accounts frozen, cannot get loans/contracts. If caught during audit: criminal prosecution possible (Income Tax Act, Section 147). Government increasingly tracking unregistered businesses via mobile money, bank transfers.'
    },
    {
      question: 'After registering KRA PIN, what are my next tax obligations?',
      answer: 'File tax returns annually (ITR/ITR-D forms) by June 30 each year. If VAT registered: file VAT returns monthly/quarterly. If PAYE: deduct employee taxes monthly, submit to KRA. If turnover tax: file monthly declarations. Failure to file = penalties + fines. Accurate filing = business protected, eligible for contracts, loans, government tenders (Income Tax Act, Sections 91-100).'
    },
    {
      question: 'Can I register VAT at the same time as KRA PIN?',
      answer: 'Yes. VAT registration separate process but can do simultaneously on iTax. Requirements: turnover exceeds KES 5M/year (for small traders) OR KES 1M/year (if manufacturing). Eligible to register voluntarily if below. VAT adds compliance (monthly/quarterly filings) but benefits: reclaim input VAT from suppliers, more professional (VAT Act 2013).'
    },
    {
      question: 'Is KRA PIN required for getting business permits/licenses?',
      answer: 'Yes, often required. County permits, business licenses, food permits, alcohol licenses, pharmacy licenses: usually need KRA PIN. Private sector contracts: KRA PIN mandatory. Government tenders: MANDATORY (Public Procurement and Asset Disposal Act). Better to have PIN before applying for permits.'
    },
    {
      question: 'What if my business changed from sole proprietor to limited company?',
      answer: 'Close old sole proprietor PIN (file final return). Register new company PIN (file KRA PIN for new limited company). Cannot reuse personal PIN for company operations. Both at different times in iTax. Process: ~30-45 days total. Hire accountant to ensure smooth transition, avoid penalties.'
    },
    {
      question: 'Can a non-citizen register for a KRA PIN?',
      answer: 'Yes. Non-citizens (with passport) can register personal/company PINs in Kenya if operating business here. Foreign company branch: requires PIN + company registration. Process identical to citizens. Passport used instead of Kenya ID. Non-citizens subject to same tax laws (Income Tax Act Section 3-4, applies universally).'
    },
    {
      question: 'How long is KRA PIN certificate valid?',
      answer: 'KRA PIN never expires. Certificate valid permanently. You don\'t renew PIN (unlike some licenses). PIN active as long as you operate business. Can be deactivated only if: you close business formally (deregistration) OR struck off by BRELA (limited company). Otherwise, PIN remains active indefinitely.'
    }
  ];

  // Registration steps
  const registrationSteps = [
    {
      number: 1,
      title: 'Prepare Required Information',
      description: 'Gather: valid Kenya ID/passport number, mobile number, email address, business name, business address, nature of business, expected annual income/turnover. Have business registration documents ready (if already registered with BRELA).'
    },
    {
      number: 2,
      title: 'Go to iTax Website',
      description: 'Visit www.itax.kra.go.ke in web browser (works on desktop, mobile, tablet). No special software needed. Internet connection required.'
    },
    {
      number: 3,
      title: 'Click "Register New Account"',
      description: 'On iTax homepage, look for "New User?" section. Click "Register Here" or "Create Account". You\'ll see registration form.'
    },
    {
      number: 4,
      title: 'Enter Personal Details',
      description: 'Fill in: ID number/passport, first name, last name, mobile number, email address. Verify email immediately (KRA sends confirmation link). Must use VALID email (you\'ll need it for PIN certificate).'
    },
    {
      number: 5,
      title: 'Create Login Password',
      description: 'Set strong password: minimum 8 characters, mix of uppercase + lowercase + numbers + symbols. Write down password safely (can reset later if forgotten via email).'
    },
    {
      number: 6,
      title: 'Answer Security Questions',
      description: 'KRA asks 2-3 security questions (mother\'s maiden name, birthplace, etc.). Answer accurately. Used for account recovery if password forgotten.'
    },
    {
      number: 7,
      title: 'Accept Terms & Conditions',
      description: 'Read and check "I agree to KRA terms & conditions". Terms cover data privacy, tax obligations, penalties for false declaration. Declaration carries legal weight.'
    },
    {
      number: 8,
      title: 'Submit Registration Form',
      description: 'Click "Submit" or "Register". System processes form (usually instant). If errors: red messages show required fields. Correct and resubmit.'
    },
    {
      number: 9,
      title: 'Receive Registration Confirmation',
      description: 'Email sent to registered address confirming account created. Check spam folder if not found. Email may take 2-5 minutes to arrive.'
    },
    {
      number: 10,
      title: 'Log In to iTax Account',
      description: 'Use registered email + password to log into iTax. Once logged in, you see dashboard. Save bookmark for www.itax.kra.go.ke for future logins.'
    },
    {
      number: 11,
      title: 'Start KRA PIN Application',
      description: 'From dashboard: click "Apply for PIN" or "Register for PIN" option. System shows: "Individual PIN", "Company PIN", "Partnership PIN". Select correct type for your business.'
    },
    {
      number: 12,
      title: 'Fill Business Details',
      description: 'Provide: business name (exact), type of business (trading, professional, farming, etc.), business address (where you operate from), expected annual turnover. Honest estimates (consequences for false declaration).'
    },
    {
      number: 13,
      title: 'Select Tax Obligations',
      description: 'Choose which taxes apply: Income Tax (mandatory for all), VAT (if turnover exceeds KES 5M), PAYE (if have employees), Turnover Tax (for small traders under KES 5M). Select all that apply to you.'
    },
    {
      number: 14,
      title: 'Verify Information & Submit',
      description: 'Review all entered data carefully (KRA matches against government records). False information = crime (perjury). Once verified: click "Submit Application".'
    },
    {
      number: 15,
      title: 'Receive KRA PIN Certificate',
      description: 'Immediately upon approval (usually same day): PIN certificate generated. Download as PDF from iTax account. Shows: PIN number, business name, registered address, issue date. Save securely (you\'ll need for bank account, licenses, contracts).'
    }
  ];

  // Tax types table
  const taxTypes = [
    {
      tax: 'Income Tax',
      description: 'Tax on business profit (revenue minus expenses)',
      whoNeeds: 'All businesses',
      rateOrDetails: 'Ranges 10%-35% depending on income bracket',
      filing: 'Annual by June 30'
    },
    {
      tax: 'VAT (Value Added Tax)',
      description: 'Tax on goods/services sold (14% standard rate)',
      whoNeeds: 'Turnover exceeds KES 5M/year (mandatory) or voluntary',
      rateOrDetails: '14% on supplies (some zero-rated)',
      filing: 'Monthly or quarterly returns'
    },
    {
      tax: 'PAYE (Pay As You Earn)',
      description: 'Employee income tax deducted by employer',
      whoNeeds: 'Businesses with employees',
      rateOrDetails: 'Deducted from employee salary (5%-30.5% range)',
      filing: 'Monthly to KRA'
    },
    {
      tax: 'Turnover Tax',
      description: 'Simple tax for small traders (3% on turnover)',
      whoNeeds: 'Sole traders, turnover KES 500K-5M/year',
      rateOrDetails: '3% of total turnover (simplified)',
      filing: 'Monthly declarations'
    }
  ];

  // Documents required
  const documentsRequired = [
    { document: 'Kenya ID or Passport', required: 'Yes', notes: 'For identification, must be valid' },
    { document: 'Business Name (if registered with BRELA)', required: 'Recommended', notes: 'For continuity, match BRELA records' },
    { document: 'Business Address', required: 'Yes', notes: 'Where business operates from' },
    { document: 'Mobile Number', required: 'Yes', notes: 'For SMS notifications from KRA' },
    { document: 'Email Address', required: 'Yes', notes: 'For PIN certificate, KRA communications' },
    { document: 'Expected Turnover Estimate', required: 'Yes', notes: 'Annual business revenue projection' },
    { document: 'Company Registration (if Ltd)', required: 'If applicable', notes: 'CR12 certificate for companies' },
    { document: 'Bank Details', required: 'Optional', notes: 'May be needed for tax refunds later' }
  ];

  // Common errors
  const commonErrors = [
    {
      error: 'PIN Not Issued (System Rejected Application)',
      cause: 'Duplicate business name in KRA system, mismatched ID/name data, ID number invalid/expired',
      fix: 'Contact KRA: clarify duplicate, update ID if expired, or use different business name variant'
    },
    {
      error: 'PIN Certificate Shows Wrong Name/Address',
      cause: 'Data entry error during registration, BRELA records don\'t match iTax entry',
      fix: 'File CR2 form (director/address change) with BRELA or contact KRA to amend iTax records'
    },
    {
      error: 'Cannot Access iTax Account (Locked Out)',
      cause: 'Forgotten password, email not verified, account temporarily locked after wrong login attempts',
      fix: 'Use "Forgot Password" link on iTax, reset via email. Or call KRA +254 20 3283222'
    },
    {
      error: 'PIN Already Exists (System Says You\'re Already Registered)',
      cause: 'Someone else registered PIN under your name/ID, duplicate registration attempt',
      fix: 'Verify if YOU already registered (check email for confirmation). If fraud: report to KRA'
    },
    {
      error: 'Turnover Tax PIN Issued Instead of Income Tax',
      cause: 'Entered estimated turnover under KES 5M, KRA assigned turnover tax by default',
      fix: 'Contact KRA, request change to Income Tax PIN if eligible (if business likely exceed KES 5M)'
    },
    {
      error: 'VAT Registration Rejected',
      cause: 'Turnover projection too low (under KES 5M), or VAT number already exists',
      fix: 'Reapply once turnover confirmed to exceed KES 5M. Can voluntarily register once threshold approached'
    }
  ];

  // Penalties table
  const penalties = [
    { offense: 'Operating without KRA PIN', penalty: 'KES 50,000-100,000 fine (minimum)' },
    { offense: 'Late tax filing (after deadline)', penalty: 'KES 5,000-50,000 fine + interest charges' },
    { offense: 'False PIN declaration', penalty: 'Criminal prosecution, imprisonment possible' },
    { offense: 'Not registering VAT when required', penalty: 'KES 100,000+ fine + VAT assessment' },
    { offense: 'Not deducting employee PAYE', penalty: 'KES 50,000-100,000 fine + back taxes due' },
    { offense: 'Non-compliant tax records', penalty: 'KES 100,000+ fine + business audit' }
  ];

  // Compliance checklist
  const complianceChecklist = [
    'ID or passport number correct & valid?',
    'Email address verified & active (check spam folder)?',
    'Business name matches BRELA registration (if applicable)?',
    'Business address is actual operating location?',
    'Turnover estimate realistic (not inflated/understated)?',
    'Selected correct tax type(s) (Income Tax, VAT, PAYE)?',
    'PIN certificate downloaded & saved securely?',
    'PIN number written down in safe place?',
    'PIN used correctly on bank forms, contracts, licenses?',
    'Tax filing calendar marked (due dates for returns)?',
    'Accountant arranged (if needed for large business)?',
    'Business records system set up (invoices, receipts)?'
  ];

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'what-is', 'why-needed', 'tax-types', 'requirements', 'registration-steps', 'company-pin', 'sole-pin', 'documents', 'download-cert', 'common-errors', 'after-registration', 'penalties', 'hire-help', 'faqs'];
      
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
        <title>KRA PIN Registration Kenya – iTax Guide 2025</title>
        <meta name="description" content="Complete guide to KRA PIN registration for businesses & companies in Kenya. Step-by-step iTax registration, costs, documents, penalties & tax compliance guide." />
        <link rel="canonical" href="https://yoursite.com/kra-pin-for-business-kenya" />
        
        {/* OpenGraph */}
        <meta property="og:title" content="KRA PIN Registration Kenya – Complete iTax Guide 2025" />
        <meta property="og:description" content="Step-by-step guide to registering for a KRA PIN in Kenya via iTax. All business types, free registration, tax obligations & compliance requirements." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://yoursite.com/kra-pin-for-business-kenya" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1460925895917-aeb19be489c7?w=1200&h=630&fit=crop" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="KRA PIN Registration Kenya – Complete iTax Guide 2025" />
        <meta name="twitter:description" content="Step-by-step KRA PIN registration guide for all business types. Free, online, 15-30 minutes. Tax compliance & penalties explained." />
        <meta name="twitter:image" content="https://images.unsplash.com/photo-1460925895917-aeb19be489c7?w=1200&h=630&fit=crop" />
        
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
            "description": "Tax and business compliance services in Kenya"
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
                "name": "KRA PIN Registration Kenya",
                "item": "https://yoursite.com/kra-pin-for-business-kenya"
              }
            ]
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Register for a KRA PIN in Kenya",
            "description": "Step-by-step guide to registering for KRA PIN via iTax in Kenya",
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
              <DollarSign className="w-8 h-8 flex-shrink-0" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">KRA PIN Registration for Businesses & Companies in Kenya</h1>
            </div>
            <p className="text-blue-100 text-lg max-w-3xl">Complete guide to registering for a KRA PIN via iTax. Learn tax obligations, registration steps, penalties, and compliance requirements for all business types in Kenya.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="https://itax.kra.go.ke" target="_blank" rel="noopener noreferrer" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Register on iTax
              </a>
              <a href="/how-to-register-business-kenya" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
                Business Registration Guide <ArrowRight className="w-5 h-5" />
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
              <li>KRA PIN Registration</li>
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
                    { id: 'what-is', label: 'What is KRA PIN' },
                    { id: 'why-needed', label: 'Why Needed' },
                    { id: 'tax-types', label: 'Tax Types' },
                    { id: 'requirements', label: 'Requirements' },
                    { id: 'registration-steps', label: 'Registration Steps' },
                    { id: 'company-pin', label: 'Company PIN' },
                    { id: 'sole-pin', label: 'Sole Proprietor PIN' },
                    { id: 'documents', label: 'Documents' },
                    { id: 'download-cert', label: 'Download Certificate' },
                    { id: 'common-errors', label: 'Common Errors' },
                    { id: 'after-registration', label: 'After Registration' },
                    { id: 'penalties', label: 'Penalties' },
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
                    { id: 'what-is', label: 'What is a KRA PIN' },
                    { id: 'why-needed', label: 'Why Every Business Needs PIN' },
                    { id: 'tax-types', label: 'Types of Tax Registrations' },
                    { id: 'requirements', label: 'Requirements Before Registration' },
                    { id: 'registration-steps', label: 'Registration Steps' },
                    { id: 'company-pin', label: 'Company PIN Registration' },
                    { id: 'sole-pin', label: 'Sole Proprietor PIN' },
                    { id: 'documents', label: 'Documents Required' },
                    { id: 'download-cert', label: 'Download PIN Certificate' },
                    { id: 'common-errors', label: 'Common Errors & Fixes' },
                    { id: 'after-registration', label: 'After Registration' },
                    { id: 'penalties', label: 'Penalties for Non-Registration' },
                    { id: 'hire-help', label: 'When to Hire an Accountant' },
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
                  <DollarSign className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Overview: KRA PIN Registration</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                    <strong>KRA PIN</strong> (Kenya Revenue Authority Personal Identification Number) is a unique 10-digit identifier that every business owner, company, and self-employed person must register with the Kenya Revenue Authority for tax purposes. This guide explains what a KRA PIN is, why you need it, and complete step-by-step instructions for registering via iTax.
                  </p>

                  <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border-l-4 border-blue-600">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-700 mb-1">FREE</div>
                        <div className="text-xs text-gray-600">Registration Cost</div>
                        <p className="text-sm text-gray-700 mt-2">No government fees</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-700 mb-1">15-30 Min</div>
                        <div className="text-xs text-gray-600">Registration Time</div>
                        <p className="text-sm text-gray-700 mt-2">Online via iTax</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-700 mb-1">Permanent</div>
                        <div className="text-xs text-gray-600">PIN Validity</div>
                        <p className="text-sm text-gray-700 mt-2">Never expires</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded-lg mb-6">
                    <h4 className="font-bold text-gray-900 mb-2">Key Facts About KRA PIN</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Mandatory:</strong> All businesses must register (Income Tax Act, Section 91)</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Free to Register:</strong> KES 0 cost (provided by Kenya Revenue Authority)</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Online Process:</strong> Register via iTax portal in 15-30 minutes</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Unique Identifier:</strong> Each business gets one PIN (permanent, never changes)</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Required for:</strong> Bank accounts, business licenses, government contracts, loans</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* What is KRA PIN */}
              <section id="what-is" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What is a KRA PIN?</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">KRA PIN stands for Kenya Revenue Authority Personal Identification Number. It's a unique 10-digit number assigned by the Kenya Revenue Authority to identify a business entity for tax purposes.</p>

                  <img 
                    src="https://images.unsplash.com/photo-1460925895917-aeb19be489c7?w=800&h=400&fit=crop"
                    alt="KRA PIN Registration"
                    className="rounded-lg shadow-lg w-full mb-6"
                  />

                  <div className="bg-white border-2 border-gray-200 p-6 rounded-xl mb-6">
                    <h4 className="font-bold text-gray-900 mb-3">KRA PIN Details</h4>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex gap-3">
                        <span className="text-blue-600 font-bold">•</span>
                        <span><strong>Format:</strong> 10-digit number (e.g., A001234567X). Contains letters and numbers.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-blue-600 font-bold">•</span>
                        <span><strong>Issued by:</strong> Kenya Revenue Authority (KRA), government tax authority</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-blue-600 font-bold">•</span>
                        <span><strong>Valid for:</strong> Lifetime. Never expires (Income Tax Act, Section 92). Can be deactivated only if you close business.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-blue-600 font-bold">•</span>
                        <span><strong>Certificate:</strong> Downloadable PDF certificate showing PIN, business name, address, issue date</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-blue-600 font-bold">•</span>
                        <span><strong>Public Record:</strong> Businesses can search others' PIN status (transparency)</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-cyan-50 border-l-4 border-cyan-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>Not to be confused with:</strong> PAYE reference number (employer ID for payroll), company registration number (from BRELA), business license number (from county), KRA TCC (Tax Compliance Certificate). All different from KRA PIN.</p>
                  </div>
                </div>
              </section>

              {/* Why Needed */}
              <section id="why-needed" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Why Every Business Needs a KRA PIN</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">KRA PIN is not optional—it's mandatory by law for all business operations in Kenya:</p>

                  <div className="space-y-4 mb-6">
                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">🏛️ Legal Requirement (Income Tax Act)</h4>
                      <p className="text-gray-700 text-sm">Section 91 of Income Tax Act mandates all businesses register for PIN. Operating without PIN = illegal. KRA actively audits and penalizes non-registered businesses (Section 147).</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">💼 Required for Business Operations</h4>
                      <p className="text-gray-700 text-sm">Banks require PIN to open business accounts. Cannot make bank transfers without PIN verification. Landlords ask for PIN when signing leases. Suppliers request PIN for credit terms.</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">📜 Required for Licenses & Permits</h4>
                      <p className="text-gray-700 text-sm">County permits, business licenses, trade licenses: nearly all require PIN. Food licenses, alcohol licenses, pharmacy licenses: require PIN. Cannot get permits without showing KRA PIN compliance.</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">🤝 Required for Government Contracts</h4>
                      <p className="text-gray-700 text-sm">Public Procurement and Asset Disposal Act (PPADA) MANDATES current KRA PIN for government tenders. Cannot bid on government contracts without PIN. Eliminates majority of large revenue opportunities.</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">💰 Required for Bank Loans</h4>
                      <p className="text-gray-700 text-sm">Banks check KRA PIN status before approving loans. PIN shows tax compliance history. No PIN = no loans (banks won't lend to unregistered businesses).</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">⚖️ Protects Against Legal Issues</h4>
                      <p className="text-gray-700 text-sm">PIN registration proves you're legitimate business owner. Protects against fraud accusations, helps resolve disputes. Unregistered businesses have no legal standing in contracts.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Tax Types */}
              <section id="tax-types" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Types of Tax Registrations Explained</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">When registering for KRA PIN, you'll see different tax types. Here's what each means:</p>

                  <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6 overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">Tax Type</th>
                          <th className="px-4 py-3 text-left font-semibold">What It Is</th>
                          <th className="px-4 py-3 text-left font-semibold">Who Needs It</th>
                          <th className="px-4 py-3 text-left font-semibold">Rate/Details</th>
                          <th className="px-4 py-3 text-left font-semibold">Filing</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {taxTypes.map((tax, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-semibold text-gray-900 text-sm">{tax.tax}</td>
                            <td className="px-4 py-3 text-gray-700 text-sm">{tax.description}</td>
                            <td className="px-4 py-3 text-gray-700 text-sm">{tax.whoNeeds}</td>
                            <td className="px-4 py-3 text-gray-700 text-sm">{tax.rateOrDetails}</td>
                            <td className="px-4 py-3 text-gray-700 text-sm">{tax.filing}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>📌 What to Select:</strong> When registering on iTax, select ALL taxes that apply to your business. Income Tax is mandatory for everyone. VAT if turnover exceeds KES 5M. PAYE if you have employees. Turnover Tax if sole trader under KES 5M (optional but recommended). Don't skip—it's better to register all applicable taxes upfront than amend later.</p>
                  </div>
                </div>
              </section>

              {/* Requirements */}
              <section id="requirements" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Requirements Before Registration</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Before starting KRA PIN registration on iTax, gather these documents/information:</p>

                  <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6 overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">Document/Information</th>
                          <th className="px-4 py-3 text-left font-semibold">Required?</th>
                          <th className="px-4 py-3 text-left font-semibold">Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {documentsRequired.map((doc, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-semibold text-gray-900 text-sm">{doc.document}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={doc.required === 'Yes' ? 'text-green-700 font-semibold' : doc.required === 'Recommended' ? 'text-yellow-700 font-semibold' : 'text-blue-700 font-semibold'}>
                                {doc.required}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-700 text-sm">{doc.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>✅ Preparation Checklist:</strong> Have valid ID/passport ready. Know your mobile number & email (will be used for PIN certificate). Know business name & address. Have estimate of annual business income. Everything digital—no office visit needed.</p>
                  </div>
                </div>
              </section>

              {/* Registration Steps */}
              <section id="registration-steps" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Step-by-Step KRA PIN Registration on iTax</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Complete guide to registering for KRA PIN online. Takes 15-30 minutes:</p>

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

                  <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>✅ Success?</strong> Once PIN issued, you'll see 10-digit PIN number on screen. Download PDF certificate immediately. Save certificate to email/cloud (Google Drive, Dropbox). Print copy for bank forms, licenses, contracts. PIN issued = registration complete.</p>
                  </div>
                </div>
              </section>

              {/* Company PIN */}
              <section id="company-pin" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Building2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How to Register a Company PIN (Ltd & PLC)</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Limited companies and public companies register KRA PIN differently from sole proprietors:</p>

                  <div className="space-y-4 mb-6">
                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">📋 Who Registers on iTax?</h4>
                      <p className="text-gray-700 text-sm">Company director registers on iTax (not shareholders). Director has authority to bind company legally. Use director's personal details (ID, email, mobile) to register. System will ask for company details (CR12 number, company name, registered address). Company PIN then issued to company, not director.</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">🏢 Documents Required (Company PIN)</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• <strong>Director's ID/Passport:</strong> For iTax account creation</li>
                        <li>• <strong>CR12 Certificate:</strong> Company registration document (from BRELA)</li>
                        <li>• <strong>Company Name (exact):</strong> As on CR12 certificate</li>
                        <li>• <strong>Registered Address:</strong> Company's official address</li>
                        <li>• <strong>Director's Email & Mobile:</strong> For PIN certificate</li>
                      </ul>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">✅ Company PIN Registration Process</h4>
                      <p className="text-gray-700 text-sm">
                        <strong>Step 1:</strong> Director creates iTax account (as for individual PIN) <br/>
                        <strong>Step 2:</strong> Log in, select "Apply for PIN" → choose "Company PIN" <br/>
                        <strong>Step 3:</strong> Enter CR12 number, company name, registered address <br/>
                        <strong>Step 4:</strong> Select taxes: Income Tax (mandatory), VAT (if turnover exceeds KES 5M), PAYE (if employees), etc. <br/>
                        <strong>Step 5:</strong> Review and submit <br/>
                        <strong>Step 6:</strong> Company PIN issued immediately (downloadable certificate) <br/>
                        <strong>Step 7:</strong> Save certificate (use for bank account, licenses, contracts)
                      </p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">⏱️ Timeline</h4>
                      <p className="text-gray-700 text-sm">Director iTax account: 10-15 minutes. Company PIN issuance: immediate (same day). Total: 20-30 minutes. No waiting period.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Sole Proprietor PIN */}
              <section id="sole-pin" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Users className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How to Register a Sole Proprietor PIN</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Sole proprietors register personal business PINs using their own identity:</p>

                  <div className="space-y-4 mb-6">
                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">👤 Who Can Register</h4>
                      <p className="text-gray-700 text-sm">Individual sole proprietor with valid Kenya ID or passport. Business registered with BRELA (business name) or unregistered (can still get PIN). You are the business (not a separate legal entity like company).</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">📋 Documents Required (Sole Proprietor PIN)</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• <strong>Kenya ID or Passport:</strong> Valid government ID</li>
                        <li>• <strong>Business Name:</strong> Registered with BRELA or proposed name</li>
                        <li>• <strong>Business Address:</strong> Where you operate from (home office okay)</li>
                        <li>• <strong>Email Address:</strong> For iTax account & PIN certificate</li>
                        <li>• <strong>Mobile Number:</strong> For SMS notifications</li>
                      </ul>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">✅ Sole Proprietor PIN Process</h4>
                      <p className="text-gray-700 text-sm">
                        <strong>Step 1:</strong> Create iTax account using your personal ID number, email, mobile <br/>
                        <strong>Step 2:</strong> Log in, select "Apply for PIN" → choose "Individual PIN" or "Sole Proprietor PIN" <br/>
                        <strong>Step 3:</strong> Enter business name, business address, nature of business <br/>
                        <strong>Step 4:</strong> Select taxes: Income Tax (mandatory), VAT (if turnover exceeds KES 5M), Turnover Tax (if small trader), etc. <br/>
                        <strong>Step 5:</strong> Declare: you are sole proprietor, this is your business <br/>
                        <strong>Step 6:</strong> Review & submit <br/>
                        <strong>Step 7:</strong> PIN issued immediately (PDF certificate) <br/>
                        <strong>Step 8:</strong> Download, save, print for business use
                      </p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">⏱️ Timeline</h4>
                      <p className="text-gray-700 text-sm">Entire process: 15-20 minutes. PIN issued same day. No office visit required.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Documents Required */}
              <section id="documents" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Documents Required for KRA PIN Registration</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Complete list of documents you'll need to submit during iTax registration:</p>

                  <div className="space-y-3 mb-6">
                    {documentsRequired.map((item, index) => (
                      <div key={index} className="bg-white border-2 border-gray-200 p-4 rounded-lg">
                        <div className="flex gap-3 mb-1">
                          <span className="font-semibold text-gray-900">{item.document}</span>
                          <span className={item.required === 'Yes' ? 'text-green-700 font-semibold text-sm' : item.required === 'Recommended' ? 'text-yellow-700 font-semibold text-sm' : 'text-blue-700 font-semibold text-sm'}>
                            {item.required}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm">{item.notes}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>✅ No Physical Documents:</strong> iTax registration is entirely online. You don't mail or submit physical documents. Just enter information on form. System verifies against government records (ID database, BRELA).</p>
                  </div>
                </div>
              </section>

              {/* Download Certificate */}
              <section id="download-cert" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Download className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How to Download the PIN Certificate</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Once your KRA PIN is approved, download and save the certificate:</p>

                  <div className="bg-white border-2 border-blue-200 p-6 rounded-xl mb-6">
                    <h4 className="font-bold text-gray-900 mb-4">📥 Download Process</h4>
                    <ol className="space-y-3 text-gray-700 text-sm list-decimal list-inside">
                      <li>Log into iTax account (www.itax.kra.go.ke)</li>
                      <li>Navigate to "My PIN" or "PIN Certificate" section</li>
                      <li>Locate your registered PIN number</li>
                      <li>Click "Download Certificate" or "Get Certificate" button</li>
                      <li>PDF file downloads to your computer (usually named "PIN_Certificate.pdf")</li>
                      <li>Open PDF, verify PIN number, business name, address, issue date</li>
                      <li>Save to email/cloud account (Gmail, Dropbox, Google Drive)</li>
                      <li>Print copy to keep physically (for banks, government offices)</li>
                    </ol>
                  </div>

                  <div className="bg-white border-2 border-blue-200 p-6 rounded-xl mb-6">
                    <h4 className="font-bold text-gray-900 mb-3">📋 What the Certificate Shows</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• <strong>PIN Number:</strong> 10-digit unique identifier</li>
                      <li>• <strong>Business Name:</strong> As registered</li>
                      <li>• <strong>Registered Address:</strong> Your business address</li>
                      <li>• <strong>Issue Date:</strong> When PIN was registered</li>
                      <li>• <strong>Tax Registrations:</strong> Which taxes you registered for (Income Tax, VAT, PAYE, etc.)</li>
                      <li>• <strong>KRA Seal/Signature:</strong> Official document proof</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-lg mb-6">
                    <p className="text-gray-700 text-sm"><strong>✅ Use Certificate For:</strong> Opening bank accounts (banks require PIN certificate), applying for business licenses/permits, government tender applications, loan applications, contracts with clients/suppliers.</p>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>📌 Important:</strong> Certificate available to download anytime from iTax account (no time limit). Free to re-download. Never expires. If lost, simply log in and download again.</p>
                  </div>
                </div>
              </section>

              {/* Common Errors */}
              <section id="common-errors" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Common Errors & Fixes</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Common problems during KRA PIN registration and how to fix them:</p>

                  <div className="space-y-3 mb-6">
                    {commonErrors.map((item, index) => (
                      <div key={index} className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                        <h4 className="font-bold text-gray-900 mb-2">❌ {item.error}</h4>
                        <p className="text-gray-700 text-sm mb-1"><strong>Cause:</strong> {item.cause}</p>
                        <p className="text-gray-700 text-sm"><strong>Fix:</strong> {item.fix}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>Contact KRA:</strong> If issue persists, contact KRA support: +254 20 3283222 (hotline) or email: info@kra.go.ke. Hours: 8 AM - 5 PM, Monday-Friday. Have your ID number ready.</p>
                  </div>
                </div>
              </section>

              {/* After Registration */}
              <section id="after-registration" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What to Do After Registration (Next Steps)</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">After your KRA PIN is approved, follow these next steps:</p>

                  <div className="space-y-4 mb-6">
                    <div className="bg-white border-2 border-green-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">🏦 Open Business Bank Account</h4>
                      <p className="text-gray-700 text-sm">Go to bank with PIN certificate + ID. Open business account in business name. Provide PIN number to bank. Banks use PIN to verify tax compliance. Account setup takes 3-7 days.</p>
                    </div>

                    <div className="bg-white border-2 border-green-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">📄 Get Business Licenses & Permits</h4>
                      <p className="text-gray-700 text-sm">With PIN certificate, apply for county/municipal licenses (trading license, business permit). Industry-specific: food handling license (restaurants), alcohol license (bars), pharmacy license, etc. Most require PIN. Takes 1-4 weeks depending on county.</p>
                    </div>

                    <div className="bg-white border-2 border-green-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">📊 Set Up Accounting System</h4>
                      <p className="text-gray-700 text-sm">Implement bookkeeping (QuickBooks, Sage, or manual ledger). Track: sales/revenue, expenses, assets, liabilities. Save: invoices, receipts, bank statements, payment records. Required for annual tax filing.</p>
                    </div>

                    <div className="bg-white border-2 border-green-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">📅 Know Tax Filing Deadlines</h4>
                      <p className="text-gray-700 text-sm">Income tax returns: due June 30 each year. VAT returns: monthly or quarterly (if registered). PAYE: monthly (if employees). Turnover tax: monthly (if applicable). File on time = no penalties. Late = KES 5,000-50,000+ fines.</p>
                    </div>

                    <div className="bg-white border-2 border-green-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">👨‍💼 Consider Hiring Accountant</h4>
                      <p className="text-gray-700 text-sm">If turnover exceeds KES 5M or complex business: hire accountant. Cost: KES 10,000-50,000/year. Ensures accurate tax filing, identifies deductions, reduces audit risk. Pays for itself through tax savings.</p>
                    </div>

                    <div className="bg-white border-2 border-green-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">🔄 Update Information if Business Changes</h4>
                      <p className="text-gray-700 text-sm">If business address changes, register new address with KRA/county. If business structure changes (sole proprietor → company), register new PIN. If add employees, register for PAYE. Keep KRA records current.</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">📋 After-Registration Checklist</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      {complianceChecklist.map((item, index) => (
                        <li key={index} className="flex gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              {/* Penalties */}
              <section id="penalties" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <XCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Penalties for Non-Registration & Non-Compliance</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Consequences of not registering for KRA PIN or failing to comply with tax laws (Income Tax Act, Section 147):</p>

                  <div className="bg-white border-2 border-red-200 rounded-xl overflow-hidden shadow-sm mb-6 overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-red-600 text-white">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">Non-Compliance Offense</th>
                          <th className="px-4 py-3 text-left font-semibold">Penalty</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {penalties.map((item, index) => (
                          <tr key={index} className="hover:bg-red-50">
                            <td className="px-4 py-3 font-medium text-gray-900">{item.offense}</td>
                            <td className="px-4 py-3 text-red-700 font-bold">{item.penalty}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg space-y-3">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">💰 Total Cost of Non-Compliance</h4>
                      <p className="text-gray-700 text-sm">Operating 2 years without PIN: KES 50,000 initial fine + KES 100,000+ tax assessments with interest = KES 150,000-500,000+. Compare: PIN registration = FREE. Not worth the risk.</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">🚨 Escalation</h4>
                      <p className="text-gray-700 text-sm">KRA increasingly detecting unregistered businesses via mobile money tracking, bank transfers, government records. Penalties enforced aggressively. Better to register now (free) than be caught later (very expensive).</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">⚖️ Criminal Prosecution</h4>
                      <p className="text-gray-700 text-sm">Willful non-compliance with tax laws = criminal offense. Possible imprisonment (Section 147, Income Tax Act). Rarely enforced for first-time offenders, but possible for repeat violations or large amounts.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Hire Help */}
              <section id="hire-help" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Briefcase className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">When to Hire an Accountant or Tax Consultant</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">You can register for KRA PIN yourself (DIY), but sometimes professional help is valuable:</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        DIY Registration (No Professional)
                      </h4>
                      <p className="text-gray-700 text-sm mb-2"><strong>Good for:</strong></p>
                      <ul className="space-y-1 text-gray-700 text-sm">
                        <li>• Sole proprietors, small traders</li>
                        <li>• Simple business (no employees)</li>
                        <li>• Turnover under KES 5M</li>
                        <li>• Budget-conscious (saves KES 5,000-20,000)</li>
                      </ul>
                    </div>

                    <div className="bg-white border-2 border-green-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        Hire Professional Accountant
                      </h4>
                      <p className="text-gray-700 text-sm mb-2"><strong>Recommended for:</strong></p>
                      <ul className="space-y-1 text-gray-700 text-sm">
                        <li>• Limited companies (complex)</li>
                        <li>• Turnover exceeds KES 5M</li>
                        <li>• Has employees (PAYE required)</li>
                        <li>• Multiple income sources</li>
                        <li>• Wants expert guidance</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>Accountant Costs:</strong> KES 5,000-20,000 for KRA PIN registration + KES 10,000-50,000/year for tax compliance. Investments in experts pay off: identify deductions, reduce audit risk, ensure timely filing, avoid penalties.</p>
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
                <h3 className="text-2xl font-bold mb-4">Ready to Register Your KRA PIN?</h3>
                <p className="text-blue-100 mb-6 max-w-2xl mx-auto">Register on iTax today. It's free, takes 15-30 minutes, and is completely online. Get your PIN certificate instantly.</p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <a href="https://itax.kra.go.ke" target="_blank" rel="noopener noreferrer" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 inline-flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Register on iTax
                  </a>
                  <a href="/how-to-register-business-kenya" className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold inline-flex items-center gap-2">
                    Business Registration Guide <ArrowRight className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Related Links */}
              <div className="bg-gray-100 rounded-xl p-6 mt-8">
                <h3 className="font-bold text-gray-900 mb-4">Related Business Guides</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <a href="/how-to-register-business-kenya" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    How to Register Business Kenya
                  </a>
                  <a href="/sole-proprietorship-registration-kenya" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Sole Proprietorship Registration
                  </a>
                  <a href="/limited-company-registration-kenya" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Limited Company Registration
                  </a>
                  <a href="/company-annual-returns-kenya" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Company Annual Returns Guide
                  </a>
                  <a href="/business-permits-and-licenses-kenya" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Business Permits & Licenses
                  </a>
                  <a href="/company-cr12-and-search-kenya" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    CR12 & Company Search Kenya
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

export default KRAPINRegistrationKenya;
