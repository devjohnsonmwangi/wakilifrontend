import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, FileText, Building2, AlertTriangle, BookOpen, Shield, Users, CheckCircle2, XCircle, Download } from 'lucide-react';

const EmploymentContractsKenya = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // FAQ data
  const faqs = [
    {
      question: 'Is a written employment contract mandatory in Kenya?',
      answer: 'Yes, written contract required by law. Employment Act 2007 Section 10: employer must provide written contract within 3 months of employment start. Contract must include: job title, duties, salary, working hours, leave entitlements, notice period, termination grounds. Verbal contracts valid but hard to prove. No written contract = employer violation (employee still entitled to statutory rights). Best practice: sign contract before starting work. Employee copy: must be provided. Contract changes: require mutual written agreement. Working without contract still creates employment relationship (all statutory protections apply).'
    },
    {
      question: 'What clauses must be in every employment contract?',
      answer: 'Mandatory clauses per Employment Act: 1. Parties (employer and employee names), 2. Job title and description of duties, 3. Start date and contract type (permanent/fixed-term), 4. Probation period (if applicable, max 6 months), 5. Salary/wage and payment frequency, 6. Working hours and days, 7. Leave entitlements (annual, sick, maternity), 8. Notice period for termination, 9. Termination grounds and procedures, 10. Place of work/workstation. Optional but recommended: confidentiality, non-compete, intellectual property, disciplinary procedures, grievance mechanism. Contract below statutory minimums = void/unenforceable (statutory rights prevail).'
    },
    {
      question: 'How long can probation period be?',
      answer: 'Maximum probation: 6 months (cannot exceed per Employment Act). Purpose: assess employee suitability and fit. During probation: employee entitled to ALL statutory rights (minimum wage, leave, safety, no discrimination). Only difference: shorter notice period (7 days for either party vs statutory notice after confirmation). Extension: possible only with mutual written agreement (rare, typically for specialized skills training). No probation clause = employment permanent from day 1. After probation: employer must confirm in writing (promotes to permanent) OR terminate with 7 days notice + valid reason. Cannot use probation to avoid permanent employment obligations.'
    },
    {
      question: 'Can I download free employment contract templates?',
      answer: 'Yes, templates available from: Ministry of Labour website (official templates), Kenya Law website (sample contracts), Federation of Kenya Employers (FKE) - members only, Legal websites and law firms (free/paid templates). Caution: customize template to your specific situation (do not use as-is). Key customizations: job-specific duties, salary and benefits, industry-specific clauses, company policies. Template limitations: generic language, may not cover all scenarios, legal review recommended (lawyer costs KES 5,000-20,000 but ensures compliance). Use template as starting point, not final contract. Employer responsible for compliance even if using template.'
    },
    {
      question: 'What is a fixed-term contract and when to use it?',
      answer: 'Fixed-term contract: employment with specific end date (e.g., 1-year contract for project). When to use: temporary projects (construction, events), seasonal work (agriculture, tourism), maternity/sick leave cover, probationary appointments, consultant engagements. Requirements: must state end date clearly, justify business need for fixed term, cannot be used to avoid permanent employment. Limitations: maximum 3 consecutive renewals (after 3rd renewal = automatically becomes permanent employment). Termination: contract expires naturally at end date (no notice required if expires naturally), early termination requires notice + valid reason. Employee rights: all statutory rights apply (pro-rata leave, notice if terminated early). Abuse: repeatedly hiring same person on fixed-term = deemed permanent employment.'
    },
    {
      question: 'Can employer change my contract without consent?',
      answer: 'No, unilateral changes prohibited. Employment contract = mutual agreement (requires both parties consent). Any changes must be: discussed and agreed upon, documented in writing (signed amendment), attached to original contract. Changes requiring consent: salary reduction, job duties expansion, working hours change, location transfer, benefits reduction. Employer imposing changes without consent = breach of contract (employee can: refuse changes, file labour complaint, claim constructive dismissal if changes materially adverse). Exception: minor changes within job scope (reasonable management prerogative). Best practice: negotiate changes before signing, document all agreements in writing.'
    },
    {
      question: 'What is a non-compete clause and is it enforceable?',
      answer: 'Non-compete clause: restricts employee from working for competitor or starting competing business after leaving employment. Typical duration: 6 months to 2 years post-employment. Geographic scope: specific area (e.g., Nairobi, Kenya). Enforceability in Kenya: valid IF reasonable in: duration (typically max 2 years), geographic scope (not overly broad), nature of restriction (protects legitimate business interests). Unreasonable clauses: unenforceable (courts will strike down). Legitimate interests: client relationships, trade secrets, confidential information. Not legitimate: general industry knowledge, skills acquired. Employer burden: prove clause necessary and reasonable. Employee options: negotiate removal/reduction before signing, challenge in court if unreasonable, seek legal advice if restricted.'
    },
    {
      question: 'How do I terminate an employment contract legally?',
      answer: 'Legal termination steps: 1. Review contract (check notice period required), 2. Prepare written resignation/termination letter (state reasons if employer terminating), 3. Give statutory notice (1 week to 1 month depending on service length) OR payment in lieu, 4. Employer: follow disciplinary procedure if misconduct (investigation + hearing), 5. Calculate final pay (salary + accrued leave + dues), 6. Return company property (ID, equipment, documents), 7. Issue termination documents (service certificate, clearance letter). Immediate termination: only for gross misconduct (theft, violence, fraud) - investigation still required. Invalid termination: without notice, without valid reason, discriminatory, procedurally unfair = unfair termination claim (compensation up to 12 months salary).'
    },
    {
      question: 'What happens if my employer does not provide a contract?',
      answer: 'Employer violation but employee still protected. Consequences: employer breaches Employment Act Section 10, employee can file labour complaint, employer liable for penalties (KES 10,000-50,000). Employee rights WITHOUT written contract: ALL statutory rights still apply (minimum wage, leave, notice, termination protections), employment relationship exists (proven by: working, receiving salary, employer control), can demand written contract (employer must provide), verbal agreement valid (harder to prove terms). Evidence to keep: payslips, bank deposits, work emails, ID badge, witnesses. Termination: same protections apply (notice required, valid reason needed). Best action: request written contract immediately (in writing), if refused = file complaint at Labour Office, continue documenting employment relationship.'
    },
    {
      question: 'Can probation period be extended?',
      answer: 'Extension possible but restricted. Employment Act allows: maximum 6 months initial probation, extension ONLY with mutual written agreement (cannot be unilateral), extension justified by: specialized skills training, performance improvement plan, legitimate assessment need. Total probation cannot exceed reasonable period (courts may void excessive extensions). Employee rights during extended probation: same statutory rights apply, can refuse extension (becomes permanent), termination during extension still requires 7 days notice + valid reason. Employer abuse: repeatedly extending probation to avoid permanent status = illegal (deemed permanent employment). Best practice: employee should request confirmation in writing after 6 months, negotiate reasonable extension terms if needed, document extension agreement.'
    },
    {
      question: 'What is the difference between permanent and contract employment?',
      answer: 'Permanent employment: no end date, indefinite duration, terminable only per Employment Act (notice, redundancy, misconduct), strongest job security. Fixed-term/contract: specific end date, expires naturally at end (no notice if expires naturally), less job security, cannot exceed 3 consecutive renewals (becomes permanent after 3rd). Rights comparison: Both entitled to: minimum wage, leave, notice if terminated early, safe workplace, non-discrimination. Differences: Permanent = full benefits typically, long-term planning, career progression. Contract = project-based, may have limited benefits, temporary. Employers prefer contract for: temporary needs, cost control, flexibility. Employees prefer permanent: stability, benefits, long-term security. Conversion: contract becomes permanent if: 3 consecutive renewals, continuous employment beyond contract term, performing permanent role.'
    },
    {
      question: 'Are confidentiality clauses enforceable?',
      answer: 'Yes, generally enforceable if reasonable. Purpose: protect employer trade secrets, client lists, proprietary information, business strategies. Scope: must define what is confidential (specific, not overly broad), duration (during employment + reasonable period after), permitted disclosures (legal obligations, public information). Enforceable confidentiality: protects genuine business interests, reasonable scope and duration, not public information. Unenforceable: overly broad (all information ever learned), indefinite duration (unreasonable), general industry knowledge. Employee obligations: maintain confidentiality during and after employment, return confidential documents on termination, cannot use for personal gain or competitor benefit. Remedies for breach: injunction (stop disclosure), damages (financial compensation), criminal prosecution (serious cases). Employer must: clearly define confidential information, train employees, implement security measures.'
    },
    {
      question: 'Can my salary be reduced without consent?',
      answer: 'No, salary reduction requires consent. Salary = fundamental term of employment contract (cannot be changed unilaterally). Employer reducing salary without consent: breach of contract, constructive dismissal (employee can resign and claim compensation), labour law violation. Valid salary reduction: mutual written agreement (employee consents), economic hardship (with proper consultation + agreement), alternative to redundancy (negotiated). Employee options if employer imposes reduction: refuse reduction (maintain contract terms), file labour complaint (claim breach), resign and claim constructive dismissal, negotiate alternative arrangements. Employer must: consult employee first, explain reasons (business downturn, restructuring), seek agreement, document consent in writing. Exception: salary paid above statutory minimum can be reduced to minimum (but still requires process).'
    },
    {
      question: 'What should be in the termination clause?',
      answer: 'Comprehensive termination clause includes: 1. Notice periods (state statutory minimums: 1 week to 1 month based on service), 2. Valid termination grounds (redundancy, misconduct, poor performance, incapacity), 3. Disciplinary procedure (warnings, investigation, hearing, appeal), 4. Payment in lieu option (employer can pay instead of working notice), 5. Final settlement (salary, leave, dues calculation), 6. Return of property (company assets, documents, equipment), 7. Resignation procedure (employee notice requirements), 8. Restrictive covenants (non-compete, non-solicitation if applicable). Must comply with: Employment Act minimums, fair procedure requirements, natural justice principles. Invalid clauses: termination without notice (except gross misconduct), waiver of statutory rights, automatic termination for pregnancy/illness. Best practice: clearly state procedure, fair and reasonable, document all terminations in writing.'
    },
    {
      question: 'How do I modify an existing employment contract?',
      answer: 'Contract modification process: 1. Discuss change with other party (employer/employee), 2. Negotiate terms (ensure mutual benefit or necessity), 3. Draft written amendment (clearly state changes), 4. Both parties sign amendment (dated signature), 5. Attach to original contract (maintains record), 6. Provide copy to employee (mandatory). Common modifications: salary increase, job title change, duties expansion, location transfer, working hours adjustment. Requirements: mutual consent (cannot be forced), written documentation (verbal changes hard to prove), consideration (something of value for both sides). Employee refusing modification: employer cannot impose changes, options: maintain current terms, negotiate alternative, redundancy if position eliminated (with proper process). Employer unilaterally changing: breach of contract, employee can file complaint, claim constructive dismissal. Best practice: review and update contracts periodically, document all changes, ensure compliance with law.'
    },
    {
      question: 'What happens when fixed-term contract expires?',
      answer: 'Natural expiry: contract ends on stated date (no notice required from either party). Final settlement: employer pays: final month salary, accrued unused leave (cash equivalent), any outstanding dues. No redundancy pay: natural expiry not redundancy (unless employer immediately hires replacement for same role = deemed unfair). Renewal options: employer can offer renewal (new contract), employee can accept or decline, renewal terms negotiated. Third renewal rule: after 3 consecutive fixed-term contracts = automatically becomes permanent employment (cannot renew 4th time as fixed-term). Early termination: before expiry date requires: valid reason, statutory notice, same process as permanent employment. Employee rights: same termination protections if ended early, service certificate (proof of employment), reference letter (if requested). Common mistakes: employer treating expiry as redundancy (unnecessary), not paying accrued leave, immediately rehiring for same role (deemed unfair termination).'
    }
  ];

  // Contract types table
  const contractTypes = [
    {
      type: 'Permanent/Indefinite',
      duration: 'No end date',
      security: 'Highest job security',
      termination: 'Notice + valid reason required',
      benefits: 'Full benefits (medical, leave, pension)',
      use: 'Long-term employment, core staff'
    },
    {
      type: 'Fixed-term',
      duration: 'Specific end date (e.g., 1 year)',
      security: 'Limited to contract period',
      termination: 'Expires naturally or early termination with notice',
      benefits: 'Pro-rata benefits',
      use: 'Projects, seasonal work, temporary needs'
    },
    {
      type: 'Casual/Part-time',
      duration: 'Ongoing but limited hours',
      security: 'Low security',
      termination: 'Short notice (1-7 days)',
      benefits: 'Proportional to hours worked',
      use: 'Hourly work, flexible staffing'
    },
    {
      type: 'Probationary',
      duration: 'Max 6 months trial',
      security: 'Probation only',
      termination: '7 days notice for either party',
      benefits: 'Full statutory rights',
      use: 'Assessment period before permanent confirmation'
    }
  ];

  // Essential clauses table
  const essentialClauses = [
    {
      clause: 'Parties & Start Date',
      description: 'Names of employer and employee, employment start date',
      legal: 'Employment Act Section 10(1)',
      sample: '"This agreement is between [Company Name] and [Employee Name], effective [Date]"'
    },
    {
      clause: 'Job Title & Duties',
      description: 'Position, responsibilities, reporting structure',
      legal: 'Employment Act Section 10(2)',
      sample: '"Employee shall serve as [Title], reporting to [Manager], with duties including..."'
    },
    {
      clause: 'Probation Period',
      description: 'Trial period duration (max 6 months), confirmation terms',
      legal: 'Employment Act Section 10(3)',
      sample: '"Employee subject to 6-month probation, confirmable upon satisfactory performance"'
    },
    {
      clause: 'Salary & Benefits',
      description: 'Gross salary, payment frequency, allowances, deductions',
      legal: 'Employment Act Section 10(4)',
      sample: '"Gross salary KES [Amount]/month, payable on last working day, subject to statutory deductions"'
    },
    {
      clause: 'Working Hours',
      description: 'Daily/weekly hours, start/end times, breaks',
      legal: 'Employment Act Section 27',
      sample: '"Working hours: Monday-Friday 8am-5pm (45 hours/week), 1-hour lunch break"'
    },
    {
      clause: 'Leave Entitlements',
      description: 'Annual (21 days), sick (7+7 days), maternity/paternity',
      legal: 'Employment Act Sections 28-30',
      sample: '"Employee entitled to 21 working days annual leave, 7 days sick leave (full pay) + 7 days (half pay)"'
    },
    {
      clause: 'Notice Period',
      description: 'Termination notice based on service length',
      legal: 'Employment Act Section 35',
      sample: '"Either party may terminate with [X weeks] notice or payment in lieu"'
    },
    {
      clause: 'Termination Grounds',
      description: 'Valid reasons for dismissal, disciplinary procedure',
      legal: 'Employment Act Sections 41-47',
      sample: '"Termination permissible for: redundancy, misconduct (after hearing), poor performance (after warnings)"'
    }
  ];

  // Drafting steps
  const draftingSteps = [
    {
      number: 1,
      title: 'Determine Contract Type',
      description: 'Decide: permanent (long-term staff), fixed-term (project/seasonal), casual (hourly), probationary (trial period). Consider: business needs, budget, job nature, duration. Match type to role (avoid using fixed-term for permanent roles to evade obligations). Document rationale (justify business need for contract type).'
    },
    {
      number: 2,
      title: 'Research Legal Requirements',
      description: 'Review Employment Act 2007 (mandatory clauses). Check sector-specific laws (agriculture, domestic workers have special rules). Verify minimum wage (varies by location/industry). Confirm leave entitlements (statutory minimums: 21 days annual, 7+7 sick, 3 months maternity). Understand termination procedures (notice periods, fair process).'
    },
    {
      number: 3,
      title: 'Draft Contract Using Template',
      description: 'Obtain template: Ministry of Labour website, FKE, legal websites, lawyer (costs KES 5,000-20,000). Customize template: insert company details, employee information, job-specific duties, salary and benefits, industry clauses. Do not use generic template as-is (customize to your situation). Ensure compliance with statutory minimums.'
    },
    {
      number: 4,
      title: 'Include All Mandatory Clauses',
      description: 'Add required clauses: 1. Parties and start date, 2. Job title and duties, 3. Probation (if applicable, max 6 months), 4. Salary and payment terms, 5. Working hours, 6. Leave entitlements, 7. Notice period, 8. Termination grounds and procedure. Verify each clause complies with Employment Act.'
    },
    {
      number: 5,
      title: 'Add Optional But Recommended Clauses',
      description: 'Include: Confidentiality (protect business information), Intellectual property (work product ownership), Non-compete (if reasonable and necessary), Disciplinary procedure (warnings, hearings, appeals), Grievance mechanism (employee complaint process), Code of conduct (workplace behavior expectations). Ensure clauses reasonable and enforceable.'
    },
    {
      number: 6,
      title: 'Review for Compliance',
      description: 'Check contract against checklist: all mandatory clauses present, statutory minimums met or exceeded, no void/unenforceable provisions (below legal minimums), clear and unambiguous language, fair and reasonable terms. Cross-reference Employment Act 2007. Consider legal review (lawyer costs KES 5,000-20,000 but ensures compliance).'
    },
    {
      number: 7,
      title: 'Discuss Contract with Employee',
      description: 'Provide draft contract before start date (give employee time to review). Explain key terms: job duties, salary, working hours, leave, termination. Answer employee questions (clarify ambiguities). Negotiate terms if necessary (salary, benefits, duties). Allow employee to seek legal advice if desired (do not pressure immediate signing).'
    },
    {
      number: 8,
      title: 'Sign and Execute Contract',
      description: 'Both parties sign contract (dated signatures). Witness signatures (optional but recommended for formality). Employee receives original signed copy (mandatory). Employer retains copy in employee file (5-year retention required). Contract effective from start date stated. Add to employee personnel file immediately.'
    },
    {
      number: 9,
      title: 'Register and Onboard Employee',
      description: 'Register for statutory deductions: PAYE (income tax), NHIF (health insurance), NSSF (pension). Add to payroll system. Conduct orientation (workplace policies, safety, reporting structure). Issue employee ID badge and equipment. Commence probation period (if applicable). Schedule regular check-ins during probation.'
    },
    {
      number: 10,
      title: 'Maintain and Update Contract',
      description: 'Review contract periodically (annual review recommended). Update for changes: promotions, salary increases, duty changes, location transfers. Document all amendments in writing (signed by both parties). Keep current version in employee file. Archive previous versions (maintains history). Ensure ongoing compliance with evolving labour laws.'
    }
  ];

  // Common mistakes
  const commonMistakes = [
    {
      mistake: 'No written contract',
      risk: 'Labour law violation, difficulty proving terms, employee entitled to statutory rights anyway',
      fix: 'Provide written contract within 3 months (preferably before start date). Use template, customize, sign.'
    },
    {
      mistake: 'Contract terms below statutory minimums',
      risk: 'Clauses void/unenforceable, employee entitled to statutory minimums, labour complaint possible',
      fix: 'Verify all terms meet or exceed Employment Act minimums (wage, leave, notice, hours). Review against checklist.'
    },
    {
      mistake: 'Probation exceeding 6 months',
      risk: 'Employment deemed permanent after 6 months, extended probation invalid without consent',
      fix: 'Maximum 6 months probation. If extension needed: written agreement with employee. Confirm or terminate within 6 months.'
    },
    {
      mistake: 'Vague job duties',
      risk: 'Disputes over responsibilities, difficulty managing performance, unfair termination claims',
      fix: 'Clearly define job title, key responsibilities, reporting structure. Be specific (not "other duties as assigned").'
    },
    {
      mistake: 'No termination procedure',
      risk: 'Unfair termination claims, procedural violations, compensation liability (up to 12 months salary)',
      fix: 'Include clear termination clause: notice periods, valid grounds, disciplinary process, appeal mechanism. Follow procedure strictly.'
    },
    {
      mistake: 'Unreasonable restrictive covenants',
      risk: 'Clauses unenforceable, legal costs defending unenforceable terms, employee relations damage',
      fix: 'Non-compete/confidentiality must be: reasonable duration (max 2 years), limited geography, protects legitimate business interest. Seek legal advice.'
    },
    {
      mistake: 'Not providing employee copy',
      risk: 'Labour law violation, employee can claim never received contract, compliance issues',
      fix: 'Give employee original signed copy immediately. Obtain employee signature acknowledging receipt. Keep proof.'
    },
    {
      mistake: 'Changing contract without consent',
      risk: 'Breach of contract, constructive dismissal claims, labour dispute, compensation liability',
      fix: 'Any changes require: discussion, mutual agreement, written amendment (signed by both parties). Cannot impose unilaterally.'
    }
  ];

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'legal-requirements', 'contract-types', 'key-clauses', 'drafting-guide', 'templates', 'common-mistakes', 'employee-rights', 'modification', 'faqs'];
      
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
        <title>Employment Contracts Kenya – Templates Clauses Legal Guide 2026</title>
        <meta name="description" content="Complete guide to employment contracts in Kenya. Templates, mandatory clauses, probation, termination, and legal requirements under Employment Act 2007." />
        <link rel="canonical" href="https://yoursite.com/employment-contracts-kenya" />
        
        {/* OpenGraph */}
        <meta property="og:title" content="Employment Contracts Kenya – Templates & Legal Guide 2026" />
        <meta property="og:description" content="Draft compliant employment agreements. Essential clauses, probation, termination, templates, and legal obligations under Kenyan law." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://yoursite.com/employment-contracts-kenya" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1450101499163-c8917566f860?w=1200&h=630&fit=crop" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Employment Contracts Kenya – Templates & Legal Guide 2026" />
        <meta name="twitter:description" content="Employment contract templates, clauses, probation, termination, and compliance with Employment Act 2007." />
        <meta name="twitter:image" content="https://images.unsplash.com/photo-1450101499163-c8917566f860?w=1200&h=630&fit=crop" />
        
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
            "description": "Employment contract guidance and templates for Kenya"
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
                "name": "Employment Contracts",
                "item": "https://yoursite.com/employment-contracts-kenya"
              }
            ]
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Draft an Employment Contract in Kenya",
            "description": "Step-by-step guide to creating compliant employment contracts",
            "step": draftingSteps.map(step => ({
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
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">Employment Contracts in Kenya – Templates, Clauses & Legal Guide 2026</h1>
            </div>
            <p className="text-blue-100 text-lg max-w-3xl">Complete guide to drafting compliant employment contracts. Learn mandatory clauses, probation periods, termination terms, and download free templates under Employment Act 2007.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#templates" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 flex items-center gap-2">
                <Download className="w-5 h-5" />
                Download Templates
              </a>
              <a href="#drafting-guide" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
                Drafting Guide <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:block sticky top-0 bg-white shadow-md z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex gap-2 overflow-x-auto">
              {['overview', 'legal-requirements', 'contract-types', 'key-clauses', 'drafting-guide', 'templates', 'common-mistakes', 'employee-rights', 'modification', 'faqs'].map((section) => (
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
                  {section === 'overview' ? 'Overview' : section === 'legal-requirements' ? 'Legal Req' : section === 'contract-types' ? 'Types' : section === 'key-clauses' ? 'Clauses' : section === 'drafting-guide' ? 'Drafting' : section === 'templates' ? 'Templates' : section === 'common-mistakes' ? 'Mistakes' : section === 'employee-rights' ? 'Rights' : section === 'modification' ? 'Modify' : 'FAQs'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden sticky top-0 bg-white shadow-md z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {['overview', 'contract-types', 'key-clauses', 'drafting-guide', 'templates', 'faqs'].map((section) => (
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
                  {section === 'overview' ? 'Overview' : section === 'contract-types' ? 'Types' : section === 'key-clauses' ? 'Clauses' : section === 'drafting-guide' ? 'Guide' : section === 'templates' ? 'Templates' : 'FAQs'}
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
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What is an Employment Contract</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">An employment contract is a legally binding agreement between employer and employee defining the terms and conditions of employment. In Kenya, written contracts are mandatory under the Employment Act 2007.</p>

              <img 
                src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&h=400&q=80"
                alt="Employment contract signing and legal agreement in Kenya"
                className="rounded-lg shadow-lg w-full mb-6"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">✓ Purpose of Employment Contract</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Legal protection for both parties</li>
                    <li>• Clarifies job duties and expectations</li>
                    <li>• Defines salary and benefits</li>
                    <li>• Establishes termination procedures</li>
                    <li>• Evidence in labour disputes</li>
                  </ul>
                </div>

                <div className="bg-green-50 border-l-4 border-green-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">📋 Contract Requirements</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Written form (within 3 months of start)</li>
                    <li>• Signed by both parties</li>
                    <li>• Employee receives copy</li>
                    <li>• Contains all mandatory clauses</li>
                    <li>• Complies with Employment Act 2007</li>
                  </ul>
                </div>
              </div>

              <p className="text-gray-700 mb-4"><strong>Key principle:</strong> Contract establishes mutual rights and obligations. Employer cannot change terms unilaterally. Employee protected by statutory minimums even if contract is silent or provides less.</p>
            </div>
          </section>

          {/* Legal Requirements */}
          <section id="legal-requirements" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Legal Requirements in Kenya (Employment Act 2007)</h2>
            </div>

            <div className="prose max-w-none">
              <div className="space-y-4 mb-6">
                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Employment Act 2007 Section 10: Written Contract Mandatory</h4>
                  <p className="text-gray-700 text-sm">Employer MUST provide written employment contract within 3 months of employment start. Contract must be: in writing (not verbal), signed by both parties, copy given to employee. Failure to provide written contract: labour law violation, employer liable for penalties (KES 10,000-50,000), employee still entitled to statutory rights. Best practice: provide contract before employee starts work (shows professionalism, prevents disputes).</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Mandatory Contract Contents</h4>
                  <p className="text-gray-700 text-sm">Contract must include (Employment Act Section 10): 1. Names of employer and employee, 2. Job title and description, 3. Start date and contract type, 4. Probation period (if any, max 6 months), 5. Salary/wage and payment frequency, 6. Working hours and days, 7. Leave entitlements (annual, sick, maternity), 8. Notice period for termination, 9. Termination grounds. Missing any mandatory clause: contract incomplete, employer at risk in disputes.</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Statutory Minimums Cannot Be Reduced</h4>
                  <p className="text-gray-700 text-sm">Contract terms MUST meet or exceed statutory minimums: Minimum wage (varies by sector/location), 21 working days annual leave, 7+7 days sick leave, 3 months maternity leave, Maximum 6 months probation, Statutory notice periods (1 week to 1 month). Contract providing less: clause void/unenforceable (statutory minimum applies). Example: contract giving 14 days annual leave = invalid (21 days applies by law).</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Sector-Specific Regulations</h4>
                  <p className="text-gray-700 text-sm">Some sectors have additional requirements: Domestic workers: Wage Order 2022 (minimum wage, housing, food), Agricultural workers: special wage rates and leave provisions, Security guards: Security Industry Act regulations, Export Processing Zones: EPZ Act provisions. Employers must: research sector-specific laws, comply with additional requirements, include in contracts where applicable.</p>
                </div>
              </div>

              <div className="bg-red-50 border-l-4 border-red-600 p-5 rounded-lg">
                <p className="text-gray-700 text-sm"><strong>⚠️ Consequences of Non-Compliance:</strong> Labour Office penalties (KES 10,000-50,000), Employee labour complaint (can claim statutory rights), Unfair termination liability (compensation up to 12 months salary), Difficulty defending disputes (no written proof of terms). Prevention: provide written contract on time, include all mandatory clauses, ensure statutory minimums met.</p>
              </div>
            </div>
          </section>

          {/* Contract Types */}
          <section id="contract-types" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Types of Employment Contracts</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Four main contract types in Kenya, each with different characteristics:</p>

              <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto mb-6">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Type</th>
                      <th className="px-4 py-3 text-left font-semibold">Duration</th>
                      <th className="px-4 py-3 text-left font-semibold">Job Security</th>
                      <th className="px-4 py-3 text-left font-semibold">Termination</th>
                      <th className="px-4 py-3 text-left font-semibold">When to Use</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {contractTypes.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                        <td className="px-4 py-3 font-semibold text-gray-900 text-sm">{item.type}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.duration}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.security}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.termination}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.use}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">Permanent/Indefinite Employment</h4>
                  <p className="text-gray-700 text-sm">Most common type. No end date (continues until terminated). Highest job security (employer must have valid reason + follow procedure to terminate). Full benefits (medical, leave, pension). Notice period based on service length (1 week to 1 month). Use for: core staff, long-term positions, stable business needs. Employee preference: most sought after (stability, benefits, career growth).</p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">Fixed-term Contract</h4>
                  <p className="text-gray-700 text-sm">Specific end date (e.g., 1-year contract for project). Expires naturally at end (no notice if expires on stated date). Renewal possible but limited (max 3 consecutive renewals → becomes permanent). Pro-rata benefits. Use for: temporary projects (construction, events), seasonal work (agriculture, tourism), maternity cover, consultancy. Caution: cannot use to evade permanent employment obligations (courts will convert if abused).</p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">Casual/Part-time Employment</h4>
                  <p className="text-gray-700 text-sm">Hourly or daily work. Limited hours per week (under 40 hours typically). Low job security (short notice termination). Proportional benefits (pro-rata leave, statutory deductions). Use for: flexible staffing, peak periods, cost control. Employee rights: still entitled to statutory protections (minimum wage, safe workplace, no discrimination). Cannot disguise permanent employment as casual (continuous work = deemed permanent).</p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">Probationary Employment</h4>
                  <p className="text-gray-700 text-sm">Trial period (max 6 months). Assesses employee suitability before permanent confirmation. Employee entitled to ALL statutory rights (not reduced protections). Only difference: shorter notice (7 days for either party). After probation: employer confirms (permanent) OR terminates (with notice + valid reason). Use for: new hires in critical roles, skills assessment, cultural fit evaluation. Cannot be extended indefinitely (max 6 months unless mutual written agreement).</p>
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-600 p-5 rounded-lg">
                <p className="text-gray-700 text-sm"><strong>Choice of contract type:</strong> Should match business need genuinely. Cannot use fixed-term/casual to avoid permanent employment obligations. Misclassification: employee can claim permanent status if working continuously, courts may reclassify contract, employer liable for benefits/compensation. Choose wisely and document rationale.</p>
              </div>
            </div>
          </section>

          {/* Key Clauses */}
          <section id="key-clauses" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Key Clauses in Employment Contracts</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Essential clauses every employment contract must contain:</p>

              <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto mb-6">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Clause</th>
                      <th className="px-4 py-3 text-left font-semibold">Description</th>
                      <th className="px-4 py-3 text-left font-semibold">Legal Basis</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {essentialClauses.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 font-semibold text-gray-900 text-sm">{item.clause}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.description}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.legal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-white border-l-4 border-green-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Optional But Recommended Clauses</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• <strong>Confidentiality:</strong> Protects business information, trade secrets, client lists (must be reasonable)</li>
                    <li>• <strong>Intellectual Property:</strong> Clarifies ownership of work product created during employment</li>
                    <li>• <strong>Non-compete:</strong> Restricts working for competitors post-employment (max 2 years, limited geography)</li>
                    <li>• <strong>Non-solicitation:</strong> Prevents poaching clients/employees after leaving</li>
                    <li>• <strong>Code of Conduct:</strong> Workplace behavior expectations, ethics, dress code</li>
                    <li>• <strong>Disciplinary Procedure:</strong> Warnings, investigations, hearings, appeals process</li>
                    <li>• <strong>Grievance Mechanism:</strong> Employee complaint procedure, escalation steps</li>
                  </ul>
                </div>

                <div className="bg-white border-l-4 border-green-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Clause Drafting Tips</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Use clear, plain language (avoid legal jargon)</li>
                    <li>• Be specific (not vague generalities)</li>
                    <li>• Ensure compliance with statutory minimums</li>
                    <li>• Make clauses fair and reasonable (courts will void unreasonable terms)</li>
                    <li>• Customize to job role (not generic template language)</li>
                    <li>• Define key terms (what is "confidential," "gross misconduct," etc.)</li>
                    <li>• Consistent formatting (numbering, headings, structure)</li>
                  </ul>
                </div>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-600 p-5 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">⚠️ Clauses to Avoid</h4>
                <p className="text-gray-700 text-sm">Do not include: Waiver of statutory rights (void), Terms below legal minimums (unenforceable), Discriminatory provisions (illegal), Unreasonable restrictive covenants (unenforceable), Penalty clauses (punitive damages for breach - illegal), Unlimited employer discretion (unfair, creates imbalance). Courts will strike down void/unreasonable clauses while maintaining valid portions of contract.</p>
              </div>
            </div>
          </section>

          {/* Drafting Guide */}
          <section id="drafting-guide" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <Users className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Drafting a Compliant Employment Contract (Step-by-Step)</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Complete process from planning to execution:</p>

              <div className="space-y-4">
                {draftingSteps.map((step) => (
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

              <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg mt-6">
                <h4 className="font-bold text-gray-900 mb-2">💡 Drafting Best Practices</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Start with template (Ministry of Labour, FKE, lawyer) but customize</li>
                  <li>• Include ALL mandatory clauses (Employment Act Section 10)</li>
                  <li>• Verify statutory minimums met or exceeded</li>
                  <li>• Use clear, unambiguous language (avoid legal jargon)</li>
                  <li>• Tailor to specific job and industry</li>
                  <li>• Review by legal professional (costs KES 5,000-20,000 but ensures compliance)</li>
                  <li>• Discuss with employee before signing (transparency builds trust)</li>
                  <li>• Keep copy in employee file (5-year retention mandatory)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Templates */}
          <section id="templates" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <Download className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Sample Employment Contract Templates</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Free template sources and customization guidance:</p>

              <div className="space-y-4 mb-6">
                <div className="bg-white border-l-4 border-blue-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">✓ Official Government Templates</h4>
                  <p className="text-gray-700 text-sm"><strong>Ministry of Labour & Social Protection:</strong> Free templates on website (labour.go.ke). Covers: permanent employment, fixed-term, casual. Compliant with Employment Act 2007. Download format: Word/PDF. Customization required: insert specific details (names, salary, duties).</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">✓ Federation of Kenya Employers (FKE)</h4>
                  <p className="text-gray-700 text-sm">Membership-based templates. More comprehensive than government versions. Includes: sector-specific templates, explanatory notes, legal updates. Cost: FKE membership (varies by company size). Access: members portal, annual subscription.</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">✓ Legal Websites & Law Firms</h4>
                  <p className="text-gray-700 text-sm">Free basic templates on legal information sites. Paid premium templates (more detailed). Law firm templates: typically part of legal service package. Cost: FREE to KES 5,000+ for premium. Quality varies: verify compliance before use.</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">✓ Template Customization Checklist</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>✓ Insert correct employer and employee names</li>
                    <li>✓ Specify exact job title and detailed duties</li>
                    <li>✓ State precise start date and contract type</li>
                    <li>✓ Define probation period (if applicable, max 6 months)</li>
                    <li>✓ Confirm gross salary and payment frequency</li>
                    <li>✓ Detail working hours and days</li>
                    <li>✓ List all leave entitlements (annual, sick, maternity)</li>
                    <li>✓ Specify notice period based on intended service length</li>
                    <li>✓ Add company-specific policies (dress code, conduct)</li>
                    <li>✓ Include any sector-specific clauses (if applicable)</li>
                    <li>✓ Review entire contract for accuracy and compliance</li>
                  </ul>
                </div>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-600 p-5 rounded-lg mb-6">
                <h4 className="font-bold text-gray-900 mb-2">⚠️ Template Usage Warning</h4>
                <p className="text-gray-700 text-sm">Do NOT use template as-is without customization. Generic templates: may not fit your specific situation, may contain outdated provisions, may not cover industry-specific requirements. Employer responsibility: ensure contract complies with current law, template provider not liable for your usage, legal review recommended (small cost vs potential disputes). Treat template as starting point, not final product.</p>
              </div>

              <div className="bg-green-50 border-l-4 border-green-600 p-5 rounded-lg">
                <p className="text-gray-700 text-sm"><strong>💡 Pro tip:</strong> Download multiple templates, compare clauses, take best elements from each, combine into comprehensive contract customized to your needs. Legal review (KES 5,000-20,000) ensures compliance and saves future disputes.</p>
              </div>
            </div>
          </section>

          {/* Common Mistakes */}
          <section id="common-mistakes" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Common Mistakes Employers Make</h2>
            </div>

            <div className="prose max-w-none">
              <div className="space-y-3">
                {commonMistakes.map((item, index) => (
                  <div key={index} className="bg-white border-l-4 border-red-600 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-1 flex items-start gap-2">
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      {item.mistake}
                    </h4>
                    <p className="text-red-700 text-sm mb-1"><strong>Risk:</strong> {item.risk}</p>
                    <p className="text-gray-700 text-sm"><strong>✓ Fix:</strong> {item.fix}</p>
                  </div>
                ))}
              </div>

              <div className="bg-green-50 border-l-4 border-green-600 p-5 rounded-lg mt-6">
                <p className="text-gray-700 text-sm"><strong>Prevention strategy:</strong> Use compliance checklist before signing every contract. Verify all mandatory clauses present. Ensure statutory minimums met. Review by HR professional or lawyer. Invest in compliance upfront (saves costly disputes later). Keep contract templates updated as laws change.</p>
              </div>
            </div>
          </section>

          {/* Employee Rights */}
          <section id="employee-rights" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Employee Rights in Employment Contracts</h2>
            </div>

            <div className="prose max-w-none">
              <div className="space-y-4 mb-6">
                <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">✓ Right to Written Contract</h4>
                  <p className="text-gray-700 text-sm">Employee entitled to written contract within 3 months of employment start. Employer must: provide contract in language employee understands, explain all terms clearly, give employee time to review (do not pressure immediate signing), provide signed copy to employee. Employee without contract: still entitled to ALL statutory rights, can file labour complaint, can demand contract provision. Working without written contract still creates employment relationship (all protections apply).</p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">✓ Right to Fair Contract Terms</h4>
                  <p className="text-gray-700 text-sm">Contract must: meet statutory minimums (wage, leave, notice, hours), be reasonable and fair (not one-sided), comply with Employment Act 2007, not discriminate (equal terms regardless of gender, tribe, religion). Unfair terms: void/unenforceable (statutory rights prevail). Employee can: challenge unfair clauses, negotiate before signing, seek legal advice, file complaint if rights violated. Courts will strike down unreasonable terms.</p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">✓ Right to Contract Clarity</h4>
                  <p className="text-gray-700 text-sm">Employee entitled to understand all contract terms. Employer must: explain contract in plain language, answer employee questions, allow time to review (minimum 24 hours recommended), provide translation if employee doesn't read English/Swahili. Ambiguous contract: interpreted in favor of employee (contra proferentem rule - against drafter). Unfair surprise terms: may be void. Employee should: read entire contract carefully, ask for clarification, not sign under pressure, keep copy for reference.</p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">✓ Right to Refuse Unreasonable Terms</h4>
                  <p className="text-gray-700 text-sm">Employee can: refuse to sign unreasonable contract, negotiate better terms, walk away if terms unacceptable, seek legal advice before signing. Employer cannot: force employee to sign, threaten withdrawal of job offer for reasonable questions, impose unconscionable terms. Red flags: below minimum wage, excessive probation (over 6 months), unreasonable non-compete (too long/broad), waiver of statutory rights, no termination protection. If in doubt: consult lawyer (costs KES 5,000-10,000 for contract review).</p>
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-600 p-5 rounded-lg">
                <p className="text-gray-700 text-sm"><strong>Employee action plan:</strong> Request contract in writing (before starting work ideally). Read thoroughly (every clause matters). Highlight concerns or unclear terms. Ask employer to explain or amend. Negotiate if needed (salary, benefits, duties). Seek legal review if complex terms (non-compete, IP). Sign only when satisfied. Keep copy in safe place (reference for entire employment).</p>
              </div>
            </div>
          </section>

          {/* Modification */}
          <section id="modification" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <Building2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How to Modify or Terminate a Contract Legally</h2>
            </div>

            <div className="prose max-w-none">
              <div className="space-y-4 mb-6">
                <div className="bg-white border-l-4 border-blue-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">Contract Modification Process</h4>
                  <p className="text-gray-700 text-sm"><strong>Step 1:</strong> Identify need for change (promotion, salary adjustment, duty expansion, location transfer). <strong>Step 2:</strong> Discuss with other party (employer/employee). <strong>Step 3:</strong> Negotiate terms (ensure mutual benefit or necessity). <strong>Step 4:</strong> Draft written amendment (clearly state changes to specific clauses). <strong>Step 5:</strong> Both parties sign amendment (dated signatures). <strong>Step 6:</strong> Attach to original contract (maintains complete record). <strong>Step 7:</strong> Provide copy to employee (mandatory). Cannot modify unilaterally: requires mutual consent, written documentation, consideration (something of value exchanged).</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">Contract Termination Procedures</h4>
                  <p className="text-gray-700 text-sm"><strong>By Employee (Resignation):</strong> Give statutory notice (1 week to 1 month based on service length), written resignation letter (state last working day), employer can waive notice (allow immediate departure), serve notice working OR negotiate payment in lieu. <strong>By Employer (Termination):</strong> Must have valid reason (redundancy, misconduct, poor performance, incapacity), follow fair procedure (investigation, hearing if misconduct), give statutory notice or payment in lieu, calculate final settlement (salary + leave + dues), issue termination documents (service certificate). Mutual agreement: both parties can agree to end contract (written agreement recommended).</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">Final Settlement Upon Termination</h4>
                  <p className="text-gray-700 text-sm">Employer must pay within reasonable time (typically last working day or next payday): Final month salary (prorated to last day), Accrued unused leave (cash equivalent at current salary rate), Outstanding allowances or reimbursements, Notice pay if payment in lieu, Redundancy pay (if applicable: 15 days per year worked). Deductions allowed: Loans (if agreed in contract), Damages for loss (if proven), Outstanding advances. Return of property: company equipment, ID badge, documents, keys. Issue documents: service certificate (proof of employment), tax clearance (if requested), reference letter (if requested).</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">Avoiding Wrongful Termination</h4>
                  <p className="text-gray-700 text-sm">Employer must NOT terminate for: Discrimination (tribe, gender, religion, disability, pregnancy), Retaliation (whistleblowing, union membership, filing complaint), Without valid reason (arbitrary dismissal), Without notice (except gross misconduct), Without fair procedure (no investigation/hearing). Wrongful termination consequences: Employee can file labour complaint within 60 days, Claim compensation (up to 12 months salary), Reinstatement possible (if employee wants job back), Damages for distress and loss. Employer best practice: document performance/conduct issues, follow disciplinary procedure strictly, keep detailed records, seek legal advice before terminating.</p>
                </div>
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
              <h2 className="text-2xl font-bold mb-4">Need Help with Employment Contracts?</h2>
              <p className="text-blue-100 mb-6">Whether you're drafting your first contract or reviewing an existing one, get professional guidance to ensure full compliance.</p>
              
              <div className="flex flex-wrap gap-3">
                <a href="#templates" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Download Templates
                </a>
                <a href="/kenya-employment-labour-laws" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
                  Labour Laws Guide <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </section>

          {/* Internal Links */}
          <section className="mt-12 pt-8 border-t-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Related Employment & Business Compliance Guides</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <a href="/kenya-employment-labour-laws" className="p-4 border-2 border-blue-200 rounded-lg hover:shadow-lg transition-shadow hover:border-blue-600">
                <h4 className="font-bold text-gray-900 mb-1">Employment & Labour Laws</h4>
                <p className="text-gray-600 text-sm">Complete guide to employee and employer rights</p>
              </a>
              <a href="/business-permits-licenses-kenya" className="p-4 border-2 border-green-200 rounded-lg hover:shadow-lg transition-shadow hover:border-green-600">
                <h4 className="font-bold text-gray-900 mb-1">Business Permits & Licenses</h4>
                <p className="text-gray-600 text-sm">Get required business operating permits</p>
              </a>
              <a href="/company-annual-returns-and-filing-kenya" className="p-4 border-2 border-orange-200 rounded-lg hover:shadow-lg transition-shadow hover:border-orange-600">
                <h4 className="font-bold text-gray-900 mb-1">Company Annual Returns</h4>
                <p className="text-gray-600 text-sm">File CR12 and stay compliant</p>
              </a>
              <a href="/business-tax-obligations-kenya" className="p-4 border-2 border-purple-200 rounded-lg hover:shadow-lg transition-shadow hover:border-purple-600">
                <h4 className="font-bold text-gray-900 mb-1">Business Tax Obligations</h4>
                <p className="text-gray-600 text-sm">VAT, PAYE, and income tax compliance</p>
              </a>
              <a href="/how-to-register-business-kenya" className="p-4 border-2 border-red-200 rounded-lg hover:shadow-lg transition-shadow hover:border-red-600">
                <h4 className="font-bold text-gray-900 mb-1">Register Your Business</h4>
                <p className="text-gray-600 text-sm">Start your business legally in Kenya</p>
              </a>
              <a href="/limited-company-registration-kenya" className="p-4 border-2 border-indigo-200 rounded-lg hover:shadow-lg transition-shadow hover:border-indigo-600">
                <h4 className="font-bold text-gray-900 mb-1">Limited Company Registration</h4>
                <p className="text-gray-600 text-sm">Incorporate a limited company</p>
              </a>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default EmploymentContractsKenya;
