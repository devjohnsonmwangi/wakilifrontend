import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, AlertCircle, ArrowRight, FileText, Clock, DollarSign, XCircle, Users, Briefcase, Building2, TrendingDown, Download, Lock } from 'lucide-react';

const ClosingDeregisteringCompanyKenya = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // FAQ data
  const faqs = [
    {
      question: 'Can I close a business with outstanding debts?',
      answer: 'No. All debts must be paid before closing. Creditors can challenge closure/strike-off if unpaid debts exist. Company cannot be dissolved while owing money. If company has debts: negotiate payment plans, liquidate assets to pay debts, then deregister (Companies Act 2015, Section 365). Attempt to close with debts = legal liability for directors.'
    },
    {
      question: 'What happens to my business bank account after closure?',
      answer: 'Bank account must be closed by you (before or after deregistration). Withdraw remaining funds, clear any overdrafts, notify bank of closure. Funds frozen until debts paid. After deregistration: no new transactions allowed (system won\'t accept business PIN). Old account may remain open but inactive (ask bank). Close formally to avoid future confusion.'
    },
    {
      question: 'Do I need to file annual returns if I\'m closing the company?',
      answer: 'YES. File final annual returns (up to closure date) before or immediately after closure. If failed to file before closing: file as part of closure (BRELA requires current compliance). Late filing = penalties KES 50,000+ even after closure. Better to file final returns first (protects from penalties), then apply for closure/strike-off.'
    },
    {
      question: 'What if my company is already struck off?',
      answer: 'Struck-off = company automatically dissolved by BRELA (after 2+ years non-filing of annual returns). Company legally no longer exists. If want to restore: file court application + restoration fees (KES 50,000-200,000+ legal costs). Better prevention: file annual returns on time. If struck off unintentionally: can restore within 10 years (Companies Act 2015, Section 365).'
    },
    {
      question: 'How long after closure can someone still sue the company?',
      answer: 'Dissolved company cannot be sued (no legal entity). But directors personally liable for company debts/actions. Contractual disputes: must be resolved before closure (settle now, don\'t close and avoid). Legal claims: creditors must act before company dissolved. After strike-off: creditors can petition court to restore company to sue (within 10 years). Close cleanly = no future legal issues.'
    },
    {
      question: 'Can I reuse the same business name after closure?',
      answer: 'Sole proprietor: business name automatically released to pool once deregistered. Can reuse name after 3+ months (BRELA allows). Limited company: company name reserved/protected for 1 year (cannot be used). After 1 year: available to register. Wait period protects against fraud/confusion. Check BRELA before reusing.'
    },
    {
      question: 'Do I need to inform customers/suppliers about closure?',
      answer: 'Not legally required, but best practice. Notify: key customers, suppliers, employees (especially regarding outstanding payments/entitlements). Non-notification = may face complaints, legal disputes, reputation damage. Professional: send closure notice 30 days before final closure. Honors business relationships, protects future reputation.'
    },
    {
      question: 'What if I have employees? What happens to their contracts?',
      answer: 'Employment contracts terminated upon company closure. Employees entitled: final salary, accrued leave payment (KES per day of unused leave), severance (varies by contract). Employer must pay all benefits before/at closure. Failure to pay = labor disputes, liability, EACC (employment authority) action. Budget for all employee costs before closing.'
    },
    {
      question: 'Can I appeal a strike-off or closure order?',
      answer: 'Strike-off automatic (after 2+ years non-filing) - not appealable but restorable (court petition, costs KES 50,000-200,000+). Closure decision: if filed by you = you choose. If BRELA suspends (issues): can challenge via court within 30 days (companies Act 2015, Section 365). Better to avoid strike-off/suspension: file returns on time.'
    },
    {
      question: 'Is there tax clearance required to close a business?',
      answer: 'Yes, tax clearance mandatory before closure (Income Tax Act, Section 91). Must file final tax return with KRA, obtain TCC (Tax Compliance Certificate) showing: all taxes paid, no outstanding liabilities, compliance complete. TCC required for deregistration application. Without: BRELA won\'t process closure. Get tax clearance first (can take 1-4 weeks).'
    },
    {
      question: 'What if my company has intellectual property or trademark?',
      answer: 'Intellectual property (trademark, patents, copyrights): NOT automatically transferred upon company closure. Must explicitly transfer ownership: file WIPO/KEPO documents, update ownership records. If want to keep IP: transfer to personal name before closure. If abandoned: becomes public domain (others can use). Protect valuable IP: transfer before deregistering company.'
    },
    {
      question: 'Can a sole proprietor simply stop operating without formal deregistration?',
      answer: 'Technically you can stop, but legally must deregister business name. Failure = still liable for: license/permit fees, tax obligations, business compliance. KRA may pursue outstanding taxes even after you stop. Better to formally deregister: file final tax return, close business name, clear all obligations. Formal closure = legal protection.'
    },
    {
      question: 'How much does it cost to close a business in Kenya?',
      answer: 'Sole proprietor deregistration: KES 500-1,000 (BRELA). Limited company strike-off/deregistration: KES 2,000-5,000 (BRELA). Tax compliance/clearance: KES 0-2,000 (KRA processing). Accountant (if hired): KES 10,000-50,000. Lawyer (if complex): KES 20,000-100,000+. Simple closure: KES 2,000-5,000 government fees. Complex (debts, disputes): KES 50,000-200,000+ with professionals.'
    },
    {
      question: 'Can I reactivate a deregistered business if I change my mind?',
      answer: 'Deregistered businesses cannot be reactivated (company/business ceases to exist). To resume: must register as NEW business (new PIN, new registration numbers). Previously customers/contracts null = must restart from zero. Better decision: don\'t deregister if may resume. If unsure: consult lawyer before closure (decision permanent).'
    },
    {
      question: 'What happens if I don\'t close a business I\'m not operating?',
      answer: 'Inactive business still liable for: annual returns filing (penalties KES 50,000+), tax compliance, license renewals. After 2+ years non-filing: automatically struck off. If continued non-compliance: penalties accumulate, assets frozen, personal liability for directors. Moral: close formally (free/cheap) rather than abandon (expensive/risky).'
    }
  ];

  // Closure steps - Sole Proprietor
  const soleProprietorSteps = [
    {
      number: 1,
      title: 'Notify KRA & File Final Tax Return',
      description: 'Contact KRA, inform of business closure. File final income tax return (ITR-D form) by June 30 or within 30 days of closure (Income Tax Act, Section 91). Declare all income to closure date. Submit to KRA offices or via iTax portal.'
    },
    {
      number: 2,
      title: 'Obtain Tax Compliance Certificate (TCC)',
      description: 'After filing final return, request TCC from KRA (shows all taxes paid, no outstanding liabilities). Takes 1-4 weeks. Free or minimal fee (KES 0-2,000). Required for business name deregistration with BRELA.'
    },
    {
      number: 3,
      title: 'Pay All Outstanding Debts',
      description: 'Settle all business debts (suppliers, loans, employee entitlements, utilities, rent). Cannot deregister with outstanding liabilities. Document all payments.'
    },
    {
      number: 4,
      title: 'Close Business Bank Account',
      description: 'Contact your bank, request account closure. Withdraw remaining funds, clear overdrafts. Receive closure confirmation from bank. Takes 3-7 days.'
    },
    {
      number: 5,
      title: 'Notify County Government (Licenses/Permits)',
      description: 'If have county business license/permits: notify county office of closure, request cancellation. Return licenses/permits. May receive refund of unused fees (depending on county, timing of cancellation).'
    },
    {
      number: 6,
      title: 'Notify Suppliers & Customers',
      description: 'Send closure notice to regular customers, suppliers, business partners. Explain final transaction date, contact for outstanding issues.'
    },
    {
      number: 7,
      title: 'Go to BRELA with Documents',
      description: 'Visit BRELA office with: Tax Compliance Certificate, business name registration documents, closure application form, ID/passport. Or submit online via eCitizen if available (check BRELA).'
    },
    {
      number: 8,
      title: 'Complete Deregistration Form',
      description: 'BRELA provides form for business name deregistration. Declare: closure reason, date of closure, outstanding claims (if any). Sign form (legal declaration).'
    },
    {
      number: 9,
      title: 'Pay Deregistration Fee',
      description: 'Pay BRELA fee (KES 500-1,000). Payment via cash, card, or mobile money (depending on BRELA branch).'
    },
    {
      number: 10,
      title: 'Receive Closure Confirmation',
      description: 'BRELA issues closure certificate confirming business name deregistered. Get copy (for records). Takes 1-7 business days after submission.'
    },
    {
      number: 11,
      title: 'Archive Business Records',
      description: 'Keep business records (invoices, receipts, contracts, bank statements) for minimum 5 years (legal requirement). Store safely (physical or digital backup). May be needed for audits, disputes.'
    }
  ];

  // Closure steps - Limited Company
  const companyClosureSteps = [
    {
      number: 1,
      title: 'Board Resolution to Wind Up Company',
      description: 'Directors must pass formal board resolution deciding to close/dissolve company. Document decision in board minutes with date, reasons, closure plan. This is legal authorization to proceed (Companies Act 2015, Section 364).'
    },
    {
      number: 2,
      title: 'Shareholder Approval (if required)',
      description: 'Depending on company structure: may need shareholder approval (check Articles of Association). Hold meeting, vote on dissolution, document in shareholder minutes. Majority approval required.'
    },
    {
      number: 3,
      title: 'File Final Annual Returns (if not filed)',
      description: 'Ensure all annual returns up to closure date are filed with BRELA. If missed any: file immediately (file CR1 form with current director/shareholder info). Pay any late filing penalties.'
    },
    {
      number: 4,
      title: 'File Final Tax Return with KRA',
      description: 'Complete company tax return (ITR form) for income earned to closure date. File with KRA by due date or within 30 days of closure decision. Show all income, expenses, assets to be liquidated.'
    },
    {
      number: 5,
      title: 'Obtain Tax Compliance Certificate',
      description: 'Request TCC from KRA (after filing final tax return). Shows all company taxes paid, no outstanding liabilities. Required for strike-off/deregistration application. Takes 1-4 weeks.'
    },
    {
      number: 6,
      title: 'Pay All Company Debts & Obligations',
      description: 'Liquidate assets (sell equipment, property, inventory). Use proceeds to pay: supplier debts, bank loans, employee final salaries, lease obligations. Must clear all liabilities before closure (Companies Act 2015, Section 355).'
    },
    {
      number: 7,
      title: 'Close Company Bank Account',
      description: 'Contact bank, request account closure. Withdraw remaining funds, clear overdrafts. Receive closure letter. Takes 3-7 days.'
    },
    {
      number: 8,
      title: 'File Deregistration Application with BRELA',
      description: 'Complete CR15 form (Company Strike Off form) and submit to BRELA with: board resolution, final annual returns, tax clearance, company registration details, TCC. Can apply in person or via eCitizen (if available).'
    },
    {
      number: 9,
      title: 'Pay BRELA Deregistration Fee',
      description: 'Pay BRELA fee (KES 2,000-5,000 depending on company type). Payment methods: cash, card, mobile money.'
    },
    {
      number: 10,
      title: 'BRELA Reviews Application',
      description: 'BRELA processes strike-off application (takes 2-4 weeks). Verifies: compliance with annual returns, tax clearance, no outstanding claims. May request additional documents if issues found.'
    },
    {
      number: 11,
      title: 'Receive Deregistration Certificate',
      description: 'Once approved: BRELA issues strike-off certificate (formal proof company no longer exists). Company officially dissolved. Get certified copy for records.'
    },
    {
      number: 12,
      title: 'Distribute Remaining Assets to Shareholders',
      description: 'After all debts paid: remaining assets distributed to shareholders (per shareholding percentage). Document distribution, obtain shareholder signatures. Shareholders taxed on distributions received.'
    },
    {
      number: 13,
      title: 'Archive Company Records',
      description: 'Keep company records (contracts, invoices, director minutes, shareholder records, financial statements) for minimum 5 years. Required by law. Store securely.'
    }
  ];

  // Forms table
  const formsRequired = [
    { form: 'Final Tax Return (ITR/ITR-D)', authority: 'KRA', purpose: 'Report final income and closing status', cost: 'KES 0 (free)' },
    { form: 'Tax Compliance Certificate (TCC) Request', authority: 'KRA', purpose: 'Proof all taxes paid, no outstanding liabilities', cost: 'KES 0-2,000' },
    { form: 'Annual Returns (CR1) - Final', authority: 'BRELA', purpose: 'Final directors/shareholders status (if company)', cost: 'KES 0-1,000' },
    { form: 'Business Name Deregistration Form', authority: 'BRELA', purpose: 'For sole proprietors (deregister business name)', cost: 'KES 500-1,000' },
    { form: 'Company Strike-Off Form (CR15)', authority: 'BRELA', purpose: 'For limited companies (dissolve company)', cost: 'KES 2,000-5,000' },
    { form: 'Board Resolution (Company Closure)', authority: 'Internal', purpose: 'Directors authorize company wind-up', cost: 'KES 0 (document only)' },
    { form: 'Shareholder Resolution (if required)', authority: 'Internal', purpose: 'Shareholder approval of dissolution', cost: 'KES 0 (document only)' },
    { form: 'License/Permit Cancellation (County)', authority: 'County Government', purpose: 'Cancel business licenses/permits', cost: 'Varies by county' }
  ];

  // Costs table
  const costs = [
    { service: 'BRELA Deregistration Fee (Sole Proprietor)', cost: 'KES 500-1,000' },
    { service: 'BRELA Deregistration Fee (Limited Company)', cost: 'KES 2,000-5,000' },
    { service: 'KRA Tax Compliance Certificate Request', cost: 'KES 0-2,000' },
    { service: 'Final Tax Return Filing (KRA)', cost: 'KES 0 (free)' },
    { service: 'Accountant (if hired for final return)', cost: 'KES 5,000-20,000' },
    { service: 'Lawyer (if disputes/complex closure)', cost: 'KES 20,000-100,000+' },
    { service: 'Bank Account Closure', cost: 'KES 0-500 (free or minimal)' },
    { service: 'County License Cancellation', cost: 'Varies (usually no charge)' }
  ];

  // Timeline
  const timeline = [
    { task: 'File Final Tax Return', duration: 'Same day or 1-2 days' },
    { task: 'Obtain Tax Compliance Certificate', duration: '1-4 weeks' },
    { task: 'Pay All Debts & Liquidate Assets', duration: '2-8 weeks (varies)' },
    { task: 'Close Bank Account', duration: '3-7 days' },
    { task: 'Submit Deregistration Application to BRELA', duration: '1-3 days' },
    { task: 'BRELA Reviews Application', duration: '2-4 weeks' },
    { task: 'Receive Deregistration Certificate', duration: '1 week after approval' }
  ];

  // Common mistakes
  const commonMistakes = [
    {
      mistake: 'Not Filing Final Tax Return',
      consequence: 'KRA continues to pursue taxes, penalties accrue. No tax compliance certificate = cannot deregister. Business remains liable even after closure attempt.'
    },
    {
      mistake: 'Deregistering Without Tax Clearance',
      consequence: 'BRELA rejects deregistration application. Must go back, get TCC, resubmit. Delays closure by 1-4 weeks + frustration.'
    },
    {
      mistake: 'Closing While Owing Debts',
      consequence: 'Creditors can challenge closure, sue directors personally. Director personal liability for unpaid debts. Company cannot be fully dissolved.'
    },
    {
      mistake: 'Not Canceling Employee Contracts Properly',
      consequence: 'Employees claim wrongful termination, unpaid entitlements. Labor disputes, tribunal cases, fines. Must pay all wages, accrued leave, severance before closure.'
    },
    {
      mistake: 'Abandoning Business Without Deregistration',
      consequence: 'Business continues on records, liabilities accumulate (annual returns penalties, tax pursuit). After 2+ years: auto struck-off + penalties. Better to deregister formally.'
    },
    {
      mistake: 'Not Keeping Closure Documentation',
      consequence: 'Years later: questioned about business status, creditors claim you still liable. Proof of closure (certificate) protects. Save all documents minimum 5 years.'
    }
  ];

  // Closure checklist
  const closureChecklist = [
    'Final tax return filed with KRA?',
    'Tax Compliance Certificate (TCC) obtained?',
    'All business debts paid?',
    'Employee final salaries & benefits settled?',
    'Bank account closed?',
    'County licenses/permits canceled?',
    'Customers & suppliers notified?',
    'Intellectual property transferred (if applicable)?',
    'Board/shareholder resolutions documented?',
    'Final annual returns filed (if company)?',
    'BRELA deregistration form completed?',
    'Deregistration fee paid?',
    'Deregistration certificate received?',
    'Business records archived (5+ years storage)?',
    'Assets distributed to owners/shareholders?'
  ];

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'when-close', 'differences', 'sole-prop-steps', 'company-steps', 'documents', 'tax-clearance', 'annual-returns', 'costs', 'timeline', 'after-closure', 'mistakes', 'risks', 'hire-help', 'faqs'];
      
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
        <title>Close Business Kenya – Deregistration Guide 2026 & 2027</title>
        <meta name="description" content="Complete guide to closing or deregistering a business or company in Kenya. Step-by-step legal process, forms, costs, tax requirements & how to avoid penalties." />
        <link rel="canonical" href="https://yoursite.com/closing-or-deregistering-company-kenya" />
        
        {/* OpenGraph */}
        <meta property="og:title" content="Close Business Kenya – Complete Deregistration Guide 2026 & 2027" />
        <meta property="og:description" content="Step-by-step guide to legally closing a sole proprietorship or limited company in Kenya. Forms, costs, tax clearance, timeline & legal requirements." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://yoursite.com/closing-or-deregistering-company-kenya" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=630&fit=crop" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Close Business Kenya – Deregistration Guide 2026 & 2027" />
        <meta name="twitter:description" content="Legal guide to closing a business in Kenya. Sole proprietor & company deregistration, tax clearance, forms, costs & step-by-step process." />
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
            "description": "Business closure and deregistration services in Kenya"
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
                "name": "Close Business Kenya",
                "item": "https://yoursite.com/closing-or-deregistering-company-kenya"
              }
            ]
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Close and Deregister a Business in Kenya",
            "description": "Step-by-step guide to closing a sole proprietorship or limited company in Kenya",
            "step": [
              ...soleProprietorSteps.map(step => ({
                "@type": "HowToStep",
                "position": step.number,
                "name": step.title,
                "text": step.description
              })),
              ...companyClosureSteps.slice(0, 5).map((step, idx) => ({
                "@type": "HowToStep",
                "position": soleProprietorSteps.length + idx + 1,
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
              <TrendingDown className="w-8 h-8 flex-shrink-0" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">How to Close, Deregister or Dissolve a Business or Company in Kenya</h1>
            </div>
            <p className="text-blue-100 text-lg max-w-3xl">Complete legal guide to closing a sole proprietorship or limited company. Step-by-step process, tax requirements, forms, costs, and how to avoid penalties or future liabilities.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="https://brela.go.ke" target="_blank" rel="noopener noreferrer" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                BRELA Services
              </a>
              <a href="/company-annual-returns-kenya" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
                Annual Returns Guide <ArrowRight className="w-5 h-5" />
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
              <li>Close Business Kenya</li>
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
                    { id: 'when-close', label: 'When to Close' },
                    { id: 'differences', label: 'Types of Closure' },
                    { id: 'sole-prop-steps', label: 'Close Sole Prop' },
                    { id: 'company-steps', label: 'Close Company' },
                    { id: 'documents', label: 'Documents' },
                    { id: 'tax-clearance', label: 'Tax Clearance' },
                    { id: 'annual-returns', label: 'Annual Returns' },
                    { id: 'costs', label: 'Costs' },
                    { id: 'timeline', label: 'Timeline' },
                    { id: 'after-closure', label: 'After Closure' },
                    { id: 'mistakes', label: 'Mistakes' },
                    { id: 'risks', label: 'Risks' },
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
                    { id: 'when-close', label: 'When You Should Close' },
                    { id: 'differences', label: 'Deregistration vs Strike-Off' },
                    { id: 'sole-prop-steps', label: 'Close Sole Proprietorship' },
                    { id: 'company-steps', label: 'Close Limited Company' },
                    { id: 'documents', label: 'Required Documents' },
                    { id: 'tax-clearance', label: 'Tax Clearance & KRA' },
                    { id: 'annual-returns', label: 'Final Annual Returns' },
                    { id: 'costs', label: 'Fees & Costs' },
                    { id: 'timeline', label: 'Timeline' },
                    { id: 'after-closure', label: 'After Closure' },
                    { id: 'mistakes', label: 'Common Mistakes' },
                    { id: 'risks', label: 'Risks of Not Closing' },
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
                  <TrendingDown className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Overview: Closing a Business in Kenya</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                    <strong>Business closure</strong> is the legal process of shutting down and dissolving a sole proprietorship or limited company in Kenya. This guide explains when to close, step-by-step procedures, required documents, costs, and how to avoid penalties or future liabilities.
                  </p>

                  <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border-l-4 border-blue-600">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-700 mb-1">KES 2,000-5,000</div>
                        <div className="text-xs text-gray-600">Government Fees</div>
                        <p className="text-sm text-gray-700 mt-2">Company deregistration</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-700 mb-1">3-8 Weeks</div>
                        <div className="text-xs text-gray-600">Total Timeline</div>
                        <p className="text-sm text-gray-700 mt-2">Varies by complexity</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-700 mb-1">MANDATORY</div>
                        <div className="text-xs text-gray-600">Tax Clearance</div>
                        <p className="text-sm text-gray-700 mt-2">Before deregistration</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg mb-6">
                    <h4 className="font-bold text-gray-900 mb-2">⚠️ Important: Formal Closure is Mandatory</h4>
                    <p className="text-gray-700 text-sm">You CANNOT simply stop operating and abandon a business. Must formally deregister/close to avoid: continued liability for taxes, annual returns filing penalties (KES 50,000+), automatic strike-off (after 2+ years), and personal director liability. Formal closure protects you legally and financially.</p>
                  </div>
                </div>
              </section>

              {/* When to Close */}
              <section id="when-close" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">When You Should Close a Business</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Consider closing your business if:</p>

                  <div className="space-y-3 mb-6">
                    <div className="bg-white border-2 border-gray-200 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-1">Business No Longer Profitable</h4>
                      <p className="text-gray-700 text-sm">Consistently losing money, cannot sustain operations. Continuing = accumulating losses, debt. Better to close, cut losses, restart elsewhere if desired.</p>
                    </div>

                    <div className="bg-white border-2 border-gray-200 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-1">Personal Circumstances Changed</h4>
                      <p className="text-gray-700 text-sm">Illness, relocation, family matters make continuation impossible. No point maintaining business if you can't operate effectively.</p>
                    </div>

                    <div className="bg-white border-2 border-gray-200 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-1">Market or Industry Collapsed</h4>
                      <p className="text-gray-700 text-sm">Industry changing rapidly (competition, technology, regulation), no viable path forward. Example: retail losing to e-commerce.</p>
                    </div>

                    <div className="bg-white border-2 border-gray-200 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-1">Changing to Different Business Structure</h4>
                      <p className="text-gray-700 text-sm">Closing sole proprietorship to open limited company, or vice versa. Close old business, register new one.</p>
                    </div>

                    <div className="bg-white border-2 border-gray-200 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-1">Retirement or Exit Strategy</h4>
                      <p className="text-gray-700 text-sm">Owner retiring, seeking exit from business. Planned closure before retirement date.</p>
                    </div>

                    <div className="bg-white border-2 border-gray-200 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-1">Compliance Issues or Legal Problems</h4>
                      <p className="text-gray-700 text-sm">Unable to meet regulatory requirements, legal disputes making operation untenable. Close formally to prevent escalation.</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>Decision Point:</strong> Closure is significant decision. Before deciding: consult accountant/lawyer about: options to save business, costs of closure vs. continuation, future implications. Make informed choice.</p>
                  </div>
                </div>
              </section>

              {/* Differences */}
              <section id="differences" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Difference Between Deregistration, Strike-Off & Liquidation</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Three ways a business ends in Kenya:</p>

                  <img 
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop"
                    alt="Business Closure Process"
                    className="rounded-lg shadow-lg w-full mb-6"
                  />

                  <div className="space-y-4 mb-6">
                    <div className="bg-white border-2 border-green-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">✅ Deregistration (Voluntary Closure)</h4>
                      <p className="text-gray-700 text-sm mb-2"><strong>What it is:</strong> Owner voluntarily closes business. You apply to BRELA, provide tax clearance, all documents. Business formally dissolved on your terms.</p>
                      <p className="text-gray-700 text-sm mb-2"><strong>Process:</strong> File documents, pay fee (KES 500-5,000), BRELA approves, receive certificate. Takes 3-6 weeks.</p>
                      <p className="text-gray-700 text-sm"><strong>Best for:</strong> Planned closures, all debts cleared, good standing.</p>
                    </div>

                    <div className="bg-white border-2 border-yellow-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">⚠️ Strike-Off (Automatic Dissolution)</h4>
                      <p className="text-gray-700 text-sm mb-2"><strong>What it is:</strong> BRELA automatically dissolves company after 2+ years of non-filing annual returns. You did NOT apply—government did it.</p>
                      <p className="text-gray-700 text-sm mb-2"><strong>Process:</strong> BRELA notices non-compliance, issues strike-off notice (sends to address on file). After 30 days: company automatically struck off. You receive certificate (whether you want it or not).</p>
                      <p className="text-gray-700 text-sm"><strong>Consequences:</strong> Company dissolved, cannot operate, penalties may apply. Can restore within 10 years (costs KES 50,000-200,000+ legal fees). Better to avoid via timely filing.</p>
                    </div>

                    <div className="bg-white border-2 border-red-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">❌ Liquidation (Insolvency/Bankruptcy)</h4>
                      <p className="text-gray-700 text-sm mb-2"><strong>What it is:</strong> Company insolvent (cannot pay debts). Court appoints liquidator to sell assets, pay creditors, dissolve company.</p>
                      <p className="text-gray-700 text-sm mb-2"><strong>Process:</strong> Directors file insolvency petition or creditors petition. Court appoints liquidator. Liquidator liquidates (sells) all assets, distributes proceeds to creditors. Lengthy, expensive process (takes months/years).</p>
                      <p className="text-gray-700 text-sm"><strong>Best for:</strong> Insolvent companies with substantial debts. Protects directors from personal liability (to extent possible).</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>Most Common:</strong> Deregistration (you apply voluntarily). Avoid strike-off (automatic = punitive). Liquidation rare unless company heavily indebted.</p>
                  </div>
                </div>
              </section>

              {/* Sole Proprietor Steps */}
              <section id="sole-prop-steps" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Users className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How to Close a Sole Proprietorship (Step-by-Step)</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Complete process for closing a sole proprietor business name:</p>

                  <div className="space-y-4 mb-6">
                    {soleProprietorSteps.map((step) => (
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
                    <p className="text-gray-700 text-sm"><strong>Timeline:</strong> Total closure takes 3-8 weeks (depends on tax clearance processing, BRELA workload). To speed up: file final return immediately, submit deregistration application while waiting for TCC.</p>
                  </div>
                </div>
              </section>

              {/* Company Steps */}
              <section id="company-steps" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Building2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How to Close a Limited Company (Step-by-Step)</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Complete process for closing/striking off a limited company:</p>

                  <img 
                    src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop"
                    alt="Company Closure Process"
                    className="rounded-lg shadow-lg w-full mb-6"
                  />

                  <div className="space-y-4 mb-6">
                    {companyClosureSteps.map((step) => (
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
                    <p className="text-gray-700 text-sm"><strong>Timeline:</strong> Limited company closure takes 4-10 weeks (more complex than sole proprietor). Key delay: asset liquidation (may take 2-8 weeks) and debt settlement. Plan ahead if have significant assets/debts.</p>
                  </div>
                </div>
              </section>

              {/* Documents */}
              <section id="documents" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Required Documents & Forms</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Documents you'll need for business closure:</p>

                  <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6 overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">Form/Document</th>
                          <th className="px-4 py-3 text-left font-semibold">Authority</th>
                          <th className="px-4 py-3 text-left font-semibold">Purpose</th>
                          <th className="px-4 py-3 text-left font-semibold">Cost</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {formsRequired.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-semibold text-gray-900 text-sm">{item.form}</td>
                            <td className="px-4 py-3 text-gray-700 text-sm">{item.authority}</td>
                            <td className="px-4 py-3 text-gray-700 text-sm">{item.purpose}</td>
                            <td className="px-4 py-3 font-semibold text-gray-900 text-sm">{item.cost}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>Getting Forms:</strong> Download from BRELA website (brela.go.ke), KRA website (kra.go.ke), or collect in person from offices. Most available online now.</p>
                  </div>
                </div>
              </section>

              {/* Tax Clearance */}
              <section id="tax-clearance" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <DollarSign className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Tax Clearance & KRA Requirements</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Tax clearance is MANDATORY before closure:</p>

                  <div className="space-y-4 mb-6">
                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">📌 What is Tax Compliance Certificate (TCC)?</h4>
                      <p className="text-gray-700 text-sm">Official document from KRA proving: all business taxes paid, no outstanding tax liabilities, compliance complete. BRELA requires TCC before approving closure/strike-off. Without TCC: deregistration application REJECTED.</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">✅ How to Get TCC</h4>
                      <ol className="space-y-2 text-gray-700 text-sm list-decimal list-inside">
                        <li>File final tax return with KRA (income to closure date)</li>
                        <li>Pay any taxes owed</li>
                        <li>Request TCC from KRA (in person or via iTax portal)</li>
                        <li>KRA processes (takes 1-4 weeks)</li>
                        <li>Receive TCC certificate (PDF or printed)</li>
                      </ol>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">⏱️ Timeline for TCC</h4>
                      <p className="text-gray-700 text-sm">KRA processing: 1-4 weeks (varies). If have pending audits/issues: may take longer. Plan ahead—don't wait until last minute. Start TCC process immediately when deciding to close.</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">💰 Cost of TCC</h4>
                      <p className="text-gray-700 text-sm">Request for TCC: FREE (no government fee). But you must pay any outstanding taxes first (if you owe). Example: owe KES 100,000 in income tax → must pay KES 100,000 before TCC issued. TCC itself = free document.</p>
                    </div>
                  </div>

                  <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-1">🚨 Don't Skip This Step</h4>
                    <p className="text-gray-700 text-sm">Many business owners try to close without TCC (thinking saves time/money). BRELA WILL reject without TCC. Then forced to: go back to KRA, file return, get TCC (1-4 weeks), resubmit to BRELA. Creates unnecessary delays. File final return → get TCC → apply for closure (correct order).</p>
                  </div>
                </div>
              </section>

              {/* Annual Returns */}
              <section id="annual-returns" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Clearing Annual Returns Before Closure</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">For limited companies: must file annual returns up to closure date:</p>

                  <div className="bg-white border-2 border-blue-200 p-6 rounded-xl mb-6">
                    <h4 className="font-bold text-gray-900 mb-3">📋 What You Need to Do</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span>File all annual returns (CR1 forms) from last filed return to closure date (Companies Act 2015, Section 350)</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span>If missed any year: file immediately (before closure application)</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span>Final returns show company directors/shareholders as of closure date</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span>Pay any late filing penalties (KES 50,000+ if years late) BEFORE closure</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span>BRELA won't approve closure if annual returns not current</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-1">⚠️ Common Issue</h4>
                    <p className="text-gray-700 text-sm">Companies behind on annual returns try to close without filing back returns. BRELA system flags and REJECTS application. Must file ALL returns first (with penalties paid), then apply for closure. Plan for this delay in timeline.</p>
                  </div>
                </div>
              </section>

              {/* Costs */}
              <section id="costs" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <DollarSign className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Government Fees & Costs</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Complete breakdown of closure costs:</p>

                  <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6 overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">Service/Fee</th>
                          <th className="px-4 py-3 text-left font-semibold">Cost (KES)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {costs.map((item, index) => (
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
                    <p className="text-gray-700 text-sm mb-2"><strong>Simple Closure (no issues):</strong> KES 2,500-7,500 government fees + any outstanding taxes owed.</p>
                    <p className="text-gray-700 text-sm"><strong>Complex Closure (with accountant/lawyer):</strong> KES 30,000-150,000 (professional fees) + government fees + taxes owed.</p>
                  </div>
                </div>
              </section>

              {/* Timeline */}
              <section id="timeline" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How Long Deregistration Takes</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Timeline for closing a business:</p>

                  <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6 overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">Task/Stage</th>
                          <th className="px-4 py-3 text-left font-semibold">Duration</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {timeline.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">{item.task}</td>
                            <td className="px-4 py-3 text-gray-700">{item.duration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">⏱️ Total Timeline</h4>
                    <p className="text-gray-700 text-sm"><strong>Fastest Case:</strong> 3-4 weeks (all documents ready, no issues, no debts).</p>
                    <p className="text-gray-700 text-sm"><strong>Average Case:</strong> 6-8 weeks (some asset liquidation, minor debts, standard delays).</p>
                    <p className="text-gray-700 text-sm"><strong>Complex Case:</strong> 10+ weeks (significant debts, asset sales, multiple creditors, legal disputes).</p>
                  </div>
                </div>
              </section>

              {/* After Closure */}
              <section id="after-closure" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <ArrowRight className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What Happens After Closure</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Once your business is officially closed:</p>

                  <div className="space-y-4 mb-6">
                    <div className="bg-white border-2 border-gray-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">🔒 Business No Longer Exists Legally</h4>
                      <p className="text-gray-700 text-sm">Company/business dissolved. Cannot sign contracts, operate, hire employees, or conduct business. Any attempt = illegal. Status shows "Dissolved" or "Struck Off" on BRELA search.</p>
                    </div>

                    <div className="bg-white border-2 border-gray-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">💰 Assets Distributed</h4>
                      <p className="text-gray-700 text-sm">All remaining assets after debt payment distributed to owners (sole proprietor gets all, or shareholders per shareholding). Document distribution, retain proof.</p>
                    </div>

                    <div className="bg-white border-2 border-gray-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">📁 Records Archived</h4>
                      <p className="text-gray-700 text-sm">Keep business records (contracts, invoices, financial statements, director minutes) minimum 5 years (legal requirement). May be needed for audits, legal disputes, tax queries.</p>
                    </div>

                    <div className="bg-white border-2 border-gray-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">🆓 Freedom from Compliance</h4>
                      <p className="text-gray-700 text-sm">No more annual returns filing, tax compliance, license renewals. Business obligations ended. You're free from regulatory burden.</p>
                    </div>

                    <div className="bg-white border-2 border-gray-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">⚖️ Potential Liability (Directors)</h4>
                      <p className="text-gray-700 text-sm">If company had undisclosed debts/liabilities discovered later: director still liable (up to 10 years post-dissolution). Full disclosure at closure protects you. Settlement of all known debts before closure eliminates risk.</p>
                    </div>

                    <div className="bg-white border-2 border-gray-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">🔄 Future Re-Registration</h4>
                      <p className="text-gray-700 text-sm">If want to restart business: must register as NEW business (new PIN, new registration). Old business name released (after waiting period for company names). Cannot reactivate closed business.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Common Mistakes */}
              <section id="mistakes" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <XCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Common Mistakes to Avoid</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Learn from others' mistakes:</p>

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

              {/* Risks */}
              <section id="risks" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Risks of Not Deregistering Properly</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">If you simply stop operating without formal deregistration:</p>

                  <div className="space-y-3 mb-6">
                    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">🚨 Ongoing Tax Liability</h4>
                      <p className="text-gray-700 text-sm">KRA continues pursuing taxes even if business inactive. Outstanding taxes accumulate interest (1.5%-2%/month). Pursuit may include: asset seizure, bank account freezes, court action.</p>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">📋 Annual Returns Penalties</h4>
                      <p className="text-gray-700 text-sm">If limited company: must file annual returns every year. Non-filing = KES 50,000+ penalties per year. After 2 years: automatic strike-off (not your choice). Better to deregister voluntarily than be struck off.</p>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">⚖️ Director Personal Liability</h4>
                      <p className="text-gray-700 text-sm">Directors remain liable for company debts/taxes even after stopping operations. Personal assets at risk. Proper closure with clearance protects you.</p>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">🏦 Banking Issues</h4>
                      <p className="text-gray-700 text-sm">Business bank account still exists, KRA/banks track. Future creditors find active records, pursue you. Closed businesses freeze accounts to prevent unauthorized transactions.</p>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">❌ Auto Strike-Off</h4>
                      <p className="text-gray-700 text-sm">After 2+ years non-filing: BRELA automatically strikes off company. Automatic strike-off = punitive (not clean). To restore: expensive court process (KES 50,000-200,000+ legal costs, 1-3 months wait).</p>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">🔒 Future Legal Issues</h4>
                      <p className="text-gray-700 text-sm">Years later: customers/suppliers sue you over unresolved disputes. Unresolved liability looms indefinitely. Proper closure + settlement eliminates future legal exposure.</p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-1">✅ Bottom Line</h4>
                    <p className="text-gray-700 text-sm">Proper closure takes 3-8 weeks, costs KES 2,000-5,000 government fees (very cheap). Abandoning costs far more in penalties, interest, legal fees, personal liability. ALWAYS close properly.</p>
                  </div>
                </div>
              </section>

              {/* Hire Help */}
              <section id="hire-help" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Briefcase className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">When to Hire a Lawyer or Accountant</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">You can handle closure yourself (DIY), but sometimes professionals are worthwhile:</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        DIY Closure (Save Money)
                      </h4>
                      <p className="text-gray-700 text-sm mb-2"><strong>Good for:</strong></p>
                      <ul className="space-y-1 text-gray-700 text-sm">
                        <li>• No debts, clean closure</li>
                        <li>• Simple business (no employees)</li>
                        <li>• All documents ready</li>
                        <li>• Budget-conscious</li>
                      </ul>
                      <p className="text-gray-700 text-sm mt-2"><strong>Cost:</strong> KES 2,000-5,000 (government only)</p>
                    </div>

                    <div className="bg-white border-2 border-green-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        Hire Professional
                      </h4>
                      <p className="text-gray-700 text-sm mb-2"><strong>Recommended for:</strong></p>
                      <ul className="space-y-1 text-gray-700 text-sm">
                        <li>• Significant debts/disputes</li>
                        <li>• Complex company structure</li>
                        <li>• Employees to settle with</li>
                        <li>• Uncertain about process</li>
                        <li>• Peace of mind preferred</li>
                      </ul>
                      <p className="text-gray-700 text-sm mt-2"><strong>Cost:</strong> KES 10,000-150,000</p>
                    </div>
                  </div>

                  <div className="bg-white border-2 border-gray-200 p-6 rounded-xl mb-6">
                    <h4 className="font-bold text-gray-900 mb-3">📋 DIY Closure Checklist</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      {closureChecklist.map((item, index) => (
                        <li key={index} className="flex gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm"><strong>Decision:</strong> If confident in paperwork + no major issues: DIY saves money. If complex/uncertain: hire professional (investment protects from costly mistakes + penalties).</p>
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
                <h3 className="text-2xl font-bold mb-4">Ready to Close Your Business?</h3>
                <p className="text-blue-100 mb-6 max-w-2xl mx-auto">Start the deregistration process today. Proper closure protects you legally and financially. Avoid penalties and future liabilities.</p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <a href="https://brela.go.ke" target="_blank" rel="noopener noreferrer" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 inline-flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Download Forms (BRELA)
                  </a>
                  <a href="/kra-pin-for-business-kenya" className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold inline-flex items-center gap-2">
                    KRA & Tax Guide <ArrowRight className="w-5 h-5" />
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
                    Company Annual Returns
                  </a>
                  <a href="/company-cr12-and-search-kenya" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    CR12 & Company Search
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

export default ClosingDeregisteringCompanyKenya;
