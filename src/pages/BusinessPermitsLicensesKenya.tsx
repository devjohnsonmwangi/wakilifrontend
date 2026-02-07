import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, AlertCircle, ArrowRight, FileText, DollarSign, Building2, AlertTriangle, Clock, BookOpen, Globe, Shield, MapPin, BarChart, XCircle } from 'lucide-react';

const BusinessPermitsLicensesKenya = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // FAQ data
  const faqs = [
    {
      question: 'What is a business permit in Kenya?',
      answer: 'A business permit (also called business license or single business permit) is official authorization from your county government proving you have permission to operate a business legally. The permit shows: business name, location, owner details, business type, registration date, and expiration date. All businesses in Kenya must have a valid permit (except exempt categories). Without permit: business is illegal (fines up to KES 50,000, jail time, asset seizure possible). Permit required from day one of operation.'
    },
    {
      question: 'Who issues business permits in Kenya?',
      answer: 'Business permits issued by: County government (single business permit for most businesses), Nairobi City County (if business in Nairobi), Your specific ward/division office. Process: Apply at county/ward office, submit documents, pay fee, receive permit. Additional specialized licenses from: NEMA (environmental), KEBS (food/products), Health Ministry (health-related), Fire Brigade (safety), Alcohol Board (liquor). Different authorities = different licenses.'
    },
    {
      question: 'How much does a business permit cost?',
      answer: 'Single business permit costs vary by county: Nairobi: KES 7,000-15,000 (most expensive), Kisumu: KES 5,000-8,000, Mombasa: KES 6,000-12,000, Kiambu: KES 4,000-7,000, Rural counties: KES 2,000-5,000. Additional licenses cost extra: Food handling: KES 2,000-5,000, Fire certificate: KES 3,000-5,000, Health certificate: KES 1,000-3,000, NEMA: KES 5,000-20,000. Total startup: KES 15,000-60,000 (all licenses combined).'
    },
    {
      question: 'How long does it take to get a business permit?',
      answer: 'Business permit processing time: Document verification: 1-2 days, Site inspection: 1-3 days, Final approval: 1-2 days, Total time: 3-7 days (if all documents complete). With complications (missing docs, inspections fail, appeals): 2-4 weeks. Pro tip: apply on Monday-Wednesday (faster than Friday when offices close). Online applications (eCitizen): 2-5 days. Express service: available in some counties (costs extra, faster).'
    },
    {
      question: 'Can I operate a business without a permit?',
      answer: 'No. Operating without valid permit is illegal in Kenya. Consequences: Heavy fines (KES 50,000-200,000 depending on county), Jail time (3-6 months possible), Business closure/shutdown, Asset seizure, Public shaming/reputation damage, Difficulty reopening legitimately. County enforcement teams conduct raids (especially restaurants, shops). Penalty varies by: county, business type, repeat offense (harsher if caught multiple times), duration of illegal operation. Better to spend money on permit than fines/jail.'
    },
    {
      question: 'What businesses require permits?',
      answer: 'Most businesses require permits: Retail shops, Restaurants/bars/cafes, Salons/spas, Schools/training centers, Clinics/medical, Rental properties, Construction, Transport, Manufacturing, Service businesses. Exceptions (no permit needed): Hawkers/street vendors (need different hawker license), Home-based online-only businesses (some exemptions apply), Farming (most cases), Freelancers (if no physical premises). When in doubt: apply for permit (safer than operating illegally).'
    },
    {
      question: 'What documents do I need for a business permit?',
      answer: 'Required documents: ID/passport (owner identification), Proof of business location (lease agreement, title deed, landlord letter), Business name (chosen and available), KRA PIN (if company), Tax compliance certificate (if applicable), Application form (from county), Passport photos (2-4), Floor plan (if required by county), Health/safety inspection report (if required). Different counties may request additional documents. It\'s better to provide extra documents (shows professionalism) than missing required ones.'
    },
    {
      question: 'Can I renew my business permit online?',
      answer: 'Yes, some counties allow online renewal via eCitizen: Log into eCitizen, Select Permit Renewal, Upload documents (ID, proof of location, tax compliance), Pay fee (online), Receive e-permit. Process: 2-5 days. Counties with online service: Nairobi, Mombasa, Kiambu, Kisumu, Makueni, Machakos. Other counties: require in-person renewal (visit county office). Check your county website for online options. Pro tip: renew 2 weeks before expiry (avoids last-minute rush, penalties for expired permit).'
    },
    {
      question: 'How long is a business permit valid?',
      answer: 'Business permit validity periods: Most counties: 1 year (annual renewal required), Some counties: 2-3 years, Specific licenses: 1-5 years (depending on type). Renewal timeline: Start renewing 2-4 weeks before expiry, Cost: same as initial application (KES 2,000-15,000 per year), Process: submit documents + pay fee. Operating on expired permit = penalty (same as operating without permit). Automatic renewal not available (you must apply annually).'
    },
    {
      question: 'What is NEMA license and do I need it?',
      answer: 'NEMA (National Environment Management Authority) license required for businesses affecting environment: Manufacturing plants, Mining operations, Quarries, Waste management, Fuel stations, Large-scale farming, Construction projects, Hotels/lodges (sometimes), Restaurants (sometimes). NEMA processes: Environmental impact assessment (EIA) for major projects, Simplified EIA for smaller businesses, Operating license issued if compliant. Cost: KES 5,000-50,000 (depends on project size). Violations: fines up to KES 1 million, jail time, project shutdown.'
    },
    {
      question: 'What is food handling certificate?',
      answer: 'Food handling certificate (from Public Health Department or NEMA): Required for businesses serving food: Restaurants, Cafes, Bakeries, Butcheries, Grocery stores, Street food vendors, Catering. Certificate proves: Premises meet health standards, Food handling staff trained, Equipment sanitary, Storage proper. Process: Apply at county health office, Inspector visits premises (checks cleanliness, equipment, water), Training certificate submitted (food handlers), License issued if compliant. Cost: KES 2,000-5,000. Renewal: annually. Violations: fines, closure, food confiscation.'
    },
    {
      question: 'Do online businesses need permits?',
      answer: 'Online businesses permits: If only selling online (no physical store): permit not required (or minimal license). If online business with physical office/warehouse: county business permit required. If handling/storing products: health certificate may be required, If shipping physical goods: transport permit may be needed, If international shipping: customs clearance required. Online-only with no inventory: minimal regulation (just register business name). Best practice: check county requirements (varies), get advice from business advisor, register business for credibility.'
    },
    {
      question: 'What happens if I don\'t renew my permit?',
      answer: 'If you don\'t renew expired permit: Business automatically becomes illegal (after expiry date), Fines imposed (KES 50,000-200,000 if caught), Enforcement officers can raid/shutdown, Assets may be seized, Reopening later = must reapply (full process + explain gap), Customers may lose trust, Insurance invalid (important for liability). Grace period: Most counties allow 30-60 days after expiry before penalties. Solution: Set phone reminders (renew 1 month before expiry), Use online renewal (faster), Keep receipts (proof of compliance).'
    },
    {
      question: 'How do I check if my business name is available?',
      answer: 'Check business name availability: Ask county business office (they check their records), Search online (county websites have search portals), Visit county office in person (check database), Use business registration office list. Name considerations: Not too similar to existing businesses, Not copyrighted/trademarked, Not offensive/illegal, Preferably unique/memorable. If name taken: Choose different name, Proceed with available name, Or apply for existing business transfer (if willing seller). Pro tip: Check multiple sources (different systems may have different names registered).'
    },
    {
      question: 'Can I transfer a business permit?',
      answer: 'Transferring business permit (when selling business): Current owner applies for permit cancellation, New owner submits new permit application (with updated details), Original permit becomes invalid, New owner receives new permit (in their name). Cannot directly transfer (new application required). Process: Takes 5-10 days, Costs KES 2,000-10,000 (new application fee), Requires: proof of sale agreement, new owner ID, proof of location, new owner signatures. Important: Don\'t operate on old permit (different owner name = illegal). Always reapply in new owner\'s name.'
    },
    {
      question: 'What if my premises don\'t meet inspection requirements?',
      answer: 'If premises fail inspection: County officer explains why (safety hazard, improper storage, unhygienic, etc.), You get deadline to fix (usually 1-4 weeks), Request follow-up inspection, Fix issues, Reinspect. Common failures: Lack of fire extinguishers, Improper waste disposal, Unsanitary conditions, Inadequate ventilation, Structural issues, Missing safety signs. Solutions: Hire professional cleaner/contractor, Install required equipment, Get professional to fix issues, Schedule reinspection. Cost to fix: KES 5,000-50,000 (depends on what\'s needed). Tip: hire consultant before first inspection (costs KES 2,000-5,000 but prevents failures).'
    },
    {
      question: 'Do I need different permits by location (Nairobi vs county)?',
      answer: 'Permit requirements differ by location: Nairobi: Higher fees (KES 7,000-15,000), More requirements (fire, health, NEMA often required), Longer processing time, Stricter inspections. Other major cities (Mombasa, Kisumu): Moderate fees (KES 4,000-10,000), Standard requirements, 3-7 day processing. Rural areas: Lower fees (KES 2,000-5,000), Simpler requirements, Faster processing (1-3 days). Pro tip: If starting in multiple counties: apply to each county separately (permits not transferable across counties). Remote work from home: Usually no permit needed (check county rules).'
    },
    {
      question: 'What is eCitizen and how do I use it?',
      answer: 'eCitizen: Kenya\'s online government portal (ecitizen.go.ke) for permits/licenses. Services available: Business permit application/renewal, Building permits, Trade licenses, Some health certificates. How to use: Create account (email, ID, phone), Log in, Select service (business permit), Upload documents (scans of IDs, lease, etc.), Pay fee (M-Pesa or card), Submit, Wait for approval (2-5 days), Download permit (digital). Benefits: Fast (no queuing), Transparent (status updates), Convenient (24/7), Cheaper (no travel costs). Counties available: Nairobi, Mombasa, Kiambu, Machakos, Kisumu, Makueni. Other counties: still use in-person only (check your county).'
    },
    {
      question: 'What penalties apply for operating without a permit?',
      answer: 'Penalties for operating without permit: Fine (KES 50,000-200,000, varies by county), Jail time (3-6 months possible), Business shutdown/closure order, Equipment/goods seizure (sold or auctioned), Permanent closure order (worst case), Reputation damage, Future business licensing refused. Enforcement: County officers conduct surprise raids (especially restaurants, shops), Public tip-offs (competitors report illegal businesses), Routine inspections catch expired permits, Tax authority crosschecks (links business registration with permits). Strategy: Get permit legally, Renew on time, Keep copies visible in premises.'
    },
    {
      question: 'Can a company and sole proprietor operate same business?',
      answer: 'Both can operate same business type but require separate permits: Sole proprietorship: Individual registers (ID-based), Get individual permit. Limited company: Company registers (different entity), Get company permit (in company name). They are legally different: Sole prop: personal liability, simpler registration, individual permits, Lower costs. Company: limited liability, more complex, company permits, Higher costs, separate legal entity. For same business type (e.g., two restaurants): Both need permits, Different names, Different locations (usually), Different owners (or one owns both, still separate permits).'
    },
    {
      question: 'How do I estimate my total permit costs?',
      answer: 'Total permit cost estimation: Single business permit: KES 2,000-15,000 (county dependent), Food handling: KES 0-5,000 (if food business), Health certificate: KES 0-3,000 (if required), Fire safety: KES 0-5,000 (if required), NEMA: KES 0-20,000 (if environmental impact), Liquor license: KES 10,000-50,000 (if alcohol involved), Professional help: KES 0-10,000 (lawyer/consultant). Minimum (basic retail): KES 2,000-8,000, Mid-range (restaurant): KES 15,000-30,000, Maximum (manufacturing): KES 30,000-100,000+. Calculate: Identify business type → List required permits → Check county fees → Get cost quote → Budget accordingly. Pro tip: Contact county office (free quote) before spending money.'
    }
  ];

  // Business types and permits required
  const businessTypePermits = [
    {
      type: 'Retail Shop',
      basicPermit: 'Yes (Single Business Permit)',
      healthCert: 'No',
      fireCert: 'Sometimes',
      nema: 'No',
      estCost: 'KES 3,000-8,000',
      details: 'Basic permit + trading license. Fire certificate if multi-story or high-value goods.'
    },
    {
      type: 'Restaurant/Café/Bar',
      basicPermit: 'Yes (Single Business Permit)',
      healthCert: 'Yes (Food Handling)',
      fireCert: 'Yes',
      nema: 'Sometimes',
      estCost: 'KES 15,000-35,000',
      details: 'Permit + food certificate + fire safety. NEMA if environmental impact. Health inspection required.'
    },
    {
      type: 'Salon/Spa/Salon',
      basicPermit: 'Yes (Single Business Permit)',
      healthCert: 'Sometimes',
      fireCert: 'Usually No',
      nema: 'No',
      estCost: 'KES 4,000-12,000',
      details: 'Basic permit. Health certificate if using chemicals/massage therapy. Safety certificate if fire hazard.'
    },
    {
      type: 'School/Training Center',
      basicPermit: 'Yes',
      healthCert: 'Yes (Health/Sanitation)',
      fireCert: 'Yes',
      nema: 'Sometimes',
      estCost: 'KES 20,000-50,000',
      details: 'Business permit + health certificate + fire safety. NEMA if large-scale. Education authority approval needed.'
    },
    {
      type: 'Clinic/Medical Center',
      basicPermit: 'Yes',
      healthCert: 'Yes (Medical License)',
      fireCert: 'Yes',
      nema: 'Sometimes',
      estCost: 'KES 25,000-60,000',
      details: 'Permit + medical license (Health Ministry) + fire safety. NEMA if waste disposal. Strictest regulations.'
    },
    {
      type: 'Online E-Commerce',
      basicPermit: 'Sometimes',
      healthCert: 'No (if no inventory)',
      fireCert: 'No',
      nema: 'No',
      estCost: 'KES 0-5,000',
      details: 'Permit not required if purely online (no physical store). Register business name. Health cert if selling products.'
    },
    {
      type: 'Manufacturing/Production',
      basicPermit: 'Yes',
      healthCert: 'Sometimes',
      fireCert: 'Yes',
      nema: 'Yes (Environmental)',
      estCost: 'KES 30,000-100,000+',
      details: 'Permit + NEMA license + fire safety + health (if chemical). Most regulated business type.'
    },
    {
      type: 'Transport/Taxi/PSV',
      basicPermit: 'Yes',
      healthCert: 'No',
      fireCert: 'Sometimes',
      nema: 'No',
      estCost: 'KES 5,000-15,000',
      details: 'Business permit + vehicle inspection + insurance. Fire safety if passenger vehicle.'
    },
    {
      type: 'Hotel/Lodge/B&B',
      basicPermit: 'Yes',
      healthCert: 'Yes',
      fireCert: 'Yes',
      nema: 'Sometimes',
      estCost: 'KES 20,000-50,000',
      details: 'Permit + health certificate + fire safety. NEMA if environmental impact. Tourism license needed.'
    },
    {
      type: 'Construction/Contractor',
      basicPermit: 'Yes',
      healthCert: 'No',
      fireCert: 'No',
      nema: 'Yes (Projects)',
      estCost: 'KES 10,000-30,000',
      details: 'Business permit + NEMA clearance for projects + building permit. Safety requirements strict.'
    }
  ];

  // Application steps
  const applicationSteps = [
    {
      number: 1,
      title: 'Prepare Required Documents',
      description: 'Gather all necessary documents: Valid ID/passport (owner identification), Proof of business premises (lease agreement, title deed, or landlord letter), Business name (chosen and available), KRA PIN (if you have a company), Application form (collect from county office), Passport-sized photos (2-4), Business plan (one-page summary of what you do).'
    },
    {
      number: 2,
      title: 'Check Business Name Availability',
      description: 'Visit county business office or check online portal to confirm your chosen business name is not already registered. Reserve name if available (protects name for 30-90 days). Choose professional name that reflects your business. Avoid names that are: offensive, similar to existing famous brands, too long/complex, or already trademarked.'
    },
    {
      number: 3,
      title: 'Choose Application Method',
      description: 'Option 1: Online via eCitizen (if available in your county) - faster (2-5 days), no travel. Option 2: In-person at county office (traditional method) - 5-10 days, must visit office. Recommended: Check county website to see which method available. Online preferred (faster, cheaper, transparent). Collect application form (if in-person).'
    },
    {
      number: 4,
      title: 'Complete Application Form',
      description: 'Fill out business permit application form carefully. Include: Business name (exact), Business type/sector, Owner/director details (ID, phone, address), Business location (with exact address), Estimated annual turnover, Number of employees, Business activities (detailed description). Double-check all information (errors cause delays). Write legibly or type (if in-person application).'
    },
    {
      number: 5,
      title: 'Attach Required Documents & Photos',
      description: 'Compile application package with: Completed application form, Copies of owner ID (front+back), Proof of business premises (lease/title/letter), KRA PIN (if applicable), 2-4 passport photos, Business plan summary (1 page). For food businesses add: Health/safety inspection report. Make 2 copies (one for you, one for county). Organize in folder (shows professionalism).'
    },
    {
      number: 6,
      title: 'Submit Application & Pay Fee',
      description: 'Option A - Online (eCitizen): Upload document scans, pay fee via M-Pesa/card, receive reference number. Option B - In-person: Visit county office (main office or ward), Submit application + documents, Pay fee (M-Pesa or cash), Receive receipt/reference number. Keep receipt (proof of submission). Process starts once payment confirmed.'
    },
    {
      number: 7,
      title: 'Premises Inspection (if required)',
      description: 'County officer may inspect your premises to verify: Location is legitimate, Safety standards met, Hygiene standards met (if food business), No zoning violations, Premises actually exist. Inspection usually happens 1-3 days after application. Be ready: ensure premises clean, have relevant certifications ready, be available for inspector. Failed inspection = address issues + reinspect (delays 1-2 weeks).'
    },
    {
      number: 8,
      title: 'Document Review & Verification',
      description: 'County office staff review your application for: Completeness (all documents attached), Name availability (not already registered), Compliance (meets zoning/building codes), KRA tax status (if company). May request: Additional information, Clarifications, Proof of address, Tax compliance certificate. Respond quickly to requests (delays approval).'
    },
    {
      number: 9,
      title: 'Receive Approval & Permit',
      description: 'Once approved: County office issues business permit (certificate/letter). Permit shows: Business name, registration number, owner name, business address, date issued, expiry date. You receive: Physical permit (framed/document) or digital permit (PDF via email). Keep permit safe (show to authorities if requested, proof of legality, required for other licenses/contracts).'
    },
    {
      number: 10,
      title: 'Display Permit & Apply for Additional Licenses',
      description: 'Display permit visibly in business premises (law requires it). Now apply for additional licenses if needed: Food handling certificate (health office), Fire safety certificate (fire brigade), NEMA license (if applicable), Health license (if medical), Liquor license (if alcohol). Each requires separate application (uses business permit number).'
    }
  ];

  // Renewal steps
  const renewalSteps = [
    {
      number: 1,
      title: 'Check Permit Expiry Date',
      description: 'Find expiry date on your business permit (typically printed on document). Mark calendar 1-2 months before expiry (renewal window). Set phone reminder (2 weeks before expiry as backup). Do not wait until last day (risk of operating with expired permit = illegal). Most businesses renew annually (every 12 months).'
    },
    {
      number: 2,
      title: 'Gather Renewal Documents',
      description: 'Collect required documents for renewal: Original permit (or copy), Current ID, Proof of business premises (updated lease/proof), KRA PIN (or tax compliance certificate), Application form (for renewal), Passport photos (2-4). Less documentation required than initial application (just proof of continued operation). Keep organized.'
    },
    {
      number: 3,
      title: 'Choose Renewal Method',
      description: 'Option 1: Online renewal via eCitizen (if available) - upload documents, pay fee, 2-5 days. Option 2: In-person renewal at county office - submit documents, pay fee, 5-10 days. Online preferred (faster, easier). Check if your county offers online renewal (Nairobi, Mombasa, Kiambu, Machakos, Kisumu do). Other counties still require in-person.'
    },
    {
      number: 4,
      title: 'Submit Renewal Application & Fee',
      description: 'Online: Upload documents on eCitizen, pay renewal fee (same or similar to initial fee), receive confirmation. In-person: Visit county office, submit documents, pay fee (cash/M-Pesa), receive receipt. Fee typically same as initial permit (KES 2,000-15,000 depending on county). Keep receipt (proof of renewal). Processing starts immediately upon payment.'
    },
    {
      number: 5,
      title: 'Wait for Verification & Approval',
      description: 'County office verifies: Documents complete, Business still operating legitimately, No outstanding violations/fines, Previous permit valid/compliant. Usually fast (2-3 days) if no issues. May request: Updates to business info, Proof of operation, Clarifications. Respond promptly (avoid delays).'
    },
    {
      number: 6,
      title: 'Receive Renewed Permit',
      description: 'Once approved: County office issues new permit (same process as initial issue). New permit shows: Original business details, New expiry date (usually 12 months from renewal date), All previous information carried forward, New registration number sometimes (depends on county). Digital or physical permit provided. Keep safe (show if inspected).'
    }
  ];

  // County cost comparison
  const countyCosts = [
    {
      county: 'Nairobi',
      basicPermit: 'KES 7,000-15,000',
      foodCert: 'KES 3,000-5,000',
      fireCert: 'KES 2,000-4,000',
      total: 'KES 15,000-35,000'
    },
    {
      county: 'Mombasa',
      basicPermit: 'KES 6,000-12,000',
      foodCert: 'KES 2,500-4,000',
      fireCert: 'KES 1,500-3,000',
      total: 'KES 12,000-28,000'
    },
    {
      county: 'Kisumu',
      basicPermit: 'KES 5,000-8,000',
      foodCert: 'KES 2,000-3,500',
      fireCert: 'KES 1,000-2,500',
      total: 'KES 8,000-18,000'
    },
    {
      county: 'Kiambu',
      basicPermit: 'KES 4,000-7,000',
      foodCert: 'KES 2,000-3,000',
      fireCert: 'KES 1,000-2,000',
      total: 'KES 7,000-15,000'
    },
    {
      county: 'Machakos',
      basicPermit: 'KES 3,500-6,000',
      foodCert: 'KES 1,500-3,000',
      fireCert: 'KES 1,000-2,000',
      total: 'KES 6,000-13,000'
    },
    {
      county: 'Rural/Small Counties',
      basicPermit: 'KES 2,000-5,000',
      foodCert: 'KES 1,000-2,500',
      fireCert: 'KES 500-1,500',
      total: 'KES 3,500-10,000'
    }
  ];

  // Documents required
  const documentsRequired = [
    { document: 'Valid ID/Passport', purpose: 'Owner identification verification', required: 'Yes' },
    { document: 'Proof of Business Premises', purpose: 'Lease, title deed, or landlord letter', required: 'Yes' },
    { document: 'Business Name', purpose: 'Chosen and verified available', required: 'Yes' },
    { document: 'Application Form', purpose: 'Completed county form', required: 'Yes' },
    { document: 'KRA PIN (if company)', purpose: 'Tax identification number', required: 'Conditional' },
    { document: 'Passport Photos', purpose: '2-4 recent photos', required: 'Yes' },
    { document: 'Business Plan Summary', purpose: '1-page description of business', required: 'Recommended' },
    { document: 'Health/Safety Report', purpose: 'For food/medical businesses', required: 'Conditional' },
    { document: 'Letter of Recommendation', purpose: 'From landlord/previous authority', required: 'Sometimes' },
    { document: 'Tax Compliance Certificate', purpose: 'If company/has previous business', required: 'Conditional' }
  ];

  // Common mistakes
  const commonMistakes = [
    { mistake: 'Using someone else\'s name/ID', consequence: 'Permit invalid, legal issues, fraud charges possible' },
    { mistake: 'Wrong business address on form', consequence: 'Permit issued for wrong location, can\'t use, must reapply' },
    { mistake: 'Incomplete documentation', consequence: 'Application rejected, must resubmit, causes delays' },
    { mistake: 'Not renewing before expiry', consequence: 'Operating illegally, fines KES 50,000+, possible closure' },
    { mistake: 'Registering occupied premises without landlord consent', consequence: 'Inspection fails, application rejected, premises dispute' },
    { mistake: 'Choosing business name already taken', consequence: 'Application rejected, must choose different name' },
    { mistake: 'Not displaying permit visibly', consequence: 'If caught, fined, authorities question legitimacy' },
    { mistake: 'Operating business type different from permit', consequence: 'Permit invalid for that use, can be fined' },
    { mistake: 'Not applying for required specialized licenses', consequence: 'Health/fire violation, possible closure, additional fines' },
    { mistake: 'Transferring permit to new owner without reapplying', consequence: 'Permit invalid (wrong name), new owner must apply' }
  ];

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'why-permit', 'types', 'single-permit', 'county', 'national', 'by-type', 'apply-steps', 'renew-steps', 'documents', 'costs', 'timeline', 'ecitizen', 'mistakes', 'penalties', 'faqs'];
      
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
        <title>Business Permits & Licenses Kenya – Complete 2026 Guide</title>
        <meta name="description" content="Complete guide to business permits, licenses and legal approvals in Kenya. Step-by-step process, costs by county, requirements for all business types and compliance." />
        <link rel="canonical" href="https://yoursite.com/business-permits-licenses-kenya" />
        
        {/* OpenGraph */}
        <meta property="og:title" content="Business Permits & Licenses Kenya – 2026 Complete Guide" />
        <meta property="og:description" content="Get your business permit in Kenya. Step-by-step guide, county costs, requirements, application process, renewal and everything you need to start legally." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://yoursite.com/business-permits-licenses-kenya" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=630&fit=crop" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Business Permits & Licenses Kenya – Complete Guide 2026" />
        <meta name="twitter:description" content="Everything about business permits in Kenya. Step-by-step process, all county costs, requirements, online application via eCitizen, penalties and compliance." />
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
            "description": "Business permits and licenses guidance in Kenya"
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
                "name": "Business Permits & Licenses",
                "item": "https://yoursite.com/business-permits-licenses-kenya"
              }
            ]
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Get a Business Permit in Kenya",
            "description": "Step-by-step guide to getting a business permit in Kenya",
            "step": applicationSteps.map(step => ({
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
              <Shield className="w-8 h-8 flex-shrink-0" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">Business Permits & Licenses in Kenya</h1>
            </div>
            <p className="text-blue-100 text-lg max-w-3xl">Complete guide to getting business permits, licenses and legal approvals required to operate in Kenya. Learn how to apply, costs by county, requirements for all business types, renewal process and legal compliance.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="https://ecitizen.go.ke" target="_blank" rel="noopener noreferrer" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Apply Online (eCitizen)
              </a>
              <a href="/how-to-register-business-kenya" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
                Business Registration <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:block sticky top-0 bg-white shadow-md z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex gap-2 overflow-x-auto">
              {['overview', 'why-permit', 'types', 'single-permit', 'county', 'national', 'by-type', 'apply-steps', 'renew-steps', 'documents', 'costs', 'timeline', 'ecitizen', 'mistakes', 'penalties', 'faqs'].map((section) => (
                <button
                  key={section}
                  onClick={() => {
                    const element = document.getElementById(section);
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
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
              {['overview', 'why-permit', 'types', 'apply-steps', 'costs', 'faqs'].map((section) => (
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
                  {section === 'overview' ? 'Overview' : section === 'why-permit' ? 'Why' : section === 'types' ? 'Types' : section === 'apply-steps' ? 'Apply' : section === 'costs' ? 'Costs' : 'FAQs'}
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
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What is a Business Permit in Kenya?</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">A business permit (also called a business license, single business permit, or trade license) is official written authorization from your county government proving you have legal permission to operate a business. Think of it as the government's "stamp of approval" that says your business is registered and authorized.</p>

              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop"
                alt="Business permits and licenses documentation"
                className="rounded-lg shadow-lg w-full mb-6"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">✓ What Your Permit Shows</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Business name (registered)</li>
                    <li>• Business location/address</li>
                    <li>• Business owner name</li>
                    <li>• Business type/sector</li>
                    <li>• Registration date</li>
                    <li>• Expiry date (usually annual)</li>
                    <li>• Permit registration number</li>
                  </ul>
                </div>

                <div className="bg-green-50 border-l-4 border-green-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">📋 Why You Need It</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Legal requirement (mandatory)</li>
                    <li>• Proof of business legitimacy</li>
                    <li>• Required for bank accounts</li>
                    <li>• Needed for contracts/leases</li>
                    <li>• Required for other licenses</li>
                    <li>• Tax compliance proof</li>
                    <li>• Building credibility</li>
                  </ul>
                </div>
              </div>

              <div className="bg-red-50 border-l-4 border-red-600 p-5 rounded-lg mb-6">
                <h4 className="font-bold text-gray-900 mb-2">⚠️ Without a Permit (Legal Consequences)</h4>
                <p className="text-gray-700 text-sm mb-2">Operating a business without a valid permit is <strong>illegal in Kenya</strong>. Penalties include:</p>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Heavy fines: KES 50,000-200,000 (depending on county)</li>
                  <li>• Potential jail time: 3-6 months</li>
                  <li>• Business shutdown/closure order</li>
                  <li>• Equipment and goods seizure</li>
                  <li>• Reputation damage (public record)</li>
                  <li>• Difficulty reopening legally later</li>
                </ul>
              </div>

              <p className="text-gray-700 mb-4"><strong>Bottom line:</strong> Getting a permit is quick, affordable, and legally required. It protects both you and your customers. No business is too small to need one.</p>
            </div>
          </section>

          {/* Why Permit */}
          <section id="why-permit" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Why You Must Have a Permit (Legal & Practical Reasons)</h2>
            </div>

            <div className="prose max-w-none">
              <div className="space-y-4">
                <div className="bg-white border-2 border-gray-200 p-5 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-2">1. It's Legally Mandatory</h4>
                  <p className="text-gray-700 text-sm">Kenyan law requires ALL businesses to have valid permits. Operating without one is illegal (fines + jail time possible). County enforcement teams conduct regular raids (especially restaurants, shops, salons) checking for valid permits.</p>
                </div>

                <div className="bg-white border-2 border-gray-200 p-5 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-2">2. Protects You from Fines & Closure</h4>
                  <p className="text-gray-700 text-sm">If caught without permit: county officers impose fines (KES 50,000-200,000+), business immediately shutdown, equipment seized, reputation damaged. With valid permit: you operate legally, no fines, no stress about inspections.</p>
                </div>

                <div className="bg-white border-2 border-gray-200 p-5 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-2">3. Required for Bank Accounts & Loans</h4>
                  <p className="text-gray-700 text-sm">Banks require business permit to open business bank account (no permit = no business account). Loan applications need permit proof. Without permit, can't access formal financing. Permit is foundation for all financial services.</p>
                </div>

                <div className="bg-white border-2 border-gray-200 p-5 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-2">4. Builds Customer Trust & Credibility</h4>
                  <p className="text-gray-700 text-sm">Displaying your permit signals legitimacy to customers (visible permit in premises). Customers feel confident doing business with registered company. Important for restaurants, clinics, schools (health/safety sensitive).</p>
                </div>

                <div className="bg-white border-2 border-gray-200 p-5 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-2">5. Enables Other Licenses & Approvals</h4>
                  <p className="text-gray-700 text-sm">Your business permit number is needed for: health certificates, fire safety permits, NEMA licenses, specialized licenses. Without basic permit, can't get any other licenses. Permit is foundation.</p>
                </div>

                <div className="bg-white border-2 border-gray-200 p-5 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-2">6. Tax Compliance & Official Status</h4>
                  <p className="text-gray-700 text-sm">Permit proves business is officially registered with county. Tax authority can verify compliance. Operating without permit = tax evasion risk (double penalties). With permit, you're in system legally.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Types */}
          <section id="types" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <Building2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Types of Business Licenses Required</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Different business types require different licenses. Here's the main types:</p>

              <div className="space-y-4 mb-6">
                <div className="bg-white border-l-4 border-blue-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">1. Single Business Permit (Basic License)</h4>
                  <p className="text-gray-700 text-sm">Issued by county government. Covers most businesses (retail shops, offices, services). Mandatory for all. Cost: KES 2,000-15,000 (varies by county). Duration: typically 1 year (annual renewal).</p>
                </div>

                <div className="bg-white border-l-4 border-green-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">2. Health & Sanitation Certificates</h4>
                  <p className="text-gray-700 text-sm">For food businesses (restaurants, cafes, shops, bakeries). Issued by county health department. Proves premises meet hygiene standards. Cost: KES 2,000-5,000. Duration: 1 year. Required before opening.</p>
                </div>

                <div className="bg-white border-l-4 border-orange-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">3. Fire Safety Certificate</h4>
                  <p className="text-gray-700 text-sm">For businesses with fire risk (restaurants, hotels, shops, manufacturing). Issued by fire brigade. Proves premises have safety equipment/procedures. Cost: KES 1,000-5,000. Duration: 1 year. Inspector visits.</p>
                </div>

                <div className="bg-white border-l-4 border-purple-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">4. NEMA License (Environmental)</h4>
                  <p className="text-gray-700 text-sm">For environmentally-impacting businesses (manufacturing, hotels, fuel stations, construction, mining). Issued by NEMA (National Environment Management Authority). Cost: KES 5,000-50,000+. Requires Environmental Impact Assessment.</p>
                </div>

                <div className="bg-white border-l-4 border-red-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">5. Medical/Health License</h4>
                  <p className="text-gray-700 text-sm">For clinics, pharmacies, hospitals. Issued by health ministry/county. Very strict requirements (facilities, staffing, equipment). Cost: KES 10,000-50,000+. Renewals required.</p>
                </div>

                <div className="bg-white border-l-4 border-indigo-600 p-5 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">6. Specialized Licenses</h4>
                  <p className="text-gray-700 text-sm">Liquor license (bars/restaurants serving alcohol), Education license (schools), Transport license (taxis/buses), Security license (security companies). Each has specific requirements.</p>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded-lg">
                <p className="text-gray-700 text-sm"><strong>Rule of thumb:</strong> Most businesses need basic permit + any specialized licenses for their industry. Restaurants = permit + food cert + fire. Clinics = permit + medical license + fire.</p>
              </div>
            </div>
          </section>

          {/* Single Permit */}
          <section id="single-permit" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Single Business Permit Explained</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">The "Single Business Permit" is the primary license most businesses need. Here's what you should know:</p>

              <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-6 border-r-2 border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-3">What It Includes</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" /> Trading/business license</li>
                      <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" /> County authorization</li>
                      <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" /> Location verification</li>
                      <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" /> Owner registration</li>
                      <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" /> 1-year validity (typically)</li>
                      <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" /> Official document</li>
                    </ul>
                  </div>

                  <div className="p-6">
                    <h4 className="font-bold text-gray-900 mb-3">Who Issues It</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2"><MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" /> County government</li>
                      <li className="flex gap-2"><MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" /> Main county office (usually)</li>
                      <li className="flex gap-2"><MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" /> Ward/divisional offices</li>
                      <li className="flex gap-2"><MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" /> eCitizen portal (online, if available)</li>
                      <li className="flex gap-2"><MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" /> Private services (agents/consultants)</li>
                      <li className="flex gap-2"><MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" /> Varies by county</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-bold text-gray-900 mb-1">Average Cost</p>
                  <p className="text-lg font-bold text-blue-600">KES 2,000-15,000</p>
                  <p className="text-xs text-gray-600">(varies by county)</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm font-bold text-gray-900 mb-1">Processing Time</p>
                  <p className="text-lg font-bold text-green-600">3-7 days</p>
                  <p className="text-xs text-gray-600">(if documents complete)</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm font-bold text-gray-900 mb-1">Validity</p>
                  <p className="text-lg font-bold text-purple-600">1 year</p>
                  <p className="text-xs text-gray-600">(annual renewal typically)</p>
                </div>
              </div>

              <p className="text-gray-700 mb-4">The single business permit is your primary license. All other specialized licenses (food, fire, health) are additional to this basic permit. You MUST have the basic permit before applying for specialized ones.</p>
            </div>
          </section>

          {/* County Government */}
          <section id="county" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">County Government Permits</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">County governments are responsible for issuing business permits in their areas. Each county has its own process, fees, and requirements. Here's how it works:</p>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg mb-6">
                <h4 className="font-bold text-gray-900 mb-2">County Business Permit Basics</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Issued by: County government (your business location's county)</li>
                  <li>• Who applies: Business owner or authorized representative</li>
                  <li>• Where to apply: County headquarters or ward office</li>
                  <li>• Cost: Varies by county (KES 2,000-15,000)</li>
                  <li>• Processing: 3-7 days if all documents ready</li>
                  <li>• Validity: Usually 1 year (annual renewal)</li>
                  <li>• Requirement: MANDATORY for all businesses</li>
                </ul>
              </div>

              <p className="text-gray-700 mb-4"><strong>Important:</strong> Each county sets its own requirements and fees. Nairobi County fees different from Kisumu County. If you have businesses in multiple counties, apply to each separately.</p>

              <h4 className="font-bold text-gray-900 mb-3">Major County Offices</h4>
              <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto mb-6">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">County</th>
                      <th className="px-4 py-3 text-left font-semibold">Main Office Location</th>
                      <th className="px-4 py-3 text-left font-semibold">Online Application</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-900 text-sm">Nairobi</td>
                      <td className="px-4 py-3 text-gray-700 text-sm">City Hall, Nairobi CBD</td>
                      <td className="px-4 py-3 text-gray-700 text-sm">✓ Yes (eCitizen)</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-900 text-sm">Mombasa</td>
                      <td className="px-4 py-3 text-gray-700 text-sm">County offices, Mombasa</td>
                      <td className="px-4 py-3 text-gray-700 text-sm">✓ Yes (eCitizen)</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-900 text-sm">Kisumu</td>
                      <td className="px-4 py-3 text-gray-700 text-sm">County HQ, Kisumu</td>
                      <td className="px-4 py-3 text-gray-700 text-sm">✓ Yes (eCitizen)</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-900 text-sm">Kiambu</td>
                      <td className="px-4 py-3 text-gray-700 text-sm">County HQ, Kiambu</td>
                      <td className="px-4 py-3 text-gray-700 text-sm">✓ Yes (eCitizen)</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-900 text-sm">Other Counties</td>
                      <td className="px-4 py-3 text-gray-700 text-sm">County headquarters</td>
                      <td className="px-4 py-3 text-gray-700 text-sm">Some (check website)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-gray-700 mb-4">To find your county's business office: Search "[Your County Name] business permit" online, Call county office (number on county website), Visit county headquarters in person, Check eCitizen for availability.</p>
            </div>
          </section>

          {/* National Licenses */}
          <section id="national" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <Globe className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">National Licenses (NEMA, KEBS, Health, Fire, etc.)</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Beyond county permits, some businesses need national-level licenses from government agencies:</p>

              <div className="space-y-4 mb-6">
                <div className="bg-white border-2 border-gray-200 p-5 rounded-xl">
                  <div className="flex items-start gap-3 mb-2">
                    <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-gray-900">NEMA License (Environment)</h4>
                      <p className="text-gray-700 text-sm mt-1"><strong>Who needs it:</strong> Manufacturing, hotels, fuel stations, construction, mining, quarries, large farms. <strong>Issued by:</strong> NEMA (National Environment Management Authority). <strong>Requirements:</strong> Environmental Impact Assessment. <strong>Cost:</strong> KES 5,000-50,000+. <strong>Timeline:</strong> 2-8 weeks (depending on assessment). <strong>Renewal:</strong> Annual.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border-2 border-gray-200 p-5 rounded-xl">
                  <div className="flex items-start gap-3 mb-2">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-gray-900">Fire Safety Certificate</h4>
                      <p className="text-gray-700 text-sm mt-1"><strong>Who needs it:</strong> Hotels, restaurants, shops, warehouses, manufacturing, high-occupancy buildings. <strong>Issued by:</strong> Kenya Fire Brigade (county fire office). <strong>Requirements:</strong> Fire extinguishers, emergency exits, safety procedures. <strong>Cost:</strong> KES 1,000-5,000. <strong>Timeline:</strong> 2-3 days (inspection). <strong>Renewal:</strong> Annual.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border-2 border-gray-200 p-5 rounded-xl">
                  <div className="flex items-start gap-3 mb-2">
                    <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-gray-900">Health & Food Certificate</h4>
                      <p className="text-gray-700 text-sm mt-1"><strong>Who needs it:</strong> Restaurants, cafes, bakeries, butcheries, grocery stores, food vendors. <strong>Issued by:</strong> County Public Health Department. <strong>Requirements:</strong> Hygiene standards, staff training, equipment sanitation. <strong>Cost:</strong> KES 2,000-5,000. <strong>Timeline:</strong> 1-2 weeks (inspection). <strong>Renewal:</strong> Annual.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border-2 border-gray-200 p-5 rounded-xl">
                  <div className="flex items-start gap-3 mb-2">
                    <AlertCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-gray-900">Medical/Clinical License</h4>
                      <p className="text-gray-700 text-sm mt-1"><strong>Who needs it:</strong> Clinics, hospitals, pharmacies, maternity facilities. <strong>Issued by:</strong> Ministry of Health (county health office). <strong>Requirements:</strong> Qualified staff, proper facilities, equipment, registration. <strong>Cost:</strong> KES 10,000-50,000+. <strong>Timeline:</strong> 4-12 weeks (thorough inspection). <strong>Renewal:</strong> Annual/biennial.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border-2 border-gray-200 p-5 rounded-xl">
                  <div className="flex items-start gap-3 mb-2">
                    <AlertCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-gray-900">KEBS Certification (Standards)</h4>
                      <p className="text-gray-700 text-sm mt-1"><strong>Who needs it:</strong> Businesses producing products (food, chemicals, electronics, construction materials). <strong>Issued by:</strong> KEBS (Kenya Bureau of Standards). <strong>Requirements:</strong> Product quality/safety standards. <strong>Cost:</strong> KES 5,000-50,000+ (depends on product/testing). <strong>Timeline:</strong> 1-3 months (testing). <strong>Renewal:</strong> Varies.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border-2 border-gray-200 p-5 rounded-xl">
                  <div className="flex items-start gap-3 mb-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-gray-900">Liquor License</h4>
                      <p className="text-gray-700 text-sm mt-1"><strong>Who needs it:</strong> Bars, restaurants serving alcohol, breweries, liquor shops. <strong>Issued by:</strong> County Alcohol Board / County government. <strong>Requirements:</strong> Proper premises, security, distance from schools/churches. <strong>Cost:</strong> KES 10,000-50,000 (very expensive in some counties). <strong>Timeline:</strong> 2-6 weeks. <strong>Renewal:</strong> Annual (very strict rules).</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded-lg">
                <p className="text-gray-700 text-sm"><strong>Pro tip:</strong> Most small businesses only need the basic county permit + maybe food or fire certificate. National licenses (NEMA, KEBS) usually for manufacturing/large operations. Check what applies to your specific business type.</p>
              </div>
            </div>
          </section>

          {/* Business Type Permits */}
          <section id="by-type" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <BarChart className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Permits Required by Business Type</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Different businesses need different license combinations. Here's a quick reference:</p>

              <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Business Type</th>
                      <th className="px-4 py-3 text-left font-semibold">Basic Permit</th>
                      <th className="px-4 py-3 text-left font-semibold">Health/Food</th>
                      <th className="px-4 py-3 text-left font-semibold">Fire Safety</th>
                      <th className="px-4 py-3 text-left font-semibold">Est. Total Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {businessTypePermits.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                        <td className="px-4 py-3 font-semibold text-gray-900 text-sm">{item.type}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.basicPermit}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.healthCert}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.fireCert}</td>
                        <td className="px-4 py-3 font-semibold text-blue-600 text-sm">{item.estCost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-gray-700 mt-6 text-sm">Note: Some counties may have additional requirements. Check with your county office for specific requirements for your business type.</p>
            </div>
          </section>

          {/* Application Steps */}
          <section id="apply-steps" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <ArrowRight className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Step-by-Step: How to Apply for a Business Permit</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Here's the complete process from start to getting your permit:</p>

              <div className="space-y-4">
                {applicationSteps.map((step) => (
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
                <h4 className="font-bold text-gray-900 mb-2">💡 Pro Tips for Fast Approval</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Submit on Monday-Wednesday (faster processing than Friday)</li>
                  <li>• Double-check all documents before submission (prevents rejections)</li>
                  <li>• Apply online via eCitizen if available (2-3 days faster than in-person)</li>
                  <li>• Keep receipts and reference numbers (needed for follow-ups)</li>
                  <li>• Be ready for inspection (keep premises clean and accessible)</li>
                  <li>• Ask county office about any local requirements (county-specific rules)</li>
                  <li>• Use a business consultant if first-time (costs KES 2,000-5,000 but ensures compliance)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Renewal Steps */}
          <section id="renew-steps" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Step-by-Step: How to Renew Your Permit</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Renewing your permit is simpler than the initial application. Most businesses renew annually:</p>

              <div className="space-y-4">
                {renewalSteps.map((step) => (
                  <div key={step.number} className="bg-white border-2 border-gray-200 p-5 rounded-xl hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold">
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

              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg mt-6">
                <h4 className="font-bold text-gray-900 mb-2">⏰ Renewal Timeline (When to Start)</h4>
                <p className="text-gray-700 text-sm mb-2"><strong>2-4 weeks before expiry:</strong> Start preparing documents, gather proof of continued operation</p>
                <p className="text-gray-700 text-sm mb-2"><strong>1-2 weeks before expiry:</strong> Submit renewal application (online or in-person), pay fee</p>
                <p className="text-gray-700 text-sm"><strong>Within 1 week after expiry:</strong> County office should have approved. Grace period: Most counties allow 30-60 days after expiry before penalties.</p>
              </div>
            </div>
          </section>

          {/* Documents */}
          <section id="documents" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Required Documents Checklist</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Here's the complete list of documents you'll need to submit with your application:</p>

              <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Document</th>
                      <th className="px-4 py-3 text-left font-semibold">Purpose</th>
                      <th className="px-4 py-3 text-left font-semibold">Required</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {documentsRequired.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 font-medium text-gray-900 text-sm">{item.document}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.purpose}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm"><span className={`px-2 py-1 rounded text-xs font-semibold ${item.required === 'Yes' ? 'bg-green-100 text-green-800' : item.required === 'Conditional' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>{item.required}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-600 p-4 rounded-lg mt-6">
                <h4 className="font-bold text-gray-900 mb-2">📋 Preparation Tips</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Make 2 copies of each document (one for county, one for you)</li>
                  <li>• Organize documents in folder (shows professionalism)</li>
                  <li>• Get certified copies if originals requested (costs KES 500-1,000 per copy)</li>
                  <li>• Keep digital copies (email to yourself as backup)</li>
                  <li>• Ask county office if unsure about any document requirement</li>
                  <li>• Submit comprehensive package (extra docs are better than missing ones)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Costs */}
          <section id="costs" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <DollarSign className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Costs & Fees by County (Comparison Table)</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Permit costs vary significantly by county. Here's a comparison of major counties:</p>

              <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto mb-6">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">County</th>
                      <th className="px-4 py-3 text-left font-semibold">Basic Permit</th>
                      <th className="px-4 py-3 text-left font-semibold">Food Certificate</th>
                      <th className="px-4 py-3 text-left font-semibold">Fire Certificate</th>
                      <th className="px-4 py-3 text-left font-semibold">Total (All 3)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {countyCosts.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 font-semibold text-gray-900 text-sm">{item.county}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.basicPermit}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.foodCert}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.fireCert}</td>
                        <td className="px-4 py-3 font-bold text-blue-600 text-sm">{item.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-600">
                  <p className="text-sm font-bold text-gray-900 mb-1">Budget Estimate</p>
                  <p className="text-gray-700 text-sm"><strong>Retail Shop:</strong> KES 3,000-10,000</p>
                  <p className="text-gray-700 text-sm"><strong>Restaurant:</strong> KES 15,000-35,000</p>
                  <p className="text-gray-700 text-sm"><strong>Online Business:</strong> KES 0-5,000</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
                  <p className="text-sm font-bold text-gray-900 mb-1">Additional Costs</p>
                  <p className="text-gray-700 text-sm"><strong>Lawyer:</strong> KES 2,000-10,000 (optional)</p>
                  <p className="text-gray-700 text-sm"><strong>Consultant:</strong> KES 2,000-5,000 (optional)</p>
                  <p className="text-gray-700 text-sm"><strong>Compliance fixes:</strong> KES 5,000-50,000</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-600">
                  <p className="text-sm font-bold text-gray-900 mb-1">Money-Saving Tips</p>
                  <p className="text-gray-700 text-sm">✓ Apply online (cheaper)</p>
                  <p className="text-gray-700 text-sm">✓ DIY preparation</p>
                  <p className="text-gray-700 text-sm">✓ Know your county fees</p>
                </div>
              </div>

              <p className="text-gray-700 text-sm"><strong>Note:</strong> Fees are approximate and subject to change. Check your specific county office for current fees. NEMA, KEBS, and other national licenses have separate costs (add KES 5,000-50,000+ depending on business type).</p>
            </div>
          </section>

          {/* Timeline */}
          <section id="timeline" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Processing Time & Timeline</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">How long does it take to get a business permit in Kenya?</p>

              <div className="space-y-3 mb-6">
                <div className="bg-white border-l-4 border-green-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">✓ Best Case (All Documents Complete)</h4>
                  <p className="text-gray-700 text-sm"><strong>3-5 days</strong> – Document verification (1 day) → Inspection (1 day) → Approval (1-2 days) → Permit issued (1 day)</p>
                </div>

                <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">⏱️ Average Case (Minor Delays)</h4>
                  <p className="text-gray-700 text-sm"><strong>5-10 days</strong> – Document verification (1-2 days) → Requests for clarification (2-3 days) → Inspection (1-2 days) → Approval (1 day) → Permit issued (1 day)</p>
                </div>

                <div className="bg-white border-l-4 border-orange-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-1">⚠️ Worst Case (Complications)</h4>
                  <p className="text-gray-700 text-sm"><strong>2-4 weeks</strong> – Missing documents (requires resubmission: 5-7 days) → Inspection fails (requires fixes: 1-2 weeks) → Multiple clarifications needed (5-10 days)</p>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">💡 How to Speed Up Processing</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• <strong>Online application:</strong> 2-5 days (faster than in-person)</li>
                  <li>• <strong>Complete documentation:</strong> Submit all required docs upfront (avoids delays)</li>
                  <li>• <strong>Monday-Wednesday submissions:</strong> Faster than Friday (end-of-week rush)</li>
                  <li>• <strong>Professional preparation:</strong> Hire consultant (KES 2,000-5,000) to avoid rejections</li>
                  <li>• <strong>Prepared premises:</strong> Have inspection-ready location (clean, safe, equipped)</li>
                  <li>• <strong>Express service:</strong> Some counties offer expedited processing (check availability, costs extra)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* eCitizen */}
          <section id="ecitizen" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <Globe className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Online Application via eCitizen Portal</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Many counties now allow online business permit applications through eCitizen (ecitizen.go.ke). Here's how it works:</p>

              <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-6 border-r-2 border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-3">✓ Counties with Online Service</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>✓ Nairobi (main city)</li>
                      <li>✓ Mombasa</li>
                      <li>✓ Kiambu</li>
                      <li>✓ Machakos</li>
                      <li>✓ Kisumu</li>
                      <li>✓ Makueni</li>
                      <li>More counties adding regularly</li>
                    </ul>
                  </div>

                  <div className="p-6">
                    <h4 className="font-bold text-gray-900 mb-3">eCitizen Benefits</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>✓ Faster (2-5 days vs 5-10 in-person)</li>
                      <li>✓ No queuing (24/7 access)</li>
                      <li>✓ Transparent (track status online)</li>
                      <li>✓ Cheaper (no travel costs)</li>
                      <li>✓ Convenient (apply from home)</li>
                      <li>✓ Digital permit (immediate download)</li>
                      <li>✓ Payment options (M-Pesa, card)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-600 p-5 rounded-lg mb-6">
                <h4 className="font-bold text-gray-900 mb-3">How to Apply via eCitizen (Step-by-Step)</h4>
                <ol className="space-y-2 text-gray-700 text-sm list-decimal list-inside">
                  <li><strong>Go to website:</strong> ecitizen.go.ke (or use app)</li>
                  <li><strong>Create account:</strong> Register with email, ID number, phone</li>
                  <li><strong>Log in:</strong> Use your credentials</li>
                  <li><strong>Select service:</strong> Choose "Business Permit" (or "Trade License")</li>
                  <li><strong>Fill form:</strong> Complete application details (business name, type, location, owner info)</li>
                  <li><strong>Upload documents:</strong> Scan and upload required documents (ID, lease, photos)</li>
                  <li><strong>Review:</strong> Double-check all information for accuracy</li>
                  <li><strong>Submit:</strong> Click submit (application goes to county office)</li>
                  <li><strong>Pay fee:</strong> Pay via M-Pesa or card (payment link provided)</li>
                  <li><strong>Wait for approval:</strong> County office reviews (2-5 days typical)</li>
                  <li><strong>Download permit:</strong> Once approved, download digital permit (PDF)</li>
                  <li><strong>Print permit:</strong> Print and display in your premises</li>
                </ol>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="font-bold text-gray-900 mb-2">✓ When eCitizen is Available</p>
                  <p className="text-gray-700 text-sm">Your county (most major ones) may have eCitizen. Check ecitizen.go.ke to see which counties offer business permits online.</p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="font-bold text-gray-900 mb-2">⚠️ If Your County Not Listed</p>
                  <p className="text-gray-700 text-sm">Visit county office in person or contact them (their website has office locations and phone numbers). Online coming to more counties soon.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Mistakes */}
          <section id="mistakes" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Common Mistakes to Avoid</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Here are the most common mistakes that delay or prevent permit approval:</p>

              <div className="space-y-3">
                {commonMistakes.map((item, index) => (
                  <div key={index} className="bg-white border-l-4 border-red-600 p-4 rounded-lg hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-gray-900 mb-1 flex items-start gap-2">
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      {item.mistake}
                    </h4>
                    <p className="text-gray-700 text-sm"><strong>Consequence:</strong> {item.consequence}</p>
                  </div>
                ))}
              </div>

              <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-lg mt-6">
                <p className="text-gray-700 text-sm"><strong>✓ Pro tip:</strong> Have a second person review your application before submission (catches mistakes). Or hire a consultant (KES 2,000-5,000) to review everything.</p>
              </div>
            </div>
          </section>

          {/* Penalties */}
          <section id="penalties" className="mb-12 scroll-mt-20">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Penalties for Operating Without License</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">Operating a business without a valid permit is illegal. Here's what happens if you're caught:</p>

              <div className="space-y-4 mb-6">
                <div className="bg-red-50 border-2 border-red-200 p-5 rounded-xl">
                  <h4 className="font-bold text-red-900 mb-2">💰 Financial Penalties</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• <strong>First offense:</strong> Fine KES 50,000-100,000</li>
                    <li>• <strong>Repeat offense:</strong> Fine KES 100,000-200,000 (much higher)</li>
                    <li>• <strong>Severe violations:</strong> Fine up to KES 500,000 (for serious cases)</li>
                    <li>• <strong>Equipment seizure:</strong> Seized goods sold at auction (seller keeps money)</li>
                    <li>• <strong>Loss of investment:</strong> All inventory/equipment may be lost</li>
                  </ul>
                </div>

                <div className="bg-orange-50 border-2 border-orange-200 p-5 rounded-xl">
                  <h4 className="font-bold text-orange-900 mb-2">⚖️ Legal Consequences</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• <strong>Jail time:</strong> Up to 3-6 months imprisonment possible</li>
                    <li>• <strong>Criminal record:</strong> Conviction affects future business licensing</li>
                    <li>• <strong>Court case:</strong> Must appear in court (expensive, time-consuming)</li>
                    <li>• <strong>Lawyer fees:</strong> Legal defense costs KES 10,000-50,000+</li>
                    <li>• <strong>Bail:</strong> If detained, need bail money upfront</li>
                  </ul>
                </div>

                <div className="bg-purple-50 border-2 border-purple-200 p-5 rounded-xl">
                  <h4 className="font-bold text-purple-900 mb-2">🏪 Business Consequences</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• <strong>Business closure:</strong> Immediate shutdown order</li>
                    <li>• <strong>Premises seal:</strong> Premises locked/sealed by authorities</li>
                    <li>• <strong>All inventory lost:</strong> Goods confiscated (not returned)</li>
                    <li>• <strong>Equipment seized:</strong> Furniture, machinery taken</li>
                    <li>• <strong>Customer loss:</strong> Customers find alternatives</li>
                    <li>• <strong>Reputation damage:</strong> Public record of violation (affects future business)</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border-2 border-blue-200 p-5 rounded-xl">
                  <h4 className="font-bold text-blue-900 mb-2">📋 Long-term Impacts</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• <strong>Future licensing:</strong> Harder to get permits later (new businesses, locations)</li>
                    <li>• <strong>Loan rejection:</strong> Banks unlikely to lend to convicted violator</li>
                    <li>• <strong>Tax audit:</strong> Revenue authority may audit past income</li>
                    <li>• <strong>Back taxes/penalties:</strong> Owe taxes + interest + fines for illegal period</li>
                    <li>• <strong>Business disputes:</strong> Contracts may be unenforceable (no legal standing)</li>
                    <li>• <strong>Insurance invalid:</strong> No coverage if operating illegally</li>
                  </ul>
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-600 p-5 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">✓ Why Getting a Permit is Worth It</h4>
                <p className="text-gray-700 text-sm mb-2">The cost of getting a permit (KES 2,000-15,000) is tiny compared to penalties if caught (KES 50,000-500,000+). Getting a permit is:</p>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>✓ Quick (3-10 days)</li>
                  <li>✓ Affordable (one-time cost)</li>
                  <li>✓ Legally required (non-negotiable)</li>
                  <li>✓ Protection (insurance against fines/closure)</li>
                  <li>✓ Professional (builds credibility)</li>
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
              <h2 className="text-2xl font-bold mb-4">Ready to Get Your Business Permit?</h2>
              <p className="text-blue-100 mb-6">Follow the steps above or use our quick-start guide. Remember: getting a permit is quick, cheap, and legally required.</p>
              
              <div className="flex flex-wrap gap-3">
                <a href="https://ecitizen.go.ke" target="_blank" rel="noopener noreferrer" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Apply Online Now
                </a>
                <a href="/how-to-register-business-kenya" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
                  Business Registration <ArrowRight className="w-5 h-5" />
                </a>
                <a href="/kra-pin-for-business-kenya" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
                  Get KRA PIN <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </section>

          {/* Internal Links */}
          <section className="mt-12 pt-8 border-t-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Related Business Registration Guides</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <a href="/how-to-register-business-kenya" className="p-4 border-2 border-blue-200 rounded-lg hover:shadow-lg transition-shadow hover:border-blue-600">
                <h4 className="font-bold text-gray-900 mb-1">How to Register a Business</h4>
                <p className="text-gray-600 text-sm">Complete guide to business registration in Kenya</p>
              </a>
              <a href="/limited-company-registration-kenya" className="p-4 border-2 border-green-200 rounded-lg hover:shadow-lg transition-shadow hover:border-green-600">
                <h4 className="font-bold text-gray-900 mb-1">Limited Company Registration</h4>
                <p className="text-gray-600 text-sm">How to register a limited company in Kenya</p>
              </a>
              <a href="/partnership-registration-kenya" className="p-4 border-2 border-orange-200 rounded-lg hover:shadow-lg transition-shadow hover:border-orange-600">
                <h4 className="font-bold text-gray-900 mb-1">Partnership Registration</h4>
                <p className="text-gray-600 text-sm">Register a partnership or LLP in Kenya</p>
              </a>
              <a href="/ngo-cbo-society-registration-kenya" className="p-4 border-2 border-purple-200 rounded-lg hover:shadow-lg transition-shadow hover:border-purple-600">
                <h4 className="font-bold text-gray-900 mb-1">NGO & Society Registration</h4>
                <p className="text-gray-600 text-sm">Register nonprofits, CBOs, and societies</p>
              </a>
              <a href="/kra-pin-for-business-kenya" className="p-4 border-2 border-red-200 rounded-lg hover:shadow-lg transition-shadow hover:border-red-600">
                <h4 className="font-bold text-gray-900 mb-1">KRA PIN Registration</h4>
                <p className="text-gray-600 text-sm">Complete guide to getting a KRA PIN</p>
              </a>
              <a href="/company-annual-returns-kenya" className="p-4 border-2 border-indigo-200 rounded-lg hover:shadow-lg transition-shadow hover:border-indigo-600">
                <h4 className="font-bold text-gray-900 mb-1">Annual Returns & Compliance</h4>
                <p className="text-gray-600 text-sm">Filing annual returns and staying compliant</p>
              </a>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default BusinessPermitsLicensesKenya;
