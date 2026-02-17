import React, { useState, useEffect } from 'react';
import { ChevronDown, AlertTriangle, BookOpen, Home, CheckCircle, ArrowRight, FileText, DollarSign, MapPin, Users, MessageSquare } from 'lucide-react';

// FAQ Data - Constant at file level to avoid React Hook dependency warnings
const faqsData = [
  {
    id: 1,
    question: 'How long does the land subdivision process take in Kenya?',
    answer: 'The land subdivision process typically takes 2-4 months from application to approval. This includes surveying (2-3 weeks), county review (3-6 weeks), and registry registration (2-4 weeks). However, delays can occur if documents are incomplete or if the county requests additional information. Rush applications through private surveyors may reduce survey time.'
  },
  {
    id: 2,
    question: 'What is the total cost of subdividing land in Kenya?',
    answer: 'Total subdivision costs range from KES 50,000 to KES 300,000+ depending on land size, location, and complexity. Survey fees: KES 30,000-150,000. Registry fees: KES 10,000-50,000. County approval fees: KES 5,000-30,000. Legal fees (optional): KES 15,000-50,000. Larger or more complex plots may cost significantly more.'
  },
  {
    id: 3,
    question: 'Do I need a lawyer to subdivide land?',
    answer: 'While not legally required, hiring a lawyer is highly recommended to: navigate complex documentation, ensure compliance with county regulations, handle objections, and protect your interests. Lawyers typically charge KES 15,000-50,000. Many property disputes arise from improper subdivision, so professional guidance is valuable.'
  },
  {
    id: 4,
    question: 'Can I subdivide agricultural land in Kenya?',
    answer: 'Yes, agricultural land can be subdivided under the Agricultural Land Act, but with restrictions: minimum plot size (usually 0.5-2 acres depending on county), agricultural zoning compliance, environmental considerations, and county approval. Some counties have stricter rules. Urban agricultural land may have different requirements than rural areas.'
  },
  {
    id: 5,
    question: 'What if my survey plan is rejected by the county?',
    answer: 'If rejected, the county provides reasons (usually within 2-4 weeks). Common reasons: surveyor errors, planning violations, environmental concerns, or incomplete documentation. You can: request clarification, hire a new surveyor for re-survey, address planning issues, or appeal the decision. Re-surveying typically costs KES 10,000-30,000.'
  },
  {
    id: 6,
    question: 'Who is qualified to conduct land surveys in Kenya?',
    answer: 'Only registered surveyors licensed by the Engineers Board of Kenya (EBK) can legally conduct surveys. Verify your surveyor\'s license on the EBK website or through the Board. Licensed surveyors must follow professional standards, maintain insurance, and submit work to county authorities for approval. Using unqualified surveyors can result in rejected surveys.'
  },
  {
    id: 7,
    question: 'Can I subdivide leasehold land?',
    answer: 'Leasehold subdivision is complex and requires: landlord consent (usually mandatory), survey by registered surveyor, county approval, and new sublease documents for each subdivision. The process is often more expensive than freehold subdivision and may involve additional legal fees. Your leasehold terms and landlord agreement determine if subdivision is permitted.'
  },
  {
    id: 8,
    question: 'What are the minimum and maximum plot sizes for subdivision?',
    answer: 'Minimum and maximum plot sizes vary by county and zone: Urban areas: 50-200 sq meters minimum. Peri-urban: 0.1-0.5 acres minimum. Rural agricultural: 0.5-2 acres minimum. Some counties have maximum sizes. Check with your specific county planning office for exact requirements, as they vary significantly.'
  },
  {
    id: 9,
    question: 'How do I verify that my surveyor is legitimate?',
    answer: 'Verify surveyors through: Engineers Board of Kenya (EBK) website - search licensed surveyors. Ask for professional license number and certificate. Check for professional indemnity insurance. Request references from previous clients. Cross-reference with county records. Legitimate surveyors maintain transparent communication and provide official survey documents with EBK seals.'
  },
  {
    id: 10,
    question: 'What happens if I subdivide land without following proper procedures?',
    answer: 'Subdividing without proper approval can result in: subdivision documents being rejected by registry, inability to sell individual plots, property disputes with neighbors, penalties from county government (up to KES 100,000), criminal prosecution in severe cases, and difficulty accessing finance/mortgages. Proper subdivision protects your legal rights and investment.'
  },
  {
    id: 11,
    question: 'Can neighbors object to my land subdivision?',
    answer: 'Yes, neighbors can lodge objections during the public notice period (usually 14-21 days in the gazette). Valid objections include: environmental concerns, access/boundary issues, zoning violations, or safety hazards. Objections delay approval. The county reviews all objections before approval. Your surveyor and county must address legitimate concerns for approval.'
  },
  {
    id: 12,
    question: 'What documents do I need before approaching a surveyor?',
    answer: 'Essential documents: Original title deed or certificate of lease. ID/Business registration certificate. Recent utility bills for proof of ownership. Existing survey plan (if available). Copy of land development plan from county. Map showing location. Having these ready speeds up the survey scheduling and reduces delays.'
  },
  {
    id: 13,
    question: 'Is there a difference between subdivision and land partitioning?',
    answer: 'Subdivision and partitioning are similar but have nuances: Subdivision usually creates multiple registered plots with individual titles. Partitioning may refer to informal divisions. For legal purposes in Kenya, both require formal survey, county approval, and registry registration. The terminology is often used interchangeably, but both require the same formal process.'
  },
  {
    id: 14,
    question: 'What if my land is in a disputed area or has boundary issues?',
    answer: 'Boundary disputes complicate subdivision: Have a professional land dispute resolution before subdivision (through courts or alternative dispute resolution). Get written neighbor consent if boundaries are unclear. Hire experienced surveyor familiar with dispute resolution. Resolve disputes first to avoid expensive delays and rejections. Title verification is critical before subdivision.'
  },
  {
    id: 15,
    question: 'Can I use an old survey plan instead of conducting a new survey?',
    answer: 'Using old survey plans is risky and usually not acceptable because: land boundaries may have changed, previous surveys may have errors, county regulations have evolved, and registries require current surveys meeting current standards. Conduct new surveys for accuracy. New surveys cost KES 30,000-150,000 but prevent expensive disputes and delays later.'
  }
];

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const SubdivisionSurveyProcessKenya: React.FC = () => {
  const [activeSection, setActiveSection] = useState('what-is');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  // SEO Meta Tags Setup
  useEffect(() => {
    // Set page title
    document.title = 'Land Subdivision & Survey in Kenya – Complete Legal Guide';

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Learn how to subdivide land in Kenya. Step-by-step guide to surveys, costs, county approval, and legal requirements for landowners.');
    }

    // Update keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'land subdivision Kenya, how to subdivide land, survey process Kenya, land surveyor fees, subdivision approval, agricultural land subdivision, survey plan Kenya');
    }

    // OpenGraph tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', 'Land Subdivision & Survey Process in Kenya – Step-by-Step Legal Guide');

    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescription);
    }
    ogDescription.setAttribute('content', 'Learn how to subdivide land in Kenya. Step-by-step guide to surveys, costs, county approval, and legal requirements for landowners and developers.');

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute('content', 'https://wakili.app/subdivision-survey-process-kenya');

    let ogImage = document.querySelector('meta[property="og:image"]');
    if (!ogImage) {
      ogImage = document.createElement('meta');
      ogImage.setAttribute('property', 'og:image');
      document.head.appendChild(ogImage);
    }
    ogImage.setAttribute('content', 'https://wakili.app/og-subdivision-survey.jpg');

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
    twitterTitle.setAttribute('content', 'Land Subdivision & Survey in Kenya – Complete Guide');

    let twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (!twitterDescription) {
      twitterDescription = document.createElement('meta');
      twitterDescription.setAttribute('name', 'twitter:description');
      document.head.appendChild(twitterDescription);
    }
    twitterDescription.setAttribute('content', 'Step-by-step guide to subdividing land, survey processes, costs, and legal requirements in Kenya.');

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
    canonical.setAttribute('href', 'https://wakili.app/subdivision-survey-process-kenya');

    // JSON-LD Structured Data
    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': 'https://wakili.app/subdivision-survey-process-kenya',
          'url': 'https://wakili.app/subdivision-survey-process-kenya',
          'name': 'Land Subdivision & Survey Process in Kenya – Step-by-Step Legal Guide',
          'description': 'Complete guide to subdividing land in Kenya, including survey processes, costs, county approval, and legal requirements.',
          'isPartOf': { '@id': 'https://wakili.app' },
          'inLanguage': 'en-KE'
        },
        {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://wakili.app' },
            { '@type': 'ListItem', 'position': 2, 'name': 'Land Subdivision & Survey', 'item': 'https://wakili.app/subdivision-survey-process-kenya' }
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
          'name': 'How to Subdivide Land in Kenya',
          'description': 'Step-by-step guide to subdividing land in Kenya',
          'step': [
            { '@type': 'HowToStep', 'name': 'Hire a Registered Surveyor', 'text': 'Contact a licensed surveyor registered with Engineers Board of Kenya' },
            { '@type': 'HowToStep', 'name': 'Conduct Land Survey', 'text': 'Surveyor conducts on-site measurement and mapping of your land' },
            { '@type': 'HowToStep', 'name': 'Prepare Survey Plan', 'text': 'Surveyor prepares detailed survey plan showing subdivisions' },
            { '@type': 'HowToStep', 'name': 'Obtain County Approval', 'text': 'Submit survey plan to county planning office for approval' },
            { '@type': 'HowToStep', 'name': 'Submit to Lands Registry', 'text': 'Once approved, submit to lands registry for registration' }
          ]
        },
        {
          '@type': 'GovernmentService',
          'name': 'Land Subdivision & Survey Services in Kenya',
          'description': 'Official guide to subdividing land and conducting surveys in Kenya',
          'areaServed': { '@type': 'Country', 'name': 'Kenya' },
          'serviceType': 'Land Survey and Subdivision Services'
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
          <a href="/" className="text-blue-600 hover:text-blue-800 whitespace-nowrap text-sm">Home</a>
          <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-gray-700 whitespace-nowrap text-sm">Land Subdivision & Survey</span>
        </div>
      </div>

      {/* Hero Section with Gradient Background */}
      <div className="bg-gradient-to-r from-blue-600 via-teal-600 to-cyan-600 text-white py-12 sm:py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 md:px-8">
          <div className="flex items-start gap-4">
            <MapPin className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 mt-2" />
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 leading-tight">
                Land Subdivision & Survey Process in Kenya
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-blue-50 mb-6 leading-relaxed">
                Complete step-by-step legal guide to subdividing land, conducting surveys, obtaining county approval, and navigating the registry process in Kenya.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://wa.me/254112810203?text=I%20need%20help%20with%20land%20subdivision%20and%20survey"
                  className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition text-sm sm:text-base"
                >
                  <MessageSquare className="w-4 h-4" />
                  Get Help via WhatsApp
                </a>
                <a
                  href="mailto:johnsonthuraniramwangi@gmail.com"
                  className="inline-flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition text-sm sm:text-base"
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
                  { id: 'what-is', label: 'What is Subdivision?' },
                  { id: 'legal-basis', label: 'Legal Basis' },
                  { id: 'survey-process', label: 'Survey Process' },
                  { id: 'requirements', label: 'Requirements' },
                  { id: 'fees-costs', label: 'Fees & Costs' },
                  { id: 'common-mistakes', label: 'Common Mistakes' },
                  { id: 'special-cases', label: 'Special Cases' },
                  { id: 'faqs', label: 'FAQs' },
                ].map(section => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`px-3 py-1 rounded-full text-xs sm:text-sm whitespace-nowrap transition border-b-2 ${
                      activeSection === section.id
                        ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-100'
                        : 'border-b-2 border-gray-300 text-gray-700 hover:text-blue-600'
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
            <div className="sticky top-24 bg-gray-50 rounded-lg p-4 border-l-4 border-blue-600">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">On This Page</h3>
              <nav className="space-y-2">
                {[
                  { id: 'what-is', label: 'What is Subdivision?' },
                  { id: 'legal-basis', label: 'Legal Basis' },
                  { id: 'survey-process', label: 'Survey Process' },
                  { id: 'requirements', label: 'Requirements' },
                  { id: 'fees-costs', label: 'Fees & Costs' },
                  { id: 'common-mistakes', label: 'Common Mistakes' },
                  { id: 'special-cases', label: 'Special Cases' },
                  { id: 'faqs', label: 'FAQs' },
                ].map(section => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`block w-full text-left px-3 py-2 rounded text-sm transition ${
                      activeSection === section.id
                        ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-600'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
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
            {/* What is Subdivision */}
            <section id="what-is" className="scroll-mt-20">
              <div className="flex items-start gap-3 mb-4">
                <Home className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What Is Land Subdivision?</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                Land subdivision is the legal process of dividing a single parcel of land into two or more smaller plots. Each subdivided plot receives its own individual title deed, allowing it to be bought, sold, mortgaged, or inherited independently. Subdivision transforms one property into multiple legally recognized properties.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                In Kenya, subdivision is governed by the Land Act, Land Registration Act, and County Government Act. It must be conducted by registered surveyors and approved by county authorities before being registered at the lands registry.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                <p className="text-sm text-gray-800"><strong>Key Point:</strong> Subdivision is not the same as informal land division. Only properly surveyed, approved, and registered subdivisions create legal, tradeable plots.</p>
              </div>
            </section>

            {/* Legal Basis */}
            <section id="legal-basis" className="scroll-mt-20">
              <div className="flex items-start gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Legal Basis Under Kenyan Law</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                Land subdivision in Kenya is governed by several key statutes and regulations:
              </p>
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">Land Act, 2012</h3>
                  <p className="text-gray-700 text-sm">Defines land rights, succession, and the process for land subdivision. Requires proper survey plans and county approvals.</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">Land Registration Act, 2012</h3>
                  <p className="text-gray-700 text-sm">Governs the registration of land at the lands registry. Subdivisions must be registered under this Act to be legally valid. All subdivided plots must be registered separately.</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">County Government Act, 2012</h3>
                  <p className="text-gray-700 text-sm">Delegates land planning and county approval authority to county governments. Each county has specific requirements and procedures for subdivision approval.</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">Physical Planning Act, 2019</h3>
                  <p className="text-gray-700 text-sm">Ensures subdivisions comply with county development plans, minimum plot sizes, and environmental standards. Counties use this to regulate subdivision approvals.</p>
                </div>
              </div>
            </section>

            {/* Survey Process */}
            <section id="survey-process" className="scroll-mt-20">
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Step-by-Step Land Survey Process</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                The land survey and subdivision process in Kenya follows a structured, multi-step procedure:
              </p>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">1</div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Hire a Registered Surveyor</h3>
                    <p className="text-gray-700 text-sm">Contact a surveyor licensed by the Engineers Board of Kenya (EBK). Verify their license number on the EBK website. Request quotes and compare fees. Provide the surveyor with your title deed and documentation.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">2</div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Conduct Land Survey</h3>
                    <p className="text-gray-700 text-sm">The surveyor visits your land to measure boundaries, create accurate mapping, and identify any boundary disputes or encroachments. This typically takes 1-3 weeks depending on land size and complexity.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">3</div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Prepare Survey Plan</h3>
                    <p className="text-gray-700 text-sm">Surveyor prepares a detailed survey plan showing the subdivisions, plot numbers, dimensions, and area. The plan must meet EBK standards and include the surveyor's seal and certification.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">4</div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Obtain County Approval</h3>
                    <p className="text-gray-700 text-sm">Submit the survey plan to your county planning office. The county reviews compliance with development plans, minimum plot sizes, and environmental standards. Approval typically takes 3-6 weeks. Address any county requests promptly.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">5</div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Public Notice & Objection Period</h3>
                    <p className="text-gray-700 text-sm">County publishes your subdivision in the gazette. Neighbors have 14-21 days to lodge objections. Address legitimate objections (boundary issues, environmental concerns) before registry submission.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">6</div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Submit to Lands Registry</h3>
                    <p className="text-gray-700 text-sm">Once county approval is confirmed, submit the approved plan to the lands registry along with your original title deed and application form. Registry registration typically takes 2-4 weeks.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">7</div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Receive New Title Deeds</h3>
                    <p className="text-gray-700 text-sm">Registry issues individual title deeds for each subdivided plot. You can then sell, mortgage, or transfer each plot independently. Collect your new deeds from the registry or have them couriered.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Requirements Checklist */}
            <section id="requirements" className="scroll-mt-20">
              <div className="flex items-start gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Subdivision Application Requirements</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                Ensure you have all required documents before applying for subdivision:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-blue-100">
                      <th className="border border-gray-300 p-3 text-left font-bold text-gray-900">Requirement</th>
                      <th className="border border-gray-300 p-3 text-left font-bold text-gray-900">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-3">Original Title Deed</td>
                      <td className="border border-gray-300 p-3 text-gray-700">Certificate of title or certificate of lease for the land being subdivided</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 p-3">ID/Registration Documents</td>
                      <td className="border border-gray-300 p-3 text-gray-700">National ID copy, business registration (if company), or succession certificate</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">Survey Plan</td>
                      <td className="border border-gray-300 p-3 text-gray-700">Prepared by registered surveyor with EBK seal showing proposed subdivisions</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 p-3">County Development Plan</td>
                      <td className="border border-gray-300 p-3 text-gray-700">Map showing your land on county planning documents</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">Proof of Ownership</td>
                      <td className="border border-gray-300 p-3 text-gray-700">Utility bills, tax receipts, or local chief's letter confirming ownership</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 p-3">Environmental Compliance</td>
                      <td className="border border-gray-300 p-3 text-gray-700">Environmental impact assessment if required by county (for large subdivisions)</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">Site Plan/Location Map</td>
                      <td className="border border-gray-300 p-3 text-gray-700">Map showing how land is accessed and infrastructure (roads, water)</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 p-3">Application Form</td>
                      <td className="border border-gray-300 p-3 text-gray-700">County-specific subdivision application form (obtain from planning office)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-gray-700 text-sm mt-4">
                <strong>Tip:</strong> Incomplete applications cause delays. Verify all required documents with your county planning office before submission.
              </p>
            </section>

            {/* Fees and Costs */}
            <section id="fees-costs" className="scroll-mt-20">
              <div className="flex items-start gap-3 mb-4">
                <DollarSign className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Surveyor Fees & Subdivision Costs</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                The cost of subdividing land varies based on land size, location, and complexity. Here's a breakdown:
              </p>
              <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-blue-100">
                      <th className="border border-gray-300 p-3 text-left font-bold text-gray-900">Cost Item</th>
                      <th className="border border-gray-300 p-3 text-left font-bold text-gray-900">Typical Range (KES)</th>
                      <th className="border border-gray-300 p-3 text-left font-bold text-gray-900">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-3">Surveyor Fees</td>
                      <td className="border border-gray-300 p-3 text-gray-700">30,000 - 150,000</td>
                      <td className="border border-gray-300 p-3 text-gray-700">Depends on land size and complexity</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 p-3">County Approval Fees</td>
                      <td className="border border-gray-300 p-3 text-gray-700">5,000 - 30,000</td>
                      <td className="border border-gray-300 p-3 text-gray-700">Varies by county</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">Registry Registration Fees</td>
                      <td className="border border-gray-300 p-3 text-gray-700">10,000 - 50,000</td>
                      <td className="border border-gray-300 p-3 text-gray-700">Based on property value</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 p-3">Legal Fees (Optional)</td>
                      <td className="border border-gray-300 p-3 text-gray-700">15,000 - 50,000</td>
                      <td className="border border-gray-300 p-3 text-gray-700">If hiring lawyer for guidance</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">Courier/Miscellaneous</td>
                      <td className="border border-gray-300 p-3 text-gray-700">2,000 - 10,000</td>
                      <td className="border border-gray-300 p-3 text-gray-700">Document courier, copies, etc.</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 p-3 font-bold">TOTAL ESTIMATED COST</td>
                      <td className="border border-gray-300 p-3 font-bold text-gray-900">62,000 - 290,000+</td>
                      <td className="border border-gray-300 p-3 text-gray-700">Larger/complex subdivisions cost more</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-amber-50 border-l-4 border-amber-600 p-4 rounded">
                <p className="text-sm text-gray-800"><strong>Cost Tip:</strong> Get 2-3 surveyor quotes before hiring. Compare registry fees with different counties. Avoid rush fees when possible.</p>
              </div>
            </section>

            {/* Common Mistakes */}
            <section id="common-mistakes" className="scroll-mt-20">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Common Mistakes That Delay Subdivision</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                Avoid these common errors that cause rejection and costly delays:
              </p>
              <div className="space-y-4">
                <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
                  <h3 className="font-bold text-red-900 mb-2">Using Unregistered Surveyors</h3>
                  <p className="text-sm text-red-800">County and registry won't accept surveys from unregistered surveyors. Always verify the surveyor's EBK license.</p>
                </div>
                <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
                  <h3 className="font-bold text-red-900 mb-2">Incomplete Documentation</h3>
                  <p className="text-sm text-red-800">Missing documents cause immediate rejection. Have all required docs ready before starting the process.</p>
                </div>
                <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
                  <h3 className="font-bold text-red-900 mb-2">Violating Minimum Plot Sizes</h3>
                  <p className="text-sm text-red-800">Each county has minimum plot size requirements. Subdividing below minimums will be rejected. Check county rules first.</p>
                </div>
                <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
                  <h3 className="font-bold text-red-900 mb-2">Boundary Disputes Unresolved</h3>
                  <p className="text-sm text-red-800">Resolve boundary disputes with neighbors before subdividing. Disputed boundaries cause rejections and legal issues.</p>
                </div>
                <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
                  <h3 className="font-bold text-red-900 mb-2">Poor Access/Infrastructure Planning</h3>
                  <p className="text-sm text-red-800">Each subdivided plot needs legal access and basic infrastructure. Counties reject subdivisions lacking road access.</p>
                </div>
                <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
                  <h3 className="font-bold text-red-900 mb-2">Non-Compliance with County Plans</h3>
                  <p className="text-sm text-red-800">Subdivisions must align with county development plans. Check the plan before surveying to avoid rejection.</p>
                </div>
              </div>
            </section>

            {/* Special Cases */}
            <section id="special-cases" className="scroll-mt-20">
              <div className="flex items-start gap-3 mb-4">
                <Users className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Special Cases & Unique Situations</h2>
              </div>
              <div className="space-y-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Home className="w-5 h-5 text-blue-600" />
                    Agricultural Land Subdivision
                  </h3>
                  <p className="text-gray-700 text-sm mb-3">
                    Agricultural land subdivision is subject to additional restrictions under the Agricultural Land Act:
                  </p>
                  <ul className="text-gray-700 text-sm space-y-2 list-disc list-inside">
                    <li>Minimum plot sizes enforced (0.5-2 acres depending on county and region)</li>
                    <li>Agricultural zoning must be maintained</li>
                    <li>Environmental considerations (soil conservation, water access)</li>
                    <li>County agricultural officers may require compliance certificates</li>
                    <li>Some counties restrict further subdivision of already subdivided agricultural land</li>
                  </ul>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Home className="w-5 h-5 text-blue-600" />
                    Urban Land Subdivision
                  </h3>
                  <p className="text-gray-700 text-sm mb-3">
                    Urban areas have stricter requirements due to density and infrastructure considerations:
                  </p>
                  <ul className="text-gray-700 text-sm space-y-2 list-disc list-inside">
                    <li>Strict minimum plot sizes (50-200 sq meters typically)</li>
                    <li>Mandatory road access for each plot</li>
                    <li>Parking and green space requirements</li>
                    <li>Building code compliance</li>
                    <li>Higher registry fees in urban centers</li>
                  </ul>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Home className="w-5 h-5 text-blue-600" />
                    Leasehold Land Subdivision
                  </h3>
                  <p className="text-gray-700 text-sm mb-3">
                    Leasehold subdivisions require additional steps and may be more complex:
                  </p>
                  <ul className="text-gray-700 text-sm space-y-2 list-disc list-inside">
                    <li>Must obtain landlord's written consent (usually mandatory)</li>
                    <li>New sublease documents required for each subdivided plot</li>
                    <li>Landlord may charge additional fees for approval</li>
                    <li>Remaining lease term must exceed certain minimums (usually 30+ years)</li>
                    <li>More expensive due to additional legal documentation</li>
                  </ul>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Home className="w-5 h-5 text-blue-600" />
                    Disputed or Boundary-Issue Land
                  </h3>
                  <p className="text-gray-700 text-sm mb-3">
                    Land with boundary disputes requires additional handling:
                  </p>
                  <ul className="text-gray-700 text-sm space-y-2 list-disc list-inside">
                    <li>Resolve disputes before starting subdivision process</li>
                    <li>Obtain court orders or settlement agreements if needed</li>
                    <li>Get written neighbor consent for shared boundaries</li>
                    <li>Some counties require boundary beacons or professional demarcation</li>
                    <li>Additional costs and time required</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* FAQs */}
            <section id="faqs" className="scroll-mt-20">
              <div className="flex items-start gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
              </div>
              <div className="space-y-3 mt-6">
                {faqsData.map((faq: FAQItem) => (
                  <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full px-4 py-4 flex items-center justify-between hover:bg-blue-50 transition bg-white"
                    >
                      <span className="text-left font-semibold text-gray-900 text-sm sm:text-base">{faq.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-blue-600 flex-shrink-0 transition-transform ${
                          openFAQ === faq.id ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openFAQ === faq.id && (
                      <div className="px-4 py-3 bg-blue-50 border-t border-gray-200">
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
                <FileText className="w-5 h-5 text-blue-600" />
                Related Resources
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="/land-ownership-title-deed-verification-kenya"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-semibold group"
                >
                  Land Ownership & Title Verification
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </a>
                <a
                  href="/land-transfer-process-kenya"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-semibold group"
                >
                  Land Transfer Process
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </a>
                <a
                  href="/how-to-buy-land-safely-kenya"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-semibold group"
                >
                  How to Buy Land Safely
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </a>
                <a
                  href="/land-disputes-kenya"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-semibold group"
                >
                  Land Disputes Guide
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </a>
                <a
                  href="/leasehold-freehold-kenya"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-semibold group"
                >
                  Leasehold vs Freehold
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </a>
                <a
                  href="/lost-title-deed-replacement-kenya"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-semibold group"
                >
                  Lost Deed Replacement
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </a>
                <a
                  href="/land-rates-property-taxes-kenya"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-semibold group"
                >
                  Land Rates & Property Taxes
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </a>
              </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold mb-3">Need Expert Help with Land Subdivision?</h3>
              <p className="text-blue-100 mb-6 text-sm sm:text-base">
                Get professional guidance from experienced legal advisors. Connect with us today for consultations on surveying, county approvals, and registration.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="https://wa.me/254112810203?text=I%20need%20help%20with%20land%20subdivision"
                  className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
                >
                  <MessageSquare className="w-5 h-5" />
                  WhatsApp: +254 112 810 203
                </a>
                <a
                  href="mailto:johnsonthuraniramwangi@gmail.com"
                  className="inline-flex items-center justify-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
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
              <p className="text-sm">Comprehensive, practical guide to land subdivision and survey processes in Kenya, updated regularly with latest legal requirements.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3">Quick Links</h4>
              <ul className="text-sm space-y-2">
                <li><a href="/land-disputes-kenya" className="hover:text-white transition">Land Disputes</a></li>
                <li><a href="/land-transfer-process-kenya" className="hover:text-white transition">Land Transfer</a></li>
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

export default SubdivisionSurveyProcessKenya;