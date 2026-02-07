import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, AlertCircle, ArrowRight, FileText, Clock, DollarSign, Shield, TrendingUp, Users, Briefcase, BookOpen, Building2, Award } from 'lucide-react';

const LimitedCompanyRegistrationKenya = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // FAQ data
  const faqs = [
    {
      question: 'What is the difference between a private limited company and a public limited company?',
      answer: 'A private limited company (Ltd) has 1-50 shareholders, shares are not publicly traded, and cannot raise capital from the public. A public limited company (PLC) has minimum 7 shareholders, shares can be traded on stock exchange, and can raise public funds. Most businesses register as private limited companies (Companies Act 2015, Sections 12-20).'
    },
    {
      question: 'Can one person register a limited company in Kenya?',
      answer: 'Yes. You can register a single-member private limited company with just one director and one shareholder (can be the same person). Minimum one director, minimum one shareholder required (Companies Act 2015, Section 75). This is ideal for solo entrepreneurs who want liability protection.'
    },
    {
      question: 'How much does it cost to register a limited company?',
      answer: 'Business name reservation: KES 500. Company registration on eCitizen: KES 10,050 (includes CR12 certificate). Lawyer/agent fees (optional): KES 15,000-50,000. Business permit: KES 2,000-10,000+. Total DIY: KES 12,550-20,550. Total with lawyer: KES 27,550-70,550+ (Companies Act 2015, BRELA fees).'
    },
    {
      question: 'Do I need a lawyer to register a limited company?',
      answer: 'No, it\'s optional. You can register yourself on eCitizen if you understand the process. A lawyer is helpful for: drafting complex Articles of Association, shareholder agreements, intellectual property protection, or compliance advice. Many people do DIY registration successfully (Companies Act 2015).'
    },
    {
      question: 'What is a CR12 certificate and why do I need it?',
      answer: 'CR12 is your company\'s Certificate of Incorporation - proof your company legally exists. Issued by BRELA after registration. Needed to: open company bank account, apply for business permits, sign contracts, file tax returns, apply for tenders. It\'s the most important company document (Companies Act 2015, Section 30).'
    },
    {
      question: 'How long does company registration take?',
      answer: 'Name reservation: 5-30 seconds. Document preparation: 1-3 days. eCitizen registration: 3-7 business days if all documents are correct. CR12 issuance: Same day or 1-3 days after approval. Total timeline: 1-2 weeks from start to CR12 certificate (BRELA eCitizen, Companies Act 2015).'
    },
    {
      question: 'Can foreigners register a limited company in Kenya?',
      answer: 'Yes. Foreign nationals can own and register Kenyan companies (100% foreign ownership allowed). Requirements: valid passport, KRA PIN, physical address in Kenya, local director (recommended). Foreign investment welcomed (Companies Act 2015, Kenya Investment Authority regulations).'
    },
    {
      question: 'What are Articles of Association and Memorandum of Association?',
      answer: 'Memorandum of Association: States company name, objectives, registered address, and share capital. Articles of Association: Internal rules for running the company (director powers, shareholder rights, meetings, shares). Both required for registration (Companies Act 2015, Sections 15-20). eCitizen provides standard templates.'
    },
    {
      question: 'How many directors and shareholders do I need?',
      answer: 'Minimum requirements: At least 1 director (must be natural person, 18+ years old). At least 1 shareholder (can be individual or company). Maximum 50 shareholders for private limited company. Director and shareholder can be the same person (Companies Act 2015, Sections 75, 80-100).'
    },
    {
      question: 'What is share capital and how much do I need?',
      answer: 'Share capital is the total value of shares issued to shareholders. Kenya has NO minimum share capital requirement - you can start with KES 100 or KES 1 million. Most companies use KES 100,000-1,000,000. Higher share capital shows credibility but doesn\'t affect registration (Companies Act 2015, Section 140).'
    },
    {
      question: 'Do I need a physical office to register a company?',
      answer: 'Yes. Every company must have a registered physical address in Kenya (not a P.O. Box). Can be: rented office, home address, shared workspace, or lawyer\'s office. Needed for official correspondence and legal notices (Companies Act 2015, Section 115). Many startups use home addresses initially.'
    },
    {
      question: 'What are annual returns and when must I file them?',
      answer: 'Annual returns (CR1 form) are yearly reports filed with BRELA showing: directors, shareholders, registered address, share capital. Must be filed within 30 days of company anniversary. Late filing = fines up to KES 100,000. Mandatory for all companies (Companies Act 2015, Sections 350-380).'
    },
    {
      question: 'Can I change my company name after registration?',
      answer: 'Yes. File CR10 form (name change) with BRELA. Board resolution required. New name must be available and approved. Fee: KES 1,000-5,000. Update all documents, bank accounts, licenses. Takes 7-14 days (Companies Act 2015, Section 25).'
    },
    {
      question: 'What taxes do limited companies pay?',
      answer: 'Corporate Income Tax: 30% on net profits (Income Tax Act). VAT: 16% if turnover exceeds KES 5M annually. PAYE: Employee income tax (10%-30%). NHIF/NSSF: Mandatory for employees. Withholding Tax: On dividends, interest, professional fees. Annual tax returns due by June 30 each year.'
    },
    {
      question: 'Can I convert my sole proprietorship to a limited company?',
      answer: 'Yes, but not directly. Register a new limited company, then transfer business assets, contracts, licenses, and operations from sole proprietorship to the company. Close sole proprietorship separately. Consult lawyer for smooth transition (Companies Act 2015, Business Registration Act).'
    }
  ];

  // Comparison table data
  const comparisonData = [
    {
      feature: 'Legal Structure',
      soleProprietorship: 'Owner and business are one',
      limitedCompany: 'Separate legal entity from owners'
    },
    {
      feature: 'Liability',
      soleProprietorship: 'Unlimited (personal assets at risk)',
      limitedCompany: 'Limited to share capital invested'
    },
    {
      feature: 'Ownership',
      soleProprietorship: 'Single owner only',
      limitedCompany: '1-50 shareholders (private Ltd)'
    },
    {
      feature: 'Registration Cost',
      soleProprietorship: 'Free - KES 500',
      limitedCompany: 'KES 10,050 - 15,000+'
    },
    {
      feature: 'Setup Complexity',
      soleProprietorship: 'Very simple (1-3 days)',
      limitedCompany: 'Moderate (1-2 weeks)'
    },
    {
      feature: 'Tax Rate',
      soleProprietorship: 'Personal income tax (10%-30%)',
      limitedCompany: 'Corporate tax (30%) + dividend tax'
    },
    {
      feature: 'Raising Capital',
      soleProprietorship: 'Limited to personal funds/loans',
      limitedCompany: 'Can issue shares, attract investors'
    },
    {
      feature: 'Annual Compliance',
      soleProprietorship: 'Minimal (tax returns only)',
      limitedCompany: 'Annual returns + audited accounts'
    },
    {
      feature: 'Credibility',
      soleProprietorship: 'Lower (personal business)',
      limitedCompany: 'Higher (corporate entity)'
    },
    {
      feature: 'Continuity',
      soleProprietorship: 'Ends if owner dies/quits',
      limitedCompany: 'Continues beyond owners'
    }
  ];

  // Registration costs
  const registrationCosts = [
    { item: 'Business Name Search (eCitizen)', cost: 'Free' },
    { item: 'Business Name Reservation (eCitizen)', cost: 'KES 500' },
    { item: 'Company Registration Fee (eCitizen)', cost: 'KES 10,050' },
    { item: 'CR12 Certificate (included)', cost: 'Included' },
    { item: 'Company Seal (optional)', cost: 'KES 2,000 - 5,000' },
    { item: 'Lawyer/Agent Fees (optional)', cost: 'KES 15,000 - 50,000' },
    { item: 'KRA PIN Application', cost: 'Free' },
    { item: 'County Business Permit', cost: 'KES 2,000 - 10,000+' },
    { item: 'Annual Returns (CR1) - yearly', cost: 'KES 1,000 - 3,000' },
    { item: 'Total Cost (DIY)', cost: 'KES 12,550 - 20,550' },
    { item: 'Total Cost (with Lawyer)', cost: 'KES 27,550 - 70,550+' }
  ];

  // Registration steps
  const registrationSteps = [
    {
      number: 1,
      title: 'Get KRA PIN for All Directors & Shareholders',
      description: 'Every director and shareholder must have a KRA PIN. Apply free on iTax (www.itax.kra.go.ke). Takes 1-3 days. Company cannot be registered without directors\' KRA PINs (Income Tax Act, Companies Act 2015).'
    },
    {
      number: 2,
      title: 'Search and Reserve Company Name',
      description: 'Go to eCitizen → Business Registration → Name Search. Type desired name + "Limited" or "Ltd". If available, reserve for 6 months (KES 500). Company name must end with "Limited" or "Ltd" (Companies Act 2015, Section 12-15).'
    },
    {
      number: 3,
      title: 'Decide Company Structure',
      description: 'Determine: Number of directors (minimum 1), number of shareholders (minimum 1), share capital amount (no minimum), company objectives, registered address. Can be same person as director and shareholder (Companies Act 2015, Sections 75-100).'
    },
    {
      number: 4,
      title: 'Prepare Memorandum & Articles of Association',
      description: 'Memorandum: Company name, objectives, registered address, share capital. Articles: Internal rules for governance. eCitizen provides standard templates (free) or customize with lawyer (Companies Act 2015, Sections 15-20).'
    },
    {
      number: 5,
      title: 'Gather Required Documents',
      description: 'Collect and scan: IDs/passports of directors and shareholders, KRA PIN certificates, proof of registered address (lease/utility bill), passport photos, signed Memorandum & Articles. All documents as PDFs (BRELA requirements).'
    },
    {
      number: 6,
      title: 'Complete Company Registration on eCitizen',
      description: 'Log into eCitizen → Business Registration → Register Company. Select "Private Limited Company". Fill company details, upload documents, submit application. Pay KES 10,050 via M-Pesa/card (Companies Act 2015, BRELA eCitizen).'
    },
    {
      number: 7,
      title: 'Wait for Approval & CR12 Certificate',
      description: 'BRELA reviews application (3-7 days). If approved, CR12 Certificate of Incorporation issued automatically. Download from eCitizen. CR12 is proof company legally exists (Companies Act 2015, Section 30).'
    },
    {
      number: 8,
      title: 'Complete Post-Registration Requirements',
      description: 'After receiving CR12: Get company KRA PIN on iTax, open company bank account, apply for county business permit, register with NHIF/NSSF (if hiring), file annual returns annually (Companies Act 2015, Income Tax Act).'
    }
  ];

  // Documents required
  const documentsRequired = [
    { document: 'National IDs/Passports (Directors & Shareholders)', required: 'Yes', notes: 'Scanned copies (PDF/JPG)' },
    { document: 'KRA PIN Certificates (Directors & Shareholders)', required: 'Yes', notes: 'Download from iTax portal' },
    { document: 'Proof of Registered Address', required: 'Yes', notes: 'Lease agreement, utility bill, landlord letter' },
    { document: 'Passport Photos (Directors & Shareholders)', required: 'Yes', notes: 'Recent color photos' },
    { document: 'Memorandum of Association', required: 'Yes', notes: 'Can use eCitizen template' },
    { document: 'Articles of Association', required: 'Yes', notes: 'Can use eCitizen template' },
    { document: 'Business Name Reservation Certificate', required: 'Yes', notes: 'From eCitizen name search' },
    { document: 'Work Permit (Foreign Directors/Shareholders)', required: 'If applicable', notes: 'Valid permit from immigration' },
    { document: 'CR1 Form (Initial Directors)', required: 'Yes', notes: 'Auto-generated on eCitizen' }
  ];

  // Timeline
  const timeline = [
    { stage: 'KRA PIN Application (if needed)', duration: '1-3 days', cost: 'Free' },
    { stage: 'Business Name Search & Reservation', duration: '5-30 seconds', cost: 'KES 500' },
    { stage: 'Document Preparation', duration: '1-3 days', cost: 'Free (DIY)' },
    { stage: 'Company Registration (eCitizen)', duration: '3-7 business days', cost: 'KES 10,050' },
    { stage: 'CR12 Certificate Issuance', duration: 'Same day - 3 days', cost: 'Included' },
    { stage: 'Company KRA PIN', duration: '1-3 days', cost: 'Free' },
    { stage: 'County Business Permit', duration: '7-30 days', cost: 'KES 2,000+' },
    { stage: 'Total Timeline (fastest)', duration: '1-2 weeks', cost: 'KES 12,550+' }
  ];

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'what-is', 'benefits', 'comparison', 'requirements', 'registration-steps', 'name-reservation', 'directors-shareholders', 'documents', 'fees', 'timeline', 'cr12', 'post-registration', 'mistakes', 'lawyer', 'faqs'];
      
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
        <title>Limited Company Registration Kenya – How to Register Ltd 2025</title>
        <meta name="description" content="Complete guide to registering a private limited company in Kenya. Step-by-step eCitizen registration, CR12 certificate, costs, directors, shares & compliance." />
        <link rel="canonical" href="https://yoursite.com/limited-company-registration-kenya" />
        
        {/* OpenGraph */}
        <meta property="og:title" content="Limited Company Registration Kenya – How to Register Ltd 2025" />
        <meta property="og:description" content="Complete guide to registering a private limited company in Kenya. Step-by-step eCitizen registration, CR12 certificate, costs & compliance." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://yoursite.com/limited-company-registration-kenya" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=630&fit=crop" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Limited Company Registration Kenya – How to Register Ltd 2025" />
        <meta name="twitter:description" content="Complete guide to registering a private limited company in Kenya. Step-by-step eCitizen registration, CR12 certificate, costs & compliance." />
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
            "description": "Legal services and company registration guidance in Kenya"
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
                "name": "Limited Company Registration Kenya",
                "item": "https://yoursite.com/limited-company-registration-kenya"
              }
            ]
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Register a Limited Company in Kenya",
            "description": "Complete step-by-step guide to registering a private limited company in Kenya through eCitizen",
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
              <Building2 className="w-8 h-8 flex-shrink-0" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">Limited Company Registration in Kenya</h1>
            </div>
            <p className="text-blue-100 text-lg max-w-3xl">Complete guide to registering a private limited company (Ltd) in Kenya. Step-by-step eCitizen registration, CR12 certificate, costs, compliance, and legal requirements for 2025.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="https://ecitizen.go.ke" target="_blank" rel="noopener noreferrer" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Register Company on eCitizen
              </a>
              <a href="/business-name-search-kenya" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
                Check Company Name <ArrowRight className="w-5 h-5" />
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
              <li>Limited Company Registration</li>
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
                    { id: 'what-is', label: 'What is Ltd Company' },
                    { id: 'benefits', label: 'Benefits' },
                    { id: 'comparison', label: 'Sole Prop vs Ltd' },
                    { id: 'requirements', label: 'Requirements' },
                    { id: 'registration-steps', label: 'Registration Steps' },
                    { id: 'name-reservation', label: 'Name Reservation' },
                    { id: 'directors-shareholders', label: 'Directors & Shares' },
                    { id: 'documents', label: 'Documents' },
                    { id: 'fees', label: 'Fees & Costs' },
                    { id: 'timeline', label: 'Timeline' },
                    { id: 'cr12', label: 'CR12 Certificate' },
                    { id: 'post-registration', label: 'After Registration' },
                    { id: 'mistakes', label: 'Common Mistakes' },
                    { id: 'lawyer', label: 'When to Hire Lawyer' },
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
                    { id: 'what-is', label: 'What is Ltd Company' },
                    { id: 'benefits', label: 'Benefits' },
                    { id: 'comparison', label: 'Sole Prop vs Ltd' },
                    { id: 'requirements', label: 'Requirements' },
                    { id: 'registration-steps', label: 'Registration Steps' },
                    { id: 'name-reservation', label: 'Name Reservation' },
                    { id: 'directors-shareholders', label: 'Directors & Shares' },
                    { id: 'documents', label: 'Documents' },
                    { id: 'fees', label: 'Fees & Costs' },
                    { id: 'timeline', label: 'Timeline' },
                    { id: 'cr12', label: 'CR12 Certificate' },
                    { id: 'post-registration', label: 'After Registration' },
                    { id: 'mistakes', label: 'Common Mistakes' },
                    { id: 'lawyer', label: 'When to Hire Lawyer' },
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
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Overview: Limited Company Registration in Kenya</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                    A <strong>private limited company (Ltd)</strong> is a separate legal entity owned by shareholders and managed by directors. It's the most popular business structure for SMEs, startups, agencies, and professional firms in Kenya. Registering a limited company is governed by the <strong>Companies Act 2015</strong> and done online through <strong>eCitizen</strong>. This guide explains everything you need to know to incorporate your company legally in Kenya in 2025.
                  </p>

                  <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border-l-4 border-blue-600">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-700 mb-1">KES 10,050</div>
                        <div className="text-xs text-gray-600">Government Fee</div>
                        <p className="text-sm text-gray-700 mt-2">Includes CR12 certificate</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-700 mb-1">3-7</div>
                        <div className="text-xs text-gray-600">Days to Register</div>
                        <p className="text-sm text-gray-700 mt-2">Fast online process</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-700 mb-1">100%</div>
                        <div className="text-xs text-gray-600">Online</div>
                        <p className="text-sm text-gray-700 mt-2">No physical visits needed</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded-lg mb-6">
                    <h4 className="font-bold text-gray-900 mb-2">Why Register a Limited Company?</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Limited Liability:</strong> Personal assets protected from business debts (Companies Act 2015)</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Separate Legal Entity:</strong> Company exists independently of owners</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Attract Investment:</strong> Can issue shares to raise capital and funding</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Perpetual Succession:</strong> Company continues even if owners change or die</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Credibility:</strong> Professional image for contracts, tenders, and corporate clients</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* What is Limited Company */}
              <section id="what-is" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Building2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What is a Private Limited Company (Ltd)?</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">A private limited company is a business entity that is legally separate from its owners (shareholders) and managers (directors). It's "limited" because shareholders' liability is limited to their share capital investment.</p>

                  <img 
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop"
                    alt="Corporate Office Building"
                    className="rounded-lg shadow-lg w-full mb-6"
                  />

                  <div className="bg-white border-2 border-gray-200 p-6 rounded-xl mb-6">
                    <h4 className="font-bold text-gray-900 mb-3">Key Characteristics</h4>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex gap-3">
                        <span className="text-blue-600 font-bold">•</span>
                        <span><strong>Separate Legal Person:</strong> Company can own property, sue, be sued, enter contracts independently (Companies Act 2015, Section 11)</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-blue-600 font-bold">•</span>
                        <span><strong>Limited Liability:</strong> Shareholders lose only their share investment if company fails, not personal assets</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-blue-600 font-bold">•</span>
                        <span><strong>1-50 Shareholders:</strong> Private limited companies have maximum 50 shareholders (Companies Act 2015, Section 12)</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-blue-600 font-bold">•</span>
                        <span><strong>Shares Not Publicly Traded:</strong> Cannot sell shares to general public or list on stock exchange</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-blue-600 font-bold">•</span>
                        <span><strong>Governed by Companies Act 2015:</strong> Strict compliance, annual returns, audited accounts required</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-cyan-50 border-l-4 border-cyan-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>Real Example:</strong> Three friends start "Tech Solutions Ltd" with KES 300,000 share capital (KES 100,000 each). Company borrows KES 5M from bank. Business fails, owes KES 8M total. Each friend loses only their KES 100,000 investment. Personal homes, cars, savings are protected. This is limited liability.</p>
                  </div>
                </div>
              </section>

              {/* Benefits */}
              <section id="benefits" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Award className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Benefits of Registering a Limited Company</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Here are the key advantages of choosing a limited company structure:</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white border-2 border-green-200 p-5 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-5 h-5 text-green-600" />
                        <h4 className="font-bold text-gray-900">Limited Liability Protection</h4>
                      </div>
                      <p className="text-gray-700 text-sm">Your personal assets (house, car, savings) are separate from company debts. If company fails, you lose only share investment (Companies Act 2015, Section 11).</p>
                    </div>

                    <div className="bg-white border-2 border-green-200 p-5 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <h4 className="font-bold text-gray-900">Attract Investment & Loans</h4>
                      </div>
                      <p className="text-gray-700 text-sm">Can issue shares to investors, raise venture capital, get larger bank loans. Banks prefer lending to limited companies.</p>
                    </div>

                    <div className="bg-white border-2 border-green-200 p-5 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="w-5 h-5 text-green-600" />
                        <h4 className="font-bold text-gray-900">Professional Credibility</h4>
                      </div>
                      <p className="text-gray-700 text-sm">Government tenders, corporate contracts, and large clients prefer limited companies. Stronger brand image and trust.</p>
                    </div>

                    <div className="bg-white border-2 border-green-200 p-5 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-5 h-5 text-green-600" />
                        <h4 className="font-bold text-gray-900">Multiple Owners Possible</h4>
                      </div>
                      <p className="text-gray-700 text-sm">Can have 1-50 shareholders. Easy to add partners, investors, or family members. Clear ownership structure (Companies Act 2015, Section 140-160).</p>
                    </div>

                    <div className="bg-white border-2 border-green-200 p-5 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <h4 className="font-bold text-gray-900">Perpetual Succession</h4>
                      </div>
                      <p className="text-gray-700 text-sm">Company continues even if director dies, resigns, or shareholders change. Business doesn't die with owners (Companies Act 2015).</p>
                    </div>

                    <div className="bg-white border-2 border-green-200 p-5 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <h4 className="font-bold text-gray-900">Tax Planning Options</h4>
                      </div>
                      <p className="text-gray-700 text-sm">Can pay directors salary (tax deductible), dividends (lower tax), retain profits. More tax efficiency than sole proprietorship (Income Tax Act).</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Comparison Table */}
              <section id="comparison" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <BookOpen className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Sole Proprietorship vs Limited Company</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Not sure which structure to choose? Here's a detailed comparison:</p>

                  <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6 overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">Feature</th>
                          <th className="px-4 py-3 text-left font-semibold">Sole Proprietorship</th>
                          <th className="px-4 py-3 text-left font-semibold">Limited Company</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {comparisonData.map((row, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900 text-sm">{row.feature}</td>
                            <td className="px-4 py-3 text-gray-700 text-sm">{row.soleProprietorship}</td>
                            <td className="px-4 py-3 text-gray-700 text-sm">{row.limitedCompany}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>Which to Choose?</strong> Sole proprietorship: small, low-risk, simple business. Limited company: growth potential, high-risk, multiple owners, need liability protection or investor funding. <a href="/sole-proprietorship-registration-kenya" className="text-blue-600 hover:text-blue-700 font-semibold">Learn more about sole proprietorship →</a></p>
                  </div>
                </div>
              </section>

              {/* Requirements */}
              <section id="requirements" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Requirements Before Registration</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Before starting registration, ensure you have:</p>

                  <div className="space-y-4 mb-6">
                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">1. At Least One Director (18+ years old)</h4>
                          <p className="text-gray-700 text-sm">Every company needs minimum 1 director. Must be natural person (not company), 18+ years, with KRA PIN. Director manages company. Same person can be director and shareholder (Companies Act 2015, Sections 75, 80-100).</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">2. At Least One Shareholder</h4>
                          <p className="text-gray-700 text-sm">Minimum 1 shareholder, maximum 50 for private limited company. Shareholder owns company. Can be individual or another company. Director and shareholder can be same person (single-member company) (Companies Act 2015, Section 140-160).</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">3. KRA PIN for All Directors & Shareholders</h4>
                          <p className="text-gray-700 text-sm">Every director and shareholder must have KRA PIN before registration. Apply free on iTax. Company also needs separate company KRA PIN after registration (Income Tax Act, Section 3-5). <a href="/kra-pin-for-business-kenya" className="text-blue-600 hover:text-blue-700 font-semibold">Get KRA PIN guide</a>.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">4. Unique Company Name Ending with "Limited" or "Ltd"</h4>
                          <p className="text-gray-700 text-sm">Company name must end with "Limited" or "Ltd" (mandatory). Search and reserve on eCitizen. Must be unique, not identical to existing companies (Companies Act 2015, Section 12-15). <a href="/business-name-search-kenya" className="text-blue-600 hover:text-blue-700 font-semibold">Check name availability</a>.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">5. Registered Physical Address in Kenya</h4>
                          <p className="text-gray-700 text-sm">Company must have physical address in Kenya (not P.O. Box). Can be: office, home, shared workspace, lawyer's office. Needed for official correspondence (Companies Act 2015, Section 115). Proof required: lease, utility bill, landlord letter.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">6. Share Capital Decision (No Minimum Required)</h4>
                          <p className="text-gray-700 text-sm">Decide total share capital and shares per shareholder. Kenya has NO minimum share capital - can be KES 100 or KES 10 million. Common: KES 100,000-1,000,000. Higher capital shows credibility (Companies Act 2015, Section 140).</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">7. Memorandum & Articles of Association</h4>
                          <p className="text-gray-700 text-sm">Memorandum: Company name, objectives, address, share capital. Articles: Internal governance rules. eCitizen provides free standard templates or customize with lawyer (Companies Act 2015, Sections 15-20).</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">8. eCitizen Account</h4>
                          <p className="text-gray-700 text-sm">Create free account on www.ecitizen.go.ke. All company registrations done online through eCitizen portal (BRELA eCitizen Framework).</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Registration Steps */}
              <section id="registration-steps" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Step-by-Step Company Registration on eCitizen</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Follow these exact steps to incorporate your limited company online:</p>

                  <img 
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop"
                    alt="Company Registration Process"
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

                  <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>Pro Tip:</strong> Do all 8 steps in one session (takes 1-2 hours). Have all documents ready as PDFs. Use desktop/laptop for easier form filling. Check email/SMS for approval. Most delays are due to incomplete documents.</p>
                  </div>
                </div>
              </section>

              {/* Name Reservation */}
              <section id="name-reservation" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Business Name Reservation</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Company names must be unique and end with "Limited" or "Ltd". Here's how to search and reserve:</p>

                  <div className="bg-white border-2 border-gray-200 p-6 rounded-xl mb-6">
                    <h4 className="font-bold text-gray-900 mb-3">Name Reservation Process</h4>
                    <ol className="space-y-3 text-gray-700">
                      <li className="flex gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-bold flex-shrink-0">1</span>
                        <span>Go to eCitizen → Business Registration → Name Search</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-bold flex-shrink-0">2</span>
                        <span>Type your desired name + "Limited" (e.g., "Tech Solutions Limited")</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-bold flex-shrink-0">3</span>
                        <span>System checks availability instantly (5-30 seconds)</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-bold flex-shrink-0">4</span>
                        <span>If available, click "Reserve Name" and pay KES 500</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-bold flex-shrink-0">5</span>
                        <span>Download reservation certificate (valid 6 months)</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-bold flex-shrink-0">6</span>
                        <span>Complete company registration within 6 months or reservation expires</span>
                      </li>
                    </ol>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded-lg mb-6">
                    <h4 className="font-bold text-gray-900 mb-2">Naming Rules for Limited Companies</h4>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• Must end with "Limited" or "Ltd" (mandatory - Companies Act 2015, Section 12)</li>
                      <li>• Cannot be identical or too similar to existing registered company</li>
                      <li>• Cannot use prohibited words: "Bank", "Insurance", "University", "Government" without license</li>
                      <li>• Cannot be misleading, offensive, or suggest government association</li>
                      <li>• Must be in English or Swahili (formal registration)</li>
                    </ul>
                  </div>

                  <p className="text-gray-700 text-sm">
                    <a href="/business-name-search-kenya" className="text-blue-600 hover:text-blue-700 font-semibold">Read full guide: Business Name Search & Reservation in Kenya →</a>
                  </p>
                </div>
              </section>

              {/* Directors, Shareholders & Shares */}
              <section id="directors-shareholders" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Users className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Directors, Shareholders & Shares Explained</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Understanding company roles and shares is critical. Here's a simple explanation:</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white border-2 border-blue-200 p-6 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                        Directors (Managers)
                      </h4>
                      <p className="text-gray-700 text-sm mb-3"><strong>Who They Are:</strong> People who manage and run the company day-to-day. Make business decisions, sign contracts, hire employees.</p>
                      <p className="text-gray-700 text-sm mb-3"><strong>Requirements:</strong> Must be 18+ years old, natural person (not company), with KRA PIN. Minimum 1 director required (Companies Act 2015, Sections 75, 80-100).</p>
                      <p className="text-gray-700 text-sm"><strong>Responsibilities:</strong> File annual returns, maintain records, act in company's best interest, avoid conflicts of interest.</p>
                    </div>

                    <div className="bg-white border-2 border-green-200 p-6 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Users className="w-5 h-5 text-green-600" />
                        Shareholders (Owners)
                      </h4>
                      <p className="text-gray-700 text-sm mb-3"><strong>Who They Are:</strong> People or companies who own shares (portions) of the company. They own the business but don't manage it daily.</p>
                      <p className="text-gray-700 text-sm mb-3"><strong>Requirements:</strong> Minimum 1 shareholder, maximum 50 for private limited company. Can be individuals or other companies (Companies Act 2015, Section 140-160).</p>
                      <p className="text-gray-700 text-sm"><strong>Rights:</strong> Receive dividends, vote at general meetings, appoint/remove directors, sell shares (with restrictions).</p>
                    </div>
                  </div>

                  <div className="bg-white border-2 border-gray-200 p-6 rounded-xl mb-6">
                    <h4 className="font-bold text-gray-900 mb-3">Understanding Shares & Share Capital</h4>
                    <p className="text-gray-700 text-sm mb-3"><strong>What is Share Capital?</strong> Total value of shares issued to shareholders. Example: KES 1,000,000 share capital = 1,000,000 shares at KES 1 each, or 10,000 shares at KES 100 each.</p>
                    <p className="text-gray-700 text-sm mb-3"><strong>No Minimum Required:</strong> Kenya has no minimum share capital. Can start with KES 100 or KES 100 million. Most companies use KES 100,000-1,000,000 (Companies Act 2015, Section 140).</p>
                    <p className="text-gray-700 text-sm mb-3"><strong>Ownership Example:</strong> Company has 100,000 shares. Shareholder A owns 60,000 shares (60%), Shareholder B owns 40,000 shares (40%). More shares = more ownership and voting power.</p>
                    <p className="text-gray-700 text-sm"><strong>Can Director Be Shareholder?</strong> Yes. Same person can be director and shareholder (common for single-member companies). Example: John is 100% shareholder and sole director.</p>
                  </div>

                  <div className="bg-cyan-50 border-l-4 border-cyan-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>Simple Analogy:</strong> Shareholders = car owners. Directors = drivers. Shareholders own the car (company) and decide where it should go. Directors drive it day-to-day. Sometimes, owner drives their own car (director = shareholder).</p>
                  </div>
                </div>
              </section>

              {/* Documents Required */}
              <section id="documents" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Documents Required for Registration</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Prepare and scan these documents before starting registration:</p>

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
                              <span className={doc.required === 'Yes' ? 'text-green-700 font-semibold' : 'text-yellow-700 font-semibold'}>
                                {doc.required}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-700 text-sm">{doc.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>Document Format:</strong> Scan all documents as clear PDF files (max 2MB each). Use phone scanner app or camera. Ensure text is readable. Blurry documents = rejection and delays.</p>
                  </div>
                </div>
              </section>

              {/* Fees & Costs */}
              <section id="fees" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <DollarSign className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Registration Fees & Government Costs</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-4">Here's the complete breakdown of costs to register and maintain a limited company in Kenya:</p>

                  <img 
                    src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=400&fit=crop"
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
                    <p className="text-gray-700 text-sm"><strong>Budget Summary:</strong> DIY registration: KES 12,550-20,550 total (name + registration + permit). With lawyer: KES 27,550-70,550+. Ongoing: Annual returns KES 1,000-3,000/year + county permit renewal.</p>
                  </div>
                </div>
              </section>

              {/* Timeline */}
              <section id="timeline" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How Long Incorporation Takes</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Here's the realistic timeline from start to fully registered company:</p>

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
                    <p className="text-gray-700 text-sm"><strong>Fastest Possible:</strong> If all directors/shareholders have KRA PINs and documents ready, you can get CR12 certificate in 3-7 days. County permit adds 1-4 weeks. Total: 1-2 weeks from start to full operation.</p>
                  </div>
                </div>
              </section>

              {/* CR12 Certificate */}
              <section id="cr12" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Award className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What is a CR12 Certificate & How to Get It</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">The CR12 Certificate of Incorporation is the most important company document. Here's everything you need to know:</p>

                  <div className="bg-white border-2 border-blue-200 p-6 rounded-xl mb-6">
                    <h4 className="font-bold text-gray-900 mb-3">What is CR12?</h4>
                    <p className="text-gray-700 text-sm mb-3">CR12 is the official certificate issued by BRELA (Business Registration and Licensing Authority) proving your company legally exists. It shows: company name, registration number, date of incorporation, and company type (Companies Act 2015, Section 30).</p>
                    <p className="text-gray-700 text-sm"><strong>Legal Importance:</strong> Without CR12, your company doesn't legally exist. You cannot open bank accounts, sign contracts, apply for permits, file taxes, or operate legally.</p>
                  </div>

                  <div className="bg-white border-2 border-gray-200 p-6 rounded-xl mb-6">
                    <h4 className="font-bold text-gray-900 mb-3">How to Get CR12</h4>
                    <ol className="space-y-2 text-gray-700 text-sm">
                      <li>1. Complete company registration on eCitizen (pay KES 10,050)</li>
                      <li>2. BRELA reviews application (3-7 business days)</li>
                      <li>3. If approved, CR12 is issued automatically</li>
                      <li>4. Download from eCitizen → My Applications → Download Certificate</li>
                      <li>5. Print multiple copies for banks, permits, contracts</li>
                    </ol>
                  </div>

                  <div className="bg-white border-2 border-gray-200 p-6 rounded-xl mb-6">
                    <h4 className="font-bold text-gray-900 mb-3">What You Can Do With CR12</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Open company bank account (required by all banks)</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Apply for county business permit and licenses</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Sign contracts, leases, and legal agreements as company</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Apply for company KRA PIN on iTax portal</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Bid for government tenders and corporate contracts</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>File annual returns and tax returns with KRA/BRELA</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>Keep CR12 Safe:</strong> Store original + digital copies in multiple locations. You'll need it constantly for banking, permits, contracts. Lost CR12? Apply for certified copy from BRELA (KES 1,000-2,000). <a href="/company-cr12-and-search-kenya" className="text-blue-600 hover:text-blue-700 font-semibold">Learn more about CR12 →</a></p>
                  </div>
                </div>
              </section>

              {/* Post-Registration */}
              <section id="post-registration" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Post-Registration Requirements</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">After receiving your CR12 certificate, complete these mandatory next steps:</p>

                  <div className="space-y-4 mb-6">
                    <div className="bg-white border-2 border-blue-200 p-6 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        1. Get Company KRA PIN
                      </h4>
                      <p className="text-gray-700 text-sm mb-2"><strong>(Income Tax Act, Section 3-5):</strong> Company needs separate KRA PIN from directors' personal PINs. Apply on iTax portal → Company Registration. Upload CR12, directors' IDs, Memorandum & Articles. Takes 1-3 days. Mandatory for filing taxes, opening bank account, invoicing.</p>
                      <p className="text-gray-700 text-sm"><a href="/kra-pin-for-business-kenya" className="text-blue-600 hover:text-blue-700 font-semibold">Full guide: How to Get Company KRA PIN →</a></p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-6 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        2. Open Company Bank Account
                      </h4>
                      <p className="text-gray-700 text-sm">Separate company finances from personal. Required documents: CR12, company KRA PIN, directors' IDs, Memorandum & Articles, board resolution, county permit. Most banks require 2+ directors to sign. Choose business account with low fees and online banking.</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-6 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        3. Apply for County Business Permit
                      </h4>
                      <p className="text-gray-700 text-sm mb-2"><strong>(County Government Act, Business Licensing Act):</strong> Mandatory to operate. Visit county website/office. Submit: CR12, company KRA PIN, directors' IDs, lease, photos. Pay KES 2,000-10,000+ (varies by county/business). Processing: 7-30 days. Operating without = fines/closure.</p>
                      <p className="text-gray-700 text-sm"><a href="/business-permits-and-licenses-kenya" className="text-blue-600 hover:text-blue-700 font-semibold">Learn more: Business Permits Guide →</a></p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-6 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        4. File Annual Returns Every Year (CR1 Form)
                      </h4>
                      <p className="text-gray-700 text-sm"><strong>(Companies Act 2015, Sections 350-380):</strong> All companies must file annual returns within 30 days of anniversary. Shows: directors, shareholders, registered address, share capital. File on eCitizen. Cost: KES 1,000-3,000. Late filing = fines up to KES 100,000. Mandatory compliance. <a href="/company-annual-returns-kenya" className="text-blue-600 hover:text-blue-700 font-semibold">Annual Returns Guide →</a></p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-6 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        5. Register with NHIF & NSSF (If Hiring Employees)
                      </h4>
                      <p className="text-gray-700 text-sm"><strong>(NHIF Act, NSSF Act, Employment Act 2007):</strong> Mandatory if you employ workers. Register company as employer. Deduct and remit monthly contributions (NHIF: KES 150-1,700, NSSF: 6% of salary). Failure = fines up to KES 100,000. File monthly.</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-6 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        6. File Annual Tax Returns
                      </h4>
                      <p className="text-gray-700 text-sm"><strong>(Income Tax Act):</strong> Companies pay 30% corporate income tax on net profits. File annual returns on iTax by June 30. Keep audited financial statements. VAT registration if turnover &gt; KES 5M. Late filing = penalties up to KES 1M + interest + jail (Section 91-95).</p>
                    </div>
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
                  <p className="text-gray-700 mb-6">Avoid these costly mistakes when registering and operating your limited company:</p>

                  <div className="space-y-3">
                    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">❌ Not Filing Annual Returns on Time</h4>
                      <p className="text-gray-700 text-sm"><strong>Consequence:</strong> Fines up to KES 100,000. Company may be struck off register (dissolved). Cannot do business, open bank accounts, or sign contracts. File CR1 annually within 30 days of anniversary (Companies Act 2015, Sections 350-380).</p>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">❌ Mixing Personal and Company Finances</h4>
                      <p className="text-gray-700 text-sm"><strong>Consequence:</strong> Loses limited liability protection. Courts can "pierce corporate veil" and hold directors personally liable for company debts. Always use separate company bank account, keep proper records (Companies Act 2015).</p>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">❌ Not Getting Proper Shareholder Agreements</h4>
                      <p className="text-gray-700 text-sm"><strong>Consequence:</strong> Shareholder disputes, deadlocks, expensive legal battles. Always have written shareholder agreement covering: share transfer rules, dividend policy, director appointment, dispute resolution. Lawyer recommended.</p>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">❌ Operating Without County Business Permit</h4>
                      <p className="text-gray-700 text-sm"><strong>Consequence:</strong> County can fine, close business, confiscate goods. Permit mandatory even after company registration. Apply immediately after CR12 (County Government Act, Business Licensing Act).</p>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">❌ Not Keeping Proper Company Records</h4>
                      <p className="text-gray-700 text-sm"><strong>Consequence:</strong> Cannot file annual returns or tax returns. KRA can estimate income and charge penalties. Directors can be fined or jailed. Mandatory: minutes of meetings, register of directors, register of shareholders, financial records (Companies Act 2015, Sections 240-260).</p>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">❌ Using Company for Personal Expenses</h4>
                      <p className="text-gray-700 text-sm"><strong>Consequence:</strong> Tax penalties, loss of limited liability, fraud charges. Company money belongs to company, not directors personally. Withdraw legally as: salary, dividends, or directors' loans (properly documented) (Companies Act 2015, Income Tax Act).</p>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">❌ Ignoring Change of Directors/Shareholders Reporting</h4>
                      <p className="text-gray-700 text-sm"><strong>Consequence:</strong> Fines, outdated records, legal disputes. Must report director/shareholder changes to BRELA within 30 days (CR2, CR8 forms). Failure = penalties (Companies Act 2015, Sections 190-200).</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* When to Hire Lawyer */}
              <section id="lawyer" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Briefcase className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">When to Hire a Lawyer or Agent</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">You can register a company yourself on eCitizen, but a lawyer is helpful in these situations:</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        DIY Registration (No Lawyer)
                      </h4>
                      <p className="text-gray-700 text-sm mb-2"><strong>Good for:</strong></p>
                      <ul className="space-y-1 text-gray-700 text-sm">
                        <li>• Simple company (1-2 shareholders)</li>
                        <li>• No complex ownership structure</li>
                        <li>• Using standard eCitizen templates</li>
                        <li>• Budget-conscious (save KES 15,000-50,000)</li>
                        <li>• You understand basic company law</li>
                      </ul>
                    </div>

                    <div className="bg-white border-2 border-green-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-green-600" />
                        Hire Lawyer/Agent
                      </h4>
                      <p className="text-gray-700 text-sm mb-2"><strong>Recommended for:</strong></p>
                      <ul className="space-y-1 text-gray-700 text-sm">
                        <li>• Multiple shareholders with complex ownership</li>
                        <li>• Custom shareholder agreements needed</li>
                        <li>• Intellectual property protection required</li>
                        <li>• Foreign shareholders or directors</li>
                        <li>• Industry-specific compliance (finance, medical, tech)</li>
                        <li>• You want to avoid mistakes and delays</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">Lawyer Fees</h4>
                    <p className="text-gray-700 text-sm">Company registration: KES 15,000-50,000. Shareholder agreement: KES 20,000-100,000+. Custom Articles of Association: KES 10,000-30,000. Total with lawyer: KES 45,000-200,000+ depending on complexity. Shop around, compare quotes.</p>
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
                <h3 className="text-2xl font-bold mb-4">Ready to Register Your Limited Company?</h3>
                <p className="text-blue-100 mb-6 max-w-2xl mx-auto">Start your company registration today. Follow our step-by-step guide and get your CR12 certificate in 1-2 weeks.</p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <a href="https://ecitizen.go.ke" target="_blank" rel="noopener noreferrer" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 inline-flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
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
                  <a href="/sole-proprietorship-registration-kenya" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Sole Proprietorship Registration
                  </a>
                  <a href="/company-cr12-and-search-kenya" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    CR12 Certificate & Company Search
                  </a>
                  <a href="/company-annual-returns-kenya" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Company Annual Returns Guide
                  </a>
                  <a href="/kra-pin-for-business-kenya" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    How to Get Company KRA PIN
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

export default LimitedCompanyRegistrationKenya;
