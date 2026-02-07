import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, FileText, Building2, AlertTriangle, BookOpen, Shield, Users, CheckCircle2, XCircle, Zap, Heart } from 'lucide-react';

const OccupationalHealthSafetyKenya = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // FAQ data - using double quotes to avoid apostrophe issues
  const faqs = [
    {
      question: "What is OSHA and does it apply in Kenya?",
      answer: "OSHA (Occupational Safety and Health Administration) is a US agency, but Kenya has its own occupational safety framework governed by the Occupational Safety and Health Act (OSHA 2007), Work Injury Benefits Act 2007, and employment regulations. In Kenya, workplace safety is mandatory under the Employment Act 2007, Labour Relations Act 2007, and specific sector regulations. Employers must provide a safe working environment. Violations result in: Fines (up to KES 500,000 for serious breaches), Work stoppage orders (business closure), Criminal prosecution (for serious injuries/deaths), Compensation liability (for injured workers). Applies to: All workplaces with one or more employee (no exemption), All sectors (construction, manufacturing, retail, offices, healthcare), All employment types (permanent, casual, fixed-term). Workplace safety is non-negotiable and non-waivable (even if employee agrees to unsafe conditions = void)."
    },
    {
      question: "What are employer obligations for workplace safety?",
      answer: "Legal obligations (Employment Act Sections 97-108): Provide safe working environment (free from foreseeable hazards), Maintain all equipment and machinery in safe working order, Conduct risk assessments (identify hazards before they cause harm), Provide protective equipment (free to employee, not deductible), Train employees on safety (induction and ongoing), Report accidents to authorities (within 48 hours), Investigate accidents and near-misses, Appoint safety committee/officer (if 10+ employees), Display safety information and warnings, First aid facilities (trained personnel, equipment), Ergonomic assessments (prevent musculoskeletal disorders), Health surveillance (medical check-ups if exposed to hazards). Specific obligations: Hazard communication (inform employees of dangers), Incident reporting procedures (clear process), Emergency response plan (evacuation, fire, medical), Regular inspections (at least monthly), Keep safety records (3-year retention). Cost responsibility: Employer covers all safety measures (cannot deduct from wages). Failure: Negligence claim, compensation liability, criminal charges."
    },
    {
      question: "What are employee rights regarding workplace safety?",
      answer: "Right to safe working conditions (Constitution Article 41, Employment Act). Specific rights: Right to refuse unsafe work (without penalty if genuine hazard), Right to information (about workplace hazards and safety procedures), Right to representation (through safety committee or delegate), Right to medical examination (if exposed to hazardous substances), Right to training (at employer expense), Right to protective equipment (provided free), Right to report hazards (without retaliation), Right to compensation (if injured due to employer negligence), Right to time off for safety training (paid). Protections: Anti-victimization (illegal to punish for reporting safety issues), Anti-discrimination (cannot exclude based on disability or health status), Whistleblower protection (reporting hazards protected activity). Practical implementation: Know your workplace hazards (ask questions if unclear), Use safety equipment provided (mandatory, not optional), Report unsafe conditions immediately (verbal or written), Document near-misses and injuries (keep records), Attend safety training (required, cannot refuse). If injured: Report within 24 hours, Seek medical attention (employer must pay), Document incident details, Report to labour authorities if serious."
    },
    {
      question: "What are common workplace hazards in Kenya?",
      answer: "Physical hazards: Loud noise (above 85 decibels damages hearing), Vibration (machinery, tools causing hand-arm syndrome), Temperature extremes (very hot or cold working areas), Lighting problems (poor visibility), Confined spaces (low oxygen, toxic gas risk), Falls (from heights, slippery surfaces), Moving machinery (unguarded parts), Electrical hazards (exposed wiring, wet conditions). Chemical hazards: Toxic substances (pesticides, cleaning chemicals, solvents), Asbestos (in old buildings, insulation), Dust exposure (silica, cement, grain dust causing respiratory disease), Fumes (from welding, painting, solvent use), Skin contact (caustic substances, irritants). Biological hazards: Bloodborne pathogens (healthcare workers, cleaners), Communicable diseases (infectious exposure), Mold and fungal spores (damp buildings), Food contamination (food handlers). Ergonomic hazards: Repetitive strain (typing, assembly line work), Poor posture (desk workers), Heavy lifting (back injury risk), Awkward positions (construction, nursing). Psychosocial hazards: Stress (excessive workload, impossible deadlines), Bullying/harassment (workplace violence), Discrimination (unfair treatment), Shift work (fatigue, sleep disruption). Construction-specific: Falls from heights, scaffolding collapse, electrocution, being struck by objects, trenching hazards, heavy equipment accidents."
    },
    {
      question: "How do employers conduct workplace safety audits?",
      answer: "Safety audit: Systematic review of workplace to identify hazards and compliance gaps. Step 1: Plan audit (decide scope: full building, specific department, safety systems), Schedule timing (at normal working hours to observe actual conditions), Assign auditor (safety officer, external consultant, or team), Communicate purpose (inform management and employees). Step 2: Inspect physical environment (walk all areas: production, offices, storage, restrooms, break areas), Check machinery and equipment (guards installed, maintenance records current, emergency stops working), Review electrical systems (proper wiring, no overloads, grounding), Assess manual handling (proper equipment available, ergonomics correct), Evaluate hazardous substances storage (locked, labeled, MSDS available), Check fire safety (extinguishers charged, emergency exits clear, evacuation routes marked). Step 3: Review documentation (safety policies current and accessible, risk assessments completed, training records, incident reports, medical surveillance), Inspect safety committee minutes, Check maintenance logs and repairs. Step 4: Interview employees (confidential conversations about hazards, near-misses, training adequacy), Ask about concerns, Document feedback. Step 5: Identify non-compliances (classify as critical, major, minor), Determine root causes. Step 6: Prepare report (findings, recommendations, timeline for corrections), Present to management with improvement plan. Frequency: Annual minimum, quarterly if high-risk sector, monthly visual inspections."
    },
    {
      question: "What is the process for reporting workplace accidents?",
      answer: "Immediate response (within minutes): Ensure immediate safety (stop hazardous activity, move to safety), Provide first aid (trained personnel, use first aid kit), Call ambulance if serious (life-threatening injury, unconsciousness), Move to hospital if needed (employer pays for all treatment). Notification (within 24 hours): Inform labour authorities (county labour office), Report to police (if criminal element suspected), Notify work injury benefits insurer (WIBA). Documentation: Record incident details (date, time, location, what happened), Identify witnesses (get names, phone numbers), Document injuries (specific body parts, severity), Take photographs (hazard, scene, injury if appropriate), Preserve evidence (do not disturb scene until documented). Investigation: Establish facts (what exactly happened, who was involved), Identify root cause (hazard, human error, system failure), Determine corrective actions, Meet with employee/witness (get full account). Report completion: Complete official accident report form (within 48 hours for serious injuries), File with labour office, Provide copy to injured employee. Follow-up: Review investigation findings, Implement corrective measures, Prevent recurrence (modify processes, training, hazard control), Document all corrections. Medical surveillance: Injured employee receives treatment (employer pays), Medical examination (assess fitness to return to work), Rehabilitation support (if ongoing treatment needed), Return to work plan (gradual resumption if partial incapacity). Legal notification: Serious injury (hospitalization required) = immediate police report, Fatal accident = immediate notification to all authorities, Criminal investigation likely."
    },
    {
      question: "What are penalties for workplace safety non-compliance?",
      answer: "Fines: Minor violations (missing documentation, incomplete training) = KES 50,000-100,000, Serious violations (unsafe equipment, hazard exposure) = KES 200,000-500,000, Very serious violations (leading to serious injury) = KES 500,000-1,000,000, Repeated violations within 12 months = double the fine. Work stoppage: Imminent danger = immediate business closure until hazard eliminated, Safety officer can issue closure order without court approval, Employer loses income during closure period. Prosecution: Criminal charges for gross negligence (especially if death results), Imprisonment up to 5 years (if death caused by recklessness), Director/manager personal liability (not just company), Fine of KES 500,000-2,000,000 for criminal conviction. Compensation liability: Medical expenses (all treatment costs), Loss of income (during recovery and incapacity), Permanent disability compensation (significant amount if lifelong incapacity), Death benefits (to dependents if fatal), Legal costs and exemplary damages (if gross negligence). License/permit revocation: Business license suspended or revoked, Sector-specific permits cancelled, Requirement to remediate before reopening. Civil lawsuits: Injured employee can sue employer (in addition to statutory compensation), Award ranges from hundreds of thousands to millions of shillings, Employer insurance may cover (not applicable if intentional harm). Reputational damage: Negative media coverage, Difficulty recruiting quality employees, Loss of contracts/customers (safety-conscious clients), Insurance premium increases."
    },
    {
      question: "What training is required for workplace safety?",
      answer: "Induction training (for all new employees): Workplace hazards (specific to their job), Safety rules and procedures (must know), Emergency procedures (evacuation, fire, medical response), Use of protective equipment (demonstration and practice), Reporting procedures (hazards and incidents). Frequency: Before starting work (on day 1), Refresher training annually minimum. Job-specific training: Based on role hazards, For example: Construction worker (fall prevention, equipment operation), Chemical handler (toxic substance exposure, emergency response), Healthcare worker (bloodborne pathogens, patient safety), Machinery operator (guarding, lockout procedures). Frequency: Upon assignment to role, When hazards change, At least annually. Safety committee/representative training: For committee members and delegates, Hazard identification, Investigation procedures, Documentation and reporting, Advocacy skills. Safety officer training (if appointed): Formal qualification (OSHA/OSH diploma), Advanced hazard recognition, Audit and inspection techniques, Legal compliance, Emergency management. First aid training: For designated first aid personnel, CPR and rescue breathing, Wound management and bleeding control, Fracture and sprain treatment, Recovery position. Frequency: Every 2-3 years renewal. Hazard-specific training: For exposure to particular hazards, For example: Asbestos handling, Bloodborne pathogens, Confined space entry, Electrical safety, Fall protection. Contractor safety: For external contractors working on-site, Site-specific hazards orientation, Company emergency procedures, Coordination with site safety officer. Documentation: Training attendance records (names, dates, topics), Competency assessments (employees understand), Training materials (saved, accessible), Trainer qualifications (verified)."
    },
    {
      question: "What should an occupational health and safety policy contain?",
      answer: "Policy statement: Company commitment to safety (signed by top management), Statement that safety has priority equal to production, Commitment to legal compliance and continuous improvement, Visible leadership and accountability. Objectives and targets: Specific goals (e.g., zero serious injuries, near-miss reporting rate, hazard correction timeline), Measurable targets (reduce incidents by X%, achieve Y% training compliance), Responsibility for achieving targets (assigned to specific roles). Scope and application: Applies to all employees, contractors, visitors, Applies to all workplace locations and operations, Applies 24/7/365 (covers shift work, emergencies). Roles and responsibilities: Management (allocate resources, set example, review compliance), Supervisors (monitor safety, train staff, investigate incidents), Employees (follow procedures, report hazards, use protection), Safety committee/officer (oversight, auditing, training), Health and safety representative (employee advocate). Hazard identification and risk management: Process for identifying hazards, Risk assessment methodology, Control measures (elimination, substitution, engineering, PPE), Regular review (at least annually). Incident reporting and investigation: Procedure to report incidents, Investigation process, Corrective action implementation, Documentation requirements. Training and competence: Training required for all roles, Induction process, Ongoing training frequency, Competency assessment. Consultation and communication: Employee consultation (how staff provide input), Communication channels (hazard awareness, changes), Safety committee structure and meeting frequency. Inspection and audit: Schedule for safety inspections, Audit frequency, Non-compliance follow-up. Emergency procedures: Evacuation procedures, First aid provision, Emergency contact information, Post-incident support. Monitoring and review: How compliance is measured, Regular review schedule (quarterly minimum), Board/management review (annually), Policy updates when needed. Accountability and discipline: Consequences for safety violations, Support for safe behavior, Incentives for safety performance. Employee rights: Right to safe conditions, Right to training, Right to refuse unsafe work, Right to report hazards without penalty. Implementation date and signature: Effective date, Signed by authorized management, Employee acknowledgment process."
    },
    {
      question: "How do employers prevent specific workplace hazards?",
      answer: "Fall prevention: Install guardrails (on heights above 2 meters), Proper scaffolding (inspected, certified, installed correctly), Harnesses and lanyards (for high-risk work), Non-slip surfaces (floors, stairs, platforms), Ladder safety (correct angle, securing, training). Chemical safety: Proper storage (locked, segregated, labeled), Personal protective equipment (gloves, respirators, eye protection), Ventilation systems (exhaust fumes immediately), Spill response (containment, cleanup procedure), Training (hazards, emergency response). Machinery safety: Guards (over moving parts, rotating shafts), Lockout/tagout (prevent accidental restart during maintenance), Emergency stops (easily accessible, visible), Training (proper operation, hazards), Maintenance schedule (preventive maintenance, inspection). Noise control: Engineering controls (quieter equipment, sound barriers), Administrative controls (limiting exposure time), Personal protective equipment (earplugs, earmuffs), Regular hearing tests (for exposed workers). Repetitive strain prevention: Ergonomic workstations (proper desk, chair, monitor height), Task rotation (vary activities), Regular breaks (reduce continuous strain), Stretching and exercises (prevent stiffness), Equipment modification (tools that reduce strain). Fire safety: Fire extinguishers (right type, accessible, inspected), Emergency exits (marked, clear, unlocked), Evacuation plan (practiced quarterly), Fire alarm system (working, tested), Housekeeping (no combustible clutter), Electrical maintenance (prevent overheating). Biological hazards (healthcare, food handling): Universal precautions (gloves, hand hygiene), Vaccination (hepatitis B, tetanus), Sharps disposal (puncture-proof containers), Bloodborne pathogens training, Regular testing (for exposure incidents). Electrical safety: Proper grounding (all equipment), Circuit breakers (prevent overload), Wet environment protection (GFCIs), Maintenance (regular inspection), Training (hazards, emergency procedures). Heat stress prevention: Adequate water supply (hydration), Rest breaks (in cool area), Light clothing (if appropriate), Medical surveillance (for vulnerable workers), Acclimatization (gradual exposure increase)."
    },
    {
      question: "What benefits do employers gain from workplace safety compliance?",
      answer: "Reduced costs: Lower workers compensation insurance premiums (insurers reward safety records), Fewer accidents mean lower claims, Reduced absenteeism (healthy employees attend more), Less medical expenses (prevented injuries cheaper than treating), Lower investigation and legal costs, No costly fines and penalties, Reduced business interruption (fewer shutdowns). Improved productivity: Healthier employees are more productive (fewer health problems), Higher morale (employees feel valued and protected), Better focus (less worry about safety concerns), Less absenteeism and presenteeism (people working while unwell), Reduced staff turnover (safer workplace = better retention), Better quality work (fewer distractions, better concentration). Enhanced reputation: Safer workplace attracts talent (competitive advantage in recruitment), Customers prefer safe employers (corporate responsibility matters), Better community relations (visible commitment to safety), Insurance companies may offer discounts for good records, Media positive coverage (safety achievements get attention). Legal compliance: Avoid fines and penalties, Prevent prosecutions of management, Protect company license and permits, Reduce liability in lawsuits (demonstrate reasonable care). Employee benefits: Lower absenteeism (staying healthy), Better morale (feeling protected), Career development (safety training builds skills), Reduced stress (knowing employer cares), Better work-life balance (not injured, working more). Operational benefits: Improved equipment reliability (maintained properly), Better asset protection (equipment lasts longer), Reduced production losses (fewer shutdowns), Lower replacement equipment costs (reduced damage), Competitive advantage (can bid for safety-conscious contracts), Market differentiation (safety is marketing point). Innovation benefits: Drives process improvement (finding safer ways to work), Technology adoption (new safety equipment and systems), Continuous learning culture (emphasis on improvement), Problem-solving skills develop (addressing hazards), Employee engagement (staff suggest safety improvements)."
    }
  ];

  // Hazard prevention table
  const hazardCategories = [
    {
      category: "Physical Hazards",
      examples: "Noise, vibration, temperature, falls, machinery",
      prevention: "Guards, barriers, PPE, ventilation, training",
      responsible: "Employer + Employee cooperation"
    },
    {
      category: "Chemical Hazards",
      examples: "Toxic substances, dust, fumes, asbestos",
      prevention: "Proper storage, ventilation, PPE, training",
      responsible: "Employer (chemical management)"
    },
    {
      category: "Biological Hazards",
      examples: "Bloodborne pathogens, communicable diseases",
      prevention: "Vaccination, universal precautions, training",
      responsible: "Employer (healthcare/cleaning sectors)"
    },
    {
      category: "Ergonomic Hazards",
      examples: "Repetitive strain, poor posture, heavy lifting",
      prevention: "Workstation assessment, task rotation, breaks",
      responsible: "Employer (workplace design)"
    },
    {
      category: "Psychosocial Hazards",
      examples: "Stress, harassment, bullying, discrimination",
      prevention: "Fair policies, support, counseling, training",
      responsible: "Employer (management responsibility)"
    }
  ];

  // Safety audit steps
  const auditSteps = [
    {
      number: 1,
      title: "Plan the Audit",
      description: "Decide scope (full site or specific areas), Schedule at normal working hours, Assign qualified auditor, Brief management and employees on process and timing."
    },
    {
      number: 2,
      title: "Inspect Physical Environment",
      description: "Walk all work areas (production, offices, storage, restrooms), Check machinery and equipment for guards and maintenance, Review electrical systems and wiring, Assess chemical storage and labeling, Evaluate ergonomic setup."
    },
    {
      number: 3,
      title: "Review Documentation",
      description: "Verify safety policies current and accessible, Check risk assessments completed, Review training records for all staff, Examine incident reports and corrective actions, Verify maintenance logs."
    },
    {
      number: 4,
      title: "Interview Employees",
      description: "Conduct confidential conversations about hazards, Ask about near-misses and concerns, Assess knowledge of safety procedures, Get feedback on training adequacy, Document suggestions."
    },
    {
      number: 5,
      title: "Identify Non-Compliances",
      description: "Classify findings (critical, major, minor), Determine root causes of issues, Assess severity and immediate risk, Prioritize corrective actions needed."
    },
    {
      number: 6,
      title: "Prepare Audit Report",
      description: "Document all findings with evidence, Include recommendations for each item, Propose timeline for corrections, Present to management with improvement plan, Schedule follow-up review."
    }
  ];

  // Safety compliance checklist
  const complianceChecklist = [
    {
      area: "Safety Policy & Planning",
      items: ["Written safety policy", "Objectives and targets set", "Roles and responsibilities defined", "Management commitment visible", "Legal compliance confirmed"]
    },
    {
      area: "Hazard Management",
      items: ["Risk assessments completed", "Hazards documented", "Control measures implemented", "PPE provided and used", "Engineering controls in place"]
    },
    {
      area: "Training & Competence",
      items: ["Induction training for new staff", "Job-specific training completed", "Safety committee/representatives trained", "First aid personnel designated", "Training records maintained"]
    },
    {
      area: "Emergency Preparedness",
      items: ["Evacuation procedures documented", "Fire extinguishers installed", "Emergency exits marked and clear", "First aid kit available", "Emergency drills conducted"]
    },
    {
      area: "Incident Management",
      items: ["Reporting procedure established", "Investigation process defined", "Corrective actions tracked", "Records maintained", "Authorities notified when required"]
    },
    {
      area: "Monitoring & Review",
      items: ["Regular inspections conducted", "Safety audits scheduled", "Near-misses tracked", "Incident trends analyzed", "Management review quarterly"]
    }
  ];

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'legal-framework', 'employer-obligations', 'employee-rights', 'hazards', 'compliance-checklist', 'safety-audit', 'accident-reporting', 'penalties', 'benefits', 'faqs'];
      
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
        <title>Occupational Health Safety OSHA Kenya – Compliance Guide</title>
        <meta name="description" content="Complete guide to occupational health and safety compliance in Kenya. OSHA regulations, employer obligations, employee rights, and workplace hazard prevention." />
        <link rel="canonical" href="https://yoursite.com/occupational-health-safety-kenya" />
        
        {/* OpenGraph */}
        <meta property="og:title" content="Occupational Health & Safety (OSHA) Kenya – Workplace Safety Guide 2026" />
        <meta property="og:description" content="Comprehensive guide to workplace safety compliance, hazard prevention, and OSHA regulations in Kenya." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://yoursite.com/occupational-health-safety-kenya" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=630&fit=crop" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Occupational Health & Safety (OSHA) Kenya – Workplace Safety Guide 2026" />
        <meta name="twitter:description" content="Employee and employer guide to workplace safety, hazard prevention, and OSHA compliance in Kenya." />
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
            "description": "Occupational health and safety guidance for Kenya"
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
                "name": "Occupational Health & Safety",
                "item": "https://yoursite.com/occupational-health-safety-kenya"
              }
            ]
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Conduct a Workplace Safety Audit in Kenya",
            "description": "Step-by-step guide to conducting an effective occupational health and safety audit",
            "step": auditSteps.map((step) => ({
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
              <Heart className="w-8 h-8 flex-shrink-0" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">Occupational Health & Safety (OSHA) in Kenya – Workplace Safety Guide 2026</h1>
            </div>
            <p className="text-blue-100 text-lg max-w-3xl">Complete guide to occupational health and safety compliance, workplace hazard prevention, and OSHA regulations under Kenya employment and labour laws.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#compliance-checklist" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Safety Checklist
              </a>
              <a href="#accident-reporting" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
                Report Hazard <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:block sticky top-0 bg-white shadow-md z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex gap-2 overflow-x-auto">
              {['overview', 'legal-framework', 'employer-obligations', 'employee-rights', 'hazards', 'compliance-checklist', 'safety-audit', 'accident-reporting', 'penalties', 'benefits', 'faqs'].map((section) => (
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
                  {section === 'overview' ? 'Overview' : section === 'legal-framework' ? 'Legal' : section === 'employer-obligations' ? 'Employer' : section === 'employee-rights' ? 'Employee' : section === 'hazards' ? 'Hazards' : section === 'compliance-checklist' ? 'Checklist' : section === 'safety-audit' ? 'Audit' : section === 'accident-reporting' ? 'Reporting' : section === 'penalties' ? 'Penalties' : section === 'benefits' ? 'Benefits' : 'FAQs'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden sticky top-0 bg-white shadow-md z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {['overview', 'employer-obligations', 'employee-rights', 'hazards', 'compliance-checklist', 'accident-reporting', 'faqs'].map((section) => (
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
                  {section === 'overview' ? 'Overview' : section === 'employer-obligations' ? 'Employer' : section === 'employee-rights' ? 'Employee' : section === 'hazards' ? 'Hazards' : section === 'compliance-checklist' ? 'Checklist' : section === 'accident-reporting' ? 'Reporting' : 'FAQs'}
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
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Introduction to Occupational Health & Safety in Kenya</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Occupational health and safety is the responsibility of employers to provide safe, healthy working environments for all employees. In Kenya, workplace safety is governed by multiple laws requiring employers to prevent hazards and protect worker wellbeing.</p>

              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&h=400&q=80"
                alt="Workplace occupational health and safety in Kenya"
                className="rounded-lg shadow-lg w-full mb-6"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">✓ Key Principles</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Employer responsible for safe conditions</li>
                    <li>• Hazards must be prevented, not just managed</li>
                    <li>• Employees have right to safe work</li>
                    <li>• Accidents are preventable through planning</li>
                    <li>• Compliance is non-negotiable legal requirement</li>
                  </ul>
                </div>

                <div className="bg-green-50 border-l-4 border-green-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">📋 Core Obligations</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Risk assessments and hazard identification</li>
                    <li>• Safe equipment and maintenance</li>
                    <li>• Training and supervision</li>
                    <li>• Protective equipment provision</li>
                    <li>• Incident reporting and investigation</li>
                  </ul>
                </div>
              </div>

              <p className="text-gray-700 mb-4"><strong>Importance:</strong> Workplace safety prevents suffering, protects productivity, reduces costs, and demonstrates ethical management. Accidents harm workers, damage operations, and create legal liability.</p>
            </div>
          </section>

          {/* Legal Framework */}
          <section id="legal-framework" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Legal Framework & Regulations</h2>
            </div>

            <div className="prose max-w-none">
              <div className="space-y-4 mb-6">
                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Occupational Safety and Health Act (OSHA) 2007</h4>
                  <p className="text-gray-700 text-sm">Primary legislation governing workplace safety. Applies to all workplaces with one or more employee. Establishes employer duty to provide safe working environment free from foreseeable hazards. Requires risk assessments, hazard control, training, and incident reporting. Non-compliance results in prosecution and penalties up to KES 1,000,000.</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Employment Act 2007 (Sections 97-108)</h4>
                  <p className="text-gray-700 text-sm">Covers workplace health and safety provisions. Employer must maintain safe machinery, equipment, and working environment. Employee right to refuse unsafe work. Compensation for work-related injuries. Establishes duty to report serious accidents to authorities within 48 hours.</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Work Injury Benefits Act 2007</h4>
                  <p className="text-gray-700 text-sm">Provides compensation for employees injured at work. Covers medical treatment, lost wages, permanent disability, and death benefits. No-fault compensation (employee does not need to prove negligence). Insurance mandatory for employers. Applies to all employment types.</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Constitution of Kenya 2010</h4>
                  <p className="text-gray-700 text-sm">Article 41: Right to fair labour practices including safe working environment. Non-discrimination in employment (Article 27). Health is a fundamental right (Article 43). Violations subject to constitutional remedies at High Court.</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Sector-Specific Regulations</h4>
                  <p className="text-gray-700 text-sm">Construction: Building and Construction Industry Act, Contractors Board regulations. Agriculture: Pesticide handling rules, machinery safety. Healthcare: Infection prevention, bloodborne pathogens. Manufacturing: Machinery guarding, chemical safety. Mining: Mining Act requirements, shaft safety. Each sector has additional specific requirements.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Employer Obligations */}
          <section id="employer-obligations" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <Building2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Employer Obligations for Workplace Safety</h2>
            </div>

            <div className="prose max-w-none">
              <div className="space-y-4 mb-6">
                <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">Primary Obligation: Safe Working Environment</h4>
                  <p className="text-gray-700 text-sm">Employer must provide workplace free from foreseeable hazards. This means: Identify potential dangers before they cause harm, Take steps to eliminate or reduce risks, Maintain equipment and facilities in safe condition, Provide necessary protective equipment, Supervise and train employees. This duty is non-delegable (employer responsible even if contractor hired).</p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">Risk Assessment and Hazard Identification</h4>
                  <p className="text-gray-700 text-sm">Employer must: Identify all workplace hazards (physical, chemical, biological, ergonomic, psychosocial), Assess risk level (probability and severity), Determine control measures (eliminate, substitute, engineer, administrative, PPE), Document findings in writing, Review regularly (at least annually, sooner if changes occur), Communicate results to employees and safety committee.</p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">Equipment Maintenance and Safety</h4>
                  <p className="text-gray-700 text-sm">Employer must: Maintain all machinery, equipment, tools in safe working order, Install guards on moving parts and rotating shafts, Implement lockout/tagout procedures (prevent restart during maintenance), Conduct regular inspections (at least monthly, more frequently for high-risk), Keep maintenance records (3-year retention), Replace or repair defective equipment immediately, Provide proper ventilation and environmental controls.</p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">Training and Supervision</h4>
                  <p className="text-gray-700 text-sm">Employer must: Provide induction training (before work starts), Job-specific training (hazards and procedures for role), Safety training (at least annually), Competency assessment (ensure employees understand), Documentation (attendance records), Adequate supervision (monitor safe practices), Refresher training (when procedures change or performance slips).</p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">Protective Equipment Provision</h4>
                  <p className="text-gray-700 text-sm">Employer must: Provide protective equipment appropriate to hazards (gloves, helmets, respirators, safety glasses, etc), Ensure equipment is in good working condition (inspected, replaced when damaged), Provide free of charge (cannot be deducted from wages), Provide training on proper use, Enforce use (discipline non-compliance), Store properly (protect from damage), Replace when worn or damaged.</p>
                </div>
              </div>

              <p className="text-gray-700 mb-4"><strong>Failure to comply:</strong> Negligence claim by injured employee, Regulatory fines and work stoppage orders, Criminal prosecution for serious violations, Civil liability for compensation (significant amounts).</p>
            </div>
          </section>

          {/* Employee Rights */}
          <section id="employee-rights" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <Users className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Employee Rights & Responsibilities in Workplace Safety</h2>
            </div>

            <div className="prose max-w-none">
              <div className="space-y-4 mb-6">
                <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Right to Safe Working Conditions</h4>
                  <p className="text-gray-700 text-sm">Employees have fundamental right to safe, healthy working environment. This includes: Free from foreseeable hazards, Adequate protective equipment, Proper training and supervision, Medical facilities and first aid, Information about workplace hazards, Right to refuse unsafe work (without penalty if genuine hazard), Right to compensation (if injured due to employer negligence).</p>
                </div>

                <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Right to Information and Training</h4>
                  <p className="text-gray-700 text-sm">Employees must receive: Information about workplace hazards (specific to their job), Safety procedures and emergency procedures, How to use protective equipment, Rights and responsibilities, How to report hazards and incidents, Competency-based training (understanding, not just attendance), Refresher training when procedures change.</p>
                </div>

                <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Right to Representation and Participation</h4>
                  <p className="text-gray-700 text-sm">Employees have right to: Participate in safety committee (if appointed), Elect safety representative (to advocate for employees), Be consulted on safety matters, Raise safety concerns without fear of punishment, Accompany inspector on safety visits, Access to inspection reports and audit results.</p>
                </div>

                <div className="bg-orange-50 border-l-4 border-orange-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Employee Responsibilities</h4>
                  <p className="text-gray-700 text-sm">Employees must: Follow safety procedures (mandatory), Use protective equipment correctly, Report hazards and near-misses immediately, Attend safety training, Cooperate with safety inspections, Not intentionally damage safety equipment, Report injuries promptly (within 24 hours minimum), Not work under influence of drugs/alcohol, Not endanger colleagues (duty of care to others).</p>
                </div>
              </div>
            </div>
          </section>

          {/* Hazards */}
          <section id="hazards" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Common Workplace Hazards & Prevention Methods</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">Understanding common hazards in Kenya workplaces enables targeted prevention:</p>

              <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto mb-6">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Hazard Category</th>
                      <th className="px-4 py-3 text-left font-semibold">Examples</th>
                      <th className="px-4 py-3 text-left font-semibold">Prevention Methods</th>
                      <th className="px-4 py-3 text-left font-semibold">Responsible Party</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {hazardCategories.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                        <td className="px-4 py-3 font-semibold text-gray-900 text-sm">{item.category}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.examples}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.prevention}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.responsible}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">Hierarchy of Controls (How to Prevent Hazards)</h4>
                <ol className="space-y-2 text-gray-700 text-sm">
                  <li><strong>1. Elimination:</strong> Remove hazard completely (best solution, stop use of harmful substance)</li>
                  <li><strong>2. Substitution:</strong> Replace hazard with safer alternative (use non-toxic cleaner instead of toxic one)</li>
                  <li><strong>3. Engineering Controls:</strong> Isolate hazard from workers (guards, ventilation, barriers)</li>
                  <li><strong>4. Administrative Controls:</strong> Change procedures/policies (rotate tasks, limit exposure time)</li>
                  <li><strong>5. Personal Protective Equipment:</strong> Last resort when other controls insufficient (gloves, masks, helmets)</li>
                </ol>
              </div>
            </div>
          </section>

          {/* Compliance Checklist */}
          <section id="compliance-checklist" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Safety Compliance Checklist</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Use this comprehensive checklist to assess and maintain workplace safety compliance:</p>

              <div className="space-y-4">
                {complianceChecklist.map((section, index) => (
                  <div key={index} className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      {section.area}
                    </h4>
                    <ul className="space-y-2">
                      {section.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <input type="checkbox" className="mt-1 accent-green-600" />
                          <span className="text-gray-700 text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Safety Audit */}
          <section id="safety-audit" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Steps to Conduct a Workplace Safety Audit</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Regular safety audits identify compliance gaps and hazards before they cause incidents:</p>

              <div className="space-y-4">
                {auditSteps.map((step) => (
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
                <h4 className="font-bold text-gray-900 mb-2">💡 Audit Best Practices</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Conduct annually minimum, more frequently for high-risk sectors</li>
                  <li>• Use qualified auditor (safety officer, external consultant)</li>
                  <li>• Observe actual working conditions (not just policies)</li>
                  <li>• Interview employees (get frontline perspective)</li>
                  <li>• Document findings with evidence (photos, dates, details)</li>
                  <li>• Prioritize findings (critical issues need immediate action)</li>
                  <li>• Track corrective actions (ensure completion and effectiveness)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Accident Reporting */}
          <section id="accident-reporting" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <Zap className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Reporting Workplace Accidents & Incidents</h2>
            </div>

            <div className="prose max-w-none">
              <div className="space-y-4 mb-6">
                <div className="bg-white border-l-4 border-red-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Immediate Response (Minutes)</h4>
                  <p className="text-gray-700 text-sm">Stop hazardous activity immediately (prevent further injury), Move injured person to safety, Provide first aid (trained personnel), Call ambulance if serious (life-threatening condition), Request medical assistance, Do not move injured person unnecessarily, Keep others away from scene.</p>
                </div>

                <div className="bg-white border-l-4 border-red-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Notification (Within 24 Hours)</h4>
                  <p className="text-gray-700 text-sm">Inform county labour office (phone or in-person), Report to police (if criminal element suspected: assault, sabotage), Notify work injury benefits insurer (WIBA), Inform management and safety committee, Contact injured employee's family.</p>
                </div>

                <div className="bg-white border-l-4 border-red-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Documentation</h4>
                  <p className="text-gray-700 text-sm">Record incident details: date, time, location, what happened. Identify witnesses: names, contact information. Document injuries: body parts affected, severity assessment. Take photographs: scene, hazard, injury (with consent). Preserve evidence: do not disturb scene. Collect statements: written accounts from witnesses, injured person.</p>
                </div>

                <div className="bg-white border-l-4 border-red-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Investigation & Follow-up</h4>
                  <p className="text-gray-700 text-sm">Establish facts: what exactly happened, who was involved, when. Identify root cause: hazard, human error, system failure. Determine corrective actions: how to prevent recurrence. Complete accident report form (within 48 hours for serious injuries). File with labour office and provide to employee. Implement preventive measures immediately. Follow up on injured employee: ensure medical treatment, support rehabilitation. Communicate findings to safety committee and all staff.</p>
                </div>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-600 p-5 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">⚠️ Critical: Serious Injury or Death</h4>
                <p className="text-gray-700 text-sm">Hospitalization required = immediate police report, Fatal accident = all authorities notified (police, labour office, WIBA), Criminal investigation likely, Business may be shutdown pending investigation, Do not disturb scene until police document, Cooperate fully with authorities.</p>
              </div>
            </div>
          </section>

          {/* Penalties */}
          <section id="penalties" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Penalties for Non-Compliance</h2>
            </div>

            <div className="prose max-w-none">
              <div className="space-y-3">
                <div className="bg-white border-l-4 border-red-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Financial Penalties (Fines)</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Minor violations (missing documentation): KES 50,000-100,000</li>
                    <li>• Serious violations (unsafe equipment): KES 200,000-500,000</li>
                    <li>• Very serious violations (leading to injury): KES 500,000-1,000,000</li>
                    <li>• Repeated violations (within 12 months): Double the fine</li>
                    <li>• Failure to comply with orders: KES 100,000-500,000 per day of delay</li>
                  </ul>
                </div>

                <div className="bg-white border-l-4 border-red-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Business Closure & Work Stoppage</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Imminent danger = immediate business closure order</li>
                    <li>• Safety officer authority (no court approval needed)</li>
                    <li>• Employer loses income during closure</li>
                    <li>• Must remediate hazards before reopening</li>
                  </ul>
                </div>

                <div className="bg-white border-l-4 border-red-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Criminal Prosecution</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Gross negligence charges (especially if death results)</li>
                    <li>• Imprisonment up to 5 years (director/manager personally)</li>
                    <li>• Fine of KES 500,000-2,000,000</li>
                    <li>• Personal liability (not just company)</li>
                    <li>• Criminal record consequences (insurance, future employment)</li>
                  </ul>
                </div>

                <div className="bg-white border-l-4 border-red-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">Compensation Liability</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Medical expenses (all treatment costs)</li>
                    <li>• Lost wages (during recovery and permanent incapacity)</li>
                    <li>• Disability compensation (significant for lifelong incapacity)</li>
                    <li>• Death benefits (to dependents if fatal)</li>
                    <li>• Legal costs and exemplary damages (if gross negligence)</li>
                  </ul>
                </div>

                <div className="bg-white border-l-4 border-red-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">License & Permit Revocation</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Business license suspension or permanent revocation</li>
                    <li>• Sector-specific permits cancelled</li>
                    <li>• Requirement to remediate before reopening</li>
                    <li>• Reputational damage (cannot operate under same name)</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Benefits */}
          <section id="benefits" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <Heart className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Benefits of Workplace Safety Compliance</h2>
            </div>

            <div className="prose max-w-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">💰 Financial Benefits</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Lower insurance premiums (5-20% discounts)</li>
                    <li>• Fewer accident claims (direct cost savings)</li>
                    <li>• Avoided fines and penalties (no regulatory costs)</li>
                    <li>• Reduced medical expenses (prevented injuries)</li>
                    <li>• No productivity losses (fewer stoppages)</li>
                  </ul>
                </div>

                <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">👥 Workforce Benefits</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Higher productivity (healthier, focused employees)</li>
                    <li>• Better morale (valued and protected)</li>
                    <li>• Lower turnover (safer = more retention)</li>
                    <li>• Easier recruitment (safety attracts talent)</li>
                    <li>• Reduced absenteeism (fewer health issues)</li>
                  </ul>
                </div>

                <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">🏆 Reputation & Market</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Attracts safety-conscious clients</li>
                    <li>• Positive media coverage</li>
                    <li>• Corporate responsibility credibility</li>
                    <li>• Competitive advantage in bidding</li>
                    <li>• Better community relations</li>
                  </ul>
                </div>

                <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">⚖️ Legal Benefits</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Legal compliance (avoid prosecution)</li>
                    <li>• Protection in lawsuits (demonstrate care)</li>
                    <li>• Reduced liability (documented safety measures)</li>
                    <li>• Insurance coverage (better terms)</li>
                    <li>• Regulatory goodwill (authorities support)</li>
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
              <h2 className="text-2xl font-bold mb-4">Ready to Ensure Workplace Safety?</h2>
              <p className="text-blue-100 mb-6">Implement these safety measures to protect your employees and your business from hazards and legal liability.</p>
              
              <div className="flex flex-wrap gap-3">
                <a href="#compliance-checklist" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Get Checklist
                </a>
                <a href="/labour-dispute-resolution-kenya" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
                  Legal Support <ArrowRight className="w-5 h-5" />
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
              <a href="/termination-redundancy-severance-kenya" className="p-4 border-2 border-purple-200 rounded-lg hover:shadow-lg transition-shadow hover:border-purple-600">
                <h4 className="font-bold text-gray-900 mb-1">Termination & Redundancy</h4>
                <p className="text-gray-600 text-sm">Rights and procedures for employment ending</p>
              </a>
              <a href="/business-permits-licenses-kenya" className="p-4 border-2 border-red-200 rounded-lg hover:shadow-lg transition-shadow hover:border-red-600">
                <h4 className="font-bold text-gray-900 mb-1">Business Permits & Licenses</h4>
                <p className="text-gray-600 text-sm">Operating permits and compliance</p>
              </a>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default OccupationalHealthSafetyKenya;
