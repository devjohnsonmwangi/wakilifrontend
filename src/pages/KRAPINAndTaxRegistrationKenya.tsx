import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, AlertCircle, ArrowRight, FileText, DollarSign, Building2, AlertTriangle, Download, BookOpen, Globe, Shield, BarChart, XCircle } from 'lucide-react';

const KRAPINAndTaxRegistrationKenya = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // FAQ data
  const faqs = [
    {
      question: 'What is a KRA PIN exactly?',
      answer: 'KRA PIN (Personal Identification Number) is a unique 11-digit tax identification number issued by Kenya Revenue Authority. Example format: A001234567A or P001234567B. PIN proves you are registered for taxes with KRA. Every business, company, and self-employed person in Kenya must have a KRA PIN. Without PIN: can\'t open business bank account, can\'t file tax returns, can\'t conduct legal business contracts, subject to penalties. PIN is lifetime number (doesn\'t change even if you change business name/location).'
    },
    {
      question: 'Is KRA PIN same as Tax ID?',
      answer: 'Not exactly. KRA PIN is your personal tax identification number (unique to you). Tax ID is more general term. When people say "register for tax" they usually mean: get KRA PIN, register for income tax, and register for VAT (if applicable). So KRA PIN is the main identification, but you may register for multiple tax types under one PIN. One PIN can cover: income tax, VAT, PAYE, turnover tax depending on your business.'
    },
    {
      question: 'How much does KRA PIN registration cost?',
      answer: 'KRA PIN registration is FREE. Zero cost to register. You pay no fees to KRA for getting PIN. However: if you use a tax agent/consultant to help you register: they charge KES 2,000-10,000 (their service fee, not KRA fee). If you register yourself online: completely free. Recommendation: Register yourself (it\'s easy, online, free) unless you need help with complex business structure.'
    },
    {
      question: 'How long does KRA PIN registration take?',
      answer: 'KRA PIN registration timeline: Online registration: 1-3 days (most common, fastest). In-person at KRA office: 1-2 hours (immediate if documents complete). First time registration: 2-5 business days (approval process). Total: 1-5 days for most people. After registration: PIN issued immediately (or same day in-person). You can start using PIN right away (for business bank account, contracts, etc.). Fastest method: register online on iTax (1-3 days).'
    },
    {
      question: 'Do sole proprietors need KRA PIN?',
      answer: 'Yes. Even sole proprietors (self-employed, one-person business) MUST register for KRA PIN if: business income expected to exceed KES 400,000 per year, you operate a business (even small), you want credibility/business bank account. Exceptions (no PIN needed): Informal hawkers (street vendors), Occasional freelancers (very small, ad-hoc), No stable business location. Best practice: Get PIN even if not required (shows professionalism, enables banking, compliance).'
    },
    {
      question: 'What documents do I need to register?',
      answer: 'For individual/sole proprietor: National ID/passport, Business name (if different from yours), Bank account details (optional but recommended), Contact information (phone, email). For company: Certificate of Incorporation (BRELA), Company registration document, Company bank account details, Shareholder/director details, Company address. For partnership: Partnership agreement, Partners\' IDs, Partnership bank account, Partnership address. In-person: bring originals + copies. Online: scan/upload documents (digital).'
    },
    {
      question: 'What is VAT registration and do I need it?',
      answer: 'VAT (Value Added Tax) is 16% tax on goods/services. VAT registration: separate from KRA PIN (though same registration system). Required if: annual turnover exceeds KES 16 million per year, you import goods, you sell taxable goods/services. Threshold: Most small businesses under KES 16M don\'t need VAT. Optional: You can register voluntarily even if below threshold. Registration process: Same as PIN registration (online or in-person). Cost: FREE (like PIN). Benefit: Can recover VAT paid on business expenses (reduces tax burden).'
    },
    {
      question: 'What is PAYE and who registers?',
      answer: 'PAYE (Pay-As-You-Earn) is payroll tax for employees. Required if: you have salaried employees, you pay salaries/wages. Registration: employers must register for PAYE. Process: Open iTax, select PAYE registration, provide employee list, bank account details. Cost: FREE. Monthly obligation: Calculate, withhold PAYE from employees, remit to KRA monthly. Failure to register: Heavy penalties (KES 50,000-500,000 depending on employees). Every employer MUST register for PAYE if having employees.'
    },
    {
      question: 'Can I register online or must I visit KRA office?',
      answer: 'Both options available: Online registration (recommended): Go to iTax.go.ke, create account, apply online, 1-3 days approval. In-person registration: Visit any KRA office, bring documents, complete same day or next day. Online is faster/easier (no queuing, 24/7 access, instant tracking). In-person is immediate (if documents complete). Most people use online (more convenient). Pro tip: Register online first (faster), then collect certificate in person (or download digital).'
    },
    {
      question: 'What happens after I get KRA PIN?',
      answer: 'After registration you can: Open business bank account (bank requires PIN), Sign contracts/licenses (PIN proof of legitimacy), Apply for permits (PIN often required), Start filing tax returns (if required). Obligations: File annual income tax returns (if earning above threshold), File VAT returns (if registered for VAT - monthly or quarterly), Declare expenses/income, Keep accounting records (5 years). Non-compliance: Fines (KES 50,000-1,000,000+), Interest on unpaid taxes, Potential jail time (severe cases). Compliance: File on time, keep good records.'
    },
    {
      question: 'How do I download my PIN certificate?',
      answer: 'Download PIN certificate: Log into iTax.go.ke, Select "My Documents" or "Certificate Download", Choose PIN certificate, Download (PDF), Print (optional). Or in-person: Visit KRA office, ask for certified copy, collect same day (usually free or small fee KES 200-500). Digital certificate: Sufficient for most purposes (bank, permits, contracts). Physical copy: Some institutions prefer printed/certified. Recommendation: Download immediately after registration + print 2-3 copies (for records, banks, permits).'
    },
    {
      question: 'What if I don\'t register for KRA PIN?',
      answer: 'Consequences of not registering: Can\'t open business bank account, penalties if income threshold exceeded (KES 50,000-1,000,000+), Tax arrears accumulate (previous years\' tax due), Can\'t sign government contracts/tenders, Reputational damage (no legal business status), Difficulty when expanding business (loans, partnerships). If caught without PIN: Revenue authority may: Estimate income + fine, Pursue legal action, Seize assets (in extreme cases). Solution: Register immediately (if haven\'t already). Better late than never (penalties less severe if self-register vs. caught by authority).'
    },
    {
      question: 'Can a company register using director\'s personal PIN?',
      answer: 'No. Company needs separate company PIN (different from director\'s personal PIN). Reason: Company is separate legal entity (independent from director). Both register: Director gets personal PIN (for personal income), Company gets company PIN (for business income). Process: Both applications separate (both online or both in-person). Timeline: Can do both simultaneously (same day). Cost: Both free. Director\'s PIN used for: Personal income tax, Any personal business. Company PIN used for: Corporate tax, VAT (if applicable), PAYE (if employees).'
    },
    {
      question: 'What if my business name changed?',
      answer: 'If business name changes: PIN remains the same (PIN doesn\'t change). You update: Business name with KRA (notify in writing or via iTax), Update bank account name (notify bank), Update business permit (county office), Update any licenses/contracts. Process: Write to KRA with new business name + evidence (court order, BRELA change notification, etc.). Timeline: 1-2 weeks for KRA to update system. Cost: Usually free (unless require certified documents). Tip: Only core PIN number never changes - associated business details can be updated.'
    }
  ];

  // Tax types comparison
  const taxTypes = [
    {
      type: 'Income Tax',
      who: 'All businesses earning income',
      rate: 'Progressive (10%-30%)',
      filing: 'Annually (by June 30)',
      description: 'Tax on business profit (revenue minus expenses). Applied to all businesses earning above threshold.'
    },
    {
      type: 'VAT (Value Added Tax)',
      who: 'Businesses earning over KES 16M annually',
      rate: '16% on taxable goods/services',
      filing: 'Monthly or quarterly',
      description: 'Tax on sales of goods/services. Mandatory if turnover exceeds KES 16M. Can recover VAT on purchases.'
    },
    {
      type: 'PAYE (Pay-As-You-Earn)',
      who: 'Employers with employees',
      rate: '10%-30% (employee salary tax)',
      filing: 'Monthly',
      description: 'Payroll tax withheld from employee salaries. Employer responsibility to deduct and remit monthly.'
    },
    {
      type: 'Turnover Tax',
      who: 'Small businesses (alternative to income tax)',
      rate: '1-3% on turnover',
      filing: 'Monthly',
      description: 'Simplified tax option for small traders. Alternative to income tax (must choose one method). Easier bookkeeping.'
    },
    {
      type: 'Excise Duty',
      who: 'Specific products (alcohol, fuel, cigarettes)',
      rate: 'Varies by product (5%-100%+)',
      filing: 'As applicable',
      description: 'Tax on specific high-tax goods. Applied at manufacture/import stage. Added to product price.'
    },
    {
      type: 'Stamp Duty',
      who: 'Certain transactions (property, contracts)',
      rate: 'Varies (0.5%-10% depending on type)',
      filing: 'Per transaction',
      description: 'Tax on legal documents (property transfer, contracts). Paid at signing/registration.'
    }
  ];

  // Registration steps
  const registrationSteps = [
    {
      number: 1,
      title: 'Determine Your Tax Registration Type',
      description: 'Assess your business to determine what to register: Individual/sole proprietor (personal PIN), Company/partnership (company PIN + PAYE if employees), VAT requirement (if turnover over KES 16M), Turnover tax option (if small business, under KES 16M). Decision factors: Business structure, Expected annual income, Number of employees, Type of goods/services sold.'
    },
    {
      number: 2,
      title: 'Gather Required Documents',
      description: 'Collect necessary documents: For individual: National ID/passport (original + copy), Bank account details, Business name (if applicable), Contact information. For company: Certificate of Incorporation (BRELA), Company registration documents, Company bank account details, Director/shareholder IDs (copies), Company address. Ensure all documents are current and valid.'
    },
    {
      number: 3,
      title: 'Create iTax Account (Online Registration)',
      description: 'Go to iTax.go.ke, Click "Register" (if new user), Enter email address, Create password (strong, 8+ characters), Accept terms, Verify email (click link sent to email), Account created. Or call KRA helpline if prefer in-person. Online account setup: 5-10 minutes. In-person: Visit KRA office (Nairobi or regional).'
    },
    {
      number: 4,
      title: 'Log Into iTax & Select Registration Type',
      description: 'Log into iTax using your email/password, Select service: "Individual Registration" or "Company Registration", Select registration type: Personal Income Tax, VAT Registration, PAYE Registration (if applicable). Each tax type may have separate application (though usually bundled). Follow on-screen instructions.'
    },
    {
      number: 5,
      title: 'Fill Out Registration Form Accurately',
      description: 'Complete form with accurate information: Personal/company details (name, address, business type), Business description (what you do), Annual turnover estimate, Contact information (phone, email), Bank account details (optional but recommended), Identification details (ID numbers, dates). Double-check all information (errors cause delays/rejections). Save form (system auto-saves periodically).'
    },
    {
      number: 6,
      title: 'Upload Required Documents',
      description: 'Scan or photograph required documents (high quality, legible), Upload in PDF/JPG format: ID copy, Business address proof (if different from personal), Company registration (if applicable), Bank account statement (optional), Any supporting documents (business license, permit, etc.). File size: usually 5-20MB per file. System accepts most image formats.'
    },
    {
      number: 7,
      title: 'Review & Submit Application',
      description: 'Review all entered information one final time (catch any errors), Confirm all documents uploaded, Read terms/conditions, Check "I agree", Click "Submit Application". System provides reference number (save for records). Application submitted. You\'ll see confirmation on screen + email confirmation sent.'
    },
    {
      number: 8,
      title: 'Wait for KRA Review & Approval',
      description: 'KRA staff review application (1-3 business days typical). They verify: Document completeness, Information accuracy, ID verification, Eligibility for requested tax types. May request: Additional documents, Clarifications, Supporting evidence. You\'ll be notified via email if issues. Most applications approved without issues (if documents complete).'
    },
    {
      number: 9,
      title: 'Receive KRA PIN & Certificate',
      description: 'Once approved: PIN issued (11-digit number). Download certificate from iTax ("My Documents" section). Certificate shows: PIN number, Tax registration type, Registration date, Validity period. Digital certificate sufficient for most uses. Optional: Collect physical copy in person (usually free).'
    },
    {
      number: 10,
      title: 'Start Using PIN for Business',
      description: 'Use PIN for: Opening business bank account (bank requires PIN), Signing contracts/licenses (prove tax legitimacy), Applying for permits/approvals (PIN often required), Filing tax returns (if required by income threshold). Start filing obligations: Income tax annual return (by June 30 if required), VAT returns (monthly/quarterly if registered), PAYE returns (monthly if employees). Keep records: 5-year record retention required.'
    }
  ];

  // Documents required
  const documentsRequired = [
    { document: 'National ID or Passport', type: 'Individual/Company Director', required: 'Yes' },
    { document: 'Business Address Proof', type: 'Utility bill, lease, property deed', required: 'Conditional' },
    { document: 'Bank Account Details', type: 'Account number, bank name, branch', required: 'Recommended' },
    { document: 'Certificate of Incorporation', type: 'For companies only', required: 'Yes (if company)' },
    { document: 'Business License/Permit', type: 'County business permit', required: 'Conditional' },
    { document: 'Partnership Agreement', type: 'For partnerships only', required: 'Yes (if partnership)' },
    { document: 'Shareholder/Director List', type: 'For companies with shareholders', required: 'Yes (if applicable)' },
    { document: 'Employment Details', type: 'For PAYE registration', required: 'Yes (if employees)' },
    { document: 'Business Description', type: 'What your business does', required: 'Yes' },
    { document: 'Previous Tax Documents', type: 'If changing accountant/system', required: 'Sometimes' }
  ];

  // Common errors
  const commonErrors = [
    { error: 'Wrong ID number entered', fix: 'Double-check ID matches government records exactly. Resubmit with correction.' },
    { error: 'Incomplete/unclear documents', fix: 'Ensure scanned documents are legible. Re-scan at higher resolution.' },
    { error: 'Business address doesn\'t match records', fix: 'Update address with county office first. Re-apply with correct address.' },
    { error: 'Name mismatch (business vs ID)', fix: 'Ensure business name registration matches ID name. Use correct legal name.' },
    { error: 'Duplicate application (registering twice)', fix: 'Check if already registered on iTax. Use existing PIN if found.' },
    { error: 'Bank account details wrong', fix: 'Verify account number with bank. Re-submit with corrected details.' },
    { error: 'Missing contact information', fix: 'Ensure valid email and phone provided. KRA uses these to contact you.' },
    { error: 'Selecting wrong registration type', fix: 'Review business structure carefully. Choose individual vs company correctly.' }
  ];

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'why-pin', 'tax-types', 'requirements', 'registration-steps', 'company-registration', 'sole-prop-registration', 'documents', 'download-certificate', 'common-errors', 'after-registration', 'penalties', 'accountant', 'faqs'];
      
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
        <title>KRA PIN Registration for Businesses – iTax Guide Kenya 2026</title>
        <meta name="description" content="Complete guide to KRA PIN registration for businesses in Kenya. Step-by-step iTax registration, VAT, PAYE, tax compliance and requirements for companies and sole proprietors." />
        <link rel="canonical" href="https://yoursite.com/kra-pin-and-tax-registration-kenya" />
        
        {/* OpenGraph */}
        <meta property="og:title" content="KRA PIN Registration for Businesses – Complete iTax Guide Kenya 2026" />
        <meta property="og:description" content="Register for KRA PIN online on iTax. Complete guide for businesses, companies, sole proprietors. Includes VAT, PAYE, income tax registration and tax compliance." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://yoursite.com/kra-pin-and-tax-registration-kenya" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=630&fit=crop" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="KRA PIN Registration for Businesses – iTax Guide Kenya 2026" />
        <meta name="twitter:description" content="Step-by-step guide to KRA PIN registration on iTax. Includes tax types, requirements, documents, and compliance for Kenyan businesses." />
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
            "description": "KRA PIN registration and tax compliance guidance in Kenya"
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
                "name": "KRA PIN & Tax Registration",
                "item": "https://yoursite.com/kra-pin-and-tax-registration-kenya"
              }
            ]
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Register for KRA PIN in Kenya",
            "description": "Step-by-step guide to KRA PIN registration on iTax",
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
            <p className="text-blue-100 text-lg max-w-3xl">Complete guide to registering for KRA PIN on iTax. Learn how to get your tax identification number, register for VAT, PAYE, income tax and stay tax-compliant in Kenya.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="https://itax.go.ke" target="_blank" rel="noopener noreferrer" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Register on iTax
              </a>
              <a href="/business-permits-licenses-kenya" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
                Business Permits <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:block sticky top-0 bg-white shadow-md z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex gap-2 overflow-x-auto">
              {['overview', 'why-pin', 'tax-types', 'requirements', 'registration-steps', 'company-registration', 'sole-prop-registration', 'documents', 'download-certificate', 'common-errors', 'after-registration', 'penalties', 'accountant', 'faqs'].map((section) => (
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
              {['overview', 'why-pin', 'tax-types', 'registration-steps', 'documents', 'faqs'].map((section) => (
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
                  {section === 'overview' ? 'Overview' : section === 'why-pin' ? 'Why' : section === 'tax-types' ? 'Types' : section === 'registration-steps' ? 'Register' : section === 'documents' ? 'Docs' : 'FAQs'}
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
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What is a KRA PIN?</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">A KRA PIN (Personal Identification Number) is your unique 11-digit tax identification number issued by the Kenya Revenue Authority (KRA). It's like your "tax ID card" that proves you are registered to do business legally in Kenya.</p>

              <img 
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop"
                alt="KRA PIN and tax registration for businesses in Kenya"
                className="rounded-lg shadow-lg w-full mb-6"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">✓ What Your PIN Shows</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• 11-digit unique identification number</li>
                    <li>• Tax registration status</li>
                    <li>• Business/personal tax details</li>
                    <li>• Taxpayer classification</li>
                    <li>• Validity and registration date</li>
                    <li>• Certificate (digital and physical)</li>
                  </ul>
                </div>

                <div className="bg-green-50 border-l-4 border-green-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">📋 PIN Format Example</h4>
                  <p className="text-gray-700 text-sm mb-3 font-mono bg-white p-2 rounded">A001234567A</p>
                  <p className="text-gray-700 text-sm">Format: [Letter][Numbers][Letter]</p>
                  <p className="text-gray-700 text-sm">• First letter: Taxpayer type</p>
                  <p className="text-gray-700 text-sm">• Nine numbers: Unique sequence</p>
                  <p className="text-gray-700 text-sm">• Last letter: Check digit</p>
                </div>
              </div>

              <p className="text-gray-700 mb-4"><strong>Key fact:</strong> Your KRA PIN is permanent (doesn't change), unique (no two people have same PIN), and required for all business operations in Kenya.</p>
            </div>
          </section>

          {/* Why PIN */}
          <section id="why-pin" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Why Every Business Needs a KRA PIN</h2>
            </div>

            <div className="prose max-w-none">
              <div className="space-y-4 mb-6">
                <div className="bg-white border-2 border-gray-200 p-5 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-2">1. Legal Requirement</h4>
                  <p className="text-gray-700 text-sm">Kenyan law requires all businesses to register for KRA PIN. Operating without PIN = illegal (subject to penalties: fines KES 50,000-1,000,000+, jail time possible).</p>
                </div>

                <div className="bg-white border-2 border-gray-200 p-5 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-2">2. Open Business Bank Account</h4>
                  <p className="text-gray-700 text-sm">Banks require KRA PIN to open business account. No PIN = no business banking (forced to use personal account = unprofessional, tax complications).</p>
                </div>

                <div className="bg-white border-2 border-gray-200 p-5 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-2">3. Apply for Business Licenses/Permits</h4>
                  <p className="text-gray-700 text-sm">County business permits, health certificates, fire safety, and other licenses require KRA PIN proof. No PIN = can't get permits = can't operate legally.</p>
                </div>

                <div className="bg-white border-2 border-gray-200 p-5 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-2">4. Sign Contracts & Tenders</h4>
                  <p className="text-gray-700 text-sm">Government contracts, corporate partnerships, and major deals require KRA PIN (proves legitimate business entity). Freelancers/contractors need PIN for professional credibility.</p>
                </div>

                <div className="bg-white border-2 border-gray-200 p-5 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-2">5. Tax Compliance & Filing</h4>
                  <p className="text-gray-700 text-sm">If business income exceeds threshold, must file annual tax returns using PIN. Non-filing = penalties (interest, fines). PIN enables proper tax reporting.</p>
                </div>

                <div className="bg-white border-2 border-gray-200 p-5 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-2">6. Build Business Credibility</h4>
                  <p className="text-gray-700 text-sm">PIN shows customers, suppliers, and investors that you're a registered, legitimate business. Professional image = better business relationships + customer trust.</p>
                </div>
              </div>

              <div className="bg-red-50 border-l-4 border-red-600 p-5 rounded-lg">
                <p className="text-gray-700 text-sm"><strong>Bottom line:</strong> KRA PIN is non-negotiable. Every business needs one. Registration is free and easy (online on iTax takes 15 minutes).</p>
              </div>
            </div>
          </section>

          {/* Tax Types */}
          <section id="tax-types" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <BarChart className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Types of Tax Registrations Explained</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Under your KRA PIN, you may register for different tax types depending on your business. Here's what each means:</p>

              <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto mb-6">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Tax Type</th>
                      <th className="px-4 py-3 text-left font-semibold">Who Needs It</th>
                      <th className="px-4 py-3 text-left font-semibold">Rate</th>
                      <th className="px-4 py-3 text-left font-semibold">Filing</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {taxTypes.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                        <td className="px-4 py-3 font-semibold text-gray-900 text-sm">{item.type}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.who}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.rate}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.filing}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg">
                <p className="text-gray-700 text-sm"><strong>Key point:</strong> One PIN covers all tax types (one registration). Based on your income/business type, you may file different tax returns under same PIN.</p>
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
              <p className="text-gray-700 mb-6">Before applying for KRA PIN, ensure you have:</p>

              <div className="space-y-3">
                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">✓ Valid Identification</h4>
                  <p className="text-gray-700 text-sm">National ID or passport (must be current/not expired). For companies: director/shareholder IDs required.</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">✓ Business Details</h4>
                  <p className="text-gray-700 text-sm">Business name (or personal name if sole proprietor), Type of business (what you do), Business address or personal address where business operates.</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">✓ Contact Information</h4>
                  <p className="text-gray-700 text-sm">Valid email address (KRA communicates here), Phone number (Kenya-based), Physical address (for official correspondence).</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">✓ Bank Account Details (Recommended)</h4>
                  <p className="text-gray-700 text-sm">Bank account number (if opening business bank), Bank name and branch. Helpful for tax payments/refunds.</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">✓ For Companies Only</h4>
                  <p className="text-gray-700 text-sm">Certificate of Incorporation (from BRELA), Company registration details, Shareholder/director information, Company address (must be physical, not P.O. box).</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">✓ For Partnerships</h4>
                  <p className="text-gray-700 text-sm">Partnership agreement (signed), All partners' IDs, Partnership registered address, Details of all partners.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Registration Steps */}
          <section id="registration-steps" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <ArrowRight className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Step-by-Step KRA PIN Registration on iTax</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Online registration on iTax is the fastest and easiest method. Here's how:</p>

              <div className="space-y-4">
                {registrationSteps.map((step) => (
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
                <h4 className="font-bold text-gray-900 mb-2">💡 Pro Tips for Fast Registration</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Register on weekdays (faster processing than weekends)</li>
                  <li>• Have all documents scanned before starting</li>
                  <li>• Use same email/phone consistently</li>
                  <li>• Keep registration reference number (for follow-up)</li>
                  <li>• Check email regularly (KRA may request clarifications)</li>
                  <li>• Register early morning (avoid end-of-day system delays)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Company Registration */}
          <section id="company-registration" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <Building2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How to Register a Company PIN (Limited Company)</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Limited companies need separate company PIN (different from director's personal PIN). Here's the specific process:</p>

              <div className="space-y-3 mb-6">
                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Step 1: Get BRELA Certificate First</h4>
                  <p className="text-gray-700 text-sm">Register company with BRELA (Business Registration Authority). Receive Certificate of Incorporation (required for KRA registration).</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Step 2: Go to iTax & Select Company Registration</h4>
                  <p className="text-gray-700 text-sm">Create iTax account (if new), Log in, Select "Company Registration" (not individual), Choose "Company PIN".</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Step 3: Fill Company Details</h4>
                  <p className="text-gray-700 text-sm">Company name (exact name from BRELA), Company registration number (from BRELA), Company address (physical, not P.O. box), Nature of business (what company does), Annual turnover estimate.</p>
                </div>

                <div className="bg-white border-l-4 border-blue-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Step 4: Upload Company Documents</h4>
                  <p className="text-gray-700 text-sm">Certificate of Incorporation (from BRELA), Company registration document, Director ID (copies of all directors), Shareholder information, Company bank account details (if applicable).</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Step 5: Submit & Wait for Approval</h4>
                  <p className="text-gray-700 text-sm">Review all information, Submit application, Wait for KRA approval (1-3 business days), Receive company PIN.</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Step 6: Register for VAT & PAYE (If Applicable)</h4>
                  <p className="text-gray-700 text-sm">If company turnover over KES 16M: register for VAT simultaneously, If company has employees: register for PAYE. Same registration process (select tax type on iTax).</p>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
                <p className="text-gray-700 text-sm"><strong>Company PIN Timeline:</strong> BRELA registration (2-7 days) → KRA PIN registration (1-3 days) → Total: 4-10 days to have company PIN operational.</p>
              </div>
            </div>
          </section>

          {/* Sole Proprietor Registration */}
          <section id="sole-prop-registration" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How to Register a Sole Proprietor PIN</h2>
            </div>

            <div className="prose max-us-none">
              <p className="text-gray-700 mb-6">Sole proprietor PIN registration is simpler than company (no BRELA involvement). Here's the process:</p>

              <div className="space-y-3 mb-6">
                <div className="bg-white border-l-4 border-green-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Step 1: Go to iTax.go.ke</h4>
                  <p className="text-gray-700 text-sm">Open browser, Go to iTax.go.ke, Create account (email + password) or log in if existing user.</p>
                </div>

                <div className="bg-white border-l-4 border-green-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Step 2: Select Individual Registration</h4>
                  <p className="text-gray-700 text-sm">Click "Register" or "New Registration", Select "Individual" (not company), Select "Personal Income Tax" (basic registration).</p>
                </div>

                <div className="bg-white border-l-4 border-green-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Step 3: Fill Personal Details</h4>
                  <p className="text-gray-700 text-sm">Full name (as per ID), National ID number, Date of birth, Gender, Contact information (phone, email), Residential address.</p>
                </div>

                <div className="bg-white border-l-4 border-green-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Step 4: Fill Business Information</h4>
                  <p className="text-gray-700 text-sm">Business name (if different from personal name), Nature of business (what you do), Business address (where you operate), Annual turnover estimate (projected income), Business start date.</p>
                </div>

                <div className="bg-white border-l-4 border-green-606 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Step 5: Upload Documents</h4>
                  <p className="text-gray-700 text-sm">National ID (front + back), Business address proof (utility bill or lease), Bank account details (optional but helpful), Any business license/permit (if applicable).</p>
                </div>

                <div className="bg-white border-l-4 border-green-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Step 6: Submit & Get PIN</h4>
                  <p className="text-gray-700 text-sm">Review information, Submit application, Wait for approval (1-3 days), Receive PIN via email, Download certificate.</p>
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-lg">
                <p className="text-gray-700 text-sm"><strong>Sole Proprietor PIN Timeline:</strong> 1-3 days (from submission to approval). Fastest option compared to companies.</p>
              </div>
            </div>
          </section>

          {/* Documents */}
          <section id="documents" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Documents Required for Registration</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Exact documents depend on your registration type. Here's the complete checklist:</p>

              <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto mb-6">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Document</th>
                      <th className="px-4 py-3 text-left font-semibold">For Type</th>
                      <th className="px-4 py-3 text-left font-semibold">Required</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {documentsRequired.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 font-medium text-gray-900 text-sm">{item.document}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.type}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm"><span className={`px-2 py-1 rounded text-xs font-semibold ${item.required === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{item.required}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-600 p-4 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">📋 Document Preparation Tips</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Scan documents clearly (high resolution: 300+ DPI)</li>
                  <li>• Use JPG or PDF format (most accepted)</li>
                  <li>• Include both front and back of ID</li>
                  <li>• Ensure all text legible (blurry documents rejected)</li>
                  <li>• File size: Usually 2-20MB per document</li>
                  <li>• Keep copies for your records</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Download Certificate */}
          <section id="download-certificate" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <Download className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How to Download Your PIN Certificate</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Once your PIN is approved, you can download your certificate immediately:</p>

              <div className="space-y-3 mb-6">
                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Online Method (Easiest)</h4>
                  <p className="text-gray-700 text-sm">Log into iTax.go.ke, Go to "My Documents" section, Select "PIN Certificate", Click "Download", Save PDF file, Print (optional).</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">In-Person Method</h4>
                  <p className="text-gray-700 text-sm">Visit any KRA office, Bring your ID, Ask for "PIN Certificate", Collect physical certified copy (usually same day, minimal or no charge).</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="font-bold text-gray-900 mb-1">✓ Digital Certificate</p>
                  <p className="text-gray-700 text-sm">Sufficient for: business bank accounts, contracts, permits, government services. Accepted everywhere.</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="font-bold text-gray-900 mb-1">✓ Physical Certificate</p>
                  <p className="text-gray-700 text-sm">For: framing (office display), certain official processes, backup copy. Print digital version or collect certified physical.</p>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
                <p className="text-gray-700 text-sm"><strong>Pro tip:</strong> Download immediately after approval. Print 2-3 copies and keep safe. Most uses: digital copy sufficient.</p>
              </div>
            </div>
          </section>

          {/* Common Errors */}
          <section id="common-errors" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Common Errors & How to Fix Them</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Here are the most common registration mistakes and their fixes:</p>

              <div className="space-y-3">
                {commonErrors.map((item, index) => (
                  <div key={index} className="bg-white border-l-4 border-red-600 p-4 rounded-lg hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-gray-900 mb-1 flex items-start gap-2">
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      {item.error}
                    </h4>
                    <p className="text-gray-700 text-sm"><strong>Fix:</strong> {item.fix}</p>
                  </div>
                ))}
              </div>

              <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-lg mt-6">
                <p className="text-gray-700 text-sm"><strong>✓ Prevention tip:</strong> Double-check all information before submitting. Most errors preventable by careful review.</p>
              </div>
            </div>
          </section>

          {/* After Registration */}
          <section id="after-registration" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">After Registration: What Comes Next</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Once you have your KRA PIN, you have new obligations and opportunities:</p>

              <div className="space-y-3 mb-6">
                <div className="bg-white border-2 border-green-200 p-5 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-2">1. Open Business Bank Account</h4>
                  <p className="text-gray-700 text-sm">Take PIN certificate to bank, Open business savings account (in business name), Deposit minimum (varies by bank, usually KES 500-5,000), Receive business checkbook/card. Use for all business transactions (keep personal + business money separate).</p>
                </div>

                <div className="bg-white border-2 border-green-200 p-5 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-2">2. File Annual Returns (If Required)</h4>
                  <p className="text-gray-700 text-sm">If income exceeds threshold (KES 400,000+ for individuals, KES 5M+ for companies): File annual income tax return by June 30, Submit via iTax portal or in-person. Keep records: 5-year retention (receipts, invoices, expenses).</p>
                </div>

                <div className="bg-white border-2 border-green-200 p-5 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-2">3. Register for VAT (If Applicable)</h4>
                  <p className="text-gray-700 text-sm">If registered for VAT: File monthly/quarterly VAT returns, Charge 16% VAT on invoices (for customers), Recover VAT on business expenses. Keep VAT invoices (mandatory 5-year record).</p>
                </div>

                <div className="bg-white border-2 border-green-200 p-5 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-2">4. Remit PAYE Monthly (If You Have Employees)</h4>
                  <p className="text-gray-700 text-sm">If registered for PAYE: Calculate employee income tax monthly, Deduct from salaries, Remit to KRA by 9th of following month. Submit monthly PAYE returns (via iTax). Keep payroll records (mandatory 5-year retention).</p>
                </div>

                <div className="bg-white border-2 border-green-200 p-5 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-2">5. Stay Compliant & Updated</h4>
                  <p className="text-gray-700 text-sm">Update KRA if: address changes, business structure changes, closing business. Monitor KRA communications (via iTax email notifications). File returns on time (avoid penalties/interest). Keep accurate books (enable easy tax filing).</p>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">📋 Ongoing Compliance Checklist</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>✓ Keep PIN certificate safe (physical + digital copies)</li>
                  <li>✓ Use business bank account (not personal)</li>
                  <li>✓ Keep accurate business records (5 years minimum)</li>
                  <li>✓ File tax returns on time (June 30 deadline)</li>
                  <li>✓ Pay taxes on time (avoid penalties)</li>
                  <li>✓ Renew professional permits/licenses annually</li>
                  <li>✓ Report income changes to KRA</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Penalties */}
          <section id="penalties" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Penalties for Non-Compliance</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Failure to register or maintain compliance with KRA carries serious penalties:</p>

              <div className="space-y-4 mb-6">
                <div className="bg-red-50 border-2 border-red-200 p-5 rounded-xl">
                  <h4 className="font-bold text-red-900 mb-2">💰 Financial Penalties</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Operating without PIN: KES 50,000-500,000 fine</li>
                    <li>• Late tax filing: 5-10% of unpaid tax + interest</li>
                    <li>• Unpaid taxes: 20% interest per annum + penalties</li>
                    <li>• False declarations: Up to 100% of evaded tax + penalties</li>
                    <li>• Non-filing returns: KES 10,000-50,000 per violation</li>
                  </ul>
                </div>

                <div className="bg-orange-50 border-2 border-orange-200 p-5 rounded-xl">
                  <h4 className="font-bold text-orange-900 mb-2">⚖️ Legal Consequences</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Jail time: Up to 6-12 months possible (severe violations)</li>
                    <li>• Criminal record: Affects future business licensing</li>
                    <li>• Court cases: Expensive, time-consuming legal proceedings</li>
                    <li>• Asset seizure: KRA can pursue asset recovery</li>
                    <li>• Business closure: Premises sealed/equipment seized</li>
                  </ul>
                </div>
              </div>

              <div className="bg-red-50 border-l-4 border-red-600 p-5 rounded-lg">
                <p className="text-gray-700 text-sm"><strong>Bottom line:</strong> KRA registration is mandatory and enforced strictly. Penalties far exceed registration cost/effort. Getting PIN early protects you legally and financially.</p>
              </div>
            </div>
          </section>

          {/* Accountant */}
          <section id="accountant" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">When to Hire a Professional Accountant</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">KRA PIN registration itself is free and easy (DIY possible). But when should you hire help?</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white border-2 border-blue-200 rounded-xl p-5">
                  <h4 className="font-bold text-gray-900 mb-3">✓ DIY Registration (Save Money)</h4>
                  <p className="text-gray-700 text-sm font-bold mb-2">Hire accountant NOT needed if:</p>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Simple sole proprietor</li>
                    <li>• Single business location</li>
                    <li>• No employees</li>
                    <li>• Straightforward income</li>
                    <li>• Below VAT threshold</li>
                  </ul>
                  <p className="text-gray-700 text-xs mt-3 font-bold">Cost: FREE (iTax online)</p>
                </div>

                <div className="bg-white border-2 border-orange-200 rounded-xl p-5">
                  <h4 className="font-bold text-gray-900 mb-3">⚠️ Hire Professional (Worth Cost)</h4>
                  <p className="text-gray-700 text-sm font-bold mb-2">Accountant helpful if:</p>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Company (complex structure)</li>
                    <li>• Multiple businesses</li>
                    <li>• Employees (PAYE complex)</li>
                    <li>• VAT registration (16% on sales)</li>
                    <li>• Unsure about tax rules</li>
                  </ul>
                  <p className="text-gray-700 text-xs mt-3 font-bold">Cost: KES 2,000-10,000</p>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">💡 Accountant Services Include</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Help with KRA PIN registration (faster, no errors)</li>
                  <li>• Ongoing tax advice (avoid costly mistakes)</li>
                  <li>• Annual tax return filing (ensure compliance)</li>
                  <li>• Monthly/quarterly VAT returns (if applicable)</li>
                  <li>• PAYE processing (if employees)</li>
                  <li>• Record keeping guidance (5-year retention)</li>
                  <li>• Deduction optimization (reduce tax liability)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* FAQs */}
          <section id="faqs" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
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
                      <span className={`text-blue-600 flex-shrink-0 text-2xl transition-transform ${expandedFaq === index ? 'rotate-45' : ''}`}>+</span>
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
          <section className="mt-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-8 text-white">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold mb-4">Ready to Get Your KRA PIN?</h2>
              <p className="text-blue-100 mb-6">It's free, easy, and takes 15 minutes online. Register today and start your compliant, legitimate business journey.</p>
              
              <div className="flex flex-wrap gap-3">
                <a href="https://itax.go.ke" target="_blank" rel="noopener noreferrer" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Register on iTax Now
                </a>
                <a href="/business-permits-licenses-kenya" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
                  Business Permits <ArrowRight className="w-5 h-5" />
                </a>
                <a href="/how-to-register-business-kenya" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
                  Business Registration <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </section>

          {/* Internal Links */}
          <section className="mt-12 pt-8 border-t-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Related Business & Tax Guides</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <a href="/how-to-register-business-kenya" className="p-4 border-2 border-blue-200 rounded-lg hover:shadow-lg transition-shadow hover:border-blue-600">
                <h4 className="font-bold text-gray-900 mb-1">How to Register a Business</h4>
                <p className="text-gray-600 text-sm">Complete guide to business registration in Kenya</p>
              </a>
              <a href="/sole-proprietorship-registration-kenya" className="p-4 border-2 border-green-200 rounded-lg hover:shadow-lg transition-shadow hover:border-green-600">
                <h4 className="font-bold text-gray-900 mb-1">Sole Proprietor Registration</h4>
                <p className="text-gray-600 text-sm">How to register as a sole proprietor in Kenya</p>
              </a>
              <a href="/limited-company-registration-kenya" className="p-4 border-2 border-orange-200 rounded-lg hover:shadow-lg transition-shadow hover:border-orange-600">
                <h4 className="font-bold text-gray-900 mb-1">Limited Company Registration</h4>
                <p className="text-gray-600 text-sm">Register a limited company in Kenya</p>
              </a>
              <a href="/company-annual-returns-kenya" className="p-4 border-2 border-purple-200 rounded-lg hover:shadow-lg transition-shadow hover:border-purple-600">
                <h4 className="font-bold text-gray-900 mb-1">Annual Returns & Compliance</h4>
                <p className="text-gray-600 text-sm">Filing annual returns and staying compliant</p>
              </a>
              <a href="/business-permits-licenses-kenya" className="p-4 border-2 border-red-200 rounded-lg hover:shadow-lg transition-shadow hover:border-red-600">
                <h4 className="font-bold text-gray-900 mb-1">Business Permits & Licenses</h4>
                <p className="text-gray-600 text-sm">Complete guide to permits and licenses in Kenya</p>
              </a>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default KRAPINAndTaxRegistrationKenya;
