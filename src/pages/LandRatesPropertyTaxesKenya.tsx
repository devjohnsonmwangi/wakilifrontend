import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, AlertTriangle, DollarSign, BookOpen, Home, CheckCircle, Eye, MessageSquare, ScrollText, ArrowRight, FileText } from 'lucide-react';

// FAQ Data - moved outside component to avoid React Hook dependency issues
const faqsData = [
  {
    question: 'What is the difference between land rates and land rent in Kenya?',
    answer: 'Land rates are annual taxes paid by landowners to the county government for government-owned land (leasehold). Land rent is a similar concept for leasehold properties. Land rates are based on property valuation. Property taxes refer to the broader taxation of real property. Both are mandatory annual obligations.'
  },
  {
    question: 'How often do I need to pay land rates?',
    answer: 'Land rates are paid annually, typically due by June 30th each year. Some counties offer quarterly or monthly payment options. Check with your specific county government for payment schedules. Failure to pay by the deadline can result in penalties and interest charges.'
  },
  {
    question: 'Where can I pay my land rates online?',
    answer: 'Most Kenyan counties now offer online payment platforms through their websites. You can also pay via M-Pesa, bank transfers, or at county government offices. Use your property PIN or property reference number to locate your account. Check your county government website for the official payment portal.'
  },
  {
    question: 'What happens if I don\'t pay land rates?',
    answer: 'Non-payment of land rates can result in: penalties and interest charges (up to 20% interest), property auction by the county government, legal action by the county, and inability to access county services. The government can eventually seize and sell your property to recover unpaid taxes.'
  },
  {
    question: 'How is land valuation determined in Kenya?',
    answer: 'Land valuation is based on factors including: location and accessibility, size of the property, zoning classification, infrastructure availability, market demand, comparable property sales, and environmental factors. Professional valuers assess these factors to determine the rateable value used for calculating land rates.'
  },
  {
    question: 'Can I appeal my property valuation if I think it\'s too high?',
    answer: 'Yes. You can appeal within 30 days of the valuation notice. File an objection with the county assessor\'s office with evidence supporting your claim (comparable sales, property condition, market analysis). The county provides a formal appeals process. Consult a lawyer if you need professional help with the appeal.'
  },
  {
    question: 'Is agricultural land taxed differently than residential land?',
    answer: 'Yes. Agricultural land typically has lower tax rates than residential or commercial land. Some counties offer tax exemptions or reductions for agricultural land to support farming. You must prove the land is genuinely used for agriculture. Mixed-use properties are taxed based on the dominant use.'
  },
  {
    question: 'Do I pay land rates on leasehold land?',
    answer: 'Yes, you pay land rent (similar to land rates) on leasehold land to the government. The government retains ownership, so annual payments are mandatory. Failure to pay can result in lease cancellation. On freehold land, you pay land rates instead. Always confirm your land tenure type and associated obligations.'
  },
  {
    question: 'What is a valuation roll in Kenya?',
    answer: 'The valuation roll is the official register of all properties in a county with their assessed values for tax purposes. It\'s public information. You can inspect the valuation roll at the county assessor\'s office to see how your property is valued. The roll is updated periodically, usually every 5 years or as required.'
  },
  {
    question: 'Can I get a tax exemption or reduction for my property?',
    answer: 'Possible exemptions include: agricultural land, government institutions, charitable organizations, religious properties, and certain disabled persons. Application procedures vary by county. Contact your county assessor\'s office with supporting documentation to apply. Exemptions are not automatic; you must apply and meet specific criteria.'
  },
  {
    question: 'How do I find my property PIN for land rate payments?',
    answer: 'Your property PIN (Unique Property Identifier) is on your title deed, property valuation notice, or county assessment roll. You can also visit the county assessor\'s office with your title deed to obtain it. Once you have your PIN, use it for all land rate payments and inquiries. Keep it safe as it identifies your property in all government records.'
  },
  {
    question: 'What is the typical land rate amount in Kenya?',
    answer: 'Land rates vary significantly by county and property location, typically ranging from 0.1% to 0.5% of the property\'s rateable value annually. A property valued at KES 10 million might pay KES 10,000 to KES 50,000 annually. Rates differ between residential, commercial, and agricultural properties. Check your specific county\'s rate schedule.'
  },
  {
    question: 'Can I deduct land rates from my income tax?',
    answer: 'Land rates and property taxes may be tax-deductible as a business expense if the property is used for generating income (rental property, commercial use). Consult a tax accountant or the Kenya Revenue Authority (KRA) for your specific situation. Documentation and proper record-keeping are essential for claiming deductions.'
  },
  {
    question: 'What are the penalties for late payment of land rates?',
    answer: 'Late payment penalties typically include: monthly interest charges (1-2% per month), administrative late fees, and collection costs. Some counties add penalties up to 20% of the total amount owed. The longer you delay, the more you owe. Early payment or payment plan arrangements with the county can help avoid mounting penalties.'
  },
  {
    question: 'Do I need a lawyer to appeal my land rates valuation?',
    answer: 'You can file an appeal without a lawyer, but professional help is recommended for complex cases. A lawyer can: strengthen your appeal with legal arguments, gather supporting evidence, represent you in hearings, and navigate county procedures. Lawyer fees typically range from KES 5,000-20,000 depending on complexity. Weigh the cost against the potential tax savings.'
  }
];

const LandRatesPropertyTaxesKenya: React.FC = () => {
  const [activeSection, setActiveSection] = useState('understanding');
  const [toggleFAQ, setToggleFAQ] = useState<number | null>(null);

  useEffect(() => {
    // SEO Meta Tags
    document.title = 'Land Rates & Property Taxes Kenya | Complete Legal Guide';
    
    const updateMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateMeta('description', 'Complete guide to land rates, land rent, and property taxes in Kenya. Learn how to pay, calculate, and appeal valuations. Expert legal advice.');
    updateMeta('keywords', 'land rates kenya, land rent kenya, property taxes kenya, land valuation, county land rates, how to pay land rates, property tax payment');
    
    // OG Tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', 'Land Rates & Property Taxes in Kenya – Complete Guide');

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', 'Complete guide to land rates, property taxes, and valuation obligations in Kenya. Learn payment methods, calculations, and how to appeal.');

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute('content', 'https://wakili.co.ke/land-rates-property-taxes-kenya');

    let ogType = document.querySelector('meta[property="og:type"]');
    if (!ogType) {
      ogType = document.createElement('meta');
      ogType.setAttribute('property', 'og:type');
      document.head.appendChild(ogType);
    }
    ogType.setAttribute('content', 'article');

    // Twitter Tags
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
    twitterTitle.setAttribute('content', 'Land Rates & Property Taxes in Kenya – Legal Guide');

    let twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (!twitterDesc) {
      twitterDesc = document.createElement('meta');
      twitterDesc.setAttribute('name', 'twitter:description');
      document.head.appendChild(twitterDesc);
    }
    twitterDesc.setAttribute('content', 'Learn about land rates, property taxes, and valuation in Kenya. Complete guide to payments, calculations, and appeals.');

    // Robots Meta
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute('content', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');

    // Canonical Tag
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://wakili.co.ke/land-rates-property-taxes-kenya');

    // JSON-LD Structured Data
    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': 'https://wakili.co.ke/land-rates-property-taxes-kenya',
          url: 'https://wakili.co.ke/land-rates-property-taxes-kenya',
          name: 'Land Rates & Property Taxes in Kenya – Complete Guide',
          isPartOf: { '@id': 'https://wakili.co.ke' },
          datePublished: '2025-02-06',
          dateModified: '2025-02-06',
          author: { '@type': 'Organization', name: 'Wakili Legal Hub' },
          description: 'Complete guide to land rates, property taxes, and valuation in Kenya with payment methods and appeal procedures.'
        },
        {
          '@type': 'BreadcrumbList',
          '@id': 'https://wakili.co.ke/land-rates-property-taxes-kenya#breadcrumb',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://wakili.co.ke' },
            { '@type': 'ListItem', position: 2, name: 'Legal Guides', item: 'https://wakili.co.ke' },
            { '@type': 'ListItem', position: 3, name: 'Land Rates & Property Taxes', item: 'https://wakili.co.ke/land-rates-property-taxes-kenya' }
          ]
        },
        {
          '@type': 'FAQPage',
          '@id': 'https://wakili.co.ke/land-rates-property-taxes-kenya#faqpage',
          mainEntity: faqsData.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer }
          }))
        },
        {
          '@type': 'HowTo',
          name: 'How to Pay Land Rates & Taxes in Kenya',
          step: [
            { '@type': 'HowToStep', name: 'Locate Your Property PIN', text: 'Find your property PIN on your title deed, valuation notice, or from the county assessor\'s office.' },
            { '@type': 'HowToStep', name: 'Check Payment Portal', text: 'Visit your county government website to access the land rates payment portal or payment methods.' },
            { '@type': 'HowToStep', name: 'Enter Property Details', text: 'Log in with your property PIN and verify your property details and outstanding balance.' },
            { '@type': 'HowToStep', name: 'Select Payment Method', text: 'Choose your payment method: online banking, M-Pesa, county office, or authorized payment agent.' },
            { '@type': 'HowToStep', name: 'Complete Payment', text: 'Process your payment and retain your receipt as proof. Confirm the payment is recorded in the system.' },
            { '@type': 'HowToStep', name: 'Verify Payment Recorded', text: 'Check online or at the county office to confirm your payment has been credited to your account.' }
          ]
        },
        {
          '@type': 'GovernmentService',
          name: 'Land Rates & Property Tax Payment Service',
          provider: { '@type': 'GovernmentOrganization', name: 'County Governments of Kenya' },
          serviceType: 'Property Taxation & Revenue Collection'
        }
      ]
    };

    let script = document.querySelector('script[type="application/ld+json"]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);

    window.scrollTo(0, 0);
  }, []);

  const sections = [
    { id: 'understanding', label: 'Understanding Land Taxes', icon: <BookOpen size={16} /> },
    { id: 'legal-framework', label: 'Legal Framework', icon: <FileText size={16} /> },
    { id: 'valuation', label: 'Valuation & Rates', icon: <DollarSign size={16} /> },
    { id: 'payment', label: 'How to Pay', icon: <Home size={16} /> },
    { id: 'differences', label: 'Key Differences', icon: <CheckCircle size={16} /> },
    { id: 'nonpayment', label: 'Non-Payment', icon: <AlertTriangle size={16} /> },
    { id: 'appeal', label: 'Appeal Process', icon: <Eye size={16} /> },
    { id: 'special-cases', label: 'Special Cases', icon: <MessageSquare size={16} /> },
    { id: 'faqs', label: 'FAQs', icon: <FileText size={16} /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Sticky Breadcrumb */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-green-200/30">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-3 flex items-center gap-2 text-xs sm:text-sm">
          <Link to="/" className="text-green-600 hover:text-green-700 font-medium">Home</Link>
          <ChevronDown size={14} className="text-green-400 rotate-[-90deg]" />
          <Link to="/land-disputes-kenya" className="text-green-600 hover:text-green-700 font-medium">Legal Guides</Link>
          <ChevronDown size={14} className="text-green-400 rotate-[-90deg]" />
          <span className="text-green-900 font-semibold">Land Rates & Property Taxes</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 text-center">
          <div className="flex justify-center mb-4">
            <DollarSign size={40} className="text-emerald-200" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold mb-4">Land Rates, Land Rent & Property Taxes in Kenya</h1>
          <p className="text-lg sm:text-xl text-emerald-100 max-w-3xl mx-auto mb-6">
            Complete guide to understanding land rates, property taxes, valuations, and payment obligations for property owners in Kenya.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://wa.me/254112810203" target="_blank" rel="noopener noreferrer" className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition">
              Get Free Consultation
            </a>
            <Link to="/how-to-buy-land-safely-kenya" className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition">
              Land Buying Guide
            </Link>
          </div>
        </div>
      </div>

      <div className="content-full-width">
        <div className="max-w-7xl mx-auto px-0 sm:px-4 md:px-8 py-12 sm:py-20 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* TOC - Horizontal Scroll on Mobile, Vertical Sidebar on Desktop */}
        <div className="mb-8 lg:hidden">
          <div className="overflow-x-auto -mx-2 px-2 pb-2">
            <nav className="flex gap-2 min-w-max">
              {sections.map(section => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium text-xs sm:text-sm whitespace-nowrap transition-all ${
                    activeSection === section.id
                      ? 'bg-green-100 text-green-900 border-b-2 border-green-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-green-50'
                  }`}
                >
                  {section.icon}
                  {section.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24">
            <nav className="space-y-2 bg-white/60 p-4 rounded-lg border border-green-200/30">
              <p className="text-xs font-semibold text-green-900 uppercase mb-4 flex items-center gap-2">
                <ScrollText size={14} /> Contents
              </p>
              {sections.map(section => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={() => setActiveSection(section.id)}
                  className={`block px-3 py-2 rounded-md text-sm font-medium transition-all border-l-4 ${
                    activeSection === section.id
                      ? 'bg-green-100 text-green-900 border-l-green-600'
                      : 'text-gray-700 border-l-transparent hover:bg-green-50'
                  }`}
                >
                  {section.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Section 1 */}
          <section id="understanding" className="bg-white rounded-lg border border-green-200/30 p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <BookOpen className="text-green-600 flex-shrink-0 mt-1" size={24} />
              <h2 className="text-2xl sm:text-3xl font-bold text-green-900">Understanding Land Rates and Land Rent in Kenya</h2>
            </div>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Land rates and land rent are mandatory annual obligations for property owners in Kenya. They are essentially taxes paid to county governments for property ownership rights. Understanding these obligations is critical for every landowner to maintain compliance and avoid penalties.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              <strong>Land Rates:</strong> Annual payments made by owners of government-owned land (primarily leasehold properties) to the county government. Rates are calculated based on the property's rateable value and vary by county.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              <strong>Land Rent:</strong> A similar concept, often used interchangeably with land rates for leasehold properties. It represents payment for the use of government land.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              <strong>Property Taxes:</strong> The broader category encompassing all taxes on real property, including land rates, land rent, and other property-based taxes.
            </p>
            <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
              <p className="text-green-900 font-semibold">Key Point:</p>
              <p className="text-green-800">Land rates are due annually, typically by June 30th. Non-payment can result in penalties, property liens, legal action, and potentially government seizure and sale of your property.</p>
            </div>
          </section>

          {/* Section 2 */}
          <section id="legal-framework" className="bg-white rounded-lg border border-green-200/30 p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <FileText className="text-green-600 flex-shrink-0 mt-1" size={24} />
              <h2 className="text-2xl sm:text-3xl font-bold text-green-900">Legal Framework Governing Land Taxes</h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg text-green-800 mb-2">Land Act 2012</h3>
                <p className="text-gray-700">The Land Act 2012 is the primary legislation governing land ownership and use in Kenya. It provides the framework for land valuation, rates, and obligations of landowners. The act applies to all categories of land tenure.</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-green-800 mb-2">County Government Act 2012</h3>
                <p className="text-gray-700">This act grants county governments the authority to collect land rates and manage property valuation within their jurisdictions. Each county has specific revenue laws and regulations for land taxation. Rates may vary between counties.</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-green-800 mb-2">Valuation for Rating Purposes Act</h3>
                <p className="text-gray-700">This legislation establishes the framework for property valuation in Kenya. It defines how properties are assessed, who conducts valuations, and the procedures for appeals. Valuations form the basis for calculating land rates.</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-green-800 mb-2">Revenue Laws and County-Specific Regulations</h3>
                <p className="text-gray-700">Each county government has specific revenue bylaws outlining: tax rates, payment deadlines, penalties for non-payment, exemptions, and appeal procedures. These vary by county. Check your specific county website for applicable regulations.</p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section id="valuation" className="bg-white rounded-lg border border-green-200/30 p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <DollarSign className="text-green-600 flex-shrink-0 mt-1" size={24} />
              <h2 className="text-2xl sm:text-3xl font-bold text-green-900">How to Determine Land Rates & Valuation</h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg text-green-800 mb-2">Valuation Roll</h3>
                <p className="text-gray-700">The valuation roll is the official county register of all rated properties and their assessed values. It's updated periodically (typically every 5 years). You have the right to inspect it at the county assessor's office. Your property PIN and assessed value appear on the roll.</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-green-800 mb-2">Factors Affecting Land Rates</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>✓ <strong>Location:</strong> Prime urban areas have higher rates than rural areas</li>
                  <li>✓ <strong>Accessibility:</strong> Properties near roads and infrastructure cost more</li>
                  <li>✓ <strong>Size:</strong> Larger properties typically have higher total rates (though per-acre rates may differ)</li>
                  <li>✓ <strong>Zoning:</strong> Commercial, residential, or agricultural classifications affect rates</li>
                  <li>✓ <strong>Market Value:</strong> Rates are based on rateable value, reflecting market conditions</li>
                  <li>✓ <strong>Infrastructure:</strong> Availability of water, electricity, and roads affects valuation</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-green-800 mb-2">Sample Calculation</h3>
                <div className="bg-gray-50 p-4 rounded text-gray-700 text-sm">
                  <p className="mb-2"><strong>Example:</strong> Property assessed rateable value: KES 10,000,000</p>
                  <p className="mb-2">County land rate: 0.2% per annum</p>
                  <p className="mb-2">Annual land rate = KES 10,000,000 × 0.2% = <strong>KES 20,000</strong></p>
                  <p className="text-xs mt-3">Note: Rates vary by county. Check your specific county's rate schedule.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section id="payment" className="bg-white rounded-lg border border-green-200/30 p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <Home className="text-green-600 flex-shrink-0 mt-1" size={24} />
              <h2 className="text-2xl sm:text-3xl font-bold text-green-900">How to Pay Land Rates & Rent</h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg text-green-800 mb-2">🟢 Online Payment (Most Convenient)</h3>
                <p className="text-gray-700 mb-2">Most counties now have online payment portals:</p>
                <ol className="text-gray-700 space-y-2 list-decimal list-inside">
                  <li>Visit your county government website</li>
                  <li>Locate the land rates or revenue payment section</li>
                  <li>Enter your property PIN and verify details</li>
                  <li>Select payment amount and method (M-Pesa, bank transfer, card)</li>
                  <li>Complete payment and receive confirmation</li>
                  <li>Print receipt or save confirmation</li>
                </ol>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-green-800 mb-2">📱 M-Pesa Payment</h3>
                <p className="text-gray-700">Most counties accept M-Pesa payments. Dial the county's specific M-Pesa paybill number (available on their website). Some use shortcodes for quick payment. Charges apply based on amount. You'll receive an M-Pesa confirmation with a reference number.</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-green-800 mb-2">🏦 Bank Transfer</h3>
                <p className="text-gray-700">Direct bank transfers to the county government's bank account are accepted. Obtain the county's bank account details from their revenue office. Include your property PIN in the payment reference. Keep the bank receipt as proof of payment.</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-green-800 mb-2">🏛️ County Office Payment</h3>
                <p className="text-gray-700">Visit the county treasurer's office or revenue department to pay in person. Bring your valuation notice or property PIN. You'll receive an official receipt. Most offices accept cash and mobile money.</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-green-800 mb-2">📅 Payment Deadlines</h3>
                <p className="text-gray-700">The standard deadline is <strong>June 30th each financial year</strong>. Some counties offer quarterly (March 31, June 30, September 30, December 31) or monthly payment options. Check your specific county. Late payments incur penalties.</p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section id="differences" className="bg-white rounded-lg border border-green-200/30 p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={24} />
              <h2 className="text-2xl sm:text-3xl font-bold text-green-900">Difference Between Land Rates, Land Rent & Property Taxes</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-green-100">
                    <th className="border border-green-200 p-3 text-left font-bold text-green-900">Aspect</th>
                    <th className="border border-green-200 p-3 text-left font-bold text-green-900">Land Rates</th>
                    <th className="border border-green-200 p-3 text-left font-bold text-green-900">Land Rent</th>
                    <th className="border border-green-200 p-3 text-left font-bold text-green-900">Property Taxes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white hover:bg-green-50">
                    <td className="border border-green-200 p-3 font-semibold">Definition</td>
                    <td className="border border-green-200 p-3">Annual tax on leasehold land</td>
                    <td className="border border-green-200 p-3">Payment for government land use</td>
                    <td className="border border-green-200 p-3">Broad category of property taxes</td>
                  </tr>
                  <tr className="bg-gray-50 hover:bg-green-50">
                    <td className="border border-green-200 p-3 font-semibold">Applicability</td>
                    <td className="border border-green-200 p-3">Leasehold properties primarily</td>
                    <td className="border border-green-200 p-3">Leasehold land (similar to rates)</td>
                    <td className="border border-green-200 p-3">All real property types</td>
                  </tr>
                  <tr className="bg-white hover:bg-green-50">
                    <td className="border border-green-200 p-3 font-semibold">Frequency</td>
                    <td className="border border-green-200 p-3">Annual (due by June 30)</td>
                    <td className="border border-green-200 p-3">Annual or as agreed</td>
                    <td className="border border-green-200 p-3">Annual or per agreement</td>
                  </tr>
                  <tr className="bg-gray-50 hover:bg-green-50">
                    <td className="border border-green-200 p-3 font-semibold">Calculation Basis</td>
                    <td className="border border-green-200 p-3">Rateable value × rate %</td>
                    <td className="border border-green-200 p-3">Rateable value × agreed rate</td>
                    <td className="border border-green-200 p-3">Various (value-based)</td>
                  </tr>
                  <tr className="bg-white hover:bg-green-50">
                    <td className="border border-green-200 p-3 font-semibold">Receiver</td>
                    <td className="border border-green-200 p-3">County government</td>
                    <td className="border border-green-200 p-3">Government/landlord</td>
                    <td className="border border-green-200 p-3">Government entity</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 6 */}
          <section id="nonpayment" className="bg-white rounded-lg border border-green-200/30 p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="text-green-600 flex-shrink-0 mt-1" size={24} />
              <h2 className="text-2xl sm:text-3xl font-bold text-green-900">Consequences of Non-Payment</h2>
            </div>

            <div className="space-y-3">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="font-semibold text-red-900 mb-1">⚠ Penalties & Interest Charges</p>
                <p className="text-red-800">Late payment penalties typically range from 1-2% monthly interest. Some counties add administrative fees. Total charges can reach 20%+ of the original amount owed.</p>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                <p className="font-semibold text-orange-900 mb-1">⚠ Property Lien</p>
                <p className="text-orange-800">The county government can place a lien on your property for unpaid rates. This affects your ability to sell, mortgage, or transfer the property.</p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="font-semibold text-red-900 mb-1">⚠ Legal Action</p>
                <p className="text-red-800">The county can initiate legal proceedings against you to recover unpaid taxes. This includes court cases and potential forced property seizure.</p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="font-semibold text-red-900 mb-1">⚠ Property Auction</p>
                <p className="text-red-800">After extended non-payment, the county government can auction your property to recover unpaid rates. You would lose ownership and any equity in the property.</p>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                <p className="font-semibold text-orange-900 mb-1">⚠ Difficulty with County Services</p>
                <p className="text-orange-800">Outstanding rates can prevent you from accessing county services: permits, licenses, title transfers, or land subdivision approvals.</p>
              </div>

              <p className="text-gray-700 mt-4 font-semibold">Best Practice: Pay land rates on time to avoid these serious consequences. If facing hardship, contact your county to discuss payment plans.</p>
            </div>
          </section>

          {/* Section 7 */}
          <section id="appeal" className="bg-white rounded-lg border border-green-200/30 p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <Eye className="text-green-600 flex-shrink-0 mt-1" size={24} />
              <h2 className="text-2xl sm:text-3xl font-bold text-green-900">How to Appeal Valuation Decisions</h2>
            </div>

            <ol className="space-y-4">
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Review Your Valuation Notice</h3>
                  <p className="text-gray-700">Examine the valuation notice carefully. Understand the assessed value, comparable properties used, and valuation methodology. Request clarification if unclear.</p>
                </div>
              </li>

              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Gather Evidence</h3>
                  <p className="text-gray-700">Collect supporting documentation: recent property appraisals, comparable property sales data, photos showing property condition, property damage evidence, or survey reports.</p>
                </div>
              </li>

              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Meet Appeal Deadline</h3>
                  <p className="text-gray-700">Most counties require appeals within 30 days of the valuation notice. Check your specific county's deadline. Missing this deadline may prevent you from appealing.</p>
                </div>
              </li>

              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">4</span>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">File Formal Objection</h3>
                  <p className="text-gray-700">Submit a written objection with the county assessor's office. Include your property PIN, reasons for objection, supporting evidence, and requested valuation adjustment. Keep copies.</p>
                </div>
              </li>

              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">5</span>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Attend Hearing (if required)</h3>
                  <p className="text-gray-700">You may be invited to present your case at a county valuation tribunal hearing. Present your evidence clearly and professionally. Bring all documentation.</p>
                </div>
              </li>

              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">6</span>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Await Decision</h3>
                  <p className="text-gray-700">The tribunal will review your objection and make a decision. This typically takes 30-60 days. You'll be notified of the outcome. Decisions can be appealed further in some cases.</p>
                </div>
              </li>
            </ol>
          </section>

          {/* Section 8 */}
          <section id="special-cases" className="bg-white rounded-lg border border-green-200/30 p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <MessageSquare className="text-green-600 flex-shrink-0 mt-1" size={24} />
              <h2 className="text-2xl sm:text-3xl font-bold text-green-900">Special Cases</h2>
            </div>

            <div className="space-y-4">
              <div className="border-l-4 border-green-600 p-4 bg-green-50 rounded">
                <h3 className="font-semibold text-green-900 mb-2">Government Land</h3>
                <p className="text-gray-700">Properties owned by government institutions typically have tax exemptions. If government-owned, request exemption documentation. Status can affect rate obligations significantly.</p>
              </div>

              <div className="border-l-4 border-green-600 p-4 bg-green-50 rounded">
                <h3 className="font-semibold text-green-900 mb-2">Leasehold Land</h3>
                <p className="text-gray-700">Leasehold properties pay land rent/rates to the government annually. The payment obligation continues throughout the lease period. Failure to pay can result in lease forfeiture.</p>
              </div>

              <div className="border-l-4 border-green-600 p-4 bg-green-50 rounded">
                <h3 className="font-semibold text-green-900 mb-2">Agricultural Land</h3>
                <p className="text-gray-700">Many counties offer lower tax rates or exemptions for active agricultural land. Proof of agricultural use (farm registrations, production records) may be required. Mixed-use properties are taxed based on dominant use.</p>
              </div>

              <div className="border-l-4 border-green-600 p-4 bg-green-50 rounded">
                <h3 className="font-semibold text-green-900 mb-2">Charitable & Religious Properties</h3>
                <p className="text-gray-700">Properties owned by registered charities or religious institutions may qualify for tax exemptions. Exemptions are not automatic; you must apply with supporting documentation proving charitable or religious status.</p>
              </div>

              <div className="border-l-4 border-green-600 p-4 bg-green-50 rounded">
                <h3 className="font-semibold text-green-900 mb-2">Disabled Persons</h3>
                <p className="text-gray-700">Some counties offer property tax reductions or exemptions for registered persons with disabilities. Contact your county assessor's office for eligibility requirements and application procedures.</p>
              </div>
            </div>
          </section>

          {/* Section 9 - FAQs */}
          <section id="faqs" className="bg-white rounded-lg border border-green-200/30 p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-3 mb-6">
              <FileText className="text-green-600 flex-shrink-0 mt-1" size={24} />
              <h2 className="text-2xl sm:text-3xl font-bold text-green-900">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-3">
              {faqsData.map((faq, idx) => (
                <div key={idx} className="border border-green-200/30 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setToggleFAQ(toggleFAQ === idx ? null : idx)}
                    className="w-full px-4 py-3 bg-green-50 hover:bg-green-100 flex items-center justify-between transition text-left"
                  >
                    <span className="font-semibold text-green-900">{faq.question}</span>
                    <ChevronDown
                      size={20}
                      className={`text-green-600 transition-transform ${toggleFAQ === idx ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {toggleFAQ === idx && (
                    <div className="px-4 py-3 bg-white text-gray-700 border-t border-green-200/30">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg p-6 sm:p-8 shadow-lg">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">Need Help with Land Rates or Valuations?</h3>
            <p className="mb-6 text-emerald-100">Our legal experts can help you understand your obligations, appeal valuations, or resolve any property tax issues.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="https://wa.me/254112810203" target="_blank" rel="noopener noreferrer" className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition flex items-center gap-2">
                <MessageSquare size={18} /> WhatsApp Us
              </a>
              <a href="mailto:johnsonthuraniramwangi@gmail.com" className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition">
                Email Our Team
              </a>
            </div>
          </section>

          {/* Related Links */}
          <section className="bg-emerald-50 border border-emerald-200/50 rounded-lg p-6 sm:p-8">
            <h3 className="text-xl font-bold text-emerald-900 mb-4">Related Legal Resources</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <Link to="/land-ownership-title-verification-kenya" className="flex items-center gap-2 text-emerald-600 hover:text-emerald-800 font-semibold">
                <ArrowRight size={16} /> Land Ownership & Title Verification
              </Link>
              <Link to="/land-transfer-process-kenya" className="flex items-center gap-2 text-emerald-600 hover:text-emerald-800 font-semibold">
                <ArrowRight size={16} /> Land Transfer Process
              </Link>
              <Link to="/how-to-buy-land-safely-kenya" className="flex items-center gap-2 text-emerald-600 hover:text-emerald-800 font-semibold">
                <ArrowRight size={16} /> How to Buy Land Safely
              </Link>
              <Link to="/land-disputes-kenya" className="flex items-center gap-2 text-emerald-600 hover:text-emerald-800 font-semibold">
                <ArrowRight size={16} /> Land Disputes Guide
              </Link>
              <Link to="/leasehold-freehold-kenya" className="flex items-center gap-2 text-emerald-600 hover:text-emerald-800 font-semibold">
                <ArrowRight size={16} /> Leasehold vs Freehold Land
              </Link>
              <Link to="/lost-title-deed-replacement-kenya" className="flex items-center gap-2 text-emerald-600 hover:text-emerald-800 font-semibold">
                <ArrowRight size={16} /> Lost Title Deed Replacement
              </Link>
            </div>
          </section>
        </div>
      </div>
      </div>

      {/* Professional Footer */}
      <footer className="bg-gradient-to-r from-green-900 via-emerald-900 to-teal-900 text-white mt-20 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-lg mb-3">Wakili Legal Hub</h4>
              <p className="text-emerald-200 text-sm">Expert legal guidance on Kenyan land law, property taxes, and property rights.</p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-3">Quick Links</h4>
              <ul className="text-emerald-200 text-sm space-y-2">
                <li><Link to="/" className="hover:text-white transition">Home</Link></li>
                <li><Link to="/how-to-buy-land-safely-kenya" className="hover:text-white transition">Buy Land Safely</Link></li>
                <li><Link to="/land-disputes-kenya" className="hover:text-white transition">Land Disputes</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-3">Contact Us</h4>
              <ul className="text-emerald-200 text-sm space-y-2">
                <li>Email: <a href="mailto:johnsonthuraniramwangi@gmail.com" className="hover:text-white transition">johnsonthuraniramwangi@gmail.com</a></li>
                <li>WhatsApp: <a href="https://wa.me/254112810203" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">+254 112 810 203</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-3">Legal Disclaimer</h4>
              <p className="text-emerald-200 text-xs">This content is for informational purposes only. Not legal advice. Always consult a qualified attorney.</p>
            </div>
          </div>
          <div className="border-t border-emerald-700 pt-6 text-center text-emerald-300 text-sm">
            <p>&copy; 2025 Wakili Legal Hub. All rights reserved. | Helping Kenyans understand their property obligations.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandRatesPropertyTaxesKenya;
