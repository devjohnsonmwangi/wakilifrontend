import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, AlertCircle, ArrowRight, FileText, Users, DollarSign, Briefcase, Building2, TrendingUp, Download, Lock, Heart, BarChart3, HandshakeIcon } from 'lucide-react';

const PartnershipLLPRegistrationKenya = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // FAQ data
  const faqs = [
    {
      question: 'Can a partnership have just one person?',
      answer: 'No. Partnership legally requires minimum 2 people (partners). If solo: register as sole proprietorship. General Partnership: 2-20 partners. LLP: 2-100 partners (maximum). Less than 2 people = not a partnership.'
    },
    {
      question: 'What\'s the difference between General Partnership and LLP?',
      answer: 'General Partnership (GP): All partners personally liable for business debts (unlimited liability). Easy to form, fewer formalities. LLP: Partners have limited liability (protected personal assets), but more regulatory requirements, annual returns filing (like companies), higher costs. LLP provides liability protection; GP does not.'
    },
    {
      question: 'Do partners need a written partnership agreement?',
      answer: 'For GP: Not legally required but STRONGLY recommended. Without agreement: default law applies (Partnership Act 1932), may lead to disputes. For LLP: MANDATORY written Memorandum & Articles of Association (filed with BRELA). Partnership deed protects all partners, clarifies profit sharing, roles, dispute resolution.'
    },
    {
      question: 'How are profits and losses shared in a partnership?',
      answer: 'GP: Default is equal sharing (50-50 for 2 partners, 33.3% each for 3, etc.), unless agreement specifies otherwise. Partners can agree any ratio (30-70, 40-40-20, etc.). Agreement must document exact percentages. LLP: Same principle—partners agree in writing (Memorandum). Document in partnership deed to avoid disputes.'
    },
    {
      question: 'What if one partner wants to leave the partnership?',
      answer: 'GP: Partner can withdraw (notice required per agreement, typically 30 days). Departure may dissolve partnership (unless agreement allows continuation). Departing partner entitled to share of assets/profits (settlement needed). LLP: Similar process but more formal (requires documentation, possible buy-out agreement). Partnership deed should address exit procedures.'
    },
    {
      question: 'Can partners have different roles and responsibilities?',
      answer: 'Yes. Partnership agreement specifies each partner\'s role (managing partner, operations, finance, etc.), responsibilities, authority limits. Some partnerships have sleeping partners (investors, not day-to-day ops). Roles must be documented in partnership deed to avoid confusion/disputes.'
    },
    {
      question: 'Is partnership registration mandatory in Kenya?',
      answer: 'For GP: Registration recommended but not legally mandatory (though beneficial for credibility, bank accounts, tax). For LLP: Registration MANDATORY with BRELA (legal requirement). Unregistered GP may face challenges: bank accounts harder, taxes complicated, disputes unprotected. Better to register formally.'
    },
    {
      question: 'What taxes do partnerships pay?',
      answer: 'GP: Income Tax on partnership profits (taxed individually to partners, 10-35% rate). VAT if turnover exceeds KES 5M. PAYE if employees. Turnover Tax if self-employed. LLP: Same as GP—income tax on profits, plus corporate-like compliance (annual returns, tax filings). No special partnership tax rate—standard income tax applies.'
    },
    {
      question: 'How long does partnership registration take?',
      answer: 'GP Registration (BRELA business name): 1-3 days (if no issues, same-day possible online). LLP Registration: 3-7 days (includes: name search, forms submission, BRELA review, approval). Faster if all documents ready. KRA PIN registration: 1-2 days additional.'
    },
    {
      question: 'Can a partnership be converted to a company later?',
      answer: 'Yes. De-register partnership with BRELA, then register as limited company (new PIN, new registration). Assets/liabilities transfer to company (per agreement). Process: close partnership → register company → transfer operations. Takes 2-4 weeks total. Consult accountant for tax implications.'
    },
    {
      question: 'What happens if partners disagree on major decisions?',
      answer: 'Partnership agreement should specify decision-making process (unanimous consent, majority vote, managing partner authority, etc.). Without agreement: all partners must agree (very restrictive). Disputes may lead to: mediation, arbitration (if agreement specifies), or court action. Better to agree decision process upfront in partnership deed.'
    },
    {
      question: 'Can a company be a partner in a partnership?',
      answer: 'Yes. A limited company can partner with individuals or other companies. Company acts as "artificial person" (legal entity). Company partners have limited liability (company liability, not personal directors\' liability, for partnership debts—unless personal guarantees given). Useful for multi-entity structures.'
    },
    {
      question: 'Is partnership registration more expensive than sole proprietorship?',
      answer: 'Slightly: Sole proprietor business name KES 500-1,000. Partnership name KES 1,000-2,000. LLP registration KES 3,000-5,000. Legal fees (partnership deed drafting) KES 10,000-30,000 (optional but recommended). So partnership marginally more expensive, but liability protection/formality worth extra cost.'
    },
    {
      question: 'What happens to a partnership if a partner dies?',
      answer: 'GP: Default is partnership dissolves (unless agreement says otherwise). Deceased partner\'s estate entitled to share of assets (negotiated with surviving partners). Surviving partners may continue as new partnership (new registration). LLP: Similar—agreement should specify succession/buyout procedures. Better to address in partnership deed.'
    },
    {
      question: 'Can a partnership have sleeping partners?',
      answer: 'Yes. Sleeping partner: invests capital, shares profits, but not involved in day-to-day operations. Must be documented in partnership deed (clearly marked as sleeping/silent partner). Reduces creditor liability for sleeping partner (in some circumstances). All partners still jointly liable for business debts (GP) unless specified.'
    }
  ];

  // Partnership comparison
  const partnershipComparison = [
    {
      aspect: 'Number of Owners',
      general: '2-20 partners',
      llp: '2-100 partners',
      sole: '1 person',
      company: '1+ shareholders'
    },
    {
      aspect: 'Liability',
      general: 'Unlimited (personally liable)',
      llp: 'Limited (protected)',
      sole: 'Unlimited (personal)',
      company: 'Limited (shares only)'
    },
    {
      aspect: 'Formality',
      general: 'Low (simple deed)',
      llp: 'High (like company)',
      sole: 'Very low',
      company: 'Very high (complex)'
    },
    {
      aspect: 'Registration Cost',
      general: 'KES 1,000-2,000',
      llp: 'KES 3,000-5,000',
      sole: 'KES 500-1,000',
      company: 'KES 5,000-10,000'
    },
    {
      aspect: 'Annual Returns',
      general: 'Not required',
      llp: 'Required (like company)',
      sole: 'Not required',
      company: 'Required (mandatory)'
    },
    {
      aspect: 'Tax Rate',
      general: '10-35% income tax',
      llp: '10-35% income tax',
      sole: '10-35% income tax',
      company: '30% corporate tax'
    }
  ];

  // LLP types
  const llpTypes = [
    {
      type: 'General LLP',
      description: 'Standard LLP with multiple partners sharing management. Most common. Useful for law firms, accounting firms, consulting, agencies.'
    },
    {
      type: 'Limited LLP',
      description: 'Some partners have limited roles (sleeping/investor partners). Operating partners manage day-to-day. More flexibility than standard LLP.'
    },
    {
      type: 'Professional LLP',
      description: 'LLP for regulated professions (law, accounting, medicine, engineering). Must follow professional body regulations. Easier liability management than general partnership.'
    }
  ];

  // Registration steps for GP
  const gpRegistrationSteps = [
    {
      number: 1,
      title: 'Prepare Partnership Details',
      description: 'Decide: partnership name, type (General or LLP), partner names, address, business nature, capital contributions, profit sharing ratio.'
    },
    {
      number: 2,
      title: 'Search Business Name on BRELA',
      description: 'Go to BRELA website or office, search proposed partnership name. Ensure available (not used by another business). Reserve name if needed.'
    },
    {
      number: 3,
      title: 'Draft Partnership Deed',
      description: 'Create written partnership agreement (or use template). Include: partners\' details, capital contributions, profit/loss sharing, roles, decision-making, dispute resolution, exit procedures. All partners sign and date.'
    },
    {
      number: 4,
      title: 'Prepare Registration Documents',
      description: 'Gather: partners\' IDs/passports, partner names, partnership name, address, business nature, capital amounts, partnership deed (signed). Prepare registration form (can download from BRELA or use eCitizen).'
    },
    {
      number: 5,
      title: 'Submit Registration Application to BRELA',
      description: 'Option 1: Visit BRELA office in person with documents. Option 2: Submit online via eCitizen portal (if available). Both options available—choose convenience.'
    },
    {
      number: 6,
      title: 'Pay Registration Fee',
      description: 'Pay BRELA fee (KES 1,000-2,000). Payment methods: cash (in person), card (online), mobile money (depending on BRELA acceptance). Receipt provided.'
    },
    {
      number: 7,
      title: 'Receive Registration Certificate',
      description: 'BRELA issues partnership registration certificate (proof of registration). Processing: 1-3 days (same day possible if submitted early). Get certified copy for records.'
    },
    {
      number: 8,
      title: 'Register for KRA PIN',
      description: 'Register partnership for KRA PIN (Tax Identification Number). One partner applies at iTax portal or KRA office. Takes 15-30 minutes online. PIN required for: bank accounts, taxes, government contracts.'
    },
    {
      number: 9,
      title: 'Open Business Bank Account',
      description: 'Visit bank with: partnership registration certificate, KRA PIN, partners\' IDs, partnership deed. Open joint or single account (per agreement). Required for business transactions.'
    },
    {
      number: 10,
      title: 'Register with County (Licenses/Permits)',
      description: 'If business needs county license/permit (retail, food, alcohol, etc.): visit county office, complete application, pay fee. Not needed for all businesses (check with county).'
    }
  ];

  // LLP registration steps
  const llpRegistrationSteps = [
    {
      number: 1,
      title: 'Prepare LLP Business Plan',
      description: 'Decide: LLP name, partners, nature of business, capital contributions, partner roles/responsibilities, management structure, profit sharing, dispute resolution procedures.'
    },
    {
      number: 2,
      title: 'Search Business Name',
      description: 'BRELA search (online or in person): ensure LLP name available. Reserve name if needed (protects 30-90 days). Cannot use name too similar to existing companies/partnerships.'
    },
    {
      number: 3,
      title: 'Draft Memorandum & Articles of Association',
      description: 'Create detailed LLP constitution. Include: LLP purpose, partners\' rights/duties, capital structure, profit/loss distribution, management process, partner admission/removal, dissolution procedures. All partners agree and sign.'
    },
    {
      number: 4,
      title: 'Prepare All Documents',
      description: 'Gather: partners\' IDs/passports, all partner names/addresses, LLP name, business address, Memorandum & Articles (signed), capital proof (bank statements showing contributions), proposed partners list.'
    },
    {
      number: 5,
      title: 'Submit LLP Registration Form (Form 101) to BRELA',
      description: 'Complete BRELA LLP registration form (Form 101). Submit with all supporting documents. Option 1: In person at BRELA office. Option 2: Online via eCitizen (if enabled). BRELA verifies documents.'
    },
    {
      number: 6,
      title: 'Incorporate LLP (BRELA Approval)',
      description: 'BRELA reviews application (3-7 days). If approved: LLP incorporated (legally becomes separate entity). Issues incorporation certificate + LLP registration number.'
    },
    {
      number: 7,
      title: 'Pay Registration Fees',
      description: 'BRELA fee: KES 3,000-5,000 (depending on LLP type/size). Pay at BRELA office or online (varies). Documentation fee may apply. Get receipt.'
    },
    {
      number: 8,
      title: 'Obtain Incorporation Certificate',
      description: 'Receive official LLP incorporation certificate from BRELA. Shows: LLP name, registration number, date of incorporation, partners\' names. This is proof LLP exists legally.'
    },
    {
      number: 9,
      title: 'Register LLP for KRA PIN',
      description: 'Designated partner registers LLP for KRA PIN (tax number). Go to iTax portal or KRA office with: incorporation certificate, partners\' IDs, LLP address. Get PIN same day (15-30 mins online).'
    },
    {
      number: 10,
      title: 'Open LLP Bank Account',
      description: 'Bank visit with: incorporation certificate, KRA PIN, all partners\' IDs, Memorandum & Articles. Open LLP account. Funds belong to LLP (not personal). All partners may transact or designated signatories only (per agreement).'
    },
    {
      number: 11,
      title: 'File Annual Returns with BRELA',
      description: 'LLP MUST file annual returns yearly (within 30 days of financial year end). Like companies, report: partners\' details, capital changes, financial status. Compliance requirement.'
    }
  ];

  // Documents table
  const documentsRequired = [
    { document: 'Partners\' IDs/Passports', required: 'All partners', purpose: 'Identification & verification' },
    { document: 'Partnership Deed (signed)', required: 'GP only', purpose: 'Outlines terms, profit sharing, roles' },
    { document: 'Memorandum & Articles', required: 'LLP only', purpose: 'LLP constitution (mandatory)' },
    { document: 'Bank Statements (capital proof)', required: 'LLP (optional for GP)', purpose: 'Proof of capital contributions' },
    { document: 'Business Address Proof', required: 'Both', purpose: 'Lease/ownership documentation' },
    { document: 'Registration Form (BRELA)', required: 'Both', purpose: 'Official application form' },
    { document: 'Partnership Name Search Result', required: 'Both', purpose: 'Proof name is available' },
    { document: 'Tax ID (if existing business)', required: 'Optional', purpose: 'If converting from sole prop' }
  ];

  // Costs table
  const costBreakdown = [
    { service: 'BRELA Business Name Search', cost: 'KES 0-500' },
    { service: 'GP Partnership Registration (BRELA)', cost: 'KES 1,000-2,000' },
    { service: 'LLP Registration (BRELA)', cost: 'KES 3,000-5,000' },
    { service: 'Partnership Deed Drafting (lawyer)', cost: 'KES 10,000-30,000' },
    { service: 'KRA PIN Registration', cost: 'KES 0 (free)' },
    { service: 'Bank Account Opening', cost: 'KES 0-1,000' },
    { service: 'County License/Permit (if needed)', cost: 'KES 2,000-10,000' },
    { service: 'Certified Copies (certificates)', cost: 'KES 500-1,000' }
  ];

  // Benefits
  const benefits = [
    {
      benefit: 'Shared Responsibilities',
      description: 'Multiple partners share management burden. Each brings skills/expertise. Workload distributed. Ideal for complementary skills.'
    },
    {
      benefit: 'Increased Capital & Resources',
      description: 'Combined capital from 2+ partners. More investment = more business expansion. Risk shared financially.'
    },
    {
      benefit: 'Credibility & Trust',
      description: 'Multiple owners increase business credibility. Customers/banks trust multi-partner businesses more than solo operations.'
    },
    {
      benefit: 'Flexible Decision-Making',
      description: 'Partners collaborate on decisions (if agreement specifies). Diverse perspectives improve business strategy.'
    },
    {
      benefit: 'Liability Protection (LLP)',
      description: 'LLP partners have limited liability. Personal assets protected if business faces lawsuits/debts (limited protection).'
    },
    {
      benefit: 'Easier Problem-Solving',
      description: 'Multiple partners = different approaches to solving problems. Reduces individual stress/burden.'
    }
  ];

  // Risks
  const risks = [
    {
      risk: 'Personal Liability (GP)',
      description: 'General Partnership: all partners personally liable for business debts. Creditors can pursue personal assets. One bad decision by partner = all partners liable.'
    },
    {
      risk: 'Disagreements Between Partners',
      description: 'Disputes on strategy, profit sharing, roles. May require mediation/arbitration. Disagreement can paralyze business decisions. Exit procedures critical.'
    },
    {
      risk: 'One Partner\'s Actions Bind All',
      description: 'In GP: one partner can sign contracts binding entire partnership. Other partners may be unaware. Creates liability for all (unless partnership deed restricts).'
    },
    {
      risk: 'Difficulty Removing Partner',
      description: 'Cannot easily remove partner unless agreement specifies. Disagreement may require full dissolution. Exit procedures must be in partnership deed.'
    },
    {
      risk: 'Unequal Effort/Contribution',
      description: 'One partner may do more work but have equal profit share (if agreement is equal split). Causes resentment, disputes. Needs clear roles/profit agreement.'
    },
    {
      risk: 'Partner Death/Departure',
      description: 'GP dissolves if partner leaves (unless agreement specifies continuation). Sudden death creates uncertainty. Succession planning critical.'
    }
  ];

  // Common mistakes
  const commonMistakes = [
    {
      mistake: 'No Written Partnership Deed',
      consequence: 'Default Partnership Act 1932 applies (outdated, may not suit your business). Disputes over profit sharing, roles, exit procedures. Better to draft clear written agreement.'
    },
    {
      mistake: 'Unequal Profit Sharing Without Documentation',
      consequence: 'Partners argue over how profits divided. Default is equal (50-50). If different intended: MUST be in writing. Undocumented agreements unenforceable.'
    },
    {
      mistake: 'Unclear Partner Roles',
      consequence: 'Partners unsure who does what. Overlapping responsibilities, missed tasks. Agreement should define each partner\'s role/authority.'
    },
    {
      mistake: 'No Succession/Exit Plan',
      consequence: 'Partner wants to leave or dies: no process. Business may dissolve unintentionally. Partnership deed must address partner removal, buyout, inheritance.'
    },
    {
      mistake: 'Mixing Personal & Business Money',
      consequence: 'Personal finances mixed with partnership funds. Creditors may claim personal assets (liability protection lost). Separate bank accounts essential.'
    },
    {
      mistake: 'Not Filing Annual Returns (LLP)',
      consequence: 'LLP required to file returns yearly. Non-filing = penalties KES 50,000+. After 2 years: auto strike-off (dissolves involuntarily). Maintain compliance.'
    }
  ];

  // Registration timeline
  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'what-is', 'types', 'comparison', 'benefits', 'risks', 'requirements', 'gp-steps', 'llp-steps', 'partnership-deed', 'documents', 'fees', 'taxes', 'profit-sharing', 'mistakes', 'faqs'];
      
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
        <title>Partnership & LLP Registration Kenya – Guide 2026 & 2027</title>
        <meta name="description" content="Complete guide to partnership and LLP registration in Kenya. Step-by-step process, costs, partnership deed, tax requirements, and legal responsibilities." />
        <link rel="canonical" href="https://yoursite.com/partnership-llp-registration-kenya" />
        
        {/* OpenGraph */}
        <meta property="og:title" content="Partnership & LLP Registration Kenya – Complete Guide 2026 & 2027" />
        <meta property="og:description" content="Register a general partnership or LLP in Kenya. Step-by-step guide, costs, partnership deed, profit sharing, tax compliance & legal requirements." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://yoursite.com/partnership-llp-registration-kenya" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=630&fit=crop" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Partnership & LLP Registration Kenya – Guide 2026 & 2027" />
        <meta name="twitter:description" content="Step-by-step guide to registering a partnership or LLP in Kenya. Includes partnership deed, costs, tax, profit sharing & legal requirements." />
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
            "description": "Partnership and LLP registration services in Kenya"
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
                "name": "Partnership & LLP Registration",
                "item": "https://yoursite.com/partnership-llp-registration-kenya"
              }
            ]
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Register a Partnership or LLP in Kenya",
            "description": "Step-by-step guide to registering a general partnership or limited liability partnership",
            "step": [
              ...gpRegistrationSteps.map(step => ({
                "@type": "HowToStep",
                "position": step.number,
                "name": step.title,
                "text": step.description
              })),
              ...llpRegistrationSteps.slice(0, 5).map((step, idx) => ({
                "@type": "HowToStep",
                "position": gpRegistrationSteps.length + idx + 1,
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
              <Users className="w-8 h-8 flex-shrink-0" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">Partnership & LLP Registration in Kenya</h1>
            </div>
            <p className="text-blue-100 text-lg max-w-3xl">Complete legal guide to registering a general partnership or limited liability partnership in Kenya. Step-by-step process, partnership deed, costs, tax requirements, and profit sharing explained.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="https://brela.go.ke" target="_blank" rel="noopener noreferrer" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                BRELA Services
              </a>
              <a href="/how-to-register-business-kenya" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
                All Registration Types <ArrowRight className="w-5 h-5" />
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
              <li>Partnership & LLP Registration</li>
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
                    { id: 'what-is', label: 'What is Partnership' },
                    { id: 'types', label: 'Types' },
                    { id: 'comparison', label: 'Comparison' },
                    { id: 'benefits', label: 'Benefits' },
                    { id: 'risks', label: 'Risks' },
                    { id: 'requirements', label: 'Requirements' },
                    { id: 'gp-steps', label: 'Register GP' },
                    { id: 'llp-steps', label: 'Register LLP' },
                    { id: 'partnership-deed', label: 'Partnership Deed' },
                    { id: 'documents', label: 'Documents' },
                    { id: 'fees', label: 'Costs' },
                    { id: 'taxes', label: 'Taxes' },
                    { id: 'profit-sharing', label: 'Profit Sharing' },
                    { id: 'mistakes', label: 'Mistakes' },
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
                    { id: 'what-is', label: 'What is Partnership' },
                    { id: 'types', label: 'Types of Partnerships' },
                    { id: 'comparison', label: 'Comparison Table' },
                    { id: 'benefits', label: 'Benefits' },
                    { id: 'risks', label: 'Risks & Responsibilities' },
                    { id: 'requirements', label: 'Requirements' },
                    { id: 'gp-steps', label: 'Register GP' },
                    { id: 'llp-steps', label: 'Register LLP' },
                    { id: 'partnership-deed', label: 'Partnership Deed' },
                    { id: 'documents', label: 'Documents Required' },
                    { id: 'fees', label: 'Costs & Fees' },
                    { id: 'taxes', label: 'Tax & KRA' },
                    { id: 'profit-sharing', label: 'Profit Sharing' },
                    { id: 'mistakes', label: 'Common Mistakes' },
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
              {/* Overview */}
              <section id="overview" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <HandshakeIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Partnership & LLP Registration Overview</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                    A <strong>partnership</strong> is when 2 or more people join together to run a business and share profits/losses. There are two main types: <strong>General Partnership (GP)</strong> (simpler, less formal) and <strong>Limited Liability Partnership (LLP)</strong> (more formal, liability protection). This guide explains both.
                  </p>

                  <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border-l-4 border-blue-600">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-700 mb-1">2+ People</div>
                        <div className="text-xs text-gray-600">Required</div>
                        <p className="text-sm text-gray-700 mt-2">Minimum partners</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-700 mb-1">KES 1-5K</div>
                        <div className="text-xs text-gray-600">Registration Cost</div>
                        <p className="text-sm text-gray-700 mt-2">Government fee only</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-700 mb-1">3-7 Days</div>
                        <div className="text-xs text-gray-600">Timeline</div>
                        <p className="text-sm text-gray-700 mt-2">LLP (1-3 for GP)</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg mb-6">
                    <h4 className="font-bold text-gray-900 mb-2">✅ When to Register as Partnership</h4>
                    <p className="text-gray-700 text-sm">Choose partnership if: 2+ business owners, want to share management/profits, need flexibility (vs. company structure), lower startup costs, informal yet legitimate structure.</p>
                  </div>
                </div>
              </section>

              {/* What is Partnership */}
              <section id="what-is" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Briefcase className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What is a Business Partnership</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">
                    A partnership is a business arrangement where 2 or more individuals (called partners) agree to:
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="bg-white border-2 border-gray-200 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-1">Run a Business Together</h4>
                      <p className="text-gray-700 text-sm">Partners combine effort/skills to operate business. Each contributes (capital, labor, expertise). Shared decision-making on operations.</p>
                    </div>

                    <div className="bg-white border-2 border-gray-200 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-1">Share Profits & Losses</h4>
                      <p className="text-gray-700 text-sm">Business income distributed to partners (per agreement). If losses: partners share burden (not kept by business). Typical split: equal (50-50), or custom percentages.</p>
                    </div>

                    <div className="bg-white border-2 border-gray-200 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-1">Are Jointly Liable (GP)</h4>
                      <p className="text-gray-700 text-sm">In General Partnership: all partners personally liable for business debts/obligations. If business owes KES 1M, creditors can pursue partners' personal assets. (LLP provides limited liability protection.)</p>
                    </div>

                    <div className="bg-white border-2 border-gray-200 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-1">Governed by Partnership Deed</h4>
                      <p className="text-gray-700 text-sm">Written agreement (partnership deed) outlines: roles, capital contributions, profit sharing, decision-making, dispute resolution, exit procedures. If no deed: default Partnership Act 1932 applies (may not suit modern business).</p>
                    </div>
                  </div>

                  <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>Real Example:</strong> Three friends (John, Mary, Ahmed) start a tech agency. Each contributes KES 100K capital, 40% profit share each. Partnership deed specifies: John handles sales, Mary handles tech, Ahmed handles finance. Profits split 40-40-20 (Ahmed does less work). Losses also shared same way.</p>
                  </div>
                </div>
              </section>

              {/* Types */}
              <section id="types" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <BarChart3 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Types of Partnerships in Kenya</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Kenya recognizes two main partnership types:</p>

                  <img 
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop"
                    alt="Business Partnership Types"
                    className="rounded-lg shadow-lg w-full mb-6"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h3 className="font-bold text-gray-900 mb-3">🔗 General Partnership (GP)</h3>
                      <p className="text-gray-700 text-sm mb-3"><strong>Definition:</strong> 2-20 partners, each personally liable for business debts (unlimited liability).</p>
                      <ul className="space-y-2 text-sm text-gray-700 mb-3">
                        <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span>Partners: 2-20 maximum</span></li>
                        <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span>Liability: Unlimited (personal assets at risk)</span></li>
                        <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span>Formality: Low (simple deed)</span></li>
                        <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span>Annual Returns: Not required</span></li>
                        <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span>Cost: KES 1,000-2,000 (BRELA)</span></li>
                      </ul>
                      <p className="text-gray-700 text-sm"><strong>Best For:</strong> Small agencies, shops, family businesses, consulting where partners know each other well.</p>
                    </div>

                    <div className="bg-white border-2 border-green-200 p-5 rounded-xl">
                      <h3 className="font-bold text-gray-900 mb-3">🛡️ Limited Liability Partnership (LLP)</h3>
                      <p className="text-gray-700 text-sm mb-3"><strong>Definition:</strong> 2-100 partners, limited liability (personal assets protected up to investment).</p>
                      <ul className="space-y-2 text-sm text-gray-700 mb-3">
                        <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /><span>Partners: 2-100 maximum</span></li>
                        <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /><span>Liability: Limited (to capital contribution)</span></li>
                        <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /><span>Formality: High (like company, annual returns required)</span></li>
                        <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /><span>Annual Returns: Yes (mandatory)</span></li>
                        <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /><span>Cost: KES 3,000-5,000 (BRELA)</span></li>
                      </ul>
                      <p className="text-gray-700 text-sm"><strong>Best For:</strong> Professional firms (law, accounting, medicine), larger ventures, where liability protection crucial.</p>
                    </div>
                  </div>

                  <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
                    <h4 className="font-bold text-gray-900 mb-3">📊 LLP Types</h4>
                    <div className="space-y-2">
                      {llpTypes.map((type, idx) => (
                        <div key={idx} className="border-l-4 border-blue-600 pl-4 py-2">
                          <h5 className="font-semibold text-gray-900">{type.type}</h5>
                          <p className="text-gray-700 text-sm">{type.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Comparison Table */}
              <section id="comparison" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <BarChart3 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Partnership vs Sole Proprietorship vs Company</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Comparison of different business structures:</p>

                  <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6 overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">Aspect</th>
                          <th className="px-4 py-3 text-left font-semibold">General Partnership</th>
                          <th className="px-4 py-3 text-left font-semibold">LLP</th>
                          <th className="px-4 py-3 text-left font-semibold">Sole Proprietor</th>
                          <th className="px-4 py-3 text-left font-semibold">Limited Company</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {partnershipComparison.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-semibold text-gray-900 text-sm">{item.aspect}</td>
                            <td className="px-4 py-3 text-gray-700 text-sm">{item.general}</td>
                            <td className="px-4 py-3 text-gray-700 text-sm">{item.llp}</td>
                            <td className="px-4 py-3 text-gray-700 text-sm">{item.sole}</td>
                            <td className="px-4 py-3 text-gray-700 text-sm">{item.company}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* Benefits */}
              <section id="benefits" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Benefits of a Partnership</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Why choose partnership over solo business:</p>

                  <div className="space-y-3 mb-6">
                    {benefits.map((item, index) => (
                      <div key={index} className="bg-white border-2 border-green-200 p-4 rounded-lg">
                        <h4 className="font-bold text-gray-900 mb-1">✅ {item.benefit}</h4>
                        <p className="text-gray-700 text-sm">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Risks */}
              <section id="risks" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Risks & Legal Responsibilities</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Challenges of partnerships (especially General Partnership):</p>

                  <div className="space-y-3 mb-6">
                    {risks.map((item, index) => (
                      <div key={index} className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                        <h4 className="font-bold text-gray-900 mb-1">⚠️ {item.risk}</h4>
                        <p className="text-gray-700 text-sm">{item.description}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">💡 Mitigation Strategy</h4>
                    <p className="text-gray-700 text-sm mb-2">To minimize risks: (1) Write detailed partnership deed addressing all points, (2) Consider LLP for liability protection, (3) Regular partner meetings and communication, (4) Clear decision-making process, (5) Succession planning, (6) Professional accounting/legal advice.</p>
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
                  <p className="text-gray-700 mb-6">What you need to register a partnership:</p>

                  <div className="space-y-3 mb-6">
                    <div className="bg-white border-2 border-blue-200 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">👥 All Partners Ready</h4>
                      <p className="text-gray-700 text-sm">All partners must agree to register. Each partner needs: valid ID/passport, residential address, identification details.</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">💼 Partnership Name Decided</h4>
                      <p className="text-gray-700 text-sm">Decide business name (e.g., "Ahmed & Sons Trading," "TechVision LLP"). Name must be unique (no other business registered with same name). Check availability on BRELA first.</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">📋 Partnership Deed Drafted</h4>
                      <p className="text-gray-700 text-sm">For GP: draft written agreement (recommended). For LLP: MANDATORY—Memorandum & Articles of Association (detailed constitution). Deed outlines roles, profit sharing, decision-making, etc.</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">💰 Capital/Funding Ready</h4>
                      <p className="text-gray-700 text-sm">Partners contribute capital (agreed amounts). Not required by law (can be KES 0), but LLP requires proof of contributions (for credibility). Have capital available to fund business startup.</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">📍 Business Address</h4>
                      <p className="text-gray-700 text-sm">Decide physical business address (office, shop, home office). Need proof of address (lease, ownership, utility bill). Address registered with BRELA.</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">🎯 Business Nature Decided</h4>
                      <p className="text-gray-700 text-sm">Define what business does (e.g., "retail clothing," "consulting services," "food trading"). Required for registration.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* GP Steps */}
              <section id="gp-steps" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Users className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Step-by-Step General Partnership Registration</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">How to register a General Partnership in Kenya:</p>

                  <div className="space-y-4 mb-6">
                    {gpRegistrationSteps.map((step) => (
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
                    <p className="text-gray-700 text-sm"><strong>Timeline:</strong> General Partnership registration typically takes 1-3 days (very fast). If all documents ready and submitted early: same-day registration possible.</p>
                  </div>
                </div>
              </section>

              {/* LLP Steps */}
              <section id="llp-steps" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Building2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">LLP Registration Process (Step-by-Step)</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Detailed process for registering a Limited Liability Partnership:</p>

                  <img 
                    src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop"
                    alt="LLP Registration Process"
                    className="rounded-lg shadow-lg w-full mb-6"
                  />

                  <div className="space-y-4 mb-6">
                    {llpRegistrationSteps.map((step) => (
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
                    <p className="text-gray-700 text-sm"><strong>Timeline:</strong> LLP registration takes 3-7 days (more complex than GP). Delay may occur if: BRELA receives many applications, requires additional documents, name search takes time. Plan accordingly.</p>
                  </div>
                </div>
              </section>

              {/* Partnership Deed */}
              <section id="partnership-deed" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Partnership Deed Explained</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">The partnership deed (or partnership agreement) is a written contract between partners outlining all terms:</p>

                  <div className="bg-white border-2 border-blue-200 p-6 rounded-xl mb-6">
                    <h4 className="font-bold text-gray-900 mb-3">📋 What Should Be in Partnership Deed?</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Partner Names & Details:</strong> Full names, IDs, addresses of all partners</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Partnership Name:</strong> Official business name</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Business Nature:</strong> What business does (retail, services, etc.)</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Capital Contribution:</strong> How much each partner contributes (KES amounts)</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Profit Sharing Ratio:</strong> How profits/losses divided (e.g., 50-50, 40-40-20, etc.)</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Partner Roles:</strong> What each partner does (managing, operations, finance, etc.)</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Decision-Making:</strong> How decisions made (unanimous, majority, managing partner authority)</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Partner Withdrawal:</strong> How/when partner can exit, buyout terms</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Dispute Resolution:</strong> How to resolve conflicts (mediation, arbitration, court)</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Dissolution Procedure:</strong> How partnership ends (voluntary, death, bankruptcy)</span></li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg mb-6">
                    <h4 className="font-bold text-gray-900 mb-2">💡 Importance of Partnership Deed</h4>
                    <p className="text-gray-700 text-sm mb-2"><strong>For GP:</strong> Not legally required, but STRONGLY recommended. Without deed: default Partnership Act 1932 applies (may be outdated/unsuitable for modern business). Written deed protects all partners, clarifies expectations, prevents disputes.</p>
                    <p className="text-gray-700 text-sm"><strong>For LLP:</strong> Memorandum & Articles MANDATORY (legal requirement). Cannot register LLP without constitution.</p>
                  </div>

                  <div className="bg-white border-2 border-gray-200 p-5 rounded-xl">
                    <h4 className="font-bold text-gray-900 mb-2">📝 Creating Partnership Deed</h4>
                    <p className="text-gray-700 text-sm mb-3"><strong>Option 1: Template</strong> - Use free partnership deed template (available online), customize to your partnership. Cost: KES 0.</p>
                    <p className="text-gray-700 text-sm"><strong>Option 2: Lawyer Draft</strong> - Hire lawyer to draft custom deed (personalized, legal review). Cost: KES 10,000-30,000 (recommended if complex partnership).</p>
                  </div>
                </div>
              </section>

              {/* Documents */}
              <section id="documents" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Documents Required</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Documents you'll need to register partnership:</p>

                  <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6 overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">Document</th>
                          <th className="px-4 py-3 text-left font-semibold">Required From</th>
                          <th className="px-4 py-3 text-left font-semibold">Purpose</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {documentsRequired.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-semibold text-gray-900 text-sm">{item.document}</td>
                            <td className="px-4 py-3 text-gray-700 text-sm">{item.required}</td>
                            <td className="px-4 py-3 text-gray-700 text-sm">{item.purpose}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* Fees */}
              <section id="fees" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <DollarSign className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Registration Fees & Costs</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Complete breakdown of partnership registration costs:</p>

                  <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6 overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">Service/Fee</th>
                          <th className="px-4 py-3 text-left font-semibold">Cost (KES)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {costBreakdown.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">{item.service}</td>
                            <td className="px-4 py-3 text-gray-700 font-semibold">{item.cost}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">💰 Budget Summary</h4>
                    <p className="text-gray-700 text-sm mb-2"><strong>GP (DIY):</strong> KES 1,000-2,500 (BRELA + partner expenses, no lawyer).</p>
                    <p className="text-gray-700 text-sm mb-2"><strong>GP (Professional):</strong> KES 15,000-35,000 (with lawyer drafting deed).</p>
                    <p className="text-gray-700 text-sm"><strong>LLP:</strong> KES 3,000-30,000+ (higher formality + likely professional help).</p>
                  </div>
                </div>
              </section>

              {/* Taxes */}
              <section id="taxes" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <DollarSign className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Tax & KRA Requirements</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Tax obligations for partnerships:</p>

                  <div className="space-y-4 mb-6">
                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">📌 KRA PIN Registration</h4>
                      <p className="text-gray-700 text-sm"><strong>Mandatory:</strong> Register partnership for KRA PIN (Tax Identification Number) with KRA. One partner applies at iTax portal or KRA office. Takes 15-30 minutes. PIN required for: opening bank accounts, filing taxes, government contracts. Cost: FREE.</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">💰 Income Tax on Partnership Profits</h4>
                      <p className="text-gray-700 text-sm">Partnership profits taxed as <strong>individual income to each partner</strong> (not partnership level). Tax rate: 10-35% (depends on income bracket). Each partner files personal tax return (ITR-D form) showing their share of partnership profit. Partnership (as entity) doesn't file corporate tax (unlike limited company).</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">📋 VAT (if applicable)</h4>
                      <p className="text-gray-700 text-sm">If partnership turnover exceeds KES 5M/year: register for VAT (14% sales tax). File VAT returns quarterly with KRA (show sales, purchases, VAT due). Not all partnerships reach VAT threshold (smaller businesses exempt).</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">👥 PAYE (if employing staff)</h4>
                      <p className="text-gray-700 text-sm">If partnership employs employees: register for PAYE (Pay As You Earn tax). Withhold income tax from employee salaries (5%-30.5%), remit to KRA monthly. File monthly PAYE returns.</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">📊 Annual Returns (LLP Only)</h4>
                      <p className="text-gray-700 text-sm">LLP MUST file annual returns with BRELA yearly (like companies). GP does NOT require annual returns (easier compliance). Returns show: partnership activities, financial status, partner changes. Deadline: 30 days after financial year end. Failure = penalties KES 50,000+.</p>
                    </div>
                  </div>

                  <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>KRA PIN Registration Link:</strong> See <a href="/kra-pin-for-business-kenya" className="text-blue-600 hover:text-blue-700 font-semibold">KRA PIN Registration Kenya</a> guide for detailed iTax process.</p>
                  </div>
                </div>
              </section>

              {/* Profit Sharing */}
              <section id="profit-sharing" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Heart className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How Profits & Losses Are Shared</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Profit sharing is core partnership concept:</p>

                  <div className="space-y-4 mb-6">
                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">🔹 Default (No Agreement)</h4>
                      <p className="text-gray-700 text-sm"><strong>Equal Split:</strong> If partnership has no agreement specifying profit sharing: partners split profits equally. 2 partners = 50-50 each. 3 partners = 33.3% each. 4 partners = 25% each. This default applies under Partnership Act 1932.</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">🔹 Custom Split (With Agreement)</h4>
                      <p className="text-gray-700 text-sm"><strong>Any Ratio Agreed:</strong> Partners can specify any profit split in partnership deed. Examples: 40-60 (one partner gets more), 30-40-30 (unequal 3-partner split), 50-25-25 (weighted based on capital/effort). MUST be documented in written agreement to be enforceable.</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">💡 Example Scenarios</h4>
                      <div className="space-y-2 text-gray-700 text-sm">
                        <div className="pl-4 border-l-2 border-gray-300">
                          <p><strong>Scenario 1:</strong> John & Mary start clothing shop. Each contributes KES 500K capital, work equally. Agree 50-50 profit split. If profit KES 200K/year: John gets KES 100K, Mary gets KES 100K.</p>
                        </div>
                        <div className="pl-4 border-l-2 border-gray-300">
                          <p><strong>Scenario 2:</strong> Ahmed (managing partner, KES 1M invested) & Fatima (silent partner, KES 500K) start agency. Agree: Ahmed 60%, Fatima 40% (more work by Ahmed justifies higher share). If profit KES 300K: Ahmed KES 180K, Fatima KES 120K.</p>
                        </div>
                        <div className="pl-4 border-l-2 border-gray-300">
                          <p><strong>Scenario 3:</strong> Three partners start consulting: capital contributions KES 200K each (equal), but effort unequal. Agree profit split: Partner A 40%, Partner B 40%, Partner C 20% (C does less). If profit KES 100K: A=KES 40K, B=KES 40K, C=KES 20K.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">📊 Losses Also Shared</h4>
                      <p className="text-gray-700 text-sm"><strong>Same Ratio:</strong> If business makes loss: partners share loss using same ratio as profit. If partnership loses KES 100K (50-50 split): each partner absorbs KES 50K loss. Loss may reduce partners' personal income tax (in some cases). Losses shared fairly per agreement.</p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">⚠️ Common Issue</h4>
                    <p className="text-gray-700 text-sm">Partners often disagree on profit split because: one works more, one contributed more capital, one has more experience. SOLUTION: Document exact percentage in partnership deed BEFORE starting. Use partnership deed to specify how to handle unequal work in future (can be flexible). Avoids disputes.</p>
                  </div>
                </div>
              </section>

              {/* Mistakes */}
              <section id="mistakes" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Common Mistakes to Avoid</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Learn from others' partnership mistakes:</p>

                  <div className="space-y-3 mb-6">
                    {commonMistakes.map((item, index) => (
                      <div key={index} className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                        <h4 className="font-bold text-gray-900 mb-1">❌ {item.mistake}</h4>
                        <p className="text-gray-700 text-sm"><strong>Consequence:</strong> {item.consequence}</p>
                      </div>
                    ))}
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
                <h3 className="text-2xl font-bold mb-4">Ready to Register Your Partnership?</h3>
                <p className="text-blue-100 mb-6 max-w-2xl mx-auto">Start your partnership or LLP registration today. Multiple owners mean shared growth, shared responsibility, and shared success.</p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <a href="https://brela.go.ke" target="_blank" rel="noopener noreferrer" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 inline-flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    BRELA Registration
                  </a>
                  <a href="/business-name-search-kenya" className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold inline-flex items-center gap-2">
                    Check Business Name <ArrowRight className="w-5 h-5" />
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
                  <a href="/business-name-search-kenya" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Business Name Search
                  </a>
                  <a href="/company-annual-returns-kenya" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Annual Returns Filing
                  </a>
                  <a href="/kra-pin-for-business-kenya" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    KRA PIN Registration
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

export default PartnershipLLPRegistrationKenya;
