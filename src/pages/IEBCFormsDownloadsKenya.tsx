import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  ChevronUp,
  BarChart3,
  FileText,
  CheckCircle2,
  AlertCircle,
  Download,
  Users,
  Building2,
  Scale
} from 'lucide-react';

const faqs = [
  {
    question: 'Where can I download official IEBC forms?',
    answer: 'The safest source is the official IEBC website or official IEBC portals. This guide links to verified document categories and explains how to identify correct forms.'
  },
  {
    question: 'Are IEBC forms free to download?',
    answer: 'Yes. Most IEBC forms and election documents are public resources and are free to download and use for official election processes.'
  },
  {
    question: 'What form is used for voter registration?',
    answer: 'Voter registration is governed by IEBC registration forms and procedures. The specific form depends on the registration exercise and IEBC guidance.'
  },
  {
    question: 'Which forms are used for candidate nomination?',
    answer: 'Nomination forms vary by elective position and party/independent status. This page lists common nomination forms and who should use them.'
  },
  {
    question: 'Are results forms the same across elections?',
    answer: 'No. Results forms differ by election type. For example, presidential results use Forms 34A, 34B, and 34C.'
  },
  {
    question: 'How do I know if a form is valid?',
    answer: 'Valid forms carry IEBC branding, form codes, and match the official IEBC templates for that election cycle. Always verify from IEBC sources.'
  },
  {
    question: 'Do I need a lawyer to submit IEBC forms?',
    answer: 'Not always. Many forms can be submitted by individuals or parties directly. Legal support is recommended for disputes or complex filings.'
  },
  {
    question: 'Can I submit forms online?',
    answer: 'Some forms can be submitted electronically where IEBC provides portals. Others require physical submission to IEBC offices.'
  },
  {
    question: 'What is the deadline for nomination forms?',
    answer: 'Deadlines are set by IEBC for each election. Always check the official IEBC calendar for nomination timelines.'
  },
  {
    question: 'What is the purpose of the Code of Conduct forms?',
    answer: 'They ensure candidates, agents, and parties commit to lawful and peaceful conduct during elections.'
  },
  {
    question: 'Where do I report issues with a form?',
    answer: 'You can contact IEBC or seek legal guidance if a form issue affects eligibility or compliance.'
  },
  {
    question: 'Are forms different for independent candidates?',
    answer: 'Yes. Independent candidates have additional compliance forms, including supporter lists and statutory declarations.'
  },
  {
    question: 'What if I use the wrong form?',
    answer: 'Using incorrect forms can lead to rejection or delays. Always confirm the form code and election category before submitting.'
  },
  {
    question: 'Do observers need accreditation forms?',
    answer: 'Yes. Observers and agents must be accredited through IEBC-approved forms and procedures.'
  },
  {
    question: 'Where can I get help filling out forms?',
    answer: 'IEBC offices provide guidance, and legal professionals can assist for complex submissions or disputes.'
  }
];

const IEBCFormsDownloadsKenya: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<string>('overview');

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  useEffect(() => {
    const metaTitle = 'IEBC Forms & Downloads – Kenya Election Resources';
    const metaDescription = 'Official hub for IEBC forms and election documents in Kenya. Find voter registration, nomination, results, and dispute forms.';
    const canonicalUrl = 'https://wakili.co.ke/iebc-forms-downloads-kenya';

    document.title = metaTitle;

    const setMetaTag = (attr: 'name' | 'property', key: string, content: string) => {
      let element = document.querySelector(`meta[${attr}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    setMetaTag('name', 'description', metaDescription);
    setMetaTag('name', 'robots', 'index, follow');
    setMetaTag('property', 'og:title', metaTitle);
    setMetaTag('property', 'og:description', metaDescription);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', 'article');
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', metaTitle);
    setMetaTag('name', 'twitter:description', metaDescription);

    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://wakili.co.ke"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "IEBC Forms & Downloads",
              "item": "https://wakili.co.ke/iebc-forms-downloads-kenya"
            }
          ]
        },
        {
          "@type": "FAQPage",
          "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        },
        {
          "@type": "GovernmentService",
          "name": "IEBC Election Forms & Documents",
          "areaServed": "Kenya",
          "serviceType": "Election forms and official documents",
          "url": "https://wakili.co.ke/iebc-forms-downloads-kenya"
        },
        {
          "@type": "Dataset",
          "name": "IEBC Election Forms Library",
          "description": "Official election-related forms including voter registration, nomination, agent, observer, and results forms.",
          "url": "https://wakili.co.ke/iebc-forms-downloads-kenya",
          "license": "https://wakili.co.ke"
        }
      ]
    };

    const scriptTag = document.createElement('script');
    scriptTag.setAttribute('type', 'application/ld+json');
    scriptTag.textContent = JSON.stringify(structuredData);
    document.head.appendChild(scriptTag);

    window.scrollTo(0, 0);

    return () => {
      if (scriptTag && scriptTag.parentNode) {
        scriptTag.parentNode.removeChild(scriptTag);
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'overview',
        'voter-forms',
        'nomination-forms',
        'party-forms',
        'agent-forms',
        'complaint-forms',
        'results-forms',
        'how-to-fill',
        'faqs'
      ];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex text-sm text-gray-600">
              <Link to="/" className="hover:text-blue-600">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">IEBC Forms & Downloads</span>
            </nav>
          </div>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">IEBC Forms, Downloads & Official Documents – Kenya Election Resources</h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-3xl">Central hub for official IEBC election forms, voter registration documents, nomination templates, and election reporting resources.</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="content-full-width">
        <div className="max-w-7xl mx-auto px-0 sm:px-4 md:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar TOC */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="lg:sticky lg:top-20">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    Quick Navigation
                  </h3>
                  <nav className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 lg:block lg:space-y-2 lg:gap-0 lg:overflow-visible lg:pb-0 lg:mx-0 lg:px-0">
                    {[
                      { id: 'overview', label: 'Overview', icon: BarChart3 },
                      { id: 'voter-forms', label: 'Voter Forms', icon: Users },
                      { id: 'nomination-forms', label: 'Nomination Forms', icon: FileText },
                      { id: 'party-forms', label: 'Party Compliance', icon: Building2 },
                      { id: 'agent-forms', label: 'Agents & Observers', icon: Users },
                      { id: 'complaint-forms', label: 'Complaints', icon: AlertCircle },
                      { id: 'results-forms', label: 'Results Forms', icon: FileText },
                      { id: 'how-to-fill', label: 'How to Fill', icon: CheckCircle2 },
                      { id: 'faqs', label: 'FAQs', icon: BarChart3 }
                    ].map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => scrollToSection(id)}
                        className={`flex-shrink-0 lg:w-full text-left px-3 py-2 rounded transition flex items-center gap-2 whitespace-nowrap ${
                          activeSection === id
                            ? 'bg-blue-100 text-blue-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{label}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              {/* Overview */}
              <section id="overview" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <BarChart3 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Overview of IEBC Forms & Documents</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-4 text-lg leading-relaxed">IEBC forms are official documents that govern voter registration, candidate nominations, political party compliance, observer accreditation, election results, and disputes. This page consolidates key documents and explains their use for citizens, candidates, and parties.</p>
                  <p className="text-gray-700 mb-6">For related resources, see <a href="/understanding-iebc-kenya" className="text-blue-600 hover:text-blue-700 font-medium">Understanding IEBC</a>, <a href="/how-to-register-as-a-voter-kenya" className="text-blue-600 hover:text-blue-700 font-medium">Voter Registration</a>, <a href="/how-to-check-voter-status-kenya" className="text-blue-600 hover:text-blue-700 font-medium">Voter Status</a>, and <a href="/elections-in-kenya" className="text-blue-600 hover:text-blue-700 font-medium">Elections in Kenya</a>.</p>

                  <div className="bg-white border-2 border-blue-200 p-6 rounded-xl shadow-sm mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Scale className="w-5 h-5 text-blue-600" />
                      Legal framework governing IEBC forms
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                      <div className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Constitution of Kenya 2010:</strong> Articles 38, 81, 83, 86 and 88 (political rights, electoral principles, voter registration, counting, IEBC mandate)</span></div>
                      <div className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>IEBC Act 2011:</strong> Establishes IEBC, powers to issue official election forms and procedures</span></div>
                      <div className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Elections Act 2011:</strong> Nomination, polling, tallying, results and documentation requirements</span></div>
                      <div className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Elections (General) Regulations 2012:</strong> Standard forms, polling procedures, and results templates</span></div>
                      <div className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Elections (Registration of Voters) Regulations:</strong> Voter registration and verification forms</span></div>
                      <div className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Political Parties Act 2011:</strong> Party compliance, nomination, and agent accreditation</span></div>
                      <div className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Election Offences Act 2016:</strong> Criminalizes fraudulent forms and false declarations</span></div>
                      <div className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span><strong>Data Protection Act 2019:</strong> Protects personal data collected on forms</span></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                      <div className="text-3xl font-bold text-blue-700 mb-2">Forms</div>
                      <div className="text-gray-900 font-semibold mb-1">Official Templates</div>
                      <div className="text-sm text-gray-600">Standardized for compliance and accuracy</div>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                      <div className="text-3xl font-bold text-indigo-700 mb-2">Downloads</div>
                      <div className="text-gray-900 font-semibold mb-1">Ready to Use</div>
                      <div className="text-sm text-gray-600">Clear instructions and guidance</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                      <div className="text-3xl font-bold text-purple-700 mb-2">Compliance</div>
                      <div className="text-gray-900 font-semibold mb-1">Legal Standards</div>
                      <div className="text-sm text-gray-600">Based on IEBC and election laws</div>
                    </div>
                  </div>

                  <div className="bg-white border-2 border-blue-200 p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">How to use this page</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span>Find the form category and read the purpose and usage notes</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span>Download the correct template and follow the instructions</span></li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><span>Submit to the correct IEBC office or portal within deadlines</span></li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Voter Registration Forms */}
              <section id="voter-forms" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Users className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Voter Registration Forms</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Voter registration documents are governed by the Constitution, the Elections Act, and the Registration of Voters Regulations. They ensure only eligible citizens register and that records are accurate.</p>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {[
                      {
                        title: 'Voter Registration Form (General)',
                        purpose: 'Register eligible citizens on the voter roll during IEBC registration periods.',
                        who: 'Kenyan citizens aged 18+ with valid identification.',
                        when: 'During voter registration windows announced by IEBC.',
                        file: 'PDF',
                        action: 'Download Form'
                      },
                      {
                        title: 'Voter Transfer Form',
                        purpose: 'Transfer voter details to a new polling station or county.',
                        who: 'Registered voters who have moved residence.',
                        when: 'During transfer periods before elections.',
                        file: 'PDF',
                        action: 'Download Form'
                      },
                      {
                        title: 'Correction of Details Form',
                        purpose: 'Update personal details such as name, ID number, or polling station errors.',
                        who: 'Registered voters needing corrections.',
                        when: 'Any time IEBC opens voter data verification periods.',
                        file: 'PDF',
                        action: 'Download Form'
                      },
                      {
                        title: 'Replacement of Lost Voter Card',
                        purpose: 'Apply for replacement of a lost or damaged voter card.',
                        who: 'Registered voters with lost or damaged cards.',
                        when: 'During replacement windows prior to election day.',
                        file: 'PDF',
                        action: 'Download Form'
                      }
                    ].map((form, index) => (
                      <div key={index} className="bg-white border-2 border-blue-200 p-6 rounded-xl shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-2">{form.title}</h3>
                        <p className="text-gray-700 text-sm mb-2"><strong>Purpose:</strong> {form.purpose}</p>
                        <p className="text-gray-700 text-sm mb-2"><strong>Who should use:</strong> {form.who}</p>
                        <p className="text-gray-700 text-sm mb-4"><strong>When to submit:</strong> {form.when}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-600">File: {form.file}</span>
                          <button className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
                            <Download className="w-4 h-4" />
                            {form.action}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Candidate Nomination Forms */}
              <section id="nomination-forms" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Candidate Nomination Forms</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Nomination forms are required under the Elections Act and Election (General) Regulations. They confirm eligibility, compliance with constitutional requirements, and lawful endorsement by parties or supporters.</p>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {[
                      {
                        title: 'Presidential Nomination Form',
                        purpose: 'Nominate a presidential candidate and running mate for the general election.',
                        who: 'Political parties or independent presidential candidates.',
                        when: 'During IEBC nomination periods.',
                        file: 'PDF'
                      },
                      {
                        title: 'Parliamentary Nomination Form',
                        purpose: 'Nominate candidates for MP and Senate positions.',
                        who: 'Political parties or independent candidates.',
                        when: 'During IEBC nomination periods.',
                        file: 'PDF'
                      },
                      {
                        title: 'County Nomination Form',
                        purpose: 'Nominate Governor, Deputy Governor, and MCA candidates.',
                        who: 'Political parties or independent candidates.',
                        when: 'During IEBC nomination periods.',
                        file: 'PDF'
                      },
                      {
                        title: 'Independent Candidate Supporter List',
                        purpose: 'List of registered voters supporting an independent candidate nomination.',
                        who: 'Independent candidates only.',
                        when: 'Attached during nomination submission.',
                        file: 'PDF'
                      }
                    ].map((form, index) => (
                      <div key={index} className="bg-white border-2 border-indigo-200 p-6 rounded-xl shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-2">{form.title}</h3>
                        <p className="text-gray-700 text-sm mb-2"><strong>Purpose:</strong> {form.purpose}</p>
                        <p className="text-gray-700 text-sm mb-2"><strong>Who should use:</strong> {form.who}</p>
                        <p className="text-gray-700 text-sm mb-4"><strong>When to submit:</strong> {form.when}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-600">File: {form.file}</span>
                          <button className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition">
                            <Download className="w-4 h-4" />
                            Download Form
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-gray-700">For party requirements, see <a href="/political-parties-registration-kenya" className="text-blue-600 hover:text-blue-700 font-medium">Political Parties Registration</a>.</p>
                </div>
              </section>

              {/* Political Party Compliance Forms */}
              <section id="party-forms" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Building2 className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Political Party Compliance Forms</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Political party compliance documents are anchored in the Political Parties Act and Elections Act. They ensure parties nominate candidates fairly, register agents properly, and comply with campaign finance and conduct standards.</p>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {[
                      {
                        title: 'Party Nomination Certificate',
                        purpose: 'Certifies official party nominees for IEBC submission.',
                        who: 'Political parties and nominated candidates.',
                        when: 'During nomination submission window.',
                        file: 'PDF'
                      },
                      {
                        title: 'Party Code of Conduct Commitment',
                        purpose: 'Confirms adherence to lawful conduct and peaceful campaigns.',
                        who: 'Political parties and candidates.',
                        when: 'Before campaign or nomination approval.',
                        file: 'PDF'
                      },
                      {
                        title: 'Party Agents Appointment Form',
                        purpose: 'Appoints official agents to represent the party at polling and tallying.',
                        who: 'Political parties.',
                        when: 'Before election day, as scheduled by IEBC.',
                        file: 'PDF'
                      },
                      {
                        title: 'Campaign Finance Disclosure',
                        purpose: 'Declaration of campaign funds and expenditure compliance.',
                        who: 'Political parties and candidates.',
                        when: 'As required by IEBC and finance regulations.',
                        file: 'PDF'
                      }
                    ].map((form, index) => (
                      <div key={index} className="bg-white border-2 border-purple-200 p-6 rounded-xl shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-2">{form.title}</h3>
                        <p className="text-gray-700 text-sm mb-2"><strong>Purpose:</strong> {form.purpose}</p>
                        <p className="text-gray-700 text-sm mb-2"><strong>Who should use:</strong> {form.who}</p>
                        <p className="text-gray-700 text-sm mb-4"><strong>When to submit:</strong> {form.when}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-600">File: {form.file}</span>
                          <button className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition">
                            <Download className="w-4 h-4" />
                            Download Form
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Agents & Observers */}
              <section id="agent-forms" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <Users className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Election Agent & Observer Forms</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Agent and observer accreditation is governed by IEBC regulations. These forms protect transparency by ensuring only authorized agents and observers access polling and tallying areas.</p>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {[
                      {
                        title: 'Observer Accreditation Form',
                        purpose: 'Accredits civil society and international observers to monitor elections.',
                        who: 'Observer organizations and missions.',
                        when: 'Before election period, as scheduled by IEBC.',
                        file: 'PDF'
                      },
                      {
                        title: 'Polling Station Agent Form',
                        purpose: 'Registers political party or candidate agents for polling station access.',
                        who: 'Parties and candidates.',
                        when: 'Prior to polling day or as directed by IEBC.',
                        file: 'PDF'
                      },
                      {
                        title: 'Tallying Center Agent Form',
                        purpose: 'Accredits agents to observe tallying and results aggregation.',
                        who: 'Parties and candidates.',
                        when: 'Before tallying begins.',
                        file: 'PDF'
                      },
                      {
                        title: 'Observer Code of Conduct',
                        purpose: 'Commitment to neutrality and non-interference.',
                        who: 'Accredited observers.',
                        when: 'Before accreditation approval.',
                        file: 'PDF'
                      }
                    ].map((form, index) => (
                      <div key={index} className="bg-white border-2 border-teal-200 p-6 rounded-xl shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-2">{form.title}</h3>
                        <p className="text-gray-700 text-sm mb-2"><strong>Purpose:</strong> {form.purpose}</p>
                        <p className="text-gray-700 text-sm mb-2"><strong>Who should use:</strong> {form.who}</p>
                        <p className="text-gray-700 text-sm mb-4"><strong>When to submit:</strong> {form.when}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-600">File: {form.file}</span>
                          <button className="inline-flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 transition">
                            <Download className="w-4 h-4" />
                            Download Form
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Complaints */}
              <section id="complaint-forms" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-rose-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Complaint & Dispute Forms</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Complaint and dispute forms support accountability under the Elections Act, Election Petition Rules, and IEBC dispute resolution mechanisms. They help preserve evidence for investigations or court proceedings.</p>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {[
                      {
                        title: 'Election Complaint Form',
                        purpose: 'Report irregularities at polling stations or tallying centers.',
                        who: 'Voters, agents, candidates, observers.',
                        when: 'Immediately or within timelines set by IEBC.',
                        file: 'PDF'
                      },
                      {
                        title: 'Results Dispute Notification',
                        purpose: 'Notify IEBC of discrepancies in results forms.',
                        who: 'Candidates and party agents.',
                        when: 'Within 24–48 hours of results posting.',
                        file: 'PDF'
                      },
                      {
                        title: 'Petition Filing Checklist',
                        purpose: 'Checklist of documents for election petition filing.',
                        who: 'Petitioners and legal counsel.',
                        when: 'Before filing in court.',
                        file: 'PDF'
                      },
                      {
                        title: 'Request for Scrutiny',
                        purpose: 'Application to court for scrutiny or recount.',
                        who: 'Petitioners in court proceedings.',
                        when: 'During petition hearing.',
                        file: 'PDF'
                      }
                    ].map((form, index) => (
                      <div key={index} className="bg-white border-2 border-rose-200 p-6 rounded-xl shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-2">{form.title}</h3>
                        <p className="text-gray-700 text-sm mb-2"><strong>Purpose:</strong> {form.purpose}</p>
                        <p className="text-gray-700 text-sm mb-2"><strong>Who should use:</strong> {form.who}</p>
                        <p className="text-gray-700 text-sm mb-4"><strong>When to submit:</strong> {form.when}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-600">File: {form.file}</span>
                          <button className="inline-flex items-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-rose-700 transition">
                            <Download className="w-4 h-4" />
                            Download Form
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-gray-700">For legal dispute guidance, see <a href="/election-petitions-disputes-kenya" className="text-blue-600 hover:text-blue-700 font-medium">Election Petitions & Disputes</a>.</p>
                </div>
              </section>

              {/* Results Forms */}
              <section id="results-forms" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Election Result & Reporting Forms</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Results forms are standardized under Article 86 of the Constitution and the Elections (General) Regulations. They provide verifiable records at each stage of counting and aggregation.</p>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {[
                      {
                        title: 'Form 34A – Presidential Results (Polling Station)',
                        purpose: 'Records presidential results at polling station level.',
                        who: 'Presiding officers and agents.',
                        when: 'Immediately after counting at polling station.',
                        file: 'PDF'
                      },
                      {
                        title: 'Form 34B – Presidential Results (Constituency)',
                        purpose: 'Aggregates presidential results at constituency level.',
                        who: 'Returning officers and agents.',
                        when: 'After receiving all Form 34A results.',
                        file: 'PDF'
                      },
                      {
                        title: 'Form 34C – Presidential Results (National)',
                        purpose: 'Final national presidential results declaration form.',
                        who: 'IEBC Chairperson.',
                        when: 'Upon final aggregation.',
                        file: 'PDF'
                      },
                      {
                        title: 'County Results Form',
                        purpose: 'Results reporting for gubernatorial and MCA elections.',
                        who: 'County returning officers.',
                        when: 'After county tallying.',
                        file: 'PDF'
                      }
                    ].map((form, index) => (
                      <div key={index} className="bg-white border-2 border-blue-200 p-6 rounded-xl shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-2">{form.title}</h3>
                        <p className="text-gray-700 text-sm mb-2"><strong>Purpose:</strong> {form.purpose}</p>
                        <p className="text-gray-700 text-sm mb-2"><strong>Who should use:</strong> {form.who}</p>
                        <p className="text-gray-700 text-sm mb-4"><strong>When to submit:</strong> {form.when}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-600">File: {form.file}</span>
                          <button className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
                            <Download className="w-4 h-4" />
                            Download Form
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* How to Fill */}
              <section id="how-to-fill" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How to Fill Out Common IEBC Forms</h2>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">Correct completion protects eligibility and prevents rejection. Incomplete or inaccurate forms may invalidate nominations, registrations, or complaints.</p>
                  <div className="space-y-4 mb-6">
                    {[
                      {
                        step: '1',
                        title: 'Identify the Correct Form',
                        desc: 'Confirm the form code, election category, and version from IEBC.'
                      },
                      {
                        step: '2',
                        title: 'Read Instructions',
                        desc: 'Check guidance notes and required supporting documents before filling.'
                      },
                      {
                        step: '3',
                        title: 'Provide Accurate Details',
                        desc: 'Use official ID details and double-check spellings and numbers.'
                      },
                      {
                        step: '4',
                        title: 'Attach Required Evidence',
                        desc: 'Attach ID copies, supporter lists, or declarations as required.'
                      },
                      {
                        step: '5',
                        title: 'Sign and Submit',
                        desc: 'Sign where required and submit within deadlines to IEBC or court.'
                      }
                    ].map((item) => (
                      <div key={item.step} className="bg-white border-l-4 border-green-600 p-5 rounded-lg shadow-sm">
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">{item.step}</div>
                          <div>
                            <p className="font-semibold text-gray-900 mb-1">{item.title}</p>
                            <p className="text-gray-700 text-sm">{item.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">Common mistakes to avoid</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex gap-2"><AlertCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /><span>Using outdated forms or incorrect versions</span></li>
                      <li className="flex gap-2"><AlertCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /><span>Missing signatures or incomplete sections</span></li>
                      <li className="flex gap-2"><AlertCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /><span>Submitting after deadlines</span></li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* FAQs */}
              <section id="faqs" className="mb-12 scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <BarChart3 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
                </div>

                <div className="space-y-3">
                  {faqs.map((faq, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full flex justify-between items-center p-5 text-left hover:bg-gray-50 transition"
                        aria-expanded={openFaqIndex === index}
                        aria-controls={`faq-${index}`}
                      >
                        <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                        {openFaqIndex === index ? (
                          <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        )}
                      </button>
                      {openFaqIndex === index && (
                        <div id={`faq-${index}`} className="px-5 pb-5">
                          <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* CTA */}
              <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-8 rounded-xl shadow-xl">
                <h3 className="text-2xl font-bold mb-4">Get Official IEBC Forms</h3>
                <p className="mb-6 text-blue-100">Download verified election documents and get guidance on compliance and submission.</p>
                <div className="flex flex-wrap gap-4">
                  <a href="https://www.iebc.or.ke" target="_blank" rel="noopener noreferrer" className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
                    Visit IEBC
                  </a>
                  <a href="/election-petitions-disputes-kenya" className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-400 transition">
                    Get Legal Help
                  </a>
                  <a href="#overview" className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition">
                    Download Forms
                  </a>
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default IEBCFormsDownloadsKenya;
