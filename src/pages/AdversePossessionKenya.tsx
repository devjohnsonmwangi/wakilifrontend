import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  FileCheck,
  Users,
  DollarSign,
  Shield,
  Phone,
  ArrowRight,
  Gavel,
  Search,
  Eye,
  Lock,
  Briefcase,
  BookOpen,
  CheckCircle,
  MessageSquare,
  ScrollText,
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

// FAQ data moved outside component to avoid dependency issues
const faqsData: FAQItem[] = [
  {
    question: 'What is the difference between adverse possession and trespass?',
    answer:
      'Trespass is unauthorized entry onto someone\'s land without permission. Adverse possession is continuous occupation (12+ years) with the intent to own the land. Trespass is short-term unauthorized access; adverse possession is long-term occupation with a claim to ownership. Both are illegal if done without permission, but adverse possession MAY result in ownership if all conditions are met.',
  },
  {
    question: 'Can I claim adverse possession on registered land in Kenya?',
    answer:
      'NO. Adverse possession ONLY applies to unregistered land. Once land is registered with a title deed, adverse possession cannot be used to claim ownership. Kenya\'s Constitution and Land Act protect registered titles absolutely. This is a critical protection—registered land cannot be acquired through occupation alone, no matter how long.',
  },
  {
    question: 'What if I have occupied land for 12 years but the owner never noticed?',
    answer:
      'The occupation must be OPEN and NOTORIOUS (visible to everyone, not hidden). If you hid the occupation, it does not qualify. Additionally, you must prove all conditions: continuous occupation, exclusive use, without permission, and with intent to own. Secret occupation fails the test. The owner\'s lack of knowledge does not help your case.',
  },
  {
    question: 'Can an owner stop adverse possession by giving permission later?',
    answer:
      'No. If you\'ve occupied the land openly for 12 years without permission, the owner cannot later retroactively give permission to reset the clock. Once adverse possession is complete (12 years met), the rights are established. However, if the owner did give permission at any point during the occupation, the adverse possession claim fails.',
  },
  {
    question: 'How do I prove 12 years of continuous occupation in court?',
    answer:
      'Provide: Original occupation date (witness statements, photographs, community records), property improvement evidence (structures, gardens, utilities), tax/rate payment receipts showing occupation, neighbors\' testimony confirming your continuous presence, utility bills in your name, and any official correspondence showing occupation. Documentation gaps can weaken your case. Consistent evidence across multiple sources strengthens claims.',
  },
  {
    question: 'If I win an adverse possession case, can I get a title deed?',
    answer:
      'Yes. Once the court grants your adverse possession claim, you can apply to the Lands Registry for title registration. The court judgment is your legal proof of ownership. After registration, you receive a title deed. You then have absolute ownership rights and can sell, mortgage, or transfer the land.',
  },
  {
    question: 'What happens if the landowner sues me before 12 years is complete?',
    answer:
      'If sued before the 12-year period is complete, the adverse possession claim fails. The owner can obtain a court order for eviction/recovery of possession. The interrupted occupation breaks the continuity requirement. Starting over means another 12 years. Continuous occupation without legal interruption is essential.',
  },
  {
    question: 'Can multiple people combine their occupation periods to reach 12 years?',
    answer:
      'Possibly, if there is succession (e.g., parent occupies 8 years, then child continues for 4 years). The second occupier must prove they inherited the claim from the first and continued without interruption. However, independent occupiers cannot combine periods. Each person\'s claim stands alone. Succession requires clear documentation and proof of continuity.',
  },
  {
    question: 'Is adverse possession still valid in modern Kenya?',
    answer:
      'Adverse possession is RARE and increasingly difficult in modern Kenya due to: (1) Land Registration Act requiring registered titles (adverse possession only on unregistered land), (2) Constitutional protection of property rights, (3) Environmental and Land Court scrutiny, and (4) Digital land records making historical ownership clearer. However, it remains a legal doctrine on unregistered land if ALL conditions are strictly met.',
  },
  {
    question: 'Can I claim adverse possession on community/group land?',
    answer:
      'No. Community and group land has specific statutory protections. Adverse possession does not apply to communal holdings. These lands are held in trust for community members and have special legal status under the Land Act. Individual adverse possession claims against community land are invalid.',
  },
  {
    question: 'What is the statute of limitations for adverse possession in Kenya?',
    answer:
      'The Limitation of Actions Act sets 12 years as the period for adverse possession claims on unregistered land. After 12 years of meeting all conditions, the original owner\'s right to recover the land is barred (extinguished). This is not a guarantee of ownership—the occupier must still prove all conditions in court.',
  },
  {
    question: 'Can I prevent adverse possession by occasionally visiting my land?',
    answer:
      'Not if the occupier remains continuous and open. Occasional visits without asserting ownership do not stop adverse possession. To prevent it, you must: (1) Physically remove the occupier, (2) File a court case for recovery of possession, (3) Obtain an eviction order, or (4) Post legal notices. Passive tolerance allows adverse possession to mature.',
  },
  {
    question: 'What happens if there are competing adverse possession claims?',
    answer:
      'The person with the longest continuous, open, exclusive, and unauthorized occupation typically prevails. The court examines evidence for each claimant and awards the land to the one with the strongest claim (earliest start date, best documentation, longest continuity). The first person to meet all conditions wins.',
  },
  {
    question: 'Does paying property taxes on land mean I own it through adverse possession?',
    answer:
      'Not necessarily. Paying taxes alone does NOT establish adverse possession. All OTHER conditions must also be met: 12 years of continuous, open, exclusive, unauthorized occupation. Tax payment is supportive evidence but not sufficient alone. Court looks at the totality of circumstances.',
  },
  {
    question: 'Can I use adverse possession to claim government land?',
    answer:
      'Adverse possession generally does NOT apply to government or public land. Government land has special legal protections. Private individuals cannot claim government land through occupation. However, disputes over boundaries between government and private land may be resolved through the Environment and Land Court using different legal principles.',
  },
];

const AdversePossessionKenya: React.FC = () => {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState('what-is');

  useEffect(() => {
    document.title = 'Adverse Possession (Squatters\' Rights) in Kenya – Legal Guide 2026';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', 'Complete legal guide to adverse possession and squatters\' rights in Kenya. Learn 12-year requirement, Environment and Land Court process, and how to claim land.');
    }

    // Set meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', 'adverse possession kenya, squatters rights kenya, claim land 12 years, long occupation land rights, how to remove squatters, limitation of actions kenya, claim land by possession, environment and land court adverse possession, land ownership occupation');

    // Set canonical tag
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.href);

    // Set OpenGraph tags
    const ogTags = [
      { property: 'og:title', content: 'Adverse Possession (Squatters\' Rights) in Kenya – Complete Legal Guide 2026' },
      { property: 'og:description', content: 'Learn about adverse possession and squatters\' rights in Kenya. 12-year requirement, court process, and how to claim land through occupation.' },
      { property: 'og:type', content: 'article' },
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

    // Set Twitter Card tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Adverse Possession in Kenya – Squatters\' Rights Legal Guide 2026' },
      { name: 'twitter:description', content: 'Complete guide to adverse possession, squatters\' rights, and 12-year land claims in Kenya with court process explained.' }
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

    // Set robots meta
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
          name: 'Adverse Possession (Squatters\' Rights) in Kenya – Complete Legal Guide',
          description: 'Complete guide to adverse possession, squatters\' rights, and 12-year land claims in Kenya.',
          inLanguage: 'en-KE'
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: window.location.origin },
            { '@type': 'ListItem', position: 2, name: 'Land Law', item: `${window.location.origin}/land-laws` },
            { '@type': 'ListItem', position: 3, name: 'Adverse Possession', item: window.location.href }
          ]
        },
        {
          '@type': 'FAQPage',
          mainEntity: faqsData.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer
            }
          }))
        },
        {
          '@type': 'HowTo',
          name: 'How to Claim Land Through Adverse Possession in Kenya',
          step: [
            { '@type': 'HowToStep', text: 'Ensure land is unregistered and you have occupied it continuously for 12+ years.' },
            { '@type': 'HowToStep', text: 'Collect evidence: photographs, witness statements, utility bills, neighbors\' testimony.' },
            { '@type': 'HowToStep', text: 'Hire a qualified advocate to prepare your adverse possession case.' },
            { '@type': 'HowToStep', text: 'File claim at Environment and Land Court with all supporting evidence.' },
            { '@type': 'HowToStep', text: 'Attend court hearings and provide testimony.' },
            { '@type': 'HowToStep', text: 'If judgment is in your favor, apply for title registration at Lands Registry.' }
          ]
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
  }, []);

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const sections = [
    { id: 'what-is', label: 'What is Adverse Possession', icon: <AlertTriangle className="w-5 h-5" /> },
    { id: 'legal-basis', label: 'Legal Basis', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'squatters-rights', label: 'Squatters\' Rights', icon: <Users className="w-5 h-5" /> },
    { id: 'conditions', label: 'Required Conditions', icon: <CheckCircle className="w-5 h-5" /> },
    { id: 'claiming', label: 'How to Claim', icon: <FileCheck className="w-5 h-5" /> },
    { id: 'prevent', label: 'Prevention Steps', icon: <Shield className="w-5 h-5" /> },
    { id: 'documents', label: 'Documents & Evidence', icon: <Briefcase className="w-5 h-5" /> },
    { id: 'court-process', label: 'Court Process', icon: <Gavel className="w-5 h-5" /> },
    { id: 'examples', label: 'Real-Life Examples', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'myths', label: 'Common Myths', icon: <Eye className="w-5 h-5" /> },
    { id: 'costs', label: 'Costs & Timelines', icon: <DollarSign className="w-5 h-5" /> },
    { id: 'faqs', label: 'FAQs', icon: <Briefcase className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white py-12 sm:py-16 md:py-20 px-2 sm:px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-6 h-6 md:w-8 md:h-8" />
            <span className="text-sm md:text-base font-semibold text-purple-100">Kenya Legal Authority</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Adverse Possession (Squatters' Rights) in Kenya
          </h1>
          <p className="text-lg sm:text-xl text-purple-50 max-w-3xl">
            Complete legal guide to claiming land through 12 years of continuous occupation, squatters' rights, and the Environment and Land Court process.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <a href="#claiming" className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition inline-flex items-center gap-2 justify-center">
              Claim Land <ArrowRight className="w-5 h-5" />
            </a>
            <a href="tel:254112810203" className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition inline-flex items-center gap-2 justify-center">
              <Phone className="w-5 h-5" /> Get Legal Help
            </a>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 px-2 sm:px-4 md:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm overflow-x-auto">
          <Link to="/" className="text-purple-600 hover:underline whitespace-nowrap">Home</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600 whitespace-nowrap">Adverse Possession Guide</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-8 sm:py-12 md:py-16">
        {/* TOC - Horizontal Scroll on Mobile, Vertical Sidebar on Desktop */}
        <div className="mb-8 lg:hidden">
          <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <ScrollText className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-gray-900 text-sm">On This Page</h3>
            </div>
            <div className="overflow-x-auto -mx-3 px-3 pb-2">
              <nav className="flex gap-2 min-w-max">
                {sections.map(section => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg transition text-xs sm:text-sm whitespace-nowrap ${
                      activeSection === section.id
                        ? 'bg-purple-100 text-purple-900 font-semibold border-b-2 border-purple-600'
                        : 'text-gray-600 bg-gray-50 hover:bg-purple-50'
                    }`}
                  >
                    {section.icon}
                    {section.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar TOC - Desktop Only */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-purple-600" />
                On This Page
              </h3>
              <nav className="space-y-2">
                {sections.map(section => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={() => setActiveSection(section.id)}
                    className={`block text-sm px-3 py-2 rounded-lg transition ${
                      activeSection === section.id
                        ? 'bg-purple-100 text-purple-900 font-semibold border-l-4 border-purple-600'
                        : 'text-gray-700 hover:bg-purple-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {section.icon}
                      {section.label}
                    </div>
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Section 1: What is Adverse Possession */}
            <section id="what-is" className="scroll-mt-24">
              <div className="bg-white rounded-xl shadow-md border-l-4 border-purple-600 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-8 h-8 text-purple-600" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What is Adverse Possession?</h2>
                </div>
                <p className="text-gray-700 mb-4">
                  Adverse possession is a legal doctrine that allows a person occupying someone else's land continuously and openly for a specified period (12 years in Kenya) to claim ownership of that land. This is sometimes called "squatters' rights," though this term is misleading—it's not a "right" to squat but rather a legal claim to ownership after meeting strict conditions.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h4 className="font-bold text-purple-900 mb-2">Key Principle</h4>
                    <p className="text-sm text-gray-700">After 12 years of meeting ALL required conditions, the original owner's legal right to recover the land is EXTINGUISHED (barred by the Limitation of Actions Act). The occupier can then claim ownership.</p>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                    <h4 className="font-bold text-indigo-900 mb-2">Critical Limitation</h4>
                    <p className="text-sm text-gray-700">Adverse possession ONLY applies to unregistered land. Registered land with a title deed cannot be acquired through adverse possession, no matter how long someone occupies it.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Legal Basis */}
            <section id="legal-basis" className="scroll-mt-24">
              <div className="bg-white rounded-xl shadow-md border-l-4 border-purple-600 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="w-8 h-8 text-purple-600" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Legal Basis Under Kenyan Law</h2>
                </div>
                <div className="space-y-4">
                  <div className="border-l-4 border-purple-400 pl-4 py-2">
                    <h3 className="font-bold text-gray-900 mb-1">Limitation of Actions Act Cap 22</h3>
                    <p className="text-sm text-gray-700">Section 12 establishes the 12-year limitation period for claims to recover land. After 12 years of adverse possession meeting all conditions, the original owner's right is barred forever.</p>
                  </div>
                  <div className="border-l-4 border-purple-400 pl-4 py-2">
                    <h3 className="font-bold text-gray-900 mb-1">Land Registration Act Cap 300</h3>
                    <p className="text-sm text-gray-700">Governs land registration. Adverse possession is NOT available for registered land. This protects title deed holders absolutely.</p>
                  </div>
                  <div className="border-l-4 border-purple-400 pl-4 py-2">
                    <h3 className="font-bold text-gray-900 mb-1">Constitution of Kenya 2010</h3>
                    <p className="text-sm text-gray-700">Article 40 protects property rights. Article 59 includes land and property as fundamental rights, subject to Kenyan law.</p>
                  </div>
                  <div className="border-l-4 border-purple-400 pl-4 py-2">
                    <h3 className="font-bold text-gray-900 mb-1">Land Act Cap 280</h3>
                    <p className="text-sm text-gray-700">Regulates land ownership, transfer, and related matters. Provides protections but recognizes adverse possession on unregistered land.</p>
                  </div>
                  <div className="border-l-4 border-purple-400 pl-4 py-2">
                    <h3 className="font-bold text-gray-900 mb-1">Key Court Precedents</h3>
                    <p className="text-sm text-gray-700">Kenyan courts have consistently held that adverse possession requires ALL conditions to be met simultaneously. Partial compliance is insufficient. The burden of proof is on the occupier.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Squatters Rights */}
            <section id="squatters-rights" className="scroll-mt-24">
              <div className="bg-white rounded-xl shadow-md border-l-4 border-purple-600 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What Are Squatters' Rights in Kenya?</h2>
                </div>
                <p className="text-gray-700 mb-4">
                  "Squatters' rights" is informal terminology for adverse possession. In Kenya, a person living on someone else's unregistered land without permission may, after 12 years of continuous open occupation, claim legal ownership. This is NOT a blanket "right" to occupy anyone's land—it's a specific legal remedy available under limited circumstances.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-4 rounded-lg border border-purple-300">
                    <h4 className="font-bold text-purple-900 mb-2">What It Is</h4>
                    <p className="text-sm text-gray-700">A legal doctrine allowing occupiers of unregistered land to claim ownership after 12 years of meeting strict conditions.</p>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-100 to-indigo-50 p-4 rounded-lg border border-indigo-300">
                    <h4 className="font-bold text-indigo-900 mb-2">What It's NOT</h4>
                    <p className="text-sm text-gray-700">It's NOT a general right to occupy someone's land. It's NOT protection for illegal squatting. It's NOT available on registered land.</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-4 rounded-lg border border-purple-300">
                    <h4 className="font-bold text-purple-900 mb-2">When Available</h4>
                    <p className="text-sm text-gray-700">Only on unregistered land. Only after 12 years of meeting ALL conditions. Only if successfully proven in court.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Conditions Required */}
            <section id="conditions" className="scroll-mt-24">
              <div className="bg-white rounded-xl shadow-md border-l-4 border-purple-600 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-8 h-8 text-purple-600" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Conditions Required to Claim Adverse Possession</h2>
                </div>
                <p className="text-gray-700 mb-6">
                  ALL of the following conditions must be met simultaneously. Missing even one condition means the adverse possession claim fails entirely.
                </p>
                <div className="space-y-4">
                  {[
                    { title: '1. Continuous Occupation (12+ Years)', desc: 'The occupier must occupy the land WITHOUT INTERRUPTION for at least 12 years. Any legal interruption (court order, owner recovery) breaks the clock. Gaps in occupation reset the 12-year period.' },
                    { title: '2. Open and Notorious Use', desc: 'The occupation must be VISIBLE and known to the community. It cannot be hidden or secret. Neighbors, community members, and local authorities should be aware of the occupation.' },
                    { title: '3. Exclusive Occupation', desc: 'The occupier must use the land ALONE (not shared with the owner or others). The occupier must exercise control and management as the owner would.' },
                    { title: '4. Without Permission (Wrongfully)', desc: 'The occupation must be WITHOUT the owner\'s permission. If the owner gave permission, even verbally, at any point, the adverse possession claim fails. Permission eliminates the "wrongful" element.' },
                    { title: '5. Claim to Own (Intent to Own)', desc: 'The occupier must occupy the land with the INTENT TO OWN it, not merely as a tenant, licensee, or borrower. The occupation must indicate a claim to ownership, not a temporary arrangement.' },
                    { title: '6. Unregistered Land Only', desc: 'The land must be UNREGISTERED. No title deed exists. Once land is registered, adverse possession cannot be used to claim it, ever.' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0">
                      <div className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        ✓
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-bold text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-700 mt-1">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 5: How to Claim */}
            <section id="claiming" className="scroll-mt-24">
              <div className="bg-white rounded-xl shadow-md border-l-4 border-purple-600 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <FileCheck className="w-8 h-8 text-purple-600" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Step-by-Step: How to Claim Land Through Adverse Possession</h2>
                </div>
                <div className="space-y-4">
                  {[
                    { step: 1, title: 'Verify Land is Unregistered', desc: 'Conduct a Lands Registry search to confirm the land has NO title deed. If registered, adverse possession is impossible.' },
                    { step: 2, title: 'Document Your 12+ Years of Occupation', desc: 'Collect evidence: original occupation date, photographs showing your continuous presence, utility bills in your name, tax/rate receipts, neighbor testimonies confirming your occupation.' },
                    { step: 3, title: 'Gather Supporting Evidence', desc: 'Collect improvements (structures, gardens, utilities you built/installed), correspondence/documents showing your occupation, written or recorded testimony from long-time witnesses.' },
                    { step: 4, title: 'Hire a Qualified Advocate', desc: 'Engage a lawyer experienced in adverse possession cases. The legal process is complex. Poor preparation loses cases.' },
                    { step: 5, title: 'File Claim at Environment and Land Court', desc: 'Your advocate prepares and files a formal claim for adverse possession with all evidence attached. Pay court filing fees (KES 1,000–5,000 depending on land value).' },
                    { step: 6, title: 'Serve Notice on the Landowner', desc: 'The court ensures the original landowner is formally served with your claim. They have opportunity to respond and defend their ownership.' },
                    { step: 7, title: 'Pre-Trial Case Management', desc: 'Attend court-ordered conferences. Exchange evidence with the other side. Prepare for trial.' },
                    { step: 8, title: 'Trial and Evidence Presentation', desc: 'Present all evidence in court. Give testimony. Allow cross-examination. The judge evaluates if ALL conditions are met.' },
                    { step: 9, title: 'Receive Judgment', desc: 'The judge rules whether adverse possession is granted or denied. If granted, you have legal title to the land.' },
                    { step: 10, title: 'Register Title at Lands Registry', desc: 'After court judgment, apply to the Lands Registry for title registration using the court judgment as proof. You receive a title deed.' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                        {item.step}
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-bold text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-700 mt-1">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 6: Prevention */}
            <section id="prevent" className="scroll-mt-24">
              <div className="bg-white rounded-xl shadow-md border-l-4 border-purple-600 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-8 h-8 text-purple-600" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How Landowners Can Prevent Losing Land</h2>
                </div>
                <div className="space-y-4">
                  <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-600">
                    <h4 className="font-bold text-red-900 mb-2">Immediate Action (First Months)</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• Post visible notices: "PRIVATE PROPERTY - NO TRESPASSING"</li>
                      <li>• Physically remove the occupier if possible (non-violently)</li>
                      <li>• Document the occupation: dates, photos, witnesses</li>
                      <li>• Write formal legal letters to the occupier demanding departure</li>
                    </ul>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-600">
                    <h4 className="font-bold text-orange-900 mb-2">Legal Action (Within 12 Years)</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• File a court case for "recovery of possession" (ejection)</li>
                      <li>• Seek a court INJUNCTION stopping further occupation</li>
                      <li>• Obtain an eviction order from the Environment and Land Court</li>
                      <li>• Enforce the court order through the court's execution process</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-600">
                    <h4 className="font-bold text-purple-900 mb-2">Ongoing Protection</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• Register the land with a title deed (BEST protection)</li>
                      <li>• Monitor your property regularly, especially unregistered land</li>
                      <li>• Maintain visible signs of your ownership</li>
                      <li>• Act immediately upon discovering occupation—delays are costly</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-yellow-50 border-l-4 border-yellow-600 rounded mt-4">
                    <p className="text-sm text-gray-700"><strong>⚠️ Critical:</strong> Unregistered land is vulnerable. If you own unregistered land, IMMEDIATELY apply for title registration at the Lands Registry. This eliminates adverse possession risk entirely.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 7: Documents Required */}
            <section id="documents" className="scroll-mt-24">
              <div className="bg-white rounded-xl shadow-md border-l-4 border-purple-600 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Briefcase className="w-8 h-8 text-purple-600" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Documents & Evidence Required</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-purple-50 border-b-2 border-purple-300">
                        <th className="px-4 py-3 text-left font-bold text-gray-900">Evidence Type</th>
                        <th className="px-4 py-3 text-left font-bold text-gray-900">Examples</th>
                        <th className="px-4 py-3 text-left font-bold text-gray-900">Importance</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200 hover:bg-purple-50">
                        <td className="px-4 py-3 font-semibold">Original Occupation Date</td>
                        <td className="px-4 py-3">Community records, old photos, witness testimony</td>
                        <td className="px-4 py-3">CRITICAL</td>
                      </tr>
                      <tr className="border-b border-gray-200 hover:bg-purple-50">
                        <td className="px-4 py-3 font-semibold">Continuous Occupancy Proof</td>
                        <td className="px-4 py-3">Utility bills, tax receipts, property improvements photos</td>
                        <td className="px-4 py-3">CRITICAL</td>
                      </tr>
                      <tr className="border-b border-gray-200 hover:bg-purple-50">
                        <td className="px-4 py-3 font-semibold">Witness Statements</td>
                        <td className="px-4 py-3">Neighbors, community elders, long-time residents</td>
                        <td className="px-4 py-3">VERY HIGH</td>
                      </tr>
                      <tr className="border-b border-gray-200 hover:bg-purple-50">
                        <td className="px-4 py-3 font-semibold">Photographs</td>
                        <td className="px-4 py-3">Dated photos of land, structures, your presence over years</td>
                        <td className="px-4 py-3">VERY HIGH</td>
                      </tr>
                      <tr className="border-b border-gray-200 hover:bg-purple-50">
                        <td className="px-4 py-3 font-semibold">Improvements Evidence</td>
                        <td className="px-4 py-3">Construction photos, utility connections, landscaping</td>
                        <td className="px-4 py-3">HIGH</td>
                      </tr>
                      <tr className="border-b border-gray-200 hover:bg-purple-50">
                        <td className="px-4 py-3 font-semibold">Correspondence</td>
                        <td className="px-4 py-3">Letters to/from owner, emails, SMS, demand letters</td>
                        <td className="px-4 py-3">HIGH</td>
                      </tr>
                      <tr className="border-b border-gray-200 hover:bg-purple-50">
                        <td className="px-4 py-3 font-semibold">Land Registry Search</td>
                        <td className="px-4 py-3">Proof land is unregistered (no title deed)</td>
                        <td className="px-4 py-3">CRITICAL</td>
                      </tr>
                      <tr className="hover:bg-purple-50">
                        <td className="px-4 py-3 font-semibold">Payment Records</td>
                        <td className="px-4 py-3">Utility bills, rate payments, tax receipts in your name</td>
                        <td className="px-4 py-3">HIGH</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Section 8: Court Process */}
            <section id="court-process" className="scroll-mt-24">
              <div className="bg-white rounded-xl shadow-md border-l-4 border-purple-600 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Gavel className="w-8 h-8 text-purple-600" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Court Process Explained</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4">Which Court?</h4>
                    <p className="text-sm text-gray-700 mb-3">The <strong>Environment and Land Court</strong> has exclusive jurisdiction over adverse possession cases. This court specializes in land disputes and has 11 locations nationwide.</p>
                    <p className="text-xs text-purple-700 font-semibold">File in the court location closest to where the land is situated.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4">Burden of Proof</h4>
                    <p className="text-sm text-gray-700 mb-3">YOU (the occupier) must prove ALL conditions by a <strong>"balance of probabilities"</strong> (more likely than not). The owner can challenge any element.</p>
                    <p className="text-xs text-purple-700 font-semibold">Strong evidence is essential.</p>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-purple-50 border-l-4 border-purple-600 rounded">
                  <h4 className="font-bold text-purple-900 mb-2">Case Timeline</h4>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p><strong>Filing to First Hearing:</strong> 2–4 months</p>
                    <p><strong>Case Management Conferences:</strong> 3–6 months</p>
                    <p><strong>Full Trial:</strong> 3–12 months (can take longer)</p>
                    <p><strong>Judgment Delivery:</strong> 2–8 weeks after trial</p>
                    <p><strong>Total Average Duration:</strong> 18–36 months</p>
                    <p className="text-xs text-purple-700 italic">Actual timelines vary based on court backlog and case complexity.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 9: Real-Life Examples */}
            <section id="examples" className="scroll-mt-24">
              <div className="bg-white rounded-xl shadow-md border-l-4 border-purple-600 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquare className="w-8 h-8 text-purple-600" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Real-Life Examples & Scenarios</h2>
                </div>
                <div className="space-y-4">
                  <div className="border-l-4 border-purple-400 pl-4 py-3 bg-purple-50 p-3 rounded">
                    <h4 className="font-bold text-purple-900 mb-1">✓ SUCCESSFUL Adverse Possession</h4>
                    <p className="text-sm text-gray-700 mb-2"><strong>Scenario:</strong> John continuously occupies unregistered rural land for 13 years, builds a house, grows crops, and has consistent utility bills in his name. Neighbors confirm his continuous occupancy. The original owner took no action. John files a case with strong evidence.</p>
                    <p className="text-sm text-gray-700"><strong>Likely Outcome:</strong> John wins. All conditions met: 12+ years, continuous, open, exclusive, without permission, unregistered land.</p>
                  </div>
                  <div className="border-l-4 border-red-400 pl-4 py-3 bg-red-50 p-3 rounded">
                    <h4 className="font-bold text-red-900 mb-1">✗ FAILED Adverse Possession #1</h4>
                    <p className="text-sm text-gray-700 mb-2"><strong>Scenario:</strong> Maria occupies land for 10 years, but the owner sues and obtains a court eviction order in year 11. Maria is removed from the land.</p>
                    <p className="text-sm text-gray-700"><strong>Outcome:</strong> Maria loses. The 12-year period was interrupted by the court order. Adverse possession failed.</p>
                  </div>
                  <div className="border-l-4 border-red-400 pl-4 py-3 bg-red-50 p-3 rounded">
                    <h4 className="font-bold text-red-900 mb-1">✗ FAILED Adverse Possession #2</h4>
                    <p className="text-sm text-gray-700 mb-2"><strong>Scenario:</strong> Ahmed occupies land for 12 years and files an adverse possession claim. However, the land is found to be REGISTERED with a title deed in someone else's name.</p>
                    <p className="text-sm text-gray-700"><strong>Outcome:</strong> Ahmed loses immediately. Adverse possession is NOT available for registered land.</p>
                  </div>
                  <div className="border-l-4 border-red-400 pl-4 py-3 bg-red-50 p-3 rounded">
                    <h4 className="font-bold text-red-900 mb-1">✗ FAILED Adverse Possession #3</h4>
                    <p className="text-sm text-gray-700 mb-2"><strong>Scenario:</strong> Fatima occupies land secretly (hidden, no visible use). Neighbors don't know she's there. She has no utility bills or visible improvements.</p>
                    <p className="text-sm text-gray-700"><strong>Outcome:</strong> Fatima loses. The occupation is NOT "open and notorious" (secret occupation fails the test).</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 10: Myths */}
            <section id="myths" className="scroll-mt-24">
              <div className="bg-white rounded-xl shadow-md border-l-4 border-purple-600 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="w-8 h-8 text-purple-600" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Common Myths About Squatters' Rights</h2>
                </div>
                <div className="space-y-4">
                  {[
                    { myth: 'Myth: "If I squat for 12 years, I automatically own the land."', truth: 'FALSE. The land must be unregistered, and ALL conditions must be met and proven in court. Mere passage of time alone doesn\'t grant ownership.' },
                    { myth: 'Myth: "Squatters have legal rights to prevent eviction."', truth: 'FALSE. Squatters (unauthorized occupants) have NO legal rights before 12 years and meeting all conditions. Eviction is legally allowed.' },
                    { myth: 'Myth: "Adverse possession works on registered land with title deeds."', truth: 'COMPLETELY FALSE. Adverse possession is IMPOSSIBLE on registered land. Title deeds have absolute protection.' },
                    { myth: 'Myth: "I can claim adverse possession even if the owner gave me permission."', truth: 'FALSE. Permission eliminates the "without authorization" requirement. Adverse possession fails entirely if permission exists.' },
                    { myth: 'Myth: "If I pay property taxes, I automatically own the land."', truth: 'FALSE. Tax payment alone is not sufficient. All six conditions must be met. Tax payment is supporting evidence only.' },
                    { myth: 'Myth: "Adverse possession applies to government land."', truth: 'FALSE. Government land has special legal protections. Adverse possession does NOT apply to public or state land.' },
                    { myth: 'Myth: "I don\'t need a lawyer for adverse possession cases."', truth: 'UNWISE. Adverse possession cases are legally complex. Poor representation often loses. Hire a qualified advocate.' },
                    { myth: 'Myth: "Adverse possession is a fast way to get free land."', truth: 'FALSE. It requires 12+ years of continuous occupation, costs for legal fees and court, and takes 2–3 years to litigate.' },
                  ].map((item, idx) => (
                    <div key={idx} className="border-l-4 border-purple-400 pl-4 py-3 bg-gradient-to-r from-purple-50 to-transparent">
                      <p className="text-sm font-bold text-red-700 mb-1">{item.myth}</p>
                      <p className="text-sm text-gray-700"><strong>✓ Truth:</strong> {item.truth}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 11: Costs and Timelines */}
            <section id="costs" className="scroll-mt-24">
              <div className="bg-white rounded-xl shadow-md border-l-4 border-purple-600 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="w-8 h-8 text-purple-600" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Legal Costs & Timelines</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4 text-lg">Typical Costs</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm pb-2 border-b border-gray-200">
                        <span className="text-gray-700">Court Filing Fees</span>
                        <span className="font-bold text-purple-600">KES 1,000–5,000</span>
                      </div>
                      <div className="flex justify-between text-sm pb-2 border-b border-gray-200">
                        <span className="text-gray-700">Advocate Representation</span>
                        <span className="font-bold text-purple-600">KES 80,000–400,000+</span>
                      </div>
                      <div className="flex justify-between text-sm pb-2 border-b border-gray-200">
                        <span className="text-gray-700">Lands Registry Search</span>
                        <span className="font-bold text-purple-600">KES 500–1,500</span>
                      </div>
                      <div className="flex justify-between text-sm pb-2 border-b border-gray-200">
                        <span className="text-gray-700">Witness/Expert Fees</span>
                        <span className="font-bold text-purple-600">KES 20,000–100,000</span>
                      </div>
                      <div className="flex justify-between text-sm pb-2 border-b border-gray-200">
                        <span className="text-gray-700">Document Preparation</span>
                        <span className="font-bold text-purple-600">KES 10,000–30,000</span>
                      </div>
                      <div className="flex justify-between text-sm bg-purple-50 p-2 rounded font-bold">
                        <span>TOTAL ESTIMATE</span>
                        <span className="text-purple-600">KES 120,000–1,500,000+</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4 text-lg">Timeline Estimates</h4>
                    <div className="space-y-3">
                      <div className="bg-purple-50 p-3 rounded border-l-4 border-purple-600">
                        <p className="text-sm font-bold text-purple-900">Pre-litigation preparation:</p>
                        <p className="text-sm text-gray-700">2–6 months</p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded border-l-4 border-purple-600">
                        <p className="text-sm font-bold text-purple-900">Filing to first hearing:</p>
                        <p className="text-sm text-gray-700">2–4 months</p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded border-l-4 border-purple-600">
                        <p className="text-sm font-bold text-purple-900">Case management phase:</p>
                        <p className="text-sm text-gray-700">3–6 months</p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded border-l-4 border-purple-600">
                        <p className="text-sm font-bold text-purple-900">Trial to judgment:</p>
                        <p className="text-sm text-gray-700">6–18 months</p>
                      </div>
                      <div className="bg-indigo-100 p-3 rounded border-l-4 border-indigo-600">
                        <p className="text-sm font-bold text-indigo-900">TOTAL CASE DURATION:</p>
                        <p className="text-sm text-gray-700">18–36 months (average)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 12: FAQs */}
            <section id="faqs" className="scroll-mt-24">
              <div className="bg-white rounded-xl shadow-md border-l-4 border-purple-600 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Briefcase className="w-8 h-8 text-purple-600" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
                </div>
                <div className="space-y-3">
                  {faqsData.map((faq, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleFAQ(idx)}
                        className="w-full px-4 py-4 flex items-center justify-between bg-purple-50 hover:bg-purple-100 transition"
                      >
                        <span className="text-left font-semibold text-gray-900 text-sm sm:text-base">{faq.question}</span>
                        {expandedFAQ === idx ? (
                          <ChevronUp className="w-5 h-5 text-purple-600 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-purple-600 flex-shrink-0" />
                        )}
                      </button>
                      {expandedFAQ === idx && (
                        <div className="px-4 py-4 bg-white border-t border-gray-200">
                          <p className="text-gray-700 text-sm">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="mt-12 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">Need Legal Help with Adverse Possession?</h3>
              <p className="mb-6 text-purple-50">
                Adverse possession cases are legally complex and require expert guidance. Contact us for a FREE consultation with a qualified advocate.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://wa.me/254112810203?text=I%20need%20legal%20help%20with%20adverse%20possession%20in%20Kenya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition inline-flex items-center gap-2 justify-center"
                >
                  <Phone className="w-5 h-5" /> WhatsApp +254112810203
                </a>
                <a
                  href="mailto:johnsonthuraniramwangi@gmail.com"
                  className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition inline-flex items-center gap-2 justify-center"
                >
                  📧 Email Us
                </a>
              </div>
            </section>

            {/* Internal Links */}
            <section className="mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Legal Guides</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  to="/land-disputes-kenya"
                  className="p-4 border border-purple-300 rounded-lg hover:bg-purple-50 transition group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Gavel className="w-5 h-5 text-purple-600 group-hover:scale-110 transition" />
                    <h4 className="font-semibold text-gray-900 group-hover:text-purple-600">Land Disputes in Kenya</h4>
                  </div>
                  <p className="text-sm text-gray-600">Complete guide to resolving boundary conflicts and land disputes.</p>
                </Link>
                <Link
                  to="/land-ownership-title-deed-verification-kenya"
                  className="p-4 border border-purple-300 rounded-lg hover:bg-purple-50 transition group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-5 h-5 text-purple-600 group-hover:scale-110 transition" />
                    <h4 className="font-semibold text-gray-900 group-hover:text-purple-600">Land Ownership & Title Verification</h4>
                  </div>
                  <p className="text-sm text-gray-600">How to verify ownership and identify fake title deeds.</p>
                </Link>
                <Link
                  to="/land-transfer-process-kenya"
                  className="p-4 border border-purple-300 rounded-lg hover:bg-purple-50 transition group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowRight className="w-5 h-5 text-purple-600 group-hover:scale-110 transition" />
                    <h4 className="font-semibold text-gray-900 group-hover:text-purple-600">Land Transfer Process</h4>
                  </div>
                  <p className="text-sm text-gray-600">Step-by-step guide to buying and transferring land.</p>
                </Link>
                <Link
                  to="/how-to-buy-land-safely-kenya"
                  className="p-4 border border-purple-300 rounded-lg hover:bg-purple-50 transition group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-purple-600 group-hover:scale-110 transition" />
                    <h4 className="font-semibold text-gray-900 group-hover:text-purple-600">How to Buy Land Safely</h4>
                  </div>
                  <p className="text-sm text-gray-600">Due diligence checklist to avoid land fraud.</p>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 px-2 sm:px-4 md:px-8 border-t border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="font-bold text-white mb-3">About This Guide</h4>
            <p className="text-sm mb-3">This is a comprehensive legal resource for understanding adverse possession and squatters' rights in Kenya.</p>
            <p className="text-xs text-gray-400">Updated: February 2026</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3">Legal Disclaimer</h4>
            <p className="text-sm">This is educational content only. It is NOT legal advice. Always consult a qualified advocate for your specific situation. Laws change—verify current regulations.</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3">Get Help</h4>
            <p className="text-sm">
              Contact us for FREE consultation:<br/>
              📧 <a href="mailto:johnsonthuraniramwangi@gmail.com" className="text-purple-400 hover:underline">johnsonthuraniramwangi@gmail.com</a><br/>
              📱 WhatsApp: <a href="https://wa.me/254112810203" className="text-purple-400 hover:underline">+254112810203</a>
            </p>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-4 text-center text-xs">
          <p>&copy; 2026 Wakili Legal. All rights reserved. | <Link to="/privacy-policy" className="text-purple-400 hover:underline">Privacy Policy</Link> | <Link to="/terms" className="text-purple-400 hover:underline">Terms</Link></p>
        </div>
      </footer>
    </div>
  );
};

export default AdversePossessionKenya;
