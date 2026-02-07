import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, FileText, Building2, AlertTriangle, BookOpen, Shield, Users, CheckCircle2, XCircle, Calculator, Clock } from 'lucide-react';

const TerminationRedundancySeveranceKenya = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // FAQ data
  const faqs = [
    {
      question: "What is the notice period for termination in Kenya?",
      answer: "Notice period depends on length of service (Employment Act Section 35): Less than 1 year: 1 week notice, 1-5 years: 2 weeks notice, 5-10 years: 4 weeks notice, Over 10 years: 1 month notice. Notice runs from date employer provides written notice (or verbal notice with written confirmation within 24 hours). Either party can terminate with notice (employer or employee resigns). Payment in lieu: employer can pay salary instead of notice period (employee leaves immediately without working notice). Exception: gross misconduct (theft, violence, fraud) = immediate termination without notice (but investigation still required, procedural fairness applies). Notice period: cannot be waived (employee has right to work notice period) unless both parties agree in writing (payment in lieu)."
    },
    {
      question: "What is severance pay and who is entitled?",
      answer: "Severance/redundancy pay: compensation for loss of job due to redundancy (business closure, downsizing, position elimination). Calculation: 15 working days salary per year of service (not subject to negotiation - statutory minimum). Example: 5 years service at KES 50,000/month = 75 days (15 x 5) = KES 125,000. Who entitled: permanent employees laid off due to redundancy, fixed-term employees whose contract is not renewed due to redundancy, all employees regardless of job level (from cleaners to managers). Not entitled: employees terminated for misconduct, poor performance (after warnings), resignation, incapacity (medical). Payment timing: within 7 days of termination date (or next payday). Payment method: lump sum (direct to employee account, not deductible). Employer obligation: failure to pay = breach of contract (employee can claim at Labour Office, interest applies)."
    },
    {
      question: "Can an employer terminate without notice?",
      answer: "Only for gross misconduct (Employment Act Section 40). Gross misconduct definition: serious breach of contract (theft, violence, fraud, drunkenness at work, willful insubordination, gross negligence causing loss). Requirements for fair termination: Investigation (proper investigation before decision), Hearing (employee right to explain/defend), Evidence (documented proof of misconduct), Proportionality (penalty fits misconduct). Procedure: 1. Investigate incident (get facts, interview witnesses), 2. Suspend pending investigation (if risk), 3. Hearing (present evidence to employee, allow response), 4. Decision (oral or written), 5. Immediate termination (if gross misconduct proven). Without proper procedure: even gross misconduct termination can be unfair (procedural unfairness = compensation claim). Burden of proof: employer proves gross misconduct occurred (balance of probabilities). Employee remedies if wrongfully dismissed: complaint to Labour Office, claim unfair termination compensation, possible reinstatement."
    },
    {
      question: "What is redundancy and how is it legally defined?",
      answer: "Redundancy: genuine business need eliminating job position (not performance or misconduct reason). Legal definition (Employment Act): position no longer necessary due to: Business closure (company shutting down), Restructuring (position eliminated), Technological change (machines replace workers), Relocating business (no jobs in new location), Economic downturn (cost-cutting). NOT redundancy: Replacing employee with someone cheaper (discriminatory termination), Refusing to promote (separate issue), Conflict with management (performance issue), Disliking employee (unfair dismissal, not redundancy). Redundancy process required: Consultation (inform employees about redundancy), Fair selection (objective criteria for who loses job - last in first out, performance, skills match new roles), Notice (statutory notice period applies), Severance pay (mandatory 15 days per year). Employer failure to follow procedure: unlawful redundancy claim, employee entitled to compensation. Employee remedies: Labour complaint, claim unfair dismissal (up to 12 months salary compensation)."
    },
    {
      question: "How is severance pay calculated?",
      answer: "Formula: 15 working days x number of years of service. Calculation steps: 1. Count years of service (from hire date to termination date, fractions counted), 2. Multiply by 15 days (statutory multiplier), 3. Calculate daily salary (gross monthly salary ÷ 22 working days), 4. Multiply days by daily salary. Example: Employee terminated after 3.5 years at KES 44,000/month: Daily salary = 44,000 ÷ 22 = KES 2,000. Severance = (3.5 x 15) x 2,000 = 52.5 days x 2,000 = KES 105,000. Timing fractions: 6 months = 0.5 years, 1 year 3 months = 1.25 years. What counts as salary: gross salary, basic + allowances (not bonuses). What doesn't count: commission, bonus, overtime (unless regular guaranteed part of salary). Payment: lump sum (not deductible from final salary, separate payment), within 7 days of termination. Employer obligation: calculate correctly, pay on time, provide calculation breakdown (employee has right to know)."
    },
    {
      question: "What happens if employer cannot pay severance immediately?",
      answer: "Employer must pay within 7 days of termination (Employment Act Section 35). If delayed: Employee can file complaint at Labour Office, Claim interest (typically 12% per annum from due date), Employer liable for non-compliance. Employee options: File Labour complaint immediately (do not wait), Seek Labour Office compliance order (forces payment), Pursue court action (if employer refuses Labour Office order). If employer bankrupt/insolvent: Employee becomes preferential creditor (priority over general creditors), Claim from available assets, Seek compensation from government gratuity fund (if exists - varies by sector). Documentation: request written acknowledgment of severance payment (receipt). Payment method: bank transfer (get confirmation), cash with receipt (witness), check (cleared before leaving). Safety: do not accept promise to pay later (get written agreement if delayed - includes interest clause). If employer refuses: escalate to Labour Commissioner (pressure mechanism), Report to County Labour Director (enforcement action)."
    },
    {
      question: "What are grounds for unfair dismissal in Kenya?",
      answer: "Unfair dismissal: dismissal without valid reason or without fair procedure. Invalid grounds (illegal dismissals): Discrimination (tribe, gender, religion, disability, pregnancy, HIV status, political views), Retaliation (filing complaint, union membership, whistleblowing, asserting rights), Pregnancy/maternity (terminating during pregnancy or maternity leave), Health/disability (terminating due to illness or disability without proper procedure), Trade union (terminating for union activities), Arbitrary dismissal (no reason given). Procedural unfairness: Termination without investigation (misconduct cases), No hearing (employee not allowed to respond), No warning (multiple offenses without progressive discipline), No reason (no explanation provided), Rushed decision (no time to prepare defense). Valid termination reasons (if proper procedure followed): Misconduct (after investigation, hearing, proportional penalty), Poor performance (after warnings, improvement opportunity, training), Redundancy (genuine business need, fair selection, consultation), Incapacity (medical, prolonged illness, inability to do job). Remedies for unfair dismissal: Reinstatement (get job back), Compensation (up to 12 months salary), Notice pay (if terminated without proper notice), Legal costs (if employer acted badly). Burden of proof: employer proves fair reason AND fair procedure (if either missing = unfair)."
    },
    {
      question: "Can an employee resign and still claim severance pay?",
      answer: "No, severance only for redundancy (not voluntary resignation). Legal distinction: Resignation (employee choice to leave) = no severance, Redundancy (employer-initiated due to business need) = severance pay. Exception: constructive dismissal (resigning due to employer breach = treated as termination). Constructive dismissal scenarios: Employer unilaterally reducing salary (without consent), Removing core job duties (changing role fundamentally), Harassment making work intolerable, Health & safety violations (unsafe working conditions), Non-payment of agreed benefits. Proving constructive dismissal: Employee must demonstrate: Clear breach by employer, Made objection (complained to employer first), Resigned in response (resignation linked to breach), Timely action (resigned soon after breach, not months later). Evidence required: Employment contract (showing agreed terms), Correspondence (email complaints to employer), Witness statements (colleagues present), Timeline (dates of breach and resignation). If constructive dismissal proven: Employee treated as terminated (entitled to severance, notice pay, compensation if unfair). Employer cannot argue you resigned (constructive dismissal overrides resignation status)."
    },
    {
      question: "What is the difference between notice and severance?",
      answer: "Notice period: Time given before termination takes effect (employer informs employee termination is coming). Severance/redundancy pay: One-time payment for job loss due to redundancy (statutory minimum 15 days per year worked). Key differences: Notice = advance warning (allows time to job search), Severance = payment compensation (loss of employment income). Timing: Notice runs from notification to termination date (1 week to 1 month depending on service), Severance paid on/after termination date (within 7 days). Payment: Notice = employer can say work out notice (continue working, get paid), OR payment in lieu (get salary but leave immediately). Severance = always a payment (non-negotiable amount). Can overlap: Employer terminates with notice (e.g., 2 weeks), Employee works out notice period, At end of notice = receives severance pay (separate). Can employer skip notice and pay in lieu? Yes, employer can pay notice salary (payment in lieu of notice), Employee must still receive severance (on top of notice payment). Example: 5-year employee, KES 50,000/month: Notice 2 weeks = KES 25,000, Severance (15 x 5 years) = KES 125,000, Total = KES 150,000 if employer pays in lieu of notice."
    },
    {
      question: "What must employers communicate before layoffs?",
      answer: "Legal requirement: Consultation before redundancy (Employment Act Section 39, Labour Relations Act). Consultation process: 1. Inform employees (layoffs coming, reason, timeline), 2. Share financial/business information (show genuine need for redundancy), 3. Discuss alternatives (redeployment, voluntary redundancy, wage reduction instead), 4. Consider employee suggestions (union/employees propose alternatives), 5. Fair selection (if not all jobs cut - clear selection criteria), 6. Notice (statutory notice period from consultation start). Timing: Consult in advance (minimum 30 days notice to employees recommended), Not at last minute (gives employees time to plan), Document consultation (keep records, emails, meeting minutes). What to communicate: Reason for redundancy (business downturn, restructuring, etc), Positions affected (which departments, how many jobs cut), Timeline (when layoffs effective, notice period), Severance/compensation (amount, calculation, payment timing), Support (counseling, job placement assistance, references), Alternatives considered (other options explored). Union/employee representation: If union exists = must negotiate redundancy terms (not just inform), Can propose alternatives (employer must consider in good faith). Communication failure: Unlawful redundancy claim, Employee entitled to compensation, Can claim unfair dismissal (even if redundancy genuine - procedure invalid). Documentation: Email, written notice, meeting minutes, signed acknowledgment (shows proper consultation)."
    },
    {
      question: "What severance pay does an employer owe during company closure?",
      answer: "Company closure: Automatic severance entitlement (all employees). Closure types: Voluntary winding up (owner decides to close), Forced liquidation (creditors force closure), Insolvency (company bankrupt). Severance obligations: All employees (permanent, fixed-term, casual - if worked continuously) = entitled to severance. Calculation: 15 working days per year of service (same formula as redundancy). Payment timing: Ideally within 7 days of closure (but company may have no funds). Priority creditor: Employees become preferred creditors (paid before general creditors from liquidation proceeds). If company has no funds: Employees may not recover full severance (depends on liquidation assets). Alternatives: Severance guarantee fund (if employer registered - some sectors have funds), Government assistance (varies by sector), Job search support (government employment services). Documentation required: Proof of employment (payslips, contract), Service period (hire date, last working day), Salary (for calculation). Legal action: If employer refuses/cannot pay = file claim at Labour Court (may recover from personal assets if owner deliberately defrauded). Employer caution: Plan closure to pay severance (legal obligation even in closure), Communicate early (gives employees time to find new jobs), Maintain records (proof of calculation and payment attempts)."
    },
    {
      question: "Can an employer reduce salary instead of making employees redundant?",
      answer: "Yes, but requires employee consent (cannot be imposed unilaterally). Alternatives to redundancy: Salary reduction (with written agreement from all employees), Working hours reduction (part-time instead of full-time), Voluntary redundancy (offer enhanced severance for volunteers), Unpaid leave (temporary cost-cutting measure), Job share (two employees share one role). Salary reduction process: Consult employees (explain business need, show financial situation), Propose reduction (specify new salary, temporary or permanent), Seek agreement (written consent from each employee - cannot pressure), Document (amendment to contract, signed by both parties), Implement (new salary from agreed date). Employee options if salary reduced: Accept reduction (sign amendment, continue employment), Reject reduction (treat as constructive dismissal = entitled to severance), Negotiate terms (counter-propose alternatives - hours reduction instead). Employee refusal: If employee refuses reduction and employer imposes it anyway = unfair treatment (employee can claim damages). Employer caution: Do not use salary reduction as disguised termination (reduce to zero salary = effectively terminated = must pay severance). Temporary vs permanent: If temporary = clearly state duration (e.g., 6 months), Employee not trapped indefinitely. Good faith negotiation: Employers should exhaust alternatives before redundancy (show good faith = strengthens legal position if challenged)."
    },
    {
      question: "What is a service certificate and when is it issued?",
      answer: "Service certificate: Official document from employer confirming employment details and service. Issued when: Termination (voluntary resignation or employer termination), Redundancy (with severance), Company closure. Content required: Employee name and ID number, Position held and job description, Dates of employment (hire date and last working day), Reason for termination (resignation, redundancy, end of contract), Salary/benefits during employment, Service length (years and months), Conduct record (if applicable), Employer contact for reference verification. Purpose: Evidence of employment (for benefit claims, loans, next employer), Service verification (for retirement benefits, insurance), Reference document (job searching, visa applications), Tax purposes (prove employment for tax records). Employee right: Can request at any time during or after employment (employer must provide within reasonable time). Employer obligation: Must issue (Employment Act requirement), Cannot refuse (even if dispute exists), Should be accurate (false information = liable). What NOT in certificate: Negative performance comments (unfair), Discriminatory statements (illegal), Unsubstantiated allegations (libelous). Verbal reference: Employer can give (should be honest, factual), Cannot make false statements (defamation liability). Best practice: Employee request in writing (email), Confirm details before final day, Keep multiple copies (safe, for future use)."
    },
    {
      question: "Can employer demand repayment of training costs upon termination?",
      answer: "Yes, but limited circumstances and must be in contract. Training repayment clause: Employer invests in employee training (external course, certification, MBA), Contract requires repayment if employee leaves within X years, Amount limited to actual training cost. Enforceability requirements: Clause in employment contract (employee knew/agreed before signing), Reasonable period (typically 2-3 years for major training), Proportional amount (cannot exceed actual cost), Clear calculation method. Limits on repayment: Cannot claim if employer terminates (redundancy, misconduct = employer decision), Cannot claim if constructive dismissal (employee forced to leave), Cannot claim if voluntary resignation after 3+ years (time limit expires), Proportional reduction (if 2-year training, 6-month tenure = claim only 25% of cost). Example: KES 200,000 professional course, 2-year repayment period: Employee leaves after 6 months = owes KES 150,000 (75% of remaining term remaining), Leaves after 1.5 years = owes KES 50,000 (25% of remaining term), Leaves after 2 years = owes nothing (term expired). Employee options: Negotiate repayment (especially if made redundant), Request employer reimburse from severance (employee liability reduced), Dispute enforceability (if clause unfair or not agreed). Employer caution: Clause must be clear and reasonable (overly punitive = unenforceable), Cannot recover if employee force left (by employer), Repayment demand must be within term period."
    },
    {
      question: "What happens to leave (annual, sick, maternity) upon termination?",
      answer: "Unused leave entitlements: Employee entitled to payment (cash equivalent at time of termination). Annual leave: Accrued days paid out (e.g., 21 days/year pro-rata, unused days = payment). Example: Worked 9 months, entitled 15.75 days annual leave = not taken any = get KES X,XXX payment. Sick leave: Varies (some employers pay, some don't), Check employment contract/policy. Maternity leave: Entitled if pregnant (cannot be denied), Cash not applicable (must be taken before resuming work), If dismissed during maternity = unfair (special protection). Calculation: Daily rate = monthly salary ÷ 22 working days, Accrued days x daily rate = leave payment amount. Payment timing: Part of final settlement (paid on/by termination date), Included in final payslip. What employer cannot do: Deny accrued leave payment, Force employee to take leave instead of pay, Deduct unauthorized amounts, Claim employee forfeited leave (illegal - leave is earned right). Example final settlement: Monthly salary KES 50,000, Worked 4 years (entitled 21 days annual), Used 15 days one year, Unused = 6 days, Payment = 6 x (50,000÷22) = KES 13,636. Plus severance + notice pay = total final settlement. Employee safeguard: Request written calculation (verify accuracy), Ensure payment on or before last day (not later), Keep payslips (proof of leave taken during service)."
    }
  ];

  // Notice periods table
  const noticePeriods = [
    {
      serviceLength: 'Less than 1 year',
      noticeRequired: '1 week',
      severanceEligible: 'No (min 1 year)',
      validReasons: 'Any reason (probation exceptions)'
    },
    {
      serviceLength: '1 to 5 years',
      noticeRequired: '2 weeks',
      severanceEligible: 'Yes - 15-75 days pay',
      validReasons: 'Redundancy, misconduct, poor performance'
    },
    {
      serviceLength: '5 to 10 years',
      noticeRequired: '4 weeks',
      severanceEligible: 'Yes - 75-150 days pay',
      validReasons: 'Redundancy, misconduct, poor performance'
    },
    {
      serviceLength: 'Over 10 years',
      noticeRequired: '1 month',
      severageEligible: 'Yes - 150+ days pay',
      validReasons: 'Redundancy, misconduct, poor performance'
    }
  ];

  // Severance calculation table
  const severanceCalculation = [
    {
      serviceYears: '1 year',
      workingDays: '15 days',
      salary50k: 'KES 34,091',
      salary100k: 'KES 68,182',
      salary150k: 'KES 102,273'
    },
    {
      serviceYears: '2 years',
      workingDays: '30 days',
      salary50k: 'KES 68,182',
      salary100k: 'KES 136,364',
      salary150k: 'KES 204,545'
    },
    {
      serviceYears: '3 years',
      workingDays: '45 days',
      salary50k: 'KES 102,273',
      salary100k: 'KES 204,545',
      salary150k: 'KES 306,818'
    },
    {
      serviceYears: '5 years',
      workingDays: '75 days',
      salary50k: 'KES 170,455',
      salary100k: 'KES 340,909',
      salary150k: 'KES 511,364'
    },
    {
      serviceYears: '10 years',
      workingDays: '150 days',
      salary50k: 'KES 340,909',
      salary100k: 'KES 681,818',
      salary150k: 'KES 1,022,727'
    }
  ];

  // Employer responsibilities
  const employerSteps = [
    {
      number: 1,
      title: 'Document Performance/Conduct',
      description: 'Keep detailed records: performance reviews, warning letters, disciplinary memos. Documentation shows fair procedure if later disputed. For misconduct: written warnings (first and second), opportunity to improve (for performance). For redundancy: business case documents, financial statements showing need.'
    },
    {
      number: 2,
      title: 'Consult/Inform Employee',
      description: 'Discuss termination reason with employee. For redundancy: explain business situation, discuss alternatives, fair selection criteria. For performance: present improvement expectations, training offered, timeline for assessment. For misconduct: outline violation, evidence, opportunity to respond.'
    },
    {
      number: 3,
      title: 'Conduct Fair Hearing',
      description: 'If misconduct: formal hearing with employee present (accompanied by representative if desired). Present evidence (witnesses, documents). Employee responds to allegations. Document hearing (notes, attendees). Decision follows hearing (immediate or after consideration period).'
    },
    {
      number: 4,
      title: 'Issue Termination Notice',
      description: 'Written notice with: termination reason, notice period end date, final date if payment in lieu, entitlements calculation, appeal procedure (if exists). Deliver personally (get signature) or registered mail (proof). Keep copy for records.'
    },
    {
      number: 5,
      title: 'Calculate Final Settlement',
      description: 'Compute total entitlements: final salary (pro-rata if mid-month), accrued annual leave (unused days), sick leave (if policy allows), severance (if redundancy - 15 days per year), notice pay (if not working out), any bonuses owed.'
    },
    {
      number: 6,
      title: 'Process Payment',
      description: 'Transfer final settlement to employee bank account (on or before last working day). Provide itemized payslip showing: salary, deductions, leave payment, severance, net amount. Keep proof of payment (bank transfer receipt).'
    },
    {
      number: 7,
      title: 'Issue Service Certificate',
      description: 'Provide official document: employee name/ID, position held, employment dates (hire to last day), termination reason, service length, conduct/performance summary, employer contact for references. Employee can request at any time.'
    },
    {
      number: 8,
      title: 'Collect Company Property',
      description: 'Obtain: office keys, ID badge, company equipment (laptop, phone), access cards, uniforms, confidential documents. Conduct exit interview (brief, professional). Document return of property (signed acknowledgment).'
    }
  ];

  // Employee checklist
  const employeeChecklist = [
    {
      item: 'Verify Termination Documentation',
      details: 'Obtain written termination notice (reason, notice period, last day). Confirm everything in writing (not just verbal). Check notice period matches law (1 week to 1 month based on service).'
    },
    {
      item: 'Calculate Entitlements',
      details: 'Calculate what you should receive: final salary, unused leave (annual, sick), severance (if redundancy - 15 days per year), notice pay (if payment in lieu). Verify employer calculation against law.'
    },
    {
      item: 'Gather Employment Records',
      details: 'Collect: employment contract, all payslips, offer letter, performance reviews, warning letters (if any), leave balances, benefit statements. Keep digital and physical copies in safe place.'
    },
    {
      item: 'Request Written Confirmation',
      details: 'Ask employer for: written termination letter, calculation of final settlement (itemized breakdown), service certificate (dates, position, reason, conduct). Get everything in writing before last day.'
    },
    {
      item: 'Verify Final Payment',
      details: 'Check final payslip: salary calculation, deductions (tax, NHIF, NSSF), leave payout, severance amount. Ensure payment processed (bank transfer, cash, check - get receipt). Verify amount matches calculation.'
    },
    {
      item: 'Understand Your Rights',
      details: 'If terminated for misconduct: you have right to investigation and hearing. If redundancy: entitled to consultation and fair selection. If unfair: you can file complaint at Labour Office (within 60 days).'
    },
    {
      item: 'Document Everything',
      details: 'Keep copies of: termination notice, final payslip, service certificate, calculation breakdown, any correspondence. Document dates of all communications. These are evidence if you dispute termination later.'
    },
    {
      item: 'Return Company Property',
      details: 'Return: keys, ID badge, equipment (laptop, phone), access cards, documents. Get written acknowledgment of return. Protect yourself from claims of loss/damage after you leave.'
    },
    {
      item: 'Know Your Options',
      details: 'If wrongfully terminated: file complaint at Labour Office (60-day deadline from termination). If dispute over payment: file claim for unpaid wages/severance. Seek legal advice if claim is significant (over KES 100,000).'
    },
    {
      item: 'Plan Transition',
      details: 'Secure employment letter/reference from employer (while relationship fresh). Update LinkedIn, resume, job search profiles. Apply for new jobs, benefits (unemployment assistance if available). Take action quickly (other employers interested in quick starters).'
    }
  ];

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'legal-framework', 'termination-explained', 'redundancy', 'severance', 'unfair-dismissal', 'employer-steps', 'employee-checklist', 'common-mistakes', 'faqs'];
      
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
        <title>Termination Redundancy Severance Kenya – Rights Guide 2026</title>
        <meta name="description" content="Complete guide to termination, redundancy, and severance pay in Kenya. Employee rights, employer obligations, notice periods, and calculations under Employment Act 2007." />
        <link rel="canonical" href="https://yoursite.com/termination-redundancy-severance-kenya" />
        
        {/* OpenGraph */}
        <meta property="og:title" content="Termination, Redundancy & Severance Kenya – Rights Guide 2026" />
        <meta property="og:description" content="Understand termination procedures, redundancy rights, severance calculations, and unfair dismissal protections in Kenya." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://yoursite.com/termination-redundancy-severance-kenya" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=630&fit=crop" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Termination, Redundancy & Severance Kenya – Rights Guide 2026" />
        <meta name="twitter:description" content="Employee termination rights, severance pay calculation, redundancy procedures, and unfair dismissal remedies in Kenya." />
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
            "description": "Termination and redundancy guidance for Kenya"
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
                "name": "Termination & Redundancy",
                "item": "https://yoursite.com/termination-redundancy-severance-kenya"
              }
            ]
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Calculate Severance Pay in Kenya",
            "description": "Step-by-step guide to calculating severance and redundancy compensation",
            "step": [
              {
                "@type": "HowToStep",
                "position": 1,
                "name": "Count Years of Service",
                "text": "Calculate total years and months from hire date to termination date"
              },
              {
                "@type": "HowToStep",
                "position": 2,
                "name": "Calculate Daily Salary",
                "text": "Divide monthly gross salary by 22 working days"
              },
              {
                "@type": "HowToStep",
                "position": 3,
                "name": "Apply Statutory Rate",
                "text": "Multiply years of service by 15 working days to get total severance days"
              },
              {
                "@type": "HowToStep",
                "position": 4,
                "name": "Calculate Final Amount",
                "text": "Multiply severance days by daily salary to get total severance pay"
              },
              {
                "@type": "HowToStep",
                "position": 5,
                "name": "Request Payment",
                "text": "Employer must pay within 7 days of termination date"
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
              <FileText className="w-8 h-8 flex-shrink-0" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">Termination, Redundancy & Severance in Kenya – Employee & Employer Rights Guide 2026</h1>
            </div>
            <p className="text-blue-100 text-lg max-w-3xl">Complete guide to employment termination, redundancy procedures, severance pay calculations, and unfair dismissal rights under Employment Act 2007 and Labour Relations Act.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#severance" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Calculate Severance
              </a>
              <a href="#employee-checklist" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
                Employee Checklist <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:block sticky top-0 bg-white shadow-md z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex gap-2 overflow-x-auto">
              {['overview', 'legal-framework', 'termination-explained', 'redundancy', 'severance', 'unfair-dismissal', 'employer-steps', 'employee-checklist', 'common-mistakes', 'faqs'].map((section) => (
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
                  {section === 'overview' ? 'Overview' : section === 'legal-framework' ? 'Legal' : section === 'termination-explained' ? 'Termination' : section === 'redundancy' ? 'Redundancy' : section === 'severance' ? 'Severance' : section === 'unfair-dismissal' ? 'Unfair' : section === 'employer-steps' ? 'Employer' : section === 'employee-checklist' ? 'Employee' : section === 'common-mistakes' ? 'Mistakes' : 'FAQs'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden sticky top-0 bg-white shadow-md z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {['overview', 'termination-explained', 'redundancy', 'severance', 'employee-checklist', 'faqs'].map((section) => (
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
                  {section === 'overview' ? 'Overview' : section === 'termination-explained' ? 'Termination' : section === 'redundancy' ? 'Redundancy' : section === 'severance' ? 'Severance' : section === 'employee-checklist' ? 'Checklist' : 'FAQs'}
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
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Introduction to Termination & Redundancy</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Employment termination is separation between employer and employee. Understanding legal rights, procedures, and entitlements protects both parties and ensures compliance with Kenyan employment law.</p>

              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&h=400&q=80"
                alt="Termination and redundancy in Kenya employment law"
                className="rounded-lg shadow-lg w-full mb-6"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">✓ Types of Termination</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Voluntary resignation (employee leaves)</li>
                    <li>• Involuntary termination (employer fires)</li>
                    <li>• Redundancy (job eliminated)</li>
                    <li>• Contract expiry (fixed-term ends)</li>
                    <li>• Mutual agreement (both parties consent)</li>
                  </ul>
                </div>

                <div className="bg-green-50 border-l-4 border-green-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">📋 Key Entitlements</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Notice period (1 week to 1 month)</li>
                    <li>• Accrued leave payment (unused days)</li>
                    <li>• Severance pay (15 days per year worked)</li>
                    <li>• Service certificate (proof of employment)</li>
                    <li>• Fair treatment and procedure</li>
                  </ul>
                </div>
              </div>

              <p className="text-gray-700 mb-4"><strong>Key principle:</strong> Employees have statutory rights regardless of contract terms. Minimum notice, severance, and leave cannot be waived. Fair procedure required for all terminations.</p>
            </div>
          </section>

          {/* Legal Framework */}
          <section id="legal-framework" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Legal Framework (Employment Act, Labour Relations Act)</h2>
            </div>

            <div className="prose max-w-none">
              <div className="space-y-4 mb-6">
                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Employment Act 2007 – Termination Requirements</h4>
                  <p className="text-gray-700 text-sm">Sections 35-47: Governs all individual terminations. Section 35: Notice period based on service length (1 week to 1 month). Section 36: Severance pay (15 days per year worked). Section 37-40: Termination for cause (misconduct, incapacity, poor performance). Section 41: Unfair termination remedies (reinstatement, compensation). Section 47: Anti-victimization (illegal to terminate for filing complaints). Applies to: all employees (permanent, fixed-term, casual if continuous). Exception: Probationary employees (7 days notice during probation).</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Labour Relations Act 2007 – Collective Disputes</h4>
                  <p className="text-gray-700 text-sm">Covers collective redundancies (mass layoffs affecting multiple employees). Requires: consultation with workers' representatives, consideration of alternatives, fair selection criteria. Applies to: redundancies affecting 10+ employees (varies by sector). Procedures: Notice to union, consultation meetings, agreement on severance/benefits, documentation of consultation. Violation: unlawful redundancy claim, compensation liability for employees.</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Employment & Labour Relations Court Act 2011</h4>
                  <p className="text-gray-700 text-sm">Jurisdiction: unfair termination, redundancy disputes, enforcement of awards. Remedies: reinstatement, compensation (max 12 months salary), damages. Appeal: to Court of Appeal within 30 days. Accessible: employee-friendly procedures, recognizes power imbalance, moderate costs.</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Constitution of Kenya 2010 – Fundamental Rights</h4>
                  <p className="text-gray-700 text-sm">Article 41: Right to fair labour practices (fair remuneration, reasonable conditions, dignity). Article 27: Non-discrimination (employment rights protected equally). Article 47: Fair administrative action (termination must follow fair procedure). Violations: constitutional petition to High Court (bypass Labour Office if serious rights breach).</p>
                </div>
              </div>
            </div>
          </section>

          {/* Termination Explained */}
          <section id="termination-explained" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Termination of Employment Explained</h2>
            </div>

            <div className="prose max-w-none">
              <div className="space-y-4 mb-6">
                <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">Voluntary Resignation</h4>
                  <p className="text-gray-700 text-sm mb-2"><strong>Definition:</strong> Employee initiates termination by resigning. Employee must give statutory notice (1 week to 1 month depending on service).</p>
                  <p className="text-gray-700 text-sm mb-2"><strong>Process:</strong> Write resignation letter (state last working day), Serve notice period (continue working), Settle outstanding items (handover, documentation), Receive final settlement (salary, leave, entitlements).</p>
                  <p className="text-gray-700 text-sm"><strong>Entitlements:</strong> Final salary, accrued leave payment, severance NOT due (voluntary termination). Note: If resignation due to employer breach = constructive dismissal (employee treated as terminated, gets severance).</p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">Involuntary Termination</h4>
                  <p className="text-gray-700 text-sm mb-2"><strong>Definition:</strong> Employer initiates termination for cause (misconduct, poor performance, incapacity, redundancy). Employer must have valid reason and follow fair procedure.</p>
                  <p className="text-gray-700 text-sm mb-2"><strong>Valid reasons:</strong> Gross misconduct (theft, violence, fraud - after investigation), Poor performance (after warnings, improvement chance), Incapacity (medical, inability to work), Redundancy (genuine business need), Contract expiry (fixed-term ends).</p>
                  <p className="text-gray-700 text-sm"><strong>Procedure:</strong> Investigation (gather facts), Hearing (present to employee, allow response), Decision (written notice), Notice period (statutory time to leave), Final settlement (pay all dues).</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">Notice Periods Table</h4>
                </div>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto mb-6">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Service Length</th>
                      <th className="px-4 py-3 text-left font-semibold">Notice Required</th>
                      <th className="px-4 py-3 text-left font-semibold">Severance Eligible</th>
                      <th className="px-4 py-3 text-left font-semibold">Valid Reasons</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {noticePeriods.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                        <td className="px-4 py-3 font-semibold text-gray-900 text-sm">{item.serviceLength}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.noticeRequired}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.severanceEligible}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.validReasons}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Redundancy */}
          <section id="redundancy" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <Building2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Redundancy & Layoffs</h2>
            </div>

            <div className="prose max-w-none">
              <div className="space-y-4 mb-6">
                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">What is Redundancy</h4>
                  <p className="text-gray-700 text-sm">Redundancy: Elimination of job position due to genuine business need (not employee performance). Valid reasons: Business closure, Restructuring (position no longer exists), Technological change (machines replace workers), Economic downturn (cost-cutting), Relocation (moving to different location). NOT redundancy: Replacing employee with cheaper worker, Refusing promotion, Disliking employee (unfair dismissal instead). Employer obligation: Genuine business case (documentation), Fair selection (if not all jobs cut), Consultation (inform affected employees), Severance (mandatory 15 days per year).</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Redundancy Legal Process</h4>
                  <p className="text-gray-700 text-sm">Step 1: Consultation (inform employees, explain reason, discuss alternatives). Step 2: Fair selection (if partial redundancy - clear criteria: last in first out, performance, skills match). Step 3: Notice (statutory notice period from consultation announcement). Step 4: Settlement calculation (severance, leave, dues). Step 5: Payment (within 7 days). Step 6: Service certificate. Alternatives to redundancy: Voluntary redundancy (offer enhanced severance for volunteers), Wage reduction (all agree to lower salary), Hours reduction (part-time instead of full-time), Unpaid leave (temporary cost-cutting).</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Employer Obligations</h4>
                  <p className="text-gray-700 text-sm">Mandatory consultation: Inform unions/employees (minimum 30 days notice), Provide financial information (show business need), Discuss alternatives (less severe options), Consider worker suggestions. Fair selection criteria: Objective (not discriminatory - based on merit, skills, performance, not tribe/gender), Transparent (communicated to employees), Applied consistently (same across all redundancies). Severance obligation: Calculate correctly (15 days per year worked), Pay on time (within 7 days), Provide written calculation. Anti-victimization: Cannot terminate for union activities or filing complaints during redundancy.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Severance */}
          <section id="severance" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <Calculator className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Severance Pay – Calculation & Entitlements</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Severance/redundancy pay: One-time payment for job loss due to redundancy. Statutory minimum: 15 working days per year of service (non-negotiable).</p>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg mb-6">
                <h4 className="font-bold text-gray-900 mb-2">Severance Calculation Formula</h4>
                <p className="text-gray-700 text-sm mb-3"><strong>Formula:</strong> (Years of Service × 15 days) × Daily Salary</p>
                <p className="text-gray-700 text-sm mb-3"><strong>Daily Salary:</strong> Gross Monthly Salary ÷ 22 working days</p>
                <p className="text-gray-700 text-sm"><strong>Example:</strong> Employee with 4 years service at KES 50,000/month: Daily salary = 50,000 ÷ 22 = KES 2,273. Severance = (4 × 15) × 2,273 = 60 days × 2,273 = KES 136,364.</p>
              </div>

              <p className="text-gray-700 mb-4">Severance Calculator Table (based on different service lengths and salaries):</p>

              <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto mb-6">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Service</th>
                      <th className="px-4 py-3 text-left font-semibold">Working Days</th>
                      <th className="px-4 py-3 text-left font-semibold">@ KES 50k/month</th>
                      <th className="px-4 py-3 text-left font-semibold">@ KES 100k/month</th>
                      <th className="px-4 py-3 text-left font-semibold">@ KES 150k/month</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {severanceCalculation.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                        <td className="px-4 py-3 font-semibold text-gray-900 text-sm">{item.serviceYears}</td>
                        <td className="px-4 py-3 text-blue-600 font-semibold text-sm">{item.workingDays}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.salary50k}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.salary100k}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.salary150k}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-3 mb-6">
                <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Severance Entitlements</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>✓ All permanent employees (no minimum service - even 1 month counted)</li>
                    <li>✓ All fixed-term employees (if not renewed due to redundancy)</li>
                    <li>✓ Casual employees working continuously (meet continuity test)</li>
                    <li>✓ Entitlement from day of hire (not after probation)</li>
                    <li>✓ Payment within 7 days of termination (statutory deadline)</li>
                  </ul>
                </div>

                <div className="bg-orange-50 border-l-4 border-orange-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">NOT Entitled to Severance</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>✗ Termination for misconduct (after investigation/hearing)</li>
                    <li>✗ Poor performance (after warnings and improvement chance)</li>
                    <li>✗ Voluntary resignation (employee choice)</li>
                    <li>✗ Incapacity (medical condition, inability to work)</li>
                    <li>✗ Contract expiry (fixed-term natural end, not renewed)</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Unfair Dismissal */}
          <section id="unfair-dismissal" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Unfair Dismissal – Rights & Remedies</h2>
            </div>

            <div className="prose max-w-none">
              <div className="space-y-4 mb-6">
                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">What Constitutes Unfair Dismissal</h4>
                  <p className="text-gray-700 text-sm">Unfair dismissal: Termination without valid reason OR without fair procedure. Invalid reasons (illegal): Discrimination (tribe, gender, religion, disability, pregnancy, HIV status), Retaliation (filing complaint, union membership, whistleblowing), Pregnancy/maternity (during pregnancy or maternity leave), Dismissal without reason (arbitrary), Breach of contract terms (violating agreed conditions). Procedural unfairness: Termination without investigation (misconduct cases), No hearing (employee not allowed to defend), No warning (no progressive discipline), No written reason (no explanation). Employer burden of proof: Must prove valid reason AND fair procedure (if either missing = unfair dismissal).</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Employee Remedies</h4>
                  <p className="text-gray-700 text-sm">Reinstatement: Get job back (if desired). Compensation: Up to 12 months gross salary (court discretion). Notice pay: If terminated without proper notice. Accrued leave payment: Unused days (annual, sick leave). Severance: If redundancy (15 days per year). General damages: Distress, suffering, loss of reputation. Specific performance: Employer must follow procedure (if not yet final). Attorney costs: If employer acted in bad faith (can be awarded). Selection: Employee can choose remedy (reinstatement preferred by some, compensation by others).</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Compensation Calculation</h4>
                  <p className="text-gray-700 text-sm">Maximum: 12 months gross salary (statutory cap). Factors court considers: Service length (longer service = higher award), Salary level (higher earner = higher award), Employer conduct (bad faith increases award), Employee conduct (misconduct reduces award), Likelihood of re-employment (ease of finding new job). Example: Employee 8 years service, KES 80,000/month, unfairly terminated: Likely compensation = KES 400,000-600,000 (5-7.5 months salary) depending on circumstances. Not automatic maximum: Courts exercise discretion (actual award varies based on facts).</p>
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-600 p-5 rounded-lg">
                <p className="text-gray-700 text-sm"><strong>Key right:</strong> Employee can file complaint within 60 days of unfair dismissal (Employment Act Section 46). After 60 days = time-barred (complaint rejected unless exceptional circumstances). File immediately to preserve rights.</p>
              </div>
            </div>
          </section>

          {/* Employer Steps */}
          <section id="employer-steps" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <Users className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Steps for Employers Before Termination</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Fair termination process ensures legal protection and reduces dispute risk:</p>

              <div className="space-y-4">
                {employerSteps.map((step) => (
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
                <h4 className="font-bold text-gray-900 mb-2">💡 Employer Best Practices</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Document all performance/conduct issues (creates evidence)</li>
                  <li>• Follow progressive discipline (warnings before termination)</li>
                  <li>• Keep investigation records (fair process documentation)</li>
                  <li>• Calculate severance correctly (avoid disputes)</li>
                  <li>• Pay on time (within 7 days - shows good faith)</li>
                  <li>• Provide written confirmation (employee has proof)</li>
                  <li>• Maintain professional tone (avoid bitterness)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Employee Checklist */}
          <section id="employee-checklist" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Employee Checklist When Facing Termination or Redundancy</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Protect your interests with this comprehensive checklist:</p>

              <div className="space-y-3">
                {employeeChecklist.map((item, index) => (
                  <div key={index} className="bg-white border-2 border-gray-200 p-4 rounded-xl hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      {item.item}
                    </h4>
                    <p className="text-gray-700 text-sm">{item.details}</p>
                  </div>
                ))}
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-600 p-5 rounded-lg mt-6">
                <h4 className="font-bold text-gray-900 mb-2">⚠️ Critical Timeline: 60-Day Rule</h4>
                <p className="text-gray-700 text-sm">If you believe termination unfair: File complaint at Labour Office within 60 days of termination date. After 60 days = complaint time-barred (rejected unless exceptional circumstances). No extension (deadline is strict). File immediately to preserve rights.</p>
              </div>
            </div>
          </section>

          {/* Common Mistakes */}
          <section id="common-mistakes" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Common Mistakes to Avoid</h2>
            </div>

            <div className="prose max-w-none">
              <div className="space-y-3">
                <div className="bg-white border-l-4 border-red-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Employer Mistakes:</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>✗ Terminating without documented reason (unfair dismissal claim)</li>
                    <li>✗ No investigation/hearing for misconduct (procedural unfairness)</li>
                    <li>✗ Calculating severance incorrectly (underpayment liability)</li>
                    <li>✗ Delaying severance payment (interest accumulates)</li>
                    <li>✗ Retaliating against employees (who file complaints)</li>
                    <li>✗ Discriminatory redundancy selection (illegal termination)</li>
                  </ul>
                </div>

                <div className="bg-white border-l-4 border-red-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Employee Mistakes:</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>✗ Resigning without documenting employer breach (lose severance claim)</li>
                    <li>✗ Accepting cash without receipt (no proof of payment)</li>
                    <li>✗ Missing 60-day filing deadline (complaint time-barred)</li>
                    <li>✗ No evidence of termination terms (difficult to prove claims)</li>
                    <li>✗ Accepting lowball severance (without legal advice)</li>
                    <li>✗ Not requesting service certificate (needed for next job)</li>
                  </ul>
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
              <h2 className="text-2xl font-bold mb-4">Facing Termination or Redundancy?</h2>
              <p className="text-blue-100 mb-6">Get professional guidance to protect your rights and ensure fair treatment under Kenyan employment law.</p>
              
              <div className="flex flex-wrap gap-3">
                <a href="#employee-checklist" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Use Checklist
                </a>
                <a href="/labour-dispute-resolution-kenya" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
                  Dispute Guide <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </section>

          {/* Internal Links */}
          <section className="mt-12 pt-8 border-t-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Related Employment & Labour Law Guides</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <a href="/kenya-employment-labour-laws" className="p-4 border-2 border-blue-200 rounded-lg hover:shadow-lg transition-shadow hover:border-blue-600">
                <h4 className="font-bold text-gray-900 mb-1">Employment & Labour Laws</h4>
                <p className="text-gray-600 text-sm">Complete guide to employee and employer rights</p>
              </a>
              <a href="/employment-contracts-kenya" className="p-4 border-2 border-green-200 rounded-lg hover:shadow-lg transition-shadow hover:border-green-600">
                <h4 className="font-bold text-gray-900 mb-1">Employment Contracts</h4>
                <p className="text-gray-600 text-sm">Contract templates, clauses, and legal guide</p>
              </a>
              <a href="/labour-dispute-resolution-kenya" className="p-4 border-2 border-orange-200 rounded-lg hover:shadow-lg transition-shadow hover:border-orange-600">
                <h4 className="font-bold text-gray-900 mb-1">Labour Dispute Resolution</h4>
                <p className="text-gray-600 text-sm">File complaints and resolve disputes</p>
              </a>
              <a href="/business-permits-licenses-kenya" className="p-4 border-2 border-purple-200 rounded-lg hover:shadow-lg transition-shadow hover:border-purple-600">
                <h4 className="font-bold text-gray-900 mb-1">Business Permits & Licenses</h4>
                <p className="text-gray-600 text-sm">Get required business operating permits</p>
              </a>
              <a href="/company-annual-returns-and-filing-kenya" className="p-4 border-2 border-red-200 rounded-lg hover:shadow-lg transition-shadow hover:border-red-600">
                <h4 className="font-bold text-gray-900 mb-1">Company Annual Returns</h4>
                <p className="text-gray-600 text-sm">File CR12 and stay compliant</p>
              </a>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default TerminationRedundancySeveranceKenya;
