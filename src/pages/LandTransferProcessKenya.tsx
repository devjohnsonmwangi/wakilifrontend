import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  FileText,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  
  Clock,
  DollarSign,
  MessageCircle,
  Mail,
  Landmark,
  Users,
  
  Building2,
  MapPin,
  TrendingUp,
  FileCheck,
  
  AlertTriangle,
  Target,
  Gavel,
  ArrowRight,
  Check,
  Shield
} from 'lucide-react';

// FAQs data - defined outside component
const faqs = [
  {
    question: 'How long does land transfer take in Kenya?',
    answer: 'Land transfer typically takes 2-6 months in total. This includes: sale agreement (1-2 weeks), due diligence and search (1-3 weeks), Land Control Board consent (2-4 weeks), valuation (1-2 weeks), stamp duty payment (1-2 days), transfer forms preparation (1 week), lodging at registry (1 day), and registry processing (4-8 weeks). The registry processing is usually the longest phase. Some fast counties process within 4-6 weeks, while slower ones take 3-6 months.'
  },
  {
    question: 'Who pays for land transfer costs?',
    answer: 'In Kenya, the buyer typically pays most land transfer costs including: stamp duty (2% of property value), registry transfer fees (1-2% of value), lawyer fees, surveyor fees, and valuation fees. The seller may pay their own lawyer fees for preparing the sale agreement. Payment responsibility should be clearly stated in the sale agreement before signing.'
  },
  {
    question: 'What is stamp duty and how much is it?',
    answer: 'Stamp duty is a government tax on the land transfer. In Kenya, it is 2% of the property value paid to the Kenya Revenue Authority (KRA). For example, a KES 5 million property attracts KES 100,000 stamp duty. This must be paid before the Lands Registry will process the transfer. Without the stamp duty receipt, your transfer will be rejected.'
  },
  {
    question: 'What is Land Control Board consent?',
    answer: 'For transfers over 5 acres, or transfers of agricultural land to non-family members, you need approval from the County Land Control Board. This is a government body that ensures land is not being sold in a way that violates public interest. Application takes 2-4 weeks. For smaller residential plots or family transfers, consent is usually not required.'
  },
  {
    question: 'Can I transfer land if there is a mortgage on it?',
    answer: 'The mortgage must be discharged (paid off) at or before transfer. The bank holding the mortgage will not release the land unless the loan is fully paid. If the seller has a mortgage, the purchase money is typically held in escrow and released to the bank to clear the mortgage first, then to the seller. Always check for mortgages before buying.'
  },
  {
    question: 'What documents do I need to transfer land?',
    answer: 'Essential documents include: original or certified title deed, sale agreement signed by both parties, transfer forms completed and witnessed, property valuation, stamp duty receipt, land registry search certificate, consent from co-owners (if applicable), rates and land rent clearance certificates, surveyor report, buyer and seller national IDs, lawyer\'s undertaking. Additional documents may be required depending on the specific property or circumstances.'
  },
  {
    question: 'What happens if I do not get title deed after paying for land?',
    answer: 'If transfer documents are lodged at the registry and payment is complete but title deed is delayed, first follow up with the lawyer and registry office. If there are errors in documents, the registry returns them for correction. If the registry is slow, you can request status and expedite if possible. If seller refuses to transfer after payment, you can take legal action for specific performance. Always have a lawyer protect your interests.'
  },
  {
    question: 'Is it possible to transfer land to a company?',
    answer: 'Yes, land can be transferred to a company. The company must be registered with the Registrar of Companies and have a tax PIN. The title deed will be in the company\'s name. Additional requirements include: company registration certificate, director ID, company seal, board resolution authorizing the purchase, and tax compliance certificate. A lawyer familiar with corporate land purchases should handle this.'
  },
  {
    question: 'Can I gift land to a family member?',
    answer: 'Yes, land can be gifted to a family member. A gift transfer still requires: written gift deed, stamp duty payment (2% based on property value or professional valuation if no price), registry transfer forms, all verification documents, and property search. While it is a gift, stamp duty is still mandatory. Many people use gift transfers for inheritance planning or family arrangements.'
  },
  {
    question: 'What if the seller refuses to sign transfer documents?',
    answer: 'If the seller refuses to sign after receiving payment, you can pursue legal action. This is called "specific performance" - you ask the court to force the seller to complete the transfer. Evidence of payment and agreement (sale agreement) is crucial. Do not pay in cash - always use bank transfer or lawyer escrow so you have proof of payment. A lawyer can advise on legal remedies quickly.'
  },
  {
    question: 'Can land be transferred if the owner has died?',
    answer: 'No. Land cannot be transferred from a deceased owner. Instead, the land must go through succession/probate. The heir must first obtain a grant of probate (with a will) or letters of administration (without a will) from the High Court. Only after obtaining these documents can the heir transfer the land to themselves or sell it. This is a separate legal process from regular land transfer.'
  },
  {
    question: 'What is the role of the lawyer in land transfer?',
    answer: 'The lawyer (also called conveyancer) is essential for land transfer. They: conduct property searches at the registry, prepare the sale agreement, ensure all legal requirements are met, calculate and arrange stamp duty payment, prepare transfer forms, ensure proper documentation, lodge documents at the registry, follow up until new title deed is issued, and provide legal advice throughout. Lawyer fees are typically 1-5% of the property value.'
  }
];

const LandTransferProcessKenya = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    document.title = 'Land Transfer Process in Kenya - Complete Step-by-Step Guide 2026';

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Step-by-step guide to land transfer process in Kenya. Learn stamp duty, title transfer requirements, Land Control Board consent, costs, and timelines. Updated 2026.'
      );
    }

    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute(
      'content',
      'land transfer process Kenya, how to transfer land in Kenya, title deed transfer Kenya, land transfer fees Kenya, stamp duty land Kenya, land control board consent, documents required for land transfer, property transfer procedure Kenya, how long does land transfer take, register land after purchase'
    );

    // Canonical tag
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.href);

    // OpenGraph tags
    const ogTags = [
      { property: 'og:title', content: 'Land Transfer Process in Kenya - Complete Guide' },
      { property: 'og:description', content: 'Step-by-step guide to land and property transfer in Kenya. Learn requirements, costs, stamp duty, and timelines.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: window.location.href }
    ];

    ogTags.forEach(tag => {
      let metaTag = document.querySelector(`meta[property="${tag.property}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', tag.property);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', tag.content);
    });

    // Twitter tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Land Transfer Process in Kenya' },
      { name: 'twitter:description', content: 'Complete guide to land transfer, title deed transfer, and property registration in Kenya.' }
    ];

    twitterTags.forEach(tag => {
      let metaTag = document.querySelector(`meta[name="${tag.name}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', tag.name);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', tag.content);
    });

    // Robots meta
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute('content', 'index, follow');

    // JSON-LD Structured Data
    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': window.location.href,
          name: 'Land Transfer Process in Kenya – Step-by-Step Guide',
          description: 'Complete guide to land transfer procedures, stamp duty, and registration in Kenya',
          inLanguage: 'en-KE'
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: window.location.origin
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Land Law',
              item: `${window.location.origin}/land-law`
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: 'Land Transfer Process',
              item: window.location.href
            }
          ]
        },
        {
          '@type': 'HowTo',
          name: 'How to Transfer Land in Kenya',
          description: 'Step-by-step process for transferring land ownership including all legal requirements',
          step: [
            {
              '@type': 'HowToStep',
              name: 'Prepare Sale Agreement',
              text: 'Draft and sign sale agreement with buyer/seller terms'
            },
            {
              '@type': 'HowToStep',
              name: 'Conduct Property Search',
              text: 'Verify ownership and restrictions at Lands Registry'
            },
            {
              '@type': 'HowToStep',
              name: 'Obtain Land Control Board Consent',
              text: 'If required for property size or transfer type'
            },
            {
              '@type': 'HowToStep',
              name: 'Get Property Valuation',
              text: 'Professional valuation for stamp duty calculation'
            },
            {
              '@type': 'HowToStep',
              name: 'Pay Stamp Duty',
              text: 'Pay 2% stamp duty to Kenya Revenue Authority'
            },
            {
              '@type': 'HowToStep',
              name: 'Sign Transfer Documents',
              text: 'Complete and sign all transfer forms with witnesses'
            },
            {
              '@type': 'HowToStep',
              name: 'Lodge at Lands Registry',
              text: 'Submit all documents to county Lands Registry office'
            },
            {
              '@type': 'HowToStep',
              name: 'Receive New Title Deed',
              text: 'Collect new title deed after registry processing'
            }
          ]
        },
        {
          '@type': 'FAQPage',
          mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer
            }
          }))
        },
        {
          '@type': 'LegalService',
          name: 'Land Transfer Services',
          description: 'Professional guidance and legal services for land transfer in Kenya',
          areaServed: 'KE',
          serviceType: 'Land Transfer'
        }
      ]
    };

    let scriptTag = document.querySelector('script[type="application/ld+json"]');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);

    window.scrollTo(0, 0);
    setTimeout(() => setIsVisible(true), 100);

    // Intersection Observer for active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const tableOfContents = [
    { id: 'what-is-transfer', title: 'What is Transfer' },
    { id: 'when-required', title: 'When Required' },
    { id: 'legal-framework', title: 'Legal Framework' },
    { id: 'step-by-step', title: 'Step-by-Step Process' },
    { id: 'documents-checklist', title: 'Documents Checklist' },
    { id: 'fees-costs', title: 'Fees & Costs' },
    { id: 'how-long', title: 'How Long?' },
    { id: 'common-mistakes', title: 'Common Mistakes' },
    { id: 'special-cases', title: 'Special Cases' },
    { id: 'roles-professionals', title: 'Professional Roles' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
      {/* Breadcrumb */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 py-2 sm:py-3 px-2 sm:px-4 md:px-8 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-0">
          <ol className="flex items-center space-x-2 text-sm flex-wrap">
            <li>
              <Link to="/" className="text-amber-600 hover:text-amber-800 flex items-center transition-colors duration-200">
                <Home className="w-4 h-4 mr-1" /> Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link to="/land-ownership-title-deed-verification-kenya" className="text-amber-600 hover:text-amber-800 transition-colors duration-200">
                Land Law
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-700 font-medium">Land Transfer Process</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative bg-gradient-to-r from-amber-700 via-orange-600 to-red-600 text-white py-12 sm:py-20 px-3 sm:px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className={`max-w-7xl mx-auto relative z-10 transition-all duration-1000 px-0 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center mb-6">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl mr-4 shadow-xl">
              <ArrowRight className="w-12 h-12" />
            </div>
            <div>
              <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-amber-100">
                Land Transfer Process in Kenya
              </h1>
              <p className="text-lg md:text-xl opacity-90 mt-2">Complete Step-by-Step Title Transfer Guide</p>
            </div>
          </div>
          <p className="text-xl md:text-2xl opacity-95 max-w-4xl leading-relaxed mb-6">
            Complete guide to transferring land ownership in Kenya. Learn stamp duty, title transfer procedures, required documents, Land Control Board consent, costs, timelines, and all government requirements. <span className="font-semibold text-amber-200">Updated 2026.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`https://wa.me/254112810203?text=${encodeURIComponent('Hello! I need help with land transfer process in Kenya. Please guide me through the steps.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 text-sm sm:text-base"
              aria-label="Get land transfer assistance on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              WhatsApp Guidance
            </a>
            <a
              href={`mailto:johnsonthuraniramwangi@gmail.com?subject=${encodeURIComponent('Land Transfer Process Assistance')}&body=${encodeURIComponent('Hello,\n\nI need professional assistance with land transfer in Kenya.\n\nPlease contact me to discuss:\n- Land transfer procedures\n- Stamp duty and costs\n- Title deed transfer requirements\n\nThank you.')}`}
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl border border-white/30 shadow-lg transition-all duration-300 hover:scale-105 text-sm sm:text-base"
              aria-label="Email for land transfer assistance"
            >
              <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
              Email Inquiry
            </a>
          </div>
        </div>
      </header>

      {/* Table of Contents - Sticky */}
      <div className="bg-white border-b border-gray-200 sticky top-14 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            <BookOpen className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <span className="text-sm font-semibold text-gray-700 flex-shrink-0">Quick Jump:</span>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
              {tableOfContents.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`text-xs px-3 py-1 rounded-full whitespace-nowrap transition-all duration-200 ${
                    activeSection === item.id
                      ? 'bg-amber-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-amber-100'
                  }`}
                >
                  {item.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-8 sm:py-12">
        
        {/* Section 1: What is Land Transfer */}
        <section id="what-is-transfer" className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200">
            <div className="flex items-start mb-6">
              <div className="bg-amber-100 p-3 rounded-xl mr-4">
                <FileCheck className="w-8 h-8 text-amber-600" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">What is Land Transfer?</h2>
                <p className="text-gray-600">Understanding property ownership change</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Land transfer (also called "land conveyancing" or "property transfer") is the legal process of changing ownership of land from one person (the seller) to another person (the buyer) in Kenya. When a land transfer is complete, a new title deed is issued by the Lands Registry showing the buyer as the new legal owner.
              </p>

              <p className="text-gray-700 leading-relaxed mb-6">
                Land transfer is not automatic when money changes hands. It is a formal legal and administrative process governed by the <strong>Land Act 2012</strong> and <strong>Land Registration Act 2012</strong>. The transfer is only complete when the Lands Registry issues a new title deed in the buyer's name and removes the seller's name from the old title deed.
              </p>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-xl text-amber-900 mb-4">Key Points About Land Transfer</h3>
                
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                      <CheckCircle2 className="w-5 h-5 text-amber-600 mr-2" />
                      It is a formal government process
                    </h4>
                    <p className="text-gray-700 text-sm">Land transfer involves the Ministry of Lands, Lands Registry offices, and Kenya Revenue Authority (KRA). It is not just a private sale between buyer and seller.</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                      <CheckCircle2 className="w-5 h-5 text-amber-600 mr-2" />
                      Government fees and taxes are mandatory
                    </h4>
                    <p className="text-gray-700 text-sm">Stamp duty (2% of value) must be paid to KRA. Registry fees must be paid. These are not optional - without them, the registry will not process the transfer.</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                      <CheckCircle2 className="w-5 h-5 text-amber-600 mr-2" />
                      It takes time - typically 2-6 months
                    </h4>
                    <p className="text-gray-700 text-sm">Land transfer is not instant. The process involves multiple steps and approvals. The registry processing phase alone can take 1-3 months depending on the county.</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                      <CheckCircle2 className="w-5 h-5 text-amber-600 mr-2" />
                      You need a lawyer to do it correctly
                    </h4>
                    <p className="text-gray-700 text-sm">While not legally required, a lawyer (conveyancer) is strongly recommended. They ensure all procedures are followed correctly and protect your interests.</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                      <CheckCircle2 className="w-5 h-5 text-amber-600 mr-2" />
                      Land Control Board approval may be needed
                    </h4>
                    <p className="text-gray-700 text-sm">For agricultural land over 5 acres or certain transfer types, you must get approval from the County Land Control Board. This adds 2-4 weeks to the process.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: When is Land Transfer Required */}
        <section id="when-required" className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200">
            <div className="flex items-start mb-6">
              <div className="bg-orange-100 p-3 rounded-xl mr-4">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">When is Land Transfer Required?</h2>
                <p className="text-gray-600">Situations requiring title deed change</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                Land transfer is required whenever ownership of land changes from one party to another. Here are the common situations:
              </p>

              <div className="space-y-4 mb-6">
                <div className="bg-orange-50 border-l-4 border-orange-600 p-5 rounded-r-lg">
                  <h3 className="font-bold text-lg text-orange-900 mb-2">1. Buying/Selling Land</h3>
                  <p className="text-gray-700 text-sm">
                    When you buy land from someone, you must transfer the title deed to your name. This is the most common reason for land transfer. The seller's name is removed from the title and yours is added.
                  </p>
                </div>

                <div className="bg-orange-50 border-l-4 border-orange-600 p-5 rounded-r-lg">
                  <h3 className="font-bold text-lg text-orange-900 mb-2">2. Gifting Land to Family</h3>
                  <p className="text-gray-700 text-sm">
                    A parent can gift land to a child or a spouse can gift land to a spouse. A formal gift deed and transfer is required even though no money changes hands. Stamp duty is still payable based on property valuation.
                  </p>
                </div>

                <div className="bg-orange-50 border-l-4 border-orange-600 p-5 rounded-r-lg">
                  <h3 className="font-bold text-lg text-orange-900 mb-2">3. Land Inheritance/Succession</h3>
                  <p className="text-gray-700 text-sm">
                    After someone dies, their heirs must transfer the inherited land to their names. This requires probate/letters of administration first, then a separate land transfer from the estate to the beneficiaries.
                  </p>
                </div>

                <div className="bg-orange-50 border-l-4 border-orange-600 p-5 rounded-r-lg">
                  <h3 className="font-bold text-lg text-orange-900 mb-2">4. Addition/Removal of Co-Owner Name</h3>
                  <p className="text-gray-700 text-sm">
                    When married, a spouse can be added to the title deed. Similarly, names can be removed during divorce or separation. This requires a transfer document and registry approval.
                  </p>
                </div>

                <div className="bg-orange-50 border-l-4 border-orange-600 p-5 rounded-r-lg">
                  <h3 className="font-bold text-lg text-orange-900 mb-2">5. Company Purchase/Sale</h3>
                  <p className="text-gray-700 text-sm">
                    When a company buys land, or a company that owns land is sold, the land title must be transferred. This requires company documents and compliance certificates.
                  </p>
                </div>

                <div className="bg-orange-50 border-l-4 border-orange-600 p-5 rounded-r-lg">
                  <h3 className="font-bold text-lg text-orange-900 mb-2">6. Land Subdivision</h3>
                  <p className="text-gray-700 text-sm">
                    When one parcel of land is divided into multiple parcels, new titles must be issued for each subdivision. This requires surveyor approval and separate registrations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Legal Framework */}
        <section id="legal-framework" className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200">
            <div className="flex items-start mb-6">
              <div className="bg-red-100 p-3 rounded-xl mr-4">
                <Landmark className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Legal Framework Governing Land Transfer</h2>
                <p className="text-gray-600">Kenya's land transfer laws</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                Land transfer in Kenya is governed by several key laws and government agencies:
              </p>

              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-xl text-red-900 mb-4">Key Legislation</h3>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-5 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-2">Constitution of Kenya 2010</h4>
                    <p className="text-gray-700 text-sm">Establishes that land ownership is protected and regulates government's role in land matters. Chapter 5 addresses land and property rights.</p>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-2">Land Act 2012</h4>
                    <p className="text-gray-700 text-sm">Defines rights and duties of landowners, regulates transfer of land, and established the Land Control Board for transfers requiring approval (agricultural land over 5 acres).</p>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-2">Land Registration Act 2012</h4>
                    <p className="text-gray-700 text-sm">Governs how land is registered and transferred. Requires all land transfers to be registered at the Lands Registry. Specifies forms, procedures, and requirements for transfer registration.</p>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-2">Stamp Duty Act</h4>
                    <p className="text-gray-700 text-sm">Defines stamp duty on land transfers (2% of property value). Requires stamp duty payment before registry will process any transfer.</p>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-2">Law of Contract Act</h4>
                    <p className="text-gray-700 text-sm">Governs sale agreements between buyer and seller. Requires sale agreement to be in writing and legally binding on both parties.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
                <h3 className="font-bold text-xl text-red-900 mb-4">Key Government Agencies</h3>
                
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-1">Ministry of Lands</h4>
                    <p className="text-gray-700 text-sm">National government agency overseeing land policy and Lands Registry operations.</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-1">County Lands Registry Office</h4>
                    <p className="text-gray-700 text-sm">Where land transfers are actually registered. Each county has its own registry office processing transfers for land in that county.</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-1">County Land Control Board</h4>
                    <p className="text-gray-700 text-sm">Reviews certain land transfers (typically agricultural land over 5 acres) to ensure they serve public interest. Grants or denies consent for these transfers.</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-1">Kenya Revenue Authority (KRA)</h4>
                    <p className="text-gray-700 text-sm">Collects stamp duty on all land transfers. Must receive payment before registry processes transfer. Issues stamp duty certificates.</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-1">County Government</h4>
                    <p className="text-gray-700 text-sm">Issues rates clearance certificates proving no property tax arrears. Collects property tax (rating) on registered land.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Step-by-Step Process */}
        <section id="step-by-step" className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200">
            <div className="flex items-start mb-6">
              <div className="bg-purple-100 p-3 rounded-xl mr-4">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Step-by-Step Land Transfer Process</h2>
                <p className="text-gray-600">Complete procedure from sale to new title deed</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                Land transfer involves multiple sequential steps. Each must be completed before moving to the next:
              </p>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 mb-6">
                <div className="space-y-6">
                  <div className="bg-white rounded-lg p-5 shadow-sm border-l-4 border-purple-500">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-bold mr-3 text-sm">1</span>
                      Sale Agreement (Week 1-2)
                    </h4>
                    <p className="text-gray-700 text-sm mb-2">Buyer and seller negotiate and sign a written sale agreement. This legally binds both parties. Agreement should specify: purchase price, payment terms, property details, conditions, and completion timeline.</p>
                    <p className="text-gray-600 text-xs"><strong>Important:</strong> Payment should not be made until all verifications are complete. Typically payment is due at signing (first installment) with balance due on completion.</p>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm border-l-4 border-blue-500">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold mr-3 text-sm">2</span>
                      Due Diligence & Land Search (Week 1-3)
                    </h4>
                    <p className="text-gray-700 text-sm mb-2">Buyer's lawyer conducts official search at Lands Registry to verify: seller is registered owner, property description matches, no other restrictions or claims (mortgages, caveats, etc.), property is free to transfer.</p>
                    <p className="text-gray-600 text-xs"><strong>Cost:</strong> KES 500-2,000 for search. Takes 1-3 days to 1 week depending on county.</p>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm border-l-4 border-green-500">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 font-bold mr-3 text-sm">3</span>
                      Land Control Board Consent (Week 2-4 if required)
                    </h4>
                    <p className="text-gray-700 text-sm mb-2">If the land is agricultural and exceeds 5 acres, OR if it is customary land, you must apply for County Land Control Board consent. Application includes: description of land, buyer details, purpose of transfer, board approval takes 2-4 weeks.</p>
                    <p className="text-gray-600 text-xs"><strong>Note:</strong> Urban residential plots typically do not require this approval. Your lawyer will advise if needed.</p>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm border-l-4 border-orange-500">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold mr-3 text-sm">4</span>
                      Property Valuation (Week 1-2)
                    </h4>
                    <p className="text-gray-700 text-sm mb-2">A registered property valuer assesses the market value of the property. Valuation is required for: calculating stamp duty, mortgage approval, determining fair price, providing proof of value.</p>
                    <p className="text-gray-600 text-xs"><strong>Cost:</strong> KES 10,000-50,000 depending on property size and location. Takes 1-2 weeks.</p>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm border-l-4 border-red-500">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 font-bold mr-3 text-sm">5</span>
                      Stamp Duty Payment (Day 1)
                    </h4>
                    <p className="text-gray-700 text-sm mb-2">Buyer must pay stamp duty to Kenya Revenue Authority (KRA). Amount = 2% of property value (based on valuation or sale price, whichever is higher). Payment is made at KRA office - takes 1-2 days. Receipt is mandatory for registry.</p>
                    <p className="text-gray-600 text-xs"><strong>Example:</strong> KES 5M property = KES 100,000 stamp duty. Without this receipt, registry will reject the transfer.</p>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm border-l-4 border-indigo-500">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold mr-3 text-sm">6</span>
                      Transfer Deeds Preparation & Signing (Week 1)
                    </h4>
                    <p className="text-gray-700 text-sm mb-2">Lawyer prepares official transfer deed document. Both buyer and seller sign the transfer deed IN FRONT OF A WITNESS (typically lawyer or Commissioner of Oaths). All signatures must be witnessed. Transfer deed transfers ownership from seller to buyer.</p>
                    <p className="text-gray-600 text-xs"><strong>Important:</strong> Buyer and seller should sign in person if possible. Sellers outside Kenya need Power of Attorney.</p>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm border-l-4 border-teal-500">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 text-teal-600 font-bold mr-3 text-sm">7</span>
                      Lodge Documents at Lands Registry (Day 1-2)
                    </h4>
                    <p className="text-gray-700 text-sm mb-2">Lawyer submits all completed documents to the county Lands Registry office. Documents include: original/certified title deed, transfer deed, sale agreement, stamp duty receipt, property search, valuations, Land Control Board consent (if applicable), rates clearance, and other supporting documents.</p>
                    <p className="text-gray-600 text-xs"><strong>Processing:</strong> Registry checks completeness. If all is correct, transfer enters processing queue. Processing typically takes 4-8 weeks depending on county.</p>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm border-l-4 border-cyan-500">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-100 text-cyan-600 font-bold mr-3 text-sm">8</span>
                      Collect New Title Deed (Week 4-8)
                    </h4>
                    <p className="text-gray-700 text-sm mb-2">After registry processing is complete, new title deed is issued showing buyer as the legal owner. Seller's name is removed. Buyer collects the new title deed from the registry office. You are now the legal owner.</p>
                    <p className="text-gray-600 text-xs"><strong>Final Step:</strong> Once you have the new title deed in your name, the transfer is complete. Verify your name, property description, and boundaries are correct.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Documents Checklist */}
        <section id="documents-checklist" className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200">
            <div className="flex items-start mb-6">
              <div className="bg-blue-100 p-3 rounded-xl mr-4">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Required Documents Checklist</h2>
                <p className="text-gray-600">Essential paperwork for land transfer</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                The Lands Registry will not process your transfer without complete documentation. Ensure you have all these documents before lodging:
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-blue-300">
                      <th className="text-left p-3 font-bold text-blue-900">Document</th>
                      <th className="text-left p-3 font-bold text-blue-900">Number of Copies</th>
                      <th className="text-left p-3 font-bold text-blue-900">Provided By</th>
                      <th className="text-left p-3 font-bold text-blue-900">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    <tr className="border-b border-blue-100">
                      <td className="p-3"><strong>Original/Certified Title Deed</strong></td>
                      <td className="p-3">Original + 3 copies</td>
                      <td className="p-3">Seller</td>
                      <td className="p-3 text-xs">Most critical document. Must match owner exactly.</td>
                    </tr>
                    <tr className="border-b border-blue-100">
                      <td className="p-3"><strong>Transfer Deed</strong></td>
                      <td className="p-3">Original + 2 copies</td>
                      <td className="p-3">Lawyer prepares</td>
                      <td className="p-3 text-xs">Signed by both buyer and seller with witnesses</td>
                    </tr>
                    <tr className="border-b border-blue-100">
                      <td className="p-3"><strong>Sale Agreement</strong></td>
                      <td className="p-3">2 copies</td>
                      <td className="p-3">Lawyer prepares</td>
                      <td className="p-3 text-xs">Signed by both parties proving agreement</td>
                    </tr>
                    <tr className="border-b border-blue-100">
                      <td className="p-3"><strong>Stamp Duty Receipt</strong></td>
                      <td className="p-3">1 copy</td>
                      <td className="p-3">KRA</td>
                      <td className="p-3 text-xs">Proof of 2% stamp duty payment. Registry won't process without it.</td>
                    </tr>
                    <tr className="border-b border-blue-100">
                      <td className="p-3"><strong>Property Valuation Report</strong></td>
                      <td className="p-3">2 copies</td>
                      <td className="p-3">Licensed Valuer</td>
                      <td className="p-3 text-xs">Used for stamp duty calculation and verification</td>
                    </tr>
                    <tr className="border-b border-blue-100">
                      <td className="p-3"><strong>Land Registry Search Certificate</strong></td>
                      <td className="p-3">1 copy</td>
                      <td className="p-3">Lands Registry</td>
                      <td className="p-3 text-xs">Confirms seller is registered owner and property status</td>
                    </tr>
                    <tr className="border-b border-blue-100">
                      <td className="p-3"><strong>Rates Clearance Certificate</strong></td>
                      <td className="p-3">1 copy</td>
                      <td className="p-3">County Government</td>
                      <td className="p-3 text-xs">Proof no property tax arrears owed</td>
                    </tr>
                    <tr className="border-b border-blue-100">
                      <td className="p-3"><strong>Land Rent Clearance</strong></td>
                      <td className="p-3">1 copy</td>
                      <td className="p-3">Lands Registry</td>
                      <td className="p-3 text-xs">For leasehold land only. Proof of paid rent.</td>
                    </tr>
                    <tr className="border-b border-blue-100">
                      <td className="p-3"><strong>Buyer's National ID</strong></td>
                      <td className="p-3">2 copies (certified)</td>
                      <td className="p-3">Buyer</td>
                      <td className="p-3 text-xs">Proof of buyer's identity</td>
                    </tr>
                    <tr className="border-b border-blue-100">
                      <td className="p-3"><strong>Seller's National ID</strong></td>
                      <td className="p-3">2 copies (certified)</td>
                      <td className="p-3">Seller</td>
                      <td className="p-3 text-xs">Must match name on title deed exactly</td>
                    </tr>
                    <tr className="border-b border-blue-100">
                      <td className="p-3"><strong>Land Control Board Consent</strong></td>
                      <td className="p-3">1 copy</td>
                      <td className="p-3">County Land Control Board</td>
                      <td className="p-3 text-xs">ONLY if required (agricultural land over 5 acres)</td>
                    </tr>
                    <tr className="border-b border-blue-100">
                      <td className="p-3"><strong>Co-owner Consent</strong></td>
                      <td className="p-3">1 copy</td>
                      <td className="p-3">All co-owners</td>
                      <td className="p-3 text-xs">If land is owned by multiple people, all must sign consent</td>
                    </tr>
                    <tr>
                      <td className="p-3"><strong>Power of Attorney</strong></td>
                      <td className="p-3">1 copy</td>
                      <td className="p-3">Seller (if outside Kenya)</td>
                      <td className="p-3 text-xs">If seller cannot sign personally. Must be notarized.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded-r-lg">
                <h3 className="font-bold text-lg text-yellow-900 mb-3">Document Preparation Tips</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Get <strong>certified copies</strong> of all documents from appropriate offices</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Ensure all names on documents match <strong>exactly</strong> (spelling matters)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>All signatures must be <strong>witnessed</strong> by a lawyer or Commissioner of Oaths</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Keep <strong>original documents safe</strong> - do not submit originals except title deed</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Prepare documents well in advance - don't rush at the last minute</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Fees & Costs */}
        <section id="fees-costs" className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200">
            <div className="flex items-start mb-6">
              <div className="bg-green-100 p-3 rounded-xl mr-4">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Land Transfer Fees & Costs Breakdown</h2>
                <p className="text-gray-600">Complete cost analysis</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                The buyer typically bears most land transfer costs. Here is a complete breakdown:
              </p>

              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-xl text-green-900 mb-4">Major Cost Components</h3>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-5 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-gray-900">1. Stamp Duty</h4>
                      <span className="text-lg font-bold text-green-600">2% of property value</span>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">Mandatory government tax paid to Kenya Revenue Authority. This is the single largest cost.</p>
                    <p className="text-gray-600 text-xs"><strong>Example:</strong> KES 5M property = KES 100,000</p>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-gray-900">2. Registry Transfer Fees</h4>
                      <span className="text-lg font-bold text-green-600">1-2% of property value</span>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">Paid to Lands Registry for processing and issuing new title deed.</p>
                    <p className="text-gray-600 text-xs"><strong>Example:</strong> KES 5M property = KES 50,000 - 100,000</p>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-gray-900">3. Lawyer Fees</h4>
                      <span className="text-lg font-bold text-green-600">1-5% of property value</span>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">Professional conveyancing services: drafting agreements, conducting searches, preparing transfer forms, lodging at registry, follow-up. Highly recommended.</p>
                    <p className="text-gray-600 text-xs"><strong>Typical:</strong> KES 50,000 - 250,000</p>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-gray-900">4. Property Valuation</h4>
                      <span className="text-lg font-bold text-green-600">KES 10,000 - 50,000</span>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">Professional valuer assesses market value. Required for stamp duty calculation and mortgage approval.</p>
                    <p className="text-gray-600 text-xs"><strong>Cost varies:</strong> Based on property size and location</p>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-gray-900">5. Land Registry Search</h4>
                      <span className="text-lg font-bold text-green-600">KES 500 - 2,000</span>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">Official search to confirm ownership and identify restrictions. Essential to prevent fraud.</p>
                    <p className="text-gray-600 text-xs"><strong>Cost:</strong> Varies by county and document requested</p>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-gray-900">6. Surveyor Fees</h4>
                      <span className="text-lg font-bold text-green-600">KES 10,000 - 50,000</span>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">Licensed surveyor verifies boundaries and measures land. Recommended to prevent boundary disputes.</p>
                    <p className="text-gray-600 text-xs"><strong>Cost varies:</strong> Based on land size and complexity</p>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-gray-900">7. Clearance Certificates</h4>
                      <span className="text-lg font-bold text-green-600">KES 5,000 - 20,000</span>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">Rates clearance and land rent clearance from government offices.</p>
                    <p className="text-gray-600 text-xs"><strong>Cost:</strong> Minimal but mandatory</p>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-gray-900">8. Miscellaneous</h4>
                      <span className="text-lg font-bold text-green-600">KES 10,000 - 30,000</span>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">Document photocopying, courier services, travel, affidavits, bank transfers, etc.</p>
                    <p className="text-gray-600 text-xs"><strong>Varies:</strong> Depends on circumstances</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 mb-6">
                <h3 className="font-bold text-xl text-green-900 mb-4">Total Cost Estimation</h3>
                
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-gray-900">Property Value</span>
                      <span className="font-bold text-gray-900">KES 1,000,000</span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-700 pt-3 border-t border-gray-200">
                      <div className="flex justify-between">
                        <span>Stamp Duty (2%)</span>
                        <span>KES 20,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Registry Fees (1.5%)</span>
                        <span>KES 15,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Lawyer Fees</span>
                        <span>KES 50,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Valuation + Search + Survey</span>
                        <span>KES 40,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Other Costs</span>
                        <span>KES 15,000</span>
                      </div>
                      <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-200">
                        <span>Total Transfer Costs</span>
                        <span>KES 140,000</span>
                      </div>
                      <div className="text-xs text-gray-600 mt-2">
                        <strong>% of property value:</strong> 14% (this is reasonable for a smaller property)
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-gray-900">Property Value</span>
                      <span className="font-bold text-gray-900">KES 10,000,000</span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-700 pt-3 border-t border-gray-200">
                      <div className="flex justify-between">
                        <span>Stamp Duty (2%)</span>
                        <span>KES 200,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Registry Fees (1.5%)</span>
                        <span>KES 150,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Lawyer Fees</span>
                        <span>KES 100,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Valuation + Search + Survey</span>
                        <span>KES 70,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Other Costs</span>
                        <span>KES 30,000</span>
                      </div>
                      <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-200">
                        <span>Total Transfer Costs</span>
                        <span>KES 550,000</span>
                      </div>
                      <div className="text-xs text-gray-600 mt-2">
                        <strong>% of property value:</strong> 5.5% (typical percentage for larger properties)
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded-r-lg">
                <h3 className="font-bold text-lg text-yellow-900 mb-3">Cost Reduction Tips</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Get multiple valuation quotes</strong> - valuations can vary, shop around</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Compare lawyer fees</strong> - rates vary, negotiate if possible</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Use online land search first</strong> - cheaper than registry search initially</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Do not skip stamp duty</strong> - it is non-negotiable and mandatory</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 7: How Long Does Transfer Take */}
        <section id="how-long" className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200">
            <div className="flex items-start mb-6">
              <div className="bg-cyan-100 p-3 rounded-xl mr-4">
                <Clock className="w-8 h-8 text-cyan-600" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">How Long Does Land Transfer Take?</h2>
                <p className="text-gray-600">Timeline and processing delays</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                Land transfer is not instant. The total timeline from sale agreement to receiving the new title deed typically ranges from 8 weeks to 6 months:
              </p>

              <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-xl text-cyan-900 mb-4">Detailed Timeline Breakdown</h3>
                
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4 shadow-sm flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-gray-900">Sale Agreement Preparation</h4>
                      <p className="text-gray-600 text-sm">Draft, review, sign</p>
                    </div>
                    <span className="bg-cyan-100 text-cyan-900 font-bold px-3 py-1 rounded-full whitespace-nowrap">1-2 weeks</span>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-gray-900">Due Diligence & Searches</h4>
                      <p className="text-gray-600 text-sm">Property search, verification, title check</p>
                    </div>
                    <span className="bg-cyan-100 text-cyan-900 font-bold px-3 py-1 rounded-full whitespace-nowrap">1-3 weeks</span>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-gray-900">Land Control Board (if required)</h4>
                      <p className="text-gray-600 text-sm">Application and approval</p>
                    </div>
                    <span className="bg-cyan-100 text-cyan-900 font-bold px-3 py-1 rounded-full whitespace-nowrap">2-4 weeks</span>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-gray-900">Valuation</h4>
                      <p className="text-gray-600 text-sm">Property assessment for stamp duty</p>
                    </div>
                    <span className="bg-cyan-100 text-cyan-900 font-bold px-3 py-1 rounded-full whitespace-nowrap">1-2 weeks</span>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-gray-900">Stamp Duty Payment</h4>
                      <p className="text-gray-600 text-sm">KRA payment and receipt</p>
                    </div>
                    <span className="bg-cyan-100 text-cyan-900 font-bold px-3 py-1 rounded-full whitespace-nowrap">1-2 days</span>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-gray-900">Transfer Forms Preparation</h4>
                      <p className="text-gray-600 text-sm">Drafting and signing with witnesses</p>
                    </div>
                    <span className="bg-cyan-100 text-cyan-900 font-bold px-3 py-1 rounded-full whitespace-nowrap">3-7 days</span>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-gray-900">Lodging at Registry</h4>
                      <p className="text-gray-600 text-sm">Submitting all documents</p>
                    </div>
                    <span className="bg-cyan-100 text-cyan-900 font-bold px-3 py-1 rounded-full whitespace-nowrap">1 day</span>
                  </div>

                  <div className="bg-gradient-to-r from-cyan-100 to-blue-100 rounded-lg p-4 shadow-sm flex justify-between items-center border-2 border-cyan-400">
                    <div>
                      <h4 className="font-bold text-cyan-900">Registry Processing (LONGEST PHASE)</h4>
                      <p className="text-cyan-700 text-sm font-semibold">This is where most delays occur</p>
                    </div>
                    <span className="bg-cyan-600 text-white font-bold px-3 py-1 rounded-full whitespace-nowrap text-sm">4-8 weeks</span>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-gray-900">New Title Collection</h4>
                      <p className="text-gray-600 text-sm">Collect from registry office</p>
                    </div>
                    <span className="bg-cyan-100 text-cyan-900 font-bold px-3 py-1 rounded-full whitespace-nowrap">1 day</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-cyan-300">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-lg text-cyan-900">TOTAL TIMELINE:</span>
                    <span className="text-2xl font-bold text-cyan-600">8-12 weeks (2-3 months) average</span>
                  </div>
                  <p className="text-gray-700 text-sm">
                    <strong>Ranges:</strong> Fast counties = 4-6 weeks • Average counties = 8-12 weeks • Slow counties = 12-24 weeks
                  </p>
                </div>
              </div>

              <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-lg">
                <h3 className="font-bold text-lg text-red-900 mb-3">What Causes Delays?</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start">
                    <AlertTriangle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Registry backlog</strong> - too many transfers, staff shortages</span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Incomplete documents</strong> - missing signatures, wrong forms, missing certifications</span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>System issues</strong> - land registry computer systems down, old paper-based system</span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Additional requests</strong> - registry requests more documents or information</span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Land Control Board delays</strong> - if approval is required</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 8: Common Mistakes */}
        <section id="common-mistakes" className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200">
            <div className="flex items-start mb-6">
              <div className="bg-red-100 p-3 rounded-xl mr-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Common Mistakes That Delay Land Transfers</h2>
                <p className="text-gray-600">How to avoid problems</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                Many land transfers experience delays due to preventable mistakes. Avoid these common errors:
              </p>

              <div className="space-y-4 mb-6">
                <div className="bg-red-50 border-l-4 border-red-600 p-5 rounded-r-lg">
                  <h3 className="font-bold text-lg text-red-900 mb-2">Mistake 1: Incomplete or Incorrect Documents</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    <strong>Problem:</strong> Missing signatures, wrong forms, names that don't match exactly on documents, missing witness signatures.
                  </p>
                  <p className="text-gray-700 text-sm">
                    <strong>Solution:</strong> Have lawyer prepare all documents. Ensure all names match exactly (check national ID). Get all signatures witnessed by lawyer or Commissioner of Oaths. Submit complete documents.
                  </p>
                </div>

                <div className="bg-red-50 border-l-4 border-red-600 p-5 rounded-r-lg">
                  <h3 className="font-bold text-lg text-red-900 mb-2">Mistake 2: Not Paying Stamp Duty</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    <strong>Problem:</strong> Forgetting to pay stamp duty or delaying payment. Registry will reject the transfer if stamp duty receipt is not included.
                  </p>
                  <p className="text-gray-700 text-sm">
                    <strong>Solution:</strong> Pay stamp duty early. Keep the receipt safely. Provide receipt with transfer documents when lodging at registry.
                  </p>
                </div>

                <div className="bg-red-50 border-l-4 border-red-600 p-5 rounded-r-lg">
                  <h3 className="font-bold text-lg text-red-900 mb-2">Mistake 3: Missing Clearance Certificates</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    <strong>Problem:</strong> Not obtaining rates clearance or land rent clearance. Registry requires these to process transfer.
                  </p>
                  <p className="text-gray-700 text-sm">
                    <strong>Solution:</strong> Get rates clearance from county office and land rent clearance from Lands Registry office BEFORE lodging transfer. Include copies with documents.
                  </p>
                </div>

                <div className="bg-red-50 border-l-4 border-red-600 p-5 rounded-r-lg">
                  <h3 className="font-bold text-lg text-red-900 mb-2">Mistake 4: Seller Not Co-operating</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    <strong>Problem:</strong> Seller refuses to sign transfer documents or provide required documents after taking payment.
                  </p>
                  <p className="text-gray-700 text-sm">
                    <strong>Solution:</strong> Have lawyer hold payment in escrow until seller completes all requirements. Get all seller signatures upfront. Document agreement in writing.
                  </p>
                </div>

                <div className="bg-red-50 border-l-4 border-red-600 p-5 rounded-r-lg">
                  <h3 className="font-bold text-lg text-red-900 mb-2">Mistake 5: Land Control Board Consent Not Obtained</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    <strong>Problem:</strong> For large agricultural land, failing to get Land Control Board consent. Transfer will be rejected.
                  </p>
                  <p className="text-gray-700 text-sm">
                    <strong>Solution:</strong> Ask lawyer if consent is required. Apply early. Include consent with transfer documents.
                  </p>
                </div>

                <div className="bg-red-50 border-l-4 border-red-600 p-5 rounded-r-lg">
                  <h3 className="font-bold text-lg text-red-900 mb-2">Mistake 6: Sending Documents by Mail</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    <strong>Problem:</strong> Documents lost in mail, registry claims they didn't receive papers, no proof of submission.
                  </p>
                  <p className="text-gray-700 text-sm">
                    <strong>Solution:</strong> Have lawyer lodge documents in person at registry. Get dated receipt proving submission. Follow up regularly with registry.
                  </p>
                </div>

                <div className="bg-red-50 border-l-4 border-red-606 p-5 rounded-r-lg">
                  <h3 className="font-bold text-lg text-red-900 mb-2">Mistake 7: Not Using a Lawyer</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    <strong>Problem:</strong> Handling transfer yourself, making legal errors, documents rejected by registry, delays and costs increase.
                  </p>
                  <p className="text-gray-700 text-sm">
                    <strong>Solution:</strong> Hire a qualified lawyer for land transfer. It costs relatively little and prevents expensive mistakes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 9: Special Cases */}
        <section id="special-cases" className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200">
            <div className="flex items-start mb-6">
              <div className="bg-purple-100 p-3 rounded-xl mr-4">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Special Transfer Cases</h2>
                <p className="text-gray-600">Transfers with unique circumstances</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                Some land transfers involve special circumstances requiring different procedures:
              </p>

              <div className="space-y-5 mb-6">
                <div className="bg-purple-50 border-l-4 border-purple-600 p-5 rounded-r-lg">
                  <h3 className="font-bold text-lg text-purple-900 mb-2">Transfer After Death (Inheritance)</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    <strong>Process:</strong> Land cannot be transferred directly. Heirs must first obtain grant of probate (with will) or letters of administration (without will) from High Court. Takes 6-12 months. After obtaining court grant, then apply for land transfer to heirs' names.
                  </p>
                  <p className="text-gray-600 text-xs"><strong>Total Time:</strong> 12-18 months or more</p>
                </div>

                <div className="bg-purple-50 border-l-4 border-purple-600 p-5 rounded-r-lg">
                  <h3 className="font-bold text-lg text-purple-900 mb-2">Gift Transfer</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    <strong>Process:</strong> Gift deed is prepared showing giver and recipient. Stamp duty is still payable (2% based on valuation). Transfer forms completed and lodged at registry. Same procedure as regular sale but no money changes hands.
                  </p>
                  <p className="text-gray-600 text-xs"><strong>Note:</strong> Stamp duty is mandatory even for gifts. Valuation determines the amount.</p>
                </div>

                <div className="bg-purple-50 border-l-4 border-purple-600 p-5 rounded-r-lg">
                  <h3 className="font-bold text-lg text-purple-900 mb-2">Spousal Transfer (Addition/Removal)</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    <strong>Process:</strong> Spouse can be added to title after marriage. Transfer from spouse's name to joint names (or removal) requires written agreement and registry approval. Often done during marriage or divorce/separation.
                  </p>
                  <p className="text-gray-600 text-xs"><strong>Note:</strong> Requires marriage certificate. Stamp duty may apply depending on circumstances.</p>
                </div>

                <div className="bg-purple-50 border-l-4 border-purple-600 p-5 rounded-r-lg">
                  <h3 className="font-bold text-lg text-purple-900 mb-2">Company Land Transfer</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    <strong>Process:</strong> When company buys land, title is in company name. Requires company registration details, director ID, company seal, board resolution approving purchase, tax PIN, and compliance documents. Additional requirements compared to individual transfer.
                  </p>
                  <p className="text-gray-600 text-xs"><strong>Complexity:</strong> Higher - requires corporate documentation and compliance</p>
                </div>

                <div className="bg-purple-50 border-l-4 border-purple-606 p-5 rounded-r-lg">
                  <h3 className="font-bold text-lg text-purple-900 mb-2">Land Subdivision Transfer</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    <strong>Process:</strong> One parcel divided into multiple parcels. Surveyor creates subdivision plan. Each new parcel requires separate title. Separate stamp duty paid for each new plot. Each gets registered as individual property.
                  </p>
                  <p className="text-gray-600 text-xs"><strong>Cost:</strong> Higher than regular transfer - surveyor + multiple registrations</p>
                </div>

                <div className="bg-purple-50 border-l-4 border-purple-606 p-5 rounded-r-lg">
                  <h3 className="font-bold text-lg text-purple-900 mb-2">Transfer of Mortgaged Land</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    <strong>Process:</strong> Mortgage must be discharged (paid off) at or before transfer. Bank will not release land until loan is paid in full. Purchase price typically held in escrow and released to bank to clear mortgage, then to seller.
                  </p>
                  <p className="text-gray-600 text-xs"><strong>Important:</strong> Always check if land has mortgage before buying. Bank consent required for transfer.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 10: Roles of Professionals */}
        <section id="roles-professionals" className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200">
            <div className="flex items-start mb-6">
              <div className="bg-indigo-100 p-3 rounded-xl mr-4">
                <Users className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Role of Lawyers, Surveyors & Land Officers</h2>
                <p className="text-gray-600">Professional guidance in land transfer</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200">
                  <h3 className="font-bold text-lg text-indigo-900 mb-4 flex items-center">
                    <Gavel className="w-5 h-5 mr-2" />
                    Role of Lawyer (Conveyancer)
                  </h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Drafts sale agreement</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Conducts land searches at registry</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Reviews title deed authenticity</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Identifies restrictions/mortgages</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Prepares transfer documents</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Arranges stamp duty payment</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Lodges documents at registry</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Follows up until title received</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Cost: 1-5% of property value</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="font-bold text-lg text-blue-900 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Role of Surveyor
                  </h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Measures and verifies land size</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Checks land boundaries</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Identifies boundary disputes</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Prepares official survey plan</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Checks for squatters/encroachments</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Documents physical conditions</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Required for building permits</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Cost: KES 10,000-50,000</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <h3 className="font-bold text-lg text-green-900 mb-4 flex items-center">
                    <Building2 className="w-5 h-5 mr-2" />
                    Role of Property Valuer
                  </h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Assesses property value</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Determines fair market price</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Calculates stamp duty basis</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Required for mortgages</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Identifies property defects</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Provides professional opinion</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Protects buyer interests</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Cost: KES 10,000-30,000</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                  <h3 className="font-bold text-lg text-orange-900 mb-4 flex items-center">
                    <Landmark className="w-5 h-5 mr-2" />
                    Role of Land Registry Officer
                  </h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Receives transfer documents</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Checks document completeness</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Processes transfer application</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Verifies original title deed</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Updates registry records</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Issues new title deed</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Controls processing timeline</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Government employee (no cost)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Internal Links Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-xl p-6 md:p-10 border border-amber-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Related Land Law Resources</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                to="/land-ownership-title-deed-verification-kenya"
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 group"
              >
                <FileCheck className="w-10 h-10 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg text-gray-900 mb-2">Land Ownership & Title Verification</h3>
                <p className="text-gray-600 text-sm">How to verify authentic title deeds and prevent fraud</p>
              </Link>

              <Link
                to="/land-disputes-kenya"
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 group"
              >
                <AlertTriangle className="w-10 h-10 text-red-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg text-gray-900 mb-2">Land Disputes Resolution</h3>
                <p className="text-gray-600 text-sm">Resolving boundary and ownership conflicts</p>
              </Link>

              <Link
                to="/how-to-buy-land-safely-kenya"
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 group"
              >
                <Shield className="w-10 h-10 text-green-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg text-gray-900 mb-2">Buy Land Safely</h3>
                <p className="text-gray-600 text-sm">Safe property purchases and fraud prevention</p>
              </Link>

              <Link
                to="/succession-inheritance-law-kenya"
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 group"
              >
                <Users className="w-10 h-10 text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg text-gray-900 mb-2">Succession & Inheritance</h3>
                <p className="text-gray-600 text-sm">Laws governing land inheritance</p>
              </Link>

              <Link
                to="/letters-of-administration-probate-kenya"
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 group"
              >
                <Gavel className="w-10 h-10 text-orange-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg text-gray-900 mb-2">Probate & Letters of Administration</h3>
                <p className="text-gray-600 text-sm">Court process for estate administration</p>
              </Link>

              <Link
                to="/land-transfer-after-death"
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 group"
              >
                <TrendingUp className="w-10 h-10 text-teal-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg text-gray-900 mb-2">Transfer After Death</h3>
                <p className="text-gray-600 text-sm">Transferring inherited property to beneficiaries</p>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4 max-w-4xl mx-auto">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-5 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                    aria-expanded={openFaq === index}
                  >
                    <span className="font-semibold text-left text-gray-900 pr-4">{faq.question}</span>
                    {openFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="p-5 bg-white border-t border-gray-200">
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 rounded-2xl shadow-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Need Help with Land Transfer?</h2>
            <p className="text-xl opacity-95 mb-8 max-w-3xl mx-auto">
              Land transfer involves complex procedures, government approvals, and multiple costs. Our experienced team guides you through every step to ensure smooth, legal property transfers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`https://wa.me/254112810203?text=${encodeURIComponent('Hello! I need help with land transfer process in Kenya. Please assist me.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white text-amber-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp Us Now
              </a>
              <a
                href={`mailto:johnsonthuraniramwangi@gmail.com?subject=${encodeURIComponent('Land Transfer Assistance')}&body=${encodeURIComponent('Hello,\n\nI need professional assistance with land transfer in Kenya.\n\nThank you.')}`}
                className="inline-flex items-center justify-center gap-2 bg-amber-800 hover:bg-amber-900 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Mail className="w-5 h-5" />
                Email Consultation
              </a>
            </div>
          </div>
        </section>

      </main>

      {/* Footer Note */}
      <footer className="bg-gray-100 border-t border-gray-300 py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <p className="text-gray-600 text-sm">
            <strong>Disclaimer:</strong> This information is for general guidance only and does not constitute legal advice. 
            Land transfer procedures and requirements may vary by county. Always consult with a qualified lawyer for specific land transfer matters.
          </p>
          <p className="text-gray-500 text-xs mt-4">
            © 2026 Wakili Legal Services. All rights reserved. | Updated February 2026
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandTransferProcessKenya;
