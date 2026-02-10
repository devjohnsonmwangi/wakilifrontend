import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, AlertCircle, ArrowRight, FileText, Users, DollarSign, Building2, Heart, Clock, Download, BookOpen, Globe, Shield, BarChart } from 'lucide-react';

const NGOCBOSocietyRegistrationKenya = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // FAQ data
  const faqs = [
    {
      question: 'What is the difference between NGO, CBO and Society?',
      answer: 'NGO (Non-Governmental Organization): Formal organization, registered with NGO Coordination Board, operates at national/international level, must have constitution. CBO (Community Based Organization): Grassroots group, registered with County Social Development office, operates locally/community level, simpler registration than NGO. Society: Registered with Registrar of Societies, unincorporated association (not separate legal entity), used for: associations, clubs, churches, self-help groups, chamas. All three are nonprofit organizations but have different registration authorities and complexity levels.'
    },
    {
      question: 'Can a church register as an NGO or Society?',
      answer: 'Yes, but choice depends: Simple choice = register as Society (Registrar of Societies, KES 1,000-2,000, easy, for local churches). More formal = register as NGO (NGO Coordination Board, if doing community work beyond worship). Most churches register as Society (simpler, sufficient). If church wants to run development projects (schools, health clinics): may register as NGO for credibility/funding access.'
    },
    {
      question: 'How much does NGO registration cost in Kenya?',
      answer: 'NGO registration costs: Name search (KES 1,000), Registration fee to NGO Board (KES 3,000-10,000 depending on type), Lawyer fees for constitution drafting (KES 15,000-50,000 if hired), CBO registration: much cheaper (KES 500-2,000), Society registration: KES 1,000-2,000. Total NGO startup: KES 20,000-60,000 with lawyer. Without lawyer/using templates: KES 5,000-15,000.'
    },
    {
      question: 'Do I need a lawyer to register an NGO?',
      answer: 'Not legally required, but STRONGLY recommended. Lawyer helps with: Constitution drafting (ensures legal compliance), Application documentation (complete, correct), Negotiating with regulatory bodies (faster processing). DIY possible: use templates (available online), self-educate on requirements. DIY cheaper (KES 5K-15K) but riskier (rejections, delays, compliance issues). Professional lawyer costs KES 15K-50K but ensures smooth, compliant registration.'
    },
    {
      question: 'How long does NGO registration take?',
      answer: 'NGO registration: 2-6 months (varies). Timeline: Name search (1 week), Application submission (1 day), NGO Board review (4-8 weeks), Board decision (2-4 weeks). Delays if: incomplete documents, board requests clarification, high application volume. CBO registration: faster (2-4 weeks). Society registration: fastest (1-2 weeks). Plan for 2+ months if doing NGO to be safe.'
    },
    {
      question: 'Can an NGO make a profit?',
      answer: 'NGOs can earn revenue (donations, grants, service fees, business operations) but are NON-PROFIT organizations. Meaning: surplus profits must be: reinvested in organizational mission (NOT distributed to members), used for development programs, not paid as dividends to founders/members. If organization distributes profits to members = no longer nonprofit (becomes commercial company). Nonprofit status critical for: tax exemption, donor trust, grant eligibility.'
    },
    {
      question: 'What if my NGO application is rejected?',
      answer: 'NGO Board rejects applications for: Inadequate constitution, Missing required documents, Name already registered, Insufficient organizational readiness, Unclear mission/objectives. If rejected: Request written reasons from NGO Board, Address issues in constitution/documents, Reapply (costs another registration fee: KES 3,000-10,000). Some rejections appealable (depends on reason). Reapplication usually successful if you fix identified issues.'
    },
    {
      question: 'Can an individual start an NGO alone?',
      answer: 'No. NGO requires: minimum 3 founding members (trustees/directors), management structure (board of trustees, executive committee). One person cannot register NGO (needs organizational structure). CBO: similar, requires minimum 5-10 members (depending on county). Society: can be registered by 1+ persons, but better with minimum 5+ members (more credible). For solo nonprofit ventures: consider registering as Society (simpler), then expand to CBO/NGO as grow.'
    },
    {
      question: 'Do NGOs pay income tax?',
      answer: 'Registered NGOs in Kenya are EXEMPT from income tax (on nonprofit activities). Meaning: funds received for development work are NOT taxed. But: if NGO generates unrelated business income (e.g., rents property, runs commercial business): that income IS taxable. NGO exemption applies only to mission-related revenue. Registration with KRA required (to claim exemption status), but income tax returns still filed (showing exemption claimed). VAT exemption also possible (depends on activities).'
    },
    {
      question: 'What is a CBO exactly?',
      answer: 'CBO (Community Based Organization): Formal nonprofit organization registered with County Social Development office, operates within specific community/county, member-led and controlled, addresses local development issues (health, education, water, livelihoods, etc.). Examples: women\'s groups, youth associations, farmers\' cooperatives, health committees. CBOs smaller/simpler than NGOs, easier/cheaper registration, stronger community ties. Most community development work done by CBOs (vs. large NGOs).'
    },
    {
      question: 'Can an NGO and CBO work together?',
      answer: 'Yes, common partnership model: NGO provides: funding, technical support, policy advocacy. CBO provides: community presence, direct beneficiary contact, implementation on ground. NGO funds CBO projects, CBO implements. Partnership requires: written MOU (Memorandum of Understanding), clear roles, fund management agreement. Many CBOs partner with multiple NGOs (multiple funding streams).'
    },
    {
      question: 'What are the reporting requirements for registered NGOs?',
      answer: 'NGO annual reporting to NGO Board: Annual returns (due within 3 months of year-end), Financial statements (audited or reviewed, depending on size), List of current trustees/directors, Change of address/officials notification. CBOs: Report to County Social Development office (requirements vary by county). Societies: Less formal (no mandatory annual returns, but records kept). NGO compliance critical (non-compliance = potential deregistration, funding bans).'
    },
    {
      question: 'Can an NGO change its name after registration?',
      answer: 'Yes, but requires: Amendment to NGO Board registration (formal application), Updated constitution showing new name, Notification of change (published, if required), Re-registration fee may apply (KES 1,000-2,000). Name change involves administrative process (2-4 weeks). Must ensure new name not already registered. Better to choose correct name initially (avoids change costs/delays).'
    },
    {
      question: 'What is the role of NGO Coordination Board?',
      answer: 'NGO Coordination Board (NCB): Government body (under Interior Ministry) that: Registers and regulates NGOs, Reviews NGO constitutions for compliance, Issues NGO registration certificates, Monitors NGO compliance (financial reporting, annual returns), Addresses complaints against NGOs, Suspends/deregisters non-compliant NGOs. All NGOs working in Kenya (local or international) must register with NCB. NCB website: ngobureau.go.ke'
    },
    {
      question: 'Can a self-help group (chama) register as a society?',
      answer: 'Yes. Self-help groups (chamas, savings groups, rotating credit associations) can register as Societies with Registrar of Societies. Registration: KES 1,000-2,000, Simple process (1-2 weeks), Provides legal status. Unregistered chama: legally risky (disputes unprotected, no legal recourse). Registration benefits: Legal standing, ability to open bank accounts, dispute resolution (can go to court). Many chamas register (especially savings groups).'
    },
    {
      question: 'Do I need insurance for an NGO?',
      answer: 'Not legally required for registration, but HIGHLY RECOMMENDED (best practice): Organization liability insurance (covers lawsuits), Directors\' liability (protects trustees), Property insurance (office, equipment), Health insurance for staff (if employed). Insurance costs: KES 10,000-50,000/year (depends on scale). Many donors require insurance as funding condition. Better practice: carry insurance (protects operations, shows professionalism).'
    },
    {
      question: 'What happens if an NGO wants to close?',
      answer: 'NGO closure process: Board decision to dissolve, Update to NGO Board (formal notification), Distribution of assets (per constitution - usually donated to similar organization or retained for mission), Final financial reporting, Deregistration with NGO Board. Closure timeline: 2-3 months (if smooth). Assets cannot be distributed to members (must stay in nonprofit sector). Proper closure important (avoids regulatory issues).'
    },
    {
      question: 'Can an international NGO register in Kenya?',
      answer: 'Yes. International NGOs (foreign-based organizations) must: Register with NGO Coordination Board, Open local office in Kenya, Appoint local management/board, Follow Kenyan nonprofit regulations, File annual returns with NCB. International NGOs have same requirements as local NGOs (plus may face additional scrutiny). Many international NGOs registered in Kenya (working on development, humanitarian, rights issues). Registration enhances credibility, ensures compliance.'
    },
    {
      question: 'What is a constitution and why is it critical?',
      answer: 'Constitution: Written foundational document of NGO/CBO/Society that specifies: Purpose/mission of organization, Structure (board, committees, membership), Decision-making process, Leadership roles/duties, Member rights/responsibilities, Finance management, Amendment procedures, Dissolution clause. Constitution is CRITICAL because: Legal requirement (NCB won\'t register without), Guides all organizational decisions, Protects members/trustees legally, Donor requirement (for funding), Dispute resolution mechanism. Poorly drafted constitution = future conflicts/legal issues. Professional constitution drafting worth investment.'
    }
  ];

  // Organization types comparison
  const organizationComparison = [
    {
      aspect: 'Definition',
      ngo: 'Formal nonprofit organization registered with NGO Coordination Board',
      cbo: 'Community-based nonprofit group registered with County Social Development',
      society: 'Unincorporated association registered with Registrar of Societies'
    },
    {
      aspect: 'Scale/Scope',
      ngo: 'National or international level',
      cbo: 'Community/local level',
      society: 'Variable (can be small or large)'
    },
    {
      aspect: 'Minimum Members',
      ngo: '3+ founding members minimum',
      cbo: '5-10+ members (varies by county)',
      society: '1+ persons (better with 5+)'
    },
    {
      aspect: 'Registration Authority',
      ngo: 'NGO Coordination Board',
      cbo: 'County Social Development office',
      society: 'Registrar of Societies (National)'
    },
    {
      aspect: 'Registration Cost',
      ngo: 'KES 3,000-10,000',
      cbo: 'KES 500-2,000',
      society: 'KES 1,000-2,000'
    },
    {
      aspect: 'Processing Time',
      ngo: '2-6 months',
      cbo: '2-4 weeks',
      society: '1-2 weeks'
    },
    {
      aspect: 'Constitution Required',
      ngo: 'MANDATORY (detailed)',
      cbo: 'MANDATORY (simpler)',
      society: 'Required (simple)'
    },
    {
      aspect: 'Annual Returns',
      ngo: 'REQUIRED (to NGO Board)',
      cbo: 'REQUIRED (to County)',
      society: 'Not mandatory (but records kept)'
    },
    {
      aspect: 'Legal Status',
      ngo: 'Separate legal entity',
      cbo: 'Separate legal entity (registered)',
      society: 'Unincorporated (no separate entity)'
    },
    {
      aspect: 'Tax Exemption',
      ngo: 'Available (income tax, VAT)',
      cbo: 'Available (varies by county)',
      society: 'Not automatic (must apply)'
    }
  ];

  // NGO registration steps
  const ngoRegistrationSteps = [
    {
      number: 1,
      title: 'Determine Your Organization\'s Purpose & Structure',
      description: 'Decide: NGO\'s mission (development focus), vision, target beneficiaries, activities. Establish founding team (minimum 3 members who will serve as trustees). Define organizational structure: board of trustees, executive committee, staff roles. Document this clearly (forms basis of constitution).'
    },
    {
      number: 2,
      title: 'Draft Organization Constitution',
      description: 'Create written constitution (foundational document). Must include: organization name, mission/vision/objectives, board structure, membership procedures, decision-making processes, financial management, amendment procedures, dissolution clause. Use NGO Board template or hire lawyer (KES 15,000-50,000). Constitution critical for registration (must be compliant).'
    },
    {
      number: 3,
      title: 'Choose Organization Name & Check Availability',
      description: 'Choose unique NGO name (not already registered with NGO Board). Search NCB website or visit offices to confirm availability. Reserve name if needed (protects for 30-90 days). Choose professional name (reflects mission, memorable).'
    },
    {
      number: 4,
      title: 'Gather Founding Documents',
      description: 'Collect: Signed constitution (by all founding trustees), Trustees\' IDs/passports, Proof of office address (lease, ownership), Bank account details (if opening), Organization address (office location), Written mission statement, List of founding members with details.'
    },
    {
      number: 5,
      title: 'Open Organization Bank Account (Optional but Recommended)',
      description: 'Visit bank with: founder IDs, organization name, address, constitution. Open nonprofit bank account (makes financial management easier, shows credibility). Account helps with: managing donations, separating organizational funds, financial transparency. Not mandatory for registration but highly recommended.'
    },
    {
      number: 6,
      title: 'Complete NGO Board Registration Form',
      description: 'Download form from NGO Coordination Board website (ngobureau.go.ke) or collect at office. Form requires: organization details, trustees\' information, constitution copy, mission statement, office address, contact details. Review carefully (errors cause delays).'
    },
    {
      number: 7,
      title: 'Submit Application to NGO Coordination Board',
      description: 'Submit registration application with: Completed form, Constitution (signed), Trustees\' IDs copies, Proof of office address, Application fee (KES 3,000-10,000). Submit in person at NCB office (Nairobi or regional office) or by mail. Request receipt (proof of submission).'
    },
    {
      number: 8,
      title: 'NCB Reviews Application',
      description: 'NGO Board staff review application (4-8 weeks). They check: Constitution compliance, Organizational readiness, Name availability, Document completeness. May request: Additional information, Constitution amendments, Clarifications. Maintain communication (respond quickly to requests).'
    },
    {
      number: 9,
      title: 'Board Approves Registration',
      description: 'If approved: NGO Board issues registration certificate (proof NGO exists legally). Certificate shows: NGO name, registration number, date of registration, trustees\' names. Certificate needed for: bank accounts, donor applications, government contracts, legal contracts.'
    },
    {
      number: 10,
      title: 'Register with KRA for PIN & Tax Exemption',
      description: 'Visit KRA office or use iTax portal with: NGO registration certificate, trustees\' IDs, NGO address. Register for KRA PIN (Tax Identification Number). Apply for nonprofit tax exemption status (VAT, income tax). Process: 1-2 weeks. Exemption letter critical for donors (no tax on contributions).'
    }
  ];

  // CBO registration steps
  const cboRegistrationSteps = [
    {
      number: 1,
      title: 'Identify CBO Type & Community Focus',
      description: 'Determine: CBO\'s development focus (health, education, water, livelihoods, etc.), Target community/ward, Member base (5-10+ people minimum). Examples: women\'s group, youth association, farmer cooperative, health committee. Document purpose clearly.'
    },
    {
      number: 2,
      title: 'Establish CBO Committee & Rules',
      description: 'Form management committee (chairperson, secretary, treasurer, others). Draft simple bylaws/constitution (specifies roles, membership, decision-making). Get founding members to sign and approve. Rules should address: membership criteria, meeting frequency, fund management, decision process.'
    },
    {
      number: 3,
      title: 'Open Organization Bank Account',
      description: 'Visit bank with: committee members\' IDs, CBO name, address, simple bylaws. Open CBO bank account (enables fund management). Account shows: legitimacy, financial transparency, donor confidence. Highly recommended (though not technically required).'
    },
    {
      number: 4,
      title: 'Complete CBO Registration Form (County)',
      description: 'Obtain registration form from County Social Development office or county website. Form requires: CBO name, location (ward/sublocation), committee members\' details, bank account info, CBO objectives, activities planned. Each county has slightly different forms (check your county).'
    },
    {
      number: 5,
      title: 'Submit Application to County Social Development',
      description: 'Visit County office (Social Development/Community Development department) with: Completed form, Committee members\' IDs copies, Bank account proof, Simple bylaws (signed), CBO registration fee (KES 500-2,000, varies by county). Submit application, get receipt.'
    },
    {
      number: 6,
      title: 'County Reviews Application',
      description: 'County Social Development staff review (usually quick, 1-2 weeks). Check: Form completeness, Minimum member requirements, Community legitimacy. May request: Additional information or clarifications (less common than NGO Board). Usually approved if basic requirements met.'
    },
    {
      number: 7,
      title: 'Receive CBO Registration Certificate',
      description: 'County issues CBO registration certificate (proof CBO exists legally). Certificate shows: CBO name, registration number, date, county. Certificate needed for: bank accounts, grants, government support programs, community credibility.'
    },
    {
      number: 8,
      title: 'Register with KRA (if Required)',
      description: 'If CBO plans to earn revenue (service fees, enterprise): register for KRA PIN. If CBO only receives donations (no revenue): may not need KRA registration (varies by county). Check with county office on KRA registration requirement.'
    }
  ];

  // Society registration steps
  const societyRegistrationSteps = [
    {
      number: 1,
      title: 'Define Society Purpose & Get Members',
      description: 'Decide: Society\'s purpose (club, church, association, self-help group, chama). Gather minimum 5-10 members (ideally 10+, shows legitimacy). Examples: Youth group, Church congregation, Chama (savings group), Farmer association, Book club. Members form foundation of society.'
    },
    {
      number: 2,
      title: 'Draft Simple Constitution/Bylaws',
      description: 'Create written rules (simpler than NGO constitution): Name, purpose, membership criteria, leadership structure (chairperson, secretary, treasurer), Meeting procedures, Fund management, Decision-making process. Can be simple (1-2 pages). Use Registrar template or draft yourself.'
    },
    {
      number: 3,
      title: 'Obtain Registration Form from Registrar of Societies',
      description: 'Get form from: Registrar of Societies office (Nairobi or county offices) or website. Form requires: proposed society name, principal office address, founders/members details, constitution copy, society objectives, committee members.'
    },
    {
      number: 4,
      title: 'Have Form Signed by Founding Members',
      description: 'At least 5+ founding members must sign registration form and constitution. Signatures declare: they agree to form society, they accept constitution, they are members (or initial trustees). All signers provide: names, ID numbers, addresses, signatures (witnessed if possible).'
    },
    {
      number: 5,
      title: 'Submit Application to Registrar of Societies',
      description: 'Visit Registrar office or submit by mail with: Completed form, Signed constitution, Founders\' IDs copies (5+ minimum), Office address proof (if applicable), Registration fee (KES 1,000-2,000). For church: may require: church leaders\' letters, proof of congregation, simple bylaws.'
    },
    {
      number: 6,
      title: 'Registrar Reviews Application',
      description: 'Registrar staff review (quick process, usually 1-2 weeks). Check: Form completeness, Minimum member requirements (5+), Constitution adequacy. May request: Minor amendments, Additional info. Usually approved if basic requirements met (less complex than NGO).'
    },
    {
      number: 7,
      title: 'Receive Registration Certificate',
      description: 'Registrar issues registration certificate (Society officially registered). Certificate shows: Society name, registration number, date, founding members. Certificate proves: legal existence, authority to open bank accounts, right to own property (limited).'
    }
  ];

  // Documents table
  const documentsRequired = [
    { document: 'Duly Completed Registration Form', authority: 'Registering body', purpose: 'Official application for registration' },
    { document: 'Organization Constitution/Bylaws (signed)', authority: 'Organization', purpose: 'Foundational rules and governance' },
    { document: 'Founders/Trustees IDs or Passports (copies)', authority: 'Individuals', purpose: 'Identification verification' },
    { document: 'Proof of Office Address', authority: 'Landlord/owner', purpose: 'Physical location of organization' },
    { document: 'List of Founding Members/Trustees', authority: 'Organization', purpose: 'Names, addresses, ID numbers of leaders' },
    { document: 'Organization Mission Statement (written)', authority: 'Organization', purpose: 'Clear statement of purpose' },
    { document: 'Bank Account Details (if existing)', authority: 'Organization', purpose: 'Financial management proof' },
    { document: 'Registration Fee Payment Proof', authority: 'Organization', purpose: 'Proof of application fee paid' }
  ];

  // Costs table
  const costBreakdown = [
    { service: 'NGO Registration (NGO Board)', cost: 'KES 3,000-10,000' },
    { service: 'CBO Registration (County)', cost: 'KES 500-2,000' },
    { service: 'Society Registration (Registrar)', cost: 'KES 1,000-2,000' },
    { service: 'Lawyer (Constitution Drafting)', cost: 'KES 15,000-50,000' },
    { service: 'Name Search (NGO Board)', cost: 'KES 1,000' },
    { service: 'Bank Account Opening', cost: 'KES 0-500' },
    { service: 'KRA PIN Registration', cost: 'KES 0 (free)' },
    { service: 'Annual Audit (if required)', cost: 'KES 20,000-100,000' }
  ];

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'what-is', 'differences', 'which-choose', 'benefits', 'authorities', 'requirements', 'ngo-steps', 'cbo-steps', 'society-steps', 'documents', 'costs', 'timeline', 'bank-kra', 'compliance', 'mistakes', 'faqs'];
      
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
        <title>NGO, CBO & Society Registration Kenya – Guide 2026 & 2027</title>
        <meta name="description" content="Complete guide to NGO, CBO and society registration in Kenya. Step-by-step process, costs, requirements, authorities and legal compliance for nonprofits." />
        <link rel="canonical" href="https://yoursite.com/ngo-cbo-society-registration-kenya" />
        
        {/* OpenGraph */}
        <meta property="og:title" content="NGO, CBO & Society Registration Kenya – Complete Guide 2026 & 2027" />
        <meta property="og:description" content="Register an NGO, CBO or society in Kenya. Step-by-step guide covering registration process, costs, authorities, constitution, compliance and legal requirements." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://yoursite.com/ngo-cbo-society-registration-kenya" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=630&fit=crop" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="NGO, CBO & Society Registration Kenya – Guide 2026 & 2027" />
        <meta name="twitter:description" content="Step-by-step guide to registering NGOs, CBOs and societies in Kenya. Includes requirements, costs, timeline and all three registration pathways." />
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
            "description": "NGO, CBO and society registration services in Kenya"
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
                "name": "NGO, CBO & Society Registration",
                "item": "https://yoursite.com/ngo-cbo-society-registration-kenya"
              }
            ]
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Register NGO, CBO or Society in Kenya",
            "description": "Step-by-step guide to registering nonprofits in Kenya",
            "step": [
              ...ngoRegistrationSteps.map(step => ({
                "@type": "HowToStep",
                "position": step.number,
                "name": step.title,
                "text": step.description
              })),
              ...cboRegistrationSteps.slice(0, 4).map((step, idx) => ({
                "@type": "HowToStep",
                "position": ngoRegistrationSteps.length + idx + 1,
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
              <Heart className="w-8 h-8 flex-shrink-0" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">NGO, CBO & Society Registration in Kenya</h1>
            </div>
            <p className="text-blue-100 text-lg max-w-3xl">Complete guide to legally registering nonprofits in Kenya. Learn how to register NGOs with NGO Coordination Board, CBOs with county offices, and societies with Registrar. Includes step-by-step processes, costs, requirements and compliance.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="https://ngobureau.go.ke" target="_blank" rel="noopener noreferrer" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                NGO Coordination Board
              </a>
              <a href="/how-to-register-business-kenya" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
                Business Registration <ArrowRight className="w-5 h-5" />
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
              <li>NGO, CBO & Society Registration</li>
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
                    { id: 'what-is', label: 'What is NGO/CBO' },
                    { id: 'differences', label: 'Differences' },
                    { id: 'which-choose', label: 'Which to Choose' },
                    { id: 'benefits', label: 'Benefits' },
                    { id: 'authorities', label: 'Authorities' },
                    { id: 'requirements', label: 'Requirements' },
                    { id: 'ngo-steps', label: 'Register NGO' },
                    { id: 'cbo-steps', label: 'Register CBO' },
                    { id: 'society-steps', label: 'Register Society' },
                    { id: 'documents', label: 'Documents' },
                    { id: 'costs', label: 'Costs' },
                    { id: 'timeline', label: 'Timeline' },
                    { id: 'bank-kra', label: 'Bank & KRA' },
                    { id: 'compliance', label: 'Compliance' },
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
                    { id: 'what-is', label: 'What is NGO/CBO/Society' },
                    { id: 'differences', label: 'Differences' },
                    { id: 'which-choose', label: 'Which to Choose' },
                    { id: 'benefits', label: 'Benefits' },
                    { id: 'authorities', label: 'Legal Authorities' },
                    { id: 'requirements', label: 'Requirements' },
                    { id: 'ngo-steps', label: 'Register NGO' },
                    { id: 'cbo-steps', label: 'Register CBO' },
                    { id: 'society-steps', label: 'Register Society' },
                    { id: 'documents', label: 'Documents Required' },
                    { id: 'costs', label: 'Costs & Fees' },
                    { id: 'timeline', label: 'How Long It Takes' },
                    { id: 'bank-kra', label: 'Bank & KRA Setup' },
                    { id: 'compliance', label: 'Annual Compliance' },
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
                  <Globe className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">NGO, CBO & Society Registration Overview</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                    Kenya has three main types of <strong>nonprofit organizations</strong>: <strong>NGOs (Non-Governmental Organizations)</strong>, <strong>CBOs (Community Based Organizations)</strong>, and <strong>Societies</strong>. Each has different registration authority, complexity level, and cost. This guide explains all three and how to register.
                  </p>

                  <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border-l-4 border-blue-600">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-700 mb-1">3 Types</div>
                        <div className="text-xs text-gray-600">NGO / CBO / Society</div>
                        <p className="text-sm text-gray-700 mt-2">Different registration paths</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-700 mb-1">KES 1-10K</div>
                        <div className="text-xs text-gray-600">Registration Costs</div>
                        <p className="text-sm text-gray-700 mt-2">Society cheapest, NGO higher</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-700 mb-1">2-6 Months</div>
                        <div className="text-xs text-gray-600">Registration Timeline</div>
                        <p className="text-sm text-gray-700 mt-2">NGO slower, Society fastest</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">✅ Why Register Your Nonprofit?</h4>
                    <p className="text-gray-700 text-sm">Legal recognition (organization exists in law), Bank account access (separate account), Tax exemption (donations tax-free), Donor credibility (grants and funding), Government support (if eligible), Legal protection (ability to sue/be sued), Future growth (easier to scale).</p>
                  </div>
                </div>
              </section>

              {/* What is NGO/CBO/Society */}
              <section id="what-is" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <BookOpen className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What is an NGO, CBO or Society?</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Understanding the three nonprofit types:</p>

                  <div className="space-y-4 mb-6">
                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">🌍 NGO (Non-Governmental Organization)</h4>
                      <p className="text-gray-700 text-sm mb-2"><strong>Definition:</strong> Formal nonprofit organization registered with NGO Coordination Board (NCB), operates at national or international scale, focuses on development/humanitarian work.</p>
                      <p className="text-gray-700 text-sm mb-2"><strong>Characteristics:</strong> Formal structure (board of trustees, executives), Must have detailed constitution, Operates nationwide (not limited to one community), Often does advocacy/policy work alongside direct services.</p>
                      <p className="text-gray-700 text-sm"><strong>Examples:</strong> International relief organizations, national development NGOs, rights organizations, healthcare NGOs.</p>
                    </div>

                    <div className="bg-white border-2 border-green-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">👥 CBO (Community Based Organization)</h4>
                      <p className="text-gray-700 text-sm mb-2"><strong>Definition:</strong> Grassroots nonprofit organization registered with County Social Development office, operates at community/local level, member-controlled.</p>
                      <p className="text-gray-700 text-sm mb-2"><strong>Characteristics:</strong> Rooted in specific community/ward, Simpler structure than NGO, Direct community member involvement, Address local development needs (health, education, water, livelihoods).</p>
                      <p className="text-gray-700 text-sm"><strong>Examples:</strong> Women's groups, youth associations, farmers' cooperatives, health committees, water user associations, village savings groups.</p>
                    </div>

                    <div className="bg-white border-2 border-purple-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">📖 Society</h4>
                      <p className="text-gray-700 text-sm mb-2"><strong>Definition:</strong> Unincorporated association registered with Registrar of Societies, used for groups with shared purpose (clubs, churches, associations, chamas).</p>
                      <p className="text-gray-700 text-sm mb-2"><strong>Characteristics:</strong> Unincorporated (not separate legal entity), Simpler registration process, Can be for various purposes (religious, cultural, commercial association), Members have equal standing.</p>
                      <p className="text-gray-700 text-sm"><strong>Examples:</strong> Churches/synagogues, sports clubs, alumni associations, chamas (savings groups), book clubs, professional associations, burial societies.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Differences */}
              <section id="differences" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <BarChart className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Differences Between NGO, CBO and Society</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Key differences to help you choose:</p>

                  <img 
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop"
                    alt="NGO, CBO and Society Differences"
                    className="rounded-lg shadow-lg w-full mb-6"
                  />

                  <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">Aspect</th>
                          <th className="px-4 py-3 text-left font-semibold">NGO</th>
                          <th className="px-4 py-3 text-left font-semibold">CBO</th>
                          <th className="px-4 py-3 text-left font-semibold">Society</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {organizationComparison.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-semibold text-gray-900 text-sm">{item.aspect}</td>
                            <td className="px-4 py-3 text-gray-700 text-sm">{item.ngo}</td>
                            <td className="px-4 py-3 text-gray-700 text-sm">{item.cbo}</td>
                            <td className="px-4 py-3 text-gray-700 text-sm">{item.society}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* Which to Choose */}
              <section id="which-choose" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Which One Should You Choose?</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Decision guide:</p>

                  <div className="space-y-4 mb-6">
                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">Choose NGO if...</h4>
                      <ul className="space-y-1 text-gray-700 text-sm">
                        <li>✓ Operating at national or international scale</li>
                        <li>✓ Seeking international funding/grants</li>
                        <li>✓ Formal organizational structure needed</li>
                        <li>✓ Doing policy advocacy work</li>
                        <li>✓ Have 3+ founding members ready</li>
                      </ul>
                    </div>

                    <div className="bg-white border-2 border-green-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">Choose CBO if...</h4>
                      <ul className="space-y-1 text-gray-700 text-sm">
                        <li>✓ Operating within specific community/ward</li>
                        <li>✓ Grassroots, community-led development work</li>
                        <li>✓ Want simpler, faster registration</li>
                        <li>✓ Lower budget (less formal)</li>
                        <li>✓ 5-10+ community members involved</li>
                      </ul>
                    </div>

                    <div className="bg-white border-2 border-purple-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">Choose Society if...</h4>
                      <ul className="space-y-1 text-gray-700 text-sm">
                        <li>✓ Running church, club, or association</li>
                        <li>✓ Starting savings group (chama) or rotating credit</li>
                        <li>✓ Want fastest, simplest registration</li>
                        <li>✓ Lowest costs (very affordable)</li>
                        <li>✓ Don't need separate legal entity</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">💡 Common Scenario</h4>
                    <p className="text-gray-700 text-sm mb-2"><strong>Many organizations start as Society or CBO (fast, cheap), then scale to NGO later.</strong> Example: Start as church/community group (Society), grow programs, later register as NGO for grants. This staged approach is normal and acceptable.</p>
                  </div>
                </div>
              </section>

              {/* Benefits */}
              <section id="benefits" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Heart className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Benefits of Registering Your Nonprofit</h2>
                </div>

                <div className="prose max-w-none">
                  <div className="space-y-3 mb-6">
                    <div className="bg-white border-2 border-green-200 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">✅ Legal Recognition</h4>
                      <p className="text-gray-700 text-sm">Organization legally exists. Can enter contracts, own property (limited), sign agreements.</p>
                    </div>

                    <div className="bg-white border-2 border-green-200 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">✅ Tax Exemption</h4>
                      <p className="text-gray-700 text-sm">Registered nonprofits exempt from income tax (on nonprofit activities). Donors may claim deductions (increases donations). VAT exemption possible.</p>
                    </div>

                    <div className="bg-white border-2 border-green-200 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">✅ Bank Accounts & Financial Management</h4>
                      <p className="text-gray-700 text-sm">Open organization bank account (separate from personal). Demonstrates financial transparency, improves donor confidence.</p>
                    </div>

                    <div className="bg-white border-2 border-green-200 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">✅ Access to Funding</h4>
                      <p className="text-gray-700 text-sm">Eligible for grants, donations, government support programs. Registered status critical for donor applications.</p>
                    </div>

                    <div className="bg-white border-2 border-green-200 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">✅ Government Contracts & Services</h4>
                      <p className="text-gray-700 text-sm">Access government contracts, tenders, and service delivery partnerships (if eligible). Registered status often required.</p>
                    </div>

                    <div className="bg-white border-2 border-green-200 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">✅ Legal Protection & Rights</h4>
                      <p className="text-gray-700 text-sm">Can sue or be sued (legal remedies). Ability to own property, sign contracts, enforce agreements. Protection from personal liability (some structures).</p>
                    </div>

                    <div className="bg-white border-2 border-green-200 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">✅ Credibility & Trust</h4>
                      <p className="text-gray-700 text-sm">Registration demonstrates legitimacy. Members, donors, partners more confident. Professional standing in community.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Authorities */}
              <section id="authorities" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Building2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Legal Authorities Involved</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Different authorities regulate each nonprofit type:</p>

                  <div className="space-y-4 mb-6">
                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">🌐 NGO Coordination Board (NCB)</h4>
                      <p className="text-gray-700 text-sm mb-2"><strong>Role:</strong> Registers and regulates NGOs in Kenya (government body under Interior Ministry).</p>
                      <p className="text-gray-700 text-sm mb-2"><strong>Functions:</strong> Review NGO constitutions, Issue registration certificates, Monitor annual returns/compliance, Address NGO complaints, Suspend/deregister non-compliant NGOs.</p>
                      <p className="text-gray-700 text-sm mb-2"><strong>Website:</strong> ngobureau.go.ke</p>
                      <p className="text-gray-700 text-sm"><strong>Location:</strong> Nairobi (HQ), regional offices nationwide.</p>
                    </div>

                    <div className="bg-white border-2 border-green-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">🏛️ County Social Development Office</h4>
                      <p className="text-gray-700 text-sm mb-2"><strong>Role:</strong> Registers and oversees CBOs at county level (different office in each county).</p>
                      <p className="text-gray-700 text-sm mb-2"><strong>Functions:</strong> CBO registration, Monitor CBO compliance, Support community development, Coordinate with national government.</p>
                      <p className="text-gray-700 text-sm mb-2"><strong>Location:</strong> County offices (check your county social development department).</p>
                      <p className="text-gray-700 text-sm"><strong>Note:</strong> Each county slightly different processes (check specific county).</p>
                    </div>

                    <div className="bg-white border-2 border-purple-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">📋 Registrar of Societies</h4>
                      <p className="text-gray-700 text-sm mb-2"><strong>Role:</strong> Registers societies and unincorporated associations (national government office).</p>
                      <p className="text-gray-700 text-sm mb-2"><strong>Functions:</strong> Society registration, Issue registration certificates, Maintain society records, Simple registration process.</p>
                      <p className="text-gray-700 text-sm mb-2"><strong>Website:</strong> ICT Board or Attorney General website</p>
                      <p className="text-gray-700 text-sm"><strong>Offices:</strong> Nairobi (HQ), county offices.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Requirements */}
              <section id="requirements" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Requirements Before You Apply</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">What you need before starting registration process:</p>

                  <div className="space-y-3 mb-6">
                    <div className="bg-white border-2 border-blue-200 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">👥 Founding Members (3+ for NGO, 5+ for CBO/Society)</h4>
                      <p className="text-gray-700 text-sm">All founders ready to be trustees/committee members. Must provide IDs and accept responsibility.</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">📋 Constitution/Bylaws (Written Rules)</h4>
                      <p className="text-gray-700 text-sm">Detailed for NGO (mandatory), simpler for CBO/Society. Specifies organization purpose, structure, decision-making, leadership roles, financial management. Can use template or hire lawyer.</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">📍 Physical Office Address</h4>
                      <p className="text-gray-700 text-sm">Real location (office, shop, or even home). Must provide proof (lease agreement, ownership, utility bill). Address registered with authorities.</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">🎯 Clear Mission/Purpose Statement</h4>
                      <p className="text-gray-700 text-sm">Written statement of what organization does. Examples: "Provide healthcare to rural communities," "Advance youth skills," "Run savings group."</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">💳 Unique Organization Name</h4>
                      <p className="text-gray-700 text-sm">Not already registered with same authority. Check availability before applying. Professional name recommended (reflects mission).</p>
                    </div>

                    <div className="bg-white border-2 border-blue-200 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">💰 Registration Fee</h4>
                      <p className="text-gray-700 text-sm">NGO: KES 3,000-10,000. CBO: KES 500-2,000. Society: KES 1,000-2,000. Have payment method ready (cash, card, mobile money depending on authority).</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* NGO Steps */}
              <section id="ngo-steps" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Globe className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Step-by-Step NGO Registration Process</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">How to register an NGO with NGO Coordination Board:</p>

                  <div className="space-y-4 mb-6">
                    {ngoRegistrationSteps.map((step) => (
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
                </div>
              </section>

              {/* CBO Steps */}
              <section id="cbo-steps" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Users className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Step-by-Step CBO Registration Process</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">How to register a CBO with County Social Development office:</p>

                  <div className="space-y-4 mb-6">
                    {cboRegistrationSteps.map((step) => (
                      <div key={step.number} className="bg-white border-2 border-gray-200 p-6 rounded-xl">
                        <div className="flex gap-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white font-bold flex-shrink-0">
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
                </div>
              </section>

              {/* Society Steps */}
              <section id="society-steps" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Step-by-Step Society/Church Registration</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">How to register a society, church or association with Registrar:</p>

                  <div className="space-y-4 mb-6">
                    {societyRegistrationSteps.map((step) => (
                      <div key={step.number} className="bg-white border-2 border-gray-200 p-6 rounded-xl">
                        <div className="flex gap-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white font-bold flex-shrink-0">
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
                </div>
              </section>

              {/* Documents */}
              <section id="documents" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Documents Required for Registration</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Documentation needed across all nonprofit types:</p>

                  <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">Document</th>
                          <th className="px-4 py-3 text-left font-semibold">From</th>
                          <th className="px-4 py-3 text-left font-semibold">Purpose</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {documentsRequired.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-semibold text-gray-900 text-sm">{item.document}</td>
                            <td className="px-4 py-3 text-gray-700 text-sm">{item.authority}</td>
                            <td className="px-4 py-3 text-gray-700 text-sm">{item.purpose}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* Costs */}
              <section id="costs" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <DollarSign className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Registration Fees & Total Costs</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Complete cost breakdown for nonprofit registration:</p>

                  <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto mb-6">
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
                    <p className="text-gray-700 text-sm mb-2"><strong>Society Registration (DIY):</strong> KES 1,000-2,500 (cheapest option).</p>
                    <p className="text-gray-700 text-sm mb-2"><strong>CBO Registration (DIY):</strong> KES 1,000-3,000 (quick, affordable).</p>
                    <p className="text-gray-700 text-sm mb-2"><strong>NGO Registration (with lawyer):</strong> KES 20,000-60,000 (most expensive, professional help).</p>
                    <p className="text-gray-700 text-sm"><strong>NGO Registration (DIY):</strong> KES 5,000-15,000 (budget option, riskier).</p>
                  </div>
                </div>
              </section>

              {/* Timeline */}
              <section id="timeline" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How Long Registration Takes</h2>
                </div>

                <div className="prose max-w-none">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl text-center">
                      <h4 className="font-bold text-gray-900 mb-2">NGO Registration</h4>
                      <div className="text-2xl font-bold text-blue-600 mb-2">2-6 Months</div>
                      <p className="text-gray-700 text-sm">Most complex. NCB review: 4-8 weeks. Delays possible if revisions needed.</p>
                    </div>

                    <div className="bg-white border-2 border-green-200 p-5 rounded-xl text-center">
                      <h4 className="font-bold text-gray-900 mb-2">CBO Registration</h4>
                      <div className="text-2xl font-bold text-green-600 mb-2">2-4 Weeks</div>
                      <p className="text-gray-700 text-sm">Faster than NGO. County review: 1-2 weeks. Simpler process.</p>
                    </div>

                    <div className="bg-white border-2 border-purple-200 p-5 rounded-xl text-center">
                      <h4 className="font-bold text-gray-900 mb-2">Society Registration</h4>
                      <div className="text-2xl font-bold text-purple-600 mb-2">1-2 Weeks</div>
                      <p className="text-gray-700 text-sm">Fastest option. Registrar straightforward process. Usually smooth.</p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">⏱️ Timeline Tips</h4>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• Submit with complete documents (speeds process)</li>
                      <li>• Respond quickly to information requests</li>
                      <li>• Visit office early if possible (reduces queue time)</li>
                      <li>• For NGO: plan for 2+ months minimum (don't rush)</li>
                      <li>• Have backup documents ready (originates claims)</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Bank & KRA */}
              <section id="bank-kra" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Building2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Bank Account & KRA PIN Setup</h2>
                </div>

                <div className="prose max-w-none">
                  <div className="space-y-4 mb-6">
                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">🏦 Opening Organization Bank Account</h4>
                      <p className="text-gray-700 text-sm mb-2"><strong>Why Important:</strong> Separates organization money from personal funds, shows financial transparency, improves donor confidence, enables fundraising.</p>
                      <p className="text-gray-700 text-sm mb-2"><strong>Requirements:</strong> Registration certificate (from NCB/County/Registrar), Committee members' IDs, Organization address proof, Simple or detailed constitution.</p>
                      <p className="text-gray-700 text-sm mb-2"><strong>Process:</strong> Visit bank, complete account opening form, submit documents. Usually takes 1-3 days. Cost: usually free or minimal (KES 0-500).</p>
                      <p className="text-gray-700 text-sm"><strong>Best Practice:</strong> Open account BEFORE starting operations (prevents mixing personal/organization funds).</p>
                    </div>

                    <div className="bg-white border-2 border-green-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">📌 KRA PIN Registration (for Tax Exemption)</h4>
                      <p className="text-gray-700 text-sm mb-2"><strong>What is KRA PIN:</strong> Tax Identification Number from Kenya Revenue Authority (required for all organizations earning revenue).</p>
                      <p className="text-gray-700 text-sm mb-2"><strong>Why Register:</strong> Claim income tax exemption (nonprofits don't pay income tax), VAT exemption (if eligible), Required by banks for some accounts, Legal requirement if earning revenue.</p>
                      <p className="text-gray-700 text-sm mb-2"><strong>Process:</strong> Submit application to KRA (iTax portal or office) with: registration certificate, trustees' IDs, organization address. Takes 1-2 weeks. Cost: FREE.</p>
                      <p className="text-gray-700 text-sm"><strong>Exemption Certificate:</strong> After PIN registration, apply for nonprofit exemption letter (shows KRA recognizes tax-exempt status). Needed for: donors, grant applications, government contracts.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Compliance */}
              <section id="compliance" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Annual Returns & Compliance Requirements</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">After registration, nonprofits have ongoing compliance duties:</p>

                  <div className="space-y-4 mb-6">
                    <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">📋 NGO Annual Returns (to NGO Board)</h4>
                      <p className="text-gray-700 text-sm mb-2"><strong>Requirement:</strong> File annual returns every year within 3 months of financial year end.</p>
                      <p className="text-gray-700 text-sm mb-2"><strong>Contents:</strong> Financial statements (income/expenses), List of current trustees/directors, Changes in leadership/address, Annual activity report.</p>
                      <p className="text-gray-700 text-sm mb-2"><strong>Consequence of Non-Compliance:</strong> Penalties, potential suspension, deregistration.</p>
                    </div>

                    <div className="bg-white border-2 border-green-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">📋 CBO Reporting (to County Office)</h4>
                      <p className="text-gray-700 text-sm mb-2"><strong>Requirement:</strong> Report to County Social Development (varies by county, check specific requirements).</p>
                      <p className="text-gray-700 text-sm mb-2"><strong>Typical Requirements:</strong> Annual activity report, Financial reports, Leadership changes, Beneficiary numbers.</p>
                      <p className="text-gray-700 text-sm"><strong>Frequency:</strong> Usually annual (some counties quarterly). Follow your county's guidelines.</p>
                    </div>

                    <div className="bg-white border-2 border-purple-200 p-5 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-2">📋 Society/Church Compliance</h4>
                      <p className="text-gray-700 text-sm mb-2"><strong>Requirement:</strong> No mandatory annual returns to Registrar (simpler than NGO/CBO).</p>
                      <p className="text-gray-700 text-sm mb-2"><strong>Good Practice:</strong> Keep records (membership, meetings, finances) for 5+ years, Maintain updated leadership/member list, Hold annual meetings (per constitution).</p>
                      <p className="text-gray-700 text-sm"><strong>Deregistration:</strong> If inactive for 2+ years, may be deregistered (but no active penalty like NGO).</p>
                    </div>
                  </div>

                  <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">✅ Compliance Tips</h4>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• Mark annual return deadlines in calendar</li>
                      <li>• Keep detailed financial records (receipts, bank statements)</li>
                      <li>• File on time (avoid penalties)</li>
                      <li>• Update leadership changes promptly</li>
                      <li>• Maintain organization records (5+ years retention)</li>
                    </ul>
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
                  <div className="space-y-3 mb-6">
                    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">❌ Incomplete or Poorly Drafted Constitution</h4>
                      <p className="text-gray-700 text-sm">Causes: NGO Board rejects, delays processing, future governance disputes. Solution: Use proper template or hire lawyer. Constitution is critical document.</p>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">❌ Using Name Already Registered</h4>
                      <p className="text-gray-700 text-sm">Causes: Application rejected, have to choose new name, restart process. Solution: Search name availability BEFORE applying. Don't assume name is free.</p>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">❌ Insufficient Founding Members</h4>
                      <p className="text-gray-700 text-sm">Causes: NGO Board won't approve (requires 3+), CBO/Society appears weak. Solution: Recruit minimum members before registering.</p>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">❌ Missing Required Documents</h4>
                      <p className="text-gray-700 text-sm">Causes: Application delayed or rejected, request additional documents, restart process. Solution: Prepare all documents before submitting. Checklist: registration form, constitution, IDs, address proof, fee payment.</p>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">❌ No Clear Mission Statement</h4>
                      <p className="text-gray-700 text-sm">Causes: Authority questions organization viability, rejection. Solution: Write clear, specific mission. Example: "Provide safe water to XYZ community" (specific) vs "help people" (too vague).</p>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">❌ Missing Annual Compliance</h4>
                      <p className="text-gray-700 text-sm">Causes: NGO Board suspension, penalties, deregistration. Solution: Mark annual return deadlines, file on time, maintain records.</p>
                    </div>
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
                <h3 className="text-2xl font-bold mb-4">Ready to Register Your Nonprofit?</h3>
                <p className="text-blue-100 mb-6 max-w-2xl mx-auto">Take the first step to legal registration. Nonprofits thrive when properly registered—with legal standing, donor credibility, and tax benefits.</p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <a href="https://ngobureau.go.ke" target="_blank" rel="noopener noreferrer" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 inline-flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    NGO Board Services
                  </a>
                  <a href="/limited-company-registration-kenya" className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold inline-flex items-center gap-2">
                    Business Registration <ArrowRight className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Related Links */}
              <div className="bg-gray-100 rounded-xl p-6 mt-8">
                <h3 className="font-bold text-gray-900 mb-4">Related Guides</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <a href="/how-to-register-business-kenya" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    How to Register Business Kenya
                  </a>
                  <a href="/limited-company-registration-kenya" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Limited Company Registration
                  </a>
                  <a href="/partnership-llp-registration-kenya" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Partnership & LLP Registration
                  </a>
                  <a href="/kra-pin-for-business-kenya" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    KRA PIN Registration
                  </a>
                  <a href="/company-annual-returns-kenya" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Annual Returns Filing
                  </a>
                  <a href="/closing-or-deregistering-company-kenya" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Close/Deregister Organization
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

export default NGOCBOSocietyRegistrationKenya;
