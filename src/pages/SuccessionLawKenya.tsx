import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  Scale,
  BookOpen,
  FileText,
  Users,
  Landmark,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Download,
  Clock,
  DollarSign,
  Shield,
  MessageCircle,
  Mail,
  Briefcase,
  Heart,
  ScrollText,
  Gavel
} from 'lucide-react';

// FAQs data - defined outside component to avoid dependency issues
const faqs = [
  {
    question: 'What is succession law in Kenya?',
    answer: 'Succession law in Kenya is the body of law that governs how a deceased person\'s property and estate are distributed to their beneficiaries after death. It is primarily regulated by the Law of Succession Act (Cap 160) and determines who inherits property, how estates are administered, and the rights of spouses, children, and dependants.'
  },
  {
    question: 'What is the difference between testate and intestate succession?',
    answer: 'Testate succession occurs when a person dies leaving a valid will that specifies how their estate should be distributed. Intestate succession applies when someone dies without a will, and their property is distributed according to the Law of Succession Act based on statutory rules.'
  },
  {
    question: 'Who can inherit property in Kenya?',
    answer: 'Under Kenyan law, the surviving spouse, children (biological and adopted), parents, and other dependants can inherit property. The Law of Succession Act prioritizes immediate family members and ensures that dependants are provided for, even if not named in a will.'
  },
  {
    question: 'What are letters of administration?',
    answer: 'Letters of administration are legal documents issued by the court granting authority to an administrator to manage and distribute a deceased person\'s estate when there is no will (intestate succession) or when the will does not name an executor.'
  },
  {
    question: 'What is a grant of probate?',
    answer: 'A grant of probate is a court order confirming that a will is valid and authorizing the executor named in the will to administer the estate according to the deceased\'s wishes. It is required for testate succession.'
  },
  {
    question: 'How long does the succession process take in Kenya?',
    answer: 'The succession process typically takes 6 months to 2 years, depending on the complexity of the estate, whether there are disputes, the completeness of documentation, and court schedules. Simple estates with no disputes may be resolved faster.'
  },
  {
    question: 'How much does succession cost in Kenya?',
    answer: 'Costs include court filing fees (around KES 1,000–5,000), legal fees (typically 1%–5% of estate value), valuation fees, and publication costs. Total costs can range from KES 50,000 to KES 500,000+ depending on estate size and complexity.'
  },
  {
    question: 'Can a will be contested in Kenya?',
    answer: 'Yes, a will can be contested on grounds such as lack of testamentary capacity, undue influence, fraud, improper execution, or if dependants were not adequately provided for. Contests must be filed in the High Court within the prescribed time limits.'
  },
  {
    question: 'What happens if someone dies without a will?',
    answer: 'If someone dies intestate (without a will), their estate is distributed according to the Law of Succession Act. The surviving spouse and children are the primary beneficiaries, with specific shares determined by law. An administrator is appointed by the court to manage the estate.'
  },
  {
    question: 'Do all estates require court succession proceedings?',
    answer: 'Not all estates require formal court succession. Small estates (typically below KES 1,000,000 or as determined by law) may qualify for simplified procedures. However, estates involving land, significant assets, or multiple beneficiaries generally require full succession proceedings.'
  },
  {
    question: 'Can property be transferred before succession is complete?',
    answer: 'No, property cannot be legally transferred or sold before succession proceedings are complete and a grant of probate or letters of administration are issued. Attempting to transfer property prematurely is illegal and can result in criminal charges.'
  },
  {
    question: 'What rights do widows have in succession?',
    answer: 'Widows have significant rights under Kenyan law, including the right to inherit a share of the estate, continued occupation of the matrimonial home, and provision for maintenance. The Law of Succession Act protects widows from being disinherited.'
  }
];

const SuccessionLawKenya = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    document.title = 'Succession & Inheritance Law in Kenya 2026 - Complete Legal Guide';

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Complete guide to succession and inheritance law in Kenya. Learn about estate distribution, probate, letters of administration, testate vs intestate succession, and inheritance rights. Updated 2026.'
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
      'succession law Kenya, inheritance law Kenya, property after death Kenya, estate distribution Kenya, letters of administration Kenya, probate Kenya, inheritance rights Kenya, succession court Kenya, estate administration Kenya, testate succession, intestate succession, will Kenya'
    );

    // Add canonical tag
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.href);

    // OpenGraph tags
    const ogTags = [
      { property: 'og:title', content: 'Succession & Inheritance Law in Kenya - Complete Legal Guide' },
      { property: 'og:description', content: 'Complete guide to succession and inheritance law in Kenya. Estate distribution, probate, and inheritance rights explained.' },
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
      { name: 'twitter:title', content: 'Succession & Inheritance Law in Kenya' },
      { name: 'twitter:description', content: 'Complete guide to succession and inheritance law in Kenya.' }
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
          name: 'Succession & Inheritance Law in Kenya',
          description: 'Complete guide to succession and inheritance law in Kenya',
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
              name: 'Succession Law Kenya',
              item: window.location.href
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
    { id: 'what-is-succession', title: 'What is Succession Law' },
    { id: 'types-of-succession', title: 'Types of Succession' },
    { id: 'who-can-inherit', title: 'Who Can Inherit' },
    { id: 'distribution', title: 'Property Distribution' },
    { id: 'executor-administrator', title: 'Executor vs Administrator' },
    { id: 'court-process', title: 'Court Process' },
    { id: 'documents', title: 'Required Documents' },
    { id: 'costs-timelines', title: 'Costs & Timelines' },
    { id: 'disputes', title: 'Common Disputes' },
    { id: 'estate-planning', title: 'Estate Planning Tips' },
    { id: 'when-lawyer', title: 'When You Need a Lawyer' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Breadcrumb */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 py-2 sm:py-3 px-2 sm:px-4 md:px-8 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-0">
          <ol className="flex items-center space-x-2 text-sm flex-wrap">
            <li>
              <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center transition-colors duration-200">
                <Home className="w-4 h-4 mr-1" /> Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-700 font-medium">Succession & Inheritance Law</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-600 text-white py-12 sm:py-20 px-3 sm:px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className={`max-w-7xl mx-auto relative z-10 transition-all duration-1000 px-0 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center mb-6">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl mr-4 shadow-xl">
              <Scale className="w-12 h-12" />
            </div>
            <div>
              <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                Succession & Inheritance Law in Kenya
              </h1>
              <p className="text-lg md:text-xl opacity-90 mt-2">Complete Legal Guide to Estate Distribution & Probate</p>
            </div>
          </div>
          <p className="text-xl md:text-2xl opacity-95 max-w-4xl leading-relaxed mb-6">
            Your comprehensive guide to succession and inheritance law in Kenya. Understand estate distribution, probate, letters of administration, inheritance rights, and the succession court process. <span className="font-semibold text-yellow-300">Updated 2026.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`https://wa.me/254112810203?text=${encodeURIComponent('Hello! I need guidance on succession and inheritance law in Kenya. Please advise on estate administration and probate.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 text-sm sm:text-base"
              aria-label="Request guidance on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              WhatsApp Guidance
            </a>
            <a
              href={`mailto:johnsonthuraniramwangi@gmail.com?subject=${encodeURIComponent('Succession & Inheritance Law Inquiry')}&body=${encodeURIComponent('Hello,\n\nI need assistance with succession and inheritance law in Kenya.\n\nPlease contact me to discuss:\n- Estate administration\n- Probate proceedings\n- Inheritance rights\n\nThank you.')}`}
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl border border-white/30 shadow-lg transition-all duration-300 hover:scale-105 text-sm sm:text-base"
              aria-label="Request guidance via email"
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
            <BookOpen className="w-5 h-5 text-indigo-600 flex-shrink-0" />
            <span className="text-sm font-semibold text-gray-700 flex-shrink-0">Quick Jump:</span>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
              {tableOfContents.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`text-xs px-3 py-1 rounded-full whitespace-nowrap transition-all duration-200 ${
                    activeSection === item.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-indigo-100'
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
      <div className="content-full-width">
        <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-8 sm:py-12">
        
        {/* Section 1: What is Succession Law */}
        <section id="what-is-succession" className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200">
            <div className="flex items-start mb-6">
              <div className="bg-indigo-100 p-3 rounded-xl mr-4">
                <Landmark className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">What is Succession Law in Kenya?</h2>
                <p className="text-gray-600">Understanding the legal framework for estate distribution</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Succession law in Kenya is the body of law that governs how a deceased person's property, assets, and estate are distributed to their beneficiaries after death. It ensures that the rights of surviving family members and dependants are protected and that the deceased's wishes (if expressed in a will) are honored.
              </p>

              <p className="text-gray-700 leading-relaxed mb-4">
                The primary legislation governing succession in Kenya is the <strong>Law of Succession Act (Cap 160)</strong>, which sets out comprehensive rules for both testate succession (when there is a will) and intestate succession (when there is no will). The Act applies to all Kenyans except where customary or Islamic law applies by consent.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6 rounded-r-lg">
                <h3 className="font-bold text-lg text-blue-900 mb-3 flex items-center">
                  <Scale className="w-5 h-5 mr-2" />
                  Key Principles of Succession Law
                </h3>
                <ul className="space-y-2 text-gray-800">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 mr-2 mt-1 flex-shrink-0" />
                    <span><strong>Protection of Dependants:</strong> The law ensures that spouses, children, and dependants receive adequate provision from the estate.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 mr-2 mt-1 flex-shrink-0" />
                    <span><strong>Freedom of Testamentary Disposition:</strong> Persons can distribute their property by will, subject to dependants' rights.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 mr-2 mt-1 flex-shrink-0" />
                    <span><strong>Equal Treatment of Spouses:</strong> The law recognizes the rights of all lawful spouses, including in polygamous marriages.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 mr-2 mt-1 flex-shrink-0" />
                    <span><strong>Court Supervision:</strong> Succession proceedings are supervised by the High Court to ensure fairness and legal compliance.</span>
                  </li>
                </ul>
              </div>

              <p className="text-gray-700 leading-relaxed mb-4">
                Succession law is essential for maintaining family stability after the death of a loved one, preventing disputes, ensuring orderly transfer of property, and protecting vulnerable family members from being disinherited or left without support.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Types of Succession */}
        <section id="types-of-succession" className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200">
            <div className="flex items-start mb-6">
              <div className="bg-purple-100 p-3 rounded-xl mr-4">
                <ScrollText className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Types of Succession: Testate vs Intestate</h2>
                <p className="text-gray-600">Two distinct succession processes in Kenya</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Testate Succession */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-center mb-4">
                  <FileText className="w-6 h-6 text-green-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Testate Succession</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Occurs when a person dies leaving a <strong>valid will</strong> that specifies how their estate should be distributed.
                </p>
                <h4 className="font-semibold text-gray-900 mb-2">Key Features:</h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span>The deceased's wishes guide distribution</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span>Executor named in the will administers the estate</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span>Requires grant of probate from the court</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span>Provides clarity and reduces disputes</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span>Dependants must still receive reasonable provision</span>
                  </li>
                </ul>
              </div>

              {/* Intestate Succession */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
                <div className="flex items-center mb-4">
                  <AlertCircle className="w-6 h-6 text-orange-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Intestate Succession</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Occurs when a person dies <strong>without a valid will</strong>. The estate is distributed according to statutory rules.
                </p>
                <h4 className="font-semibold text-gray-900 mb-2">Key Features:</h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-orange-600 mr-2 mt-1 flex-shrink-0" />
                    <span>Law of Succession Act determines distribution</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-orange-600 mr-2 mt-1 flex-shrink-0" />
                    <span>Court appoints an administrator for the estate</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-orange-600 mr-2 mt-1 flex-shrink-0" />
                    <span>Requires letters of administration from court</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-orange-600 mr-2 mt-1 flex-shrink-0" />
                    <span>May lead to disputes among family members</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-orange-600 mr-2 mt-1 flex-shrink-0" />
                    <span>Distribution follows strict statutory hierarchy</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
              <h3 className="font-bold text-lg text-indigo-900 mb-3 flex items-center">
                <Gavel className="w-5 h-5 mr-2" />
                Why Having a Will Matters
              </h3>
              <p className="text-gray-700 mb-4">
                Writing a will gives you control over who inherits your property, how your estate is managed, and who will care for minor children. Without a will, the government decides these matters based on rigid statutory rules that may not reflect your wishes.
              </p>
              <Link
                to="/how-to-write-a-will-kenya"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
              >
                <FileText className="w-5 h-5" />
                Learn How to Write a Will in Kenya
              </Link>
            </div>
          </div>
        </section>

        {/* Section 3: Who Can Inherit */}
        <section id="who-can-inherit" className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200">
            <div className="flex items-start mb-6">
              <div className="bg-blue-100 p-3 rounded-xl mr-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Who Can Inherit Property in Kenya?</h2>
                <p className="text-gray-600">Understanding beneficiaries and inheritance rights</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                Under the Law of Succession Act, the following persons are entitled to inherit from a deceased person's estate, whether under a will (testate) or by law (intestate):
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="font-bold text-lg text-blue-900 mb-4 flex items-center">
                    <Heart className="w-5 h-5 mr-2" />
                    Priority Beneficiaries
                  </h3>
                  <ul className="space-y-3 text-gray-800">
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 mr-2 mt-1 flex-shrink-0" />
                      <div>
                        <strong>Surviving Spouse(s):</strong> All legally married spouses (including polygamous marriages) have inheritance rights.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 mr-2 mt-1 flex-shrink-0" />
                      <div>
                        <strong>Children:</strong> All biological and legally adopted children, including those born out of wedlock, have equal inheritance rights.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 mr-2 mt-1 flex-shrink-0" />
                      <div>
                        <strong>Dependants:</strong> Persons who were wholly or substantially dependent on the deceased for maintenance.
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <h3 className="font-bold text-lg text-green-900 mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Secondary Beneficiaries
                  </h3>
                  <ul className="space-y-3 text-gray-800">
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                      <div>
                        <strong>Parents:</strong> May inherit if there is no surviving spouse or children.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                      <div>
                        <strong>Siblings:</strong> Brothers and sisters inherit when there are no closer relatives.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                      <div>
                        <strong>Extended Family:</strong> Grandparents, uncles, aunts, cousins may inherit in absence of immediate family.
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 my-6 rounded-r-lg">
                <h3 className="font-bold text-lg text-yellow-900 mb-3 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Important Notes on Inheritance Rights
                </h3>
                <ul className="space-y-2 text-gray-800">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span><strong>All children are equal:</strong> There is no distinction between male and female children, or between older and younger children. All share equally.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span><strong>Children born out of wedlock:</strong> Have the same rights as children born in marriage.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span><strong>Stepchildren:</strong> Generally do not inherit unless legally adopted or specifically named in a will.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span><strong>Illegitimate children:</strong> The law does not recognize the term "illegitimate"; all children have equal rights.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Property Distribution */}
        <section id="distribution" className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200">
            <div className="flex items-start mb-6">
              <div className="bg-green-100 p-3 rounded-xl mr-4">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">How Property is Distributed in Kenya</h2>
                <p className="text-gray-600">Statutory rules for intestate succession</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                When someone dies intestate (without a will), the Law of Succession Act prescribes specific rules for how the estate is divided among surviving family members. The distribution depends on which relatives survive the deceased.
              </p>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 mb-6">
                <h3 className="font-bold text-xl text-indigo-900 mb-4">Distribution Scenarios (Intestate Succession)</h3>
                
                <div className="space-y-6">
                  <div className="bg-white rounded-lg p-5 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-2">Scenario 1: Surviving Spouse and Children</h4>
                    <p className="text-gray-700 mb-3">
                      The surviving spouse receives their <strong>life interest in the whole estate</strong> (right to use and benefit from the property during their lifetime), and the children receive the <strong>absolute interest</strong> (ownership after the spouse's death).
                    </p>
                    <div className="bg-blue-50 p-3 rounded text-sm text-gray-700">
                      <strong>Example:</strong> If John dies leaving a wife and 3 children, his wife can live in the matrimonial home and use all assets during her lifetime. After her death, the children inherit the property equally.
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-2">Scenario 2: Spouse Only (No Children)</h4>
                    <p className="text-gray-700 mb-3">
                      The surviving spouse inherits the <strong>entire estate absolutely</strong>.
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-2">Scenario 3: Children Only (No Spouse)</h4>
                    <p className="text-gray-700 mb-3">
                      All children share the estate <strong>equally</strong>, regardless of age or gender.
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-2">Scenario 4: No Spouse or Children</h4>
                    <p className="text-gray-700 mb-3">
                      The estate goes to <strong>parents</strong>, or if parents are deceased, to <strong>siblings</strong>, or if none, to <strong>extended family</strong> (grandparents, uncles, aunts, cousins).
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-2">Scenario 5: Polygamous Marriage</h4>
                    <p className="text-gray-700 mb-3">
                      All wives and their respective children share the estate. Each wife receives an equal share with her children, and all children share equally across all houses.
                    </p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
                  <thead className="bg-indigo-600 text-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Survivors</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Distribution</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-800">Spouse + Children</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Spouse: life interest; Children: absolute interest</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-800">Spouse only</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Spouse: 100% of estate</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-800">Children only</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Children: equal shares</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-800">Parents only</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Parents: 100% of estate</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-800">Siblings only</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Siblings: equal shares</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Executor vs Administrator */}
        <section id="executor-administrator" className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200">
            <div className="flex items-start mb-6">
              <div className="bg-purple-100 p-3 rounded-xl mr-4">
                <Briefcase className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Role of Executor vs Administrator</h2>
                <p className="text-gray-600">Understanding who manages the estate</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-6 h-6 text-green-600 mr-3" />
                  Executor (Testate)
                </h3>
                <p className="text-gray-700 mb-4">
                  A person named in the will to carry out the deceased's wishes and manage the estate.
                </p>
                <h4 className="font-semibold text-gray-900 mb-2">Responsibilities:</h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span>Apply for grant of probate</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span>Collect and secure all estate assets</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span>Pay debts, taxes, and funeral expenses</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span>Distribute estate according to the will</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span>File estate accounts with the court</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span>Transfer property titles to beneficiaries</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Gavel className="w-6 h-6 text-orange-600 mr-3" />
                  Administrator (Intestate)
                </h3>
                <p className="text-gray-700 mb-4">
                  A person appointed by the court to manage an estate when there is no will.
                </p>
                <h4 className="font-semibold text-gray-900 mb-2">Responsibilities:</h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-orange-600 mr-2 mt-1 flex-shrink-0" />
                    <span>Apply for letters of administration</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-orange-600 mr-2 mt-1 flex-shrink-0" />
                    <span>Identify and value all estate assets</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-orange-600 mr-2 mt-1 flex-shrink-0" />
                    <span>Settle all outstanding debts and obligations</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-orange-600 mr-2 mt-1 flex-shrink-0" />
                    <span>Distribute estate per statutory rules</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-orange-600 mr-2 mt-1 flex-shrink-0" />
                    <span>Submit accounts to the court</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-orange-600 mr-2 mt-1 flex-shrink-0" />
                    <span>Complete final distribution and obtain discharge</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-6">
              <h3 className="font-bold text-lg text-blue-900 mb-3 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Who Can Be Appointed Administrator?
              </h3>
              <p className="text-gray-700 mb-3">
                Priority for appointment as administrator is given to:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                <li>The surviving spouse</li>
                <li>The eldest child or children collectively</li>
                <li>Other beneficiaries under the Law of Succession Act</li>
                <li>Any creditor (in special circumstances)</li>
              </ol>
              <p className="text-gray-700 mt-4">
                The court considers the applicant's suitability, honesty, and ability to manage the estate properly.
              </p>
            </div>
          </div>
        </section>

        {/* Section 6: Court Process */}
        <section id="court-process" className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200">
            <div className="flex items-start mb-6">
              <div className="bg-red-100 p-3 rounded-xl mr-4">
                <Landmark className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Step-by-Step Succession Court Process</h2>
                <p className="text-gray-600">Complete guide from death to distribution</p>
              </div>
            </div>

            <div className="space-y-6">
              {[
                {
                  step: 1,
                  title: 'Obtain Death Certificate',
                  description: 'Register the death at the Civil Registrar and obtain an official death certificate. This is required for all succession proceedings.',
                  time: '1-2 weeks'
                },
                {
                  step: 2,
                  title: 'Search for a Will',
                  description: 'Check if the deceased left a will. Search their personal records, safe deposit boxes, and consult with their lawyer.',
                  time: '1-2 weeks'
                },
                {
                  step: 3,
                  title: 'Engage a Lawyer',
                  description: 'Hire an advocate experienced in succession law to guide you through the court process and prepare necessary documents.',
                  time: '1 week'
                },
                {
                  step: 4,
                  title: 'Prepare Court Application',
                  description: 'File a Petition for Grant of Probate (if there is a will) or Letters of Administration (if no will) in the High Court.',
                  time: '2-4 weeks'
                },
                {
                  step: 5,
                  title: 'Publish Notice in Kenya Gazette',
                  description: 'Publish a notice of the death and application in the Kenya Gazette to allow creditors and interested parties to raise objections.',
                  time: '2-3 months'
                },
                {
                  step: 6,
                  title: 'Obtain Grant of Probate or Letters of Administration',
                  description: 'After the objection period expires and all requirements are met, the court issues the grant authorizing estate administration.',
                  time: '3-6 months'
                },
                {
                  step: 7,
                  title: 'Collect and Value Assets',
                  description: 'Identify all estate assets (land, bank accounts, investments, personal property), obtain valuations, and prepare an inventory.',
                  time: '2-4 months'
                },
                {
                  step: 8,
                  title: 'Pay Debts and Taxes',
                  description: 'Settle all outstanding debts, funeral expenses, and any taxes due from the estate before distribution.',
                  time: '1-3 months'
                },
                {
                  step: 9,
                  title: 'Prepare Estate Accounts',
                  description: 'Compile detailed accounts showing all assets, liabilities, income, and expenses. Submit to court for approval.',
                  time: '1-2 months'
                },
                {
                  step: 10,
                  title: 'Distribute the Estate',
                  description: 'Transfer property and assets to beneficiaries according to the will or statutory rules. Obtain receipts and acknowledgments.',
                  time: '2-6 months'
                },
                {
                  step: 11,
                  title: 'File Final Accounts and Close Estate',
                  description: 'Submit final accounts to the court showing complete distribution. Obtain a certificate of compliance and discharge.',
                  time: '1-2 months'
                }
              ].map((item) => (
                <div key={item.step} className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200">
                  <div className="flex items-start">
                    <div className="bg-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-700 mb-2">{item.description}</p>
                      <div className="flex items-center text-sm text-indigo-600">
                        <Clock className="w-4 h-4 mr-1" />
                        <span className="font-semibold">Typical Duration: {item.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mt-6 rounded-r-lg">
              <h3 className="font-bold text-lg text-yellow-900 mb-3 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Total Timeline
              </h3>
              <p className="text-gray-700">
                The entire succession process typically takes <strong>6 months to 2 years</strong>, depending on the complexity of the estate, presence of disputes, completeness of documentation, and court schedules. Simple, uncontested estates may be completed faster.
              </p>
            </div>

            <div className="mt-6">
              <Link
                to="/letters-of-administration-probate-kenya"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
              >
                <FileText className="w-5 h-5" />
                Learn More About Probate & Letters of Administration
              </Link>
            </div>
          </div>
        </section>

        {/* Section 7: Required Documents */}
        <section id="documents" className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200">
            <div className="flex items-start mb-6">
              <div className="bg-green-100 p-3 rounded-xl mr-4">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Required Documents & Forms Checklist</h2>
                <p className="text-gray-600">Everything you need for succession proceedings</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h3 className="font-bold text-lg text-blue-900 mb-4 flex items-center">
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Essential Documents
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Original death certificate</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Original will (if available)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>ID copies of deceased and beneficiaries</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Marriage certificate(s)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Birth certificates of children</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Land title deeds and property documents</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Bank statements and account details</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Asset valuation reports</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>List of assets and liabilities</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>KRA PIN certificates</span>
                  </li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <h3 className="font-bold text-lg text-green-900 mb-4 flex items-center">
                  <Download className="w-5 h-5 mr-2" />
                  Court Forms Required
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Petition for Grant of Probate / Letters of Administration</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Supporting Affidavit</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Schedule of Assets and Liabilities</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Consent by Beneficiaries (where applicable)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Renunciation by Executor (if renouncing)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Notice to Creditors (Kenya Gazette)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Estate Accounts</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Certificate of Confirmation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Final Distribution Schedule</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 mt-6">
              <h3 className="font-bold text-lg text-indigo-900 mb-3">Download Succession Forms</h3>
              <p className="text-gray-700 mb-4">
                Access official succession forms from the Kenyan Judiciary or consult with a lawyer to prepare your documents correctly.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.judiciary.go.ke/download-category/forms/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-lg transition-all duration-300"
                >
                  <Download className="w-4 h-4" />
                  Judiciary Forms
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Section 8: Costs & Timelines */}
        <section id="costs-timelines" className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200">
            <div className="flex items-start mb-6">
              <div className="bg-yellow-100 p-3 rounded-xl mr-4">
                <DollarSign className="w-8 h-8 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Costs, Fees & Timelines</h2>
                <p className="text-gray-600">What to expect financially and time-wise</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                <h3 className="font-bold text-xl text-gray-900 mb-4 flex items-center">
                  <DollarSign className="w-6 h-6 text-yellow-600 mr-3" />
                  Typical Costs
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex justify-between items-start">
                    <span className="font-semibold">Court filing fees:</span>
                    <span className="text-right">KES 1,000 - 5,000</span>
                  </li>
                  <li className="flex justify-between items-start">
                    <span className="font-semibold">Legal fees (1-5% of estate):</span>
                    <span className="text-right">KES 50,000 - 500,000+</span>
                  </li>
                  <li className="flex justify-between items-start">
                    <span className="font-semibold">Valuation fees:</span>
                    <span className="text-right">KES 20,000 - 100,000</span>
                  </li>
                  <li className="flex justify-between items-start">
                    <span className="font-semibold">Kenya Gazette publication:</span>
                    <span className="text-right">KES 5,000 - 10,000</span>
                  </li>
                  <li className="flex justify-between items-start">
                    <span className="font-semibold">Land transfer fees:</span>
                    <span className="text-right">2-4% of property value</span>
                  </li>
                  <li className="flex justify-between items-start">
                    <span className="font-semibold">Stamp duty:</span>
                    <span className="text-right">2% of property value</span>
                  </li>
                </ul>
                <div className="mt-4 pt-4 border-t border-yellow-300">
                  <p className="font-bold text-lg text-gray-900">
                    Total Estimate: <span className="text-yellow-700">KES 100,000 - 1,000,000+</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Costs vary based on estate size and complexity</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <h3 className="font-bold text-xl text-gray-900 mb-4 flex items-center">
                  <Clock className="w-6 h-6 text-blue-600 mr-3" />
                  Time Estimates
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex justify-between items-start">
                    <span className="font-semibold">Simple estate (no disputes):</span>
                    <span className="text-right">6-12 months</span>
                  </li>
                  <li className="flex justify-between items-start">
                    <span className="font-semibold">Average estate:</span>
                    <span className="text-right">12-18 months</span>
                  </li>
                  <li className="flex justify-between items-start">
                    <span className="font-semibold">Complex estate:</span>
                    <span className="text-right">18-24 months</span>
                  </li>
                  <li className="flex justify-between items-start">
                    <span className="font-semibold">Disputed estate:</span>
                    <span className="text-right">2-5 years+</span>
                  </li>
                </ul>
                <div className="mt-4 pt-4 border-t border-blue-300">
                  <h4 className="font-bold text-gray-900 mb-2">Factors Affecting Duration:</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Estate complexity and value</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Number of beneficiaries</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Disputes among family members</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Court schedules and backlog</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Completeness of documentation</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 9: Common Disputes */}
        <section id="disputes" className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200">
            <div className="flex items-start mb-6">
              <div className="bg-red-100 p-3 rounded-xl mr-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Common Succession Disputes and How to Avoid Them</h2>
                <p className="text-gray-600">Preventing family conflicts over inheritance</p>
              </div>
            </div>

            <div className="space-y-6">
              {[
                {
                  dispute: 'Challenges to Validity of Will',
                  causes: 'Claims of undue influence, lack of testamentary capacity, improper execution, or fraud.',
                  prevention: 'Have the will drafted by a lawyer, witnessed properly, and ensure the testator is of sound mind. Consider videotaping the will signing.'
                },
                {
                  dispute: 'Exclusion of Dependants',
                  causes: 'Beneficiaries left out of the will or inadequately provided for.',
                  prevention: 'Ensure all dependants receive reasonable provision. The court can vary a will to provide for dependants.'
                },
                {
                  dispute: 'Disagreements Over Asset Valuation',
                  causes: 'Beneficiaries disputing property values or claiming undervaluation.',
                  prevention: 'Use independent, qualified valuers and obtain multiple valuations for significant assets.'
                },
                {
                  dispute: 'Allegations of Executor/Administrator Misconduct',
                  causes: 'Claims of mismanagement, theft, or favoritism by the estate administrator.',
                  prevention: 'Appoint trustworthy executors, keep detailed records, and provide regular updates to beneficiaries.'
                },
                {
                  dispute: 'Hidden Assets or Fraud',
                  causes: 'Suspicions that assets are being concealed or transferred illegally.',
                  prevention: 'Full disclosure of all assets, transparent accounting, and court supervision.'
                },
                {
                  dispute: 'Competing Claims to Property',
                  causes: 'Multiple parties claiming ownership of the same property (e.g., second families, disputed marriages).',
                  prevention: 'Clarify legal relationships and ownership during the testator\'s lifetime. Maintain proper documentation.'
                },
                {
                  dispute: 'Delays in Estate Distribution',
                  causes: 'Prolonged court processes, beneficiaries not cooperating, or complex assets.',
                  prevention: 'Engage competent lawyers, cooperate fully, provide all documents promptly, and avoid unnecessary litigation.'
                }
              ].map((item, index) => (
                <div key={index} className="bg-red-50 rounded-xl p-6 border border-red-200">
                  <h3 className="font-bold text-lg text-red-900 mb-3 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    {item.dispute}
                  </h3>
                  <div className="mb-3">
                    <h4 className="font-semibold text-gray-900 mb-1">Common Causes:</h4>
                    <p className="text-gray-700">{item.causes}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">How to Prevent:</h4>
                    <p className="text-gray-700">{item.prevention}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-6">
              <h3 className="font-bold text-lg text-blue-900 mb-3">Resolving Disputes</h3>
              <p className="text-gray-700">
                If disputes arise, consider mediation or alternative dispute resolution before going to court. Many succession disputes can be resolved through negotiation, saving time and money. The court can also order mediation.
              </p>
            </div>
          </div>
        </section>

        {/* Section 10: Estate Planning Tips */}
        <section id="estate-planning" className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200">
            <div className="flex items-start mb-6">
              <div className="bg-green-100 p-3 rounded-xl mr-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Estate Planning Tips to Protect Your Family</h2>
                <p className="text-gray-600">Proactive steps to ensure smooth succession</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: <FileText className="w-6 h-6" />,
                  title: 'Write a Will',
                  description: 'The single most important step. Clearly state who gets what, name an executor, and provide for all dependants.'
                },
                {
                  icon: <Users className="w-6 h-6" />,
                  title: 'Update Your Will Regularly',
                  description: 'Review and update your will every 3-5 years or after major life events (marriage, divorce, birth of children).'
                },
                {
                  icon: <Landmark className="w-6 h-6" />,
                  title: 'Organize Your Documents',
                  description: 'Keep all important documents (title deeds, bank records, insurance policies) in one secure, accessible place.'
                },
                {
                  icon: <Heart className="w-6 h-6" />,
                  title: 'Communicate with Family',
                  description: 'Discuss your estate plan with family members to manage expectations and reduce surprises after death.'
                },
                {
                  icon: <DollarSign className="w-6 h-6" />,
                  title: 'Minimize Debts',
                  description: 'Pay off debts where possible to reduce estate liabilities and increase what beneficiaries receive.'
                },
                {
                  icon: <Scale className="w-6 h-6" />,
                  title: 'Use Trusts Where Appropriate',
                  description: 'Consider setting up trusts for minor children or to protect assets from creditors or misuse.'
                },
                {
                  icon: <Briefcase className="w-6 h-6" />,
                  title: 'Choose Executors Wisely',
                  description: 'Select trustworthy, responsible individuals who can manage the estate efficiently and fairly.'
                },
                {
                  icon: <CheckCircle2 className="w-6 h-6" />,
                  title: 'Ensure Proper Title to Property',
                  description: 'Make sure all property is registered in your name with clear, undisputed title to avoid complications.'
                }
              ].map((tip, index) => (
                <div key={index} className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-start mb-3">
                    <div className="bg-green-100 p-2 rounded-lg mr-3 text-green-600">
                      {tip.icon}
                    </div>
                    <h3 className="font-bold text-lg text-gray-900">{tip.title}</h3>
                  </div>
                  <p className="text-gray-700">{tip.description}</p>
                </div>
              ))}
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 mt-6">
              <h3 className="font-bold text-lg text-indigo-900 mb-3">Start Estate Planning Today</h3>
              <p className="text-gray-700 mb-4">
                Don't wait until it's too late. Estate planning protects your family, preserves your wealth, and ensures your wishes are honored. Begin with writing a will and organizing your financial records.
              </p>
              <Link
                to="/how-to-write-a-will-kenya"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
              >
                <FileText className="w-5 h-5" />
                How to Write a Will in Kenya
              </Link>
            </div>
          </div>
        </section>

        {/* Section 11: When You Need a Lawyer */}
        <section id="when-lawyer" className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200">
            <div className="flex items-start mb-6">
              <div className="bg-indigo-100 p-3 rounded-xl mr-4">
                <Briefcase className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">When You Need a Lawyer</h2>
                <p className="text-gray-600">Professional legal assistance for succession matters</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                While some aspects of estate planning can be handled independently, succession law is complex and mistakes can be costly. You should engage a qualified succession lawyer in the following situations:
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                  <h3 className="font-bold text-lg text-red-900 mb-4">Mandatory Legal Assistance</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-1 flex-shrink-0" />
                      <span>Applying for grant of probate or letters of administration</span>
                    </li>
                    <li className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-1 flex-shrink-0" />
                      <span>Contesting or defending a will</span>
                    </li>
                    <li className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-1 flex-shrink-0" />
                      <span>Dealing with complex estates (multiple properties, businesses, international assets)</span>
                    </li>
                    <li className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-1 flex-shrink-0" />
                      <span>Transferring land titles after succession</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="font-bold text-lg text-blue-900 mb-4">Highly Recommended Legal Assistance</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 mr-2 mt-1 flex-shrink-0" />
                      <span>Drafting a comprehensive will</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 mr-2 mt-1 flex-shrink-0" />
                      <span>Managing disputes among beneficiaries</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 mr-2 mt-1 flex-shrink-0" />
                      <span>Estate tax and liability issues</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 mr-2 mt-1 flex-shrink-0" />
                      <span>Setting up trusts for minors or special needs beneficiaries</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-6">
                <h3 className="font-bold text-lg text-indigo-900 mb-3 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  How to Choose a Succession Lawyer
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 mr-2 mt-1 flex-shrink-0" />
                    <span><strong>Experience:</strong> Look for lawyers specializing in succession and estate planning with a proven track record.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 mr-2 mt-1 flex-shrink-0" />
                    <span><strong>Reputation:</strong> Check reviews, ask for referrals, and verify their standing with the Law Society of Kenya.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 mr-2 mt-1 flex-shrink-0" />
                    <span><strong>Communication:</strong> Choose a lawyer who explains legal concepts clearly and responds promptly.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 mr-2 mt-1 flex-shrink-0" />
                    <span><strong>Fees:</strong> Understand the fee structure upfront and ensure it aligns with your budget and estate value.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Internal Links Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-xl p-6 md:p-10 border border-indigo-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Related Legal Resources</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                to="/how-to-write-a-will-kenya"
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 group"
              >
                <FileText className="w-10 h-10 text-indigo-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg text-gray-900 mb-2">How to Write a Will in Kenya</h3>
                <p className="text-gray-600 text-sm">Complete guide to drafting a valid will</p>
              </Link>

              <Link
                to="/letters-of-administration-probate-kenya"
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 group"
              >
                <Gavel className="w-10 h-10 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg text-gray-900 mb-2">Letters of Administration & Probate</h3>
                <p className="text-gray-600 text-sm">Court procedures and requirements</p>
              </Link>

              <Link
                to="/land-transfer-after-death"
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 group"
              >
                <Landmark className="w-10 h-10 text-green-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg text-gray-900 mb-2">Land Transfer After Death</h3>
                <p className="text-gray-600 text-sm">Property succession and title transfer</p>
              </Link>

              <Link
                to="/family-law-divorce-kenya"
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 group"
              >
                <Heart className="w-10 h-10 text-pink-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg text-gray-900 mb-2">Family Law in Kenya</h3>
                <p className="text-gray-600 text-sm">Marriage, divorce, and family rights</p>
              </Link>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <Download className="w-10 h-10 text-purple-600 mb-3" />
                <h3 className="font-bold text-lg text-gray-900 mb-2">Legal Forms & Documents</h3>
                <p className="text-gray-600 text-sm">Download succession forms and templates</p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <BookOpen className="w-10 h-10 text-orange-600 mb-3" />
                <h3 className="font-bold text-lg text-gray-900 mb-2">Legal Resources</h3>
                <p className="text-gray-600 text-sm">Kenya law resources and references</p>
              </div>
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
                      <ChevronUp className="w-5 h-5 text-indigo-600 flex-shrink-0" />
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
          <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 rounded-2xl shadow-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Need Help with Succession Matters?</h2>
            <p className="text-xl opacity-95 mb-8 max-w-3xl mx-auto">
              Our experienced legal team can guide you through succession proceedings, estate planning, probate, and inheritance disputes. Contact us today for professional assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`https://wa.me/254112810203?text=${encodeURIComponent('Hello! I need assistance with succession and inheritance law in Kenya. Please help me with estate administration.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp Us Now
              </a>
              <a
                href={`mailto:johnsonthuraniramwangi@gmail.com?subject=${encodeURIComponent('Succession Law Inquiry')}&body=${encodeURIComponent('Hello,\n\nI need professional legal assistance with succession matters.\n\nThank you.')}`}
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold px-8 py-4 rounded-xl border border-white/30 shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Mail className="w-5 h-5" />
                Email Consultation
              </a>
            </div>
          </div>
        </section>

      </main>
      </div>

      {/* Footer Note */}
      <footer className="bg-gray-100 border-t border-gray-300 py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <p className="text-gray-600 text-sm">
            <strong>Disclaimer:</strong> This information is for general guidance only and does not constitute legal advice. 
            Succession law is complex and varies by individual circumstances. Always consult with a qualified lawyer for specific legal matters.
          </p>
          <p className="text-gray-500 text-xs mt-4">
            © 2026 Wakili Legal Services. All rights reserved. | Updated February 2026
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SuccessionLawKenya;
