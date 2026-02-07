import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, FileText, Building2, AlertTriangle, BookOpen, Globe, Shield, Users, CheckCircle2, XCircle } from 'lucide-react';

const KenyaEmploymentLabourLaws = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // FAQ data
  const faqs = [
    {
      question: 'What is the minimum wage in Kenya 2026?',
      answer: 'Minimum wage varies by location and industry. As of 2026: Nairobi/Mombasa/Kisumu cities: KES 15,201-18,000/month (varies by sector). Counties/towns: KES 13,572-15,201/month. Agricultural workers: KES 8,500-11,000/month (varies). General laborer: KES 13,500+ monthly. Domestic workers: KES 10,000+ (some counties higher). Rates set by Minimum Wage Advisory Board, reviewed annually. Industry-specific rates: security guards, hospitality, manufacturing have sector-specific minimums. Employer MUST pay at least minimum wage (violation = labour law breach + penalties). Verify current rates: Ministry of Labour website or Wage Order Gazette Notice.'
    },
    {
      question: 'How many days annual leave am I entitled to?',
      answer: 'Annual leave entitlement: 21 working days per year (after 12 months continuous service). Calculation: excludes weekends and public holidays (only working days count). Accrual: proportional (e.g., 6 months work = 10.5 days leave). Must be taken: employer schedules, cannot be denied indefinitely. Payment: full salary during leave (normal rate). Leave cannot be replaced with cash payment (except upon termination). Unused leave: carries forward to next year (but employer can set reasonable limits). Termination: employer pays cash equivalent for accrued unused leave. Example: work Jan-Dec 2026 = 21 days leave in 2027. Employer denying leave = labour law violation.'
    },
    {
      question: 'How long is maternity leave in Kenya?',
      answer: 'Maternity leave: 3 months (90 days) paid leave for female employees. Eligibility: any pregnant employee (no minimum service period required). Payment: full salary for entire 3 months. Additional unpaid leave: employee can request additional unpaid leave (employer discretion). Paternity leave: 2 weeks (14 days) paid leave for male employees (upon birth of child). Miscarriage/stillbirth: employee entitled to medical leave with certificate. Job protection: employer cannot terminate during maternity leave. Return: guaranteed same position or equivalent. Employer refusing maternity leave = serious labour law violation + criminal penalty possible.'
    },
    {
      question: 'What is the notice period for termination?',
      answer: 'Notice period depends on length of service: Less than 1 year: 1 week notice, 1-5 years: 2 weeks notice, 5-10 years: 4 weeks notice, 10+ years: 1 month (30 days) notice. Notice mutual: applies to both employer (firing) and employee (resigning). Payment in lieu: employer can pay salary for notice period instead of working notice. Immediate termination: only for gross misconduct (theft, violence, serious breach) - no notice required but investigation mandatory. Contract may specify longer notice (but not shorter than legal minimum). Example: employee working 7 years resigning = must give 4 weeks notice. Employer not giving notice = owes payment in lieu.'
    },
    {
      question: 'Can my employer fire me without reason?',
      answer: 'No, employer cannot fire without valid reason. Valid reasons only: Redundancy (genuine business need), Poor performance (after warnings + improvement opportunity), Misconduct (after investigation + hearing), Business closure, Incapacity (medical, inability to perform). Unlawful termination: discrimination (tribe, gender, religion, pregnancy), retaliation (whistleblowing, union membership), without notice (except gross misconduct), without due process (no hearing). Employee rights if unlawfully terminated: File complaint to Labour Office within 60 days, Claim: unfair termination compensation (up to 12 months salary), Reinstatement possible, Damages for distress. Employer burden: must prove termination was fair + procedurally correct.'
    },
    {
      question: 'What happens if I work overtime?',
      answer: 'Overtime regulations: Maximum working hours: 8 hours/day, 40-52 hours/week (depends on industry). Overtime = hours beyond normal working hours. Overtime pay: 1.5x normal hourly rate (time-and-a-half). Weekends/holidays: 2x normal rate (double time). Calculation: (monthly salary ÷ 208 hours) × 1.5 × overtime hours. Example: KES 30,000 salary, 10 overtime hours = (30,000÷208) × 1.5 × 10 = KES 2,163. Employer refusing to pay overtime = labour law breach (employee can claim arrears). Maximum overtime: 60 hours per month (beyond = employer violation). Record keeping: employer must maintain overtime records (proof for claims).'
    },
    {
      question: 'Do I need a written employment contract?',
      answer: 'Yes, written contract mandatory. Employment Act 2007 requires: Written contract within 3 months of employment start. Contract must include: job title, duties, salary, working hours, leave entitlement, notice period, termination grounds, probation period (if any). Permanent vs fixed-term: specify clearly. Employer failing to provide contract = labour law violation (employee still entitled to statutory rights). Verbal contracts valid but difficult to prove terms. Best practice: sign contract before starting work. Employee copy: employer must provide signed copy. Contract changes: require mutual written agreement (cannot be changed unilaterally). No contract but working = employment relationship still exists (statutory protections apply).'
    },
    {
      question: 'How do I report a labour dispute?',
      answer: 'Labour dispute resolution process: Step 1: Internal resolution (discuss with employer/HR). Step 2: File complaint at Labour Office (within 60 days of issue). Required: fill Labour Dispute Form, attach: employment contract, payslips, correspondence, evidence. Cost: FREE filing. Step 3: Conciliation (Labour Officer mediates between parties, 30 days to resolve). Step 4: If unresolved → Employment & Labour Relations Court or Industrial Court (formal hearing, legal representation allowed). Timeline: conciliation 30 days, court 6-18 months (varies). Remedies: unpaid wages, unfair termination compensation, reinstatement, damages. Lawyer optional but recommended for court stage (costs KES 20,000-100,000+).'
    },
    {
      question: 'Can I be fired while on sick leave?',
      answer: 'No, generally protected during sick leave. Employer cannot terminate due to illness/injury (discrimination). Exception: if incapacity permanent and cannot perform essential duties (medical certificate required + consultation). Sick leave entitlement: 7 days full pay per year, 7 days half pay per year. Medical certificate: required for sick leave (from registered doctor). Termination during sick leave: only if unrelated to illness (e.g., redundancy for business closure) AND procedurally fair. Employee working 5+ years: entitled to reasonable accommodation if medically able to return modified duties. Firing employee due to illness = unfair termination (claim compensation). Best practice: employer should explore alternatives before termination.'
    },
    {
      question: 'What is redundancy and what are my rights?',
      answer: 'Redundancy: termination due to genuine business need (not employee fault). Valid redundancy reasons: business closure, department shutdown, technology replacement, economic downturn, restructuring. Redundancy process: 30 days notice to employees + union (if applicable), Consultation (explain reasons, consider alternatives), Selection criteria (fair, objective - not discriminatory), Notice period payment, Redundancy pay (1 month salary per year worked, capped at statutory maximum). Example: 5 years service at KES 50,000/month = KES 250,000 redundancy pay + notice pay. Invalid redundancy: no consultation, discriminatory selection, refilling same position immediately. Employee rights: challenge unfair redundancy, claim proper compensation. Employer must follow Labour Relations Act Section 40.'
    },
    {
      question: 'Can my employer deduct money from my salary?',
      answer: 'Lawful deductions only. Permitted deductions: Statutory (PAYE tax, NHIF, NSSF - mandatory), Court orders (child support, debt recovery), Employee consent (SACCO, union dues, loans, insurance). Prohibited deductions: Fines/penalties (employer cannot deduct for mistakes/breakages unless contract allows), Cash shortages (unless employee negligence proven), Training costs (unless contract specifies repayment), Tools/uniforms (employer responsibility). Maximum deduction: one-third of gross salary (protects employee from excessive deductions). Unauthorized deduction = salary theft (employee can claim recovery). Employer must: itemize deductions on payslip, obtain written consent for voluntary deductions. Example: KES 30,000 salary, maximum deductible KES 10,000 (excluding statutory).'
    },
    {
      question: 'What is the probation period in Kenya?',
      answer: 'Probation period: trial period at start of employment. Maximum duration: 6 months (cannot exceed per Employment Act). Purpose: assess employee suitability. During probation: employee entitled to ALL statutory rights (minimum wage, leave, notice), only difference = shorter notice period (7 days for either party). Termination during probation: easier but still requires valid reason + notice. Cannot extend probation beyond 6 months (except mutual written agreement for specific skills training). After probation: employment becomes permanent (confirmed in writing). No probation contract = employment permanent from day 1. Employer firing during probation still requires fairness (cannot be discriminatory/malicious).'
    },
    {
      question: 'Am I entitled to sick leave?',
      answer: 'Sick leave entitlement (per Employment Act): 7 days full pay per year, 7 days half pay per year (total 14 days). Additional sick leave: unpaid (employer discretion). Medical certificate: required (from registered medical practitioner). Accumulation: sick leave does not accumulate year-to-year (use it or lose it). Chronic illness: employee may need extended medical leave (unpaid beyond 14 days). Employer cannot: deny statutory sick leave, fire due to illness, require work while sick. Abuse: employer can investigate suspected sick leave abuse (medical verification). Example: employee sick 10 days = 7 days full pay + 3 days half pay. Maternity leave separate (does not count as sick leave).'
    },
    {
      question: 'What workplace safety requirements must employers provide?',
      answer: 'Occupational Safety & Health Act 2007 requirements: Safe working environment (hazard-free), Protective equipment (helmets, gloves, safety gear - free to employees), Training (safety procedures, emergency protocols), First aid (kit + trained personnel), Sanitation (clean toilets, drinking water), Ventilation (adequate air circulation), Fire safety (extinguishers, exits, drills). High-risk industries: construction, manufacturing, mining have additional requirements. Employer responsibilities: conduct risk assessments, implement safety policies, investigate accidents, maintain safety records. Employee rights: refuse unsafe work (without penalty), report hazards, receive safety training. Violations: employer liable for fines + criminal prosecution, employee can claim compensation for injuries. DOSH (Directorate of Occupational Safety) enforces compliance.'
    },
    {
      question: 'Can I join a trade union?',
      answer: 'Yes, freedom of association protected (Constitution Article 41). Employee rights: join union of choice, participate in union activities, collective bargaining. Employer cannot: prevent union membership, discriminate against union members, fire for union activities, interfere with union formation. Union benefits: collective bargaining (better wages/conditions), legal representation (disputes), solidarity (worker protection). Employer obligations: recognize union if majority workers are members, negotiate in good faith (collective bargaining agreements). Union dues: deducted from salary (with employee consent). Non-union workers: still covered by statutory employment laws. Employer firing for union membership = unfair termination (serious penalty).'
    },
    {
      question: 'How long should my employer keep employment records?',
      answer: 'Record retention requirements (Employment Act): Employee records: 5 years after termination. Records must include: employment contract, payslips, leave records, disciplinary records, termination documentation, attendance records. Purpose: compliance verification, dispute resolution, audit defense. Employer failing to keep records: penalties + difficulty defending labour claims. Employee should also keep: employment contract copy, all payslips, correspondence, performance reviews (personal proof). Digital vs physical: both acceptable (must be accessible). Labour inspectors can request records anytime. Best practice: organized system, backed up (cloud + physical), indexed by employee name/date.'
    }
  ];

  // Employee rights table
  const employeeRights = [
    {
      right: 'Minimum Wage',
      details: 'KES 13,500-18,000/month (varies by location/sector)',
      law: 'Minimum Wage Order'
    },
    {
      right: 'Annual Leave',
      details: '21 working days per year (after 12 months)',
      law: 'Employment Act Section 28'
    },
    {
      right: 'Maternity Leave',
      details: '3 months (90 days) fully paid',
      law: 'Employment Act Section 29'
    },
    {
      right: 'Paternity Leave',
      details: '2 weeks (14 days) fully paid',
      law: 'Employment Act Section 29A'
    },
    {
      right: 'Sick Leave',
      details: '7 days full pay + 7 days half pay per year',
      law: 'Employment Act Section 30'
    },
    {
      right: 'Working Hours',
      details: 'Maximum 8 hours/day, 40-52 hours/week',
      law: 'Employment Act Section 27'
    },
    {
      right: 'Overtime Pay',
      details: '1.5x normal rate (weekdays), 2x rate (weekends/holidays)',
      law: 'Employment Act Section 27'
    },
    {
      right: 'Safe Workplace',
      details: 'Hazard-free environment, protective equipment, training',
      law: 'Occupational Safety & Health Act 2007'
    }
  ];

  // Employer obligations table
  const employerObligations = [
    {
      obligation: 'Written Contract',
      requirement: 'Provide within 3 months of employment start',
      penalty: 'Labour law violation + employee statutory rights apply'
    },
    {
      obligation: 'Minimum Wage Payment',
      requirement: 'Pay at least statutory minimum for sector/location',
      penalty: 'Labour complaint + arrears payment + penalties'
    },
    {
      obligation: 'Statutory Deductions',
      requirement: 'Remit PAYE, NHIF, NSSF monthly to authorities',
      penalty: '20% interest + fines + business suspension'
    },
    {
      obligation: 'Leave Granting',
      requirement: 'Grant annual, sick, maternity leave as per law',
      penalty: 'Labour complaint + compensation + damages'
    },
    {
      obligation: 'Notice Period',
      requirement: 'Give statutory notice or payment in lieu',
      penalty: 'Payment in lieu + unfair termination claim'
    },
    {
      obligation: 'Safe Working Conditions',
      requirement: 'Comply with Occupational Safety & Health Act',
      penalty: 'DOSH fines + criminal prosecution + damages'
    },
    {
      obligation: 'Record Keeping',
      requirement: 'Maintain employee records for 5 years',
      penalty: 'KES 50,000 fine + difficulty in dispute defense'
    }
  ];

  // Notice period table
  const noticePeriods = [
    { service: 'Less than 1 year', employee: '1 week', employer: '1 week' },
    { service: '1-5 years', employee: '2 weeks', employer: '2 weeks' },
    { service: '5-10 years', employee: '4 weeks', employer: '4 weeks' },
    { service: '10+ years', employee: '1 month', employer: '1 month' }
  ];

  // Leave entitlements table
  const leaveEntitlements = [
    {
      type: 'Annual Leave',
      duration: '21 working days',
      payment: 'Full salary',
      eligibility: 'After 12 months continuous service'
    },
    {
      type: 'Maternity Leave',
      duration: '3 months (90 days)',
      payment: 'Full salary',
      eligibility: 'All pregnant employees'
    },
    {
      type: 'Paternity Leave',
      duration: '2 weeks (14 days)',
      payment: 'Full salary',
      eligibility: 'Male employees upon child birth'
    },
    {
      type: 'Sick Leave',
      duration: '7 days full + 7 days half pay',
      payment: 'Full/half salary',
      eligibility: 'All employees (with medical certificate)'
    },
    {
      type: 'Compassionate Leave',
      duration: 'Reasonable period',
      payment: 'Employer discretion',
      eligibility: 'Death of immediate family'
    }
  ];

  // Common mistakes
  const commonMistakes = [
    {
      by: 'Employer',
      mistake: 'No written contract',
      fix: 'Provide written contract within 3 months. Include all statutory terms. Employee keeps copy.'
    },
    {
      by: 'Employer',
      mistake: 'Not paying overtime',
      fix: 'Calculate 1.5x rate for overtime. Maintain overtime records. Pay with salary.'
    },
    {
      by: 'Employer',
      mistake: 'Firing without notice',
      fix: 'Give statutory notice or payment in lieu. Only immediate termination for gross misconduct (after investigation).'
    },
    {
      by: 'Employer',
      mistake: 'Denying maternity leave',
      fix: 'Grant 3 months paid maternity leave. Job protection mandatory. Cannot terminate pregnant employee.'
    },
    {
      by: 'Employee',
      mistake: 'Not signing contract',
      fix: 'Insist on written contract before starting. Read thoroughly. Keep signed copy.'
    },
    {
      by: 'Employee',
      mistake: 'Resigning without notice',
      fix: 'Give statutory notice period. Or negotiate immediate release with employer.'
    },
    {
      by: 'Employee',
      mistake: 'Not reporting unsafe conditions',
      fix: 'Report hazards to employer in writing. Contact DOSH if employer ignores. Refuse unsafe work.'
    },
    {
      by: 'Employee',
      mistake: 'Missing 60-day complaint deadline',
      fix: 'File labour complaint within 60 days of issue. Do not delay. Keep evidence organized.'
    }
  ];

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'key-acts', 'employee-rights', 'employer-obligations', 'employment-contracts', 'termination', 'dispute-resolution', 'hiring-firing', 'workplace-policies', 'common-mistakes', 'faqs'];
      
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
        <title>Kenya Employment & Labour Laws – Employee Employer Rights 2026</title>
        <meta name="description" content="Complete guide to Kenya employment and labour laws. Employee rights, employer obligations, contracts, termination, leave, minimum wage, and dispute resolution." />
        <link rel="canonical" href="https://yoursite.com/kenya-employment-labour-laws" />
        
        {/* OpenGraph */}
        <meta property="og:title" content="Kenya Employment & Labour Laws – Complete Rights Guide 2026" />
        <meta property="og:description" content="Definitive guide to employee rights and employer obligations in Kenya. Contracts, leave, termination, minimum wage, and labour dispute resolution." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://yoursite.com/kenya-employment-labour-laws" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=630&fit=crop" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Kenya Employment & Labour Laws Guide 2026" />
        <meta name="twitter:description" content="Employee rights, employer obligations, contracts, termination, leave entitlements, and dispute resolution under Kenyan labour law." />
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
            "description": "Kenya employment and labour law guidance"
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
                "name": "Employment & Labour Laws",
                "item": "https://yoursite.com/kenya-employment-labour-laws"
              }
            ]
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to File a Labour Dispute in Kenya",
            "description": "Step-by-step process for filing and resolving employment disputes",
            "step": [
              {
                "@type": "HowToStep",
                "position": 1,
                "name": "Attempt Internal Resolution",
                "text": "Discuss issue with employer or HR department first"
              },
              {
                "@type": "HowToStep",
                "position": 2,
                "name": "File Complaint at Labour Office",
                "text": "Submit Labour Dispute Form within 60 days of issue"
              },
              {
                "@type": "HowToStep",
                "position": 3,
                "name": "Attend Conciliation",
                "text": "Labour Officer mediates between parties for 30 days"
              },
              {
                "@type": "HowToStep",
                "position": 4,
                "name": "Proceed to Court if Unresolved",
                "text": "File case at Employment & Labour Relations Court"
              }
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
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">Kenya Employment & Labour Laws – Complete Employee & Employer Rights Guide 2026</h1>
            </div>
            <p className="text-blue-100 text-lg max-w-3xl">Definitive guide to employment and labour laws in Kenya. Know your rights as an employee, understand your obligations as an employer, and resolve workplace disputes legally.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#employee-rights" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Employee Rights
              </a>
              <a href="#employer-obligations" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
                Employer Obligations <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:block sticky top-0 bg-white shadow-md z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex gap-2 overflow-x-auto">
              {['overview', 'key-acts', 'employee-rights', 'employer-obligations', 'employment-contracts', 'termination', 'dispute-resolution', 'hiring-firing', 'workplace-policies', 'common-mistakes', 'faqs'].map((section) => (
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
                  {section === 'overview' ? 'Overview' : section === 'key-acts' ? 'Acts' : section === 'employee-rights' ? 'Employee Rights' : section === 'employer-obligations' ? 'Employer Duties' : section === 'employment-contracts' ? 'Contracts' : section === 'termination' ? 'Termination' : section === 'dispute-resolution' ? 'Disputes' : section === 'hiring-firing' ? 'Hiring/Firing' : section === 'workplace-policies' ? 'Policies' : section === 'common-mistakes' ? 'Mistakes' : 'FAQs'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden sticky top-0 bg-white shadow-md z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {['overview', 'employee-rights', 'employer-obligations', 'termination', 'dispute-resolution', 'faqs'].map((section) => (
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
                  {section === 'overview' ? 'Overview' : section === 'employee-rights' ? 'Rights' : section === 'employer-obligations' ? 'Duties' : section === 'termination' ? 'Termination' : section === 'dispute-resolution' ? 'Disputes' : 'FAQs'}
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
              <BookOpen className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Overview of Labour Laws in Kenya</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Kenya's employment and labour laws protect both employees and employers. Understanding these laws ensures fair treatment, legal compliance, and harmonious workplace relations.</p>

              <img 
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop"
                alt="Employment and labour laws in Kenya - workplace rights"
                className="rounded-lg shadow-lg w-full mb-6"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">✓ For Employees</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Know your minimum wage rights</li>
                    <li>• Understand leave entitlements (annual, sick, maternity)</li>
                    <li>• Learn termination protections</li>
                    <li>• Claim overtime pay</li>
                    <li>• File labour complaints if rights violated</li>
                  </ul>
                </div>

                <div className="bg-green-50 border-l-4 border-green-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">📋 For Employers</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Comply with statutory obligations</li>
                    <li>• Provide written employment contracts</li>
                    <li>• Follow fair termination procedures</li>
                    <li>• Maintain workplace safety</li>
                    <li>• Avoid costly labour disputes</li>
                  </ul>
                </div>
              </div>

              <p className="text-gray-700 mb-4"><strong>Key principle:</strong> Employment relationship governed by law, not just contract. Even without written contract, statutory rights and obligations apply. Ignorance of law is not defense.</p>
            </div>
          </section>

          {/* Key Acts */}
          <section id="key-acts" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Key Employment Acts in Kenya</h2>
            </div>

            <div className="prose max-w-none">
              <div className="space-y-4 mb-6">
                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Employment Act 2007 (Amended 2012, 2019)</h4>
                  <p className="text-gray-700 text-sm">Primary legislation governing employment. Covers: employment contracts, minimum wage, working hours, leave entitlements, termination procedures, employee rights. Applies to: all employees except domestic workers (separate regulations). Key sections: contracts (Section 10), leave (Sections 28-30), termination (Sections 35-47).</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Labour Relations Act 2007</h4>
                  <p className="text-gray-700 text-sm">Governs: trade unions, collective bargaining, labour disputes, strikes and lockouts, unfair labour practices. Establishes: dispute resolution mechanisms, Employment & Labour Relations Court, Industrial Court. Key protections: freedom of association, collective bargaining rights, protection from victimization.</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Occupational Safety & Health Act 2007</h4>
                  <p className="text-gray-700 text-sm">Ensures workplace safety and health. Employer obligations: safe working environment, protective equipment, safety training, risk assessment, accident reporting. Enforced by: Directorate of Occupational Safety & Health Services (DOSH). Penalties: fines up to KES 500,000 + criminal prosecution for serious violations.</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Work Injury Benefits Act 2007</h4>
                  <p className="text-gray-700 text-sm">Provides compensation for work-related injuries and diseases. Covers: medical expenses, disability compensation, death benefits (for dependents). Administered by: WIBA (Work Injury Benefits insurance). Employer must: register employees with WIBA insurer, pay premiums. Employee claims: file within 12 months of injury.</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Constitution of Kenya 2010</h4>
                  <p className="text-gray-700 text-sm">Article 41: guarantees labour rights (fair labour practices, reasonable working conditions, fair remuneration, right to strike). Article 27: equality and non-discrimination in employment. Supreme law: overrides conflicting provisions in other employment legislation.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Employee Rights */}
          <section id="employee-rights" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Employee Rights in Kenya</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Statutory rights guaranteed to all employees regardless of contract terms:</p>

              <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto mb-6">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Right</th>
                      <th className="px-4 py-3 text-left font-semibold">Details</th>
                      <th className="px-4 py-3 text-left font-semibold">Legal Basis</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {employeeRights.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                        <td className="px-4 py-3 font-semibold text-gray-900 text-sm">{item.right}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.details}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.law}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">💰 Minimum Wage 2026</h4>
                  <p className="text-gray-700 text-sm">Varies by location and sector. Nairobi/major cities: KES 15,201-18,000/month. Counties/towns: KES 13,572-15,201/month. Agricultural workers: KES 8,500-11,000/month. General minimum: KES 13,500/month. Employer paying below minimum = labour law violation. Employee can claim arrears. Wage Order reviewed annually by Wage Advisory Board.</p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">🌴 Leave Entitlements</h4>
                  <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto mt-3">
                    <table className="w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-semibold">Type</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold">Duration</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold">Payment</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold">Eligibility</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {leaveEntitlements.map((item, index) => (
                          <tr key={index} className="text-sm">
                            <td className="px-4 py-2 font-medium text-gray-900">{item.type}</td>
                            <td className="px-4 py-2 text-gray-700">{item.duration}</td>
                            <td className="px-4 py-2 text-gray-700">{item.payment}</td>
                            <td className="px-4 py-2 text-gray-700">{item.eligibility}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">⏰ Working Hours & Overtime</h4>
                  <p className="text-gray-700 text-sm">Maximum working hours: 8 hours/day, 52 hours/week (including overtime). Normal working week: 40-45 hours (Monday-Friday). Overtime pay: 1.5x normal hourly rate (weekdays beyond 8 hours), 2x normal rate (weekends/public holidays). Calculation: (monthly salary ÷ 208 hours) × rate × overtime hours. Example: KES 40,000 salary, 10 overtime hours = (40,000÷208) × 1.5 × 10 = KES 2,885. Employer must maintain overtime records.</p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">🏥 Safe Working Conditions</h4>
                  <p className="text-gray-700 text-sm">Employer must provide: hazard-free environment, protective equipment (free to employees), safety training, first aid facilities, clean sanitation, adequate ventilation, emergency exits. Employee rights: refuse unsafe work (without penalty), report hazards, receive safety equipment. High-risk industries (construction, manufacturing, mining): additional requirements. Employer violations: DOSH fines + criminal prosecution.</p>
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-600 p-5 rounded-lg">
                <p className="text-gray-700 text-sm"><strong>✓ Key point:</strong> These are MINIMUM statutory rights. Employment contract can provide MORE (longer leave, higher pay) but NEVER LESS than statutory minimums. Contract terms below statutory minimums = void/unenforceable.</p>
              </div>
            </div>
          </section>

          {/* Employer Obligations */}
          <section id="employer-obligations" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <Building2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Employer Obligations in Kenya</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Legal obligations employers must fulfill:</p>

              <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto mb-6">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Obligation</th>
                      <th className="px-4 py-3 text-left font-semibold">Requirement</th>
                      <th className="px-4 py-3 text-left font-semibold">Penalty for Non-Compliance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {employerObligations.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 font-semibold text-gray-900 text-sm">{item.obligation}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.requirement}</td>
                        <td className="px-4 py-3 text-red-700 text-sm">{item.penalty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-orange-50 border-l-4 border-orange-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">📝 Written Contract Requirement</h4>
                  <p className="text-gray-700 text-sm">Must provide written contract within 3 months of employment start. Contract must include: job title and duties, salary and benefits, working hours, leave entitlements, notice period, probation period (if any), termination grounds. Employee copy: employer must provide signed copy. Contract changes: require mutual written agreement. No contract but employee working = employment relationship exists (statutory rights apply). Employer failing to provide contract = labour law violation.</p>
                </div>

                <div className="bg-orange-50 border-l-4 border-orange-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">💵 Payment Obligations</h4>
                  <p className="text-gray-700 text-sm">Pay at least minimum wage for sector/location. Pay on time (monthly or as agreed). Provide itemized payslip (showing: gross salary, deductions, net pay). Remit statutory deductions within deadline: PAYE (by 9th of next month), NHIF (by 9th), NSSF (by 15th). Late remittance: 20% interest + penalties + business suspension risk. Salary delays = labour complaint + interest claim.</p>
                </div>

                <div className="bg-orange-50 border-l-4 border-orange-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">🏥 Health & Safety</h4>
                  <p className="text-gray-700 text-sm">Comply with Occupational Safety & Health Act 2007. Conduct workplace risk assessments. Provide protective equipment (free). Train employees on safety procedures. Maintain first aid facilities. Report workplace accidents to DOSH within 7 days. Keep safety records (5 years). High-risk workplaces: additional inspections + certifications required. Violations: KES 50,000-500,000 fines + criminal prosecution + civil damages.</p>
                </div>

                <div className="bg-orange-50 border-l-4 border-orange-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">📁 Record Keeping</h4>
                  <p className="text-gray-700 text-sm">Maintain employee records for 5 years after termination. Records must include: employment contracts, payslips (all), leave records, disciplinary records, termination documentation, attendance records. Labour inspectors can demand records anytime. Failure to produce records: KES 50,000 fine + difficulty defending labour disputes. Digital or physical acceptable (must be accessible). Best practice: organized filing system + backup.</p>
                </div>
              </div>

              <div className="bg-red-50 border-l-4 border-red-600 p-5 rounded-lg">
                <p className="text-gray-700 text-sm"><strong>⚠️ Critical:</strong> Employer violations = labour complaints + financial penalties + business reputation damage + potential criminal liability (serious cases). Prevention cheaper than defense. Ensure compliance from day one of employment.</p>
              </div>
            </div>
          </section>

          {/* Employment Contracts */}
          <section id="employment-contracts" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Employment Contracts Explained</h2>
            </div>

            <div className="prose max-w-none">
              <div className="space-y-4 mb-6">
                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Types of Employment Contracts</h4>
                  <p className="text-gray-700 text-sm"><strong>Permanent/Indefinite:</strong> No end date. Most common. Terminable only per Employment Act (notice, redundancy, misconduct). Job security highest.</p>
                  <p className="text-gray-700 text-sm"><strong>Fixed-term:</strong> Specific end date (e.g., 1-year contract for project). Automatically terminates at end (no notice required if contract expires naturally). Cannot be renewed indefinitely (max 3 consecutive fixed terms = becomes permanent).</p>
                  <p className="text-gray-700 text-sm"><strong>Casual/Part-time:</strong> Hourly or daily basis. Limited hours per week. Entitled to proportional statutory rights (pro-rata leave, notice). Cannot be used to avoid permanent employment obligations if work is continuous.</p>
                  <p className="text-gray-700 text-sm"><strong>Probation:</strong> Trial period (max 6 months). Employee entitled to ALL statutory rights. Either party can terminate with 7 days notice. After probation: becomes permanent (confirmation required in writing).</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Essential Contract Clauses</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• <strong>Job title and duties:</strong> clear description of role</li>
                    <li>• <strong>Salary and benefits:</strong> gross amount, frequency, allowances</li>
                    <li>• <strong>Working hours:</strong> start/end times, days per week</li>
                    <li>• <strong>Leave entitlements:</strong> annual, sick, maternity/paternity</li>
                    <li>• <strong>Notice period:</strong> for resignation and termination</li>
                    <li>• <strong>Probation period:</strong> duration (if applicable, max 6 months)</li>
                    <li>• <strong>Termination grounds:</strong> valid reasons for dismissal</li>
                    <li>• <strong>Disciplinary procedures:</strong> warnings, hearings, appeals</li>
                    <li>• <strong>Confidentiality:</strong> protection of business information</li>
                    <li>• <strong>Governing law:</strong> Kenyan employment law</li>
                  </ul>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Contract Review Checklist</h4>
                  <p className="text-gray-700 text-sm"><strong>Before signing:</strong></p>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>✓ Read entire contract thoroughly (do not skip sections)</li>
                    <li>✓ Verify salary matches offer letter</li>
                    <li>✓ Check notice period (reasonable?)</li>
                    <li>✓ Confirm leave entitlements meet statutory minimums</li>
                    <li>✓ Understand probation terms</li>
                    <li>✓ Review termination clauses (fair?)</li>
                    <li>✓ Check for restrictive covenants (non-compete, non-solicitation)</li>
                    <li>✓ Clarify ambiguous terms before signing</li>
                    <li>✓ Keep signed copy for your records</li>
                  </ul>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Probation Period Rules</h4>
                  <p className="text-gray-700 text-sm">Maximum: 6 months (cannot exceed per Employment Act). Purpose: assess employee suitability. Rights during probation: ALL statutory rights apply (minimum wage, leave, safety). Shorter notice: 7 days for either party (vs statutory notice after confirmation). Extension: requires mutual written agreement (rare, for specialized skills training). No probation clause = employment permanent from day 1. After probation: employer must confirm in writing (promotes to permanent) or terminate (with 7 days notice + valid reason).</p>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg">
                <p className="text-gray-700 text-sm"><strong>💡 Pro tip:</strong> Seek legal review if contract contains unusual clauses (restrictive covenants, extended notice periods, penalty clauses). Lawyer costs KES 5,000-20,000 but saves future disputes. Never sign under pressure. Request time to review.</p>
              </div>
            </div>
          </section>

          {/* Termination */}
          <section id="termination" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Termination of Employment</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Legal requirements for ending employment relationship:</p>

              <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto mb-6">
                <h4 className="font-bold text-gray-900 px-4 pt-4 pb-2">Notice Periods by Length of Service</h4>
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Length of Service</th>
                      <th className="px-4 py-3 text-left font-semibold">Employee Notice</th>
                      <th className="px-4 py-3 text-left font-semibold">Employer Notice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {noticePeriods.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 font-semibold text-gray-900 text-sm">{item.service}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.employee}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.employer}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-red-50 border-l-4 border-red-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">🚫 Valid Termination Reasons</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• <strong>Redundancy:</strong> genuine business need (closure, restructuring, technology)</li>
                    <li>• <strong>Poor performance:</strong> after warnings + improvement opportunity</li>
                    <li>• <strong>Misconduct:</strong> after investigation + disciplinary hearing</li>
                    <li>• <strong>Gross misconduct:</strong> serious breach (theft, violence, fraud) - immediate dismissal</li>
                    <li>• <strong>Incapacity:</strong> medical inability to perform duties</li>
                    <li>• <strong>Expiry of fixed-term contract:</strong> natural end of contract period</li>
                  </ul>
                </div>

                <div className="bg-red-50 border-l-4 border-red-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">⚠️ Unfair/Unlawful Termination</h4>
                  <p className="text-gray-700 text-sm">Termination unlawful if based on:</p>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Discrimination (tribe, gender, religion, disability, pregnancy)</li>
                    <li>• Retaliation (whistleblowing, union membership, filing complaint)</li>
                    <li>• Without valid reason (arbitrary dismissal)</li>
                    <li>• Without notice (except gross misconduct)</li>
                    <li>• Without due process (no investigation, no hearing)</li>
                    <li>• During maternity/sick leave (unless unrelated valid reason)</li>
                  </ul>
                  <p className="text-gray-700 text-sm mt-2"><strong>Employee remedies:</strong> File complaint within 60 days, Claim compensation (up to 12 months salary), Reinstatement (if desired), Damages for distress.</p>
                </div>

                <div className="bg-red-50 border-l-4 border-red-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">💰 Redundancy Compensation</h4>
                  <p className="text-gray-700 text-sm">Formula: 15 days salary per year of service (or statutory minimum if contract silent). Example: 5 years service at KES 40,000/month = 5 × (40,000 × 15/30) = KES 100,000 redundancy pay. Plus: notice period payment (or working notice). Redundancy process: 30 days notice to employees + union, Consultation (explain reasons, alternatives), Selection criteria (fair, objective), Payment of redundancy + notice. Invalid redundancy: employer refilling same position within 6 months = presumed unfair.</p>
                </div>

                <div className="bg-red-50 border-l-4 border-red-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">📋 Fair Termination Procedure</h4>
                  <p className="text-gray-700 text-sm"><strong>Step 1:</strong> Document performance/conduct issues (written warnings). <strong>Step 2:</strong> Investigate allegations thoroughly (gather evidence). <strong>Step 3:</strong> Disciplinary hearing (employee opportunity to respond, bring representative). <strong>Step 4:</strong> Decision (fair, proportionate to offense). <strong>Step 5:</strong> Written termination letter (state reasons, notice period, final pay). <strong>Step 6:</strong> Appeal opportunity (if employee disputes). Failure to follow procedure = procedural unfairness = compensation claim even if substantive reason valid.</p>
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-600 p-5 rounded-lg">
                <p className="text-gray-700 text-sm"><strong>✓ Key principle:</strong> Fair termination requires: valid reason (substantive fairness) + proper procedure (procedural fairness). Both must be present. Employer bears burden of proving termination was fair.</p>
              </div>
            </div>
          </section>

          {/* Dispute Resolution */}
          <section id="dispute-resolution" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <Globe className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Labour Dispute Resolution Process</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Step-by-step process for resolving employment disputes:</p>

              <div className="space-y-4 mb-6">
                <div className="bg-white border-l-4 border-blue-600 p-5 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-sm">1</div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Internal Resolution (First Step)</h4>
                      <p className="text-gray-700 text-sm">Attempt to resolve with employer/HR first. Discuss issue calmly, Document conversation (email follow-up), Request written response, Give reasonable time to resolve (7-14 days). If unresolved or employer unresponsive → proceed to Step 2.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-5 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-sm">2</div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">File Complaint at Labour Office</h4>
                      <p className="text-gray-700 text-sm">Timeline: within 60 days of issue arising (strict deadline). Where: nearest Labour Office (county-based). Forms: Labour Dispute Form (Form LD1). Attach: employment contract, payslips, correspondence, evidence. Cost: FREE filing. Processing: Labour Officer reviews complaint within 7 days.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-5 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-sm">3</div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Conciliation/Mediation (30 Days)</h4>
                      <p className="text-gray-700 text-sm">Labour Officer mediates between parties. Both parties attend conciliation meetings. Officer proposes settlement. If agreement reached: signed settlement (binding). If unresolved after 30 days → Certificate of Unresolved Dispute issued → proceed to Step 4.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-5 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-sm">4</div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Employment & Labour Relations Court</h4>
                      <p className="text-gray-700 text-sm">File case using Certificate of Unresolved Dispute. Formal court hearing (judge presides). Legal representation allowed (lawyer recommended). Evidence presented, witnesses called. Timeline: 6-18 months (varies by case complexity). Remedies: unpaid wages, unfair termination compensation (up to 12 months salary), reinstatement, damages. Appeal: to Court of Appeal if dissatisfied.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg mb-6">
                <h4 className="font-bold text-gray-900 mb-2">💡 Dispute Filing Tips</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• File within 60 days (strict deadline - late filing rejected)</li>
                  <li>• Keep all evidence (contracts, payslips, emails, text messages)</li>
                  <li>• Attend all conciliation meetings (non-attendance weakens case)</li>
                  <li>• Consider settlement (court is costly, time-consuming)</li>
                  <li>• Hire lawyer for court stage (costs KES 20,000-100,000+ but improves success)</li>
                  <li>• Be patient (process can take 6-24 months total)</li>
                </ul>
              </div>

              <div className="bg-green-50 border-l-4 border-green-600 p-5 rounded-lg">
                <p className="text-gray-700 text-sm"><strong>Success rates:</strong> Conciliation resolves about 60% of cases (faster, cheaper). Court success depends on evidence quality + procedural compliance. Employee wins about 40-50% of unfair termination cases. Employer wins if can prove fair reason + fair procedure.</p>
              </div>
            </div>
          </section>

          {/* Hiring & Firing Checklist */}
          <section id="hiring-firing" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Hiring & Firing Checklist for Employers</h2>
            </div>

            <div className="prose max-w-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white border-2 border-green-200 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    Hiring Checklist
                  </h4>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>✓ Draft written employment contract (all statutory terms)</li>
                    <li>✓ Verify candidate credentials (certificates, references)</li>
                    <li>✓ Conduct interviews fairly (no discriminatory questions)</li>
                    <li>✓ Issue offer letter (salary, start date, position)</li>
                    <li>✓ Obtain signed contract before start date</li>
                    <li>✓ Register employee for NHIF, NSSF, PAYE</li>
                    <li>✓ Conduct orientation (safety, policies, duties)</li>
                    <li>✓ Open employee file (contract, ID copy, certificates)</li>
                    <li>✓ Issue employment ID badge/tools/equipment</li>
                    <li>✓ Add to payroll system</li>
                  </ul>
                </div>

                <div className="bg-white border-2 border-red-200 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    Firing Checklist
                  </h4>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>✓ Document performance/conduct issues (warnings)</li>
                    <li>✓ Investigate allegations thoroughly (gather evidence)</li>
                    <li>✓ Conduct disciplinary hearing (employee responds)</li>
                    <li>✓ Allow employee representation (colleague/union)</li>
                    <li>✓ Make fair decision (proportionate to offense)</li>
                    <li>✓ Issue written termination letter (reasons stated)</li>
                    <li>✓ Give statutory notice or payment in lieu</li>
                    <li>✓ Calculate final pay (salary + leave + dues)</li>
                    <li>✓ Provide opportunity to appeal decision</li>
                    <li>✓ Issue termination documents (service certificate)</li>
                  </ul>
                </div>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-600 p-5 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">⚠️ Common Hiring/Firing Mistakes</h4>
                <p className="text-gray-700 text-sm"><strong>Hiring:</strong> Verbal contracts only (no written), discriminatory hiring (tribe/gender preference), not verifying credentials, unclear job descriptions. <strong>Firing:</strong> No investigation, no hearing, discriminatory reasons, immediate dismissal without gross misconduct, not giving notice. Prevention: follow checklist strictly, document everything, seek HR/legal advice when unsure.</p>
              </div>
            </div>
          </section>

          {/* Workplace Policies */}
          <section id="workplace-policies" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <Building2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Workplace Policies Employers Must Implement</h2>
            </div>

            <div className="prose max-w-none">
              <div className="space-y-3 mb-6">
                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">✓ Occupational Safety & Health Policy</h4>
                  <p className="text-gray-700 text-sm">Required by: Occupational Safety & Health Act 2007. Must include: hazard identification procedures, protective equipment provision, safety training schedules, accident reporting protocol, emergency procedures. Display: conspicuously at workplace. Review: annually or when workplace changes.</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">✓ Sexual Harassment Policy</h4>
                  <p className="text-gray-700 text-sm">Required by: Employment Act Section 6. Must define sexual harassment, complaint procedure, investigation process, disciplinary measures. Zero tolerance approach. Confidential reporting mechanism. Employee awareness training mandatory.</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">✓ HIV/AIDS Workplace Policy</h4>
                  <p className="text-gray-700 text-sm">Required by: HIV & AIDS Prevention and Control Act 2006. Must ensure: non-discrimination, confidentiality of status, reasonable accommodation, awareness programs. Cannot: mandatory testing, disclosure requirement, terminate due to HIV status.</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">✓ Disciplinary Procedure</h4>
                  <p className="text-gray-700 text-sm">Required by: Employment Act Section 41-43. Must outline: misconduct categories, investigation procedure, hearing rights, appeal mechanism, penalties (warning to dismissal). Progressive discipline approach. Fair and consistent application.</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">✓ Leave Policy</h4>
                  <p className="text-gray-700 text-sm">Must specify: annual leave calculation, application procedure, sick leave requirements (medical certificate), maternity/paternity leave process, compassionate leave provisions. Ensure compliance with statutory minimums.</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">✓ Grievance Procedure</h4>
                  <p className="text-gray-700 text-sm">Employee right to raise concerns. Must include: reporting mechanism, investigation timeline, escalation process, resolution timeframe. Protects whistleblowers from retaliation.</p>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">📋 Policy Implementation</h4>
                <p className="text-gray-700 text-sm">All policies must be: written clearly (plain language), communicated to all employees (induction + periodic training), displayed at workplace (accessible), signed by employees (acknowledgment), reviewed periodically (annual or when law changes). Employer failing to have policies = compliance gap + difficulty defending labour disputes.</p>
              </div>
            </div>
          </section>

          {/* Common Mistakes */}
          <section id="common-mistakes" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Common Mistakes by Employers & Employees</h2>
            </div>

            <div className="prose max-w-none">
              <div className="space-y-3">
                {commonMistakes.map((item, index) => (
                  <div key={index} className={`bg-white border-l-4 p-4 rounded-lg ${item.by === 'Employer' ? 'border-orange-600' : 'border-blue-600'}`}>
                    <h4 className="font-bold text-gray-900 mb-1">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-bold mr-2 ${item.by === 'Employer' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>
                        {item.by}
                      </span>
                      {item.mistake}
                    </h4>
                    <p className="text-gray-700 text-sm"><strong>✓ Fix:</strong> {item.fix}</p>
                  </div>
                ))}
              </div>

              <div className="bg-green-50 border-l-4 border-green-600 p-5 rounded-lg mt-6">
                <p className="text-gray-700 text-sm"><strong>Prevention strategy:</strong> Educate yourself on labour laws (this guide is start). Seek professional advice when unsure (lawyer/HR consultant). Document everything (paper trail = evidence). Treat employment relationship seriously (contract = legal commitment). Prevention cheaper than fixing mistakes.</p>
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
              <h2 className="text-2xl font-bold mb-4">Need Employment Law Assistance?</h2>
              <p className="text-blue-100 mb-6">Whether you're an employee facing workplace issues or an employer seeking compliance guidance, get professional help today.</p>
              
              <div className="flex flex-wrap gap-3">
                <a href="#dispute-resolution" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  File Labour Complaint
                </a>
                <a href="/how-to-register-business-kenya" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
                  Business Setup <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </section>

          {/* Internal Links */}
          <section className="mt-12 pt-8 border-t-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Related Business & Legal Compliance Guides</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <a href="/how-to-register-business-kenya" className="p-4 border-2 border-blue-200 rounded-lg hover:shadow-lg transition-shadow hover:border-blue-600">
                <h4 className="font-bold text-gray-900 mb-1">Register Your Business</h4>
                <p className="text-gray-600 text-sm">Start your business legally in Kenya</p>
              </a>
              <a href="/limited-company-registration-kenya" className="p-4 border-2 border-green-200 rounded-lg hover:shadow-lg transition-shadow hover:border-green-600">
                <h4 className="font-bold text-gray-900 mb-1">Limited Company Registration</h4>
                <p className="text-gray-600 text-sm">Incorporate a limited company</p>
              </a>
              <a href="/company-annual-returns-and-filing-kenya" className="p-4 border-2 border-orange-200 rounded-lg hover:shadow-lg transition-shadow hover:border-orange-600">
                <h4 className="font-bold text-gray-900 mb-1">Annual Returns & Filing</h4>
                <p className="text-gray-600 text-sm">File CR12 and stay compliant</p>
              </a>
              <a href="/business-permits-licenses-kenya" className="p-4 border-2 border-purple-200 rounded-lg hover:shadow-lg transition-shadow hover:border-purple-600">
                <h4 className="font-bold text-gray-900 mb-1">Business Permits & Licenses</h4>
                <p className="text-gray-600 text-sm">Get required permits and licenses</p>
              </a>
              <a href="/kra-pin-and-tax-registration-kenya" className="p-4 border-2 border-red-200 rounded-lg hover:shadow-lg transition-shadow hover:border-red-600">
                <h4 className="font-bold text-gray-900 mb-1">KRA PIN & Tax Registration</h4>
                <p className="text-gray-600 text-sm">Register for taxes and get KRA PIN</p>
              </a>
              <a href="/business-tax-obligations-kenya" className="p-4 border-2 border-indigo-200 rounded-lg hover:shadow-lg transition-shadow hover:border-indigo-600">
                <h4 className="font-bold text-gray-900 mb-1">Business Tax Obligations</h4>
                <p className="text-gray-600 text-sm">VAT, PAYE, and income tax compliance</p>
              </a>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default KenyaEmploymentLabourLaws;
