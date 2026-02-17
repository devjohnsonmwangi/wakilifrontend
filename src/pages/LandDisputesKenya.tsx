import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  FileCheck,
  Building2,
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
  Globe,
  BookOpen,
  CheckCircle,
  MessageSquare,
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

// FAQ data moved outside component to avoid dependency issues
const faqsData: FAQItem[] = [
  {
    question: 'What is considered a land dispute in Kenya?',
    answer:
      'A land dispute arises when two or more parties have conflicting claims to the same property. This includes boundary conflicts, ownership disputes, trespass, land grabbing, fraudulent sales, and inheritance conflicts. Under Kenyan law, disputes can be resolved through negotiation, Alternative Dispute Resolution (ADR), or the Environment and Land Court.',
  },
  {
    question: 'Can I file a land case without a lawyer?',
    answer:
      'Yes, you can represent yourself (Pro Se) in the Environment and Land Court. However, this is NOT recommended for complex cases. Land disputes involve technical legal procedures, evidence rules, and procedural formalities. A qualified advocate significantly increases your chances of success and ensures your rights are protected. Filing fees are still required regardless of representation.',
  },
  {
    question: 'How long does a land case take in the Environment and Land Court?',
    answer:
      'Land cases typically take 18 months to 3+ years from filing to judgment, depending on case complexity and court backlog. Simpler boundary disputes may resolve in 12–18 months. Motions and interlocutory proceedings can extend timelines. ADR (mediation/arbitration) is faster—often 3–6 months. Court strikes periodically, creating delays. Timeline depends heavily on evidence volume and witness availability.',
  },
  {
    question: 'What is adverse possession in Kenya?',
    answer:
      'Adverse possession (squatters\' rights) is a legal doctrine allowing occupation of land without the owner\'s permission for a specified period. In Kenya, a person occupying land openly, notoriously, and without interruption for 12 years MAY claim ownership. However, this only applies to unregistered land. Registered land cannot be acquired through adverse possession. The occupier must prove continuous, exclusive use and intention to possess.',
  },
  {
    question: 'How much does it cost to file a land case in Kenya?',
    answer:
      'Court filing fees range from KES 500–5,000+ depending on claim value. An advocate charges KES 50,000–500,000+ for representation. Surveyor costs: KES 10,000–50,000. Title search: KES 500–1,500. Expert witness fees: KES 20,000–100,000+. Total case costs typically range KES 100,000–2,000,000+ depending on complexity, case value, and expert services required.',
  },
  {
    question: 'What evidence do I need to win a land case?',
    answer:
      'Critical evidence includes: original title deed, land registry certificate, survey plan, witness testimonies (boundary witnesses, neighbors), photographs of the property, correspondence with the other party, purchase agreements, tax/rate payment receipts, and expert surveyor reports. The stronger your documentary evidence, the higher your chances. Circumstantial evidence alone is weak. Maintain all documentation meticulously.',
  },
  {
    question: 'Can I appeal a land case judgment?',
    answer:
      'Yes, you have the right to appeal to the Court of Appeal within 30 days of judgment. The Court of Appeal reviews the legal reasoning, not facts. If you believe the lower court made a legal error or misapplied law, appeal. This process costs additional legal fees and takes 2–4 years. Success is not guaranteed. Grounds for appeal must be substantive legal issues, not mere disagreement with the verdict.',
  },
  {
    question: 'What is mediation and is it better than court?',
    answer:
      'Mediation is a confidential process where a neutral third party (mediator) helps disputing parties reach agreement. It is faster (3–6 months), cheaper (KES 20,000–100,000 mediator fees), and preserves relationships. Court proceedings are adversarial, public, and take 2–3 years. Mediation works best when both parties are willing to compromise. If mediation fails, you can still go to court. Court is necessary if one party refuses to negotiate.',
  },
  {
    question: 'What happens if the other party ignores a demand letter?',
    answer:
      'If the other party ignores your demand letter (30-day deadline typically), you proceed to file a court case. Ignoring a demand letter does not extinguish your right to sue. The demand letter is critical evidence showing attempts at amicable resolution. The court will consider it when assessing damages and costs. If you win, the other party may be ordered to pay your legal costs. Persistence and documentation are key.',
  },
  {
    question: 'Who is the Environment and Land Court?',
    answer:
      'The Environment and Land Court is a specialized division of the High Court established in 2012 to handle land disputes, property rights, access to justice on land issues, and environmental matters. It has 11+ locations nationwide (Nairobi, Kisumu, Kisii, Mombasa, Nakuru, Eldoret, Embu, Malindi, etc.). The court operates under the Environment and Land Court Act 2011 and has exclusive jurisdiction over land disputes.',
  },
  {
    question: 'How do I verify land ownership before buying to avoid disputes?',
    answer:
      'Conduct a comprehensive Lands Registry search (KES 500–1,500). Hire a licensed surveyor to verify boundaries (KES 15,000–50,000). Request the original title deed from the seller. Check for mortgages, leases, and easements. Visit the county Land Control Board for customary land restrictions. Use GPS coordinates to confirm location. Meet neighbors to verify no disputes. Hire an advocate to review all documentation. These steps prevent most ownership conflicts.',
  },
  {
    question: 'Can someone be prosecuted criminally for land grabbing?',
    answer:
      'Yes. Land grabbing is a serious criminal offense under the Land Act. If prosecuted, offenders face fines up to KES 5 million and/or imprisonment up to 10 years. However, criminal prosecution is rare and slow. Most land grabbing cases are handled through civil remedies: obtaining court injunctions to stop the grabbing, recovery of possession, and damages. Report land grabbing to the Land and Environmental Court prosecutor or local police.',
  },
  {
    question: 'What is a land tribunal and is it different from the Environment and Land Court?',
    answer:
      'The terms are sometimes used interchangeably in Kenya, but technically the "Environment and Land Court" is the formal judicial body. Historical "land tribunals" were informal dispute resolution mechanisms in some communities. Today, disputes are filed in the Environment and Land Court, not traditional tribunals. Customary dispute resolution still exists informally through elders, but it has no legal enforcement power unless formalized through court orders.',
  },
  {
    question: 'What if my land title has a forgery detected after purchase?',
    answer:
      'Immediately report the forgery to the Lands Registry, the police, and your advocate. File a civil case against the seller for fraudulent sale. Report to the Directorate of Criminal Investigations (DCI). The Lands Registry may cancel the fraudulent title and restore it to the rightful owner. If you purchased in good faith, you may have recourse against the seller for damages. Title insurance (where available) may cover losses. Act quickly—delays weaken your legal position.',
  },
];

const LandDisputesKenya: React.FC = () => {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState('understanding');

  useEffect(() => {
    document.title = 'Land Disputes in Kenya – Legal Remedies & Environment and Land Court Guide 2026';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', 'Complete guide to resolving land disputes in Kenya. Learn about boundary conflicts, land grabbing, Environment and Land Court process, and legal remedies.');
    }

    // Set meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', 'land disputes kenya, environment and land court kenya, boundary disputes kenya, land case process kenya, how to file land case, land grabbing kenya, trespass to land, adverse possession kenya, land ownership conflicts, sue over land kenya, property disputes resolution');

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
      { property: 'og:title', content: 'Land Disputes in Kenya – Legal Remedies & Court Guide 2026' },
      { property: 'og:description', content: 'Step-by-step guide to resolving land disputes in Kenya through the Environment and Land Court. Learn about boundary conflicts, land grabbing, and legal remedies.' },
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
      { name: 'twitter:title', content: 'Land Disputes in Kenya – Environment and Land Court Guide 2026' },
      { name: 'twitter:description', content: 'Complete legal guide to resolving land disputes in Kenya. Boundary conflicts, land grabbing, filing cases, and legal remedies explained.' }
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
          name: 'Land Disputes in Kenya – Legal Remedies & Court Process Guide',
          description: 'Complete guide to resolving land disputes in Kenya through the Environment and Land Court.',
          inLanguage: 'en-KE'
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: window.location.origin },
            { '@type': 'ListItem', position: 2, name: 'Land Law', item: `${window.location.origin}/land-laws` },
            { '@type': 'ListItem', position: 3, name: 'Land Disputes', item: window.location.href }
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
          name: 'How to File a Land Case in Kenya',
          step: [
            { '@type': 'HowToStep', text: 'Collect evidence: title deeds, surveys, photographs, and witness statements.' },
            { '@type': 'HowToStep', text: 'Conduct Lands Registry search to verify ownership and encumbrances.' },
            { '@type': 'HowToStep', text: 'Send formal demand letter to the other party (30-day notice period).' },
            { '@type': 'HowToStep', text: 'File claim at Environment and Land Court with supporting documentation.' },
            { '@type': 'HowToStep', text: 'Attend court hearings and examination of witnesses.' },
            { '@type': 'HowToStep', text: 'Receive judgment and enforce if successful.' }
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
    { id: 'understanding', label: 'Understanding Disputes', icon: <AlertTriangle className="w-5 h-5" /> },
    { id: 'types', label: 'Types of Disputes', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'laws', label: 'Governing Laws', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'court', label: 'Environment Court', icon: <Building2 className="w-5 h-5" /> },
    { id: 'filing', label: 'Filing Process', icon: <FileCheck className="w-5 h-5" /> },
    { id: 'adr', label: 'ADR Options', icon: <Users className="w-5 h-5" /> },
    { id: 'documents', label: 'Required Documents', icon: <Briefcase className="w-5 h-5" /> },
    { id: 'costs', label: 'Costs & Timelines', icon: <DollarSign className="w-5 h-5" /> },
    { id: 'landgrab', label: 'Land Grabbing', icon: <AlertTriangle className="w-5 h-5" /> },
    { id: 'adverse', label: 'Adverse Possession', icon: <Lock className="w-5 h-5" /> },
    { id: 'roles', label: 'Professional Roles', icon: <Gavel className="w-5 h-5" /> },
    { id: 'faqs', label: 'FAQs', icon: <Briefcase className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-orange-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 text-white py-12 sm:py-16 md:py-20 px-2 sm:px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Gavel className="w-6 h-6 md:w-8 md:h-8" />
            <span className="text-sm md:text-base font-semibold text-orange-100">Kenya Legal Authority</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Land Disputes in Kenya
          </h1>
          <p className="text-lg sm:text-xl text-orange-50 max-w-3xl">
            Complete legal guide to resolving boundary conflicts, ownership disputes, land grabbing, and filing cases in the Environment and Land Court.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <a href="#filing" className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition inline-flex items-center gap-2 justify-center">
              File a Case <ArrowRight className="w-5 h-5" />
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
          <Link to="/" className="text-orange-600 hover:underline whitespace-nowrap">Home</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600 whitespace-nowrap">Land Disputes Guide</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="content-full-width">
      <div className="max-w-7xl mx-auto px-0 sm:px-4 md:px-8 py-8 sm:py-12 md:py-16 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar TOC */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-orange-600" />
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
                      ? 'bg-orange-100 text-orange-900 font-semibold border-l-4 border-orange-600'
                      : 'text-gray-700 hover:bg-orange-50'
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
          {/* Section 1: Understanding Land Disputes */}
          <section id="understanding" className="scroll-mt-24">
            <div className="bg-white rounded-xl shadow-md border-l-4 border-orange-600 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-8 h-8 text-orange-600" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Understanding Land Disputes in Kenya</h2>
              </div>
              <p className="text-gray-700 mb-4">
                A land dispute arises when two or more parties claim conflicting rights to the same property. This can stem from boundary disagreements, ownership conflicts, illegal occupation, fraudulent transfers, or inheritance disagreements. Kenya recognizes land as a fundamental asset under the Constitution, and disputes are taken seriously by the legal system.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h4 className="font-bold text-orange-900 mb-2">Why Land Disputes Occur</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Poor boundary demarcation</li>
                    <li>• Fraudulent title deeds</li>
                    <li>• Inherited property conflicts</li>
                    <li>• Mortgage/security issues</li>
                    <li>• Government land allocation errors</li>
                  </ul>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-bold text-red-900 mb-2">Legal Consequences</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Loss of land/property</li>
                    <li>• Financial damages</li>
                    <li>• Criminal prosecution (if grabbing)</li>
                    <li>• Title invalidation</li>
                    <li>• Years of costly litigation</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Types of Disputes */}
          <section id="types" className="scroll-mt-24">
            <div className="bg-white rounded-xl shadow-md border-l-4 border-orange-600 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-8 h-8 text-orange-600" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Types of Common Land Disputes</h2>
              </div>
              <div className="space-y-4">
                <div className="border-l-4 border-orange-400 pl-4 py-2">
                  <h3 className="font-bold text-gray-900 mb-1">Boundary Conflicts</h3>
                  <p className="text-gray-700 text-sm">Neighbors disagree on property boundaries. Resolved with survey evidence and historical records.</p>
                </div>
                <div className="border-l-4 border-orange-400 pl-4 py-2">
                  <h3 className="font-bold text-gray-900 mb-1">Ownership Disputes</h3>
                  <p className="text-gray-700 text-sm">Two parties claim ownership of the same land (e.g., forged deeds, multiple sales of same property).</p>
                </div>
                <div className="border-l-4 border-orange-400 pl-4 py-2">
                  <h3 className="font-bold text-gray-900 mb-1">Trespass to Land</h3>
                  <p className="text-gray-700 text-sm">Unauthorized entry or occupation of someone else's property. Can be resolved through injunctions.</p>
                </div>
                <div className="border-l-4 border-orange-400 pl-4 py-2">
                  <h3 className="font-bold text-gray-900 mb-1">Land Grabbing</h3>
                  <p className="text-gray-700 text-sm">Illegal occupation with intent to acquire ownership. This is a criminal offense under the Land Act.</p>
                </div>
                <div className="border-l-4 border-orange-400 pl-4 py-2">
                  <h3 className="font-bold text-gray-900 mb-1">Inheritance Conflicts</h3>
                  <p className="text-gray-700 text-sm">Family members dispute property distribution after death. Resolved through succession laws and court intervention.</p>
                </div>
                <div className="border-l-4 border-orange-400 pl-4 py-2">
                  <h3 className="font-bold text-gray-900 mb-1">Fraudulent Sales</h3>
                  <p className="text-gray-700 text-sm">Land sold by someone without legal authority. Buyers can recover from sellers or pursue criminal charges.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Laws Governing Disputes */}
          <section id="laws" className="scroll-mt-24">
            <div className="bg-white rounded-xl shadow-md border-l-4 border-orange-600 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-8 h-8 text-orange-600" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Laws Governing Land Disputes</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-orange-50 border-b-2 border-orange-300">
                      <th className="px-4 py-3 text-left font-bold text-gray-900">Law / Act</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-900">Purpose</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200 hover:bg-orange-50">
                      <td className="px-4 py-3 font-semibold text-gray-900">Constitution of Kenya 2010</td>
                      <td className="px-4 py-3 text-gray-700">Establishes right to own land and protects property rights (Chapter 5)</td>
                    </tr>
                    <tr className="border-b border-gray-200 hover:bg-orange-50">
                      <td className="px-4 py-3 font-semibold text-gray-900">Land Act Cap 280</td>
                      <td className="px-4 py-3 text-gray-700">Regulates land ownership, sale, title verification, and land grabbing prevention</td>
                    </tr>
                    <tr className="border-b border-gray-200 hover:bg-orange-50">
                      <td className="px-4 py-3 font-semibold text-gray-900">Land Registration Act Cap 300</td>
                      <td className="px-4 py-3 text-gray-700">Governs land registration, title deeds, and Lands Registry processes</td>
                    </tr>
                    <tr className="border-b border-gray-200 hover:bg-orange-50">
                      <td className="px-4 py-3 font-semibold text-gray-900">Environment and Land Court Act 2011</td>
                      <td className="px-4 py-3 text-gray-700">Establishes jurisdiction and procedures of the Environment and Land Court</td>
                    </tr>
                    <tr className="border-b border-gray-200 hover:bg-orange-50">
                      <td className="px-4 py-3 font-semibold text-gray-900">Civil Procedure Act</td>
                      <td className="px-4 py-3 text-gray-700">Governs court procedures, evidence rules, and witness examination</td>
                    </tr>
                    <tr className="hover:bg-orange-50">
                      <td className="px-4 py-3 font-semibold text-gray-900">Law of Property Act</td>
                      <td className="px-4 py-3 text-gray-700">Defines property ownership, easements, mortgages, and landlord-tenant rights</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Section 4: Environment and Land Court */}
          <section id="court" className="scroll-mt-24">
            <div className="bg-white rounded-xl shadow-md border-l-4 border-orange-600 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="w-8 h-8 text-orange-600" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Environment and Land Court Explained</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-orange-100 to-orange-50 p-4 rounded-lg border border-orange-300">
                  <h4 className="font-bold text-orange-900 mb-2">Jurisdiction</h4>
                  <p className="text-sm text-gray-700">Handles all land disputes, property rights, land access, environmental matters, and title disputes nationwide.</p>
                </div>
                <div className="bg-gradient-to-br from-red-100 to-red-50 p-4 rounded-lg border border-red-300">
                  <h4 className="font-bold text-red-900 mb-2">11 Locations</h4>
                  <p className="text-sm text-gray-700">Nairobi, Kisumu, Kisii, Mombasa, Nakuru, Eldoret, Embu, Malindi, Kericho, Nyeri, Muranga</p>
                </div>
                <div className="bg-gradient-to-br from-orange-100 to-orange-50 p-4 rounded-lg border border-orange-300">
                  <h4 className="font-bold text-orange-900 mb-2">Case Types</h4>
                  <p className="text-sm text-gray-700">Boundary disputes, ownership claims, trespass, land grabbing, title challenges, inheritance conflicts.</p>
                </div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-600">
                <h4 className="font-bold text-orange-900 mb-2">How to Find Your Nearest Court</h4>
                <p className="text-sm text-gray-700 mb-2">Visit the Judiciary website (judiciary.go.ke) or contact the main registry in Nairobi:</p>
                <p className="text-sm font-mono bg-white p-2 rounded border border-orange-300">
                  Environment and Land Court | Nairobi | Phone: +254 20 3232000
                </p>
              </div>
            </div>
          </section>

          {/* Section 5: How to File */}
          <section id="filing" className="scroll-mt-24">
            <div className="bg-white rounded-xl shadow-md border-l-4 border-orange-600 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <FileCheck className="w-8 h-8 text-orange-600" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Step-by-Step: How to File a Land Case</h2>
              </div>
              <div className="space-y-4">
                {[
                  { step: 1, title: 'Collect Evidence', desc: 'Gather original title deeds, land searches, survey plans, photographs, witness statements, correspondence with the other party.' },
                  { step: 2, title: 'Conduct Lands Registry Search', desc: 'Visit the Lands Registry (online or physical office). Verify ownership, mortgages, easements, and encumbrances. Get an official search certificate.' },
                  { step: 3, title: 'Send Demand Letter', desc: 'Through your advocate, send a formal 30-day notice to the other party requesting amicable resolution. This shows good faith and is evidence.' },
                  { step: 4, title: 'Prepare and File Claim', desc: 'Draft a formal claim with facts, legal grounds, evidence, and relief sought. File with the Environment and Land Court registry with filing fees (KES 1,000–5,000).' },
                  { step: 5, title: 'Serve the Other Party', desc: 'Ensure proper service (delivery) of court documents to the defendant. This is crucial for the case to proceed legally.' },
                  { step: 6, title: 'Pre-Trial Case Management', desc: 'Attend court-ordered case management conferences. Exchange evidence. Consider settlement or ADR.' },
                  { step: 7, title: 'Trial/Hearing', desc: 'Present evidence, witness testimony, and legal arguments before the judge. Cross-examine the other party\'s witnesses.' },
                  { step: 8, title: 'Receive Judgment', desc: 'Judge delivers written ruling. This may take weeks/months after hearing. Review grounds carefully.' },
                  { step: 9, title: 'Enforce Judgment', desc: 'If you win, enforce the judgment through court execution process. If you lose, consider appeal within 30 days.' },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">
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

          {/* Section 6: Alternative Dispute Resolution */}
          <section id="adr" className="scroll-mt-24">
            <div className="bg-white rounded-xl shadow-md border-l-4 border-orange-600 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-8 h-8 text-orange-600" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Alternative Dispute Resolution (ADR)</h2>
              </div>
              <p className="text-gray-700 mb-6">
                ADR methods are faster, cheaper, and often more effective than court litigation. Many land disputes are resolved through negotiation, mediation, or arbitration before reaching court.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-orange-50 to-red-50 p-5 rounded-lg border-2 border-orange-300">
                  <h4 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" /> Negotiation
                  </h4>
                  <p className="text-sm text-gray-700 mb-3">Direct discussion between parties to reach agreement.</p>
                  <div className="text-xs bg-white p-2 rounded border border-orange-200">
                    <strong>Timeline:</strong> 1–4 weeks<br/>
                    <strong>Cost:</strong> Free to minimal<br/>
                    <strong>Best for:</strong> Simple disputes, willing parties
                  </div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-red-50 p-5 rounded-lg border-2 border-orange-300">
                  <h4 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" /> Mediation
                  </h4>
                  <p className="text-sm text-gray-700 mb-3">Neutral mediator facilitates discussion (confidential).</p>
                  <div className="text-xs bg-white p-2 rounded border border-orange-200">
                    <strong>Timeline:</strong> 2–6 months<br/>
                    <strong>Cost:</strong> KES 20,000–100,000<br/>
                    <strong>Best for:</strong> Complex disputes, settlement-minded parties
                  </div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-red-50 p-5 rounded-lg border-2 border-orange-300">
                  <h4 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" /> Arbitration
                  </h4>
                  <p className="text-sm text-gray-700 mb-3">Private arbitrator hears case and makes binding decision.</p>
                  <div className="text-xs bg-white p-2 rounded border border-orange-200">
                    <strong>Timeline:</strong> 3–9 months<br/>
                    <strong>Cost:</strong> KES 50,000–300,000<br/>
                    <strong>Best for:</strong> Commercial disputes, confidentiality needed
                  </div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-red-50 p-5 rounded-lg border-2 border-orange-300">
                  <h4 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" /> Community Resolution
                  </h4>
                  <p className="text-sm text-gray-700 mb-3">Elders or community leaders facilitate settlement.</p>
                  <div className="text-xs bg-white p-2 rounded border border-orange-200">
                    <strong>Timeline:</strong> 2–4 weeks<br/>
                    <strong>Cost:</strong> Minimal (gifts/gratitude)<br/>
                    <strong>Best for:</strong> Rural areas, culturally sensitive disputes
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 7: Documents Required */}
          <section id="documents" className="scroll-mt-24">
            <div className="bg-white rounded-xl shadow-md border-l-4 border-orange-600 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <Briefcase className="w-8 h-8 text-orange-600" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Documents Required for Filing a Case</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-orange-50 border-b-2 border-orange-300">
                      <th className="px-4 py-3 text-left font-bold text-gray-900">Document</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-900">Requirement</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-900">Where to Get</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200 hover:bg-orange-50">
                      <td className="px-4 py-3 font-semibold">Original Title Deed</td>
                      <td className="px-4 py-3">MANDATORY</td>
                      <td className="px-4 py-3">Your property file (original)</td>
                    </tr>
                    <tr className="border-b border-gray-200 hover:bg-orange-50">
                      <td className="px-4 py-3 font-semibold">Lands Registry Search</td>
                      <td className="px-4 py-3">MANDATORY</td>
                      <td className="px-4 py-3">Lands Registry (physical or online)</td>
                    </tr>
                    <tr className="border-b border-gray-200 hover:bg-orange-50">
                      <td className="px-4 py-3 font-semibold">Survey Plan</td>
                      <td className="px-4 py-3">MANDATORY (if boundary dispute)</td>
                      <td className="px-4 py-3">Licensed surveyor</td>
                    </tr>
                    <tr className="border-b border-gray-200 hover:bg-orange-50">
                      <td className="px-4 py-3 font-semibold">Photographs of Property</td>
                      <td className="px-4 py-3">RECOMMENDED</td>
                      <td className="px-4 py-3">Your collection (dated photos)</td>
                    </tr>
                    <tr className="border-b border-gray-200 hover:bg-orange-50">
                      <td className="px-4 py-3 font-semibold">Witness Statements</td>
                      <td className="px-4 py-3">RECOMMENDED</td>
                      <td className="px-4 py-3">Neighbors, long-time residents</td>
                    </tr>
                    <tr className="border-b border-gray-200 hover:bg-orange-50">
                      <td className="px-4 py-3 font-semibold">Correspondence/Letters</td>
                      <td className="px-4 py-3">RECOMMENDED</td>
                      <td className="px-4 py-3">Email, SMS, letters to/from other party</td>
                    </tr>
                    <tr className="border-b border-gray-200 hover:bg-orange-50">
                      <td className="px-4 py-3 font-semibold">Payment Receipts</td>
                      <td className="px-4 py-3">RECOMMENDED</td>
                      <td className="px-4 py-3">Rate/tax receipts, utility bills</td>
                    </tr>
                    <tr className="hover:bg-orange-50">
                      <td className="px-4 py-3 font-semibold">Land Rates Certificate</td>
                      <td className="px-4 py-3">RECOMMENDED</td>
                      <td className="px-4 py-3">County government valuation office</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-600 rounded">
                <p className="text-sm text-gray-700"><strong>⚠️ Critical:</strong> Always bring ORIGINAL documents to court. Photocopies alone are often insufficient. If originals are lost, get certified copies from issuing authorities.</p>
              </div>
            </div>
          </section>

          {/* Section 8: Costs and Timelines */}
          <section id="costs" className="scroll-mt-24">
            <div className="bg-white rounded-xl shadow-md border-l-4 border-orange-600 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="w-8 h-8 text-orange-600" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Legal Costs & Timelines</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-bold text-gray-900 mb-4 text-lg">Typical Costs</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm pb-2 border-b border-gray-200">
                      <span className="text-gray-700">Court Filing Fees</span>
                      <span className="font-bold text-orange-600">KES 1,000–5,000</span>
                    </div>
                    <div className="flex justify-between text-sm pb-2 border-b border-gray-200">
                      <span className="text-gray-700">Advocate Representation</span>
                      <span className="font-bold text-orange-600">KES 50,000–500,000+</span>
                    </div>
                    <div className="flex justify-between text-sm pb-2 border-b border-gray-200">
                      <span className="text-gray-700">Lands Registry Search</span>
                      <span className="font-bold text-orange-600">KES 500–1,500</span>
                    </div>
                    <div className="flex justify-between text-sm pb-2 border-b border-gray-200">
                      <span className="text-gray-700">Surveyor (if needed)</span>
                      <span className="font-bold text-orange-600">KES 15,000–50,000</span>
                    </div>
                    <div className="flex justify-between text-sm pb-2 border-b border-gray-200">
                      <span className="text-gray-700">Expert Witness Fees</span>
                      <span className="font-bold text-orange-600">KES 20,000–100,000</span>
                    </div>
                    <div className="flex justify-between text-sm pb-2 border-b border-gray-200">
                      <span className="text-gray-700">Service/Delivery of Documents</span>
                      <span className="font-bold text-orange-600">KES 5,000–15,000</span>
                    </div>
                    <div className="flex justify-between text-sm bg-orange-50 p-2 rounded font-bold">
                      <span>TOTAL ESTIMATE</span>
                      <span className="text-orange-600">KES 100,000–2,000,000+</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-4 text-lg">Timeline Estimates</h4>
                  <div className="space-y-3">
                    <div className="bg-orange-50 p-3 rounded border-l-4 border-orange-600">
                      <p className="text-sm font-bold text-orange-900">Simple boundary dispute:</p>
                      <p className="text-sm text-gray-700">12–18 months</p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded border-l-4 border-orange-600">
                      <p className="text-sm font-bold text-orange-900">Moderate ownership dispute:</p>
                      <p className="text-sm text-gray-700">18–24 months</p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded border-l-4 border-orange-600">
                      <p className="text-sm font-bold text-orange-900">Complex cases (multiple issues):</p>
                      <p className="text-sm text-gray-700">2–3+ years</p>
                    </div>
                    <div className="bg-red-50 p-3 rounded border-l-4 border-red-600">
                      <p className="text-sm font-bold text-red-900">With court backlog/delays:</p>
                      <p className="text-sm text-gray-700">3–5+ years</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded border-l-4 border-green-600">
                      <p className="text-sm font-bold text-green-900">ADR/Mediation (fastest):</p>
                      <p className="text-sm text-gray-700">3–6 months</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
                <p className="text-sm text-gray-700"><strong>💡 Pro Tip:</strong> Negotiate a settlement early. The longer the case, the higher the costs. Many land disputes are resolved through mediation within 6 months at a fraction of court costs.</p>
              </div>
            </div>
          </section>

          {/* Section 9: Land Grabbing */}
          <section id="landgrab" className="scroll-mt-24">
            <div className="bg-white rounded-xl shadow-md border-l-4 border-red-600 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What to Do If Someone Grabs or Invades Your Land</h2>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-300 mb-6">
                <p className="text-sm font-bold text-red-900">Land grabbing is a CRIMINAL OFFENSE under the Land Act with penalties of up to KES 5 million and/or 10 years imprisonment.</p>
              </div>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Document Everything</h4>
                    <p className="text-sm text-gray-700">Take dated photographs/videos of the invasion. Record dates, times, and persons involved. Collect witness statements from neighbors. Keep all correspondence.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Report to Police</h4>
                    <p className="text-sm text-gray-700">File a police report (obtain a General Occurrence Book entry—OB number). Contact local police station or DCI. Keep the OB number for your records.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Hire an Advocate</h4>
                    <p className="text-sm text-gray-700">Immediately engage a qualified advocate. File for an urgent INJUNCTION to stop the invasion (before filing a full case). Injunctions are fast-tracked.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">File for Interim/Conservatory Orders</h4>
                    <p className="text-sm text-gray-700">Request the court to STOP the invasion immediately (Temporary Restraining Order). This prevents further occupation while the case proceeds. Success depends on evidence strength.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                    5
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">File Main Case for Recovery of Possession</h4>
                    <p className="text-sm text-gray-700">Pursue both civil case (recovery of land) AND criminal prosecution. Civil case faster (12–24 months). Criminal prosecution may take longer but carries harsher penalties.</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-600 rounded">
                <p className="text-sm text-gray-700"><strong>⚠️ Warning:</strong> Do NOT use force or violence to remove invaders. This may expose you to criminal charges. Use legal remedies only—court orders, police assistance, and injunctions.</p>
              </div>
            </div>
          </section>

          {/* Section 10: Adverse Possession */}
          <section id="adverse" className="scroll-mt-24">
            <div className="bg-white rounded-xl shadow-md border-l-4 border-orange-600 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-8 h-8 text-orange-600" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Adverse Possession (Squatters' Rights) Explained</h2>
              </div>
              <p className="text-gray-700 mb-4">
                Adverse possession is a legal doctrine allowing someone to claim ownership of land through continuous unauthorized occupation. In Kenya, this applies ONLY to unregistered land and requires proof of 12 years of continuous, exclusive occupation.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-600">
                  <h4 className="font-bold text-orange-900 mb-3">Requirements for Adverse Possession to Succeed</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>✓ Occupation must be OPEN (visible to everyone)</li>
                    <li>✓ Occupation must be CONTINUOUS (no breaks in 12+ years)</li>
                    <li>✓ Occupation must be EXCLUSIVE (no sharing with owner)</li>
                    <li>✓ Occupation must be WITHOUT PERMISSION (unauthorized)</li>
                    <li>✓ Must claim TITLE (intend to own, not just rent/borrow)</li>
                    <li>✓ Property must be UNREGISTERED land</li>
                  </ul>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-600">
                  <h4 className="font-bold text-red-900 mb-3">When Adverse Possession FAILS</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>✗ Land is REGISTERED (title deed issued)</li>
                    <li>✗ Occupation is NOT continuous (gaps exist)</li>
                    <li>✗ Owner gave PERMISSION (written or verbal)</li>
                    <li>✗ Less than 12 years of occupation</li>
                    <li>✗ Squatter cannot prove exclusive use</li>
                    <li>✗ Owner regularly challenged the occupation</li>
                  </ul>
                </div>
              </div>
              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-600 rounded">
                <p className="text-sm text-gray-700"><strong>⚠️ Important:</strong> Registered land CANNOT be acquired through adverse possession. Kenya's Constitution and Land Act protect registered titles absolutely. Adverse possession is a weak defense in modern Kenya. Proper documentation is your best protection.</p>
              </div>
            </div>
          </section>

          {/* Section 11: Professional Roles */}
          <section id="roles" className="scroll-mt-24">
            <div className="bg-white rounded-xl shadow-md border-l-4 border-orange-600 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <Gavel className="w-8 h-8 text-orange-600" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Role of Advocates, Surveyors & Land Officers</h2>
              </div>
              <div className="space-y-4">
                <div className="border-l-4 border-orange-400 pl-4 py-3">
                  <h4 className="font-bold text-gray-900">Advocates (Lawyers)</h4>
                  <p className="text-sm text-gray-700 mb-2">Represent clients in court, draft legal documents, advise on strategy, cross-examine witnesses, negotiate settlements.</p>
                  <p className="text-xs text-orange-700 font-semibold">Cost: KES 50,000–500,000+ depending on case complexity</p>
                </div>
                <div className="border-l-4 border-orange-400 pl-4 py-3">
                  <h4 className="font-bold text-gray-900">Surveyors (Licensed Land Surveyors)</h4>
                  <p className="text-sm text-gray-700 mb-2">Verify land boundaries, prepare survey plans, identify encroachments, provide expert testimony on property dimensions.</p>
                  <p className="text-xs text-orange-700 font-semibold">Cost: KES 15,000–50,000 per survey</p>
                </div>
                <div className="border-l-4 border-orange-400 pl-4 py-3">
                  <h4 className="font-bold text-gray-900">Land Officers / Registry Staff</h4>
                  <p className="text-sm text-gray-700 mb-2">Search land registry records, issue search certificates, verify ownership, check encumbrances (mortgages, easements, leases).</p>
                  <p className="text-xs text-orange-700 font-semibold">Cost: KES 500–1,500 per search</p>
                </div>
                <div className="border-l-4 border-orange-400 pl-4 py-3">
                  <h4 className="font-bold text-gray-900">Mediators</h4>
                  <p className="text-sm text-gray-700 mb-2">Facilitate negotiation between parties, help reach settlement, maintain confidentiality. NOT judges—do not make binding decisions.</p>
                  <p className="text-xs text-orange-700 font-semibold">Cost: KES 20,000–100,000 for mediation process</p>
                </div>
                <div className="border-l-4 border-orange-400 pl-4 py-3">
                  <h4 className="font-bold text-gray-900">Judges (Environment and Land Court)</h4>
                  <p className="text-sm text-gray-700 mb-2">Hear cases, review evidence, apply law, issue binding judgments. Impartial third party. Free (part of court system).</p>
                  <p className="text-xs text-orange-700 font-semibold">Cost: FREE (covered by court fees)</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 12: FAQs */}
          <section id="faqs" className="scroll-mt-24">
            <div className="bg-white rounded-xl shadow-md border-l-4 border-orange-600 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <Briefcase className="w-8 h-8 text-orange-600" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
              </div>
              <div className="space-y-3">
                {faqsData.map((faq, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleFAQ(idx)}
                      className="w-full px-4 py-4 flex items-center justify-between bg-orange-50 hover:bg-orange-100 transition"
                    >
                      <span className="text-left font-semibold text-gray-900">{faq.question}</span>
                      {expandedFAQ === idx ? (
                        <ChevronUp className="w-5 h-5 text-orange-600 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-orange-600 flex-shrink-0" />
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
          <section className="mt-12 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">Need Legal Help with Your Land Dispute?</h3>
            <p className="mb-6 text-orange-50">
              Land disputes are complex and require expert legal guidance. Contact us for a FREE consultation with a qualified advocate specializing in land law.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://wa.me/254112810203?text=I%20need%20legal%20help%20with%20a%20land%20dispute%20in%20Kenya"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition inline-flex items-center gap-2 justify-center"
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
                to="/land-ownership-title-deed-verification-kenya"
                className="p-4 border border-orange-300 rounded-lg hover:bg-orange-50 transition group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-5 h-5 text-orange-600 group-hover:scale-110 transition" />
                  <h4 className="font-semibold text-gray-900 group-hover:text-orange-600">Land Ownership & Title Deed Verification</h4>
                </div>
                <p className="text-sm text-gray-600">Learn how to verify land ownership and identify fake title deeds.</p>
              </Link>
              <Link
                to="/land-transfer-process-kenya"
                className="p-4 border border-orange-300 rounded-lg hover:bg-orange-50 transition group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <ArrowRight className="w-5 h-5 text-orange-600 group-hover:scale-110 transition" />
                  <h4 className="font-semibold text-gray-900 group-hover:text-orange-600">Land Transfer Process in Kenya</h4>
                </div>
                <p className="text-sm text-gray-600">Complete guide to buying and transferring land in Kenya.</p>
              </Link>
              <Link
                to="/how-to-buy-land-safely-kenya"
                className="p-4 border border-orange-300 rounded-lg hover:bg-orange-50 transition group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-orange-600 group-hover:scale-110 transition" />
                  <h4 className="font-semibold text-gray-900 group-hover:text-orange-600">How to Buy Land Safely in Kenya</h4>
                </div>
                <p className="text-sm text-gray-600">Due diligence checklist to avoid land fraud and disputes.</p>
              </Link>
              <Link
                to="/succession-inheritance-law-kenya"
                className="p-4 border border-orange-300 rounded-lg hover:bg-orange-50 transition group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-5 h-5 text-orange-600 group-hover:scale-110 transition" />
                  <h4 className="font-semibold text-gray-900 group-hover:text-orange-600">Succession & Inheritance Law</h4>
                </div>
                <p className="text-sm text-gray-600">Estate planning and property distribution after death.</p>
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
            <p className="text-sm mb-3">This is a comprehensive legal resource for resolving land disputes in Kenya through the Environment and Land Court.</p>
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
              📧 <a href="mailto:johnsonthuraniramwangi@gmail.com" className="text-orange-400 hover:underline">johnsonthuraniramwangi@gmail.com</a><br/>
              📱 WhatsApp: <a href="https://wa.me/254112810203" className="text-orange-400 hover:underline">+254112810203</a>
            </p>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-4 text-center text-xs">
          <p>&copy; 2026 Wakili Legal. All rights reserved. | <Link to="/privacy-policy" className="text-orange-400 hover:underline">Privacy Policy</Link> | <Link to="/terms" className="text-orange-400 hover:underline">Terms</Link></p>
        </div>
      </footer>
    </div>
  );
};

export default LandDisputesKenya;
