import React, { useState, useEffect } from 'react';
import { ChevronDown, CheckCircle, ArrowRight, FileText, Vote, Users, Scale, MessageSquare } from 'lucide-react';

// FAQ Data - Constant at file level to avoid React Hook dependency warnings
const faqsData = [
  {
    id: 1,
    question: 'What does IEBC stand for and what is its main purpose?',
    answer: 'IEBC stands for Independent Electoral and Boundaries Commission. It is a constitutional body established under the Constitution of Kenya 2010 to conduct, supervise, and oversee elections and referendums in Kenya. IEBC\'s main purpose is to ensure free, fair, transparent, and credible elections at all levels (presidential, parliamentary, county, and local) and to manage voter registration.'
  },
  {
    id: 2,
    question: 'Is IEBC independent from the Kenyan government?',
    answer: 'Yes, IEBC is constitutionally independent from the government and operates as an autonomous public institution. It reports to Parliament and operates under the Constitution of Kenya 2010 and the IEBC Act. This independence ensures impartiality in conducting elections without political interference from any government or political party.'
  },
  {
    id: 3,
    question: 'What are the core responsibilities of IEBC?',
    answer: 'IEBC\'s core responsibilities include: (1) Conducting presidential, parliamentary, and county elections, (2) Managing voter registration throughout Kenya, (3) Voter education on election procedures, (4) Political party regulation and compliance, (5) Boundary delimitation (dividing electoral regions), (6) Election dispute resolution, (7) Results management and declaration, (8) Election observer accreditation, (9) Election security planning, (10) Post-election reporting and analysis.'
  },
  {
    id: 4,
    question: 'How many Commissioners does IEBC have and what are their roles?',
    answer: 'IEBC has a Board of seven Commissioners appointed by the President with Parliamentary approval. Commissioners are: one Chairperson, one Vice-Chairperson, and five other Commissioners. The Chairperson leads IEBC and represents the institution. All Commissioners are accountable to Parliament and operate collectively in decision-making. Commissioners serve six-year terms.'
  },
  {
    id: 5,
    question: 'What does IEBC do about voter registration in Kenya?',
    answer: 'IEBC conducts continuous voter registration to ensure all eligible Kenyan citizens (18+ years old) can register as voters. IEBC manages: voter registration drives nationwide, maintenance of the voter register, issuance of voter cards, updating voter information, and ensuring register accuracy. Citizens can register at IEBC centers, during mobile registration drives, or through online pre-registration on the IEBC website.'
  },
  {
    id: 6,
    question: 'How does IEBC ensure elections are free and fair?',
    answer: 'IEBC ensures free and fair elections through: (1) Transparent voter registration with public verification, (2) Training poll workers on election procedures, (3) Deploying election observers (domestic and international) to monitor voting, (4) Using technology (electronic voting systems) to reduce manual errors, (5) Securing ballot boxes and preventing ballot stuffing, (6) Publishing provisional results for verification, (7) Allowing dispute resolution through courts, (8) Publishing final results after verification, (9) Post-election audits and analysis.'
  },
  {
    id: 7,
    question: 'What is boundary delimitation and why does IEBC do it?',
    answer: 'Boundary delimitation is the process of dividing Kenya into electoral regions (constituencies, wards, and senatorial districts). IEBC conducts delimitation to: ensure equal representation (equal population per constituency), account for population changes shown in census data, improve electoral efficiency, and ensure fair distribution of political power. Delimitation happens every 10 years following national census or when population changes warrant adjustments.'
  },
  {
    id: 8,
    question: 'How does IEBC handle election disputes and complaints?',
    answer: 'IEBC established an Electoral Disputes and Complaints System (EDCS) to manage election-related disputes. Citizens can lodge complaints with IEBC about election irregularities, voter registration issues, or disputed results. IEBC investigates complaints and attempts resolution. Unresolved disputes can be escalated to the High Court. IEBC publishes dispute resolution guidelines and timelines to ensure transparent, fair, and timely resolution.'
  },
  {
    id: 9,
    question: 'Does IEBC regulate political parties in Kenya?',
    answer: 'Yes, IEBC regulates political parties to ensure compliance with election laws. IEBC\'s responsibilities include: receiving and verifying party nominations, ensuring parties meet registration requirements, monitoring political party finance reporting, verifying candidates nominated by parties, and ensuring fair participation of all registered parties. Political parties must work with IEBC to conduct primaries and nominate candidates for elections.'
  },
  {
    id: 10,
    question: 'What role does IEBC play in election security and result transmission?',
    answer: 'IEBC ensures election security by: collaborating with security agencies for polling station protection, training election staff on security protocols, securing ballot materials, implementing electronic result transmission (ERT) systems, and preventing result manipulation. Results are transmitted electronically from polling stations to constituency, county, and national tallying centers. This transparent process is monitored by observers and political party agents.'
  },
  {
    id: 11,
    question: 'Can I observe an election with IEBC or report election issues?',
    answer: 'Yes, IEBC accredits both domestic and international election observers to monitor elections. Citizens and organizations can apply for observer accreditation through IEBC. Additionally, IEBC has citizen feedback mechanisms: you can report election irregularities during voting, file complaints post-election through EDCS, access IEBC social media for queries, visit IEBC county offices, or call IEBC hotlines. IEBC publishes all contact details on its website.'
  },
  {
    id: 12,
    question: 'How do I contact IEBC if I have questions about voter registration or elections?',
    answer: 'You can contact IEBC through multiple channels: (1) Visit IEBC county offices during business hours, (2) Call IEBC hotlines (numbers available on the website), (3) Email IEBC through the official website contact form, (4) Use IEBC social media (Facebook, Twitter) for public queries, (5) Attend IEBC public forums or town halls, (6) Download IEBC mobile app for voter information, (7) Visit the official website (www.iebc.or.ke) for voter services and forms.'
  },
  {
    id: 13,
    question: 'What is the legal basis for IEBC\'s authority in Kenya?',
    answer: 'IEBC\'s legal authority comes from: (1) The Constitution of Kenya 2010 (Chapter Twelve establishes IEBC as a constitutional body), (2) The Independent Electoral and Boundaries Commission Act, 2011 (defines IEBC structure, functions, and powers), (3) The Elections Act, 2011 (governs election procedures), (4) The Political Parties Act, 2011 (governs party registration and compliance), (5) Other laws and regulations related to electoral processes in Kenya.'
  },
  {
    id: 14,
    question: 'Does IEBC conduct elections other than presidential and parliamentary?',
    answer: 'Yes, IEBC conducts elections for multiple levels: (1) Presidential elections (national leader), (2) Parliamentary elections (National Assembly - MPs), (3) Senatorial elections (Senate - Senators), (4) County gubernatorial elections (County governors), (5) County assembly elections (county legislators/MCAs), (6) Referendums on constitutional issues. IEBC also conducts by-elections when parliamentary or county seats become vacant.'
  },
  {
    id: 15,
    question: 'How can I verify information I hear about IEBC or elections?',
    answer: 'Verify election information through official IEBC channels: (1) Visit the official IEBC website (www.iebc.or.ke) for authoritative announcements, (2) Follow IEBC official social media accounts (verified accounts only), (3) Contact IEBC directly via official phone lines or emails, (4) Check announcements in official government media (Kenya Broadcasting Corporation), (5) Consult official IEBC press releases, (6) Attend IEBC press conferences, (7) Avoid unverified social media rumors - check facts with IEBC first.'
  }
];

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const UnderstandingIEBCKenya: React.FC = () => {
  const [activeSection, setActiveSection] = useState('what-is');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  // SEO Meta Tags Setup
  useEffect(() => {
    // Set page title
    document.title = 'Understanding IEBC in Kenya – Role, Functions & Authority';

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Learn about IEBC Kenya - role, functions, authority, structure, and how elections are conducted. Official guide for voters and citizens.');
    }

    // Update keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'IEBC Kenya, Independent Electoral and Boundaries Commission, IEBC roles, IEBC functions, electoral authority Kenya, voter registration');
    }

    // OpenGraph tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', 'Understanding IEBC in Kenya – Complete Authority Guide');

    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescription);
    }
    ogDescription.setAttribute('content', 'Official guide to IEBC Kenya - mandate, functions, electoral authority, voter registration, and how elections are conducted.');

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute('content', 'https://wakili.app/understanding-iebc-kenya');

    let ogImage = document.querySelector('meta[property="og:image"]');
    if (!ogImage) {
      ogImage = document.createElement('meta');
      ogImage.setAttribute('property', 'og:image');
      document.head.appendChild(ogImage);
    }
    ogImage.setAttribute('content', 'https://wakili.app/og-iebc.jpg');

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
    twitterTitle.setAttribute('content', 'Understanding IEBC in Kenya – Role, Functions & Authority');

    let twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (!twitterDescription) {
      twitterDescription = document.createElement('meta');
      twitterDescription.setAttribute('name', 'twitter:description');
      document.head.appendChild(twitterDescription);
    }
    twitterDescription.setAttribute('content', 'Learn about IEBC Kenya - electoral authority, roles, functions, voter registration, and how elections are conducted.');

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
    canonical.setAttribute('href', 'https://wakili.app/understanding-iebc-kenya');

    // JSON-LD Structured Data
    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': 'https://wakili.app/understanding-iebc-kenya',
          'url': 'https://wakili.app/understanding-iebc-kenya',
          'name': 'Understanding IEBC in Kenya – Role, Functions & Authority',
          'description': 'Complete guide to IEBC Kenya, its roles, functions, authority, and how elections are conducted.',
          'isPartOf': { '@id': 'https://wakili.app' },
          'inLanguage': 'en-KE'
        },
        {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://wakili.app' },
            { '@type': 'ListItem', 'position': 2, 'name': 'Understanding IEBC', 'item': 'https://wakili.app/understanding-iebc-kenya' }
          ]
        },
        {
          '@type': 'Organization',
          'name': 'Independent Electoral and Boundaries Commission (IEBC)',
          'alternateName': 'IEBC Kenya',
          'url': 'https://www.iebc.or.ke',
          'areaServed': { '@type': 'Country', 'name': 'Kenya' },
          'serviceType': 'Electoral Commission',
          'description': 'Constitutional body responsible for conducting elections and managing voter registration in Kenya'
        },
        {
          '@type': 'FAQPage',
          'mainEntity': faqsData.map((faq: FAQItem) => ({
            '@type': 'Question',
            'name': faq.question,
            'acceptedAnswer': { '@type': 'Answer', 'text': faq.answer }
          }))
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
          <a href="/" className="text-red-600 hover:text-red-800 whitespace-nowrap text-sm">Home</a>
          <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-gray-700 whitespace-nowrap text-sm">Understanding IEBC</span>
        </div>
      </div>

      {/* Hero Section with Gradient Background */}
      <div className="bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 text-white py-12 sm:py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 md:px-8">
          <div className="flex items-start gap-4">
            <Vote className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 mt-2" />
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 leading-tight">
                Understanding IEBC in Kenya
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-orange-50 mb-6 leading-relaxed">
                Complete guide to the Independent Electoral and Boundaries Commission: its roles, functions, legal authority, and how it conducts elections and manages voter registration in Kenya.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://wa.me/254112810203?text=I%20need%20information%20about%20IEBC%20and%20voter%20registration"
                  className="inline-flex items-center justify-center gap-2 bg-white text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-orange-50 transition text-sm sm:text-base"
                >
                  <MessageSquare className="w-4 h-4" />
                  Get Help via WhatsApp
                </a>
                <a
                  href="mailto:johnsonthuraniramwangi@gmail.com"
                  className="inline-flex items-center justify-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-700 transition text-sm sm:text-base"
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
                  { id: 'what-is', label: 'What is IEBC?' },
                  { id: 'legal-framework', label: 'Legal Framework' },
                  { id: 'roles', label: 'Roles & Responsibilities' },
                  { id: 'structure', label: 'Structure' },
                  { id: 'fair-elections', label: 'Fair Elections' },
                  { id: 'citizen-engagement', label: 'Citizen Engagement' },
                  { id: 'faqs', label: 'FAQs' },
                ].map(section => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`px-3 py-1 rounded-full text-xs sm:text-sm whitespace-nowrap transition border-b-2 ${
                      activeSection === section.id
                        ? 'border-b-2 border-red-600 text-red-600 bg-red-100'
                        : 'border-b-2 border-gray-300 text-gray-700 hover:text-red-600'
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
            <div className="sticky top-24 bg-gray-50 rounded-lg p-4 border-l-4 border-red-600">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">On This Page</h3>
              <nav className="space-y-2">
                {[
                  { id: 'what-is', label: 'What is IEBC?' },
                  { id: 'legal-framework', label: 'Legal Framework' },
                  { id: 'roles', label: 'Roles & Responsibilities' },
                  { id: 'structure', label: 'Structure' },
                  { id: 'fair-elections', label: 'Fair Elections' },
                  { id: 'citizen-engagement', label: 'Citizen Engagement' },
                  { id: 'faqs', label: 'FAQs' },
                ].map(section => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`block w-full text-left px-3 py-2 rounded text-sm transition ${
                      activeSection === section.id
                        ? 'bg-red-100 text-red-700 border-l-4 border-red-600'
                        : 'text-gray-700 hover:text-red-600 hover:bg-gray-100'
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
            {/* What is IEBC */}
            <section id="what-is" className="scroll-mt-20">
              <div className="flex items-start gap-3 mb-4">
                <Vote className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What is IEBC?</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                IEBC stands for Independent Electoral and Boundaries Commission. It is Kenya's constitutional body responsible for conducting elections, managing voter registration, and ensuring free, fair, and credible elections at all levels. Established by the Constitution of Kenya 2010, IEBC operates independently from the government to prevent political interference in elections.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                IEBC is a public institution accountable to Parliament and Kenyan citizens. It serves multiple electoral functions: presidential and parliamentary elections, county elections, voter education, political party regulation, and electoral boundary management. IEBC exists to protect Kenya's democratic processes and ensure every citizen's vote counts fairly.
              </p>
              <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
                <p className="text-sm text-gray-800"><strong>Key Point:</strong> IEBC is constitutionally independent and separate from any political party or government. This independence is critical to conducting fair, impartial elections in Kenya.</p>
              </div>
            </section>

            {/* Legal Framework */}
            <section id="legal-framework" className="scroll-mt-20">
              <div className="flex items-start gap-3 mb-4">
                <Scale className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Legal Framework Establishing IEBC</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                IEBC's authority and mandate are grounded in multiple legal instruments:
              </p>
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">Constitution of Kenya 2010</h3>
                  <p className="text-gray-700 text-sm">Chapter Twelve of the Constitution establishes IEBC as a constitutional body. It defines IEBC's independence, mandates it to conduct elections, and outlines appointment procedures for Commissioners. The Constitution guarantees IEBC's autonomy from political interference.</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">Independent Electoral and Boundaries Commission Act (IEBC Act), 2011</h3>
                  <p className="text-gray-700 text-sm">This legislation defines IEBC's structure, powers, functions, and operational framework. It details Commissioner qualifications, appointment procedures, organizational structure, and financial autonomy. The Act empowers IEBC to make regulations necessary for conducting elections.</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">Elections Act, 2011</h3>
                  <p className="text-gray-700 text-sm">Governs the conduct of elections in Kenya, including voter registration, voting procedures, ballot counting, result declaration, and dispute resolution. The Elections Act establishes IEBC as the implementing authority for election legislation.</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">Political Parties Act, 2011</h3>
                  <p className="text-gray-700 text-sm">Governs registration, regulation, and conduct of political parties in Kenya. IEBC supervises party compliance with registration requirements, candidate nomination processes, and party finance reporting. The Act ensures fair party participation in elections.</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">Other Supporting Legislation</h3>
                  <p className="text-gray-700 text-sm">Additional laws including the Boundary Delimitation Act (for boundary reviews), County Government Act (for county elections), and other statutes regulate specific aspects of electoral administration. All these laws collectively form Kenya's electoral framework.</p>
                </div>
              </div>
            </section>

            {/* Roles & Responsibilities */}
            <section id="roles" className="scroll-mt-20">
              <div className="flex items-start gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Core Roles & Responsibilities</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                IEBC carries multiple critical responsibilities in Kenya's electoral system:
              </p>
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">Conducting Elections</h3>
                  <p className="text-gray-700 text-sm">IEBC plans, organizes, conducts, and supervises all elections in Kenya: presidential elections (every 5 years), parliamentary elections (National Assembly and Senate), county gubernatorial elections (governors and county assemblies), and referendums on constitutional matters. IEBC manages the entire electoral process from campaign regulation to result declaration.</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">Voter Registration</h3>
                  <p className="text-gray-700 text-sm">IEBC manages continuous voter registration to ensure all eligible Kenyan citizens (18+ years, not mentally disabled, not convicted of certain crimes) can register as voters. IEBC maintains the national voter register, issues voter identification cards, conducts civic education on registration, and ensures register accuracy and security.</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">Boundary Delimitation</h3>
                  <p className="text-gray-700 text-sm">IEBC divides Kenya into constituencies, county wards, and senatorial districts. Following each national census (every 10 years), IEBC reviews boundaries to ensure equal representation, account for population changes, and maintain fair electoral districts. Boundary delimitation affects how votes translate into representation.</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">Voter Education</h3>
                  <p className="text-gray-700 text-sm">IEBC educates Kenyans on electoral rights, registration procedures, voting methods, election dates, and civic responsibility. Through media campaigns, community outreach, school programs, and digital platforms, IEBC ensures voters understand their rights and how to participate meaningfully in elections.</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">Political Party Regulation</h3>
                  <p className="text-gray-700 text-sm">IEBC registers political parties, verifies party compliance with legal requirements, monitors candidate nomination processes, and regulates party conduct during elections. IEBC ensures parties operate fairly, prevent fraud in party nominations, and maintain democratic competition among parties.</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">Result Management & Declaration</h3>
                  <p className="text-gray-700 text-sm">IEBC manages voting, ballot counting, result verification, and result declaration. IEBC uses technology to transmit results securely, maintains transparency through tallying centers where observers monitor proceedings, and publishes provisional and final results. IEBC ensures result accuracy before official declaration.</p>
                </div>
              </div>
            </section>

            {/* Structure of IEBC */}
            <section id="structure" className="scroll-mt-20">
              <div className="flex items-start gap-3 mb-4">
                <Users className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Structure of IEBC</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                IEBC is structured as follows:
              </p>
              <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-red-100">
                      <th className="border border-gray-300 p-3 text-left font-bold text-gray-900">Organizational Level</th>
                      <th className="border border-gray-300 p-3 text-left font-bold text-gray-900">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-3">Board of Commissioners</td>
                      <td className="border border-gray-300 p-3 text-gray-700">Seven Commissioners (Chairperson, Vice-Chairperson, five others) who set policy, make decisions, and ensure IEBC fulfills its mandate</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 p-3">Chief Executive Officer (CEO)</td>
                      <td className="border border-gray-300 p-3 text-gray-700">Appointed by Commissioners; manages daily operations, implements Board decisions, oversees Secretariat</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">Secretariat (Head Office)</td>
                      <td className="border border-gray-300 p-3 text-gray-700">Central administration office in Nairobi with departments for elections, voter services, finance, human resources, ICT, legal matters</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 p-3">County Offices</td>
                      <td className="border border-gray-300 p-3 text-gray-700">47 county-level offices coordinate voter registration, election activities, and public engagement at county level</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">Constituency Offices</td>
                      <td className="border border-gray-300 p-3 text-gray-700">Operational offices in constituencies supporting voter registration drives, polling station setup, election administration</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-gray-700 leading-relaxed">
                The Board of Commissioners is the highest decision-making body, accountable to Parliament. Commissioners serve six-year terms and can be reappointed once. The CEO manages operational staff including electoral officers, technical staff, and administrative personnel across national and county levels.
              </p>
            </section>

            {/* Fair Elections */}
            <section id="fair-elections" className="scroll-mt-20">
              <div className="flex items-start gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How IEBC Ensures Free & Fair Elections</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                IEBC implements multiple safeguards to ensure elections are transparent, credible, and free from fraud:
              </p>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm">1</div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Voter Register Verification</h3>
                    <p className="text-gray-700 text-sm">IEBC maintains a comprehensive, accurate voter register. Citizens can verify their registration online, at IEBC centers, or during community verification exercises. Public access prevents ghost voters and ensures only eligible citizens vote.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm">2</div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Election Observer Deployment</h3>
                    <p className="text-gray-700 text-sm">IEBC accredits domestic and international election observers to monitor voting and counting. Observers ensure voting procedures are followed, ballots are handled securely, and counting is transparent. Observer presence deters fraud and builds public confidence.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm">3</div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Technology & Electronic Result Transmission</h3>
                    <p className="text-gray-700 text-sm">IEBC uses electronic result transmission (ERT) systems to send results from polling stations to tallying centers in real-time. Technology reduces manual errors, prevents result alteration, and enables rapid public result verification. Electronic transmission is monitored by observers.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm">4</div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Poll Worker Training & Standards</h3>
                    <p className="text-gray-700 text-sm">IEBC trains election staff on procedures, security protocols, and fraud prevention. Trained poll workers follow standardized procedures, maintain ballot security, and implement IEBC's election integrity standards consistently across all polling stations.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm">5</div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Ballot Security & Preventing Stuffing</h3>
                    <p className="text-gray-700 text-sm">IEBC implements security measures: numbered ballots, ballot boxes sealed and secured, voter identification and verification, and ballot counting in public. Multiple people sign result forms to prevent falsification. Security personnel protect polls throughout voting and counting.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm">6</div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Public Result Tallying & Verification</h3>
                    <p className="text-gray-700 text-sm">IEBC publishes provisional results publicly for verification before final declaration. All political parties, observers, media, and citizens can verify results. This transparency allows detection of discrepancies before final results become official.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm">7</div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Dispute Resolution & Audits</h3>
                    <p className="text-gray-700 text-sm">IEBC handles election disputes through its Electoral Disputes and Complaints System (EDCS). Unresolved disputes can be escalated to courts. IEBC conducts post-election audits to identify weaknesses and improve future elections.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Citizen Engagement */}
            <section id="citizen-engagement" className="scroll-mt-20">
              <div className="flex items-start gap-3 mb-4">
                <Users className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How Citizens Can Engage With IEBC</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                IEBC welcomes citizen participation and feedback through multiple channels:
              </p>
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">Electoral Disputes & Complaints (EDCS)</h3>
                  <p className="text-gray-700 text-sm">Citizens can lodge complaints about election irregularities, voter registration issues, or disputed results through IEBC's Electoral Disputes and Complaints System. Complaints can be submitted to IEBC offices, online, or through designated channels. IEBC investigates and responds to complaints within specified timelines.</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">Election Observation</h3>
                  <p className="text-gray-700 text-sm">Qualified organizations and individuals can apply for accreditation as election observers. Observers attend polling stations, monitor voting/counting procedures, report irregularities, and submit observer reports to IEBC. This citizen participation enhances election credibility and transparency.</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">Public Consultations & Engagement</h3>
                  <p className="text-gray-700 text-sm">IEBC holds public forums, town halls, and consultations on electoral issues including boundary reviews, voter registration drives, and election procedures. Citizens attend these forums to ask questions, provide feedback, and participate in democratic governance of elections.</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">IEBC Communication Channels</h3>
                  <p className="text-gray-700 text-sm">Contact IEBC through: official website (www.iebc.or.ke), social media (Facebook, Twitter, Instagram), email, phone hotlines, SMS services, IEBC mobile app, or by visiting IEBC county/constituency offices. IEBC publishes contact information on its website and regularly updates citizens through media.</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">Feedback & Inquiries</h3>
                  <p className="text-gray-700 text-sm">Citizens can submit feedback, questions, or complaints about IEBC services through online forms, email, phone, or in-person at IEBC offices. IEBC aims to respond to inquiries promptly. Feedback helps IEBC improve services and understand citizen concerns.</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">Parliamentary Accountability</h3>
                  <p className="text-gray-700 text-sm">IEBC Commissioners answer to Parliament, which provides institutional oversight. Citizens can petition Members of Parliament about IEBC issues. Parliament can summon IEBC Commissioners to provide reports, and Parliament approves IEBC's annual budget.</p>
                </div>
              </div>
            </section>

            {/* FAQs */}
            <section id="faqs" className="scroll-mt-20">
              <div className="flex items-start gap-3 mb-4">
                <FileText className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
              </div>
              <div className="space-y-3 mt-6">
                {faqsData.map((faq: FAQItem) => (
                  <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full px-4 py-4 flex items-center justify-between hover:bg-red-50 transition bg-white"
                    >
                      <span className="text-left font-semibold text-gray-900 text-sm sm:text-base">{faq.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-red-600 flex-shrink-0 transition-transform ${
                          openFAQ === faq.id ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openFAQ === faq.id && (
                      <div className="px-4 py-3 bg-red-50 border-t border-gray-200">
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
                <FileText className="w-5 h-5 text-red-600" />
                Related Resources
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="/how-to-register-as-a-voter-kenya"
                  className="flex items-center gap-2 text-red-600 hover:text-red-800 text-sm font-semibold group"
                >
                  How to Register as a Voter
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </a>
                <a
                  href="/how-to-check-voter-status-kenya"
                  className="flex items-center gap-2 text-red-600 hover:text-red-800 text-sm font-semibold group"
                >
                  How to Check Voter Status
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </a>
                <a
                  href="/elections-in-kenya"
                  className="flex items-center gap-2 text-red-600 hover:text-red-800 text-sm font-semibold group"
                >
                  Elections in Kenya
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </a>
                <a
                  href="/presidential-parliamentary-county-elections-kenya"
                  className="flex items-center gap-2 text-red-600 hover:text-red-800 text-sm font-semibold group"
                >
                  Types of Elections
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </a>
                <a
                  href="/election-results-declaration-kenya"
                  className="flex items-center gap-2 text-red-600 hover:text-red-800 text-sm font-semibold group"
                >
                  Election Results Declaration
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </a>
                <a
                  href="/political-parties-registration-kenya"
                  className="flex items-center gap-2 text-red-600 hover:text-red-800 text-sm font-semibold group"
                >
                  Political Parties Registration
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </a>
              </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold mb-3">Need Help with IEBC or Voter Registration?</h3>
              <p className="text-orange-100 mb-6 text-sm sm:text-base">
                Get professional guidance on voter registration, election procedures, or IEBC services. Connect with us for expert advice.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="https://wa.me/254112810203?text=I%20need%20help%20with%20voter%20registration"
                  className="inline-flex items-center justify-center gap-2 bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition"
                >
                  <MessageSquare className="w-5 h-5" />
                  WhatsApp: +254 112 810 203
                </a>
                <a
                  href="mailto:johnsonthuraniramwangi@gmail.com"
                  className="inline-flex items-center justify-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition"
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
              <p className="text-sm">Comprehensive guide to IEBC Kenya - the Independent Electoral and Boundaries Commission. Learn about electoral authority, roles, functions, and how elections are conducted.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3">Quick Links</h4>
              <ul className="text-sm space-y-2">
                <li><a href="/how-to-register-as-a-voter-kenya" className="hover:text-white transition">Voter Registration</a></li>
                <li><a href="/elections-in-kenya" className="hover:text-white transition">Elections Info</a></li>
                <li><a href="/political-parties-registration-kenya" className="hover:text-white transition">Political Parties</a></li>
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
              <strong>Disclaimer:</strong> This guide is for informational purposes only. IEBC information is based on constitutional and legislative frameworks. For official IEBC information, visit www.iebc.or.ke. Laws and regulations may change; verify current information with official authorities.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UnderstandingIEBCKenya;