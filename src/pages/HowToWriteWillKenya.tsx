import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  FileText,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Download,
  Shield,
  MessageCircle,
  Mail,
  Users,
  Briefcase,
  Heart,
  Clock,
  Scale,
  Eye,
  PenTool,
  ScrollText,
  Landmark
} from 'lucide-react';

// FAQs data - defined outside component
const faqs = [
  {
    question: 'What is a will and why do I need one?',
    answer: 'A will is a legal document that states how you want your property and assets distributed after your death. It ensures your wishes are honored, provides for your family, minimizes disputes, and allows you to choose who manages your estate. Without a will, the government decides how your property is distributed.'
  },
  {
    question: 'Do I need a lawyer to write a will in Kenya?',
    answer: 'No, you can write a will yourself. However, for complex estates, significant assets, or if you want to ensure everything is legally correct, consulting a lawyer is recommended. A lawyer can help you avoid mistakes that could invalidate your will.'
  },
  {
    question: 'How much does it cost to write a will in Kenya?',
    answer: 'If you write your own will, costs are minimal (just printing and storage). Professional will drafting by a lawyer typically costs KES 5,000 to KES 50,000 depending on estate complexity. Some lawyers offer free will drafting with other services.'
  },
  {
    question: 'What makes a will valid in Kenya?',
    answer: 'A valid will must be: (1) in writing, (2) signed by the testator (will-maker), (3) witnessed by at least two independent witnesses who also sign, (4) made by someone 18+ years old and of sound mind, and (5) not made under duress or undue influence.'
  },
  {
    question: 'Can I write my will by hand?',
    answer: 'Yes, handwritten wills (holographic wills) are valid in Kenya if they meet all legal requirements: signed by you, witnessed by two independent witnesses, clearly state it\'s your will, and you are of sound mind. Typed wills are preferred for clarity.'
  },
  {
    question: 'Who can be a witness to my will?',
    answer: 'Witnesses must be 18+ years old, of sound mind, and NOT beneficiaries of the will or spouses of beneficiaries. They should be independent, trustworthy individuals who can confirm you signed the will voluntarily.'
  },
  {
    question: 'Can I change my will after I write it?',
    answer: 'Yes, you can change your will at any time by writing a new will (which automatically revokes the old one) or by adding a codicil (amendment). You should review and update your will every 3-5 years or after major life events.'
  },
  {
    question: 'Do I need to register my will in Kenya?',
    answer: 'No, registering a will is not mandatory in Kenya. However, you should store it safely and inform your executor where it is kept. Some people deposit their wills with their lawyer or in a bank safe deposit box.'
  },
  {
    question: 'What happens if I die without a will?',
    answer: 'If you die intestate (without a will), your estate is distributed according to the Law of Succession Act. The court appoints an administrator, and your property goes to your spouse and children according to statutory rules, which may not reflect your wishes.'
  },
  {
    question: 'Can I disinherit someone in my will?',
    answer: 'You can exclude people from your will, but Kenyan law protects dependants. The court can order provision for spouses, children, and other dependants even if you leave them out of your will. It\'s best to provide reasonably for all dependants.'
  },
  {
    question: 'Who should I choose as executor?',
    answer: 'Choose someone trustworthy, responsible, and capable of managing your estate. This could be your spouse, adult child, close friend, lawyer, or professional executor. You can name more than one executor and should name alternate executors in case your first choice cannot serve.'
  },
  {
    question: 'What should I include in my will?',
    answer: 'Include: your full identifying details, statement that this is your will, list of all assets and beneficiaries, specific gifts (who gets what), residuary clause (for remaining property), executor appointment, guardian for minor children (if applicable), funeral wishes, signatures and witnesses.'
  }
];

const HowToWriteWillKenya = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    document.title = 'How to Write a Will in Kenya 2026 - Complete Guide + Free Template';

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Complete guide on how to write a legal will in Kenya. Step-by-step instructions, requirements, free template, executor selection, and estate planning tips. Updated 2026.'
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
      'how to write a will Kenya, will format Kenya, will template Kenya, sample will Kenya, legal will requirements, executor of will, estate planning Kenya, will writing cost, registering a will Kenya, valid will Kenya'
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
      { property: 'og:title', content: 'How to Write a Will in Kenya - Complete Guide + Free Template' },
      { property: 'og:description', content: 'Step-by-step guide to writing a legal will in Kenya. Free template included.' },
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
      { name: 'twitter:title', content: 'How to Write a Will in Kenya - Complete Guide' },
      { name: 'twitter:description', content: 'Step-by-step guide to writing a legal will in Kenya. Free template included.' }
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
          name: 'How to Write a Will in Kenya - Complete Guide',
          description: 'Complete guide on how to write a legal will in Kenya',
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
              name: 'How to Write a Will Kenya',
              item: window.location.href
            }
          ]
        },
        {
          '@type': 'HowTo',
          name: 'How to Write a Legal Will in Kenya',
          description: 'Step-by-step guide to writing a legally valid will in Kenya',
          step: [
            {
              '@type': 'HowToStep',
              name: 'Gather Your Information',
              text: 'List all your assets, debts, and beneficiaries'
            },
            {
              '@type': 'HowToStep',
              name: 'Choose Your Executor',
              text: 'Select a trustworthy person to manage your estate'
            },
            {
              '@type': 'HowToStep',
              name: 'Draft Your Will',
              text: 'Write or type your will following the legal format'
            },
            {
              '@type': 'HowToStep',
              name: 'Sign Your Will',
              text: 'Sign the will in the presence of two independent witnesses'
            },
            {
              '@type': 'HowToStep',
              name: 'Store Your Will Safely',
              text: 'Keep the will in a secure location and inform your executor'
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
    { id: 'what-is-will', title: 'What is a Will' },
    { id: 'legal-requirements', title: 'Legal Requirements' },
    { id: 'who-can-write', title: 'Who Can Write' },
    { id: 'step-by-step', title: 'Step-by-Step Guide' },
    { id: 'choosing-executor', title: 'Choosing Executor' },
    { id: 'witness-rules', title: 'Witness Rules' },
    { id: 'storing-will', title: 'Storing Your Will' },
    { id: 'common-mistakes', title: 'Common Mistakes' },
    { id: 'hire-lawyer', title: 'When to Hire Lawyer' },
    { id: 'template', title: 'Free Template' },
    { id: 'estate-planning', title: 'Estate Planning' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
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
            <li>
              <Link to="/succession-inheritance-law-kenya" className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
                Succession Law
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-700 font-medium">How to Write a Will</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 text-white py-12 sm:py-20 px-3 sm:px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className={`max-w-7xl mx-auto relative z-10 transition-all duration-1000 px-0 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center mb-6">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl mr-4 shadow-xl">
              <PenTool className="w-12 h-12" />
            </div>
            <div>
              <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-green-100">
                How to Write a Will in Kenya
              </h1>
              <p className="text-lg md:text-xl opacity-90 mt-2">Complete Legal Guide + Free Template</p>
            </div>
          </div>
          <p className="text-xl md:text-2xl opacity-95 max-w-4xl leading-relaxed mb-6">
            Step-by-step guide to writing a legally valid will in Kenya. Protect your family, control your legacy, and ensure your wishes are honored. <span className="font-semibold text-yellow-300">Updated 2026.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`https://wa.me/254112810203?text=${encodeURIComponent('Hello! I need help writing a will in Kenya. Please guide me through the process.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 text-sm sm:text-base"
              aria-label="Get help writing your will on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              WhatsApp Guidance
            </a>
            <a
              href={`mailto:johnsonthuraniramwangi@gmail.com?subject=${encodeURIComponent('Will Writing Assistance')}&body=${encodeURIComponent('Hello,\n\nI need professional assistance with writing my will in Kenya.\n\nPlease contact me to discuss:\n- Will drafting\n- Estate planning\n- Executor selection\n\nThank you.')}`}
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl border border-white/30 shadow-lg transition-all duration-300 hover:scale-105 text-sm sm:text-base"
              aria-label="Email for will writing assistance"
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
            <BookOpen className="w-5 h-5 text-green-600 flex-shrink-0" />
            <span className="text-sm font-semibold text-gray-700 flex-shrink-0">Quick Jump:</span>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
              {tableOfContents.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`text-xs px-3 py-1 rounded-full whitespace-nowrap transition-all duration-200 ${
                    activeSection === item.id
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-green-100'
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
        
        {/* Section 1: What is a Will */}
        <section id="what-is-will" className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200">
            <div className="flex items-start mb-6">
              <div className="bg-green-100 p-3 rounded-xl mr-4">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">What is a Will and Why It Matters</h2>
                <p className="text-gray-600">Understanding the importance of estate planning</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                A will is a legal document in which you (the testator) state how you want your property, assets, and estate to be distributed after your death. It is one of the most important documents you will ever create, giving you control over your legacy and ensuring your loved ones are provided for.
              </p>

              <p className="text-gray-700 leading-relaxed mb-6">
                In Kenya, wills are governed by the <strong>Law of Succession Act (Cap 160)</strong>, which sets out the rules for making, witnessing, and executing wills. A properly drafted will ensures that your wishes are honored and can prevent family disputes after your death.
              </p>

              <div className="bg-green-50 border-l-4 border-green-600 p-6 my-6 rounded-r-lg">
                <h3 className="font-bold text-lg text-green-900 mb-3 flex items-center">
                  <Heart className="w-5 h-5 mr-2" />
                  Why You Need a Will
                </h3>
                <ul className="space-y-2 text-gray-800">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span><strong>Control:</strong> You decide who inherits your property, not the government.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span><strong>Family Protection:</strong> Ensure your spouse, children, and dependants are provided for.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span><strong>Minimize Disputes:</strong> Clear instructions reduce family conflicts and legal battles.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span><strong>Executor Choice:</strong> Select who will manage your estate and carry out your wishes.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span><strong>Guardian for Children:</strong> Appoint guardians for minor children if both parents die.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span><strong>Tax Planning:</strong> Potentially reduce estate taxes and maximize inheritance.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span><strong>Funeral Wishes:</strong> State your preferences for burial or cremation.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 my-6 rounded-r-lg">
                <h3 className="font-bold text-lg text-yellow-900 mb-3 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  What Happens Without a Will?
                </h3>
                <p className="text-gray-700 mb-3">
                  If you die without a will (intestate), the Law of Succession Act determines how your estate is distributed. The court appoints an administrator, and your property goes to your spouse and children according to strict statutory rules that may not reflect your wishes.
                </p>
                <p className="text-gray-700">
                  Intestate succession can lead to delays, family disputes, and unintended beneficiaries. It's especially problematic if you have specific wishes, complex family situations, or want to provide for non-relatives.
                </p>
              </div>

              <div className="mt-6">
                <Link
                  to="/succession-inheritance-law-kenya"
                  className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold transition-colors duration-200"
                >
                  <Scale className="w-5 h-5" />
                  Learn More About Succession Law in Kenya →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Legal Requirements */}
        <section id="legal-requirements" className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200">
            <div className="flex items-start mb-6">
              <div className="bg-blue-100 p-3 rounded-xl mr-4">
                <Scale className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Legal Requirements for a Valid Will in Kenya</h2>
                <p className="text-gray-600">Essential elements every will must have</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                For a will to be legally valid and enforceable in Kenya, it must meet specific requirements set out in the Law of Succession Act. Failure to meet any of these requirements can result in the will being declared invalid.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="font-bold text-lg text-blue-900 mb-4 flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Mandatory Requirements
                  </h3>
                  <ul className="space-y-3 text-gray-800">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2 font-bold">1.</span>
                      <div>
                        <strong>In Writing:</strong> The will must be in written form (typed or handwritten). Oral wills are generally not valid except in limited circumstances.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2 font-bold">2.</span>
                      <div>
                        <strong>Signed by Testator:</strong> You must sign the will at the end. If unable to sign, you may use a thumbprint or have someone sign on your behalf in your presence.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2 font-bold">3.</span>
                      <div>
                        <strong>Two Witnesses:</strong> At least two independent witnesses must be present when you sign and must also sign the will.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2 font-bold">4.</span>
                      <div>
                        <strong>Age 18+:</strong> You must be at least 18 years old to make a valid will.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2 font-bold">5.</span>
                      <div>
                        <strong>Sound Mind:</strong> You must have testamentary capacity (understand what you're doing and the consequences).
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <h3 className="font-bold text-lg text-green-900 mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Additional Best Practices
                  </h3>
                  <ul className="space-y-3 text-gray-800">
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                      <div>
                        <strong>Date Your Will:</strong> Include the date of signing to establish which will is most recent.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                      <div>
                        <strong>Revocation Clause:</strong> State that this will revokes all previous wills and codicils.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                      <div>
                        <strong>Clear Language:</strong> Use simple, unambiguous language to avoid misinterpretation.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                      <div>
                        <strong>Proper Identification:</strong> Include your full name, ID number, and address.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                      <div>
                        <strong>No Alterations:</strong> Avoid crossing out or altering the will after signing. Make a new will instead.
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
                <h3 className="font-bold text-lg text-red-900 mb-3 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  What Makes a Will Invalid
                </h3>
                <ul className="space-y-2 text-gray-800">
                  <li className="flex items-start">
                    <span className="mr-2">✗</span>
                    <span>Not signed by the testator or witnesses</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✗</span>
                    <span>Witnesses are beneficiaries or spouses of beneficiaries</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✗</span>
                    <span>Made by someone under 18 or not of sound mind</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✗</span>
                    <span>Made under duress, fraud, or undue influence</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✗</span>
                    <span>Extensive alterations or erasures after signing</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Who Can Write a Will */}
        <section id="who-can-write" className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200">
            <div className="flex items-start mb-6">
              <div className="bg-purple-100 p-3 rounded-xl mr-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Who Can Write a Will in Kenya?</h2>
                <p className="text-gray-600">Eligibility and testamentary capacity</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                Not everyone can make a legally valid will in Kenya. The law requires that the will-maker (testator) meets certain criteria to ensure they understand the nature and consequences of their decisions.
              </p>

              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200 mb-6">
                <h3 className="font-bold text-xl text-purple-900 mb-4">Eligibility Criteria</h3>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-5 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                      <CheckCircle2 className="w-5 h-5 text-purple-600 mr-2" />
                      1. Age Requirement (18+ Years)
                    </h4>
                    <p className="text-gray-700">
                      You must be at least 18 years old to make a valid will in Kenya. Minors (under 18) cannot make wills except in very limited circumstances (e.g., members of armed forces on active service).
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                      <CheckCircle2 className="w-5 h-5 text-purple-600 mr-2" />
                      2. Sound Mind (Testamentary Capacity)
                    </h4>
                    <p className="text-gray-700 mb-3">
                      You must be of sound mind when making your will. This means you must:
                    </p>
                    <ul className="space-y-1 text-gray-700 ml-6">
                      <li>• Understand that you are making a will</li>
                      <li>• Know the nature and extent of your property</li>
                      <li>• Know who your natural beneficiaries are (family, dependants)</li>
                      <li>• Understand the effect of your decisions</li>
                      <li>• Be free from delusions affecting your judgment</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                      <CheckCircle2 className="w-5 h-5 text-purple-600 mr-2" />
                      3. Free Will (No Undue Influence)
                    </h4>
                    <p className="text-gray-700">
                      You must make your will voluntarily, free from pressure, coercion, or manipulation by others. Wills made under duress or undue influence are invalid.
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-5 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                      <CheckCircle2 className="w-5 h-5 text-purple-600 mr-2" />
                      4. No Fraud or Misrepresentation
                    </h4>
                    <p className="text-gray-700">
                      The will must be genuine and made with full knowledge of the facts. Wills obtained through fraud, forgery, or misrepresentation are void.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg">
                <h3 className="font-bold text-lg text-yellow-900 mb-3">Special Circumstances</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span><strong>Blind or Illiterate Persons:</strong> Can make wills if the will is read to them in a language they understand and they acknowledge it as their will in the presence of witnesses.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span><strong>Physically Disabled:</strong> If unable to sign, can use a thumbprint or have someone sign on their behalf in their presence and at their direction.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span><strong>Mental Illness:</strong> Persons with mental illness can make valid wills during lucid intervals when they have testamentary capacity.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Step-by-Step Guide */}
        <section id="step-by-step" className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200">
            <div className="flex items-start mb-6">
              <div className="bg-orange-100 p-3 rounded-xl mr-4">
                <ScrollText className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Step-by-Step Guide to Writing Your Will</h2>
                <p className="text-gray-600">Complete process from start to finish</p>
              </div>
            </div>

            <div className="space-y-6">
              {[
                {
                  step: 1,
                  title: 'Make a List of Your Assets',
                  description: 'Compile a comprehensive inventory of everything you own: land, houses, bank accounts, investments, vehicles, business interests, jewelry, household items, and any other valuable property. Include details like title deeds, account numbers, and estimated values.',
                  icon: <Landmark className="w-6 h-6" />
                },
                {
                  step: 2,
                  title: 'List Your Debts and Obligations',
                  description: 'Document all your debts: mortgages, loans, credit cards, and any money owed to others. Your estate will need to pay these before distributing assets to beneficiaries.',
                  icon: <FileText className="w-6 h-6" />
                },
                {
                  step: 3,
                  title: 'Identify Your Beneficiaries',
                  description: 'Decide who will inherit your property. List your spouse, children, parents, other relatives, friends, or charitable organizations. Be specific with full names and relationships. Consider contingent beneficiaries in case primary beneficiaries predecease you.',
                  icon: <Users className="w-6 h-6" />
                },
                {
                  step: 4,
                  title: 'Decide How to Distribute Your Estate',
                  description: 'Determine what each beneficiary will receive. You can give specific items (e.g., "my car to my son John") or percentages of your estate (e.g., "40% to my wife, 60% divided equally among my children"). Ensure all dependants receive reasonable provision.',
                  icon: <Heart className="w-6 h-6" />
                },
                {
                  step: 5,
                  title: 'Choose Your Executor(s)',
                  description: 'Select one or more trustworthy individuals to manage your estate and carry out your will. This should be someone responsible, organized, and capable. You can choose family members, friends, or professional executors. Name alternates in case your first choice cannot serve.',
                  icon: <Briefcase className="w-6 h-6" />
                },
                {
                  step: 6,
                  title: 'Appoint Guardians for Minor Children',
                  description: 'If you have children under 18, name guardians who will care for them if both parents die. Choose people who share your values and are willing and able to take on this responsibility.',
                  icon: <Shield className="w-6 h-6" />
                },
                {
                  step: 7,
                  title: 'Draft Your Will',
                  description: 'Write or type your will using clear, simple language. Follow the standard will format (see template section below). Include: your identification, revocation of previous wills, executor appointment, asset distribution, guardian appointment (if applicable), signature section for you and witnesses.',
                  icon: <PenTool className="w-6 h-6" />
                },
                {
                  step: 8,
                  title: 'Review and Revise',
                  description: 'Carefully review your draft will. Check for clarity, completeness, and accuracy. Ensure all names, relationships, and descriptions are correct. Consider having a lawyer review it, especially for complex estates.',
                  icon: <Eye className="w-6 h-6" />
                },
                {
                  step: 9,
                  title: 'Sign Your Will with Witnesses',
                  description: 'Gather two independent witnesses (not beneficiaries). In their presence, sign the will at the end. The witnesses must then sign the will in your presence and in each other\'s presence. All signatures should be on the same day.',
                  icon: <CheckCircle2 className="w-6 h-6" />
                },
                {
                  step: 10,
                  title: 'Store Your Will Safely',
                  description: 'Keep your will in a secure, accessible location. Options include: with your lawyer, in a bank safe deposit box, in a fireproof safe at home, or with your executor. Inform your executor where the will is kept.',
                  icon: <Download className="w-6 h-6" />
                }
              ].map((item) => (
                <div key={item.step} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-start">
                    <div className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <span className="text-green-600">{item.icon}</span>
                        {item.title}
                      </h3>
                      <p className="text-gray-700">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-6">
              <h3 className="font-bold text-lg text-blue-900 mb-3 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                How Long Does It Take?
              </h3>
              <p className="text-gray-700">
                Writing a simple will can take as little as <strong>1-2 hours</strong> if you have all your information ready. Complex estates may require several days of planning and drafting. The important thing is to start now and update your will regularly.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Choosing Executor */}
        <section id="choosing-executor" className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200">
            <div className="flex items-start mb-6">
              <div className="bg-indigo-100 p-3 rounded-xl mr-4">
                <Briefcase className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Choosing an Executor or Trustee</h2>
                <p className="text-gray-600">Selecting the right person to manage your estate</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                Your executor (also called an estate administrator or trustee) is the person responsible for carrying out the instructions in your will, managing your estate, and ensuring your beneficiaries receive their inheritance. Choosing the right executor is one of the most important decisions you'll make when writing your will.
              </p>

              <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200 mb-6">
                <h3 className="font-bold text-lg text-indigo-900 mb-4">Executor's Key Responsibilities</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 mr-2 mt-1 flex-shrink-0" />
                    <span>Apply for grant of probate from the High Court</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 mr-2 mt-1 flex-shrink-0" />
                    <span>Locate and secure all estate assets</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 mr-2 mt-1 flex-shrink-0" />
                    <span>Pay all debts, taxes, and funeral expenses</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 mr-2 mt-1 flex-shrink-0" />
                    <span>Distribute assets to beneficiaries according to your will</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 mr-2 mt-1 flex-shrink-0" />
                    <span>Maintain accurate estate accounts and file reports with the court</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 mr-2 mt-1 flex-shrink-0" />
                    <span>Resolve disputes among beneficiaries</span>
                  </li>
                </ul>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <h3 className="font-bold text-lg text-green-900 mb-4 flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Good Executor Qualities
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>Trustworthy and honest</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>Organized and detail-oriented</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>Financially responsible</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>Good communicator</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>Lives near you (or can travel)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>Available and willing to serve</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>Impartial and fair to all beneficiaries</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                  <h3 className="font-bold text-lg text-orange-900 mb-4 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Who Can You Choose?
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span><strong>Spouse or Partner:</strong> Most common choice, but consider age and health</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span><strong>Adult Children:</strong> Good if mature and responsible</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span><strong>Close Friend:</strong> May be less emotionally involved</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span><strong>Lawyer or Accountant:</strong> Professional expertise but fees apply</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span><strong>Trust Company:</strong> For very large or complex estates</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span><strong>Multiple Executors:</strong> Can appoint 2-3 to work together</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg">
                <h3 className="font-bold text-lg text-yellow-900 mb-3">Important Tips</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span><strong>Ask First:</strong> Confirm that your chosen executor is willing to serve before naming them in your will.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span><strong>Name Alternates:</strong> Always name backup executors in case your first choice cannot or will not serve.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span><strong>Consider Age:</strong> Choose someone younger than you who will likely survive you and be capable of handling the estate.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span><strong>Professional Help:</strong> Executors can hire lawyers, accountants, and other professionals to help them, with costs paid from the estate.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Witness Rules */}
        <section id="witness-rules" className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200">
            <div className="flex items-start mb-6">
              <div className="bg-red-100 p-3 rounded-xl mr-4">
                <Eye className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Witness Rules and Signing Requirements</h2>
                <p className="text-gray-600">Critical requirements for valid execution</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                Proper witnessing is absolutely essential for a valid will. Many wills are rejected by courts because of witnessing errors. Follow these rules carefully to ensure your will is legally enforceable.
              </p>

              <div className="bg-red-50 border-l-4 border-red-600 p-6 my-6 rounded-r-lg">
                <h3 className="font-bold text-lg text-red-900 mb-3 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Critical Rule: Witnesses Cannot Be Beneficiaries
                </h3>
                <p className="text-gray-700 mb-3">
                  <strong>A witness who benefits from the will (or their spouse) will FORFEIT their inheritance.</strong> This is the most common mistake that invalidates bequests. Your witnesses must be completely independent.
                </p>
                <p className="text-gray-700">
                  Example: If you name your son as a witness, he will lose any inheritance you left him in the will. If your witness's wife is a beneficiary, she will also forfeit her share.
                </p>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-6">
                <h3 className="font-bold text-xl text-blue-900 mb-4">Who Can Be a Witness?</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-green-900 mb-3 flex items-center">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mr-2" />
                      Acceptable Witnesses
                    </h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>Friends (not beneficiaries)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>Neighbors</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                      <span>Colleagues or co-workers</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>Your lawyer or accountant</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>Any adult 18+ of sound mind</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-red-900 mb-3 flex items-center">
                      <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                      Unacceptable Witnesses
                    </h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-red-600 mr-2">✗</span>
                        <span>Beneficiaries named in the will</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-600 mr-2">✗</span>
                        <span>Spouses of beneficiaries</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-600 mr-2">✗</span>
                        <span>Minors (under 18)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-600 mr-2">✗</span>
                        <span>Blind or mentally incapacitated persons</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-600 mr-2">✗</span>
                        <span>Your executor (not recommended but not illegal)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200 mb-6">
                <h3 className="font-bold text-xl text-indigo-900 mb-4">Proper Signing Procedure</h3>
                
                <ol className="space-y-4">
                  <li className="flex items-start">
                    <span className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">1</span>
                    <div>
                      <strong className="text-gray-900">Gather Your Witnesses:</strong>
                      <p className="text-gray-700">Bring together two independent witnesses. All three of you (testator + 2 witnesses) must be present together.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">2</span>
                    <div>
                      <strong className="text-gray-900">Declare This is Your Will:</strong>
                      <p className="text-gray-700">Tell the witnesses that the document is your will and that you are about to sign it. You don't need to disclose its contents.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">3</span>
                    <div>
                      <strong className="text-gray-900">Sign the Will:</strong>
                      <p className="text-gray-700">Sign the will at the end in the presence of both witnesses. Use your normal signature.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">4</span>
                    <div>
                      <strong className="text-gray-900">Witnesses Sign:</strong>
                      <p className="text-gray-700">Each witness signs the will in your presence and in the presence of the other witness. They should also write their full names, addresses, and occupations.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">5</span>
                    <div>
                      <strong className="text-gray-900">Same Day Signing:</strong>
                      <p className="text-gray-700">All signatures (yours and both witnesses) should be completed on the same day in one sitting.</p>
                    </div>
                  </li>
                </ol>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h3 className="font-bold text-lg text-green-900 mb-3">Attestation Clause</h3>
                <p className="text-gray-700 mb-3">
                  Include an attestation clause after the signatures stating that the witnesses saw you sign and that you appeared to be of sound mind. Example:
                </p>
                <div className="bg-white p-4 rounded border border-gray-300 text-sm text-gray-800 font-mono">
                  "Signed by the testator [Your Name] in our presence, and by us in the presence of the testator and each other."
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sections 7-11 would continue here with similar structure... */}
        {/* For brevity, I'll add a condensed version of the remaining sections */}

        {/* Section 7: Storing Will */}
        <section id="storing-will" className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200">
            <div className="flex items-start mb-6">
              <div className="bg-teal-100 p-3 rounded-xl mr-4">
                <Download className="w-8 h-8 text-teal-600" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Registering or Safely Storing Your Will</h2>
                <p className="text-gray-600">Keeping your will secure and accessible</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                In Kenya, registering a will is <strong>not mandatory</strong>, but storing it safely is crucial. A lost will can result in intestate succession, defeating the purpose of writing one. Here are the best storage options:
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-teal-50 rounded-xl p-6 border border-teal-200">
                  <h3 className="font-bold text-lg text-teal-900 mb-4">Storage Options</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-teal-600 mr-2 mt-1 flex-shrink-0" />
                      <div>
                        <strong>With Your Lawyer:</strong> Safest option. Lawyers typically store wills free of charge.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-teal-600 mr-2 mt-1 flex-shrink-0" />
                      <div>
                        <strong>Bank Safe Deposit Box:</strong> Secure but may be difficult to access after death.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-teal-600 mr-2 mt-1 flex-shrink-0" />
                      <div>
                        <strong>Fireproof Safe at Home:</strong> Accessible but ensure executor knows the location and combination.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-teal-600 mr-2 mt-1 flex-shrink-0" />
                      <div>
                        <strong>With Your Executor:</strong> Practical if you trust them completely.
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                  <h3 className="font-bold text-lg text-red-900 mb-4">What NOT to Do</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-1 flex-shrink-0" />
                      <div>
                        Don't keep it in a sealed safe deposit box that requires a court order to open
                      </div>
                    </li>
                    <li className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-1 flex-shrink-0" />
                      <div>
                        Don't hide it where no one can find it
                      </div>
                    </li>
                    <li className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-1 flex-shrink-0" />
                      <div>
                        Don't give the only copy to a beneficiary (potential for tampering)
                      </div>
                    </li>
                    <li className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-1 flex-shrink-0" />
                      <div>
                        Don't keep it in a place subject to damage (fire, water, pests)
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-bold text-lg text-blue-900 mb-3">Best Practice</h3>
                <p className="text-gray-700 mb-3">
                  Keep the original will with your lawyer or in a secure location, and give copies (clearly marked as copies) to your executor and close family members. Create a document that lists:
                </p>
                <ul className="space-y-1 text-gray-700 ml-6">
                  <li>• Where the original will is stored</li>
                  <li>• Contact information for your lawyer</li>
                  <li>• Contact information for your executor</li>
                  <li>• List of your major assets and account details</li>
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
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Common Mistakes That Make Wills Invalid</h2>
                <p className="text-gray-600">Avoid these critical errors</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  mistake: 'Beneficiaries as Witnesses',
                  consequence: 'Beneficiary forfeits their inheritance',
                  fix: 'Use completely independent witnesses'
                },
                {
                  mistake: 'No Witness Signatures',
                  consequence: 'Will is invalid and unenforceable',
                  fix: 'Ensure two witnesses sign in your presence'
                },
                {
                  mistake: 'Alterations After Signing',
                  consequence: 'Altered portions are invalid',
                  fix: 'Write a new will instead of making changes'
                },
                {
                  mistake: 'Ambiguous Language',
                  consequence: 'Disputes and court interpretation needed',
                  fix: 'Use clear, specific descriptions'
                },
                {
                  mistake: 'Forgetting Dependants',
                  consequence: 'Court may vary the will to provide for them',
                  fix: 'Provide reasonable provision for all dependants'
                },
                {
                  mistake: 'Not Updating After Major Life Events',
                  consequence: 'Will doesn\'t reflect current wishes',
                  fix: 'Review and update every 3-5 years'
                }
              ].map((item, index) => (
                <div key={index} className="bg-red-50 rounded-xl p-6 border border-red-200">
                  <h3 className="font-bold text-lg text-red-900 mb-2 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    {item.mistake}
                  </h3>
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-gray-700">Consequence:</p>
                    <p className="text-gray-700">{item.consequence}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">How to Fix:</p>
                    <p className="text-gray-700">{item.fix}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 9: When to Hire a Lawyer */}
        <section id="hire-lawyer" className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200">
            <div className="flex items-start mb-6">
              <div className="bg-purple-100 p-3 rounded-xl mr-4">
                <Briefcase className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">When You Should Hire a Lawyer</h2>
                <p className="text-gray-600">Professional help for complex situations</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                While you can write your own will, there are situations where professional legal assistance is highly recommended or essential:
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                  <h3 className="font-bold text-lg text-red-900 mb-4">When Legal Help is Essential</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-1 flex-shrink-0" />
                      <span>You have a large or complex estate (multiple properties, businesses, international assets)</span>
                    </li>
                    <li className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-1 flex-shrink-0" />
                      <span>You want to set up trusts for minors or special needs beneficiaries</span>
                    </li>
                    <li className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-1 flex-shrink-0" />
                      <span>You have complicated family situations (multiple marriages, estranged children)</span>
                    </li>
                    <li className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-1 flex-shrink-0" />
                      <span>You want to minimize estate taxes</span>
                    </li>
                    <li className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-1 flex-shrink-0" />
                      <span>You expect disputes among beneficiaries</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <h3 className="font-bold text-lg text-green-900 mb-4">DIY is Usually Fine When</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                      <span>You have a simple estate (one home, bank accounts)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                      <span>You're leaving everything to your spouse and children</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                      <span>You have no concerns about disputes</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                      <span>Your family situation is straightforward</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                      <span>You're confident in following the legal requirements</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
                <h3 className="font-bold text-lg text-indigo-900 mb-3">Cost of Professional Will Drafting</h3>
                <p className="text-gray-700 mb-4">
                  Lawyers typically charge <strong>KES 5,000 to KES 50,000</strong> for will drafting depending on complexity. Many offer:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>• Free will drafting if you use them for property transactions</li>
                  <li>• Fixed-fee packages for standard wills</li>
                  <li>• Estate planning consultations (KES 10,000 - 30,000)</li>
                </ul>
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <a
                    href={`https://wa.me/254112810203?text=${encodeURIComponent('Hello! I need a lawyer to help me write my will. Please advise on costs and services.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Get Legal Help
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 10: Free Template */}
        <section id="template" className="mb-16">
          <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl shadow-xl p-6 md:p-10 border-2 border-green-300">
            <div className="flex items-start mb-6">
              <div className="bg-green-600 text-white p-3 rounded-xl mr-4">
                <Download className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Sample Will Format & Free Download Template</h2>
                <p className="text-gray-700">Use this format as a starting point for your will</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 md:p-8 border border-gray-300 mb-6">
              <h3 className="font-bold text-2xl text-gray-900 mb-6 text-center">LAST WILL AND TESTAMENT</h3>
              
              <div className="space-y-6 text-gray-800 font-serif text-sm md:text-base">
                <div>
                  <p className="font-bold mb-2">I, [YOUR FULL NAME], of ID Number [YOUR ID NUMBER], residing at [YOUR ADDRESS],</p>
                  <p>being of sound mind and disposing memory, do hereby make, publish, and declare this to be my Last Will and Testament, hereby revoking all former Wills and Codicils made by me.</p>
                </div>

                <div>
                  <p className="font-bold mb-2">1. EXECUTOR</p>
                  <p>I appoint [EXECUTOR NAME], of ID Number [EXECUTOR ID], residing at [EXECUTOR ADDRESS], to be the Executor of this my Will. If [EXECUTOR NAME] is unable or unwilling to act, I appoint [ALTERNATE EXECUTOR NAME] as alternate Executor.</p>
                </div>

                <div>
                  <p className="font-bold mb-2">2. PAYMENT OF DEBTS</p>
                  <p>I direct my Executor to pay all my just debts, funeral expenses, and testamentary expenses as soon as practicable after my death.</p>
                </div>

                <div>
                  <p className="font-bold mb-2">3. SPECIFIC BEQUESTS</p>
                  <p>I give, devise, and bequeath the following specific gifts:</p>
                  <ul className="list-disc ml-8 mt-2 space-y-1">
                    <li>To [BENEFICIARY NAME], my [DESCRIPTION OF PROPERTY/ASSET]</li>
                    <li>To [BENEFICIARY NAME], my [DESCRIPTION OF PROPERTY/ASSET]</li>
                  </ul>
                </div>

                <div>
                  <p className="font-bold mb-2">4. RESIDUARY ESTATE</p>
                  <p>I give, devise, and bequeath all the rest, residue, and remainder of my estate, both real and personal, of whatsoever nature and wheresoever situated, to:</p>
                  <ul className="list-disc ml-8 mt-2 space-y-1">
                    <li>[BENEFICIARY NAME] - [PERCENTAGE]%</li>
                    <li>[BENEFICIARY NAME] - [PERCENTAGE]%</li>
                  </ul>
                </div>

                <div>
                  <p className="font-bold mb-2">5. GUARDIANSHIP (if applicable)</p>
                  <p>If my spouse predeceases me, I appoint [GUARDIAN NAME] to be the guardian of my minor children.</p>
                </div>

                <div className="pt-6 border-t border-gray-300">
                  <p className="mb-6">IN WITNESS WHEREOF, I have signed this Will on this _____ day of ____________, 20___.</p>
                  
                  <div className="space-y-8">
                    <div>
                      <p>______________________________</p>
                      <p className="text-sm">[YOUR NAME] - Testator</p>
                    </div>

                    <div>
                      <p className="font-bold mb-3">SIGNED by the above-named Testator in our presence, and by us in the presence of the Testator and each other:</p>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <p className="font-semibold mb-2">Witness 1:</p>
                          <p>Signature: ______________________________</p>
                          <p>Name: ______________________________</p>
                          <p>ID Number: ______________________________</p>
                          <p>Address: ______________________________</p>
                          <p>Occupation: ______________________________</p>
                        </div>
                        <div>
                          <p className="font-semibold mb-2">Witness 2:</p>
                          <p>Signature: ______________________________</p>
                          <p>Name: ______________________________</p>
                          <p>ID Number: ______________________________</p>
                          <p>Address: ______________________________</p>
                          <p>Occupation: ______________________________</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg mb-6">
              <h3 className="font-bold text-lg text-yellow-900 mb-3 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Important Notes
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Fill in all bracketed sections with your information</li>
                <li>• Customize the specific bequests and residuary estate sections to match your wishes</li>
                <li>• Ensure witnesses are NOT beneficiaries</li>
                <li>• All signatures must be completed on the same day</li>
                <li>• Keep the original in a safe place</li>
                <li>• This is a basic template - consult a lawyer for complex estates</li>
              </ul>
            </div>

            <div className="text-center">
              <button className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 text-lg">
                <Download className="w-6 h-6" />
                Download Will Template (PDF)
              </button>
              <p className="text-sm text-gray-600 mt-3">Free to download and use</p>
            </div>
          </div>
        </section>

        {/* Section 11: Estate Planning Tips */}
        <section id="estate-planning" className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200">
            <div className="flex items-start mb-6">
              <div className="bg-blue-100 p-3 rounded-xl mr-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Estate Planning Tips</h2>
                <p className="text-gray-600">Protecting your legacy and your family</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Review Every 3-5 Years',
                  description: 'Update your will after major life events: marriage, divorce, births, deaths, or significant asset changes.',
                  icon: <Clock className="w-6 h-6" />
                },
                {
                  title: 'Keep Asset Records Updated',
                  description: 'Maintain a current list of all assets, bank accounts, investments, and property with account numbers.',
                  icon: <FileText className="w-6 h-6" />
                },
                {
                  title: 'Communicate with Family',
                  description: 'Discuss your estate plan with family to manage expectations and reduce post-death disputes.',
                  icon: <Users className="w-6 h-6" />
                },
                {
                  title: 'Consider Joint Ownership',
                  description: 'Joint ownership can help some assets pass directly to survivors outside succession proceedings.',
                  icon: <Heart className="w-6 h-6" />
                },
                {
                  title: 'Plan for Taxes',
                  description: 'Understand estate and inheritance tax implications. Professional advice can minimize tax burden.',
                  icon: <Scale className="w-6 h-6" />
                },
                {
                  title: 'Protect Business Interests',
                  description: 'If you own a business, create a succession plan to ensure continuity and protect its value.',
                  icon: <Briefcase className="w-6 h-6" />
                }
              ].map((tip, index) => (
                <div key={index} className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <div className="text-blue-600 mb-3">{tip.icon}</div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{tip.title}</h3>
                  <p className="text-gray-700 text-sm">{tip.description}</p>
                </div>
              ))}
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mt-6">
              <h3 className="font-bold text-lg text-green-900 mb-3">Comprehensive Estate Planning</h3>
              <p className="text-gray-700 mb-4">
                A complete estate plan goes beyond just writing a will. Consider also:
              </p>
              <ul className="grid md:grid-cols-2 gap-3 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Power of attorney for financial decisions</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Medical directives and living wills</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Life insurance policies</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Trusts for asset protection</span>
                </li>
              </ul>
              <div className="mt-4">
                <Link
                  to="/succession-inheritance-law-kenya"
                  className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold"
                >
                  Learn More About Succession Planning →
                </Link>
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
                to="/succession-inheritance-law-kenya"
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 group"
              >
                <Scale className="w-10 h-10 text-indigo-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg text-gray-900 mb-2">Succession & Inheritance Law</h3>
                <p className="text-gray-600 text-sm">Complete guide to estate distribution in Kenya</p>
              </Link>

              <Link
                to="/letters-of-administration-probate-kenya"
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 group"
              >
                <FileText className="w-10 h-10 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg text-gray-900 mb-2">Letters of Administration & Probate</h3>
                <p className="text-gray-600 text-sm">Court procedures after death</p>
              </Link>

              <Link
                to="/family-law-divorce-kenya"
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 group"
              >
                <Heart className="w-10 h-10 text-pink-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg text-gray-900 mb-2">Family Law</h3>
                <p className="text-gray-600 text-sm">Marriage, divorce, and family rights</p>
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
                      <ChevronUp className="w-5 h-5 text-green-600 flex-shrink-0" />
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
          <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl shadow-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Write Your Will?</h2>
            <p className="text-xl opacity-95 mb-8 max-w-3xl mx-auto">
              Take control of your legacy today. Whether you need professional assistance or want to use our free template, protect your family's future now.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`https://wa.me/254112810203?text=${encodeURIComponent('Hello! I want to write my will. Please help me get started.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white text-green-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
              >
                <MessageCircle className="w-5 h-5" />
                Get Professional Help
              </a>
              <a
                href="#template"
                className="inline-flex items-center justify-center gap-2 bg-green-800 hover:bg-green-900 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Download className="w-5 h-5" />
                Use Free Template
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
            Will writing requirements can vary based on individual circumstances. Always consult with a qualified lawyer for specific legal matters.
          </p>
          <p className="text-gray-500 text-xs mt-4">
            © 2026 Wakili Legal Services. All rights reserved. | Updated February 2026
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HowToWriteWillKenya;
