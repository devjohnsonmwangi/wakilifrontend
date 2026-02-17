import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, AlertTriangle, FileText, BookOpen, DollarSign, Clock, Shield, Eye, MessageSquare, ScrollText, ArrowRight, FileCheck } from 'lucide-react';

// FAQ Data - moved outside component to avoid React Hook dependency issues
const faqsData = [
  {
    question: 'What should I do immediately if I lose my title deed?',
    answer: 'Immediately report the loss to your local police station and obtain a police abstract/report. Keep this report safe as it\'s required for the replacement process. Then contact the Lands Registry to inform them of the loss. Do not delay as this protects your property rights.'
  },
  {
    question: 'How long does it take to replace a lost title deed?',
    answer: 'The replacement process typically takes 1-3 months, depending on the complexity of your case and Lands Registry workload. The gazette notice must be published for 30 days (minimum waiting period). Processing time varies from 2-8 weeks after gazette publication.'
  },
  {
    question: 'How much does it cost to replace a lost title deed in Kenya?',
    answer: 'Costs typically range from KES 5,000 to KES 25,000+, including: Lands Registry application fee (KES 2,000-5,000), gazette notice publication (KES 3,000-8,000), lawyer fee (if applicable, KES 5,000-15,000), and miscellaneous fees. Exact cost depends on your county and whether you hire legal help.'
  },
  {
    question: 'Is an affidavit required for lost title deed replacement?',
    answer: 'Yes, an affidavit is mandatory. You must swear an affidavit before a court officer or commissioner of oaths declaring that the title deed has been lost, when it was lost, and circumstances of the loss. The affidavit must be notarized and becomes part of your application.'
  },
  {
    question: 'Can I apply for a duplicate title deed without a police report?',
    answer: 'Technically, you can apply without a police report, but it\'s strongly not recommended. A police report provides legal proof of loss and protects you from liability if the original deed surfaces later. Most Lands Registries will request it, and it speeds up the process.'
  },
  {
    question: 'What is the gazette notice for title deed replacement?',
    answer: 'A gazette notice is a public announcement published in the Kenya Gazette (official government newspaper) informing the public that you\'ve lost your title deed and are applying for a duplicate. This 30-day notice period allows anyone with claims on your property to come forward. After 30 days without objections, replacement is approved.'
  },
  {
    question: 'Can someone else claim my property using a lost title deed?',
    answer: 'It\'s highly unlikely. Once you file a police report and application with Lands Registry, the lost deed is flagged as invalid in their system. However, before flagging, theoretically someone could attempt fraudulent use. This is why immediate reporting is critical to protect your interests.'
  },
  {
    question: 'What if my title deed was damaged (not lost)?',
    answer: 'Damaged deeds require a similar but slightly simpler process. You don\'t need a police report, but you must provide the damaged deed itself and an affidavit explaining the damage. You can also apply for a certified copy first if the damage makes it unreadable.'
  },
  {
    question: 'Can I sell my property if my title deed is lost?',
    answer: 'You cannot sell property with a lost title deed until it\'s replaced. Buyers require the original or certified duplicate title deed for the transaction to be registered. However, during the replacement process, you can begin the sale process and complete it once the new deed is issued (though this requires coordination).'
  },
  {
    question: 'How do I get a certified copy of my title deed if I can\'t find the original?',
    answer: 'Request a certified copy from the Lands Registry using your property PIN (Unique Property Identifier). This can be done before or during the replacement process. A certified copy serves as proof of ownership temporarily but doesn\'t replace the need for a new original title deed.'
  },
  {
    question: 'What if someone else claims they have my lost title deed?',
    answer: 'This is a serious fraud concern. Immediately report it to police and the Lands Registry. Provide all evidence. If someone fraudulently claims ownership using your lost deed, you have legal remedies: file a police report, lodge a complaint with Lands Registry, and pursue civil or criminal action with lawyer help.'
  },
  {
    question: 'Can I replace a title deed remotely or online?',
    answer: 'Most of the process requires in-person visits to the Lands Registry office in your county, especially for affidavit swearing and document submission. Some counties are piloting digital services, but as of 2025, most processes require physical attendance. Check your county registry for online options.'
  },
  {
    question: 'What happens if the gazette notice finds objections to my replacement?',
    answer: 'If someone objects during the 30-day gazette notice period, the replacement is delayed and investigated. You\'ll be notified and may need to attend a hearing to prove your ownership. Objections are rare but must be resolved before a new deed is issued. A lawyer can help defend your claim.'
  },
  {
    question: 'Can an inherited property title deed be replaced if lost?',
    answer: 'Yes, inherited property title deeds can be replaced, but the process may be slightly more complex. You\'ll need to prove your inheritance through succession documents or letters of administration. The replacement process remains similar but requires additional documentation proving your legal right to the property.'
  },
  {
    question: 'What is the Land Registration Act provision for lost deeds?',
    answer: 'Section 103 of the Land Registration Act 2012 provides the legal framework for replacing lost, destroyed, or damaged title deeds. It outlines the requirement for gazette notice, affidavit, and the 30-day waiting period. Lands Registrars have authority to issue duplicate deeds under this section.'
  }
];

const LostTitleDeedReplacementKenya: React.FC = () => {
  const [activeSection, setActiveSection] = useState('what-happens');
  const [toggleFAQ, setToggleFAQ] = useState<number | null>(null);

  useEffect(() => {
    // SEO Meta Tags
    document.title = 'Lost Title Deed Replacement Kenya | Complete Step-by-Step Guide';
    
    const updateMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateMeta('description', 'Complete guide to replacing a lost, stolen, or damaged title deed in Kenya. Step-by-step process, costs, required documents, and legal requirements.');
    updateMeta('keywords', 'lost title deed kenya, replace title deed, duplicate title deed kenya, title deed replacement process, lost property deed, lands registry replacement');
    
    // OG Tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', 'Lost Title Deed Replacement in Kenya – Complete Guide');

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', 'Step-by-step guide to replacing a lost, stolen, or damaged title deed in Kenya. Learn the legal process, costs, and required documents.');

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute('content', 'https://wakili.co.ke/lost-title-deed-replacement-kenya');

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
    twitterTitle.setAttribute('content', 'Lost Title Deed Replacement in Kenya – Legal Guide');

    let twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (!twitterDesc) {
      twitterDesc = document.createElement('meta');
      twitterDesc.setAttribute('name', 'twitter:description');
      document.head.appendChild(twitterDesc);
    }
    twitterDesc.setAttribute('content', 'Complete step-by-step guide to replacing a lost or damaged title deed in Kenya. Includes costs, documents, and legal requirements.');

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
    canonical.setAttribute('href', 'https://wakili.co.ke/lost-title-deed-replacement-kenya');

    // JSON-LD Structured Data
    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': 'https://wakili.co.ke/lost-title-deed-replacement-kenya',
          url: 'https://wakili.co.ke/lost-title-deed-replacement-kenya',
          name: 'Lost Title Deed Replacement in Kenya – Complete Guide',
          isPartOf: { '@id': 'https://wakili.co.ke' },
          datePublished: '2025-02-06',
          dateModified: '2025-02-06',
          author: { '@type': 'Organization', name: 'Wakili Legal Hub' },
          description: 'Complete step-by-step guide to replacing a lost, stolen, or damaged title deed in Kenya with legal requirements and costs.'
        },
        {
          '@type': 'BreadcrumbList',
          '@id': 'https://wakili.co.ke/lost-title-deed-replacement-kenya#breadcrumb',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://wakili.co.ke' },
            { '@type': 'ListItem', position: 2, name: 'Legal Guides', item: 'https://wakili.co.ke' },
            { '@type': 'ListItem', position: 3, name: 'Lost Title Deed Replacement', item: 'https://wakili.co.ke/lost-title-deed-replacement-kenya' }
          ]
        },
        {
          '@type': 'FAQPage',
          '@id': 'https://wakili.co.ke/lost-title-deed-replacement-kenya#faqpage',
          mainEntity: faqsData.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer }
          }))
        },
        {
          '@type': 'HowTo',
          name: 'How to Replace a Lost Title Deed in Kenya',
          step: [
            { '@type': 'HowToStep', name: 'Report to Police', text: 'Go to your local police station and file a report about the lost title deed. Obtain a police abstract or report document.' },
            { '@type': 'HowToStep', name: 'Swear Affidavit', text: 'Visit a commissioner of oaths or court officer and swear an affidavit declaring the loss, circumstances, and attempts to find the deed.' },
            { '@type': 'HowToStep', name: 'Gather Documents', text: 'Collect required documents: ID, police report, affidavit, property details, and any other supporting documents.' },
            { '@type': 'HowToStep', name: 'Apply at Lands Registry', text: 'Visit the Lands Registry in your county with all documents and complete the application form for duplicate title deed.' },
            { '@type': 'HowToStep', name: 'Gazette Notice Publication', text: 'The Lands Registry will publish a gazette notice (30-day public notice period) allowing anyone to object to the replacement.' },
            { '@type': 'HowToStep', name: 'Wait for Approval', text: 'After the 30-day gazette period with no objections, the registry will process and issue your duplicate title deed.' }
          ]
        },
        {
          '@type': 'GovernmentService',
          name: 'Title Deed Replacement Service',
          provider: { '@type': 'GovernmentOrganization', name: 'Lands Registry, Kenya' },
          serviceType: 'Property Registration'
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
    { id: 'what-happens', label: 'What Happens If Lost?', icon: <AlertTriangle size={16} /> },
    { id: 'legal-requirements', label: 'Legal Requirements', icon: <BookOpen size={16} /> },
    { id: 'when-replace', label: 'When Must Replace?', icon: <Clock size={16} /> },
    { id: 'step-by-step', label: 'Step-by-Step Process', icon: <FileCheck size={16} /> },
    { id: 'documents', label: 'Documents Required', icon: <FileText size={16} /> },
    { id: 'costs', label: 'Fees & Costs', icon: <DollarSign size={16} /> },
    { id: 'timeline', label: 'How Long It Takes', icon: <Clock size={16} /> },
    { id: 'mistakes', label: 'Common Mistakes', icon: <Eye size={16} /> },
    { id: 'protect', label: 'How to Protect', icon: <Shield size={16} /> },
    { id: 'special-cases', label: 'Special Cases', icon: <MessageSquare size={16} /> },
    { id: 'faqs', label: 'FAQs', icon: <FileCheck size={16} /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-rose-50">
      {/* Sticky Breadcrumb */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-orange-200/30">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-3 flex items-center gap-2 text-xs sm:text-sm">
          <Link to="/" className="text-orange-600 hover:text-orange-700 font-medium">Home</Link>
          <ChevronDown size={14} className="text-orange-400 rotate-[-90deg]" />
          <Link to="/land-disputes-kenya" className="text-orange-600 hover:text-orange-700 font-medium">Legal Guides</Link>
          <ChevronDown size={14} className="text-orange-400 rotate-[-90deg]" />
          <span className="text-orange-900 font-semibold">Lost Title Deed Replacement</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-rose-600 text-white py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 text-center">
          <div className="flex justify-center mb-4">
            <FileText size={40} className="text-red-200" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold mb-4">Lost Title Deed Replacement in Kenya</h1>
          <p className="text-lg sm:text-xl text-red-100 max-w-3xl mx-auto mb-6">
            Complete step-by-step guide to legally replacing a lost, stolen, or damaged title deed. Learn the process, costs, required documents, and how to protect your property rights.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://wa.me/254112810203" target="_blank" rel="noopener noreferrer" className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-50 transition">
              Get Free Consultation
            </a>
            <Link to="/how-to-buy-land-safely-kenya" className="bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-800 transition">
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
                      ? 'bg-orange-100 text-orange-900 border-b-2 border-orange-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-orange-50'
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
            <nav className="space-y-2 bg-white/60 p-4 rounded-lg border border-orange-200/30">
              <p className="text-xs font-semibold text-orange-900 uppercase mb-4 flex items-center gap-2">
                <ScrollText size={14} /> Contents
              </p>
              {sections.map(section => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={() => setActiveSection(section.id)}
                  className={`block px-3 py-2 rounded-md text-sm font-medium transition-all border-l-4 ${
                    activeSection === section.id
                      ? 'bg-orange-100 text-orange-900 border-l-orange-600'
                      : 'text-gray-700 border-l-transparent hover:bg-orange-50'
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
          <section id="what-happens" className="bg-white rounded-lg border border-orange-200/30 p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="text-orange-600 flex-shrink-0 mt-1" size={24} />
              <h2 className="text-2xl sm:text-3xl font-bold text-orange-900">What Happens If a Title Deed Is Lost?</h2>
            </div>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Losing a title deed is a serious matter that requires immediate legal action. A title deed is the official legal document proving your ownership of land. Without it, you cannot sell, mortgage, lease, or transfer your property. You're essentially locked out of using your property rights until the deed is replaced.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              The good news: Kenya's legal system provides a clear, well-established process for replacing lost title deeds under the <strong>Land Registration Act 2012</strong>. With proper documentation and following the correct steps, you can obtain a duplicate deed and restore your ownership rights.
            </p>
            <div className="bg-orange-50 border-l-4 border-orange-600 p-4 rounded">
              <p className="text-orange-900 font-semibold">Critical Action:</p>
              <p className="text-orange-800">Report the loss to police immediately. Obtain a police abstract. Inform the Lands Registry. These steps protect you legally and prevent fraudulent use of your lost deed.</p>
            </div>
          </section>

          {/* Section 2 */}
          <section id="legal-requirements" className="bg-white rounded-lg border border-orange-200/30 p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <BookOpen className="text-orange-600 flex-shrink-0 mt-1" size={24} />
              <h2 className="text-2xl sm:text-3xl font-bold text-orange-900">Legal Requirements Under Kenyan Law</h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg text-orange-800 mb-2">Land Registration Act 2012 – Section 103</h3>
                <p className="text-gray-700">Section 103 of the Land Registration Act specifically provides the legal framework for replacing lost, destroyed, or damaged title deeds. It empowers the Lands Registrar to issue duplicate deeds upon application and after following prescribed procedures.</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-orange-800 mb-2">The Constitution of Kenya 2010</h3>
                <p className="text-gray-700">Article 60 recognizes the right to property. The legal process for replacing title deeds ensures your property rights are protected even if the original document is lost. You maintain your ownership rights regardless of the deed's existence.</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-orange-800 mb-2">Role of the Lands Registry</h3>
                <p className="text-gray-700">The Lands Registry maintains official records of all property ownership. They have copies of original title deeds in their archives. This means even if your original deed is lost, the government has a record of your ownership that can be used to issue a replacement.</p>
              </div>

              <div className="bg-blue-50 p-4 rounded">
                <p className="text-blue-900 font-semibold mb-2">Key Principle:</p>
                <p className="text-blue-800">Your ownership rights exist independent of the physical title deed. The deed is merely evidence of ownership. Losing the document doesn't mean you've lost your land.</p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section id="when-replace" className="bg-white rounded-lg border border-orange-200/30 p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <Clock className="text-orange-600 flex-shrink-0 mt-1" size={24} />
              <h2 className="text-2xl sm:text-3xl font-bold text-orange-900">When You Must Replace a Title Deed</h2>
            </div>

            <div className="space-y-3">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="font-semibold text-red-900 mb-1">⚠ LOST:</p>
                <p className="text-red-800">The deed has disappeared from your possession. You've searched everywhere but cannot locate it. This is the most common situation requiring replacement.</p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="font-semibold text-red-900 mb-1">⚠ STOLEN:</p>
                <p className="text-red-800">Someone has taken your title deed without permission. You must report this to police as a theft/robbery case. A police report is especially important here to protect against fraud.</p>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                <p className="font-semibold text-orange-900 mb-1">⚠ DESTROYED:</p>
                <p className="text-orange-800">Your deed was damaged by fire, water, natural disaster, or other destruction making it unusable. Provide evidence of the destruction (photos, insurance reports). You may provide the destroyed deed to the registry.</p>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                <p className="font-semibold text-yellow-900 mb-1">⚠ DAMAGED:</p>
                <p className="text-yellow-800">The deed is still in your possession but partially damaged, making it difficult to read or legally unclear. You need to replace or certify it. This process is slightly simpler than a lost deed.</p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section id="step-by-step" className="bg-white rounded-lg border border-orange-200/30 p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <FileCheck className="text-orange-600 flex-shrink-0 mt-1" size={24} />
              <h2 className="text-2xl sm:text-3xl font-bold text-orange-900">Step-by-Step Replacement Process</h2>
            </div>

            <ol className="space-y-4">
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
                <div>
                  <h3 className="font-semibold text-orange-900 mb-1">Report Loss to Police</h3>
                  <p className="text-gray-700">Go to your nearest police station and report the lost title deed. Explain what was lost, when, and how. The police will file a report and issue you a police abstract/report document. This is critical evidence.</p>
                </div>
              </li>

              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
                <div>
                  <h3 className="font-semibold text-orange-900 mb-1">Obtain Police Abstract</h3>
                  <p className="text-gray-700">Request an official police abstract (summary/report) of your complaint. This document will be submitted to Lands Registry. Keep multiple copies. Cost: Usually free or minimal.</p>
                </div>
              </li>

              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
                <div>
                  <h3 className="font-semibold text-orange-900 mb-1">Swear an Affidavit</h3>
                  <p className="text-gray-700">Visit a commissioner of oaths or court officer (available at any law firm, court, or county offices). Swear a statutory declaration/affidavit stating: your name, property details, when the deed was lost, circumstances of loss, and that you've made reasonable efforts to find it.</p>
                </div>
              </li>

              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">4</span>
                <div>
                  <h3 className="font-semibold text-orange-900 mb-1">Gather All Required Documents</h3>
                  <p className="text-gray-700">Collect your national ID, police report, affidavit, property PIN (Unique Property Identifier), any existing correspondence about the property, and payment proof. See documents checklist below.</p>
                </div>
              </li>

              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">5</span>
                <div>
                  <h3 className="font-semibold text-orange-900 mb-1">Apply at Lands Registry</h3>
                  <p className="text-gray-700">Visit the Lands Registry office in your property's county. Complete the official application form for duplicate title deed. Submit all documents. Pay the application fee (KES 2,000-5,000). Request a receipt and reference number.</p>
                </div>
              </li>

              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">6</span>
                <div>
                  <h3 className="font-semibold text-orange-900 mb-1">Gazette Notice Publication</h3>
                  <p className="text-gray-700">The Lands Registry will publish a notice in the Kenya Gazette (official government newspaper) announcing your application. This is a mandatory 30-day public notice period allowing anyone to object to your replacement claim. Cost: KES 3,000-8,000 (charged to you).</p>
                </div>
              </li>

              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">7</span>
                <div>
                  <h3 className="font-semibold text-orange-900 mb-1">Wait for Gazette Period to Elapse</h3>
                  <p className="text-gray-700">Wait the mandatory 30 days. If no objections are filed during this period, your application proceeds. If someone objects, you may need to attend a hearing (rare). The registry will contact you if this occurs.</p>
                </div>
              </li>

              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">8</span>
                <div>
                  <h3 className="font-semibold text-orange-900 mb-1">Receive Your Duplicate Title Deed</h3>
                  <p className="text-gray-700">Once approved (2-8 weeks after gazette period), the registry will issue your duplicate title deed. It's identical to the original and has the same legal validity. Collect it from the registry or request delivery if available in your county.</p>
                </div>
              </li>
            </ol>
          </section>

          {/* Section 5 */}
          <section id="documents" className="bg-white rounded-lg border border-orange-200/30 p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <FileText className="text-orange-600 flex-shrink-0 mt-1" size={24} />
              <h2 className="text-2xl sm:text-3xl font-bold text-orange-900">Documents Required (Checklist)</h2>
            </div>

            <div className="overflow-x-auto mb-4">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-orange-100">
                    <th className="border border-orange-200 p-3 text-left font-bold text-orange-900">Document</th>
                    <th className="border border-orange-200 p-3 text-left font-bold text-orange-900">Purpose</th>
                    <th className="border border-orange-200 p-3 text-left font-bold text-orange-900">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white hover:bg-orange-50">
                    <td className="border border-orange-200 p-3">National ID (Original + Copy)</td>
                    <td className="border border-orange-200 p-3">Proof of identity</td>
                    <td className="border border-orange-200 p-3">MANDATORY</td>
                  </tr>
                  <tr className="bg-gray-50 hover:bg-orange-50">
                    <td className="border border-orange-200 p-3">Police Abstract/Report</td>
                    <td className="border border-orange-200 p-3">Evidence of loss report</td>
                    <td className="border border-orange-200 p-3">CRITICAL - Protects you legally</td>
                  </tr>
                  <tr className="bg-white hover:bg-orange-50">
                    <td className="border border-orange-200 p-3">Affidavit/Statutory Declaration</td>
                    <td className="border border-orange-200 p-3">Legal statement of loss</td>
                    <td className="border border-orange-200 p-3">Must be sworn before commissioner of oaths</td>
                  </tr>
                  <tr className="bg-gray-50 hover:bg-orange-50">
                    <td className="border border-orange-200 p-3">Property PIN</td>
                    <td className="border border-orange-200 p-3">Unique property identifier</td>
                    <td className="border border-orange-200 p-3">Available from old deed or registry</td>
                  </tr>
                  <tr className="bg-white hover:bg-orange-50">
                    <td className="border border-orange-200 p-3">Application Form</td>
                    <td className="border border-orange-200 p-3">Official registry form</td>
                    <td className="border border-orange-200 p-3">Provided by Lands Registry</td>
                  </tr>
                  <tr className="bg-gray-50 hover:bg-orange-50">
                    <td className="border border-orange-200 p-3">Payment Proof</td>
                    <td className="border border-orange-200 p-3">Evidence of application fee payment</td>
                    <td className="border border-orange-200 p-3">Receipt from registry or bank</td>
                  </tr>
                  <tr className="bg-white hover:bg-orange-50">
                    <td className="border border-orange-200 p-3">Property Description/Sketch</td>
                    <td className="border border-orange-200 p-3">Location and size details</td>
                    <td className="border border-orange-200 p-3">If available from old documents</td>
                  </tr>
                  <tr className="bg-gray-50 hover:bg-orange-50">
                    <td className="border border-orange-200 p-3">Previous Correspondence</td>
                    <td className="border border-orange-200 p-3">Any land registry letters/notices</td>
                    <td className="border border-orange-200 p-3">Helpful but not mandatory</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-gray-700"><strong>Pro Tip:</strong> Bring original documents AND certified copies of everything. Ask the registry which specific documents they need to avoid multiple visits.</p>
          </section>

          {/* Section 6 */}
          <section id="costs" className="bg-white rounded-lg border border-orange-200/30 p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <DollarSign className="text-orange-600 flex-shrink-0 mt-1" size={24} />
              <h2 className="text-2xl sm:text-3xl font-bold text-orange-900">Fees & Costs Breakdown</h2>
            </div>

            <div className="overflow-x-auto mb-4">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-orange-100">
                    <th className="border border-orange-200 p-3 text-left font-bold text-orange-900">Cost Item</th>
                    <th className="border border-orange-200 p-3 text-left font-bold text-orange-900">Amount (KES)</th>
                    <th className="border border-orange-200 p-3 text-left font-bold text-orange-900">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white hover:bg-orange-50">
                    <td className="border border-orange-200 p-3">Police Report</td>
                    <td className="border border-orange-200 p-3">Free - 1,000</td>
                    <td className="border border-orange-200 p-3">Varies by county</td>
                  </tr>
                  <tr className="bg-gray-50 hover:bg-orange-50">
                    <td className="border border-orange-200 p-3">Affidavit (Commissioner of Oaths)</td>
                    <td className="border border-orange-200 p-3">500 - 2,000</td>
                    <td className="border border-orange-200 p-3">Statutory declaration swearing fee</td>
                  </tr>
                  <tr className="bg-white hover:bg-orange-50">
                    <td className="border border-orange-200 p-3">Lands Registry Application Fee</td>
                    <td className="border border-orange-200 p-3">2,000 - 5,000</td>
                    <td className="border border-orange-200 p-3">Official processing fee</td>
                  </tr>
                  <tr className="bg-gray-50 hover:bg-orange-50">
                    <td className="border border-orange-200 p-3">Gazette Notice Publication</td>
                    <td className="border border-orange-200 p-3">3,000 - 8,000</td>
                    <td className="border border-orange-200 p-3">Mandatory public notice</td>
                  </tr>
                  <tr className="bg-white hover:bg-orange-50">
                    <td className="border border-orange-200 p-3">Lawyer Fee (Optional)</td>
                    <td className="border border-orange-200 p-3">5,000 - 15,000+</td>
                    <td className="border border-orange-200 p-3">If you hire legal representation</td>
                  </tr>
                  <tr className="bg-gray-50 hover:bg-orange-50">
                    <td className="border border-orange-200 p-3">Courier/Delivery (Optional)</td>
                    <td className="border border-orange-200 p-3">1,000 - 3,000</td>
                    <td className="border border-orange-200 p-3">If deed is mailed to you</td>
                  </tr>
                  <tr className="bg-white hover:bg-orange-50">
                    <td className="border border-orange-200 p-3"><strong>ESTIMATED TOTAL (Without Lawyer)</strong></td>
                    <td className="border border-orange-200 p-3"><strong>6,500 - 18,000+</strong></td>
                    <td className="border border-orange-200 p-3">Most common scenario</td>
                  </tr>
                  <tr className="bg-orange-50 hover:bg-orange-100">
                    <td className="border border-orange-200 p-3"><strong>ESTIMATED TOTAL (With Lawyer)</strong></td>
                    <td className="border border-orange-200 p-3"><strong>11,500 - 33,000+</strong></td>
                    <td className="border border-orange-200 p-3">If legal assistance required</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-gray-700"><strong>Money-Saving Tip:</strong> You can do most of this yourself without a lawyer. Only hire one if complications arise or if you're uncomfortable navigating the process alone.</p>
          </section>

          {/* Section 7 */}
          <section id="timeline" className="bg-white rounded-lg border border-orange-200/30 p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <Clock className="text-orange-600 flex-shrink-0 mt-1" size={24} />
              <h2 className="text-2xl sm:text-3xl font-bold text-orange-900">How Long It Takes (Timeline)</h2>
            </div>

            <div className="space-y-3">
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-20 font-bold text-orange-600">1-2 days</div>
                <div>
                  <p className="font-semibold text-gray-900">Police Report</p>
                  <p className="text-gray-700">Time to report loss and get police abstract</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-20 font-bold text-orange-600">1-3 days</div>
                <div>
                  <p className="font-semibold text-gray-900">Swear Affidavit</p>
                  <p className="text-gray-700">Visit commissioner of oaths and complete statutory declaration</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-20 font-bold text-orange-600">1 day</div>
                <div>
                  <p className="font-semibold text-gray-900">Document Submission</p>
                  <p className="text-gray-700">Visit Lands Registry and submit application with all documents</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-20 font-bold text-orange-600">3-7 days</div>
                <div>
                  <p className="font-semibold text-gray-900">Gazette Preparation</p>
                  <p className="text-gray-700">Registry prepares and submits notice to Kenya Gazette for publication</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-20 font-bold text-orange-600">30 days</div>
                <div>
                  <p className="font-semibold text-gray-900">Gazette Notice Period</p>
                  <p className="text-gray-700">Mandatory waiting period for public objections (cannot be shortened)</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-20 font-bold text-orange-600">2-8 weeks</div>
                <div>
                  <p className="font-semibold text-gray-900">Processing & Issuance</p>
                  <p className="text-gray-700">After gazette period, registry processes and issues duplicate deed</p>
                </div>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-600 p-4 rounded mt-4">
                <p className="font-bold text-orange-900">TOTAL: 1-3 MONTHS (Typical Timeline)</p>
                <p className="text-orange-800">Fastest case: 4-6 weeks. Slowest case: 3+ months depending on registry workload and complexity.</p>
              </div>
            </div>
          </section>

          {/* Section 8 */}
          <section id="mistakes" className="bg-white rounded-lg border border-orange-200/30 p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <Eye className="text-orange-600 flex-shrink-0 mt-1" size={24} />
              <h2 className="text-2xl sm:text-3xl font-bold text-orange-900">Common Mistakes That Delay Replacement</h2>
            </div>

            <div className="space-y-3">
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="font-semibold text-red-900 mb-1">❌ Mistake: Not Reporting to Police Immediately</p>
                <p className="text-red-800">Delay in reporting to police can hurt your replacement case. Report within days of loss, not weeks. Police report is critical evidence.</p>
                <p className="text-red-700 font-semibold mt-2">✓ Fix: Report within 1-2 days of discovering the loss.</p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <p className="font-semibold text-red-900 mb-1">❌ Mistake: Incomplete Affidavit</p>
                <p className="text-red-800">Affidavits with missing information, incorrect signatures, or unwitnessed declarations get rejected. Must be sworn before proper official.</p>
                <p className="text-red-700 font-semibold mt-2">✓ Fix: Use commissioner of oaths or court officer. Include all required details about the loss.</p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <p className="font-semibold text-red-900 mb-1">❌ Mistake: Missing Documents</p>
                <p className="text-red-800">Submitting incomplete applications requires you to return multiple times. This delays the process by weeks. Gather everything first.</p>
                <p className="text-red-700 font-semibold mt-2">✓ Fix: Use the documents checklist above. Verify with registry what's needed before going.</p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <p className="font-semibold text-red-900 mb-1">❌ Mistake: Incorrect Property PIN or Details</p>
                <p className="text-red-800">Wrong property PIN or mismatched land details confuse the application. Registry can't process it until corrected.</p>
                <p className="text-red-700 font-semibold mt-2">✓ Fix: Verify PIN and property details with registry or county land office before application.</p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <p className="font-semibold text-red-900 mb-1">❌ Mistake: Insufficient Payment for Gazette Notice</p>
                <p className="text-red-800">Gazette publication is not free. If you don't pay in full upfront, processing stops. Costs have increased over time.</p>
                <p className="text-red-700 font-semibold mt-2">✓ Fix: Ask registry for exact gazette cost upfront and budget accordingly.</p>
              </div>
            </div>
          </section>

          {/* Section 9 */}
          <section id="protect" className="bg-white rounded-lg border border-orange-200/30 p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <Shield className="text-orange-600 flex-shrink-0 mt-1" size={24} />
              <h2 className="text-2xl sm:text-3xl font-bold text-orange-900">How to Protect Your Title Deed in Future</h2>
            </div>

            <div className="space-y-3">
              <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
                <p className="font-semibold text-green-900 mb-2">💾 Store Safely</p>
                <p className="text-green-800">Keep title deeds in a fireproof safe at home or in a bank safe deposit box. Don't leave them lying around. Multiple properties = multiple deeds to protect.</p>
              </div>

              <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
                <p className="font-semibold text-green-900 mb-2">📋 Make Copies</p>
                <p className="text-green-800">Make certified copies of your title deed. Keep copies separately from the original. If the original is lost, you have a backup reference.</p>
              </div>

              <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
                <p className="font-semibold text-green-900 mb-2">📷 Photograph</p>
                <p className="text-green-800">Take clear photographs of both sides of your title deed. Store photos in cloud storage (Google Drive, Dropbox). Include deed number, property PIN, and owner details.</p>
              </div>

              <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
                <p className="font-semibold text-green-900 mb-2">🔐 Register with Lands Registry</p>
                <p className="text-green-800">Keep your land registration updated with Lands Registry. They maintain official records. Know your property PIN by heart.</p>
              </div>

              <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
                <p className="font-semibold text-green-900 mb-2">👨‍⚖️ Create a Will</p>
                <p className="text-green-800">Document your property ownership in a will or trust. This ensures heirs know about the property and have backup proof of ownership.</p>
              </div>

              <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
                <p className="font-semibold text-green-900 mb-2">🏦 Insure Your Deed</p>
                <p className="text-green-800">Include property deed replacement costs in your property insurance if possible. Some policies cover loss of important documents.</p>
              </div>
            </div>
          </section>

          {/* Section 10 */}
          <section id="special-cases" className="bg-white rounded-lg border border-orange-200/30 p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <MessageSquare className="text-orange-600 flex-shrink-0 mt-1" size={24} />
              <h2 className="text-2xl sm:text-3xl font-bold text-orange-900">Special Cases</h2>
            </div>

            <div className="space-y-4">
              <div className="border-l-4 border-orange-600 p-4 bg-orange-50 rounded">
                <h3 className="font-semibold text-orange-900 mb-2">Case 1: Lost Title During Property Transfer</h3>
                <p className="text-gray-700">You lose your deed while in the middle of selling or transferring the property. Solution: Notify the buyer's lawyer immediately. Proceed with replacement process. The transfer can still be completed using a certified copy temporarily, but a new original deed must be issued before final registration.</p>
              </div>

              <div className="border-l-4 border-orange-600 p-4 bg-orange-50 rounded">
                <h3 className="font-semibold text-orange-900 mb-2">Case 2: Company-Owned Land</h3>
                <p className="text-gray-700">If a company owns the property, the process is similar but company documents required: Certificate of Incorporation, company seal, director's affidavit, board resolution authorizing the replacement. Company lawyer typically handles this.</p>
              </div>

              <div className="border-l-4 border-orange-600 p-4 bg-orange-50 rounded">
                <h3 className="font-semibold text-orange-900 mb-2">Case 3: Inherited Land</h3>
                <p className="text-gray-700">You inherit property with a lost title deed. Must first obtain Letters of Administration or Succession Certificate proving your right. Then proceed with standard replacement. You'll need both sets of documents for the registry.</p>
              </div>

              <div className="border-l-4 border-orange-600 p-4 bg-orange-50 rounded">
                <h3 className="font-semibold text-orange-900 mb-2">Case 4: Multiple Objections on Gazette Notice</h3>
                <p className="text-gray-700">Someone objects during the 30-day period claiming interest in the property. You'll need to attend a hearing to defend your ownership claim. Bring all documents proving ownership. A lawyer is highly recommended for this scenario.</p>
              </div>
            </div>
          </section>

          {/* Section 11 - FAQs */}
          <section id="faqs" className="bg-white rounded-lg border border-orange-200/30 p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-3 mb-6">
              <FileCheck className="text-orange-600 flex-shrink-0 mt-1" size={24} />
              <h2 className="text-2xl sm:text-3xl font-bold text-orange-900">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-3">
              {faqsData.map((faq, idx) => (
                <div key={idx} className="border border-orange-200/30 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setToggleFAQ(toggleFAQ === idx ? null : idx)}
                    className="w-full px-4 py-3 bg-orange-50 hover:bg-orange-100 flex items-center justify-between transition text-left"
                  >
                    <span className="font-semibold text-orange-900">{faq.question}</span>
                    <ChevronDown
                      size={20}
                      className={`text-orange-600 transition-transform ${toggleFAQ === idx ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {toggleFAQ === idx && (
                    <div className="px-4 py-3 bg-white text-gray-700 border-t border-orange-200/30">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg p-6 sm:p-8 shadow-lg">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">Need Help with Lost Title Deed Replacement?</h3>
            <p className="mb-6 text-red-100">Our experienced land lawyers can guide you through the replacement process, prepare your affidavit, and ensure all documents are correct.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="https://wa.me/254112810203" target="_blank" rel="noopener noreferrer" className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-50 transition flex items-center gap-2">
                <MessageSquare size={18} /> WhatsApp Us
              </a>
              <a href="mailto:johnsonthuraniramwangi@gmail.com" className="bg-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-800 transition">
                Email Our Team
              </a>
            </div>
          </section>

          {/* Related Links */}
          <section className="bg-red-50 border border-red-200/50 rounded-lg p-6 sm:p-8">
            <h3 className="text-xl font-bold text-red-900 mb-4">Related Legal Resources</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <Link to="/land-ownership-title-verification-kenya" className="flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold">
                <ArrowRight size={16} /> Land Ownership & Title Verification
              </Link>
              <Link to="/land-transfer-process-kenya" className="flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold">
                <ArrowRight size={16} /> Land Transfer Process
              </Link>
              <Link to="/how-to-buy-land-safely-kenya" className="flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold">
                <ArrowRight size={16} /> How to Buy Land Safely
              </Link>
              <Link to="/land-disputes-kenya" className="flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold">
                <ArrowRight size={16} /> Land Disputes Guide
              </Link>
              <Link to="/leasehold-freehold-kenya" className="flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold">
                <ArrowRight size={16} /> Leasehold vs Freehold Land
              </Link>
            </div>
          </section>
        </div>
      </div>
      </div>

      {/* Professional Footer */}
      <footer className="bg-gradient-to-r from-orange-900 via-red-900 to-rose-900 text-white mt-20 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-lg mb-3">Wakili Legal Hub</h4>
              <p className="text-red-200 text-sm">Expert legal guidance on Kenyan land law, property rights, and property documentation.</p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-3">Quick Links</h4>
              <ul className="text-red-200 text-sm space-y-2">
                <li><Link to="/" className="hover:text-white transition">Home</Link></li>
                <li><Link to="/how-to-buy-land-safely-kenya" className="hover:text-white transition">Buy Land Safely</Link></li>
                <li><Link to="/land-disputes-kenya" className="hover:text-white transition">Land Disputes</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-3">Contact Us</h4>
              <ul className="text-red-200 text-sm space-y-2">
                <li>Email: <a href="mailto:johnsonthuraniramwangi@gmail.com" className="hover:text-white transition">johnsonthuraniramwangi@gmail.com</a></li>
                <li>WhatsApp: <a href="https://wa.me/254112810203" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">+254 112 810 203</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-3">Legal Disclaimer</h4>
              <p className="text-red-200 text-xs">This content is for informational purposes only. Not legal advice. Always consult a qualified attorney.</p>
            </div>
          </div>
          <div className="border-t border-red-700 pt-6 text-center text-red-300 text-sm">
            <p>&copy; 2025 Wakili Legal Hub. All rights reserved. | Helping Kenyans protect their property rights.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LostTitleDeedReplacementKenya;
