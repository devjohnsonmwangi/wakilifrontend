import React, { useState, useEffect } from 'react';
import { ChevronDown, AlertTriangle, BookOpen, Home, CheckCircle, ArrowRight, FileText, Building2, MapPin, Scale, MessageSquare } from 'lucide-react';

// FAQ Data - Constant at file level to avoid React Hook dependency warnings
const faqsData = [
  {
    id: 1,
    question: 'What is planning permission and why do I need it?',
    answer: 'Planning permission is legal authorization from your county government to develop or use land for a specific purpose. It ensures your project complies with county development plans, zoning regulations, and building codes. Without planning permission, you cannot legally develop property, apply for building permits, or obtain financing. Violations can result in demolition orders, fines, or legal prosecution.'
  },
  {
    id: 2,
    question: 'How long does it take to get planning permission in Kenya?',
    answer: 'Planning permission typically takes 4-8 weeks from application submission. The process includes: initial submission and verification (1-2 weeks), county assessment and consultation (2-4 weeks), public notice period if required (2-3 weeks), and final approval/rejection (1 week). Incomplete applications or objections can extend this timeline to 3-6 months. Some counties offer expedited processing for additional fees.'
  },
  {
    id: 3,
    question: 'What is the difference between planning permission and a building permit?',
    answer: 'Planning permission (development approval) confirms your project aligns with zoning laws and county plans. A building permit (separate from planning permission) authorizes construction and ensures compliance with building codes, safety standards, and structural requirements. You typically need planning permission first, then apply for a building permit. Both are required for legal construction in Kenya.'
  },
  {
    id: 4,
    question: 'What happens if I build without planning permission?',
    answer: 'Building without planning permission violates the Physical Planning Act and exposes you to: immediate stop-work orders, demolition of unauthorized structures, fines up to KES 500,000 or imprisonment, loss of investment, inability to sell or mortgage property, prosecution by county authorities. Properties built illegally cannot be formally transferred or financed. The county can demolish structures at owner\'s expense.'
  },
  {
    id: 5,
    question: 'Can I change the zoning of my land?',
    answer: 'Yes, land zoning can be changed through a formal process: submit a zoning variance/change application to the county planning office, provide justification (economic, environmental, or social reasons), undergo county review and public consultation (2-4 weeks), attend public hearings if objections are raised, obtain county approval. Zoning changes are expensive and time-consuming but possible. Success depends on alignment with county development plans.'
  },
  {
    id: 6,
    question: 'What documents do I need for planning permission application?',
    answer: 'Required documents typically include: original title deed or lease, ID/business registration certificate, detailed site plans showing current and proposed development, architect/engineer drawings, land survey showing boundaries and dimensions, proof of ownership, environmental impact assessment (if required), access/infrastructure plans, proof of utility availability. Requirements vary by county and project type. Check with your specific county planning office.'
  },
  {
    id: 7,
    question: 'How much does planning permission cost in Kenya?',
    answer: 'Planning permission fees vary by county and project value: residential: KES 10,000-50,000, commercial: KES 30,000-100,000+, industrial: KES 50,000-150,000+, mixed-use/special: KES 75,000-200,000+. Additional costs: architect/engineer fees (KES 50,000-500,000), survey costs (KES 20,000-100,000), legal fees (KES 20,000-100,000), environmental assessment if required (KES 50,000-200,000). Total can range from KES 100,000 to over KES 1 million.'
  },
  {
    id: 8,
    question: 'Can neighbors object to my planning permission application?',
    answer: 'Yes, neighbors can lodge objections during the public notice/gazette period (typically 14-21 days). Valid objections include: environmental concerns, access issues, safety hazards, incompatibility with neighborhood character, infrastructure strain, boundary disputes. The county reviews all objections before making final decisions. Legitimate objections can delay approval or lead to rejection. Addressing neighbor concerns early can prevent delays.'
  },
  {
    id: 9,
    question: 'What are the different zoning categories in Kenya?',
    answer: 'Common Kenya zoning categories: Residential (homes, apartments, houses), Commercial (retail, offices, restaurants), Industrial (manufacturing, warehousing, factories), Agricultural (farming, ranching, forestry), Mixed-Use (combination of residential and commercial), Recreational (parks, sports, entertainment), Institutional (schools, hospitals, government offices), Conservation (protected areas, forests, water sources). Each zone has specific building restrictions, plot sizes, and use limitations.'
  },
  {
    id: 10,
    question: 'What is a building code and how does it relate to planning permission?',
    answer: 'Building codes are technical standards for construction safety, structural integrity, and quality. Planning permission approves land use; building codes approve construction methods. You need planning permission first (zoning/land use approval), then building codes compliance (construction standards approval). Building codes cover: structural design, fire safety, electrical systems, plumbing, ventilation, accessibility, materials, and earthquake resistance. Non-compliance can result in permit rejection or demolition.'
  },
  {
    id: 11,
    question: 'Can I subdivide residential land and apply for commercial zoning?',
    answer: 'Subdividing residential land for commercial use requires both subdivision approval (separate from planning permission) and commercial zoning approval. Each county has minimum plot sizes for commercial use (typically 0.5-2 acres). The process involves: obtaining subdivision approval, applying for commercial zoning change, county review and consultation, public notice period, commercial planning permission. This is complex and time-consuming. Consult county planning office for feasibility.'
  },
  {
    id: 12,
    question: 'What are the penalties for violating zoning laws?',
    answer: 'Penalties for zoning violations include: demolition orders (structures demolished at owner\'s expense), fines ranging from KES 100,000 to KES 500,000, imprisonment (up to 5 years in severe cases), loss of investment (property cannot be sold/mortgaged), legal prosecution, repeated violations can result in criminal charges. Additionally, unauthorized structures reduce property value significantly and create legal complications for buyers/lenders.'
  },
  {
    id: 13,
    question: 'How do I appeal a rejected planning permission application?',
    answer: 'To appeal a rejection: obtain written reasons from the county within 7 days, address stated deficiencies (incomplete docs, zoning violation, etc.), resubmit corrected application with appeal letter, or request formal administrative review. Appeal process typically takes 2-4 weeks. If county decision stands, you can pursue judicial review in High Court (expensive and time-consuming). Success depends on merits of appeal. Hire lawyers for complex cases.'
  },
  {
    id: 14,
    question: 'Can I get planning permission for agricultural land in urban areas?',
    answer: 'Developing agricultural land in urban fringe areas requires: verification that land is designated for development in county plans, agricultural zoning change (if applicable), subdivision approval if needed, environmental compliance, infrastructure availability assessment. Some counties restrict agricultural land development. Zoning change approval depends on location, infrastructure, and county policies. Consult county planning office for specific site feasibility.'
  },
  {
    id: 15,
    question: 'What is meant by development in a "protected area" and what are the restrictions?',
    answer: 'Protected areas include national parks, forests, water sources, heritage sites, environmental zones, and flood plains. Development in protected areas is heavily restricted or prohibited. Special approvals required: Environmental and Social Impact Assessment (ESIA), conservation authority consent, national environment compliance, public consultation. Penalties for illegal development in protected areas are severe including demolition, high fines, and criminal prosecution. Most protected area development is denied.'
  }
];

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const PlanningPermissionZoningLawsKenya: React.FC = () => {
  const [activeSection, setActiveSection] = useState('what-is');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  // SEO Meta Tags Setup
  useEffect(() => {
    // Set page title
    document.title = 'Planning Permission & Zoning Laws in Kenya – Complete Legal Guide';

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Complete guide to planning permission and zoning laws in Kenya. Learn how to get approval, fees, penalties, and legal requirements for developers.');
    }

    // Update keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'planning permission Kenya, zoning laws Kenya, building permit Kenya, land use regulations, county planning approval, development permission Kenya');
    }

    // OpenGraph tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', 'Planning Permission & Zoning Laws in Kenya – Complete Guide');

    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescription);
    }
    ogDescription.setAttribute('content', 'Learn how to get planning permission, zoning requirements, building permits, and penalties for violations in Kenya. Complete legal guide for developers.');

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute('content', 'https://wakili.app/planning-permission-zoning-laws-kenya');

    let ogImage = document.querySelector('meta[property="og:image"]');
    if (!ogImage) {
      ogImage = document.createElement('meta');
      ogImage.setAttribute('property', 'og:image');
      document.head.appendChild(ogImage);
    }
    ogImage.setAttribute('content', 'https://wakili.app/og-planning-permission.jpg');

    // Twitter tags
    let twitterCard = document.querySelector('meta[name="twitter:card"]');
    if (!twitterCard) {
      twitterCard = document.createElement('meta');
      twitterCard.setAttribute('name', 'twitter:card');
      document.head.appendChild(twitterCard);
    }
    twitterCard.setAttribute('content', 'summary_large_image');

    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (!twitterTitle) {
      twitterTitle = document.createElement('meta');
      twitterTitle.setAttribute('name', 'twitter:title');
      document.head.appendChild(twitterTitle);
    }
    twitterTitle.setAttribute('content', 'Planning Permission & Zoning Laws in Kenya – Complete Guide');

    let twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (!twitterDescription) {
      twitterDescription = document.createElement('meta');
      twitterDescription.setAttribute('name', 'twitter:description');
      document.head.appendChild(twitterDescription);
    }
    twitterDescription.setAttribute('content', 'Step-by-step guide to planning permission, zoning laws, building permits, and legal requirements in Kenya.');

    // Robots meta
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute('content', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://wakili.app/planning-permission-zoning-laws-kenya');

    // JSON-LD Structured Data
    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': 'https://wakili.app/planning-permission-zoning-laws-kenya',
          'url': 'https://wakili.app/planning-permission-zoning-laws-kenya',
          'name': 'Planning Permission & Zoning Laws in Kenya – Complete Legal Guide',
          'description': 'Complete guide to planning permission, zoning laws, building permits, and regulations in Kenya.',
          'isPartOf': { '@id': 'https://wakili.app' },
          'inLanguage': 'en-KE'
        },
        {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://wakili.app' },
            { '@type': 'ListItem', 'position': 2, 'name': 'Planning Permission & Zoning', 'item': 'https://wakili.app/planning-permission-zoning-laws-kenya' }
          ]
        },
        {
          '@type': 'FAQPage',
          'mainEntity': faqsData.map((faq: FAQItem) => ({
            '@type': 'Question',
            'name': faq.question,
            'acceptedAnswer': { '@type': 'Answer', 'text': faq.answer }
          }))
        },
        {
          '@type': 'HowTo',
          'name': 'How to Get Planning Permission in Kenya',
          'description': 'Step-by-step guide to obtaining planning permission in Kenya',
          'step': [
            { '@type': 'HowToStep', 'name': 'Prepare Site Plans', 'text': 'Create detailed site plans showing current land use and proposed development' },
            { '@type': 'HowToStep', 'name': 'Gather Documents', 'text': 'Collect title deed, ID, architect drawings, and environmental assessments' },
            { '@type': 'HowToStep', 'name': 'Submit Application', 'text': 'Submit application and documents to county planning office' },
            { '@type': 'HowToStep', 'name': 'County Review', 'text': 'County assesses compliance with zoning laws and development plans' },
            { '@type': 'HowToStep', 'name': 'Public Notice', 'text': 'Project published in gazette for public objection period (14-21 days)' },
            { '@type': 'HowToStep', 'name': 'Final Approval', 'text': 'County approves and issues planning permission certificate' }
          ]
        },
        {
          '@type': 'GovernmentService',
          'name': 'Planning Permission & Zoning Services in Kenya',
          'description': 'Official guide to planning permission and zoning laws in Kenya',
          'areaServed': { '@type': 'Country', 'name': 'Kenya' },
          'serviceType': 'Planning and Zoning Services'
        }
      ]
    };

    let jsonLdScript = document.querySelector('script[type="application/ld+json"]');
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(jsonLdScript);
    }
    jsonLdScript.textContent = JSON.stringify(structuredData);
  }, []);

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Breadcrumb Navigation */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 md:px-8 py-3 flex items-center gap-2 overflow-x-auto">
          <a href="/" className="text-indigo-600 hover:text-indigo-800 whitespace-nowrap text-sm">Home</a>
          <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-gray-700 whitespace-nowrap text-sm">Planning Permission & Zoning</span>
        </div>
      </div>

      {/* Hero Section with Gradient Background */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white py-12 sm:py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 md:px-8">
          <div className="flex items-start gap-4">
            <Building2 className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 mt-2" />
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 leading-tight">
                Planning Permission & Zoning Laws in Kenya
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-indigo-50 mb-6 leading-relaxed">
                Complete step-by-step guide to obtaining planning permission, understanding zoning regulations, building permits, and navigating legal requirements for developers and landowners in Kenya.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://wa.me/254112810203?text=I%20need%20help%20with%20planning%20permission%20and%20zoning"
                  className="inline-flex items-center justify-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition text-sm sm:text-base"
                >
                  <MessageSquare className="w-4 h-4" />
                  Get Help via WhatsApp
                </a>
                <a
                  href="mailto:johnsonthuraniramwangi@gmail.com"
                  className="inline-flex items-center justify-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition text-sm sm:text-base"
                >
                  <FileText className="w-4 h-4" />
                  Email for Details
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="content-full-width">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 md:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Mobile Horizontal TOC */}
          <div className="mb-8 lg:hidden">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Sections</h3>
            <div className="overflow-x-auto -mx-2 px-2 pb-2">
              <nav className="flex gap-2 min-w-max">
                {[
                  { id: 'what-is', label: 'What is Zoning?' },
                  { id: 'legal-framework', label: 'Legal Framework' },
                  { id: 'zoning-types', label: 'Zoning Types' },
                  { id: 'permission-guide', label: 'Permission Guide' },
                  { id: 'documents', label: 'Documents' },
                  { id: 'fees', label: 'Fees' },
                  { id: 'common-mistakes', label: 'Common Mistakes' },
                  { id: 'penalties', label: 'Penalties' },
                  { id: 'special-cases', label: 'Special Cases' },
                  { id: 'faqs', label: 'FAQs' },
                ].map(section => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`px-3 py-1 rounded-full text-xs sm:text-sm whitespace-nowrap transition border-b-2 ${
                      activeSection === section.id
                        ? 'border-b-2 border-indigo-600 text-indigo-600 bg-indigo-100'
                        : 'border-b-2 border-gray-300 text-gray-700 hover:text-indigo-600'
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Desktop Sticky TOC */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 bg-gray-50 rounded-lg p-4 border-l-4 border-indigo-600">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">On This Page</h3>
              <nav className="space-y-2">
                {[
                  { id: 'what-is', label: 'What is Zoning?' },
                  { id: 'legal-framework', label: 'Legal Framework' },
                  { id: 'zoning-types', label: 'Zoning Types' },
                  { id: 'permission-guide', label: 'Permission Guide' },
                  { id: 'documents', label: 'Documents' },
                  { id: 'fees', label: 'Fees' },
                  { id: 'common-mistakes', label: 'Common Mistakes' },
                  { id: 'penalties', label: 'Penalties' },
                  { id: 'special-cases', label: 'Special Cases' },
                  { id: 'faqs', label: 'FAQs' },
                ].map(section => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`block w-full text-left px-3 py-2 rounded text-sm transition ${
                      activeSection === section.id
                        ? 'bg-indigo-100 text-indigo-700 border-l-4 border-indigo-600'
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-100'
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* What is Zoning */}
            <section id="what-is" className="scroll-mt-20">
              <div className="flex items-start gap-3 mb-4">
                <Home className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What Are Zoning Laws and Planning Permissions?</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                Zoning laws are regulations that designate how land can be used in different areas. They divide towns and counties into zones (residential, commercial, industrial, agricultural) where specific land uses are permitted. Planning permission is legal authorization from your county government to develop or use land in a way that complies with zoning regulations and county development plans.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Together, zoning and planning permission ensure orderly urban development, protect neighborhoods, preserve agricultural areas, and maintain public safety. Without proper planning permission aligned with zoning laws, property development is illegal and can result in demolition, fines, and criminal prosecution.
              </p>
              <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded">
                <p className="text-sm text-gray-800"><strong>Key Point:</strong> Planning permission and zoning compliance are MANDATORY before any land development. Building without permission violates Kenyan law and exposes you to severe penalties.</p>
              </div>
            </section>

            {/* Legal Framework */}
            <section id="legal-framework" className="scroll-mt-20">
              <div className="flex items-start gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Legal Framework Governing Planning & Zoning</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                Land planning and zoning in Kenya are governed by multiple national and county-level statutes:
              </p>
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">Physical Planning Act, 2019</h3>
                  <p className="text-gray-700 text-sm">The primary legislation governing land planning, zoning, and building control in Kenya. Sets standards for county planning offices, development procedures, and enforcement of zoning regulations. Requires all development to align with approved county and local development plans.</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">County Government Act, 2012</h3>
                  <p className="text-gray-700 text-sm">Delegates planning and zoning authority to county governments. Each county has a planning office responsible for: issuing planning permission, enforcing zoning laws, maintaining development plans, and penalizing violations. County regulations vary, so check specific requirements with your county.</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">Building Code & Construction Standards</h3>
                  <p className="text-gray-700 text-sm">Separate from planning permission, building codes govern construction standards, structural safety, fire safety, electrical systems, plumbing, and material quality. Building permits (distinct from planning permission) enforce these codes. Both planning permission and building permits are required.</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">Land Act, 2012</h3>
                  <p className="text-gray-700 text-sm">Governs overall land rights and management. Requires compliance with zoning regulations when exercising land rights. Prohibits land use that violates planning regulations or damages environmental or public interests.</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">Environmental Management and Co-ordination Act (EMCA), 1999</h3>
                  <p className="text-gray-700 text-sm">Requires environmental compliance for development projects. Large-scale developments need Environmental and Social Impact Assessments (ESIA). Protects water sources, forests, wildlife, and sensitive ecosystems from harmful development.</p>
                </div>
              </div>
            </section>

            {/* Zoning Types */}
            <section id="zoning-types" className="scroll-mt-20">
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Types of Zoning in Kenya</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                Kenya uses different zoning categories to control land use and ensure compatible development patterns:
              </p>
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">Residential Zoning</h3>
                  <p className="text-gray-700 text-sm">Designated for homes, apartments, and residential complexes. Allowed: single/multi-family homes, residential parks, schools, health centers. Prohibited: industries, heavy commercial, warehouses. Typical minimum plot sizes: urban 0.05-0.25 acres, suburban 0.25-1 acre.</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">Commercial Zoning</h3>
                  <p className="text-gray-700 text-sm">For retail, offices, restaurants, shops, and commercial services. Allowed: retail stores, offices, restaurants, banks, hotels. Prohibited: heavy manufacturing, residential. Typically requires minimum 0.5-2 acres. Higher building density and road frontage requirements.</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">Industrial Zoning</h3>
                  <p className="text-gray-700 text-sm">Designated for manufacturing, processing, and large-scale production. Allowed: factories, warehouses, processing plants, heavy equipment. Prohibited: residential, retail. Typically requires 1-5+ acres. Located away from residential areas. Strict environmental compliance.</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">Agricultural Zoning</h3>
                  <p className="text-gray-700 text-sm">For farming, ranching, and agricultural activities. Allowed: crop farming, livestock, forestry, agro-tourism. Prohibited: urban-scale development. Minimum plot sizes often 2-5 acres. Environmental protections for soil and water conservation.</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">Mixed-Use Zoning</h3>
                  <p className="text-gray-700 text-sm">Allows combination of residential, commercial, and recreational uses. Common in town centers and development hubs. Flexible but must maintain separation between incompatible uses (e.g., industry away from housing). Requires integrated planning for parking, access, utilities.</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">Special/Institutional Zoning</h3>
                  <p className="text-gray-700 text-sm">For schools, hospitals, government offices, religious institutions, recreational parks. Unique regulations per facility type. Often exempted from standard zoning restrictions but still require planning permission. Subject to different approval procedures.</p>
                </div>
              </div>
            </section>

            {/* Permission Guide */}
            <section id="permission-guide" className="scroll-mt-20">
              <div className="flex items-start gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Step-by-Step Guide to Obtain Planning Permission</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                The process for obtaining planning permission in Kenya follows this structured procedure:
              </p>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">1</div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Verify Zoning & Feasibility</h3>
                    <p className="text-gray-700 text-sm">Check your county's development plan and zoning map to confirm your intended use is permitted on your land. Visit the county planning office to verify zoning designation. Confirm infrastructure (roads, water, electricity) is available. Check for any environmental restrictions.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">2</div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Prepare Site Plans & Drawings</h3>
                    <p className="text-gray-700 text-sm">Hire an architect or engineer to prepare detailed site plans showing: current land use, proposed development, dimensions, plot boundaries, parking areas, access routes, utilities. Plans must meet county standards and be to scale. Include existing structures, trees, and topography.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">3</div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Gather Required Documents</h3>
                    <p className="text-gray-700 text-sm">Collect: original title deed/lease, national ID or business registration, architect drawings, site survey, proof of ownership, environmental assessment (if required), utility availability letters. Exact requirements vary by county and project type. Contact planning office for complete checklist.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">4</div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Submit Application to County Planning Office</h3>
                    <p className="text-gray-700 text-sm">Submit application forms (county-specific) with all documents to the planning department. Pay application fees (varies by county and project type). Get receipt and reference number. Confirm submission deadline for objections.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">5</div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">County Review & Assessment</h3>
                    <p className="text-gray-700 text-sm">County planning officers review your application for: zoning compliance, development plan alignment, infrastructure adequacy, environmental concerns. May request additional information or site inspection. This typically takes 2-4 weeks. The county may approve, reject, or request modifications.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">6</div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Public Notice & Objection Period</h3>
                    <p className="text-gray-700 text-sm">County publishes your application in the county gazette and local newspapers (14-21 day notice period). Neighbors can lodge objections based on environmental, boundary, or access concerns. Address legitimate objections before final approval. No objections typically result in approval.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">7</div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Receive Planning Permission</h3>
                    <p className="text-gray-700 text-sm">Once approved, the county issues a Planning Permission certificate. This authorizes you to begin detailed design and apply for a building permit. Approval is typically conditional on compliance with specified conditions. Display the permit on your site during construction.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">8</div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Apply for Building Permit</h3>
                    <p className="text-gray-700 text-sm">With planning permission approved, submit detailed construction drawings and engineering plans to obtain a building permit. Building permit ensures compliance with construction codes and standards. Building cannot legally commence without both planning permission AND building permit.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Documents Required */}
            <section id="documents" className="scroll-mt-20">
              <div className="flex items-start gap-3 mb-4">
                <FileText className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Documents Required for Planning Permission</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                Have these documents ready when applying for planning permission:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-indigo-100">
                      <th className="border border-gray-300 p-3 text-left font-bold text-gray-900">Document</th>
                      <th className="border border-gray-300 p-3 text-left font-bold text-gray-900">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-3">Original Title Deed/Lease</td>
                      <td className="border border-gray-300 p-3 text-gray-700">Certificate of title or certificate of lease with your name as owner/leaseholder</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 p-3">National ID/Business Registration</td>
                      <td className="border border-gray-300 p-3 text-gray-700">Photocopy of valid national ID for individuals or business registration certificate for companies</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">Site Plans & Drawings</td>
                      <td className="border border-gray-300 p-3 text-gray-700">Detailed architectural/engineering drawings showing current and proposed development, prepared by licensed professional</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 p-3">Land Survey Plan</td>
                      <td className="border border-gray-300 p-3 text-gray-700">Recent survey showing exact plot boundaries, dimensions, and area (from registered surveyor)</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">Proof of Ownership</td>
                      <td className="border border-gray-300 p-3 text-gray-700">Utility bills, tax receipts, local authority letter, or chief's letter confirming ownership</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 p-3">Location Map</td>
                      <td className="border border-gray-300 p-3 text-gray-700">Map showing land location relative to main roads, landmarks, and infrastructure</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">Environmental Assessment</td>
                      <td className="border border-gray-300 p-3 text-gray-700">Environmental impact assessment (ESIA) for large-scale projects or sensitive areas</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 p-3">Utility Availability Letters</td>
                      <td className="border border-gray-300 p-3 text-gray-700">Letters from water, electricity, and waste management providers confirming service availability</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">Access Certificate</td>
                      <td className="border border-gray-300 p-3 text-gray-700">Evidence that land has legal access to public road (easement or direct frontage)</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 p-3">Application Form</td>
                      <td className="border border-gray-300 p-3 text-gray-700">County-specific planning permission application form (obtain from county planning office)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-gray-700 text-sm mt-4">
                <strong>Tip:</strong> Incomplete applications cause rejection or delays. Contact your county planning office for a complete, current checklist of requirements before submitting.
              </p>
            </section>

            {/* Fees & Charges */}
            <section id="fees" className="scroll-mt-20">
              <div className="flex items-start gap-3 mb-4">
                <Scale className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Planning Permission Fees & Charges</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                Planning permission costs vary significantly by county, project type, and land value:
              </p>
              <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-indigo-100">
                      <th className="border border-gray-300 p-3 text-left font-bold text-gray-900">Project Type</th>
                      <th className="border border-gray-300 p-3 text-left font-bold text-gray-900">Typical Fee Range (KES)</th>
                      <th className="border border-gray-300 p-3 text-left font-bold text-gray-900">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-3">Single-Family Residential</td>
                      <td className="border border-gray-300 p-3 text-gray-700">10,000 - 50,000</td>
                      <td className="border border-gray-300 p-3 text-gray-700">Varies by county and property value</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 p-3">Multi-Unit Residential</td>
                      <td className="border border-gray-300 p-3 text-gray-700">30,000 - 100,000</td>
                      <td className="border border-gray-300 p-3 text-gray-700">Apartments, condos, complexes</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">Commercial/Retail</td>
                      <td className="border border-gray-300 p-3 text-gray-700">40,000 - 150,000</td>
                      <td className="border border-gray-300 p-3 text-gray-700">Shops, offices, restaurants</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 p-3">Industrial</td>
                      <td className="border border-gray-300 p-3 text-gray-700">60,000 - 200,000</td>
                      <td className="border border-gray-300 p-3 text-gray-700">Factories, warehouses, manufacturing</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">Mixed-Use/Large Developments</td>
                      <td className="border border-gray-300 p-3 text-gray-700">100,000 - 500,000+</td>
                      <td className="border border-gray-300 p-3 text-gray-700">Depends on scope and value</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded mb-6">
                <p className="text-sm text-gray-800"><strong>Additional Costs to Budget:</strong></p>
                <ul className="text-sm text-gray-800 list-disc list-inside mt-2 space-y-1">
                  <li>Architect/Engineer Fees: KES 50,000-500,000+</li>
                  <li>Land Survey: KES 20,000-100,000</li>
                  <li>Environmental Assessment: KES 50,000-200,000 (if required)</li>
                  <li>Legal Fees: KES 20,000-100,000</li>
                  <li>Building Permit Fees: Separate from planning permission</li>
                </ul>
              </div>
              <p className="text-gray-700 text-sm">
                <strong>Total Estimated Cost:</strong> For a typical residential project: KES 150,000-750,000 (including professional fees). Large commercial projects can exceed KES 1 million.
              </p>
            </section>

            {/* Common Mistakes */}
            <section id="common-mistakes" className="scroll-mt-20">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Common Mistakes That Delay Approval</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                Avoid these errors that cause rejection or significant delays:
              </p>
              <div className="space-y-4">
                <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
                  <h3 className="font-bold text-red-900 mb-2">Incomplete or Poor Quality Site Plans</h3>
                  <p className="text-sm text-red-800">Site plans must be detailed, to scale, and meet professional standards. Vague or incomplete plans cause immediate rejection. Use licensed architects/engineers.</p>
                </div>
                <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
                  <h3 className="font-bold text-red-900 mb-2">Zoning Violation from the Start</h3>
                  <p className="text-sm text-red-800">Proposing development that violates zoning regulations (e.g., industrial use in residential zone) will be rejected. Verify zoning BEFORE investing in plans.</p>
                </div>
                <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
                  <h3 className="font-bold text-red-900 mb-2">Missing Required Documents</h3>
                  <p className="text-sm text-red-800">Incomplete applications are rejected. Get a complete checklist from your county and have ALL documents ready before submitting.</p>
                </div>
                <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
                  <h3 className="font-bold text-red-900 mb-2">Inadequate Infrastructure/Access</h3>
                  <p className="text-sm text-red-800">If land lacks road access, utilities, or parking, applications are rejected. Address infrastructure requirements before applying.</p>
                </div>
                <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
                  <h3 className="font-bold text-red-900 mb-2">Environmental Concerns Unaddressed</h3>
                  <p className="text-sm text-red-800">Projects in protected areas or near water sources require special assessments. Ignoring environmental requirements causes rejection.</p>
                </div>
                <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
                  <h3 className="font-bold text-red-900 mb-2">Boundary Disputes Unresolved</h3>
                  <p className="text-sm text-red-800">Boundary conflicts with neighbors cause objections and delays. Resolve disputes before applying for planning permission.</p>
                </div>
              </div>
            </section>

            {/* Penalties */}
            <section id="penalties" className="scroll-mt-20">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Penalties for Violating Zoning Laws</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                Building without planning permission or violating zoning laws results in severe penalties:
              </p>
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-bold text-red-900 mb-2">Demolition Orders</h3>
                  <p className="text-gray-700 text-sm">Unauthorized structures can be ordered demolished by the county at the owner's expense. The county executes demolition without compensation to the owner.</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-bold text-red-900 mb-2">Financial Penalties</h3>
                  <p className="text-gray-700 text-sm">Fines for building without permission range from KES 100,000 to KES 500,000+. Repeated violations incur additional fines and accumulating penalties.</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-bold text-red-900 mb-2">Criminal Prosecution</h3>
                  <p className="text-gray-700 text-sm">Severe violations can result in criminal charges, imprisonment (up to 5 years), or both. Prosecution reserved for intentional, flagrant violations.</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-bold text-red-900 mb-2">Loss of Investment</h3>
                  <p className="text-gray-700 text-sm">Illegal structures cannot be sold, mortgaged, or formally transferred. Your investment becomes worthless if demolished or cannot be formalized.</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-bold text-red-900 mb-2">Inability to Access Financing</h3>
                  <p className="text-gray-700 text-sm">Banks will not finance property without planning permission. Properties built illegally cannot be mortgaged or used as collateral.</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-bold text-red-900 mb-2">Ongoing County Action</h3>
                  <p className="text-gray-700 text-sm">County can take enforcement action years after construction. No statute of limitations protects illegal builders. Ongoing vulnerability to demolition or fines.</p>
                </div>
              </div>
            </section>

            {/* Special Cases */}
            <section id="special-cases" className="scroll-mt-20">
              <div className="flex items-start gap-3 mb-4">
                <Building2 className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Special Cases & Unique Situations</h2>
              </div>
              <div className="space-y-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-indigo-600" />
                    Development in Protected Areas
                  </h3>
                  <p className="text-gray-700 text-sm mb-3">
                    Protected areas include national parks, forests, water sources, heritage sites, and conservation zones. Development restrictions:
                  </p>
                  <ul className="text-gray-700 text-sm space-y-2 list-disc list-inside">
                    <li>Require special Environmental and Social Impact Assessment (ESIA)</li>
                    <li>Need national conservation authority approval</li>
                    <li>Subject to strict environmental compliance</li>
                    <li>Public consultation mandatory with extended timelines</li>
                    <li>Most development applications in protected areas are rejected</li>
                  </ul>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-indigo-600" />
                    Development on Subdivided Plots
                  </h3>
                  <p className="text-gray-700 text-sm mb-3">
                    Planning permission on subdivided land requires additional considerations:
                  </p>
                  <ul className="text-gray-700 text-sm space-y-2 list-disc list-inside">
                    <li>Each plot must comply with minimum size requirements</li>
                    <li>Each plot must have legal access to public road</li>
                    <li>Infrastructure (water, electricity) must serve all plots</li>
                    <li>May need to provide public facilities (roads, parks)</li>
                    <li>County ensures no individual plot development violates overall subdivision plan</li>
                  </ul>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-indigo-600" />
                    Development on Leasehold Land
                  </h3>
                  <p className="text-gray-700 text-sm mb-3">
                    Developing leasehold land has special requirements:
                  </p>
                  <ul className="text-gray-700 text-sm space-y-2 list-disc list-inside">
                    <li>May need landlord consent for certain development types</li>
                    <li>Remaining lease term (usually 30+ years minimum required)</li>
                    <li>Landlord may impose development restrictions in lease</li>
                    <li>County approves planning permission regardless of landlord consent</li>
                    <li>Landlord lease restrictions apply independently of planning permission</li>
                  </ul>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-indigo-600" />
                    Development in Flood-Prone Areas
                  </h3>
                  <p className="text-gray-700 text-sm mb-3">
                    Planning permission for development near water sources or in flood zones:
                  </p>
                  <ul className="text-gray-700 text-sm space-y-2 list-disc list-inside">
                    <li>Require hydrological studies and flood impact assessment</li>
                    <li>Minimum setbacks from rivers/water bodies enforced</li>
                    <li>Special building elevation or flood-resistant design may be required</li>
                    <li>Environmental approval from water authority needed</li>
                    <li>County often rejects development in high-risk flood zones</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* FAQs */}
            <section id="faqs" className="scroll-mt-20">
              <div className="flex items-start gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
              </div>
              <div className="space-y-3 mt-6">
                {faqsData.map((faq: FAQItem) => (
                  <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full px-4 py-4 flex items-center justify-between hover:bg-indigo-50 transition bg-white"
                    >
                      <span className="text-left font-semibold text-gray-900 text-sm sm:text-base">{faq.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-indigo-600 flex-shrink-0 transition-transform ${
                          openFAQ === faq.id ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openFAQ === faq.id && (
                      <div className="px-4 py-3 bg-indigo-50 border-t border-gray-200">
                        <p className="text-gray-700 text-sm leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Internal Links */}
            <section className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Related Resources
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="/land-ownership-title-deed-verification-kenya"
                  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm font-semibold group"
                >
                  Land Ownership & Title Verification
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </a>
                <a
                  href="/land-transfer-process-kenya"
                  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm font-semibold group"
                >
                  Land Transfer Process
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </a>
                <a
                  href="/how-to-buy-land-safely-kenya"
                  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm font-semibold group"
                >
                  How to Buy Land Safely
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </a>
                <a
                  href="/land-disputes-kenya"
                  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm font-semibold group"
                >
                  Land Disputes Guide
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </a>
                <a
                  href="/leasehold-freehold-kenya"
                  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm font-semibold group"
                >
                  Leasehold vs Freehold
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </a>
                <a
                  href="/lost-title-deed-replacement-kenya"
                  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm font-semibold group"
                >
                  Lost Deed Replacement
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </a>
                <a
                  href="/land-rates-property-taxes-kenya"
                  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm font-semibold group"
                >
                  Land Rates & Property Taxes
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </a>
                <a
                  href="/subdivision-survey-process-kenya"
                  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm font-semibold group"
                >
                  Subdivision & Survey Process
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </a>
              </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold mb-3">Need Expert Help with Planning Permission?</h3>
              <p className="text-indigo-100 mb-6 text-sm sm:text-base">
                Get professional guidance from experienced legal advisors. We help with zoning verification, application preparation, county negotiations, and compliance.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="https://wa.me/254112810203?text=I%20need%20help%20with%20planning%20permission"
                  className="inline-flex items-center justify-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition"
                >
                  <MessageSquare className="w-5 h-5" />
                  WhatsApp: +254 112 810 203
                </a>
                <a
                  href="mailto:johnsonthuraniramwangi@gmail.com"
                  className="inline-flex items-center justify-center gap-2 bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
                >
                  <FileText className="w-5 h-5" />
                  Email: johnsonthuraniramwangi@gmail.com
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-12 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <h4 className="text-white font-bold mb-3">About This Guide</h4>
              <p className="text-sm">Comprehensive guide to planning permission and zoning laws in Kenya. Updated regularly with latest legal requirements and county regulations.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3">Quick Links</h4>
              <ul className="text-sm space-y-2">
                <li><a href="/subdivision-survey-process-kenya" className="hover:text-white transition">Subdivision & Survey</a></li>
                <li><a href="/land-disputes-kenya" className="hover:text-white transition">Land Disputes</a></li>
                <li><a href="/how-to-buy-land-safely-kenya" className="hover:text-white transition">Buy Land Safely</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3">Contact</h4>
              <p className="text-sm">WhatsApp: +254 112 810 203</p>
              <p className="text-sm">Email: johnsonthuraniramwangi@gmail.com</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6">
            <p className="text-xs text-center text-gray-500">
              <strong>Disclaimer:</strong> This guide is for informational purposes only and does not constitute legal advice. Consult with qualified legal professionals and your county authorities for specific guidance. Laws and regulations may change; verify current requirements with relevant authorities.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PlanningPermissionZoningLawsKenya;