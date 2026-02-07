import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, FileText, Building2, AlertTriangle, BookOpen, Shield, Users, CheckCircle2, XCircle, Scale, Clock } from 'lucide-react';

const LabourDisputeResolutionKenya = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // FAQ data
  const faqs = [
    {
      question: 'How long do I have to file a labour dispute complaint in Kenya?',
      answer: '60 days from date of dispute occurrence. Employment Act Section 46: employee must file complaint at Labour Office within 60 days of unfair termination, non-payment, or rights violation. After 60 days: complaint may be rejected as time-barred (unless exceptional circumstances proven). Employer disputes: also 60 days for contract violations or employee misconduct claims. Extension possible: if good cause shown (medical emergency, lack of awareness). Best practice: file immediately when dispute arises (do not wait until deadline). Evidence required: termination letter, payslips, contract, correspondence. File even if negotiating: preserves legal rights while pursuing settlement.'
    },
    {
      question: 'What happens when I file a labour complaint?',
      answer: 'Step-by-step process: 1. Submit complaint at Labour Office (written statement with evidence), 2. Labour Officer reviews (within 7 days), 3. Summons issued (both parties called for mediation), 4. First hearing scheduled (typically within 14-21 days), 5. Mediation attempt (Labour Officer facilitates discussion), 6. Settlement or referral (if agreed = binding settlement, if no agreement = referred to arbitration/court). Timeline: mediation phase 30-60 days. During process: employer cannot victimize employee, employee remains employed if dispute over termination (unless gross misconduct), parties can negotiate settlement anytime. Labour Officer role: neutral facilitator (not judge), helps parties reach mutual agreement, records settlement if reached.'
    },
    {
      question: 'Can I be fired for filing a labour complaint?',
      answer: 'No, victimization prohibited. Employment Act Section 47: illegal to terminate, demote, or harass employee for: filing labour complaint, being witness in dispute, asserting employment rights, union membership. Victimization = separate offence: employee can file additional complaint, claim compensation (damages for victimization), seek reinstatement. Protection extends to: complaint filing period, mediation/arbitration process, after complaint resolved. Employer doing this: faces penalties (KES 50,000-200,000), additional compensation to employee, court may order immediate reinstatement. Employee action if victimized: file victimization complaint immediately, document all incidents (emails, witnesses, dates), seek legal advice. Courts take victimization seriously (employer credibility damaged).'
    },
    {
      question: 'How much does it cost to file a labour dispute?',
      answer: 'Free at Labour Office. Mediation at Labour Department: KES 0 (government service, no fees). Filing complaint: free (no court fees required). Arbitration: may have small administrative fees (KES 2,000-5,000) but waived for employees. Lawyer costs (optional but recommended): Consultation KES 5,000-15,000, Full representation KES 50,000-300,000 (depending on complexity). Employment Court: filing fees KES 2,000-10,000 (varies by claim amount), lawyer essential at court stage (complex procedures). DIY possible: mediation stage (many employees self-represent), arbitration (advisable to have lawyer), court (strongly recommended to hire lawyer). Legal aid: available from NGOs for indigent employees (free legal services), Federation of Kenya Employers (FKE) - member services for employers.'
    },
    {
      question: 'What compensation can I claim in a labour dispute?',
      answer: 'Multiple remedies available: 1. Unpaid wages/salary (full amount owed + interest), 2. Unfair termination compensation (up to 12 months gross salary), 3. Notice pay (if terminated without notice), 4. Severance/redundancy pay (15 days per year worked), 5. Accrued leave (unused annual/sick leave cash equivalent), 6. General damages (distress, suffering, loss of reputation), 7. Reinstatement (get job back if desired), 8. Legal costs (if employer acted in bad faith). Calculation: Labour Officer/court assesses based on service length, salary level, employer conduct, employee losses. Maximum: 12 months salary for unfair termination (courts rarely exceed). Mitigation: employee must seek alternative employment (cannot claim full salary if sitting idle). Payment: typically lump sum after judgment (employer ordered to pay within 30 days).'
    },
    {
      question: 'Can I negotiate a settlement during the dispute process?',
      answer: 'Yes, encouraged at all stages. Settlement benefits: faster resolution (weeks vs months/years), certainty (agreed terms vs unpredictable court decision), confidentiality (private agreement vs public court record), preserves relationship (less adversarial), saves costs (no lawyer fees). When to settle: anytime before final judgment (during mediation, arbitration, even at court). Settlement terms must include: payment amount, payment timeline, reference letter (if agreed), confidentiality clause (optional), full and final settlement (no further claims), mutual release (both parties waive claims). Settlement enforcement: binding contract (enforceable in court if breach), recorded by Labour Officer/court (becomes consent order). Employee caution: do not accept lowball offers (seek legal advice first), ensure payment guaranteed (bank guarantee/security), get everything in writing (verbal promises unenforceable).'
    },
    {
      question: 'What is the difference between mediation and arbitration?',
      answer: 'Mediation: Voluntary process, Labour Officer facilitates discussion (neutral third party), parties negotiate settlement, no binding decision (unless parties agree), informal hearing, faster (30-60 days), free at Labour Office, either party can walk away. Arbitration: Formal adjudication, Arbitrator hears evidence and makes binding decision, both parties present case (witnesses, documents), decision enforceable (like court judgment), semi-formal hearing, moderate speed (3-6 months), small fees (KES 2,000-10,000), decision final (limited appeal). Mediation first: Labour Office always tries mediation (lower cost, faster, preserves relationship). If mediation fails: referred to arbitration or court. Arbitration vs Court: Arbitration faster and cheaper, Court slower but more formal protections. Employee choice: can opt for court instead of arbitration (if prefers formal trial).'
    },
    {
      question: 'How long does a labour dispute take to resolve?',
      answer: 'Timeline varies by stage: Mediation at Labour Office: 30-60 days (fastest option, if settlement reached). Arbitration: 3-6 months (moderate speed, includes hearings and decision). Employment & Labour Relations Court: 6-18 months (slower, formal trial process), Appeals (Court of Appeal): 12-24 months additional. Factors affecting timeline: complexity of case (simple non-payment faster than unfair termination), evidence availability (delays if documents missing), parties cooperation (settlement speeds up, litigation slows down), court backlog (Employment Court often congested). Expedited cases: urgent matters (risk of employer absconding, employee destitution) can be fast-tracked, interim orders possible (e.g., reinstatement pending hearing). Employee strategy: pursue mediation settlement first (fastest), be prepared with evidence (speeds up process), engage lawyer early (avoids procedural delays).'
    },
    {
      question: 'Can I represent myself in a labour dispute?',
      answer: 'Yes, but risky at certain stages. Mediation stage: self-representation common and viable (informal process, Labour Officer helps both parties, less technical). Arbitration stage: possible but challenging (need to understand evidence rules, cross-examination, legal arguments, arbitrator expects some legal knowledge). Employment Court: strongly advise lawyer (complex procedures, strict evidence rules, legal technicalities, experienced employer lawyers). Risks of self-representation: miss deadlines (procedural errors), poor evidence presentation (weakens case), unfavorable settlement (accept less than deserved), appeals difficult (if lose at trial). When to self-represent: simple non-payment claims (clear evidence, straightforward), mediation attempts (before escalation). When to hire lawyer: unfair termination (compensation claims complex), court stage (essential for success), employer has lawyer (level playing field), large claim (worth investment). Legal aid: NGOs provide free lawyers for indigent employees (FIDA Kenya, Labour Rights Helpline).'
    },
    {
      question: 'What evidence do I need for a labour dispute?',
      answer: 'Essential documents: 1. Employment contract (proves relationship and terms), 2. Payslips (shows salary, deductions, payment history), 3. Bank statements (proves non-payment if claiming unpaid wages), 4. Termination letter (if unfair dismissal claim), 5. Warning letters (disciplinary history if relevant), 6. Correspondence (emails, WhatsApp, SMS showing dispute), 7. Witnesses (colleagues who observed events), 8. Medical reports (if claiming stress, injury), 9. Job search evidence (mitigation - shows sought alternative employment). How to organize: chronological order, numbered and indexed, copies for all parties (original for yourself), witness statements written and signed, timeline summary (dates of key events). Burden of proof: employee proves relationship and rights violation, employer proves fair procedure followed (termination cases). Missing evidence: Labour Officer/court can draw adverse inferences (if employer fails to provide requested documents), but employee must prove basic claim.'
    },
    {
      question: 'Can employer and employee settle privately without Labour Office?',
      answer: 'Yes, but risky without proper documentation. Private settlement legal if: mutual agreement in writing, signed by both parties (dated signatures), witnesses present (optional but recommended), full and final settlement clause (no further claims), payment terms clear (amount, timeline, method). Risks of informal settlement: employer may not pay (no enforcement mechanism), employee may file complaint later (if settlement not properly documented), tax implications unclear (settlement payments may be taxable). Best practice: settle through Labour Office (recorded as consent order = enforceable), engage lawyer to draft settlement agreement (ensures all terms covered), register settlement with court (if during court process). Employer caution: get signed release (employee waives all claims), ensure confidentiality clause (protects reputation), comply with payment terms (breach = enforcement action). Employee caution: do not accept cash without receipt, insist on written agreement, seek legal advice before signing (ensure fair deal).'
    },
    {
      question: 'What happens if employer does not comply with Labour Office decision?',
      answer: 'Enforcement process: 1. Labour Officer issues compliance order (employer must comply within 30 days), 2. If employer refuses: matter referred to Employment Court for enforcement, 3. Court issues enforcement order (with penalties for non-compliance), 4. If still non-compliant: contempt of court proceedings (employer/directors may be jailed), attachment of assets (court seizes employer property to pay employee). Additional remedies: interest on award (typically 12% per annum from judgment date), costs (employee legal fees may be awarded), criminal sanctions (for wilful non-compliance). Employee action: file enforcement application at court (with proof of non-payment), seek attachment orders (freeze employer bank accounts), report to authorities (Labour Commissioner, Corporate Affairs). Employer bankruptcy: employee becomes preferential creditor (paid before general creditors), but recovery depends on available assets. Prevention: request bank guarantee at settlement stage (ensures payment security).'
    },
    {
      question: 'Can I appeal a labour dispute decision?',
      answer: 'Yes, appeal rights exist at each level. Arbitration award appeal: to Employment & Labour Relations Court within 30 days, grounds: error of law, procedural irregularity, unreasonable decision. Employment Court decision appeal: to Court of Appeal within 30 days, grounds: legal error, excessive/inadequate damages, procedural unfairness. Court of Appeal decision appeal: to Supreme Court (rare, only if constitutional issue or public importance). Appeal process: file notice of appeal (within deadline), deposit security for costs (typically 50% of award amount), prepare appeal record (transcripts, documents), submit written submissions (legal arguments), oral hearing (before appellate judges), judgment (typically 3-6 months). Appeal success: difficult (appellate courts defer to trial findings), must show clear legal error (not just dissatisfaction). Pending appeal: original decision not enforced (until appeal determined), unless applicant seeks stay of execution. Costs risk: losing appellant pays both sides costs (expensive).'
    },
    {
      question: 'What are grounds for unfair termination in Kenya?',
      answer: 'Valid termination grounds (lawful): Misconduct (theft, violence, insubordination - after fair hearing), Poor performance (after warnings and improvement opportunity), Redundancy (genuine business need, fair selection, compensation paid), Incapacity (prolonged illness preventing work, medical evidence), Expiry of fixed-term contract (natural end date). Unfair termination grounds (illegal): Discrimination (tribe, gender, religion, disability, pregnancy, HIV status), Retaliation (whistleblowing, filing complaint, union membership, asserting rights), No valid reason (arbitrary dismissal), Procedural unfairness (no investigation, no hearing, no right to respond), Pregnancy/maternity (termination during maternity leave), Trade union activities (participating in lawful union activities). Consequences of unfair termination: Employee entitled to compensation (up to 12 months salary), Reinstatement possible (if employee wants job back), Employer pays legal costs. Burden of proof: employer must prove termination fair (both substantive reason and fair procedure).'
    },
    {
      question: 'How do I protect my rights during a dispute?',
      answer: 'Key protection strategies: 1. Document everything (keep copies of all employment documents, emails, messages, records of verbal conversations with dates/witnesses), 2. File complaint within 60 days (do not delay - time limits strict), 3. Continue working if possible (unless unsafe/intolerable - maintains income and shows good faith), 4. Do not resign under pressure (constructive dismissal difficult to prove), 5. Seek legal advice early (understand rights and options), 6. Gather witnesses (colleagues who can support your case), 7. Preserve evidence (employer may destroy after dispute arises), 8. Report victimization immediately (if employer retaliates for filing complaint), 9. Attend all hearings (non-attendance may result in dismissal of complaint), 10. Be professional (calm, factual, not emotional - strengthens credibility). Avoid: threatening employer (creates evidence against you), discussing case on social media (can be used against you), accepting informal payments (without written agreement and receipt). Get support: Labour Rights organizations, trade unions, employee assistance programs.'
    },
    {
      question: 'Can foreign workers file labour disputes in Kenya?',
      answer: 'Yes, same rights as Kenyan workers. Work permit holders: entitled to ALL employment protections (Employment Act applies regardless of nationality), can file complaints at Labour Office, same dispute resolution procedures, same compensation rights. Exception: diplomatic immunity (embassy staff may have limited access). Requirements: must have valid work permit (illegal workers have limited rights but still entitled to unpaid wages), employment contract (proves relationship), evidence of dispute. Special considerations: deportation risk (if work permit linked to employer, termination may affect permit), repatriation costs (who pays if terminated - should be in contract), home country remedies (may have parallel rights in home jurisdiction). Employer obligations: cannot use immigration status to intimidate worker, must pay owed wages even if permit expired, fair termination procedures apply. Best practice: include dispute resolution clause in work permit contract, seek legal advice from immigration lawyer (work permit implications), consider home country embassy assistance.'
    }
  ];

  // Common dispute types
  const disputeTypes = [
    {
      type: 'Unfair/Wrongful Termination',
      description: 'Dismissal without valid reason or fair procedure',
      remedy: 'Reinstatement or compensation up to 12 months salary',
      timeline: '60 days to file complaint from termination date'
    },
    {
      type: 'Non-payment of Wages',
      description: 'Salary, overtime, allowances not paid',
      remedy: 'Full payment of owed amounts plus interest',
      timeline: '60 days to file from last expected payment date'
    },
    {
      type: 'Workplace Harassment',
      description: 'Sexual harassment, bullying, discrimination',
      remedy: 'Compensation, policy changes, termination of harasser',
      timeline: '60 days to file from last incident'
    },
    {
      type: 'Contract Violations',
      description: 'Employer breaching employment contract terms',
      remedy: 'Specific performance or damages for breach',
      timeline: '60 days to file from breach discovery'
    },
    {
      type: 'Denial of Leave',
      description: 'Annual, sick, maternity leave refused',
      remedy: 'Grant leave or pay cash equivalent',
      timeline: '60 days to file from denial'
    },
    {
      type: 'Unlawful Deductions',
      description: 'Unauthorized salary deductions',
      remedy: 'Refund of deductions plus interest',
      timeline: '60 days to file from deduction occurrence'
    }
  ];

  // Dispute resolution timeline
  const resolutionTimeline = [
    {
      stage: 'Internal Negotiation',
      duration: '1-2 weeks',
      description: 'Discuss with employer/HR directly',
      outcome: 'Settlement or escalation to Labour Office'
    },
    {
      stage: 'Labour Office Complaint',
      duration: '7-14 days',
      description: 'File written complaint, summons issued',
      outcome: 'Mediation hearing scheduled'
    },
    {
      stage: 'Mediation',
      duration: '30-60 days',
      description: 'Labour Officer facilitates settlement discussion',
      outcome: 'Settlement agreement or referral to arbitration'
    },
    {
      stage: 'Arbitration',
      duration: '3-6 months',
      description: 'Formal hearing, arbitrator makes binding decision',
      outcome: 'Award issued or appeal to court'
    },
    {
      stage: 'Employment Court',
      duration: '6-18 months',
      description: 'Full trial, judge issues judgment',
      outcome: 'Judgment or appeal to Court of Appeal'
    },
    {
      stage: 'Enforcement',
      duration: '30-90 days',
      description: 'Court orders compliance, attachment if needed',
      outcome: 'Payment or contempt proceedings'
    }
  ];

  // Filing complaint steps
  const filingSteps = [
    {
      number: 1,
      title: 'Gather Evidence',
      description: 'Collect: employment contract, payslips, bank statements, termination letter (if applicable), correspondence (emails, SMS, WhatsApp), witness contacts, medical reports (if relevant). Organize chronologically. Make copies (keep originals safe). Prepare written timeline of events (dates, incidents, who was involved).'
    },
    {
      number: 2,
      title: 'Visit Labour Office',
      description: 'Locate nearest Labour Office (County Labour Office in your area - check Ministry of Labour website for addresses). Bring: national ID, all evidence documents, notebook and pen. Operating hours: Monday-Friday 8am-5pm (arrive early to avoid queues). No appointment needed for initial complaint filing.'
    },
    {
      number: 3,
      title: 'File Written Complaint',
      description: 'Request complaint form (Form LR1 - provided free at Labour Office). Fill in completely: your details (name, ID, contacts), employer details (name, address, contacts), nature of dispute (be specific - unfair termination, non-payment, etc.), relief sought (compensation, reinstatement, payment), date of occurrence. Attach evidence copies. Sign and date. Submit to Labour Officer on duty.'
    },
    {
      number: 4,
      title: 'Receive Acknowledgment',
      description: 'Labour Officer reviews complaint (within 7 days typically). Issues complaint reference number (keep this safe - needed for all inquiries). Advises on next steps and hearing date. Provides copy of complaint for your records. May request additional evidence if needed.'
    },
    {
      number: 5,
      title: 'Summons Issued to Employer',
      description: 'Labour Office sends summons to employer (by registered mail or courier). Summons includes: copy of complaint, hearing date (first mediation session, typically 14-21 days from filing), requirement to respond in writing. Employer must attend or send representative with authority to settle. Failure to attend: Labour Office can issue compliance order or refer to court.'
    },
    {
      number: 6,
      title: 'Attend Mediation Hearing',
      description: 'Prepare for hearing: review evidence, prepare statement (clear, factual, not emotional), bring witnesses if needed, dress professionally. At hearing: Labour Officer chairs (neutral facilitator), both parties present case (employee first, then employer responds), open discussion (officer facilitates settlement negotiation), settlement or impasse (if agreed = recorded and binding, if no agreement = referred to arbitration/court). Bring: ID, all documents, notepad. Be punctual (late arrival may result in adjournment).'
    },
    {
      number: 7,
      title: 'Settlement or Escalation',
      description: 'If settlement reached: Labour Officer records terms in writing (consent order), both parties sign, compliance timeline agreed (typically 30 days), officer monitors compliance. If no settlement: Labour Officer refers to arbitration (if both consent) OR Employment Court (if arbitration rejected), issues referral letter, advises on next steps. Follow up: ensure employer complies with settlement, if non-compliance = return to Labour Office for enforcement.'
    }
  ];

  // Common mistakes
  const commonMistakes = [
    {
      mistake: 'Missing the 60-day deadline',
      consequence: 'Complaint time-barred and rejected',
      fix: 'File immediately when dispute arises. If deadline passed: seek legal advice on exceptional circumstances argument (may succeed if good cause shown).'
    },
    {
      mistake: 'No written evidence',
      consequence: 'Weak case, difficult to prove claims',
      fix: 'Document everything from day one. Keep payslips, emails, contracts, messages. Request written confirmations. Take photos/screenshots.'
    },
    {
      mistake: 'Resigning under pressure',
      consequence: 'Constructive dismissal hard to prove',
      fix: 'Do not resign unless intolerable. If forced: state clearly in resignation letter "resigning due to [specific employer breach]". File complaint immediately.'
    },
    {
      mistake: 'Accepting verbal settlement',
      consequence: 'Employer may renege, no proof of agreement',
      fix: 'Insist on written settlement. Include all terms (amount, payment date, reference). Both parties sign. Witness if possible. Register at Labour Office.'
    },
    {
      mistake: 'Discussing dispute on social media',
      consequence: 'Weakens credibility, creates evidence against you',
      fix: 'Keep dispute confidential. Do not post on Facebook, Twitter, WhatsApp status. Avoid defaming employer (may face counter-suit).'
    },
    {
      mistake: 'Not attending hearings',
      consequence: 'Complaint dismissed for non-prosecution',
      fix: 'Attend every hearing. If unavoidable absence: notify Labour Officer in advance (in writing), request adjournment, provide evidence (medical certificate).'
    },
    {
      mistake: 'Filing complaint without attempting negotiation',
      consequence: 'Missed opportunity for faster settlement',
      fix: 'Try internal resolution first (meeting with supervisor/HR). Document attempts. If unsuccessful after 1-2 weeks: file complaint (shows good faith).'
    },
    {
      mistake: 'Claiming excessive compensation',
      consequence: 'Lose credibility, court may award nothing',
      fix: 'Claim realistic amounts based on law (max 12 months salary for unfair termination, actual unpaid wages for non-payment). Seek legal advice on valuation.'
    }
  ];

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'dispute-types', 'legal-framework', 'amicable-resolution', 'labour-department', 'filing-complaint', 'arbitration', 'labour-court', 'timeline', 'protect-rights', 'common-mistakes', 'faqs'];
      
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
        <title>Labour Dispute Resolution Kenya – Step-by-Step Guide 2026</title>
        <meta name="description" content="Complete guide to resolving labour disputes in Kenya. Mediation, arbitration, court procedures, timelines, and employee rights under Employment Act 2007." />
        <link rel="canonical" href="https://yoursite.com/labour-dispute-resolution-kenya" />
        
        {/* OpenGraph */}
        <meta property="og:title" content="Labour Dispute Resolution Kenya – Employee Employer Guide 2026" />
        <meta property="og:description" content="Resolve employment disputes legally. Labour Office procedures, mediation, arbitration, court process, and timelines in Kenya." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://yoursite.com/labour-dispute-resolution-kenya" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&h=630&fit=crop" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Labour Dispute Resolution Kenya – Step-by-Step Guide 2026" />
        <meta name="twitter:description" content="File labour complaints, mediation, arbitration, and court procedures for employment disputes in Kenya." />
        <meta name="twitter:image" content="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&h=630&fit=crop" />
        
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
            "description": "Labour dispute resolution guidance for Kenya"
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
                "name": "Labour Dispute Resolution",
                "item": "https://yoursite.com/labour-dispute-resolution-kenya"
              }
            ]
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to File a Labour Dispute Complaint in Kenya",
            "description": "Step-by-step guide to filing and resolving labour disputes",
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
              <Scale className="w-8 h-8 flex-shrink-0" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">Labour Dispute Resolution in Kenya – Step-by-Step Guide for Employees & Employers 2026</h1>
            </div>
            <p className="text-blue-100 text-lg max-w-3xl">Complete guide to resolving employment disputes legally and efficiently. Learn mediation, arbitration, Labour Office procedures, court process, and protect your rights under Employment Act 2007.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#filing-complaint" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                File Complaint Guide
              </a>
              <a href="#timeline" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
                View Timeline <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:block sticky top-0 bg-white shadow-md z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex gap-2 overflow-x-auto">
              {['overview', 'dispute-types', 'legal-framework', 'amicable-resolution', 'labour-department', 'filing-complaint', 'arbitration', 'labour-court', 'timeline', 'protect-rights', 'common-mistakes', 'faqs'].map((section) => (
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
                  {section === 'overview' ? 'Overview' : section === 'dispute-types' ? 'Disputes' : section === 'legal-framework' ? 'Legal' : section === 'amicable-resolution' ? 'Amicable' : section === 'labour-department' ? 'Labour Dept' : section === 'filing-complaint' ? 'Filing' : section === 'arbitration' ? 'Arbitration' : section === 'labour-court' ? 'Court' : section === 'timeline' ? 'Timeline' : section === 'protect-rights' ? 'Rights' : section === 'common-mistakes' ? 'Mistakes' : 'FAQs'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden sticky top-0 bg-white shadow-md z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {['overview', 'dispute-types', 'filing-complaint', 'arbitration', 'timeline', 'faqs'].map((section) => (
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
                  {section === 'overview' ? 'Overview' : section === 'dispute-types' ? 'Types' : section === 'filing-complaint' ? 'File' : section === 'arbitration' ? 'Arbitration' : section === 'timeline' ? 'Timeline' : 'FAQs'}
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
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Overview of Labour Disputes in Kenya</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Labour disputes arise when employees and employers disagree over employment terms, rights, or obligations. Kenya's legal framework provides structured mechanisms for fair, efficient resolution protecting both parties.</p>

              <img 
                src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&h=400&q=80"
                alt="Labour dispute resolution and mediation in Kenya"
                className="rounded-lg shadow-lg w-full mb-6"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">✓ What Constitutes a Labour Dispute</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Disagreement over employment contract terms</li>
                    <li>• Unfair or unlawful termination</li>
                    <li>• Non-payment of wages, benefits, or leave</li>
                    <li>• Workplace harassment or discrimination</li>
                    <li>• Breach of statutory employment rights</li>
                    <li>• Collective bargaining disagreements</li>
                  </ul>
                </div>

                <div className="bg-green-50 border-l-4 border-green-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">📋 Resolution Mechanisms Available</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Internal negotiation (employer-employee)</li>
                    <li>• Labour Office mediation (free, 30-60 days)</li>
                    <li>• Arbitration (formal, binding, 3-6 months)</li>
                    <li>• Employment Court (full trial, 6-18 months)</li>
                    <li>• Court of Appeal (appeals only)</li>
                  </ul>
                </div>
              </div>

              <p className="text-gray-700 mb-4"><strong>Key principle:</strong> Disputes should be resolved at lowest level possible (negotiation first, litigation last resort). Mediation encouraged to preserve employment relationship and reduce costs. Time limits strict (60 days to file complaint from dispute occurrence).</p>
            </div>
          </section>

          {/* Dispute Types */}
          <section id="dispute-types" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Common Types of Employment Disputes</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Most frequent employment disputes in Kenya and available remedies:</p>

              <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto mb-6">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Dispute Type</th>
                      <th className="px-4 py-3 text-left font-semibold">Description</th>
                      <th className="px-4 py-3 text-left font-semibold">Remedy</th>
                      <th className="px-4 py-3 text-left font-semibold">Filing Deadline</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {disputeTypes.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                        <td className="px-4 py-3 font-semibold text-gray-900 text-sm">{item.type}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.description}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.remedy}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.timeline}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-600 p-5 rounded-lg">
                <p className="text-gray-700 text-sm"><strong>⚠️ Critical deadline:</strong> Employee must file complaint within 60 days of dispute occurrence (Employment Act Section 46). After 60 days: complaint time-barred unless exceptional circumstances proven. Employer disputes also 60 days. Do not delay - file immediately to preserve rights. Extension rarely granted (only for medical emergency, lack of awareness).</p>
              </div>
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
                  <h4 className="font-bold text-gray-900 mb-1">Employment Act 2007 – Individual Disputes</h4>
                  <p className="text-gray-700 text-sm">Governs individual employment disputes (unfair termination, non-payment, contract breach). Section 45-46: Labour Officer dispute resolution powers (mediation, conciliation, compliance orders). Section 47: Victimization prohibited (illegal to fire employee for filing complaint). Section 49: Appeals to Employment Court. Remedies: reinstatement, compensation (max 12 months salary), payment of owed wages, damages. Procedure: informal mediation first, formal arbitration/court if unsuccessful.</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Labour Relations Act 2007 – Collective Disputes</h4>
                  <p className="text-gray-700 text-sm">Governs collective disputes (trade unions, strikes, collective bargaining). Section 62-65: Collective dispute resolution (negotiation → mediation → arbitration). Industrial Court jurisdiction (renamed Employment & Labour Relations Court 2011). Protects: trade union rights, collective agreements, strike legality. Not applicable to individual employee complaints (use Employment Act instead). Consult union if collective issue (wage negotiations, working conditions affecting multiple employees).</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Employment & Labour Relations Court Act 2011</h4>
                  <p className="text-gray-700 text-sm">Established specialized court for employment disputes (replaced Industrial Court). Jurisdiction: unfair termination, discrimination, employment rights violations, collective disputes, trade union matters. Powers: reinstatement orders, compensation awards, injunctions, enforcement of arbitration awards. Appeal: to Court of Appeal (30 days from judgment). Accessibility: simplified procedures (less formal than regular courts), employee-friendly (recognizes power imbalance). Filing fees: moderate (KES 2,000-10,000 depending on claim).</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Constitution of Kenya 2010 – Fundamental Rights</h4>
                  <p className="text-gray-700 text-sm">Article 41: Right to fair labour practices (fair remuneration, reasonable working conditions, trade union formation and participation). Article 27: Equality and non-discrimination (employment discrimination prohibited on tribe, gender, religion, disability, HIV status, pregnancy). Article 28: Human dignity (workplace dignity protected, harassment illegal). Article 47: Fair administrative action (employer must follow fair procedure in termination). Constitutional petitions: if employment dispute involves fundamental rights violation (can bypass Labour Office and go directly to High Court).</p>
                </div>
              </div>
            </div>
          </section>

          {/* Amicable Resolution */}
          <section id="amicable-resolution" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <Users className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How to Resolve Disputes Amicably</h2>
            </div>

            <div className="prose max-w-none">
              <div className="space-y-4 mb-6">
                <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">Negotiation (Direct Discussion)</h4>
                  <p className="text-gray-700 text-sm mb-2"><strong>When to use:</strong> First step for all disputes (before escalating to Labour Office). Best for: misunderstandings, minor grievances, ongoing employment relationship preservation.</p>
                  <p className="text-gray-700 text-sm mb-2"><strong>Process:</strong> 1. Request meeting with supervisor/HR (in writing, state issue briefly), 2. Prepare your case (facts, evidence, what you want), 3. Meet professionally (calm, factual, not emotional), 4. Listen to employer's perspective (may be legitimate explanation), 5. Propose solution (realistic, mutually beneficial), 6. Document outcome (if agreement reached: written confirmation signed by both parties).</p>
                  <p className="text-gray-700 text-sm"><strong>Success factors:</strong> Open communication, willingness to compromise, focus on interests not positions, maintain professional relationship. If unsuccessful after 1-2 attempts: escalate to mediation.</p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">Mediation (Assisted Negotiation)</h4>
                  <p className="text-gray-700 text-sm mb-2"><strong>What is mediation:</strong> Neutral third party (mediator) helps parties reach voluntary settlement. Mediator facilitates discussion (does not impose decision). Process confidential (statements cannot be used in court later).</p>
                  <p className="text-gray-700 text-sm mb-2"><strong>Where to get mediation:</strong> Labour Office (free government service - most common), Private mediators (lawyers, dispute resolution centers - faster but costs KES 20,000-100,000), Trade unions (for members - free or subsidized).</p>
                  <p className="text-gray-700 text-sm mb-2"><strong>Mediation advantages:</strong> Faster than arbitration/court (30-60 days vs 6-18 months), Cheaper (free at Labour Office), Preserves relationship (less adversarial), Flexible solutions (creative settlements possible), Confidential (not public record).</p>
                  <p className="text-gray-700 text-sm"><strong>When mediation fails:</strong> Either party can walk away (non-binding until settlement signed). Proceed to arbitration or court. Mediation attempts strengthen position (shows good faith effort).</p>
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-600 p-5 rounded-lg">
                <p className="text-gray-700 text-sm"><strong>💡 Best practice:</strong> Always attempt negotiation/mediation before litigation. Courts favor parties who tried settlement (may award costs against party who refused reasonable offer). Settlement agreements: must be in writing, signed by both parties, witnessed, registered at Labour Office (becomes enforceable consent order).</p>
              </div>
            </div>
          </section>

          {/* Labour Department */}
          <section id="labour-department" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <Building2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Labour Department & Mediation Services</h2>
            </div>

            <div className="prose max-w-none">
              <div className="space-y-4 mb-6">
                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Role of Labour Office</h4>
                  <p className="text-gray-700 text-sm">County Labour Offices: handle individual employment disputes (unfair termination, non-payment, harassment). Labour Officers: government officials with dispute resolution powers (mediate, conciliate, issue compliance orders). Services provided: complaint registration (free), mediation hearings (free), compliance monitoring, advisory services (employment law questions). Jurisdiction: all individual disputes under Employment Act 2007 (not collective disputes - those go to Labour Relations Board).</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">How to Access Labour Office Services</h4>
                  <p className="text-gray-700 text-sm">Location: County Labour Office (one in each county - Nairobi has multiple locations). Find nearest office: Ministry of Labour website (labour.go.ke), County government offices, Directory assistance. Operating hours: Monday-Friday 8am-5pm (arrive early to avoid queues). No appointment needed: walk-in service for complaint filing. Bring: national ID, employment documents (contract, payslips, termination letter), evidence of dispute. Free service: no charges for mediation at Labour Office.</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Labour Officer Powers</h4>
                  <p className="text-gray-700 text-sm">Powers under Employment Act: Investigate disputes (request documents, interview witnesses), Summon parties (compel attendance at mediation), Mediate settlement (facilitate voluntary agreement), Issue compliance orders (if employer violating rights - e.g., order payment of wages), Refer to arbitration/court (if mediation fails), Monitor compliance (ensure settlement implemented). Labour Officer cannot: impose binding decision (only mediation, not adjudication - that's arbitrator/court role), award compensation directly (parties must agree or go to court), enforce orders without court (if employer refuses compliance = court enforcement needed).</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Mediation Process at Labour Office</h4>
                  <p className="text-gray-700 text-sm">Step 1: Employee files complaint (Form LR1 - provided at office). Step 2: Labour Officer reviews (within 7 days). Step 3: Summons to employer (by mail/courier - first hearing date set typically 14-21 days). Step 4: First mediation session (both parties present case, officer facilitates discussion). Step 5: Settlement or adjournment (if progress = adjourn to finalize terms, if impasse = refer to arbitration/court). Typical timeline: 30-60 days from filing to settlement/referral. Parties can bring: legal representative (optional), witnesses (if needed), evidence documents.</p>
                </div>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-600 p-5 rounded-lg">
                <p className="text-gray-700 text-sm"><strong>⚠️ Important:</strong> Labour Office mediation is FREE government service. Do not pay bribes or "facilitation fees" to Labour Officers (report corruption to Ethics & Anti-Corruption Commission). Service should be professional and timely. If delays or poor service: escalate complaint to County Labour Director or Ministry headquarters.</p>
              </div>
            </div>
          </section>

          {/* Filing Complaint */}
          <section id="filing-complaint" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Filing a Complaint at the Labour Office</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Detailed step-by-step process for filing employment dispute complaint:</p>

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

              <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg mt-6">
                <h4 className="font-bold text-gray-900 mb-2">💡 Filing Checklist</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>✓ National ID (original and copy)</li>
                  <li>✓ Employment contract (if available)</li>
                  <li>✓ Payslips (last 3-6 months)</li>
                  <li>✓ Termination letter (if dismissed)</li>
                  <li>✓ Correspondence (emails, letters, SMS)</li>
                  <li>✓ Witness contacts (colleagues who can testify)</li>
                  <li>✓ Bank statements (proving non-payment if wage claim)</li>
                  <li>✓ Written timeline (dates of key events)</li>
                  <li>✓ Complaint reference number (if follow-up)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Arbitration */}
          <section id="arbitration" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <Scale className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Arbitration Process in Kenya</h2>
            </div>

            <div className="prose max-w-none">
              <div className="space-y-4 mb-6">
                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">What is Arbitration</h4>
                  <p className="text-gray-700 text-sm">Arbitration: formal dispute resolution where neutral arbitrator hears evidence and makes binding decision (enforceable like court judgment). More formal than mediation (structured hearing, evidence rules) but less formal than court. Decision called "award" (final and binding). Appeal limited (only on points of law to Employment Court). Used when: mediation fails, parties want faster resolution than court, parties prefer privacy (not public hearing).</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Arbitration Procedure</h4>
                  <p className="text-gray-700 text-sm">Step 1: Referral from Labour Office (if mediation unsuccessful) OR direct agreement (parties can agree to arbitrate without mediation). Step 2: Arbitrator appointment (from Labour Department panel OR private arbitrator if parties agree). Step 3: Preliminary hearing (directions on timelines, evidence exchange, hearing date). Step 4: Evidence submission (both parties file written statements, documents). Step 5: Hearing (witnesses testify, cross-examination, legal arguments). Step 6: Award (arbitrator issues written decision typically within 30 days of hearing). Timeline: 3-6 months from referral to award.</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Arbitration Costs & Representation</h4>
                  <p className="text-gray-700 text-sm">Government arbitrator fees: KES 2,000-5,000 (waived for employees who cannot afford). Private arbitrator fees: KES 50,000-200,000+ (faster but expensive - typically employer pays if they choose private). Legal representation: recommended (arbitration quasi-judicial), lawyer costs KES 50,000-200,000 (depending on complexity). Employee legal aid: available from trade unions (for members), NGOs (FIDA Kenya, Labour Rights organizations), pro bono lawyers (some firms offer free services). Venue: Labour Office hearing room OR private arbitration center (if parties choose).</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Arbitration Award & Enforcement</h4>
                  <p className="text-gray-700 text-sm">Award content: findings of fact, application of law, decision (e.g., "employer terminated unfairly"), remedies ordered (reinstatement, compensation amount, payment timeline). Award binding: immediately enforceable (no need for further court order unless non-compliance). If employer does not comply: employee files enforcement application at Employment Court (court issues attachment orders, contempt proceedings if willful refusal). Appeal of award: to Employment Court within 30 days (grounds: error of law, procedural irregularity, award unreasonable), appeal does not suspend award (unless court grants stay of execution - rare).</p>
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-600 p-5 rounded-lg">
                <p className="text-gray-700 text-sm"><strong>Arbitration vs Court:</strong> Arbitration generally faster (3-6 months vs 6-18 months), cheaper (lower fees), more flexible (less strict procedures), private (not public record). Court advantages: more formal protections (strict evidence rules), established precedent (predictable outcomes), stronger enforcement (contempt powers). Most employment disputes: arbitration sufficient. Complex legal issues: court may be preferable.</p>
              </div>
            </div>
          </section>

          {/* Labour Court */}
          <section id="labour-court" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <Building2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Labour Court Procedures</h2>
            </div>

            <div className="prose max-w-none">
              <div className="space-y-4 mb-6">
                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Employment & Labour Relations Court</h4>
                  <p className="text-gray-700 text-sm">Specialized court: handles all employment and labour disputes (established 2011, replaced Industrial Court). Jurisdiction: unfair termination, discrimination, employment rights violations, enforcement of arbitration awards, appeals from arbitration, collective disputes, trade union matters. Locations: Nairobi (main registry), Mombasa, Kisumu, Eldoret, Nakuru. Judges: specialized in employment law (understand workplace dynamics and power imbalances).</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Court Filing Process</h4>
                  <p className="text-gray-700 text-sm">Step 1: Draft claim (plaint/originating summons - statement of facts, legal grounds, reliefs sought). Step 2: File at court registry (pay filing fees KES 2,000-10,000 depending on claim amount). Step 3: Service on employer (court serves respondent with court documents). Step 4: Employer response (statement of defense within 14 days). Step 5: Directions hearing (judge sets timelines for evidence, witness statements). Step 6: Pre-trial conference (settlement attempts, narrow issues). Step 7: Trial (witnesses testify, evidence presented, legal arguments). Step 8: Judgment (judge issues written decision). Timeline: 6-18 months from filing to judgment (varies by court backlog).</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Legal Representation & Costs</h4>
                  <p className="text-gray-700 text-sm">Lawyer essential: court procedures complex (strict rules of evidence, pleadings technical). Lawyer fees: Consultation KES 10,000-30,000, Full representation KES 100,000-500,000+ (depending on case complexity, senior vs junior lawyer). Legal aid: FIDA Kenya (for women and vulnerable groups - free), Trade unions (member services), Pro bono programs (some firms). Court costs: filing fees (KES 2,000-10,000), witness expenses, document photocopying. Costs award: losing party may be ordered to pay winner's legal costs (incentive to settle).</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Judgment & Appeals</h4>
                  <p className="text-gray-700 text-sm">Court judgment: written decision with reasons (findings of fact, application of law, orders). Remedies available: Reinstatement (employee gets job back), Compensation (up to 12 months salary for unfair termination), Payment of dues (unpaid wages, leave, benefits), General damages (distress, suffering), Injunctions (stop ongoing violations), Costs (legal fees). Judgment enforcement: if employer does not comply within 30 days = attachment orders (seize assets), garnishee orders (freeze bank accounts), contempt of court (imprisonment for willful refusal). Appeal: to Court of Appeal within 30 days (costs KES 200,000-1,000,000 lawyer fees, appeal bond typically 50% of award).</p>
                </div>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-600 p-5 rounded-lg">
                <p className="text-gray-700 text-sm"><strong>⚠️ Court vs Arbitration decision:</strong> Both parties have choice: employee can opt for court instead of arbitration (if prefers formal trial). Employer cannot force arbitration (if employee chooses court). Most disputes: arbitration recommended first (faster, cheaper). Court preferable if: complex legal issues, large compensation claim (over KES 1 million), seeking precedent (public judgment).</p>
              </div>
            </div>
          </section>

          {/* Timeline */}
          <section id="timeline" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Timeline for Resolving Disputes</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Expected timelines at each dispute resolution stage:</p>

              <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto mb-6">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Stage</th>
                      <th className="px-4 py-3 text-left font-semibold">Duration</th>
                      <th className="px-4 py-3 text-left font-semibold">Description</th>
                      <th className="px-4 py-3 text-left font-semibold">Outcome</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {resolutionTimeline.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                        <td className="px-4 py-3 font-semibold text-gray-900 text-sm">{item.stage}</td>
                        <td className="px-4 py-3 text-blue-600 font-semibold text-sm">{item.duration}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.description}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.outcome}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-3 mb-6">
                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Fastest Resolution Path</h4>
                  <p className="text-gray-700 text-sm">Internal negotiation (1-2 weeks) → Labour Office mediation (30-60 days) → Settlement = Total 6-10 weeks. Success factors: both parties willing to compromise, clear evidence, reasonable demands, maintain communication. Example: employee terminated, employer realizes error, reinstates with back pay = settled in 4 weeks via mediation.</p>
                </div>

                <div className="bg-orange-50 border-l-4 border-orange-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Slowest Resolution Path</h4>
                  <p className="text-gray-700 text-sm">Mediation fails → Arbitration (3-6 months) → Employer appeals → Court (6-18 months) → Employer appeals → Court of Appeal (12-24 months) → Enforcement (3-6 months) = Total 2-4+ years. Common in: high-value claims, employer has resources to delay, complex legal issues, parties unwilling to settle. Strategy: pursue settlement aggressively throughout (even during appeals - can settle anytime).</p>
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-600 p-5 rounded-lg">
                <p className="text-gray-700 text-sm"><strong>💡 Time-saving tips:</strong> File complaint immediately (do not wait), be organized with evidence (speeds up hearings), engage lawyer early (avoids procedural delays), pursue settlement actively (faster than full trial), attend all hearings (non-attendance causes adjournments), comply with court directions (timely filing of documents).</p>
              </div>
            </div>
          </section>

          {/* Protect Rights */}
          <section id="protect-rights" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How to Protect Your Rights During a Dispute</h2>
            </div>

            <div className="prose max-w-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      DO These Things
                    </h4>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>✓ Document everything (emails, messages, dates, witnesses)</li>
                      <li>✓ File complaint within 60 days deadline</li>
                      <li>✓ Keep copies of all employment documents</li>
                      <li>✓ Continue working if possible (maintains income)</li>
                      <li>✓ Attend all hearings punctually</li>
                      <li>✓ Seek legal advice early</li>
                      <li>✓ Report victimization immediately</li>
                      <li>✓ Preserve evidence (employer may destroy)</li>
                      <li>✓ Be professional and factual</li>
                      <li>✓ Consider settlement offers seriously</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-red-600" />
                      DON'T Do These Things
                    </h4>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>✗ Delay filing complaint (risk time-bar)</li>
                      <li>✗ Resign under pressure (hard to prove constructive dismissal)</li>
                      <li>✗ Accept verbal settlement (no proof)</li>
                      <li>✗ Discuss case on social media (weakens credibility)</li>
                      <li>✗ Threaten employer (creates evidence against you)</li>
                      <li>✗ Miss hearings (complaint may be dismissed)</li>
                      <li>✗ Destroy evidence</li>
                      <li>✗ Accept lowball offers without legal advice</li>
                      <li>✗ Be emotional or aggressive (unprofessional)</li>
                      <li>✗ Ignore settlement opportunities</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-600 p-5 rounded-lg mt-6">
                <h4 className="font-bold text-gray-900 mb-2">Evidence Collection Checklist</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm mb-1">Essential Documents:</p>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>✓ Employment contract (original or copy)</li>
                      <li>✓ Payslips (last 6-12 months)</li>
                      <li>✓ Bank statements (showing salary deposits)</li>
                      <li>✓ Termination letter (if dismissed)</li>
                      <li>✓ Warning letters (if any)</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm mb-1">Supporting Evidence:</p>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>✓ Email correspondence with employer</li>
                      <li>✓ WhatsApp/SMS messages</li>
                      <li>✓ Witness statements (colleagues)</li>
                      <li>✓ Medical reports (if harassment/stress)</li>
                      <li>✓ Performance reviews</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Common Mistakes */}
          <section id="common-mistakes" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Common Mistakes to Avoid</h2>
            </div>

            <div className="prose max-w-none">
              <div className="space-y-3">
                {commonMistakes.map((item, index) => (
                  <div key={index} className="bg-white border-l-4 border-red-600 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-1 flex items-start gap-2">
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      {item.mistake}
                    </h4>
                    <p className="text-red-700 text-sm mb-1"><strong>Consequence:</strong> {item.consequence}</p>
                    <p className="text-gray-700 text-sm"><strong>✓ Fix:</strong> {item.fix}</p>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg mt-6">
                <p className="text-gray-700 text-sm"><strong>Key takeaway:</strong> Most mistakes are preventable with: early legal advice (understand rights and procedure), proper documentation (evidence wins cases), timely action (respect deadlines), professional conduct (strengthens credibility), settlement mindset (litigation is risky and expensive). Small investment in lawyer consultation upfront saves costly mistakes later.</p>
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
              <h2 className="text-2xl font-bold mb-4">Need Help Resolving a Labour Dispute?</h2>
              <p className="text-blue-100 mb-6">Get professional guidance to protect your employment rights and resolve disputes efficiently.</p>
              
              <div className="flex flex-wrap gap-3">
                <a href="#filing-complaint" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  File Complaint Now
                </a>
                <a href="/kenya-employment-labour-laws" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
                  Know Your Rights <ArrowRight className="w-5 h-5" />
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
              <a href="/business-permits-licenses-kenya" className="p-4 border-2 border-orange-200 rounded-lg hover:shadow-lg transition-shadow hover:border-orange-600">
                <h4 className="font-bold text-gray-900 mb-1">Business Permits & Licenses</h4>
                <p className="text-gray-600 text-sm">Get required business operating permits</p>
              </a>
              <a href="/company-annual-returns-and-filing-kenya" className="p-4 border-2 border-purple-200 rounded-lg hover:shadow-lg transition-shadow hover:border-purple-600">
                <h4 className="font-bold text-gray-900 mb-1">Company Annual Returns</h4>
                <p className="text-gray-600 text-sm">File CR12 and stay compliant</p>
              </a>
              <a href="/business-tax-obligations-kenya" className="p-4 border-2 border-red-200 rounded-lg hover:shadow-lg transition-shadow hover:border-red-600">
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

export default LabourDisputeResolutionKenya;
