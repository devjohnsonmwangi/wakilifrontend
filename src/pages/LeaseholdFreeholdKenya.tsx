import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, AlertTriangle, Home, BookOpen, DollarSign, CheckCircle, Briefcase, Eye, MessageSquare, Shield, Users, ScrollText, ArrowRight } from 'lucide-react';

// FAQ Data - moved outside component to avoid React Hook dependency issues
const faqsData = [
  {
    question: 'What is the main difference between leasehold and freehold land in Kenya?',
    answer: 'Freehold land is owned outright with unlimited tenure; you own the land forever. Leasehold land is owned by the government but granted to you for a fixed period (33, 50, or 99 years). After the lease expires, the land reverts to the government unless renewed.'
  },
  {
    question: 'Can leasehold land in Kenya expire?',
    answer: 'Yes, leasehold land expires when the lease period ends. However, Kenyan law allows leaseholders to apply for lease renewal before expiry. Renewal is typically granted for another 99 years. If not renewed, the land reverts to the government.'
  },
  {
    question: 'How much does it cost to convert leasehold to freehold in Kenya?',
    answer: 'Conversion costs vary but typically range from KES 50,000 to KES 500,000+, depending on land value, location, and government processing fees. It\'s advisable to consult a surveyor and lawyer for an accurate quote.'
  },
  {
    question: 'Is leasehold land cheaper than freehold in Kenya?',
    answer: 'Generally, leasehold land is cheaper than freehold. However, with the lease approaching expiry, leasehold property value drops significantly. Properties with 70+ years remaining are more valuable than those with fewer years.'
  },
  {
    question: 'Can I sell leasehold land before it expires?',
    answer: 'Yes, you can sell leasehold land before expiry. However, the sale price depends on the remaining lease period. Buyers prefer properties with many years remaining to minimize depreciation risk.'
  },
  {
    question: 'What happens when a 99-year lease expires in Kenya?',
    answer: 'When a 99-year lease expires, the land reverts to the government (typically the County Government). You must either apply for renewal or lose the property. Renewal applications should be made at least 1-2 years before expiry.'
  },
  {
    question: 'Is freehold land safer than leasehold in Kenya?',
    answer: 'Freehold land is generally considered safer as you own it permanently with no expiry. Leasehold carries expiry risk, but properly renewed leases are relatively secure. Both are subject to government land policies.'
  },
  {
    question: 'Can I get a mortgage on leasehold land in Kenya?',
    answer: 'Yes, banks and financial institutions typically offer mortgages on leasehold land. However, they may require the lease to have at least 30-40 years remaining. Short-lease properties are harder to finance.'
  },
  {
    question: 'How do I know if my land is leasehold or freehold?',
    answer: 'Check your title deed. A freehold title deed will show you as the absolute owner. A leasehold title deed will show the lease period (33, 50, or 99 years) and indicate the leaseholder\'s rights.'
  },
  {
    question: 'What are government leasehold properties in Kenya?',
    answer: 'Government leasehold properties are residential or commercial land leased directly from the government, typically through the National Land Commission (NLC) or County Governments. These often come with affordable prices and longer lease periods.'
  },
  {
    question: 'Can leasehold land be inherited in Kenya?',
    answer: 'Yes, leasehold land can be inherited. It becomes part of the deceased\'s estate and is distributed according to the inheritance laws. However, heirs must ensure the lease is renewed if nearing expiry.'
  },
  {
    question: 'What improvements can I make to leasehold land?',
    answer: 'You can build houses, plant crops, and make significant improvements to leasehold land. However, major structural changes may require government approval. When the lease expires, improvements typically revert to the government.'
  },
  {
    question: 'How do I renew a leasehold in Kenya?',
    answer: 'Apply to the County Government or National Land Commission 1-2 years before expiry. Provide your title deed, application forms, and pay renewal fees. The process typically takes 2-6 months.'
  },
  {
    question: 'Is it wise to buy land nearing lease expiry?',
    answer: 'Not recommended. Properties with fewer than 30 years remaining lose value quickly and are hard to finance. Sellers often heavily discount such properties, but renewal costs and risks outweigh the savings.'
  },
  {
    question: 'What are the tax implications of converting leasehold to freehold?',
    answer: 'Conversion may trigger land transfer tax, registration fees, and valuation costs. Consult a tax advisor for accurate tax calculations specific to your property and location.'
  }
];

const LeaseholdFreeholdKenya: React.FC = () => {
  const [activeSection, setActiveSection] = useState('understanding');
  const [toggleFAQ, setToggleFAQ] = useState<number | null>(null);

  useEffect(() => {
    // SEO Meta Tags
    document.title = 'Leasehold vs Freehold Land Kenya | Complete Legal Guide 2025';
    
    const updateMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateMeta('description', 'Complete guide to leasehold vs freehold land in Kenya. Learn differences, rights, costs, and how to convert leasehold to freehold. Expert legal advice.');
    updateMeta('keywords', 'leasehold vs freehold kenya, 99 year lease kenya, convert leasehold to freehold, freehold land kenya, leasehold land meaning, land tenure kenya');
    
    // OG Tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', 'Leasehold vs Freehold Land in Kenya – Complete Legal Guide');

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', 'Understand the differences between leasehold and freehold land ownership in Kenya. Complete guide with legal explanations and practical advice.');

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute('content', 'https://wakili.co.ke/leasehold-freehold-kenya');

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
    twitterTitle.setAttribute('content', 'Leasehold vs Freehold Land in Kenya – Legal Guide');

    let twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (!twitterDesc) {
      twitterDesc = document.createElement('meta');
      twitterDesc.setAttribute('name', 'twitter:description');
      document.head.appendChild(twitterDesc);
    }
    twitterDesc.setAttribute('content', 'Complete guide to understanding leasehold and freehold land ownership in Kenya with legal explanations and practical advice.');

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
    canonical.setAttribute('href', 'https://wakili.co.ke/leasehold-freehold-kenya');

    // JSON-LD Structured Data
    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': 'https://wakili.co.ke/leasehold-freehold-kenya',
          url: 'https://wakili.co.ke/leasehold-freehold-kenya',
          name: 'Leasehold vs Freehold Land in Kenya – Complete Legal Guide',
          isPartOf: { '@id': 'https://wakili.co.ke' },
          datePublished: '2025-02-06',
          dateModified: '2025-02-06',
          author: { '@type': 'Organization', name: 'Wakili Legal Hub' },
          description: 'Complete guide to leasehold vs freehold land ownership in Kenya with legal explanations, costs, and conversion guidance.'
        },
        {
          '@type': 'BreadcrumbList',
          '@id': 'https://wakili.co.ke/leasehold-freehold-kenya#breadcrumb',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://wakili.co.ke' },
            { '@type': 'ListItem', position: 2, name: 'Legal Guides', item: 'https://wakili.co.ke' },
            { '@type': 'ListItem', position: 3, name: 'Leasehold vs Freehold', item: 'https://wakili.co.ke/leasehold-freehold-kenya' }
          ]
        },
        {
          '@type': 'FAQPage',
          '@id': 'https://wakili.co.ke/leasehold-freehold-kenya#faqpage',
          mainEntity: faqsData.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer }
          }))
        },
        {
          '@type': 'HowTo',
          name: 'How to Convert Leasehold to Freehold in Kenya',
          step: [
            { '@type': 'HowToStep', name: 'Verify Lease Period', text: 'Check your title deed and confirm the remaining lease period.' },
            { '@type': 'HowToStep', name: 'Consult a Lawyer', text: 'Hire a qualified real estate lawyer to guide the conversion process.' },
            { '@type': 'HowToStep', name: 'Prepare Documents', text: 'Gather your title deed, ID, and any government approvals.' },
            { '@type': 'HowToStep', name: 'Submit Application', text: 'File the conversion application with the County Government or NLC.' },
            { '@type': 'HowToStep', name: 'Pay Fees', text: 'Pay the required government conversion fees and professional charges.' },
            { '@type': 'HowToStep', name: 'Receive New Deed', text: 'Once approved, collect your new freehold title deed.' }
          ]
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
    { id: 'understanding', label: 'Understanding Land Tenure', icon: <BookOpen size={16} /> },
    { id: 'freehold', label: 'What is Freehold?', icon: <Home size={16} /> },
    { id: 'leasehold', label: 'What is Leasehold?', icon: <Users size={16} /> },
    { id: 'differences', label: 'Key Differences', icon: <CheckCircle size={16} /> },
    { id: 'better', label: 'Which is Better?', icon: <Eye size={16} /> },
    { id: 'expire', label: 'Can Leasehold Expire?', icon: <AlertTriangle size={16} /> },
    { id: 'convert', label: 'How to Convert', icon: <ArrowRight size={16} /> },
    { id: 'costs', label: 'Fees & Costs', icon: <DollarSign size={16} /> },
    { id: 'risks', label: 'Risks to Watch', icon: <Shield size={16} /> },
    { id: 'mistakes', label: 'Common Mistakes', icon: <MessageSquare size={16} /> },
    { id: 'examples', label: 'Real-Life Examples', icon: <Briefcase size={16} /> },
    { id: 'faqs', label: 'FAQs', icon: <Briefcase size={16} /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      {/* Sticky Breadcrumb */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-teal-200/30">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-3 flex items-center gap-2 text-xs sm:text-sm">
          <Link to="/" className="text-teal-600 hover:text-teal-700 font-medium">Home</Link>
          <ChevronDown size={14} className="text-teal-400 rotate-[-90deg]" />
          <Link to="/land-disputes-kenya" className="text-teal-600 hover:text-teal-700 font-medium">Legal Guides</Link>
          <ChevronDown size={14} className="text-teal-400 rotate-[-90deg]" />
          <span className="text-teal-900 font-semibold">Leasehold vs Freehold</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 text-white py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 text-center">
          <div className="flex justify-center mb-4">
            <Home size={40} className="text-cyan-200" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold mb-4">Leasehold vs Freehold Land in Kenya</h1>
          <p className="text-lg sm:text-xl text-cyan-100 max-w-3xl mx-auto mb-6">
            Understand the differences between leasehold and freehold land ownership, compare rights and risks, and learn how to make the best investment decision for your future.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://wa.me/254112810203" target="_blank" rel="noopener noreferrer" className="bg-white text-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-cyan-50 transition">
              Get Free Consultation
            </a>
            <Link to="/how-to-buy-land-safely-kenya" className="bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-800 transition">
              Land Buying Guide
            </Link>
          </div>
        </div>
      </div>

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
                      ? 'bg-teal-100 text-teal-900 border-b-2 border-teal-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-teal-50'
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
            <nav className="space-y-2 bg-white/60 p-4 rounded-lg border border-teal-200/30">
              <p className="text-xs font-semibold text-teal-900 uppercase mb-4 flex items-center gap-2">
                <ScrollText size={14} /> Contents
              </p>
              {sections.map(section => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={() => setActiveSection(section.id)}
                  className={`block px-3 py-2 rounded-md text-sm font-medium transition-all border-l-4 ${
                    activeSection === section.id
                      ? 'bg-teal-100 text-teal-900 border-l-teal-600'
                      : 'text-gray-700 border-l-transparent hover:bg-teal-50'
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
          <section id="understanding" className="bg-white rounded-lg border border-teal-200/30 p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <BookOpen className="text-teal-600 flex-shrink-0 mt-1" size={24} />
              <h2 className="text-2xl sm:text-3xl font-bold text-teal-900">Understanding Land Tenure in Kenya</h2>
            </div>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Land tenure refers to the type of ownership rights you have over a property. In Kenya, there are two primary forms of land tenure: freehold and leasehold. Understanding these distinctions is crucial for property buyers, investors, and developers because each carries different rights, responsibilities, and legal implications.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Kenya's land system is regulated by the <strong>Land Act 2012</strong> and the <strong>Constitution of Kenya 2010</strong>, which recognize both leasehold and freehold ownership as valid forms of land tenure. The choice between these two affects property value, financing options, inheritance rights, and long-term security.
            </p>
            <div className="bg-teal-50 border-l-4 border-teal-600 p-4 rounded">
              <p className="text-teal-900 font-semibold">Key Point:</p>
              <p className="text-teal-800">The type of land tenure you choose will significantly impact your property investment's value, liquidity, and long-term security. It's essential to understand both options before making a purchase decision.</p>
            </div>
          </section>

          {/* Section 2 */}
          <section id="freehold" className="bg-white rounded-lg border border-teal-200/30 p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <Home className="text-teal-600 flex-shrink-0 mt-1" size={24} />
              <h2 className="text-2xl sm:text-3xl font-bold text-teal-900">What is Freehold Land?</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg text-teal-800 mb-2">Definition</h3>
                <p className="text-gray-700">Freehold land is land that you own outright in perpetuity. You hold an absolute title with no time limit or conditions attached. You are the true owner of the property, and it will remain yours and your heirs' forever unless you voluntarily sell or transfer it.</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-teal-800 mb-2">Rights of Owners</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>✓ Exclusive use and occupation of the land</li>
                  <li>✓ Right to build any structure (subject to building codes)</li>
                  <li>✓ Right to sell, lease, or give away the property</li>
                  <li>✓ Right to inherit and pass to heirs</li>
                  <li>✓ Right to mortgage the property</li>
                  <li>✓ Right to receive compensation if compulsorily acquired</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-teal-800 mb-2">Advantages</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>⚡ Permanent ownership with no expiry</li>
                  <li>⚡ Higher property value and better resale potential</li>
                  <li>⚡ Easier to obtain financing from banks</li>
                  <li>⚡ No renewal fees or government approval needed</li>
                  <li>⚡ Complete control over the property</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-teal-800 mb-2">Limitations</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>⛔ Generally more expensive than leasehold</li>
                  <li>⛔ Subject to government compulsory acquisition</li>
                  <li>⛔ Must comply with building codes and zoning laws</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section id="leasehold" className="bg-white rounded-lg border border-teal-200/30 p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <Users className="text-teal-600 flex-shrink-0 mt-1" size={24} />
              <h2 className="text-2xl sm:text-3xl font-bold text-teal-900">What is Leasehold Land?</h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg text-teal-800 mb-2">Definition</h3>
                <p className="text-gray-700">Leasehold land is property granted to you for a fixed period, after which it reverts to the government or the landowner. You hold a right to use and occupy the land, but you do not own it. The government (or private owner) retains ultimate ownership.</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-teal-800 mb-2">33, 50, and 99-Year Leases Explained</h3>
                <div className="bg-gray-50 p-4 rounded mb-3">
                  <p className="text-sm text-gray-700 mb-2"><strong>33-Year Lease:</strong> Shortest lease period, common for agricultural land. Ideal for short-term use but not recommended for residential investment.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded mb-3">
                  <p className="text-sm text-gray-700 mb-2"><strong>50-Year Lease:</strong> Medium-term lease used for commercial and residential properties. Provides reasonable security but depreciates as expiry approaches.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-700"><strong>99-Year Lease:</strong> Longest lease period, effectively providing near-perpetual rights. Most attractive to buyers and investors as it provides long-term security.</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-teal-800 mb-2">Government Ownership Structure</h3>
                <p className="text-gray-700">Under Kenya's land system, leasehold land is ultimately owned by the national government or county governments. These leases are granted to individuals or organizations for specific purposes like residential, commercial, or agricultural use. The government retains the power to regulate lease terms and approve renewals.</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-teal-800 mb-2">Renewal Process</h3>
                <p className="text-gray-700 mb-2">Leaseholders can renew their leases before expiry by:</p>
                <ol className="text-gray-700 space-y-2 list-decimal list-inside">
                  <li>Applying 1-2 years before lease expiration</li>
                  <li>Submitting the title deed and renewal application to the County Government</li>
                  <li>Paying renewal fees (typically based on land value and location)</li>
                  <li>Receiving approval, usually for another 99 years</li>
                </ol>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section id="differences" className="bg-white rounded-lg border border-teal-200/30 p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle className="text-teal-600 flex-shrink-0 mt-1" size={24} />
              <h2 className="text-2xl sm:text-3xl font-bold text-teal-900">Key Differences Between Leasehold and Freehold</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-teal-100">
                    <th className="border border-teal-200 p-3 text-left font-bold text-teal-900">Aspect</th>
                    <th className="border border-teal-200 p-3 text-left font-bold text-teal-900">Freehold</th>
                    <th className="border border-teal-200 p-3 text-left font-bold text-teal-900">Leasehold</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white hover:bg-teal-50">
                    <td className="border border-teal-200 p-3 font-semibold">Ownership</td>
                    <td className="border border-teal-200 p-3">Absolute ownership</td>
                    <td className="border border-teal-200 p-3">Right to occupy for fixed period</td>
                  </tr>
                  <tr className="bg-gray-50 hover:bg-teal-50">
                    <td className="border border-teal-200 p-3 font-semibold">Duration</td>
                    <td className="border border-teal-200 p-3">Permanent (no expiry)</td>
                    <td className="border border-teal-200 p-3">33, 50, or 99 years</td>
                  </tr>
                  <tr className="bg-white hover:bg-teal-50">
                    <td className="border border-teal-200 p-3 font-semibold">Price</td>
                    <td className="border border-teal-200 p-3">Generally more expensive</td>
                    <td className="border border-teal-200 p-3">More affordable</td>
                  </tr>
                  <tr className="bg-gray-50 hover:bg-teal-50">
                    <td className="border border-teal-200 p-3 font-semibold">Renewal</td>
                    <td className="border border-teal-200 p-3">Not required</td>
                    <td className="border border-teal-200 p-3">Required before expiry (renewal possible)</td>
                  </tr>
                  <tr className="bg-white hover:bg-teal-50">
                    <td className="border border-teal-200 p-3 font-semibold">Mortgageability</td>
                    <td className="border border-teal-200 p-3">Easily mortgageable</td>
                    <td className="border border-teal-200 p-3">Mortgageable (if 30+ years remain)</td>
                  </tr>
                  <tr className="bg-gray-50 hover:bg-teal-50">
                    <td className="border border-teal-200 p-3 font-semibold">Resale Value</td>
                    <td className="border border-teal-200 p-3">Stable and appreciates</td>
                    <td className="border border-teal-200 p-3">Depreciates as expiry approaches</td>
                  </tr>
                  <tr className="bg-white hover:bg-teal-50">
                    <td className="border border-teal-200 p-3 font-semibold">Improvements</td>
                    <td className="border border-teal-200 p-3">Yours permanently</td>
                    <td className="border border-teal-200 p-3">Revert to government at expiry</td>
                  </tr>
                  <tr className="bg-gray-50 hover:bg-teal-50">
                    <td className="border border-teal-200 p-3 font-semibold">Inheritance</td>
                    <td className="border border-teal-200 p-3">Freely inheritable</td>
                    <td className="border border-teal-200 p-3">Inheritable (but lease may need renewal)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 5 */}
          <section id="better" className="bg-white rounded-lg border border-teal-200/30 p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <Eye className="text-teal-600 flex-shrink-0 mt-1" size={24} />
              <h2 className="text-2xl sm:text-3xl font-bold text-teal-900">Which is Better for Buyers and Investors?</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-teal-50 border-l-4 border-teal-600 p-4 rounded">
                <h3 className="font-semibold text-teal-900 mb-2">For Long-Term Residential Buyers:</h3>
                <p className="text-teal-800"><strong>FREEHOLD IS BETTER</strong> – Freehold provides permanent security, better financing options, and asset appreciation. There's no worry about lease expiry or renewal costs.</p>
              </div>

              <div className="bg-cyan-50 border-l-4 border-cyan-600 p-4 rounded">
                <h3 className="font-semibold text-cyan-900 mb-2">For Budget-Conscious Buyers:</h3>
                <p className="text-cyan-800"><strong>LEASEHOLD CAN WORK</strong> – If you're buying leasehold, ensure you have 50-99 years remaining. Avoid properties with fewer than 30 years left unless significantly discounted for conversion to freehold.</p>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                <h3 className="font-semibold text-blue-900 mb-2">For Commercial Investors:</h3>
                <p className="text-blue-800"><strong>DEPENDS ON GOALS</strong> – For short-term commercial use (5-10 years), leasehold is acceptable. For long-term commercial development, freehold is preferable for portfolio growth.</p>
              </div>

              <p className="text-gray-700 mt-4">The best choice depends on your financial capacity, investment timeline, and personal preferences. However, from a purely investment standpoint, <strong>freehold offers superior long-term value and security</strong>.</p>
            </div>
          </section>

          {/* Section 6 */}
          <section id="expire" className="bg-white rounded-lg border border-teal-200/30 p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="text-teal-600 flex-shrink-0 mt-1" size={24} />
              <h2 className="text-2xl sm:text-3xl font-bold text-teal-900">Can Leasehold Land Expire?</h2>
            </div>

            <p className="text-gray-700 mb-4">Yes, leasehold land can and does expire. When a lease reaches its end date, several outcomes are possible:</p>

            <div className="space-y-3">
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                <p className="font-semibold text-orange-900 mb-2">Land Reverts to Government:</p>
                <p className="text-orange-800">At expiry, if not renewed, the land automatically becomes government property. You lose all rights and the property reverts to the state.</p>
              </div>

              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                <p className="font-semibold text-amber-900 mb-2">Renewal is Possible:</p>
                <p className="text-amber-800">Kenyan law allows leaseholders to apply for renewal typically 1-2 years before expiry. Renewal is usually granted for an additional 99 years, though there's no absolute guarantee.</p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="font-semibold text-red-900 mb-2">Loss of Property and Improvements:</p>
                <p className="text-red-800">If renewal is denied and the lease expires, all improvements (buildings, structures) become government property. You receive no compensation.</p>
              </div>
            </div>

            <p className="text-gray-700 mt-4"><strong>Important:</strong> Always track your lease expiry date closely and begin renewal processes well in advance to avoid losing your property.</p>
          </section>

          {/* Section 7 */}
          <section id="convert" className="bg-white rounded-lg border border-teal-200/30 p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <ArrowRight className="text-teal-600 flex-shrink-0 mt-1" size={24} />
              <h2 className="text-2xl sm:text-3xl font-bold text-teal-900">How to Convert Leasehold to Freehold (Step-by-Step)</h2>
            </div>

            <ol className="space-y-4">
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
                <div>
                  <h3 className="font-semibold text-teal-900 mb-1">Verify Your Title Deed and Lease Period</h3>
                  <p className="text-gray-700">Check your current title deed to confirm you hold leasehold land. Note the remaining lease period and any conditions specified.</p>
                </div>
              </li>

              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
                <div>
                  <h3 className="font-semibold text-teal-900 mb-1">Consult a Qualified Real Estate Lawyer</h3>
                  <p className="text-gray-700">Hire a licensed lawyer experienced in land conversions to guide you through the process and represent your interests.</p>
                </div>
              </li>

              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
                <div>
                  <h3 className="font-semibold text-teal-900 mb-1">Prepare Required Documents</h3>
                  <p className="text-gray-700">Gather: title deed, national ID, birth certificate, property valuation report (from approved surveyor), payment proof, and any government permits.</p>
                </div>
              </li>

              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">4</span>
                <div>
                  <h3 className="font-semibold text-teal-900 mb-1">Get Professional Valuation</h3>
                  <p className="text-gray-700">Commission a government-approved surveyor to value your property. This valuation is required by the County Government for conversion approval.</p>
                </div>
              </li>

              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">5</span>
                <div>
                  <h3 className="font-semibold text-teal-900 mb-1">Submit Application to County Government</h3>
                  <p className="text-gray-700">File your conversion application with your County Government's Land Office, including all documents and fees. Keep copies for your records.</p>
                </div>
              </li>

              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">6</span>
                <div>
                  <h3 className="font-semibold text-teal-900 mb-1">Pay Conversion Fees</h3>
                  <p className="text-gray-700">Pay the government conversion fee (typically KES 50,000 - KES 500,000+ depending on property value), surveyor fees, and lawyer fees.</p>
                </div>
              </li>

              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">7</span>
                <div>
                  <h3 className="font-semibold text-teal-900 mb-1">Wait for Approval</h3>
                  <p className="text-gray-700">The County Government will review your application. This typically takes 2-6 months. Your lawyer will follow up on the process.</p>
                </div>
              </li>

              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">8</span>
                <div>
                  <h3 className="font-semibold text-teal-900 mb-1">Collect Your New Freehold Title Deed</h3>
                  <p className="text-gray-700">Once approved, collect your new freehold title deed from the Land Office. Your property is now owned in perpetuity with no expiry.</p>
                </div>
              </li>
            </ol>
          </section>

          {/* Section 8 */}
          <section id="costs" className="bg-white rounded-lg border border-teal-200/30 p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <DollarSign className="text-teal-600 flex-shrink-0 mt-1" size={24} />
              <h2 className="text-2xl sm:text-3xl font-bold text-teal-900">Fees, Costs & Government Charges</h2>
            </div>

            <p className="text-gray-700 mb-4">Converting leasehold to freehold involves several costs. Here's a breakdown:</p>

            <div className="overflow-x-auto mb-4">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-teal-100">
                    <th className="border border-teal-200 p-3 text-left font-bold text-teal-900">Cost Item</th>
                    <th className="border border-teal-200 p-3 text-left font-bold text-teal-900">Typical Amount</th>
                    <th className="border border-teal-200 p-3 text-left font-bold text-teal-900">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white hover:bg-teal-50">
                    <td className="border border-teal-200 p-3">Government Conversion Fee</td>
                    <td className="border border-teal-200 p-3">KES 50,000 - KES 500,000+</td>
                    <td className="border border-teal-200 p-3">Based on property valuation</td>
                  </tr>
                  <tr className="bg-gray-50 hover:bg-teal-50">
                    <td className="border border-teal-200 p-3">Surveyor Valuation</td>
                    <td className="border border-teal-200 p-3">KES 10,000 - KES 50,000</td>
                    <td className="border border-teal-200 p-3">Required for all conversions</td>
                  </tr>
                  <tr className="bg-white hover:bg-teal-50">
                    <td className="border border-teal-200 p-3">Lawyer's Fee</td>
                    <td className="border border-teal-200 p-3">KES 15,000 - KES 100,000+</td>
                    <td className="border border-teal-200 p-3">Professional legal representation</td>
                  </tr>
                  <tr className="bg-gray-50 hover:bg-teal-50">
                    <td className="border border-teal-200 p-3">Land Transfer Tax</td>
                    <td className="border border-teal-200 p-3">2% of property value</td>
                    <td className="border border-teal-200 p-3">Not always applicable</td>
                  </tr>
                  <tr className="bg-white hover:bg-teal-50">
                    <td className="border border-teal-200 p-3">Registration Fees</td>
                    <td className="border border-teal-200 p-3">KES 5,000 - KES 20,000</td>
                    <td className="border border-teal-200 p-3">Land Registry fees</td>
                  </tr>
                  <tr className="bg-gray-50 hover:bg-teal-50">
                    <td className="border border-teal-200 p-3"><strong>TOTAL ESTIMATED</strong></td>
                    <td className="border border-teal-200 p-3"><strong>KES 80,000 - KES 700,000+</strong></td>
                    <td className="border border-teal-200 p-3">Varies significantly by location</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-gray-700"><strong>Tip:</strong> Get quotes from multiple lawyers and surveyors to ensure competitive pricing. Conversion costs are tax-deductible as capital improvements in some cases.</p>
          </section>

          {/* Section 9 */}
          <section id="risks" className="bg-white rounded-lg border border-teal-200/30 p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <Shield className="text-teal-600 flex-shrink-0 mt-1" size={24} />
              <h2 className="text-2xl sm:text-3xl font-bold text-teal-900">Risks to Watch Out For</h2>
            </div>

            <div className="space-y-3">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="font-semibold text-red-900 mb-1">Risk: Lease Expiry Without Renewal</p>
                <p className="text-red-800">If you fail to renew your lease before expiry, you lose the property entirely. There's no grace period—the land becomes government property. <strong>Solution:</strong> Track renewal dates religiously and apply 2 years in advance.</p>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                <p className="font-semibold text-orange-900 mb-1">Risk: Government Refusal to Renew</p>
                <p className="text-orange-800">Renewal is usually granted, but the government can deny it if the land is needed for public purposes. <strong>Solution:</strong> Ensure your property is properly developed and no public interests conflict with your lease.</p>
              </div>

              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                <p className="font-semibold text-amber-900 mb-1">Risk: Difficulty Financing Short-Lease Properties</p>
                <p className="text-amber-800">Banks won't finance leasehold properties with fewer than 30 years remaining. <strong>Solution:</strong> Only buy leasehold if it has 50+ years remaining or can be converted to freehold.</p>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                <p className="font-semibold text-yellow-900 mb-1">Risk: High Depreciation Near Expiry</p>
                <p className="text-yellow-800">A property with 5 years left on the lease may lose 50%+ of its value. <strong>Solution:</strong> Avoid buying properties with fewer than 50 years remaining unless heavily discounted.</p>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="font-semibold text-blue-900 mb-1">Risk: Improvements Revert to Government</p>
                <p className="text-blue-800">At lease expiry, all buildings and improvements you've made become government property. <strong>Solution:</strong> Only make major improvements if the lease has 50+ years remaining or is renewable.</p>
              </div>
            </div>
          </section>

          {/* Section 10 */}
          <section id="mistakes" className="bg-white rounded-lg border border-teal-200/30 p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <MessageSquare className="text-teal-600 flex-shrink-0 mt-1" size={24} />
              <h2 className="text-2xl sm:text-3xl font-bold text-teal-900">Common Mistakes Buyers Make</h2>
            </div>

            <div className="space-y-3">
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="font-semibold text-red-900 mb-1">❌ Mistake 1: Ignoring the Remaining Lease Period</p>
                <p className="text-red-800">Buyers often overlook how many years are left on a lease. A property with 10 years remaining is essentially worthless.</p>
                <p className="text-red-700 font-semibold mt-2">✓ Fix: Always check remaining years and only buy if 50+ years remain or conversion is planned.</p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <p className="font-semibold text-red-900 mb-1">❌ Mistake 2: Buying Without a Title Search</p>
                <p className="text-red-800">Not verifying ownership history or checking for disputes before purchase can lead to legal complications.</p>
                <p className="text-red-700 font-semibold mt-2">✓ Fix: Always conduct a thorough title search and get a lawyer's opinion before buying.</p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <p className="font-semibold text-red-900 mb-1">❌ Mistake 3: Skipping Professional Advice</p>
                <p className="text-red-800">Trying to handle land purchase and conversion alone can result in costly errors or legal issues.</p>
                <p className="text-red-700 font-semibold mt-2">✓ Fix: Always hire a qualified lawyer and surveyor. Their fees are small compared to potential losses.</p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <p className="font-semibold text-red-900 mb-1">❌ Mistake 4: Not Planning for Lease Renewal Costs</p>
                <p className="text-red-800">Buyers forget to budget for renewal fees and costs when renewal time arrives, forcing rushed decisions.</p>
                <p className="text-red-700 font-semibold mt-2">✓ Fix: Set aside funds annually for potential renewal or conversion costs.</p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <p className="font-semibold text-red-900 mb-1">❌ Mistake 5: Assuming Conversion is Easy</p>
                <p className="text-red-800">Leasehold-to-freehold conversion is not automatic and requires significant time, money, and government approval.</p>
                <p className="text-red-700 font-semibold mt-2">✓ Fix: Verify conversion is possible and budget 2-6 months and KES 100,000+ for the process.</p>
              </div>
            </div>
          </section>

          {/* Section 11 */}
          <section id="examples" className="bg-white rounded-lg border border-teal-200/30 p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <Briefcase className="text-teal-600 flex-shrink-0 mt-1" size={24} />
              <h2 className="text-2xl sm:text-3xl font-bold text-teal-900">Real-Life Examples & Scenarios</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
                <h3 className="font-semibold text-green-900 mb-2">✓ Scenario 1: Smart Purchase Decision</h3>
                <p className="text-green-800"><strong>Ahmed buys a property in Kasarani:</strong> 99-year leasehold, 85 years remaining. He obtains financing easily, builds a house, and has peace of mind. In 50 years, he plans to convert to freehold for his grandchildren. <strong>Outcome: SMART INVESTMENT</strong></p>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                <h3 className="font-semibold text-orange-900 mb-2">⚠ Scenario 2: Risky but Manageable</h3>
                <p className="text-orange-800"><strong>Maria buys commercial property:</strong> 50-year leasehold, 15 years remaining. She gets it at a steep discount (KES 2M vs. KES 5M for similar freehold). She uses it for her business for 10 years and plans to sell before lease becomes critical. <strong>Outcome: ACCEPTABLE if sold before 5-year mark</strong></p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <h3 className="font-semibold text-red-900 mb-2">✗ Scenario 3: Disastrous Purchase</h3>
                <p className="text-red-800"><strong>James buys cheap land:</strong> 33-year leasehold, only 3 years remaining. Seller never mentioned expiry. He builds a KES 5M house. After 3 years, lease expires. Government takes the property and all improvements. James loses everything. <strong>Outcome: FINANCIAL DISASTER</strong></p>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                <h3 className="font-semibold text-yellow-900 mb-2">⚡ Scenario 4: Successful Conversion</h3>
                <p className="text-yellow-800"><strong>Fatima converts her leasehold:</strong> She owns a 50-year leasehold with 25 years remaining. Realizing renewal risk, she spends KES 200,000 to convert to freehold. Bank approves a larger mortgage. She sells 5 years later at a 30% higher price than similar leasehold properties. <strong>Outcome: STRATEGIC MOVE</strong></p>
              </div>
            </div>
          </section>

          {/* Section 12 - FAQs */}
          <section id="faqs" className="bg-white rounded-lg border border-teal-200/30 p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-3 mb-6">
              <Briefcase className="text-teal-600 flex-shrink-0 mt-1" size={24} />
              <h2 className="text-2xl sm:text-3xl font-bold text-teal-900">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-3">
              {faqsData.map((faq, idx) => (
                <div key={idx} className="border border-teal-200/30 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setToggleFAQ(toggleFAQ === idx ? null : idx)}
                    className="w-full px-4 py-3 bg-teal-50 hover:bg-teal-100 flex items-center justify-between transition text-left"
                  >
                    <span className="font-semibold text-teal-900">{faq.question}</span>
                    <ChevronDown
                      size={20}
                      className={`text-teal-600 transition-transform ${toggleFAQ === idx ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {toggleFAQ === idx && (
                    <div className="px-4 py-3 bg-white text-gray-700 border-t border-teal-200/30">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg p-6 sm:p-8 shadow-lg">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">Need Expert Legal Guidance?</h3>
            <p className="mb-6 text-cyan-100">Our experienced land lawyers can help you navigate leasehold conversion, property purchase, or any land-related legal matter in Kenya.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="https://wa.me/254112810203" target="_blank" rel="noopener noreferrer" className="bg-white text-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-cyan-50 transition flex items-center gap-2">
                <MessageSquare size={18} /> WhatsApp Us
              </a>
              <a href="mailto:johnsonthuraniramwangi@gmail.com" className="bg-cyan-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-cyan-800 transition">
                Email Our Team
              </a>
            </div>
          </section>

          {/* Related Links */}
          <section className="bg-blue-50 border border-blue-200/50 rounded-lg p-6 sm:p-8">
            <h3 className="text-xl font-bold text-blue-900 mb-4">Related Legal Resources</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <Link to="/land-ownership-title-verification-kenya" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold">
                <ArrowRight size={16} /> Land Ownership & Title Verification
              </Link>
              <Link to="/land-transfer-process-kenya" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold">
                <ArrowRight size={16} /> Land Transfer Process
              </Link>
              <Link to="/how-to-buy-land-safely-kenya" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold">
                <ArrowRight size={16} /> How to Buy Land Safely
              </Link>
              <Link to="/land-disputes-kenya" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold">
                <ArrowRight size={16} /> Land Disputes Guide
              </Link>
              <Link to="/adverse-possession-kenya" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold">
                <ArrowRight size={16} /> Adverse Possession (Squatters' Rights)
              </Link>
            </div>
          </section>
        </div>
      </div>

      {/* Professional Footer */}
      <footer className="bg-gradient-to-r from-teal-900 via-cyan-900 to-blue-900 text-white mt-20 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-lg mb-3">Wakili Legal Hub</h4>
              <p className="text-cyan-200 text-sm">Expert legal guidance on Kenyan land law, property rights, and inheritance.</p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-3">Quick Links</h4>
              <ul className="text-cyan-200 text-sm space-y-2">
                <li><Link to="/" className="hover:text-white transition">Home</Link></li>
                <li><Link to="/how-to-buy-land-safely-kenya" className="hover:text-white transition">Buy Land Safely</Link></li>
                <li><Link to="/land-disputes-kenya" className="hover:text-white transition">Land Disputes</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-3">Contact Us</h4>
              <ul className="text-cyan-200 text-sm space-y-2">
                <li>Email: <a href="mailto:johnsonthuraniramwangi@gmail.com" className="hover:text-white transition">johnsonthuraniramwangi@gmail.com</a></li>
                <li>WhatsApp: <a href="https://wa.me/254112810203" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">+254 112 810 203</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-3">Legal Disclaimer</h4>
              <p className="text-cyan-200 text-xs">This content is for informational purposes only. Not legal advice. Always consult a qualified attorney.</p>
            </div>
          </div>
          <div className="border-t border-cyan-700 pt-6 text-center text-cyan-300 text-sm">
            <p>&copy; 2025 Wakili Legal Hub. All rights reserved. | Helping Kenyans understand their land rights.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LeaseholdFreeholdKenya;
